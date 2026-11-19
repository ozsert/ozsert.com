# Content spec — ozsert.com homepage

> **Role of this file:** WHAT the homepage says: every visible word, in Turkish and English.
> Each `### key` block becomes an entry in `/content/tr.json` and `/content/en.json`. Pages render copy
> through `data-i18n="key"` / `OZ.t("key")` and **never hard-code visible copy**.
>
> **Format:** `### <key>` followed by `- tr:` and `- en:` lines. Lines starting with `>` are notes for
> the builder and aren't shown on the site.

---

## 0. Identity (for the model's understanding — read this first)

C. Murad Özsert is a **senior tech leader with an entrepreneur's mindset**: 17+
years of building, shipping and scaling digital products, with AI-powered
platforms built from the ground up.

- **Boğaziçi University**, Computer Engineering BSc (2008) and MSc (2012). MSc
  thesis: multilingual word-polarity detection, an early NLP project.
- **Vodafone** (2008–2012): value-added mobile services (Mobile TV, location-based
  apps) for millions of users.
- **Foreks** (2012–2020): Lead Engineer, then Engineering Manager. Real-time
  financial market data, with cloud APIs serving **100M+ requests a day**.
- **Turkcell** (2014–2015): Product Manager for fizy.com, building its
  AI-powered recommendation engine.
- **Yolda.com** (Apr 2020 – Mar 2025): **Co-Founder & CTO**. A B2B digital
  logistics platform founded as the pandemic began. Serverless on AWS, serving
  **1,100+ enterprises** (Metro, P&G, Heinz) and **10K+ carriers**. Grew from zero
  to **€11M annual revenue** and **102 people**, raised **$10M+** over three rounds
  (Speedinvest, CSF and others), and expanded to Germany within two years.
  Tell it as a founder's journey: building, scaling, what he learned.
  **Endeavor Entrepreneur** since 2022.
- **Deka Tech** (Feb 2026 – now, Istanbul): his employer. He **leads AI projects
  with some of the largest enterprises** (never named on the site), from use-case
  discovery to production. Example: an **AI Software Factory**, with agents such as a Code
  Reviewer and a Software Developer, running on Anthropic and OpenAI models, plus an
  internal marketplace of plugins and skills.
  > Don't present him by job title. Describe the work ("leads AI projects with
  > enterprises"). He sees himself as a **generalist**: startup founder, CTO,
  > engineer and enterprise AI lead, which matters in an AI-driven world.
- **Independent advisor** (Jun 2025 – Jan 2026): startup advisory on building
  and scaling a product and a team (e.g. **Roboritma.com**).

He writes the weekly AI newsletter **The Next SignAl** and gives talks on how AI
reshapes organisations, sectors and people.

Tone: warm, curious, grounded, a builder who has been in the trenches, not a
hype merchant. First person. Short sentences. It reads like a notebook he keeps,
not a corporate brochure.

Personal motif: **a signal** ( *finding the signal beyond the noise*).

---

## 1. Meta

### meta.title
- tr: C. Murad Özsert — Teknoloji, girişimcilik ve yapay zekâ
- en: C. Murad Özsert — Technology, startups and AI

### meta.description
- tr: Kurumlara yapay zekâ danışmanlığı veren eski kurucu & CTO, yapay zekâ konuşmacısı C. Murad Özsert'in saha notları.
- en: Field notes from C. Murad Özsert: enterprise AI consultant, ex-founder & CTO, and AI speaker.

---

## 2. Hero (`#top`)

### hero.kicker
- tr: Saha notları, 2026 · İstanbul
- en: Field notes, 2026 · Istanbul

### hero.headline
- tr: Sinyali bul. Sıradakini inşa et.
- en: Finding the signal. Building what's next.

### hero.role
> Generic definition, no job title, no employer. The whole spectrum, startups to large enterprises.
> Accent-highlight the phrases in `hero.role_highlights`.
- tr: Startup'lardan Türkiye'nin en büyük kurumlarına kadar, ekiplerin teknoloji ve yapay zekâyla ölçülebilir değer üretmesine yardım ediyorum.
- en: From startups to some of the largest enterprises, I help teams turn technology and AI into measurable value.

