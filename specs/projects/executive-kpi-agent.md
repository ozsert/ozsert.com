# Project: Management Insights Agent  (`/projects/executive-kpi-agent/`)

> **Page format:** like `specs/projects/ai-code-reviewer.md`: hero → facts → chapters `c1…c6`, each with
> its own figure. Keep text short.

## Homepage row

### project.executive-kpi-agent.title
- tr: Yönetim İçgörü Ajanı
- en: Management Insights Agent

### project.executive-kpi-agent.oneliner
- tr: Bir holdingin icra kurulu için yapay zekâ analisti: bir KPI'ın neden saptığını sorarsınız, dakikalar içinde kök nedeni rakamlarıyla getirir.
- en: An AI analyst for a holding company's executive board: ask why a KPI is off, and within minutes it brings back the root cause, with the numbers.

### project.executive-kpi-agent.kind
- tr: Kurumsal
- en: Enterprise

### project.executive-kpi-agent.status
- tr: Canlıda
- en: Live

### project.executive-kpi-agent.year
- tr: 2026
- en: 2026

## Hero

### project.executive-kpi-agent.lead
- tr: Kurul toplantısından önce gelen "neden" soruları eskiden günlerce analist kuyruğunda beklerdi. Artık icra kurulu sorar, ajan şirketin verisine danışır ve cevap dakikalar içinde gelir.
- en: The "why" questions before a board meeting used to wait days in an analyst queue. Now the board asks, the agent consults the company's data, and the answer arrives in minutes.

### project.executive-kpi-agent.note
- tr: model asla SQL yazmaz.
- en: the model never writes SQL.

### project.executive-kpi-agent.hero_fig
- tr: bir soru, bir KPI ağacı, bir kök neden
- en: one question, one KPI tree, one root cause

> **Hero figure:** a chat bubble ("why?") whose tail grows into a hand-drawn tree that branches down and
> ends in one circled leaf. Drawn on load, ≈2.5 s.

### project.executive-kpi-agent.stat1
- tr: Günler → dakikalar
- en: Days → minutes

### project.executive-kpi-agent.stat1_label
- tr: bir "neden" sorusunun cevap süresi
- en: to answer a "why" question

### project.executive-kpi-agent.stat2
- tr: 248
- en: 248

### project.executive-kpi-agent.stat2_label
- tr: KPI tanımı, test edilmiş sorgularla
- en: KPI definitions as tested queries

### project.executive-kpi-agent.stat3
- tr: ~10
- en: ~10

### project.executive-kpi-agent.stat3_label
- tr: ülke ve para birimi
- en: countries and currencies

### project.executive-kpi-agent.stat4
- tr: 7
- en: 7

### project.executive-kpi-agent.stat4_label
- tr: kök neden yöntemi
- en: root-cause methods

## Chapter 1: the problem

### project.executive-kpi-agent.c1.label
- tr: Problem
- en: The problem

### project.executive-kpi-agent.c1.title
- tr: Kurul rakamları görüyordu, nedenleri değil.
- en: The board saw numbers, not causes.

### project.executive-kpi-agent.c1.body
- tr: Panolar sabit görünümler sunuyordu; her yeni "neden" bir analist talebi ve günlerce bekleme demekti.
- en: Dashboards showed fixed views; every new "why" meant an analyst request and days of waiting.

### project.executive-kpi-agent.c1.note
- tr: toplantı yarın, cevap haftaya.
- en: meeting tomorrow, answer next week.

### project.executive-kpi-agent.c1.fig
- tr: önce ve sonra
- en: before and after

### project.executive-kpi-agent.c1.fig_q
- tr: FAVÖK neden bütçenin altında?
- en: Why is EBITDA below budget?

### project.executive-kpi-agent.c1.fig_before
- tr: Önce: soru → analist kuyruğu → 2–3 gün
- en: Before: question → analyst queue → 2–3 days

### project.executive-kpi-agent.c1.fig_after
- tr: Şimdi: soru → ajan → dakikalar
- en: Now: question → agent → minutes

