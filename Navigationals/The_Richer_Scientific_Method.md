# The Richer Scientific Method
### An operational architecture for reasoning, investigation, and navigation


## Reference and activation convention

**Clause addressing.** Every substantive provision has a permanent **RSM** identifier. `RSM-04` denotes a section; `RSM-04.03` its clause; `RSM-09.C.01` a calibration case passage. These IDs identify **ideas and operational commitments** to abide by. **Do not renumber an existing ID when editing**; append new IDs and mark deprecated text explicitly. The printed numeric section title is secondary to its stable RSM ID.

**While investigating:** Cite the **smallest relevant RSM clause(s)** at the point where they materially guide a choice, rather than merely listing section numbers at the end. Example: `Why this representation: [RSM-03.02]`; `Backward constraint applied: [RSM-04.01]`; `Qualified result: [RSM-01.04, RSM-04.04]`. A report may group operational citations in a compact **method trace** so references don't interrupt every sentence. Cite external papers and primary evidence separately;

**For navigation and criticism:** Requests such as `expand RSM-03.03`, `test RSM-04.03 against a counterexample`, or `show every claim dependent on RSM-05.02` should resolve to the indicated passage and its operational implications. Record both **the clause used** and **why it was used**; don't make citations decorative. When a clause's method is inapplicable, say so instead of forcing it. Calibration case IDs show the motivation or failure signature of a method; they are *examples*, not universal laws.

**Method trace convention (minimal):** `Decision or inference → [RSM clause IDs] → reason relevant → evidence/certificate → limitations.` Within research trees, link each branch's **why this branch?** to one or more clause IDs, source evidence, and a possible consequence of resolving the branch. Track which clauses were productive, unnecessary, or misleading **in a specific investigation** before suggesting revisions to this framework. 

**Use this as an operating discipline.** The point of each operation below is to correct a failure we encountered while reasoning about real or stipulated systems; do not execute a step unless the question makes it relevant.

## Purpose

The Richer Scientific Method (RSM) is an exposition and consolidation of my thoughts and experiences applying the scientific method to various problems I've encountered in my life. It is an attempt to develop a clearer, more systematic way of investigating problems, asking better questions, and building upon what we've learned.

Often we don’t actually care about the question in itself, but the broader landscape of questions it belongs to, where that question is simply an element in that set. Is our initial question \(Q\) even the right sort of question to be asking? What are we actually trying to understand or accomplish? What is the bigger picture, or parent purpose \(P(Q)\), that motivated the question in the first place?

Understanding that larger purpose helps us discover other questions we might not have considered, and reason clearly and more objectively about what actually matters and which questions are actually relevant.

The goal isn't just to arrive at an answer but to arrive at an understanding of the answer and an understanding of the trajectory to the answer, and what sub conditions or constraints could materially change the answer.

We need a clear and consistent methodology and contract for going about this so that we or someone else can revisit it, challenge it, and build upon it and LLMs can work on problems in a consistent way and inspectable way.

This is particularly important when working with large language models, where we want different models and investigators to approach problems in a consistent, inspectable way without having to reconstruct the reasoning from scratch.

## [RSM-01] The kernel: four epistemic objects, one investigator

To address this, we start by breaking down any process or investigation into four main objects: **Model (M), Belief (B), Question (Q), and Certificate (C)**.

These aren't meant to be four rigid steps that every investigation must follow. They're a way of keeping track of different parts of our reasoning so that we don't confuse our assumptions with observations, our questions with the underlying problems, or our conclusions with the evidence supporting them.

### [RSM-01.01] Model (M)

A model is our current representation of the problem or system we're investigating. It might describe the system's state, its decomposed parts, the relations amongst those parts, its constraints, and its dynamics.

The central metaphor and representation we use in RSM is that of an **investigation tree**. We can start with a problem or question at the root and progressively decompose it into its constituent parts, subproblems, questions, mechanisms, and relationships. Each branch can itself become an investigation with its own models, questions, and further branches. This gives us a way of navigating between the big picture and the individual parts of a problem, at whatever level of detail is relevant.

The root itself can also have parents. Its parent might represent the bigger picture or overarching purpose that the current investigation belongs to. More generally, the entire investigation tree could itself become part of another tree, allowing us to navigate toward an even more holistic picture of the problem and its surrounding landscape.

Importantly, the tree isn't necessarily the actual causal structure of the system. Relations can exist between branches, and different ways of decomposing the same problem may reveal different things. The tree is a way of organizing our reasoning and navigating the investigation.

A model doesn't have to be a mathematical equation or a fully developed theory. It could be a diagram, a simulation, a causal explanation, a collection of observations organized into a useful structure, or several competing representations of the same problem.

The model itself is also something we can investigate and revise. A problem that appears difficult under one representation might become much easier under another. We shouldn't assume our first way of looking at a problem is necessarily the most useful one.

### [RSM-01.02] Belief (B)

Beliefs represent our knowns, hypotheses/ansatz/intuitions/safe and well-reasoned assumptions, napkin-math-like assumptions, unknowns, and unknown unknowns.

We should distinguish between things we've directly observed, things we've inferred from evidence, hypotheses we're considering, and assumptions we've temporarily adopted to make progress. We should also understand, reference, and certify where those beliefs came from, what evidence supports them, and what could cause us to revise them—that is, be capable or aware of sanity checks that could be done to understand within what reasonable scenarios our beliefs hold and when they might no longer hold.

Within our investigation tree, different branches might involve different assumptions, competing explanations, or varying degrees of uncertainty. For example, we might understand how one component of a system behaves while remaining uncertain about how it interacts with another. We can continue investigating the parts we understand without pretending that the rest of the system is equally well understood.

Beliefs aren't necessarily numerical probabilities. Sometimes uncertainty can be described mathematically, while in other situations it's more practical to explicitly state what we know, what we don't know, and which possibilities remain open.

### [RSM-01.03] Question (Q)

A question describes a curiosity, a doubt, a need to understand, explain, discover, or change something.

As discussed in the Purpose, often we don't actually care about the question in itself, but the broader landscape of questions it belongs to, where our initial question is simply an element in that set.

Within our investigation tree, a question can be decomposed into subquestions, related to other questions, or traced upward to its parent purpose \(P(Q)\). We can ask whether the question itself is even the right sort of question to investigate, what other questions might be more relevant, and what the possible answers to those questions would change about our understanding of the bigger picture.

Questions themselves should also evolve throughout an investigation. As we discover new information, examine competing explanations, or encounter unexpected obstructions, we might discover that our original question was too narrow, relied on an incorrect assumption, or overlooked something more fundamental.

The best questions are often the first-principles or childlike ones, such as **"How do you make an RC car?"** These seemingly simple questions often form the richest investigation trees because they open up entire landscapes of possibilities, mechanisms, constituent problems, and alternative approaches that more narrowly formulated questions might overlook.

### [RSM-01.04] Certificate (C)

A certificate represents what we've actually established or learned from an investigation, including the reasoning, evidence, and trajectory that led us there.

It's basically like the references you see indexed and put at the end of a research paper. If anyone doubts a line of your inference, has misgivings about your interpretation of something, or is genuinely curious about what you synthesized a particular line of reasoning from, they could literally just check the first-hand resource themselves.

As discussed in the Purpose, the goal isn't just to arrive at an answer but to understand the answer itself, the trajectory to that answer, and what subconditions, assumptions, or constraints could materially change it.

We should be able to **reference and certify our conclusions**. That is, understand what we're claiming, why we believe it, what evidence or prior results support it, what models and assumptions it depends on, and within what reasonable scenarios it remains valid. We should also be capable or aware of sanity checks, counterexamples, or experiments that could challenge those conclusions.

Within our investigation tree, certificates allow us to preserve what we've learned from individual branches and use those results in the larger investigation. Once we've investigated a subproblem sufficiently for the purposes of its parent, we can collapse that branch into a useful summary of its findings, assumptions, and limitations, rather than repeatedly investigating the same things from scratch.

Importantly, a certificate doesn't necessarily mean we've proven something true. We might have established a mathematical result, gathered empirical evidence, developed a well-reasoned hypothesis, or identified an obstruction that prevents us from proceeding further. The certificate should reflect what we actually know and what remains uncertain.

This gives us a consistent and inspectable way of building upon previous investigations, whether we're working alone, collaborating with other people, or using LLMs to investigate different branches of a problem.

### [RSM-01.05] Investigator

The investigator is whoever is conducting the investigation, whether that's a human, an LLM, or several people and models working together.

We can think of an investigation as a process in which the investigator works with the current Model, Beliefs, and Question to produce a Certificate:

\[
(M,B,Q)\longrightarrow C
\]

But this isn't a one-way process where we simply input a question and receive an answer. **The investigation is itself a continuous process of learning, questioning, experimenting, and revising our understanding.** What we discover might change our beliefs, reveal limitations in our model, or even cause us to reconsider whether we were asking the right sort of question in the first place.

Within our investigation tree, we can navigate upward toward the bigger picture, downward into constituent problems, or across branches to investigate relationships, competing explanations, and alternative approaches. Each branch can become its own investigation, with its own questions, models, beliefs, and certificates. What we learn in one branch might materially change what we should investigate in another.

Depending on the problem, we might use experiments, mathematical proofs, simulations, historical comparisons, computational searches, or other methods. The point isn't to prescribe one universal sequence of operations, but to give us a consistent methodology for selecting and applying whichever methods are actually relevant to the investigation.

This also allows different investigators to work on different parts of a problem while preserving a shared understanding of the bigger picture. For example, one investigator might research existing scientific literature, another might develop a simulation, and another might investigate competing explanations. Their findings can then be brought back into the larger investigation to expand on, contribute to, resolve, or debate the need for any node in the investigation tree, with their reasoning, assumptions, evidence, and limitations preserved.

Ultimately, the investigator should be able to reason about not just **what to investigate next**, but **why that investigation is relevant, what its possible outcomes could change, and whether it is worth pursuing relative to the bigger picture**.

## [RSM-02] Before solving: interrogate the question

One of the most important things we should do before attempting to solve a problem is ask ourselves: **Are we even asking the right sort of question?**

