# Project: Sam AI · Habit Coach  (`/projects/sam-ai/`)

> **Page format:** like `specs/projects/ai-code-reviewer.md`: hero → facts → chapters `c1…c5`, each with
> its own figure. Keep text short; this page can be the most playful one.

## Homepage row

### project.sam-ai.title
- tr: Sam AI · Alışkanlık Koçu
- en: Sam AI · Habit Coach

### project.sam-ai.oneliner
- tr: Konuşarak kullanılan bir alışkanlık koçu: ne yaptığını söyle, kaydetsin, takip etsin, yüreklendirsin. App Store'da.
- en: A habit coach you talk to: tell it what you did, and it logs, tracks and cheers you on. On the App Store.

### project.sam-ai.kind
- tr: Kişisel
- en: Personal

### project.sam-ai.status
- tr: App Store'da yayında
- en: Live on the App Store

### project.sam-ai.year
- tr: 2025–2026
- en: 2025–2026

### project.sam-ai.link
> Not translated. The page shows it as a button with `link_label`.
- tr: https://apps.apple.com/tr/app/g%C3%BCnl%C3%BCk-rutin-takibi-sam-ai/id6756017102
- en: https://apps.apple.com/app/id6756017102

### project.sam-ai.link_label
- tr: App Store'da gör
- en: View on the App Store

## Hero

### project.sam-ai.lead
- tr: Alışkanlık uygulamaları, kayıt tutmak ev ödevine dönüşünce kaybeder. Sam bunu bir sohbete çeviriyor: "Beş bardak su içtim" de, gerisini o halletsin.
- en: Habit apps fail when logging feels like homework. Sam turns it into a conversation: say "I drank five glasses of water", and it handles the rest.

### project.sam-ai.note
- tr: tek başıma tasarladım, kodladım, yayınladım.
- en: designed, built and shipped solo.

### project.sam-ai.hero_fig
- tr: bir cümle, bir dolan kare, bir seri
- en: one sentence, one filled square, one streak

> **Hero figure:** a hand-drawn phone. A chat bubble types itself, then a cell in a small monthly grid fills
> with ink and a 🔥 counter ticks up. Loops gently; static under reduced motion.

### project.sam-ai.stat1
- tr: 15
- en: 15

### project.sam-ai.stat1_label
- tr: Sam'in sohbetten yapabildiği eylem
- en: actions Sam can take from a chat

### project.sam-ai.stat2
- tr: 6
- en: 6

### project.sam-ai.stat2_label
- tr: dil
- en: languages

### project.sam-ai.stat3
- tr: 4
- en: 4

### project.sam-ai.stat3_label
- tr: alışkanlık yasası, uygulamanın her yerinde
- en: laws of habit formation, built in

### project.sam-ai.stat4
- tr: −%60
- en: −60%

### project.sam-ai.stat4_label
- tr: optimizasyon sonrası prompt token'ı
- en: prompt tokens after optimisation

## Chapter 1: the problem

### project.sam-ai.c1.label
- tr: Problem
- en: The problem

### project.sam-ai.c1.title
- tr: Bir liste daha değil, bir koç.
- en: Not another list: a coach.

### project.sam-ai.c1.body
- tr: Kontrol listeleri bir hafta işe yarar, sonra kayıt angaryaya döner ve uygulama silinir.
- en: Checklists work for a week; then logging becomes a chore and the app gets deleted.

### project.sam-ai.c1.note
- tr: 8. gün: unutuldu.
- en: day 8: forgotten.

### project.sam-ai.c1.fig
- tr: bir kontrol listesinin ömrü
- en: the life of a checklist

### project.sam-ai.c1.fig_deleted
- tr: silindi
- en: deleted

> **Figure:** a 14-day checklist where ticks get fainter each day and stop after day 7; on day 8 the whole
> card is crossed out with a stamp `fig_deleted`.

## Chapter 2: four laws

### project.sam-ai.c2.label
- tr: Yaklaşım
- en: The approach

### project.sam-ai.c2.title
- tr: Belirgin, çekici, kolay, tatmin edici.
- en: Obvious, attractive, easy, satisfying.

### project.sam-ai.c2.body
- tr: Atomik Alışkanlıklar'ın popülerleştirdiği dört yasa uygulamanın her yerinde.
- en: The four laws of habit formation, popularised by Atomic Habits, run through the whole app.

### project.sam-ai.c2.note
- tr: suçluluk yok, sadece yeni başlangıç.
- en: no guilt, just a fresh start.

### project.sam-ai.c2.fig
- tr: Sam'in işlettiği alışkanlık döngüsü
- en: the habit loop, as Sam runs it

### project.sam-ai.c2.fig_laws
- tr: Belirgin yap|Çekici yap|Kolay yap|Tatmin edici yap
- en: Make it obvious|Make it attractive|Make it easy|Make it satisfying

