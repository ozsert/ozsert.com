# Project: AI-Assisted Code Review  (`/projects/ai-code-reviewer/`)

> **Page format (chapters):** hero → facts strip → chapters `c1…c7`. Each chapter has
> `label`, `title`, `body` (and sometimes `body2`), a margin `note`, and usually its **own figure**:
> a caption `fig` plus every word inside the figure as a `fig_*` key. The design brief under each
> chapter says what to draw. Chapters differ on purpose: each figure is its own small explainer
> (step-through, tabs, toggles, scroll-driven drawing).

## Homepage row

### project.ai-code-reviewer.title
- tr: Yapay Zekâ Destekli Kod İnceleme
- en: AI-Assisted Code Review

### project.ai-code-reviewer.oneliner
- tr: Her proje için kendi kod inceleme ajanını üreten bir sistem: kodu altı boyutta puanlar, blocker ve kritik sorunları canlıya çıkmadan yakalar.
- en: A system that generates a dedicated code-review agent for every project: it scores code on six dimensions and catches blocker and critical issues before they reach production.

### project.ai-code-reviewer.kind
- tr: Kurumsal
- en: Enterprise

### project.ai-code-reviewer.status
- tr: Kullanımda
- en: In use

### project.ai-code-reviewer.year
- tr: 2026
- en: 2026

## Hero

### project.ai-code-reviewer.lead
- tr: Genel amaçlı yapay zekâ incelemesi genel geçer sorunlar bulur. Bu sistem her projeye kendi inceleyicisini üretir ve her bulguyu dosya ve satırla kanıtlar.
- en: Generic AI review finds generic issues. This system generates a reviewer for every project and proves each finding with a file and a line.

### project.ai-code-reviewer.note
- tr: kanıtsız bulgu yok.
- en: no evidence, no finding.

### project.ai-code-reviewer.hero_fig
> Caption of the hero figure (see design brief below).
- tr: yedi adımda bir inceleme: üret → öğren → dağıt → kanıtla → doğrula → puanla → raporla
- en: a review in seven steps: generate → learn → fan out → prove → verify → score → report

> **Hero figure (fig. 1, an empty notebook-paper frame that draws itself):** a single horizontal ink line with 7 stations (the hero_fig steps), drawn left
> to right when the page loads. Each station is a small icon in line art. Keep it calm and short
> (≈2.5 s). Reduced motion: drawn instantly.

### project.ai-code-reviewer.stat1
- tr: 800+
- en: 800+

### project.ai-code-reviewer.stat1_label
- tr: blocker ve kritik sorun, canlıya çıkmadan
- en: blocker & critical issues caught before production

### project.ai-code-reviewer.stat2
- tr: Binlerce
- en: 1,000s

### project.ai-code-reviewer.stat2_label
- tr: major sorun, önceliklendirilmiş
- en: of major issues, prioritised

### project.ai-code-reviewer.stat3
- tr: 19
- en: 19

### project.ai-code-reviewer.stat3_label
- tr: teknoloji kontrol listesi + güvenlik
- en: technology checklists, plus security

### project.ai-code-reviewer.stat4
- tr: 1 komut
- en: 1 command

### project.ai-code-reviewer.stat4_label
- tr: bir projeye kendi inceleyicisini üretmek için
- en: to generate a project's own reviewer

## Chapter 1: the problem

### project.ai-code-reviewer.c1.label
- tr: Problem
- en: The problem

### project.ai-code-reviewer.c1.title
- tr: Gürültü çok, gerçek risk kayıp.
- en: Lots of noise, real risk lost.

### project.ai-code-reviewer.c1.body
- tr: Yüzlerce stil yorumu arasında asıl risk (bir yetkilendirme açığı) kayboluyor. Yönetim kodun gerçek sağlığını göremiyor.
- en: Hundreds of style comments bury the real risk, an authorisation gap. Management can't see the true health of the code.

### project.ai-code-reviewer.c1.note
- tr: 300 yorum, 1 gerçek açık. hangisi?
- en: 300 comments, 1 real hole. which one?

### project.ai-code-reviewer.c1.fig
- tr: gürültüden sinyale
- en: from noise to signal

### project.ai-code-reviewer.c1.fig_noise
- tr: stil · isimlendirme · boşluk · import sırası …
- en: style · naming · whitespace · import order …

### project.ai-code-reviewer.c1.fig_signal
- tr: yetkilendirme açığı · auth.ts:142
- en: authorisation gap · auth.ts:142