Often, a question is simply our first attempt at expressing some underlying curiosity, problem, or ambition. We might have an intuitive sense of what we're trying to understand or accomplish without yet knowing how to formulate the question properly.

This is why we shouldn't immediately commit ourselves to answering the initial question \(Q\). Instead, we should investigate the broader landscape of questions it belongs to, including its parent purpose \(P(Q)\), alternative formulations, and the other questions that might help us better understand what we actually care about.

### [RSM-02.01–02.03] Recover the real intent and examine our assumptions
<!-- RSM-02.01 RSM-02.02 RSM-02.03 -->

We should start by asking what motivated the question in the first place. What are we actually trying to understand, explain, discover, or accomplish? Is the question itself what we care about, or is it simply one possible route toward a bigger goal?

For example, suppose someone asks, "How can we make this computer faster?"

Before searching for faster processors or optimization techniques, we might ask what they're actually trying to accomplish. Perhaps they want to run a particular simulation, reduce the time needed for a calculation, or make an application more responsive.

These are different problems, and they open up different landscapes of possible solutions. A faster computer might be one answer, but so might a different algorithm, a better representation of the problem, parallel computation, or eliminating unnecessary work entirely.

We should also examine the assumptions embedded in our questions. Does the question already assume a particular mechanism, explanation, or solution? Are we treating something as a necessary constraint when it's merely a consequence of how we've currently represented the problem?

Part of the power of the investigation tree is that we can even ask an apparently "dumb" question, such as **"Can I make an RC plane out of cardboard?"**, yet arrive at a very rich answer and understand the trajectory of reasoning that led us there. This allows us to quickly expose or root out the assumptions embedded in the original question and discover the richer landscape of questions it belongs to.

The point isn't to endlessly criticize every question. It's to reason more clearly and objectively about what actually matters, which questions are relevant, and whether our current formulation is unnecessarily restricting the possibilities we could investigate.

### [RSM-02.04] Learn from what others have already figured out

Before investing substantial effort in an investigation, we should consider what we can learn from previous investigations, existing scientific literature, historical examples, and the experiences of people who have encountered similar problems.

Often, the most useful information isn't another direct answer to our question, but some underlying principle, analogy, or previously discovered obstruction that changes how we understand the problem itself.

For example, if several different approaches to a problem have failed, we should ask what those failures have in common. Are they revealing a shared constraint? Are we repeatedly making the same assumption? Could there be a more general representation that explains why these approaches encounter similar difficulties?

We should use prior knowledge not just to find solutions, but to discover better questions and more useful ways of organizing the investigation.

### [RSM-02.05–02.06] Understand what answering the question would actually change
<!-- RSM-02.05 RSM-02.06 -->

Another useful way to evaluate a question is to consider its possible answers before committing substantial resources to investigating it.

Suppose the answer turns out to be A rather than B. What would that actually change? Would we understand the system differently? Would it reveal a new possibility, rule out an approach, expose an important constraint, or help us make a consequential decision?

If the plausible answers wouldn't materially change anything relevant to the larger investigation, perhaps we're focusing on the wrong question or investigating it at an unnecessarily fine level of detail.

This doesn't mean every investigation needs an immediate practical application. Curiosity and the desire to understand something can themselves be perfectly legitimate purposes.

The idea is to understand **why a question is worth asking in the context of the broader investigation**, rather than manufacturing questions, experiments, or increasingly elaborate analyses simply for the sake of having something to investigate.

We should also be willing to revise our questions as we learn. Sometimes a narrow question is exactly what we need to make progress. Other times, we need to move upward toward the bigger picture or explore alternative questions before deciding which branch deserves our attention.

### [RSM-02.07] Questions should evolve as our understanding evolves

A question isn't something we formulate once and then blindly pursue until we arrive at an answer. The question itself should evolve as we learn more about the problem.

As we investigate, we might discover new mechanisms, encounter unexpected obstructions, find better representations, or realize that some of our original assumptions were mistaken. Any of these discoveries could materially change which questions are worth asking next.

In other words, **the trajectory of an investigation should influence the questions we ask, rather than having our initial questions dictate the entire trajectory**.

### [RSM-02.08] Choosing questions is itself a form of investigation

We shouldn't think of question selection as something that happens only before the real investigation begins. Figuring out what to ask next is itself part of learning about the problem.

For any candidate question, we can consider what its possible answers would reveal, what assumptions they could challenge, what new branches they might open up, and whether answering it would help us understand the bigger picture.

Take our earlier question: **"Can I make an RC plane out of cardboard?"**

Before even investigating it, we can explicitly write down a few potential answers and think about what we would do next depending on which answer turns out to be true.

| Potential answer | What would we investigate next? |
|---|---|
| **A. No.** | Why not? And why not exactly? What physical, structural, or aerodynamic constraints prevent it? |
| **B. No, unless we do A, B, C.** | What modifications or additional conditions would make it possible? More importantly, do these modifications actually preserve the *spirit* of our original question, or have we effectively changed what we're trying to accomplish? |
| **C. Yes.** | Can we find research papers, YouTube videos, or actual working examples of someone doing this exact thing? What can we learn from their experience? |
| **D. Yes, but it's limited to X, Y, Z.** | What exactly are those limits? Why do they exist? Could we explore or extend them, and what happens as we approach those boundaries? |

Notice how each possible answer leads to a different trajectory of investigation. Even before knowing which answer is correct, we've already begun exposing the assumptions, constraints, and broader landscape of questions surrounding our original curiosity.

In fact, **it's good practice to explicitly write down potential answers and what we would do next based on those answers before beginning an investigation**. I haven't seen this done very often as an explicit practice in scientific literature, but it can be a useful way to reason more clearly about why we're asking a question in the first place.

This also helps us recognize when a particular answer wouldn't actually satisfy what we originally cared about. For instance, if building a cardboard RC plane requires replacing most of the cardboard with conventional structural materials, we might technically have achieved flight without preserving the spirit of the original question.

The point isn't to predict every possible answer or construct an exhaustive decision tree. It's to consider a useful range of plausible answers, including surprising or conditional ones, and understand what each would change about our understanding or next steps.

Doing this helps us ask better questions, better understand the big picture, and explore the landscape of questions we actually care about.

This is somewhat like choosing where to explore on an unfamiliar map. We don't necessarily need to examine every location. We want to investigate the regions, boundaries, and connections that could most meaningfully improve our understanding of the landscape.

### [RSM-02.09] Recover the bigger problem, not just a better-sounding question

When someone asks a question, we shouldn't assume they've already identified the most useful way of expressing what they actually care about.

Rather than simply rewriting their question into something more technically precise, we should try to understand the underlying curiosity, problem, or ambition that motivated it.

From there, we can explore the broader set of questions that might address that purpose. Some might be more fundamental, others more practical, and others might expose entirely different possibilities or explanations.

For example, if someone asks how to build a faster RC car, perhaps they're interested in improving its top speed. But they might actually care about learning how to design high-performance RC vehicles, understanding the physical limits of their design, or developing general skills in mechanical and electrical engineering.

These different parent purposes would lead to different investigation trees, even though they began with the same question.

The goal is not to arbitrarily replace someone's question with one we consider more sophisticated. It's to help them understand the landscape well enough to reason clearly and more objectively about which questions are actually relevant.

### [RSM-02.10] Navigate upward toward purpose and backward toward requirements

One useful way of navigating an investigation tree is to alternate between asking **why we want something** and **what would actually be required to accomplish it**.

Suppose we're trying to build a particular system and encounter a technical limitation. Rather than immediately attempting to overcome that limitation, we can move upward in the tree and ask what the system was originally supposed to accomplish.

We can then work backward from that bigger goal to identify its actual requirements, constraints, and possible approaches.

This helps us distinguish between constraints that are genuinely necessary and constraints that only exist because of the particular implementation we've chosen.

The Apollo program offers a useful historical example to investigate here. Rather than treating the limitations of an onboard computer as the fundamental problem, we can ask what navigation, guidance, and control capabilities the mission actually required, and then investigate the different ways those capabilities could be realized under the available hardware and operational constraints.

The broader idea is that **a limitation in one proposed solution isn't necessarily a limitation of the underlying goal**.

### [RSM-02.11] Navigate recursively between the question, its parents, and its children

An investigation tree isn't something we can only move downward through.

Any question or problem might have a parent representing its bigger purpose, and that parent might itself belong to an even more holistic investigation. Similarly, any node might be decomposed into constituent questions, subproblems, mechanisms, or constraints.

We should be able to move between these levels depending on what we're trying to understand.

For example, suppose we're learning how to build an RC car. We might descend into questions about motors, batteries, gearing, steering, control systems, and mechanical design.

But we might also move upward and ask why we're building an RC car in the first place. Are we trying to own a working vehicle? Learn how to build RC devices generally? Develop a better understanding of robotics? Or use the project as a way to build practical engineering competence?

Each answer could change which constituent problems deserve our attention and how deeply we should investigate them.

We should also recognize that a question can serve several legitimate parent purposes. We don't necessarily have to collapse these into one.

The important thing is to maintain a clear understanding of how the constituent problems relate to the bigger picture, and whether investigating a particular branch is actually helping us accomplish or understand what we care about.

We should stop moving upward when we've reached a sufficiently clear understanding of our purpose, and stop decomposing downward when further detail is unlikely to materially change the conclusions or decisions we need to make at the parent level.

### [RSM-02.12] Explore the landscape of questions, not just the landscape of answers

An initial question is only one possible entry point into a much richer landscape.

We can explore nearby questions, competing formulations, inverse questions, boundary cases, questions at different scales, and alternative approaches to the same parent purpose.

For instance, if we ask, "How do we make an RC plane fly?", we might also ask what prevents it from flying, what makes it stable or unstable, which components are actually necessary, how different designs achieve flight, or whether the assumptions behind our proposed design are even justified.

These aren't simply additional questions to answer for the sake of completeness. Each can expose different mechanisms, constraints, or possibilities that change how we understand the original problem.

Ideally, we want to develop a sufficiently rich landscape of questions that we can understand not just how one particular solution works, but **what broader family of possibilities it belongs to and why different approaches succeed or fail**.

