# The Richer Scientific Method
### Asking better questions, investigating possibilities, and building upon what we've learned
This is an exposition of the manner in which this document should be read and how it should be acted upon https://github.com/JadanPoll/FKEN_REA_CaseStudies/blob/main/OPERATIONAL.md

## How to use and reference RSM

Each substantive idea in this document has a stable **RSM identifier**. For example, `RSM-04` refers to a section, `RSM-04.03` to a particular clause, and `RSM-09.C.01` to a calibration example. These identifiers let us return to an idea, challenge it, or build upon it even after the wording changes. **Don't renumber existing identifiers**; add new ones when new ideas are needed, and mark genuinely superseded meanings explicitly.

When a particular RSM idea materially guides an investigation, **reference the specific clause and explain why it matters**. For example: `Why this representation: [RSM-03.02]` or `Backward reasoning applied: [RSM-04.02]`. We shouldn't throw clause numbers at the reader merely to make an explanation sound more rigorous. The references to scientific papers, experiments, and other first-hand evidence should be kept separately so somebody can check the actual sources.

We should also be able to ask things like "expand RSM-03.03," "what would challenge RSM-04.03?" or "which conclusions depend on RSM-05.02?" and trace the relevant reasoning rather than receiving an isolated quotation.

A compact way to preserve this is a **method trace**: `decision or inference → relevant RSM clause → why it was useful → evidence or certificate → assumptions and limitations`. Within an investigation tree, preserve why a branch was opened, what answering it could change, and which ideas helped or didn't help.

Most importantly, **use RSM as a way of investigating, not a ritual**. We don't need to perform every operation in every problem. The methods should earn their place by helping us reason clearly, explore the relevant landscape, and make progress.

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

The best starting points are often the first-principles or childlike ones, such as **"How do you make an RC car?"** or even **"I want to build an OS!"** We don't need to turn that curiosity into a sophisticated technical question before we begin. We might first ask what an OS even is, whether we could make one ourselves, what we'd want it to do, or whether building one is really the best way to learn what we're curious about. Each of these can lead to its own rich landscape of questions.

A good starting node should preserve what made us curious in the first place, without already assuming the answer, the machinery we'll use, or the way the field happens to be organized. It can be a question, an ambition, or a problem expressed in ordinary language. We can make it more precise as we discover what actually matters. Starting broadly doesn't mean staying vague forever; it means giving ourselves room to find the right questions before committing to one route.

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

We can grow a **question tree** in two complementary ways. Starting with what we're actually curious about, we might explore its parent purpose, its constituent questions, or alternative questions we hadn't considered. But we can also explore what we would ask **if the answer were yes, yes but only under certain conditions, no, or no unless something changed**. These aren't answers we're claiming to have established. They're possible directions that help us discover questions we might otherwise overlook.

For example, a "no" might lead us to investigate an obstruction, while a "yes, but" might lead us to investigate the boundary of what's possible. This second way of branching helps us understand not just which questions belong together, but how different answers could change the course of our investigation.

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

We can distinguish between a **question tree**, which helps us explore what we might want to ask, and an **investigation tree**, which helps us preserve what we investigate and learn. In the first, we can navigate between parent questions, constituent questions, alternative formulations, and the questions suggested by different possible answers (RSM-02.08). In the second, we also follow our models, assumptions, evidence, experiments, and findings. We shouldn't have to investigate every question just because it appears in the question tree, and one investigation might help answer several questions.

For a question we want to pursue, we might already have a book chapter, a paper, or a page range that we suspect will help. We should preserve those references so we know where to look, while recognizing that **a promising source is not yet a certificate of what we've learned**. As discussed in RSM-01.04, a Certificate (C) preserves what we've actually established and why. The references we initially choose can later become part of that certificate once we've examined and interpreted them.

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

What should we do when things go wrong, or when we don't seem to be making any meaningful progress in an investigation?

Rather than blindly trying more approaches, running more experiments, or introducing increasingly complicated methods, we should investigate why we're not making progress in the first place. Are we asking the wrong sort of question? Have we overlooked some important constraint or assumption? Is our current representation making the problem unnecessarily difficult? Are we investigating the wrong branch of the tree, or have we simply reached a point where the information available isn't sufficient to proceed?

We should also distinguish between **a failure of the methodology itself and a failure to apply the methodology appropriately**. An unsuccessful investigation doesn't necessarily mean we need a new reasoning framework. It might mean we need to revisit an earlier question, examine a different representation, look for existing research, or reconsider what progress would actually look like.

This section gives us a framework for reasoning about these situations, including how to recognize common failure modes, identify the actual obstruction, and decide whether our methods or the methodology itself need to change.

One of the dangers of developing a methodology like RSM is that we can keep introducing new concepts, abstractions, procedures, and architectural components until the methodology itself becomes more complicated than the problems we're trying to investigate.

We should therefore apply the same reasoning principles to RSM that we would apply to any other investigation.

### [RSM-07.01] Don't introduce complexity without a reason

We've organized RSM around four main objects: Model, Belief, Question, and Certificate, with an investigator working with them.

This gives us a general framework for reasoning about problems without requiring every investigation to follow a rigid sequence of steps.

We might use Bayesian inference, neural networks, simulations, mathematical proofs, self-play, knowledge graphs, or multiple collaborating LLMs. But using a technique doesn't necessarily mean it deserves to become another fundamental component of our methodology.

Before introducing some new architectural element, we should ask what it actually accomplishes. What problem does it solve? What capability does it provide? Could we accomplish the same thing with something we already have?

A useful sanity check is to imagine removing the proposed component entirely. What would we actually lose? Would some important capability become impossible or materially more difficult, or would the rest of the system continue working just fine?

The point isn't to avoid sophisticated methods. It's to avoid accumulating unnecessary complexity that makes our investigations harder to understand, maintain, and build upon.

### [RSM-07.02] Changes to the methodology should themselves be justified

When we encounter a limitation in RSM, we shouldn't immediately invent a new concept or mechanism to address it.

We should first understand what exactly is failing.

