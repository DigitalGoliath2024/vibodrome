# Vibodrome SEO implementation and launch checks

Updated October 23, 2026.

## Implemented

- One absolute canonical URL per public page, using `SITE_URL` when configured or the serving origin otherwise.
- Unique title and description for every sitemap page; descriptions shortened at a word boundary for search snippets.
- Complete Open Graph and Twitter metadata with game covers or a branded 1200 × 630 PNG. Crawlable logo and favicon PNGs.
- Linked JSON-LD graph: Organization, WebSite, WebPage/CollectionPage, BreadcrumbList, ItemList, VideoGame, creator entities, and Article for the original guide.
- ProfilePage restricted to the affiliated Flying Vee Studios profile. Unaffiliated editorial developer collections do not impersonate owned contributor accounts.
- Visible breadcrumbs mirror breadcrumb schema. Stable internal links connect games, genres, creators, the all-games directory, and the guide.
- Expanded genre introductions, related games, game-detail fields, and an original guide at `/guides/vibe-coded-games`.
- Updated studio game descriptions from their original hosts, including correcting Marauder’s Sea to Strategy.
- Server-rendered public content; navigation does not require client JavaScript.
- Public XML sitemap, correctly rooted robots.txt, noindex submission form, private/API exclusions, noindex 404s, and 308 normalization for trailing slashes and index.html.
- Lazy and asynchronous image decoding for game cards. Fixed cover containers reserve layout space.

## Verification

`npm test` checks 90 indexable sitemap routes, successful responses, unique titles/descriptions, a single matching canonical, one H1, parseable JSON-LD, applicable schema types, breadcrumb positions and URLs, social metadata, the 40-game count, redirects, robots, noindex behavior, and PNG assets. `npm run build:netlify` passed.

These are local automated checks. Google Rich Results Test, Schema Markup Validator, PageSpeed Insights and Search Console were not run on the live deployment in this session. Browser layout and measured Core Web Vitals remain unverified.

## Rich-result eligibility

VideoGame alone is valid descriptive schema but does not produce Google's software-app rich result. Google requires a supported app type, name, offers.price, and an authentic review or rating for that feature. We do not fabricate ratings, reviews, prices, software offers, or guaranteed eligibility. Breadcrumbs are supported; Organization and WebSite help identify the site. Valid markup never guarantees a rich appearance or ranking.

The guide is original editorial content with Article markup. ItemList describes the directory; it does not claim eligibility for a general game carousel. Unaffiliated external developer collections use CollectionPage rather than Google's contributor ProfilePage feature.

Official references:
- https://developers.google.com/search/docs/appearance/structured-data/software-app
- https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- https://developers.google.com/search/docs/appearance/structured-data/profile-page
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://developers.google.com/search/docs/appearance/site-names
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

## Live launch steps still required

1. Confirm the public Netlify URL and custom-domain DNS/HTTPS. `vibodrome.fun` could not be resolved from the authoring environment at audit time; that is not a verified outage diagnosis.
2. Once the custom domain is serving, set `SITE_URL=https://vibodrome.fun` in Netlify's Functions environment and redeploy. The domain should be Netlify's primary domain with alternate hostnames redirected using Netlify's domain controls.
3. Verify a domain property in Google Search Console using the DNS TXT record provided by Google. Submit `/sitemap.xml`; inspect the homepage, a game page, a genre page, and the guide.
4. Run Google's Rich Results Test on a game page (check Breadcrumbs), the studio profile, and the guide. Use Schema Markup Validator for the complete graph.
5. Check PageSpeed Insights on mobile and desktop against the actual deployment. Improve measured bottlenecks rather than claiming an unmeasured score.
6. Verify current third-party play links and development credits, and replace remaining neutral fallback covers with permitted artwork.
7. Add substantive original game notes and genuinely played reviews over time; do not manufacture review data. Expand collections around player intent when there is enough real content.
8. Build awareness through legitimate creator relationships and relevant directories. Technical setup alone cannot produce backlinks, traffic, authority, or ranking guarantees.

Suggested search intents: vibe-coded games; AI browser games; AI-assisted indie games; genre + browser games; game title + play; creator name + games. The catalog currently includes AI-assisted projects as well as predominantly AI-coded projects; descriptions must preserve that distinction.

## Main-page focus and contextual links

- `/`: game discovery; targets vibe-coded games and AI-coded browser games in the title and visible copy.
- `/games`: the complete browser-game directory and genre navigation.
- `/genres/*`: genre-specific browser-game searches, with multi-genre membership and visible counts.
- `/guides/vibe-coded-games`: informational searches about what vibe-coded and AI-assisted games are.
- `/about`: operator, purpose, selection process and creator relationship, with contextual links to the homepage, directory, guide, categories, developer pages and contact/submission forms.

Game-detail pages include a short contextual link back to the homepage and guide, alongside their existing category links. About links are ordinary server-rendered anchors with descriptive text. These changes clarify navigation and page relevance; no keyword-volume estimates or ranking guarantees are implied. Use Search Console query and page reports, with a consistent date range, to assess indexing, impressions and clicks after recrawling.
