---
layout: post
title: "Beyond Scale: Embodied Generalization Is a State Representation Problem"
---

Current embodied models, including recent VLAs (Vision-Language-Action models), still struggle when deployed in unseen environments or on unseen embodiments. They often look robust in benchmark settings, but fail once scene layout, object set, camera viewpoint, control frequency, or robot kinematics shift.

While data and parameter scale matter, the deeper question is where task-relevant state lives: is it represented in the policy context at inference time, or is it buried in the parameters as a prior learned from the training distribution? A policy can choose the right action only if enough of that state is actually present in its conditioning variables. When it is not, the model either hardcodes one likely world into its weights or acts under unresolved uncertainty over several incompatible worlds. That is why generalization breaks.

The core hypothesis can be summarized as follows:

**Embodied model generalization fails when the correct action depends on task-relevant state that is absent from the policy context and is therefore supplied by an implicit training prior stored in the parameters.**


Recent progress in embodied models should therefore not be read only through the lens of model scale or data scale. The deeper issue is state representation: how much task-relevant state is available to the policy at test time, and how much is left implicit in parameters learned from training? The central challenge is to expose more of that state through policy context and input, thereby shrinking the residual information that would otherwise be absorbed into the parameters. The rest of the post makes that argument precise.

This is not an argument against parameters carrying priors. They should. Parameters are exactly where reusable structure belongs: object semantics, generic affordances, common physical regularities, and the inference procedure that turns observations into useful internal state. The failure mode is narrower. It appears when the correct action depends on instance-specific or deployment-specific state at test time, but that state is absent from the policy context, so the model has to substitute a fixed training-distribution prior.

A simple example makes the distinction concrete. Suppose a robot sees a mug and receives the instruction "pick it up." From the current image and instruction alone, two worlds may be compatible: the mug is empty and light, or it is filled and heavy. If the training set mostly contains empty mugs, a reactive policy may learn an empty-mug prior and choose a fast, light grasp. In a new home, that prior can break. A better policy would use additional context, interaction, or memory to infer the relevant state; if it still cannot infer the state, it should act in a way that respects the remaining uncertainty rather than collapsing to the most common training case.

## The core bottleneck

The central bottleneck is a mismatch between the state needed for control and the state available to the policy. At a high level, current embodied policies are usually written as

$$
\pi(a \mid o, t; \theta),
$$

where $a$ is the action, $o$ is the observation, $t$ is the task specification, and $\theta$ are the policy parameters.

This notation hides the core problem: the correct action often depends on more than $(o, t)$. The robot may need information that is not visually obvious, not specified in language, or not recoverable from the current policy input. Examples include object mass, friction, occluded pose, embodiment-specific dynamics, or environment-specific factors such as drawer stiffness or calibration bias. Under the strict definition used below, only the unresolved component of such factors belongs to $Z$; if some part can already be inferred from the current input, that part is not part of $Z$.

To make that explicit, let $Z$ denote the residual task-relevant information that is not inferable from the current policy input $(o, t)$. Then the actual action-generating process is better written as

$$
a^* \sim p(a \mid o, t, Z).
$$

As the policy context becomes richer, this residual can shrink. The design problem is therefore not to eliminate latent state in the abstract, but to reduce how much necessary information remains outside the policy input.

It helps to separate several kinds of missing state, because they call for different fixes:

- Scene state: occluded poses, object locations, containment, support relations, and other facts about the current environment.
- Physical parameters: mass, friction, compliance, drawer stiffness, contact state, and other factors that often require interaction or history.
- Embodiment and control state: kinematics, calibration, latency, action scaling, gripper condition, and low-level controller behavior.
- Task and intent state: underspecified goals, user preferences, success criteria, and constraints not fully captured by a short instruction.

So the real question is not only whether the policy is large enough, but whether $(o, t)$ is a sufficient information state for action selection.

This has a close relation to the classical POMDP belief-state view, where the right control object is not the latest observation alone but an information state: a sufficient statistic of the action-observation history. For finite POMDPs, that information state is the belief state, the posterior over latent world state induced by the history.[^pomdp] Under that language, the $Z$ in this post is not the full hidden state itself, nor merely any partially observed factor. It is the strictly residual portion of task-relevant latent state that remains unresolved if the policy is forced to condition only on the restricted interface $(o, t)$. Once the effective policy context becomes richer, the problem moves closer to belief-state control over a richer latent state representation.[^dvrl][^planet][^dreamer]