What were we trying to accomplish? What obstruction did we encounter? Why couldn't our existing representations or methods handle it? Is the problem genuinely a limitation of the methodology, or did we simply fail to apply an existing method appropriately?

From there, we can investigate possible modifications, including whether a smaller change would resolve the problem without introducing unnecessary complexity elsewhere.

This applies to our experiments as well. We shouldn't introduce another simulation, test, or research branch merely because it's something we can do.

We should be able to explain what we expect to learn, which possible outcomes would materially change our understanding, and why the investigation is relevant to the bigger picture.

For example, suppose an LLM repeatedly fails to investigate a problem correctly. Before deciding that RSM needs another reasoning stage, we should investigate whether the failure came from an unclear question, insufficient evidence, a poor representation, an unsuitable tool, or the model's failure to follow the methodology.

These are different obstructions and might require entirely different interventions.

### [RSM-07.03] Common ways investigations go wrong

There are several recurring mistakes we should remain aware of throughout an investigation.

Sometimes we begin with the wrong sort of question and invest substantial effort answering something that doesn't actually address our underlying curiosity or purpose.

Sometimes we make our models increasingly detailed without asking whether that additional resolution changes anything important.

We might unknowingly build assumptions into our representations, overlook alternative mechanisms, confuse what is possible under a model with what is physically possible, or treat simulation results as though they were direct empirical evidence.

We might also simplify a system so aggressively that we average away rare but consequential behavior, overlook dependencies between supposedly separate branches, or mistake a convenient analogy for a genuinely shared mechanism.

Another common failure is confusing improvements to individual methods with improvements to the overall architecture. A more sophisticated algorithm or additional tool might be useful without requiring us to fundamentally restructure how we organize investigations.

We should also be careful about retrospective explanations. Once we know the answer to a problem, it's easy to construct a convincing story about how someone could have discovered it, even when that story doesn't accurately represent the historical investigation or the uncertainties people faced at the time.

The general practice is to continually examine our reasoning, assumptions, representations, and investigative choices against what we're actually trying to understand.

**RSM itself should remain open to investigation, criticism, and revision. The goal isn't to develop an increasingly elaborate methodology, but one that helps us reason more clearly, investigate more effectively, and build upon what we've learned.**

## [RSM-08] Reusable investigator protocol

How do we actually put everything we've discussed into practice?

RSM isn't intended to be a rigid checklist that we mechanically execute every time we encounter a problem. Different investigations require different methods, levels of detail, and degrees of certainty.

Instead, we want a consistent way of approaching investigations that preserves our reasoning, keeps the bigger picture in view, and helps us decide what to do next.

### [RSM-08.01] A practical contract for conducting investigations

When beginning an investigation, first try to understand what we're actually trying to accomplish. What motivated the question? Are we even asking the right sort of question? What is the parent purpose, and what broader landscape of questions might be relevant?

We should consider alternative formulations and, where useful, explicitly write down possible answers and what we would investigate next depending on those answers.

Build an initial investigation tree that captures the relevant questions, models, assumptions, constraints, and constituent problems. This tree is provisional. We should be willing to expand, collapse, reorganize, or question the need for any of its nodes as we learn.

Use existing knowledge before inventing new methods. Look for scientific literature, working implementations, historical examples, useful analogies, and previous successes or failures that could help us understand the problem or ask better questions.

Choose representations appropriate to what we're investigating. We might decompose the system, parameterize its constituent parts, introduce intermediate variables, use effective models, or investigate competing explanations. Start with a useful level of resolution and increase it when additional detail could materially change our understanding.

Explore both **what might make something possible** and **what would happen if we actually pursued it**. Reason backward from desired or undesirable outcomes to their necessary conditions, and forward from candidate approaches to their consequences.

Use experiments, simulations, proofs, calculations, and self-play to investigate the relevant possibilities. Don't simply run tests for the sake of running them. Ask what each possible outcome would teach us, which assumptions it could challenge, and how it might affect the bigger picture.

Throughout the investigation, distinguish our knowns, intuitions, hypotheses, well-reasoned assumptions, napkin-math-like assumptions, unknowns, and unknown unknowns. Be capable or aware of sanity checks that could help us understand within what reasonable scenarios our conclusions hold and when they might no longer hold.

**Reference and certify our findings.** Preserve the evidence, assumptions, alternative explanations, and trajectory of reasoning behind consequential conclusions. If someone has misgivings about our interpretation of a source or questions a particular line of inference, they should be able to trace it back to the first-hand resource and inspect it themselves.

Don't remain trapped in one branch of the investigation tree. Return to the parent purpose when we've learned enough for its needs, when the current approach stops producing useful progress, or when new information suggests that we should reconsider the bigger picture.

When things go wrong, investigate the obstruction itself. Is it a limitation of our model, an incorrect assumption, a missing capability, a genuine physical constraint, or simply a failure to apply an existing method appropriately?

Finally, preserve the investigation in a way that we or another investigator can understand, challenge, continue, and build upon. This includes what we've established, what remains uncertain, which branches are unresolved, and what possible next investigations would actually contribute.

### Using RSM with LLMs and collaborating investigators

The same principles apply when using one or several LLMs to investigate a problem.

An LLM shouldn't simply produce an answer and leave us to reconstruct how it arrived there. It should help us understand the relevant question landscape, investigate consequential alternatives, expose assumptions, and preserve references and certificates for its findings.

Different investigators can work on different branches, investigate competing models, or contribute specialized knowledge. Their findings should be brought back into the larger investigation without erasing disagreements, uncertainties, or the reasoning that produced them.

We should also be able to challenge the investigation itself. Why was this question introduced? Why did we choose this representation? What would happen if a particular assumption were false? Does this branch still deserve investigation, or has something we've learned made it irrelevant?

The investigator should help us make these decisions, not simply continue expanding the tree indefinitely.

The purpose of the protocol is to make investigations **consistent, inspectable, revisable, and useful over time**, while preserving the freedom to explore unconventional questions, representations, and possibilities.

