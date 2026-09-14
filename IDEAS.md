# Toward AGI — 1,000 Improvement & Enhancement Points

A working backlog. Numbered continuously; grouped by surface. Items marked
**[P0]** are the highest-leverage picks. Triage into issues as needed.

---

## 1. Model radar & data pipeline (1–70)

1. **[P0]** Add latency data: poll OpenRouter's per-model throughput/TTFT stats and store `latencyMs` + `tokensPerSec` on registry entries.
2. Add pricing per model from OpenRouter (`pricing.prompt`/`pricing.completion`) into the registry — enables "cost per million tokens" everywhere.
3. Track OpenRouter `top_provider` fields: uptime, context, quantization.
4. Snapshot registry weekly → `content/models/history/` JSON diffs so "what changed" is auditable.
5. Detect delistings: models that vanish from OpenRouter get a `removedAt` marker and a "gone dark" radar event.
6. Detect price changes as radar events (a model that drops 50% is a story).
7. Add GitHub release feeds for major open-weight labs (llama.cpp, vllm releases affect usability).
8. Sweep Replicate, Together, Fireworks, Groq, Cerebras, SambaNova model lists alongside OpenRouter.
9. Add LMSYS/Chatbot Arena standings ingestion for an "arena rank" field.
10. Add Artificial Analysis API as a quality/cost/latency source.
11. Add HuggingFace `trendingScore` / likes-delta so the radar notices momentum, not just creation.
12. Watch HF `spaces` for viral demos as a "novel use" signal.
13. Parse `model-index`/eval results from HF model cards into structured scores.
14. Store `license` from HF tags — enterprise readers care.
15. Store `library_name` (transformers/gguf/mlx) as a servability hint.
16. Normalize org names across sources ("Mistral AI" vs "mistralai") into one canonical id + alias map.
17. Add `family` field (llama, qwen, glm, gemini, claude, gpt, grok, deepseek) for family-level pages.
18. Add `generation` field (llama-3, llama-4, qwen2.5, qwen3) for lineage views.
19. Add `parameterCount` + `activeParams` (MoE) parsed from names and cards.
20. Add `quantVariants` rollup: group GGUF/MLX/AWQ variants under their base model.
21. Merge duplicate contacts across HF and OpenRouter by name similarity, not just id.
22. Add a "first seen on" provenance per source (HF date vs OR date).
23. Score "release significance": frontier org + major version bump = banner; patch/quant = log-only.
24. Add weight-type classification: open-weights vs API-only vs gated.
25. Flag models requiring trust_remote_code — a real deployment caveat.
26. Detect distilled models (name + card claims) → `distilled: true`.
27. Detect fine-tune-of-finetune lineage and link parents.
28. Add a `verified` flag for entries a human has reviewed.
29. Run the radar hourly for allowlisted orgs, 6h for the long tail.
30. Add a dry-run mode to discover-models that prints what *would* be added.
31. Emit a machine-readable radar changelog (`content/models/changelog.jsonl`).
32. Publish registry as a public JSON API (`/api/models`) for other builders.
33. Add `ETag`/304 support on the API.
34. Cache upstream API failures gracefully — keep last-good data with a `stale` marker.
35. Add retry with backoff + jitter for upstream fetches.
36. Split HF sweep into paged queries by recency buckets to avoid the 100-item cap.
37. Track OpenRouter `created` timestamps vs HF `createdAt` — earliest wins as true release date.
38. Add robots-friendly `If-Modified-Since` on feed requests.
39. Store per-source fetch health in the registry (`sources.hf.lastOk`).
40. Alert (workflow failure) when a source fails 3 sweeps in a row.
41. Add `--org` filter flag to discover-models for targeted sweeps.
42. Add `--since` flag to backfill a date range.
43. Include `supported_parameters` (tools, json_mode, vision) from OpenRouter into capability heuristics.
44. Detect tool-calling support and raise `claw` scores from data, not name-guessing.
45. Detect structured-output/JSON mode support → `extraction` score.
46. Detect audio/STT/TTS pipelines into the taxonomy (voice is a missing lane).
47. Detect embedding models — currently filtered out; add an `embedding` lane or separate registry.
48. Detect image-gen pipelines fully (text-to-image from HF tag) — the `image` lane needs them.
49. Detect video-gen pipelines — same for `video`.
50. Add RAG-oriented tags (long context + extraction) as a composite "knowledge work" lane.
51. Dedup `-batch`, `-latest`, `-free` OpenRouter variants into one canonical entry with `variants[]`.
52. Mark free-tier variants (`:free`) — spark lane gold.
53. Add region/hosting metadata where known (for the sovereignty story).
54. Track context-window changes over time as events.
55. Add "days since release" computed field to every card.
56. Auto-tag `open-weights` when HF org hosts weights.
57. Auto-tag `api-only` when OR-only with no HF counterpart.
58. Score "novelty": pipeline+modality combos rare in the registry get a novelty pill.
59. Emit `model-release` auto-posts only for significance ≥ threshold; batch the rest into a daily rollup post.
60. Auto-posts should include pricing + context + org in a comparison table vs same-family predecessors.
61. Auto-posts should link the model's registry page and any overlay note.
62. Add `npm run radar:report` — weekly markdown summary of adds/drops/price moves.
63. Commit radar diffs as structured commits (`chore(radar): +3 -1 price:2`).
64. Add registry JSON Schema + CI validation.
65. Add a `content/models/README.md` documenting every field.
66. Expose `registry.updatedAt` in the site footer.
67. Add `downloads7d`/`likes7d` momentum fields where HF exposes them.
68. Detect rumored/leaked weights appearing on HF ahead of announcement → radar hint with "leak" confidence.
69. Track HF org follows of major labs to catch stealth releases.
70. **[P0]** Add an admin "curation" JSON where editors can pin/denylist models without touching code.

## 2. Capability taxonomy & catalog (71–130)