> **Figure:** a Before / Now toggle. The same question card travels a long dotted road with a queue of
> tickets (before) or a short straight line (now). A small clock face shows days vs minutes.

## Chapter 2: how a question travels

### project.executive-kpi-agent.c2.label
- tr: Mimari
- en: Architecture

### project.executive-kpi-agent.c2.title
- tr: Kurul sorar, ajan şirket verisine danışır.
- en: The board asks; the agent consults the company's data.

### project.executive-kpi-agent.c2.body
- tr: Asistan MCP üzerinden güvenli bir sunucuya, oradan da önceden hesaplanmış özet tablolara ulaşır. Yalnızca sabit, test edilmiş araçlar.
- en: The assistant reaches a secure server over MCP, and through it pre-computed summary tables. Only fixed, tested tools.

### project.executive-kpi-agent.c2.note
- tr: kapsam dışı soru? "henüz cevaplayamıyorum."
- en: out of scope? "I can't answer that yet."

### project.executive-kpi-agent.c2.fig
- tr: bir sorunun yolu
- en: the path of a question

### project.executive-kpi-agent.c2.fig_path
- tr: Yönetici|Yapay zekâ asistanı|MCP sunucusu|Sabit araçlar|Şirket verisi
- en: Executive|AI assistant|MCP server|Fixed tools|Company data

### project.executive-kpi-agent.c2.fig_badge
- tr: model asla SQL yazmaz
- en: the model never writes SQL

### project.executive-kpi-agent.c2.fig_cant
- tr: "Henüz cevaplayamıyorum" → haftalık değerlendirmeye kaydedilir
- en: "I can't answer that yet" → logged for weekly review

> **Figure:** five boxes left to right (`fig_path`), a dot travelling along them on scroll; a stamp with
> `fig_badge` on the tools box; a dashed side branch from the assistant with `fig_cant`.

## Chapter 3: the KPI tree

### project.executive-kpi-agent.c3.label
- tr: KPI ağacı
- en: The KPI tree

### project.executive-kpi-agent.c3.title
- tr: FAVÖK'ten tek bir maliyet kalemine.
- en: From EBITDA down to a single cost line.

### project.executive-kpi-agent.c3.body
- tr: Her KPI bir ağacın düğümü; ajan sapmayı yukarıdan aşağı izler.
- en: Every KPI is a node in a tree; the agent follows the gap from the top down.

### project.executive-kpi-agent.c3.note
- tr: düğüme tıkla, aç.
- en: click a node to open it.

### project.executive-kpi-agent.c3.fig
- tr: KPI ağacı
- en: the KPI tree

### project.executive-kpi-agent.c3.fig_nodes
> Node labels in this order: 1 EBITDA · 2 Gross profit · 3 Opex · 4 Net-net sales · 5 COGS · 6 Transportation ·
> 7 FX · 8 Raw & pack · 9 Manufacturing · 10 Sales · 11 Marketing · 12 Logistics · 13 G&A.
> Tree: 1 → (2, 3); 2 → (4, 5, 6, 7); 5 → (8, 9); 3 → (10, 11, 12, 13).
- tr: FAVÖK|Brüt kâr|Faaliyet giderleri|Net-net satışlar|SMM|Nakliye|Kur farkı|Hammadde ve ambalaj|Üretim|Satış|Pazarlama|Lojistik|Genel yönetim
- en: EBITDA|Gross profit|Opex|Net-net sales|COGS|Transportation|FX|Raw & pack|Manufacturing|Sales|Marketing|Logistics|G&A

> **Figure:** an interactive, collapsible tree in hand-inked lines. Opening a node draws its children.

## Chapter 4: ask why

### project.executive-kpi-agent.c4.label
- tr: Kök neden
- en: Root cause

### project.executive-kpi-agent.c4.title
- tr: Sorudan kök nedene, beş adımda.
- en: From question to root cause, in five steps.

### project.executive-kpi-agent.c4.body
- tr: Senaryolar karşılaştırılır, fark ülkeye, kanala ve kategoriye ayrılır, doğru yöntem seçilir.
- en: Scenarios are compared, the gap is split by country, channel and category, and the right method is chosen.

