// curriculum.js
window.FEI_ART_HISTORY_TRACKS = {
  western: {
    label: "Western Art History",
    desc: "From Prehistoric to Contemporary (global influence track)",
    lessons: [
      {
        id: 1, title: "The Dawn of Art (Prehistoric)", era: "30,000 BCE - 2,000 BCE",
        videoUrl: "https://www.youtube.com/embed/ZjejoT1gFOc",
        lecture: "<h3>Art for Survival, Not Decoration</h3><p>Before writing, before cities, and before agriculture, early humans created astonishingly sophisticated art deep inside pitch-black cave systems like <strong>Lascaux</strong> and <strong>Chauvet</strong> in modern-day France.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Materials:</strong> Artists used earth pigments (red and yellow ochre, charcoal) mixed with animal fat or spit. They applied paint using their fingers, animal hair brushes, or by blowing pigment through hollow bones.</li><li><strong>Subject Matter:</strong> They almost exclusively painted large animals (horses, bison, deer). Humans are rarely depicted, and when they are, they are usually simple stick figures.</li><li><strong>Three-Dimensionality:</strong> They purposefully painted over the natural bulges of the cave walls to give the animals 3D volume in the flickering torchlight.</li><li><strong>Portable Art:</strong> They also created small sculptures, like the <em>Venus of Willendorf</em>, which exaggerated the female form to emphasize fertility and survival.</li></ul><p>These artworks were not meant to be seen by the general public. They were likely part of sacred shamanistic rituals to ensure successful hunts or to honor animal spirits.</p>",
        criticalThinking: "Imagine you are an early human living a harsh life where survival is a daily struggle. Why would you spend immense time, energy, and resources crawling into a dangerous, dark cave just to paint a bison on the ceiling?",
        mission: "<strong>The Cave Wall Texture Study:</strong> Find a brown paper bag and crumple it up tightly into a ball. Flatten it back out so it has deep wrinkles and a rocky texture. Using charcoal or a soft, dark pencil, draw a running animal. Notice how the texture of the paper forces your drawing to change, just like the bumpy cave walls.",
        images: [
          "https://commons.wikimedia.org/wiki/File:Lascaux_painting.jpg",
          "https://commons.wikimedia.org/wiki/File:Venus_of_Willendorf,_20210730_1214_1255.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/3/3c/Stonehenge2007_07_30.jpg"
        ],
        resources: [
          { name: "Smarthistory: Paleolithic Art Introduction", url: "https://smarthistory.org/paleolithic-art/" },
          { name: "The Met: Lascaux Cave Overview", url: "https://www.metmuseum.org/toah/hd/lasc/hd_lasc.htm" },
          { name: "Musée d'achéologie nationale: Visit The Lascaux Cave", url: "https://archeologie.culture.gouv.fr/lascaux/en" },
          { name: "Google Arts & Culture: Explore Chauvet Cave", url: "https://artsandculture.google.com/project/chauvet-cave" }
        ],
        quiz: [
          { q: "What is the most common subject matter found in Paleolithic cave paintings?", opts: ["Human portraits", "Large wild animals", "Landscapes and trees"], ans: 1 },
          { q: "How did cave artists give their animal paintings a 3D, muscular appearance?", opts: ["By using the natural bulges of the rock wall", "By painting perfect shadows", "By carving them out of marble"], ans: 0 },
          { q: "What materials were used to create the paint?", opts: ["Oil and canvas", "Earth pigments (ochre/charcoal) and animal fat", "Crushed berries and water"], ans: 1 },
          { q: "Why are these paintings located deep inside dark cave systems?", opts: ["To protect them from the rain", "They were likely used for sacred, private rituals", "Early humans lived deep inside the caves"], ans: 1 },
          { q: "What does the small 'Venus of Willendorf' statue likely represent?", opts: ["A specific queen", "A child's toy", "Fertility and the survival of the species"], ans: 2 }
        ]
      },
      {
        id: 2, title: "Mesopotamia: Order from Chaos", era: "3500 BCE - 539 BCE",
        videoUrl: "https://www.youtube.com/embed/6ZYnYBGLqyU",
        lecture: "<h3>The Cradle of Civilization</h3><p>As humans settled in the fertile land between the Tigris and Euphrates rivers, the first cities and empires rose. Art was no longer just for survival or secret rituals; it became a powerful tool for <strong>political propaganda</strong> and civic order.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Cuneiform:</strong> The Sumerians invented the first known writing system. They used wedge-shaped styluses to press marks into wet clay tablets, keeping records of trade, laws, and epic stories (like the <em>Epic of Gilgamesh</em>).</li><li><strong>Ziggurats:</strong> Because the landscape was flat, they built massive, stepped pyramid temples called Ziggurats. These were literal 'stairways to heaven' designed to bridge the gap between the human and divine realms.</li><li><strong>Art as Power:</strong> Artifacts like the <em>Standard of Ur</em> (showing War and Peace) and the <em>Stele of Hammurabi</em> (the first written legal code) were created to prove to the public that the King's power was granted directly by the gods.</li><li><strong>The Ishtar Gate:</strong> Constructed by Nebuchadnezzar II in Babylon, this massive entrance was covered in brilliant blue glazed bricks and adorned with golden lions and dragons to awe and intimidate visitors.</li></ul>",
        criticalThinking: "Look at the Stele of Hammurabi. King Hammurabi carved his strict laws into a giant stone monument for the whole city to see. However, 99% of his citizens could not read. Why would a king display a massive written document to a society that couldn't read it?",
        mission: "<strong>The Cuneiform Study:</strong> You do not need a pen to write like a Sumerian. Flatten out a piece of clay, play-dough, or even thick dough. Take a chopstick, a flat screwdriver, or the edge of a ruler. Instead of 'drawing' lines, practice pressing the flat edge into the surface to leave wedge-shaped marks. Try to create a repeating geometric pattern or your own secret alphabet.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/c/c5/Code_of_Hammurabi_Louvre_Museum.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/d/d4/Standard_of_ur.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/c/cb/Ishtar_Gate_at_Berlin_Museum.jpg"
        ],
        resources: [
          { name: "Smarthistory: Guide to Ancient Near Eastern Art", url: "https://smarthistory.org/a-guide-to-ancient-near-eastern-art-smarthistory-book/" },
          { name: "The Met: Ancient Near East Timeline", url: "https://www.metmuseum.org/toah/hd/meso/hd_meso.htm" },
          { name: "British Museum: The Standard of Ur", url: "https://www.britishmuseum.org/collection/object/ME_1928-1010-3" }
        ],
        quiz: [
          { q: "What was the primary architectural purpose of a Mesopotamian Ziggurat?", opts: ["A tomb for dead kings", "A stepped temple to bridge the earth and the heavens", "A military fortress"], ans: 1 },
          { q: "What is the name of the first known writing system invented by the Sumerians?", opts: ["Hieroglyphics", "Alphabet", "Cuneiform"], ans: 2 },
          { q: "The famous 'Standard of Ur' is a wooden box with mosaics on both sides. What do the two main sides represent?", opts: ["War and Peace", "Day and Night", "Summer and Winter"], ans: 0 },
          { q: "What visual technique was used to make the famous Ishtar Gate of Babylon so vibrant?", opts: ["Bright blue glazed bricks", "Solid gold plating", "Painted marble"], ans: 0 },
          { q: "Why did King Hammurabi carve his laws into a giant stone stele featuring an image of the Sun God?", opts: ["Because paper had not been invented yet", "To publicly demonstrate that his authority to rule came directly from the gods", "To decorate the interior of his private palace"], ans: 1 }
        ]
      },
      {
       id: 3, 
      title: "Ancient Egypt: Art for Eternity", 
    era: "3100 BCE - 30 BCE",
    videoUrl: "https://www.youtube.com/embed/xVf5kZA0HtQ", 
    lecture: "<h3>Creating the Eternal</h3><p>Egyptian art was not created to be hung in a gallery or admired by the public. Most of the greatest Egyptian masterpieces were sealed away in dark tombs. Art was a practical, magical tool designed to ensure the survival of the soul (the <em>Ka</em>) in the afterlife.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Composite View (Twisted Perspective):</strong> Egyptian artists didn't draw what they <em>saw</em>; they drew what they <em>knew</em>. To show the most recognizable parts of a human body, they combined different viewpoints: the face, hips, and legs are shown from the side (profile), but the eye and shoulders are shown from the front.</li><li><strong>Hieratic Scale:</strong> Size equals importance. The Pharaoh is always drawn significantly larger than his wife, servants, or defeated enemies.</li><li><strong>Permanence over Realism:</strong> Because statues served as backup bodies for the soul in case the mummy was destroyed, they had to be flawless and eternal. Pharaohs were carved from incredibly hard stone (like diorite) in rigid, block-like poses with no fragile, breakable parts extending outward.</li><li><strong>Three Millennia of Consistency:</strong> While modern art changes every decade, Egyptian art style remained almost entirely unchanged for 3,000 years to maintain <em>Ma'at</em> (cosmic order and balance).</li></ul>",
    criticalThinking: "Modern artists are constantly trying to invent new styles, break the rules, and 'think outside the box.' In contrast, Egyptian artists strictly followed the exact same visual rules for 3,000 years. Why did the Ancient Egyptians view changing the artistic rules as a terrible, dangerous thing?",
    mission: "<strong>The Composite View Study:</strong> Try to draw a self-portrait using the strict rules of Egyptian twisted perspective. Draw your head facing completely to the side (profile). Now, draw your eye looking straight at the viewer. Draw your shoulders facing front, but your hips and feet pointing sideways. It will feel very awkward to draw, but notice how clearly identifiable every part of your body is!",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/be/Narmer_Palette.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1f/Tutanchamun_Maske.jpg"
    ],
    resources: [
      { name: "Smarthistory: Ancient Egypt", url: "https://smarthistory.org/ancient-egypt-intro/" }
    ],
    quiz: [
      { q: "What was the primary function of most Ancient Egyptian art?", opts: ["To decorate the palaces of the living", "To magically ensure the survival of the soul in the afterlife", "To serve as historical records for other countries"], ans: 1 },
      { q: "What is the visual rule where the most important figure is drawn significantly larger than everyone else?", opts: ["Hieratic Scale", "Linear Perspective", "Contrapposto"], ans: 0 },
      { q: "Why were Egyptian statues of Pharaohs usually carved in rigid, block-like poses from hard stone?", opts: ["Because artists didn't have good tools", "To ensure the statue wouldn't break, serving as a permanent home for the soul", "Because Pharaohs were forced to stand completely still for days"], ans: 1 },
      { q: "In the 'Composite View', how is the human eye depicted?", opts: ["From the side (profile)", "From the front, even though the face is turned to the side", "It is usually left blank or closed"], ans: 1 },
      { q: "Roughly how long did the primary style of Ancient Egyptian art last before the empire fell?", opts: ["300 years", "1,000 years", "3,000 years"], ans: 2 }
    ]
  },
  {
    id: 4, 
    title: "Ancient Greece: The Ideal Human", 
    era: "900 BCE - 30 BCE",
    videoUrl: "https://www.youtube.com/embed/o5gGeZ--TGo", 
    lecture: "<h3>Man is the Measure of All Things</h3><p>Unlike the Egyptians who focused on the afterlife and gods, the Ancient Greeks focused on humanity. They believed that studying human beings and the natural world was the path to understanding the divine. This philosophy is called <strong>Humanism</strong>.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Mathematical Beauty:</strong> The Greeks believed that beauty was not subjective; it was based on strict mathematical ratios and proportions (like the Golden Ratio). This is visible in both their perfect statues and the architecture of temples like the <em>Parthenon</em>.</li><li><strong>The Invention of Contrapposto:</strong> In the Classical period, artists figured out how to make statues look truly alive. Instead of standing stiff and straight, statues were carved with their weight shifted onto one leg. This creates a relaxed, natural 'S-curve' in the spine and hips called <em>Contrapposto</em> (counter-pose).</li><li><strong>Evolution of Style:</strong> Greek art evolved rapidly. It started stiff and geometric (Archaic period), moved to perfect and calm ideal beauty (Classical period), and ended with highly emotional, dramatic, and realistic action (Hellenistic period).</li><li><strong>Pottery as Canvas:</strong> Because most Greek wall paintings were destroyed over time, we study their painting techniques through their pottery, specifically the intricate 'Black-Figure' and 'Red-Figure' vases.</li></ul>",
    criticalThinking: "For centuries, people believed Greek statues were made of pure, elegant white marble, and modern museums display them that way. However, scientists have recently proven that the Greeks actually painted their statues in bright, loud, almost cartoonish colors—the paint just wore off over 2,000 years. How does knowing this change your perception of 'classical elegance'?",
    mission: "<strong>The Contrapposto Line Study:</strong> Stand in front of a mirror with your feet together and your weight perfectly balanced. Notice how straight your spine is. Now, shift all your weight onto your right leg and let your left knee bend. Look at what happens to your shoulders and hips—they tilt! On a piece of paper, draw two stick figures: one standing stiff, and one showing the tilted shoulders and 'S' curve spine of the Contrapposto pose.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/1/1c/Parthenon_from_west.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/cd/Doryphoros_MAN_Napoli_Inv6011-2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b3/Amphora_Heracles_Geryon_Staatliche_Antikensammlungen_137.jpg"
    ],
    resources: [
      { name: "Smarthistory: Introduction to Greek Art", url: "https://smarthistory.org/greek-art-intro/" }
    ],
    quiz: [
      { q: "What is the philosophical belief that human beings are the center of the universe and the measure of all things?", opts: ["Polytheism", "Humanism", "Verism"], ans: 1 },
      { q: "What is 'Contrapposto'?", opts: ["A type of marble used for carving", "A painting technique using black and red clay", "A natural, relaxed standing pose with the weight shifted to one leg"], ans: 2 },
      { q: "How did the Ancient Greeks define 'beauty'?", opts: ["As an expression of intense emotion", "As perfect mathematical proportions and ratios", "As something chaotic and natural"], ans: 1 },
      { q: "What did original Ancient Greek marble statues look like when they were first made?", opts: ["Pure white and polished", "Painted in bright, vivid colors", "Covered entirely in gold leaf"], ans: 1 },
      { q: "Which period of Greek art is known for intense drama, emotion, and dynamic movement?", opts: ["The Archaic Period", "The Classical Period", "The Hellenistic Period"], ans: 2 }
    ]
  },
  {
    id: 5, 
    title: "Ancient Rome: Engineering the Empire", 
    era: "509 BCE - 476 CE",
    videoUrl: "https://www.youtube.com/embed/BbcJh3uvax0", 
    lecture: "<h3>Practical Power</h3><p>While the Greeks were philosophers and poets seeking perfect beauty, the Romans were engineers, soldiers, and politicians. They conquered the known world, and their art and architecture were designed to organize, control, and display that massive power.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>The Arch and Concrete:</strong> The Greeks used a 'post-and-lintel' system (straight columns holding up a flat roof). The Romans perfected the <strong>rounded arch</strong> and invented <strong>concrete</strong>. This allowed them to build massive, open interior spaces like the <em>Pantheon</em> and enormous public arenas like the <em>Colosseum</em>.</li><li><strong>Verism (Hyper-Realism):</strong> In the Roman Republic, politicians wanted to look wise, experienced, and hard-working. Roman sculptors used a style called <strong>Verism</strong>—they emphasized every wrinkle, bald spot, and wart to show that the person had worked a long, hard life for the Republic.</li><li><strong>Art as Propaganda:</strong> Emperors like Augustus used art as mass media. Statues of Augustus were sent to every corner of the empire to show him as a forever-young, god-like leader, reminding citizens who was in charge.</li><li><strong>Public Works:</strong> Roman art wasn't just for temples; it was highly practical. They built sprawling aqueducts to carry fresh water, public bathhouses, and paved roads that connected the empire.</li></ul>",
    criticalThinking: "Look at a 'Veristic' portrait of a Roman Senator and compare it to a modern political campaign poster. Why did Roman politicians want to look old and exhausted, while modern politicians use Photoshop to look young and flawless?",
    mission: "<strong>The Arch Architecture Challenge:</strong> Find a set of rectangular building blocks (or use thick hardcover books). Try to stack the blocks in a curved arch shape. Notice how the pieces push against each other, locking together to hold the weight. This is the secret to Roman engineering.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d5/Colosseo_2020.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/98/Rome_Pantheon_interior.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/87/Portrait_bust_of_an_old_man_-_Palazzo_Nuovo_-_Musei_Capitolini_-_Rome_2016.jpg"
    ],
    resources: [
      { name: "Smarthistory: Introduction to Ancient Roman Art", url: "https://smarthistory.org/roman-art-intro/" }
    ],
    quiz: [
      { q: "What revolutionary building material did the Romans invent that allowed them to build massive structures like the Pantheon?", opts: ["Steel", "Concrete", "Marble"], ans: 1 },
      { q: "What architectural shape did the Romans perfect to hold massive amounts of weight?", opts: ["The rounded arch", "The perfect square", "The triangle"], ans: 0 },
      { q: "What is 'Verism' in Roman portraiture?", opts: ["Painting statues in bright colors", "Making the subject look like a perfect, flawless god", "A highly realistic style that emphasizes wrinkles, age, and imperfections"], ans: 2 },
      { q: "Why did Emperor Augustus send statues of himself all over the Roman Empire?", opts: ["As a form of political propaganda to remind citizens of his power", "Because he wanted to support local artists", "To give the citizens a target for their anger"], ans: 0 },
      { q: "What was the main difference in focus between Greek and Roman architecture?", opts: ["Greeks focused on practical public works; Romans focused on religious temples", "Greeks focused on exterior perfection; Romans focused on massive, open interior spaces", "Greeks only built with wood; Romans only built with stone"], ans: 1 }
    ]
  },
  {
    id: 6, 
    title: "Byzantine: Heaven on Earth", 
    era: "330 CE - 1453 CE",
    videoUrl: "https://www.youtube.com/watch?v=0leET9HyUjI", 
    lecture: "<h3>The Spiritual Realm</h3><p>When the Roman Empire split, the eastern half headquartered in Constantinople survived for another thousand years. Here, artists completely abandoned the realism of the Greeks and Romans. Art was about the spiritual, eternal world of Heaven.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Rejection of Realism:</strong> Byzantine figures don't look like real people. They are intentionally drawn as flat, elongated, and stiff, with tiny feet that point downward so they appear to be floating.</li><li><strong>The Gold Background:</strong> Instead of painting landscapes, artists placed figures against solid gold backgrounds. This removed the figures from earthly time and space, placing them in a timeless, divine realm.</li><li><strong>Mosaics as Light:</strong> The primary medium was the <strong>Mosaic</strong>. Artists used millions of tiny glass and gold tiles (called <em>tesserae</em>). When placed on the curved walls of churches, the uneven glass caught the candlelight, making the entire wall sparkle.</li><li><strong>Icons and Iconoclasm:</strong> Small painted wood panels of holy figures (Icons) were used for personal prayer. This led to a period of 'Iconoclasm' where thousands of artworks were destroyed because people feared they were being worshipped as idols.</li></ul>",
    criticalThinking: "Look closely at the mosaic of Emperor Justinian. He is the ruler of the empire, but he is depicted with a halo (like a saint) and standing in a blank, golden void. What does this image tell you about the Emperor's authority compared to God's authority?",
    mission: "<strong>The Tesserae Mosaic Study:</strong> Tear colored paper into small, relatively equal squares (your tesserae). Sketch a simple shape (like a star) on a blank page. Now, glue your paper squares down to fill the shape. Leave a tiny gap between each square so the background peeks through.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/3/37/Hagia_Sophia_Mars_2013.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6f/Justinien_521.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/bf/Virgin_and_Child_Icon_from_Saint_Catherine%27s_Monastery.jpg"
    ],
    resources: [
      { name: "Smarthistory: A Beginner's Guide to Byzantine Art", url: "https://smarthistory.org/a-beginners-guide-to-byzantine-art/" }
    ],
    quiz: [
      { q: "Why did Byzantine artists stop carving hyper-realistic statues and painting realistic bodies like the Romans did?", opts: ["They forgot how to do it", "They wanted to focus on the spiritual, heavenly realm", "They only had access to cheap materials"], ans: 1 },
      { q: "What is a mosaic?", opts: ["An image created by tiny glass or stone tiles", "A type of very thick oil paint", "A wall painting done directly onto wet plaster"], ans: 0 },
      { q: "What does the solid gold background in a Byzantine artwork usually represent?", opts: ["The wealth of the patron", "A beautiful sunset", "A timeless, heavenly realm"], ans: 2 },
      { q: "How are human figures typically drawn in Byzantine art?", opts: ["Muscular and heavy", "Flat, stiff, and elongated", "In extreme action poses"], ans: 1 },
      { q: "What is an 'Icon' in Byzantine history?", opts: ["A small, sacred painting used as a focus for prayer", "The main dome of a church", "A coin used to pay the artists"], ans: 0 }
    ]
  },
  {
    id: 7, 
    title: "Islamic Art: The Infinite Pattern", 
    era: "7th Century CE - 17th Century CE",
    videoUrl: "https://www.youtube.com/watch?v=hVdaXZTFiII", 
    lecture: "<h3>Geometry, Plants, and the Word</h3><p>Islamic art developed a totally unique visual language driven by religious philosophy.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Aniconism (No Figures):</strong> To prevent the worship of idols, religious Islamic art generally avoids drawing human or animal figures. Instead, artists focused on abstract and non-representational art.</li><li><strong>Calligraphy as the Highest Art:</strong> Because the Quran is considered the literal word of God, writing it beautifully became the most sacred of all art forms.</li><li><strong>Complex Geometry:</strong> Islamic artists created incredibly complex, infinitely repeating geometric patterns. These symbolize the infinite, orderly, and unified nature of God and the universe.</li><li><strong>The Arabesque:</strong> Alongside hard geometry, artists used flowing, intertwining, leafy plant motifs called 'Arabesques.' These represent the abundance of nature and paradise.</li></ul>",
    criticalThinking: "In Islamic art, the highest form is Calligraphy. How does focusing on the written word rather than the human body change how a person experiences a religious space?",
    mission: "<strong>The Sacred Geometry Study:</strong> Using a compass (or tracing a cup), draw a circle. Now, draw six more circles of the same size around it, placing the edge of each new circle in the center of the first. Notice how the overlapping curves create flower petals.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e6/Great_Mosque_of_Kairouan_prayer_hall.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Folio_from_a_Qur%27an_Manuscript.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/90/Alhambra_Patio_de_los_Leones.jpg"
    ],
    resources: [
      { name: "Smarthistory: Arts of the Islamic World", url: "https://smarthistory.org/islamic-art-intro/" }
    ],
    quiz: [
      { q: "Why are human figures usually avoided in religious Islamic art?", opts: ["Loss of technique", "To prevent worship of idols", "Geometry was easier"], ans: 1 },
      { q: "What is considered the highest form of visual art in the Islamic world?", opts: ["Calligraphy", "Portrait sculptures", "Stained glass"], ans: 0 },
      { q: "What do repeating geometric patterns in mosques symbolize?", opts: ["Wealth of the Sultan", "Infinite, unified nature of God", "No meaning"], ans: 1 },
      { q: "What is an 'Arabesque' in art?", opts: ["Pointed archway", "Shade of blue", "Flowing, plant-like decorative motifs"], ans: 2 },
      { q: "Instead of painting pictures of religious stories, what did Islamic architects often use to decorate?", opts: ["Blank walls", "Intricate tilework containing geometry and script", "Large oil paintings"], ans: 1 }
    ]
  },
  {
    id: 8, 
    title: "Romanesque: The Fortress of God", 
    era: "1000 CE - 1150 CE",
    videoUrl: "https://www.youtube.com/watch?v=6_UvBLmdBMU", 
    lecture: "<h3>Pilgrimages and Heavy Stone</h3><p>As Europe stabilized around the year 1000, architects built huge new stone churches to accommodate massive crowds visiting sacred relics.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Roman-like Architecture:</strong> This style uses the Roman <strong>rounded arch</strong> and heavy stone masonry.</li><li><strong>The Fortress Look:</strong> To support heavy stone roofs, walls were massive and thick. Windows were tiny so the walls wouldn't collapse, making interiors dark.</li><li><strong>The Tympanum:</strong> Above the main doors was a semi-circular space called a tympanum. Artists carved terrifying relief sculptures here—usually the 'Last Judgment'—to remind the illiterate to behave.</li><li><strong>Reliquaries:</strong> Sacred relics were kept in ornate, jewel-encrusted gold containers called reliquaries.</li></ul>",
    criticalThinking: "Imagine you are a medieval farmer who cannot read. You stand before a massive stone church with a carving of demons eating sinners right above the door. How does this control your beliefs?",
    mission: "<strong>The Heavy Architecture Sketch:</strong> Sketch a church using thick, solid lines. Make the walls look wide, the windows tiny, and use rounded arches at the top.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/8/8e/Toulouse_Basilique_Saint-Sernin_Chevet.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/36/Autun_tympan_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/Reliquaire_de_Sainte_Foy.jpg"
    ],
    resources: [
      { name: "Smarthistory: Romanesque Architecture", url: "https://smarthistory.org/a-beginners-guide-to-romanesque-architecture/" }
    ],
    quiz: [
      { q: "What caused the church building boom?", opts: ["Steel invention", "Religious pilgrimages", "Art museums"], ans: 1 },
      { q: "Which feature defines Romanesque style?", opts: ["Pointed arch", "Rounded arch", "Flat roof"], ans: 1 },
      { q: "Why were walls thick and windows tiny?", opts: ["Support stone roofs", "Hide secrets", "No glass"], ans: 0 },
      { q: "What is a 'Tympanum'?", opts: ["Instrument", "Sculpted space above doors", "Relic box"], ans: 1 },
      { q: "What is a 'Relic'?", opts: ["Painting", "Sacred object like a saint's bone", "Stone column"], ans: 1 }
    ]
  },
  {
    id: 9, 
    title: "Gothic: Height and Light", 
    era: "1150 CE - 1450 CE",
    videoUrl: "https://www.youtube.com/watch?v=5UT889YeCuo", 
    lecture: "<h3>Reaching for the Heavens</h3><p>Gothic was about stretching stone as high as possible and flooding the interior with divine light (<em>Lux Nova</em>).</p><p><strong>Key Concepts:</strong></p><ul><li><strong>The Pointed Arch:</strong> Pushes weight more directly downwards, allowing for taller ceilings.</li><li><strong>The Flying Buttress:</strong> Stone arms that stand outside the building and push back against the walls to hold them up.</li><li><strong>Skeletal Structure:</strong> Walls no longer needed to be thick stone; the building became a lightweight 'skeleton' of stone ribs.</li><li><strong>Stained Glass:</strong> Architects replaced solid stone with massive walls of stained glass, turning the church into a glowing jewel box.</li></ul>",
    criticalThinking: "If you were a medieval person stepping into the dazzling light of a Gothic cathedral for the first time, how would the architecture itself serve as a religious experience?",
    mission: "<strong>The Stained Glass Symmetry Study:</strong> Draw a large circle. Divide it into 8 equal slices. Draw a shape in one slice and mirror it perfectly into the other 7 to create a 'Rose Window.'",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/a/a4/Notre-Dame_de_Paris_2013-07-24.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f8/Sainte_Chapelle_-_Upper_level_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/74/Notre-Dame_de_Paris_South_Rose_Window.jpg"
    ],
    resources: [
      { name: "Smarthistory: Gothic Architecture", url: "https://smarthistory.org/gothic-architecture-an-introduction/" }
    ],
    quiz: [
      { q: "Visual characteristic of the Gothic arch?", opts: ["Rounded", "Pointed", "Flat"], ans: 1 },
      { q: "Invention that held up walls from the outside?", opts: ["Pillars", "Flying Buttresses", "Beams"], ans: 1 },
      { q: "What replaced stone walls?", opts: ["Stained glass", "Wood", "Gold"], ans: 0 },
      { q: "Philosophical goal?", opts: ["Darkness", "Divine light", "Fortress"], ans: 1 },
      { q: "What is a 'Rose Window'?", opts: ["Flower painting", "Circular stained glass window", "Garden window"], ans: 1 }
    ]
  },
  {
    id: 10, 
    title: "Proto-Renaissance: The Awakening", 
    era: "1200 CE - 1400 CE",
    videoUrl: "https://www.youtube.com/watch?v=Iirq69IBfCQ", 
    lecture: "<h3>Weight, Emotion, and Blue Skies</h3><p>Giotto di Bondone brought art back down to earth, planting the seeds for the Renaissance.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>End of Gold:</strong> Giotto painted a rich <strong>blue sky</strong>, moving stories into the real world.</li><li><strong>Gravity:</strong> Figures have heavy, bulky bodies modeled using early <strong>chiaroscuro</strong> (light and shadow).</li><li><strong>Human Emotion:</strong> Giotto painted angels screaming in agony and faces twisted in genuine, raw human grief.</li><li><strong>Fresco:</strong> Paintings done directly onto wet plaster walls so they literally become part of the wall.</li></ul>",
    criticalThinking: "How would seeing holy figures experiencing real human pain change how an average person connected with religion?",
    mission: "<strong>The Raw Emotion Study:</strong> Draw three simple faces. Try to make the first look mildly sad, the second heartbroken, and the third completely devastated just by the tilt of eyebrows and mouth.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/7/73/Giotto_-_Scrovegni_-_-36-_-_Lamentation_%28The_Mourning_of_Christ%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/30/Giotto_di_Bondone_-_Maest%C3%A0_%28Ognissanti_Madonna%29_-_Uffizi.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/8c/Cappella_degli_Scrovegni.jpg"
    ],
    resources: [
      { name: "Smarthistory: 14th-Century Italy", url: "https://smarthistory.org/a-beginners-guide-to-the-late-gothic-14th-century/" }
    ],
    quiz: [
      { q: "Artist who sparked the Proto-Renaissance?", opts: ["Da Vinci", "Giotto", "Michelangelo"], ans: 1 },
      { q: "Background change?", opts: ["Blue skies", "Black drama", "Blank plaster"], ans: 0 },
      { q: "How to make figures 3D?", opts: ["Fabric", "Chiaroscuro", "Stone carving"], ans: 1 },
      { q: "Powerful new element?", opts: ["Calm stares", "Intense human grief", "Exaggeration"], ans: 1 },
      { q: "What is a 'fresco'?", opts: ["Painting on wet plaster", "Oil paint", "Gold frame"], ans: 0 }
    ]
  },
  {
    id: 11, 
    title: "Early Renaissance: Discovery of Space", 
    era: "1400 CE - 1490 CE",
    videoUrl: "https://www.youtube.com/watch?v=IDCIXr17d-E", 
    lecture: "<h3>The Rebirth in Florence</h3><p>Renaissance means rebirth. This era brought back <strong>Humanism</strong>—the belief that the human experience is worth studying.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Linear Perspective:</strong> Mathematical system to create the illusion of 3D depth on a flat surface using a vanishing point.</li><li><strong>Masaccio:</strong> First to perfectly use linear perspective in a fresco.</li><li><strong>Donatello:</strong> Sculpted the first life-sized, free-standing nude statue (David) since Roman times.</li><li><strong>Brunelleschi:</strong> Engineered a revolutionary double-shell brick dome for the Florence Cathedral.</li></ul>",
    criticalThinking: "How does linear perspective silently make the human being the absolute center of the universe?",
    mission: "<strong>The 1-Point Perspective Room:</strong> Draw a vanishing point in the center of your page and use a ruler to draw a perfect 3D hallway.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/9/93/Masaccio_trinity.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b3/Donatello_-_David_-_Floren%C3%A7a.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a1/Santa_Maria_del_Fiore_-_Florence_-_Italy_2015.jpg"
    ],
    resources: [
      { name: "Smarthistory: Early Renaissance", url: "https://smarthistory.org/early-renaissance-in-florence/" }
    ],
    quiz: [
      { q: "What does Renaissance mean?", opts: ["Rebirth", "Dark Ages", "Invention"], ans: 0 },
      { q: "City where it began?", opts: ["Rome", "Venice", "Florence"], ans: 2 },
      { q: "3D depth system?", opts: ["Chiaroscuro", "Linear Perspective", "Hieratic Scale"], ans: 1 },
      { q: "Who sculpted the first nude David?", opts: ["Da Vinci", "Masaccio", "Donatello"], ans: 2 },
      { q: "What is the 'vanishing point'?", opts: ["Where parallel lines meet", "Darkest shadow", "Halo"], ans: 0 }
    ]
  },
  {
    id: 12, 
    title: "High Renaissance: The Masters", 
    era: "1490 CE - 1527 CE",
    videoUrl: "https://www.youtube.com/watch?v=2oSpTXgPkQc", 
    lecture: "<h3>The Golden Age of Genius</h3><p>This era is defined by the 'holy trinity' of Leonardo, Michelangelo, and Raphael.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Universal Genius:</strong> Leonardo elevated art to a science, dissecting corpses to understand musculature.</li><li><strong>Pyramid Composition:</strong> Grouping subjects into a triangle shape for balance.</li><li><strong>Sfumato:</strong> Smoky, hazy transitions between light and shadow invented by Leonardo.</li><li><strong>Michelangelo's David:</strong> Perfectly combined Greek proportion with intense human psychology.</li></ul>",
    criticalThinking: "In the High Renaissance, artists were treated like celebrities. What does this tell us about how society's values changed?",
    mission: "<strong>The Sfumato Shading Study:</strong> Use your finger to smudge graphite to make a smooth, smoky transition on a drawing.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/80/Michelangelo%27s_David_-_Right_View_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg"
    ],
    resources: [
      { name: "Smarthistory: High Renaissance", url: "https://smarthistory.org/high-renaissance-in-italy-intro/" }
    ],
    quiz: [
      { q: "Three masters?", opts: ["Donatello/Masaccio", "Leonardo/Michelangelo/Raphael", "Picasso/Dali"], ans: 1 },
      { q: "Artist status?", opts: ["Laborers", "Monks", "Celebrated geniuses"], ans: 2 },
      { q: "Composition shape?", opts: ["Circle", "Triangle/Pyramid", "Zig-zag"], ans: 1 },
      { q: "What is Sfumato?", opts: ["Smoky technique", "Plaster type", "Word for Rebirth"], ans: 0 },
      { q: "Psychological David?", opts: ["Mona Lisa", "Michelangelo's David", "Ishtar Gate"], ans: 1 }
    ]
  },
  {
    id: 13, 
    title: "Northern Renaissance: Oil and Detail", 
    era: "1400 CE - 1600 CE",
    videoUrl: "https://www.youtube.com/watch?v=EuzAbE-kPkM", 
    lecture: "<h3>The Magic of Oil Paint</h3><p>Northern artists were obsessed with microscopic detail and incredible textures, made possible by <strong>Oil Paint</strong>.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Translucent Glazes:</strong> Oil allowed artists to paint in dozens of see-through layers, creating colors that glowed.</li><li><strong>Detail vs. Proportion:</strong> Northern artists wanted to paint every single hair and every wrinkle exactly as it looked.</li><li><strong>Disguised Symbolism:</strong> Hiding religious messages inside everyday objects, like a dog symbolizing loyalty.</li><li><strong>Printmaking:</strong> Albrecht Dürer used woodblocks to make art affordable for the middle class.</li></ul>",
    criticalThinking: "How does the private setting of Northern art (homes) change how an artist paints compared to public churches?",
    mission: "<strong>The Texture Study:</strong> Draw just the 'highlight' of three different objects (metal, fabric, wood) to see how light reflects differently.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/3/33/Jan_van_Eyck_-_The_Arnolfini_Portrait_-_Google_Art_Project.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/5e/Albrecht_D%C3%BCrer_-_Self-Portrait_-_WGA7356.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6d/The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg"
    ],
    resources: [
      { name: "Smarthistory: Northern Renaissance", url: "https://smarthistory.org/northern-renaissance-15th-century/" }
    ],
    quiz: [
      { q: "Medium?", opts: ["Fresco", "Oil", "Watercolors"], ans: 1 },
      { q: "Northern focus?", opts: ["Speed", "Detail/Texture", "Geometry"], ans: 1 },
      { q: "Disguised Symbolism?", opts: ["Latin codes", "Hidden religious meanings", "Tiny figures"], ans: 1 },
      { q: "Celebrity printmaker?", opts: ["Da Vinci", "Bosch", "Dürer"], ans: 2 },
      { q: "Why use oil?", opts: ["Gold dust", "Slow drying layers", "Oven baked"], ans: 1 }
    ]
  },
  {
    id: 14, 
    title: "Mannerism: Breaking the Rules", 
    era: "1520 CE - 1600 CE",
    videoUrl: "https://www.youtube.com/watch?v=BOKXbOyTYCk", 
    lecture: "<h3>The Art of Artifice</h3><p>Mannerists decided to be intentionally weird, elegant, and unnatural.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Artificiality:</strong> Mannerist art was meant to look highly constructed and artificial.</li><li><strong>Distorted Proportion:</strong> Necks and fingers were strangely long, twisted into <strong>figura serpentinata</strong>.</li><li><strong>Compressed Space:</strong> Chaotic, flattened spaces where figures are stacked on top of each other.</li><li><strong>Acidic Colors:</strong> Use of jarring, 'sour' colors like icy blues and neon pinks to create tension.</li></ul>",
    criticalThinking: "If the public already considers High Renaissance work 'perfect,' why might breaking the rules be a smart career move for a young artist?",
    mission: "<strong>The Spoon Distortion Study:</strong> Look at your reflection in a shiny spoon and sketch the distorted 'Mannerist' version of your face.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/Parmigianino_-_Madonna_dal_collo_lungo_-_Google_Art_Project.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/41/Pontormo_-_The_Entombment_of_Christ_-_Google_Art_Project.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/Agnolo_Bronzino_-_Venus%2C_Cupid%2C_Folly_and_Time_-_National_Gallery%2C_London.jpg"
    ],
    resources: [
      { name: "Smarthistory: Mannerism", url: "https://smarthistory.org/mannerism-an-introduction/" }
    ],
    quiz: [
      { q: "Mannerism reacted against?", opts: ["Romanesque", "High Renaissance", "Northern"], ans: 1 },
      { q: "Goal?", opts: ["Artificial/Rule-breaking", "Scientific", "Peasant art"], ans: 0 },
      { q: "Treatment of body?", opts: ["Athletic", "Stretched/Twisted", "Hidden"], ans: 1 },
      { q: "Figura serpentinata?", opts: ["Oil layer", "Snake-like pose", "Mythical creature"], ans: 1 },
      { q: "Mannerist colors?", opts: ["Pastels", "Primary", "Acidic/Sour"], ans: 2 }
    ]
  },
  {
    id: 15, 
    title: "Baroque: The Theater of Light", 
    era: "1600 CE - 1750 CE",
    videoUrl: "https://www.youtube.com/watch?v=EFHPAbHaoqk&t=383s", 
    lecture: "<h3>Cinematic Drama</h3><p>The Baroque period was like an action movie, designed by the Catholic Church to emotionally overwhelm viewers.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Tenebrism:</strong> Pitch black backgrounds illuminated by a single, harsh spotlight.</li><li><strong>Dynamic Diagonals:</strong> Sharp diagonal lines used to create a feeling of violent motion.</li><li><strong>Frozen Action:</strong> Statues and paintings capture the exact split-second of intense action.</li><li><strong>Viewer Involved:</strong> Action seems to spill out of the canvas into your personal space.</li></ul>",
    criticalThinking: "Which strategy is more effective to convince a crowd: a written book or a massive, dramatic painting?",
    mission: "<strong>The Tenebrism Studio Study:</strong> Use a flashlight in a dark room to create deep shadows on your face and sketch the dramatic result.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/5/58/Caravaggio_-_La_vocazione_di_San_Matteo.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Estasi_di_Santa_Teresa.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/28/The_Nightwatch_by_Rembrandt.jpg"
    ],
    resources: [
      { name: "Smarthistory: Baroque Art", url: "https://smarthistory.org/baroque-art-in-europe-an-introduction/" }
    ],
    quiz: [
      { q: "Event behind Baroque?", opts: ["French Revolution", "Counter-Reformation", "New World"], ans: 1 },
      { q: "Tenebrism?", opts: ["Pastels", "Harsh spotlight on black", "Wood carving"], ans: 1 },
      { q: "Composition?", opts: ["Pyramids", "Random", "Dynamic diagonals"], ans: 2 },
      { q: "Bernini vs Michelangelo David?", opts: ["Bernini is in action", "Bernini is bronze", "Bernini is old"], ans: 0 },
      { q: "Artist using dirty-footed models?", opts: ["Raphael", "Caravaggio", "Da Vinci"], ans: 1 }
    ]
  },
  {
    id: 16, 
    title: "Rococo: Pastel Play", 
    era: "1715 CE - 1789 CE",
    videoUrl: "https://www.youtube.com/watch?v=GTmQEYCJrjY", 
    lecture: "<h3>The Bubble of Luxury</h3><p>Rococo was the light, carefree style of the French aristocracy right before the revolution.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Pastels:</strong> Soft pinks, baby blues, and mint greens with gold leaf.</li><li><strong>Fête Galante:</strong> Paintings of outdoor parties where aristocrats flirted in lush gardens.</li><li><strong>Frivolity:</strong> Art designed purely for pleasure, not moral lessons.</li><li><strong>The Brewing Storm:</strong> This carefree art existed while common people were starving, leading to the revolution.</li></ul>",
    criticalThinking: "Do you see parallels between Rococo 'fête galante' and how influencers curate their lives today?",
    mission: "<strong>The Pastel Atmosphere Study:</strong> Draw a garden using soft, scribbly motions instead of hard lines to create fluffy foliage.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d1/The_Swing_%28Fragonard%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/07/Salon_de_la_princesse_de_Soubise.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/60/Marie-Antoinette_de_Lorraine-Habsbourg%2C_queen_of_France%2C_and_her_children_-_Elisabeth_Louise_Vig%C3%A9e-Lebrun_-_Google_Cultural_Institute.jpg"
    ],
    resources: [
      { name: "Smarthistory: Rococo Art", url: "https://smarthistory.org/rococo-intro/" }
    ],
    quiz: [
      { q: "Target audience?", opts: ["Church", "Peasants", "Wealthy Aristocracy"], ans: 2 },
      { q: "Color palette?", opts: ["Moody/Black", "Soft Pastels", "Acidic"], ans: 1 },
      { q: "Fête galante?", opts: ["Battle", "Outdoor party", "Martyrdom"], ans: 1 },
      { q: "What ended Rococo?", opts: ["Rome fall", "Printing press", "French Revolution"], ans: 2 },
      { q: "What is missing?", opts: ["Paint", "Serious moral lesson", "People"], ans: 1 }
    ]
  },
  {
    id: 17, 
    title: "Neoclassicism: Reason", 
    era: "1750 CE - 1850 CE",
    videoUrl: "https://www.youtube.com/watch?v=0_7BDc6vSHM", 
    lecture: "<h3>Duty to the State</h3><p>Neoclassicism brought a return to the strict logic of Ancient Rome and Greece to inspire citizens for the revolution.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Civic Duty:</strong> Art taught moral lessons about sacrificing personal life for the state.</li><li><strong>Invisible Brushstrokes:</strong> Perfectly smooth, razor-sharp outlines representing pure reason.</li><li><strong>Stage Sets:</strong> Staging paintings like Roman plays with severe architectural backgrounds.</li><li><strong>Architecture of Democracy:</strong> Linking new nations (like the US) to democratic ideals of the past.</li></ul>",
    criticalThinking: "Why would a political artist try to make a modern politician look like a religious martyr?",
    mission: "<strong>The Geometric Pose Study:</strong> Draw a human figure using only perfectly straight lines and sharp angles. No curves allowed.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/1/15/Jacques-Louis_David_-_Oath_of_the_Horatii_-_Google_Art_Project.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f6/Jacques-Louis_David_-_Marat_assassinated_-_Google_Art_Project_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/25/Pantheon_Paris_1.jpg"
    ],
    resources: [
      { name: "Smarthistory: Neoclassicism", url: "https://smarthistory.org/neoclassicism-an-introduction/" }
    ],
    quiz: [
      { q: "Movement?", opts: ["Counter-Reformation", "Enlightenment", "Industrial Revolution"], ans: 1 },
      { q: "Rejected style?", opts: ["Renaissance", "Romanesque", "Rococo"], ans: 2 },
      { q: "Brushstrokes?", opts: ["Impasto", "Smooth/Invisible", "Tiny dots"], ans: 1 },
      { q: "Moral message?", opts: ["Personal happiness", "Duty and Sacrifice", "Nature"], ans: 1 },
      { q: "US Architecture choice?", opts: ["Cheap", "Connect to Greece/Rome", "French architects"], ans: 1 }
    ]
  },
  {
    id: 18, 
    title: "Romanticism: The Sublime", 
    era: "1780 CE - 1850 CE",
    videoUrl: "https://www.youtube.com/watch?v=pBiGVlTLO6Q", 
    lecture: "<h3>Feeling Over Logic</h3><p>Romanticism celebrated raw emotion and the overwhelming, terrifying power of nature.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>The Sublime:</strong> The feeling of awe mixed with terror when facing something larger than yourself (storms, oceans).</li><li><strong>Reaction to Industry:</strong> A longing for the untamed natural world away from dirty factories.</li><li><strong>Injustice:</strong> Painting the horrific, bloody realities of modern war and execution.</li><li><strong>Expressive Brushstrokes:</strong> Thick, swirling explosions of paint used to convey emotion.</li></ul>",
    criticalThinking: "Do you see similarities between Romantic fears of factory machines and modern fears of AI?",
    mission: "<strong>The Scale Study:</strong> Draw a massive ocean wave and a tiny stick-figure human to create a feeling of awe.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c4/Francisco_de_Goya%2C_El_tres_de_mayo_de_1808_en_Madrid.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/30/The_Slave_Ship_-_Joseph_Mallord_William_Turner.jpg"
    ],
    resources: [
      { name: "Smarthistory: Romanticism", url: "https://smarthistory.org/romanticism-intro/" }
    ],
    quiz: [
      { q: "Rebellion against?", opts: ["Renaissance", "Neoclassicism", "Rococo"], ans: 1 },
      { q: "The Sublime?", opts: ["Awe mixed with terror", "Smooth strokes", "Peaceful party"], ans: 0 },
      { q: "Feared event?", opts: ["Rome fall", "Paint discovery", "Industrial Revolution"], ans: 2 },
      { q: "Paint handling?", opts: ["Expressive/Visible", "Flat", "Black/White only"], ans: 0 },
      { q: "Goya war view?", opts: ["Heroic", "Brutal slaughter", "Peaceful"], ans: 1 }
    ]
  },
  {
    id: 19, 
    title: "Realism: Truth", 
    era: "1840 CE - 1880 CE",
    videoUrl: "https://www.youtube.com/watch?v=Os6i6fneV-E", 
    lecture: "<h3>Show Me an Angel</h3><p>Realists wanted to paint the brutal, honest, everyday reality of modern life.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Visible Truth:</strong> If an artist cannot see it (like an angel), they won't paint it.</li><li><strong>Working Class Heroes:</strong> Painting dirty, anonymous peasants on massive canvases reserved for kings.</li><li><strong>Political Danger:</strong> Elevating the poor in art was a threat to the wealthy elite.</li><li><strong>Earthy Palette:</strong> Muddy browns and dull greens reflecting the dirt and grit of reality.</li></ul>",
    criticalThinking: "Why would a wealthy Parisian find a massive painting of a poor laborer threatening?",
    mission: "<strong>The Unflattering Truth:</strong> Draw the ugliest, most worn-out object in your house exactly as it is without making it look 'nice.'",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/Gustave_Courbet_-_A_Burial_at_Ornans_-_Google_Art_Project.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1f/Jean-Fran%C3%A7ois_Millet_-_Gleaners_-_Google_Art_Project_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Honor%C3%A9_Daumier_-_The_Third-Class_Carriage_-_Google_Art_Project.jpg"
    ],
    resources: [
      { name: "Smarthistory: Realism", url: "https://smarthistory.org/a-beginners-guide-to-realism/" }
    ],
    quiz: [
      { q: "Philosophy?", opts: ["Emotion", "Paint what you see", "Perfect math"], ans: 1 },
      { q: "Who said 'Show me an angel'?", opts: ["Da Vinci", "David", "Courbet"], ans: 2 },
      { q: "Scandal?", opts: ["Massive poor canvases", "Neon colors", "No perspective"], ans: 0 },
      { q: "Palette?", opts: ["Pastel", "Earthy/Muddy", "Gold"], ans: 1 },
      { q: "Subject?", opts: ["Hercules", "Men breaking rocks", "Pirate ship"], ans: 1 }
    ]
  },
  {
  id: 20,
  title: "Barbizon & Early Modern Vision: From Realism to Impressionism",
  era: "1830s - 1870s",
  videoUrl: "https://youtu.be/Yp4710qbxVQ?si=TVaEhM2ZFKiJBDDv",
  lecture: "<h3>The Bridge Between Truth and Light</h3><p>Before Impressionism fully exploded, artists were already changing how painting worked. The <strong>Barbizon School</strong> moved artists out of the studio and into forests and fields, painting nature with a new honesty and atmosphere. At the same time, <strong>photography</strong> and modern city life reshaped how people saw the world. Then artists like <strong>Édouard Manet</strong> shocked the Salon by painting modern subjects with bold, flattened paint and sharp contrasts.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Barbizon School:</strong> painters gathered near the Forest of Fontainebleau; they painted directly from nature and focused on mood, weather, and everyday rural life.</li><li><strong>Tonal Painting:</strong> earthy, limited palettes and value-based structure (light/dark) helped capture atmosphere before Impressionist color fireworks.</li><li><strong>Photography Impact:</strong> unexpected cropping, candid moments, and new ways of framing influenced composition.</li><li><strong>Manet & the Salon Shock:</strong> modern life as subject, flatter paint, strong edges. Not fully Impressionist, but he cracked the door open.</li><li><strong>From Earth to Light:</strong> Barbizon’s atmosphere + modern framing + Manet’s boldness becomes the runway for Impressionism.</li></ul>",
  criticalThinking: "If Barbizon painters already worked outdoors and studied atmosphere, why did Impressionism still feel like a ‘scandal’ and a revolution?",
  mission: "<strong>Barbizon-to-Impressionism Study (20 minutes):</strong> Go outside or use a window view. Make two quick sketches of the same scene: (1) a <em>tonal study</em> using only 3 values (dark/mid/light) like Barbizon, (2) a <em>light study</em> using 5 small color notes (no outlines) like early Impressionism. Compare which one feels more like ‘air.’",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Th%C3%A9odore_Rousseau_-_Forest_of_Fontainebleau.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Jean-Fran%C3%A7ois_Millet_-_The_Gleaners_-_Google_Art_Project_2.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/%C3%89douard_Manet_-_Olympia_-_Google_Art_Project.jpg?width=1400"
  ],
  resources: [
    { name: "Wikipedia: Barbizon school", url: "https://en.wikipedia.org/wiki/Barbizon_school" },
    { name: "Wikipedia: Édouard Manet", url: "https://en.wikipedia.org/wiki/%C3%89douard_Manet" },
    { name: "Smarthistory (browse): Manet / 19th-century France", url: "https://smarthistory.org/" }
  ],
  quiz: [
    { q: "The Barbizon School is best known for...", opts: ["Painting myths for kings", "Painting nature directly with mood and atmosphere", "Only painting perfect academic nudes"], ans: 1 },
    { q: "A key visual idea before Impressionism was...", opts: ["Tonal/value structure and atmosphere", "Only neon color", "Gold mosaic backgrounds"], ans: 0 },
    { q: "Photography influenced painters by introducing...", opts: ["Rounded arches", "Unexpected cropping and new framing", "Hieroglyphic writing"], ans: 1 },
    { q: "Manet matters in this transition because he...", opts: ["Returned to Byzantine icons", "Painted modern life with bold, flatter paint and shocked the Salon", "Invented Roman concrete"], ans: 1 },
    { q: "This ‘bridge’ period mainly prepares the way for Impressionism by...", opts: ["Moving painting toward light, atmosphere, and modern seeing", "Bringing back strict Egyptian rules", "Making painting only religious again"], ans: 0 }
  ]
},
{
  id: 21,
  title: "Impressionism: Painting Light, Not Objects",
  era: "1860s - 1880s",
  videoUrl: "https://youtu.be/vExG3Wgm4cQ?si=LXBKGUjYofGKLmtt",
  lecture: "<h3>Seeing Like a Camera Before Cameras Were Everywhere</h3><p>Impressionists rejected studio rules and academic finish. They painted <strong>fleeting light</strong>, quick moments, and modern life. Instead of smooth surfaces, you see visible brush marks that record perception.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>En plein air:</strong> painting outdoors to capture changing light.</li><li><strong>Broken brushwork:</strong> small strokes that blend in the viewer’s eye.</li><li><strong>Modern subjects:</strong> cafés, streets, leisure, railways.</li><li><strong>Color & atmosphere:</strong> shadows are not black, they are colored by light.</li></ul>",
  criticalThinking: "If Impressionism looks ‘unfinished,’ why did it feel more honest to modern life than perfect academic paintings?",
  mission: "<strong>Light Study (10 minutes):</strong> Pick one object near a window. Draw it three times as the light changes (morning / noon / evening). Only change the shadow color and direction, not the object.",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Claude_Monet_-_Impression,_soleil_levant.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Pierre-Auguste_Renoir_-_Bal_du_moulin_de_la_Galette.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Edgar_Degas_-_The_Ballet_Class.jpg?width=1400"
  ],
  resources: [
    { name: "Smarthistory: Impressionism", url: "https://smarthistory.org/a-beginners-guide-to-impressionism/" },
    { name: "Tate: Impressionism", url: "https://www.tate.org.uk/art/art-terms/i/impressionism" },
    { name: "The Met: Impressionism (Timeline)", url: "https://www.metmuseum.org/toah/hd/imml/hd_imml.htm" }
  ],
  quiz: [
    { q: "Impressionists often painted...", opts: ["Indoors only", "Outdoors to capture light", "Only religious icons"], ans: 1 },
    { q: "A key focus of Impressionism is...", opts: ["Perfect outlines", "Fleeting atmosphere and light", "Mythological battles"], ans: 1 },
    { q: "Impressionist shadows are usually...", opts: ["Pure black", "Colored by surrounding light", "Never painted"], ans: 1 },
    { q: "Typical Impressionist subject includes...", opts: ["Modern city life", "Ancient pyramids", "Medieval tympanums"], ans: 0 },
    { q: "The visible brushstrokes suggest...", opts: ["A record of perception", "A lack of paint", "Only sculpture"], ans: 0 }
  ]
},

