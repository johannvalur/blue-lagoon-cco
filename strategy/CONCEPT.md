# Blue Lagoon, AI-first

> A concept exploration. Designed to be read in 12–15 minutes by an internal Blue Lagoon leadership audience.

---

## 0. The one-page version

**The opportunity.** Every legacy carrier is bolting AI onto a 1990s booking funnel and a 1970s ops control culture. Blue Lagoon has something most of them don't: a small enough footprint to actually rebuild around AI, a hub model that already embodies AI's central virtue (smart routing across asymmetric demand), and a brand whose DNA — Iceland, the North Atlantic, the natural sublime — already maps onto the kind of intelligent, ambient experience AI is good at delivering.

**The bet.** This is what Blue Lagoon could look like if we rebuilt around AI today. An AI-native carrier built around four pillars: a conversational customer journey that collapses the funnel into a dialogue; an ops control room where AI proposes and humans approve; a revenue engine where every fare and ancillary is priced to intent rather than RM rules; and an internal tooling layer where every employee has a copilot grounded in Blue Lagoon's own corpus.

**The shape of the org.** Small product squads own customer surfaces. A central AI platform team owns models, evaluation, and safety. Ops keeps human-in-the-loop authority for safety-critical decisions — forever. Headcount stays roughly flat; productivity and decision quality rise.

**The honest constraints.** EASA does not yet have a posture on LLM-driven operational decisions. Icelandic and EU data residency rules are not friendly to US-hosted inference for some categories of data. Cabin crew and pilot unions will read "AI-first" as a layoff plan unless we name what it isn't. None of these block the bet — they shape the roadmap.

**Why now.** The model capability curve crossed a threshold in late 2025: agents can now reliably hold context across long-horizon, multi-step operational tasks. Inference cost is dropping ~5× per year. And the competitive set hasn't moved. Lufthansa, KLM, Delta, and Air Canada have AI initiatives — none of them have an AI-first operating model.

---

## 1. Thesis

Most "AI in airlines" today is pattern recognition dressed up as transformation: a chatbot bolted onto the customer service queue, a model that nudges fares 0.4% better, a copilot that crew might use in a tablet app no one opens. These are real products. They are not what an AI-first airline looks like.

An AI-first airline reorganizes around two structural advantages of large language models that prior automation didn't have:

1. **Conversational primary interface.** Travel planning is a conversation. Every mode of travel research that actually works — the friend who's been there, the concierge, the agent — is a back-and-forth. Search forms are a workaround for not having that. LLMs let us replace the workaround with the actual thing.
2. **Reasoning over operational state.** Ops control is a reasoning problem. A duty manager looking at a fog event isn't doing arithmetic — they're holding a dozen constraints in their head and trying to find a plan that satisfies them. LLMs can hold those constraints, propose ranked options with explicit tradeoffs, and surface the implications of each. They cannot — and should not — make the decision. They make the decision faster and better.

The thesis is that a carrier that builds the entire experience and operating stack around these two structural advantages will out-experience and out-execute carriers that retrofit AI onto existing surfaces. It will book travelers more cheaply (lower CAC, higher conversion), serve them better (higher NPS, higher Saga Club retention), and recover from disruption faster (lower compensation cost, higher on-time performance). It will do this with roughly the same number of people, who will spend their time on harder and more valuable work.

This is not a software bet. It is an operating-model bet that requires software to express.

---

## 2. Brand

The brand is Blue Lagoon. It's already named, already loved, already recognised. The AI-first concept doesn't replace any of that — it gives the brand a new operating logic to express. This section is about what changes in how the brand *behaves* once AI is doing the heavy lifting.

### Positioning, sharpened

Blue Lagoon's existing positioning — the thoughtful, design-led North Atlantic carrier with Iceland as both hub and stopover destination — is the right one. AI lets us make it more concretely true. The brand promise of "the friendly bridge between Europe and North America" stops being marketing language and starts being literally how the product works: a single agent that bridges the traveller from intent through booking through arrival.

| Peer | Positioning today | What changes for us |
|---|---|---|
| **Lufthansa, Air France-KLM, IAG** | Premium-flag, scale, complexity | We don't out-scale them and don't try to. We out-experience them on the routes we share, by being the carrier that *knows* the traveller. |
| **Delta, United** | "Premium" with a mass operation underneath | We're genuinely small enough to deliver on the experience promise across the whole journey, not just the pointy end. |
| **PLAY, Norse** | Low-cost transatlantic, no service or brand strategy | We own the *experienced* transatlantic, where PLAY and Norse own the *cheap* transatlantic. Different segments. AI widens this gap. |
| **Emirates, Qatar, Singapore** | Aspirational long-haul over a hub | Closest analogue in *experience* ambition. We differ by being an order of magnitude smaller and an order of magnitude more agile — and by having the hub geography that actually advantages a North Atlantic carrier. |