## A simple formulation of the hypothesis

This intuition can be stated as a residual-information claim. Let $O$, $T$, $A^*$, and $Z$ denote the corresponding random variables. In this post, $Z$ is defined as task-relevant information that cannot be inferred from the current policy input, so

$$
I(Z; O, T) = 0.
$$

The input $(O, T)$ is insufficient if the optimal action still depends on that residual information, i.e.

$$
I(A^*; Z \mid O, T) > 0,
$$

These two conditions together say that even after observing the current image and task instruction, there remains action-critical information outside the policy context.

If we additionally assume the expert action is determined once the full state is known, i.e.

$$
H(A^* \mid O, T, Z) = 0,
$$

then the same point can be written as

$$
H(A^* \mid O, T) > 0.
$$

Under that assumption, there is still unresolved action uncertainty after conditioning only on observation and task specification.

Suppose the policy is trained by empirical risk minimization:

$$
\hat{\theta} = \arg\min_{\theta} \; \mathbb{E}_{(o,t,a) \sim P_{\mathrm{tr}}}\left[\ell\big(\pi_{\theta}(o,t), a\big)\right].
$$

If $Z$ is residual non-inferable state by construction, then the learned policy can only absorb its effect through the training prior $P_{\mathrm{tr}}(Z)$. In other words, ERM learns under a prior over the missing state rather than from state represented explicitly in context. The Bayes-optimal policy under the training distribution is therefore

$$
\pi^*_{\mathrm{tr}}(a \mid o, t)
= \int p(a \mid o, t, Z) \, P_{\mathrm{tr}}(dZ).
$$

This immediately produces two failure modes, depending on what the training prior does to the missing state.

### 1) Low-diversity regime: missing state gets absorbed into $\theta$

If the training prior over the missing state is narrow, then the latent state is nearly fixed under the training distribution:

$$
P_{\mathrm{tr}}(Z) \approx \delta\big(Z - Z_0\big).
$$

Then the learned policy effectively becomes

$$
\pi^*_{\mathrm{tr}}(a \mid o, t) \approx p(a \mid o, t, Z_0).
$$

Low-diversity data does not solve the hidden-state problem; it only hides the missing state behind a training-specific prior. The policy can perform well in-distribution, but only because the missing information has effectively been absorbed into the parameters. This is what I mean by state being hardcoded instead of represented in context.

At deployment, if

$$
P_{\mathrm{te}}(Z) \neq P_{\mathrm{tr}}(Z),
$$

the policy carries the wrong implicit prior over the missing state, and performance degrades.

### 2) High-diversity regime: unresolved state is exposed rather than hidden

If the training prior is broad, then many different latent states remain compatible with the same $(o, t)$. In that case the ambiguity can no longer be hidden inside a narrow prior. Broad training coverage exposes the ambiguity instead of concealing it. What happens next depends on the action model.

If the policy head is deterministic or effectively unimodal under squared loss, one common failure mode is to average over incompatible action modes. For example, under squared loss the optimal predictor is

$$
\pi^*(o, t) = \mathbb{E}[A^* \mid O=o, T=t].
$$

If $A^*$ is multimodal given $(o, t)$, this conditional mean may correspond to no valid strategy at all. The irreducible error is

$$
\inf_f \mathbb{E}\big[\|A^* - f(O,T)\|^2\big]
= \mathbb{E}\big[\mathrm{Var}(A^* \mid O,T)\big].
$$

That is one important failure mode, but it is not the only one. Modern VLAs often use stochastic multimodal heads, including diffusion- or flow-matching-based action models, so they need not collapse to a single conditional mean. Those heads can preserve a richer action distribution, which is genuinely better. But if the policy still lacks the context needed to infer which latent state is currently true, then it is still acting under a marginal over unresolved hidden states. Sampling from that marginal can avoid mean-action artifacts without actually resolving the latent-state uncertainty; when different latent states require incompatible committed strategies, performance can still become brittle, inconsistent, or dependent on lucky sampling.

