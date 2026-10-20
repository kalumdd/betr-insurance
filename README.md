# BETR Insurance Brokers – website

Static HTML site for [betrinsurance.co.uk](https://betrinsurance.co.uk). It was rebuilt from the original WordPress/Elementor site and has no CMS or plugins.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | Home page (About, Insurance Solutions, Our Process, Contact sections) |
| `contact/` | Contact page |
| `privacy-policy/`, `terms-conditions/`, `complaints-policy/`, `cookies-policy/` | Policy pages |
| `404.html` | Not-found page |
| `send.php` | Contact / quote form handler (emails `quote@betrinsurance.co.uk` via PHP `mail()`) |
| `assets/css/style.css` | All styles. Brand colours are at the top as CSS variables |
| `assets/js/main.js` | Mobile menu, quote popup, form sending, small animations |
| `assets/img/` | Logo, favicon and photos |
| `.htaccess` | HTTPS / non-www redirects, old WordPress URL redirects, caching |

## Deploying to Hostinger

Upload the repo contents to `public_html`, either by hand (see `README-UPLOAD.txt`) or with hPanel → Advanced → Git, pointing at this repo with the install path left blank (the site root).

For the forms to deliver reliably, the domain's SPF record must include Hostinger:

```
v=spf1 include:spf.protection.outlook.com include:_spf.mail.hostinger.com -all
```

## Editing

Each page is a single HTML file, so edit the text directly. Bump the `?v=` number on the CSS and JS links after changing those files so browsers pick up the new version.
