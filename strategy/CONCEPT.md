# Blue Lagoon, AI-first

> A concept exploration. Designed to be read in 12–15 minutes by an internal Blue Lagoon leadership audience.

---

## 0. The one-page version

**The opportunity.** Every hospitality brand of our scale is bolting AI onto a booking funnel designed in the early 2000s and an operations culture that still runs on paper rosters and group chats. Blue Lagoon has something most of them don't: a single site, vertically integrated across spa, hotels, restaurants, and skincare retail; a brand that already means something specific (Iceland, the geothermal sublime, calm directness); and a footprint small enough to actually rebuild around AI rather than retrofit it.

**The bet.** This is what Blue Lagoon could look like if we rebuilt the guest journey and the operating model around AI today. Four pillars: a conversational guest journey that replaces the booking funnel with a dialogue; a facility operations copilot that helps the duty floor manager hold a hundred small decisions in their head; an ancillary revenue engine that prices treatments, F&B, hotel nights, and skincare to a guest's intent; and an internal copilot layer where every role — lifeguard, therapist, mask-bar attendant, F&B lead, hotel front desk, geothermal engineer — has a knowledge partner grounded in our own corpus.

**The shape of the org.** Small product squads own the guest-facing surfaces. A central AI platform team owns model selection, evaluation, and safety. Spa Operations, Therapy, F&B, and Hotels each get an AI partner lead. Geothermal and Facility Engineering keep humans in the loop forever. Headcount stays roughly flat; this is leverage on existing teams, not displacement.

**The honest constraints.** Guest data, including health-adjacent intake, must stay in-region under GDPR and Icelandic data residency expectations. The AI must never render medical advice; it hands off to a human Wellness Lead. Lagoon safety supervision is a regulated function — certified humans, not an AI tool. Staff comms have to start before any tool ships: the AI is leverage on judgment, not a layoff plan.

**Why now.** Late 2025 was a threshold for model capability — agents can hold context across long-horizon guest journeys and operational tasks. Inference cost is dropping roughly five-fold each year. And the competitive set has not meaningfully moved on AI. The window where a small, vertically integrated, single-site operator can leapfrog the category is open. We estimate it stays open for about eighteen months.

---

## 1. Thesis

Most "AI in hospitality" today is pattern recognition in marketing clothing: a chatbot bolted onto the customer-service queue, a model that nudges room rates 0.4% better, a copilot that staff might use in a tablet app no one opens. These are real products. They are not what an AI-first operator looks like.

An AI-first geothermal spa reorganises around two structural advantages that prior automation didn't have:

1. **Conversational primary interface.** Planning a visit is a conversation. Every mode of guest research that actually works — the friend who's been, the concierge, the hotel reservations manager — is a back-and-forth. Booking forms with tier selectors and add-on checklists are a workaround for not having that conversation. Models let us replace the workaround with the actual thing. The chat becomes the booking surface; it stays open before, during, and after the visit.
2. **Reasoning over operational state.** Running the floor on a busy afternoon is a reasoning problem. The duty manager isn't doing arithmetic — they're holding capacity counts, therapist rotations, a hotel arrival bottleneck, a delayed transfer from Reykjavík, and a half-broken mask station, trying to find a plan that satisfies all of it in the next ten minutes. Models can hold those constraints, propose ranked options with explicit tradeoffs, and surface the implications of each. They cannot — and should not — make the decision. They make the decision faster and better.

The thesis: an operator that builds the guest experience and operating stack around these two advantages will out-experience and out-execute peers that retrofit AI onto existing surfaces. Higher booking conversion. Measurably higher NPS. Faster, less brand-damaging disruption recovery. Higher ancillary revenue per guest. Roughly the same number of people, spending their time on harder and more valuable work.

This is not a software bet. It is an operating-model bet that requires software to express.

---

## 2. Brand

The brand is Blue Lagoon. It's already named, already loved, already among the most recognised hospitality brands to come out of Iceland. The AI-first concept doesn't replace any of that — it gives the brand a new operating logic to express.

### Positioning, sharpened

Blue Lagoon's existing positioning — the geothermal icon of Iceland, the calm, the quiet luxury — is right. AI lets us make it more concretely true in the experience itself. The brand promise of an attentive, considered visit stops being marketing language and starts being how the product literally works: one concierge that bridges the guest from intent through booking through arrival through the visit through the follow-up.