So when the training prior is diverse enough but the input still lacks the needed state, the model may not overfit to one hidden assumption. Instead, the hidden-state problem reappears as posterior mixing: deterministic heads average across incompatible hidden states, while stochastic multimodal heads preserve uncertainty but still do not know which latent hypothesis is correct.

The implication is direct: if the correct action still depends on residual information $Z$ that is independent of $(O, T)$, then scaling a reactive policy is not enough. The design goal is to shrink that residual by bringing more necessary information into context, and to represent uncertainty over whatever residual still remains. That is exactly why the argument here emphasizes two first-order requirements: expose as much task-relevant state as possible through policy context, and use training data broad enough across tasks, environments, and embodiments to prevent the remaining residual from collapsing into a brittle prior. When even that is not enough, the action model must preserve the residual uncertainty without pretending the hidden state has already been resolved.

## How recent progress fits this picture

Under this lens, recent progress is much less mysterious. None of the current papers directly measures the decomposition I care about, namely how much task-relevant state is available in context and how much is left implicit in the parameters. So the evidence is indirect. But the hypothesis does make concrete predictions, and the literature is easier to read when organized around those predictions:

1. Generalization should improve when richer observations, prompts, memory, or feedback move more necessary information out of the residual $Z$ and into the policy's effective information state at test time.
2. Generalization should also improve when training data is diverse enough to cover more of the residual variation, so that the policy cannot rely on one narrow hidden prior.
3. When some residual uncertainty remains after better context and broader coverage, action models that preserve multiple plausible continuations should be better behaved than heads that force one default action.

The third point is downstream of the first two. Multimodal action heads are not substitutes for representing or inferring latent state. They are useful once the policy has made as much task-relevant state available as the context permits, and some ambiguity still remains.

### Prediction 1: richer information state improves transfer

- PerAct[^peract] is one of the clearest early pieces of evidence that richer state representation matters. It replaces unstructured image-to-action prediction with language-conditioned RGB-D voxel observations and reports large gains over both unstructured image-to-action agents and 3D ConvNet baselines. Read through the present lens, the key result is that making 3D task structure more explicit in the policy input improves manipulation generalization.
- RVT[^rvt] sharpens the same point. It argues that explicit 3D representations outperform camera-image-only approaches for manipulation, and reports 26% higher relative success than PerAct across 18 RLBench tasks and 249 variations. This is exactly the kind of evidence one would expect if better spatial state in context matters.
- VIMA[^vima] extends the argument from spatial structure to task specification. It treats language instructions, visual goals, and one-shot demonstrations as multimodal prompts and reports up to $2.9\times$ higher task success in the hardest zero-shot generalization setting given the same training data. That is strong evidence that richer prompting context can substitute for task information that would otherwise have to be guessed.
- SayCan[^saycan] and Inner Monologue[^inner] make the role of contextual grounding even more explicit. SayCan improves planning by combining language-model semantics with affordance estimates from the robot's current state, and PaLM-SayCan reports 84% planning success and 74% execution success on 101 tasks. Inner Monologue[^inner] then shows that feeding back scene descriptions, success signals, and human interaction into the prompt significantly improves long-horizon instruction completion. These works directly support the claim that more task-relevant state should be routed through context rather than left implicit.
- PaLM-E[^palme] matters here because it explicitly interleaves language, visual observations, and continuous state estimates in one embodied model. That is a clean example of enriching the policy context itself rather than only improving the prior baked into the parameters.

RT-2[^rt2] and the $\pi_0/\pi_{0.5}$[^pi0][^pi05] line are more ambiguous evidence for this first claim. Their gains likely combine two mechanisms: better semantic priors from large-scale pretraining, and richer effective context through multimodal prompting and auxiliary supervision. I therefore do not read them as the cleanest proof that task-relevant state has been moved into context. Rather, they are boundary cases showing that modern VLAs often improve by mixing both strategies at once.

Taken together, these results support the first prediction: if richer observation, language, geometry, memory, or feedback makes more necessary information explicit in the policy's information state, then the residual $Z$ becomes smaller and generalization improves.

### Prediction 2: broader coverage reduces narrow priors over the residual