### hero.previously_label
> Small mono label in front of `hero.previously` (a mono "PREVIOUSLY"-style label).
- tr: 17+ yıl · Öncesi
- en: 17+ years · Previously

### hero.previously
- tr: Yolda.com'un kurucu ortağı ve CTO'su: sıfırdan 102 kişilik bir ekip ve yıllık 11M€ gelir, 10M$+ yatırım, Almanya'ya açılım.
- en: Co-founder & CTO of Yolda.com: from zero to a 102-person team and €11M in annual revenue, $10M+ raised, expanded into Germany.

### hero.manifesto
- tr: Yapay zekânın çalışma, düşünme ve örgütlenme biçimimizi yeniden şekillendirdiğine inanıyorum. Uyum sağlayan küçük ekipler büyük etki yaratacak; ama en önemli kısım yine insanda kalıyor: muhakeme, merak, sorumluluk.
- en: I believe AI is reshaping how we work, think and organise. Small teams that adapt will have outsized impact, but what matters most stays human: judgement, curiosity, responsibility.

### hero.role_highlights
> Phrases in `hero.role` to highlight (marker wash / accent ink). Separated by `|`.
> Each one MUST appear exactly in `hero.role` Not shown on their own.
- tr: Startup'lardan|en büyük kurumlarına|ölçülebilir değer
- en: startups|largest enterprises|measurable value

### hero.manifesto_circle
> Words in `hero.manifesto` to circle by hand (an oval drawn around each), `|`-separated.
> The last one gets the arrow to `hero.margin_note`. Each MUST appear exactly in `hero.manifesto`.
- tr: Uyum sağlayan|insanda
- en: adapt|human

### hero.margin_note
> A small handwritten-style aside next to the hero.
- tr: not: önemli olan araç değil, yolculuk.
- en: note to self: the tool is the vehicle, not the destination.

### hero.cta_work
- tr: Çalışmalarımı gör
- en: See the work

### hero.cta_talks
- tr: Konuşmalar
- en: Talks

### hero.cta_newsletter
- tr: Bültene abone ol
- en: Subscribe to the newsletter

> Portrait: `/assets/portrait-upper.jpg` (960×1200, 4:5, head to waist; use this for portrait cards).
> `/assets/portrait.jpg` (1200×1800) is the full-length shot, only for tall layouts. Alt text below. Versions may treat it like a taped-in photo, a sketch frame, etc.
> More photos (1024×1536): `/assets/About_1.jpg` … `About_4.jpg`.

> **Hero figure = the accent colour's scene.** Each accent in the picker has its own fig. 1
> line drawing (see `specs/design.md` §8b and hard requirement §9.13). Captions follow
> `ui.fig` ("fig. 1 — …"); the key is `hero.fig.<accent id>`.

### hero.fig.bosphorus
- tr: Boğaz Köprüsü, iki kıta arasında
- en: The Bosphorus Bridge, between two continents

### hero.fig.galata
- tr: Galata Kulesi, 1348'den beri şehri izliyor
- en: Galata Tower, watching the city since 1348

### hero.fig.iznik
- tr: İznik çinisi: lale, karanfil ve rumi motifler
- en: İznik tile: tulip, carnation and rumi motifs

### hero.fig.tulip
- tr: Emirgan'da nisan: İstanbul laleleri
- en: April in Emirgan: the Istanbul tulips

### hero.fig.saffron
- tr: Mısır Çarşısı: kubbeler ve baharat
- en: The Spice Bazaar: domes and spices

### hero.fig.olive
- tr: Zeytin dalı: sabır, emek ve zaman
- en: An olive branch: patience, craft and time

### hero.portrait_alt
- tr: C. Murad Özsert'in portresi
- en: Portrait of C. Murad Özsert

---

## 3. Now strip (`#now`)

### now.label
- tr: Şu an
- en: Now

### now.item1
- tr: Deka Tech'te kurumlarla yapay zekâ projelerine liderlik ediyorum
- en: Leading AI projects with enterprises at Deka Tech

### now.item2
- tr: İstanbul'da
- en: Based in Istanbul

### now.item3
- tr: Her hafta The Next SignAl'ı yazıyorum
- en: Writing The Next SignAl every week

### now.item4
- tr: Konuşma ve danışmanlık sohbetlerine açığım
- en: Open to talks and advisory conversations

---