### Voice — applied to AI

The Blue Lagoon brand guide already names the voice clearly: conversational, warm, empathetic, direct. Sentence case. Contractions. Active voice. Short and long sentences for rhythm. Clarity over cleverness for non-native English readers.

Every AI surface in this concept inherits that voice as a hard constraint. The booking concierge doesn't call the traveller "amazing" or open with "great question." It doesn't apologise reflexively. It tells them what's true, what's worth doing, and gets out of the way. The crew copilot doesn't preamble — it answers and cites the section. The ops copilot doesn't hedge — it ranks options and recommends one.

This is a constraint, not a flourish. An AI that breaks the brand voice every third turn isn't an Blue Lagoon product, no matter how good its reasoning is.

### Visual direction

The visual system is the existing brand: Midnight Blue `#001b71` as the primary canvas, Snow White `#fbfbfb` for type, Basalt Grey `#303030` for utility. The secondary palette — Fiery Magenta, Crisp Blue, Boreal Blue, Volcanic Green, Golden Yellow, Arctic Lilac — is used sparingly to distinguish surfaces and indicate state. Blue Lagoon Loft for type (Manrope as the prototype substitute, since Loft is licensed).

This prototype is built in that system. The four pillars on the landing page each carry a single secondary-palette accent to telegraph "different surface, same airline." Live AI states use Crisp Blue; alerts use Fiery Magenta or Golden Yellow per existing brand patterns.

### What changes about the brand

Three things shift, and they're worth being explicit about:

1. **The product becomes the brand.** Today Blue Lagoon's brand is largely communicated through marketing surfaces — the campaign, the website, the in-flight magazine. In an AI-first model, every interaction with the AI surfaces *is* a brand expression. We can't outsource voice to an agency anymore — voice has to be in the system prompts.
2. **The brand becomes more legibly Icelandic.** Today Iceland-as-DNA shows up in photography and atmosphere. In an AI-first model it can show up in *behaviour* — the directness, the dry restraint, the assumption that the traveller is competent. That's harder to fake than a glacier photograph.
3. **The brand has to mean something during a disruption.** When IROPS hit, the existing brand goes silent and a queue replaces the relationship. AI-first disruption handling — proactive rebooking, transparent reasoning, an apology that doesn't sound generated — is where the brand promise is actually tested. We should use it.

---

## 3. The four pillars

For each pillar: the bet, three concrete AI use cases, what stays human, and the metric that proves it.

### 3.1 Customer journey

**The bet.** The customer journey today is a funnel — search, results, fare comparison, ancillaries, payment, manage-my-booking, check-in, in-flight, post-flight. Every step is a chance to lose the traveler. AI lets us replace the funnel with a single ongoing relationship: one agent that books the trip, packs it, flies it, and gets the traveler home.

**Three use cases.**

1. **Conversational booking.** The traveler says "somewhere warm in late February for 5 days." The concierge proposes 2–3 destinations from our network with a clear "why this, for you, now," quotes a representative fare, and walks them through outbound and return. No search form. No filter sidebar. A real conversation with a real recommendation. The prototype demonstrates this.

2. **Ambient trip companion.** Once booked, the same agent stays with the traveler. Pre-flight: packing, weather, transit to KEF, what to expect at security, in-flight meal swaps. In-flight: content recommendations, service timing, late-arrival guarantee proactive outreach. On the ground: orientation to the destination, dinner reservations, weather, currency. The agent doesn't sell anything in this mode — its job is to be useful.

3. **Predictive disruption resolution.** When a flight is at risk of disruption, the agent reaches out *before* the traveler notices. "Your BF615 is at risk of a 90-minute delay due to KEF fog. Here are your options: stay on it (most likely outcome: arrive BOS 1045 instead of 0915), rebook to BF617 leaving 1100 (arrive BOS 1145), or take a Saga Club credit and stay home. Your call." This is the experience that converts disruption from a brand-destroying event into a brand-defining one.

**What stays human.** Anything involving a passenger in distress (medical, bereavement, missed-connection in a foreign airport at 2am) routes to a human in under 60 seconds. The AI knows when it's out of its depth.

