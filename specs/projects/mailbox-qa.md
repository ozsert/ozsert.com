# Project: Mailbox RAG Agent  (`/projects/mailbox-qa/`)

> **Page format:** like `specs/projects/ai-code-reviewer.md`: hero → facts → chapters `c1…c5`, each with
> its own figure. Keep text short.

## Homepage row

### project.mailbox-qa.title
- tr: Posta Kutusu RAG Ajanı
- en: Mailbox RAG Agent

### project.mailbox-qa.oneliner
- tr: Arşivlenmiş bir posta kutusuyla sohbet: sade dille soru, kaynağa dayalı cevap ve her iddia kaynak e-postaya bağlı.
- en: Chat with an archived mailbox: plain-language questions, grounded answers, and every claim linked to its source email.

### project.mailbox-qa.kind
- tr: Kurumsal
- en: Enterprise

### project.mailbox-qa.status
- tr: Kavram kanıtı
- en: Proof of concept

### project.mailbox-qa.year
- tr: 2026
- en: 2026

## Hero

### project.mailbox-qa.lead
- tr: Biri şirketten ayrıldığında posta kutusu kara kutuya dönüşür. Denetçiler ve devralanlar cevap arar, 10 GB'lık bir dosya değil. Bu kavram kanıtı posta kutusunu soru sorulabilir yapıyor.
- en: When someone leaves, their mailbox becomes a black box. Auditors and successors need answers, not a 10 GB file. This proof of concept makes a mailbox something you can ask.

### project.mailbox-qa.note
- tr: kaynak yoksa cevap da yok.
- en: no citation, no answer.

### project.mailbox-qa.hero_fig
- tr: kapalı bir kutudan kaynaklı bir cevaba
- en: from a closed box to a cited answer

> **Hero figure:** a closed archive box opening; envelopes fly out and line up into a single answer card with
> [1][2] markers. Drawn on load.

### project.mailbox-qa.stat1
- tr: [1][2]
- en: [1][2]

### project.mailbox-qa.stat1_label
- tr: her cevapta kaynak
- en: citations on every answer

### project.mailbox-qa.stat2
- tr: 8
- en: 8

### project.mailbox-qa.stat2_label
- tr: soru başına getirilen kaynak parça
- en: source passages per question

### project.mailbox-qa.stat3
- tr: <10 sn
- en: <10 s

### project.mailbox-qa.stat3_label
- tr: soru başına hedef süre
- en: target per question

### project.mailbox-qa.stat4
- tr: 10 TB
- en: 10 TB

### project.mailbox-qa.stat4_label
- tr: planlanan üretim ölçeği
- en: planned production scale

## Chapter 1: the problem

### project.mailbox-qa.c1.label
- tr: Problem
- en: The problem

### project.mailbox-qa.c1.title
- tr: Bilgi, ayrılanların posta kutusunda kilitli.
- en: Knowledge locked in a departed mailbox.

### project.mailbox-qa.c1.body
- tr: Anahtar kelime araması kelime bulur, cevap bulmaz; binlerce yazışmayı elle okumak ölçeklenmez.
- en: Keyword search finds words, not answers; reading thousands of threads by hand doesn't scale.

### project.mailbox-qa.c1.note
- tr: denetim, devir, hukuki saklama.
- en: audits, handovers, legal holds.

### project.mailbox-qa.c1.fig
- tr: kara kutu
- en: the black box

### project.mailbox-qa.c1.fig_box
- tr: PST · 10 GB
- en: PST · 10 GB

### project.mailbox-qa.c1.fig_questions
- tr: Ne karar verildi?|Kim onayladı?|Ne zaman?
- en: What was decided?|Who agreed?|When?

> **Figure:** a sealed box labelled `fig_box`, three hand-written question marks (`fig_questions`) circling it.

## Chapter 2: ingest once

### project.mailbox-qa.c2.label
- tr: İşleme
- en: Ingest

### project.mailbox-qa.c2.title
- tr: Bir kez işle.
- en: Ingest once.

### project.mailbox-qa.c2.body
- tr: Posta kutusu temizlenir, parçalanır, tekrarlar ayıklanır ve aranabilir bir dizine dönüşür.
- en: The mailbox is cleaned, chunked, de-duplicated and turned into a searchable index.

### project.mailbox-qa.c2.note
- tr: tek bir mesaj bütün bir yazışmayı taşıyabilir.
- en: one message can carry a whole thread.

### project.mailbox-qa.c2.fig
- tr: işleme hattı
- en: the ingest pipeline

### project.mailbox-qa.c2.fig_steps
- tr: PST dosyası|Dönüştür|Temizle|500 token'lık parçalar|Tekrarları ayıkla|Vektöre çevir|Vektör veritabanı
- en: PST file|Convert|Clean|500-token chunks|De-duplicate|Embed|Vector store