We don't need to enumerate every conceivable question. We should explore enough of the landscape to identify the relevant distinctions, understand the meaningful alternatives, and decide where further investigation would actually contribute something.

## [RSM-03] Representation: find the right problem, not just a faster solver

One of the most powerful things we can do when investigating a problem is change how we represent it.

Often, a problem appears difficult not necessarily because the underlying problem is inherently difficult, but because of the particular way we've chosen to formulate or represent it.

Within our investigation tree, we should therefore be able to do more than simply decompose a problem into increasingly smaller parts. We should be able to reorganize the tree itself, introduce new ways of describing the problem, explore competing representations, and investigate how these changes affect what becomes possible to understand or solve.

### [RSM-03.01–03.03] Parameterize, decompose, and abstract
<!-- RSM-03.01 RSM-03.02 RSM-03.03 -->

When representing a problem, we should first try to understand the broader family of problems it belongs to, rather than treating the particular instance we're investigating as something completely isolated.

For example, if we're investigating how to build an RC plane out of cardboard, we could consider a family of possible designs with different masses, wingspans, structural arrangements, materials, propulsion systems, and flight conditions.

Instead of only asking whether one particular cardboard plane can fly, we can investigate how changing these parameters affects what is possible.

This is **parameterization**: identifying the variables and conditions that define a broader landscape of related problems.

We can then **decompose** the problem into constituent parts and their relationships. For our RC plane, we might investigate aerodynamic lift, structural integrity, propulsion, stability, control, and energy requirements.

However, decomposition alone isn't enough. We also need to understand which distinctions actually matter for the question we're trying to answer.

This is where **abstraction** becomes useful. We can temporarily ignore details that don't materially affect what we're investigating while preserving the relevant structure and relationships.

A famous example is the Seven Bridges of Königsberg problem. Rather than investigating the exact geometry of the bridges and surrounding land, Euler represented the problem in terms of connected regions and bridges. This allowed him to reason about whether a route crossing every bridge exactly once was possible without having to calculate the geometry of every possible route.

**The right representation can make a difficult problem much easier to understand by exposing the structure that actually matters.**

Within our investigation tree, this means we should continually ask whether the current decomposition, parameters, and relationships are the most useful ones for investigating the question.

### [RSM-03.04] Sometimes adding more variables makes a problem easier

It might seem intuitive that simplifying a problem always means reducing the number of variables or constituent parts we need to consider.

But sometimes the opposite is true.

We can introduce additional variables, intermediate representations, hypothetical mechanisms, or new ways of describing the system that make its underlying structure easier to reason about.

For example, in mathematics, introducing a substitution can transform a complicated equation into something much easier to solve, even though we've temporarily introduced another variable.

Similarly, in structural engineering and compliant mechanisms, we might initially approximate certain components as rods, beams, springs, or simple joints to quickly explore candidate designs and find potentially stable or mechanically useful configurations.

Rather than immediately performing an expensive finite element analysis (FEA) on every conceivable design, we can start with a simpler representation to understand which structural arrangements look promising. Once we've identified useful candidates, we can investigate them at a higher resolution, using FEA to examine stresses, deformations, buckling, local flexibility, and other behaviors that our initial model might have overlooked.

We might then optimize the candidate structures further, for example through structural etching or material removal to reduce mass and improve lateral flexibility, or through topology optimization and adaptive mesh refinement to concentrate computational effort on the regions where greater resolution actually matters.

This is especially useful in compliant mechanisms, where we might deliberately want certain regions to flex while maintaining stiffness elsewhere. The design problem isn't necessarily to maximize stiffness everywhere, but to discover an appropriate distribution of stiffness, flexibility, material, and geometry.

We can therefore alternate between cheaper, approximate models that help us explore a much larger landscape of candidate designs and more detailed models that help us evaluate, refine, and optimize the most promising ones.

An analogy I like to borrow from physics is the use of **renormalization, coarse-graining, first-order approximations, and effective parameters or variables**.

Rather than explicitly representing every microscopic interaction, we can sometimes use a smaller set of effective quantities to reason about a system at the scale we're actually interested in. This makes otherwise difficult calculations or investigations more tractable, while preserving the possibility of returning to the underlying mechanisms when greater resolution becomes necessary.

For example, in nuclear physics, concepts such as interaction cross sections, neutron transport, and effective interaction probabilities allow us to reason about complex physical processes without having to individually follow every possible microscopic interaction. The usefulness of these approximations depends on the physical regime and the questions we're trying to answer.

The Manhattan Project's gaseous diffusion work offers another example of using effective physical quantities. Rather than individually tracking the trajectories of enormous numbers of gas molecules, engineers could reason about uranium isotope separation using molecular masses, diffusion behavior, and separation factors.

Feynman diagrams provide a different but complementary example. They give us a way to organize and calculate contributions to interactions in quantum field theory through a diagrammatic representation of perturbative expansions. Rather than treating the entire calculation as one enormous expression, we can organize the relevant contributions by their structure and order of approximation.

These aren't all the same mathematical technique, but they illustrate a broader idea: **we can introduce useful intermediate representations, effective parameters, and different levels of resolution to make an otherwise difficult investigation more tractable.**

Importantly, we should understand what each approximation preserves, what it leaves out, and within what reasonable scenarios its conclusions remain valid. We should also be capable or aware of sanity checks that could tell us when the approximation has stopped being useful.

The goal isn't necessarily to model everything at the highest possible resolution. It's to find representations that let us explore the relevant landscape efficiently, identify promising candidates or explanations, and increase resolution where doing so could materially change our conclusions.

### [RSM-03.05] Coarse-graining: knowing what details we can ignore

When investigating a problem, we don't necessarily need to understand every constituent part at the highest possible resolution.

Often, we can group several mechanisms, variables, or components into a simpler effective representation, provided the distinctions we're ignoring don't materially change the conclusions we care about.

For example, when investigating the overall flight performance of an RC plane, we might initially represent the motor, propeller, and associated electronics as a propulsion system, characterized by effective parameters such as thrust, power consumption, mass, and efficiency.

This lets us investigate the bigger picture without immediately having to understand every electromagnetic interaction inside the motor or the detailed aerodynamics of the propeller.

If we later discover that something about the propulsion system materially affects our conclusions, we can revisit that node in our investigation tree and investigate its constituent mechanisms at a finer resolution.

This is the general idea behind **coarse-graining**: combining lower-level details into an effective description that preserves the behavior or relationships relevant to the question.

However, we should be careful not to average away important distinctions. A system might behave predictably under ordinary conditions but exhibit entirely different behavior near a threshold, under an exceptional condition, or when several otherwise small effects interact.

The point isn't simply to eliminate details, but to understand **which details can be safely represented together and which distinctions could materially change our understanding of the parent problem**.

### [RSM-03.06] Preserve competing representations and explanations

We shouldn't assume that every problem has one uniquely useful representation, or that we must settle on a single explanation before we can make progress.

Different models might describe the same system at different levels of abstraction, emphasize different mechanisms, or make different assumptions about how the system behaves.

For example, we might describe the motion of an RC plane using simplified equations of flight dynamics, a computational fluid dynamics simulation, or an experimental model derived from measurements of an actual aircraft.

These representations don't necessarily compete in every respect. Each might be useful for answering different questions, and their predictions might agree within certain regimes while diverging in others.

Even models that later turn out to be incorrect can sometimes preserve useful relationships or lead to worthwhile discoveries.

A historical example is Carnot's work on heat engines. Although his reasoning was developed within the now-rejected caloric theory of heat, aspects of his analysis helped establish important relationships concerning the limits and efficiency of heat engines.

**A model can be useful without necessarily being a complete or correct explanation of the underlying mechanisms.**

Within our investigation tree, we should therefore preserve competing models and explanations, understand what each one reveals or overlooks, and investigate where their predictions or implications materially differ.

### [RSM-03.07] Investigate obstructions as problems in their own right

When an investigation encounters an obstruction, we shouldn't necessarily respond by performing more calculations, decomposing everything into smaller pieces, or blindly searching for another technique.

We should first try to understand the obstruction itself.

What exactly is preventing us from making progress? Under what circumstances does the obstruction appear? What mechanisms or constraints are responsible? Is it a fundamental physical limitation, a limitation of our current model, or simply a consequence of the particular approach we've chosen?

For example, suppose our cardboard RC plane repeatedly fails because its wings deform under aerodynamic loading.

We could immediately try adding more cardboard or reinforcing the wings, but that might not be the most informative way to proceed.

Instead, we could investigate the wing deformation as its own problem. How does the deformation depend on wingspan, loading, material properties, geometry, and reinforcement? At what point does the wing become unstable? Are we encountering gradual bending, buckling, torsional instability, or some combination of these?

This creates a new branch of our investigation tree, where we can explore the obstruction's constituent mechanisms, relevant parameters, competing explanations, and possible approaches.

We might discover that changing the internal geometry of the wing is more effective than simply adding material, or that a different structural arrangement avoids the problematic loading regime entirely.

We should also investigate what resolving the obstruction would actually change about the parent problem. If we can make the wing sufficiently stiff, does that meaningfully advance our goal of building a working cardboard RC plane, or would some other constraint immediately become dominant?

The objective is to understand the obstruction well enough to decide which approaches deserve further investigation, rather than endlessly refining one local solution.

### [RSM-03.08] How much detail is actually enough?

A recurring question throughout RSM is how far we should investigate any particular branch before returning to the bigger picture.

We could theoretically keep decomposing a problem into smaller and smaller constituent mechanisms, introducing more precise models, running increasingly expensive simulations, and investigating increasingly obscure edge cases.

But more detail doesn't necessarily mean better understanding.

What matters is whether the additional resolution could materially change our conclusions, expose a relevant possibility, challenge an important assumption, or affect what we should investigate next.

For example, if we're trying to determine whether a cardboard RC plane can achieve stable flight, we might not need to model the microscopic fiber structure of the cardboard if ordinary material-property measurements and structural calculations already give us sufficient confidence in the relevant flight regime.

On the other hand, if repeated structural failures suggest that fiber orientation, moisture, or local buckling is important, those previously ignored details may become worth investigating.

