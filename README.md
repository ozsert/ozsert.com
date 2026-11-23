# ozsert.com

Personal site of C. Murad Özsert, in English (default) and Turkish.

The site is an experiment: **one spec, many models**. Several Claude models each build their own
version of the whole site (homepage, talks page, project pages), one page per prompt, one shot, from the
same specification. The top bar's "Built with [model ▾]" switches between versions, and
[/models/](https://ozsert.com/models/) shows them side by side, ordered by model release date.

## Structure

```
index.html, talks/, projects/   "/" and its pages = a copy of the pinned model's site (Claude Opus 5.5;
                                generated, don't edit)
models/<id>/                    one model's site: its homepage, talks/ and projects/<slug>/
models/index.html               the /models/ timeline
404.html                        not found, or "not built yet" for a page a model hasn't built
shared/                         shared code: language, theme, accent colours, top bar
content/                        all text (generated from specs/) + the model registry (models.json)
assets/                         images; assets/shots/ = timeline thumbnails
specs/                          the public spec every model builds from (frozen as git tag spec-v1;
                                also shown in the site's specs window)
tools/                          build, review, release and deploy scripts
archive/v1/                     the previous version of the site
```

Static site, no framework. Run it locally with `python3 -m http.server 8000`.