**The metric.** Conversion rate from intent to booking, NPS at +90 days post-flight, Saga Club retention. Target: a +20 point NPS swing over Blue Lagoon's current baseline within 24 months of launch.

### 3.2 Operations

**The bet.** Ops control today is a war room of experts staring at multiple monitors and a ringing phone. The job is to hold a dozen constraints in your head and find a plan that satisfies them faster than the situation degrades. AI doesn't replace the experts — it gives them a copilot that reasons over the constraints in real time and proposes ranked options.

**Three use cases.**

1. **Ops control copilot for IROPS.** When a disruption hits — fog at KEF, a tech AOG in JFK, a Mt. Etna ash event — the copilot ingests the affected rotations, crew duty hours, slot windows, gate availability, EU261 thresholds, and downstream connections, and produces 2–3 distinct recovery plans. Each plan has a single recommended action and an explicit reasoning trail. The duty controller approves, modifies, or overrides. The prototype demonstrates this.

2. **Predictive maintenance triage.** The 757 fleet generates roughly 50,000 sensor data points per flight. Most are noise. AI cross-references against fleet-wide patterns to flag the 2–3 events per week that are *probably* a precursor to a no-go finding at the next A-check, and routes them to the maintenance planner with a recommended pre-emptive action. Saved AOG-hours pay for the system several times over.

3. **Crew rostering optimizer with fairness constraints.** Roster building is a constraint satisfaction problem with hard regulatory constraints (FDP, rest), soft preference constraints (crew bidding), and a fairness constraint (equitable distribution of unattractive duty over a quarter). Modern solvers handle the hard constraints. AI is good at the soft ones — and at *explaining* a roster to a crew member who wants to know why they got what they got. Trust matters more than the optimum.

**What stays human.** Every safety-of-flight decision. Forever. AI never makes a go/no-go call, never authorizes a MEL deferral, never decides on a diversion. AI proposes; humans dispose. This is non-negotiable, and it is also the thing that makes the AI useful — it can be aggressive and creative in proposing options because the human is the brake.

**The metric.** D-zero on-time performance, IROPS recovery time (median minutes from event to all rotations restored), EU261 compensation cost per disrupted passenger. Target: 30% reduction in IROPS recovery time within 18 months.

### 3.3 Revenue & commercial

**The bet.** Traditional revenue management prices fares against a forecast of demand and a set of fare classes. AI prices fares against the traveler's intent, in the moment, with the network as constraint. Same revenue. Better experience. More repeat travelers.

**Three use cases.**

1. **Intent-priced fares.** The traveler asks the concierge for a long weekend in October. The concierge knows their booking history, their stated preferences, and their elasticity. It proposes a fare that's optimized not for the immediate transaction but for lifetime value. A traveler who books their fourth Blue Lagoon trip should not see the same fare as a traveler who is comparison-shopping with KLM. Today, both see the same RM-set price. That is leaving money on both ends of the table.

2. **Dynamic ancillary engine.** Ancillaries today are a bolt-on at the end of booking. AI lets us offer ancillaries in context, in the moment they matter. The traveler asks the trip companion about packing for Boston in November — the companion mentions that a Saga upgrade is available for €180 and includes the lounge, a hot shower at KEF, and a lie-flat seat for the 5h45 westbound. That's a contextual pitch, not a checkbox. Conversion on these is multiples higher than on the post-booking ancillary funnel.

3. **AI-native loyalty (Saga).** Saga Club today rewards revenue. Saga Club tomorrow rewards relationship. The program gives elite tier credit for: trips taken, recommendations followed, friends referred, low-impact route choices made. The AI knows what each member values and shapes the program around it. Less a points scheme; more a long-running relationship.

**What stays human.** Pricing strategy, fare class architecture, regulatory compliance on ancillaries (Iceland and EU consumer law). The AI works inside the human-set boundaries.

**The metric.** Revenue per available seat kilometer (RASK), ancillary attach rate, Saga Club tier retention. Target: 10% RASK lift over Blue Lagoon baseline within 24 months.

### 3.4 Internal tooling

**The bet.** Every employee at the airline does some part of their job by looking up information, filling in a form, or asking someone who's been here longer than they have. AI gives every employee a copilot that knows everything Blue Lagoon knows. The productivity gain is real and measurable. The retention gain is bigger and harder to measure.

**Three use cases.**

1. **Crew copilot grounded in SOPs.** Cabin and flight crew have a standing question: "what's the procedure for…?" Today they look it up in the OM-A on a tablet. Tomorrow they ask the copilot, which answers from the actual OM-A and cites the section. The prototype demonstrates this. The same pattern applies to ground staff, ramp, baggage, dispatch.