We should therefore adapt the resolution of our investigation to the actual problem, refining the branches where additional information matters and collapsing those where we already understand enough to make progress.

The goal isn't to build the largest or most detailed investigation tree possible. It's to build one that helps us understand the relevant landscape and make meaningful progress toward the bigger picture.

### [RSM-03.09] Look for analogous problems and representations elsewhere

One of the most useful things we can do after identifying an obstruction is search for other problems that exhibit similar underlying difficulties.

For example, suppose we're investigating how to make a lightweight cardboard wing sufficiently stiff without introducing excessive mass.

We might find useful ideas in structural engineering, sandwich composites, corrugated structures, compliant mechanisms, topology optimization, or even biological structures such as bird wings and insect exoskeletons.

The point isn't merely to find something that looks similar. We want to understand whether these systems share relevant mechanisms, constraints, or relationships that could help us investigate our original problem.

We should ask what exactly corresponds between the systems, which assumptions are different, and whether the analogy leads to useful calculations, experiments, or candidate designs.

Within our investigation tree, these analogous problems can become connected branches, giving us alternative representations and methods for investigating the same obstruction.

**Careful though!** Two systems might appear similar while behaving very differently under the conditions we actually care about.

We should be able to reference and certify why the analogy is relevant, what evidence supports it, and within what reasonable scenarios we expect its conclusions to transfer.

Find analogies to parts of your problem and use them. **Analogies expand the landscape of possible explanations, representations, and approaches**, especially when our current way of thinking about a problem has stopped producing useful progress.

Analogies allow us to draw from rich ideas in other domains and help us resolve what actually matters in our problem, what is shared between different systems, and what is actually unique to our specific problem.

For example, a bird's wing has a flexible skeletal structure, muscles, and feathers that can dynamically adjust its shape and respond to changing flight conditions. It is part of an active biological system, whereas a cardboard wing is generally a passive structure without those same mechanisms for actively correcting its behavior.

Understanding this distinction helps us identify which ideas might transfer, such as lightweight structural arrangements or controlled flexibility, and which would require additional mechanisms to reproduce. It also opens up new questions: Could we introduce passive flexibility that produces some of the same beneficial effects? Could a compliant mechanism approximate certain aspects of the bird's wing without requiring an equally complex active control system?

## [RSM-04] Investigate the possibility landscape

Once we have a question and some representation of the problem, we can begin exploring the landscape of possibilities surrounding it.

We want to understand not just whether something is possible, but under what conditions it becomes possible, what constraints or mechanisms govern it, what alternative routes might exist, and what the consequences of those possibilities would be.

There isn't necessarily one fixed sequence for doing this. We should move between different methods of investigation depending on what we've learned, what remains uncertain, and which questions are actually relevant to the bigger picture.

### [RSM-04.01–04.02] Investigate what is possible — backward reasoning
<!-- RSM-04.01 RSM-04.02 -->

Suppose we want to build an RC plane out of cardboard.

Rather than immediately choosing a design and trying to make it work, we can start with the desired outcome and reason backward.

What would have to be true for a cardboard RC plane to fly? What aerodynamic, structural, propulsion, and control requirements would it need to satisfy? Which of these requirements are necessary, and which depend on the particular design we've imagined?

We can then explore the different ways those requirements might be satisfied.

For example, perhaps the cardboard doesn't have to support every load by itself. Perhaps a different wing geometry, internal structure, reinforcement arrangement, or flight regime could make the design feasible.

This is **backward reasoning**: starting from an outcome, identifying the conditions necessary to reach it, and investigating the possible mechanisms, actions, or transformations that could satisfy those conditions.

We can also reason backward from outcomes we want to avoid. If our plane must not experience structural failure during flight, what conditions could lead to that failure? What would have to happen beforehand, and what design choices could prevent it?

But what happens after our plane hits a wall or crashes into the ground? Given the real possibility of deforming or damaging its cardboard structures, should we consider modularity and repairability as part of the design from the beginning? Perhaps we want to be able to quickly swap out damaged wings, structural supports, or other cardboard components rather than rebuild the entire aircraft.

What would that capability actually require? What kinds of joints, connections, or fastening mechanisms would allow us to replace parts easily while still maintaining sufficient structural integrity during flight? Could some connections be designed to release or fail preferentially during a crash, protecting more expensive components? How would these choices affect the plane's mass, stiffness, and aerodynamic performance?

Notice how considering a plausible failure scenario reveals an entirely new landscape of design questions and constraints. We aren't just investigating whether the plane can fly, but what it would take for the aircraft to remain practical to operate, maintain, and repair.

Importantly, we should distinguish between constraints imposed by the actual system and constraints introduced by our current representation or proposed implementation.

We should also be willing to consider changing the rules of our proposed approach, provided those changes preserve the parent purpose we're actually trying to accomplish.

### [RSM-04.03] Investigate what follows — forward reasoning

Backward reasoning helps us identify possible routes toward an outcome. Forward reasoning helps us understand what actually follows from those routes.

Given some initial conditions, assumptions, and proposed actions, what happens next?

We might use mathematical analysis, physical experiments, simulations, historical evidence, or existing implementations to investigate the consequences of a particular possibility.

For example, suppose we identify a promising cardboard wing design. We could investigate how it behaves under different aerodynamic loads, how much it deforms, how its deformation affects flight stability, and whether those effects create additional problems elsewhere in the aircraft.

We shouldn't necessarily limit ourselves to one predicted outcome. A design might work under ordinary conditions but fail under stronger winds, higher speeds, or unusual loading conditions.

We should therefore try to understand the broader landscape of outcomes, including relevant thresholds, boundary cases, sensitivities, and alternative trajectories.

**Backward reasoning helps us discover what might make something possible. Forward reasoning helps us understand what happens if we actually pursue it.**

This pairs really well with the practice of generating a question tree before an investigation, which we discussed earlier in **RSM-02.08**. Recall our cardboard RC plane example, where we explicitly considered possible answers—no, yes, yes under certain conditions, or yes but with particular limitations—and what we would investigate next depending on those answers.

Backward reasoning helps us identify what would be required for each possibility to hold, while forward reasoning lets us explore the consequences of those possibilities. Together, they help us generate richer question trees, expose assumptions, and better understand which branches of the investigation are actually worth pursuing.

### [RSM-04.04] Experimentation and self-play: explore the system, not just one solution

Once we have a model or working representation of a system, we can begin deliberately varying its conditions, parameters, assumptions, or proposed actions to explore how its behavior changes.

This is where experimentation, simulation, and what I like to think of as **self-play** become especially useful.

Rather than running one simulation or experiment and treating its result as the answer, we can investigate entire families of related scenarios.

For our cardboard RC plane, we might vary wingspan, mass, material thickness, propulsion power, wing geometry, reinforcement arrangements, and flight conditions.

We could then explore questions such as: Which combinations work? Where do failures begin to appear? Are there unexpected regions where one design outperforms another? Which parameters actually matter most, and which have surprisingly little effect?

We can also deliberately investigate scenarios where our current assumptions or favored explanations might fail.

The purpose isn't to generate as many experiments as possible. It's to learn something consequential about the system, discover relationships or boundaries we hadn't considered, and improve our understanding of the broader possibility landscape.

Importantly, simulation and mathematical self-play reveal what follows **within the assumptions and rules of the model we're using**. They don't, by themselves, establish that those assumptions accurately describe reality.

### [RSM-04.05] Revise what we believe as we learn

As we investigate, we should continually revise our beliefs in light of what we've actually learned.

If an experiment produces an unexpected result, we should ask whether our model was wrong, our assumptions were incomplete, our measurements were misleading, or whether we've discovered something genuinely new about the system.

We should distinguish between direct observations, mathematical deductions, simulation results, approximate calculations, hypotheses, and interpretations of evidence.

For example, a simulation might predict that our cardboard wing can withstand a particular load. But that prediction depends on the material properties, boundary conditions, geometry, and physical mechanisms represented in the simulation.

A real-world experiment might confirm the prediction within some range of conditions, or reveal failure modes the simulation didn't capture.

We should preserve these distinctions in our beliefs and certificates rather than treating every result as equally established.

The point is to maintain an understanding not only of what we currently believe, but **why we believe it, what evidence supports it, and within what reasonable scenarios those beliefs remain valid**.

### [RSM-04.06] Don't assume every investigation has one optimal answer

Not every problem has one best solution, and not every investigation should be reduced to maximizing a single quantity.

For example, the best cardboard RC plane depends on what we actually care about.

Are we trying to minimize cost? Maximize flight duration? Make the aircraft as lightweight as possible? Build something that survives repeated crashes? Learn about aerodynamics and structural engineering? Or demonstrate that an apparently unconventional material can work?

Different goals might lead to different designs, and some goals may compete with one another.

We should therefore investigate the relevant landscape of trade-offs, acceptable outcomes, constraints, and alternatives rather than assuming that one numerical score captures everything we value.

Sometimes a sufficiently good, robust, inexpensive, or easily reversible solution is more useful than a theoretically optimal one.

### [RSM-04.07] Know when to collapse a branch and return to the bigger picture

One of the dangers of an investigation tree is that we can keep descending into increasingly detailed subproblems indefinitely.

We might become extremely knowledgeable about one constituent mechanism while making very little progress on the bigger problem that originally motivated the investigation.

This is why we need to know when we've understood a branch sufficiently for the purposes of its parent.

For example, suppose we've investigated several cardboard wing structures and established that one candidate can withstand the relevant loading conditions with a reasonable margin of confidence.

We might still be able to study the material's microscopic behavior, develop more precise simulations, or optimize the structure further. But would that additional work materially change whether we can build a functioning RC plane?

If not, we can collapse that branch into a certificate containing its relevant findings, assumptions, constraints, uncertainties, and the conditions under which we might need to revisit it.

We can then return to the parent investigation and continue making progress on the bigger picture.

This doesn't mean abandoning the branch permanently. If we encounter new evidence, change our design requirements, or discover that an unresolved distinction matters, we can reopen it.

**The purpose of investigating a constituent problem is to contribute to our understanding of the parent problem, not necessarily to exhaust everything that could ever be learned about that constituent.**

