# Royal Flow Energy — Website & Admin Panel

Next.js 16 (App Router, TypeScript, Tailwind CSS v4) + MongoDB Atlas.

## What's included

**Public website**
- Home, About (mission, values, featured team), **Team** (members with photos and roles), Riverbox (technology), Pilot Project (timeline, budget, funding progress), News, Contact
- **Contact us** form → saved to MongoDB (`contact_messages`), with validation, spam honeypot and rate limiting
- **News & updates** with category filter, pagination, and a shareable link per post (`/news/<slug>`)
- Post pages with cover image, photo gallery + lightbox, share buttons (WhatsApp, Facebook, LinkedIn, X, copy link), related posts
- SEO: page metadata, social preview images per post, `sitemap.xml`, `robots.txt`, favicon from the logo
- Mobile-friendly, accessible (skip link, labels, keyboard-navigable gallery)

**Admin panel** (`/admin`)
- Secure sign-in (scrypt password hashing, signed HTTP-only session cookie, login rate limiting)
- **Posts**: create, edit, delete, save as draft, publish, unpublish, schedule (future publish date), search & filter
- **Multiple pictures per post**: drag & drop, automatic resizing in the browser, reorder, choose cover, insert into text, remove
- Simple formatting toolbar (headings, bold, italic, links, lists, quotes) with live **Preview**
- Post link panel: open or copy the public link
- **Team members**: add, edit, reorder, hide or remove people — photo (auto-cropped square), name, role, team section, bio, email, LinkedIn
- **Messages** inbox: read/replied/archived status, reply by email, delete, unread badge
- **Subscribers** (legacy, not in the menu): /admin/subscribers still lists emails collected before sign-ups were removed
- **Site settings**: contact details, WhatsApp, social links, funding goal/raised, home-page impact figures — no code changes needed
- **Admin users**: add/remove team admins, change your own password

Images are stored in MongoDB **GridFS** (bucket `images`), so no extra storage service is needed. Unused uploads are cleaned up automatically after 24 hours.

## Setup

1. **Install**
   ```bash
   npm install
   ```
2. **Environment** — copy `.env.example` to `.env.local` and fill in:
   - `MONGODB_URI` — from Atlas → *Database* → *Connect* → *Drivers*
   - `MONGODB_DB` — e.g. `royalflow`
   - `SESSION_SECRET` — generate with
     `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`
   - `NEXT_PUBLIC_SITE_URL` — e.g. `https://royalflowenergy.com` in production
3. **Atlas network access** — in Atlas → *Network Access*, allow your IP (and `0.0.0.0/0` for Vercel, or use Vercel's Atlas integration).
4. **Create the first admin**
   ```bash
   npm run create-admin -- "Your Name" you@royalflowenergy.com "a-strong-password"
   ```
   (Running it again with the same email resets that admin's password.)
5. **Run**
   ```bash
   npm run dev      # http://localhost:3000  — admin at /admin
   ```

## Deploying to Vercel
- Push to GitHub, import the repo in Vercel, and add the four environment variables above.
- Image uploads are limited to 4 MB each (the admin resizes large photos automatically) to stay within Vercel's request limit.

## Project structure
```
src/
  app/
    (site)/            public pages (home, about, riverbox, pilot, news, contact)
    admin/login        sign-in page
    admin/(panel)/     dashboard, posts, messages, subscribers, settings, users
    api/contact        contact form endpoint
    api/subscribe      disabled (email sign-ups removed)
    api/images/[id]    serves images from GridFS
    api/admin/*        protected admin endpoints
  components/          UI components (site + admin)
  lib/                 mongodb, auth, posts, settings, images, validation
scripts/create-admin.mjs
public/logo.png
```

## MongoDB collections
| Collection | Purpose |
| --- | --- |
| `posts` | News posts & updates |
| `images.files` / `images.chunks` | Uploaded pictures (GridFS) |
| `contact_messages` | Contact form submissions |
| `subscribers` | Emails collected before sign-ups were removed (legacy) |
| `team_members` | Team members shown on the Team and About pages |
| `settings` | Site settings (single `site` document) |
| `admin_users` | Admin accounts |

Indexes are created automatically on first connection.

## Writing posts — formatting
```
## A heading
Normal paragraph. **bold**, *italic*, [a link](https://example.com)

- bullet one
- bullet two

> A quote
```
Leave a blank line between paragraphs.

## Ideas for later
- Email notifications for new contact messages (e.g. Resend or Nodemailer)
- Riverbox monitoring dashboard (Phase 4–5 of the IT roadmap) reusing this admin panel and database

## Website photos
Site photos live in `public/images/`. To change one, save the new photo **with the same file name** (JPG, landscape, about 1600×1000 px):

| File | Where it appears |
| --- | --- |
| `community.jpg` | Home — About section; Support page |
| `riverbox-prototype.jpg` | Home — Riverbox section; Riverbox page (CAD render) |
| `site-visit.jpg` | Home — Current progress; Progress page |
| `cfd-velocity.jpg` | Home — Current progress; Riverbox validation gallery |
| `community-engagement.jpg` | Progress page — Pilot design |
| `team-at-work.jpg` | About page |
| `award-munich.jpg`, `award-pitch.jpg` | Recognition section (Home and About) |
| `riverbox-turbine.jpg`, `cfd-pressure.jpg`, `fea-stress.jpg`, `fea-deformation.jpg`, `crossflow-drawing.jpg` | Riverbox page — Design & validation gallery (drawing also on Growth & Investment) |

`field-testing.jpg`, `workshop-fabrication.jpg`, `hero-river.jpg`, `riverbox-generator.jpg`, `riverbox-installation.jpg` and `village-market.jpg` are no longer used and can be deleted.

### Team photos
Team photos are in `public/images/team/`, named after the person (e.g. `moses-mwale.jpg`, square). They are picked up automatically by name. A photo uploaded in **Admin → Team members** takes priority over the file.

Post pictures are added in **Admin → Posts**.