## 4. Workbench (`#projects`)

> Section 01 of the homepage. Its copy and the project rows live in `specs/projects.md`
> (`projects.*`) and `specs/projects/<slug>.md` (`project.<slug>.title/oneliner/kind/status/year`).
> Each row links to `/projects/<slug>/`.

## 4b. The founder's road (`#founder`)

### founder.section_no
- tr: 02
- en: 02

### founder.label
- tr: Girişimcilik
- en: Founder's road

### founder.title
- tr: Sıfırdan kurmak: Yolda.com.
- en: Building from zero: Yolda.com.

### founder.intro
- tr: Pandeminin ilk ayında bir B2B dijital lojistik platformu kurduk. Beş yılda 102 kişilik bir ekibe ve iki ülkede operasyona ulaştık. Bugün kurumlarda yaptığım işin temeli, o yolda öğrendiklerim.
- en: We founded a B2B digital logistics platform in the first month of the pandemic. In five years it grew into a 102-person team with operations in two countries. What I learned on that road is the foundation of what I do in enterprises today.

### founder.note
- tr: Kurucu Ortak & CTO · 2020–2025 · İstanbul → Hamburg
- en: Co-Founder & CTO · 2020–2025 · Istanbul → Hamburg

> 4 case cards on grid paper. The STAT is the hero of each card.
> Use the numbers exactly as written; don't round or invent. No click-through.

### founder.case1.title
- tr: Sıfırdan bir lojistik platformu
- en: A logistics platform, built from zero

### founder.case1.stat
- tr: 0 → 11M€
- en: 0 → €11M

### founder.case1.desc
- tr: Yıllık gelir sıfırdan 11 milyon euroya, ekip 102 kişiye ulaştı; 1.100+ kurumsal müşteri ve 10 bin+ taşıyıcı.
- en: Annual revenue grew from zero to €11M and the team to 102 people, serving 1,100+ enterprises and 10K+ carriers.

### founder.case1.tag
- tr: Büyüme · Ölçek
- en: Growth · Scale

### founder.case2.title
- tr: Almanya operasyonunu Türkiye'den yönetmek
- en: Running Germany from Turkey

### founder.case2.stat
- tr: 3× daha düşük maliyet
- en: 3× lower cost

### founder.case2.desc
- tr: %90+ taşıyıcı dijitalleşmesi ve %50+ yapay zekâ destekli dispeç otomasyonu ile Almanya operasyonlarını Türkiye'den verimli şekilde yönettik.
- en: 90%+ carrier digitalisation and 50%+ AI-based dispatch automation let us run German operations efficiently from Turkey, cutting operational costs by up to 3×.

### founder.case2.tag
- tr: Yapay zekâ · Operasyon
- en: AI · Operations

### founder.case3.title
- tr: Üç turda yatırım, Endeavor ağı
- en: Three rounds, the Endeavor network

### founder.case3.stat
- tr: 10M$+
- en: $10M+

### founder.case3.desc
- tr: Önde gelen girişim sermayesi fonlarından üç turda 10 milyon doları aşkın yatırım aldık; 2022'de Endeavor Girişimcisi seçildim.
- en: We raised more than $10M over three rounds from leading venture investors, and I was selected as an Endeavor Entrepreneur in 2022.

### founder.case3.tag
- tr: Yatırım
- en: Funding

### founder.case4.title
- tr: Tamamen serverless bir B2B platformu
- en: A fully serverless B2B platform

### founder.case4.stat
- tr: 1.100+ kurum
- en: 1,100+ enterprises

### founder.case4.desc
- tr: 1.100'ü aşkın kurumsal müşteriye ve 10.000'i aşkın taşıyıcı partnere hizmet veren, sıfırdan kurduğumuz serverless bir platform; 4 çapraz fonksiyonlu ekip, yaklaşık 42 kişi.
- en: A serverless platform we built from scratch, serving 1,100+ enterprise customers and 10,000+ carrier partners, run by 4 cross-functional squads of about 42 people.

### founder.case4.tag
- tr: Ürün · Mühendislik
- en: Product · Engineering

---

## 5. Talks (`#talks`)

> 4 featured talks on the homepage. The full list of 12 lives on `/talks/` (content in `specs/talks.md`).

### talks.section_no
- tr: 03
- en: 03

