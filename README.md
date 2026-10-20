# BETR Insurance Brokers – website

Static HTML site for [betrinsurance.co.uk](https://betrinsurance.co.uk). It was rebuilt from the original WordPress/Elementor site and has no CMS or plugins.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | Home page |
| `about/` | About us |
| `insurance/` | Insurance overview (business & personal) |
| `insurance/<service>/` | One page per service (15), each with FAQs and a quote form pre-set to that cover |
| `contact/` | Contact page |
| `privacy-policy/`, `terms-conditions/`, `complaints-policy/`, `cookies-policy/` | Policy pages |
| `404.html` | Not-found page |
| `assets/css/style.css` | All styles. Brand colours are at the top as CSS variables |
| `assets/js/main.js` | Mobile menu, quote popup, form sending, small animations |
| `assets/img/` | Logo, favicon and photos |
| `.htaccess` | HTTPS / non-www redirects, old WordPress URL redirects, caching |

## Deploying to Hostinger

Upload the repo contents to `public_html`, either by hand (see `README-UPLOAD.txt`) or with hPanel → Advanced → Git, pointing at this repo with the install path left blank (the site root).

## Forms

The home page form, the contact page form and the "Get Quote" popup all post to Formspree at `https://formspree.io/f/xyekqwjl`. `assets/js/main.js` sends them in the background and shows the success or error message on the page. The hidden `_gotcha` field is Formspree's spam trap. Each submission includes a `form` field saying which form it came from.

## Editing

Each page is a single HTML file, so edit the text directly. Bump the `?v=` number on the CSS and JS links after changing those files so browsers pick up the new version.