### [RSM-04.08–04.09] Preserve what we've actually learned
<!-- RSM-04.08 RSM-04.09 -->

An investigation doesn't have to end with one definitive solution to have been worthwhile.

We might arrive at a working answer, discover several promising possibilities, establish useful bounds or constraints, identify a fundamental obstruction, or simply develop a better representation of the problem.

These are all potentially valuable results, provided we understand what we've actually established.

We should also be careful about the kinds of claims we're making. Something being possible doesn't necessarily mean it's probable. Something that works under one set of conditions isn't necessarily robust under others. A simulation predicting an outcome isn't the same as experimentally demonstrating it.

Our certificates should preserve these distinctions, along with the reasoning, evidence, assumptions, and limitations behind our findings.

The goal is to leave the investigation with a richer understanding of the problem and its possibility landscape, including **what we now know, what remains uncertain, what could materially change our conclusions, and which questions might be worth investigating next**.

## [RSM-05] The research-navigation structure

An investigation can start with a seemingly simple question and quickly expand into an enormous landscape of constituent problems, competing explanations, research papers, experiments, and possible approaches.

We need a practical way of organizing all of this so that we can navigate between the big picture and the details, revisit earlier reasoning, identify connections between different parts of the investigation, and avoid repeatedly rediscovering things we've already learned.

### [RSM-05.01–05.02] The investigation tree
<!-- RSM-05.01 RSM-05.02 -->

The central representation we use is the **investigation tree**.

We can start with a question, problem, or broader purpose at the root and progressively expand it into constituent questions, mechanisms, models, assumptions, and possible approaches.

Each node can itself become an investigation, with its own questions, competing explanations, evidence, and certificates.

Importantly, we should be able to navigate in both directions. We can descend into a constituent problem when we need greater resolution, or move upward toward its parent when we want to reconsider the bigger picture.

The root itself might also have parents, and an entire investigation tree could become a constituent part of another tree. This lets us organize investigations at different scales, from understanding one physical mechanism to navigating entire fields of scientific knowledge.

We should also be able to collapse branches once we've investigated them sufficiently for the purposes of their parents. Rather than repeatedly reading through every experiment, calculation, and source, we can preserve a certificate summarizing what we've established, what assumptions it depends on, and what could justify reopening the branch.

This becomes especially useful when several investigators are working on different parts of the same problem. They can expand, challenge, resolve, or debate the need for individual nodes while maintaining a shared understanding of how their work contributes to the bigger picture.

### [RSM-05.03] Connect the tree through relationships

Although we use a tree as our central metaphor, the actual relationships between questions, models, evidence, and conclusions don't necessarily follow a strict hierarchy.

A scientific paper might provide evidence relevant to several branches. Two seemingly unrelated problems might share the same mathematical structure. A new experimental result might challenge an assumption used throughout the investigation.

We should therefore be able to connect nodes through relationships such as **depends on, supports, contradicts, competes with, implies, abstracts, refines, or shares an underlying mechanism with**.

For example, suppose our cardboard RC plane investigation has separate branches for structural rigidity, material selection, aerodynamics, and repairability.

A discovery about how corrugated structures distribute loads might be relevant to several of these branches simultaneously. We shouldn't have to duplicate the entire investigation each time. We can preserve the underlying finding and connect it to the questions and conclusions it actually affects.

This also makes it easier to understand the consequences of changing an assumption. If we discover that a material property we relied upon was incorrect, we should be able to trace which calculations, candidate designs, and conclusions might need to be reconsidered.

### [RSM-05.04] Preserve enough information to revisit and challenge our reasoning

For any consequential node in our investigation tree, we should preserve enough information that another investigator—or ourselves a month later—can understand what we were investigating and why.

That includes the question itself, its parent purpose, relevant assumptions, competing explanations, supporting evidence, references, conclusions, and unresolved uncertainties.

We should also preserve why the branch was introduced in the first place. What did we hope to learn? What possible answers were we considering? What would resolving the question change about the bigger picture?

This connects directly to our earlier discussion of certificates. We want someone to be able to inspect a particular line of reasoning, question an interpretation, or trace a conclusion back to its first-hand sources without reconstructing the entire investigation.

Not every node requires an enormous report. The amount of detail we preserve should depend on the importance of the conclusion, the uncertainty involved, and how likely we are to need that reasoning again.

### [RSM-05.05] Navigate the investigation as a connected body of knowledge

As an investigation grows, we should be able to navigate it according to what we're actually trying to understand.

For example, we might want to find all the branches that depend on a particular assumption, compare competing explanations of the same phenomenon, identify unresolved questions, revisit historical approaches, or discover connections between problems that initially appeared unrelated.

We might also want to see which areas of the investigation are well understood, which remain speculative, and where additional experiments or research could materially change our conclusions.

The investigation tree should make it easier to ask questions such as:

- What do we currently know about this part of the problem, and how do we know it?
- Which assumptions or conclusions would be affected if this new evidence turns out to be correct?
- What alternative explanations or approaches have we considered?
- What is the smallest set of sources or prior investigations I should examine to understand this branch?
- Which unresolved questions are actually relevant to the parent purpose?

The goal isn't simply to accumulate information into an increasingly large tree. It's to make that information useful for reasoning, discovering connections, challenging assumptions, and deciding what to investigate next.

Ultimately, the investigation tree should allow us to move between **the holistic picture, constituent problems, evidence, and conclusions** without losing the trajectory of how our understanding developed.

## [RSM-06] Insight, invention, and collaboration

One of the most interesting things about investigating a problem is that, as we become more familiar with its constituent parts, mechanisms, constraints, and relationships, we can begin to develop intuitions about the problem as a whole.

Sometimes we start recognizing patterns or possibilities that weren't apparent when we first began. We might notice that several apparently unrelated problems share an underlying structure, that an obstruction we've encountered resembles something from another field, or that an entirely different representation could make the problem much easier to understand.

This is part of what makes scientific investigation more than simply following a predetermined sequence of questions and answering them one by one.

### [RSM-06.01] Develop intuition through contact with the whole problem

There is a difference between understanding the individual constituent parts of a problem and developing a broader intuition for how the entire system behaves.

For example, someone learning to build RC planes might separately study aerodynamics, propulsion, structural engineering, electronics, and control systems.

But as they begin designing, building, testing, and modifying actual aircraft, they may develop an intuition for how these different mechanisms interact. They might anticipate that a particular design will be unstable, recognize when a structural arrangement seems unnecessarily heavy, or suspect that an unexpected flight behavior has something to do with the relationship between several components rather than any single component in isolation.

These intuitions aren't necessarily formal proofs or established conclusions. They're often provisional ideas developed through repeated experience, comparison, and exposure to different variations of the same problem.

We should take these intuitions seriously enough to investigate them, while still distinguishing them from what we've actually established.

A similar phenomenon appears throughout the history of mathematics and physics. Galois's insights into the relationships between polynomial roots involved recognizing a deeper structure in algebraic equations. The development of entropy likewise involved identifying relationships that connected apparently different thermodynamic processes.

These discoveries weren't simply the result of dividing a problem into smaller parts and solving each one independently. They required recognizing something about the relationships and structure of the problem as a whole.

### [RSM-06.02] An investigation tree organizes reasoning, but doesn't guarantee invention

Our investigation tree helps us decompose problems, navigate their constituent parts, preserve what we've learned, and understand how different findings relate to the bigger picture.

But we shouldn't assume that every important discovery will emerge from following the existing branches of the tree.

Sometimes the most valuable insight comes from realizing that the tree itself should be reorganized.

Perhaps several branches we've been treating as independent are actually manifestations of the same underlying mechanism. Perhaps a distinction we considered fundamental turns out to be unnecessary. Or perhaps we've overlooked an entirely different way of representing the problem.

For example, in our cardboard RC plane investigation, we might initially treat structural rigidity and aerodynamic stability as largely separate problems.

But suppose we discover that allowing certain parts of the wing to deform under aerodynamic loading could actually improve its behavior under some flight conditions.

We may have uncovered a new relationship between structural mechanics and aerodynamics that changes how we should organize the investigation. Instead of independently optimizing wing stiffness and aerodynamic performance, we might investigate aeroelasticity and whether controlled flexibility could be useful.

This is why we should continually look for **relationships across branches, shared mechanisms, analogies, symmetries, invariants, and unexpected connections**.

We should also be willing to introduce entirely new concepts or representations when the existing ones stop being useful.

The investigation tree is a tool for organizing and developing our understanding, not a guarantee that the way we've currently decomposed the problem reflects its most useful underlying structure.

### [RSM-06.03] Preserve the trajectory of insight, not just the conclusion

When we arrive at an interesting result, especially one that changes how we understand the problem, we should try to preserve the trajectory that led us there.

What were we originally investigating? What assumptions did we begin with? Which observations, failed approaches, analogies, or competing explanations led us to reconsider those assumptions?

What was the actual connection or distinction that produced the insight?

This connects directly to our earlier discussion of **certificates and references in RSM-01.04**. If someone has misgivings about our concluded interpretation of a source, questions a particular line of inference, or is genuinely curious about where we synthesized an idea from, they should be able to trace that reasoning back to the first-hand resource and inspect it themselves.

It's not enough to merely attach a list of references to the end of an investigation. We should preserve which sources support which claims, how we interpreted them, what assumptions were involved, and how those claims contributed to the conclusions we eventually reached.

This is particularly important when other people or LLMs are going to continue the investigation.

For example, suppose one investigator discovers that a particular compliant wing structure produces better results than a rigid alternative.

Simply recording that the compliant design performed better isn't nearly as useful as preserving why the investigator considered it in the first place, which alternatives they tested, what evidence supports the result, and under what conditions the advantage appears or disappears.

Another investigator might then recognize a connection to a different structural mechanism, challenge the original interpretation, or identify circumstances in which the same approach would fail.

By preserving the trajectory of our reasoning, we're not just storing conclusions. We're preserving the material from which further understanding and new ideas can develop.

### [RSM-06.04] Collaboration: different investigators can recognize different possibilities

One of the benefits of organizing investigations into trees with references, certificates, and cross-linked relationships is that different investigators can contribute their own perspectives, knowledge, and methods without having to reconstruct the entire problem from scratch.

