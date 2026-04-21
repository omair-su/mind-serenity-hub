// Shared web push (RFC 8291 / VAPID) sender for Deno edge functions.
// Encrypts payload with aes128gcm and signs JWT with VAPID ES256 keys.
import { createHash } from "https://deno.land/std@0.168.0/node/crypto.ts";

const enc = new TextEncoder();
const dec = new TextDecoder();

export interface PushSub {
  endpoint: string;
  p256dh: string; // base64url
  auth: string;   // base64url
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

function b64urlToBytes(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToB64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function concat(...arrs: Uint8Array[]): Uint8Array {
  const total = arrs.reduce((n, a) => n + a.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const a of arrs) { out.set(a, off); off += a.length; }
  return out;
}

async function hkdfExtract(salt: Uint8Array, ikm: Uint8Array): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", salt, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, ikm));
}

async function hkdfExpand(prk: Uint8Array, info: Uint8Array, length: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", prk, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const t1 = new Uint8Array(await crypto.subtle.sign("HMAC", key, concat(info, new Uint8Array([1]))));
  return t1.slice(0, length);
}

async function importVapidPrivateKey(privB64url: string, pubB64url: string): Promise<CryptoKey> {
  const d = bytesToB64url(b64urlToBytes(privB64url));
  const pub = b64urlToBytes(pubB64url); // 65 bytes uncompressed
  const x = bytesToB64url(pub.slice(1, 33));
  const y = bytesToB64url(pub.slice(33, 65));
  const jwk: JsonWebKey = { kty: "EC", crv: "P-256", d, x, y, ext: true };
  return await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
}

async function signVapidJwt(audience: string, subject: string, privB64url: string, pubB64url: string): Promise<string> {
  const header = bytesToB64url(enc.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const payload = bytesToB64url(enc.encode(JSON.stringify({
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
    sub: subject,
  })));
  const key = await importVapidPrivateKey(privB64url, pubB64url);
  const sig = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, enc.encode(`${header}.${payload}`)));
  return `${header}.${payload}.${bytesToB64url(sig)}`;
}

async function encryptPayload(plaintext: Uint8Array, p256dhB64: string, authB64: string): Promise<{ body: Uint8Array; salt: Uint8Array; localPubRaw: Uint8Array }> {
  const clientPub = b64urlToBytes(p256dhB64); // 65 bytes uncompressed
  const auth = b64urlToBytes(authB64);

  const localPair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const localPubJwk = await crypto.subtle.exportKey("jwk", localPair.publicKey);
  const localPubRaw = concat(new Uint8Array([0x04]), b64urlToBytes(localPubJwk.x!), b64urlToBytes(localPubJwk.y!));

  // Import client public key
  const clientPubKey = await crypto.subtle.importKey(
    "jwk",
    { kty: "EC", crv: "P-256", x: bytesToB64url(clientPub.slice(1, 33)), y: bytesToB64url(clientPub.slice(33, 65)), ext: true },
    { name: "ECDH", namedCurve: "P-256" },
    false,
    [],
  );

  const ecdhSecret = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: clientPubKey }, localPair.privateKey, 256));

  // PRK_key = HKDF(auth, ecdh, "WebPush: info\0" || ua_public || as_public, 32)
  const keyInfo = concat(enc.encode("WebPush: info\0"), clientPub, localPubRaw);
  const prkKey = await hkdfExtract(auth, ecdhSecret);
  const ikm = await hkdfExpand(prkKey, keyInfo, 32);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const prk = await hkdfExtract(salt, ikm);

  const cekInfo = enc.encode("Content-Encoding: aes128gcm\0");
  const cek = await hkdfExpand(prk, cekInfo, 16);
  const nonceInfo = enc.encode("Content-Encoding: nonce\0");
  const nonce = await hkdfExpand(prk, nonceInfo, 12);

  // Pad: data || 0x02 (single record, last)
  const padded = concat(plaintext, new Uint8Array([0x02]));

  const aesKey = await crypto.subtle.importKey("raw", cek, { name: "AES-GCM" }, false, ["encrypt"]);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, aesKey, padded));

  // Build aes128gcm header: salt(16) || rs(4 BE = 4096) || idlen(1) || keyid(idlen)
  const rs = new Uint8Array([0, 0, 0x10, 0]); // 4096
  const idLen = new Uint8Array([localPubRaw.length]);
  const header = concat(salt, rs, idLen, localPubRaw);
  const body = concat(header, ciphertext);
  return { body, salt, localPubRaw };
}

export async function sendWebPush(
  sub: PushSub,
  payload: PushPayload,
  vapid: { publicKey: string; privateKey: string; subject: string },
): Promise<{ ok: boolean; status: number; statusText: string }> {
  const url = new URL(sub.endpoint);
  const audience = `${url.protocol}//${url.host}`;
  const jwt = await signVapidJwt(audience, vapid.subject, vapid.privateKey, vapid.publicKey);

  const plaintext = enc.encode(JSON.stringify(payload));
  const { body } = await encryptPayload(plaintext, sub.p256dh, sub.auth);

  const res = await fetch(sub.endpoint, {
    method: "POST",
    headers: {
      "Content-Encoding": "aes128gcm",
      "Content-Type": "application/octet-stream",
      "TTL": "43200",
      "Authorization": `vapid t=${jwt}, k=${vapid.publicKey}`,
    },
    body,
  });
  return { ok: res.ok, status: res.status, statusText: res.statusText };
}