### project.sam-ai.c2.fig_law_descs
- tr: Yapay zekâ, gerçek serinden hatırlatma yazar|Aylık tablo doldurması keyifli|Kayıt tek bir cümle|Seriler kutlanır, aksaklık yeni başlangıçtır
- en: The AI writes reminders from your real streak|The monthly grid is a pleasure to fill|Logging is one sentence|Streaks are celebrated; a setback is a fresh start

> **Figure: an interactive loop.** Four segments around a hand-drawn circle (`fig_laws`); tap or step through
> them; each shows a tiny app sketch and its description (`fig_law_descs`).

## Chapter 3: talk, don't tap

### project.sam-ai.c3.label
- tr: Nasıl çalışıyor
- en: How it works

### project.sam-ai.c3.title
- tr: Bir cümleden güncellenmiş bir tabloya.
- en: From one sentence to an updated grid.

### project.sam-ai.c3.body
- tr: Model 15 araçtan birini çağırır: alışkanlık oluşturur, ilerleme kaydeder, analiz gösterir, hatırlatma kurar.
- en: The model calls one of 15 tools: create habits, log progress, show analytics, set reminders.

### project.sam-ai.c3.note
- tr: serileri model hesaplamaz, araç hesaplar.
- en: the tool counts streaks, never the model.

### project.sam-ai.c3.fig
- tr: canlı bir örnek
- en: a live example

### project.sam-ai.c3.fig_msg
- tr: Bugün 5 bardak su içtim
- en: I drank 5 glasses of water today

### project.sam-ai.c3.fig_tool
- tr: ilerleme kaydediliyor…
- en: logging progress…

### project.sam-ai.c3.fig_reply
- tr: Harika! 3 gündür üst üste 🔥
- en: Nice! 3 days in a row 🔥

### project.sam-ai.c3.fig_actions
- tr: Alışkanlık oluştur|İlerleme kaydet|Analiz göster|Hatırlatma kur|Takipçi ekle
- en: Create a habit|Log progress|Show analytics|Set a reminder|Add a tracker

> **Figure:** a phone frame: chat on the left, a habit grid on the right. Press "play": the message types
> (`fig_msg`), a tool chip appears (`fig_tool`), the grid cell fills, the reply arrives (`fig_reply`). Below,
> chips for `fig_actions`.

## Chapter 4: cost and safety

### project.sam-ai.c4.label
- tr: Maliyet
- en: Cost

### project.sam-ai.c4.title
- tr: Maliyet de bir ürün özelliği.
- en: Cost is a product feature.

### project.sam-ai.c4.body
- tr: Günlük sıfırlama, kısa bağlam ve tur sınırı token'ı yaklaşık %60 azalttı.
- en: Daily resets, compact context and a turn cap cut tokens by about 60%.

### project.sam-ai.c4.note
- tr: fatura sürprizi yok.
- en: no surprise bills.

### project.sam-ai.c4.fig
- tr: maliyet ve güvenlik katmanları
- en: cost and safety layers

### project.sam-ai.c4.fig_layers
- tr: Günlük sıfırlama|Kısa bağlam|Tur başına 4 adım|Hız sınırları|Fatura eşiği
- en: Daily reset|Compact context|4 steps per turn|Rate limits|Billing cut-off

> **Figure:** five stacked shields or badges (`fig_layers`) with a token bar shrinking by ~60% beside them.

## Chapter 5: shipped

### project.sam-ai.c5.label
- tr: Sonuç
- en: The result

### project.sam-ai.c5.title
- tr: Fikirden App Store'a.
- en: From idea to the App Store.

### project.sam-ai.c5.body
- tr: Abonelik modeliyle, altı dilde yayında. Ders: araçlar prompttan iyidir ve ton özelliklerden önemlidir.
- en: Live with a subscription model, in six languages. The lesson: tools beat prompts, and tone matters more than features.

### project.sam-ai.c5.note
- tr: "yeni başlangıç", asla suçluluk.
- en: "fresh start", never guilt.

### project.sam-ai.c5.fig
- tr: üç sekme
- en: three tabs

### project.sam-ai.c5.fig_tabs
- tr: Alışkanlıklar|Takipçiler|Sohbet
- en: Habits|Trackers|Chat

> **Figure:** three small phone sketches side by side (`fig_tabs`), the App Store button (`link_label`) below.

## Footer

### project.sam-ai.stack
- tr: Expo, React Native, TypeScript, Firebase (Functions, Firestore), Vercel AI SDK, OpenAI ve Anthropic modelleri, RevenueCat, push bildirimleri
- en: Expo, React Native, TypeScript, Firebase (Functions, Firestore), Vercel AI SDK, OpenAI & Anthropic models, RevenueCat, push notifications
