# Zaman Computer

Premium Computer & Laptop Store — **Zaman Computer**, Gulberg Town, Raiwind, Lahore.

**Your Trusted Technology Partner** — quality computers, laptops, accessories & repair services at the best prices in Pakistan.

**Live site:** https://adfaizy.github.io/Zaman_Computer/

## Two views

- **Customer** (everyone) — browse the catalog, search & filter, book appointments on WhatsApp, view services & prices, gallery, contact + map.
- **Owner** (private, PIN-protected) — tap the padlock in the navbar (mobile: bottom of the menu), enter PIN (default `1234` — change it in the dashboard). Owner sees everything customers see plus:

| Tool | What it does |
|---|---|
| **Invoice Center** | Build invoices, print, send PDF on WhatsApp or by phone, verify QR |
| **Owner Dashboard** | Add/remove products, edit prices, stock on/off, one-tap **Publish to GitHub** so customers see the new catalog |
| **Price Manager** | Edit all 65+ prices from one screen (Lahore market rates) |

## Owner workflow

1. Open the site → padlock → PIN → **Owner Dashboard**.
2. Edit prices / add products (or import your `products.json` backup).
3. Tap **Publish to GitHub** — the catalog JSON (`products.json`) is pushed to this repo via the GitHub API and GitHub Pages redeploys in ~1 minute.

**Publish settings (set once, on the shop PC only):** GitHub owner `adfaizy`, repo `Zaman_Computer`, branch `main`, path `products.json`, plus a **fine-grained token** with `Contents: Read and write` on that repo only. The token is stored only in the browser's localStorage on the shop PC — never committed, never sent anywhere except github.com.

## Tech

Static site — pure HTML / CSS / vanilla JS. No frameworks, no build tools, no server. Catalog data lives in `products.json` (owner-edited) with a built-in fallback baked into `index.html`.

Owner: Muhammad Umer Ul Zaman · NTN: 3520269614193
