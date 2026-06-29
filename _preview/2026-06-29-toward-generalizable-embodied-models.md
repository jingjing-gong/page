---
layout: post
title: "Beyond Scale: Embodied Generalization Is a State Representation Problem"
---

Current embodied models, including recent VLAs (Vision-Language-Action models), still struggle when deployed in unseen environments or on unseen embodiments. They often look robust in benchmark settings, but fail once scene layout, object set, camera viewpoint, control frequency, or robot kinematics shift.

While scale matters, the deeper question is where task-relevant state lives: is it represented in the policy context at inference time, or is it buried in the parameters as a prior learned from the training distribution? A policy can choose the right action only if enough of that state is actually present in its conditioning variables. When it is not, the model either hardcodes one likely world into its weights or averages across several incompatible worlds. That is why generalization breaks.


The core hypothesis of this post is:

1. Many generalization failures occur because task-relevant state is absorbed into model parameters instead of represented in the policy context.
2. Those implicit state assumptions can work in-distribution, but break under environment or embodiment shift.
3. Better generalization requires richer observations, memory, and embodiment context so that the policy can infer state online instead of relying on memorized priors.

Recent progress in embodied models should therefore not be read only through the lens of model scale or data scale. The deeper issue is state representation: how much task-relevant state is available to the policy at test time, and how much is left implicit in parameters learned from training? The central challenge is to expose or infer more of that state through policy context and input, rather than hoping scale alone will recover it implicitly. The rest of the post makes that argument precise.

## The core bottleneck

The central bottleneck is a mismatch between the state needed for control and the state available to the policy. At a high level, current embodied policies are usually written as

$$
\pi(a \mid o, I; \theta),
$$

where $a$ is the action, $o$ is the observation, $I$ is the intention or task specification, and $\theta$ are the policy parameters.

This notation hides the core problem: the correct action often depends on more than $(o, I)$. The robot may need information that is not visually obvious, not specified in language, or not recoverable from a single frame. Examples include object mass, friction, occluded pose, the history of failed attempts, embodiment-specific dynamics, or environment-specific factors such as drawer stiffness or calibration bias.

To make that explicit, let $Z$ denote the unobserved but task-relevant state. Then the actual action-generating process is better written as

$$
a^* \sim p(a \mid o, I, Z).
$$

So the real question is not only whether the policy is large enough, but whether $(o, I)$ is a sufficient statistic for action selection.

## A simple formulation of the hypothesis

This intuition can be stated as a conditional-dependence claim. Let $O$, $I$, $A^*$, and $Z$ denote the corresponding random variables. Then $(O, I)$ are insufficient if the optimal action still depends on $Z$ after conditioning on them. A direct way to express this is

$$
I(A^*; Z \mid O, I) > 0,
$$

This says that even after observing the current image and task instruction, the missing state still carries information about the correct action.

If we additionally assume the expert action is determined once the full state is known, i.e.

$$
H(A^* \mid O, I, Z) = 0,
$$

then the same point can be written as

$$
H(A^* \mid O, I) > 0.
$$

Under that assumption, there is still unresolved action uncertainty after conditioning only on observation and instruction.

Suppose the policy is trained by empirical risk minimization:

$$
\hat{\theta} = \arg\min_{\theta} \; \mathbb{E}_{(o,I,a) \sim P_{\mathrm{tr}}}\left[\ell\big(\pi_{\theta}(o,I), a\big)\right].
$$

If $Z$ is not in the input, then the learned policy can only absorb its effect through the training conditional $P_{\mathrm{tr}}(Z \mid o, I)$. In other words, ERM learns under the training posterior over hidden state rather than from state represented explicitly in context. The Bayes-optimal policy under the training distribution is therefore

$$
\pi^*_{\mathrm{tr}}(a \mid o, I)
= \int p(a \mid o, I, Z) \, P_{\mathrm{tr}}(dZ \mid o, I).
$$

This immediately produces two failure modes, depending on what the training distribution does to the missing state.

### 1) Low-diversity regime: missing state gets absorbed into $\theta$

If the training data is narrow, then for a given $(o, I)$ the latent state is nearly fixed:

$$
P_{\mathrm{tr}}(Z \mid o, I) \approx \delta\big(Z - Z_0(o,I)\big).
$$

Then the learned policy effectively becomes

$$
\pi^*_{\mathrm{tr}}(a \mid o, I) \approx p(a \mid o, I, Z_0(o,I)).
$$

Low-diversity data does not solve the hidden-state problem; it only hides the missing state behind a training-specific prior. The policy can perform well in-distribution, but only because the missing information has effectively been absorbed into the parameters. This is what I mean by state being hardcoded instead of represented in context.

At deployment, if

$$
P_{\mathrm{te}}(Z \mid o, I) \neq P_{\mathrm{tr}}(Z \mid o, I),
$$

the policy carries the wrong implicit prior over the missing state, and performance degrades.

### 2) High-diversity regime with a unimodal policy head: unresolved state gets averaged away

