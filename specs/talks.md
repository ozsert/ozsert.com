# Talks spec — /talks/ page and featured talks

> **Role of this file:** all 12 talks, each with a one-line summary and 4 short key points ("Lead: one line"). Same format as
> `content.md` (`### key` + `- tr:` / `- en:`); the keys end up in the same `/content/*.json`.
> - The **homepage** shows only the talks in `talks.featured` (see `content.md §5`).
> - **`/talks/`** shows all 12, grouped by volume. Each talk is an `<article id="<slug>">`,
>   so `/talks/#<slug>` links straight to it.
> - Images: `/assets/Topics_<vol>.<n>.jpeg`.

> **Page brief for `/talks/` (built by the model, like the project pages; design rules in `specs/design.md` §10):**
> - **Hero:** `projects.back`-style back link using `talks.back_home` (→ `/#talks`), mono breadcrumb
>   `§ talks.section_no — hero.cta_talks`, huge title `talks.title`, lead `talks.page_intro`, intro `talks.intro`.
>   Hero figure: three volumes drawn as three notebooks or a stack of index-card boxes, labelled Vol.1–3
>   (`ui.vol` + number); clicking one jumps to that volume.
> - **Facts strip:** 3 volumes · 12 talks · TR / EN · "in-house or on stage" (use numbers literally; the
>   labels can reuse `talks.vol1.title` parts or `ui.*`, so no new copy is needed).
> - **Three chapters = three volumes** (`talks.vol1.title` … `vol3.title`; the text after " - " is the
>   chapter title, the part before it the kicker). Each volume shows its 4 talks as tactile, taped index
>   cards with the photo (`talk.<slug>.image`), title, subtitle and summary. Clicking or pressing Enter
>   on a card unfolds its 4 key points (`.k1…k4`, the bold lead is the text before ":"), plus an
>   "invite me for this talk" link (`talks.invite`, a mailto built with `OZ.email()` whose subject is the
>   talk title). Each card has an anchor `id="<slug>"`, so `/talks/#<slug>` opens with that card
>   unfolded and scrolled into view. Featured talks (`talks.featured`) get a ★ stamp.
> - **Closing:** a big call to action `talks.cta` (mailto) and `projects.back`-style link home.

### talks.featured
> Slugs of the 4 talks shown on the homepage, in order. Change freely. Not translated.
- tr: solopreneurship, ai-agent-organizations, ai-logistics-traceability, ai-software-development
- en: solopreneurship, ai-agent-organizations, ai-logistics-traceability, ai-software-development


---

## Volume 1

### talks.vol1.title
- tr: Yapay Zeka Üzerine Düşünce Egzersizleri Vol.1 - Dönüşümün Felsefesi
- en: Thought Exercises on Artificial Intelligence Vol.1 - The Philosophy of Transformation


#### `industrial-revolution-internet-ai` — vol 1 · talk 1 · image `/assets/Topics_1.1.jpeg`

### talk.industrial-revolution-internet-ai.vol
- tr: 1
- en: 1

### talk.industrial-revolution-internet-ai.image
- tr: /assets/Topics_1.1.jpeg
- en: /assets/Topics_1.1.jpeg

### talk.industrial-revolution-internet-ai.title
- tr: Sanayi Devrimi, İnternet ve Yapay Zekâ
- en: Industrial Revolution, Internet, and Artificial Intelligence

### talk.industrial-revolution-internet-ai.subtitle
- tr: Üç Dönüşüm, Üç Farklı Dünya
- en: Three Transformations, Three Different Worlds

### talk.industrial-revolution-internet-ai.summary
- tr: Üç dönüşüm, üç dünya: makineler kas gücünü, internet bilgiye erişimi değiştirdi; yapay zekâ ise karar verme ve üretme biçimimizi değiştiriyor.
- en: Three transformations, three worlds: machines changed muscle work, the internet changed access to information, and AI is changing how we decide and produce.

