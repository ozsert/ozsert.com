# Project: Player Support Agent  (`/projects/player-support-agent/`)

> **Page format:** like `specs/projects/ai-code-reviewer.md`: hero → facts → chapters `c1…c6`, each with
> its own figure. Keep text short.

## Homepage row

### project.player-support-agent.title
- tr: Oyuncu Destek Ajanı
- en: Player Support Agent

### project.player-support-agent.oneliner
- tr: Mobil uygulama ve oyun stüdyoları için yapay zekâ destek ajanı: her kanalda kullanıcıyı tanır, sorunu anlar, onaylı aksiyonla çözer.
- en: An AI support agent for mobile app and game studios: on every channel it recognises the user, understands the issue, and resolves it with approved actions.

### project.player-support-agent.kind
- tr: Kişisel
- en: Personal

### project.player-support-agent.status
- tr: Canlıda
- en: Live

### project.player-support-agent.year
- tr: 2026
- en: 2026

## Hero

### project.player-support-agent.lead
- tr: Bir şey bozulduğunda stüdyolar geç kalıyor ve cevapsız 1 yıldız herkese açık bir hasara dönüşüyor. Bu ajan kullanıcıyı nerede olursa olsun karşılıyor, anlıyor ve sorunu çözüyor.
- en: When something breaks, studios react too late, and an unanswered 1-star review becomes public damage. This agent meets users wherever they show up, understands them and resolves the issue.

### project.player-support-agent.note
- tr: güvenli olanı çözer, hassas olanı onaya sunar.
- en: resolves the safe cases, asks approval for the sensitive ones.

### project.player-support-agent.hero_fig
- tr: dört kanal, tek ajan
- en: four channels, one agent

> **Hero figure:** four channel icons around the edge (chat bubble, envelope, two store icons drawn
> generically) with lines converging into one agent node in the centre. Drawn on load.

### project.player-support-agent.stat1
- tr: 4
- en: 4

### project.player-support-agent.stat1_label
- tr: kanal
- en: channels

### project.player-support-agent.stat2
- tr: 5
- en: 5

### project.player-support-agent.stat2_label
- tr: adım: tanı, anla, çöz, devret, sinyal ver
- en: steps: identify, understand, resolve, escalate, signal

### project.player-support-agent.stat3
- tr: Saatler
- en: Hours

### project.player-support-agent.stat3_label
- tr: içinde gerçek cevap, günler değil
- en: to a real answer, not days

### project.player-support-agent.stat4
- tr: 1 tık
- en: 1 click

### project.player-support-agent.stat4_label
- tr: hassas aksiyonu onaylamak için
- en: to approve a sensitive action

## Chapter 1: the problem

### project.player-support-agent.c1.label
- tr: Problem
- en: The problem

### project.player-support-agent.c1.title
- tr: Gelir anları, destek anları yaratır.
- en: Revenue moments create support moments.

### project.player-support-agent.c1.body
- tr: Bir satın alma gelmediğinde kullanıcı anında çözüm bekler; ama çoğu stüdyo her kanal için ayrı bir araçla boğuşuyor.
- en: When a purchase doesn't arrive, users expect an instant fix; most studios juggle a separate tool for every channel.

### project.player-support-agent.c1.note
- tr: sessizce silinen uygulamayı kimse fark etmez.
- en: nobody notices the app quietly deleted.

### project.player-support-agent.c1.fig
- tr: bir şey bozulduğunda
- en: when something breaks

### project.player-support-agent.c1.fig_channels
- tr: Uygulama içi sohbet|E-posta|Mağaza yorumu|Uygulama silindi
- en: In-app chat|Email|Store review|App deleted

### project.player-support-agent.c1.fig_delays
- tr: Saatler|Günler|1★ cevapsız|Sessiz kayıp
- en: Hours|Days|1★ unanswered|Silent churn

> **Figure:** a four-step timeline, each step a channel (`fig_channels`) with its delay (`fig_delays`) written
> in red; the last step is a faded, crossed-out phone.

## Chapter 2: five steps

### project.player-support-agent.c2.label
- tr: Nasıl çalışıyor
- en: How it works

### project.player-support-agent.c2.title
- tr: Her mesajda beş adım.
- en: Five steps for every message.

### project.player-support-agent.c2.body
- tr: Kullanıcıyı tanır, niyeti anlar, güvenli olanı çözer, gerekeni bağlamıyla devreder, tekrar edeni işaretler.
- en: It recognises the user, understands the intent, resolves what's safe, hands over the rest with context, and flags what repeats.

### project.player-support-agent.c2.note
- tr: bir mesaj seç, yolculuğunu izle.
- en: pick a message, follow its journey.

### project.player-support-agent.c2.fig
- tr: bir mesajın yolculuğu
- en: a message's journey

### project.player-support-agent.c2.fig_steps
- tr: Tanı|Anla|Çöz|Devret|Sinyal ver
- en: Identify|Understand|Resolve|Escalate|Signal

### project.player-support-agent.c2.fig_messages
- tr: Başlangıç paketini aldım ama gelmedi|Güncellemeden sonra giriş yapamıyorum|Etkinlik ödülü hiç gelmedi|v2.3'ten beri çöküyor|Bir yıldır her gün oynuyorum
- en: Paid for the starter pack, didn't get it|Can't log in after the update|The event reward never arrived|Crashes since v2.3|Playing every day for a year

> **Figure: interactive.** Five message cards (`fig_messages`); pick one and it travels through five stations
> (`fig_steps`): player, version and device chips → category and urgency → a reply or an action
> ("receipt check → restore delivery") → an amber Slack approval card for sensitive actions → repeated
> crashes pile up into "release bug in v2.3 → product team alerted".