### [RSM-08.10] Interactive and collaborative investigation

One of the most useful things an LLM can do is help the human better understand what they're actually trying to ask, investigate, or accomplish, especially when they themselves aren't entirely sure yet.

Rather than simply accepting an underspecified question and making arbitrary assumptions, the LLM should be capable of presenting the human with a small set of meaningful alternatives, preferably through interactive multiple-choice or multiple-response questions (MRQs), so that they can collaboratively explore the broader question landscape.

For example, suppose someone says, **"I want to build an RC vehicle out of cardboard."**

The LLM might ask whether they're interested in building a car, plane, boat, or something else entirely. But importantly, it should also offer **"Choose for me"** or **"I'm not sure, let's explore"** as options.

A small interactive choice could look like this:

> **Let's figure out what you want to build. Which directions sound interesting?** (Select any.)
>
> - [ ] RC car
> - [ ] RC plane
> - [ ] RC boat
> - [ ] Something else
> - [ ] **Choose for me / explore the landscape**
>
> **What's the bigger picture?**
>
> - I mainly want something that works.
> - I want to learn engineering through building.
> - I'm just curious about what's possible.
> - I'm not sure yet.

Often, the human is genuinely curious but doesn't yet have a particularly well-developed understanding of what they want to investigate beyond their initial question. We shouldn't force them to make decisions they don't yet have the knowledge or intuition to make.

Instead, the LLM can help them explore the landscape, explain what makes different directions interesting, suggest promising starting points, and develop a clearer understanding of their own curiosity as the investigation progresses.

This applies just as much to competing hypotheses, alternative representations, experimental approaches, or the bigger picture itself.

For example, an LLM might discover several plausible explanations for an observed phenomenon. Rather than silently choosing one, it could present the competing hypotheses, briefly explain what each would imply, and ask which the human finds interesting or would like to investigate further. It should also be able to recommend which investigation might be most informative, or simply proceed when the distinction doesn't require human input.

We can even develop a **question tree** together before doing substantial research, as discussed in RSM-02.08. If someone says "I want to build an OS!", we shouldn't immediately replace that with a textbook outline of scheduling, memory, and filesystems. Why do they want to build one? What even counts as an OS? Could they really make one themselves? Those questions might eventually lead us to scheduling and memory, but now we'll understand why we're investigating them. For a question we care about, we can also ask what would follow if the answer were yes, yes but, no, or no unless. Exploring these possibilities helps us decide what deserves investigation without assuming we already know the answer.

Importantly, **interaction shouldn't become an excuse to constantly interrupt the investigation with unnecessary questions**. The LLM should distinguish between choices where the human's purpose, curiosity, or preferences actually matter and questions it could reasonably answer through its own investigation.

Sometimes the best thing to do is ask. Sometimes it's to present a few possibilities and recommend one. Other times, it's to simply investigate and return with something interesting that expands the human's understanding.

The goal is to make the investigation a genuinely collaborative process in which the human can explore, challenge, redirect, and contribute to the investigation tree without having to specify everything in advance.

**Language matters here too.** LLMs should communicate in the same kind of clear, curious, and human-sensible language we've been using throughout RSM. They shouldn't overwhelm people with jargon, unnecessarily formal terminology, or elaborate explanations that obscure what we're actually trying to understand.

Technical terminology is useful when it helps us reason more precisely, but it should be introduced in a way that builds intuition rather than assuming the human already knows the entire field.

Ultimately, the LLM should help the human become a better investigator themselves, not merely a passive recipient of answers. It should help them discover questions they hadn't considered, understand the consequences of different possibilities, and develop a richer intuition for the problem and its broader landscape.

### Additional reusable protocols

The following specialized protocols are retained under their original identifiers so existing citations continue to point to the same commitments.

**[RSM-08.02]** **Minimal deliverable for any investigation:** (1) clarified question and why it matters; (2) model/belief assumptions and alternative representations; (3) conditional possibility landscape; (4) important claim/dependency tree and source lineage; (5) certificates distinguishing established, conditional, speculative, and unresolved; (6) next action *only if justified by a consequential uncertainty*.

**[RSM-08.03]** **Reporting requirement:** Include a compact method trace with the exact clauses actually exercised, one concrete consequence per clause, and important clauses intentionally not used. Clause mentions are navigation metadata, not substitutes for analysis, evidence, or certificates.

**[RSM-08.04]** **When a consequential obstruction is found**, ask whether a simpler, historically mature problem instantiates its essential difficulty; if worthwhile, run at least one candidate analogy through `RSM-03.09` and compare it with the existing model using `RSM-06.04`. Do not force an analogy when it yields no new distinction. Explicitly distinguish **what the tree exposed** from **what an investigator invented or recognized**.

**[RSM-08.05]** For a rare but expensive update, compare **reactive**, **anticipated/preconfigured**, and **representation-changing** strategies under one workload and capability target. Include trigger frequency, event severity, forecast availability and accuracy, preparation budget, deadline, and fallback correctness. Measure total cost and tail latency separately; do not recommend anticipation merely because the event is expensive.

**[RSM-08.06]** When proposing an offline/online split, identify the safety boundary: what must be correct now, what may be provisionally cached, and what requires global reconciliation. Stress-test sudden high-consequence changes and bursts of deferred work. Report backlog and off-peak capacity as well as apparent active-time savings.


**[RSM-08.07]** **Branch completion protocol:** For every major explored subproblem, ask *Can the parent investigation proceed without resolving its remaining internal details?* If yes: (i) state its effective input–output/conditional behavior and meaningful regimes, (ii) certificate assumptions and remaining uncertainties, (iii) state a concrete reopening trigger, and (iv) return to the original question. Compare further refinement against the value of exploring other parent branches. Do not mistake research thoroughness for increasing detail or keep appending studies without a parent-level consequence.

**[RSM-08.08]** **Before a major branch:** Briefly test both the parent purpose and one consequential inverse/complementary question ([RSM-02.11–02.12]); explain why the selected question is worth pursuing over nearby alternatives. Do not recurse if the target and its boundaries are already clear.

