# Project: Enterprise AI Gateway  (`/projects/ai-gateway/`)

> **Page format:** like `specs/projects/ai-code-reviewer.md`: hero → facts → chapters `c1…c6`, each with
> its own figure. Keep text short.

## Homepage row

### project.ai-gateway.title
- tr: Kurumsal Yapay Zekâ Geçidi
- en: Enterprise AI Gateway

### project.ai-gateway.oneliner
- tr: Şirketteki her yapay zekâ modeli ve aracı için tek, yönetilen bir giriş kapısı: tek oturum açma, kişi başı bütçe, denetim kayıtları.
- en: One governed front door for every AI model and tool in the company: single sign-on, per-person budgets, audit logs.

### project.ai-gateway.kind
- tr: Kurumsal
- en: Enterprise

### project.ai-gateway.status
- tr: Mimari ve pilot
- en: Architecture & pilot

### project.ai-gateway.year
- tr: 2026
- en: 2026

## Hero

### project.ai-gateway.lead
- tr: Yüzlerce kişi işte Claude'u, GPT'yi ve kendi ajanlarını kullanmak istiyor. API anahtarı dağıtmak ne ölçeklenir ne güvenlidir. Aradaki katmanı tasarladık: tek bir kontrol noktası.
- en: Hundreds of people want Claude, GPT and their own agents at work. Handing out API keys neither scales nor stays safe. We designed the layer in between: one control point.

### project.ai-gateway.note
- tr: kimse bir modele doğrudan ulaşmaz.
- en: no one reaches a model directly.

### project.ai-gateway.hero_fig
- tr: birçok kapı yerine tek bir kapı
- en: one front door instead of many

> **Hero figure:** many small keys scattered on the left; a single hand-drawn door in the middle; models and
> tools on the right. On load, the keys fade and lines converge through the door.

### project.ai-gateway.stat1
- tr: 1
- en: 1

### project.ai-gateway.stat1_label
- tr: her model ve araç için kontrol noktası
- en: control point for every model and tool

### project.ai-gateway.stat2
- tr: 3
- en: 3

### project.ai-gateway.stat2_label
- tr: kullanıcı seviyesi
- en: user tiers

### project.ai-gateway.stat3
- tr: 5
- en: 5

### project.ai-gateway.stat3_label
- tr: katmanlı kota kontrolü
- en: layers of quota control

### project.ai-gateway.stat4
- tr: 50 → 500 → hepsi
- en: 50 → 500 → all

### project.ai-gateway.stat4_label
- tr: kullanıcıya dalgalar hâlinde açılış
- en: users, rolled out in waves

## Chapter 1: the problem

### project.ai-gateway.c1.label
- tr: Problem
- en: The problem

### project.ai-gateway.c1.title
- tr: Kişisel anahtarlar, görünmeyen maliyet.
- en: Personal keys, invisible cost.

### project.ai-gateway.c1.body
- tr: Elle dağıtılan anahtarlar, her dizüstünde ayrı ayar, merkezi görünüm yok.
- en: Keys handed out by hand, settings on every laptop, no central view.

### project.ai-gateway.c1.note
- tr: kim, neyi, ne kadara kullanıyor?
- en: who uses what, at what cost?

### project.ai-gateway.c1.fig
- tr: eski durum
- en: how it was

### project.ai-gateway.c1.fig_issues
- tr: Tek oturum açma yok|Anahtarlar elle dağıtılıyor|Bütçe ve limit yok|Kayıt ve görünürlük yok|Araç erişimi yönetilmiyor
- en: No single sign-on|Keys handed out by hand|No budgets or limits|No logs or visibility|Tool access unmanaged

> **Figure:** five laptop sketches each with a dangling key; each issue (`fig_issues`) as a red hand-written
> margin note with an arrow.

## Chapter 2: follow a request

### project.ai-gateway.c2.label
- tr: Mimari
- en: Architecture

### project.ai-gateway.c2.title
- tr: Bir isteğin yolculuğu.
- en: The journey of a request.

### project.ai-gateway.c2.body
- tr: Kimlik doğrulanır, geçit isteği onaylı bir modele yönlendirir, bütçeyi uygular ve kaydeder.
- en: Identity is verified; the gateway routes the request to an approved model, enforces the budget and logs it.

### project.ai-gateway.c2.note
- tr: her çağrı tek kapıdan girer.
- en: every call enters through one door.

### project.ai-gateway.c2.fig
- tr: kullanıcı → kimlik → geçit → model ya da araç
- en: consumer → identity → gateway → model or tool

### project.ai-gateway.c2.fig_consumers
- tr: Masaüstü uygulama|Kodlama ajanı|Şirket ajanları
- en: Desktop app|Coding agent|Company agents

### project.ai-gateway.c2.fig_identity
- tr: Şirket dizini · SSO · MFA
- en: Company directory · SSO · MFA

### project.ai-gateway.c2.fig_gateway
- tr: Yapay zekâ geçidi
- en: AI gateway

### project.ai-gateway.c2.fig_gateway_items
- tr: Yönlendirme ve yedekleme|Kişi başı bütçe|Hız sınırı|Analitik
- en: Routing & failover|Per-user budget|Rate limit|Analytics

### project.ai-gateway.c2.fig_catalog
- tr: Araç kataloğu
- en: Tool catalogue

### project.ai-gateway.c2.fig_logs
- tr: Kayıtlar → güvenlik ekibi
- en: Logs → security team

### project.ai-gateway.c2.fig_models
- tr: Modeller
- en: Models