> **Figure:** seven stations along a hand-drawn conveyor; envelopes enter on the left and leave as small index
> cards with a "From · Date · Subject" header. Scroll-driven.

## Chapter 3: ask anytime

### project.mailbox-qa.c3.label
- tr: Soru
- en: Ask

### project.mailbox-qa.c3.title
- tr: Her zaman sor, kaynağıyla cevap al.
- en: Ask anytime, get the answer with its sources.

### project.mailbox-qa.c3.body
- tr: En ilgili sekiz parça getirilir; model satır içi atıflarla cevap verir, cevap yoksa söyler.
- en: The eight most relevant passages are retrieved; the model answers with inline citations, or says it isn't there.

### project.mailbox-qa.c3.note
- tr: atıfa tıkla, e-postayı gör.
- en: click a citation to see the email.

### project.mailbox-qa.c3.fig
- tr: bir cevap ve kaynakları (uydurma örnek)
- en: an answer and its sources (invented example)

### project.mailbox-qa.c3.fig_q
- tr: Tedarikçi sözleşmesi için son karar neydi?
- en: What was the final decision on the vendor contract?

### project.mailbox-qa.c3.fig_answer
- tr: Sözleşme iki yıllığına uzatıldı [1]; fiyat artışı %3 ile sınırlandı [2].
- en: The contract was extended for two years [1], with the price increase capped at 3% [2].

### project.mailbox-qa.c3.fig_src1
- tr: E-posta 1 · 15 Mart · Ynt: Tedarikçi sözleşmesi
- en: Email 1 · 15 Mar · Re: Vendor contract

### project.mailbox-qa.c3.fig_src2
- tr: E-posta 2 · 18 Mart · Fiyat maddesi
- en: Email 2 · 18 Mar · Pricing clause

### project.mailbox-qa.c3.fig_q2
- tr: Ofis taşınması ne zaman?
- en: When is the office move?

### project.mailbox-qa.c3.fig_notfound
- tr: Bu posta kutusunda bulunamadı.
- en: Not found in this mailbox.

> **Figure:** a chat card with question `fig_q` and answer `fig_answer`; the [1] and [2] markers are buttons
> that unfold source cards (`fig_src1`, `fig_src2`). A second tab shows `fig_q2` → `fig_notfound`.

## Chapter 4: privacy and scale

### project.mailbox-qa.c4.label
- tr: Üretim
- en: Production

### project.mailbox-qa.c4.title
- tr: Veri şirketin içinde kalır.
- en: The data stays inside the company.

### project.mailbox-qa.c4.body
- tr: Üretimde vektörler yerel modellerle üretilir; aynı hat yüzlerce posta kutusuna ölçeklenir.
- en: In production, embeddings run on local models; the same pipeline scales to hundreds of mailboxes.

### project.mailbox-qa.c4.note
- tr: dakikalar, günler değil.
- en: minutes, not days.

### project.mailbox-qa.c4.fig
- tr: kavram kanıtından üretime
- en: from proof of concept to production

### project.mailbox-qa.c4.fig_rows
- tr: 1 MB → 10 TB|9 e-posta → ~50 milyon|Bulut vektörleri → yerel vektörler|Terminal → kimlik doğrulamalı API|+ yeniden sıralama, iş kuyruğu, artımlı senkron
- en: 1 MB → 10 TB|9 emails → ~50M|Cloud embeddings → local embeddings|Terminal → authenticated API|+ re-ranking, job queue, incremental sync

### project.mailbox-qa.c4.fig_boundary
- tr: şirketin içinde kalır
- en: stays inside the company

> **Figure:** two columns (POC vs production) built from `fig_rows`, with a dashed boundary labelled
> `fig_boundary` drawn around the production column.

## Chapter 5: what I learned

### project.mailbox-qa.c5.label
- tr: Öğrendiklerim
- en: What I learned

### project.mailbox-qa.c5.title
- tr: E-posta, dokümandan daha dağınıktır.
- en: Email is messier than documents.

### project.mailbox-qa.c5.body
- tr: Tekrar ayıklama, geri getirme kadar önemli. Atıflar süs değil, güvenin kaynağı. "Bulunamadı" ilk günden tasarlanmalı.
- en: De-duplication matters as much as retrieval. Citations aren't decoration; they're where trust comes from. Design for "not found" from day one.

### project.mailbox-qa.c5.note
- tr: denetçi güvenmezse işe yaramaz.
- en: if the auditor doesn't trust it, it's useless.

> No figure: a short hand-numbered list.

## Footer

### project.mailbox-qa.stack
- tr: Python, readpst/libpst, LangChain metin bölücüler, gömme modelleri (bulut → yerel), ChromaDB → Qdrant, MCP üzerinden Claude
- en: Python, readpst/libpst, LangChain text splitters, embeddings (cloud → local), ChromaDB → Qdrant, Claude via MCP
