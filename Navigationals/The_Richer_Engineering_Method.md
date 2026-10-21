# The Richer Engineering Method

## I. What do we actually need?

What do we actually need? Is that even the right question? What is the larger picture?

What ideas, reasoned from first principles, could fulfill the objective? Why is the proposed methodology appropriate?

Engineering should be practical, minimally complicated, and justified against representative real-world cases rather than dominated by hypothetical edge cases.

We are engineers, not mathematicians. A useful, if informal, way of comparing solutions is:

\[
\frac{\text{Benefit of success}\times\text{Likelihood of success}}
{\text{Objective failure cost}\times\text{Psychological failure cost}\times\text{Estimated failure likelihood}}
\]

The precise quantities are often unknowable. Nevertheless, we can enumerate their relevant failure and success taxonomies, estimate their relative importance, and construct partial rankings rather than invent numerical precision.

Do not choose a solution merely because it is popular or conventional. Justify it conceptually, practically, and finally through construction, testing, or reasoned examination of its failure modes.

### Sufficiency, friction, and resonance

Recognize when a system has achieved approximately 80%, 95%, or 97.5% of its useful potential, and when further improvement is not worth its cost. However, the remaining 20%, 5%, or 2.5% may contain a disproportionately important bottleneck.

Here *friction* primarily concerns the system itself: components that couple inefficiently, interrupt one another, or impose consequential bottlenecks. This is distinct from, though sometimes related to, cognitive and interface friction.

The asymptotic ideal is *resonance*: components coupling so effectively under the intended load that no consequential weak link limits the system. Such coupling can produce disproportionately large, potentially multiplicative benefits. Perfect resonance is rarely necessary; somewhat detuned coupling may be entirely adequate.

This also explains why apparently minor inefficiencies deserve examination when they interrupt a system's ability to operate at the speed of thought. The objective is not maximal optimization everywhere, but sufficiently effective integration.

The Moon landing illustrates an engineering attitude worth retaining: clarity about what, where, when, and why can precede complete clarity about *how*. Engineering often begins before the entire implementation is known.

When examining errors, inefficiencies, and indeterminate states, also consider *symbiotic communication*: how effectively the system communicates its behavior, limitations, and failures to its operator. Perceived inefficiency and unexplained behavior can be psychologically costly even when their objective cost is small.

---

## II. Static feature engineering

Inspired partly by browser fingerprinting, consider feature engineering as the economical accumulation of discriminating evidence.

### 1. Enumerate and rank features

Identify which heuristics or features are available, which are currently used, and which could be acquired.

Rank or partially rank them by their estimated *resolving power*: how much each helps distinguish the possibilities relevant to the task.

Begin with the feature's failure taxonomy. Under which conditions does it correctly identify the target? When does it fail, become ambiguous, or misidentify something else?

### 2. Reason about resolving bits

A useful initial intuition is to consider the number of possibilities distinguished and the reliability of the feature.

For example, among eight equally likely possibilities, distinguishing a particular possibility corresponds to three bits of surprisal. If the heuristic succeeds in only one of eight relevant cases, a rough success-weighted estimate might be:

\[
\frac18\times 3
\]

Conversely, a heuristic succeeding in fifteen of sixteen cases might motivate the estimate:

\[
\frac{15}{16}\times 4
\]

Similarly, if only one of four equally likely cases satisfies the success criterion, one might initially estimate:

\[
\frac14\times 2
\]

These are **informal ranking heuristics, not general formulas for Shannon information gain**. Actual information gain depends on the full probability distribution and how observations distinguish outcomes. Success probability alone is insufficient.

The underlying engineering idea remains useful: estimate how reliably a feature resolves a consequential distinction, and adjust that estimate using its failure taxonomy.

Rank features from the most consequential or identifying—analogous to most significant bits—to the least discriminating or most approximate.

Ask whether a feature's structural uniqueness is useful. A highly specific feature may identify the correct object exceptionally well when present but reject valid examples whose relevant properties vary.

Features may also resolve overlapping distinctions. Combining more features does not automatically yield the sum of their individual resolving powers.

### 3. Prefer reasoned failure certificates

The advantage of explicitly reasoning about features is that failures become interpretable.

Instead of repeatedly adjusting weights until the system appears to fit the data, one can ask which proposed distinction failed, under what conditions, and why.