### talk.industrial-revolution-internet-ai.k1
- tr: Emek: kas gücünden bilgi işçiliğine, şimdi de otomatikleşen bilişsel işlere.
- en: Labour: from muscle to knowledge work, and now to automated cognitive tasks.

### talk.industrial-revolution-internet-ai.k2
- tr: Hız: sanayi devrimi yavaş yayıldı; yapay zekâ dijital, görünmez ve çok hızlı.
- en: Speed: the industrial age spread slowly; AI is digital, invisible and fast.

### talk.industrial-revolution-internet-ai.k3
- tr: Güç: her dalga yeni lider ülkeler, şirketler ve servetler yarattı.
- en: Power: every wave created new leading countries, companies and fortunes.

### talk.industrial-revolution-internet-ai.k4
- tr: Bugün: uyum sağlamak hayatta tutar; dönüşüme liderlik etmek fark yaratır.
- en: Today: adapting is how you survive; leading the change is how you make a difference.


#### `solopreneurship` — vol 1 · talk 2 · image `/assets/Topics_1.2.jpeg` · ★ featured

### talk.solopreneurship.vol
- tr: 1
- en: 1

### talk.solopreneurship.image
- tr: /assets/Topics_1.2.jpeg
- en: /assets/Topics_1.2.jpeg

### talk.solopreneurship.title
- tr: Tek Kişilik Dev Kadro: Solopreneurship
- en: One-Person Giant: Solopreneurship

### talk.solopreneurship.subtitle
- tr: Yapay Zekâ Çağında Solo Girişimcilik
- en: Solo Entrepreneurship in the Age of Artificial Intelligence

### talk.solopreneurship.summary
- tr: Yapay zekâyla tek bir kişi, pazarlamadan satışa, içerikten müşteri desteğine kadar eskiden bir ekip gerektiren işleri yapabiliyor.
- en: With AI, one person can do what used to take a team, from marketing and sales to content and customer support.

### talk.solopreneurship.k1
- tr: Maliyet: girişim maliyetleri düşüyor; doğru araçlarla tek kişi küresel pazara ulaşabiliyor.
- en: Cost: start-up costs drop; one person with the right tools can reach a global market.

### talk.solopreneurship.k2
- tr: Niş pazarlar: büyük şirketlerin zorlandığı alanlarda kişiselleştirilmiş ürünler.
- en: Niches: personalised products for markets where big companies struggle.

### talk.solopreneurship.k3
- tr: Özgürlük: rutin işi yapay zekâ üstlenir; kurucu strateji ve yaratıcılığa odaklanır.
- en: Freedom: AI takes the routine work, so the founder can focus on strategy and creativity.

### talk.solopreneurship.k4
- tr: Gerçekçi bakış: yalnızlık, motivasyon ve sürekli öğrenme hâlâ zor kısımlar.
- en: Reality check: isolation, motivation and constant learning are still the hard parts.


#### `ai-agent-organizations` — vol 1 · talk 3 · image `/assets/Topics_1.3.jpeg` · ★ featured

### talk.ai-agent-organizations.vol
- tr: 1
- en: 1

### talk.ai-agent-organizations.image
- tr: /assets/Topics_1.3.jpeg
- en: /assets/Topics_1.3.jpeg

### talk.ai-agent-organizations.title
- tr: Yapay Zekâ Agentleriyle Yeni Nesil Organizasyon
- en: Next-Generation Organization with AI Agents

### talk.ai-agent-organizations.subtitle
- tr: Kartlar Yeniden Dağıtılıyor
- en: The Cards Are Being Reshuffled

### talk.ai-agent-organizations.summary
- tr: Yapay zekâ ajanları, hiyerarşileri insanların ve ajanların yan yana çalıştığı esnek, görev odaklı ekiplere dönüştürebilir.
- en: AI agents can turn hierarchies into fluid, task-based teams where people and agents work side by side.

