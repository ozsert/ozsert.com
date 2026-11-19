# ozsert.com

Personal site of C. Murad Özsert, in English (default) and Turkish.

The homepage is an experiment: **one spec, many models**. Several Claude models each build their own
version of the same homepage, in one shot, from the same specification. The top bar's
"Built with [model ▾]" switches between versions, and [/models/](https://ozsert.com/models/) shows how
the quality changes from model to model.

## Structure

```
index.html      "/" = a copy of the newest released model version (generated, don't edit)
models/         the /models/ timeline + each model's released homepage version
projects/       project detail pages
talks/          all talks (built by the model)
shared/         shared code: language, theme, accent colours, top bar
content/        all text (generated from specs/) + the model registry
assets/         images
specs/          the public specs every model builds from (also shown in the site's specs window)
tools/          build, review, release and deploy scripts
archive/v1/     the previous version of the site
```

Static site, no framework. Run it locally with `python3 -m http.server 8000`.