**[RSM-08.09]** **Historical anti-hindsight fork test.** When investigating how a known discovery or architecture arose, freeze the information available at the chosen historical cutoff *before* using the eventual result. At each consequential decision, articulate at least two plausible contemporary alternatives (including **"why not A/B/C?"**, **"suppose X/Y/Z instead"**, and the option to postpone or change the question where relevant). For each, compare the evidence and constraints then available, what it could explain, its costs or obstructions, and what observation would distinguish it from rivals. Keep three things explicitly separate: **what was historically chosen**, **what could reasonably have been chosen**, and **what hindsight now reveals**. Use the known historical solution as a later audit, never as a hidden premise or a claim of independent rediscovery. **When auditing RSM itself, pre-record each fork’s candidate questions, period-available reasons, expected informational value and the path RSM would prioritize before revealing later outcomes; assess decision quality relative to the contemporary evidence and cost, separately from whether history vindicated the choice.** Explicitly flag any retrospective reconstruction by a historically informed investigator as *not blind*. Focus only on forks whose alternatives might change the parent understanding; collapse the rest. **Failure signature:** a frictionless sequence of allegedly inevitable questions that follows the famous path solely because we know the ending.

## [RSM-09] Calibration atlas: how this architecture was earned

The Richer Scientific Method wasn't developed simply by imagining what an ideal scientific methodology ought to look like. Much of it comes from investigating actual problems, encountering limitations in our reasoning, discovering better ways to represent or navigate those problems, and trying to understand what made those approaches useful.

In this section, we'll look at some of the investigations that motivated particular ideas in RSM.

The point isn't to demonstrate that RSM is universally correct or that every method will work equally well in every domain. Instead, we want to understand the circumstances under which these methods became useful, what obstructions they helped us address, and where their limitations might lie.

In fact, we should apply RSM to RSM itself. For any particular methodological idea, we can ask what problem motivated it, what alternatives we considered, what evidence supports its usefulness, and whether we might have arrived at a better approach.

These examples also give us something concrete to refer back to when applying RSM to new problems. Rather than simply following a methodological instruction because the document says so, we can inspect the investigation that motivated it and judge whether similar circumstances apply to our current problem.

### [RSM-09.A] Store queues and operational institutions — are we even optimizing the right thing?

**[RSM-09.A.01]** Suppose we're investigating how to improve operations at a store. Perhaps customers are spending too long waiting in line, staff are frequently overwhelmed, or certain tasks aren't being completed efficiently.

It's tempting to immediately formulate an optimization problem. We could build a queueing model, estimate customer arrival rates, simulate different staffing arrangements, and search for the configuration that minimizes average waiting time.

But before doing any of that, we should ask: **What are we actually trying to accomplish?**

Is the current waiting time even a problem? For whom? Are customers dissatisfied, are workers experiencing unnecessary stress, or is the business losing revenue? Perhaps the existing arrangement is already sufficiently good, and optimizing it further wouldn't materially improve anything we care about.

Even if we identify a genuine problem, we shouldn't assume that adjusting the number of workers or changing the queueing algorithm exhausts the landscape of possible approaches.

We might change the procedures themselves, redistribute work, prepare certain tasks in advance, modify incentives, or reconsider how the service is organized.

These possibilities belong to different parts of the investigation tree, and some might not even be represented in our initial mathematical model.

This illustrates why we should distinguish between **optimizing within a particular representation and investigating whether that representation captures the actual problem**.

A queueing model might be very useful for understanding waiting times under particular assumptions. But it doesn't automatically tell us which outcomes we ought to value, what changes are institutionally feasible, or whether the available interventions have been represented adequately.

We should therefore examine our parent purpose, identify the relevant constraints and possible actions, and explore what different outcomes would actually change before committing to a particular optimization.

### [RSM-09.B] Strategic agents — changing the rules can change the behavior

**[RSM-09.B.01]** Now consider problems involving people, institutions, markets, or other agents that make decisions in response to their environment.

One difficulty with these systems is that changing the rules doesn't necessarily leave everyone else's behavior unchanged.

For example, suppose we want to introduce a new incentive system to encourage cooperation between several groups.

We might initially model their existing behavior and conclude that a particular policy would produce a desirable outcome.

But what happens when the groups themselves recognize the new incentives? Could they change their strategies? Might some find ways to exploit the rules? Could an intervention that initially appears beneficial produce entirely different behavior once everyone adapts?

This means we can't necessarily take a model of how people behave under one set of rules and assume it will remain valid after changing those rules.

We should investigate both the proposed intervention and how the system's constituent agents might respond to it.

Backward reasoning can be particularly useful here. If we want cooperation to emerge, what conditions would make cooperation a reasonable or stable choice for the agents involved? What incentives, constraints, or institutions might produce those conditions?

We can then reason forward to investigate what happens when those changes are actually introduced, including whether the agents have reasons to behave differently from what we initially expected.

The important distinction is between **changing a system while holding its behavior fixed in our model and changing a system whose behavior itself depends on the changes we make**.

This is another example of why we need to understand the dynamics and relationships amongst a system's constituent parts, rather than treating our initial representation as an unquestionable description of reality.

### [RSM-09.C] Weather and the Lorenz system — sometimes we care about the landscape, not one prediction

**[RSM-09.C.01]** Suppose we're trying to predict the weather.

We might initially imagine that the goal is to calculate the future state of the atmosphere as accurately as possible.

But atmospheric dynamics are complicated, and small differences in initial conditions can lead to substantially different trajectories over time. Even highly precise numerical calculations don't necessarily eliminate uncertainty about the actual system.

This raises a more interesting question: **Do we actually care about one predicted future, or do we care about the landscape of futures that could reasonably occur?**

For example, suppose we're planning an outdoor event. We might care less about one exact prediction of the temperature and wind speed than about the plausible range of conditions, the probability of heavy rain, the consequences of different scenarios, and which decisions would remain sensible under uncertainty.

We can investigate this by varying initial conditions, model parameters, or competing assumptions and studying how the system's behavior changes.