### talk.ai-agent-organizations.k1
- tr: Verimlilik: ajanlar analiz, raporlama, müşteri iletişimi ve tedarik zincirini az insan müdahalesiyle yürütür.
- en: Efficiency: agents run analysis, reporting, customer contact and supply chains with little human input.

### talk.ai-agent-organizations.k2
- tr: Kararlar: daha hızlı, veriye dayalı kararlar; insanlar strateji ve yaratıcılığa odaklanır.
- en: Decisions: faster, data-driven calls, while people focus on strategy and creativity.

### talk.ai-agent-organizations.k3
- tr: Yeni roller: ajanları yönetmek, denetlemek ve geliştirmek temel bir beceri hâline geliyor.
- en: New roles: managing, supervising and developing agents becomes a core skill.

### talk.ai-agent-organizations.k4
- tr: Güvenlik çitleri: gizlilik, güvenlik ve hesap verebilirlik net politikalar gerektirir.
- en: Guardrails: privacy, security and accountability need clear policies.


#### `corporate-memory` — vol 1 · talk 4 · image `/assets/Topics_1.4.jpeg`

### talk.corporate-memory.vol
- tr: 1
- en: 1

### talk.corporate-memory.image
- tr: /assets/Topics_1.4.jpeg
- en: /assets/Topics_1.4.jpeg

### talk.corporate-memory.title
- tr: Yapay Zekâ Çağında Kurumsal Hafıza
- en: Corporate Memory in the Age of Artificial Intelligence

### talk.corporate-memory.subtitle
- tr: Veriyi Kim Sahiplenirse Gelecek Onun
- en: Whoever Owns the Data, Owns the Future

### talk.corporate-memory.summary
- tr: Bir kurumun deneyimi, bilgisi ve geçmiş kararları onun hafızasıdır; yapay zekâ bu hafızayı nihayet kullanılabilir kılıyor.
- en: An organisation's experience, knowledge and past decisions are its memory, and AI can finally make that memory usable.

### talk.corporate-memory.k1
- tr: Veriyi açmak: e-postalar, raporlar ve toplantı notları aranabilir bilgiye dönüşür.
- en: Unlocking data: emails, reports and meeting notes become searchable knowledge.

### talk.corporate-memory.k2
- tr: Siloları yıkmak: herkes ihtiyacı olan bilgiyi hızla bulur ve ekipler arasında paylaşır.
- en: Breaking silos: people find what they need fast and share it across teams.

### talk.corporate-memory.k3
- tr: Kurumsal amnezi: çalışan ayrıldığında daha az bilgi kaybolur, ama yanlı veri hâlâ yanıltır.
- en: Corporate amnesia: less knowledge walks out the door, but biased data can still mislead.

### talk.corporate-memory.k4
- tr: Stratejik varlık: veriyi bir varlık olarak yöneten şirketler geleceği şekillendirecek.
- en: Strategic asset: companies that manage data as an asset will shape the future.


---

## Volume 2

### talks.vol2.title
- tr: Yapay Zeka Üzerine Düşünce Egzersizleri Vol.2 - Sektörlerin Dönüşümü
- en: Thought Exercises on Artificial Intelligence Vol.2 - Transformation of Sectors


#### `ai-in-finance` — vol 2 · talk 1 · image `/assets/Topics_2.1.jpeg`

### talk.ai-in-finance.vol
- tr: 2
- en: 2

### talk.ai-in-finance.image
- tr: /assets/Topics_2.1.jpeg
- en: /assets/Topics_2.1.jpeg

### talk.ai-in-finance.title
- tr: Yapay Zekâ ile Finansın Dönüşen Aklı
- en: The Transforming Intelligence of Finance with AI

### talk.ai-in-finance.subtitle
- tr: Verileri anlamlandırmak artık çok kolay
- en: Making Sense of Data is Now Very Easy