### project.executive-kpi-agent.c4.note
- tr: şekil yapıyı gösterir, rakam değil.
- en: the figure shows the method, not the numbers.

### project.executive-kpi-agent.c4.fig
- tr: bir "neden" sorusu, adım adım
- en: one "why" question, step by step

### project.executive-kpi-agent.c4.fig_steps
- tr: Soru|Senaryo farkı|Kırılım|Yöntem|Cevap
- en: Question|Scenario gap|Breakdown|Method|Answer

### project.executive-kpi-agent.c4.fig_scenarios
- tr: Gerçekleşen|Bütçe|Tahmin|Geçen yıl
- en: Actual|Budget|Forecast|Prior year

### project.executive-kpi-agent.c4.fig_methods
- tr: Açığı kapatma|Fiyat-hacim-karma|Maliyet karması|Birim maliyet|Kur etkisi|Fiyat ve iskonto|Bölgesel hacim
- en: Gap closing|Price-volume-mix|Cost mix|Unit cost|Currency effect|Pricing & discounts|Regional volume

### project.executive-kpi-agent.c4.fig_answer
- tr: Açık esas olarak tek bir ülke ve kategoride; sürükleyen fiyat değil hacim.
- en: The gap sits mainly in one country and one category; the driver is volume, not price.

> **Figure: a 5-step stepper** (`fig_steps`). **No numbers or currency values anywhere in the figure**: bars
> are unlabelled shapes. Step 2: four bars (`fig_scenarios`) with a gap bracket. Step 3: the gap split into
> country / channel / category bars, the largest circled.
> Step 4: the 7 method chips (`fig_methods`), one lit ("Price-volume-mix"). Step 5: an answer card (`fig_answer`).

## Chapter 5: the result

### project.executive-kpi-agent.c5.label
- tr: Sonuç
- en: The result

### project.executive-kpi-agent.c5.title
- tr: Analist kuyruğu yerine dakikalar.
- en: Minutes instead of an analyst queue.

### project.executive-kpi-agent.c5.body
- tr: Kurul sorularını kendisi soruyor; herkes aynı rakamı görüyor, analistler gerçek analize zaman ayırıyor.
- en: The board asks its own questions; everyone sees the same numbers, and analysts spend their time on real analysis.

### project.executive-kpi-agent.c5.note
- tr: daha az veri, daha çok cevap.
- en: less data, more answers.

### project.executive-kpi-agent.c5.fig
- tr: veri modeli: önce ve sonra
- en: the data model: before and after

### project.executive-kpi-agent.c5.fig_before
- tr: 150 milyon tekrarlı satır
- en: 150M duplicated rows

### project.executive-kpi-agent.c5.fig_after
- tr: ~50 yalın özet tablo
- en: ~50 lean summary tables

> **Figure:** a tall, dense block of hatched lines (before) shrinking into a neat stack of ~50 thin cards
> (after) as you scroll.

## Chapter 6: what I learned

### project.executive-kpi-agent.c6.label
- tr: Öğrendiklerim
- en: What I learned

### project.executive-kpi-agent.c6.title
- tr: Finansta güven, esneklikten önce gelir.
- en: In finance, trust beats flexibility.

### project.executive-kpi-agent.c6.body
- tr: Sabit araçlar ve dürüst bir "henüz cevaplayamıyorum" serbest SQL'den çok daha fazla güven kazanır. İşin çoğu veri modelinde.
- en: Fixed tools and an honest "I can't answer that yet" earn more trust than free-form SQL. Most of the work is in the data model.

### project.executive-kpi-agent.c6.note
- tr: soruları kurulla birlikte yazdık.
- en: we wrote the questions with the board.

> No figure: a short hand-numbered list in the margin style.

## Footer

### project.executive-kpi-agent.stack
- tr: Claude, MCP sunucusu, Power BI / iş zekâsı verisi, Azure API Management, Azure Functions (Python), özet tablolar, Entra ID
- en: Claude, MCP server, Power BI / business-intelligence data, Azure API Management, Azure Functions (Python), summary tables, Entra ID