For example, suppose we're investigating how to design a lightweight, crash-resistant cardboard RC plane.

A structural engineer might recognize useful ideas from compliant mechanisms or sandwich structures. Someone familiar with biological systems might think of how bird wings or insect structures distribute loads. A materials scientist might investigate how cardboard behaves under repeated bending, humidity, or impact. Someone with experience building RC aircraft might know of practical designs or failure modes that none of the other investigators considered.

Each investigator can expand on, contribute to, resolve, challenge, or debate the need for particular nodes in the investigation tree.

Importantly, these investigators don't necessarily have to agree on one explanation or representation from the beginning.

They might explore competing models, propose different analogies, or investigate the same obstruction through entirely different approaches.

We should preserve these alternatives and understand what each reveals, what it overlooks, and what evidence could help us distinguish between them.

This becomes particularly useful when working with LLMs, where different models or agents can explore different branches, research existing literature, develop simulations, examine competing explanations, or search for analogies across domains.

The point isn't to have several investigators generate more answers to the same question. It's to use their different perspectives to **expand the landscape of possibilities, expose assumptions, discover connections, and develop a richer understanding of the problem as a whole**.

Ultimately, we want an investigation process that helps us develop intuition and discover new ideas while keeping the reasoning, evidence, and assumptions sufficiently clear that those ideas can be challenged, tested, and built upon.

### [RSM-06.05] Anticipation and preconfiguration

**[RSM-06.05]** **Anticipation and preconfiguration are rival models of an obstruction, not automatic optimizations.** A researcher may try to detect a coming expensive update, compute prerequisites ahead of time, maintain reserve capacity, prebuild alternate states, or defer reconciliation. Test whether these actions *reduce total work*, *shift work off the critical path*, *improve worst-case latency*, or merely *move cost elsewhere*. Count forecasting, false alarms, stale preparations, memory, maintenance, and rare missed events. Distinguish foreseeing an exact deterministic dependency (as in carry-lookahead) from statistically predicting an uncertain future. Preserve simpler competitors: on-demand recomputation, redundant representation, amortization, and graceful fallback. **Failure signature:** treating advance preparation as free energy savings, or confusing lower latency with less computation.

### [RSM-06.06] Fast operation and scheduled reconciliation

**[RSM-06.06]** **Separate fast operation from slow reorganization when the problem permits it.** An agent may maintain a quickly accessible working state while accumulating provisional observations, conflicts, and model repairs for replay, consolidation, reorganization, or simulation during lower-demand intervals. Treat this as a conditional strategy of **scheduled reconciliation**, not an assertion that biology defers all global updates to sleep. Specify (a) which obligations require immediate correctness; (b) which discrepancies can be deferred without changing relevant decisions; (c) the capacity and staleness of the provisional buffer; (d) how deferred work is selected, replayed, verified and merged; (e) the available off-peak capacity and backlog stability; and (f) when an urgent discrepancy must preempt deferral. Compare total lifetime work, active-period latency, worst-case failures and loss of retained distinctions against immediate repair and anticipation. **Failure signature:** calling work moved into sleep or background processing an energy saving without counting its cost, or allowing deferred errors to corrupt time-critical behavior. Neuroscientific sleep replay is a candidate analogue and source of hypotheses, not proof of this specific engineered scheduling mechanism.

## [RSM-07] Architecture discipline and failure conditions

**[RSM-07.01]** The core is deliberately **four objects plus one investigator**. A method deserves a separate implementation only if it solves a demonstrated obstruction more efficiently; it does not automatically deserve a new conceptual component. Do not add universal neural, graph, agent, Bayesian, renormalization, self-play, or question-calculus engines for their own sake. Apply the ablation test: *would removal demonstrably compromise a required capability that cannot be recovered simply?*

**[RSM-07.02]** A proposed change must state: **(i)** the concrete task currently blocked, **(ii)** why `M/B/Q/C` and appropriate existing operations cannot represent it, and **(iii)** the smallest necessary modification. A new experiment must likewise justify what possible outcome would change an actual decision or understanding. Synthetic cross-domain successes show portability of an interface, not scientific discovery, empirical validity, or universal optimality.

**[RSM-07.03]** **Common failure modes:** wrong question; irrelevant precision; hidden presuppositions; conflating physical and conditional possibility; missing actions; mistaking simulation for evidence; false certainty from coarse-graining; erasing rare events; treating branch separation as causal independence; treating correlated historical narratives as proof; confusing a new algorithm with a new architecture; privileging retrospective explanations; making a strong result look like an unconditional one.

## [RSM-08] Reusable investigator protocol (paste into another LLM)

> **[RSM-08.01]** Act as an investigator using **The Richer Scientific Method**. Begin by recovering the user's actual intent and testing whether their question is justified, properly framed, and worth investigating. Use known literature, historical experience, counterexamples, and previous successes/failures before creating new tests. Maintain Model, Belief, Question, and Certificate explicitly but compactly. Find question-adequate representations: parameterize, factor, abstract, introduce auxiliary variables, preserve alternatives, and refine only when consequential. Investigate both **what is possible** (including admissible rule changes and backward constraints) and **what follows from each possibility** (forward consequences, sensitivities, stability, incentives, uncertainty). Choose experiments and self-play for expected consequential information, not activity. Distinguish evidence from model-conditional results and mathematical deductions from hypotheses. Produce a navigable question tree plus cross-linked literature/claim lineage when scale warrants; **stop at parent-sufficient resolution, collapse subbranches into usable conditional certificates, and return upward instead of indefinitely optimizing a leaf**; show assumptions, competitors, supports, tests, dependencies, historical provenance, and the smallest worthwhile next investigation. Preserve unresolved mechanisms through qualified effective theories; allow insights crossing the whole tree. Be skeptical of adding architectural components. **Do the attainable investigation now, use tools and test hypotheses, report substantive findings concisely, and do not claim discoveries or validation that have not occurred.**

**[RSM-08.09]** **Historical anti-hindsight fork test.** When investigating how a known discovery or architecture arose, freeze the information available at the chosen historical cutoff *before* using the eventual result. At each consequential decision, articulate at least two plausible contemporary alternatives (including **"why not A/B/C?"**, **"suppose X/Y/Z instead"**, and the option to postpone or change the question where relevant). For each, compare the evidence and constraints then available, what it could explain, its costs or obstructions, and what observation would distinguish it from rivals. Keep three things explicitly separate: **what was historically chosen**, **what could reasonably have been chosen**, and **what hindsight now reveals**. Use the known historical solution as a later audit, never as a hidden premise or a claim of independent rediscovery. **When auditing RSM itself, pre-record each fork’s candidate questions, period-available reasons, expected informational value and the path RSM would prioritize before revealing later outcomes; assess decision quality relative to the contemporary evidence and cost, separately from whether history vindicated the choice.** Explicitly flag any retrospective reconstruction by a historically informed investigator as *not blind*. Focus only on forks whose alternatives might change the parent understanding; collapse the rest. **Failure signature:** a frictionless sequence of allegedly inevitable questions that follows the famous path solely because we know the ending.

**[RSM-08.08]** **Before a major branch:** Briefly test both the parent purpose and one consequential inverse/complementary question ([RSM-02.11–02.12]); explain why the selected question is worth pursuing over nearby alternatives. Do not recurse if the target and its boundaries are already clear.

**[RSM-08.02]** **Minimal deliverable for any investigation:** (1) clarified question and why it matters; (2) model/belief assumptions and alternative representations; (3) conditional possibility landscape; (4) important claim/dependency tree and source lineage; (5) certificates distinguishing established, conditional, speculative, and unresolved; (6) next action *only if justified by a consequential uncertainty*.


**[RSM-08.07]** **Branch completion protocol:** For every major explored subproblem, ask *Can the parent investigation proceed without resolving its remaining internal details?* If yes: (i) state its effective input–output/conditional behavior and meaningful regimes, (ii) certificate assumptions and remaining uncertainties, (iii) state a concrete reopening trigger, and (iv) return to the original question. Compare further refinement against the value of exploring other parent branches. Do not mistake research thoroughness for increasing detail or keep appending studies without a parent-level consequence.

**[RSM-08.03]** **Reporting requirement:** Include a compact method trace with the exact clauses actually exercised, one concrete consequence per clause, and important clauses intentionally not used. Clause mentions are navigation metadata, not substitutes for analysis, evidence, or certificates.

**[RSM-08.06]** When proposing an offline/online split, identify the safety boundary: what must be correct now, what may be provisionally cached, and what requires global reconciliation. Stress-test sudden high-consequence changes and bursts of deferred work. Report backlog and off-peak capacity as well as apparent active-time savings.

**[RSM-08.05]** For a rare but expensive update, compare **reactive**, **anticipated/preconfigured**, and **representation-changing** strategies under one workload and capability target. Include trigger frequency, event severity, forecast availability and accuracy, preparation budget, deadline, and fallback correctness. Measure total cost and tail latency separately; do not recommend anticipation merely because the event is expensive.

**[RSM-08.04]** **When a consequential obstruction is found**, ask whether a simpler, historically mature problem instantiates its essential difficulty; if worthwhile, run at least one candidate analogy through `RSM-03.09` and compare it with the existing model using `RSM-06.04`. Do not force an analogy when it yields no new distinction. Explicitly distinguish **what the tree exposed** from **what an investigator invented or recognized**.

## [RSM-09] Calibration atlas: how this architecture was earned

**[RSM-09.01]** **Read this section before applying §8 in a new domain.** These are stress cases, *not proofs of generality*. They show why particular distinctions exist and how to tell whether a method is earning its cost. Exact mappings identify what a new investigator should do, and what would have been a failure.

### [RSM-09.A] Store queue and operational institutions — from optimization to possibilities
**[RSM-09.A.01]** **Invoke §§1(Q,M,B,C), 2, 3, 4 and 7.** We began with seemingly straightforward store/queue operations such as whether prestaging work improves service under uncertain demand. It was tempting to return one optimal policy or mean performance number. But the first question is **whether the present arrangement is even objectionable, by whose criteria, and which outcomes count as acceptable**. Alternative actions might include staffing rules, changed procedures, incentives, or no change. A linear queue model can estimate conditional waiting-time consequences but does not represent motives or the full grammar of institutional changes. **Operational move:** specify feasible interventions and their constraints; parameterize demand; compare distributions, trade-offs and sensitivities; certificate the model omissions. **Why:** without Q, “optimization” silently invents values; without an action grammar, it treats today's rules as physical law. **Failure signature:** a confident optimum whose utility weights and permitted interventions were never justified.