### talk.ai-in-finance.summary
- tr: Finansal veriyi anlamlandırmak artık çok kolay; bu da yatırımı, riski, hizmeti ve ürünlerin kendisini değiştiriyor.
- en: Making sense of financial data is now easy, and that changes trading, risk, service and the products themselves.

### talk.ai-in-finance.k1
- tr: Yatırım: algoritmik stratejiler, robo-danışmanlar ve kişiselleştirilmiş portföyler.
- en: Trading: algorithmic strategies, robo-advisors and personalised portfolios.

### talk.ai-in-finance.k2
- tr: Risk: gerçek zamanlı dolandırıcılık tespiti, daha hızlı ve isabetli kredi değerlendirmesi.
- en: Risk: real-time fraud detection and faster, more accurate credit scoring.

### talk.ai-in-finance.k3
- tr: Operasyon: kredi başvuruları, uyum (RegTech) ve doküman süreçleri otomatikleşiyor.
- en: Operations: credit applications, compliance (RegTech) and documents, automated.

### talk.ai-in-finance.k4
- tr: Dikkat: yanlılık, veri gizliliği ve siber güvenlik regülasyonun ön cephesi.
- en: Caution: bias, privacy and cybersecurity are the regulatory front line.


#### `retail-silent-revolution` — vol 2 · talk 2 · image `/assets/Topics_2.2.jpeg`

### talk.retail-silent-revolution.vol
- tr: 2
- en: 2

### talk.retail-silent-revolution.image
- tr: /assets/Topics_2.2.jpeg
- en: /assets/Topics_2.2.jpeg

### talk.retail-silent-revolution.title
- tr: Perakendenin Sessiz Devrimi
- en: Retail's Silent Revolution

### talk.retail-silent-revolution.subtitle
- tr: Yapay Zeka Çağında İnsansız Bir Deneyim
- en: An Unmanned Experience in the Age of AI

### talk.retail-silent-revolution.summary
- tr: Perakende sessizce değişiyor: her müşteri kendine özel bir mağaza görüyor, mağaza da giderek kendi kendini yönetiyor.
- en: Retail is changing quietly: every customer gets their own store, and the store increasingly runs itself.

### talk.retail-silent-revolution.k1
- tr: Kişiselleştirme: her müşteriye özel öneriler, kampanyalar ve içerik.
- en: Personalisation: recommendations, promotions and content tailored to each customer.

### talk.retail-silent-revolution.k2
- tr: Tedarik zinciri: hem fazla stoku hem stoksuzluğu azaltan talep tahmini.
- en: Supply chain: demand forecasting that cuts both excess stock and stockouts.

### talk.retail-silent-revolution.k3
- tr: Akıllı mağazalar: kasiyersiz ödeme, dinamik fiyatlama ve AR ile deneme.
- en: Smart stores: cashierless checkout, dynamic pricing and AR try-ons.

### talk.retail-silent-revolution.k4
- tr: Hizmet: asistanlar sık sorulan soruları ve sipariş takibini 7/24 yönetir.
- en: Service: assistants handle FAQs and order tracking around the clock.


#### `ai-logistics-traceability` — vol 2 · talk 3 · image `/assets/Topics_2.3.jpeg` · ★ featured

### talk.ai-logistics-traceability.vol
- tr: 2
- en: 2

### talk.ai-logistics-traceability.image
- tr: /assets/Topics_2.3.jpeg
- en: /assets/Topics_2.3.jpeg

### talk.ai-logistics-traceability.title
- tr: Yapay Zekâ ile Lojistikte Uçtan Uca İzlenebilirlik
- en: End-to-End Traceability in Logistics with AI

### talk.ai-logistics-traceability.subtitle
- tr: Konuşan Ajanlar, Kontrol kuleleri ve dahası
- en: Talking Agents, Control Towers, and More