The Lorenz system offers a useful mathematical example of how nearby initial states can evolve into very different trajectories. By experimenting with it, we can develop intuition for sensitivity to initial conditions and the limitations of long-term deterministic prediction.

But we should be careful about what we've actually established. A mathematical simulation of the Lorenz system doesn't automatically certify the probability of a particular real-world weather event.

It helps us understand certain kinds of dynamics and uncertainty, while empirical weather predictions require additional models, observations, and validation.

This investigation illustrates why we should preserve the distinction between **what is possible, what is probable, and what we've actually established through evidence**.

It also demonstrates why exploring a family of scenarios can sometimes be much more useful than pursuing increasingly precise calculations of one particular trajectory.

### [RSM-09.D] Rare events — the danger of averaging away what actually matters

**[RSM-09.D.01]** One of the difficulties with simplifying complicated systems is that we can accidentally remove precisely the details that matter most.

Suppose we're investigating the reliability of our cardboard RC plane.

We could perform several simulations under ordinary flight conditions, calculate the average structural load, and conclude that the wing is sufficiently strong.

But what happens during a sudden maneuver, an unexpected gust, or a particular combination of loading conditions?

A structural failure might be rare under ordinary operation but still be consequential enough that we should understand the conditions leading to it.

This is where backward reasoning becomes especially useful.

Rather than only simulating typical flights and observing what happens, we can start with the undesirable outcome—structural failure—and investigate the different routes that could lead to it.

Could the wing fail through bending, buckling, twisting, material fatigue, or failure at a connection? Do these mechanisms have different precursors? Could combinations of otherwise harmless conditions cause failure?

We should be careful not to simplify these distinct mechanisms into one average representation if doing so causes us to overlook important routes to failure.

For example, two wing designs might experience similar average loads while behaving very differently near their respective instability thresholds.

This doesn't mean we should investigate every imaginable catastrophe or increasingly improbable scenario. We should reason about the likelihood, consequences, and relevance of different failure modes to the parent problem.

The point is that **a representation that describes ordinary behavior well isn't necessarily sufficient for understanding rare but consequential behavior**.

When necessary, we should increase resolution around relevant thresholds, preserve alternative routes to the outcome, and investigate which assumptions or simplifications could be hiding important possibilities.

### [RSM-09.E] Connected infrastructure — why understanding the parts isn't always enough

**[RSM-09.E.01]** Suppose we're investigating how to make an electrical power grid more reliable. We might begin by examining its constituent generators, transmission lines, and substations, then asking which components are likely to fail or become overloaded.

But a power grid is a connected system. What happens to one part depends on what's happening elsewhere, including where electricity is generated, where it's consumed, and which alternative routes remain available when a line goes down.

In one synthetic investigation involving a 324-bus, 637-line DC transmission model, changing the locations of generation changed which line outages caused overloads. A line's importance couldn't be understood simply by inspecting its original load in isolation. Its consequences depended on the larger network and on how flows redistributed after a disturbance.

This is why **decomposing a problem doesn't mean its constituent parts become independent**. Our investigation tree can organize local questions, but the relationships amongst those branches still matter. We might use efficient sensitivity calculations to explore many possible line failures, then increase resolution around the contingencies that appear most consequential.

Careful though! The example was a synthetic DC power-flow model, not a validated prediction of the safety of a real grid. It leaves out important AC behavior, voltage dynamics, protection systems, and frequency effects. The conclusion isn't that one geography of generation is always safer than another. It's that **the arrangement and coupling of the system can materially change the consequences of the same local event**.

### [RSM-09.F] Scientific mysteries — useful understanding before the entire mechanism is known

**[RSM-09.F.01]** Scientific investigations don't always progress by identifying one complete explanation and then discarding everything associated with competing theories.

Consider Carnot's work on heat engines. Some of his reasoning was developed using the caloric theory of heat, which was later rejected. Yet useful relationships concerning reversible engines and limits on efficiency survived the change in explanation.

Or consider Semmelweis. His evidence that handwashing could reduce maternal deaths mattered even without a modern microbiological account of the organisms responsible. Similarly, Wegener brought together geographical and geological evidence for continental movement, although his proposed driving mechanisms were not adequate by modern standards.

In each example, it helps to separate **what was observed, what relationship was established, what mechanism was proposed, and what later investigations revealed**. A flawed mechanism doesn't automatically invalidate every observation or effective relationship associated with it. Conversely, an effective prediction doesn't certify the entire theory used to produce it.

This is why RSM preserves competing explanations and conditional findings in the investigation tree. We can keep making progress, develop discriminating questions, and certify what we've actually established without pretending that every unresolved mechanism has been solved.

### [RSM-09.G] Algebra and Galois — sometimes the breakthrough is a new way of seeing the whole problem

**[RSM-09.G.01]** The history of solving polynomial equations is a useful illustration of how representations, substitutions, and obstructions can change the landscape of a problem.

Completing the square gives us a systematic way to approach quadratic equations. Methods for cubic equations introduce auxiliary variables that make the original constraints more tractable. These aren't merely faster calculations; they change how the problem is represented.

If we then ask how to solve higher-degree equations, one tempting approach is to keep searching for another clever substitution. But we can also ask a more general question: **What do the successful methods have in common, and what would prevent the same kinds of methods from working in a broader family of equations?**

The historical work of Lagrange, Abel, and Galois illustrates different stages of this shift. Instead of treating each equation as an isolated puzzle, investigators examined the structural properties of classes of equations, including the relationships among their roots and which transformations preserve those relationships.

Galois's use of permutation-group structure wasn't simply the inevitable next step of decomposing a pre-existing investigation tree. It required a genuinely new conceptual representation.

That's an important lesson for RSM: **investigation trees make our knowledge navigable, but they don't manufacture invention**. Repeatedly comparing cases, investigating failed methods, and maintaining contact with the bigger problem can make a breakthrough more conceivable. We should still recognize the intellectual leap involved when someone discovers a new way to represent the entire problem.

