// Asian Art History: original Chinese curriculum preserved; media reviewed 2026-10-15.
(function () {
  "use strict";
  const tracks = window.FEI_ART_HISTORY_TRACKS;
  if (!tracks?.china) return;
  window.FEI_ART_HISTORY_ARCHIVE = { ...(window.FEI_ART_HISTORY_ARCHIVE || {}), china: JSON.parse(JSON.stringify(tracks.china)) };
  tracks.china.hidden = true;
  tracks.asia = {
  "label": "Asian Art History",
  "desc": "34 stories along one timeline: China, Japan, Korea, India, Indonesia, Cambodia, and Iran. Dates overlap; this is an introduction to selected traditions, not every history of Asia.",
  "lessons": [
    {
      "id": 1,
      "title": "Origins: Neolithic Art & Ritual Objects",
      "era": "c. 7000 BCE – 2000 BCE",
      "videoUrl": "https://www.youtube.com/embed/ld8kHvz1yN4",
      "lecture": "<h3>Before Dynasties: Pattern, Pottery, and Power</h3><p>Long before written history, Neolithic communities in China produced art that was deeply tied to daily life, identity, and early ritual systems. Pottery painting, jade carving, and village planning reveal how visual culture formed social order.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Painted Pottery:</strong> Cultures like Banpo used geometric motifs to mark identity and belief.</li><li><strong>Jade as Ritual Power:</strong> Liangzhu jades (cong and bi) suggest elite authority and cosmology.</li><li><strong>Craft = Knowledge:</strong> Materials (clay/jade) shaped style and meaning.</li><li><strong>Pattern as Language:</strong> Repetition became a visual system before writing.</li></ul>",
      "criticalThinking": "Why would a society invest huge labor into carving jade objects that are not practical tools? What kind of power does ‘ritual material’ create?",
      "mission": "<strong>Pattern-to-Meaning Study:</strong> Design a simple ‘village symbol’ using only 3 shapes (circle/triangle/square). Repeat it as a pattern on a cup/bowl drawing. Write 2 sentences about what your symbol stands for (protection? family? water?).",
      "images": [
        {
          "src": "assets/asian/100241573.jpg",
          "title": "Liangzhu jade cong · Neolithic China",
          "credit": "Gary Lee Todd, Ph.D.",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Liangzhu_Culture_Jade_Cong_07.jpg",
          "license": "CC0",
          "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://smarthistory.org/jade-cong/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=ld8kHvz1yN4"
        }
      ],
      "quiz": [
        {
          "q": "Which material became a key marker of elite ritual power in late Neolithic China?",
          "opts": [
            "Glass",
            "Jade",
            "Steel"
          ],
          "ans": 1
        },
        {
          "q": "Liangzhu cong/bi objects are most connected to...",
          "opts": [
            "Industrial factories",
            "Ritual and cosmology",
            "Oil painting"
          ],
          "ans": 1
        },
        {
          "q": "Neolithic painted pottery patterns functioned as...",
          "opts": [
            "Pure decoration only",
            "A visual language and identity marker",
            "Written text"
          ],
          "ans": 1
        },
        {
          "q": "A major idea in early Chinese art is that craft skill equals...",
          "opts": [
            "Fashion",
            "Knowledge and social order",
            "Random luck"
          ],
          "ans": 1
        },
        {
          "q": "Neolithic art is important because it shows...",
          "opts": [
            "The first smartphones",
            "The birth of visual systems before writing",
            "Only war scenes"
          ],
          "ans": 1
        }
      ],
      "sourceChineseId": 1,
      "slug": "china-1",
      "startYear": -7000,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "Jade Cong",
        "channel": "Smarthistory",
        "channelUrl": "https://www.youtube.com/@smarthistory-art-history",
        "watchUrl": "https://www.youtube.com/watch?v=ld8kHvz1yN4",
        "note": "A Liangzhu jade case study. Compare its geometry with the pottery and ritual objects discussed below.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "slug": "jomon",
      "title": "Japan: Jōmon Clay, Pattern, and Community",
      "startYear": -3000,
      "era": "c. 3000–400 BCE",
      "regions": [
        "Japan"
      ],
      "lecture": "<h3>Look first</h3><p>Find a repeated mark, a modeled edge, and a place where the form changes. How would each have been made?</p><h3>Place it on the timeline</h3><p>Jōmon communities made hand-built vessels and clay figures long before the later Japanese courts. Cord impressions, modeled rims, and sculptural bodies connect everyday materials with social and ritual practices. The exact functions of many dogū remain debated. Compare these objects with Liangzhu jade without assuming that neighboring cultures shared the same beliefs.</p>",
      "criticalThinking": "How does Japan change when you consider its original users, materials, and setting?",
      "mission": "Design a small vessel on paper. Give it one repeated texture and one unexpected rim; explain how a hand would make each.",
      "resources": [
        {
          "name": "Read more / official historical context",
          "url": "https://smarthistory.org/deep-bowl-dogu-jomon-period/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=VRxcHHLSe8Y"
        }
      ],
      "quiz": [
        {
          "q": "Jōmon vessels were primarily made from…",
          "opts": [
            "Clay",
            "Cast iron",
            "Printed paper"
          ],
          "ans": 0
        },
        {
          "q": "Cord impressions are evidence of…",
          "opts": [
            "Oil painting",
            "Surface-making techniques",
            "A written alphabet"
          ],
          "ans": 1
        },
        {
          "q": "Many dogū functions are…",
          "opts": [
            "Known with certainty",
            "Identical to all Chinese jades",
            "Debated by scholars"
          ],
          "ans": 2
        },
        {
          "q": "A productive comparison with Liangzhu asks about…",
          "opts": [
            "Materials and social use",
            "Which culture was superior",
            "Whether both used oil paint"
          ],
          "ans": 0
        },
        {
          "q": "An irregular modeled rim can show…",
          "opts": [
            "Industrial mass production",
            "Deliberate design choices",
            "Only accidental damage"
          ],
          "ans": 1
        }
      ],
      "id": 2,
      "videoUrl": "https://www.youtube.com/embed/VRxcHHLSe8Y",
      "videoSource": {
        "title": "Ceramics from early Japan, the Jōmon",
        "channel": "Smarthistory",
        "channelUrl": "https://www.youtube.com/@smarthistory-art-history",
        "watchUrl": "https://www.youtube.com/watch?v=VRxcHHLSe8Y",
        "note": "English case study. Use the reading and gallery to place this example in its wider historical setting.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "images": [
        {
          "src": "assets/asian/31396630.jpg",
          "title": "Flame-style vessel · Jōmon period",
          "credit": "Daderot",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jomon_Vessel_with_Flame-like_Ornamentation,_attributed_provenance_Umataka,_Nagaoka-shi,_Niigata,_Jomon_period,_3000-2000_BC_-_Tokyo_National_Museum_-_DSC05620.JPG",
          "license": "CC0",
          "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "id": 3,
      "title": "Shang Dynasty: Bronze, Ancestors, and Authority",
      "era": "c. 1600 BCE – 1046 BCE",
      "videoUrl": "https://www.youtube.com/embed/s9gfIqOo__I",
      "lecture": "<h3>Bronze as Political Theology</h3><p>Shang bronzes were not ‘decorative.’ They were ritual machines used to communicate with ancestors and legitimize kingship. Their scale and technical complexity show how art can operate as state power.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Ritual Vessels:</strong> Ding, gui, and other forms used in ancestor offerings.</li><li><strong>Taotie Motif:</strong> Mask-like designs linked to myth, warning, or sacred presence.</li><li><strong>Piece-Mold Casting:</strong> A uniquely Chinese bronze technology enabling high detail.</li><li><strong>Art = Authority:</strong> Control of bronze production equals control of ritual legitimacy.</li></ul>",
      "criticalThinking": "If a ruler controls the ritual vessels, does that mean they control ‘truth’ and history too? Why?",
      "mission": "<strong>Mask Design Study:</strong> Create a symmetrical ‘taotie-inspired’ mask using only curves and triangles. Keep it abstract (no cute faces). Focus on balance and tension.",
      "images": [
        {
          "src": "assets/asian/16028177.jpg",
          "title": "Houmuwu ding · Shang ritual bronze",
          "credit": "Mlogic",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:HouMuWuDingFullView.jpg",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://smarthistory.org/oracle-bone/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=s9gfIqOo__I"
        }
      ],
      "quiz": [
        {
          "q": "Shang bronzes were primarily used for...",
          "opts": [
            "Ritual offerings and ancestor communication",
            "Cooking daily meals",
            "Street advertising"
          ],
          "ans": 0
        },
        {
          "q": "The taotie is best described as...",
          "opts": [
            "A realistic portrait",
            "A mask-like sacred motif",
            "A landscape style"
          ],
          "ans": 1
        },
        {
          "q": "A key bronze technique in Shang China was...",
          "opts": [
            "Piece-mold casting",
            "3D printing",
            "Oil glazing"
          ],
          "ans": 0
        },
        {
          "q": "Why does bronze matter politically?",
          "opts": [
            "It is shiny",
            "It links rulers to ritual legitimacy",
            "It makes music louder"
          ],
          "ans": 1
        },
        {
          "q": "Ritual objects often function as...",
          "opts": [
            "Power symbols",
            "Random toys",
            "Private diaries only"
          ],
          "ans": 0
        }
      ],
      "sourceChineseId": 2,
      "slug": "china-2",
      "startYear": -1600,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "Oracle Bone, Shang Dynasty",
        "channel": "Smarthistory",
        "channelUrl": "https://www.youtube.com/@smarthistory-art-history",
        "watchUrl": "https://www.youtube.com/watch?v=s9gfIqOo__I",
        "note": "An oracle-bone case study of Shang ritual and writing. Use the bronze gallery to compare another material serving ancestral authority.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "id": 4,
      "title": "Zhou & Warring States: Ritual to Philosophy",
      "era": "1046 BCE – 221 BCE",
      "videoUrl": "https://www.youtube.com/embed/tAtweI2BUNE",
      "lecture": "<h3>From Ancestral Ritual to Competing Ideas</h3><p>As political power fragmented, art diversified: bronze inscriptions expanded historical memory, lacquerware refined elite taste, and new philosophies shaped how culture justified authority.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Bronze Inscriptions:</strong> Text as commemoration and political record.</li><li><strong>Lacquer & Luxury:</strong> Complex craft, bold color, elite mobility.</li><li><strong>Regional Styles:</strong> Competing states produced distinct aesthetics.</li><li><strong>Art and Ideology:</strong> Confucian/Daoist thought reframed moral order.</li></ul>",
      "criticalThinking": "When art begins to include long inscriptions, who is ‘art’ for: the public, the ancestors, or future political legitimacy?",
      "mission": "<strong>Inscription Design:</strong> Create a ‘commemorative object label’ for an imaginary victory or life event. Use 3 lines of text (English is fine) and a simple border pattern.",
      "images": [
        {
          "src": "assets/asian/603399.jpg",
          "title": "Da Ke ding · Western Zhou",
          "credit": "See source record",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Da_Ke_ding.jpg",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://smarthistory.org/ding/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=tAtweI2BUNE"
        }
      ],
      "quiz": [
        {
          "q": "A key new feature in Zhou bronzes is...",
          "opts": [
            "Neon colors",
            "Long inscriptions",
            "Photographic realism"
          ],
          "ans": 1
        },
        {
          "q": "Lacquerware is associated with...",
          "opts": [
            "Elite craft and luxury",
            "Cheap mass plastic",
            "Marble carving only"
          ],
          "ans": 0
        },
        {
          "q": "Art in Warring States becomes more...",
          "opts": [
            "Uniform",
            "Regionally diverse",
            "Completely abstract"
          ],
          "ans": 1
        },
        {
          "q": "Inscriptions often function as...",
          "opts": [
            "Political memory",
            "Random decoration",
            "Jokes"
          ],
          "ans": 0
        },
        {
          "q": "This period is defined by...",
          "opts": [
            "One unified empire",
            "Competing states and ideas",
            "No philosophy"
          ],
          "ans": 1
        }
      ],
      "sourceChineseId": 3,
      "slug": "china-3",
      "startYear": -1046,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "Da Ke Ding",
        "channel": "Smarthistory",
        "channelUrl": "https://www.youtube.com/@smarthistory-art-history",
        "watchUrl": "https://www.youtube.com/watch?v=tAtweI2BUNE",
        "note": "A Western Zhou bronze case study. Follow the inscription as a link between ritual, memory, and authority.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "slug": "sanchi",
      "title": "India: Sanchi and the Moving Viewer",
      "startYear": -250,
      "era": "c. 3rd century BCE–1st century CE",
      "regions": [
        "India"
      ],
      "lecture": "<h3>Look first</h3><p>Trace a route around the mound. Identify how a gateway frames entry and how reliefs invite close looking.</p><h3>Place it on the timeline</h3><p>Sanchi developed over generations. A stupa is a sacred monument associated with relics; circumambulation makes movement part of the experience. Later carved gateways present stories and symbols to a walking viewer. This South Asian context helps explain the Buddhist visual traditions later adapted elsewhere in Asia.</p>",
      "criticalThinking": "How does India change when you consider its original users, materials, and setting?",
      "mission": "Draw a circular route with four thresholds. Give each threshold a visual clue that changes what a visitor notices.",
      "resources": [
        {
          "name": "Read more / official historical context",
          "url": "https://smarthistory.org/the-stupa-sanchi/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=BkFpizJgwYk"
        }
      ],
      "quiz": [
        {
          "q": "A stupa is closely associated with…",
          "opts": [
            "Relics and Buddhist devotion",
            "A royal portrait studio",
            "A modern railway"
          ],
          "ans": 0
        },
        {
          "q": "Circumambulation means…",
          "opts": [
            "Painting only its roof",
            "Moving around a sacred focus",
            "Destroying the monument"
          ],
          "ans": 1
        },
        {
          "q": "Sanchi’s visible complex developed…",
          "opts": [
            "In a single afternoon",
            "Only in the twentieth century",
            "Across several periods"
          ],
          "ans": 2
        },
        {
          "q": "Carved gateways guide…",
          "opts": [
            "Movement and storytelling",
            "Electronic signals",
            "Oil-paint drying"
          ],
          "ans": 0
        },
        {
          "q": "Buddhist art across Asia shows…",
          "opts": [
            "No movement of ideas",
            "Local adaptations and exchanges",
            "An identical style everywhere"
          ],
          "ans": 1
        }
      ],
      "id": 5,
      "videoUrl": "https://www.youtube.com/embed/BkFpizJgwYk",
      "videoSource": {
        "title": "Buddhist Monuments at Sanchi (UNESCO/NHK)",
        "channel": "UNESCO",
        "channelUrl": "https://www.youtube.com/@UNESCO",
        "watchUrl": "https://www.youtube.com/watch?v=BkFpizJgwYk",
        "note": "English case study. Use the reading and gallery to place this example in its wider historical setting.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "images": [
        {
          "src": "assets/asian/33567558.jpg",
          "title": "Great Stupa (Stupa 1) · Sanchi",
          "credit": "Bernard Gagnon",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Stupa_1,_Sanchi_02.jpg",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "id": 6,
      "title": "Qin & Han: Empire, Tombs, and the Afterlife",
      "era": "221 BCE – 220 CE",
      "videoUrl": "https://www.youtube.com/embed/RsUE-ZtcUFg",
      "lecture": "<h3>Art for an Eternal State</h3><p>With unification, visual culture scaled up. Tombs became miniature worlds: armies, maps, cosmology, and daily life were rebuilt for the afterlife, proving that empire extended beyond death.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Terracotta Army:</strong> Standardization + individuality in mass production.</li><li><strong>Han Tomb Art:</strong> Brick reliefs, murals, and mingqi (spirit objects).</li><li><strong>Cosmology:</strong> Heaven/Earth models; banners and diagrams.</li><li><strong>State Aesthetics:</strong> Art as an extension of imperial control.</li></ul>",
      "criticalThinking": "Why build a ‘complete world’ underground? Is it belief, propaganda, or both?",
      "mission": "<strong>Tomb World Blueprint:</strong> Draw a simple plan of an ‘afterlife room’ for an imaginary ruler. Include 5 objects that show power, daily life, and belief.",
      "images": [
        {
          "src": "assets/asian/101665311.jpg",
          "title": "Terracotta Army · Qin dynasty",
          "credit": "Gary Lee Todd, Ph.D.",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Qin_Terracotta_Army,_Pit_1_03.jpg",
          "license": "CC0",
          "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://smarthistory.org/the-terracotta-warriors/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=RsUE-ZtcUFg"
        }
      ],
      "quiz": [
        {
          "q": "The Terracotta Army demonstrates...",
          "opts": [
            "Only individual handmade work",
            "Mass production with variation",
            "Purely modern technology"
          ],
          "ans": 1
        },
        {
          "q": "Han tombs often contained...",
          "opts": [
            "Only empty rooms",
            "Spirit objects and murals",
            "Digital screens"
          ],
          "ans": 1
        },
        {
          "q": "A major theme is...",
          "opts": [
            "Cosmology and afterlife worlds",
            "Sports trophies",
            "Cooking recipes"
          ],
          "ans": 0
        },
        {
          "q": "Empire art often supports...",
          "opts": [
            "Imperial ideology",
            "Random chaos",
            "No purpose"
          ],
          "ans": 0
        },
        {
          "q": "Why include daily life objects in tombs?",
          "opts": [
            "To rebuild a usable afterlife world",
            "To confuse thieves only",
            "For fashion"
          ],
          "ans": 0
        }
      ],
      "sourceChineseId": 4,
      "slug": "china-4",
      "startYear": -221,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "The Terra-Cotta Warriors | National Geographic",
        "channel": "National Geographic",
        "channelUrl": "https://www.youtube.com/@NatGeo",
        "watchUrl": "https://www.youtube.com/watch?v=RsUE-ZtcUFg",
        "note": "A Qin burial case study. The lesson and further reading extend the discussion to Han funerary culture.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "id": 7,
      "title": "Buddhism Arrives: Six Dynasties & Cave Temples",
      "era": "220–907 CE · Early caves to Tang monuments",
      "videoUrl": "https://www.youtube.com/embed/kFp7D0UxNxU",
      "lecture": "<h3>New Religion, New Image World</h3><p>Buddhism transformed Chinese art. Monumental caves like Yungang, Longmen, and Dunhuang became immersive visual universes where sculpture, painting, and architecture fused into spiritual technology.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Cave Temples:</strong> Carved mountains as sacred interiors.</li><li><strong>Iconography:</strong> Buddhas, bodhisattvas, guardian figures.</li><li><strong>Stylistic Shifts:</strong> From Central Asian influence to Sinicized forms.</li><li><strong>Donor Culture:</strong> Art funded by rulers, elites, and communities.</li></ul>",
      "criticalThinking": "Why does a religion need images, and why do images become powerful enough to reshape an entire culture?",
      "mission": "<strong>Halo & Gesture Study:</strong> Draw a simple seated figure. Create 3 versions by changing only the halo shape and hand gesture (mudra). Note how meaning shifts.",
      "images": [
        {
          "src": "assets/asian/97454174.jpg",
          "title": "Longmen grottoes · Buddhist cave sculpture",
          "credit": "Gary Todd",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ancient_Buddhist_Grottoes_at_Longmen-_Grotto_of_Buddhas.jpg",
          "license": "CC0",
          "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        },
        {
          "src": "assets/asian/34822592.jpg",
          "title": "Seated Buddha · Sarnath, India, Gupta period, 5th century",
          "credit": "See source record",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:British_Museum_-_Seated_Buddha_(Gupta_period).JPG",
          "license": "CC BY 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        },
        {
          "src": "assets/asian/33567558.jpg",
          "title": "Great Stupa (Stupa 1) · Sanchi",
          "credit": "Bernard Gagnon",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Stupa_1,_Sanchi_02.jpg",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://smarthistory.org/longmen-caves-luoyang/"
        },
        {
          "name": "Smarthistory: Buddhism in Chinese Art, 2nd century–907 CE",
          "url": "https://smarthistory.org/reframing-art-history/buddhism-chinese-art/"
        },
        {
          "name": "Revisit Sanchi: sacred movement in India",
          "url": "https://smarthistory.org/the-stupa-sanchi/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=kFp7D0UxNxU"
        }
      ],
      "quiz": [
        {
          "q": "Cave temples are significant because they...",
          "opts": [
            "Are portable paintings",
            "Combine sculpture, painting, and architecture into immersive spaces",
            "Are only outdoor gardens"
          ],
          "ans": 1
        },
        {
          "q": "Dunhuang (Mogao) is famous for...",
          "opts": [
            "Bronze casting only",
            "Murals and manuscripts",
            "Modern skyscrapers"
          ],
          "ans": 1
        },
        {
          "q": "Buddhist art introduced...",
          "opts": [
            "No images at all",
            "New iconography and sacred figures",
            "Only abstract geometry"
          ],
          "ans": 1
        },
        {
          "q": "Styles changed partly because of...",
          "opts": [
            "Cultural exchange along routes",
            "Zero travel",
            "Total isolation always"
          ],
          "ans": 0
        },
        {
          "q": "Large religious art often depends on...",
          "opts": [
            "Donor support",
            "Coincidence",
            "Secret magic only"
          ],
          "ans": 0
        }
      ],
      "sourceChineseId": 5,
      "slug": "china-5",
      "startYear": 220,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "Longmen Grottoes (UNESCO/NHK)",
        "channel": "UNESCO",
        "channelUrl": "https://www.youtube.com/@UNESCO",
        "watchUrl": "https://www.youtube.com/watch?v=kFp7D0UxNxU",
        "note": "A site overview spanning Northern Wei and Tang developments. Distinguish the early caves from the later monumental Buddha.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context.",
      "comparison": {
        "title": "Buddhist art: India and China in dialogue",
        "intro": "There is no single Indian style or single Chinese style. These examples differ in date, setting, patronage, and religious use. Ideas traveled through Central Asia and by sea, and makers adapted them locally.",
        "pairs": [
          {
            "label": "Sanchi · India · c. 3rd century BCE–1st century CE",
            "detail": "A stupa and narrative gateways organize walking and remembrance. Some early imagery refers to the Buddha through symbols; this does not mean Indian Buddhism lacked Buddha figures."
          },
          {
            "label": "Sarnath · India · 5th century CE",
            "detail": "The seated Buddha in the gallery uses a teaching gesture and a closely fitting robe. Observe the bodily form and symbolic features before comparing it with a different regional workshop."
          },
          {
            "label": "Longmen · China · Northern Wei to Tang",
            "detail": "Rock-cut settings, donor communities, and imperial patronage shape changing sculptural forms. Compare drapery, posture, surrounding figures, scale, and the relationship to the cave."
          }
        ],
        "prompt": "Choose the Sarnath Buddha and a Longmen figure. Record two visible similarities, two differences, and one contextual reason that might explain a difference. Avoid explaining everything by nationality."
      }
    },
    {
      "id": 8,
      "title": "Sui–Tang: Cosmopolitan Empire & Sacred Splendor",
      "era": "581 – 907",
      "videoUrl": "https://www.youtube.com/embed/sKJ8qkIqzfo",
      "lecture": "<h3>Global Tang: Luxury, Faith, and Exchange</h3><p>The Tang dynasty was a high point of cultural confidence and global contact. Art reflects cosmopolitan taste: Buddhist grandeur, court elegance, trade goods, and vivid tomb figurines that document society.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Cosmopolitan Style:</strong> Influences from Central Asia, Persia, and beyond.</li><li><strong>San Cai Ceramics:</strong> Three-color glazed tomb figurines (horses, attendants).</li><li><strong>Buddhist Peak:</strong> Mature monumental sculpture and refined icon painting.</li><li><strong>Court Culture:</strong> Fashion, music, dance recorded through objects.</li></ul>",
      "criticalThinking": "When an empire becomes ‘global,’ does art become richer or more controlled? Explain using Tang examples.",
      "mission": "<strong>San Cai Color Study:</strong> Create a 3-color palette (brown/green/cream). Paint or color a simple animal statue sketch using only those three tones.",
      "images": [
        {
          "src": "assets/asian/103615372.jpg",
          "title": "Sancai horse · Tang dynasty",
          "credit": "Gary Lee Todd, Ph.D.",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tang_Sancai_Horse_01.jpg",
          "license": "CC0",
          "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://smarthistory.org/tomb-figurines-tang-dynasty/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=sKJ8qkIqzfo"
        }
      ],
      "quiz": [
        {
          "q": "Tang art is often described as...",
          "opts": [
            "Isolated",
            "Cosmopolitan",
            "Only minimal black ink"
          ],
          "ans": 1
        },
        {
          "q": "San cai refers to...",
          "opts": [
            "Three-color glaze ceramics",
            "Three emperors",
            "Three musical notes"
          ],
          "ans": 0
        },
        {
          "q": "A major Tang theme is...",
          "opts": [
            "Global exchange",
            "No trade",
            "No religion"
          ],
          "ans": 0
        },
        {
          "q": "Tomb figurines help us understand...",
          "opts": [
            "Court fashion and society",
            "Only abstract philosophy",
            "Nothing historical"
          ],
          "ans": 0
        },
        {
          "q": "Tang Buddhism reached...",
          "opts": [
            "A mature artistic peak",
            "Total disappearance",
            "Only wooden huts"
          ],
          "ans": 0
        }
      ],
      "sourceChineseId": 6,
      "slug": "china-6",
      "startYear": 581,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "Graceful gestures and terrifying guardians — Tang Tomb figures",
        "channel": "Smarthistory",
        "channelUrl": "https://www.youtube.com/@smarthistory-art-history",
        "watchUrl": "https://www.youtube.com/watch?v=sKJ8qkIqzfo",
        "note": "Tang tomb figures: observe gestures, dress, and guardians rather than treating every object as a Buddhist image.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "id": 9,
      "title": "China: Calligraphy and Exchanges across East Asia",
      "era": "c. 600 – 1900",
      "videoUrl": "https://www.youtube.com/embed/MEN0CzGv5-Y",
      "lecture": "<h3>China as a Cultural Engine, Not a Solo Story</h3><p>Chinese art history shaped and was reshaped by East Asia. Buddhism, writing systems, painting formats, and craft technologies traveled, transformed, and returned with new meanings.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Cultural Transmission:</strong> Ideas move via religion, diplomacy, trade.</li><li><strong>Format Migration:</strong> Scrolls, screens, calligraphy traditions.</li><li><strong>Local Innovation:</strong> Japan/Korea develop distinct aesthetics from shared roots.</li><li><strong>History as Network:</strong> ‘Influence’ is two-way over time.</li></ul>",
      "criticalThinking": "Is it accurate to say ‘China influenced others,’ or is it better to say ‘a shared visual system evolved’? Why?",
      "mission": "<strong>Format Remix:</strong> Take one subject (a branch, a bird, a rock). Sketch it in two formats: (1) vertical hanging scroll, (2) folding screen panel. Notice composition changes.",
      "images": [
        {
          "src": "assets/asian/7589123.jpg",
          "title": "Huang Ting Jing · Calligraphy model attributed to Wang Xizhi",
          "credit": "Wang Xizhi",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Wang_Xizhi_Huang_Ting_Jing.jpg",
          "license": "Public domain",
          "licenseUrl": "https://commons.wikimedia.org/wiki/File:Wang_Xizhi_Huang_Ting_Jing.jpg",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://smarthistory.org/chinese-calligraphy-intro/"
        },
        {
          "name": "The Met: Brush Writing in the Arts of Japan",
          "url": "https://www.metmuseum.org/exhibitions/listings/2013/brush-writing"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=MEN0CzGv5-Y"
        }
      ],
      "quiz": [
        {
          "q": "East Asian art history is best understood as...",
          "opts": [
            "A single isolated line",
            "A network of exchanges",
            "A random list"
          ],
          "ans": 1
        },
        {
          "q": "A major transmission channel was...",
          "opts": [
            "Buddhism and diplomacy",
            "Only video games",
            "No travel"
          ],
          "ans": 0
        },
        {
          "q": "Shared formats include...",
          "opts": [
            "Scrolls and screens",
            "Roman coins",
            "Oil pipelines"
          ],
          "ans": 0
        },
        {
          "q": "Local innovation means...",
          "opts": [
            "Copying only",
            "Developing distinct aesthetics",
            "Stopping art"
          ],
          "ans": 1
        },
        {
          "q": "Influence is often...",
          "opts": [
            "One-way forever",
            "Two-way over time",
            "Impossible"
          ],
          "ans": 1
        }
      ],
      "sourceChineseId": 19,
      "slug": "china-19",
      "startYear": 600,
      "regions": [
        "China",
        "Japan",
        "Korea"
      ],
      "videoSource": {
        "title": "Appreciating Chinese Calligraphy",
        "channel": "Asian Art Museum",
        "channelUrl": "https://www.youtube.com/@AsianArtMuseum",
        "watchUrl": "https://www.youtube.com/watch?v=MEN0CzGv5-Y",
        "note": "A Chinese calligraphy introduction for a comparative bridge across East Asia. The video explains the Chinese practice; compare it with the Japanese and Korean traditions elsewhere on this path.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context.",
      "comparison": {
        "title": "Compare brush cultures",
        "intro": "Shared tools do not make every tradition identical. Compare specific works rather than assigning one style to an entire country.",
        "pairs": [
          {
            "label": "China · Wang Xizhi tradition",
            "detail": "Look at the order, pressure, and rhythm of characters, and the importance of copying and collecting calligraphic models."
          },
          {
            "label": "Japan · Kōetsu and kana",
            "detail": "In the later Japanese calligraphy lesson, look for kana alongside kanji, decorated paper, and the arrangement of poetry. Kana is a Japanese phonetic script, not simply a style of Chinese characters."
          }
        ],
        "prompt": "Draw the path your eye follows through each example. Where do spacing and brush pressure create pauses?"
      }
    },
    {
      "slug": "nara",
      "title": "Japan: Nara, Buddhism, and the Imperial City",
      "startYear": 710,
      "era": "710–794 CE",
      "regions": [
        "Japan"
      ],
      "lecture": "<h3>Look first</h3><p>Compare the scale of a person, a temple hall, and the Buddha. What does monumental scale ask a visitor to feel?</p><h3>Place it on the timeline</h3><p>Nara’s eighth-century capital brought court planning, temple building, and Buddhist patronage together. Tōdai-ji’s Great Buddha expressed ambitious religious and political aims. Exchanges with Korea and Tang China mattered, while Japanese makers and patrons shaped local forms. Surviving buildings and sculptures also record later rebuilding.</p>",
      "criticalThinking": "How does Japan change when you consider its original users, materials, and setting?",
      "mission": "Sketch a sequence of gate, courtyard, and hall. Use changing scale to guide attention toward one focal point.",
      "resources": [
        {
          "name": "Read more / official historical context",
          "url": "https://smarthistory.org/todai-ji/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=hle43IAxF6s"
        }
      ],
      "quiz": [
        {
          "q": "Nara’s capital period belongs mainly to the…",
          "opts": [
            "Eighth century",
            "Twentieth century",
            "Neolithic era"
          ],
          "ans": 0
        },
        {
          "q": "Tōdai-ji is associated with…",
          "opts": [
            "European oil academies",
            "Buddhist patronage",
            "Mughal tomb design"
          ],
          "ans": 1
        },
        {
          "q": "Cultural exchange included…",
          "opts": [
            "Only modern America",
            "No external contacts",
            "Korea and Tang China"
          ],
          "ans": 2
        },
        {
          "q": "Monumental scale can communicate…",
          "opts": [
            "Religious and political ambition",
            "Only practical storage",
            "Only landscape perspective"
          ],
          "ans": 0
        },
        {
          "q": "A surviving temple may contain…",
          "opts": [
            "No historical layers",
            "Evidence of later rebuilding",
            "Only untouched original material"
          ],
          "ans": 1
        }
      ],
      "id": 10,
      "videoUrl": "https://www.youtube.com/embed/hle43IAxF6s",
      "videoSource": {
        "title": "Historic Monuments of Ancient Nara (UNESCO/NHK)",
        "channel": "UNESCO",
        "channelUrl": "https://www.youtube.com/@UNESCO",
        "watchUrl": "https://www.youtube.com/watch?v=hle43IAxF6s",
        "note": "English case study. Use the reading and gallery to place this example in its wider historical setting.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "images": [
        {
          "src": "assets/asian/195404338.jpg",
          "title": "Tōdai-ji · Great Buddha Hall (later rebuilding)",
          "credit": "ONO Masanobu",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Todai-ji_Daibutsuden_front_view_in_2011.jpg",
          "license": "CC0",
          "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "slug": "borobudur",
      "title": "Indonesia: Borobudur as a Journey in Stone",
      "startYear": 780,
      "era": "c. 8th–9th centuries CE",
      "regions": [
        "Indonesia"
      ],
      "lecture": "<h3>Look first</h3><p>Follow the change from relief-lined galleries to open terraces. How does the visual density change as a visitor ascends?</p><h3>Place it on the timeline</h3><p>Borobudur in Central Java organizes Buddhist images, narrative reliefs, terraces, and stupas into a structured ascent. Architecture guides the body as well as the eye. Its form belongs to a Javanese setting shaped by regional kingdoms and wider religious networks; it is not simply a copy of an Indian monument.</p>",
      "criticalThinking": "How does Indonesia change when you consider its original users, materials, and setting?",
      "mission": "Create a three-level paper journey: detailed at the bottom, quieter above. Explain how this changes the viewer’s attention.",
      "resources": [
        {
          "name": "Read more / official historical context",
          "url": "https://smarthistory.org/borobudur/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=txujqGtB_6g"
        }
      ],
      "quiz": [
        {
          "q": "Borobudur is located in…",
          "opts": [
            "Central Java",
            "Northern Japan",
            "Iran"
          ],
          "ans": 0
        },
        {
          "q": "Its design makes the visitor…",
          "opts": [
            "Remain outside every terrace",
            "Move through successive levels",
            "View only one flat surface"
          ],
          "ans": 1
        },
        {
          "q": "Narrative reliefs are…",
          "opts": [
            "Oil paintings on canvas",
            "Digital screens",
            "Carved sequences of images"
          ],
          "ans": 2
        },
        {
          "q": "Regional exchange produced…",
          "opts": [
            "Locally developed forms",
            "Only exact copies",
            "No creative change"
          ],
          "ans": 0
        },
        {
          "q": "Comparing Borobudur and Sanchi reveals…",
          "opts": [
            "The same construction date",
            "Different ways to shape sacred movement",
            "Identical building plans"
          ],
          "ans": 1
        }
      ],
      "id": 11,
      "videoUrl": "https://www.youtube.com/embed/txujqGtB_6g",
      "videoSource": {
        "title": "Borobudur Temple Compounds (UNESCO/NHK)",
        "channel": "UNESCO",
        "channelUrl": "https://www.youtube.com/@UNESCO",
        "watchUrl": "https://www.youtube.com/watch?v=txujqGtB_6g",
        "note": "English case study. Use the reading and gallery to place this example in its wider historical setting.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "images": [
        {
          "src": "assets/asian/4838861.jpg",
          "title": "Borobudur · Central Java",
          "credit": "Gunawan Kartapranata",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Borobudur-Nothwest-view.jpg",
          "license": "Public domain",
          "licenseUrl": "https://commons.wikimedia.org/wiki/File:Borobudur-Nothwest-view.jpg",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "slug": "chola",
      "title": "India: Chola Bronze and Shiva in Motion",
      "startYear": 900,
      "era": "c. 9th–13th centuries CE",
      "regions": [
        "India"
      ],
      "lecture": "<h3>Look first</h3><p>Look for the circle, the balanced pose, and the attributes held by the figure. Read the source before interpreting religious symbols.</p><h3>Place it on the timeline</h3><p>Chola-period South India supported remarkable bronze images of Hindu deities. Shiva as Nataraja brings movement, rhythm, destruction, and renewal into one figure. Such images belong to living devotional practices, including processions; a museum display preserves only part of that context.</p>",
      "criticalThinking": "How does India change when you consider its original users, materials, and setting?",
      "mission": "Invent an abstract figure expressing two contrasting forces, such as stillness and motion. Use your own symbols rather than copying sacred attributes.",
      "resources": [
        {
          "name": "Read more / official historical context",
          "url": "https://smarthistory.org/shiva-as-lord-of-the-dance-nataraja/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=IX85uiG86RA"
        }
      ],
      "quiz": [
        {
          "q": "Nataraja is a form of…",
          "opts": [
            "Shiva",
            "A Mughal emperor",
            "A Japanese printmaker"
          ],
          "ans": 0
        },
        {
          "q": "Chola bronzes are associated with…",
          "opts": [
            "Modern Korea",
            "South India",
            "Northern Europe"
          ],
          "ans": 1
        },
        {
          "q": "Museum display can leave out…",
          "opts": [
            "All evidence of material",
            "The object’s existence",
            "Ritual movement and use"
          ],
          "ans": 2
        },
        {
          "q": "A figure’s attributes help communicate…",
          "opts": [
            "Religious meanings",
            "Only its price",
            "Only the sculptor’s age"
          ],
          "ans": 0
        },
        {
          "q": "A respectful interpretation uses…",
          "opts": [
            "Only resemblance to modern dance",
            "Historical and devotional context",
            "Invented meanings alone"
          ],
          "ans": 1
        }
      ],
      "id": 12,
      "videoUrl": "https://www.youtube.com/embed/IX85uiG86RA",
      "videoSource": {
        "title": "Beliefs Made Visible: Hindu Art in South Asia (Part 1 of 2)",
        "channel": "Asian Art Museum",
        "channelUrl": "https://www.youtube.com/@AsianArtMuseum",
        "watchUrl": "https://www.youtube.com/watch?v=IX85uiG86RA",
        "note": "English thematic introduction to Hindu art and living practice, rather than a dedicated Chola survey. Use the Nataraja reading and image for the period-specific case study.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "images": [
        {
          "src": "assets/asian/75999944.jpg",
          "title": "Shiva Nataraja · Chola-period bronze",
          "credit": "See source record",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Clevelandart_1930.331.jpg",
          "license": "CC0",
          "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "slug": "goryeo",
      "title": "Korea: Goryeo Celadon and Inlaid Nature",
      "startYear": 918,
      "era": "918–1392 CE",
      "regions": [
        "Korea"
      ],
      "lecture": "<h3>Look first</h3><p>Find the relationship between vessel silhouette, glaze color, and surface pattern. Which detail would disappear at a distance?</p><h3>Place it on the timeline</h3><p>Goryeo potters developed celebrated celadon wares with luminous green glazes. Inlay techniques could place light and dark patterns beneath the glaze, giving cranes, clouds, or plants a distinct presence. Chinese ceramics formed part of a wider exchange, but Korean makers developed their own approaches and tastes.</p>",
      "criticalThinking": "How does Korea change when you consider its original users, materials, and setting?",
      "mission": "Design a vessel silhouette and add an inlaid pattern using two contrasting paper colors. Leave room for the surface itself to matter.",
      "resources": [
        {
          "name": "Read more / official historical context",
          "url": "https://smarthistory.org/korean-celadons-goryeo/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=frkHrfqmX-8"
        }
      ],
      "quiz": [
        {
          "q": "Celadon is known for its…",
          "opts": [
            "Green-toned glaze",
            "Printed photographic surface",
            "Unfired paper body"
          ],
          "ans": 0
        },
        {
          "q": "Goryeo was a dynasty in…",
          "opts": [
            "Cambodia",
            "Korea",
            "Iran"
          ],
          "ans": 1
        },
        {
          "q": "Inlay places contrasting material…",
          "opts": [
            "Only beside the vessel",
            "On a museum label",
            "Into a prepared surface"
          ],
          "ans": 2
        },
        {
          "q": "Exchange with Chinese ceramics meant…",
          "opts": [
            "Influence alongside local invention",
            "No Korean contribution",
            "Identical products in all kilns"
          ],
          "ans": 0
        },
        {
          "q": "A ceramic’s appearance depends on…",
          "opts": [
            "Frame size alone",
            "Form, surface, and firing",
            "Title alone"
          ],
          "ans": 1
        }
      ],
      "id": 13,
      "videoUrl": "https://www.youtube.com/embed/frkHrfqmX-8",
      "videoSource": {
        "title": "Rediscovering Korea's Past",
        "channel": "Smithsonian National Museum of Asian Art",
        "channelUrl": "https://www.youtube.com/@NatAsianArt",
        "watchUrl": "https://www.youtube.com/watch?v=frkHrfqmX-8",
        "note": "English case study. Use the reading and gallery to place this example in its wider historical setting.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "images": [
        {
          "src": "assets/asian/2758366.jpg",
          "title": "Maebyeong vase · Goryeo celadon",
          "credit": "The original uploader was Korea history at English Wikipedia.",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Goryeo_Celadon.jpg",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "id": 14,
      "title": "Song: Landscape Painting and the Philosophy of Nature",
      "era": "960 – 1279",
      "videoUrl": "https://www.youtube.com/embed/JO5Dkq9Q_ao",
      "lecture": "<h3>Mountains as Moral Order</h3><p>Song landscape painting is not just scenery. It is a worldview: nature as cosmic structure, human life as small yet meaningful, and brushwork as an extension of cultivated mind.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Monumental Landscapes:</strong> Mountains, mist, layered depth.</li><li><strong>Brush as Thinking:</strong> Ink methods reflect ethics and discipline.</li><li><strong>Shifting Viewpoints:</strong> ‘Floating’ perspective across scroll space.</li><li><strong>Human Scale:</strong> Tiny figures emphasize philosophical humility.</li></ul>",
      "criticalThinking": "Why would an educated elite value a painting that makes humans look tiny and powerless?",
      "mission": "<strong>Ink Wash Depth:</strong> Paint a simple mountain using only 3 ink values: light wash (mist), mid (rocks), dark (trees). Avoid outlines. Let atmosphere do the work.",
      "images": [
        {
          "src": "assets/asian/22627463.jpg",
          "title": "Fan Kuan · Travelers Among Mountains and Streams",
          "credit": "Fan Kuan",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Fan_Kuan_-_Travelers_Among_Mountains_and_Streams_-_Google_Art_Project.jpg",
          "license": "Public domain",
          "licenseUrl": "https://commons.wikimedia.org/wiki/File:Fan_Kuan_-_Travelers_Among_Mountains_and_Streams_-_Google_Art_Project.jpg",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://smarthistory.org/neo-confucianism-fan-kuan-travelers-by-streams-and-mountains/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=JO5Dkq9Q_ao"
        }
      ],
      "quiz": [
        {
          "q": "Song landscapes often communicate...",
          "opts": [
            "Only tourism ads",
            "Cosmic order and philosophy",
            "No meaning"
          ],
          "ans": 1
        },
        {
          "q": "A key spatial idea in scroll painting is...",
          "opts": [
            "Single camera lens view only",
            "Shifting viewpoints across space",
            "No depth at all"
          ],
          "ans": 1
        },
        {
          "q": "Tiny human figures usually suggest...",
          "opts": [
            "Human dominance",
            "Humility and scale",
            "Comedy"
          ],
          "ans": 1
        },
        {
          "q": "Ink values help create...",
          "opts": [
            "Atmosphere and depth",
            "Plastic shine",
            "Neon glow"
          ],
          "ans": 0
        },
        {
          "q": "Brushwork is often understood as...",
          "opts": [
            "Pure accident",
            "A reflection of cultivated mind",
            "Industrial printing"
          ],
          "ans": 1
        }
      ],
      "sourceChineseId": 7,
      "slug": "china-7",
      "startYear": 960,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "Chinese Landscape Paintings at the Metropolitan Museum II | Ancient Art Links",
        "channel": "CUNY TV",
        "channelUrl": "https://www.youtube.com/@cunytv",
        "watchUrl": "https://www.youtube.com/watch?v=JO5Dkq9Q_ao",
        "note": "A museum tour of the landscape tradition from Song onward. Compare later reinterpretations with the Song painting in the gallery.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "id": 15,
      "title": "Song Ceramics: Form, Silence, and Taste",
      "era": "960 – 1279",
      "videoUrl": "https://www.youtube.com/embed/v81CeT1MNtE",
      "lecture": "<h3>Minimal Beauty, Maximum Precision</h3><p>Song ceramics represent refined restraint. Subtle glaze, quiet form, and technical mastery became the ideal of elite taste, where perfection hides inside understatement.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Five Great Kilns:</strong> Ru, Guan, Ge, Ding, Jun (classic categories).</li><li><strong>Glaze as Atmosphere:</strong> Crackle, translucency, soft color.</li><li><strong>Form Discipline:</strong> Shape and proportion as moral ‘taste.’</li><li><strong>Object as Philosophy:</strong> Quiet objects reflect cultivated life.</li></ul>",
      "criticalThinking": "Why would subtle, nearly ‘plain’ objects become the highest luxury? What does that say about cultural values?",
      "mission": "<strong>Silent Object Study:</strong> Draw a cup/bowl in 3 angles. Keep lines minimal. Add one ‘glaze note’ (a single texture: crackle, misty blue, or matte white).",
      "images": [
        {
          "src": "assets/asian/30564679.jpg",
          "title": "Ding-ware bowl with geese · Song dynasty",
          "credit": "BabelStone",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ding_ware_bowl_with_wild_geese_pattern.jpg",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://smarthistory.org/ding-ware-bowl-northern-song-dynasty/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=v81CeT1MNtE"
        }
      ],
      "quiz": [
        {
          "q": "Song ceramic aesthetics are often described as...",
          "opts": [
            "Loud and flashy",
            "Subtle and restrained",
            "Only metallic"
          ],
          "ans": 1
        },
        {
          "q": "Glaze can function like...",
          "opts": [
            "Atmosphere",
            "Textbook words",
            "Random noise"
          ],
          "ans": 0
        },
        {
          "q": "Elite taste favored...",
          "opts": [
            "Understatement and precision",
            "Maximum decoration always",
            "No craft skill"
          ],
          "ans": 0
        },
        {
          "q": "Ceramics matter because they show...",
          "opts": [
            "Objects as philosophy",
            "Objects as jokes",
            "Only children toys"
          ],
          "ans": 0
        },
        {
          "q": "A kiln tradition indicates...",
          "opts": [
            "Industrial mass plastic",
            "Regional technical mastery",
            "Nothing cultural"
          ],
          "ans": 1
        }
      ],
      "sourceChineseId": 8,
      "slug": "china-8",
      "startYear": 960,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "White Porcelain, Ding ware in the Northern Song dynasty",
        "channel": "Smarthistory",
        "channelUrl": "https://www.youtube.com/@smarthistory-art-history",
        "watchUrl": "https://www.youtube.com/watch?v=v81CeT1MNtE",
        "note": "A Northern Song Ding-ware case study. Notice how carved decoration works with a nearly monochrome glaze.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "slug": "angkor",
      "title": "Cambodia: Angkor Wat, Temple and Cosmos",
      "startYear": 1100,
      "era": "Early 12th century CE",
      "regions": [
        "Cambodia"
      ],
      "lecture": "<h3>Look first</h3><p>Find a central focus, a boundary, and an approach. How do water and architecture control the visitor’s route?</p><h3>Place it on the timeline</h3><p>Angkor Wat was built within the Khmer Empire and initially dedicated to Vishnu. Its towers, enclosures, water, and reliefs connect sacred geography with royal patronage. Its later Buddhist use reminds us that sites can carry several histories. Avoid treating a living religious site only as a picturesque ruin.</p>",
      "criticalThinking": "How does Cambodia change when you consider its original users, materials, and setting?",
      "mission": "Make a small plan for a place of reflection. Use nested spaces and one deliberate threshold to guide movement.",
      "resources": [
        {
          "name": "Read more / official historical context",
          "url": "https://smarthistory.org/angkor-wat/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=NJyCKj8pCiY"
        }
      ],
      "quiz": [
        {
          "q": "Angkor Wat belongs to the history of…",
          "opts": [
            "The Khmer Empire",
            "The Roman Republic",
            "The Edo shogunate"
          ],
          "ans": 0
        },
        {
          "q": "Its initial dedication was to…",
          "opts": [
            "A twentieth-century artist",
            "Vishnu",
            "A Song emperor"
          ],
          "ans": 1
        },
        {
          "q": "The site later also supported…",
          "opts": [
            "Only factory production",
            "No further use",
            "Buddhist practice"
          ],
          "ans": 2
        },
        {
          "q": "Towers and enclosures can refer to…",
          "opts": [
            "Sacred geography",
            "Only military camouflage",
            "Only a painter’s signature"
          ],
          "ans": 0
        },
        {
          "q": "A careful account of the site recognizes…",
          "opts": [
            "Only tourist photography",
            "Changing uses over time",
            "Only one frozen moment"
          ],
          "ans": 1
        }
      ],
      "id": 16,
      "videoUrl": "https://www.youtube.com/embed/NJyCKj8pCiY",
      "videoSource": {
        "title": "Before You Visit Angkor Wat, Here's What You Need to Know | National Geographic",
        "channel": "National Geographic",
        "channelUrl": "https://www.youtube.com/@NatGeo",
        "watchUrl": "https://www.youtube.com/watch?v=NJyCKj8pCiY",
        "note": "English case study. Use the reading and gallery to place this example in its wider historical setting.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "images": [
        {
          "src": "assets/asian/123792913.jpg",
          "title": "Angkor Wat · Cambodia",
          "credit": "Satdeep Gill",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Angkor_Wat_with_its_reflection_(cropped).jpg",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "id": 17,
      "title": "Yuan Dynasty: Literati Painting & Identity",
      "era": "1271 – 1368",
      "videoUrl": "https://www.youtube.com/embed/QkHoGrbx730",
      "lecture": "<h3>Painting as Moral Resistance</h3><p>Under Mongol rule, many Chinese scholar-officials turned to painting and calligraphy as an inner refuge. Literati painting valued personal expression, brush character, and cultured understatement over realism.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Literati Ideals:</strong> Painting as extension of calligraphy.</li><li><strong>Brush Personality:</strong> ‘Good painting’ = good character.</li><li><strong>Deliberate Simplicity:</strong> Sparse composition as identity statement.</li><li><strong>Art as Self-Positioning:</strong> Visual choices reflect social and political stance.</li></ul>",
      "criticalThinking": "If realism is not the goal, how do we judge ‘quality’ in literati painting?",
      "mission": "<strong>Brush Character Exercise:</strong> Paint the same tree 3 times: (1) careful, (2) fast, (3) broken/dry brush. Which one feels more ‘you’?",
      "images": [
        {
          "src": "assets/asian/66620145.jpg",
          "title": "Wang Mian · Ink Plum",
          "credit": "Wang Mian",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Wang_Mian_-_Ink_Plum_-_1954.40.3_-_Yale_University_Art_Gallery.jpg",
          "license": "Public domain",
          "licenseUrl": "https://commons.wikimedia.org/wiki/File:Wang_Mian_-_Ink_Plum_-_1954.40.3_-_Yale_University_Art_Gallery.jpg",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://smarthistory.org/wang-mian-plum-blossoms-in-ink/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=QkHoGrbx730"
        }
      ],
      "quiz": [
        {
          "q": "Literati painting values...",
          "opts": [
            "Photographic realism",
            "Brush character and inner expression",
            "Only gold backgrounds"
          ],
          "ans": 1
        },
        {
          "q": "A core idea is that painting relates to...",
          "opts": [
            "Calligraphy",
            "Car engines",
            "Dance only"
          ],
          "ans": 0
        },
        {
          "q": "Sparse composition can function as...",
          "opts": [
            "Identity statement",
            "Accident always",
            "Pure decoration"
          ],
          "ans": 0
        },
        {
          "q": "Quality is judged by...",
          "opts": [
            "Only color brightness",
            "Cultural/brush intelligence",
            "Sticker price only"
          ],
          "ans": 1
        },
        {
          "q": "This period is shaped by...",
          "opts": [
            "Mongol rule and social shifts",
            "Total peace always",
            "No politics"
          ],
          "ans": 0
        }
      ],
      "sourceChineseId": 9,
      "slug": "china-9",
      "startYear": 1271,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "Painting and Poetry Among Friends",
        "channel": "Smarthistory",
        "channelUrl": "https://www.youtube.com/@smarthistory-art-history",
        "watchUrl": "https://www.youtube.com/watch?v=QkHoGrbx730",
        "note": "Wang Mian’s plum painting connects poetry, friendship, and brushwork within Yuan literati culture.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "id": 18,
      "title": "Ming: Court Painting, Workshops, and Urban Culture",
      "era": "1368 – 1644",
      "videoUrl": "https://www.youtube.com/embed/9FAfK6MDA-Q",
      "lecture": "<h3>Professionalization and Pleasure</h3><p>Ming visual culture expanded: court ateliers produced grand works, literati schools flourished, and urban markets fueled prints, illustrated books, and decorative arts.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Court vs Literati:</strong> Institution style vs scholar taste.</li><li><strong>Wu School:</strong> Suzhou-based literati tradition.</li><li><strong>Print Culture:</strong> Illustrated books spread imagery to broader publics.</li><li><strong>Market & Patronage:</strong> Art becomes a profession and commodity.</li></ul>",
      "criticalThinking": "When art becomes a market product, does it lose ‘purity’ or gain new creative freedom?",
      "mission": "<strong>Illustrated Page Study:</strong> Design one page for an imaginary Ming book: small image + title + 3 lines of caption. Focus on clean layout.",
      "images": [
        {
          "src": "assets/asian/22247191.jpg",
          "title": "Wang Lü · Mount Hua",
          "credit": "Wang Lü",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Le_Mont_Hua_par_Wang_L%C3%BC.jpg",
          "license": "Public domain",
          "licenseUrl": "https://commons.wikimedia.org/wiki/File:Le_Mont_Hua_par_Wang_L%C3%BC.jpg",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://smarthistory.org/wang-lu-landscapes-of-mount-hua-huashan/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=9FAfK6MDA-Q"
        }
      ],
      "quiz": [
        {
          "q": "Ming art culture expands due to...",
          "opts": [
            "No cities",
            "Urban markets and print culture",
            "Only cave temples"
          ],
          "ans": 1
        },
        {
          "q": "Court painting is often linked to...",
          "opts": [
            "Institutional ateliers",
            "Random street graffiti only",
            "No patrons"
          ],
          "ans": 0
        },
        {
          "q": "Print culture matters because it...",
          "opts": [
            "Limits access",
            "Spreads imagery widely",
            "Erases all images"
          ],
          "ans": 1
        },
        {
          "q": "Art markets can create...",
          "opts": [
            "New professions and audiences",
            "Only silence",
            "No change"
          ],
          "ans": 0
        },
        {
          "q": "The Ming period shows...",
          "opts": [
            "Art as commodity and culture",
            "Art as invisible",
            "Art with no viewers"
          ],
          "ans": 0
        }
      ],
      "sourceChineseId": 10,
      "slug": "china-10",
      "startYear": 1368,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "Wang Lü among the peaks, Ming paintings of Mt. Hua",
        "channel": "Smarthistory",
        "channelUrl": "https://www.youtube.com/@smarthistory-art-history",
        "watchUrl": "https://www.youtube.com/watch?v=9FAfK6MDA-Q",
        "note": "An early Ming mountain-painting case study. Compare direct observation with inherited pictorial conventions.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "id": 19,
      "title": "Ming Porcelain: Blue-and-White and Global Trade",
      "era": "1400s – 1600s",
      "videoUrl": "https://www.youtube.com/embed/uwvRXJd22oI",
      "lecture": "<h3>Jingdezhen and the World</h3><p>Blue-and-white porcelain became a global luxury. Produced at Jingdezhen, these objects prove that Chinese art history is also world history: taste, trade, and technology moved across oceans.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Cobalt Blue:</strong> Imported pigment shaped iconic style.</li><li><strong>Industrial Scale Workshops:</strong> Highly organized production system.</li><li><strong>Global Markets:</strong> Islamic world and Europe consumed and adapted Chinese forms.</li><li><strong>Pattern Systems:</strong> Dragons, florals, narrative scenes as export language.</li></ul>",
      "criticalThinking": "If a style becomes global, who ‘owns’ it: the maker, the buyer, or the culture that remixes it?",
      "mission": "<strong>Blue Pattern Design:</strong> Design a circular plate pattern using only blue pen. Use 3 zones: rim border, mid band, center scene.",
      "images": [
        {
          "src": "assets/asian/98303334.jpg",
          "title": "Blue-and-white porcelain · Ming dynasty",
          "credit": "Gary Todd",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ming_Porcelain_Blue_%26_White_Pot.jpg",
          "license": "CC0",
          "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://www.britishmuseum.org/collection/china/introduction-ming-blue-and-white-porcelain"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=uwvRXJd22oI"
        }
      ],
      "quiz": [
        {
          "q": "Blue-and-white porcelain became global partly because of...",
          "opts": [
            "Airplanes",
            "Trade networks and demand",
            "No buyers"
          ],
          "ans": 1
        },
        {
          "q": "Jingdezhen is best known as...",
          "opts": [
            "A cave temple",
            "A major porcelain production center",
            "A Roman city"
          ],
          "ans": 1
        },
        {
          "q": "Cobalt pigment was often...",
          "opts": [
            "Imported and influential",
            "Only made from plastic",
            "Never used"
          ],
          "ans": 0
        },
        {
          "q": "Workshop systems suggest...",
          "opts": [
            "Organized large-scale craft",
            "No planning",
            "Only one artist"
          ],
          "ans": 0
        },
        {
          "q": "Export objects can reshape...",
          "opts": [
            "Global taste",
            "Nothing",
            "Only local weather"
          ],
          "ans": 0
        }
      ],
      "sourceChineseId": 11,
      "slug": "china-11",
      "startYear": 1400,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "An introduction to Ming blue and white porcelain | Curator's Corner S5 Ep6 #CuratorsCorner",
        "channel": "The British Museum",
        "channelUrl": "https://www.youtube.com/@britishmuseum",
        "watchUrl": "https://www.youtube.com/watch?v=uwvRXJd22oI",
        "note": "A curator introduction to blue-and-white porcelain. Consider how materials, workshops, and overseas audiences shape an object.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "slug": "byobu",
      "title": "Japan: Byōbu — Painting That Shapes a Room",
      "startYear": 1500,
      "era": "Late 15th–early 16th century CE",
      "regions": [
        "Japan"
      ],
      "lecture": "<h3>Look first</h3><p>Imagine the panels partly folded. Follow the bamboo across the seams and notice the relationship between solid plants, gold, and empty space.</p><h3>Place it on the timeline</h3><p>Byōbu are folding screens that divide interior space, provide privacy, and carry paintings. Unlike a painting fixed flat on a wall, a screen changes as its panels turn and a viewer moves. Bamboo in the Four Seasons connects Chinese bamboo imagery with Japanese seasonal poetry. The paintings were probably remounted from an earlier interior format, reminding us that objects can change form over time.</p>",
      "criticalThinking": "How does Japan change when you consider its original users, materials, and setting?",
      "mission": "Fold a strip of paper into four panels. Draw one plant across the seams; compare the composition when flat and when standing. Add a doorway or figure to show its scale in a room.",
      "resources": [
        {
          "name": "Read more / official historical context",
          "url": "https://smarthistory.org/tosa-mistunobu/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=vwoK8-y-5_U"
        }
      ],
      "quiz": [
        {
          "q": "Byōbu are…",
          "opts": [
            "Folding screens",
            "Mosquito nets",
            "Ceramic bowls"
          ],
          "ans": 0
        },
        {
          "q": "A screen can…",
          "opts": [
            "Only store books",
            "Divide space and carry painting",
            "Only hang flat on a wall"
          ],
          "ans": 1
        },
        {
          "q": "Folding changes…",
          "opts": [
            "The original artist’s name",
            "The work’s historical date",
            "Viewing angles and spatial rhythm"
          ],
          "ans": 2
        },
        {
          "q": "Bamboo in this work connects…",
          "opts": [
            "Chinese imagery and Japanese poetry",
            "Only modern advertising",
            "Only European oil painting"
          ],
          "ans": 0
        },
        {
          "q": "Remounting means that an object may…",
          "opts": [
            "Become a different material automatically",
            "Acquire a new physical format",
            "Lose all historical meaning"
          ],
          "ans": 1
        }
      ],
      "id": 20,
      "videoUrl": "https://www.youtube.com/embed/vwoK8-y-5_U",
      "videoSource": {
        "title": "Bamboo in the Four Seasons: painting and poetry in Japan",
        "channel": "Smarthistory",
        "channelUrl": "https://www.youtube.com/@smarthistory-art-history",
        "watchUrl": "https://www.youtube.com/watch?v=vwoK8-y-5_U",
        "note": "English case study. Use the reading and gallery to place this example in its wider historical setting.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "images": [
        {
          "src": "assets/asian/58765839.jpg",
          "title": "Bamboo in the Four Seasons · Attributed to Tosa Mitsunobu",
          "credit": "The Metropolitan Museum of Art · Open Access",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:%E5%9B%9B%E5%AD%A3%E7%AB%B9%E5%9B%B3%E5%B1%8F%E9%A2%A8-Bamboo_in_the_Four_Seasons_MET_DT1607.jpg",
          "license": "CC0",
          "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "slug": "safavid",
      "title": "Iran: A Painted World in the Shahnama",
      "startYear": 1524,
      "era": "c. 1524–1535 CE",
      "regions": [
        "Iran"
      ],
      "lecture": "<h3>Look first</h3><p>Follow the figures through the landscape. Notice how color and placement create hierarchy without relying on a single vanishing point.</p><h3>Place it on the timeline</h3><p>Safavid court workshops brought painting, calligraphy, paper, and precious materials together in illustrated manuscripts. The Court of Gayumars belongs to Shah Tahmasp’s Shahnama, a version of the Persian Book of Kings. Landscape and figures organize a richly layered page. Later dispersal of manuscripts changes how these pages are encountered.</p>",
      "criticalThinking": "How does Iran change when you consider its original users, materials, and setting?",
      "mission": "Design a story page with three levels of space. Make the central figure important through placement, not size alone.",
      "resources": [
        {
          "name": "Read more / official historical context",
          "url": "https://smarthistory.org/the-court-of-gayumars/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=pLHnipC48P0"
        }
      ],
      "quiz": [
        {
          "q": "The Shahnama is also called…",
          "opts": [
            "The Book of Kings",
            "The Book of Tea",
            "The Analects"
          ],
          "ans": 0
        },
        {
          "q": "This manuscript was made in a…",
          "opts": [
            "Modern television studio",
            "Safavid court context",
            "Jōmon village"
          ],
          "ans": 1
        },
        {
          "q": "A manuscript page can combine…",
          "opts": [
            "Only photography",
            "Only bronze casting",
            "Painting and calligraphy"
          ],
          "ans": 2
        },
        {
          "q": "Figure placement can establish…",
          "opts": [
            "Narrative hierarchy",
            "A chemical formula",
            "A kiln temperature"
          ],
          "ans": 0
        },
        {
          "q": "Separating manuscript leaves changes…",
          "opts": [
            "Their original language",
            "Their reading context",
            "Their original date"
          ],
          "ans": 1
        }
      ],
      "id": 21,
      "videoUrl": "https://www.youtube.com/embed/pLHnipC48P0",
      "videoSource": {
        "title": "Paradise in miniature, The Court of Kayumars",
        "channel": "Smarthistory",
        "channelUrl": "https://www.youtube.com/@smarthistory-art-history",
        "watchUrl": "https://www.youtube.com/watch?v=pLHnipC48P0",
        "note": "English case study. Use the reading and gallery to place this example in its wider historical setting.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "images": [
        {
          "src": "assets/asian/6023256.jpg",
          "title": "Sultan Muhammad (attributed) · Court of Gayumars",
          "credit": "Attributed to Sultan Muhammad",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Court_of_Gayumars_Persian_miniature.jpg",
          "license": "Public domain",
          "licenseUrl": "https://commons.wikimedia.org/wiki/File:Court_of_Gayumars_Persian_miniature.jpg",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "slug": "oribe",
      "title": "Japan: Tea, Touch, and Deliberate Irregularity",
      "startYear": 1600,
      "era": "Early 17th century CE",
      "regions": [
        "Japan"
      ],
      "lecture": "<h3>Look first</h3><p>Imagine holding the bowl. Locate an irregular edge and a motif that appears only as the vessel turns.</p><h3>Place it on the timeline</h3><p>Tea gatherings gave bowls a role in social encounter and close looking. Oribe ceramics could deliberately favor asymmetry, bold marks, and uneven profiles. The practice developed through exchanges among Chinese, Korean, and Japanese objects and makers. These preferences were historically specific, not an unchanging definition of all Japanese taste.</p>",
      "criticalThinking": "How does Japan change when you consider its original users, materials, and setting?",
      "mission": "Draw two views of one bowl. Make one small irregularity useful to the experience of holding or looking.",
      "resources": [
        {
          "name": "Read more / official historical context",
          "url": "https://smarthistory.org/oribe-tea-bowl/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=-hxs8uOdvxM"
        }
      ],
      "quiz": [
        {
          "q": "The featured Oribe bowl dates to the…",
          "opts": [
            "Early seventeenth century",
            "Early Neolithic",
            "Late twentieth century"
          ],
          "ans": 0
        },
        {
          "q": "Its irregularity can be…",
          "opts": [
            "A printing error",
            "A deliberate aesthetic choice",
            "Proof of no skill"
          ],
          "ans": 1
        },
        {
          "q": "A tea bowl invites…",
          "opts": [
            "Only distant viewing",
            "Only reading a title",
            "Touch and changing viewpoints"
          ],
          "ans": 2
        },
        {
          "q": "Tea cultures developed through…",
          "opts": [
            "Exchange and local choices",
            "Complete isolation",
            "One universal taste"
          ],
          "ans": 0
        },
        {
          "q": "The plum motif can carry…",
          "opts": [
            "Only a price",
            "Poetic associations",
            "Only a factory number"
          ],
          "ans": 1
        }
      ],
      "id": 22,
      "videoUrl": "https://www.youtube.com/embed/-hxs8uOdvxM",
      "videoSource": {
        "title": "Celebrating the imperfect, an Oribe tea bowl",
        "channel": "Smarthistory",
        "channelUrl": "https://www.youtube.com/@smarthistory-art-history",
        "watchUrl": "https://www.youtube.com/watch?v=-hxs8uOdvxM",
        "note": "English case study. Use the reading and gallery to place this example in its wider historical setting.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "images": [
        {
          "src": "assets/asian/58772077.jpg",
          "title": "Clog-shaped Oribe tea bowl · Early 17th century",
          "credit": "The Metropolitan Museum of Art · Open Access",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:MET_DP244299.jpg",
          "license": "CC0",
          "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "slug": "shodo",
      "title": "Japan: Shodō, Kana, and the Poetry of Brushwork",
      "startYear": 1624,
      "era": "c. 1624–1637 CE · With Heian precedents",
      "regions": [
        "Japan"
      ],
      "lecture": "<h3>Look first</h3><p>Look at the poem cards before trying to read them. Compare the spacing, flow, and placement of writing with the Chinese calligraphy lesson. What do you notice without knowing either language?</p><h3>Place it on the timeline</h3><p>Japanese calligraphy developed through the use of Chinese characters (kanji) and Japanese phonetic scripts (kana). Heian court culture fostered distinctive kana practices, including the work of women writers. Centuries later, Hon’ami Kōetsu combined calligraphy with decorated poetry cards on screens. This example shows writing as composition, language, and collaboration; Zen brushwork is another strand, not the whole tradition.</p>",
      "criticalThinking": "How does Japan change when you consider its original users, materials, and setting?",
      "mission": "Choose a short phrase in a language you know. Arrange it in three different rhythms on paper, varying spacing and line length. Label it as your own lettering study, not Japanese calligraphy.",
      "resources": [
        {
          "name": "Read more / official historical context",
          "url": "https://smarthistory.org/honami-koetsu-folding-screen-with-poems/"
        },
        {
          "name": "The Met: Brush Writing in the Arts of Japan",
          "url": "https://www.metmuseum.org/exhibitions/listings/2013/brush-writing"
        },
        {
          "name": "Optional living-practice demonstration: Zen Calligraphy — Asian Art Museum",
          "url": "https://education.asianart.org/resources/zen-calligraphy/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=CJ17bWVrgho"
        }
      ],
      "quiz": [
        {
          "q": "Kana are…",
          "opts": [
            "Japanese phonetic scripts",
            "A porcelain glaze",
            "A temple plan"
          ],
          "ans": 0
        },
        {
          "q": "Kanji refers to…",
          "opts": [
            "A woodblock tool",
            "Chinese characters used in Japanese writing",
            "Only abstract marks"
          ],
          "ans": 1
        },
        {
          "q": "Heian calligraphic culture included…",
          "opts": [
            "Only modern television",
            "No literary practice",
            "Women writers and court poetry"
          ],
          "ans": 2
        },
        {
          "q": "Kōetsu’s screen combines…",
          "opts": [
            "Poetry, calligraphy, and decorated surfaces",
            "Only bronze and stone",
            "Only photographs"
          ],
          "ans": 0
        },
        {
          "q": "Zen calligraphy represents…",
          "opts": [
            "A technique unrelated to brushwork",
            "One strand of Japanese brush culture",
            "All Japanese writing across history"
          ],
          "ans": 1
        }
      ],
      "id": 23,
      "videoUrl": "https://www.youtube.com/embed/CJ17bWVrgho",
      "videoSource": {
        "title": "A garden for a poet:  Hon'ami Kōetsu's folding screens",
        "channel": "Smarthistory",
        "channelUrl": "https://www.youtube.com/@smarthistory-art-history",
        "watchUrl": "https://www.youtube.com/watch?v=CJ17bWVrgho",
        "note": "English discussion of Kōetsu’s calligraphy on poetry screens. Read the Met overview for the earlier development of kana and kanji. The optional museum demonstration shows a living Zen practice.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "images": [
        {
          "src": "assets/asian/59375291.jpg",
          "title": "Hon’ami Kōetsu · Autumn Poem by Lady Kunaikyō",
          "credit": "The Metropolitan Museum of Art · Open Access",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:MET_DP-12232-315.jpg",
          "license": "CC0",
          "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "slug": "mughal",
      "title": "India: The Taj Mahal and Mughal Design",
      "startYear": 1631,
      "era": "1631–1648 CE",
      "regions": [
        "India"
      ],
      "lecture": "<h3>Look first</h3><p>Trace the main axis. Then look for small-scale details that reward moving closer to the marble surfaces.</p><h3>Place it on the timeline</h3><p>The Taj Mahal at Agra was commissioned by Shah Jahan as a mausoleum for Mumtaz Mahal. Mughal architecture brought Persianate, Islamic, and South Asian design traditions into new relationships. Symmetry, gardens, calligraphy, marble, and inlaid stone work together to shape an experience of remembrance and imperial ambition.</p>",
      "criticalThinking": "How does India change when you consider its original users, materials, and setting?",
      "mission": "Design a memorial space using an axis and a repeated detail. Explain how the plan and the surface each support remembrance.",
      "resources": [
        {
          "name": "Read more / official historical context",
          "url": "https://smarthistory.org/the-taj-mahal/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=KZzgvng_5GE"
        }
      ],
      "quiz": [
        {
          "q": "The Taj Mahal was commissioned as a…",
          "opts": [
            "Mausoleum",
            "Ceramics kiln",
            "Theater"
          ],
          "ans": 0
        },
        {
          "q": "Its patron was…",
          "opts": [
            "Hokusai",
            "Shah Jahan",
            "Fan Kuan"
          ],
          "ans": 1
        },
        {
          "q": "Its location is…",
          "opts": [
            "Nara, Japan",
            "Luoyang, China",
            "Agra, India"
          ],
          "ans": 2
        },
        {
          "q": "Mughal design drew on…",
          "opts": [
            "Several interacting traditions",
            "Only one isolated source",
            "Only modern technology"
          ],
          "ans": 0
        },
        {
          "q": "Close looking reveals…",
          "opts": [
            "Only plain concrete",
            "Inlay and calligraphy",
            "Printed plastic panels"
          ],
          "ans": 1
        }
      ],
      "id": 24,
      "videoUrl": "https://www.youtube.com/embed/KZzgvng_5GE",
      "videoSource": {
        "title": "Taj Mahal (UNESCO/NHK)",
        "channel": "UNESCO",
        "channelUrl": "https://www.youtube.com/@UNESCO",
        "watchUrl": "https://www.youtube.com/watch?v=KZzgvng_5GE",
        "note": "English case study. Use the reading and gallery to place this example in its wider historical setting.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "images": [
        {
          "src": "assets/asian/11293223.jpg",
          "title": "Taj Mahal · Agra",
          "credit": "Yann; edited by King of Hearts",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Taj_Mahal,_Agra,_India_edit2.jpg",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "id": 25,
      "title": "Qing Painting: Court Splendor and Individual Voices",
      "era": "1644 – 1911",
      "videoUrl": "https://www.youtube.com/embed/lpZsBrHTdy0",
      "lecture": "<h3>Empire and the Artist’s Self</h3><p>Qing art includes both court grandeur and strong individualist painting traditions. The same empire that collected and classified culture also produced artists who used brushwork to assert personal identity.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Court Patronage:</strong> Large projects, archives, and imperial taste.</li><li><strong>Individualist Painters:</strong> Distinct brush voices after dynastic trauma.</li><li><strong>Collecting & Cataloging:</strong> Art history as state project.</li><li><strong>Continuity + Reinvention:</strong> Older models reinterpreted.</li></ul>",
      "criticalThinking": "When an empire controls the canon (what counts as ‘great’), how can artists still be free?",
      "mission": "<strong>Old Master Remix:</strong> Pick one historical motif (bamboo, rock, orchid). Draw it twice: (1) ‘traditional’ careful, (2) ‘personal’ exaggerated and fast.",
      "images": [
        {
          "src": "assets/asian/13318800.jpg",
          "title": "Bada Shanren · Lotus and Ducks",
          "credit": "Bada Shanren",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bada_Shanren_-_Lotus_and_Ducks_-_Google_Art_Project.jpg",
          "license": "Public domain",
          "licenseUrl": "https://commons.wikimedia.org/wiki/File:Bada_Shanren_-_Lotus_and_Ducks_-_Google_Art_Project.jpg",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://smarthistory.org/bada-shanren-lotus-and-ducks/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=lpZsBrHTdy0"
        }
      ],
      "quiz": [
        {
          "q": "Qing art includes...",
          "opts": [
            "Only court style",
            "Court patronage and individualist voices",
            "No painting"
          ],
          "ans": 1
        },
        {
          "q": "Imperial collecting often aims to...",
          "opts": [
            "Destroy all art",
            "Define the canon",
            "Avoid history"
          ],
          "ans": 1
        },
        {
          "q": "Individualist painters often emphasize...",
          "opts": [
            "Personal brush voice",
            "Perfect photography",
            "Plastic texture"
          ],
          "ans": 0
        },
        {
          "q": "Artists can respond to control by...",
          "opts": [
            "Reinterpreting tradition",
            "Stopping all art forever",
            "Only copying machines"
          ],
          "ans": 0
        },
        {
          "q": "Continuity + reinvention means...",
          "opts": [
            "No change",
            "Old models are reused with new intent",
            "Only modern art"
          ],
          "ans": 1
        }
      ],
      "sourceChineseId": 12,
      "slug": "china-12",
      "startYear": 1644,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "The angry ducks of a Ming prince",
        "channel": "Smarthistory",
        "channelUrl": "https://www.youtube.com/@smarthistory-art-history",
        "watchUrl": "https://www.youtube.com/watch?v=lpZsBrHTdy0",
        "note": "An individualist Qing painter, rather than a survey of the imperial court. Compare expressive brushwork with court patronage in the lesson.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "id": 26,
      "title": "Late Qing: Encounter with the West and Visual Crisis",
      "era": "1800s – 1911",
      "videoUrl": "https://www.youtube.com/embed/AlfQ6rwFj9k",
      "lecture": "<h3>Modernity Arrives</h3><p>Wars, trade ports, and new media transformed Chinese visual culture. Photography, newspapers, and urban markets reshaped what images were for, creating a crisis and opportunity for traditional painting.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>New Media:</strong> Photography, lithography, mass print.</li><li><strong>Shanghai School:</strong> Urban style blending tradition with modern taste.</li><li><strong>Public Image Culture:</strong> Art moves from elite circles to wider audiences.</li><li><strong>Identity Pressure:</strong> Artists negotiate ‘Chinese-ness’ and modernity.</li></ul>",
      "criticalThinking": "When new media makes images cheap and fast, what is the new ‘value’ of hand painting?",
      "mission": "<strong>Old vs New Frame:</strong> Draw one object twice: (1) ink-style brush lines, (2) ‘camera crop’ composition (cut off edges, off-center).",
      "images": [
        {
          "src": "assets/asian/9919727.jpg",
          "title": "Zhao Zhiqian · Flowers",
          "credit": "Zhao Zhiqian",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Flowers_(Zhao_Zhiqian)_-_3.jpg",
          "license": "Public domain",
          "licenseUrl": "https://commons.wikimedia.org/wiki/File:Flowers_(Zhao_Zhiqian)_-_3.jpg",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://smarthistory.org/zhao-zhiqian-flowers-album/"
        },
        {
          "name": "Smarthistory: Modern China, an introduction",
          "url": "https://smarthistory.org/modern-china-intro/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=AlfQ6rwFj9k"
        }
      ],
      "quiz": [
        {
          "q": "Late Qing visual change is driven by...",
          "opts": [
            "No technology",
            "New media and global contact",
            "Only cave art"
          ],
          "ans": 1
        },
        {
          "q": "Photography changes painting by...",
          "opts": [
            "Making images fast and cheap",
            "Removing all images",
            "Ending composition"
          ],
          "ans": 0
        },
        {
          "q": "Shanghai School is linked to...",
          "opts": [
            "Urban market culture",
            "Deep desert caves only",
            "Roman emperors"
          ],
          "ans": 0
        },
        {
          "q": "Artists face pressure of...",
          "opts": [
            "Identity and modernity",
            "Only farming",
            "No audience"
          ],
          "ans": 0
        },
        {
          "q": "Hand painting’s value shifts toward...",
          "opts": [
            "Nothing",
            "Intent, skill, and personal voice",
            "Battery life"
          ],
          "ans": 1
        }
      ],
      "sourceChineseId": 13,
      "slug": "china-13",
      "startYear": 1800,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "Marketing peonies, Zhao Zhiqian's flower album",
        "channel": "Smarthistory",
        "channelUrl": "https://www.youtube.com/@smarthistory-art-history",
        "watchUrl": "https://www.youtube.com/watch?v=AlfQ6rwFj9k",
        "note": "A nineteenth-century Shanghai School case study of painting for an urban market; the reading supplies the wider history of modern China.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "slug": "hokusai",
      "title": "Japan: Ukiyo-e, the Floating World, and Hokusai",
      "startYear": 1800,
      "era": "Early–mid 19th century CE",
      "regions": [
        "Japan"
      ],
      "lecture": "<h3>Look first</h3><p>Follow the wave’s contour and find Mount Fuji. How do line, scale, and repeated color blocks direct your eye?</p><h3>Place it on the timeline</h3><p>Ukiyo-e means pictures of the floating world. Edo-period urban audiences supported images of actors, entertainers, fashionable life, and landscapes. Woodblock prints involved collaboration among designer, carver, printer, and publisher. Hokusai also painted throughout his long career. Comparing a print such as The Great Wave with a late painting reveals different materials, audiences, and ways of circulating images.</p>",
      "criticalThinking": "How does Japan change when you consider its original users, materials, and setting?",
      "mission": "Design a two-color print on paper. Separate the design into a line layer and a color layer, then explain what another maker would need to reproduce it.",
      "resources": [
        {
          "name": "Read more / official historical context",
          "url": "https://smarthistory.org/hokusai-the-great-wave/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=d1ufFlXIWjA"
        }
      ],
      "quiz": [
        {
          "q": "Edo woodblock production often involved…",
          "opts": [
            "Several specialized makers",
            "Only one machine",
            "Only a museum curator"
          ],
          "ans": 0
        },
        {
          "q": "Hokusai worked in…",
          "opts": [
            "Video alone",
            "Printmaking and painting",
            "Photography alone"
          ],
          "ans": 1
        },
        {
          "q": "A published print can reach…",
          "opts": [
            "Only one viewer ever",
            "No audience",
            "Multiple buyers"
          ],
          "ans": 2
        },
        {
          "q": "Comparing print and painting helps explain…",
          "opts": [
            "Material and audience differences",
            "Which country is superior",
            "Why dates never matter"
          ],
          "ans": 0
        },
        {
          "q": "Ukiyo-e refers to…",
          "opts": [
            "A Goryeo kiln",
            "Pictures of the floating world",
            "Only imperial sculpture"
          ],
          "ans": 1
        }
      ],
      "id": 27,
      "videoUrl": "https://www.youtube.com/embed/d1ufFlXIWjA",
      "videoSource": {
        "title": "Better Know the Great Wave | The Art Assignment | PBS Digital Studios",
        "channel": "The Art Assignment",
        "channelUrl": "https://www.youtube.com/@theartassignment",
        "watchUrl": "https://www.youtube.com/watch?v=d1ufFlXIWjA",
        "note": "English case study of The Great Wave: reproduction, audiences, and the global circulation of a Japanese woodblock print.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "images": [
        {
          "src": "assets/asian/2646210.jpg",
          "title": "Hokusai · The Great Wave off Kanagawa",
          "credit": "After Katsushika Hokusai",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:The_Great_Wave_off_Kanagawa.jpg",
          "license": "Public domain",
          "licenseUrl": "https://commons.wikimedia.org/wiki/File:The_Great_Wave_off_Kanagawa.jpg",
          "changes": "Unaltered reduced-size preview; original proportions preserved.",
          "checkedAt": "2026-10-15"
        }
      ],
      "galleryNote": "Openly licensed historical example. It may differ from the object shown in the video; compare their materials and context."
    },
    {
      "id": 28,
      "title": "Republic Era: Art Education and New Painting Languages",
      "era": "1912 – 1949",
      "videoUrl": "https://www.youtube.com/embed/rypHbl5zO-w",
      "lecture": "<h3>Reforming Tradition</h3><p>Modern art education systems, overseas study, and cultural debates reshaped Chinese painting. Artists experimented with oil painting, realism, and hybrid forms while arguing about national style.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Art Schools:</strong> Curriculum and institutional modernization.</li><li><strong>Realism & Nation:</strong> Painting used for social and political goals.</li><li><strong>Hybridity:</strong> Combining ink traditions with Western methods.</li><li><strong>Debates:</strong> ‘New’ vs ‘traditional’ as identity struggle.</li></ul>",
      "criticalThinking": "Is mixing cultures an artistic upgrade, or a loss of tradition? Who gets to decide?",
      "mission": "<strong>Hybrid Portrait:</strong> Draw a portrait outline using ink-style line economy, then add one Western-style shading area (only 1). Keep it balanced.",
      "images": [
        {
          "src": "assets/asian/diagram-studio.svg",
          "title": "Republic Era · concept diagram",
          "credit": "Original vector teaching diagram for FEI TeamArt",
          "illustration": true,
          "sourceUrl": "media-notes.html#diagrams"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://www.westernsydney.edu.au/iac/art-talks/iac-art-talks-6-chinese-modernist-artists-and-the-literati-spirit-the-life-and-work-of-lin-fengmian-and-sanyu-by-dapeng-liu"
        },
        {
          "name": "Smarthistory: Modern China, an introduction",
          "url": "https://smarthistory.org/modern-china-intro/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=rypHbl5zO-w"
        },
        {
          "name": "Xu Beihong: Heavenly Horse — The Met collection",
          "url": "https://www.metmuseum.org/art/collection/search/72778"
        }
      ],
      "quiz": [
        {
          "q": "Republic era art change is linked to...",
          "opts": [
            "Art schools and modernization",
            "No education",
            "Only bronze casting"
          ],
          "ans": 0
        },
        {
          "q": "A key theme is...",
          "opts": [
            "Debates about national style",
            "No identity questions",
            "Only sports"
          ],
          "ans": 0
        },
        {
          "q": "Hybridity means...",
          "opts": [
            "Mixing methods and traditions",
            "Refusing any influence",
            "Copying only one style"
          ],
          "ans": 0
        },
        {
          "q": "Realism can be used for...",
          "opts": [
            "Social/political goals",
            "Nothing",
            "Only decoration"
          ],
          "ans": 0
        },
        {
          "q": "Cultural mixing is often...",
          "opts": [
            "A negotiation of identity",
            "A math error",
            "A food recipe"
          ],
          "ans": 0
        }
      ],
      "sourceChineseId": 14,
      "slug": "china-14",
      "startYear": 1912,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "Chinese Modernist Artists and the Literati Spirit: The Life and Work of Lin Fengmian and Sanyu",
        "channel": "IAC WSU",
        "channelUrl": "https://www.youtube.com/@iacwsu3993",
        "watchUrl": "https://www.youtube.com/watch?v=rypHbl5zO-w",
        "note": "Extended university lecture on Lin Fengmian and Sanyu. Watch in sections and compare their different responses to study abroad. The lecture also follows their later careers.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "This original teaching diagram introduces the topic. It is not a historical artwork, an artist portrait, or a reproduction of a protected work. Follow the museum / publisher links to study original works."
    },
    {
      "id": 29,
      "title": "1949–1976: Art, Mass Media, and Socialist Visual Culture",
      "era": "1949 – 1976",
      "videoUrl": "https://www.youtube.com/embed/65jwAN5hdg8",
      "lecture": "<h3>Images for Collective Life</h3><p>Visual culture became a mass system: posters, exhibitions, and realism-based painting served ideology and public education. Art functioned as communication, mobilization, and representation of collective identity.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Poster Culture:</strong> Clear symbols, bright colors, slogans.</li><li><strong>Socialist Realism:</strong> Idealized labor and revolutionary narratives.</li><li><strong>Mass Reproduction:</strong> Images circulate widely beyond elites.</li><li><strong>Art as Policy Tool:</strong> Aesthetic choices align with political goals.</li></ul>",
      "criticalThinking": "When art is made to persuade millions, what happens to ambiguity and personal expression?",
      "mission": "<strong>Poster Composition:</strong> Create a simple poster layout: big title + one central figure + 2 symbolic objects. Use strong contrast and minimal detail.",
      "images": [
        {
          "src": "assets/asian/diagram-press.svg",
          "title": "1949–1976 · concept diagram",
          "credit": "Original vector teaching diagram for FEI TeamArt",
          "illustration": true,
          "sourceUrl": "media-notes.html#diagrams"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://www.britishmuseum.org/collection/object/A_2006-0501-0-1-75"
        },
        {
          "name": "Smarthistory: Modern China, an introduction",
          "url": "https://smarthistory.org/modern-china-intro/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=65jwAN5hdg8"
        }
      ],
      "quiz": [
        {
          "q": "Poster culture aims for...",
          "opts": [
            "Ambiguity",
            "Clarity and persuasion",
            "No audience"
          ],
          "ans": 1
        },
        {
          "q": "Socialist realism often shows...",
          "opts": [
            "Idealized collective life",
            "Only empty landscapes",
            "No humans"
          ],
          "ans": 0
        },
        {
          "q": "Mass reproduction changes art by...",
          "opts": [
            "Expanding reach dramatically",
            "Ending images",
            "Preventing meaning"
          ],
          "ans": 0
        },
        {
          "q": "Policy-driven art often reduces...",
          "opts": [
            "Clarity",
            "Ambiguity and personal freedom",
            "Paper"
          ],
          "ans": 1
        },
        {
          "q": "In this era, art functions as...",
          "opts": [
            "Communication tool",
            "Pure private diary only",
            "Random accident"
          ],
          "ans": 0
        }
      ],
      "sourceChineseId": 15,
      "slug": "china-15",
      "startYear": 1949,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "The Art of Chinese Propaganda Posters",
        "channel": "AbeBooks.com",
        "channelUrl": "https://www.youtube.com/@abebooks",
        "watchUrl": "https://www.youtube.com/watch?v=65jwAN5hdg8",
        "note": "A short collector-oriented introduction published by AbeBooks. Treat posters as historical persuasion: ask who commissioned them, whom they addressed, and what they omit.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "This original teaching diagram introduces the topic. It is not a historical artwork, an artist portrait, or a reproduction of a protected work. Follow the museum / publisher links to study original works."
    },
    {
      "slug": "paik",
      "title": "Korea and the World: Nam June Paik’s Electronic Art",
      "startYear": 1963,
      "era": "1960s–2000s",
      "regions": [
        "Korea",
        "Japan",
        "International"
      ],
      "lecture": "<h3>Look first</h3><p>Notice when a screen behaves like an object rather than a window. Who controls the image, and what role does a viewer play?</p><h3>Place it on the timeline</h3><p>Born in Korea, Nam June Paik worked across Japan, Europe, and the United States. His experiments made television, performance, and electronic communication into artistic materials. This history crosses national boundaries; technology is not simply a replacement for traditional media but a way to question audience, participation, and connection.</p>",
      "criticalThinking": "How does Korea and the World change when you consider its original users, materials, and setting?",
      "mission": "Sketch an installation with three screens. Give each a different rhythm and explain what the viewer discovers by moving between them.",
      "resources": [
        {
          "name": "Read more / official historical context",
          "url": "https://www.tate.org.uk/art/artists/nam-june-paik-1751"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=yMUJB5aFvdo"
        }
      ],
      "quiz": [
        {
          "q": "Paik used television as…",
          "opts": [
            "An artistic material",
            "Only a neutral appliance",
            "A substitute for every other art"
          ],
          "ans": 0
        },
        {
          "q": "His career was…",
          "opts": [
            "Unrelated to performance",
            "International",
            "Confined to a single village"
          ],
          "ans": 1
        },
        {
          "q": "Video installation can change…",
          "opts": [
            "Only the frame color",
            "The historical date of a bronze",
            "The viewer’s spatial experience"
          ],
          "ans": 2
        },
        {
          "q": "Electronic communication raises questions about…",
          "opts": [
            "Connection and control",
            "Only pottery glaze",
            "Only royal genealogy"
          ],
          "ans": 0
        },
        {
          "q": "A useful comparison across this course asks…",
          "opts": [
            "Whether all art has the same function",
            "How media shape participation",
            "Which medium makes others worthless"
          ],
          "ans": 1
        }
      ],
      "id": 30,
      "videoUrl": "https://www.youtube.com/embed/yMUJB5aFvdo",
      "videoSource": {
        "title": "5 Times Artist Nam June Paik Predicted the Future | Tate",
        "channel": "Tate",
        "channelUrl": "https://www.youtube.com/@tate",
        "watchUrl": "https://www.youtube.com/watch?v=yMUJB5aFvdo",
        "note": "English case study. Use the reading and gallery to place this example in its wider historical setting.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "images": [
        {
          "src": "assets/asian/diagram-signal.svg",
          "title": "Korea and the World · concept diagram",
          "credit": "Original vector teaching diagram for FEI TeamArt",
          "illustration": true,
          "sourceUrl": "media-notes.html#diagrams"
        }
      ],
      "galleryNote": "This original teaching diagram introduces the topic. It is not a historical artwork, an artist portrait, or a reproduction of a protected work. Follow the museum / publisher links to study original works."
    },
    {
      "id": 31,
      "title": "Post-1978: New Chinese Art and Opening Up",
      "era": "1978 – 1990s",
      "videoUrl": "https://www.youtube.com/embed/DS22WjHgKMQ",
      "lecture": "<h3>Experiment Returns</h3><p>After the late 1970s, artists reconnected with global art languages and began intense experiments. The ’85 New Wave’ became a symbol of artistic awakening: performance, installation, conceptual strategies, and new painting attitudes emerged.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>85 New Wave:</strong> Experimental movements across regions.</li><li><strong>Conceptual Turn:</strong> Idea becomes central.</li><li><strong>New Media & Performance:</strong> Body and space as materials.</li><li><strong>Global Dialogue:</strong> Translation, adaptation, and critique.</li></ul>",
      "criticalThinking": "When an art scene ‘opens’ to global influence, what are the risks: imitation, loss, or new power?",
      "mission": "<strong>Concept Sketch:</strong> Write a 1-sentence artwork idea about ‘memory’ or ‘identity.’ Then draw a simple diagram showing how the viewer interacts with it.",
      "images": [
        {
          "src": "assets/asian/diagram-text.svg",
          "title": "Post-1978 · concept diagram",
          "credit": "Original vector teaching diagram for FEI TeamArt",
          "illustration": true,
          "sourceUrl": "media-notes.html#diagrams"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://www.guggenheim.org/exhibition/art-and-china-after-1989-theater-of-the-world"
        },
        {
          "name": "Smarthistory: Modern China, an introduction",
          "url": "https://smarthistory.org/modern-china-intro/"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=DS22WjHgKMQ"
        }
      ],
      "quiz": [
        {
          "q": "The ’85 New Wave is associated with...",
          "opts": [
            "Total silence in art",
            "Experimental movements",
            "Only bronze rituals"
          ],
          "ans": 1
        },
        {
          "q": "A conceptual turn means...",
          "opts": [
            "Idea becomes central",
            "Color disappears forever",
            "No meaning allowed"
          ],
          "ans": 0
        },
        {
          "q": "New media/performance expands art into...",
          "opts": [
            "Body and space",
            "Only frames",
            "Only textbooks"
          ],
          "ans": 0
        },
        {
          "q": "Global dialogue can create...",
          "opts": [
            "Adaptation and critique",
            "No change",
            "Only copying"
          ],
          "ans": 0
        },
        {
          "q": "A major risk is...",
          "opts": [
            "Negotiating identity and influence",
            "Too much pottery",
            "Too many mountains"
          ],
          "ans": 0
        }
      ],
      "sourceChineseId": 16,
      "slug": "china-16",
      "startYear": 1978,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "Art and China after 1989: Theater of the World",
        "channel": "Guggenheim Museum",
        "channelUrl": "https://www.youtube.com/@guggenheim",
        "watchUrl": "https://www.youtube.com/watch?v=DS22WjHgKMQ",
        "note": "An exhibition introduction focused on 1989–2008. The lesson explains the earlier post-1978 opening; the film does not cover that entire transition.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "This original teaching diagram introduces the topic. It is not a historical artwork, an artist portrait, or a reproduction of a protected work. Follow the museum / publisher links to study original works."
    },
    {
      "id": 32,
      "title": "Contemporary Ink: Tradition as a Living System",
      "era": "1990s – Present",
      "videoUrl": "https://www.youtube.com/embed/DseIYQdjzgE",
      "lecture": "<h3>Ink After Modernity</h3><p>Contemporary ink is not ‘old.’ It treats tradition as a living system: artists expand ink into abstraction, installation, performance, and conceptual critique while keeping brush logic as a cultural DNA.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Ink as Method:</strong> Brush logic, rhythm, and material behavior.</li><li><strong>Scale Expansion:</strong> From scroll to wall-sized installations.</li><li><strong>Conceptual Ink:</strong> Ink used to question identity, politics, ecology.</li><li><strong>Tradition Rewritten:</strong> Quoting the past as critique or remix.</li></ul>",
      "criticalThinking": "If an artist uses ink but rejects classical subjects (mountains/bamboo), is it still ‘Chinese ink’?",
      "mission": "<strong>Ink Material Test:</strong> Make 6 swatches: wet wash, dry brush, splatter, gradient, layered wash, and erased highlight. Use them to build one abstract composition.",
      "images": [
        {
          "src": "assets/asian/diagram-ink.svg",
          "title": "Contemporary Ink · concept diagram",
          "credit": "Original vector teaching diagram for FEI TeamArt",
          "illustration": true,
          "sourceUrl": "media-notes.html#diagrams"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://www.metmuseum.org/exhibitions/listings/2013/ink-art"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=DseIYQdjzgE"
        },
        {
          "name": "Xu Bing: Book from the Sky — artist’s original project page",
          "url": "https://www.xubing.com/en/work/details/206?type=project"
        }
      ],
      "quiz": [
        {
          "q": "Contemporary ink often treats tradition as...",
          "opts": [
            "Dead rulebook",
            "Living system",
            "A banned topic"
          ],
          "ans": 1
        },
        {
          "q": "Ink can function as...",
          "opts": [
            "Only decoration",
            "Method and concept",
            "Only photograph"
          ],
          "ans": 1
        },
        {
          "q": "Scale expansion means...",
          "opts": [
            "Smaller only",
            "Ink moving into large installations",
            "No space"
          ],
          "ans": 1
        },
        {
          "q": "Quoting the past can be...",
          "opts": [
            "Critique or remix",
            "Always worship",
            "Always illegal"
          ],
          "ans": 0
        },
        {
          "q": "Ink identity debates show...",
          "opts": [
            "Art is static",
            "Art is negotiated",
            "Art is purely math"
          ],
          "ans": 1
        }
      ],
      "sourceChineseId": 17,
      "slug": "china-17",
      "startYear": 1990,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "Xu Bing, Book from the Sky",
        "channel": "Smarthistory",
        "channelUrl": "https://www.youtube.com/@smarthistory-art-history",
        "watchUrl": "https://www.youtube.com/watch?v=DseIYQdjzgE",
        "note": "A bridge into contemporary ink through Xu Bing’s Book from the Sky (1987–91). Consider how print, invented writing, and installation transform inherited ink traditions.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "This original teaching diagram introduces the topic. It is not a historical artwork, an artist portrait, or a reproduction of a protected work. Follow the museum / publisher links to study original works."
    },
    {
      "id": 33,
      "title": "Contemporary China: Installation, Photography, and the City",
      "era": "1990s – Present",
      "videoUrl": "https://www.youtube.com/embed/ZgYdQUn-cIk",
      "lecture": "<h3>New Materials, New Realities</h3><p>Rapid urbanization and global networks pushed Chinese contemporary art into photography, installation, video, and large-scale social commentary. The ‘art object’ often becomes an environment or a question.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Installation:</strong> Space as artwork.</li><li><strong>Photography:</strong> Document + staged reality.</li><li><strong>Urban Themes:</strong> Migration, demolition, consumer culture.</li><li><strong>Global Art System:</strong> Biennales, museums, markets.</li></ul>",
      "criticalThinking": "If an artwork is an ‘experience’ in a room, how do we collect it, preserve it, or teach it?",
      "mission": "<strong>Room-as-Art Plan:</strong> Draw a top-down plan of a small installation about ‘home.’ Use 5 objects and explain where the viewer walks.",
      "images": [
        {
          "src": "assets/asian/diagram-city.svg",
          "title": "Contemporary China · concept diagram",
          "credit": "Original vector teaching diagram for FEI TeamArt",
          "illustration": true,
          "sourceUrl": "media-notes.html#diagrams"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://searchcollection.asianart.org/objects/19426/the-night-of-perpetual-day"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=ZgYdQUn-cIk"
        }
      ],
      "quiz": [
        {
          "q": "Installation art treats ... as the artwork.",
          "opts": [
            "Space",
            "Only frames",
            "Only coins"
          ],
          "ans": 0
        },
        {
          "q": "Photography in contemporary art can be...",
          "opts": [
            "Only documentary",
            "Document + staged reality",
            "Never used"
          ],
          "ans": 1
        },
        {
          "q": "A common theme is...",
          "opts": [
            "Urbanization and social change",
            "Only dragons",
            "Only caves"
          ],
          "ans": 0
        },
        {
          "q": "Global art systems include...",
          "opts": [
            "Biennales and museums",
            "Only village markets",
            "No exhibitions"
          ],
          "ans": 0
        },
        {
          "q": "Teaching experience-based art requires...",
          "opts": [
            "Ignoring context",
            "Explaining space and viewer interaction",
            "Only memorizing dates"
          ],
          "ans": 1
        }
      ],
      "sourceChineseId": 18,
      "slug": "china-18",
      "startYear": 1990,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "Saving Chinese Art From Extinction | Meet Yang Yongliang",
        "channel": "Creators",
        "channelUrl": "https://www.youtube.com/@TheCreatorsProject",
        "watchUrl": "https://www.youtube.com/watch?v=ZgYdQUn-cIk",
        "note": "Artist interview in Chinese with English subtitles. Yang Yongliang uses photographic and digital methods to rethink landscape and urban growth.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "This original teaching diagram introduces the topic. It is not a historical artwork, an artist portrait, or a reproduction of a protected work. Follow the museum / publisher links to study original works."
    },
    {
      "id": 34,
      "title": "China in Global Contemporary: From Local Language to World Questions",
      "era": "2000s – Present",
      "videoUrl": "https://www.youtube.com/embed/YMtsodcAsVU",
      "lecture": "<h3>From ‘Chinese Style’ to Global Themes</h3><p>Today, Chinese artists operate inside a global art ecology. The question is no longer only ‘Chinese tradition vs Western modernity,’ but how artists use local visual languages to address global issues: ecology, technology, memory, migration, and power.</p><p><strong>Key Concepts:</strong></p><ul><li><strong>Global Platforms:</strong> Biennales, museums, online audiences.</li><li><strong>Local Language:</strong> Ink, calligraphy, craft as conceptual tools.</li><li><strong>Global Themes:</strong> Environment, surveillance, labor, identity.</li><li><strong>Audience Shift:</strong> Art speaks to multiple cultures at once.</li></ul>",
      "criticalThinking": "If an artwork must speak to multiple cultures, what gets lost, and what becomes stronger?",
      "mission": "<strong>Concept Statement (3 lines):</strong> Write a short statement for an artwork that uses one traditional element (ink/ceramic/paper) to address one global theme (climate/AI/migration).",
      "images": [
        {
          "src": "assets/asian/diagram-network.svg",
          "title": "China in Global Contemporary · concept diagram",
          "credit": "Original vector teaching diagram for FEI TeamArt",
          "illustration": true,
          "sourceUrl": "media-notes.html#diagrams"
        }
      ],
      "resources": [
        {
          "name": "Read the historical context / explore the source",
          "url": "https://www.tate.org.uk/art/artists/ai-weiwei-8208"
        },
        {
          "name": "Video publisher and original player",
          "url": "https://www.youtube.com/watch?v=YMtsodcAsVU"
        }
      ],
      "quiz": [
        {
          "q": "Contemporary global art platforms include...",
          "opts": [
            "Biennales and museums",
            "Only tombs",
            "Only caves"
          ],
          "ans": 0
        },
        {
          "q": "Traditional elements today can act as...",
          "opts": [
            "Conceptual tools",
            "Only decoration",
            "Only antiques"
          ],
          "ans": 0
        },
        {
          "q": "Common global themes include...",
          "opts": [
            "Ecology and technology",
            "Only dragons",
            "Only bronze casting"
          ],
          "ans": 0
        },
        {
          "q": "Audience shift means...",
          "opts": [
            "Only one culture matters",
            "Multiple cultures interpret at once",
            "No viewers"
          ],
          "ans": 1
        },
        {
          "q": "Cross-cultural communication can...",
          "opts": [
            "Lose some context but gain reach",
            "Always perfect",
            "Always impossible"
          ],
          "ans": 0
        }
      ],
      "sourceChineseId": 20,
      "slug": "china-20",
      "startYear": 2000,
      "regions": [
        "China"
      ],
      "videoSource": {
        "title": "The Case for Ai Weiwei | The Art Assignment | PBS Digital Studios",
        "channel": "The Art Assignment",
        "channelUrl": "https://www.youtube.com/@theartassignment",
        "watchUrl": "https://www.youtube.com/watch?v=YMtsodcAsVU",
        "note": "A contemporary artist case study connecting materials, labor, public space, and international audiences. This is one voice within a diverse contemporary field.",
        "checkedAt": "2026-10-15",
        "verification": "Official YouTube oEmbed returned a player. Playback remains subject to publisher, regional, and browser restrictions."
      },
      "artworkLinks": [],
      "galleryNote": "This original teaching diagram introduces the topic. It is not a historical artwork, an artist portrait, or a reproduction of a protected work. Follow the museum / publisher links to study original works."
    }
  ]
};
})();