These explanations form *failure certificates*. They make the design more communicable, expose its assumptions, and help refine the failure taxonomy.

Not all failures have equal frequency or consequence. Representative cases and partial rankings should guide their importance.

### 4. Account for acquisition cost and pragmatic utility

Resolving power is not equivalent to engineering value.

A feature may distinguish objects extremely well but be computationally expensive, difficult to acquire, unreliable under operating conditions, or redundant with cheaper features.

One may therefore evaluate its **algorithmic-complexity utility**: its discriminating contribution relative to acquisition and computational cost.

For classification, also examine the consequences of true positives, true negatives, false positives, and false negatives—the *pragmatism of a feature*.

A rare error may still be unacceptable if it is objectively expensive or unusually disruptive to the operator.

Where extensive ranking becomes cumbersome, return to a simpler question:

**What do I gain, marginally, by acquiring this feature or introducing this additional consideration?**

Often this comparison is sufficient.

---

## III. Dynamic feature engineering (DFE)

Static feature engineering identifies useful distinctions. *Dynamic feature engineering* concerns how observations, feature relevance, and recognition criteria may change conditionally during an investigation.

For example, the intra-consistency of previously observed features may itself become a feature used to regulate the interpretation of subsequent observations.

The same feature-engineering questions therefore apply recursively to the dynamics: which observations justify changing the original recognizer, and how much value does that adaptation provide?

### 1. When should dynamics be introduced?

Generally, introduce DFE when static methods exhibit failures that a semantic reasoner can recognize and plausibly correct.

A human may see an obviously incorrect result, reconstruct the conditional reasoning that would have avoided it, and attempt to encode only that missing behavior into the algorithm.

Failure certificates are particularly valuable because they make this inverse reconstruction concrete.

Anticipatory DFE may still be justified when failure consequences are severe or representative testing already establishes the need.

### 2. Why semantic introspection is insufficient

Semantic reasoners frequently perform conditional adjustments without explicitly recognizing them as separate computational operations.

Consider identifying a cat.

A person might initially describe a static collection of identifying features. Yet, upon observing a partial feature, they may redirect attention, consider occlusion, infer that the remainder of the animal is behind a couch, and selectively examine the relevant region.

These hypotheses were not necessarily enumerated beforehand. They became relevant because of the observation.

Even when a person can articulate this reasoning afterward, they may be poor at identifying which parts are computationally necessary or worth implementing.

Consequently, introspectively listing every conceivable mechanism risks creating a needlessly complicated system.

### 3. Expectation-driven investigation

Dynamic investigation need not begin with a recognizable partial feature.

Suppose someone asks us to find a cat. This creates a provisional expectation that a cat may be present, although the request alone does not establish its existence.

A quick static inspection finds nothing.

The discrepancy between expectation and observation may itself motivate further investigation: perhaps the cat is occluded, disguised, unusually positioned, or the original expectation was mistaken.

Semantic reasoners possess a kind of inexpensive internal *RAM* for constructing, manipulating, and testing such possibilities before committing to more expensive observations.

This is *theory and theorizing*: forming conditional hypotheses, using prior experience to assess them, and selecting worthwhile tests.

It need not involve reproducing a human's entire semantic reasoning capability in the engineered system.

### 4. Residual or stopping theories

A semantic reasoner can also stop without pretending to have resolved the problem.

For example:

*If a cat is present, it was not readily visible during the first inspection. It may be occluded or represented by an unusual visual form. Further inspection could resolve this, but is not currently worth the time.*

Such a *residual or stopping theory* preserves the remaining possibilities, the available evidence, and the reason for terminating the investigation.

Its purpose is to balance motivation, computational expense, uncertainty, and sensible stopping.

### 5. Capability versus economical compilation

**A semantic reasoner's ability to perform an investigation should not be confused with its ability to specify, in advance, the minimal computational machinery responsible for that investigation.**

Many useful hypotheses become relevant only after partial observations, discrepancies, or failures.

Therefore, DFE should generally be elicited from concrete failures and their certificates rather than unconstrained introspective enumeration.

The deeper distinction is between *possessing a capability* and *economically compiling that capability into an algorithm*.

DFE concerns the second problem.

---

## IV. Evaluating dynamic hypotheses

Semantic reasoners do more than dynamically modify hypotheses.

They also:

1. Test and revise hypotheses.
2. Compare how well competing hypotheses explain the observations.
3. Evaluate whether the hypotheses themselves are reasonable, admissible, and economical.

These distinctions are critical because dynamic adaptation can produce increasingly coherent yet increasingly incorrect interpretations.

### 1. Adaptive overacceptance and overrejection

An adaptive recognizer may gradually change its criteria until observations that should be rejected become acceptable.

More subtly, it may begin rejecting examples that it previously recognized correctly.

Both failures can result from the same natural capability: adapting to changing environmental conditions and maintaining internal consistency.

A hypothesis can become more internally consistent without becoming more correct.

Thus, compare the adapted recognizer against the static baseline, competing explanations, and relevant earlier discriminations. Increased coverage alone is not evidence of improvement.

### 2. Sequential detuning

The problem becomes especially consequential when adaptation is exploited deliberately or unintentionally.

Imagine an observer who wishes to hide an exemplar object from a recognizer.

Rather than presenting the object immediately, the observer supplies a sequence of gradually changing observations that progressively detune the recognizer.

Once it is sufficiently displaced from its original recognition criteria, the exemplar is abruptly introduced and incorrectly rejected.

The inverse attack is also possible: gradually condition the recognizer until an unmistakably invalid example is admitted as valid.

The important structure is **smooth conditioning followed by a strategically abrupt payload**. Each adaptation may appear locally reasonable while the cumulative trajectory produces a severe failure.

This is especially relevant when the recognizer is obliged to accommodate gradual environmental variation.

### 3. Golden-reference distributions and adaptive resistance

One possible defense is to initialize the recognizer using a sufficiently representative *golden data distribution*, then regulate subsequent adaptation relative to that reference.

For example, resistance to further adaptation might increase with statistical displacement from the initial distribution, using sigma-based distances, exponential attenuation, or related rules.

The guiding intuition is that continued displacement should require increasingly strong justification.

However, the reference may itself be sparse or imperfect. Excessive anchoring could prevent legitimate adaptation.

### 4. Asymmetric renormalization

A more flexible policy might distinguish movement farther from the reference from movement back toward it.

As displacement increases monotonically, adaptation could become progressively more resistant. But when the trajectory reverses toward the familiar distribution, adaptation might become more permissive, encouraging recovery.

This would make the system resistant to sustained detuning without making it permanently rigid.

A complication is that an observer who knows the policy could exploit it through *wobbling*: alternating small inward and outward movements while achieving a net outward displacement.

Periods of apparent stability might also be used to reduce resistance before continued detuning.

Nevertheless, distinguishing sustained movement, reversal, and rest may help balance long-term malleability against continued exposure to change.

The intention is not to prescribe one mathematical controller, but to preserve these possible mechanisms and their associated failure modes for testing.

---

## V. Trusted references and domains of validity

A natural question follows: **What makes the initial reference distribution trustworthy, and within what domain is it valid?**

### 1. Sampling and increasing confidence

The motivating statistical intuition is that continued representative sampling should improve our estimate of the underlying distribution.

The central limit theorem offers a related convergence intuition, although it does not itself guarantee representative sampling or convergence of the full empirical distribution under arbitrary conditions.

Confidence should therefore depend not only on sample size but on the sampling process, coverage, and assumptions governing the intended domain.

### 2. Variance and extrapolation

A narrow distribution is not inherently suspicious.

Rather, it establishes a correspondingly narrow region of observed variation, limiting what can responsibly be inferred about unobserved cases.

This distinction does not necessarily require prior knowledge that greater variance *should* exist. The limited observed coverage is itself a reason to qualify off-sample generalization.

When relevant, investigate whether the missing variation reflects the sampling process, the environment, the measurement instrument, or a mistaken hypothesis.

Thus, greater sample size may increase confidence within an adequately sampled domain while leaving confidence outside that domain limited.

### 3. Awareness of applicability

A recognizer should not merely maintain a hypothesis. It should also retain some understanding of the conditions under which that hypothesis has been supported.

This is closely related to your earlier proposal of reasoning about the *dynamics governing static features*.

The governing question becomes:

**Does the hypothesis remain reasonable under the circumstances to which it is being applied?**

Such awareness may sometimes be implemented through simple constraints or reference statistics rather than a separate metareasoning system.

---

## VI. Must validation create an infinite hierarchy?

One might object that dynamic procedures have their own domains of validity, which themselves require validation, and so on.