{
  id: 22,
  title: "Post-Impressionism: Structure, Emotion, and Symbol",
  era: "1880s - 1905",
  videoUrl: "https://youtu.be/N-Mg-cxEJqc?si=TYSI6GSGidvK6oVP",
  lecture: "<h3>After Light: New Systems of Meaning</h3><p>Post-Impressionists admired Impressionism’s color but wanted more: <strong>structure</strong>, <strong>emotion</strong>, and <strong>symbolic meaning</strong>. They are not one style, but a set of powerful solutions to what art could do next.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Cézanne:</strong> build form with color planes; nature becomes geometry.</li><li><strong>Van Gogh:</strong> brushwork as emotion; paint becomes psychological pressure.</li><li><strong>Gauguin:</strong> symbolism, flat color, dream-like imagination.</li><li><strong>Pointillism:</strong> tiny dots of pure color (Seurat) based on optical theory.</li></ul>",
  criticalThinking: "If color can express emotion or belief, does ‘realistic color’ even matter anymore?",
  mission: "<strong>Color Emotion Map:</strong> Choose one memory. Draw a simple landscape from it using only 3 colors that match the feeling (not the real colors). Write one sentence explaining each color choice.",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vincent_van_Gogh_-_The_Starry_Night.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Paul_Cezanne_-_Mont_Sainte-Victoire.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Georges_Seurat_-_A_Sunday_on_La_Grande_Jatte.jpg?width=1400"
  ],
  resources: [
    { name: "Smarthistory: Post-Impressionism", url: "https://smarthistory.org/post-impressionism/" },
    { name: "Tate: Post-Impressionism", url: "https://www.tate.org.uk/art/art-terms/p/post-impressionism" },
    { name: "The Met: Post-Impressionism", url: "https://www.metmuseum.org/toah/hd/poim/hd_poim.htm" }
  ],
  quiz: [
    { q: "Post-Impressionism is best described as...", opts: ["One single unified style", "Multiple approaches after Impressionism", "Only sculpture"], ans: 1 },
    { q: "Cézanne is known for...", opts: ["Dots only", "Building form with color planes/geometry", "Gold mosaics"], ans: 1 },
    { q: "Van Gogh used brushwork mainly to show...", opts: ["Political laws", "Emotion and psychology", "Architecture engineering"], ans: 1 },
    { q: "Seurat’s technique involves...", opts: ["Optical dots of color", "Wet plaster fresco", "Carving stone"], ans: 0 },
    { q: "A core shift is that color can be...", opts: ["Only realistic", "Expressive/symbolic", "Forbidden"], ans: 1 }
  ]
},