2. **Ground staff knowledge agent.** A KEF ramp supervisor asks "the JFK inbound has 14 misconnects with onward to LHR — what are our protected options?" The agent knows the partner network, the protected itineraries, the IROPS desk SOPs, and the EU261 entitlements. Ramp gets the answer in 8 seconds instead of 8 minutes.

3. **Finance, contract, and procurement copilot.** Every legacy airline has shelves of contracts that nobody has read end-to-end in years. The copilot reads them. When a question comes up about a slot agreement, a fuel hedging counterparty, or a ground handling contract, finance asks the copilot and gets the relevant clauses and the precedent.

**What stays human.** Anything that requires judgment about a person — performance reviews, hiring decisions, terminations, compensation. The copilot helps draft and check, never decides.

**The metric.** Employee NPS, time-to-answer on internal questions, voluntary attrition. Target: a 15 point internal NPS swing within 18 months of rollout, especially among front-line crew.

---

## 4. Operating model

A ~5,000-person carrier is large enough that "we'll just figure it out" doesn't work, and small enough that the right organizational design can move a lot of weight. Three principles.

### 4.1 Small product squads own customer surfaces

Each customer surface (booking, companion, in-flight, post-flight, loyalty) is owned by a single product squad of 6–10 people: a product lead, a designer, three or four engineers, an ML engineer, and a researcher. Squads ship to production weekly. Squads own their NPS and conversion metrics. Squads can be reorganized in a quarter if the metric doesn't move.

This is not how airline IT is organized today. Airline IT is organized around vendors and integration layers. The shift is real and load-bearing — the squad model only works if the squad has end-to-end ownership, including the AI model behavior on its surface.

### 4.2 A central AI platform team owns models, evaluation, and safety

The squads use AI; the platform team owns AI. The platform team is responsible for:

- The model registry — which models, which versions, deployed where, with what guardrails.
- The evaluation suite — every customer-facing surface has a regression suite that runs on every model update. No model ships to production without passing.
- Prompt and policy review — system prompts and tool surfaces are reviewed for safety, brand voice, and regulatory compliance before deployment.
- The internal model gateway — squads call models through one gateway with one set of telemetry, one rate limit pool, one billing aggregation.
- Cost and latency budgets — every surface has a cost-per-request budget the platform enforces.

This team is small (10–15 people). It is the closest organizational equivalent to a SRE team for AI: it owns the boring, important infrastructure that makes the squads productive without making the squads' lives harder.

### 4.3 Ops keeps human-in-the-loop authority for safety-critical decisions

Ops control, the duty pilot's office, dispatch, and maintenance control all use AI copilots. None of them give the AI authority to make a safety-relevant decision. The interaction shape is always: AI proposes, human approves, AI executes the routine downstream actions. This is the only sustainable operating model for an industry whose regulator is, correctly, conservative about novel decision-making layers.

### 4.4 Headcount and culture

Total headcount stays roughly flat through the transition. We don't hire less; we hire differently. We hire fewer people whose job is to fill in forms, and more people whose job is to design the systems that make forms unnecessary. Cabin crew and pilots are not affected by AI in their job count or job authority; they are affected by AI in the quality of the tools and the quality of the day-to-day. That is an honest story we should be willing to tell publicly.

---

## 5. Roadmap

A 36-month bet, phased by quarter.

### Year 1 — foundations and proof