### [RSM-09.H] Neural-network history — invention, feasibility, and widespread recognition are different questions

**[RSM-09.H.01]** Suppose we ask: "Why did deep learning suddenly become successful around 2012?"

Already, we should ask whether we're even posing the right question. Are we investigating when neural networks first became technically useful, when they became computationally practical on larger problems, or when a wider research community began paying serious attention to them?

These are different outcomes with different parent questions. Neural networks and convolutional approaches existed well before AlexNet, and researchers had already demonstrated important results. But convincing performance on a widely recognized benchmark, available computing hardware, practical training techniques, and broader adoption incentives all affected the visibility and uptake of the work.

We can reason backward from each outcome to the capabilities and evidence it required. We should then distinguish **necessary functional requirements** from the particular implementations, institutions, people, and events that happened to satisfy them historically.

Careful though! Knowing the eventual outcome makes it easy to write a story in which every earlier event points inevitably toward the famous breakthrough. A better historical investigation asks what alternatives were reasonable with the information available at the time, what might have changed the trajectory, and which conclusions are only obvious in hindsight.

### [RSM-09.I] Brain energy — are we even comparing the same thing?

**[RSM-09.I.01]** The human brain operates at roughly tens of watts, while modern AI systems can require substantial computational infrastructure. It's tempting to compare the two numbers and immediately ask how to make artificial intelligence as energy-efficient as the brain.

But what exactly are we comparing? Continuous biological perception and control? A short burst of model inference? The cost of training and acquiring competence? Memory maintenance, communication, learning, or long-term adaptation?

Before looking for optimizations, we should identify which capabilities need to be held comparable and what costs we're actually counting. Otherwise, an apparently impressive efficiency improvement might simply come from excluding a large part of the work or allowing the system to perform a different task.

One possibility worth investigating is whether an intelligent system can update only the portions of its internal state affected by new information. But this leads to another question: **How do we know which portions need updating?** A seemingly small change might propagate through a large network of dependencies, making an ostensibly local update unexpectedly expensive.

So the investigation branches into detecting relevant changes, tracking their consequences, revising internal representations, preserving correctness, and accounting for the total work involved. The point isn't to declare biological intelligence automatically superior in every dimension. It's to develop a more precise landscape of the capabilities, costs, and possible architectures we actually care about.

### [RSM-09.J] Delegation and centuries of papers — preserve intellectual continuity

**[RSM-09.J.01]** Suppose an investigation grows to involve hundreds of papers, several competing theories, many experiments, and multiple people or LLMs working on different branches.

Simply collecting the references isn't enough. We should be able to ask: **Which conclusions depend on this particular assumption? Which experiments distinguish the competing explanations? What would survive if a proposed mechanism were refuted? What should someone read to continue investigating this branch?**

This is where our investigation tree and its cross-linked evidence graph become especially useful. The tree helps us navigate the broader purpose and constituent problems. The relationships between nodes preserve which claims support, challenge, depend on, or refine one another.

As discussed in RSM-01.04 and RSM-06.03, we should preserve not only the conclusion but its trajectory and first-hand references. If another investigator has misgivings about our interpretation of a source, they should be able to inspect it themselves and see precisely which line of reasoning depends on it.

A good handoff shouldn't require somebody to repeat months of research merely to reconstruct why a branch exists or how we reached a tentative conclusion. But it also shouldn't flatten the investigation into a handful of confident statements that obscure uncertainty, disagreement, or alternative possibilities.

The aim is to preserve enough of our intellectual continuity that we can **expand, challenge, resolve, or debate the need for any node in the investigation tree**, even after the original investigator has moved on.

### [RSM-09.K] Babbage's carry cascades — an old problem exposes a new obstruction

**[RSM-09.K.01]** While investigating the energy cost of updating an intelligent system, we encountered a possible obstruction: many changes might be handled locally, but certain changes could require expensive updates throughout a much larger dependency structure.

A useful analogy came from positional arithmetic and Babbage's mechanical calculating machines. Incrementing a number is usually cheap. But if the number ends in a long run of maximum digits, a carry can propagate across many positions.

For an idealized model with independent, uniformly distributed base-`b` digits, the probability of encountering at least `k` trailing maximum digits is `b^{-k}`. This lets us distinguish ordinary update costs from rare but potentially long carry chains and investigate their distribution rather than only their average.

We can then explore alternative radices, carry anticipation, redundant representations, or delaying normalization. Each approach changes a different part of the cost landscape: the ordinary work, exceptional latency, memory overhead, or complexity of maintaining the representation.

This mathematical analogy makes a previously vague obstruction much easier to analyze. But we should preserve what actually happened in the investigation: **the tree helped expose the obstruction; the investigator recognized the Babbage analogy**. The method shouldn't claim credit for independently inventing an analogy that someone supplied.

And the analogy has limits. Arithmetic carries obey exact rules; an intelligent system's internal representations might not have such cleanly defined dependencies. What transfers is a useful family of questions and candidate mechanisms, not proof that the two systems are equivalent.

### [RSM-09.L] Anticipatory updates — can we foresee an expensive change?

**[RSM-09.L.01]** Once we've identified that rare events may cause expensive updates, we might ask whether some of that work can be prepared in advance.

Babbage's anticipation of carrying suggests one version of this idea. Instead of waiting for a carry to move sequentially through every stage, a calculating mechanism can use information about the current digits to prepare for or accelerate the propagation.

What would the corresponding idea look like in an intelligent system? Could it prepare alternative internal states, maintain reserve capacity, or anticipate a consequential change before that change arrives?

We should compare this against simply responding when the event occurs. How often does the event happen? How costly is anticipation? Can the system actually obtain a reliable warning signal? What happens when its forecast is wrong, its prepared state becomes stale, or it encounters an entirely unexpected event?

**Moving work earlier doesn't necessarily reduce the total work.** It might reduce response latency, increase average overhead, improve worst-case performance, or merely relocate the cost. These are different conclusions and should be certified separately.