> **Figure:** a field of ~60 tiny grey comment marks (the noise label repeated, faint) with ONE accent
> mark among them. On scroll, the grey marks fade out, the accent mark is circled by hand and labelled
> `fig_signal`. It echoes the site's "finding the signal" idea.

## Chapter 2: the generator

### project.ai-code-reviewer.c2.label
- tr: Üreteç
- en: The generator

### project.ai-code-reviewer.c2.title
- tr: Bir komut, projeye özel bir inceleyici.
- en: One command, a reviewer made for the project.

### project.ai-code-reviewer.c2.body
- tr: Üreteç repoları tarar, her modülü teknolojileriyle eşleştirir, ekibe onaylatır ve kurulmaya hazır bir eklenti üretir.
- en: The generator scans the repos, matches each module to its stacks, has the team confirm, and produces a ready-to-install plugin.

### project.ai-code-reviewer.c2.note
- tr: bir kez doğru kur, her projede tekrar et.
- en: get it right once, repeat it everywhere.

### project.ai-code-reviewer.c2.fig
- tr: tek komuttan kurulmaya hazır bir eklentiye
- en: from one command to a ready-to-install plugin

### project.ai-code-reviewer.c2.fig_step1
- tr: Repoları tara
- en: Scan the repos

### project.ai-code-reviewer.c2.fig_step2
- tr: Modülleri teknolojilerle eşleştir
- en: Match modules to stacks

### project.ai-code-reviewer.c2.fig_step3
- tr: Ekip onaylar
- en: The team confirms

### project.ai-code-reviewer.c2.fig_step4
- tr: Eklenti üretilir
- en: The plugin is generated

### project.ai-code-reviewer.c2.fig_module
- tr: Modül
- en: Module

### project.ai-code-reviewer.c2.fig_stacks
- tr: Teknolojiler
- en: Stacks

### project.ai-code-reviewer.c2.fig_confirm
- tr: Onayla
- en: Confirm

### project.ai-code-reviewer.c2.fig_parts
> The plugin's parts, `|`-separated, in this order.
- tr: proje bağlamı|teknoloji haritası|orkestratör|inceleyici ajan|puanlama kuralları|rapor şablonu|iş takip skill'i
- en: project context|stack map|orchestrator|reviewer agent|scoring rules|report template|tracker skill

> **Figure: a 4-step stepper** (buttons 1–4 plus "next"). Step 1: three repo
> folders with a scanning line. Step 2: a module × stack table fills in row by row. Example rows (literal
> tech names are fine): `portal → Vue · Quasar · Capacitor · Security`, `api → Node · GraphQL server ·
> Security`, `data → SQL · Security`. Step 3: a hand-drawn tick and a `fig_confirm` stamp. Step 4: the 7
> `fig_parts` fly into a plugin box, which closes with a label. Each step's title comes from `fig_stepN`.

## Chapter 3: context

### project.ai-code-reviewer.c3.label
- tr: Bağlam
- en: Context

### project.ai-code-reviewer.c3.title
- tr: Yargılamadan önce öğren.
- en: Learn before you judge.

### project.ai-code-reviewer.c3.body
- tr: İnceleyici önce projenin bağlamını okur, sonra modülün teknoloji kontrol listelerini yükler. Güvenlik listesi her zaman var.
- en: The reviewer reads the project's context first, then loads the checklists for the module's stacks. Security is always on.

### project.ai-code-reviewer.c3.note
- tr: kalitedeki en büyük sıçrama buradan geldi.
- en: the biggest jump in quality came from here.

### project.ai-code-reviewer.c3.fig
- tr: 19 kontrol listesi, alanlara göre
- en: 19 checklists, by area

### project.ai-code-reviewer.c3.fig_areas
> Area names, `|`-separated, in this order (they match the chip groups below).
- tr: Web|Mobil|Veri ve API|Backend ve mesajlaşma|Platformlar|Her zaman
- en: Web|Mobile|Data & API|Backend & messaging|Platforms|Always

### project.ai-code-reviewer.c3.fig_context
> Items of the context card, `|`-separated.
- tr: mimari ve çağrı zincirleri|yetkilendirme kararları|veri bütünlüğü ve iş kuralları|bilinen sorunlar|önem çıpaları
- en: architecture & call chains|auth decisions|data integrity & business rules|known issues|severity anchors