The cleanest evidence for this claim comes from systems whose robustness improves under broader fixed-policy coverage. A second, related line shows that broad coverage also makes later adaptation lighter and more reliable, but those two claims should not be conflated.

- RT-1[^rt1] already suggested that data size, model size, and especially data diversity are central variables for robotic generalization. Through the present lens, its importance is that broader task coverage reduces the need for the model to rely on one narrow hidden prior.
- Open X-Embodiment[^openx] made this concrete by standardizing a large cross-institution corpus with 22 robots, 21 institutions, 527 skills, and 160,266 tasks, and by showing positive transfer across platforms. The relevant point is not just scale in the abstract, but coverage over more embodiments, scenes, and control regimes.
- OpenVLA[^openvla] is a strong direct example in this bucket: it trains on 970k real-world demonstrations and reports strong multi-embodiment generalization, outperforming RT-2-X by 16.5% absolute task success across 29 tasks and multiple robot embodiments.
- BridgeData V2[^bridgev2] and DROID[^droid] sharpen the environment side of the argument. BridgeData V2 was explicitly collected to support broad generalization across tasks, objects, and environments. DROID adds 76k trajectories, 350 hours, 564 scenes, and 86 tasks, and reports that co-training with DROID improves average success by 22% in-distribution and 17% OOD over the next best comparison. This matters because deployment failures often come from state factors that were simply absent from narrow lab data.
- Again, $\pi_{0.5}$[^pi05] gives direct supporting evidence: its ablations argue that web data matters most for OOD object generalization, while multi-environment and cross-embodiment robot data are important across evaluation conditions. Its scaling study further shows that performance rises steadily with the number of distinct training environments and approaches a baseline trained directly on test environments after roughly 100 homes.

Taken together, these results support the second prediction: if deployment spans residual variation that training never covered, then the policy can only succeed by relying on brittle hidden assumptions in its parameters. Broader training data helps precisely because it weakens those assumptions by forcing the policy to survive more embodiments, scenes, object sets, and control regimes.

A related but narrower line includes RoboCat, Octo, and Dobb-E.[^robocat][^octo][^dobbe] These are not the cleanest evidence for out-of-the-box fixed-policy generalization. They support a different claim: when broad heterogeneous experience does not fully solve the residual-state problem, it can still make downstream adaptation to a new robot or home much lighter, because the model starts from a prior that has already seen more of the relevant variation.

### 3) Why out-of-the-box deployment does not refute the hypothesis

$\pi_{0.5}$[^pi05] is useful precisely because it looks, at first glance, like a counterexample. One might read its new-home deployment results as evidence against the claim that current models overfit hidden assumptions. But under the current hypothesis, it should be read as support, not contradiction: success can occur when the training recipe both shrinks the residual that remains outside the policy context and broadens coverage over the variation that still remains. This is a different claim from the adaptation-heavy evidence above: here the point is fixed-policy deployment under shift, not merely faster finetuning.

- If a model can deploy out of the box in a new home, that does not mean residual task-critical information has become irrelevant.
- It suggests the training recipe gave the model enough semantic, visual, and cross-environment evidence that less task-critical information remained outside the policy context at test time.
- In that sense, out-of-the-box success is not a refutation of the hypothesis. It is the kind of outcome the hypothesis predicts when the residual becomes smaller and when the prior over what remains is broad enough to survive shift.[^pi05]

### Prediction 3: residual uncertainty needs expressive action models

Even if richer context and broader coverage are the first two levers, they do not make residual uncertainty disappear. Some latent factors will remain partially or temporarily unresolved at decision time, especially under contact, occlusion, embodiment mismatch, or limited sensing. In that regime the action model still matters, because the policy must act under uncertainty rather than pretend the hidden state has already been identified.

The evidence here is more indirect than in the previous two sections, but there are still concrete results worth noting:

- Diffusion Policy[^diffusion] is the clearest evidence that expressive action-distribution modeling matters in robotics. It replaces simpler action prediction schemes with action diffusion and reports a 46.9% average improvement in its benchmark setting. That does not prove the gain comes specifically from unresolved latent state, but it does show that preserving richer action uncertainty can materially help control.
- Behavior Transformer (BeT)[^bet] provides a second concrete example from imitation learning. It is designed to capture multiple action modes in continuous control and reports significant improvement over prior work while explicitly modeling the major modes present in demonstrated behavior. This again does not isolate residual $Z$ as the causal variable, but it does support the narrower claim that multimodal action modeling matters when one-step behavior is not well captured by a single default action.
- The $\pi_0$[^pi0] line points in the same direction from the VLA side. Instead of treating control as point prediction, $\pi_0$ uses a flow-matching action model for continuous robot control. Again, this is not a clean causal ablation on residual $Z$, but it is consistent with the claim that expressive stochastic heads are a better fit when the mapping from context to action remains ambiguous.
- Read together, these results support a narrower claim than the first two predictions: once some uncertainty survives richer context and broader coverage, action models that preserve multiple plausible continuations are often a better fit than heads that force a single default output.

So I do not treat this evidence as being as direct as the first two sections. I treat it as a downstream modeling implication of the same argument. Better action heads do not remove the need to represent or infer the relevant latent state in the first place. But once one accepts that some residual uncertainty will remain even after richer context and broader coverage, stochastic multimodal action models become a principled design choice rather than a cosmetic modeling preference.

## Why current models still fail

These failures are not edge cases. They are the predictable consequence of acting on incomplete state with mismatched coverage. Despite recent progress, five breakdowns remain common:

1. Partial observability: single-view snapshots miss task-critical latent state.
2. Shortcut learning: models overfit to background, camera pose, or embodiment-specific priors.
3. Embodiment mismatch: action spaces and dynamics differ across robots.
4. Sparse long-horizon supervision: many trajectories contain weak credit assignment for planning decisions.
5. Evaluation leakage: train and test distributions are often closer than expected.

None of these failure modes is surprising under this view. They all appear when too much task-critical information still remains in the residual rather than being made available in context.

## A practical recipe for a more generalizable embodied model

Once the bottleneck is stated this way, the design target changes. The goal is not merely to predict the next action, but to construct a better information state for control: enough task-relevant state should be available to the policy that as little necessary information as possible remains in the residual.

Formally, let

$$
X_i = (o_{1:i}, a_{1:i-1}, t, e)
$$

denote the richer policy context built from observation history, action history, task specification, and embodiment metadata. A practical policy should maintain a belief over latent task state $S_i$ conditioned on that richer context:

$$
b_i = p(S_i \mid X_i), \quad a_i \sim \pi(a_i \mid b_i)
$$

This is intentionally different from the earlier $Z$. There, $Z$ was defined relative to a minimal reactive input $(o, t)$ and captured whatever task-relevant information was still missing from that limited context. Once the effective input is expanded to $X_i$, some of that previously missing information becomes inferable from history and embodiment metadata. The remaining residual after conditioning on $X_i$ should be smaller. Whatever still cannot be inferred even from this richer context should then be handled as residual uncertainty, not silently collapsed into one default action.

This is also the lens under which several modern latent-state methods become relevant. DVRL[^dvrl] explicitly learns belief-like latent representations for POMDP control. PlaNet[^planet] and Dreamer[^dreamer] learn latent dynamics models from high-dimensional observations and plan or optimize behavior in that latent state space. UP-OSI[^uposi] and VariBAD[^varibad] are especially relevant to the present argument because they infer hidden dynamics or task variables online instead of forcing the policy to bury those factors inside a fixed parameter prior.

This view suggests six concrete design commitments:

1. Rich state evidence as context: use temporal observation windows, multi-view sensing where possible, and persistent memory features instead of single-frame policies, so that the architecture can actually consume scene state, physical parameters, and task context when they matter.

2. Explicit embodiment conditioning: provide robot metadata and action-space adapters so one policy can map shared intent into embodiment-specific commands.

3. Broad and balanced data mixture: mix cross-embodiment datasets (Open X style) with in-the-wild scene diversity (DROID/Bridge style), so coverage grows across tasks, environments, and robot morphologies, then rebalance to avoid dominance by a few easy domains.

4. Two-stage training: Stage A is broad pretraining for transferable representations. Stage B is targeted adaptation for deployment embodiments and control stacks.