{
  id: 23,
  title: "Symbolism: Dreams, Myths, and Inner Worlds",
  era: "1880s - 1910s",
  videoUrl: "https://youtu.be/hQQaVQhW1Is?si=vmkG_nTPthZQ7X7u",
  lecture: "<h3>When Reality Isn’t Enough</h3><p>Symbolists rejected modern industrial reality and turned toward <strong>dreams</strong>, <strong>myths</strong>, and the invisible world of desire, fear, and imagination. They believed art should suggest meanings rather than describe facts.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Inner psychology:</strong> art as a mirror of the mind.</li><li><strong>Myth & allegory:</strong> old stories become modern emotional metaphors.</li><li><strong>Atmosphere:</strong> hazy, mysterious spaces over clear realism.</li><li><strong>Bridge forward:</strong> opens the door to Surrealism later.</li></ul>",
  criticalThinking: "Why do people keep returning to myth and fantasy exactly when society becomes more ‘modern’ and ‘rational’?",
  mission: "<strong>Personal Symbol:</strong> Invent one symbol for a feeling (anxiety, hope, longing). Draw it three ways: simple icon, detailed illustration, abstract shape.",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Gustave_Moreau_-_The_Apparition.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Odilon_Redon_-_The_Cyclops.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Arnold_Bocklin_-_Isle_of_the_Dead.jpg?width=1400"
  ],
  resources: [
    { name: "Tate: Symbolism", url: "https://www.tate.org.uk/art/art-terms/s/symbolism" },
    { name: "Smarthistory: Symbolism", url: "https://smarthistory.org/symbolism/" },
    { name: "The Met: Symbolism", url: "https://www.metmuseum.org/toah/hd/symb/hd_symb.htm" }
  ],
  quiz: [
    { q: "Symbolism often focuses on...", opts: ["Inner worlds and suggestion", "Engineering arches", "Strict legal codes"], ans: 0 },
    { q: "Symbolists typically rejected...", opts: ["Dreams", "Modern industrial reality", "Myths"], ans: 1 },
    { q: "Symbolist imagery often uses...", opts: ["Allegory and myth", "Only realistic portraits", "Only geometric grids"], ans: 0 },
    { q: "Symbolism later influences...", opts: ["Surrealism", "Romanesque", "Ancient Egypt"], ans: 0 },
    { q: "Symbolism is usually...", opts: ["Literal and documentary", "Mysterious and atmospheric", "Only political propaganda"], ans: 1 }
  ]
},