### talks.label
- tr: Konuşmalar
- en: Talks

### talks.title
- tr: Yapay zekâ üzerine düşünce egzersizleri.
- en: Thought exercises on AI.

### talks.intro
- tr: Kurumlar, sektörler ve insanlar için yapay zekânın ne anlama geldiğini anlatan konuşmalar. Etkinlik ve kurum içi oturumlar için yazabilirsiniz.
- en: Talks on what AI means for organisations, sectors and people. Available for events and in-house sessions.

### talks.cta
- tr: Konuşma daveti için yaz
- en: Invite me to speak

### talks.all
- tr: 12 konuşmanın tamamı →
- en: All 12 talks →

> Show the 4 talks listed in `talks.featured` (`specs/talks.md`) as rows or index cards:
> number, title (`talk.<slug>.title`), subtitle, a stamp with the volume
> (`Vol.1` …) and a link to `/talks/#<slug>`. Then the `talks.all` link to `/talks/`.
> No slider and no modal.

---

## 6. Newsletter (`#newsletter`)

> Shows the latest 3 posts via `OZ.latestPosts(3)` (title, date, excerpt, link),
> with a loading state, an empty or error state, and two subscribe buttons.

### newsletter.section_no
- tr: 04
- en: 04

### newsletter.label
- tr: Bülten
- en: Newsletter

### newsletter.fig_caption
> Caption for a newsletter figure, if you draw one (used after `ui.fig`).
- tr: gürültü → sinyal
- en: noise → signal

### newsletter.name
- tr: The Next SignAl
- en: The Next SignAl

### newsletter.tagline
- tr: Gürültünün ötesinde, yapay zekâ ve teknolojide bir sonraki sinyal.
- en: Finding the next signal in AI & tech — beyond the noise.

### newsletter.cadence
- tr: Haftalık · Substack & LinkedIn
- en: Weekly · Substack & LinkedIn

### newsletter.latest
- tr: Son yazılar
- en: Latest issues

### newsletter.loading
- tr: Yükleniyor…
- en: Loading…

### newsletter.error
- tr: Yazılar şu an yüklenemedi — Substack'te okuyabilirsin.
- en: Couldn't load posts right now — read them on Substack.

### newsletter.subscribe_substack
- tr: Substack'te abone ol
- en: Subscribe on Substack

### newsletter.subscribe_linkedin
- tr: LinkedIn'de takip et
- en: Follow on LinkedIn

> Links (not translated):
> - Substack: https://thenextsignalnewsletter.substack.com/
> - LinkedIn: https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7346972552528834560

---

## 7. Experience (`#experience`)

> A compact résumé timeline. Years go in mono.

### experience.section_no
- tr: 05
- en: 05

### experience.label
- tr: Deneyim
- en: Experience

### experience.title
- tr: Buraya kadarki yol.
- en: The road so far.

### experience.fig
- tr: şekil 3 — 2008 → bugün, ölçekli
- en: fig. 3 — 2008 → now, to scale

> Assumes independent consulting ran Jun 2025 → Jan 2026, before Deka Tech (Feb 2026).

### experience.r1.org
- tr: Deka Tech
- en: Deka Tech

### experience.r1.role
- tr: En büyük kurumlarla yapay zekâ projelerine liderlik
- en: Leading AI projects with some of the largest enterprises

### experience.r1.years
- tr: Şub 2026 — Bugün
- en: Feb 2026 — Now

### experience.r2.org
- tr: Bağımsız Danışman
- en: Independent Advisor

### experience.r2.role
- tr: Startup danışmanlığı: ürün ve ekip nasıl kurulur, nasıl ölçeklenir · Roboritma.com ve diğerleri
- en: Startup advisory: how to build and scale a product and a team · Roboritma.com and others

### experience.r2.years
- tr: Haz 2025 — Oca 2026
- en: Jun 2025 — Jan 2026

### experience.r3.org
- tr: Yolda.com
- en: Yolda.com

### experience.r3.role
- tr: Kurucu Ortak & CTO · Endeavor Girişimcisi
- en: Co-Founder & CTO · Endeavor Entrepreneur

### experience.r3.years
- tr: 2020 — 2025
- en: 2020 — 2025

### experience.r4.org
- tr: Foreks
- en: Foreks

