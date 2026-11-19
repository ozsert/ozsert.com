# Project: Skills Marketplace for Every Team  (`/projects/skill-marketplace/`)

> **Page format:** like `specs/projects/ai-code-reviewer.md`: hero → facts → chapters `c1…c6`, each with
> its own figure. Keep text short; the figures carry the story.

## Homepage row

### project.skill-marketplace.title
- tr: Her Ekip İçin Skill Pazaryeri
- en: Skills Marketplace for Every Team

### project.skill-marketplace.oneliner
- tr: Her departmanın kendi işi için yapılmış yapay zekâ eklentilerini tek komutla kurduğu, şirket içi bir pazaryeri.
- en: One internal marketplace where every department installs AI plugins and skills built for its own work, in a single command.

### project.skill-marketplace.kind
- tr: Kurumsal
- en: Enterprise

### project.skill-marketplace.status
- tr: Kullanımda
- en: In use

### project.skill-marketplace.year
- tr: 2026
- en: 2026

## Hero

### project.skill-marketplace.lead
- tr: Her ekip promptlarını sıfırdan yazınca yapay zekâ benimsenmesi tıkanır. Şirketin bilgi birikimini kurulabilir eklentilere çevirdik: departmana bir eklenti, tekrarlanan işe bir skill.
- en: AI adoption stalls when every team writes prompts from scratch. We turned the company's know-how into installable plugins: a plugin per department, a skill per repeatable task.

### project.skill-marketplace.note
- tr: bir kez kur, her gün kullan.
- en: install once, use every day.

### project.skill-marketplace.hero_fig
- tr: bir pazaryeri, altı departman, 80'i aşkın skill
- en: one marketplace, six departments, 80+ skills

> **Hero figure:** a hand-drawn shelf (like a workshop wall) with six labelled drawers (departments) and
> small skill cards sliding into them on load. Calm, ≈2.5 s; static under reduced motion.

### project.skill-marketplace.stat1
- tr: 80+
- en: 80+

### project.skill-marketplace.stat1_label
- tr: skill, gerçek günlük işler için
- en: skills for real daily work

### project.skill-marketplace.stat2
- tr: 6
- en: 6

### project.skill-marketplace.stat2_label
- tr: departman
- en: departments

### project.skill-marketplace.stat3
- tr: 3
- en: 3

### project.skill-marketplace.stat3_label
- tr: katman: şirket, proje, istisna
- en: layers: company, project, exception

### project.skill-marketplace.stat4
- tr: 1 komut
- en: 1 command

### project.skill-marketplace.stat4_label
- tr: kurmak ve güncellemek için
- en: to install and to update

## Chapter 1: the problem

### project.skill-marketplace.c1.label
- tr: Problem
- en: The problem

### project.skill-marketplace.c1.title
- tr: Herkes yapay zekâ kullanıyor, herkes başka türlü.
- en: Everyone used AI, everyone differently.

### project.skill-marketplace.c1.body
- tr: Kopyalanmış promptlar, tutarsız kalite ve işe yarayanı paylaşmanın bir yolu yok.
- en: Copied prompts, uneven quality, and no way to share what worked.

### project.skill-marketplace.c1.note
- tr: altı ekip, altı farklı prompt defteri.
- en: six teams, six private prompt notebooks.

### project.skill-marketplace.c1.fig
- tr: dağınık promptlardan ortak bir rafa
- en: from scattered prompts to one shared shelf

### project.skill-marketplace.c1.fig_scrap
- tr: kopyalanmış prompt
- en: copied prompt

> **Figure:** six small desk sketches (one per department, labels from `c3.fig_depts`), each with messy
> prompt scraps (`fig_scrap`). On scroll, the scraps fly into one neat shelf in the centre.

## Chapter 2: three layers

### project.skill-marketplace.c2.label
- tr: Yapı
- en: The structure

### project.skill-marketplace.c2.title
- tr: Üç katman: şirket, proje, istisna.
- en: Three layers: company, project, exception.

### project.skill-marketplace.c2.body
- tr: Varsayılanlar departman eklentisinde, proje bağlamı CLAUDE.md'de, istisnalar proje eklentisinde.
- en: Defaults live in the department plugin, project context in CLAUDE.md, exceptions in a project plugin.

### project.skill-marketplace.c2.note
- tr: her şey skill olmak zorunda değil.
- en: not everything should be a skill.

### project.skill-marketplace.c2.fig
- tr: üç katman, üst üste
- en: three layers, stacked

### project.skill-marketplace.c2.fig_l1
- tr: Departman eklentisi
- en: Department plugin

### project.skill-marketplace.c2.fig_l1_desc
- tr: Şirketin varsayılanları; makineye bir kez kurulur.
- en: The company's defaults; installed once per machine.

### project.skill-marketplace.c2.fig_l2
- tr: Proje bağlamı (CLAUDE.md)
- en: Project context (CLAUDE.md)

### project.skill-marketplace.c2.fig_l2_desc
- tr: Her repoda: mimari, kurallar, terimler.
- en: In every repo: architecture, rules, vocabulary.

### project.skill-marketplace.c2.fig_l3
- tr: Proje eklentisi
- en: Project plugin

### project.skill-marketplace.c2.fig_l3_desc
- tr: Yalnızca varsayılanlar yanıltacaksa.
- en: Only when the defaults would mislead.

> **Figure:** three stacked paper sheets, slightly offset. Click, tap or focus a sheet to lift it and show its
> description (`fig_lN_desc`).

## Chapter 3: the marketplace

### project.skill-marketplace.c3.label
- tr: Pazaryeri
- en: The marketplace

### project.skill-marketplace.c3.title
- tr: Her departmana kendi rafı.
- en: A shelf for every department.

