# Vibodrome

A curated directory of AI-built and AI-assisted browser games. Brand: **Vībodrome**. Planned domain: **vibodrome.fun**.

## Current features

- 29 seeded games, including 9 Flying Vee Studios games and 20 editorial picks.
- 10 featured homepage slots, search, genre filters, game pages and developer profiles.
- Game submissions with contact email, play URL, cover-image URL, and permission confirmation.
- Persistent R2 submission queue and approval/rejection controls.
- Server-rendered HTML, unique metadata, canonical URLs, structured data, robots.txt and sitemap.xml.

## Source and build

The application is a dependency-free Cloudflare Worker ES module in `worker/index.js`. Cover assets are embedded in the source. Edit the source, not `dist/`.

Requires Node.js and Bash:

```sh
npm run build
npm run validate
```

The build writes `dist/server/index.js` and `dist/.openai/hosting.json`. `.openai/hosting.json` retains the existing Sites project and the `BUCKET` R2 binding. Submit and review records are runtime data and are not included in this repository.

## Deployment

Current private preview: https://vibodrome.artificialtv.chatgpt.site

Sites publication and the GitHub source mirror are separate operations. A GitHub commit alone does not deploy the site. Preserve the Sites project ID during updates.

## Before public launch

- Replace the owner-private preview's moderation access assumption with a server-side moderator allowlist before making the site public or sharing with viewers. Currently every signed-in visitor admitted to the private site can review submissions.
- Add submission rate limits and finalize operator contact, privacy, retention and deletion details.
- Connect vibodrome.fun and update canonical, social and sitemap origins.
- Verify third-party game availability, AI-development credits, artwork permissions and external cover availability. Editorial listings do not imply developer endorsement. Some covers are neutral fallback graphics.
- Fill out studio artwork and richer original game descriptions; several studio entries currently use short generic descriptions.

## Ownership

Site branding and studio artwork belong to their respective owners. Third-party games and artwork remain owned by their creators. No blanket open-source license is granted by this repository.

## Netlify deployment

The repository includes `netlify.toml`, a catch-all Netlify Function, and Netlify Blobs persistence. Netlify uses `npm run build:netlify`, `netlify-public`, and `netlify/functions` automatically from the configuration file. Deploy the `main` branch with an empty base directory.

The Netlify deployment has its own submission store; records from the Sites preview do not automatically migrate. Set `VIBODROME_ADMIN_PASSWORD` as a Functions-scoped environment variable in Netlify, then redeploy. Open `/admin`; use `admin` as the username and the configured password. Without this secret moderation stays locked. Never commit the password. `SITE_URL` optionally sets the canonical public origin; otherwise pages use their request origin.
