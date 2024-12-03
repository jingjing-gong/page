---
layout: post
title: "The Essence of Bayesian Flow Networks"
---


For easy understanding, the reader can treat the variables as discrete variables. Without loss of generality, the formulation can be easily extended to continuous variables by swapping the summation with integration.
This section reviews the essence of Bayesian Flow Networks (BFN) {% cite graves2023bayesian --file references %} in a more simple language, there is a defined noisy channel $q(\cdot \mid \tx; \omega)$, through which a variable $\tx$ leaks it's information $\tz_i \sim q(\cdot \mid \tx; \omega)$. An observer then receives the leaked information and updates its belief about the variable $\tx$ through Bayesian update and obtain a belief about $\tx$: $p(\tx \mid \tz_{1:n})$. 

In a bits-back coding scheme, the total nats required to transfer $\tx$ with $\tz_{1:n}$ as intermediate latent is $-\log p(\tz_{1:n}) - \log p(\tx \mid \tz_{1:n})$ with $-\log q(\tz_{1:n} \mid \tx)$ nats put back, so the expected marginal nats required to transfer data from $p(\tx)$ is:

$$
\begin{align}
   &\bbE_{p(\tx)}\bbE_{q(\tz_{1:n} \mid \tx; \omega)} \left[ -\log p(\tz_{1:n}) - \log p(\tx \mid \tz_{1:n}) + \log q(\tz_{1:n} \mid \tx; \omega) \right] \nonumber\\
   &= \bbE_{p(\tx)}\left[\bbE_{q(\tz_{1:n} \mid \tx; \omega)}\log \frac{q(\tz_{1:n} \mid \tx; \omega)}{p(\tz_{1:n})} - \bbE_{q(\tz_{1:n} \mid \tx; \omega)} \log p(\tx \mid \tz_{1:n}) \right] = -\mathtt{VLB} \nonumber\\
   &= \bbE_{p(\tx)} \left[ \KL(q(\tz_{1:n} \mid \tx; \omega) \mid \mid p(\tz_{1:n})) - \bbE_{q(\tz_{1:n} \mid \tx; \omega)} \log p(\tx \mid \tz_{1:n}) \right] \label{eq:nvlb} 
\end{align}
$$

With the conditional distribution of the noisy channel $q(\tz_{1:n} \mid \tx)$ and a series of observed variables $\tz_{1:n}$, following bayesian update rule, the udpated belief of the variable $\tx$ is:

$$
\begin{align}
    q(\tx \mid \tz_{1:n}) = \frac{q(\tz_{1:n} \mid \tx)q(\tx)}{\sum_{\tx}q(\tz_{1:n} \mid \tx)q(\tx)}
\end{align}
% $q(\tx \mid \tz_{1:i}); i\in \{1, \cdots, n \}$ is dubbed as the *bayesian flow* as the belief of $\tx$ changes with more information $\tz_i$ observed.
$$

There could be sparsity problem or curse of dimensionality problem when the variable $\tx$ is high-dimensional. 
Thus $m$-dimensional $\tx$ is treated as $m$ independent variables, and updated independently with bayesian update rule. 
To model the interdependence between variables, an neural network is introduced to rectify the posterior distribution $q(\cdot \mid \tz_{1:n}; \btheta^{(1)}, \cdots, \btheta^{(m)})$, where $\btheta^{(i)}$ is the governing parameter of the posterior distribution of the $i$-th component and determined by $\tz_{1:n}$.

$$
\begin{align}
   p_\bphi(\cdot \mid \tz_{1:n}) &= f_\bphi( q(\cdot \mid \tz_{1:n}; \btheta^{(1)}, \cdots, \btheta^{(m)})) \label{eq:nn} \\ 
   & = f_\bphi(\btheta^{(1)}, \cdots, \btheta^{(m)})\label{eq:network}
\end{align}
$$

Without knowing $\tx$, variables $\{\tz_1, \tz_1, \cdots, \tz_n \}$ are correlated variables, $p(\tz_{1:n})$ in Eq. \eqref{eq:nvlb} is then factorized autoregressively as $p(\tz_{1:n}) = p(\tz_1)\prod_{i=2}^n p(\tz_i \mid \tz_{1:i-1})$, and further parameterized combining the output distribution $p_\bphi$ from the neural network in Eq. \eqref{eq:nn}:

$$
\begin{align}
    p(\tz_{1:n}) &= p(\tz_1)\prod_{i=2}^n p(\tz_i \mid \tz_{1:i-1}) \nonumber\\
    &= \left(\sum_{\tx}q(\tz_1 \mid \tx)p_\bphi(\tx \mid \tz_{\emptyset})\right)\prod_{i=2}^n \sum_{\tx}q(\tz_i \mid \tx)p_\bphi(\tx \mid \tz_{1:i-1}) \nonumber \\
    &\defeq \prod_{i=1}^n p_{\smallR}(\tz_i \mid \tz_{1:i-1}; \bphi) \label{eq:receiver}
\end{align}
$$

Plug Eq. \eqref{eq:receiver} and Eq. \eqref{eq:nn} into Eq. \eqref{eq:nvlb}, the $-\mathtt{VLB}(\bphi)$ is then:
$$
\begin{align}
   -\mathtt{VLB}(\bphi) = \bbE_{p(\tx)} \left[ \sum_{i=1}^{n}\KL(q(\tz_i \mid \tx; \omega) \mid \mid p_{\smallR}(\tz_i \mid \tz_{1:i-1}; \bphi)) - \bbE_{q(\tz_{1:n} \mid \tx; \omega)} \log p_\bphi(\tx \mid \tz_{1:n}) \right] \label{eq:phi-nvlb}
\end{align}
$$

The $-\mathtt{VLB}(\bphi)$ is the expected marginal nats required to transfer a data from $p(\tx)$, with the transmission system parameterized by $\bphi$. 
The objective is to minimize the transmission cost, and the model is trained by minimizing the $-\mathtt{VLB}(\bphi)$.

----------
{% bibliography --cited_in_order %}