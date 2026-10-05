# Vera Catering Services — website

One self-contained page (`index.html`): the full menu with half/full foil pan
prices, online ordering that sends the order by WhatsApp, text or email, an
event-quote form, gallery and contact details. Photos and the logo are
embedded, so the file has no dependencies beyond Google Fonts.

## Deploy on Netlify (two ways)

**Drag and drop (2 minutes, no Git):** open https://app.netlify.com/drop and
drop this folder (or `vera-catering-netlify.zip`). Netlify gives you a
`*.netlify.app` address immediately. Rename the site under Site configuration
→ Site details → Change site name, e.g. `verascatering`.

**From this repository (auto-deploys on every push):** Netlify → Add new site
→ Import an existing project → this repo → Base directory `vera-catering`,
Build command empty, Publish directory `vera-catering`.

## Custom domain

Site configuration → Domain management → Add a domain → `verascatering.org`,
then point the domain's DNS at Netlify as the wizard shows (an ALIAS/A record
for the apex and a CNAME for `www`). HTTPS is automatic.

## Editing

Business facts live in one block at the top of the page's script (`BIZ`):
phone, email, whether the number is on WhatsApp, lead days. Menu items and
prices are in the `MENU` array right below it. Change, save, redeploy.
