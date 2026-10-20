# Leather Crafting purchase access

Leather Crafting has its own one-time CAD 49 Stripe Payment Link. The introduction and all materials steps stay free; `eye-*`, `cat-*`, `dog-*`, and course completion require a `course_purchases` row with `course_id = 'leather-crafting'`. The only free-access account codes are `FAYE-00` and `DAWN-16`. Site-wide membership does not unlock this course.

Stripe currently displays: “Thank you! Leather Crafting will be unlocked on your account within 24 hours.” This is a **manual fulfillment promise**, not an automatic Stripe-to-Supabase integration. Each completed payment needs a matching purchase row before the student can continue. The payment page requires “Student's access code or sign-in email”; use that field to identify the account. Never grant access from a screenshot or a success-page URL alone—confirm the payment in Stripe first.

Apply [`supabase/leather_crafting_purchase_guard.sql`](../../supabase/leather_crafting_purchase_guard.sql) once in the Supabase SQL Editor. It rejects client-created Leather Crafting purchase rows while keeping the current policy for other courses. Supabase SQL Editor's `postgres` role can still grant verified purchases.

For a legacy access-code student, after verifying the payment and code, insert in the Supabase SQL Editor (replace the two quoted placeholders):

```sql
insert into public.course_purchases (course_id, student_code, stripe_session_id)
select 'leather-crafting', upper(trim('STUDENT-CODE')), 'STRIPE-SESSION-ID'
where not exists (
  select 1 from public.course_purchases
  where course_id = 'leather-crafting'
    and upper(student_code) = upper(trim('STUDENT-CODE'))
);
```

For an email-login student, use the sign-in email that they entered at checkout:

```sql
insert into public.course_purchases (course_id, user_id, stripe_session_id)
select 'leather-crafting', id, 'STRIPE-SESSION-ID'
from auth.users
where lower(email) = lower(trim('STUDENT@EXAMPLE.COM'))
on conflict (user_id, course_id) do nothing;
```

The email query inserts zero rows if the student has not created the account yet; ask them to sign up with the same email and rerun it. The student then opens the course and chooses “I already purchased · Check access.”

The current platform's `course_purchases` table grants broad anonymous read rights. The guard above blocks unverified client inserts for Leather Crafting, but the browser-side purchase check remains a user-flow gate rather than strong media protection: Cloudflare video IDs and other static assets are still public, and legacy access codes are shareable. Before treating this as fraud-resistant or offering instant unlock, replace manual fulfillment with a Stripe webhook that validates `checkout.session.completed` server-side and writes an entitlement using a service credential, and issue signed media URLs only after checking that entitlement. Never mark a course paid based only on a redirect query parameter.