> **Figure: tabs per area** (`fig_areas`). Each tab shows its checklist chips (literal tech names):
> Web: Angular, React, Vue, Quasar, Tailwind · Mobile: Capacitor, Ionic · Data & API: GraphQL client,
> GraphQL server, Hasura, SQL · Backend & messaging: Node, Spring, Kafka, RabbitMQ, NATS · Platforms:
> SAP Fiori, Dagster · Always: Security. Next to the tabs, a "context card" (a taped index card) lists the
> `fig_context` items with tick marks.

## Chapter 4: the review run

### project.ai-code-reviewer.c4.label
- tr: İnceleme
- en: The review

### project.ai-code-reviewer.c4.title
- tr: Her modüle bir inceleyici, hepsi paralel.
- en: One reviewer per module, all in parallel.

### project.ai-code-reviewer.c4.body
- tr: Her modüle paralel bir inceleyici; büyük modüller yardımcı ajanlara bölünür. Her bulgu bir dosya:satır ister.
- en: One reviewer per module, in parallel; big modules are split across helpers. Every finding must point to a file:line.

### project.ai-code-reviewer.c4.body2
- tr: Sonra her blocker ve kritik bulgunun satırı yeniden okunur. Tutmayan "doğrulanmadı" olarak işaretlenir.
- en: Then every blocker and critical line is read again. What doesn't hold up is marked "unverified".

### project.ai-code-reviewer.c4.note
- tr: satırı tekrar oku. her zaman.
- en: re-read the line. always.

### project.ai-code-reviewer.c4.fig
- tr: bir inceleme turu, kaydırdıkça
- en: one review run, as you scroll

### project.ai-code-reviewer.c4.fig_orchestrator
- tr: orkestratör
- en: orchestrator

### project.ai-code-reviewer.c4.fig_reviewer
- tr: inceleyici
- en: reviewer

### project.ai-code-reviewer.c4.fig_helper
- tr: yardımcı
- en: helper

### project.ai-code-reviewer.c4.fig_verified
- tr: doğrulandı
- en: verified

### project.ai-code-reviewer.c4.fig_unverified
- tr: doğrulanmadı
- en: unverified

> **Figure: scroll-driven fan-out (sticky figure on one side, text scrolling on the other):** a single orchestrator node at the top splits into 9 reviewer lanes (labels:
> portal, admin, shared, identity, files, integration, jobs, messaging, data; literal), and one wide lane
> splits again into 3 helpers. As the user scrolls, each lane drops small dots along 6 horizontal bands
> (D1–D6), each dot with a tiny `file:line` tag. Then blocker and critical dots (accent) get a tick
> (`fig_verified`) or a dashed cross (`fig_unverified`, one only). Reduced motion: show the final state.

## Chapter 5: six dimensions and severity

### project.ai-code-reviewer.c5.label
- tr: Puanlama
- en: Scoring

### project.ai-code-reviewer.c5.title
- tr: Altı boyut, dürüst ağırlıklar, çıpalı önem.
- en: Six dimensions, honest weights, anchored severity.

### project.ai-code-reviewer.c5.body
- tr: Altı ağırlıklı boyut. Blocker için üç koşul birlikte sağlanmalı; tek bir blocker modül puanını 1,5'e sınırlar.
- en: Six weighted dimensions. A blocker needs all three conditions, and a single blocker caps the module at 1.5.

### project.ai-code-reviewer.c5.note
- tr: yoksa her model her şeye "kritik" der.
- en: otherwise every model calls everything critical.

### project.ai-code-reviewer.c5.fig
- tr: boyutlar ve ağırlıkları · blocker testi
- en: dimensions and weights · the blocker test

### project.ai-code-reviewer.c5.fig_d1
- tr: Mimari ve tasarım
- en: Architecture & design

### project.ai-code-reviewer.c5.fig_d2
- tr: Kod kalitesi ve okunabilirlik
- en: Code quality & readability

### project.ai-code-reviewer.c5.fig_d3
- tr: Güvenlik
- en: Security

### project.ai-code-reviewer.c5.fig_d4
- tr: Güvenilirlik ve hata yönetimi
- en: Reliability & error handling

### project.ai-code-reviewer.c5.fig_d5
- tr: Performans
- en: Performance

### project.ai-code-reviewer.c5.fig_d6
- tr: Test ve gözlemlenebilirlik (raporlanır)
- en: Testing & observability (reported)

