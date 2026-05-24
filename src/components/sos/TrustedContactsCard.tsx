import { useEffect, useState } from "react";
import { Users, Plus, Trash2, Send, MapPin } from "lucide-react";
import { getContacts, saveContact, deleteContact, type TrustedContact } from "@/lib/sosStore";
import { toast } from "@/hooks/use-toast";

export default function TrustedContactsCard() {
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const [shareLocation, setShareLocation] = useState(false);

  useEffect(() => { setContacts(getContacts()); }, []);

  const add = () => {
    const trimmedName = name.trim().slice(0, 60);
    if (!trimmedName) return;
    const c: TrustedContact = {
      id: crypto.randomUUID(),
      name: trimmedName,
      phone: phone.trim().slice(0, 30) || undefined,
      relation: relation.trim().slice(0, 40) || undefined,
    };
    saveContact(c);
    setContacts(getContacts());
    setName(""); setPhone(""); setRelation(""); setAdding(false);
  };

  const remove = (id: string) => {
    deleteContact(id);
    setContacts(getContacts());
  };

  const sendSOS = async (c: TrustedContact) => {
    if (!c.phone) {
      toast({ title: "No phone number", description: "Add a phone number to send a quick SOS message.", variant: "destructive" });
      return;
    }
    let body = "Hi — I'm struggling right now and could use your support. No pressure to fix anything, just being here would help.";
    if (shareLocation && "geolocation" in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        );
        body += `\n\nMy location: https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
      } catch {
        // silently skip — don't block the SOS
      }
    }
    const sms = `sms:${encodeURIComponent(c.phone)}?body=${encodeURIComponent(body)}`;
    window.location.href = sms;
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[hsl(var(--forest))]/12">
            <Users className="w-4 h-4 text-[hsl(var(--forest))]" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-foreground">Trusted People</h3>
            <p className="text-xs font-body text-muted-foreground">Send a one-tap SOS when you need support</p>
          </div>
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)} className="p-2 rounded-full bg-[hsl(var(--forest))] text-cream hover:bg-[hsl(var(--forest-deep))] transition" aria-label="Add contact">
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {adding && (
        <div className="p-4 rounded-xl bg-secondary/20 border border-border space-y-2.5">
          <input value={name} maxLength={60} onChange={e => setName(e.target.value)} placeholder="Name *" className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm font-body" />
          <input value={phone} maxLength={30} onChange={e => setPhone(e.target.value)} placeholder="Phone (e.g. +1 555 1234)" className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm font-body" />
          <input value={relation} maxLength={40} onChange={e => setRelation(e.target.value)} placeholder="Relation (Mum, friend, partner…)" className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm font-body" />
          <div className="flex gap-2">
            <button onClick={add} className="flex-1 px-3 py-2 rounded-lg bg-[hsl(var(--forest))] text-cream text-sm font-body font-bold hover:bg-[hsl(var(--forest-deep))]">Save</button>
            <button onClick={() => setAdding(false)} className="px-3 py-2 rounded-lg bg-card border border-border text-sm font-body">Cancel</button>
          </div>
        </div>
      )}

      {contacts.length > 0 && (
        <label className="flex items-center gap-2 text-xs font-body text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={shareLocation} onChange={e => setShareLocation(e.target.checked)} className="rounded" />
          <MapPin className="w-3.5 h-3.5" /> Include my location with SOS message
        </label>
      )}

      <div className="space-y-2">
        {contacts.length === 0 && !adding && (
          <p className="text-xs font-body text-muted-foreground italic px-1">
            No contacts yet. Add the people who would want to know if you're struggling.
          </p>
        )}
        {contacts.map(c => (
          <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/15 border border-border">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-bold text-foreground truncate">{c.name}</p>
              <p className="text-xs font-body text-muted-foreground truncate">
                {c.relation ?? "Trusted"} {c.phone ? `· ${c.phone}` : ""}
              </p>
            </div>
            <button onClick={() => sendSOS(c)} className="px-3 py-2 rounded-lg bg-[hsl(var(--gold))] text-cream text-xs font-body font-bold hover:bg-[hsl(var(--gold-dark))] transition flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Send SOS
            </button>
            <button onClick={() => remove(c.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive transition" aria-label="Remove">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