{
  id: 24,
  title: "Fauvism: Color as a Wild Beast",
  era: "1905 - 1908",
  videoUrl: "https://youtu.be/tcjJEOapNKY?si=piETv6UDsRypsCjC",
  lecture: "<h3>When Color Breaks Free</h3><p>Fauvism explodes polite painting. Colors become intense, unnatural, and emotionally direct. The goal is not faithful description, but <strong>visual impact</strong> and <strong>expressive force</strong>.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Non-natural color:</strong> a face can be green, a shadow can be pink.</li><li><strong>Flattened space:</strong> less modeling, more bold shape.</li><li><strong>Decorative rhythm:</strong> color patterns create energy.</li><li><strong>Bridge:</strong> opens the door to Expressionism.</li></ul>",
  criticalThinking: "If color becomes emotional rather than descriptive, who decides what a ‘correct’ painting is?",
  mission: "<strong>Fauve Portrait:</strong> Draw a simple portrait and recolor it using 3 shocking colors (no skin tones allowed). Then write one line about what mood your palette creates.",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Henri_Matisse_-_Woman_with_a_Hat.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Andre_Derain_-_Charing_Cross_Bridge.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Henri_Matisse_-_The_Joy_of_Life.jpg?width=1400"
  ],
  resources: [
    { name: "Tate: Fauvism", url: "https://www.tate.org.uk/art/art-terms/f/fauvism" },
    { name: "Smarthistory: Fauvism", url: "https://smarthistory.org/fauvism/" },
    { name: "The Met: Fauvism", url: "https://www.metmuseum.org/toah/hd/fauv/hd_fauv.htm" }
  ],
  quiz: [
    { q: "Fauvism is famous for...", opts: ["Wild non-natural color", "Perfect realism", "Gold icons"], ans: 0 },
    { q: "Fauvist space tends to be...", opts: ["Deep and illusionistic", "Flattened and bold", "Only sculptural"], ans: 1 },
    { q: "The name ‘Fauves’ suggests...", opts: ["Wild beasts", "Stone temples", "Legal codes"], ans: 0 },
    { q: "Fauvism helps lead toward...", opts: ["Expressionism", "Romanesque", "Neoclassicism"], ans: 0 },
    { q: "In Fauvism, color is mainly...", opts: ["Emotional/expressive", "Always realistic", "Forbidden"], ans: 0 }
  ]
},

{
  id: 25,
  title: "Expressionism: Painting Feeling Under Pressure",
  era: "1905 - 1914",
  videoUrl: "https://youtu.be/YnsRLQ4A0hc?si=SUZAfPp6_bUY-iTZ",
  lecture: "<h3>Distortion as Truth</h3><p>Expressionism uses distortion, harsh color, and aggressive mark-making to show internal states. Instead of describing the external world, it reveals fear, anxiety, and intensity inside the body and mind.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Distortion:</strong> exaggeration becomes emotional evidence.</li><li><strong>Psychological space:</strong> environments reflect inner tension.</li><li><strong>Groups:</strong> Die Brücke, Der Blaue Reiter (Germany).</li><li><strong>Bridge:</strong> prepares viewers for abstraction.</li></ul>",
  criticalThinking: "Why might distortion feel more truthful than realism when describing modern anxiety?",
  mission: "<strong>Stress Landscape:</strong> Draw a room from memory when you felt stressed. Change the proportions to match the feeling: tilt walls, stretch objects, compress space.",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Edvard_Munch_-_The_Scream.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ernst_Ludwig_Kirchner_-_Street,_Berlin.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Wassily_Kandinsky_-_Improvisation_28.jpg?width=1400"
  ],
  resources: [
    { name: "Tate: Expressionism", url: "https://www.tate.org.uk/art/art-terms/e/expressionism" },
    { name: "Smarthistory: Expressionism", url: "https://smarthistory.org/expressionism/" },
    { name: "The Met: German Expressionism", url: "https://www.metmuseum.org/toah/hd/gexp/hd_gexp.htm" }
  ],
  quiz: [
    { q: "Expressionism prioritizes...", opts: ["Inner feeling", "Perfect proportion", "Historical propaganda"], ans: 0 },
    { q: "Distortion in Expressionism is used to...", opts: ["Hide meaning", "Express tension/emotion", "Obey academic rules"], ans: 1 },
    { q: "Expressionist environments often...", opts: ["Reflect psychology", "Disappear completely", "Become legal documents"], ans: 0 },
    { q: "Expressionism helps lead toward...", opts: ["Abstraction", "Cave painting", "Roman arches"], ans: 0 },
    { q: "A typical Expressionist mood is...", opts: ["Calm and neutral", "Intense/anxious", "Purely decorative"], ans: 1 }
  ]
},

{
  id: 26,
  title: "Cubism: Shattering Reality into Angles",
  era: "1907 - 1917",
  videoUrl: "https://youtu.be/IF-nmwm7-Bg?si=-VMrhDkHZG_Veldx",
  lecture: "<h3>Seeing All Sides at Once</h3><p>Cubism breaks objects into geometric facets and shows multiple viewpoints simultaneously. It rejects Renaissance perspective and replaces it with a new logic: perception is complex, fragmented, and constructed.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Multiple viewpoints:</strong> time and movement collapse into one image.</li><li><strong>Analytic Cubism:</strong> broken planes, limited color.</li><li><strong>Synthetic Cubism:</strong> collage, newspaper, mixed materials.</li><li><strong>Bridge:</strong> opens the door to many abstractions and design languages.</li></ul>",
  criticalThinking: "If Cubism shows multiple angles at once, is it closer to how the mind understands reality than a single ‘correct’ view?",
  mission: "<strong>Paper Collage Portrait:</strong> Make a cubist face using 6–10 paper shapes. Rotate one eye, flip the nose, and overlap planes. Add one real-world texture (newspaper, receipt, packaging).",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Pablo_Picasso_-_Les_Demoiselles_d%27Avignon.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Georges_Braque_-_Violin_and_Candlestick.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Picasso_-_Still_Life_with_Chair_Caning.jpg?width=1400"
  ],
  resources: [
    { name: "Smarthistory: Cubism", url: "https://smarthistory.org/cubism/" },
    { name: "Tate: Cubism", url: "https://www.tate.org.uk/art/art-terms/c/cubism" },
    { name: "The Met: Cubism", url: "https://www.metmuseum.org/toah/hd/cube/hd_cube.htm" }
  ],
  quiz: [
    { q: "Cubism rejects...", opts: ["Single-point Renaissance perspective", "All geometry", "All modern life"], ans: 0 },
    { q: "Analytic Cubism is often...", opts: ["Bright and decorative", "Broken planes with limited color", "Only gold"], ans: 1 },
    { q: "Synthetic Cubism commonly uses...", opts: ["Collage materials", "Wet plaster only", "Stone carving"], ans: 0 },
    { q: "Cubism shows...", opts: ["Multiple viewpoints", "Only one view", "Only religious symbols"], ans: 0 },
    { q: "Cubism influences later...", opts: ["Abstraction and design", "Only ancient temples", "Only Roman sculpture"], ans: 0 }
  ]
},

