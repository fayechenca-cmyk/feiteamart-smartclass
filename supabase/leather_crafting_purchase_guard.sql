-- Apply in the FEI TeamArt Supabase SQL Editor before accepting Leather Crafting payments.
-- Existing course_purchases policy permits anonymous inserts for other courses.
-- Leather Crafting is manually fulfilled after Stripe payment verification,
-- so only an administrator/service role may write its entitlement rows.

create or replace function public.reject_client_leather_purchase()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.course_id = 'leather-crafting'
     and current_user in ('anon', 'authenticated') then
    raise exception 'Leather Crafting access must be granted after payment verification';
  end if;
  return new;
end;
$$;

drop trigger if exists reject_client_leather_purchase on public.course_purchases;
create trigger reject_client_leather_purchase
before insert or update on public.course_purchases
for each row execute function public.reject_client_leather_purchase();

-- One access-code identity can only receive this course once. The existing
-- unique (user_id, course_id) constraint covers email-login identities.
create unique index if not exists course_purchases_leather_code_unique
on public.course_purchases (upper(student_code))
where course_id = 'leather-crafting' and student_code is not null;