| Peer | Positioning today | What changes for us |
|---|---|---|
| **European wellness resorts** (Aman, Six Senses, Lefay) | Premium destination, fully bespoke, very high price point | We don't out-luxury them. We out-experience them at the day-visit scale they don't operate. |
| **Other geothermal destinations** (Sky Lagoon, Forest Lagoon, Hvammsvík) | Newer Icelandic peers competing on price and proximity | We own the icon. AI widens the experience gap they can't close on copy alone. |
| **Hotel-spa add-ons at urban luxury hotels** | Spa as an amenity to a hotel stay | We are the destination. The hotel is an extension of the spa. |
| **Global thermal-bath brands** | Cultural heritage, very different positioning | We are the modern interpretation — Iceland-specific, design-led, considered. |

### Voice — applied to AI

The Blue Lagoon brand voice is calm, direct, Iceland-aware, sparing. Sentence case. Contractions used naturally. Specific over abstract. No hype words. No reflexive apologies. Clarity over cleverness for non-native English readers.

Every AI surface inherits that voice as a hard constraint. The booking concierge doesn't call the guest "amazing" or open with "great question." It tells them what's true, what's worth doing, and gets out of the way. The therapist's copilot doesn't preamble — it answers and cites the protocol. The duty floor manager's copilot doesn't hedge — it ranks options and recommends one.

This is a constraint, not a flourish. An AI that breaks the brand voice every third turn isn't a Blue Lagoon product, no matter how good its reasoning is.

### What changes about the brand

Three things shift:

1. **The product becomes the brand.** Today our brand is communicated through marketing surfaces — the campaign, the website, editorial photography. In an AI-first model, every interaction with an AI surface *is* a brand expression. Voice has to live in the system prompts and be audited the same way we audit a campaign.
2. **The brand becomes more legibly Icelandic.** Today the Iceland-ness shows up in photography and atmosphere. In an AI-first model it shows up in *behaviour* — the directness, the dry restraint, the assumption that the guest is a competent adult who can choose between two clear options. That's harder to fake than a basalt-and-moss palette.
3. **The brand has to mean something during disruption.** A weather closure, a geothermal maintenance window, a delayed transfer, a therapist out sick at 14:00 — today the brand goes silent and a queue replaces the relationship. AI-first disruption handling is where the brand promise is actually tested. We should use it.

---

## 3. The four pillars

For each pillar: the bet, three concrete use cases, what stays human, and the metric that proves it.

### 3.1 Conversational guest journey

**The bet.** The booking funnel today is six screens and twenty decisions: search, calendar pick, tier comparison, hotel choice, treatment add-ons, transfer add-ons, checkout. Each step loses guests, and the one who completes it arrives having already made twenty small commitments before feeling a single thing. AI replaces the funnel with a single ongoing relationship: one concierge that books the visit, prepares the guest, hosts them through it, and follows up.

**Three use cases.**

1. **Conversational booking.** The guest says "I'd love a few hours in the lagoon next Thursday afternoon, maybe a massage." The concierge proposes a Premium entry at 14:00 with an in-water 30-minute massage at 15:00, suggests the algae mask upgrade given the guest's history (or, for a new guest, the typical add-on pattern for the season), asks about transfer from Reykjavík, and holds the slot on confirmation. No calendar grid. No tier comparison. A real conversation with a real recommendation. The same flow handles harder cases — an anniversary at the Retreat, Moss restaurant, a couples' treatment — without the guest learning a new interface.

2. **Pre-arrival and on-property companion.** Once booked, the same agent stays with the guest. Before arrival: what to bring, how the silica behaves in hair, transfer logistics, weather. On arrival: locker assignment, the in-water bar, the cadence of the mask bar, Lava's lunch menu, where the quiet pools are. After: the skincare line that matched the guest's silica reaction, a thank-you that reads like one human wrote it. The agent doesn't sell aggressively here — its job is to be useful enough that the guest arrives comfortable and on time.

3. **Proactive disruption resolution.** When the lagoon needs an unscheduled service window, when a heavy-weather day forces a closure, when a tour bus is running ninety minutes late, the agent reaches affected guests before they arrive confused. "Your 13:00 entry is at risk because of a sixty-minute geothermal service window starting at 12:30. Three options: hold at 14:00 with a complimentary algae mask, shift to tomorrow with the Premium upgrade on us, or take a full refund. Your call." This converts disruption from a brand-damaging event into a brand-defining one.

