---
layout: post
title: "The Essence of Bayesian Flow Networks"
---

For easy understanding, the reader can treat the variables as discrete variables. Without loss of generality, the formulation can be easily extended to continuous variables by swapping the summation with integration.
This section reviews the essence of Bayesian Flow Networks (BFN){% cite graves2023bayesian austin2021structured --file references %} in a more simple language, there is a defined noisy channel $q(\cdot|\rx; \omega)$, through which a variable $\rx$ leaks it's information $\rz_i \sim q(\cdot|\rx; \omega)$. An observer then receives the leaked information and updates its belief about the variable $\rx$ through Bayesian update and obtain a belief about $\rx$: $p(\rx|\rz_{1:n})$. 

In a bits-back coding scheme, the total nats required to transfer $\rx$ with $\rz_{1:n}$ as intermediate latent is $-\log p(\rz_{1:n}) - \log p(\rx|\rz_{1:n})$ with $-\log q(\rz_{1:n}| \rx)$ nats put back, so the expected marginal nats required to transfer data from $p(\rx)$ is:
\begin{align}
   &\mathbb{E}_{p(\rx)}\mathbb{E}_{q(\rz_{1:n}|\rx; \omega)} \left[ -\log p(\rz_{1:n}) - \log p(\rx|\rz_{1:n}) + \log q(\rz_{1:n}|\rx; \omega) \right] \nonumber\\
   &= \mathbb{E}_{p(\rx)}\left[\mathbb{E}_{q(\rz_{1:n}|\rx; \omega)}\log \frac{q(\rz_{1:n}|\rx; \omega)}{p(\rz_{1:n})} - \mathbb{E}_{q(\rz_{1:n}|\rx; \omega)} \log p(\rx|\rz_{1:n}) \right] = -\mathtt{VLB} \nonumber\\
   &= \mathbb{E}_{p(\rx)} \left[ \KL(q(\rz_{1:n}|\rx; \omega) || p(\rz_{1:n})) - \mathbb{E}_{q(\rz_{1:n}|\rx; \omega)} \log p(\rx|\rz_{1:n}) \right] \label{eq:nvlb}
\end{align}

With the conditional distribution of the noisy channel $q(\rz_{1:n}|\rx)$ and a series of observed variables $\rz_{1:n}$, following bayesian update rule, the udpated belief of the variable $\rx$ is:
\begin{align}
    q(\rx|\rz_{1:n}) = \frac{q(\rz_{1:n}|\rx)q(\rx)}{\sum_{\rx}q(\rz_{1:n}|\rx)q(\rx)}
\end{align}
% $q(\rx|\rz_{1:i}); i\in \{1, \cdots, n \}$ is dubbed as the \textit{bayesian flow} as the belief of $\rx$ changes with more information $\rz_i$ observed.

There could be sparsity problem or curse of dimensionality problem when the variable $\rx$ is high-dimensional. 
Thus $m$-dimensional $\rx$ is treated as $m$ independent variables, and updated independently with bayesian update rule. 
To model the interdependence between variables, an neural network is introduced to rectify the posterior distribution $q(\cdot|\rz_{1:n}; \vtheta^{(1)}, \cdots, \vtheta^{(m)})$, where $\vtheta^{(i)}$ is the governing parameter of the posterior distribution of the $i$-th component and determined by $\rz_{1:n}$.
\begin{align}
   p_\vphi(\cdot | \rz_{1:n}) &= f_\vphi( q(\cdot|\rz_{1:n}; \vtheta^{(1)}, \cdots, \vtheta^{(m)})) \label{eq:nn} \\ 
   & = f_\vphi(\vtheta^{(1)}, \cdots, \vtheta^{(m)})\label{eq:network}
\end{align}

Without knowing $\rx$, variables $\{\rz_1, \rz_1, \cdots, \rz_n \}$ are correlated variables, $p(\rz_{1:n})$ in Eq. \ref{eq:nvlb} is then factorized autoregressively as $p(\rz_{1:n}) = p(\rz_1)\prod_{i=2}^n p(\rz_i|\rz_{1:i-1})$, and further parameterized combining the output distribution $p_\vphi$ from the neural network in Eq. \ref{eq:nn}:
\begin{align}
    p(\rz_{1:n}) &= p(\rz_1)\prod_{i=2}^n p(\rz_i|\rz_{1:i-1})  \nonumber\\
    &= \left(\sum_{\rx}q(\rz_1|\rx)p_\vphi(\rx|\rz_{\emptyset})\right)\prod_{i=2}^n \sum_{\rx}q(\rz_i|\rx)p_\vphi(\rx|\rz_{1:i-1}) \nonumber \\
    &\defeq \prod_{i=1}^n p_{\smallR}(\rz_i|\rz_{1:i-1}; \vphi) \label{eq:receiver}
\end{align}

Plug Eq. \ref{eq:receiver} and Eq. \ref{eq:nn} into Eq. \ref{eq:nvlb}, the $-\mathtt{VLB}(\vphi)$ is then:
\begin{align}
   -\mathtt{VLB}(\vphi) = \mathbb{E}_{p(\rx)} \left[ \sum_{i=1}^{n}\KL(q(\rz_i|\rx; \omega) || p_{\smallR}(\rz_i|\rz_{1:i-1}; \vphi)) - \mathbb{E}_{q(\rz_{1:n}|\rx; \omega)} \log p_\vphi(\rx|\rz_{1:n}) \right] \label{eq:phi-nvlb}
\end{align}

The $-\mathtt{VLB}(\vphi)$ is the expected marginal nats required to transfer a data from $p(\rx)$, with the transmission system parameterized by $\vphi$. 
The objective is to minimize the transmission cost, and the model is trained by minimizing the $-\mathtt{VLB}(\vphi)$.

----------
{% bibliography --cited_in_order %}