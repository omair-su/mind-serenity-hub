revoke execute on function public.get_friend_stats(uuid) from public, anon;
grant execute on function public.get_friend_stats(uuid) to authenticated;