**What stays human.** Anything that touches health: a pregnant guest with a question about heat exposure, a guest with a heart condition asking about treatment safety, a guest mid-treatment with an adverse skin reaction. The AI routes to a Wellness Lead in under sixty seconds and provides the context so the human can pick up cleanly. The AI knows when it's out of its depth.

**The metric.** Conversion from intent to booking, post-visit NPS, repeat-visit rate at twelve months, member retention. Target: +20 point NPS swing against the current baseline within 18 months, with conversational conversion at least 1.5× the legacy funnel.

### 3.2 Facility operations copilot

**The bet.** The duty floor manager handles 60 to 80 decisions on a peak day: reallocate therapists when a treatment slot shifts; smooth hotel arrivals when Silica check-in bottlenecks at 15:00; redistribute Lava seating when a tour group is 40 minutes late; swap mask-bar stations when one goes down; keep the in-water bar moving when a server steps off; rotate lifeguard positions on the legally required cadence. Today this happens in their head, on a clipboard, and over a radio. AI doesn't replace the duty manager — it gives them a copilot that reasons over the floor state in real time and proposes ranked options.

**Three use cases.**

1. **Live floor recommendations.** The copilot ingests capacity counts, therapist availability and certifications, hotel arrival timings, F&B seating state, mask-bar station status, and the day's bookings, and surfaces the two or three most useful actions for the next thirty minutes. Not "the floor is busy" — "Premium capacity is tight at 14:30 (booked at 92%, walk-ins running 15% above forecast); two options: hold walk-ins until 15:00 and route to Comfort, or open the second Silica entrance and pull one staff member from mask-bar station 2." The manager approves, modifies, or overrides; the copilot logs the decision.

2. **Disruption command surface.** When a geothermal pump goes out, when a weather closure becomes likely, when the transfer fleet is delayed in Reykjavík, the copilot is the duty manager's command surface. It maintains the live list of affected guests, drafts the outbound communications in the brand voice, holds the rebook options against capacity, and tracks which actions have been approved, executed, and acknowledged. The same pattern handles smaller daily disruptions — a sick therapist, a leaking mask-bar pipe — at lower stakes and higher frequency.

3. **Hotel arrival and departure smoothing.** Silica has 35 rooms; the Retreat has 62 suites. Check-in windows are predictable but the bottlenecks within them are not. The copilot watches the inbound list, transfer ETAs, housekeeping state, and the front-desk queue, and proposes timing nudges — a complimentary lagoon entry for an early-arriving Retreat guest while their suite turns, a transfer slot adjustment that smooths the 15:00 spike — before the front desk has to manage them by hand.

**What stays human.** Every decision. The copilot proposes; the duty manager disposes. The copilot never auto-executes a change that affects a guest, a member of staff, or a safety-relevant rotation. Lagoon safety supervision specifically — lifeguard certification, rotation, positioning, response — is a regulated function and the AI is read-only on those surfaces forever.

**The metric.** Median time from a disruption event to a stable plan, guest complaints attributable to floor operations, hotel arrival NPS in the half-hour after check-in. Target: 30% reduction in median disruption-to-stable-plan time within 12 months of rollout.

### 3.3 Ancillary revenue engine

**The bet.** Spa-and-resort economics rest on five levers: entry tier mix, treatment attach rate, F&B revenue per guest, skincare retail conversion, hotel-night attach on day-visit guests. Each is driven by intent. Today every guest sees the same upgrade prompts and the same mask-bar pricing. That is leaving money on both ends of the table: under-serving the high-intent guest who would have happily upgraded, and over-pricing the day-tripper who walks away. AI prices ancillaries to intent, in the moment.

**Three use cases.**

1. **Intent-aware upgrade prompts at booking.** When the concierge holds a Premium entry, it knows whether the guest is a returning Ambassador who always books the algae mask, a special-occasion guest looking at the Retreat tier for the first time, or a first-time day-tripper from a cruise port. The upgrade prompts shift accordingly. Sigríður — who has booked the algae mask on four prior visits — sees the new mineral mask premiere at €30 with member badge. The first-time guest sees the Premium tier with a one-line, brand-true explanation. Same revenue model, more accurately served.