- **Q1.** Stand up the AI platform team. Select model providers (Anthropic primary, with a credible secondary for redundancy and negotiating leverage). Build the model gateway and evaluation suite. Establish the squad model in two pilot product areas.
- **Q2.** Ship the conversational booking prototype to a 5% A/B test on the consumer site. Ship the crew copilot to one base (KEF) for cabin crew. Begin building the ops control copilot in a non-production sandbox.
- **Q3.** Expand booking to 50% A/B. Move crew copilot to all bases. Begin shadow-mode evaluation of the ops control copilot against historical IROPS events.
- **Q4.** Launch the trip companion in beta to Saga Club Gold members. Move the ops control copilot to production in a "second-screen" mode (not in the decision path; controllers see the AI's reasoning alongside their own).

### Year 2 — scale and integration

- **Q5–Q6.** Conversational booking becomes the default consumer surface. Trip companion expands to all Saga Club members.
- **Q7.** Predictive maintenance triage launches on the 737 MAX fleet (newest, most data-rich).
- **Q8.** Dynamic ancillary engine launches. Saga loyalty redesign begins.

### Year 3 — operating model lock-in

- **Q9–Q10.** Ops control copilot moves into the decision path with explicit authority boundaries (proposes; controller approves; AI executes downstream rebookings, crew comms, EU261 notifications).
- **Q11.** Saga loyalty redesign launches.
- **Q12.** Internal copilot expands to finance, procurement, and dispatch. Cross-org rollout complete.

The roadmap is deliberately not aggressive. Airlines that have tried "AI transformation" on a 12-month timeline have all under-shipped or over-claimed. A 36-month, quarter-by-quarter, metric-anchored plan is what works in this industry.

---

## 6. Risks and honest constraints

### 6.1 Regulatory

EASA and the Icelandic CAA do not yet have a published posture on LLM-driven operational decisions. We should not wait for them to develop one — but we should also not deploy in a way that gets us out ahead of the regulator. The "AI proposes, human approves" architecture is defensible. A future where AI authorizes a fuel uplift change or a weight-and-balance recalculation without human review is not, today, defensible. Build the discipline in from the start.

### 6.2 Data residency and privacy

Iceland is in the EEA and follows GDPR. Some categories of customer data — booking history, travel patterns, biometric identifiers if we use them — have data residency expectations that complicate routing inference to US-hosted model providers. Two responses: (1) keep customer data anonymized and tokenized at the gateway, so what crosses the border is shape-of-data, not data; (2) maintain a credible path to EU-hosted inference for any surface where regulator pressure or customer trust requires it. Both responses cost something. They are worth the cost.

### 6.3 Union impact

The cabin crew and pilot unions will read "AI-first" as a layoff plan unless we name what it isn't. Three commitments we should be willing to make, in writing, before any AI tool reaches a union member's hands:

1. AI does not change crew complement requirements on any flight.
2. AI does not affect pilot or crew job authority. The captain remains the final authority. The SCCM remains the cabin authority.
3. AI rolls out to crew only after crew co-design. No tool ships to crew without a crew working group having shaped it.

These are not constraints on the bet. They are the conditions under which the bet is implementable in a unionized European airline.

### 6.4 Model reliability

Models hallucinate. The customer-facing surfaces can absorb a low-frequency error gracefully — the concierge confidently recommending a destination Blue Lagoon doesn't fly is annoying but recoverable. The operational surfaces cannot. The mitigation is structural: every operational surface is grounded in a corpus, every operational recommendation is shown with its reasoning trail, every operational action requires human approval. The crew copilot's answers are bounded by the OM-A. The ops copilot's recommendations are bounded by the actual constraints in play. None of this eliminates hallucination; it makes hallucination visible and recoverable.

### 6.5 Vendor dependence

Building on a single model provider creates concentration risk: pricing leverage shifts to the provider, and a provider outage becomes our outage. Mitigations: dual-vendor architecture from day one (primary + credible secondary, behind one gateway), a strict policy of not using vendor-specific features that can't be replicated, and an annual "fire drill" where we run a week on the secondary to make sure we actually can.

### 6.6 The risk of doing nothing

The most underrated risk. Every quarter we do not move on this, the legacy carriers narrow the gap and the new entrants widen it. Blue Lagoon's structural advantages — the hub geography, the brand, the size — have a half-life. Five years from now, an AI-first carrier with our positioning either exists with our name on the door, or it exists with someone else's.

---

## 7. Why now

Three things crossed thresholds in late 2025.

1. **Model capability.** As of Opus 4.7, models can sustain coherent reasoning across long-horizon, multi-step operational tasks — long enough to be useful in ops control, knowledge work, and persistent customer agents. This was not true two years ago. It is reliably true now.
2. **Inference cost.** Cost per intelligent token is dropping ~5× per year. The economics of "an LLM in every conversation" are ridiculous today and will be obvious in 24 months. Building on the assumption of rapidly cheapening intelligence is no longer speculative; it is the prudent base case.
3. **Competitive timing.** The legacy carriers are visibly doing AI; none of them are visibly doing AI-first. Lufthansa's "AI@LH" program, Delta's automation push, KLM's chatbot work — all real, all incremental. None of them are reorganizing around AI as the operating model. The window where a small, well-positioned carrier can leapfrog them is open. It will not stay open indefinitely.

The bet is not that AI will be important to airlines. Everyone agrees on that. The bet is that being *first* to be AI-native is a durable advantage for a small carrier with the right hub geography, brand, and operational footprint. Blue Lagoon is exactly that carrier.

---

*An internal concept exploration. Not a product announcement. Direct any questions or pushback to the author.*
