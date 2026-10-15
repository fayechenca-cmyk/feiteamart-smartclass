/* FEI TeamArt · Live Classes course catalog.
 *
 * Single source of truth for the 4 live small-group courses shown in the
 * dashboard's Live Classes section and (Option C) on upgrade/index.html.
 * Order here is display order.
 *
 * id: short course id used throughout the app (live-courses.js, the
 * dashboard catalog, upgrade/index.html). The SAME id prefixed with
 * 'live-' is the course_purchases.course_id value for that course's
 * enrollment rows (e.g. id 'sketch-b' -> course_purchases row with
 * course_id 'live-sketch-b') -- see getLiveEnrollments()/
 * recordLiveEnrollment() in core/access.js (Part 3).
 * live_class_sessions.course_id (Part 2) uses the bare id instead
 * ('sketch-a', not 'live-sketch-a'), since that table only ever holds
 * schedule rows, never purchase rows, so there is no prefix collision
 * to avoid there.
 *
 * stripeUrl starting with 'TBD' means the course is not yet on sale --
 * the dashboard's enroll card shows "Opening soon" and disables the
 * button instead of linking out. Faye fills in the real Stripe Payment
 * Link when each course opens; nothing else needs to change when she
 * does.
 */
window.LIVE_COURSES = [
  {
    id: 'sketch-a',
    title: 'Foundation of Sketch A',
    subtitle: 'Form, Light & Perspective',
    totalClasses: 10,
    price: '$180 CAD',
    stripeUrl: 'https://buy.stripe.com/7sYcN67T70i65YecSqd7q0g',
    startNote: ''
  },
  {
    id: 'sketch-b',
    title: 'Foundation of Sketch B',
    subtitle: 'TBD_B',
    totalClasses: 10,
    price: '$180 CAD',
    stripeUrl: 'TBD_STRIPE_B',
    startNote: "Starting soon — we'll let you know the week before the first class."
  },
  {
    id: 'sketch-c',
    title: 'Foundation of Sketch C',
    subtitle: 'TBD_C',
    totalClasses: 10,
    price: '$180 CAD',
    stripeUrl: 'TBD_STRIPE_C',
    startNote: "Starting soon — we'll let you know the week before the first class."
  },
  {
    id: 'sketch-d',
    title: 'Foundation of Sketch D',
    subtitle: 'TBD_D',
    totalClasses: 10,
    price: '$180 CAD',
    stripeUrl: 'TBD_STRIPE_D',
    startNote: "Starting soon — we'll let you know the week before the first class."
  }
];