2. **In-spa, in-moment upselling.** Lava and Moss have natural moments where the guest considers an upgrade — sitting down, dessert, a second drink. The F&B lead's copilot surfaces the right small nudge: a glass-of-the-house upgrade with a four-word reason, a Moss tasting menu when the table has been seated for forty minutes and a special occasion has been mentioned. The server uses or ignores it; the AI never speaks to the guest directly.

3. **Post-visit skincare and member follow-up.** The skincare line is a meaningful revenue stream and a long-tail brand surface. Today the post-visit email is the same email for every guest. Tomorrow it names the products the guest actually used in the mask bar, includes the silica-reaction note from their visit, mentions the mineral mask in small print, and surfaces an Ambassador-tier offer if their visit pattern fits. The same surface handles gift-card cross-sell and member referrals.

**What stays human.** Pricing strategy, tier architecture, the line between "considered upsell" and "pushy" — set centrally by the Commercial team and policed by the brand. We never use AI to dynamically price the entry tiers themselves; that stays predictable for trust.

**The metric.** Ancillary revenue per guest, treatment attach rate by tier, skincare conversion at 30 days post-visit, hotel-night attach on day-visit guests. Target: 12% lift in ancillary revenue per guest within 18 months.

### 3.4 Internal copilots for every role

**The bet.** Every member of staff does part of their job by looking up information, filling in a form, or asking someone who has been here longer than they have. AI gives every role a copilot that knows everything Blue Lagoon knows, grounded in the corpus that role actually uses. The productivity gain is real and measurable. The retention gain is bigger and harder to measure.

**Three use cases.**

1. **Role-grounded knowledge copilots.** Therapists ask the treatment-protocol copilot about contraindications and it answers from the actual protocol, citing the section. Lifeguards have a copilot grounded in the certified safety SOPs (read-only, never speaks for them in the moment, supports training and post-shift reflection). Mask-bar attendants get one on product mix, allergen handling, and new-product rollout. Hotel front-desk staff get one grounded in Silica and Retreat SOPs, including the trickier judgment calls. Each copilot is bounded by its corpus and cites its source.

2. **Member-services and Ambassador concierge.** Member services is a small team handling a long tail of nuanced requests — a Patron member changing a multi-leg anniversary booking, an Ambassador asking about gift-card transfer, a corporate booking lead coordinating fifty guests over two days. The internal copilot drafts the response, surfaces the eligible options, and lets the human approve, edit, and send. Time-to-answer halves; quality goes up because every draft starts from the right policy.

3. **Geothermal and facility engineering reference.** The geothermal plant, the water chemistry, the recirculation loop, and the silica balance are the engineering substrate of the entire business. Engineers have shelves of run-books, vendor manuals, and decade-old maintenance logs. The copilot reads them. When a question comes up about a sensor reading or a maintenance precedent, the engineer asks the copilot and gets the relevant entries with citations. The copilot is read-only and never makes a recommendation that would change water chemistry without a human in the loop. Always.

**What stays human.** Anything that requires judgment about a person — performance reviews, hiring, terminations, compensation. The copilot drafts and checks, never decides. And, again: any decision affecting water chemistry, lagoon supervision, hotel safety, or a guest's health.

**The metric.** Employee NPS by role, median time-to-answer on internal questions, voluntary attrition. Target: +15 point internal NPS swing within 12 months of rollout, especially in roles where the legacy answer-source is "ask a senior."

---

## 4. Operating model

Blue Lagoon is large enough that "we'll just figure it out" doesn't work, and small enough that the right organisational design moves a lot of weight. Five principles.

### 4.1 Small product squads own guest-facing surfaces

Each guest-facing surface (chat concierge, member portal, mobile entry pass, post-visit follow-up) is owned by a single squad of six to ten people: product lead, designer, three or four engineers, an ML engineer, a researcher. Squads ship weekly. Squads own their NPS and conversion metrics. Squads can be reorganised in a quarter if the metric doesn't move. This is not how hospitality IT is organised today — it's organised around vendors and integration layers. The shift is real and load-bearing.

### 4.2 A central AI platform team owns models, evaluation, and safety

The squads use AI; the platform team owns AI. Responsibilities: model selection and versioning; the evaluation suite (every guest-facing surface has a regression suite that runs on every model update); prompt and policy review for safety, brand voice, and regulatory compliance; the internal model gateway; cost and latency budgets per surface. Small team — eight to twelve people — the SRE-team equivalent for AI.