{
  id: 27,
  title: "Futurism & Dada: Speed, Chaos, Anti-Art",
  era: "1909 - 1924",
  videoUrl: "https://www.youtube.com/embed?listType=search&list=Futurism%20Dada%20art%20history",
  lecture: "<h3>When the World Breaks, Art Breaks Too</h3><p>Early 20th century shocks. Futurism celebrates speed, machines, and modern energy. Dada responds to war and absurdity by attacking logic, taste, and the idea of “serious art.”</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Futurism:</strong> motion lines, noise, technology worship.</li><li><strong>Dada:</strong> chance, nonsense, collage, readymades.</li><li><strong>Readymade:</strong> selecting an object and declaring it art.</li><li><strong>Bridge:</strong> leads directly to Conceptual Art later.</li></ul>",
  criticalThinking: "If choosing an object can be art, what is the role of skill… and why does that make people angry?",
  mission: "<strong>Readymade Choice:</strong> Pick one everyday object. Photograph it like a museum product shot. Give it a title that changes its meaning completely (serious, funny, or critical).",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Umberto_Boccioni_-_Unique_Forms_of_Continuity_in_Space.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hannah_Hoch_Cut_with_the_Kitchen_Knife.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Marcel_Duchamp_-_Fountain.jpg?width=1400"
  ],
  resources: [
    { name: "Tate: Futurism", url: "https://www.tate.org.uk/art/art-terms/f/futurism" },
    { name: "Tate: Dada", url: "https://www.tate.org.uk/art/art-terms/d/dada" },
    { name: "Smarthistory: Dada", url: "https://smarthistory.org/dada/" }
  ],
  quiz: [
    { q: "Futurism often celebrates...", opts: ["Speed and machines", "Ancient rituals", "Quiet domestic still life"], ans: 0 },
    { q: "Dada reacts strongly to...", opts: ["Perfect harmony", "War and absurdity", "Linear perspective"], ans: 1 },
    { q: "A readymade is...", opts: ["A hand-carved statue", "An ordinary object declared art", "A gold mosaic"], ans: 1 },
    { q: "Dada techniques often include...", opts: ["Chance and collage", "Only oil glazing", "Only fresco"], ans: 0 },
    { q: "Readymades later influence...", opts: ["Conceptual Art", "Romanesque", "Ancient Egypt"], ans: 0 }
  ]
},

{
  id: 28,
  title: "Surrealism: The Logic of Dreams",
  era: "1920s - 1940s",
  videoUrl: "https://www.youtube.com/embed?listType=search&list=Surrealism%20art%20history",
  lecture: "<h3>Painting the Subconscious</h3><p>Surrealists explore dreams, unconscious desire, and psychological symbolism. Influenced by Freud, they treat the mind as a landscape where strange objects feel normal and logic dissolves.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Dream imagery:</strong> familiar things placed in impossible situations.</li><li><strong>Automatic methods:</strong> letting chance and free association guide making.</li><li><strong>Symbolic objects:</strong> meanings shift through context.</li><li><strong>Bridge:</strong> influences film, photography, contemporary imagination.</li></ul>",
  criticalThinking: "If dreams are irrational, why do they still feel emotionally ‘true’ to us?",
  mission: "<strong>Dream Object Swap:</strong> Choose two objects that don’t belong together (e.g., fish + teacup). Draw them merged into one believable object. Add one line explaining what it might symbolize.",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Salvador_Dali_-_The_Persistence_of_Memory.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Rene_Magritte_-_The_Treachery_of_Images.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Max_Ernst_-_The_Elephant_Celebes.jpg?width=1400"
  ],
  resources: [
    { name: "Tate: Surrealism", url: "https://www.tate.org.uk/art/art-terms/s/surrealism" },
    { name: "Smarthistory: Surrealism", url: "https://smarthistory.org/surrealism/" },
    { name: "The Met: Surrealism", url: "https://www.metmuseum.org/toah/hd/surr/hd_surr.htm" }
  ],
  quiz: [
    { q: "Surrealism is strongly linked to...", opts: ["The unconscious and dreams", "Roman law", "Ziggurat construction"], ans: 0 },
    { q: "Surrealist images often...", opts: ["Follow strict realism only", "Mix familiar objects in impossible ways", "Avoid imagination"], ans: 1 },
    { q: "Automatic methods aim to...", opts: ["Control every detail logically", "Reduce conscious control", "Copy museum labels"], ans: 1 },
    { q: "Surrealism was influenced by...", opts: ["Freud", "Hammurabi", "Brunelleschi"], ans: 0 },
    { q: "Surrealism strongly influences...", opts: ["Modern visual culture/film", "Only medieval churches", "Only cave rituals"], ans: 0 }
  ]
},

{
  id: 29,
  title: "Abstract Expressionism: Painting as a Record of Being",
  era: "1940s - 1950s",
  videoUrl: "https://www.youtube.com/embed?listType=search&list=Abstract%20Expressionism%20art%20history",
  lecture: "<h3>After War: Gesture, Scale, and Presence</h3><p>After WWII, New York becomes a major art center. Abstract Expressionism emphasizes scale, gesture, and the canvas as an arena of action. The painting becomes a physical record of presence, pressure, and decision.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Action painting:</strong> movement and gesture are visible (Pollock).</li><li><strong>Color field:</strong> vast fields of color as emotional space (Rothko).</li><li><strong>Monumental scale:</strong> the viewer is physically absorbed.</li><li><strong>Bridge:</strong> leads to Minimalism and Conceptual reactions.</li></ul>",
  criticalThinking: "If a painting is ‘just’ marks and color, why can it still feel like a powerful emotional experience?",
  mission: "<strong>Gesture Sheet:</strong> Set a 2-minute timer. Fill one page with continuous marks without lifting your pen. Then circle the area that feels most intense and explain why.",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Jackson_Pollock_Number_1A_1948.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Mark_Rothko_Seagram_Murals.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Willem_de_Kooning_Woman_I.jpg?width=1400"
  ],
  resources: [
    { name: "Tate: Abstract Expressionism", url: "https://www.tate.org.uk/art/art-terms/a/abstract-expressionism" },
    { name: "Smarthistory: Abstract Expressionism", url: "https://smarthistory.org/abstract-expressionism/" },
    { name: "MoMA: Abstract Expressionism", url: "https://www.moma.org/learn/moma_learning/themes/abstract-expressionism/" }
  ],
  quiz: [
    { q: "Abstract Expressionism becomes prominent in...", opts: ["New York after WWII", "Ancient Greece", "Medieval France"], ans: 0 },
    { q: "Action painting emphasizes...", opts: ["Gesture and movement", "Perfect outlines", "Religious icons"], ans: 0 },
    { q: "Color field painting often uses...", opts: ["Vast areas of color", "Only dots", "Only collage"], ans: 0 },
    { q: "A key idea is that the painting records...", opts: ["Presence/decision", "Legal codes", "Temple engineering"], ans: 0 },
    { q: "This movement helps lead to...", opts: ["Minimalism", "Romanesque", "Egyptian canon"], ans: 0 }
  ]
},

{
  id: 30,
  title: "Pop Art: Images, Brands, Mass Media",
  era: "1950s - 1970s",
  videoUrl: "https://www.youtube.com/embed?listType=search&list=Pop%20Art%20history",
  lecture: "<h3>When the Everyday Becomes the Icon</h3><p>Pop Art pulls imagery from advertising, comics, celebrities, and products. It blurs high art and popular culture. Sometimes it celebrates mass media, sometimes it critiques it, and often it does both at once.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Appropriation begins:</strong> reuse of mass images.</li><li><strong>Repetition:</strong> like factory production or media circulation.</li><li><strong>Cool surface:</strong> clean, graphic styles mimic commercial design.</li><li><strong>Question:</strong> is culture something we consume, or something consuming us?</li></ul>",
  criticalThinking: "If Pop Art uses the same images as advertisements, how do you tell the difference between critique and promotion?",
  mission: "<strong>Pop Poster Remix:</strong> Choose one everyday product at home. Redesign its label as a ‘Pop’ artwork using bold text and flat shapes. Change the slogan to reveal a hidden truth (funny or critical).",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Andy_Warhol_1975.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Roy_Lichtenstein_Whaam.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Pop_art_exhibition_view.jpg?width=1400"
  ],
  resources: [
    { name: "Tate: Pop Art", url: "https://www.tate.org.uk/art/art-terms/p/pop-art" },
    { name: "Smarthistory: Pop Art", url: "https://smarthistory.org/pop-art/" },
    { name: "MoMA: Pop Art", url: "https://www.moma.org/learn/moma_learning/themes/pop/" }
  ],
  quiz: [
    { q: "Pop Art often uses imagery from...", opts: ["Mass media and consumer culture", "Only ancient myths", "Only religious icons"], ans: 0 },
    { q: "A common Pop strategy is...", opts: ["Repetition like mass production", "Invisible brushwork only", "Gold mosaic tiles"], ans: 0 },
    { q: "Pop Art blurs the boundary between...", opts: ["High art and popular culture", "Stone and clay", "Heaven and earth"], ans: 0 },
    { q: "Pop style often looks...", opts: ["Graphic and commercial", "Only painterly and soft", "Only carved"], ans: 0 },
    { q: "Pop Art can be both...", opts: ["Critique and celebration", "Only ancient ritual", "Only realism"], ans: 0 }
  ]
}, 

 {
  id: 31,
  title: "Minimalism: Less, But Louder",
  era: "1960s - 1970s",
  videoUrl: "https://www.youtube.com/embed?listType=search&list=Minimalism%20art%20history",
  lecture: "<h3>When the Artwork Refuses to Perform</h3><p>Minimalism takes a cold shower after Abstract Expressionism’s big emotions. Instead of dramatic gestures, it chooses <strong>simple forms</strong>, <strong>industrial materials</strong>, and <strong>clarity</strong>. The artwork becomes an object in real space, and the viewer’s movement becomes part of the experience.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Industrial materials:</strong> metal, plexiglass, fluorescent light, factory finishes.</li><li><strong>Objecthood:</strong> the artwork is not a “window” into a scene, it’s a thing in the room.</li><li><strong>Serial repetition:</strong> repeated units and grids reduce personal “handwriting.”</li><li><strong>Viewer awareness:</strong> your body, distance, and angle matter.</li></ul><p><strong>Bridge from Pop:</strong> Pop mirrors mass culture; Minimalism strips culture away and asks you to face pure form and space.</p>",
  criticalThinking: "If Minimalism removes storytelling and emotion, what’s left for the viewer to ‘read’… and is that uncomfortable on purpose?",
  mission: "<strong>3-Shape Installation:</strong> Cut three identical rectangles from cardboard. Place them in your room in three different arrangements. Photograph each setup. Which arrangement changes the space the most, and why?",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Donald_Judd_untitled_1969.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Dan_Flavin_installation.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Minimalist_sculpture_museum_installation.jpg?width=1400"
  ],
  resources: [
    { name: "Tate: Minimalism", url: "https://www.tate.org.uk/art/art-terms/m/minimalism" },
    { name: "Smarthistory: Minimalism", url: "https://smarthistory.org/minimalism/" },
    { name: "MoMA: Minimalism", url: "https://www.moma.org/learn/moma_learning/themes/minimalism/" }
  ],
  quiz: [
    { q: "Minimalism often uses...", opts: ["Industrial materials and simple forms", "Gold backgrounds and halos", "Mythological battle scenes"], ans: 0 },
    { q: "Minimalist art emphasizes...", opts: ["Illusionistic depth", "Objecthood in real space", "Hidden religious symbolism"], ans: 1 },
    { q: "Serial repetition in Minimalism helps reduce...", opts: ["Viewer experience", "Personal handwriting/expressive gesture", "Geometry"], ans: 1 },
    { q: "A key point is that the viewer’s...", opts: ["Movement and body matter", "Must be ignored", "Should only read text"], ans: 0 },
    { q: "Minimalism reacts against the drama of...", opts: ["Abstract Expressionism", "Ancient Egypt", "Romanesque"], ans: 0 }
  ]
},

{
  id: 32,
  title: "Conceptual Art: The Idea Is the Artwork",
  era: "1960s - 1980s",
  videoUrl: "https://www.youtube.com/embed?listType=search&list=Conceptual%20art%20history",
  lecture: "<h3>Art Moves from Object to Thought</h3><p>Conceptual Art pushes a radical claim: the <strong>idea</strong> matters more than the object. Sometimes the object is secondary, temporary, or doesn’t exist at all. Language, instructions, documentation, and systems become artistic material.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Dematerialization:</strong> art can be a plan, a text, a rule, or a record.</li><li><strong>Language as medium:</strong> words can build an artwork in your mind.</li><li><strong>Institution critique begins:</strong> museums, labels, and authority become part of the artwork.</li><li><strong>Authorship questioned:</strong> if anyone can execute the idea, who is the artist?</li></ul>",
  criticalThinking: "If the artwork is an instruction that anyone can follow, what exactly are you paying for: labor, the idea, or social permission?",
  mission: "<strong>Instruction Artwork:</strong> Write a 5-step instruction that creates an artwork using only objects already in a home. Make it precise. Then test it yourself and photograph the result.",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Joseph_Kosuth_One_and_Three_Chairs.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Conceptual_art_text_installation.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Museum_label_conceptual_display.jpg?width=1400"
  ],
  resources: [
    { name: "Tate: Conceptual Art", url: "https://www.tate.org.uk/art/art-terms/c/conceptual-art" },
    { name: "Smarthistory: Conceptual Art", url: "https://smarthistory.org/conceptual-art/" },
    { name: "MoMA: Conceptual Art", url: "https://www.moma.org/learn/moma_learning/themes/conceptual-art/" }
  ],
  quiz: [
    { q: "Conceptual Art claims the most important part is...", opts: ["The frame", "The idea/concept", "The artist’s realistic skill"], ans: 1 },
    { q: "‘Dematerialization’ means...", opts: ["Art becomes only stone", "Art may exist as text/instruction/documentation", "Art must be painted outdoors"], ans: 1 },
    { q: "Conceptual Art often uses...", opts: ["Language and systems", "Only oil glazing", "Only marble carving"], ans: 0 },
    { q: "If anyone can execute the work, it challenges...", opts: ["Authorship", "Gravity", "Perspective"], ans: 0 },
    { q: "Conceptual Art often asks who controls...", opts: ["Meaning and authority", "Cave rituals", "Ziggurat engineering"], ans: 0 }
  ]
},

{
  id: 33,
  title: "Performance & Body Art: Art as Action",
  era: "1960s - 1990s",
  videoUrl: "https://www.youtube.com/embed?listType=search&list=Performance%20art%20body%20art%20history",
  lecture: "<h3>The Artist’s Body Becomes the Medium</h3><p>Performance and Body Art move the artwork from object to event. The body becomes material, and time becomes structure. Documentation (photos/video/text) often becomes the only trace left afterward.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Time-based art:</strong> meaning unfolds through duration and presence.</li><li><strong>Audience relationship:</strong> viewers are witnesses, participants, or part of the work’s ethics.</li><li><strong>Identity & politics:</strong> gender, race, power, and vulnerability become central themes.</li><li><strong>Documentation:</strong> the record becomes the archive and sometimes the ‘product’.</li></ul>",
  criticalThinking: "If a performance only exists in the moment, is the ‘real artwork’ the action itself, or the documentation that survives?",
  mission: "<strong>One-Minute Performance Score:</strong> Design a 60-second silent action that communicates one idea (pressure, joy, memory, resistance). Perform it once. Document with a single photo and a 3-sentence description.",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Performance_art_documentation_photo.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Marina_Abramovic_The_Artist_Is_Present.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Performance_installation_audience.jpg?width=1400"
  ],
  resources: [
    { name: "Tate: Performance Art", url: "https://www.tate.org.uk/art/art-terms/p/performance-art" },
    { name: "MoMA: Performance", url: "https://www.moma.org/learn/moma_learning/themes/performance/" },
    { name: "Smarthistory: Performance Art", url: "https://smarthistory.org/performance-art/" }
  ],
  quiz: [
    { q: "Performance art is primarily...", opts: ["An object to hang", "An action/event in time", "A carved monument"], ans: 1 },
    { q: "Body Art often treats the body as...", opts: ["Only a model to copy", "A medium/material", "Something irrelevant"], ans: 1 },
    { q: "Documentation matters because...", opts: ["It is often the only trace left", "It replaces the audience entirely", "It prevents meaning"], ans: 0 },
    { q: "Performance often involves the audience as...", opts: ["Witness/participant", "Invisible", "Only buyers"], ans: 0 },
    { q: "Common themes include identity and...", opts: ["Politics/power", "Only farming", "Only ancient myths"], ans: 0 }
  ]
},