This raises the possibility of an indefinitely extending hierarchy:

1. Can I trust the hypothesis?
2. Can I trust the evidence supporting it?
3. Can I trust the criteria evaluating that evidence?
4. Can I trust the criteria evaluating those criteria?

And so forth.

There are several reasons not to assume that an engineering implementation requires such a hierarchy.

### 1. The foundational question

One could investigate whether sufficiently expressive systems of hypothesis evaluation encounter self-reference or limitations analogous to those in formal logic.

Gödel's incompleteness theorems provide a possible analogy, but applying them directly would require specifying an appropriate formal system and proving the relevant correspondence.

The possibility is intellectually interesting; it does not establish that practical hypothesis evaluation requires infinitely many validators, nor that no terminating procedure is possible.

Even if an unbounded hierarchy could be constructed theoretically, engineering remains constrained by time, memory, energy, and marginal utility.

### 2. An alternative: closed investigative chains

Rather than adding a new metareasoner whenever a question of validity arises, consider a cyclic process:

1. Is hypothesis \(A'\) trustworthy?
2. Is the supporting evidence \(A\) trustworthy?
3. Is \(A\) even the right sort of evidence for \(A'\), or does it support a different hypothesis?

If the evidence is irrelevant, insufficiently resolved, or better explained by another hypothesis, we may reject, qualify, or revise \(A'\), then repeat the investigation.

This need not require a fourth supervisory stage.

An investigation may instead consist of closed chains, interacting loops, competing hypotheses, and critical points of mutual incompatibility.

Some branches may terminate at *degenerate stopping points*: the instrument cannot resolve the distinction, the evidence is unusable, or the question cannot presently be answered. Here *degenerate* means a point where the investigation collapses or stops, not the conventional statistical null hypothesis \(H_0\).

The practical outcomes remain acceptance under specified conditions, rejection, revision, or unresolved uncertainty.

### 3. Why another conceptual level need not imply another computational class

A universal Turing machine can simulate other Turing machines and nested computational procedures without requiring a fundamentally higher class of computability.

Likewise, an algorithm can represent an evaluator that examines another evaluator, or a collection of interacting hypothesis-revision loops.

Additional conceptual levels do not automatically establish greater computational expressiveness.

However, equivalent computability does not imply equivalent efficiency. The cost of simulation, information requirements, and practical resource limitations may differ enormously.

Indeed, physical machines are finite at any particular time, while the theoretical Turing-machine model permits unbounded tape usage. The distinction between theoretical expressibility and practical realizability is central to engineering.

The proposed ring or network of hypothesis revisions is therefore an alternative representational hypothesis, not a proof that every form of metareasoning can be reduced to a particular closed chain.

### 4. Practical stopping

The existence of another possible validation question does not itself justify implementing another validation mechanism.

One must ask what the additional level would resolve, what consequential failures it would prevent, and whether its cost is justified.

We are engineers, not obliged to settle every foundational question before constructing a useful system.

---

## VII. Hypothesis admissibility: the cat in the clouds

A semantic reasoner can adjust its visual interpretation until a cloud appears cat-shaped.

Yet recognizing cat-like features is not the same as believing that an actual cat exists at the altitude and scale of the cloud.

The distinction depends on more than agreement among visual features. It invokes extended experience, background expectations, causal explanation, competing hypotheses, and the physical plausibility of the interpretation.

One could regard this as a higher-order consideration governing dynamic feature engineering.

But recognizing the distinction does not require engineering a separate, general-purpose reasoning apparatus.

Its immediate purpose is diagnostic: when a dynamic recognizer produces a coherent but absurd result, ask whether the interpretation is admissible and reasonable, not merely whether its selected features agree.

**A dynamically adjusted hypothesis must be evaluated both for explanatory fit and for whether it is an appropriate explanation in the first place.**

This is a useful warning against naive adaptation, without presupposing the architecture required to address it.

---

## Closing consideration

Throughout REM, distinguish between:

- What an investigator can reason about.
- What an engineered system actually needs to accomplish.
- What reasoning must be represented computationally.
- What implementation cost is justified by the resulting improvement.

The aim is not to manufacture the most sophisticated mechanism available, but to determine which distinctions, adaptations, and interactions are necessary for the intended outcome.

Additional complexity should arise from a justified engineering need, not merely from the ability to imagine another mechanism or another level of explanation.
