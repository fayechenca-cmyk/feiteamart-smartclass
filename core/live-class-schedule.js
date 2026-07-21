/* ============================================================
 * FEI TeamArt · core/live-class-schedule.js
 *
 * Live Class schedule — single source of truth.
 * Edit ONLY this file to update Zoom links, dates, materials.
 *
 * HOW TO ADD A NEW CLASS:
 * 1. Add a new object to the SESSIONS array below
 * 2. Fill in: id, classNumber, title, topic, date, zoom, materials, homework
 * 3. Save + commit via GitHub Desktop
 * That's it — the Smart Class homepage will auto-update.
 * ============================================================ */

const LIVE_CLASS_SCHEDULE = {

  // ── Shared Zoom info (used for most classes) ──────────────
  defaultZoom: {
    meetingId: '509 019 0896',
    passcode: '123456',
    joinUrl: 'https://zoom.us/j/5090190896?pwd=123456'
  },

  // ── Course info ───────────────────────────────────────────
  course: {
    title: 'Foundation of Sketch A',
    subtitle: 'Form, Light & Perspective',
    totalClasses: 10
  },

  // ── Individual class sessions ─────────────────────────────
  // Each session can override zoom if a different link is used
  sessions: [
    {
      id: 'live-01',
      classNumber: 1,
      title: 'Drawing Tools & Line Practice',
      topic: 'Introduction to sketching tools, pencil grip, hatching techniques, and basic cube perspective through drawing a cardboard box.',
      date: 'Jun 14, 2026',
      time: '7:00 PM ET',
      status: 'past', // 'upcoming' | 'past' | 'today'
      zoom: null, // null = use defaultZoom
      smartClassRef: 'cube', // which Smart Class lesson to reference (optional)
      smartClassNote: 'Watch the Cube lesson in Smart Class before this session.',
      materials: null,
      homework: {
        description: 'Complete a cardboard box sketch using the techniques from class.',
        downloadUrl: null,
        downloadLabel: null
      }
    },
    {
      id: 'live-02',
      classNumber: 2,
      title: 'Rectangular Form Study: Plaster Block Structure',
      topic: 'Learn how to observe and construct a rectangular plaster form, with support from the cube sketching video lesson.',
      date: 'Jun 28, 2026',
      time: '7:00 PM ET',
      status: 'past',
      zoom: null,
      smartClassRef: 'cube',
      smartClassNote: 'Watch the Cube lesson in Smart Class for reference.',
      materials: {
        label: 'Class Materials (PPT)',
        url: 'https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/6873482046a8046d51289d91_perspective%20practice.pptx'
      },
      homework: {
        description: 'Draw a rectangular plaster block with full light and shadow.',
        downloadUrl: 'https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/6871e9a3801bfd9b1f26d675_Box_Images_Complete.pdf',
        downloadLabel: 'Download Homework Reference'
      }
    },
    {
      id: 'live-03',
      classNumber: 3,
      title: 'Paper Bag Still Life: Complete Light and Shadow Study',
      topic: 'Apply cube structure to draw a paper bag with full shading, values, and cast shadows.',
      date: 'Jul 12, 2026',
      time: '7:00 PM ET',
      status: 'past',
      zoom: null,
      smartClassRef: null,
      smartClassNote: null,
      materials: {
        label: 'Class Materials (PPT)',
        url: 'https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/6873482046a8046d51289d91_perspective%20practice.pptx'
      },
      homework: {
        description: 'Draw a paper bag from direct observation — no Smart Class video needed.',
        downloadUrl: null,
        downloadLabel: null
      }
    },
    {
      id: 'live-04',
      classNumber: 4,
      title: 'Origami Animal Sketch: From Folded Paper to Form',
      topic: 'Study folded-paper structure through an origami animal, using the paper crane as a visual reference.',
      date: 'Jul 26, 2026',
      time: '7:00 PM ET',
      status: 'upcoming',
      zoom: null,
      smartClassRef: null,
      smartClassNote: null,
      materials: null,
      homework: {
        description: 'Draw the origami animal reference provided.',
        downloadUrl: 'https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/6881b1713ac1422bb8b05b86_ChatGPT%20Image%20Jul%2023%2C%202025%20at%2009_01_43%20PM.png',
        downloadLabel: 'Download Homework Reference'
      }
    },
    {
      id: 'live-05',
      classNumber: 5,
      title: 'Ellipses & Cylindrical Objects: Bottles and Jars',
      topic: 'Learn circular perspective and draw cylindrical everyday objects with clear structural lines.',
      date: 'Aug 9, 2026',
      time: '7:00 PM Vancouver',
      status: 'upcoming',
      zoom: null,
      smartClassRef: 'cylinder',
      smartClassNote: 'Watch the Cylinder lesson in Smart Class before drawing.',
      materials: {
        label: 'Class Materials (PPT)',
        url: 'https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/68981411b17923b41bd6040a_circular%20perspective.pptx'
      },
      homework: {
        description: 'Draw a cylindrical object from the reference image.',
        downloadUrl: 'https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/689817d57674b2f2e2fb2c3f_output.png',
        downloadLabel: 'Download Homework Reference'
      }
    },
    {
      id: 'live-06',
      classNumber: 6,
      title: 'Cylinder Perspective: Multiple Angles and Plaster Study',
      topic: 'Practice drawing cylinders from different viewpoints and complete a cylinder plaster sketch.',
      date: 'Aug 23, 2026',
      time: '7:00 PM ET',
      status: 'upcoming',
      zoom: null,
      smartClassRef: 'cylinder',
      smartClassNote: null,
      materials: {
        label: 'Class Materials (PPT)',
        url: 'https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/68aa9ed0bd88eb56bed54f46_sketch1(1).pptx'
      },
      homework: {
        description: 'Choose ONE sketch for a Master Study and ONE photo for an Observation Drawing.',
        downloadUrl: 'https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/68aa9df0b3c65107753bc0a4_FEI_four_images.pdf',
        downloadLabel: 'Download Homework Reference (4 images)'
      }
    },
    {
      id: 'live-07',
      classNumber: 7,
      title: 'Glass Cup Study: Transparency, Ellipse, and Structure',
      topic: 'Draw a glass cup while learning how to observe ellipses, thickness, and transparent form.',
      date: 'Sep 6, 2026',
      time: '7:00 PM ET',
      status: 'upcoming',
      zoom: {
        meetingId: '509 019 0896',
        passcode: '431432',
        joinUrl: 'https://zoom.us/j/5090190896?pwd=431432'
      },
      smartClassRef: 'cup',
      smartClassNote: 'Watch the Cup lesson in Smart Class for reference.',
      materials: {
        label: 'Class Materials (PPT)',
        url: 'https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/68bcff71e365f04a1df7330d_cube%20sketching%20methods.pptx'
      },
      homework: {
        description: 'Draw a glass cup focusing on ellipses and transparency.',
        downloadUrl: null,
        downloadLabel: null
      }
    },
    {
      id: 'live-08',
      classNumber: 8,
      title: 'Cone Study: Structure, Light, and Intersecting Forms',
      topic: 'Learn how to draw a cone with shading, then connect it to more complex intersecting plaster forms.',
      date: 'Sep 20, 2026',
      time: '7:00 PM ET',
      status: 'upcoming',
      zoom: null,
      smartClassRef: 'cone',
      smartClassNote: 'Watch the Cone lesson in Smart Class before class.',
      materials: {
        label: 'Class Materials (PPT)',
        url: 'https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/68cf6d1681fd6b44c8945aec_sketch3%20by%20eira%20wang.pptx'
      },
      homework: {
        description: 'Draw the cone reference provided.',
        downloadUrl: 'https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/68cf6ee9f6367143a524efb2_e05468d0bf6aea9d11d8daafccf853e8.jpg',
        downloadLabel: 'Download Homework Reference'
      }
    },
    {
      id: 'live-09',
      classNumber: 9,
      title: 'Sphere Study: Light, Shadow, and Form',
      topic: 'Understand how light moves across a sphere and complete a plaster sphere sketch.',
      date: 'Oct 4, 2026',
      time: '7:00 PM ET',
      status: 'upcoming',
      zoom: null,
      smartClassRef: 'sphere',
      smartClassNote: 'Watch the Sphere lesson in Smart Class for reference.',
      materials: {
        label: 'Class Materials (PPT)',
        url: 'https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/68e1eb232748dccce7a0d396_spherical%20sketch.pptx'
      },
      homework: {
        description: 'Draw the ladybug reference — apply sphere structure to a real object.',
        downloadUrl: 'https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/68e1edc45da29047d6af38f9_ladybug_homework.pdf',
        downloadLabel: 'Download Homework Reference'
      }
    },
    {
      id: 'live-10',
      classNumber: 10,
      title: 'Spherical Animal Form: Bird Sketch Project',
      topic: 'Apply sphere structure to a small bird drawing, supported by the plaster sphere video lesson.',
      date: 'Oct 18, 2026',
      time: '7:00 PM ET',
      status: 'upcoming',
      zoom: null,
      smartClassRef: 'sphere',
      smartClassNote: 'Watch the Sphere lesson in Smart Class before drawing.',
      materials: {
        label: 'Class Materials (PNG)',
        url: 'https://cdn.prod.website-files.com/67b17a6580f358f0c7dd29f4/68f994efd0ca518cb33f6137_Sketch%20Spherical%20Animal.png'
      },
      homework: {
        description: 'Draw a spherical animal form — bird sketch project.',
        downloadUrl: null,
        downloadLabel: null
      }
    }
  ],

  // ── Helper methods ─────────────────────────────────────────

  // Get a session by ID
  getSession(id) {
    return this.sessions.find(s => s.id === id) || null;
  },

  // Get the next upcoming session
  getNextUpcoming() {
    return this.sessions.find(s => s.status === 'upcoming') || null;
  },

  // Get all upcoming sessions
  getUpcoming() {
    return this.sessions.filter(s => s.status === 'upcoming');
  },

  // Get all past sessions
  getPast() {
    return this.sessions.filter(s => s.status === 'past');
  },

  // Get the Zoom info for a session (falls back to defaultZoom)
  getZoom(session) {
    return session.zoom || this.defaultZoom;
  }
};

// Make available globally
window.LIVE_CLASS_SCHEDULE = LIVE_CLASS_SCHEDULE;