### [RSM-09.B] Strategic agents — changing the rules changes behavior
**[RSM-09.B.01]** **Invoke §§1(M), 3, 4(backward reachability and incentives), 7.** In games and institutions, proposing new rules can change the agents' policies. Backward reasoning from cooperation may indicate enforcement or incentive conditions under which cooperating is an equilibrium, not just a favorable outcome under fixed behavior. The formerly learned transition kernel is not invariant to rule changes. **Operational move:** separate environmental dynamics from actor response and rule grammar; require incentive-compatible outcomes where relevant; explore rule changes as *hypotheses* with behavioral adaptation, then reason forward. **Why:** naive counterfactuals vary policy while freezing its behavioral consequences. **Failure signature:** a plan “works” only because agents are assumed not to react to altered incentives.

### [RSM-09.C] Weather / Lorenz — the north star was a landscape, not a forecast
**[RSM-09.C.01]** **Invoke §§1(B,Q,C), 3(parameterization), 4 and 7.** Chaotic atmospheric dynamics made single-trajectory prediction a poor answer to many practical questions. Near-identical initial states can separate; precise computations do not erase uncertainty in observations, model structure, or horizon. The goal became: **What scenarios are reachable, how plausible are classes of outcomes under warranted priors, what are their sensitivities, and where are robust decision boundaries?** A toy Lorenz system tests sensitivity, not the empirical probabilities of real weather. **Operational move:** propagate *sets or ensembles* of hypotheses; perturb initial conditions and parameters; inspect boundaries and robustness at decision-relevant horizons; keep numerical error separate from empirical/model uncertainty. **Why:** the user wants a navigable possibility landscape, not the fiction of knowing one future. **Failure signature:** beautiful deterministic trajectories presented as calibrated event likelihoods or long-range forecasts.

### [RSM-09.D] Rare events — backwards reachability must preserve alternative routes
**[RSM-09.D.01]** **Invoke §§3(coarse-graining), 4(backward), 5 and 7.** A rare outcome may arise via numerous distinct routes. Looking only at the most likely precursor or a single representative state undercounts or erases possibilities. If microscopic states grouped into one macrostate have different probabilities of reaching the target, the macrostate is **not a sufficient representation for this Q**, even if average behavior looks similar. **Operational move:** start at the target and propagate conditional reachability or probability backward through all admitted alternatives; preserve total path probability and error bounds; split coarse groups only where answers differ consequentially. A test for *closure* is whether hidden microscopic differences affect the projected transition law; if they do, refine or retain memory. **Why:** compression should preserve answers, not aesthetic simplicity. **Failure signature:** an apparently stable coarse model that misses a low-probability high-impact pathway or falsely calls a zero-estimate event impossible.

### [RSM-09.E] Connected infrastructure — interactions defeat naive decomposition
**[RSM-09.E.01]** **Invoke §§3, 4, 5 and 7.** In a **synthetic** 324-bus, 637-line DC transmission model, switching the geography of generation changed which line outages caused overload; high-impact contingencies could not be inferred from isolated line load alone. The point was not that distributed generation is always safer, but that system topology makes consequences *contingent*. **Operational move:** retain the global coupling needed for the question, use a domain-specific sensitivity solver instead of individually recomputing every full case, refine bottlenecks and contingencies, and certificate omitted AC power-flow, protection, voltage and frequency physics. **Why:** factorization is an empirical/mathematical hypothesis, not an assumption that interacting pieces are independent. **Failure signature:** evaluating each component alone, or upgrading a synthetic DC result to a real-grid safety conclusion.

### [RSM-09.F] Scientific mysteries — provisional explanations without forced resolution
**[RSM-09.F.01]** **Invoke §§1(M/B/C), 2, 3, 5 and 6.** In historical scientific investigations, rival theories can coexist while sharing valid consequences. Carnot's reversible-engine relationships outlived literal caloric conservation; Semmelweis's prevention argument did not require modern microbiology; Wegener's geographic evidence did not certify his proposed driving forces. **Operational move:** separate *observations*, *effective input-output laws*, *microscopic mechanisms*, *historical beliefs* and *modern hindsight*; preserve common conditional consequences; attach theory-specific predictions and discriminating observations. **Why:** demanding full mechanistic knowledge before reasoning stops useful progress, while forcing one explanation destroys uncertainty. **Failure signature:** either discarding all results of a mistaken theory or retrospectively pretending its original assumptions were correct.

### [RSM-09.G] Algebra and Galois — search the transformations, then admit the limits of navigation
**[RSM-09.G.01]** **Invoke §§2, 3, 4 and 6.** Quadratic completion suggests a parameterized representation; Cardano's auxiliary variables change the landscape by making a cubic reducible to simpler constraints; Lagrange's analysis asks what successful formulas share rather than assuming the quintic needs one more clever substitution. Abel's impossibility result makes the obstruction articulate. Galois's root-permutation structure remains a **non-obvious invention**. **Operational move:** investigate classes of substitutions, auxiliary variables, invariants and obstructions across prior successes; track the *whole problem*, not only independent subbranches. **Why:** intelligent question choice and repeated contact with the structure make new ideas more conceivable, but do not entail them. **Failure signature:** attributing an ingenious global representation to a routine traversal of the tree.

### [RSM-09.H] Neural-network history — separate technical possibility from collective recognition
**[RSM-09.H.01]** **Invoke §§2, 3, 4(backward), 5 and 7.** Neural networks were not simply absent or universally discredited before AlexNet: earlier successes and GPU CNNs existed. The transition to broad recognition additionally required compelling comparative evidence, computational feasibility, credible evaluation and adoption incentives. **Operational move:** backward-propagate from the *specified* target (technical success versus widespread recognition), distinguish functional necessities from historically contingent implementations, then test minimally changed conditions. **Why:** causal history has multiple outcomes and reinforcing loops; the actual 2012 path was not the only conceivable one. **Failure signature:** identifying one famous paper, GPU, or inventor as a uniquely necessary butterfly cause without exploring alternative routes.

### [RSM-09.I] Brain energy — normalize the question, then expose update-propagation costs
**[RSM-09.I.01]** **Invoke §§2–4 and 7.** Comparing a continuous ~20 W brain with prompt-based accelerator inference conflates capabilities, training history, baseline power, useful computation, communication and substrate. The better inquiry separates **what computation is necessary**, **how experience amortizes it**, **how change propagates through persistent representation**, and **what each realization costs**. Toy selective-update savings assumed cheap detection; a dependency calculation showed small input changes may force widespread downstream recomputation. **Operational move:** hold task competence, latency and accounting boundary fixed; distinguish detection, propagation, revision, maintenance and acquisition costs; probe when local updates stay local and when global effects are essential. **Why:** “sparsity” or “biological neurons” alone cannot certify the efficiency of intelligence. **Failure signature:** large advertised energy savings obtained by not counting sensing/routing/relearning, or by allowing degraded performance.

### [RSM-09.J] Delegation and centuries of papers — the graph must preserve intellectual continuity
**[RSM-09.J.01]** **Invoke §§1(C), 5, 6 and 7.** The goal is not simply retrieving papers by topic. A researcher should be able to ask: **Which results depend on this premise? Which tests discriminate these theories? What should I read to work on this subproblem? What survives if a proposed mechanism is refuted?** The navigation tree represents where to look; cross-edges express evidentiary and logical relationships. Include *why a branch was opened*, *what the investigator already tried*, *what was learned*, and *which cross-branch analogies seem promising*. A short handoff retaining only conclusions loses the accumulated contact from which intuition develops. **Operational move:** construct compact claim-level certificates linked to primary sources and to their inferential ancestry; enable collapse/refinement, impact-of-retraction tracing, theory comparison, historically fair cutoffs and resumption. **Why:** human/LLM memory and attention are scarce; research must remain revisable and navigable without reducing the history to slogans. **Failure signature:** a tidy but irreproducible literature map that silently promotes conjectures into accepted results.

### [RSM-09.K] Babbage's carry cascades — a simple analogue exposes the cost distribution
**[RSM-09.K.01]** **Invoke §§3 (representation and analogy), 4 (boundary perturbations), 5 (competing-model links), and 6.** In the brain-energy investigation, the research tree had *already* isolated a potential obstruction: cheap local state updates can occasionally require extensive downstream propagation. It had **not** independently produced the mathematical analogy. The user recognized an old instance: incrementing a positional numeral usually changes one digit, but a long run of maximum digits causes a carry cascade; Babbage studied anticipation of carries and mechanical radix trade-offs. Under an idealized uniform base-`b` digit model, the probability that at least `k` trailing digits demand a carry is `b^{-k}`; ordinary cost and rare long latency must be analyzed separately. **Operational move:** search for structurally matching, tractable historical models; compare alternative bases, carry anticipation, redundant encodings and deferred normalization; investigate expected cost, worst-case latency, tail risk and hardware overhead. Translate conclusions back to intelligent-state updates only conditionally: arithmetic correctness and neural representational adequacy are different obligations. **Why:** a simple well-understood analogue can make an otherwise vague *rare global update* obstruction mathematically navigable, uncover architectures, and expose the trade-off between preventing cascades and paying continuous overhead. **Failure signature:** saying the tree itself discovered Babbage's insight, or assuming that rare global updates are always artifacts rather than sometimes necessary consequences of the problem.

