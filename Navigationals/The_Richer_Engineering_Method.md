# The Richer Engineering Method

> "Cause after all, we are engineers, not mathematicians." — Nathan Amankwah

The Richer Engineering Method (REM) is a way of thinking about what we actually need to build, why a particular approach is justified, and how to turn an ambitious idea into something practically useful. It complements the [Richer Scientific Method](The_Richer_Scientific_Method.md): RSM helps us investigate what is possible and what we know; REM asks how to engineer a realization that works in the circumstances we care about.

The first question isn't necessarily *how do we implement this?* It's **what do we actually need?** What's the bigger picture? Are we even asking the right sort of question? What would count as a working result, and what would make that result worth having?

REM is not a rigid pipeline. We should be able to move from purpose to evidence, implementation, testing, and back again as new information changes what matters.

## How to navigate this document

Each topic has an address such as **REM-02.03** so we can refer to, challenge, and revise particular ideas without losing them in the larger discussion. These addresses follow the earlier numbered REM draft. Some repeated ideas have been compressed; their original development remains available in the repository's history and on the main branch until this working revision is approved.

| Section | Main question |
|---|---|
| [REM-01](#rem-01-purpose-practical-utility-and-whole-system-reasoning) | What is actually worth building, and when is it useful enough? |
| [REM-02](#rem-02-problem-solving-as-goal-directed-navigation) | How do we select and change the next engineering move? |
| [REM-03](#rem-03-practical-testing-and-engineering-evidence) | What experiment could change our decision? |
| [REM-04](#rem-04-interfaces-long-term-use-and-symbiotic-communication) | Can a person understand, use, and recover the system? |
| [REM-05](#rem-05-self-improving-systems-and-the-investigation-loop) | What work can the system progressively take over? |
| [REM-06](#rem-06-heuristics-and-feature-engineering) | Which signals deserve to influence a decision, and how should they adapt? |
| [REM-07](#rem-07-recursive-combinatorial-exploration-of-system-behavior) | How can we expose interactions too numerous to hold in our heads? |

## [REM-01] Purpose, practical utility, and whole-system reasoning

### [REM-01.01] We are engineers, not mathematicians

We shouldn't select a solution simply because it's popular, fashionable, or appears in a textbook. First, justify it through natural reasoning. Then justify it practically. Where the uncertainty matters, build a small working demonstration—a **coal mine canary**—and see which assumptions survive contact with reality.

"We are engineers, not mathematicians" doesn't mean mathematical rigor is unimportant. It means rigor and sophistication must earn their cost by helping us accomplish something real.

We should reason about the benefits of success, its likelihood, the objective costs of failure, and even the psychological nuisance or irritability of failure. A rare fault might be cheap in CPU time but deeply frustrating if it leaves the user uncertain whether their work was lost. Conversely, a technically imperfect system might be perfectly useful if its shortcomings are obvious, tolerable, and recoverable.

These quantities often can't be assigned meaningful precise numbers. We can still construct a partial ranking of alternatives and a taxonomy of their failure modes. Which mistakes are common? Which are expensive? Which are confusing, disruptive, or difficult to recover from? Which interventions would change the outcome?

**Don't mistake a numerical score for a justified choice.** The benefits, probabilities, and costs may not be independent or even commensurable. The original engineering intuition is to compare their consequences, not to force them into an unjustified equation.

### [REM-01.02] Systems friction, coupling, and stopping points

Sometimes we're already 80%, 95%, or 97.5% of the way to the utility we care about. The next improvement might make a component more sophisticated while contributing almost nothing to the actual experience or capability.

One reason is **systems friction**: the mismatch between components that are individually capable but don't couple together efficiently. A fast solver, a capable transport, and a polished interface can still produce a slow or awkward application if their timing, data representations, or control assumptions don't fit.

The ideal resembles **resonance**: components work together without unnecessary bottlenecks or weak links under the expected load. That's a useful metaphor, not a mathematical claim that every engineering cost is multiplicative. In practice, some detuning is perfectly acceptable. What matters is whether the whole system fulfills its purpose.

Before optimizing a component, ask what it limits in the *actual user flow*. Before introducing another component, ask whether its benefits outweigh its coordination, maintenance, and failure costs. Stop when further refinement is no longer worth what it could change.

### [REM-01.03] Clear on what, when, where, and why—not necessarily how

We made it to the Moon not merely by demanding faster computers or a complete plan in advance, but by converting an ambitious objective into mission requirements, constituent capabilities, and increasingly concrete demonstrations under real constraints.

We need to be clear on what we want, why it matters, and which constraints and deadlines are real.

**Notice I didn't say clear on how.**

Not knowing the implementation is a reason to investigate its requirements and obstructions, not necessarily a reason to abandon the ambition. But it also isn't a license to declare feasibility without evidence. We can work backward from the desired capability, look for existing achievements, and test the uncertain links one at a time.

### [REM-01.04] Local efficiency is not compositional efficiency

A component's benchmark doesn't tell us what that component contributes to the larger system. A faster algorithm can lose its advantage in data transfers; a more capable feature can make a product harder to discover or maintain; one optimized service can increase work elsewhere.

Evaluate the *end-to-end result* and the interfaces between constituent parts. The question isn't just **how good is this component?** It's **what changes for the entire system when we use it?**

### [REM-01.05] Locally brilliant, globally stupid

Engineers, systems, and advice can be **locally brilliant but globally stupid**. Sophistication is especially seductive when a problem has been fragmented into specialties: everyone can optimize their own part while nobody challenges whether those are the parts we actually need.

Treat that as a recurring failure mode. Return to the parent purpose, identify the limiting capability, and ask whether a simpler change elsewhere would matter more. This is the practical test of the whole-system reasoning in REM-01.02 and REM-01.04.

## [REM-02] Problem solving as goal-directed navigation

### [REM-02.01] The operations form a network, not a checklist

Useful engineering questions include: What problem are we actually facing? Has someone already solved it? Which source has the highest expected information value? Is the documented abstraction trustworthy? What experiment could collapse the search space fastest? When should we abandon this approach?

The hard part isn't memorizing the questions. It's knowing **which one to ask now, and when to jump elsewhere**.

A failed implementation might send us back to the requirements, to prior research, or to a different representation. A surprising experiment might make the original question irrelevant. We move up, down, and across the investigation tree rather than treating problem solving as a linear recipe.

### [REM-02.02] Operations, routing, and the actual goal

I find it useful to separate three capabilities:

1. **Available operations:** research, calculation, design, implementation, testing, comparison, and so on.
2. **Routing among operations:** recognizing when and why to switch approaches as information changes.
3. **Goal identification and maintenance:** recognizing what the work is actually supposed to accomplish, including unstated and higher-level purposes.

An engineer might be excellent at any one operation and still make little progress if they choose the wrong branch or forget the bigger picture. This is especially relevant when using LLMs, whose ability to produce code or answer a local question doesn't automatically establish that they're advancing the user's actual objective.

For example, a person replaying an easy level of a game may not be trying to complete that level. They might be practicing timing for a later challenge—or ultimately trying to impress friends, in which case a different demonstration might suffice. The immediate task, instrumental purpose, and holistic purpose are different.

### [REM-02.03] Stopping trees and learning stops

We should explicitly consider **ways to stop** as well as ways to continue: the goal is sufficiently met; an obstruction needs investigation; further work costs more than it could change; a different branch deserves priority; or the human needs enough domain intuition to direct the next step.

One particularly useful type is a **research or education stopping point**. If the next engineering choice would benefit greatly from understanding a paper, a working implementation, or a small cluster of domain ideas, the system can recommend a targeted reading or practical exercise before continuing.

This shouldn't become a procedural gate or an excuse to assign homework. The point is to improve the human's ability to recognize possibilities and ask better questions. Sometimes an explanation or demonstration supplied immediately by the LLM is enough; other times, acquiring tacit skill changes what the human can usefully direct.

The stopping rule is always conditional on the parent purpose, budget, and likely value of additional understanding.

### [REM-02.04] Preserve existing behavior and recover the user's real intent

When changing an existing system, don't destroy or ignore what was already there. Even an awkward implementation may encode unstated obligations. Find out which user flows, expectations, and constraints it was satisfying before replacing it.

The same principle applies to requests. A user might describe one example when they mean an entire **class of solutions**. They might say "LLM" while thinking about AI generally, or name a specific control to express a deeper interaction problem. Don't interpret every word so literally that you miss the intent; don't overinterpret it into a project they never wanted either.

When the distinction materially changes the outcome, present meaningful alternatives and help the user discover the actual purpose. When it doesn't, make a sensible choice and proceed.

### [REM-02.05] Recognize solved problems

Before inventing a consequential mechanism, look for existing working implementations, established libraries, relevant GitHub projects, manuals, experiments, and known failure reports.

This isn't merely a way to save code. Prior work can reveal hidden constraints, interfaces, and entirely different formulations of the problem. Reuse what fits, adapt what almost fits, and only invent the missing capability when the alternatives have been investigated sufficiently.

### [REM-02.06] Budget unfamiliar knowledge

A useful investigation doesn't require understanding an entire field before starting. Identify the **smallest body of unfamiliar knowledge** that could change the next consequential decision.

Some things should become tacit skills through practice. Others require operational understanding. Still others are merely worth knowing exist so we can retrieve them when needed. This keeps learning proportional to the ambition instead of turning every project into an unlimited research syllabus.

## [REM-03] Practical testing and engineering evidence

### [REM-03.01] Start with a coal mine canary

Before building the full architecture, identify the uncertain capability on which the project depends and create the cheapest demonstration that actually exercises it.

For an RC plane, a meaningful early test might establish a structural or control capability under plausible loads. For a remote desktop system, it might establish that an actual input reaches the remote session, produces the expected effect, and survives the relevant reconnect sequence. Merely testing that a helper function returns the value we wrote it to return establishes very little.

A canary is not necessarily a tiny unit test. It is the **smallest representative encounter with the consequential uncertainty**.

### [REM-03.02] Test real obligations, not rhetorical correctness

We are engineers, not mathematicians. Test cases should earn their cost.

Prefer representative user flows, integration boundaries, and plausible failure modes that could change a decision. Ask: What could this test reveal that we don't already know? Does it exercise a real uncertainty or obligation? Would failure change what we build? Is the test itself realistic enough to matter?

A clean synthetic unit test may be useful for a mathematical kernel, but it doesn't certify that the entire product works. Conversely, exotic failures aren't automatically worth testing just because a textbook says they can occur. Their priority depends on stakes, exposure, and whether we can infer the behavior reliably from the architecture.

Parameterize and automate the tests that genuinely matter. Use selective fuzzing when a boundary contains many relevant combinations, rather than writing dozens of repetitive hand-crafted cases. Always include a representative **actual user flow**.

Don't mistake a passing test for practical utility. Record the conditions tested, what was observed, and which uncertainties remain.

## [REM-04] Interfaces, long-term use, and symbiotic communication

### [REM-04.01] Would I understand this a week or a month from now?

A capability that exists but cannot readily be found, understood, or invoked has reduced practical value.

Imagine returning after a month. Do the names, spatial organization, and visible controls make the intended action recognizable without reconstructing the original design discussion? Can a first-time user understand it during a live demonstration? After becoming familiar, can an experienced user act quickly without unnecessary ceremony?

Real usage is usually lopsided: a few capabilities become habitual, many are rarely touched, and some are forgotten. That should affect the interface. Frequent actions deserve direct routes; uncommon but important actions still need discoverable, memorable homes. A feature's existence isn't justified just by being individually clever.

### [REM-04.02] Never make the user hostage to an opaque system

I hate pressing a button and having no idea what happened. "Failed—retry" without a reason or copyable diagnostics isn't a useful explanation.

A user shouldn't need to understand the internals of the software to accomplish an ordinary intention. But the system shouldn't hide what it's doing either.

A practical pattern is a friendly, centralized **What's happening?** view: the current action, progress or waiting state, meaningful failures, available recovery steps, and—when useful—a **Troubleshooting details** toggle with **Copy details**. The ordinary experience stays simple while the actual evidence remains inspectable by a human or an LLM.

Not every operation can finish immediately. The important difference is between an understandable wait with recoverable state and a silent freeze that leaves the user guessing.

### [REM-04.03] The live-demonstration test

Imagine explaining the system while standing next to a first-time user. Where do their eyes hesitate? Which label requires translation? Where do you have to say "click this, even though it sounds like something else"?

Treat repeated explanation as possible **interface friction**, not automatically a reason to write more onboarding documentation.

Ask whether a critical interaction misses an opportunity for an **"oh wow" that also has practical value**. Streaming text from an LLM can be impressive because it provides visible progress and immediate partial utility. But if streaming isn't technically worthwhile, a clear working state and responsive interface might deliver the actual benefit with much less complexity.

Evaluate the same flow three ways: a cold demonstration, a return after forgetting the details, and quick use by a familiar but increasingly impatient user. An interface should serve all three without forcing the user to manage the implementation.

## [REM-05] Self-improving systems and the investigation loop

### [REM-05.01] Tighten the loop

One ambition I have for engineering is that **a sufficiently mature system should progressively take over more of the repetitive work required to run, investigate, and improve itself**.

The loop is: intention or hypothesis → implementation or experiment → observation → critique → revision. LLMs make this interesting because they can help design experiments, inspect evidence, propose changes, and repeat portions of the cycle. The faster and clearer this loop becomes, the more ambitious a human can afford to be.

But we shouldn't confuse autonomy with usefulness. A system that retries indefinitely, obscures its failures, or continuously optimizes the wrong objective isn't a success. Automate routine evidence-gathering and execution while preserving human control over the bigger picture, consequential trade-offs, and stopping decisions.

### [REM-05.02] Human agency as the scarce resource

A human shouldn't have to spend their attention reproducing tedious tool sequences, reconstructing state, or reminding agents what the project is for. Ideally, the human works at the level of intention, meaningful choices, surprising evidence, and critique.

That requires inspectable progress, stable conventions, recoverable context, and enough transparency to intervene when a result is wrong. "Self-improving" should mean **less repeated human work and better practical outcomes over time**, not more invisible mechanisms the human must trust.

## [REM-06] Heuristics and feature engineering

This section is a specialized application of the preceding principles. It concerns deciding which signals we should use to recognize, classify, or act upon something—and how those signals might change in relevance as new information arrives.

### [REM-06.01] Static features: what does this clue actually resolve?

Suppose we're identifying an object from several imperfect features. Don't start by assigning arbitrary weights until the classifier seems to work. Start by investigating the **failure taxonomy** of each feature.

What can the feature distinguish? Under what conditions does it misidentify the thing we care about? Is it strict enough to reject genuine cases? Is it so loose that unrelated objects pass? How expensive is it to acquire, and which mistakes are actually costly?

We can partially rank features along three distinct axes:

- **Discriminating power:** what alternatives does the feature actually rule out?
- **Acquisition cost:** what computation, sensing, latency, or maintenance does it require?
- **Practical error cost:** which false positives and false negatives matter for our goal?

The original notes used a helpful intuition of **resolving bits**, comparing a feature to a clue that partitions possible cases. If four equally likely candidates are distinguished perfectly, identifying one requires two bits. But multiplying a nominal bit count by a success fraction is not, by itself, a calibrated information-theoretic quantity. Real evidence depends on the candidate distribution, conditional error rates, and correlations between features.

We can usually start with a partial ranking and the question **what do I marginally gain by including this next feature?** Two individually strong features may be redundant. A weak feature may be useful because it resolves precisely the confusion left by the others.

A good failure certificate says *why* a feature failed, rather than merely encouraging us to adjust another weight and say "trust me bro."

### [REM-06.02] Dynamic feature engineering: when static clues aren't enough

Static features may fail in ways that are obvious to a human semantic reasoner. Suppose we're asked to find a cat, but a quick visual pass doesn't reveal one. We might notice a tail behind a couch, infer possible occlusion, and deliberately inspect the hidden region. Or we might reconsider the assumption that a cat is actually present.

Our next observations depend on our developing hypotheses and expectations. **Dynamic feature engineering** tries to encode some of that conditional behavior economically, without requiring an entire general-purpose semantic reasoner in the recognition loop.

Start with concrete failures of the static process. What observation should trigger further investigation? Which candidate explanations become relevant? What targeted evidence would discriminate them? What should make the process stop?

Be careful: a semantic reasoner's ability to solve an example doesn't mean we already know the minimal computational process responsible. Introspection can easily produce a monstrously elaborate algorithm.

And adaptation isn't automatically improvement. A dynamic recognizer can start admitting noise as a genuine match, or gradually reject valid examples it previously handled. Compare it with the static baseline on representative accepted and rejected cases, including sequences that expose these errors.

### [REM-06.03] Reference states, drift, and the validity of adaptation

If a system continuously adjusts its expectations, it needs to distinguish useful learning from uncontrolled drift.

Imagine slowly altering an input until an adaptive recognizer accepts an obviously wrong object—or rejects a known exemplar after gradually shifting its internal reference. Smoothness alone isn't evidence that the new state is correct.

Possible mitigations include retaining a trusted baseline or reference distribution, limiting how far and how quickly adaptation can move, checking against representative known-good examples, and being more cautious when changes continue in one direction without supporting evidence. These are *candidate mechanisms*, not universal guarantees: even a bounded adapter can be manipulated.

We should also understand the **domain of validity** of our learned features. More samples can improve estimates under suitable sampling assumptions; the central limit theorem alone doesn't establish that samples are representative or that the data source is trustworthy. Low variance isn't inherently suspicious, but it limits what we can infer about conditions we haven't encountered.

A semantic reasoner also evaluates whether a hypothesis is plausible in the first place. Clouds might resemble a cat without there literally being a cat in the sky. A dynamically self-consistent explanation can still be absurd relative to our broader knowledge.

Do we then need an infinite tower of mechanisms for validating our validators? Not necessarily. We can return to the hypotheses, evidence, and consequences we actually care about, compare rival explanations, and stop at sufficient confidence for the decision. The deeper philosophical problem can remain open without forcing another engineering subsystem into existence.

## [REM-07] Recursive combinatorial exploration of system behavior

This is an **optional specialized technique**, useful when a system has interacting states, events, and actors that are too numerous or awkward to enumerate mentally. It is not a mandatory process for every engineering problem.

Consider a remote desktop application with a client tab, a session, a controller, input focus, and reconnect logic. Each component might behave correctly in isolation while their combinations produce unexpected results. We want a way to investigate those interactions without pretending an engineer or LLM can reliably hold every sequence in their head.

### [REM-07.01] Construct an adequate abstraction

At depth \(d\), represent the relevant elements as a labeled graph:

\[
G_d=(V_d,E_d), \qquad V_d=\{n_1,\ldots,n_m\}.
\]

For each element, describe its possible local states, dependencies, and the reason it belongs in the model. The admissible global states form a set \(S_d\) contained in the product of the local state spaces.

The graph's edges describe relationships between elements, not necessarily transitions between whole-system states. State what the abstraction omits and what question it is designed to answer.

### [REM-07.02] Audit relationships when the interaction cost warrants it

For a small enough model, a full ordered-pair relation audit can reveal dependencies we forgot to consider. Classify relevant pairs as **admissible, conditional, inadmissible, or unresolved**, and preserve the reason for each classification.

But examining every pair costs \(O(m^2)\), and pairwise relationships alone cannot express every higher-order interaction. Don't require a giant relation matrix simply because one can be generated. Use the complete audit when its coverage justifies the cost; otherwise partition the system, focus on consequential interfaces, or explicitly bound the omitted interactions.

A path A → B → C is not automatically a direct A → C relationship. Don't silently promote an indirect dependency into a direct one.

### [REM-07.03] Refine only where the question requires it

Any element may be decomposed into a finer model. For each consequential component, ask what internal distinction could change the result. If none is relevant, treat it as atomic **for this investigation**, not as fundamentally indivisible.

This is the same stopping principle we use elsewhere in REM and RSM. The abstraction should expand to answer a question, not expand merely because more detail exists.

### [REM-07.04] Specify events, states, and what each actor knows

Let \(A_d\) be the allowed events, and represent transitions by a possibly nondeterministic relation

\[
T_d\subseteq S_d\times A_d\times S_d.
\]

An event might be a connection, disconnection, delayed response, refresh, focus change, or a human action. An event can have more than one admissible outcome.

Distinguish the **actual system state** from each actor's observations and beliefs. A user might think a session is gone even though it remains active; a controller might believe it owns focus after another tab has taken over. Forgetting, stale observations, and mistaken inference can themselves affect subsequent behavior.

### [REM-07.05] Actually compute the combinations

Given initial states \(R_0\), we can repeatedly apply the transition rules to find reachable states:

\[
R_{k+1}=R_k\cup
\{s'\mid \exists s\in R_k,\ a\in A_d:\ (s,a,s')\in T_d\}.
\]

Run an actual small program—breadth-first search is often enough—to explore the model, deduplicate visited states, and preserve predecessor links so surprising traces can be reconstructed.

If exhaustive search is too expensive, state the limits: exploration depth, number of states, reduced components, or assumptions used. A program that enumerates abstract rules is **not** the same as running the implementation or testing the actual user flow.

### [REM-07.06] Investigate consequential violations

Define meaningful obligations independently of the search. For example, *a second controller must not issue input after another controller has acquired ownership* is more useful than *there should be no bugs*.

If the exploration finds a violation, reconstruct a short event sequence that leads to it. The trace helps us understand the causal route under the model. The shortest trace isn't necessarily the most probable or costly path in the real system.

Distinguish a modeled defect, a reachable state, and a real consequential failure. Several small defects might combine into something severe. An unusual state isn't automatically a bug if the intended system permits it.

### [REM-07.07] Correct, compare, and rerun

A counterexample could reveal a real implementation defect, an incorrect requirement, or an abstraction that admits impossible behavior. Diagnose which before modifying the code.

Then adjust the implementation or model, rerun the exploration, and—when the distinction matters—exercise the corresponding **realistic integration flow**. The absence of a counterexample only supports conclusions within the stated model and search bounds.

### [REM-07.08] Keep evidence proportional to the investigation

A useful handoff might include the elements and states, their important dependencies, the event rules, search bounds, and a few reconstructible counterexample traces. A full relation matrix and exhaustive state graph are valuable only when the problem warrants them.

**Engineers identify what can exist and why it matters. Computation explores combinations we can't reliably enumerate mentally. Actual system tests tell us whether the model corresponds to the thing we built.**

---

## Unresolved questions worth keeping outside the core method

The original REM notes contain further hypotheses that deserve investigation rather than premature promotion into rules: how to quantify psychological failure costs; when a feature's "resolving bits" can be calibrated as actual information gain; whether smooth or asymmetric adaptation guards generalize beyond specific drift problems; and which forms of automated self-revision improve total engineering productivity rather than shifting work elsewhere.

These are possible research branches. Their existence does not require us to complicate every REM investigation with new fundamental components.