### project.skill-marketplace.c3.body
- tr: Yazılımdan veritabanına, güvenlikten ürüne: her departmanın gerçek işi için skill'ler.
- en: From engineering to databases, security to product: skills for each department's real work.

### project.skill-marketplace.c3.note
- tr: tıkla, rafı aç.
- en: click a shelf to open it.

### project.skill-marketplace.c3.fig
- tr: pazaryeri → departmanlar → eklentiler → skill'ler
- en: marketplace → departments → plugins → skills

### project.skill-marketplace.c3.fig_depts
- tr: Yazılım|DevOps|Veritabanı|Güvenlik|Veri ve analitik|Ürün
- en: Engineering|DevOps|Databases|Security|Data & analytics|Product

### project.skill-marketplace.c3.fig_company
- tr: Şirket geneli
- en: Company-wide

### project.skill-marketplace.c3.fig_project
- tr: Proje eklentileri
- en: Project plugins

### project.skill-marketplace.c3.fig_skills
- tr: skill
- en: skills

> **Figure: an interactive tree.** A root node "marketplace", then branches for the 6 departments plus
> company-wide and project plugins. Clicking a branch opens its plugins with skill counts (tech names literal):
> Engineering: Java 18 · React 15 · React Native 12 · Vue 1 · DevOps: 18 (Terraform, Kubernetes, MongoDB,
> review-plugin generator) · Databases: 5 (Oracle, PostgreSQL, SQL Server) · Security: 1 (compromise scan
> for every PC) · Data & analytics: 6 (requirements → Power BI report) · Product: 3 (PM, designer,
> analyst) · Company-wide: usage plugin (tokens & cost per team) · Project plugins: 3.

## Chapter 4: one command

### project.skill-marketplace.c4.label
- tr: Kurulum
- en: Install

### project.skill-marketplace.c4.title
- tr: Tek komutla kur, tek komutla güncelle.
- en: One command to install, one to update.

### project.skill-marketplace.c4.body
- tr: Ekip pazaryerini bir kez ekler, kendi eklentisini kurar ve hemen kullanır.
- en: A team adds the marketplace once, installs its plugin, and starts using it.

### project.skill-marketplace.c4.note
- tr: güncelleme de aynı yoldan gelir.
- en: updates arrive the same way.

### project.skill-marketplace.c4.fig
- tr: kurulum akışı
- en: the install flow

### project.skill-marketplace.c4.fig_steps
- tr: Pazaryerini ekle|Göz at|Kur|Kullan|Güncelle
- en: Add the marketplace|Browse|Install|Use|Update

> **Figure: a 5-step stepper** (01–05 plus "next"). Each step shows a small terminal card with a generic,
> literal command: `plugin marketplace add <company-marketplace>` · `/plugins` · `plugin install engineering-java`
> · `/engineering-java:code-review` · `plugin update engineering-java`.

## Chapter 5: beyond developers

### project.skill-marketplace.c5.label
- tr: Herkes için
- en: For everyone

### project.skill-marketplace.c5.title
- tr: Sadece yazılımcılar için değil.
- en: Not just for developers.

### project.skill-marketplace.c5.body
- tr: Analistler, ürün ekipleri ve her çalışan da yapay zekâyı günlük işinde güvenle kullanıyor.
- en: Analysts, product teams and every employee use AI safely in their daily work.

### project.skill-marketplace.c5.note
- tr: insan onayı her aşamada.
- en: human approval at every stage.

### project.skill-marketplace.c5.fig
- tr: üç örnek akış
- en: three example flows

### project.skill-marketplace.c5.fig_bi
- tr: Gereksinim dokümanı → analiz → model → rapor, her adımda onay
- en: Requirements doc → analysis → model → report, approved at each step

### project.skill-marketplace.c5.fig_security
- tr: Her bilgisayar için salt okunur güvenlik taraması ve PDF rapor
- en: A read-only security scan for every PC, with a PDF report

### project.skill-marketplace.c5.fig_product
- tr: Ürün yöneticisi, tasarımcı ve analist skill'leri
- en: Product manager, designer and analyst skills

> **Figure:** three taped index cards side by side; the BI card shows a mini pipeline with tick-boxes
> between stages.

## Chapter 6: what changed

### project.skill-marketplace.c6.label
- tr: Sonuç
- en: The result

### project.skill-marketplace.c6.title
- tr: Şirketin bilgi birikimi, herkesin elinde.
- en: The company's know-how, in everyone's hands.

### project.skill-marketplace.c6.body
- tr: Bir ekibin bulduğu iyi yöntem tek bir güncellemeyle herkese ulaşıyor.
- en: A better method found by one team reaches everyone with a single update.

### project.skill-marketplace.c6.note
- tr: benimseme bir zorunluluk değil, bir üründür.
- en: adoption is a product, not a mandate.

### project.skill-marketplace.c6.fig
- tr: ne kazandık
- en: what we gained

### project.skill-marketplace.c6.fig_values
- tr: Her ekip aynı kaliteli varsayılanlarla başlıyor|Yeni gelenler ilk günden şirketin yöntemiyle çalışıyor|İyi yöntemler tek güncellemeyle yayılıyor|Gizlilik baştan: ölçüm içeriği değil, token'ları sayar
- en: Every team starts from the same good defaults|Newcomers work the company's way from day one|Good methods spread with one update|Privacy by design: telemetry counts tokens, not content

> **Figure:** four value tiles with hand-drawn icons, appearing one by one.

## Footer

### project.skill-marketplace.stack
- tr: Claude Code eklenti pazaryeri, skill'ler, ajanlar, kancalar, MCP, Git, semver, Cloudflare Workers
- en: Claude Code plugin marketplace, skills, agents, hooks, MCP, Git, semver, Cloudflare Workers