{
  id: 34,
  title: "Postmodernism: Remix, Critique, and Doubt",
  era: "1970s - 1990s",
  videoUrl: "https://www.youtube.com/embed?listType=search&list=Postmodernism%20art%20history",
  lecture: "<h3>When the Grand Narratives Collapse</h3><p>Postmodernism is suspicious of claims like “progress,” “genius,” and “one true style.” It loves remix, quotation, parody, and critique. Artists question authorship, originality, and the power systems inside museums, media, and culture.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Appropriation:</strong> reusing existing images to expose meaning and power.</li><li><strong>Irony & parody:</strong> seriousness is not always trusted.</li><li><strong>Institution critique:</strong> who gets to define art?</li><li><strong>Pluralism:</strong> many styles coexist, no single ‘correct’ direction.</li></ul>",
  criticalThinking: "If everything is a remix, can originality still exist… or is originality just smart selection plus strong context?",
  mission: "<strong>Reframe an Image:</strong> Pick one famous artwork image (public domain) and rewrite its caption in two ways: (1) museum voice, (2) critical voice. Notice how language controls meaning.",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Appropriation_art_exhibition_wall.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Barbara_Kruger_installation.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Postmodern_art_museum_gallery.jpg?width=1400"
  ],
  resources: [
    { name: "Tate: Postmodernism", url: "https://www.tate.org.uk/art/art-terms/p/postmodernism" },
    { name: "Smarthistory: Postmodernism", url: "https://smarthistory.org/postmodernism/" },
    { name: "MoMA: Appropriation", url: "https://www.moma.org/learn/moma_learning/themes/appropriation/" }
  ],
  quiz: [
    { q: "Postmodernism is often suspicious of...", opts: ["Single grand narratives and ‘one truth’", "All images", "All materials"], ans: 0 },
    { q: "Appropriation means...", opts: ["Reusing existing images with new context", "Never referencing anything", "Only painting outdoors"], ans: 0 },
    { q: "Institution critique asks...", opts: ["Who defines art and why", "How to mix pigment", "How to carve stone"], ans: 0 },
    { q: "Pluralism means...", opts: ["Only one style allowed", "Multiple styles coexist", "No viewers allowed"], ans: 1 },
    { q: "A common Postmodern tone is...", opts: ["Irony/parody", "Pure religious devotion", "Perfect academic realism"], ans: 0 }
  ]
},

{
  id: 35,
  title: "Global Contemporary: Identity, Power, Systems",
  era: "1990s - 2010s",
  videoUrl: "https://www.youtube.com/embed?listType=search&list=Contemporary%20art%20identity%20institutional%20critique",
  lecture: "<h3>Contemporary Art as a Global Conversation</h3><p>From the 1990s onward, contemporary art becomes intensely global and politically aware. Artists address identity, migration, capitalism, ecology, technology, archives, and power. The work is often installation-based, research-driven, or socially engaged.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Identity & representation:</strong> who is seen, who is erased?</li><li><strong>Systems thinking:</strong> institutions, markets, media, and history as structures.</li><li><strong>Archive & memory:</strong> collecting evidence, rewriting narratives.</li><li><strong>Installation:</strong> immersive environments replace single objects.</li></ul>",
  criticalThinking: "If an artwork is about a social issue, what makes it art instead of journalism or activism… and do we even need a hard boundary?",
  mission: "<strong>Micro-Archive Project:</strong> Collect 12 small items or photos around one theme (home, language, childhood, migration, waste). Arrange them as an ‘archive display’ and write a 5-line wall label.",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Contemporary_art_installation_museum.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Documenta_exhibition_view.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Venice_Biennale_exhibition_view.jpg?width=1400"
  ],
  resources: [
    { name: "Tate: Contemporary Art", url: "https://www.tate.org.uk/art/art-terms/c/contemporary-art" },
    { name: "Smarthistory: Contemporary Art", url: "https://smarthistory.org/contemporary-art/" },
    { name: "MoMA: Contemporary Art", url: "https://www.moma.org/learn/moma_learning/themes/contemporary-art/" }
  ],
  quiz: [
    { q: "Contemporary art after 1990s is often...", opts: ["Global and system-aware", "Only religious icons", "Only landscape realism"], ans: 0 },
    { q: "An ‘archive’ approach in art often means...", opts: ["Collecting evidence/memory to shape meaning", "Destroying all records", "Only using gold"], ans: 0 },
    { q: "Installation art emphasizes...", opts: ["Immersive space and viewer experience", "Only tiny canvases", "Only portraits"], ans: 0 },
    { q: "A key contemporary theme is often...", opts: ["Identity and power", "Only mythology", "Only architecture techniques"], ans: 0 },
    { q: "Contemporary works can blur boundaries between art and...", opts: ["Research/activism/journalism", "Stone carving only", "Cave rituals only"], ans: 0 }
  ]
},

