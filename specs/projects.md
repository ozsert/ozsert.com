# Workbench spec ("Atölye"): homepage section 01 + project index

> Section name decided 2026-11-18: **Workbench / Atölye**. Two shelves via `kind`:
> Enterprise / Kurumsal and Startup / Startup. URLs stay `/projects/<slug>/`.

> **Role of this file:** the homepage "Workbench" section and the shared labels for
> project pages. Each project's own content lives in `specs/projects/<slug>.md`
> (same `### key` / `- tr:` / `- en:` format, converted into the same `content/*.json`).
> - **Homepage (section 01):** one row per project in `projects.order`: number, `title`,
>   `oneliner`, a stamp with `kind`, `status` in mono, → link to `/projects/<slug>/`.
>   The list-row pattern from `specs/design.md` §8b. A hover picture is optional (projects have no photos;
>   a small piece of the project's signature figure is a nice touch).
> - **Detail pages:** `/projects/<slug>/`, see `specs/design.md` §10.
> - **Anonymized on purpose:** no company, client, person or internal system names, anywhere.

### projects.order
> Slugs in homepage order. Not translated.
- tr: ai-code-reviewer, skill-marketplace, executive-kpi-agent, ai-gateway, mailbox-qa, sam-ai, player-support-agent
- en: ai-code-reviewer, skill-marketplace, executive-kpi-agent, ai-gateway, mailbox-qa, sam-ai, player-support-agent

### projects.section_no
- tr: 01
- en: 01

### projects.label
- tr: Atölye
- en: Workbench

### projects.title
- tr: Seçili işler: liderlik ettiğim projeler.
- en: Selected work: projects I've led.

### projects.intro
- tr: Kurumlarda liderlik ettiğim yapay zekâ projeleri ve startup'larla geliştirdiklerim. Her biri, doğru bağlamla küçük bir ekibin neler yapabileceğinin bir örneği.
- en: AI projects I lead inside large enterprises, and the products I build with startups. Each is a small proof of what one team can do with the right context.

### projects.enterprise_note
> Small mono note under the intro.
- tr: Kurumsal projeler anonimleştirilmiştir: şirket ve kişi isimleri yer almaz.
- en: Enterprise projects are anonymized: no company or personal names.

### projects.kind_enterprise
- tr: Kurumsal
- en: Enterprise

### projects.kind_personal
- tr: Startup
- en: Startup

### projects.back
- tr: ← Atölye
- en: ← Workbench

### projects.crumb
> First part of the breadcrumb on detail pages: "PROJECTS / ENTERPRISE / PILOT".
- tr: Atölye
- en: Workbench

### projects.s_problem
- tr: Problem
- en: The problem

### projects.s_approach
- tr: Yaklaşım
- en: The approach

### projects.s_how
- tr: Nasıl çalışıyor
- en: How it works

### projects.s_result
- tr: Sonuç
- en: The result

### projects.s_learned
- tr: Öğrendiklerim
- en: What I learned

### projects.stack_label
- tr: Kullanılanlar
- en: Built with

### projects.credit
> Footer credit on detail pages. Replace `{model}` with the display name of the model that built the page.
- tr: Bu sayfa, projenin spesifikasyonundan {model} tarafından inşa edildi.
- en: This page was built by {model} from the project's spec.