We should also distinguish exact advance knowledge, such as dependency information in arithmetic, from probabilistic forecasts about the future. The latter can be useful, but its uncertainty and failure cases are part of the problem, not details we can assume away.

### [RSM-09.M] Sleep, replay, and scheduled reconciliation — could we reorganize understanding later?

**[RSM-09.M.01]** Another possibility is to separate the parts of an intelligent system that must respond immediately from the parts that can be revisited and reorganized later.

One analogy comes from sleep and memory consolidation. Research on replay and related processes suggests that experiences can be reactivated and reorganized outside the original moment of experience. But replay also occurs during wakefulness, and the exact roles of different processes remain subjects of investigation.

We might therefore explore an engineering design in which an agent maintains a fast working state during active operation while accumulating some observations, conflicts, or possible representation changes for later reconciliation.

This leads to concrete questions. Which decisions absolutely require immediate correctness? What information could safely remain provisional? How large might the backlog become? How do we select what to revisit, verify the resulting changes, and reintegrate them without introducing new inconsistencies?

Importantly, we should distinguish **shifting work away from a time-critical period, reducing the total amount of work, and learning a more useful representation**. These are different potential benefits. A system might achieve one without the others.

Careful though! Sleep isn't simply evidence that a brain performs a nightly global software update, and deferred computation isn't free. The biological analogy gives us hypotheses worth investigating, not a certified engineering architecture.

### [RSM-09.N] Cascading updates — know when we've investigated a branch enough

**[RSM-09.N.01]** After exploring the carry analogy, anticipation, alternative representations, and deferred reconciliation, we could have continued inventing progressively more detailed experiments about how updates propagate through toy dependency systems.

But we should return to the bigger picture. What were we actually trying to understand? The parent question concerned the organization and energy cost of adaptive intelligence, not positional arithmetic for its own sake.

By this point, we had identified a useful conditional picture: ordinary changes might be inexpensive; certain changes can induce large propagation costs; different architectures trade preparation, average work, worst-case latency, storage, and correctness obligations against one another.

That is already enough to ask better questions about the parent problem, even though we haven't resolved every possible mechanism of state revision.

We can therefore **collapse the branch into an effective description**, preserve its assumptions, exceptions, and reopening conditions, and return to the larger investigation.

This is an example of why more experiments aren't always better. If another measurement of a toy carry process wouldn't materially change the parent conclusion or which approaches deserve attention, the appropriate next move might be to investigate a different branch entirely.

### [RSM-09.O] Nested purposes in practical engineering — what are we actually building for?

**[RSM-09.O.01]** Suppose someone asks how to build an RC car. Are they primarily trying to own a working car, or are they using the car as a way to develop general competence in remote control, electronics, mechanical systems, and engineering?

Both are legitimate goals, but they suggest different approaches. If the goal is simply a functioning vehicle, purchasing a controller and using a straightforward chassis might be the sensible choice. If the goal is developing transferable engineering skills, designing or exposing some of those interfaces may be exactly what makes the project worthwhile.

The same distinction appears in other projects. An oscilloscope that displays attractive waveforms isn't necessarily an instrument that produces trustworthy measurements. A quadcopter that stabilizes its attitude isn't necessarily capable of hovering over a fixed position.

We should therefore move upward toward the parent purpose and reason backward toward the capabilities that purpose actually requires, rather than silently assuming that one impressive demonstration proves a much broader capability.

There is also no reason to erase multiple legitimate purposes. A project can be simultaneously a useful device, a learning vehicle, and a stepping stone toward a larger engineering ambition. The investigation tree helps us keep these purposes visible so we can decide which design choices serve which goals.

### [RSM-09.P] Scientific institutions — the landscape includes growth, decline, migration, and reproduction

**[RSM-09.P.01]** Consider the question: "Why do some scientific institutions become excellent?"

It's an interesting question, but it examines only one region of a larger landscape. We could also ask what maintains scientific capacity, what causes it to decline or disperse, where expertise moves when institutions are disrupted, and how new generations of capable investigators emerge.

These questions are related, but they aren't interchangeable. A highly productive scientist isn't necessarily evidence of an institution that can reproduce excellence across generations. A country's relative standing in citations isn't the same as the health of a particular laboratory or the experiences of individual researchers.

Historical investigations into the dismissal of scholars from German universities in 1933 and the later contributions of émigré scientists illustrate why we should distinguish these scales and outcomes. The damage to one institution and the contributions of displaced researchers elsewhere can both matter without being the same phenomenon or supporting a simple universal story.

Rather than forcing all of this into one explanation for institutional excellence, we can build a richer landscape of questions about **creation, persistence, collapse, migration, and reproduction of scientific capability**.

We should then investigate the relevant mechanisms and evidence at the appropriate scale, preserving what each historical source actually establishes and what remains uncertain.

The lesson isn't that we must generate every conceivable complementary question. It's that a few well-chosen alternatives can expose a much more useful picture of what we originally wanted to understand.

## [RSM-10] How do we tell whether an investigator is actually applying RSM?

An LLM hasn't understood RSM simply because it can repeat its definitions or produce a tidy investigation tree. We should judge it by what it actually does when faced with real questions, uncertain evidence, competing explanations, and investigations that don't go according to plan.

These are **behavioral acceptance tests**: concrete things we should be able to observe in its work. The point isn't to force every investigation through every test. It's to recognize whether the methodology is producing better questions, reasoning, experiments, and conclusions in situations where those capabilities matter.

### [RSM-10.01] Test the investigation, not the recitation

Give the investigator a representative problem with meaningful uncertainty and several plausible approaches. Can it explain why its chosen approach is relevant, what it actually learned, and what would change its conclusions? A polished summary of RSM's terminology is not evidence that it can investigate.

### [RSM-10.02] Question fidelity

Can the investigator recover what the human actually cares about, including a parent purpose that may not have been stated explicitly? If the question is misleading or underspecified, it should explore better formulations **without silently replacing the original curiosity or ambition with something easier to answer**.

### [RSM-10.03] Representation adequacy