### experience.r4.role
- tr: Mühendislik Müdürü
- en: Engineering Manager

### experience.r4.years
- tr: 2015 — 2020
- en: 2015 — 2020

### experience.r5.org
- tr: Turkcell
- en: Turkcell

### experience.r5.role
- tr: Ürün Yöneticisi, fizy.com
- en: Product Manager, fizy.com

### experience.r5.years
- tr: 2014 — 2015
- en: 2014 — 2015

### experience.r6.org
- tr: Foreks
- en: Foreks

### experience.r6.role
- tr: Lider Mühendis
- en: Lead Engineer

### experience.r6.years
- tr: 2012 — 2014
- en: 2012 — 2014

### experience.r7.org
- tr: Vodafone
- en: Vodafone

### experience.r7.role
- tr: Kıdemli Mühendis
- en: Senior Engineer

### experience.r7.years
- tr: 2008 — 2012
- en: 2008 — 2012

### experience.r8.org
- tr: Boğaziçi Üniversitesi
- en: Boğaziçi University

### experience.r8.role
- tr: Bilgisayar Mühendisliği, Lisans & Yüksek Lisans
- en: Computer Engineering, BSc & MSc

### experience.r8.years
- tr: 2008 · 2012
- en: 2008 · 2012

---

## 8. Footer / contact (`#contact`)

### footer.label
- tr: İletişim
- en: Contact

### footer.name
- tr: C. Murad Özsert
- en: C. Murad Özsert

### footer.identity
- tr: Kurumsal yapay zekâ · Startup'lar · Eski kurucu & CTO · İstanbul
- en: Enterprise AI · Startups · Ex-founder & CTO · Istanbul

### footer.contact_intro
- tr: Konuşma davetleri, danışmanlık ya da sadece merhaba demek için:
- en: For speaking invitations, advisory, or just to say hello:

### footer.email_user
- tr: hello
- en: hello

### footer.email_domain
- tr: ozsert.com
- en: ozsert.com

### footer.signoff
- tr: 2026'da özenle yapıldı · Bu sürüm bir yapay zekâ modeli tarafından tek seferde inşa edildi.
- en: Made with care in 2026 · This version was built one-shot by an AI model.

### footer.email_label
- tr: E-posta
- en: Email

### footer.linkedin_label
- tr: LinkedIn
- en: LinkedIn

### footer.substack_label
- tr: Bülten
- en: Newsletter

> Contact links (handles shown in mono):
> - LinkedIn: https://www.linkedin.com/in/ozsert — `in/ozsert`
> - Substack: https://thenextsignalnewsletter.substack.com/ — `thenextsignal`
> - Email: built at runtime with `OZ.email()` — never write the full address in HTML.

---

## 9. UI labels (small interface words)

> Short labels every version may need. Use them instead of hard-coding words.
> If a label you need isn't here, prefer a design that does without it.

### ui.contents
- tr: İçindekiler
- en: Contents

### ui.previously
- tr: Öncesi
- en: Previously

### ui.ink
> Label for the accent colour picker.
- tr: Mürekkep
- en: Ink

### ui.fig
> Figure prefix, followed by a number: "fig. 1", "şekil 1".
- tr: şekil
- en: fig.

### ui.vol
> Volume prefix for talks, followed by a number: "Vol.1", "Cilt 1".
- tr: Cilt
- en: Vol.

### ui.case
> Prefix for work cards, followed by a number: "Case 01", "Vaka 01".
- tr: Vaka
- en: Case

### ui.view
- tr: Gör
- en: View

### ui.read
- tr: Oku
- en: Read

### ui.copy
- tr: Kopyala
- en: Copy

### ui.copied
- tr: Kopyalandı
- en: Copied

### ui.back_to_top
- tr: Başa dön
- en: Back to the top

### ui.pen_trail
- tr: Kalem izi
- en: Pen trail

### ui.calm_motion
- tr: Sakin hareket
- en: Calm motion

### ui.on
- tr: açık
- en: on

### ui.off
- tr: kapalı
- en: off

### ui.credit
> Footer credit line (hard requirement §9.12). Replace `{model}` with your display name.
- tr: Ortak spesifikasyondan {model} tarafından yorumlandı.
- en: Interpreted by {model} from the shared spec.