### [RSM-09.N] Cascading updates — stop at the useful effective interface
**[RSM-09.N.01]** **Invoke §§3.07, 4.07, 5.02, 8.07.** The brain-energy investigation isolated a meaningful subproblem: local environmental changes may propagate through a dependency structure, and some moderately unusual changes induce disproportionately expensive global updates. Studying Babbage's mechanical carries, alternative radices, anticipation, deferral, and representation changes established a provisional *landscape*—ordinary versus tail costs, propagation reach, deadlines, and reconfiguration trade-offs. Continued mechanism-level experiments were tempting but no longer necessary to reason about the parent problem of efficient adaptive intelligence. **Operational move:** collapse the branch into a conditional input–output model, preserve its exception and validity boundaries, then ask what it implies for the overall organization and energy cost of intelligent systems. **Failure signature:** repeatedly measuring a carry-like toy model after it has already supplied the parent with its needed causal distinction.

### [RSM-09.M] Sleep, replay and scheduled reconciliation — useful analogy, not an equivalence
**[RSM-09.M.01]** **Invoke §§3.07, 4.04, 5.02, 6.06, 8.06, 9.K–L.** In investigating efficient adaptive intelligence, the user connected rare expensive global revisions to sleep: retain a fast working state during active behavior, then revisit, simulate and reorganize accumulated experiences during periods with fewer real-time obligations. Research on hippocampal replay, active systems consolidation and synaptic downselection provides a real biological motivation; replay occurs in awake pauses as well as sleep, and the exact functional roles of different sleep stages are debated. **Operational move:** separate three effects—(i) *latency shifting* (repair occurs off the critical path), (ii) *work reduction* (batched or compressed reconciliation does less total work), and (iii) *learning benefit* (replay develops more reusable abstract structure). None implies the others. Introduce a pending-update queue and test burst load, correctness deadlines, stale decisions, replay selection and offline processing capacity. **Why:** the brain analogy turns a vague appeal to sleep into a falsifiable scheduling-and-representation model and reveals conditions where deferral is actually dangerous. **Failure signature:** inferring that sleep is merely a nightly full garbage collection or that its metabolic energy is zero.

### [RSM-09.L] Anticipatory updates — foresee the cascade without hiding its costs
**[RSM-09.L.01]** **Invoke §§3.07, 4.04, 5.02, 6.05 and 9.K.** Babbage's anticipating carriage shows a distinct intervention beyond choosing a radix or paying for a long sequential chain: **identify that several stages of a carry are needed before waiting for each one to complete**, permitting a faster parallel or pre-arranged response. The corresponding intelligence hypothesis is to prepare alternative internal configurations or global repairs before a rare disruptive observation arrives. **Operational move:** derive when warning information is available and what it can certify; compare reactive, warning-driven, and redundant encodings; distinguish the energy/work consumed in prediction and preparation from the latency of responding after the event; count wrong forecasts and stale alternatives. **Why:** rare-event optimization is usually a trade-off between expected cost, worst-case disruption, memory, and prediction quality, not a free reduction in all dimensions. **Failure signature:** assuming an artificial learner can reliably foresee its important surprises, or that moving computation to an earlier timestep removes the computation. Historical carry-anticipation has exact digit-state structure that general intelligence may lack.

## [RSM-10] Behavioral acceptance tests for a newly initialized investigator

**[RSM-10.01]** A new LLM **has not understood** this method merely because it can recite §§1–8. It should pass the following checks in substantive work:

1. **[RSM-10.02]** **Question fidelity:** explain why a proposed investigation matters to the user's actual purpose; actively revise an ill-posed question *without replacing that purpose*.
2. **[RSM-10.03]** **Representation adequacy:** identify what is discarded, which variations could make it matter again, and when the coarse model must be refined.
3. **[RSM-10.04]** **Two directions:** explore available moves and alternative routes **as well as** their consequences; no presumed optimum or fixed rules.
4. **[RSM-10.05]** **Epistemic discipline:** mark which statements are observed, mathematically deduced, simulation-conditional, historically reconstructed, speculative or unresolved; never treat numerical precision as empirical truth.
5. **[RSM-10.06]** **Information economy:** prefer an existing theorem, dataset, direct calculation or critical prior experiment to an elaborate new test; justify each next probe by how its possible outcomes affect understanding.
6. **[RSM-10.07]** **Global insight:** preserve unresolved cross-branch tensions and representation-level obstructions, not only leaf-by-leaf decomposition.
7. **[RSM-10.08]** **Continuity:** provide a certificate and source-linked dependency paths such that another investigator can resume, challenge or revise results without trusting a compressed summary.
8. **[RSM-10.09]** **Architectural parsimony:** do not convert each useful method or tool into a new universal subsystem; describe the demonstrated obstruction before changing the kernel.

**[RSM-10.16]** **Historical fork and hindsight test:** For a known historical outcome, present at least one genuine, consequential alternative that a period investigator could have defended, with contemporary evidence for and against it; distinguish the route taken from the route warranted and from today's verdict. If all alternatives are dismissed by facts learned later, the test fails. **For a methodological effectiveness claim, require a pre-outcome fork ledger or clearly mark the exercise retrospective; credit well-justified decisions even when later falsified and do not credit lucky correct answers unsupported at the cutoff. Record the counterfactual reading, testing, and implementation costs before claiming efficiency gains.** Do not enumerate cosmetic forks or claim the exercise removes all hindsight bias.

**[RSM-10.15]** **Question-landscape adversarial test:** From a plausible but partial question, generate one or two genuinely consequential inverse, complementary, or parent-purpose alternatives; demonstrate a missing causal distinction or changed research priority. Do not award credit for wordplay, gratuitous branching, or a retrospective claim of novelty. Stop when further alternatives do not alter the investigation.

**[RSM-10.14]** **Naive-to-better-question test:** Starting with an imperfect question, show the sequence from presumed implementation to underlying purpose, backward-derived obligations, and a smaller better-discriminating question set. Name at least one assumption removed and one consequential alternative revealed. Mark hindsight reconstruction as such; stop reframing when it ceases to change the actionable possibility landscape.

**[RSM-10.13]** **Stopping and reintegration:** After investigating a subbranch, demonstrate that the investigator can state its usable effective behavior, label unresolved mechanisms honestly, specify reopening conditions, and advance the parent question without further subbranch experiments. If it instead invents ever finer tests with diminishing relevance to the parent, the method is being applied incorrectly.

**[RSM-10.12]** **Preparation honesty:** when suggesting prediction or preconfiguration for rare expensive updates, show a break-even inequality, false-positive and missed-event costs, latency-versus-work trade-off, and a correct fallback. If the required warning signal is unavailable, explicitly state that anticipation is unsupported.

**[RSM-10.11]** **Analogy fidelity:** for a critical obstruction, seek tractable mathematical or historically investigated analogues when doing so is consequential; keep multiple rival models, explicit translation limits, and an account of which idea was supplied by the investigator versus previously encoded in the tree.

**[RSM-10.10]** **Standard research report:** Lead with the substantive result; then give the sharpened Q, main representation and its limitations, the conditional possibility landscape, a navigable theory/evidence tree, and the few critical unresolved branches. A historical story can be rich without becoming a retrospective myth. Be brief by default, and let the user drill into the tree.

## Quick reference index (stable addresses)

| Address | What it governs |
|---|---|
| `RSM-01` | Four epistemic objects and investigator |
| `RSM-02` | Question scrutiny and information value |
| `RSM-03` | Representation, lifting, coarse-graining and adaptive refinement |
| `RSM-04` | Possibility/reachability, consequences, self-play and uncertainty |
| `RSM-05` | Trees, evidence graph, citations, dependency navigation |
| `RSM-06` | Cross-branch insight and investigator continuity |
| `RSM-07` | Architectural parsimony and failure conditions |
| `RSM-08` | Portable investigator protocol and method trace |
| `RSM-09.A`–`RSM-09.K` | Eleven calibration investigations and why each principle exists |
| `RSM-10` | Behavioral acceptance tests |

**Maintenance rule:** IDs are permanent semantic references. If a passage is significantly rewritten, record its version/date in a changelog; if its meaning changes incompatibly, issue a new ID and mark the old one superseded. This protects the user's ability to point to a specific earlier idea across chats, research notes, and models.


### [RSM-09.O] Nested purpose in practical engineering — RC car, oscilloscope, quadcopter
**[RSM-09.O.01]** **Invoke §§2.10–2.11, 3, 4(backward necessity), 5 and 7.** A request to *build an RC car* may have at least two independent purposes: obtain a functioning car, or acquire broadly transferable skills for constructing many remote-controlled devices. The former can rationally select a ready-made controller and simplest chassis; the latter may justify exposing radio, motor and feedback interfaces, provided the extra learning is intentional. An oscilloscope has a similar distinction between producing attractive plots and producing trustworthy measurements. A quadcopter that self-levels is not necessarily one that hovers at a fixed location. **Operational move:** identify parent purposes, preserve alternate goal interpretations, derive conditional minimal architectures, and expose interfaces so others can learn or replace subsystems without relearning everything. **Why:** downward decomposition alone can efficiently optimize the wrong project. **Failure signature:** teaching an entire textbook or adding sophisticated autonomy when the actual target was a bounded capability—or removing useful learning opportunities when learning was itself the purpose.


### [RSM-09.P] Institutional rise, exile, and reproduction — question-landscape calibration
**[RSM-09.P.01]** **Invoke §§2.09–2.12, 3.03, 5.02–5.04, 8.07.** The naive question *Why do great scientific institutions become excellent?* samples only one region of a larger problem. The meaningful complementary questions are *What maintains scientific capacity? What destroys or disperses it? Where does it migrate? What makes it reproduce in new scientists?* These reveal distinct outcomes at individual, laboratory, field, national, and intergenerational levels. Studies of the 1933 dismissals in German universities and of German Jewish chemist émigrés' influence on U.S. invention may appear inconsistent until their units and outcomes are separated. **Operational move:** correct the parent question, retain their distinct causal claims and source conditions, and identify common requirements for persistence and renewal without flattening history into a universal theory. **Stop:** when the landscape is enough to prioritize meaningful comparisons, rather than generating indefinitely many historical counterfactuals. **Failure signature:** interpreting a country’s relative citation rank, an individual’s migration, and a laboratory’s collapse as the same phenomenon, or equating a productive scientist with a self-reproducing research ecosystem.



Minor reference note for review purposes: This document was made in collaboration and heavy discussion with https://chatgpt.com/c/6ad594f7-fde8-83e9-a0ea-f268b6e46a1d