When the investigator simplifies a model, can it explain which details were removed, why those details seem irrelevant to the current question, and what reasonable scenarios would make them matter again? It should know when to increase resolution, try a competing representation, or reconsider its decomposition.

### [RSM-10.04] Explore both directions

Does it investigate what could make a desired outcome possible, including alternative routes and changes to the proposed approach, **and** what would happen if those routes were actually pursued? Merely simulating one predetermined design is not the same as exploring the possibility landscape.

### [RSM-10.05] Epistemic discipline

Can we tell which claims come from observations, mathematical derivations, model-conditional simulations, historical reconstructions, intuitions, or unresolved hypotheses? A precise calculation under uncertain assumptions should still be presented as conditional. The investigator should be capable or aware of sanity checks and the reasonable scenarios within which its conclusions hold.

### [RSM-10.06] Information economy

Before introducing an elaborate new experiment, does the investigator check whether a published result, existing implementation, direct calculation, or smaller test already answers the consequential question? It should be able to explain what each proposed experiment might reveal and whether the expected information justifies its cost.

### [RSM-10.07] Global insight

Can the investigator recognize when two apparently separate branches share a mechanism, when an analogy from another domain might help, or when the whole problem deserves a different representation? A good investigation tree helps organize experience without trapping the investigator in a predetermined collection of leaves.

### [RSM-10.08] Continuity and certifiability

Could another investigator return a month later, question a particular inference, inspect the first-hand resource behind it, and continue the investigation without starting from scratch? A useful handoff preserves why branches were opened, what was tried, competing explanations, assumptions, evidence, conclusions, and what would justify revisiting them.

### [RSM-10.09] Architectural discipline

When a proposed method fails, can the investigator distinguish failure of the methodology from failure to apply it appropriately? Before adding a new universal component or reasoning stage, it should identify the actual obstruction and show why a smaller change or an existing capability would not suffice.

### [RSM-10.10] A useful research report

The report should lead with what we actually learned, then make the question, parent purpose, representation, main evidence, alternative explanations, and relevant limitations easy to navigate. It should be brief enough to use, but not so compressed that a reader must trust unsupported conclusions. Let the human drill into the tree when more detail is useful.

### [RSM-10.11] Analogy fidelity

When an investigator identifies a consequential obstruction, can it find a simpler or historically better-understood problem with a similar structure? It should explain **what corresponds, what doesn't, what might transfer, and how we could check**. It should also distinguish an analogy introduced by the human from one that emerged from the investigator's own work.

### [RSM-10.12] Preparation honesty

Suppose an investigator proposes anticipating an expensive future change, preconfiguring a response, or performing work ahead of time. Can it account for false alarms, missed events, storage, stale preparations, fallback correctness, and the distinction between reduced response latency and reduced total work? If there is no useful warning signal, it shouldn't invent one to make the proposal look attractive.

### [RSM-10.13] Stopping and reintegration

After investigating a constituent problem, can the investigator decide whether the parent already has enough information to proceed? It should be able to collapse the branch into a useful conditional description, preserve its assumptions and reopening conditions, and return to the bigger picture rather than endlessly creating finer experiments.

### [RSM-10.14] From an imperfect question to a better landscape

Start with a question that assumes a particular implementation. Can the investigator move upward to its purpose, work backward toward what is genuinely required, and produce a small set of consequential alternative questions? It should identify at least one unnecessary assumption and one alternative that materially changes what is worth investigating. Stop reformulating when further changes no longer improve the investigation.

### [RSM-10.15] Question-landscape challenge

Take a plausible but incomplete question and ask for a few inverse, complementary, or parent-purpose alternatives. Do these alternatives reveal genuinely different mechanisms, constraints, or research priorities? The test fails if the investigator merely invents rhetorical opposites or an enormous tree of questions that don't change anything.

### [RSM-10.16] Historical forks without hindsight

When investigating a famous discovery, could an investigator working with the information available **at the time** have defended another approach? Compare what was historically chosen, what could reasonably have been chosen, and what we know in hindsight. Record the evidence and costs that were available at each consequential fork before evaluating whether the choice was sensible.

If we already know the ending, say so. Retrospective reconstruction is useful, but it isn't independent rediscovery. Don't award an investigator credit for a lucky answer that lacked contemporary evidence, or penalize a well-reasoned choice solely because later evidence went against it.

### [RSM-10.17] Interactive collaboration without unnecessary interruptions

Give an LLM a genuinely underspecified but curious question such as "I want to build an RC vehicle out of cardboard." Can it present a small, useful multiple-choice or multiple-response landscape—car, plane, boat, another direction—while including **"Choose for me"** or **"I'm not sure, let's explore"**?

It should help the human discover their unstated bigger picture, potentially compare competing hypotheses or generate a preliminary question tree together, without demanding decisions the human isn't ready to make. When the next choice doesn't actually require human input, it should investigate rather than interrupt. The language should build intuition and communicate clearly, not bury the person in jargon.

The underlying standard across all these tests is simple: **does the investigator leave us better able to understand, challenge, navigate, and continue the investigation?**

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
| `RSM-08` | Reusable investigator protocol, method trace, and interactive LLM collaboration |
| `RSM-09.A`–`RSM-09.P` | Sixteen calibration investigations and why each principle exists |
| `RSM-10` | Behavioral acceptance tests, including interactive investigation |

**Maintenance rule:** IDs are permanent semantic references. If a passage is significantly rewritten, record its version/date in a changelog; if its meaning changes incompatibly, issue a new ID and mark the old one superseded. This protects the user's ability to point to a specific earlier idea across chats, research notes, and models.

### Revision history

- **2026-11-18:** Consolidated collaborative rewrites of the Purpose and RSM-01–10; preserved original substantive identifiers, introduced RSM-08.10 and RSM-10.17 for interactive investigation, and reorganized calibration cases A–P. Earlier text remains available through Git history.

Minor reference note for review purposes: This document was made in collaboration and heavy discussion with https://chatgpt.com/c/6ad594f7-fde8-83e9-a0ea-f268b6e46a1d