If the training data is broad, then many different latent states may correspond to the same $(o, I)$. In that case the ambiguity can no longer be hidden inside a narrow prior. Broad data exposes the ambiguity instead of concealing it. If the policy head is deterministic or unimodal, it tends to average over incompatible action modes.

For example, under squared loss the optimal predictor is

$$
\pi^*(o, I) = \mathbb{E}[A^* \mid O=o, I].
$$

If $A^*$ is multimodal given $(o, I)$, this conditional mean may correspond to no valid strategy at all. The irreducible error is

$$
\inf_f \mathbb{E}\big[\|A^* - f(O,I)\|^2\big]
= \mathbb{E}\big[\mathrm{Var}(A^* \mid O,I)\big].
$$

So when the data is diverse enough but the input still lacks the needed state, the model may not overfit to one hidden assumption. Instead, it averages across incompatible hidden states, which also hurts task performance.

The implication is direct: if the correct action still depends on $Z$ after conditioning on $(O, I)$, then scaling a reactive policy is not enough. The missing state must be brought into context, inferred from history, or represented explicitly as uncertainty.

## How recent progress fits this picture

Under this lens, recent progress is much less mysterious. The methods that seem to improve generalization often do one of two things: they give the policy better evidence about the relevant state at inference time, or they widen coverage over the hidden states seen during training.

### 1) Some methods help because they put more usable state evidence into context

- PaLM-E is important because it does not treat robot control as vision-only pattern matching. It explicitly interleaves language, visual observations, and continuous state inputs, which is at least consistent with the idea that better conditioning helps.[^palme]
- RT-2 supports a similar interpretation from a different angle. By co-fine-tuning a VLM on robot data and web-scale vision-language data, it inherits semantic knowledge that helps on commands and objects not present in the robot training distribution.[^rt2]
- The $\pi_0$ line pushes this further by combining pretrained VLM semantics with continuous action generation, again suggesting that stronger semantic and physical priors may improve out-of-the-box behavior.[^pi0]
- $\pi_{0.5}$ gives some of the strongest recent evidence in this direction. Its recipe mixes robot action data with verbal instruction data, multimodal web data, and high-level semantic supervision. That does not directly prove hidden-state inference, but it is consistent with the kind of training recipe one would expect to help the model infer what matters rather than memorize shortcuts.[^pi05]

These results do not prove full hidden-state inference by themselves. But they are consistent with the first half of the hypothesis: models generalize better when more task-relevant evidence is available in the effective policy context instead of being left to a hardcoded prior.

### 2) Other methods help because they broaden the covered state space

- RT-1 already suggested that scale and task diversity are central for robotic generalization.[^rt1]
- Open X-Embodiment made this concrete by standardizing a large cross-institution corpus with 22 robots, 21 institutions, 527 skills, and 160,266 tasks.[^openx]
- Octo and OpenVLA both build directly on this idea: pretrain on broad cross-robot data first, then adapt. Octo trains on 800k Open X trajectories across 9 platforms, while OpenVLA trains on 970k real-world demonstrations and shows strong multi-embodiment transfer.[^octo][^openvla]
- BridgeData V2 and DROID make the environment side of the argument sharper. BridgeData V2 emphasizes variation in tasks and environments, while DROID adds much broader natural-scene coverage with 76k trajectories, 350 hours, 564 scenes, and 84 tasks.[^bridgev2][^droid]
- Dobb-E is important because it exposes the real target distribution: homes are messy, long-horizon, and user-dependent, so lab-only diversity is not enough.[^dobbe]
- Again, $\pi_{0.5}$ gives direct supporting evidence: its ablations argue that web data helps OOD object generalization, while cross-embodiment and multi-environment robot data help both in-distribution and OOD performance.[^pi05]

Taken together, these results are consistent with the second half of the hypothesis: if deployment spans many latent states, then training must also span many latent states. Otherwise the policy can only succeed by silently encoding environment-specific assumptions in its parameters and hoping deployment matches them.

### 3) Why out-of-the-box deployment does not refute the hypothesis

$\pi_{0.5}$ is useful precisely because it looks, at first glance, like a counterexample. One might read its new-home deployment results as evidence against the claim that current models overfit hidden assumptions. A better interpretation is that such success can occur when the training recipe gives the model enough evidence and enough prior coverage to infer the hidden state online.

- If a model can deploy out of the box in a new home, that does not mean hidden state has become irrelevant.
- It suggests the training recipe gave the model enough semantic, visual, and cross-environment evidence that the hidden state can be inferred well enough for action selection.
- In that sense, out-of-the-box success is not a refutation of the hypothesis. It is at least consistent with what the hypothesis predicts when the induced prior or posterior over $Z$ becomes sufficiently accurate.[^pi05]

### 4) Action modeling still matters, but it is not the main bottleneck discussed here

Even if the argument in this post is mainly about state inference and state-space coverage, the action model still matters. Diffusion Policy is relevant because it shows that action-distribution modeling itself can materially improve performance, reporting a 46.9% average gain in its benchmark setting.[^diffusion]