### talk.ai-logistics-traceability.summary
- tr: Rotadan depoya, gönderinin kendisine kadar yapay zekâ lojistiği uçtan uca görünür kılıyor: konuşan ajanlar, kontrol kuleleri.
- en: From the route to the warehouse to the shipment itself, AI makes logistics visible end to end, with talking agents and control towers.

### talk.ai-logistics-traceability.k1
- tr: Rotalar: trafiği, havayı, yakıtı ve öncelikleri hesaba katan teslimat planları.
- en: Routes: delivery plans that weigh traffic, weather, fuel and priorities.

### talk.ai-logistics-traceability.k2
- tr: Depolar: stok ve sipariş toplama için robotlar ve yapay zekâyla optimize yerleşim.
- en: Warehouses: robots and AI-optimised layouts for stock and order picking.

### talk.ai-logistics-traceability.k3
- tr: Canlı takip: IoT sensörleri konumu, sıcaklığı ve güvenliği izler, sorunları erkenden yakalar.
- en: Live tracking: IoT sensors watch location, temperature and security, and flag problems early.

### talk.ai-logistics-traceability.k4
- tr: Dayanıklılık: aksaklıkları ve bakım ihtiyacını zinciri durdurmadan öngörmek.
- en: Resilience: predicting disruptions and maintenance before they stop the chain.


#### `next-gen-ecommerce` — vol 2 · talk 4 · image `/assets/Topics_2.4.jpeg`

### talk.next-gen-ecommerce.vol
- tr: 2
- en: 2

### talk.next-gen-ecommerce.image
- tr: /assets/Topics_2.4.jpeg
- en: /assets/Topics_2.4.jpeg

### talk.next-gen-ecommerce.title
- tr: Yeni Nesil E-Ticaret: Yeni Nesil Kullanıcı Deneyimi
- en: Next-Generation E-Commerce: Next-Generation User Experience

### talk.next-gen-ecommerce.subtitle
- tr: Internet ile Başlayan Dönüşüm Yapay Zeka ile neye evrilecek?
- en: How Will the Transformation Started by the Internet Evolve with AI?

### talk.next-gen-ecommerce.summary
- tr: İnternet mağazaları çevrimiçine taşıdı; yapay zekâ her mağazayı kişisel, sohbet eden ve görsel hâle getiriyor.
- en: The internet put shops online; AI makes every shop personal, conversational and visual.

### talk.next-gen-ecommerce.k1
- tr: Hiper kişiselleştirme: ana sayfa düzeninden önerilere her şey size uyum sağlar.
- en: Hyper-personalisation: from homepage layout to recommendations, everything adapts to you.

### talk.next-gen-ecommerce.k2
- tr: Yeni arama: ürünleri fotoğrafla ya da sesle bulmak.
- en: New search: find products by photo or by voice.

### talk.next-gen-ecommerce.k3
- tr: Alışveriş asistanları: stil önerisi sunan ve satın almaya rehberlik eden sohbet botları.
- en: Shopping assistants: chatbots that advise on style and guide the purchase.

### talk.next-gen-ecommerce.k4
- tr: AR: mobilyayı, kıyafeti ya da makyajı satın almadan önce kendi ortamınızda deneyin.
- en: AR: try furniture, clothes or make-up in your own space before you buy.


---

## Volume 3

### talks.vol3.title
- tr: Yapay Zeka Üzerine Düşünce Egzersizleri Vol.3 - İnsan ve Yapay Zeka İlişkisi
- en: Thought Exercises on Artificial Intelligence Vol.3 - The Human-AI Relationship


#### `new-role-of-humans` — vol 3 · talk 1 · image `/assets/Topics_3.1.jpeg`

### talk.new-role-of-humans.vol
- tr: 3
- en: 3

### talk.new-role-of-humans.image
- tr: /assets/Topics_3.1.jpeg
- en: /assets/Topics_3.1.jpeg

### talk.new-role-of-humans.title
- tr: Yapay Zekâ Çağında İnsanın Yeni Rolü
- en: The New Role of Human in the Age of Artificial Intelligence

