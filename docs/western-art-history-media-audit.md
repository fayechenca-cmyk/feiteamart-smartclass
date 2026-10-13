# Western Art History：视频与图片核查

核查日期：2026-10-13（America/Vancouver）。范围：36 节 Western Art History 的 Lecture 视频及 Gallery & Sources。课程正文、Challenge、Studio & Thought 和 Chinese Art History 内容未改动。

## 使用结论

免费、公开、教育用途本身并不是版权许可。此次视频使用依据是发布者提供的 YouTube 官方嵌入播放器功能，不是将视频视为公有领域，也不是下载后重新上传。YouTube 条款允许通过其播放器展示视频，上传者给予其他用户的许可限于服务所启用的功能。见 [加拿大 YouTube 条款](https://ca.youtube.com/t/terms) 与 [官方嵌入帮助](https://support.google.com/youtube/answer/171780)。

36 个主视频及 1 个 Dada 配套视频均取得 YouTube oEmbed 返回的播放器信息、标题和频道；可作为当次存在并提供嵌入的技术证据。不能据此证明上传者清除了片中每一项作品、音乐等第三方权利，也不代表所有国家、账户、网络环境均可播放。逐课记录保留了原视频与所选视频的频道。没有取得创作者单独签发的书面授权；因此本记录是有条件的资源使用核查，不是“全球永久合法”的法律保证。若收到权利人异议，应停用该项并核实。

图片采用公有领域、CC0、CC BY 或 CC BY-SA 记录；每张图片均附作者、原始文件页、许可链接及修改说明。CC BY-SA 图片保留各自许可，不把它们声明为 FEI 自有版权。现代作品的照片许可不能自动代替作品本身的版权许可，因此没有直接搬用未经确认的当代作品图片。第 29–36 节使用有许可的艺术家肖像或肖像插画，并明确区分作品图；代表作通过博物馆页面查看。具体许可以每张图片的原始文件页为准；公有领域期限可能因国家不同而有差异。一次候选 Pollock 肖像仅明确美国公有领域，已排除。

[CC BY-SA 4.0 条件](https://creativecommons.org/licenses/by-sa/4.0/)包括适当署名、许可链接、注明修改，以及对改编图像的相同方式共享。当前只使用来源提供的图像／预览，未对图像作额外编辑。

## 发现及修复

- 第 27–36 节原来都是 `embed?listType=search` 搜索占位地址。YouTube 已于 2020-11-15 停止支持该模式，已换成具体视频 ID。[官方说明](https://developers.google.com/youtube/player_parameters)
- 第 3 节 Ancient Egypt 原来指向 National Geographic 的 Ancient Mesopotamia 101，已换成 Smarthistory 的 The Seated Scribe，并注明这是作品细读而非完整通史。
- 第 2 节换成 National Geographic 的 Mesopotamia 概览；第 17 节换成 Smarthistory 原频道的 Oath of the Horatii。优先采用可辨识的发布者频道。
- 第 24–26 节原视频仍提供嵌入信息；Fauvism 在本地课程播放器实际播放成功。加入明确 referrerpolicy 与原 YouTube 页面入口，便于处理播放器配置、地区或账户差异。
- 共更换 13 个主视频，保留 23 个；第 27 节增加 Dada 配套嵌入。第 15 节原始 383 秒起点得到保留。
- 108 个原图片条目查询中，73 个对应文件不存在，35 个能解析到实际文件。还存在把 Commons HTML 页面直接用作 img.src 的问题。
- 最终 52 张图片已下载为课程本地资源，HTTP 响应为 image/jpeg，全部通过 JPEG 解码；图库使用完整比例，附来源与许可，并有加载失败时的原页入口。

## 验证边界与运行条件

- `node tests/art-history-media.cjs`：验证 36 节具体视频 ID、52 个图片文件、完整署名字段，并逐字段比较课程正文、题目、答案和任务未被修改；Chinese track 未变。
- PIL 对全部 52 张 JPEG 逐一解码验证；缩略图总览人工检查图像主题。
- 浏览器测试使用独立本地 QA 页面加载实际 app.js，避免完成真实学生的 Challenge 来打开后段课程。抽样播放器验证不等于逐支完整观看。
- 保留 YouTube 官方控件、品牌与原链接；没有下载或重新托管视频。视频可能包含 YouTube 自身广告。
- 既有课程进度与 Challenge 规则未变。本次没有更改课程门户的登录／访问设置。若要求所有 Lecture 都无需完成前课即可访问，应另行调整课程解锁规则；YouTube Developer Policies 对以额外行为限制视频访问也有限制。[官方政策](https://developers.google.com/youtube/terms/developer-policies)
- 如果页面是面向儿童的站点，YouTube 要求站点进行 child-directed 自我标记；隐私增强播放器也不能替代这项要求。需要站点所有者按实际受众确认，不能仅凭“免费”推定已满足。[官方帮助](https://support.google.com/youtube/answer/171780)

## 逐课视频清单

所有行的技术状态均为“oEmbed 返回播放器”，权利依据均为“官方播放器嵌入、保留发布者与原链接；非下载授权”。

|课|课程|使用视频／频道|处理|图片数|
|---|---|---|---|---|
|1|The Dawn of Art (Prehistoric)|[Cave Art 101 ／ National Geographic](https://www.youtube.com/watch?v=ZjejoT1gFOc) · National Geographic|保留|3|
|2|Mesopotamia: Order from Chaos|[Ancient Mesopotamia 101 ／ National Geographic](https://www.youtube.com/watch?v=xVf5kZA0HtQ) · National Geographic|更换|3|
|3|Ancient Egypt: Art for Eternity|[The Seated Scribe](https://www.youtube.com/watch?v=IKkcop-dlUY) · Smarthistory|更换|3|
|4|Ancient Greece: The Ideal Human|[The Perfect Human Form: Greek Art, Math, and the Spear Bearer](https://www.youtube.com/watch?v=o5gGeZ--TGo) · Apt Observations|保留|2|
|5|Ancient Rome: Engineering the Empire|[Rick Steves Art of Ancient Rome](https://www.youtube.com/watch?v=BbcJh3uvax0) · Rick Steves' Europe|保留|2|
|6|Byzantine: Heaven on Earth|[AP Art History - Byzantine Art and Architecture](https://www.youtube.com/watch?v=0leET9HyUjI) · Fleet's AP Art History|保留|1|
|7|Islamic Art: The Infinite Pattern|[Unlocking The Mysteries Of Islamic Art ／ The Dark Ages: An Age of Light ／ Everything History](https://www.youtube.com/watch?v=hVdaXZTFiII) · Everything History|保留|2|
|8|Romanesque: The Fortress of God|[Contest of the cathedrals – the Romanesque period ／ DW Documentary](https://www.youtube.com/watch?v=6_UvBLmdBMU) · DW Documentary|保留|1|
|9|Gothic: Height and Light|[Eroticism, death and the devil - How Gothic art captivates us ／ DW Documentary](https://www.youtube.com/watch?v=5UT889YeCuo) · DW Documentary|保留|2|
|10|Proto-Renaissance: The Awakening|[Italian 14th century (proto-Renaissance art)](https://www.youtube.com/watch?v=Iirq69IBfCQ) · Mary McConnell|保留|1|
|11|Early Renaissance: Discovery of Space|[AP Art History - The Early Italian Renaissance](https://www.youtube.com/watch?v=IDCIXr17d-E) · Fleet's AP Art History|保留|2|
|12|High Renaissance: The Masters|[The High Renaissance: Europe's Cultural Peak (Short Documentary)](https://www.youtube.com/watch?v=2oSpTXgPkQc) · Lesser Known History|保留|2|
|13|Northern Renaissance: Oil and Detail|[The Northern Renaissance: Crash Course European History #3](https://www.youtube.com/watch?v=EuzAbE-kPkM) · CrashCourse|保留|1|
|14|Mannerism: Breaking the Rules|[What Was Mannerist Art? AP Euro Bit by Bit #49](https://www.youtube.com/watch?v=BOKXbOyTYCk) · AP Euro Bit by Bit with Paul Sargent|保留|1|
|15|Baroque: The Theater of Light|[How to recognize Baroque art](https://www.youtube.com/watch?v=EFHPAbHaoqk) · Smarthistory|保留|3|
|16|Rococo: Pastel Play|[What is Rococo Art? ／ Fragonard's The Swing](https://www.youtube.com/watch?v=GTmQEYCJrjY) · ARTSQ|保留|1|
|17|Neoclassicism: Reason|[David, Oath of the Horatii](https://www.youtube.com/watch?v=qfAga9DAuU4) · Smarthistory|更换|2|
|18|Romanticism: The Sublime|[What Was Romanticism And Why Was It So Vital For Art? ／ Landmarks Of Western Art](https://www.youtube.com/watch?v=pBiGVlTLO6Q) · Perspective|保留|1|
|19|Realism: Truth|[The Case for Realism](https://www.youtube.com/watch?v=Os6i6fneV-E) · The Art Assignment|保留|2|
|20|Barbizon & Early Modern Vision: From Realism to Impressionism|[26-01 The Barbizon School](https://www.youtube.com/watch?v=Yp4710qbxVQ) · Dr Laurence Shafe|保留|1|
|21|Impressionism: Painting Light, Not Objects|[What is Impressionism?](https://www.youtube.com/watch?v=vExG3Wgm4cQ) · The Arts Hole|保留|1|
|22|Post-Impressionism: Structure, Emotion, and Symbol|[What Is Post-Impressionism? ／ Post-Impressionism: The Beginnings of Modern Art](https://www.youtube.com/watch?v=N-Mg-cxEJqc) · The Great Courses|保留|1|
|23|Symbolism: Dreams, Myths, and Inner Worlds|[AP Art History - Symbolism and Art Nouveau](https://www.youtube.com/watch?v=hQQaVQhW1Is) · Fleet's AP Art History|保留|1|
|24|Fauvism: Color as a Wild Beast|[Fauvism in 4 Minutes: The Wild Beasts of Art 👹](https://www.youtube.com/watch?v=tcjJEOapNKY) · Curious Muse|保留|1|
|25|Expressionism: Painting Feeling Under Pressure|[Expressionism in 8 Minutes: The Most Disturbing Art Ever? 😱](https://www.youtube.com/watch?v=YnsRLQ4A0hc) · Curious Muse|保留|1|
|26|Cubism: Shattering Reality into Angles|[Cubism in 9 Minutes: Art Movement by Pablo Picasso Explained](https://www.youtube.com/watch?v=IF-nmwm7-Bg) · Curious Muse|保留|1|
|27|Futurism & Dada: Speed, Chaos, Anti-Art|[Futurism in 9 Minutes: How to Rewrite Culture](https://www.youtube.com/watch?v=YFPIP9NxU30) · Curious Muse|更换|1|
|28|Surrealism: The Logic of Dreams|[The Case for Surrealism ／ The Art Assignment ／ PBS Digital Studios](https://www.youtube.com/watch?v=wtPBOwE0Qn0) · The Art Assignment|更换|1|
|29|Abstract Expressionism: Painting as a Record of Being|[Abstract Expressionism at the Royal Academy](https://www.youtube.com/watch?v=RNrHnrspBF8) · ZCZ Films|更换|1|
|30|Pop Art: Images, Brands, Mass Media|[The Case For Andy Warhol ／ The Art Assignment ／ PBS Digital Studios](https://www.youtube.com/watch?v=7VH5MRtk9HQ) · The Art Assignment|更换|1|
|31|Minimalism: Less, But Louder|[The Case for Minimalism ／ The Art Assignment ／ PBS Digital Studios](https://www.youtube.com/watch?v=XEi0Ib-nNGo) · The Art Assignment|更换|1|
|32|Conceptual Art: The Idea Is the Artwork|[The Case for Conceptual Art](https://www.youtube.com/watch?v=VHLs76HLon4) · The Art Assignment|更换|1|
|33|Performance & Body Art: Art as Action|[The Case for Performance Art ／ The Art Assignment ／ PBS Digital Studios](https://www.youtube.com/watch?v=EmMTKdUAokM) · The Art Assignment|更换|1|
|34|Postmodernism: Remix, Critique, and Doubt|[What is Postmodernism?](https://www.youtube.com/watch?v=5x4ntciHTXU) · Victoria and Albert Museum|更换|1|
|35|Global Contemporary: Identity, Power, Systems|[The Case for Ai Weiwei ／ The Art Assignment ／ PBS Digital Studios](https://www.youtube.com/watch?v=YMtsodcAsVU) · The Art Assignment|更换|1|
|36|New Media & AI: Images After the Machine|[AI Art: How artists are using and confronting machine learning ／ HOW TO SEE LIKE A MACHINE](https://www.youtube.com/watch?v=G2XdZIC3AM8) · The Museum of Modern Art|更换|1|

## 图片署名清单

各图片均无 FEI 额外编辑，显示尺寸缩小；来源内已有裁剪或修复以其文件页为准。

### 1. The Dawn of Art (Prehistoric)

- [Lascaux painting](https://commons.wikimedia.org/wiki/File:Lascaux_painting.jpg) — EU；[Public domain](https://commons.wikimedia.org/wiki/File:Lascaux_painting.jpg)；文件 `assets/western/2846254.jpg`。
- [Venus of Willendorf, 20210730 1214 1255](https://commons.wikimedia.org/wiki/File:Venus_of_Willendorf,_20210730_1214_1255.jpg) — Jakub Hałun；[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)；文件 `assets/western/108181499.jpg`。
- [Stonehenge2007 07 30](https://commons.wikimedia.org/wiki/File:Stonehenge2007_07_30.jpg) — garethwiscombe；[CC BY 2.0](https://creativecommons.org/licenses/by/2.0)；文件 `assets/western/13278936.jpg`。

### 2. Mesopotamia: Order from Chaos

- [Code of Hammurabi Louvre Museum](https://commons.wikimedia.org/wiki/File:Code_of_Hammurabi_Louvre_Museum.jpg) — Gil Dbd；[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)；文件 `assets/western/72260043.jpg`。
- [Standard of ur](https://commons.wikimedia.org/wiki/File:Standard_of_ur.jpg) — Unknown artistUnknown artist；[CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/)；文件 `assets/western/934130.jpg`。
- [Ishtar Gate at Berlin Museum](https://commons.wikimedia.org/wiki/File:Ishtar_Gate_at_Berlin_Museum.jpg) — Rictor Norton；[CC BY 2.0](https://creativecommons.org/licenses/by/2.0)；文件 `assets/western/1409322.jpg`。

### 3. Ancient Egypt: Art for Eternity

- [Kheops-Pyramid](https://commons.wikimedia.org/wiki/File:Kheops-Pyramid.jpg) — Nina；[CC BY 2.5](https://creativecommons.org/licenses/by/2.5)；文件 `assets/western/282496.jpg`。
- [Narmer Palette](https://commons.wikimedia.org/wiki/File:Narmer_Palette.jpg) — anonymous；[Public domain](https://commons.wikimedia.org/wiki/File:Narmer_Palette.jpg)；文件 `assets/western/27338888.jpg`。
- [Tutanchamun Maske](https://commons.wikimedia.org/wiki/File:Tutanchamun_Maske.jpg) — en:User:MykReeve；[CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/)；文件 `assets/western/34321.jpg`。

### 4. Ancient Greece: The Ideal Human

- [Parthenon from west](https://commons.wikimedia.org/wiki/File:Parthenon_from_west.jpg) — User:Mountain；[Public domain](https://commons.wikimedia.org/wiki/File:Parthenon_from_west.jpg)；文件 `assets/western/1427237.jpg`。
- [Doryphoros MAN Napoli Inv6011-2](https://commons.wikimedia.org/wiki/File:Doryphoros_MAN_Napoli_Inv6011-2.jpg) — derivative work: tetraktys (talk)；[CC BY 2.5](https://creativecommons.org/licenses/by/2.5)；文件 `assets/western/18366140.jpg`。

### 5. Ancient Rome: Engineering the Empire

- [Colosseo 2020](https://commons.wikimedia.org/wiki/File:Colosseo_2020.jpg) — FeaturedPics；[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)；文件 `assets/western/95579199.jpg`。
- [Rome Pantheon interior](https://commons.wikimedia.org/wiki/File:Rome_Pantheon_interior.jpg) — Nicholas Hartmann；[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)；文件 `assets/western/97352880.jpg`。

### 6. Byzantine: Heaven on Earth

- [Hagia Sophia Mars 2013](https://commons.wikimedia.org/wiki/File:Hagia_Sophia_Mars_2013.jpg) — Arild Vågen；[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0)；文件 `assets/western/24932378.jpg`。

### 7. Islamic Art: The Infinite Pattern

- [Great Mosque of Kairouan prayer hall](https://commons.wikimedia.org/wiki/File:Great_Mosque_of_Kairouan_prayer_hall.jpg) — ovancantfort；[CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0)；文件 `assets/western/8815665.jpg`。
- [Alhambra Patio de los Leones](https://commons.wikimedia.org/wiki/File:Alhambra_Patio_de_los_Leones.jpg) — Pattiz；[CC BY-SA 3.0 es](https://creativecommons.org/licenses/by-sa/3.0/es/deed.en)；文件 `assets/western/35321938.jpg`。

### 8. Romanesque: The Fortress of God

- [Basilica of Saint-Sernin, Toulouse — Romanesque façade](https://commons.wikimedia.org/wiki/File:31_-_Toulouse_-_Basilique_Saint-Sernin_-_Facade.jpg) — Didier Descouens；[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)；文件 `assets/western/94978886.jpg`。

### 9. Gothic: Height and Light

- [Notre-Dame de Paris 2013-07-24](https://commons.wikimedia.org/wiki/File:Notre-Dame_de_Paris_2013-07-24.jpg) — P e z i；[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0)；文件 `assets/western/32131500.jpg`。
- [Sainte Chapelle - Upper level 1](https://commons.wikimedia.org/wiki/File:Sainte_Chapelle_-_Upper_level_1.jpg) — Didier B (Sam67fr)；[CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5)；文件 `assets/western/1109265.jpg`。

### 10. Proto-Renaissance: The Awakening

- [Cappella degli Scrovegni](https://commons.wikimedia.org/wiki/File:Cappella_degli_Scrovegni.jpg) — Hugo DK；[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)；文件 `assets/western/82029552.jpg`。

### 11. Early Renaissance: Discovery of Space

- [Masaccio trinity](https://commons.wikimedia.org/wiki/File:Masaccio_trinity.jpg) — Masaccio；[Public domain](https://commons.wikimedia.org/wiki/File:Masaccio_trinity.jpg)；文件 `assets/western/421285.jpg`。
- [Donatello - David - Florença](https://commons.wikimedia.org/wiki/File:Donatello_-_David_-_Floren%C3%A7a.jpg) — original file by Patrick A. Rodgers；[CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0)；文件 `assets/western/8967887.jpg`。

### 12. High Renaissance: The Masters

- [Mona Lisa, by Leonardo da Vinci, from C2RMF retouched](https://commons.wikimedia.org/wiki/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg) — Leonardo da Vinci；[Public domain](https://commons.wikimedia.org/wiki/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg)；文件 `assets/western/15442524.jpg`。
- ["The School of Athens" by Raffaello Sanzio da Urbino](https://commons.wikimedia.org/wiki/File:%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg) — Raphael；[Public domain](https://commons.wikimedia.org/wiki/File:%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg)；文件 `assets/western/4406048.jpg`。

### 13. Northern Renaissance: Oil and Detail

- [The Garden of Earthly Delights by Bosch High Resolution](https://commons.wikimedia.org/wiki/File:The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg) — Hieronymus Bosch；[Public domain](https://commons.wikimedia.org/wiki/File:The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg)；文件 `assets/western/22605738.jpg`。

### 14. Mannerism: Breaking the Rules

- [Parmigianino - Madonna dal collo lungo - Google Art Project](https://commons.wikimedia.org/wiki/File:Parmigianino_-_Madonna_dal_collo_lungo_-_Google_Art_Project.jpg) — Parmigianino；[Public domain](https://commons.wikimedia.org/wiki/File:Parmigianino_-_Madonna_dal_collo_lungo_-_Google_Art_Project.jpg)；文件 `assets/western/13516608.jpg`。

### 15. Baroque: The Theater of Light

- [Caravaggio - La vocazione di San Matteo](https://commons.wikimedia.org/wiki/File:Caravaggio_-_La_vocazione_di_San_Matteo.jpg) — Caravaggio；[Public domain](https://commons.wikimedia.org/wiki/File:Caravaggio_-_La_vocazione_di_San_Matteo.jpg)；文件 `assets/western/10250620.jpg`。
- [Estasi di Santa Teresa](https://commons.wikimedia.org/wiki/File:Estasi_di_Santa_Teresa.jpg) — aischylos；[CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0)；文件 `assets/western/1144216.jpg`。
- [The Nightwatch by Rembrandt - Rijksmuseum](https://commons.wikimedia.org/wiki/File:The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg) — Rembrandt；[Public domain](https://commons.wikimedia.org/wiki/File:The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg)；文件 `assets/western/29589409.jpg`。

### 16. Rococo: Pastel Play

- [Jean-Honoré Fragonard — The Swing, 1767](https://commons.wikimedia.org/wiki/File:Jean-Honor%C3%A9_Fragonard_-_The_Swing_-_Google_Art_Project.jpg) — Jean-Honoré Fragonard；[Public domain](https://commons.wikimedia.org/wiki/File:Jean-Honor%C3%A9_Fragonard_-_The_Swing_-_Google_Art_Project.jpg)；文件 `assets/western/21996805.jpg`。

### 17. Neoclassicism: Reason

- [Jacques-Louis David - Oath of the Horatii - Google Art Project](https://commons.wikimedia.org/wiki/File:Jacques-Louis_David_-_Oath_of_the_Horatii_-_Google_Art_Project.jpg) — Anne-Louis Girodet / After Jacques-Louis David；[Public domain](https://commons.wikimedia.org/wiki/File:Jacques-Louis_David_-_Oath_of_the_Horatii_-_Google_Art_Project.jpg)；文件 `assets/western/21977949.jpg`。
- [Jacques-Louis David - Marat assassinated - Google Art Project 2](https://commons.wikimedia.org/wiki/File:Jacques-Louis_David_-_Marat_assassinated_-_Google_Art_Project_2.jpg) — Jacques-Louis David；[Public domain](https://commons.wikimedia.org/wiki/File:Jacques-Louis_David_-_Marat_assassinated_-_Google_Art_Project_2.jpg)；文件 `assets/western/20519183.jpg`。

### 18. Romanticism: The Sublime

- [Caspar David Friedrich - Wanderer above the sea of fog](https://commons.wikimedia.org/wiki/File:Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg) — Caspar David Friedrich；[Public domain](https://commons.wikimedia.org/wiki/File:Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg)；文件 `assets/western/1020146.jpg`。

### 19. Realism: Truth

- [Gustave Courbet - A Burial at Ornans - Google Art Project](https://commons.wikimedia.org/wiki/File:Gustave_Courbet_-_A_Burial_at_Ornans_-_Google_Art_Project.jpg) — Gustave Courbet；[Public domain](https://commons.wikimedia.org/wiki/File:Gustave_Courbet_-_A_Burial_at_Ornans_-_Google_Art_Project.jpg)；文件 `assets/western/21856148.jpg`。
- [Jean-François Millet - Gleaners - Google Art Project 2](https://commons.wikimedia.org/wiki/File:Jean-Fran%C3%A7ois_Millet_-_Gleaners_-_Google_Art_Project_2.jpg) — Jean-François Millet；[Public domain](https://commons.wikimedia.org/wiki/File:Jean-Fran%C3%A7ois_Millet_-_Gleaners_-_Google_Art_Project_2.jpg)；文件 `assets/western/20111149.jpg`。

### 20. Barbizon & Early Modern Vision: From Realism to Impressionism

- [Théodore Rousseau — The Forest of Fontainebleau, Morning](https://commons.wikimedia.org/wiki/File:Th%C3%A9odore_Rousseau_(1812-1867)_-_The_Forest_of_Fontainebleau,_Morning_-_P283_-_The_Wallace_Collection.jpg) — Théodore Rousseau；[Public domain](https://commons.wikimedia.org/wiki/File:Th%C3%A9odore_Rousseau_(1812-1867)_-_The_Forest_of_Fontainebleau,_Morning_-_P283_-_The_Wallace_Collection.jpg)；文件 `assets/western/103392012.jpg`。

### 21. Impressionism: Painting Light, Not Objects

- [Claude Monet — Impression, Sunrise, 1872](https://commons.wikimedia.org/wiki/File:Claude_Monet,_Impression,_soleil_levant.jpg) — Claude Monet；[Public domain](https://commons.wikimedia.org/wiki/File:Claude_Monet,_Impression,_soleil_levant.jpg)；文件 `assets/western/5504881.jpg`。

### 22. Post-Impressionism: Structure, Emotion, and Symbol

- [Vincent van Gogh — The Starry Night, 1889](https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg) — Vincent van Gogh；[Public domain](https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg)；文件 `assets/western/25498286.jpg`。

### 23. Symbolism: Dreams, Myths, and Inner Worlds

- [Odilon Redon — The Cyclops, c. 1914](https://commons.wikimedia.org/wiki/File:Odilon_Redon_-_The_Cyclops,_c._1914.jpg) — Odilon Redon；[Public domain](https://commons.wikimedia.org/wiki/File:Odilon_Redon_-_The_Cyclops,_c._1914.jpg)；文件 `assets/western/116119392.jpg`。

### 24. Fauvism: Color as a Wild Beast

- [Henri Matisse — Woman with a Hat, 1905](https://commons.wikimedia.org/wiki/File:Matisse-Woman-with-a-Hat.jpg) — Henri Matisse；[Public domain](https://commons.wikimedia.org/wiki/File:Matisse-Woman-with-a-Hat.jpg)；文件 `assets/western/157391682.jpg`。

### 25. Expressionism: Painting Feeling Under Pressure

- [Edvard Munch - The Scream](https://commons.wikimedia.org/wiki/File:Edvard_Munch_-_The_Scream.jpg) — Edvard Munch；[Public domain](https://commons.wikimedia.org/wiki/File:Edvard_Munch_-_The_Scream.jpg)；文件 `assets/western/195454725.jpg`。

### 26. Cubism: Shattering Reality into Angles

- [Juan Gris — The Breakfast, 1915](https://commons.wikimedia.org/wiki/File:Juan_Gris_-_The_Breakfast_(Le_Petit_D%C3%A9jeuner)_(1915).jpg) — Juan Gris；[Public domain](https://commons.wikimedia.org/wiki/File:Juan_Gris_-_The_Breakfast_(Le_Petit_D%C3%A9jeuner)_(1915).jpg)；文件 `assets/western/166490424.jpg`。

### 27. Futurism & Dada: Speed, Chaos, Anti-Art

- [Umberto Boccioni — The City Rises, 1910](https://commons.wikimedia.org/wiki/File:The_City_Rises_by_Umberto_Boccioni_1910.jpg) — Umberto Boccioni；[Public domain](https://commons.wikimedia.org/wiki/File:The_City_Rises_by_Umberto_Boccioni_1910.jpg)；文件 `assets/western/24439259.jpg`。

### 28. Surrealism: The Logic of Dreams

- [Paul Klee — Fish Magic, 1925](https://commons.wikimedia.org/wiki/File:Paul_Klee,_Swiss_-_Fish_Magic_-_Google_Art_Project.jpg) — Paul Klee；[Public domain](https://commons.wikimedia.org/wiki/File:Paul_Klee,_Swiss_-_Fish_Magic_-_Google_Art_Project.jpg)；文件 `assets/western/22627282.jpg`。

### 29. Abstract Expressionism: Painting as a Record of Being

- [Helen Frankenthaler — portrait illustration by Caroline Andrieu (artist context)](https://commons.wikimedia.org/wiki/File:Helen-Frankenthaler.jpg) — Carolineandrieu；[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)；文件 `assets/western/153656077.jpg`。

### 30. Pop Art: Images, Brands, Mass Media

- [Andy Warhol with Archie — portrait by Jack Mitchell (artist context)](https://commons.wikimedia.org/wiki/File:Andy_Warhol_by_Jack_Mitchell.jpg) — Jack Mitchell；[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)；文件 `assets/western/15047586.jpg`。

### 31. Minimalism: Less, But Louder

- [Agnes Martin — portrait illustration by Caroline Andrieu, 2024 (artist context)](https://commons.wikimedia.org/wiki/File:Agnes-Martin.jpg) — Caroline Andrieu；[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)；文件 `assets/western/151535816.jpg`。

### 32. Conceptual Art: The Idea Is the Artwork

- [Joseph Kosuth — portrait (artist context)](https://commons.wikimedia.org/wiki/File:Joseph_Kosuth_(cropped).jpg) — SonnensturmNr7；[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)；文件 `assets/western/185382894.jpg`。

### 33. Performance & Body Art: Art as Action

- [Marina Abramović — portrait at Venice, 2026 (artist context)](https://commons.wikimedia.org/wiki/File:Marina_Abramovi%C4%87_at_Venice_Film_Festival_2026_01.jpg) — CaseyJNewell；[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)；文件 `assets/western/199311591.jpg`。

### 34. Postmodernism: Remix, Critique, and Doubt

- [Barbara Kruger — portrait illustration (artist context)](https://commons.wikimedia.org/wiki/File:Barbara_Kruger.jpg) — Luisafantinel；[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)；文件 `assets/western/155207029.jpg`。

### 35. Global Contemporary: Identity, Power, Systems

- [Ai Weiwei — portrait, 2008 (artist context)](https://commons.wikimedia.org/wiki/File:Ai_Weiwei_2008.jpg) — Andy Miah；[CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0)；文件 `assets/western/48833133.jpg`。

### 36. New Media & AI: Images After the Machine

- [Refik Anadol — portrait at Dubai Future Forum, 2024 (artist context)](https://commons.wikimedia.org/wiki/File:Dubai_Future_Forum_2024_-_Refik_Anadol.jpg) — Creator not specified; see source；[CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en)；文件 `assets/western/155585433.jpg`。