5. Uncertainty-aware action head: after enriching the information state and broadening coverage, use action modeling that handles multimodality and residual ambiguity, such as diffusion- or flow-matching-style heads, when precision and recovery matter.

6. Evaluation by shift axes, not only aggregate score: report separately on unseen objects, unseen layouts, unseen embodiments, and long-horizon composition, since real generalization must be measured across task, environment, and embodiment shift.

## Final view

To build a truly generalizable embodied model, the first two requirements are clear: an architecture that admits enough context to make the residual task-critical information as small as possible, and training data diverse enough across tasks, environments, and embodiments to keep the remaining residual from collapsing into a single training prior. When some ambiguity still cannot be removed, the action model should then preserve that uncertainty rather than collapse it.

If the correct action still depends on residual task-critical information after conditioning on $(o, t)$, then generalization cannot be solved by scale alone. The central question is how much necessary information remains outside the policy context and how much still has to be supplied by fixed assumptions in the parameters. A robust policy must either expose more of that information through context, or explicitly represent uncertainty over what still remains hidden.

That, to me, is the real lesson of recent VLAs: progress comes not just from bigger models, but first from shrinking the residual task-critical information that must be carried by hardcoded assumptions and broadening coverage over whatever residual still remains, and then, when ambiguity is unavoidable, from refusing to collapse it into a single brittle action.


References
----

[^rt1]: Anthony Brohan et al. "RT-1: Robotics Transformer for Real-World Control at Scale". arXiv 2022. https://arxiv.org/abs/2212.06817

[^saycan]: Michael Ahn et al. "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances". arXiv 2022. https://arxiv.org/abs/2204.01691

[^inner]: Wenlong Huang et al. "Inner Monologue: Embodied Reasoning through Planning with Language Models". arXiv 2022. https://arxiv.org/abs/2207.05608

[^peract]: Mohit Shridhar et al. "Perceiver-Actor: A Multi-Task Transformer for Robotic Manipulation". CoRL 2022. https://arxiv.org/abs/2209.05451

[^vima]: Yunfan Jiang et al. "VIMA: General Robot Manipulation with Multimodal Prompts". arXiv 2022 / ICML 2023. https://arxiv.org/abs/2210.03094

[^palme]: Danny Driess et al. "PaLM-E: An Embodied Multimodal Language Model". arXiv 2023. https://arxiv.org/abs/2303.03378

[^rvt]: Ankit Goyal et al. "RVT: Robotic View Transformer for 3D Object Manipulation". arXiv 2023. https://arxiv.org/abs/2306.14896

[^robocat]: Konstantinos Bousmalis et al. "RoboCat: A Self-Improving Generalist Agent for Robotic Manipulation". arXiv 2023 / TMLR 2023. https://arxiv.org/abs/2306.11706

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

[^bet]: Nur Muhammad Mahi Shafiullah et al. "Behavior Transformers: Cloning $k$ Modes with One Stone". arXiv 2022. https://arxiv.org/abs/2206.11251

[^pomdp]: Leslie Pack Kaelbling, Michael L. Littman, and Anthony R. Cassandra. "Planning and Acting in Partially Observable Stochastic Domains". Artificial Intelligence 1998. https://doi.org/10.1016/S0004-3702(98)00023-X

[^dvrl]: Maximilian Igl et al. "Deep Variational Reinforcement Learning for POMDPs". arXiv 2018. https://arxiv.org/abs/1806.02426

[^planet]: Danijar Hafner et al. "Learning Latent Dynamics for Planning from Pixels". arXiv 2019. https://arxiv.org/abs/1811.04551

[^dreamer]: Danijar Hafner et al. "Dream to Control: Learning Behaviors by Latent Imagination". arXiv 2020. https://arxiv.org/abs/1912.01603

[^uposi]: Wenhao Yu et al. "Preparing for the Unknown: Learning a Universal Policy with Online System Identification". RSS 2017. https://arxiv.org/abs/1702.02453

[^varibad]: Luisa Zintgraf et al. "VariBAD: A Very Good Method for Bayes-Adaptive Deep RL via Meta-Learning". ICLR 2020. https://arxiv.org/abs/1910.08348