### talk.new-role-of-humans.subtitle
- tr: İK 4.0: İnsanoğlu Nasıl Dönüşmeli?
- en: HR 4.0: How Should Humanity Transform?

### talk.new-role-of-humans.summary
- tr: İşler yok olmuyor, dönüşüyor; bizi insan yapan beceriler ise daha değerli hâle geliyor.
- en: Jobs are transforming, not disappearing, and the skills that make us human are becoming more valuable.

### talk.new-role-of-humans.k1
- tr: İnsana özgü beceriler: eleştirel düşünme, yaratıcılık, empati ve etik muhakeme.
- en: Human skills: critical thinking, creativity, empathy and ethical judgement.

### talk.new-role-of-humans.k2
- tr: İş birliği: insanlar, yapay zekânın ürettiklerini kullanarak stratejik kararları verir.
- en: Collaboration: people make the strategic calls using what AI produces.

### talk.new-role-of-humans.k3
- tr: Ömür boyu öğrenme: yeniden beceri kazanmak her kariyerin parçası; yapay zekâ araçlarını kullanmak temel bir beceri.
- en: Lifelong learning: reskilling becomes part of every career, and using AI tools becomes a basic skill.

### talk.new-role-of-humans.k4
- tr: İK 4.0: insan kaynakları dönüşümü eğitim, gelişim ve kültürle yönetir.
- en: HR 4.0: HR leads the shift through training, development and culture.


#### `ai-software-development` — vol 3 · talk 2 · image `/assets/Topics_3.2.jpeg` · ★ featured

### talk.ai-software-development.vol
- tr: 3
- en: 3

### talk.ai-software-development.image
- tr: /assets/Topics_3.2.jpeg
- en: /assets/Topics_3.2.jpeg

### talk.ai-software-development.title
- tr: Yazılım Geliştirmede Yapay Zekânın Yükselişi
- en: The Rise of Artificial Intelligence in Software Development

### talk.ai-software-development.subtitle
- tr: Satır Satır Değişim: Yapay Zeka Yazılım Geliştirmeyi Yiyecek mi?
- en: Line by Line Change: Will AI Eat Software Development?

### talk.ai-software-development.summary
- tr: Yapay zekâ kod yazıyor, inceliyor ve test ediyor; geliştiricinin işi tasarıma, mimariye ve denetime doğru yükseliyor.
- en: AI writes, reviews and tests code; the developer's job moves up to design, architecture and supervision.

### talk.ai-software-development.k1
- tr: Üretim: asistanlar rutin kodu, hatta fonksiyonların tamamını yazıyor.
- en: Generation: assistants write routine code and even whole functions.

### talk.ai-software-development.k2
- tr: Kalite: yapay zekâ hataları, güvenlik açıklarını ve performans sorunlarını bulup testleri üretiyor.
- en: Quality: AI finds bugs, security holes and performance issues, and generates the tests.

### talk.ai-software-development.k3
- tr: Doğal dil: sade bir dille yazılan gereksinimler çalışan yazılıma dönüşüyor.
- en: Natural language: requirements written in plain language become working software.

### talk.ai-software-development.k4
- tr: Geliştirici: yerini kaybetmiyor; yaratıcı, karmaşık ve stratejik işlere alan açılıyor.
- en: The developer: not replaced, but freed for creative, complex and strategic work.


#### `ai-customer-experience` — vol 3 · talk 3 · image `/assets/Topics_3.3.jpeg`

### talk.ai-customer-experience.vol
- tr: 3
- en: 3

### talk.ai-customer-experience.image
- tr: /assets/Topics_3.3.jpeg
- en: /assets/Topics_3.3.jpeg

### talk.ai-customer-experience.title
- tr: AI Destekli Müşteri Deneyiminin Yeni Dönemi
- en: The New Era of AI-Powered Customer Experience