### 4.3 Spa Ops, Therapy, F&B, and Hotels each get an AI partner lead

Embedded in each operating function is a single person — the AI partner lead — whose job is to translate between the floor and the platform team. Not engineers. They know the work intimately, and they own the surface where AI meets that work. This is what stops the platform team from shipping things that look right on a slide and feel wrong on the floor.

### 4.4 Geothermal and Facility Engineering keep humans in the loop forever

Geothermal plant, water chemistry, lagoon supervision, fire safety, hotel life-safety: AI is read-only. It supports the engineer or supervisor and never proposes a change that gets executed without explicit human approval. This is non-negotiable, and it is also what makes the rest of the AI deployment safe to be aggressive about — the load-bearing surfaces are not on the table.

### 4.5 Headcount and culture

Total headcount stays roughly flat through the transition. We do not hire less; we hire differently. Fewer people whose job is to fill in a form, more whose job is to design the systems that make the form unnecessary. Front-line staff — therapists, lifeguards, mask-bar, F&B, housekeeping, front desk — are not affected in their job count or their authority. They are affected in the quality of the tools and the quality of the day-to-day. That's the honest story, and one we should be willing to tell publicly before the first tool ships to a staff member's tablet.

---

## 5. Roadmap

A 12-month bet, phased.

### Year 1 — pilot, expand, foundation

- **Q1 — 90-day pilot.** Stand up the AI platform team. Select model providers (Anthropic primary, credible secondary). Build the gateway and evaluation suite. Ship the conversational concierge to members and repeat guests only, behind a flag, as a 10% holdout against the legacy funnel. Single surface, deep, brand voice locked.
- **Q2 — 180-day expansion.** Expand the concierge to all guests. Launch the pre-arrival and on-property companion to members. Begin the facility operations copilot in a shadow-mode sandbox. Ship the first internal copilots — therapist protocol, hotel front desk — to opted-in staff.
- **Q3 — operations.** Move the facility operations copilot to the duty floor in second-screen mode. Expand internal copilots to mask-bar, F&B, and member services. Begin the ancillary engine on intent-aware upgrade prompts in the concierge.
- **Q4 — ancillary and integration.** Ancillary engine on in-spa F&B and post-visit skincare follow-up. Member services and Ambassador concierge in production. Facility ops copilot moves into the decision path with explicit authority boundaries — proposes, manager approves, AI executes downstream actions (guest comms, rebook holds, decision-log entries).

### Year 2 — scale and depth

- **Q5–Q6.** Concierge becomes the default booking surface across channels. Companion expands to all guests, with the post-visit follow-up running by default.
- **Q7.** Hotel front desk, housekeeping, and Retreat-specific copilots reach full coverage. The Moss-specific F&B copilot — with the tasting-menu pacing logic — launches.
- **Q8.** Geothermal and facility engineering reference copilot launches, read-only, with strict human-in-the-loop policy. Skincare retail integration deepens.

### Year 3 — operating model lock-in

- **Q9–Q10.** Facility operations copilot is the daily working surface of the duty manager. Decision log is the source of truth for shift-handover and incident review.
- **Q11.** Member program (Ambassador, Patron) redesigned around AI-personalised journeys, with the concierge as the primary touchpoint.
- **Q12.** Cross-organisation rollout complete. Every role with a corpus has a copilot grounded in it.

The roadmap is deliberately not aggressive in its early quarters. Hospitality operators who have tried "AI transformation" on a six-month timeline have all under-shipped or over-claimed. A phased plan that ships a single deep surface in 90 days, expands it across the guest base in 180, and reaches the operations side by the end of year one is what we believe will actually work at our scale.

---

## 6. Risks and honest constraints

### 6.1 Data residency and guest health-adjacent intake

Iceland is in the EEA and follows GDPR. Guest data — booking history, member profile, the health-adjacent intake we ask before treatments — has data residency expectations that complicate routing inference to US-hosted providers. Two responses: keep guest data anonymised and tokenised at the gateway, so what crosses any border is shape-of-data not data; and maintain a credible path to EU-hosted inference for any surface where regulator pressure or guest trust requires it. Both responses cost something. They are worth the cost.

### 6.2 Health-adjacent boundaries