### project.ai-code-reviewer.c5.fig_q1
- tr: Canlıda mı?
- en: Is it in production?

### project.ai-code-reviewer.c5.fig_q2
- tr: Ön koşulsuz istismar edilebilir mi?
- en: Exploitable without preconditions?

### project.ai-code-reviewer.c5.fig_q3
- tr: Etkisi anında mı?
- en: Is the impact immediate?

### project.ai-code-reviewer.c5.fig_blocker
- tr: Blocker
- en: Blocker

### project.ai-code-reviewer.c5.fig_not_blocker
- tr: Blocker değil, bir alt seviyeye bak
- en: Not a blocker: look one level down

> **Figure (two parts):** **(a)** weight bars drawn as hand-inked strokes: D1 25% · D2 25% · D3 20% ·
> D4 15% · D5 15% · D6 0% (dashed, "reported"). Labels `fig_d1…fig_d6`. **(b) "The blocker test":**
> three toggles (`fig_q1…q3`, yes/no). The result stamp reads `fig_blocker` (accent, rotated) only when
> all three are yes, otherwise `fig_not_blocker`. A tiny score bar beside it shows the module cap (1.5 /
> 2.5 / uncapped).

## Chapter 6: results

### project.ai-code-reviewer.c6.label
- tr: Sonuç
- en: The result

### project.ai-code-reviewer.c6.title
- tr: Görünür risk, ölçülebilir kalite.
- en: Visible risk, measurable quality.

### project.ai-code-reviewer.c6.body
- tr: 800'ü aşkın blocker ve kritik sorun canlıya çıkmadan yakalandı. Bulgular iş takip sistemine akıyor; yönetim her projeyi aynı ölçekle görüyor.
- en: 800+ blocker and critical issues caught before production. Findings flow into the issue tracker, and management sees every project on one scale.

### project.ai-code-reviewer.c6.note
- tr: yönetim için tek sayfa, ekip için tek satır.
- en: one page for management, one line for the team.

### project.ai-code-reviewer.c6.fig
- tr: modül × önem ısı haritası (örnek bir inceleme)
- en: module × severity heat map (one sample review)

### project.ai-code-reviewer.c6.fig_severities
> Column headers, `|`-separated.
- tr: Blocker|Kritik|Major|Minor
- en: Blocker|Critical|Major|Minor

### project.ai-code-reviewer.c6.fig_ticket
- tr: [Kritik][D3] Yetkilendirme kontrolü eksik · auth.ts:142
- en: [Critical][D3] Missing authorisation check · auth.ts:142

> **Figure:** a heat map grid on graph paper, 9 rows (generic module names, literal) × 4 columns (`fig_severities`),
> with ink density by count. Sample review values, blocker/critical/major/minor:
> portal 0/1/15/26 · admin 1/0/14/27 · shared 1/0/3/24 · identity 3/5/24/22 · files 1/1/14/21 ·
> integration 1/2/16/17 · jobs 1/0/5/17 · messaging 0/1/12/25 · data 1/7/11/22.
> Hovering or focusing a cell shows its count. Beside it, a taped ticket card (`fig_ticket`) and a
> giant "800+" tile (stat1) as the all-projects total.

## Chapter 7: what I learned

### project.ai-code-reviewer.c7.label
- tr: Öğrendiklerim
- en: What I learned

### project.ai-code-reviewer.c7.title
- tr: Bağlam, zekâdan önce gelir.
- en: Context beats cleverness.

### project.ai-code-reviewer.c7.body
- tr: Bağlam prompttan önemli. Önem derecesinin çıpası olmalı. Doğrulama şart. Üreteç doğru mantığı her projeye taşır.
- en: Context matters more than the prompt. Severity needs anchors. Verification is a must. The generator carries the right logic to every project.

### project.ai-code-reviewer.c7.note
- tr: tekrar edilebilirlik hedefi: ±0,3 puan.
- en: repeatability target: ±0.3 points.

> No figure. Render the three lessons as a hand-numbered list in the margin style (①②③④), with the
> body as the intro.

## Footer

### project.ai-code-reviewer.stack
- tr: Claude Code, eklenti üreteci, skill'ler, alt ajanlar, 19 teknoloji kontrol listesi, Markdown raporlar, iş takip entegrasyonu
- en: Claude Code, plugin generator, skills, subagents, 19 technology checklists, Markdown reports, issue-tracker integration