### talk.ai-customer-experience.subtitle
- tr: İlk Temastan Sadakate: İnsansız deneyim tatmin edecek mi?
- en: From First Contact to Loyalty: Will an Unmanned Experience Satisfy?

### talk.ai-customer-experience.summary
- tr: İlk temastan sadakate: yapay zekâ hizmeti anlık, proaktif ve kişisel kılıyor; insan gerektiren işleri ise insanlar üstleniyor.
- en: From first contact to loyalty: AI makes service instant, proactive and personal, while people handle what needs a human.

### talk.ai-customer-experience.k1
- tr: Her an açık: beklemeden, 7/24 kişiselleştirilmiş yanıtlar.
- en: Always on: personalised answers 24/7, without the wait.

### talk.ai-customer-experience.k2
- tr: Proaktif: sorunlar müşteri aramadan tespit edilip çözülür.
- en: Proactive: problems are spotted and solved before the customer calls.

### talk.ai-customer-experience.k3
- tr: Empati: duygu analizi hayal kırıklığını sezer ve tonu buna göre ayarlar.
- en: Empathy: sentiment analysis senses frustration and adjusts the tone.

### talk.ai-customer-experience.k4
- tr: Güçlenen temsilciler: rutini yapay zekâ alır, insan temsilcilere anında bilgi ve çözüm önerir.
- en: Stronger agents: AI takes the routine work and gives human agents instant answers.


#### `ai-design-creativity` — vol 3 · talk 4 · image `/assets/Topics_3.4.jpeg`

### talk.ai-design-creativity.vol
- tr: 3
- en: 3

### talk.ai-design-creativity.image
- tr: /assets/Topics_3.4.jpeg
- en: /assets/Topics_3.4.jpeg

### talk.ai-design-creativity.title
- tr: Yaratıcılığın Yeni Ortağı'nın Tasarım Dünyasında Etkisi
- en: The Impact of Creativity's New Partner in the Design World

### talk.ai-design-creativity.subtitle
- tr: Hayallerin Başladığı Yer Daha mı Önemli Hale Geldi?
- en: Has the Place Where Dreams Begin Become More Important?

### talk.ai-design-creativity.summary
- tr: Yapay zekâ yaratıcılığın yeni ortağı: sonsuz varyasyon üretiyor; konsept ve vizyon ise tasarımcının asıl işi hâline geliyor.
- en: AI is creativity's new partner: it generates endless variations, while concept and vision become the designer's real work.

### talk.ai-design-creativity.k1
- tr: İlham: yeni fikirleri tetikleyen, farklı tarzlarda sayısız varyasyon.
- en: Inspiration: countless variations across styles to spark new ideas.

### talk.ai-design-creativity.k2
- tr: Otomasyon: logolar, paletler ve yerleşimler bir başlangıç noktası, son durak değil.
- en: Automation: logos, palettes and layouts as a starting point, not the finish.

### talk.ai-design-creativity.k3
- tr: Hız: hızlı prototipleme ve veriye dayalı kararlar her döngüyü kısaltır.
- en: Speed: rapid prototyping and data-driven choices shorten every iteration.

### talk.ai-design-creativity.k4
- tr: Tasarımcı: üreticiden küratör ve yönetmene; sezgi ve estetik hâlâ yolu gösteriyor.
- en: The designer: from maker to curator and director; intuition and taste still lead.


---

## Page chrome

### talks.page_title
- tr: Konuşmalar — C. Murad Özsert
- en: Talks — C. Murad Özsert

### talks.page_intro
- tr: Üç cilt, on iki konuşma: dönüşümün felsefesi, sektörler ve insan.
- en: Three volumes, twelve talks: the philosophy of change, sectors and people.

### talks.back_home
- tr: ← Ana sayfaya dön
- en: ← Back to the homepage

### talks.invite
- tr: Bu konuşma için davet et
- en: Invite me for this talk