71. **[P0]** Split `context` dimension into tiers (32k/128k/1M/10M) displayed as the actual window, not just a dot.
72. Add `cost` dimension — score affordability directly once pricing is ingested.
73. Add `reliability` dimension (uptime/provider count) once OR provider data lands.
74. Add `openness` dimension — open weights / gated / API-only.
75. Add `multilingual` dimension — detect language claims in cards.
76. Add `safety`/`steerability` dimension for alignment-tuned models.
77. Add `audio` lane (STT/TTS/voice agents) — real gap.
78. Add `embeddings` lane.
79. Add `ocr`/document-vision sub-lane under vision.
80. Add `translation` lane.
81. Add `search`/rerank lane for retrieval models.
82. Add `science` lane (protein, chemistry, weather models) — big applied surface.
83. Add `robotics` lane (VLA models) — coming wave.
84. Add `world-model`/`simulation` lane.
85. Add `on-device` lane (sub-4B + quant-friendly) — Meta's strength.
86. Add `privacy`/local-first lane — overlaps on-device.
87. Add `summarization` lane.
88. Add `tutoring`/education lane.
89. Add `companionship`/roleplay lane (huge real usage, underreported).
90. Add `legal`/`compliance` vertical lane.
91. Add `medical`/`clinical` vertical lane.
92. Add `finance` vertical lane.
93. Allow multi-note overlays (pros/cons strings) per model.
94. Let overlays carry `bestFor: ["startups","enterprise"]` audience tags.
95. Let overlays carry `avoid` caveats ("weak at tools", "verbose").
96. Show overlay `note` on the catalog card, not just the detail page.
97. Add per-capability filters: click a lane → full ranked list for that lane.
98. Add `/models/best/<lane>` static pages per lane (SEO gold: "best model for extraction").
99. Add compare view: `/models/compare?a=x&b=y` side-by-side matrix.
100. Add "vs" auto-pages for the top 10 frontier pairs.
101. Score decay: heuristic scores get `confidence` that rises with data richness.
102. Let users see the heuristic's reasoning ("scored 2 on vibecoding because name matches /coder/").
103. Show provenance per score cell, not per model (some scores curated, others heuristic).
104. Add "capability fingerprint" sparkline per model — a compact 17-cell strip.
105. Use fingerprints for "similar models" suggestions.
106. Rank catalog by composite "momentum": score × recency × engagement.
107. Add "underrated" badge: high heuristic score, low downloads.
108. Add "overhyped" badge: high downloads, weak scores (spicy but honest).
109. Let editors pin a "staff pick" per lane.
110. Add price-to-score scatterplot once pricing lands (value frontier chart).
111. Add latency-to-score scatterplot (fast frontier).
112. Add context-to-cost heatmap.
113. Filter catalog by open-weights only.
114. Filter catalog by modality.
115. Filter catalog by context tier.
116. Filter catalog by org/family.
117. Sort by releasedAt, score, price, latency.
118. Save filters in URL params for shareable views.
119. Add "this week in capabilities" delta view (new entries per lane).
120. Export catalog as CSV/JSON download.
121. Capability methodology page explaining the 0–3 scale and sources.
122. Per-lane "how we test/assess" notes.
123. Crowd-source score corrections via GitHub issue template.
124. Show number of models per lane on lane cards.
125. Highlight lane leaders (top score per lane) in a strip.
126. Add tier labels (S/A/B) as a digestible overlay on the 0–3 scale.
127. Matrix: sticky first column + header on scroll.
128. Matrix: click cell → explanation popover.
129. Matrix: export as image for social.
130. Publish the taxonomy as a standalone doc (citeable methodology).

## 3. Upcoming models & release intelligence (131–170)

131. **[P0]** Auto-expire radar hints after 14 days unless refreshed — stale signals erode trust.
132. Parse dates out of hint text ("coming October 7") into `eta`.
133. Group hints by org so the watchlist reads like a pipeline view.
134. Add "expected lane" guess per hint (codex→vibecoding, flash→spark).
135. Add source-link preview metadata (fetched og:title) on hint cards.
136. Confidence ladder UI: show all four tiers with counts.
137. Weekly "watchlist digest" section in the news digest.
138. Alert entry: when a watchlisted org ships anything, mark the hint "fulfilled".
139. Auto-close hints when the matching model hits the registry (fuzzy name match).
140. Add `relatedModel` link once fulfilled.
141. Let editors set `eta` manually per entry.
142. Show countdown chip for confirmed ETAs.
143. Track hit-rate of radar hints (accuracy metric = credibility).
144. Add earnings-call/scheduled-event sources (Google I/O, Connect, DevDay) with fixed dates.
145. Scrape lab changelogs/docs pages for new model ids.
146. Watch OpenRouter for new org namespaces appearing (new player signal).
147. Watch HF for labs creating placeholder repos (private→public flip).
148. Add status field: `watching | shipped | cancelled | stale`.
149. Filter watchlist to next-7-days on the page; archive the rest.
150. Add "missed predictions" section — own the misses.
151. RSS/subscribe for watchlist changes.
152. iCal feed for confirmed ETAs.
153. Per-org upcoming expectations table.
154. Show which hints came from which feed item (traceability).
155. Weight hints by source quality (lab blog > press > rumor).
156. Dedup hints across feeds by model name similarity.
157. Manual "add hint" script for editors (`npm run watch:add`).
158. Let hints carry `lanes: ["spark","chat"]`.
159. Surface upcoming entries on model detail pages of related models.
160. Weekly email-able watchlist markdown block.
161. Show "days on watchlist" chip.
162. Color-code org logos/initials on hint cards.
163. Compact mobile view for watchlist.
164. Archive view: all fulfilled/expired hints by month.
165. Print/CSS-friendly watchlist for reports.
166. JSON feed for the watchlist (`/api/upcoming`).
167. Radar hint provenance note on hover.
168. Merge curated+radar entries for the same expected model (dedup by name).
169. "Pre-release signals" explainer box on the section.
170. Quarterly "release calendar" page generated from history.

## 4. Pricing & economics coverage (171–220)

171. **[P0]** Ingest OpenRouter pricing into the registry; show $/1M tokens on every card.
172. Add price-history sparkline per model.
173. "Price movers this week" section.
174. Cost-per-task estimates (extraction job, coding session, agent run).
175. "Cheapest model that clears quality floor X" recommender.
176. Token-plan tracker: which labs offer bundles/subscriptions.
177. Free-tier tracker across providers.
178. Batch/discount pricing tracker.
179. Price-per-capability scatterplots (see §2).
180. "Value index": composite quality-per-dollar ranking.
181. Track price cuts as radar events + auto-posts.
182. Track deprecations/shutdowns — models get retired too.
183. Provider comparison table (same model, different hosts).
184. Region pricing notes where available.
185. Enterprise pricing signals (from news sweep).
186. "Cost of intelligence" monthly index — a number you own editorially.
187. GPU/inference cost trend coverage.
188. Quantization cost tradeoffs explainer.
189. Spot-price vs list-price reality checks.
190. Token-plan fine-print analysis series.
191. "What a billion tokens costs" calculator widget.
192. Pricing-page diffs: watch provider pricing pages for changes.
193. Cost-of-agents coverage: what an agentic task costs end-to-end.
194. Cheap-tier blind-test series (can you tell flash from flagship?).
195. Inference-provider economics deep dives (Groq, Cerebras speed premiums).
196. Token-plan abuse/limitations coverage.
197. "True cost" calculator incl. retries + context growth.
198. Pricing API for the site (`/api/pricing`).
199. Pricing changelog feed.
200. Weekly price-watch newsletter block.
201. Currency/format consistency (USD/1M tokens standard).
202. Show blended rate (input+output) with usage-profile presets.
203. "Break-even vs self-host" calculator for open weights.
204. Coverage of reserved/committed-use pricing.
205. Coverage of academic/nonprofit tiers.
206. Track government/enterprise contract pricing from disclosures.
207. Historical "price of frontier intelligence" chart (2023→now).
208. Articles on who benefits from each pricing shape.
209. Interview series: how teams choose models on cost.
210. "Router economics" explainer — cascades change the math.
211. Unit economics of the labs themselves (inference margins).
212. Coverage of subsidized pricing as market strategy.
213. Annual "state of model pricing" flagship report.
214. Flash-tier price/quality index (your signature stat).
215. Show effective price incl. context-length pricing tiers.
216. Warn on models with >x$/1M for casual users.
217. Price alerts feed for tracked models.
218. Compare same-model pricing across providers live.
219. "Affordable model leaderboard" — the flagship table for your thesis.
220. Sponsor slots on the pricing page later (see monetization).