## Chapter 3: actions

### project.player-support-agent.c3.label
- tr: Aksiyonlar
- en: Actions

### project.player-support-agent.c3.title
- tr: Uygulama ve oyun stüdyoları için hazır aksiyonlar.
- en: Ready-made actions for app and game studios.

### project.player-support-agent.c3.body
- tr: Ajan sadece cevap vermez: bağlamı kontrol eder, onaylı aksiyonu alır, döngüyü kapatır.
- en: The agent doesn't just answer: it checks context, takes the approved action, and closes the loop.

### project.player-support-agent.c3.note
- tr: hassas her şey insan onayından geçer.
- en: anything sensitive goes through a human.

### project.player-support-agent.c3.fig
- tr: iki raf: uygulamalar ve oyunlar
- en: two shelves: apps and games

### project.player-support-agent.c3.fig_app_h
- tr: Uygulama stüdyoları
- en: App studios

### project.player-support-agent.c3.fig_app
- tr: Abonelik → kontrol et, geri yükle|Giriş → kurtarma rehberliği|Sürüm hataları → kümele, ürün ekibini uyar|Yorumlar → herkese açık yanıt
- en: Subscription → check and restore|Login → guided recovery|Release bugs → cluster, alert the product team|Reviews → public reply

### project.player-support-agent.c3.fig_game_h
- tr: Oyun stüdyoları
- en: Game studios

### project.player-support-agent.c3.fig_game
- tr: Satın alma → makbuz kontrolü, teslimatı geri yükle|Ödül → ilerleme kontrolü, onayla ver|Etkinlik / sezon kartı → uygunluk kontrolü|Hesap → geçmişe bak, kurtar ya da devret
- en: Purchase → receipt check, restore delivery|Reward → progress check, grant with approval|Event / pass → eligibility check|Account → check history, recover or escalate

> **Figure:** two columns of taped action cards (`fig_app`, `fig_game`); each card flips to show a mini flow.

## Chapter 4: human in the loop

### project.player-support-agent.c4.label
- tr: Onay
- en: Approval

### project.player-support-agent.c4.title
- tr: Ajan yazar, insan karar verir.
- en: The agent drafts, a human decides.

### project.player-support-agent.c4.body
- tr: Hassas aksiyonlar ekibin Slack'ine düşer: onayla, reddet ya da yeniden yazdır.
- en: Sensitive actions land in the team's Slack: approve, reject or redraft.

### project.player-support-agent.c4.note
- tr: güven kademeli kazanılır.
- en: trust is earned step by step.

### project.player-support-agent.c4.fig
- tr: bir onay kartı
- en: an approval card

### project.player-support-agent.c4.fig_card
- tr: Satın alma sorunu · 2★ · "Başlangıç paketini aldım ama gelmedi"
- en: Purchase issue · 2★ · "Paid for the starter pack, didn't get it"

### project.player-support-agent.c4.fig_buttons
- tr: Onayla|Reddet|Yeniden yazdır
- en: Approve|Reject|Redraft

### project.player-support-agent.c4.fig_rule
- tr: kural: satın alma sorunu → onay gerekir
- en: rule: purchase issue → approval required

> **Figure:** a Slack-like card (generic, not the real Slack UI) with `fig_card`, a drafted reply, and three
> working buttons (`fig_buttons`) that change the card's state. `fig_rule` as a mono footnote.

## Chapter 5: channels

### project.player-support-agent.c5.label
- tr: Kanallar
- en: Channels

### project.player-support-agent.c5.title
- tr: Bugün mobil, yarın her temas noktası.
- en: Mobile today, every touchpoint next.

### project.player-support-agent.c5.body
- tr: Uygulama içi sohbet, e-posta ve iki mağaza ile başladı; sırada PC, konsol ve topluluk kanalları var.
- en: It started with in-app chat, email and both stores; PC, console and community channels are next.

### project.player-support-agent.c5.note
- tr: tek ajan, her kanal.
- en: one agent, every channel.

### project.player-support-agent.c5.fig
- tr: kanallar
- en: channels

### project.player-support-agent.c5.fig_now
- tr: Uygulama içi sohbet|Destek e-postası|App Store yorumları|Google Play yorumları
- en: In-app chat|Support email|App Store reviews|Google Play reviews

### project.player-support-agent.c5.fig_next
- tr: Steam|Discord|Yardım masası entegrasyonları|Konsol ve PC
- en: Steam|Discord|Helpdesk connectors|Console & PC

> **Figure:** a road with two segments, solid (`fig_now`) and dotted (`fig_next`).

## Chapter 6: what I learned

### project.player-support-agent.c6.label
- tr: Öğrendiklerim
- en: What I learned

### project.player-support-agent.c6.title
- tr: Her şeye model gerekmez.
- en: Not everything needs a model.

### project.player-support-agent.c6.body
- tr: Yönlendirme kurallarla: açıklanabilir ve ücretsiz. Sınıflandırmada küçük, yazımda güçlü model. Değerlendirme seti ilk günden.
- en: Routing by rules: explainable and free. A small model to classify, a strong one to write. An evaluation set from day one.

### project.player-support-agent.c6.note
- tr: önce onay, sonra otomasyon.
- en: approval first, automation after.

> No figure: a short hand-numbered list.

## Footer

### project.player-support-agent.stack
- tr: TypeScript, Firebase Functions, Firestore, görev kuyruğu, Vercel AI SDK, Claude ve OpenAI modelleri, Slack, App Store Connect ve Google Play API'leri, Terraform
- en: TypeScript, Firebase Functions, Firestore, task queue, Vercel AI SDK, Claude & OpenAI models, Slack, App Store Connect & Google Play APIs, Terraform