So the lesson is not that only data matters, or only architecture matters. The broader picture is that richer state evidence, broader state-space coverage, and better action generation all contribute. The specific claim of this post is simply that the first two determine whether the policy relies on explicit state or on hardcoded assumptions.

## Why current models still fail

These failures are not edge cases. They are the predictable consequence of acting on incomplete state with mismatched coverage. Despite recent progress, five breakdowns remain common:

1. Partial observability: single-view snapshots miss task-critical latent state.
2. Shortcut learning: models overfit to background, camera pose, or embodiment-specific priors.
3. Embodiment mismatch: action spaces and dynamics differ across robots.
4. Sparse long-horizon supervision: many trajectories contain weak credit assignment for planning decisions.
5. Evaluation leakage: train and test distributions are often closer than expected.

None of these failure modes is surprising under this view. They all appear when the policy still relies on incomplete proxies for state instead of keeping enough of that state in context.

## A practical recipe for a more generalizable embodied model

Once the bottleneck is stated this way, the design target changes. The goal is not merely to predict the next action, but to make enough task-relevant state available to the policy that the next action remains correct under shift.

Formally, we want the policy to maintain a belief over the latent task state introduced above:

$$
b_t = p(Z_t \mid o_{1:t}, a_{1:t-1}, g, e), \quad a_t \sim \pi(a_t \mid b_t, g, e)
$$

where $Z_t$ is the time-indexed version of the hidden state discussed above, $g$ is language goal, and $e$ is embodiment context (kinematics, action interface, control rate).

That suggests six concrete design commitments:

1. Rich state evidence as context: use temporal observation windows, multi-view sensing where possible, and persistent memory features instead of single-frame policies.

2. Explicit embodiment conditioning: provide robot metadata and action-space adapters so one policy can map shared intent into embodiment-specific commands.

3. Broad and balanced data mixture: mix cross-embodiment datasets (Open X style) with in-the-wild scene diversity (DROID/Bridge style), then rebalance to avoid dominance by a few easy domains.

4. Two-stage training: Stage A is broad pretraining for transferable representations. Stage B is targeted adaptation for deployment embodiments and control stacks.

5. Robust action head: use action modeling that handles multimodality and uncertainty, such as diffusion-style heads, when precision and recovery matter.

6. Evaluation by shift axes, not only aggregate score: report separately on unseen objects, unseen layouts, unseen embodiments, and long-horizon composition.

## Final view

To build a truly generalizable embodied model, we need two things at once: enough context to infer latent task state online, and enough diversity to keep that state from collapsing into a single training prior.

If the correct action still depends on hidden state after conditioning on $(o, I)$, then generalization cannot be solved by scale alone. The central question is how much of that state is available in context at test time and how much still has to be supplied by fixed assumptions in the parameters. A robust policy must either observe more, remember more, or explicitly represent uncertainty over what it cannot yet observe.

That, to me, is the real lesson of recent VLAs: progress comes not just from bigger models, but from reducing how much task-critical state must be carried by hardcoded assumptions and increasing how much can be recovered through online inference.


References
----

[^rt1]: Anthony Brohan et al. "RT-1: Robotics Transformer for Real-World Control at Scale". arXiv 2022. https://arxiv.org/abs/2212.06817

[^palme]: Danny Driess et al. "PaLM-E: An Embodied Multimodal Language Model". arXiv 2023. https://arxiv.org/abs/2303.03378

[^rt2]: Anthony Brohan et al. "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control". arXiv 2023. https://arxiv.org/abs/2307.15818

[^openx]: Open X-Embodiment Collaboration et al. "Open X-Embodiment: Robotic Learning Datasets and RT-X Models". arXiv 2023. https://arxiv.org/abs/2310.08864

[^octo]: Octo Model Team et al. "Octo: An Open-Source Generalist Robot Policy". arXiv 2024. https://arxiv.org/abs/2405.12213

[^openvla]: Moo Jin Kim et al. "OpenVLA: An Open-Source Vision-Language-Action Model". arXiv 2024. https://arxiv.org/abs/2406.09246

[^pi0]: Kevin Black et al. "$\pi_0$: A Vision-Language-Action Flow Model for General Robot Control". arXiv 2024 / RSS 2025. https://arxiv.org/abs/2410.24164

[^pi05]: Physical Intelligence. "$\pi_{0.5}$: a VLA with Open-World Generalization". 2025. https://www.pi.website/blog/pi05

[^bridgev2]: BridgeData V2 project page and paper resources. https://bridgedata-v2.github.io/

[^droid]: Alexander Khazatsky et al. "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset". arXiv 2024. https://arxiv.org/abs/2403.12945

[^dobbe]: Nur Muhammad Mahi Shafiullah et al. "On Bringing Robots Home". arXiv 2023. https://arxiv.org/abs/2311.16098

[^diffusion]: Cheng Chi et al. "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion". arXiv 2023/2024. https://arxiv.org/abs/2303.04137