### project.ai-gateway.c2.fig_tools
- tr: Araçlar
- en: Tools

> **Figure: scroll-driven request path.** Columns: consumers (`fig_consumers`) → identity band on top
> (`fig_identity`) → gateway box listing `fig_gateway_items` and a tool catalogue → models (Claude, GPT, open
> models; literal) and tools (public and internal). A dot travels the path with numbered badges at each check;
> a dashed line from the gateway to `fig_logs`.

## Chapter 3: tiers

### project.ai-gateway.c3.label
- tr: Seviyeler
- en: Tiers

### project.ai-gateway.c3.title
- tr: Herkese ihtiyacı kadar.
- en: Everyone gets what they need.

### project.ai-gateway.c3.body
- tr: Rol şirket dizininden gelir; her seviye farklı modelleri, araçları ve bütçeyi görür.
- en: The role comes from the company directory; each tier sees different models, tools and budget.

### project.ai-gateway.c3.note
- tr: seviyeyi değiştir, kapıları gör.
- en: switch the tier, watch the doors.

### project.ai-gateway.c3.fig
- tr: üç seviye
- en: three tiers

### project.ai-gateway.c3.fig_tiers
- tr: Standart|Güçlü|Yazılımcı
- en: Standard|Power|Developer

### project.ai-gateway.c3.fig_tier_descs
- tr: Sohbet ve onaylı araçlar|Daha büyük bütçe, daha fazla araç|Kodlama ajanları ve en geniş model listesi
- en: Chat and approved tools|Bigger budget, more tools|Coding agents and the widest model list

> **Figure:** a three-position toggle (`fig_tiers`). Switching it dims the models and tools that tier can't
> use in a small grid, and shows its description (`fig_tier_descs`).

## Chapter 4: quotas in layers

### project.ai-gateway.c4.label
- tr: Kotalar
- en: Quotas

### project.ai-gateway.c4.title
- tr: Kotanın katmanları olmalı.
- en: Quotas need layers.

### project.ai-gateway.c4.body
- tr: Her katman farklı bir hatayı yakalar; uyarılar %75 ve %90'da gelir.
- en: Each layer catches a different failure; alerts fire at 75% and 90%.

### project.ai-gateway.c4.note
- tr: tek limit yetmez.
- en: one limit isn't enough.

### project.ai-gateway.c4.fig
- tr: beş katmanlı kota
- en: five layers of quota

### project.ai-gateway.c4.fig_layers
- tr: Anlık patlama sınırı|Aylık kişisel bütçe|Departman havuzu|İstemci yumuşak sınırı|Kapasite tavanı
- en: Per-minute burst|Monthly personal budget|Department pool|Client soft limit|Capacity ceiling

> **Figure:** five stacked bars, each with a fill gauge; marks at 75% and 90%. Hover/focus a layer to
> highlight it.

## Chapter 5: four iterations

### project.ai-gateway.c5.label
- tr: Evrim
- en: Evolution

### project.ai-gateway.c5.title
- tr: Dört tasarım, tek mimari.
- en: Four designs, one architecture.

### project.ai-gateway.c5.body
- tr: Doğru cevaba dört iterasyonda ulaştık: sonuncusu tek kontrol noktası.
- en: It took four iterations to get it right; the last one is the single control point.

### project.ai-gateway.c5.note
- tr: tek kontrol noktası, tek hata noktası da olabilir.
- en: a single control point can be a single point of failure.

### project.ai-gateway.c5.fig
- tr: mimarinin dört adımı
- en: four steps of the architecture

### project.ai-gateway.c5.fig_iters
- tr: Yalnızca bulut API yöneticisi|Kendi sunucumuzda geçit|API yöneticisinin önünde uç katman|Tek kontrol noktası olarak uçta yapay zekâ geçidi
- en: Cloud API manager only|Self-hosted gateway|Edge in front of the API manager|Edge AI gateway as the single control point

> **Figure:** four small sketches in a row, crossed out one by one, the last circled.

## Chapter 6: the result

### project.ai-gateway.c6.label
- tr: Sonuç
- en: The result

### project.ai-gateway.c6.title
- tr: Herkese yapay zekâ, kontrol elden çıkmadan.
- en: AI for everyone, without losing control.

### project.ai-gateway.c6.body
- tr: Çalışanlar şirket hesabıyla girer; güvenlik her çağrıyı görür, finans maliyeti izler, BT yeni modeli istemcilere dokunmadan ekler.
- en: Employees sign in with their company account; security sees every call, finance tracks cost, IT adds new models without touching clients.

### project.ai-gateway.c6.note
- tr: önce meta veri, içerik ancak hukuki onayla.
- en: metadata first; content only after legal review.

### project.ai-gateway.c6.fig
- tr: dalgalar hâlinde açılış
- en: rollout in waves

### project.ai-gateway.c6.fig_waves
- tr: Pilot · 20–50 kişi|Genişletilmiş pilot · 200–500 kişi|Tüm şirket
- en: Pilot · 20–50 people|Extended pilot · 200–500 people|Company-wide

> **Figure:** three widening ripples, each labelled from `fig_waves`.

## Footer

### project.ai-gateway.stack
- tr: Cloudflare AI Gateway ve Access, Microsoft Entra ID, Azure AI Foundry, Azure API Management, MCP, merkezi ayarlar, Terraform, Bicep, SIEM
- en: Cloudflare AI Gateway & Access, Microsoft Entra ID, Azure AI Foundry, Azure API Management, MCP, managed settings, Terraform, Bicep, SIEM