## 5. Players & lab intelligence (221–260)

221. **[P0]** Per-player pages: live model list from registry, not just static text.
222. Player capability profile: aggregate their models' lane scores.
223. Player market-position summary (auto-generated from data + curated note).
224. Player release cadence chart (releases per month).
225. Player price posture (premium/mid/budget index).
226. Player openness score (weights published vs API-only).
227. Player lane-coverage radar chart.
228. "Player watch" digest: what each lab did this month.
229. Add funding/valuation context to player pages (sourced).
230. Add compute/cluster size estimates (public reports).
231. Add headcount/talent-flow signals.
232. Add geography/jurisdiction section (your sovereignty thesis).
233. Add distribution surfaces per player (cloud, devices, apps).
234. Add partner ecosystem notes.
235. Player-vs-player head-to-head pages.
236. Track exec departures/hires as player events.
237. Track model deprecations per player.
238. Add "bets" field: what each player's strategy appears to be.
239. Score players on each of your three axes (raw/SWE/flash).
240. Quarterly "state of the players" flagship article.
241. New-player detection: first-ever registry contact from an org.
242. Player timeline: major releases on a horizontal line.
243. Per-player RSS-able event feed.
244. Add confidence/sourcing labels to player claims.
245. Interview notes section per player.
246. Player pages link to all their upcoming-watchlist entries.
247. Track each player's pricing posture changes.
248. Add Eastern-lab coverage depth (Qwen, DeepSeek, Z.ai, Moonshot, MiniMax).
249. Track sovereign/national lab initiatives as players.
250. Track open-source collectives distinctly (Nous, EleutherAI legacy).
251. Player market-share estimates from OR usage data where public.
252. "Who's buying whom" tracker (M&A map).
253. Compute-provider relationships map (who's on NVIDIA vs TPU vs Trainium).
254. Track API uptime incidents per player.
255. Track policy/safety posture per player.
256. Track research output (papers per month) per player.
257. Player glossary: who's who for newcomers.
258. Add logos (license-clean) or generated monograms per player.
259. "Player to watch" monthly pick.
260. Aggregated "contender board" — your three-axis scorecard for the top 8.

## 6. Apps & tools directory (261–300)

261. **[P0]** Per-app pages with "which models power this" notes where known.
262. App capability tags matching your lane taxonomy.
263. App pricing model tags (free/subscription/usage).
264. App platform tags (web/iOS/API/CLI/extension).
265. "Apps by lane" cross-index (best coding tools, best agents).
266. App update tracker (major version releases).
267. Track which apps switch model backends (signal of model economics).
268. Agent-framework directory (LangGraph, CrewAI, AutoGen, OpenAI Agents).
269. Router/gateway tools directory (LiteLLM, OpenRouter itself, Portkey).
270. Eval/observability tools directory (Langfuse, Braintrust, Weights & Biases).
271. Local-inference tools (Ollama, LM Studio, llama.cpp, vllm).
272. Coding-agent tools (Devin, Cursor, Claude Code, Codex, Windsurf).
273. Creative tools (image/video/audio AI apps).
274. Enterprise deployment platforms (Bedrock, Vertex, Azure AI).
275. Data/synthetic-data tools.
276. App-of-the-week editorial slot.
277. "Stack maps": what a production AI stack looks like per use-case.
278. Track app funding rounds (they're demand signals).
279. Track app shutdowns — consolidation is a story.
280. User-rating/widget later (see community).
281. Apps index page sorted by category.
282. JSON feed for apps registry.
283. App detail OG images generated per app.
284. "Built on X" badges linking app→model pages.
285. Track benchmark/winner roundups per app category.
286. Open-source vs hosted badge per app.
287. Region/availability notes (China apps, EU apps).
288. Integration maps (which apps connect to which ecosystems).
289. Security/incident notes per app where relevant.
290. "Try it" links with affiliate-friendly structure (later).
291. App changelog aggregation.
292. App alternatives lists ("alternatives to Cursor").
293. Team-size/pricing-tier fit notes.
294. Editor verdict per app (short).
295. Community tips per app (later).
296. App release radar hook: detect new AI apps from news feeds.
297. API-playground links where available.
298. Mobile-app tracker (on-device AI usage).
299. Browser-extension AI tools section.
300. "App vs raw API" cost comparison notes.

## 7. Applied AI & deployments coverage (301–350)

301. **[P0]** Case-study format: org → workflow → model → outcome → source. Repeatable template.
302. Deployment tracker: structured `content/deployments/registry.json` (org, sector, model, vendor, scale, status, source, date).
303. Deployments page with sector filters (health, finance, gov, retail, manufacturing, logistics, energy).
304. Government deployments registry (country, agency, system, model, procurement route).
305. "AI in the state" monthly column — public sector moves.
306. ROI-evidence tracker: deployments reporting measurable outcomes vs PR fluff.
307. "Pilot purgatory" tracker: announced pilots with no follow-up after 6 months.
308. Failure postmortems: deployments that were rolled back, and why.
309. Procurement-watch: government AI contract awards (USASpending, TED).
310. Sovereign-AI tracker: national models and compute programs.
311. Hospital/clinical deployment coverage with evidence labels.
312. Legal-sector AI deployments.
313. Education-sector deployments.
314. Agriculture/climate AI deployments (world-problems lane).
315. Humanitarian AI (crisis mapping, translation for refugees, disaster response).
316. Accessibility AI deployments (vision→description for blind users etc.).
317. "AI in manufacturing" — line vision, predictive maintenance.
318. Energy-sector AI (grid optimization, permitting).
319. Supply-chain/logistics deployments.
320. Financial-services deployments (fraud, claims, underwriting).
321. Insurance-sector tracker.
322. Retail/customer-service deployments with deflection metrics.
323. Telecom deployments.
324. Defense-adjacent coverage (careful, sourced, non-operational).
325. "AI at the city level" — municipal deployments.
326. Scientific discovery tracker (materials, drugs, weather).
327. Conservation AI (poaching detection, species tracking).
328. Language-preservation AI projects.
329. Disaster-response AI.
330. "Adoption curves": sector-by-sector penetration estimates.
331. Workforce impact tracker (augmentation vs displacement, sourced).
332. Union/labor responses to deployments.
333. Regulation-impact on deployment velocity (EU AI Act watch).
334. "What the earnings calls say" — quarterly deployment mentions.
335. Vendor case-study audits: reading the fine print.
336. "Applied" editorial standard page (what counts as a deployment).
337. Applied RSS sub-feed.
338. Deployment-of-the-week slot in the digest.
339. Interview series: practitioners running production AI.
340. "Build vs buy" case studies.
341. Migration stories (org switched model vendors — why).
342. Shadow-AI usage coverage (unauthorized employee AI).
343. Compliance/architecture patterns series (RAG-in-VPC, on-prem).
344. Public-sector model choices (which models pass procurement).
345. "One year later" revisits of famous deployments.
346. Regional deployment patterns (Asia vs EU vs US adoption shapes).
347. SME (small business) AI adoption coverage.
348. Nonprofit AI deployments.
349. "AI for X" explainers tied to real deployments, not hype.
350. Applied category in search with sector facets.

## 8. News operations (351–400)

351. **[P0]** Fix dead feeds: Anthropic, Meta, Mistral, Reuters, Verge all 404 — replace with working endpoints.
352. Add Google News AI topic RSS as a catch-all backstop.
353. Add Ars Technica, The Information AI, Semafor Tech feeds.
354. Add FT AI, Bloomberg Tech, WSJ Tech feeds where accessible.
355. Add CNBC AI, Axios AI feeds.
356. Add Wired AI, IEEE Spectrum feeds.
357. Add Import AI (Jack Clark) newsletter feed — high signal.
358. Add The Batch (DeepLearning.AI) feed.
359. Add Interconnects (Nathan Lambert) feed.
360. Add China-specific sources (36Kr EN, Pandaily) for Eastern coverage.
361. Add EU sources (Sifted AI, Euractiv tech).
362. Add government feeds (NIST AI, OECD AI, EU AI Office).
363. Add arXiv digest sources for research highlights.
364. Add lab-status-page feeds (incidents are news).
365. Per-feed health dashboard (last ok, item count, failure streak) in a JSON artifact.
366. Auto-disable feeds that fail 5 consecutive runs (with comment in file).
367. Atom feed support in the parser (several good sources are Atom-only).
368. Parse `dc:date` and `updated` as date fallbacks.
369. Better dedup: normalize titles (strip source suffixes like "| TechCrunch").
370. Cross-source story clustering: same story from 3 outlets = one cluster with sources[].
371. Story significance score (sources × recency × keywords).
372. "Top story" auto-selection for the digest lead.
373. Breaking-news mode: flag items < 2h old in the digest.
374. Category routing improvements: more keywords + feed priors.
375. Add `earnings` category (quarterly AI revenue mentions).
376. Add `talent` category (exec moves, lab defections).
377. Add `compute`/`chips` category (datacenter news — it drives everything).
378. Add `open-source` category.
379. Add `safety`/`incidents` category (model failures, jailbreaks).
380. Digest should link the original item AND our related coverage.
381. Per-category digest sections with counts.
382. Digest "quiet period" honesty: say when a week was thin.
383. Nightly vs weekly: daily digest option since automation is cheap.
384. Digest OG image auto-generated per week.
385. Digest email-ready plaintext variant.
386. Feed of only-lab-sources (primary-source stream) as separate page.
387. "Claims vs confirmations" labeling on digest items.
388. Track prediction/announcement accuracy per source.
389. News API (`/api/news`) from stored items (persist items to JSON, not just MDX).
390. Persist raw items to `content/news/items-YYYY-WW.json` for reuse.
391. Search index should include news items, not just posts.
392. Alert channel: workflow posts top stories to a webhook (Discord/Slack).
393. GitHub Action summary output: list new digest + hints each run.
394. Retry logic per feed with exponential backoff.
395. Feed parser unit tests with fixture XML.
396. Handle paywalled feeds gracefully (mark, don't drop).
397. Language detection → route non-EN items to a "global" section.
398. Timezone-correct "week of" labeling (UTC).
399. Manual news-item script for editors (`npm run news:add`).
400. Digest edit window: editors can patch generated MDX pre-publish via PR.

## 9. Editorial formats & article ideas (401–490)

401. **[P0]** "Model of the Week" flagship column — deep look at one registry contact.
402. "The Month in Models" recap — your signature post, generated draft + editorial.
403. "Radar Anomalies" column — weird things the sweep caught.
404. "Three Axes" ongoing series extending your flagship framework.
405. Head-to-head test series: same prompts, two models, honest output diffs.
406. "Cheap vs flagship" blind-test series (the affordable-squeeze companion).
407. "One task, five models" practical series (extraction, landing page, agent task).
408. Agent-task benchmark series: real multi-step tasks, not synthetic evals.
409. "What changed for developers" monthly — SDK/tooling deltas.
410. "Context windows in practice" — what 1M tokens actually does for you.
411. Latency deep-dive: p50/p95/TTFT across providers.
412. "The quiet release" series — significant models with no marketing.
413. Postmortem series on failed AI products (Rabbit, Humane-class).
414. "Deprecation diaries" — what happens when your model goes away.
415. Interview series: lab engineers, router builders, deployers.
416. Reader-question mailbag column.
417. "Glossary" series building a shared vocabulary (one term per post).
418. "Benchmarks explained" series — what each eval actually measures.
419. Eval-gaming coverage — saturated/contaminated benchmarks.
420. "The fine print" series — reading ToS, data policies, pricing terms.
421. Regional coverage: AI in India, SEA, MENA, LATAM, Africa.
422. China-lab English-language coverage (gap in Western press).
423. Open-weights monthly: what the community shipped.
424. Fine-tune-of-the-week spotlight.
425. "Research that matters" — 3 papers/month explained plainly.
426. Hardware layer: chips, interconnects, datacenters explained.
427. Energy/water footprint coverage.
428. Compute-politics coverage (export controls, chip diplomacy).
429. "The business of inference" series.
430. Regulatory tracker column (monthly, per-jurisdiction).
431. Court-case tracker (AI litigation that matters).
432. Safety-incident tracker with severity labels.
433. "Capabilities overhang" essays — what models can already do unused.
434. Labor-market impact series.
435. "AI in the wild" photo/screenshot essays of real deployments.
436. Charts-only posts ("the week in five charts").
437. Data-viz series: animated model-landscape evolution.
438. "Predictions ledger" — public scorecard of your own calls.
439. Annual predictions post + next-year review.
440. "Ask the radar" — answer questions with registry data.
441. Collaborative posts with practitioners (guest lane).
442. Rebuttal/counterpoint format for hot takes.
443. "Correction corner" — visible errata culture (trust builder).
444. Explainer refresh: update evergreen articles as the field moves.
445. "Living documents" — maintained guides (best models, how to choose).
446. "How we work" transparency post (automation + editorial process).
447. Anniversary/state-of-the-site posts.
448. Week-in-review for the site itself (changelog posts).
449. Podcast/video-companion posts later.
450. Article series bundling into "guides" pages.
451. Seasonal formats: year-end awards ("the Toward AGI awards").
452. "Undercovered" column — stories the majors skipped.
453. Source-of-the-week (highlight a great feed/newsletter).
454. Tool-of-the-week for builders.
455. "Numbers that matter" — stat-driven short posts.
456. Myth-busting format ("no, X is not Y").
457. "Timeline of a release" reconstruction posts.
458. "The same model, different names" decoder (aliases, SKUs).
459. "What enterprises actually deploy" recurring feature.
460. Opinion section with labeled viewpoint pieces.
461. "Steel-man" format: the best case for each lab's strategy.
462. Scenario pieces (if X ships, the market does Y).
463. Book/paper review lane.
464. Conference coverage (NeurIPS, ICLR, DevDays) with a lens.
465. "AI numbers of the week" sidebar.
466. Milestone tracker: context/price/speed records as they fall.
467. "First contact" reviews — fast hands-on within hours of release.
468. "Second look" reviews — after the hype settles, 30 days later.
469. Regression-watch: did the new version get worse at anything?
470. Longevity coverage — models that stayed useful.
471. Niche-use deep dives (AI for chess, for CAD, for sheet music).
472. Accessibility angle on major releases.
473. Environmental/energy angle on major releases.
474. Developer-experience reviews (docs, SDK quality).
475. "Build this weekend" project posts using covered models.
476. Reproducible mini-eval posts (methodology transparent).
477. "Prompt archaeology" — how prompting practices evolve.
478. Failure-mode taxonomy articles.
479. "State of agents" quarterly.
480. "State of open weights" quarterly.
481. "State of flash tiers" quarterly — your signature beat.
482. "State of applied AI" quarterly — your other signature beat.
483. Cross-post partnerships with aligned newsletters.
484. Syndication-friendly summaries under each article.
485. Author prediction markets (small stakes, fun, tracked).
486. "Debate" format between two contributors.
487. Data-appendix pattern: every analysis links its underlying JSON.
488. "Update log" footer on maintained articles.
489. Article series navigation (prev/next in series).
490. "Start here" curated reading path for newcomers.

## 10. Education & explainers (491–530)

491. **[P0]** "Choose a model" interactive decision tree (task → constraints → lanes).
492. Tokens/context/params/pricing fundamentals explainer set.
493. "What is a flash tier" explainer (your taxonomy, taught).
494. Open-weights vs API explainer with real tradeoffs.
495. Quantization explained (GGUF/AWQ/MLX, what the numbers mean).
496. MoE explained with the models you cover as examples.
497. Distillation explained — relevant to your DeepSeek coverage.
498. Reasoning-models explained (test-time compute).
499. Agent/tool-use explainer — the "claw" lane taught.
500. RAG explained — the extraction lane taught.
501. Structured-output/function-calling tutorial series.
502. "Reading a model card" tutorial.
503. "Reading a benchmark" tutorial.
504. Latency/TTFT/throughput explainer.
505. Cost-modeling tutorial (estimating a workload's bill).
506. Self-hosting guide series (hardware → serving → quant).
507. Provider-switching guide (avoiding lock-in).
508. Prompting fundamentals (system prompts, few-shot, structure).
509. Eval-design basics for teams.
510. "The vocabulary of AI economics" glossary.
511. History series: transformer → scaling laws → agents.
512. Timeline interactive: 2017→now capability milestones.
513. "How the radar works" technical post (your own stack).
514. Contributor guides (how to file a model, how to write a dispatch).
515. Educator notes: teachable excerpts per article.
516. FAQ page answering the 20 most common questions.
517. Beginner path: "AI for people who haven't kept up".
518. Practitioner path: "AI for engineers who need specifics".
519. Executive path: "AI for decision-makers" (the applied lens).
520. Glossary autocomplete in articles (term → tooltip).
521. "Diffs" series: GPT vs Claude vs Gemini explained for switchers.
522. Model-family trees explained (who descends from whom).
523. Licensing explainers (what Llama's license actually allows).
524. Safety/alignment primer series.
525. "How evals get gamed" explainer.
526. Context-engineering explainer (the craft around the model).
527. Agent-architecture primer (loops, tools, memory, guardrails).
528. "Inference economics" explainer tying your pricing coverage together.
529. Quiz/check-yourself elements in education posts.
530. Printable cheat-sheets (lane map, pricing table, glossary).

## 11. Search, navigation & discovery UX (531–570)

531. **[P0]** Unified search: models + posts + players + apps in one index.
532. Command palette (⌘K) for power users.
533. Search facets: type, category, lane, org, date.
534. Search for capabilities ("models good at extraction").
535. Search synonyms (vibecoding→code, claw→agent, spark→fast).
536. Search result grouping by entity type.
537. Recent-searches + trending-searches chips.
538. Search analytics → informs editorial (what people can't find).
539. "Did you mean" for org aliases.
540. Keyboard navigation on list pages (j/k).
541. Filter persistence via URL params everywhere.
542. Breadcrumbs on deep pages.
543. Related-models row on every model page (same family/lane).
544. Related-posts already exist — extend with lane overlap.
545. "New since your last visit" marker (localStorage).
546. Recently-viewed rail.
547. Pinned/sticky section nav on long pages (models page is long).
548. Jump-to-section chips on /models.
549. Infinite scroll or "load more" on registry (it's long).
550. Virtualized list for registry performance.
551. Sortable table headers on the matrix.
552. Density toggle (compact/comfortable).
553. "Back to top" exists — add mini-TOC too.
554. Lane shortcuts in nav dropdown (Models ▸ by lane).
555. Cross-link apps→models→players aggressively.
556. Empty-state CTAs everywhere (search, filters, watchlist).
557. "Random model" fun feature (discovery delight).
548+. "Model roulette" per lane.
559. Site map page for humans (not just sitemap.xml).
560. Onboarding tour for first-time visitors (dismissible).
561. "What's new" changelog page.
562. Feed discovery page (all feeds/endpoints listed).
563. Bookmark/save for later (localStorage-based).
564. Share-this-view buttons on filtered catalogs.
565. Print-friendly stylesheet.
566. Deep-link anchors on every section (stable ids).
567. Hover-cards on model mentions in articles (mini-dossier).
568. Inline model chips in articles (render `model:` refs as links).
569. "Last verified" timestamps on data-driven claims.
570. Site-wide "data as of" indicator in footer.

## 12. Design, UX & accessibility (571–630)

571. **[P0]** Audit contrast on dim text (fog/dim on void may fail WCAG AA at small sizes).
572. Focus-visible styles audit across interactive elements.
573. Reduce-motion media query for all GSAP/marquee/sweep animations.
574. Canvas hero: pause when tab hidden; respect prefers-reduced-motion.
575. Screen-reader labels on score dots (already aria-label — verify).
576. Table semantics on the matrix (scope, headers).
577. Skip-link covers all nav levels.
578. Tap-target sizes on mobile pills (44px).
579. Font-loading strategy (swap, preload, subset).
580. Dark-only theme: add a light theme toggle (reader preference).
581. Reader mode / article "focus" mode (strip chrome).
582. Font-size control on articles.
583. Serif/sans reading-font toggle.
584. Code-block line numbers + wrap toggle.
585. Table overflow scroll shadows (indicate scrollability).
586. Skeleton loaders for client components.
587. Perceived-perf: LCP image priorities, font subsetting.
588. OG images per article auto-generated (extend @vercel/og).
589. OG images per model page (capability strip in the image!).
590. OG images per category page.
591. Favicon/brand refresh pass.
592. 404 page with radar theme (already good — add search box).
593. Error boundaries with friendly fallbacks.
594. Offline fallback page (PWA exists — wire the offline route).
595. Install-to-homescreen prompt for PWA.
596. App-icon generation at all sizes.
597. Share-sheet integration via Web Share API.
598. Copy-link buttons on section anchors.
599. Copy-citation button on articles (formatted credit).
600. Estimated-read-time already exists — add "listen time" if TTS ever lands.
601. Article audio (TTS) — accessibility + convenience.
602. Multi-format: AMP is dead, but ensure clean reader-mode DOM.
603. RTL layout support groundwork.
604. i18n scaffolding (translate the chrome first, content later).
605. Localized OG images.
606. Color-blind-safe palette check on score colors.
607. Consistent hover/focus/active state tokens.
608. Motion-design tokens (durations/easings unified).
609. Spacing/typography scale audit (design-token audit skill).
610. Component visual-regression tests (Playwright screenshots).
611. Storybook or a /design-system page for components.
612. Empty/loading/error states for every data section.
613. Consistent card density across sections.
614. Mobile nav: add search + categories (currently desktop-heavy).
615. Sticky section headers inside long tables.
616. Print CSS: articles print cleanly.
617. RSS-reader-friendly content (feeds render well).
618. Email-friendly digest format.
619. High-contrast mode support.
620. Reduced-data mode (skip 3D/heavy assets).
621. prefers-color-scheme respect (if light theme lands).
622. Focus management on route changes (a11y).
623. Form controls styling consistency (search box, contribute).
624. Badge/pill consistency across sections.
625. Icon set consolidation (currently inline SVGs).
626. Brand-glyph usage consistent (signal color).
627. Page transitions (subtle, skippable).
628. Loading route states (app router loading.tsx).
629. Suspense boundaries on slow sections.
630. Design QA checklist for new sections.

## 13. Performance & infrastructure (631–670)

631. **[P0]** `next.config` image optimization + cache headers audit.
632. Route-level caching headers for registry/API routes.
633. ISR on /models (revalidate hourly) instead of full static.
634. Split registry JSON — serve top-N first, stream the tail.
635. Precompute capability scores at build → ship less JS.
636. Bundle audit (Three.js/GSAP lazy-load boundaries).
637. Route-level code splitting review.
638. Font subsetting + self-hosting.
639. Edge-cached feeds (feed.xml/feed.json).
640. Sitemap segmented (posts/models/categories).
641. robots.txt review vs AI-crawler policy (explicit stance).
642. llms.txt at the root (AI-crawler readable summary).
643. Security headers audit (already has some — verify CSP).
644. Dependency audit + update cadence (npm audit in CI).
645. Node version pin (`.nvmrc`/engines).
646. CI: build + typecheck + lint on PRs.
647. CI: link-checker on content files.
648. CI: frontmatter schema validation.
649. CI: registry JSON validation.
650. CI: Lighthouse budget on key pages.
651. CI: detect MDX parse failures early.
652. Pre-commit hooks (lint staged).
653. Preview deployments on PRs (Vercel does this — verify enabled).
654. Comment deploy previews on PRs.
655. Branch protection on master.
656. Release tagging cadence.
657. Error tracking (Sentry or similar).
658. Uptime monitoring (Vercel analytics + external ping).
659. Log drains for serverless functions.
660. Cost monitoring on Vercel usage.
661. Image CDN for any future raster assets.
662. Static export feasibility review (could make hosting trivial).
663. Fallback data if content JSON corrupts (graceful degradation).
664. Content backup strategy (git is the backup — document it).
665. Disaster-recovery doc (redeploy from scratch).
666. `.env.example` even if empty (documents assumptions).
667. Node runtime for OG/feed routes (edge deprecation warnings exist).
668. Fix the edge-runtime deprecation warnings in build output.
669. Build-time budget alert (501→225 pages helped; keep watch).
670. Cold-start check on serverless routes.

## 14. SEO, feeds & distribution (671–720)

671. **[P0]** Programmatic SEO: `/models/best/<lane>` pages for all 17 lanes.
672. `/models/vs/<a>/<b>` comparison pages for top pairs.
673. `/models/family/<family>` lineage pages.
674. `/models/org/<org>` pages (canonical org landing).
675. `/category/applied/sector/<sector>` pages.
676. Structured data: Article schema on every post.
677. Structured data: TechArticle/Dataset on model pages.
678. Structured data: ItemList on catalog/matrix.
679. Structured data: FAQPage on glossary/education.
680. Breadcrumb structured data.
681. Meta descriptions audit (unique per page).
682. Canonical URLs consistent (BASE const vs vercel.app domain — pick one).
683. Update BASE domain now that towardagi.vercel.app is live.
684. Title-template audit (`%s — Toward AGI`).
685. OpenGraph tags audit on all routes.
686. Twitter card types (summary_large_image for articles).
687. RSS full-content vs excerpt decision per category.
688. JSON Feed spec compliance check.
689. Per-category RSS feeds (/category/x/feed.xml).
690. Per-lane RSS feeds (new models in a lane!).
691. Email newsletter plumbing (Buttondown/Resend — digest is ready-made).
692. Weekly digest email = the auto-digest, minimal extra work.
693. Social auto-posting hook on new posts (MCP: facebook/twitter).
694. Generated share-cards for articles.
695. Embeddable widgets (capability badge for a model — devs embed).
696. "Powered by Toward AGI radar" attribution on embeds.
697. Press/media kit page (logo, boilerplate, key stats).
698. Google Search Console integration (skill exists — verify indexing).
699. Bing Webmaster submission.
700. IndexNow ping on deploy.
701. HN/Reddit-friendly share titles on articles.
702. Canonical cross-posting to dev.to/Medium with canonical links.
703. Archive.org-friendly clean URLs.
704. Permalinks policy documented.
705. Slug stability — never rename slugs once published (redirects if so).
706. Redirect map for any future URL changes.
707. Outbound link attribution (utm on external refs?).
708. Internal-link graph audit (orphan pages).
709. Search-engine-visible data freshness (dates in SERP).
710. Author E-E-A-T signals (bios, credentials, contact).
711. About/methodology page expansion (trust signals).
712. Editorial policy page (corrections, sourcing, AI-use disclosure).
713. Citation style for sources (consistent footnotes/links).
714. "Cite this page" block on evergreen pages.
715. Google News sitemap eligibility check.
716. Discover-friendly featured images.
717. Multilingual SEO groundwork (hreflang later).
718. Video schema if video content ever lands.
719. Event schema for confirmed upcoming releases.
720. Sitemap `lastmod` accuracy.

## 15. Community & contributions (721–760)

721. **[P0]** GitHub issue templates: submit-model, submit-deployment, correction, pitch.
722. CONTRIBUTING.md with the editorial bar and style guide.
723. "Fix this score" flow: each model page links to a pre-filled issue.
724. PR template for content contributions.
725. Contributor leaderboard page.
726. Author pages get post counts + lanes covered.
727. Guest-author onboarding doc.
728. "Community picks" — reader-nominated model spotlight.
729. Comment system (Giscus — GitHub-backed, fits the stack).
730. Lightweight reactions on articles (no login needed).
731. Reader poll widget (monthly "best model for X" votes).
732. Tip line: anonymous deployment stories (source protection).
733. AMAs with practitioners (recruited via posts).
734. Discord/Slack community later.
735. "Readers' deployments" — submitted case studies.
736. Correction bounty: credit readers who catch errors.
737. Translation contributors (i18n groundwork first).
738. Academic contributor lane (researchers explaining papers).
739. Practitioner reviewer pool (fact-checkers).
740. Community radar: readers submit sightings (HF repos, leaks).
741. Moderation policy doc.
742. Code-of-conduct doc.
743. Contributor CLA/licensing clarity.
744. "How we verify" transparency for community submissions.
745. Featured-comment highlights in articles.
746. Reader-sourced data appendix contributions.
747. Community calls/office hours.
748. Swag/recognition for top contributors (later).
749. Regional correspondents program.
750. Student contributor program.
751. Cross-publication contributor swaps.
752. Community-run eval efforts (shared methodology).
753. Public roadmap voting.
754. Feedback widget on every page (1-click).
755. "Was this useful?" signal on articles.
756. Report-broken-link button.
757. Suggest-a-topic form.
758. Bounty board for wanted articles.
759. Contributor changelog credit on articles.
760. Annual community survey → published results.

## 16. Analytics & measurement (761–790)

761. **[P0]** Vercel Web Analytics + Speed Insights enabled (one line).
762. Privacy-respecting event analytics (no cookies needed).
763. Track searches (what people look for).
764. Track lane-card clicks (which tasks readers care about).
765. Track filter usage.
766. Track outbound clicks (which links earn attention).
767. Track scroll depth on articles.
768. Track "last 30 days" engagement vs registry engagement.
769. Track watchlist section interest.
770. Track RSS feed fetches (subscriber proxy).
771. Track 404s (broken expectations).
772. Track returning-visitor rate.
773. Weekly metrics snapshot committed (public transparency).
774. Public stats page (readers love openness).
775. Content-performance dashboard (top posts by lane).
776. A/B-free editorial learning: watch what topics retain.
777. Measure radar-hint accuracy over time.
778. Measure digest item click-through.
779. Track which models get detail-page views.
780. Track compare/matrix engagement.
781. Search-zero-results log → content gaps.
782. Newsletter conversion tracking (when email lands).
783. Referrer analysis (HN/Reddit spikes).
784. Seasonal patterns (conference weeks).
785. Geographic distribution (informs regional coverage).
786. Device split (mobile vs desktop reading).
787. Performance metrics (LCP/CLS/INP) monitored.
788. Alert on traffic anomalies (down = broken deploy).
789. Content-decay tracking (old articles still read → refresh candidates).
790. Annual "year in numbers" report.

## 17. Personalization & accounts (791–820)

791. **[P0]** "Follow a lane" — localStorage subscriptions to capability lanes.
792. Follow an org/player.
793. Follow a watchlist entry.
794. "Your radar" personalized feed (followed lanes/orgs only).
795. Reading history (localStorage).
796. Saved articles/models (localStorage).
797. "New since you visited" badges.
798. Digest-your-way: pick categories for a custom weekly view.
799. Compact/pro display preference.
800. Table column preferences on the matrix.
801. Default filters remembered.
802. Optional accounts later (only if community features need them).
803. Magic-link auth if accounts ever land (avoid passwords).
804. Synced saves via account (later).
805. Email alerts per follow (when email infra lands).
806. Webhook alerts for power users (GitHub-style).
807. Personal API keys for the JSON API (later, if needed).
808. Reading-list export.
809. Shareable "my stack" page (models you follow).
810. Recommendation row: "because you viewed X".
811. Onboarding quiz → recommended lanes.
812. Role-based views (builder/researcher/exec presets).
813. Saved searches.
814. Notification preferences center.
815. Do-not-track respect everywhere.
816. Data-export for user data (GDPR-ready even for localStorage).
817. Account deletion flow (if accounts land).
818. Privacy policy updated for any tracking added.
819. Cookie-free pledge maintained.
820. Accessibility preferences persisted.

## 18. Automation & AI-assisted ops (821–870)

821. **[P0]** Auto-draft "first contact" posts for significant releases (editor reviews, not auto-publishes).
822. Auto-digest weekly digest already exists — add human-edit step via PR flow.
823. Auto-summarize lab posts into briefing notes for editors.
824. Auto-compare new models vs predecessors (draft tables).
825. Auto-flag capability overlay candidates (new notable model → overlay TODO).
826. Auto-expire stale content flags ("this article is >1yr old").
827. Auto-link mentions: scan articles for model names → link to dossiers.
828. Auto-generate social snippets per post.
829. Auto-generate OG images per post.
830. Auto-translate digests later (when i18n lands).
831. CI job: weekly `npm run prune` (keep registry clean).
832. CI job: daily feed-health report.
833. CI job: broken-link sweep.
834. CI job: frontmatter lint.
835. CI job: image/asset audit.
836. Workflow: manual "publish" dispatch that runs full pipeline.
837. Workflow: scheduled branch cleanup.
838. Workflow: weekly dependency-update PRs (dependabot).
839. Radar → Slack/Discord notifications.
840. Radar → webhook for external consumers.
841. Auto-update players' "latest model" fields.
842. Auto-update pricing snapshots.
843. Auto-refresh "last 30 days" stats.
844. Auto-close fulfilled watchlist entries.
845. Auto-detect new feeds from cited sources.
846. Auto-classify news items with a small local classifier (no API needed).
847. Optional LLM classification pass (if you wire an API key later).
848. Auto-deduplicate registry entries.
849. Auto-backfill missing metadata on registry entries.
850. Auto-generate related-content blocks.
851. Auto-TOC validation (headings ↔ extractToc).
852. Auto reading-time accuracy check.
853. Auto-alt-text for generated art.
854. Auto-format MDX files (prettier for content).
855. Auto-citation formatter for sources.
856. Auto-changelog generation from commits.
857. Auto-version the content JSONs.
858. Auto-archive old auto-posts into year folders.
859. Auto-detect orphan content (posts with broken links).
860. Auto-verify upstream URLs in posts (link rot check).
861. Auto-screenshot pages for social cards.
862. Auto-generate print/PDF versions of flagship reports.
863. Auto-backup content to a second remote.
864. Auto-retry flaky workflow steps.
865. Auto-comment on PRs with content previews.
866. Auto-label PRs (content/code/infra).
867. Auto-assign reviewers by path.
868. Auto-notify on radar anomalies (new org, mass deletions).
869. Self-healing: rebuild registry from sources if corrupted.
870. Ops runbook doc for all automation.

## 19. Monetization & sustainability (871–910)

871. **[P0]** Sponsor-slot design on radar/pricing pages (relevant, labeled).
872. "Supported by" transparency policy.
873. Premium weekly brief (the digest, polished) later.
874. Pro tier: API access + alerts + exports.
875. Consulting/research services sidebar (later).
876. Job board for AI deployment roles (fits applied beat).
877. Events/webinars later.
878. Report sales (annual "State of Model Economics").
879. Data licensing (registry + capability data as a product).
880. Affiliate links on app directory (labeled).
881. Book/tool affiliate (labeled).
882. Donations/membership (open-publication patronage).
883. Founding-member program.
884. Sponsored-content firewall policy.
885. Rate card page.
886. Advertiser guidelines (no AI-hype ads; aligned sponsors).
887. Sponsorship disclosure components.
888. Newsletter monetization (sponsors on the weekly).
889. API usage-based pricing later.
890. Workshop/training offerings (teams adopting AI).
891. "Hire us to evaluate your stack" service page.
892. Grant/fellowship funding for journalism (research-aligned).
893. Partnership revenue (labs sponsoring coverage areas — carefully).
894. Paywall-free pledge (growth-first monetization).
895. Merch (the aesthetic is strong — later).
896. Conference speaking pipeline (brand building).
897. Media partnerships/syndication deals.
898. White-label radar for enterprises (internal model tracking).
899. Team subscriptions (companies tracking their vendors).
900. Benchmark/report sponsorships.
901. Donation transparency page.
902. Revenue dashboard (public, indie-style).
903. Cost-transparency page ("what it costs to run").
904. Sustainability plan doc.
905. Contributor revenue-share model (later).
906. Premium research requests (readers commission analyses).
907. Sponsored data-viz slots.
908. Event sponsorships.
909. "Powered by" B2B licensing.
910. Long-term: the data asset (registry history) is the moat.

## 20. Editorial standards & trust (911–940)

911. **[P0]** Corrections policy page + visible correction log.
912. AI-use disclosure (automation is already labeled — formalize).
913. Sourcing standards doc (primary > press > rumor).
914. Conflict-of-interest disclosure template for authors.
915. Review methodology doc for hands-on pieces.
916. "Confidence labels" standard for predictions/claims.
917. No-unnamed-sources policy (or strict rules for exceptions).
918. Fact-check workflow for flagship articles.
919. Image/manipulation policy (AI images labeled).
920. Quotation/paraphrase accuracy standards.
921. Link-to-source mandate on claims.
922. Distinguish analysis vs news vs opinion labels.
923. "Speculation" labeling on forward-looking claims.
924. Retraction policy.
925. Right-of-reply policy for covered orgs.
926. Embargo policy.
927. Anonymity/source-protection policy.
928. Comment/community standards.
929. Plagiarism/originality checks on submissions.
930. Author verification process.
931. Data-integrity standard (JSONs are auditable).
932. Methodology versioning (capability scores v1, v2...).
933. Public changelog of methodology changes.
934. Independence statement (no lab funding without disclosure).
935. Error-bounty (see community).
936. Annual transparency report.
937. Archive policy (nothing deleted, corrections annotated).
938. Syndication/reuse license clarity.
939. Accessibility statement.
940. Editorial board/advisors page (credibility).

## 21. Bold bets & moonshots (941–1000)

941. **[P0]** "The Index": your own composite score — Toward AGI Model Index combining capability, cost, latency, openness.
942. Live benchmarks: small reproducible evals run nightly on key models.
943. A public "capability frontier" chart tracking best-model-per-lane over time.
944. "AGI timeline" dashboard: milestones vs predictions.
945. Model-deprecation early-warning (watch usage-drop signals).
946. Release-prediction engine: cadence-based ETAs per lab.
947. "What shipped while you slept" morning briefing.
948. The router's-eye view: which model *should* serve which request.
949. Cost-of-capability index: $ per capability-point over time.
950. "Where the intelligence lives" map: compute geography.
951. Sovereign-AI readiness index per country.
952. Open-weights health index (release cadence, license quality, community).
953. Agent-reliability index: tracked failure rates on real tasks.
954. Applied-AI penetration index per sector.
955. Flash-tier quality index (your signature stat, quantified).
956. "The gap chart": open vs closed capability distance over time.
957. Latency frontier chart (speed vs quality Pareto).
958. "Frontier watch": distance to specific capability thresholds.
959. Interactive model-family tree explorer.
960. Interactive timeline of AI since 2017.
961. A living "state of the art" page per lane (auto-maintained).
962. Model card diff-viewer (what changed between versions).
963. "Model genealogy": fine-tune lineage graphs.
964. Prediction ledger vs reality (public accountability).
965. Quarterly "contender board" report (your three-axis scorecard).
966. Annual Toward AGI awards (community-voted + editorial).
967. "The map is not the territory" eval-transparency initiative.
968. Public research agenda (questions you're tracking).
969. Dataset publication (your registry as research data).
970. API-first strategy: the radar as a developer product.
971. Embeddable "model ticker" for other sites.
972. Browser extension: model info on any page mentioning models.
973. Slack/Discord bot: "what's the best model for X" answers from your data.
974. Newsletter network effects (digest as wedge product).
975. Video explainers (the visuals are already strong).
976. Podcast feed from articles (TTS first, human later).
977. Live radar screensaver/PWA mode (ambient display).
978. Conference companion app (release tracker during events).
979. "Toward AGI Pro" research tier.
980. Academic partnerships (cite your index).
981. Standards body engagement (eval methodology input).
982. Journalism collaborations (supply data to outlets).
983. A book/zine compilation of flagship articles.
984. "Radar as infrastructure" — other pubs embedding your data.
985. Open-source the whole stack (already public — formalize).
986. Forkable publication template (others launch on your code).
987. Federation: sister publications sharing the radar.
988. "State of AI" annual flagship report (the big one).
989. Real-time release alerts (websocket/push).
990. Community-driven capability testing (distributed evals).
991. Model "birth certificates" — canonical release records.
992. Deprecation obituaries section (memorializing gone models).
993. "The long now" archive: preserving AI history as it happens.
994. Prediction-market integration on upcoming models.
995. AI-assisted article personalization (later).
996. Synthetic-interview format (labeled, experimental).
997. Automated translation of flagship pieces.
998. A physical/zine edition (the aesthetic deserves print).
999. Annual reader survey → "what the industry thinks" report.
1000. The endgame: Toward AGI becomes the reference record of the road to AGI — registry, history, and analysis as public infrastructure.