{
  id: 36,
  title: "New Media & AI: Images After the Machine",
  era: "2000s - Present",
  videoUrl: "https://www.youtube.com/embed?listType=search&list=New%20media%20art%20AI%20art%20history",
  lecture: "<h3>When Tools Become Co-Authors</h3><p>New Media art uses video, code, networks, sensors, AR/VR, and now AI. The artwork may be interactive, generative, or distributed online. Questions shift from “what does it look like” to “how does it behave” and “who controls the system.”</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Code as material:</strong> rules can generate endless variations.</li><li><strong>Interactivity:</strong> the viewer becomes a user, sometimes a co-creator.</li><li><strong>Network culture:</strong> circulation, memes, and platforms shape meaning.</li><li><strong>AI & authorship:</strong> training data, bias, and attribution become artistic problems.</li></ul><p><strong>Bridge:</strong> Conceptual Art says the idea matters. New Media asks: what happens when the <strong>system</strong> is the idea?</p>",
  criticalThinking: "If AI can generate images instantly, what becomes the artist’s unique value: taste, ethics, storytelling, or building the system itself?",
  mission: "<strong>Prompt-as-Concept:</strong> Write 3 prompts for the same theme (e.g., ‘memory of home’). One prompt should control composition, one controls material/texture, one controls emotion/meaning. Compare results and write what changed and why.",
  images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Interactive_media_art_installation.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Video_art_installation_museum.jpg?width=1400",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Digital_art_exhibition_projection.jpg?width=1400"
  ],
  resources: [
    { name: "Tate: New Media Art", url: "https://www.tate.org.uk/art/art-terms/n/new-media-art" },
    { name: "MoMA: Media and Performance (learning)", url: "https://www.moma.org/learn/moma_learning/themes/media-and-performance/" },
    { name: "Smarthistory: Digital Art (overview)", url: "https://smarthistory.org/digital-art/" }
  ],
  quiz: [
    { q: "New Media art often uses...", opts: ["Code, video, networks, sensors", "Only marble", "Only fresco"], ans: 0 },
    { q: "Generative art means...", opts: ["A system can generate variations", "Copying one image forever", "Painting only outdoors"], ans: 0 },
    { q: "Interactivity changes the viewer into a...", opts: ["User/participant", "Passive statue", "Only buyer"], ans: 0 },
    { q: "AI raises questions about...", opts: ["Authorship and training data", "How to build ziggurats", "How to make mosaics"], ans: 0 },
    { q: "A core shift is from 'what it looks like' to...", opts: ["How it behaves as a system", "How shiny gold is", "How ancient it is"], ans: 0 }
  ]
}    
  ] // ✅ 这里是 lessons 数组的结束
},  
      
  china: {
    label: "Chinese Art History",
    desc: "From Prehistoric ritual to Contemporary ink & concept",
    lessons: [
    {
      id: 1,
      title: "Origins: Neolithic Art & Ritual Objects",
      era: "c. 7000 BCE – 2000 BCE",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Neolithic%20China%20art%20Banpo%20Liangzhu%20jade",
      lecture: "<h3>Before Dynasties: Pattern, Pottery, and Power</h3><p>Long before written history, Neolithic communities in China produced art that was deeply tied to daily life, identity, and early ritual systems. Pottery painting, jade carving, and village planning reveal how visual culture formed social order.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Painted Pottery:</strong> Cultures like Banpo used geometric motifs to mark identity and belief.</li><li><strong>Jade as Ritual Power:</strong> Liangzhu jades (cong and bi) suggest elite authority and cosmology.</li><li><strong>Craft = Knowledge:</strong> Materials (clay/jade) shaped style and meaning.</li><li><strong>Pattern as Language:</strong> Repetition became a visual system before writing.</li></ul>",
      criticalThinking: "Why would a society invest huge labor into carving jade objects that are not practical tools? What kind of power does ‘ritual material’ create?",
      mission: "<strong>Pattern-to-Meaning Study:</strong> Design a simple ‘village symbol’ using only 3 shapes (circle/triangle/square). Repeat it as a pattern on a cup/bowl drawing. Write 2 sentences about what your symbol stands for (protection? family? water?).",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Banpo%20pottery%20jar.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Liangzhu%20jade%20cong.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Liangzhu%20jade%20bi.jpg?width=1400"
      ],
      resources: [
        { name: "The Met: Neolithic Art in China (search)", url: "https://www.metmuseum.org/toah/" },
        { name: "Wikipedia: Liangzhu culture", url: "https://en.wikipedia.org/wiki/Liangzhu_culture" },
        { name: "Wikipedia: Banpo", url: "https://en.wikipedia.org/wiki/Banpo" }
      ],
      quiz: [
        { q: "Which material became a key marker of elite ritual power in late Neolithic China?", opts: ["Glass", "Jade", "Steel"], ans: 1 },
        { q: "Liangzhu cong/bi objects are most connected to...", opts: ["Industrial factories", "Ritual and cosmology", "Oil painting"], ans: 1 },
        { q: "Neolithic painted pottery patterns functioned as...", opts: ["Pure decoration only", "A visual language and identity marker", "Written text"], ans: 1 },
        { q: "A major idea in early Chinese art is that craft skill equals...", opts: ["Fashion", "Knowledge and social order", "Random luck"], ans: 1 },
        { q: "Neolithic art is important because it shows...", opts: ["The first smartphones", "The birth of visual systems before writing", "Only war scenes"], ans: 1 }
      ]
    },

    {
      id: 2,
      title: "Shang Dynasty: Bronze, Ancestors, and Authority",
      era: "c. 1600 BCE – 1046 BCE",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Shang%20dynasty%20bronze%20taotie%20Anyang%20art",
      lecture: "<h3>Bronze as Political Theology</h3><p>Shang bronzes were not ‘decorative.’ They were ritual machines used to communicate with ancestors and legitimize kingship. Their scale and technical complexity show how art can operate as state power.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Ritual Vessels:</strong> Ding, gui, and other forms used in ancestor offerings.</li><li><strong>Taotie Motif:</strong> Mask-like designs linked to myth, warning, or sacred presence.</li><li><strong>Piece-Mold Casting:</strong> A uniquely Chinese bronze technology enabling high detail.</li><li><strong>Art = Authority:</strong> Control of bronze production equals control of ritual legitimacy.</li></ul>",
      criticalThinking: "If a ruler controls the ritual vessels, does that mean they control ‘truth’ and history too? Why?",
      mission: "<strong>Mask Design Study:</strong> Create a symmetrical ‘taotie-inspired’ mask using only curves and triangles. Keep it abstract (no cute faces). Focus on balance and tension.",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Shang%20bronze%20ding.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Houmu%20Ding.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Taotie%20motif%20bronze.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Shang dynasty", url: "https://en.wikipedia.org/wiki/Shang_dynasty" },
        { name: "British Museum: Chinese bronzes (search)", url: "https://www.britishmuseum.org/collection" },
        { name: "The Met: Chinese bronzes (search)", url: "https://www.metmuseum.org/art/collection/search" }
      ],
      quiz: [
        { q: "Shang bronzes were primarily used for...", opts: ["Ritual offerings and ancestor communication", "Cooking daily meals", "Street advertising"], ans: 0 },
        { q: "The taotie is best described as...", opts: ["A realistic portrait", "A mask-like sacred motif", "A landscape style"], ans: 1 },
        { q: "A key bronze technique in Shang China was...", opts: ["Piece-mold casting", "3D printing", "Oil glazing"], ans: 0 },
        { q: "Why does bronze matter politically?", opts: ["It is shiny", "It links rulers to ritual legitimacy", "It makes music louder"], ans: 1 },
        { q: "Ritual objects often function as...", opts: ["Power symbols", "Random toys", "Private diaries only"], ans: 0 }
      ]
    },

    {
      id: 3,
      title: "Zhou & Warring States: Ritual to Philosophy",
      era: "1046 BCE – 221 BCE",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Zhou%20dynasty%20bronze%20inscriptions%20Warring%20States%20lacquer",
      lecture: "<h3>From Ancestral Ritual to Competing Ideas</h3><p>As political power fragmented, art diversified: bronze inscriptions expanded historical memory, lacquerware refined elite taste, and new philosophies shaped how culture justified authority.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Bronze Inscriptions:</strong> Text as commemoration and political record.</li><li><strong>Lacquer & Luxury:</strong> Complex craft, bold color, elite mobility.</li><li><strong>Regional Styles:</strong> Competing states produced distinct aesthetics.</li><li><strong>Art and Ideology:</strong> Confucian/Daoist thought reframed moral order.</li></ul>",
      criticalThinking: "When art begins to include long inscriptions, who is ‘art’ for: the public, the ancestors, or future political legitimacy?",
      mission: "<strong>Inscription Design:</strong> Create a ‘commemorative object label’ for an imaginary victory or life event. Use 3 lines of text (English is fine) and a simple border pattern.",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Western%20Zhou%20bronze%20inscription.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Warring%20States%20lacquerware.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Warring%20States%20bronze%20mirror.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Zhou dynasty", url: "https://en.wikipedia.org/wiki/Zhou_dynasty" },
        { name: "Wikipedia: Warring States period", url: "https://en.wikipedia.org/wiki/Warring_States_period" }
      ],
      quiz: [
        { q: "A key new feature in Zhou bronzes is...", opts: ["Neon colors", "Long inscriptions", "Photographic realism"], ans: 1 },
        { q: "Lacquerware is associated with...", opts: ["Elite craft and luxury", "Cheap mass plastic", "Marble carving only"], ans: 0 },
        { q: "Art in Warring States becomes more...", opts: ["Uniform", "Regionally diverse", "Completely abstract"], ans: 1 },
        { q: "Inscriptions often function as...", opts: ["Political memory", "Random decoration", "Jokes"], ans: 0 },
        { q: "This period is defined by...", opts: ["One unified empire", "Competing states and ideas", "No philosophy"], ans: 1 }
      ]
    },

    {
      id: 4,
      title: "Qin & Han: Empire, Tombs, and the Afterlife",
      era: "221 BCE – 220 CE",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Qin%20Han%20tomb%20art%20terracotta%20army%20Han%20painted%20silk",
      lecture: "<h3>Art for an Eternal State</h3><p>With unification, visual culture scaled up. Tombs became miniature worlds: armies, maps, cosmology, and daily life were rebuilt for the afterlife, proving that empire extended beyond death.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Terracotta Army:</strong> Standardization + individuality in mass production.</li><li><strong>Han Tomb Art:</strong> Brick reliefs, murals, and mingqi (spirit objects).</li><li><strong>Cosmology:</strong> Heaven/Earth models; banners and diagrams.</li><li><strong>State Aesthetics:</strong> Art as an extension of imperial control.</li></ul>",
      criticalThinking: "Why build a ‘complete world’ underground? Is it belief, propaganda, or both?",
      mission: "<strong>Tomb World Blueprint:</strong> Draw a simple plan of an ‘afterlife room’ for an imaginary ruler. Include 5 objects that show power, daily life, and belief.",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Terracotta%20Army%2C%20View%20of%20pit%201.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Han%20dynasty%20tomb%20relief.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Mawangdui%20silk%20funerary%20banner.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Terracotta Army", url: "https://en.wikipedia.org/wiki/Terracotta_Army" },
        { name: "Wikipedia: Han dynasty art", url: "https://en.wikipedia.org/wiki/Han_dynasty_art" }
      ],
      quiz: [
        { q: "The Terracotta Army demonstrates...", opts: ["Only individual handmade work", "Mass production with variation", "Purely modern technology"], ans: 1 },
        { q: "Han tombs often contained...", opts: ["Only empty rooms", "Spirit objects and murals", "Digital screens"], ans: 1 },
        { q: "A major theme is...", opts: ["Cosmology and afterlife worlds", "Sports trophies", "Cooking recipes"], ans: 0 },
        { q: "Empire art often supports...", opts: ["Imperial ideology", "Random chaos", "No purpose"], ans: 0 },
        { q: "Why include daily life objects in tombs?", opts: ["To rebuild a usable afterlife world", "To confuse thieves only", "For fashion"], ans: 0 }
      ]
    },

    {
      id: 5,
      title: "Buddhism Arrives: Six Dynasties & Cave Temples",
      era: "220 – 589",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Longmen%20Yungang%20Dunhuang%20Buddhist%20cave%20art%20China",
      lecture: "<h3>New Religion, New Image World</h3><p>Buddhism transformed Chinese art. Monumental caves like Yungang, Longmen, and Dunhuang became immersive visual universes where sculpture, painting, and architecture fused into spiritual technology.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Cave Temples:</strong> Carved mountains as sacred interiors.</li><li><strong>Iconography:</strong> Buddhas, bodhisattvas, guardian figures.</li><li><strong>Stylistic Shifts:</strong> From Central Asian influence to Sinicized forms.</li><li><strong>Donor Culture:</strong> Art funded by rulers, elites, and communities.</li></ul>",
      criticalThinking: "Why does a religion need images, and why do images become powerful enough to reshape an entire culture?",
      mission: "<strong>Halo & Gesture Study:</strong> Draw a simple seated figure. Create 3 versions by changing only the halo shape and hand gesture (mudra). Note how meaning shifts.",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Longmen%20Grottoes%20Vairocana%20Buddha.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Yungang%20Grottoes%20Buddha.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Dunhuang%20Mogao%20Caves%20mural.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Longmen Grottoes", url: "https://en.wikipedia.org/wiki/Longmen_Grottoes" },
        { name: "Wikipedia: Mogao Caves", url: "https://en.wikipedia.org/wiki/Mogao_Caves" }
      ],
      quiz: [
        { q: "Cave temples are significant because they...", opts: ["Are portable paintings", "Combine sculpture, painting, and architecture into immersive spaces", "Are only outdoor gardens"], ans: 1 },
        { q: "Dunhuang (Mogao) is famous for...", opts: ["Bronze casting only", "Murals and manuscripts", "Modern skyscrapers"], ans: 1 },
        { q: "Buddhist art introduced...", opts: ["No images at all", "New iconography and sacred figures", "Only abstract geometry"], ans: 1 },
        { q: "Styles changed partly because of...", opts: ["Cultural exchange along routes", "Zero travel", "Total isolation always"], ans: 0 },
        { q: "Large religious art often depends on...", opts: ["Donor support", "Coincidence", "Secret magic only"], ans: 0 }
      ]
    },

    {
      id: 6,
      title: "Sui–Tang: Cosmopolitan Empire & Sacred Splendor",
      era: "581 – 907",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Tang%20dynasty%20art%20Buddhist%20sculpture%20Dunhuang%20cosmopolitan",
      lecture: "<h3>Global Tang: Luxury, Faith, and Exchange</h3><p>The Tang dynasty was a high point of cultural confidence and global contact. Art reflects cosmopolitan taste: Buddhist grandeur, court elegance, trade goods, and vivid tomb figurines that document society.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Cosmopolitan Style:</strong> Influences from Central Asia, Persia, and beyond.</li><li><strong>San Cai Ceramics:</strong> Three-color glazed tomb figurines (horses, attendants).</li><li><strong>Buddhist Peak:</strong> Mature monumental sculpture and refined icon painting.</li><li><strong>Court Culture:</strong> Fashion, music, dance recorded through objects.</li></ul>",
      criticalThinking: "When an empire becomes ‘global,’ does art become richer or more controlled? Explain using Tang examples.",
      mission: "<strong>San Cai Color Study:</strong> Create a 3-color palette (brown/green/cream). Paint or color a simple animal statue sketch using only those three tones.",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Tang%20sancai%20horse.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Tang%20dynasty%20Buddha%20sculpture.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Tang%20dynasty%20tomb%20figurines.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Tang dynasty art", url: "https://en.wikipedia.org/wiki/Tang_dynasty_art" },
        { name: "The Met: Tang China (search)", url: "https://www.metmuseum.org/art/collection/search" }
      ],
      quiz: [
        { q: "Tang art is often described as...", opts: ["Isolated", "Cosmopolitan", "Only minimal black ink"], ans: 1 },
        { q: "San cai refers to...", opts: ["Three-color glaze ceramics", "Three emperors", "Three musical notes"], ans: 0 },
        { q: "A major Tang theme is...", opts: ["Global exchange", "No trade", "No religion"], ans: 0 },
        { q: "Tomb figurines help us understand...", opts: ["Court fashion and society", "Only abstract philosophy", "Nothing historical"], ans: 0 },
        { q: "Tang Buddhism reached...", opts: ["A mature artistic peak", "Total disappearance", "Only wooden huts"], ans: 0 }
      ]
    },

    {
      id: 7,
      title: "Song: Landscape Painting and the Philosophy of Nature",
      era: "960 – 1279",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Song%20dynasty%20landscape%20painting%20Fan%20Kuan%20Guo%20Xi",
      lecture: "<h3>Mountains as Moral Order</h3><p>Song landscape painting is not just scenery. It is a worldview: nature as cosmic structure, human life as small yet meaningful, and brushwork as an extension of cultivated mind.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Monumental Landscapes:</strong> Mountains, mist, layered depth.</li><li><strong>Brush as Thinking:</strong> Ink methods reflect ethics and discipline.</li><li><strong>Shifting Viewpoints:</strong> ‘Floating’ perspective across scroll space.</li><li><strong>Human Scale:</strong> Tiny figures emphasize philosophical humility.</li></ul>",
      criticalThinking: "Why would an educated elite value a painting that makes humans look tiny and powerless?",
      mission: "<strong>Ink Wash Depth:</strong> Paint a simple mountain using only 3 ink values: light wash (mist), mid (rocks), dark (trees). Avoid outlines. Let atmosphere do the work.",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Fan%20Kuan%20-%20Travelers%20among%20Mountains%20and%20Streams.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Guo%20Xi%20Early%20Spring.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Song%20landscape%20scroll.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Chinese landscape painting", url: "https://en.wikipedia.org/wiki/Chinese_landscape_painting" },
        { name: "Wikipedia: Song dynasty art", url: "https://en.wikipedia.org/wiki/Song_dynasty_art" }
      ],
      quiz: [
        { q: "Song landscapes often communicate...", opts: ["Only tourism ads", "Cosmic order and philosophy", "No meaning"], ans: 1 },
        { q: "A key spatial idea in scroll painting is...", opts: ["Single camera lens view only", "Shifting viewpoints across space", "No depth at all"], ans: 1 },
        { q: "Tiny human figures usually suggest...", opts: ["Human dominance", "Humility and scale", "Comedy"], ans: 1 },
        { q: "Ink values help create...", opts: ["Atmosphere and depth", "Plastic shine", "Neon glow"], ans: 0 },
        { q: "Brushwork is often understood as...", opts: ["Pure accident", "A reflection of cultivated mind", "Industrial printing"], ans: 1 }
      ]
    },

    {
      id: 8,
      title: "Song Ceramics: Form, Silence, and Taste",
      era: "960 – 1279",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Song%20ceramics%20Ru%20Guan%20Jun%20Ding%20kiln",
      lecture: "<h3>Minimal Beauty, Maximum Precision</h3><p>Song ceramics represent refined restraint. Subtle glaze, quiet form, and technical mastery became the ideal of elite taste, where perfection hides inside understatement.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Five Great Kilns:</strong> Ru, Guan, Ge, Ding, Jun (classic categories).</li><li><strong>Glaze as Atmosphere:</strong> Crackle, translucency, soft color.</li><li><strong>Form Discipline:</strong> Shape and proportion as moral ‘taste.’</li><li><strong>Object as Philosophy:</strong> Quiet objects reflect cultivated life.</li></ul>",
      criticalThinking: "Why would subtle, nearly ‘plain’ objects become the highest luxury? What does that say about cultural values?",
      mission: "<strong>Silent Object Study:</strong> Draw a cup/bowl in 3 angles. Keep lines minimal. Add one ‘glaze note’ (a single texture: crackle, misty blue, or matte white).",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ru%20ware%20dish.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ding%20ware%20bowl.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Jun%20ware%20vase.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Chinese ceramics", url: "https://en.wikipedia.org/wiki/Chinese_ceramics" },
        { name: "The Met: Chinese ceramics (search)", url: "https://www.metmuseum.org/art/collection/search" }
      ],
      quiz: [
        { q: "Song ceramic aesthetics are often described as...", opts: ["Loud and flashy", "Subtle and restrained", "Only metallic"], ans: 1 },
        { q: "Glaze can function like...", opts: ["Atmosphere", "Textbook words", "Random noise"], ans: 0 },
        { q: "Elite taste favored...", opts: ["Understatement and precision", "Maximum decoration always", "No craft skill"], ans: 0 },
        { q: "Ceramics matter because they show...", opts: ["Objects as philosophy", "Objects as jokes", "Only children toys"], ans: 0 },
        { q: "A kiln tradition indicates...", opts: ["Industrial mass plastic", "Regional technical mastery", "Nothing cultural"], ans: 1 }
      ]
    },

    {
      id: 9,
      title: "Yuan Dynasty: Literati Painting & Identity",
      era: "1271 – 1368",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Yuan%20dynasty%20literati%20painting%20Zhao%20Mengfu%20Ni%20Zan",
      lecture: "<h3>Painting as Moral Resistance</h3><p>Under Mongol rule, many Chinese scholar-officials turned to painting and calligraphy as an inner refuge. Literati painting valued personal expression, brush character, and cultured understatement over realism.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Literati Ideals:</strong> Painting as extension of calligraphy.</li><li><strong>Brush Personality:</strong> ‘Good painting’ = good character.</li><li><strong>Deliberate Simplicity:</strong> Sparse composition as identity statement.</li><li><strong>Art as Self-Positioning:</strong> Visual choices reflect social and political stance.</li></ul>",
      criticalThinking: "If realism is not the goal, how do we judge ‘quality’ in literati painting?",
      mission: "<strong>Brush Character Exercise:</strong> Paint the same tree 3 times: (1) careful, (2) fast, (3) broken/dry brush. Which one feels more ‘you’?",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Zhao%20Mengfu%20-%20Autumn%20Colors%20on%20the%20Qiao%20and%20Hua%20Mountains.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ni%20Zan%20-%20Rongxi%20Studio.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Yuan%20ink%20landscape%20scroll.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Literati painting", url: "https://en.wikipedia.org/wiki/Literati_painting" },
        { name: "Wikipedia: Yuan dynasty art", url: "https://en.wikipedia.org/wiki/Yuan_dynasty_art" }
      ],
      quiz: [
        { q: "Literati painting values...", opts: ["Photographic realism", "Brush character and inner expression", "Only gold backgrounds"], ans: 1 },
        { q: "A core idea is that painting relates to...", opts: ["Calligraphy", "Car engines", "Dance only"], ans: 0 },
        { q: "Sparse composition can function as...", opts: ["Identity statement", "Accident always", "Pure decoration"], ans: 0 },
        { q: "Quality is judged by...", opts: ["Only color brightness", "Cultural/brush intelligence", "Sticker price only"], ans: 1 },
        { q: "This period is shaped by...", opts: ["Mongol rule and social shifts", "Total peace always", "No politics"], ans: 0 }
      ]
    },

    {
      id: 10,
      title: "Ming: Court Painting, Workshops, and Urban Culture",
      era: "1368 – 1644",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Ming%20dynasty%20painting%20court%20Wu%20school%20urban%20culture",
      lecture: "<h3>Professionalization and Pleasure</h3><p>Ming visual culture expanded: court ateliers produced grand works, literati schools flourished, and urban markets fueled prints, illustrated books, and decorative arts.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Court vs Literati:</strong> Institution style vs scholar taste.</li><li><strong>Wu School:</strong> Suzhou-based literati tradition.</li><li><strong>Print Culture:</strong> Illustrated books spread imagery to broader publics.</li><li><strong>Market & Patronage:</strong> Art becomes a profession and commodity.</li></ul>",
      criticalThinking: "When art becomes a market product, does it lose ‘purity’ or gain new creative freedom?",
      mission: "<strong>Illustrated Page Study:</strong> Design one page for an imaginary Ming book: small image + title + 3 lines of caption. Focus on clean layout.",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ming%20dynasty%20painting%20scroll.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ming%20woodblock%20print.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ming%20garden%20Suzhou.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Ming dynasty art", url: "https://en.wikipedia.org/wiki/Ming_dynasty_art" },
        { name: "Wikipedia: Woodblock printing in East Asia", url: "https://en.wikipedia.org/wiki/Woodblock_printing" }
      ],
      quiz: [
        { q: "Ming art culture expands due to...", opts: ["No cities", "Urban markets and print culture", "Only cave temples"], ans: 1 },
        { q: "Court painting is often linked to...", opts: ["Institutional ateliers", "Random street graffiti only", "No patrons"], ans: 0 },
        { q: "Print culture matters because it...", opts: ["Limits access", "Spreads imagery widely", "Erases all images"], ans: 1 },
        { q: "Art markets can create...", opts: ["New professions and audiences", "Only silence", "No change"], ans: 0 },
        { q: "The Ming period shows...", opts: ["Art as commodity and culture", "Art as invisible", "Art with no viewers"], ans: 0 }
      ]
    },

    {
      id: 11,
      title: "Ming Porcelain: Blue-and-White and Global Trade",
      era: "1400s – 1600s",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Ming%20blue%20and%20white%20porcelain%20Jingdezhen%20global%20trade",
      lecture: "<h3>Jingdezhen and the World</h3><p>Blue-and-white porcelain became a global luxury. Produced at Jingdezhen, these objects prove that Chinese art history is also world history: taste, trade, and technology moved across oceans.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Cobalt Blue:</strong> Imported pigment shaped iconic style.</li><li><strong>Industrial Scale Workshops:</strong> Highly organized production system.</li><li><strong>Global Markets:</strong> Islamic world and Europe consumed and adapted Chinese forms.</li><li><strong>Pattern Systems:</strong> Dragons, florals, narrative scenes as export language.</li></ul>",
      criticalThinking: "If a style becomes global, who ‘owns’ it: the maker, the buyer, or the culture that remixes it?",
      mission: "<strong>Blue Pattern Design:</strong> Design a circular plate pattern using only blue pen. Use 3 zones: rim border, mid band, center scene.",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ming%20blue%20and%20white%20porcelain%20vase.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Jingdezhen%20porcelain.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ming%20porcelain%20plate.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Blue-and-white pottery", url: "https://en.wikipedia.org/wiki/Blue-and-white_pottery" },
        { name: "Wikipedia: Jingdezhen", url: "https://en.wikipedia.org/wiki/Jingdezhen" }
      ],
      quiz: [
        { q: "Blue-and-white porcelain became global partly because of...", opts: ["Airplanes", "Trade networks and demand", "No buyers"], ans: 1 },
        { q: "Jingdezhen is best known as...", opts: ["A cave temple", "A major porcelain production center", "A Roman city"], ans: 1 },
        { q: "Cobalt pigment was often...", opts: ["Imported and influential", "Only made from plastic", "Never used"], ans: 0 },
        { q: "Workshop systems suggest...", opts: ["Organized large-scale craft", "No planning", "Only one artist"], ans: 0 },
        { q: "Export objects can reshape...", opts: ["Global taste", "Nothing", "Only local weather"], ans: 0 }
      ]
    },

    {
      id: 12,
      title: "Qing Painting: Court Splendor and Individual Voices",
      era: "1644 – 1911",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Qing%20dynasty%20painting%20Kangxi%20Qianlong%20Individualist%20painters",
      lecture: "<h3>Empire and the Artist’s Self</h3><p>Qing art includes both court grandeur and strong individualist painting traditions. The same empire that collected and classified culture also produced artists who used brushwork to assert personal identity.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Court Patronage:</strong> Large projects, archives, and imperial taste.</li><li><strong>Individualist Painters:</strong> Distinct brush voices after dynastic trauma.</li><li><strong>Collecting & Cataloging:</strong> Art history as state project.</li><li><strong>Continuity + Reinvention:</strong> Older models reinterpreted.</li></ul>",
      criticalThinking: "When an empire controls the canon (what counts as ‘great’), how can artists still be free?",
      mission: "<strong>Old Master Remix:</strong> Pick one historical motif (bamboo, rock, orchid). Draw it twice: (1) ‘traditional’ careful, (2) ‘personal’ exaggerated and fast.",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Qing%20dynasty%20painting%20scroll.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Qianlong%20Emperor%20portrait.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Shitao%20painting.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Qing dynasty art", url: "https://en.wikipedia.org/wiki/Qing_dynasty_art" },
        { name: "Wikipedia: Shitao", url: "https://en.wikipedia.org/wiki/Shitao" }
      ],
      quiz: [
        { q: "Qing art includes...", opts: ["Only court style", "Court patronage and individualist voices", "No painting"], ans: 1 },
        { q: "Imperial collecting often aims to...", opts: ["Destroy all art", "Define the canon", "Avoid history"], ans: 1 },
        { q: "Individualist painters often emphasize...", opts: ["Personal brush voice", "Perfect photography", "Plastic texture"], ans: 0 },
        { q: "Artists can respond to control by...", opts: ["Reinterpreting tradition", "Stopping all art forever", "Only copying machines"], ans: 0 },
        { q: "Continuity + reinvention means...", opts: ["No change", "Old models are reused with new intent", "Only modern art"], ans: 1 }
      ]
    },

    {
      id: 13,
      title: "Late Qing: Encounter with the West and Visual Crisis",
      era: "1800s – 1911",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Late%20Qing%20art%20Shanghai%20School%20photography%20China",
      lecture: "<h3>Modernity Arrives</h3><p>Wars, trade ports, and new media transformed Chinese visual culture. Photography, newspapers, and urban markets reshaped what images were for, creating a crisis and opportunity for traditional painting.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>New Media:</strong> Photography, lithography, mass print.</li><li><strong>Shanghai School:</strong> Urban style blending tradition with modern taste.</li><li><strong>Public Image Culture:</strong> Art moves from elite circles to wider audiences.</li><li><strong>Identity Pressure:</strong> Artists negotiate ‘Chinese-ness’ and modernity.</li></ul>",
      criticalThinking: "When new media makes images cheap and fast, what is the new ‘value’ of hand painting?",
      mission: "<strong>Old vs New Frame:</strong> Draw one object twice: (1) ink-style brush lines, (2) ‘camera crop’ composition (cut off edges, off-center).",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Shanghai%20School%20painting.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Late%20Qing%20photograph.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Lithograph%20China%2019th%20century.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Shanghai School", url: "https://en.wikipedia.org/wiki/Shanghai_school" },
        { name: "Wikipedia: History of photography in China", url: "https://en.wikipedia.org/wiki/Photography_in_China" }
      ],
      quiz: [
        { q: "Late Qing visual change is driven by...", opts: ["No technology", "New media and global contact", "Only cave art"], ans: 1 },
        { q: "Photography changes painting by...", opts: ["Making images fast and cheap", "Removing all images", "Ending composition"], ans: 0 },
        { q: "Shanghai School is linked to...", opts: ["Urban market culture", "Deep desert caves only", "Roman emperors"], ans: 0 },
        { q: "Artists face pressure of...", opts: ["Identity and modernity", "Only farming", "No audience"], ans: 0 },
        { q: "Hand painting’s value shifts toward...", opts: ["Nothing", "Intent, skill, and personal voice", "Battery life"], ans: 1 }
      ]
    },

    {
      id: 14,
      title: "Republic Era: Art Education and New Painting Languages",
      era: "1912 – 1949",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Republic%20of%20China%20art%20Xu%20Beihong%20Lin%20Fengmian%20modern%20painting",
      lecture: "<h3>Reforming Tradition</h3><p>Modern art education systems, overseas study, and cultural debates reshaped Chinese painting. Artists experimented with oil painting, realism, and hybrid forms while arguing about national style.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Art Schools:</strong> Curriculum and institutional modernization.</li><li><strong>Realism & Nation:</strong> Painting used for social and political goals.</li><li><strong>Hybridity:</strong> Combining ink traditions with Western methods.</li><li><strong>Debates:</strong> ‘New’ vs ‘traditional’ as identity struggle.</li></ul>",
      criticalThinking: "Is mixing cultures an artistic upgrade, or a loss of tradition? Who gets to decide?",
      mission: "<strong>Hybrid Portrait:</strong> Draw a portrait outline using ink-style line economy, then add one Western-style shading area (only 1). Keep it balanced.",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Xu%20Beihong%20horse%20painting.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Lin%20Fengmian%20painting.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Chinese%20art%20school%201930s.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Xu Beihong", url: "https://en.wikipedia.org/wiki/Xu_Beihong" },
        { name: "Wikipedia: Lin Fengmian", url: "https://en.wikipedia.org/wiki/Lin_Fengmian" }
      ],
      quiz: [
        { q: "Republic era art change is linked to...", opts: ["Art schools and modernization", "No education", "Only bronze casting"], ans: 0 },
        { q: "A key theme is...", opts: ["Debates about national style", "No identity questions", "Only sports"], ans: 0 },
        { q: "Hybridity means...", opts: ["Mixing methods and traditions", "Refusing any influence", "Copying only one style"], ans: 0 },
        { q: "Realism can be used for...", opts: ["Social/political goals", "Nothing", "Only decoration"], ans: 0 },
        { q: "Cultural mixing is often...", opts: ["A negotiation of identity", "A math error", "A food recipe"], ans: 0 }
      ]
    },

    {
      id: 15,
      title: "1949–1976: Art, Mass Media, and Socialist Visual Culture",
      era: "1949 – 1976",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Chinese%20socialist%20realism%20posters%20art%201949%201976",
      lecture: "<h3>Images for Collective Life</h3><p>Visual culture became a mass system: posters, exhibitions, and realism-based painting served ideology and public education. Art functioned as communication, mobilization, and representation of collective identity.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Poster Culture:</strong> Clear symbols, bright colors, slogans.</li><li><strong>Socialist Realism:</strong> Idealized labor and revolutionary narratives.</li><li><strong>Mass Reproduction:</strong> Images circulate widely beyond elites.</li><li><strong>Art as Policy Tool:</strong> Aesthetic choices align with political goals.</li></ul>",
      criticalThinking: "When art is made to persuade millions, what happens to ambiguity and personal expression?",
      mission: "<strong>Poster Composition:</strong> Create a simple poster layout: big title + one central figure + 2 symbolic objects. Use strong contrast and minimal detail.",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Chinese%20propaganda%20poster%201960s.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Chinese%20Cultural%20Revolution%20poster.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Socialist%20realism%20China%20painting.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Propaganda in China", url: "https://en.wikipedia.org/wiki/Propaganda_in_China" },
        { name: "Wikipedia: Socialist realism", url: "https://en.wikipedia.org/wiki/Socialist_realism" }
      ],
      quiz: [
        { q: "Poster culture aims for...", opts: ["Ambiguity", "Clarity and persuasion", "No audience"], ans: 1 },
        { q: "Socialist realism often shows...", opts: ["Idealized collective life", "Only empty landscapes", "No humans"], ans: 0 },
        { q: "Mass reproduction changes art by...", opts: ["Expanding reach dramatically", "Ending images", "Preventing meaning"], ans: 0 },
        { q: "Policy-driven art often reduces...", opts: ["Clarity", "Ambiguity and personal freedom", "Paper"], ans: 1 },
        { q: "In this era, art functions as...", opts: ["Communication tool", "Pure private diary only", "Random accident"], ans: 0 }
      ]
    },

    {
      id: 16,
      title: "Post-1978: New Chinese Art and Opening Up",
      era: "1978 – 1990s",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=85%20New%20Wave%20Chinese%20contemporary%20art%20opening%20up",
      lecture: "<h3>Experiment Returns</h3><p>After the late 1970s, artists reconnected with global art languages and began intense experiments. The ’85 New Wave’ became a symbol of artistic awakening: performance, installation, conceptual strategies, and new painting attitudes emerged.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>85 New Wave:</strong> Experimental movements across regions.</li><li><strong>Conceptual Turn:</strong> Idea becomes central.</li><li><strong>New Media & Performance:</strong> Body and space as materials.</li><li><strong>Global Dialogue:</strong> Translation, adaptation, and critique.</li></ul>",
      criticalThinking: "When an art scene ‘opens’ to global influence, what are the risks: imitation, loss, or new power?",
      mission: "<strong>Concept Sketch:</strong> Write a 1-sentence artwork idea about ‘memory’ or ‘identity.’ Then draw a simple diagram showing how the viewer interacts with it.",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Contemporary%20art%20China%20installation.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Chinese%20contemporary%20art%20museum%20exhibition.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Performance%20art%20documentation.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: '85 New Wave", url: "https://en.wikipedia.org/wiki/'85_New_Wave" },
        { name: "Wikipedia: Contemporary art in China", url: "https://en.wikipedia.org/wiki/Contemporary_art_in_China" }
      ],
      quiz: [
        { q: "The ’85 New Wave is associated with...", opts: ["Total silence in art", "Experimental movements", "Only bronze rituals"], ans: 1 },
        { q: "A conceptual turn means...", opts: ["Idea becomes central", "Color disappears forever", "No meaning allowed"], ans: 0 },
        { q: "New media/performance expands art into...", opts: ["Body and space", "Only frames", "Only textbooks"], ans: 0 },
        { q: "Global dialogue can create...", opts: ["Adaptation and critique", "No change", "Only copying"], ans: 0 },
        { q: "A major risk is...", opts: ["Negotiating identity and influence", "Too much pottery", "Too many mountains"], ans: 0 }
      ]
    },

    {
      id: 17,
      title: "Contemporary Ink: Tradition as a Living System",
      era: "1990s – Present",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Contemporary%20ink%20art%20China%20modern%20shui%20mo",
      lecture: "<h3>Ink After Modernity</h3><p>Contemporary ink is not ‘old.’ It treats tradition as a living system: artists expand ink into abstraction, installation, performance, and conceptual critique while keeping brush logic as a cultural DNA.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Ink as Method:</strong> Brush logic, rhythm, and material behavior.</li><li><strong>Scale Expansion:</strong> From scroll to wall-sized installations.</li><li><strong>Conceptual Ink:</strong> Ink used to question identity, politics, ecology.</li><li><strong>Tradition Rewritten:</strong> Quoting the past as critique or remix.</li></ul>",
      criticalThinking: "If an artist uses ink but rejects classical subjects (mountains/bamboo), is it still ‘Chinese ink’?",
      mission: "<strong>Ink Material Test:</strong> Make 6 swatches: wet wash, dry brush, splatter, gradient, layered wash, and erased highlight. Use them to build one abstract composition.",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ink%20wash%20painting%20contemporary.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Chinese%20ink%20installation.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Abstract%20ink%20painting.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Ink wash painting", url: "https://en.wikipedia.org/wiki/Ink_wash_painting" },
        { name: "Google Arts & Culture: Chinese ink (browse)", url: "https://artsandculture.google.com/" }
      ],
      quiz: [
        { q: "Contemporary ink often treats tradition as...", opts: ["Dead rulebook", "Living system", "A banned topic"], ans: 1 },
        { q: "Ink can function as...", opts: ["Only decoration", "Method and concept", "Only photograph"], ans: 1 },
        { q: "Scale expansion means...", opts: ["Smaller only", "Ink moving into large installations", "No space"], ans: 1 },
        { q: "Quoting the past can be...", opts: ["Critique or remix", "Always worship", "Always illegal"], ans: 0 },
        { q: "Ink identity debates show...", opts: ["Art is static", "Art is negotiated", "Art is purely math"], ans: 1 }
      ]
    },

    {
      id: 18,
      title: "Contemporary China: Installation, Photography, and the City",
      era: "1990s – Present",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Chinese%20contemporary%20art%20installation%20photography%20urbanization",
      lecture: "<h3>New Materials, New Realities</h3><p>Rapid urbanization and global networks pushed Chinese contemporary art into photography, installation, video, and large-scale social commentary. The ‘art object’ often becomes an environment or a question.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Installation:</strong> Space as artwork.</li><li><strong>Photography:</strong> Document + staged reality.</li><li><strong>Urban Themes:</strong> Migration, demolition, consumer culture.</li><li><strong>Global Art System:</strong> Biennales, museums, markets.</li></ul>",
      criticalThinking: "If an artwork is an ‘experience’ in a room, how do we collect it, preserve it, or teach it?",
      mission: "<strong>Room-as-Art Plan:</strong> Draw a top-down plan of a small installation about ‘home.’ Use 5 objects and explain where the viewer walks.",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Installation%20art%20exhibition.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Chinese%20contemporary%20photography.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Urban%20China%20street%20photography.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Installation art", url: "https://en.wikipedia.org/wiki/Installation_art" },
        { name: "Wikipedia: Contemporary art in China", url: "https://en.wikipedia.org/wiki/Contemporary_art_in_China" }
      ],
      quiz: [
        { q: "Installation art treats ... as the artwork.", opts: ["Space", "Only frames", "Only coins"], ans: 0 },
        { q: "Photography in contemporary art can be...", opts: ["Only documentary", "Document + staged reality", "Never used"], ans: 1 },
        { q: "A common theme is...", opts: ["Urbanization and social change", "Only dragons", "Only caves"], ans: 0 },
        { q: "Global art systems include...", opts: ["Biennales and museums", "Only village markets", "No exhibitions"], ans: 0 },
        { q: "Teaching experience-based art requires...", opts: ["Ignoring context", "Explaining space and viewer interaction", "Only memorizing dates"], ans: 1 }
      ]
    },

    {
      id: 19,
      title: "Tradition Across East Asia: Shared Roots, Different Paths",
      era: "c. 600 – 1900",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=East%20Asian%20art%20China%20Japan%20Korea%20ink%20Buddhism",
      lecture: "<h3>China as a Cultural Engine, Not a Solo Story</h3><p>Chinese art history shaped and was reshaped by East Asia. Buddhism, writing systems, painting formats, and craft technologies traveled, transformed, and returned with new meanings.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Cultural Transmission:</strong> Ideas move via religion, diplomacy, trade.</li><li><strong>Format Migration:</strong> Scrolls, screens, calligraphy traditions.</li><li><strong>Local Innovation:</strong> Japan/Korea develop distinct aesthetics from shared roots.</li><li><strong>History as Network:</strong> ‘Influence’ is two-way over time.</li></ul>",
      criticalThinking: "Is it accurate to say ‘China influenced others,’ or is it better to say ‘a shared visual system evolved’? Why?",
      mission: "<strong>Format Remix:</strong> Take one subject (a branch, a bird, a rock). Sketch it in two formats: (1) vertical hanging scroll, (2) folding screen panel. Notice composition changes.",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Chinese%20hanging%20scroll.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Japanese%20folding%20screen.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Korean%20ink%20painting.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: East Asian cultural sphere", url: "https://en.wikipedia.org/wiki/East_Asian_cultural_sphere" },
        { name: "Wikipedia: Chinese calligraphy", url: "https://en.wikipedia.org/wiki/Chinese_calligraphy" }
      ],
      quiz: [
        { q: "East Asian art history is best understood as...", opts: ["A single isolated line", "A network of exchanges", "A random list"], ans: 1 },
        { q: "A major transmission channel was...", opts: ["Buddhism and diplomacy", "Only video games", "No travel"], ans: 0 },
        { q: "Shared formats include...", opts: ["Scrolls and screens", "Roman coins", "Oil pipelines"], ans: 0 },
        { q: "Local innovation means...", opts: ["Copying only", "Developing distinct aesthetics", "Stopping art"], ans: 1 },
        { q: "Influence is often...", opts: ["One-way forever", "Two-way over time", "Impossible"], ans: 1 }
      ]
    },

    {
      id: 20,
      title: "China in Global Contemporary: From Local Language to World Questions",
      era: "2000s – Present",
      videoUrl: "https://www.youtube.com/embed?listType=search&list=Chinese%20contemporary%20art%20global%20biennale%20identity%20conceptual",
      lecture: "<h3>From ‘Chinese Style’ to Global Themes</h3><p>Today, Chinese artists operate inside a global art ecology. The question is no longer only ‘Chinese tradition vs Western modernity,’ but how artists use local visual languages to address global issues: ecology, technology, memory, migration, and power.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Global Platforms:</strong> Biennales, museums, online audiences.</li><li><strong>Local Language:</strong> Ink, calligraphy, craft as conceptual tools.</li><li><strong>Global Themes:</strong> Environment, surveillance, labor, identity.</li><li><strong>Audience Shift:</strong> Art speaks to multiple cultures at once.</li></ul>",
      criticalThinking: "If an artwork must speak to multiple cultures, what gets lost, and what becomes stronger?",
      mission: "<strong>Concept Statement (3 lines):</strong> Write a short statement for an artwork that uses one traditional element (ink/ceramic/paper) to address one global theme (climate/AI/migration).",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Contemporary%20art%20biennale%20installation.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ink%20art%20contemporary%20exhibition.jpg?width=1400",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Video%20art%20installation.jpg?width=1400"
      ],
      resources: [
        { name: "Wikipedia: Biennale", url: "https://en.wikipedia.org/wiki/Biennale" },
        { name: "Wikipedia: Contemporary art", url: "https://en.wikipedia.org/wiki/Contemporary_art" },
        { name: "Google Arts & Culture (browse)", url: "https://artsandculture.google.com/" }
      ],
      quiz: [
        { q: "Contemporary global art platforms include...", opts: ["Biennales and museums", "Only tombs", "Only caves"], ans: 0 },
        { q: "Traditional elements today can act as...", opts: ["Conceptual tools", "Only decoration", "Only antiques"], ans: 0 },
        { q: "Common global themes include...", opts: ["Ecology and technology", "Only dragons", "Only bronze casting"], ans: 0 },
        { q: "Audience shift means...", opts: ["Only one culture matters", "Multiple cultures interpret at once", "No viewers"], ans: 1 },
        { q: "Cross-cultural communication can...", opts: ["Lose some context but gain reach", "Always perfect", "Always impossible"], ans: 0 }
  ] 
      } // ✅ 这里闭合第 20 课的对象
    ] // ✅ 这里闭合 china 的 lessons 数组
  } // ✅ 这里闭合整个 china 对象
}; // ✅ 这里闭合整个 window.FEI_ART_HISTORY_TRACKS 对象

// （可选）兼容旧 app.js：如果你还在用“只读一个数组”的旧版本，才打开下面这行
 window.FEI_ART_HISTORY_CURRICULUM = window.FEI_ART_HISTORY_TRACKS.western.lessons;