Blue Lagoon treatments are not medical, but our intake forms touch medical territory and our guests sometimes ask medical-adjacent questions. The AI must never render medical advice. Hand-off to a human Wellness Lead is fast (sub-60-second routing) and the AI's instructions are written in the system prompt as a hard refusal pattern. The evaluation suite tests the refusal on every model update.

### 6.3 Workplace safety and regulated functions

Lifeguard supervision is a regulated function with formal certifications and on-shift requirements. The AI is read-only on those surfaces — it supports training and reflection, never authorises a rotation, never displaces a certified human at the lagoon edge. The same principle applies to fire safety and hotel life-safety. Non-negotiable and visible in our staff comms.

### 6.4 Staff comms and the layoff question

Front-line staff will read "AI-first" as a layoff plan unless we name what it isn't, early and in writing. Three commitments we should be willing to make before any AI tool reaches a staff member's hands:

1. AI does not change role complement at the lagoon, in the restaurants, in the hotels, or on the safety teams.
2. AI does not change role authority. The therapist owns the treatment plan; the duty manager owns the floor; the lifeguard owns the lagoon edge; the chef owns the kitchen.
3. AI tools roll out to a role only after that role's working group has shaped them.

These are not constraints on the bet. They are the conditions under which the bet is implementable.

### 6.5 Brand exposure in disruption

The Blue Lagoon brand is most tested in disruption — a weather closure, a geothermal maintenance window, a delayed transfer. An AI handling disruption badly damages the brand at exactly the moment the guest is most attentive. The mitigation is structural: every disruption surface has a senior-concierge human on the loop, every outbound communication is bounded by templates and tested for tone, and the duty manager's copilot logs every guest-facing message before it goes out. We do not let the AI improvise in front of a frustrated guest. Ever.

### 6.6 Model reliability and grounding

Models hallucinate. The booking surface can absorb a low-frequency error gracefully — the concierge confidently mentioning a treatment we don't offer is annoying but recoverable, especially with the hold-on-confirmation pattern. Operational and safety-adjacent surfaces cannot. The mitigation is grounding: every operational copilot is bounded by a corpus, every recommendation is shown with its reasoning trail, every action requires human approval. None of this eliminates hallucination; it makes hallucination visible and recoverable.

### 6.7 Vendor dependence

Building on a single model provider creates concentration risk. Mitigations: dual-vendor architecture from day one, a policy of not using vendor-specific features that can't be replicated, and an annual fire-drill week on the secondary to make sure we actually can.

### 6.8 The risk of doing nothing

The most underrated risk. Every quarter we do not move, the gap between Blue Lagoon and the new-entrant geothermal peers narrows on copy alone, and the global wellness operators get one quarter closer to deploying their own AI-first experience. Blue Lagoon's structural advantages — the icon, the single site, the vertical integration — have a half-life. Five years from now, an AI-first geothermal hospitality brand with our positioning either exists with our name on the door, or it exists with someone else's.

---

## 7. Why now

Three things crossed thresholds in late 2025.

1. **Model capability.** As of Opus 4.7, models can sustain coherent reasoning across long-horizon, multi-step guest journeys and operational tasks — long enough to be useful in concierge work, knowledge work, and the duty floor copilot. This was not true two years ago. It is reliably true now.
2. **Inference cost.** Cost per intelligent token is dropping roughly fivefold each year. The economics of "an LLM in every conversation" are surprising today and will be obvious in eighteen months. Building on the assumption of rapidly cheapening intelligence is no longer speculative; it is the prudent base case.
3. **Competitive timing.** The hospitality competitive set — global luxury wellness, hot-spring brands, the newer Icelandic peers — has visible AI initiatives, almost none of them AI-first. The window where a small, single-site, vertically integrated operator can leapfrog the category is open. We estimate it stays open for about eighteen months.

Iceland is a specific advantage. We are a small operator on a single site, vertically integrated across spa, hotels, restaurants, and skincare retail. Decisions move faster than at a 200-property global chain. Iteration cycles are shorter. The brand is concentrated, not distributed across a portfolio. All of this is leverage.

The bet is not that AI will be important to hospitality. Everyone agrees on that. The bet is that being *first* to be AI-native is a durable advantage for a small, single-site, vertically integrated geothermal operator with the brand we have. Blue Lagoon is exactly that operator. The question this concept asks of leadership is one decision: green-light the 90-day pilot.

---

*An internal concept exploration. Not a product announcement. Direct any questions or pushback to the author.*
