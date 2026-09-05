---
layout: page
title: About me
permalink: /
---

<style>
  .about-intro {
    display: flex;
    align-items: flex-start;
    gap: 2em;
    margin-bottom: 2em;
    flex-wrap: wrap;
  }

  .about-intro-sidebar {
    flex: 0 1 200px;
    width: 100%;
    max-width: 200px;
  }

  .about-intro-main {
    flex: 1 1 320px;
    min-width: 0;
  }

  @media (max-width: 640px) {
    .about-intro {
      gap: 1.25em;
    }

    .about-intro-sidebar {
      max-width: none;
    }
  }
</style>

<div class="about-intro">
  <div class="about-intro-sidebar">
    <img src="/images/profile.jpg" alt="Jingjing Gong" style="width: 100%; border-radius: 10px; margin-bottom: 1em;">
    
    <div style="font-size: 0.9em; line-height: 1.6;">
      <p style="margin: 0.5em 0;"><strong>Position:</strong><br>Assistant Professor</p>
      <p style="margin: 0.5em 0;"><strong>Affiliation:</strong><br>Shanghai Innovation Institute</p>
      <p style="margin: 0.5em 0;"><strong>Email:</strong><br>jjgongjj+wk[AT]gmail.com</p>
      <!-- <p style="margin: 0.5em 0;">
        <strong>Links:</strong><br>
        <a href="https://scholar.google.com/citations?user=YOUR_ID">Google Scholar</a><br>
        <a href="https://github.com/jingjing-gong">GitHub</a>&nbsp;|&nbsp;
        <a href="https://www.twitter.com/JingjingGong_">Twitter</a>
      </p> -->
    </div>
  </div>
  <div class="about-intro-main">
    <p>I am an Assistant Professor at the <a href="https://www.sii.edu.cn/">Shanghai Innovation Institute</a>, where my research explores the cutting edge of Embodied AI. My primary goal is to push the frontiers of multimodal large models into the physical world, bridging the gap between digital intelligence and physical interaction. My research interests span Machine Learning (ML), Reinforcement Learning (RL) and Natural Language Processing (NLP), with a particular focus on Large Language Models (LLMs). Additionally, I have a deep passion for advanced Generative Models, including Diffusion Models, Flow Matching, and Bayesian Flow Networks. My current work focuses especially on cross-embodiment, cross-scenario, and compositional generalization in embodied models, as well as the development and evolution of embodied agent systems.</p>
    
    <p>Before joining the Institute, I was a Postdoctoral Fellow at the <a href="https://air.tsinghua.edu.cn/en/">Institute for AI Industrial Research, Tsinghua University</a>, working with <a href="https://scholar.google.com/citations?user=SToCbu8AAAAJ&hl=en">Prof. Weiying Ma</a> and <a href="https://zhouh.github.io">Prof. Hao Zhou</a>, focusing on bio-molecular generative models. I obtained my Ph.D. from <a href="http://www.fudan.edu.cn/en/">Fudan University</a>, advised by <a href="https://xpqiu.github.io/en.html">Prof. Xipeng Qiu</a> and <a href="https://xuanjing-huang.github.io">Prof. Xuanjing Huang</a>, where my work concentrated on Natural Language Processing (NLP). I have served as reviewer for top-tier conferences including <a href="https://neurips.cc">NeurIPS</a>, <a href="https://icml.cc">ICML</a>, <a href="https://iclr.cc">ICLR</a>, <a href="https://aclweb.org/">ACL</a>, <a href="https://2025.emnlp.org/">EMNLP</a> and <a href="https://aaai.org/">AAAI</a>, and was honored to serve as Area Chair for ICLR and NeurIPS.</p>
    
    <p>Feel free to reach out to me if you are interested in building cool things together!</p>
  </div>
</div>

---

## News
- **[Sep 2026]** "[CoRE-VLA: Towards Scalable and Robust Vision-Language-Action Modeling via Conditional Routing of Experts](https://openreview.net/forum?id=qKU6lifnPU)" was accepted at CoRL 2026.
- **[Sep 2026]** "[Coarse-to-Control: Action-Token Planning for Vision-Language-Action Models](https://openreview.net/forum?id=tegLlXBRCU)" was accepted at CoRL 2026.
- **[Sep 2026]** "[ActionCodec: What Makes for Good Action Tokenizers](https://openreview.net/forum?id=wRLEgpRnVR)" was accepted at CoRL 2026.
- **[May 2026]** "[Learning to Move Before Learning to Do: Task-Agnostic Pretraining for VLAs](https://icml.cc/virtual/2026/poster/64730)" was accepted at ICML 2026.
- **[May 2026]** "[HiMe: Hierarchical Embodied Memory for Long-Horizon Vision-Language-Action Control](https://icml.cc/virtual/2026/poster/60897)" was accepted at ICML 2026.
- **[Feb 2026]** "[SRPO: Self-Referential Policy Optimization for Vision-Language-Action Models](https://openaccess.thecvf.com/content/CVPR2026/html/Fei_SRPO_Self-Referential_Policy_Optimization_for_Vision-Language-Action_Models_CVPR_2026_paper.html)" was accepted at CVPR 2026.
- **[Feb 2026]** "[Libero-Plus: A Progressive Robustness Benchmark for Vision-Language-Action Models](https://openaccess.thecvf.com/content/CVPR2026/html/Fei_LIBERO-Plus_A_Progressive_Robustness_Benchmark_for_Visual-Language-Action_Models_CVPR_2026_paper.html)" was accepted at CVPR 2026.
- **[Jan 2026]** "[FASTer: Toward Powerful and Efficient Autoregressive Vision–Language–Action Models with Learnable Action Tokenizer and Block-wise Decoding](https://openreview.net/forum?id=k6nTUFoqeT)" was accepted at ICLR 2026.
- **[May 2025]** "[Steering Protein Family Design Through Profile Bayesian Flow](https://openreview.net/forum?id=PSiijdQjNU)" was accepted at ICLR 2025 as an Oral Presentation.

---

## Selected Publications

### 2026

1. **[CoRE-VLA: Towards Scalable and Robust Vision-Language-Action Modeling via Conditional Routing of Experts](https://openreview.net/forum?id=qKU6lifnPU)**<br>
  *Haozhe Zhang, Sixian Li, Yifei Zhang, Zezheng Huai, Hao Chen, Chunhua Shen, Jingjing Gong, Xipeng Qiu*<br>
  CoRL 2026

2. **[Coarse-to-Control: Action-Token Planning for Vision-Language-Action Models](https://openreview.net/forum?id=tegLlXBRCU)**<br>
  *Jinhao Wu, Shiduo Zhang, Yicheng Liu, Xiaopeng Yu, Sixian Li, Siyin Wang, Hang Zhao, Jingjing Gong, Xipeng Qiu*<br>
  CoRL 2026

3. **[ActionCodec: What Makes for Good Action Tokenizers](https://openreview.net/forum?id=wRLEgpRnVR)**<br>
  *Zibin Dong, Yicheng Liu, Shiduo Zhang, Baijun Ye, Yifu Yuan, Fei Ni, Jingjing Gong, Xipeng Qiu, Hang Zhao, Yinchuan Li, Jianye Hao*<br>
  CoRL 2026

4. **[HiMe: Hierarchical Embodied Memory for Long-Horizon Vision-Language-Action Control](https://icml.cc/virtual/2026/poster/60897)**<br>
  *Li Ji, Siyin Wang, Pengfang Qian, Xiaopeng Yu, Yihai Tian, Zhaoye Fei, Jingjing Gong, Xipeng Qiu*<br>
  ICML 2026

5. **[Learning to Move Before Learning to Do: Task-Agnostic Pretraining for VLAs](https://icml.cc/virtual/2026/poster/64730)**<br>
  *Junhao Shi, Siyin Wang, Xiaopeng Yu, Li Ji, Jingjing Gong, Xipeng Qiu*<br>
  ICML 2026

6. **[Libero-Plus: A Progressive Robustness Benchmark for Vision-Language-Action Models](https://openaccess.thecvf.com/content/CVPR2026/html/Fei_LIBERO-Plus_A_Progressive_Robustness_Benchmark_for_Visual-Language-Action_Models_CVPR_2026_paper.html)**<br>
  *Senyu Fei, Siyin Wang, Junhao Shi, Zihao Dai, Jikun Cai, Pengfang Qian, Li Ji, Xinzhe He, Shiduo Zhang, Zhaoye Fei, Jinlan Fu, Jingjing Gong, Xipeng Qiu*<br>
  CVPR 2026

7. **[SRPO: Self-Referential Policy Optimization for Vision-Language-Action Models](https://openaccess.thecvf.com/content/CVPR2026/html/Fei_SRPO_Self-Referential_Policy_Optimization_for_Vision-Language-Action_Models_CVPR_2026_paper.html)**<br>
  *Senyu Fei, Siyin Wang, Li Ji, Ao Li, Shiduo Zhang, Liming Liu, Jinlong Hou, Jingjing Gong, Xianzhong Zhao, Xipeng Qiu*<br>
  CVPR 2026

8. **[FASTer: Toward Powerful and Efficient Autoregressive Vision–Language–Action Models with Learnable Action Tokenizer and Block-wise Decoding](https://openreview.net/forum?id=k6nTUFoqeT)**<br>
  *Yicheng Liu, Shiduo Zhang, Zibin Dong, Baijun Ye, Tianyuan Yuan, Xiaopeng Yu, Linqi Yin, Chenhao Lu, Junhao Shi, Luca Jiang-Tao Yu, Liangtao Zheng, Jingjing Gong, Tao Jiang, Xipeng Qiu, Hang Zhao*<br>
  ICLR 2026

9. **[RoboOmni: Proactive Robot Manipulation in Omni-Modal Context](https://arxiv.org/abs/2510.23763)**<br>
  *Siyin Wang, Jinlan Fu, Feihong Liu, Xinzhe He, Huangxuan Wu, Junhao Shi, Kexin Huang, Zhaoye Fei, Jingjing Gong, Zuxuan Wu, Yu-Gang Jiang, See-Kiong Ng, Tat-Seng Chua, Xipeng Qiu*<br>
  ICLR 2026

### 2025

1. **[Steering Protein Family Design Through Profile Bayesian Flow](https://openreview.net/forum?id=PSiijdQjNU)**  
  *Jingjing Gong, Yu Pei, Siyu Long, Yuxuan Song, Zhe Zhang, Wenhao Huang, Ziyao Cao, Shuyi Zhang, Hao Zhou, Wei-Ying Ma*  
  ICLR 2025, **(Oral Presentation)**

2. **[A Periodic Bayesian Flow for Material Generation](https://openreview.net/forum?id=Lz0XW99tE0)**  
  *Hanlin Wu, Yuxuan Song, Jingjing Gong, Ziyao Cao, Yawen Ouyang, Jianbing Zhang, Hao Zhou, Wei-Ying Ma, Jingjing Liu*  
  ICLR 2025

3. **[Smooth Interpolation for Improved Discrete Graph Generative Models](https://proceedings.mlr.press/v267/song25f.html)**  
  *Yuxuan Song, Juntong Shi, Jingjing Gong, Minkai Xu, Stefano Ermon, Hao Zhou, Wei-Ying Ma*  
  ICML 2025

4. **[Accelerating 3D Molecule Generative Models with Trajectory Diagnosis](https://openreview.net/forum?id=ATewcZPbDj)**  
  *Zhilong Zhang, Yuxuan Song, Yichun Wang, Jingjing Gong, Hanlin Wu, Dongzhan Zhou, Hao Zhou, Wei-Ying Ma*  
  NeurIPS 2025

5. **[World-Aware Planning Narratives Enhance Large Vision-Language Model Planner](https://neurips.cc/virtual/2025/poster/116820)**  
  *Junhao Shi, Zhaoye Fei, Siyin Wang, Qipeng Guo, Jingjing Gong, Xipeng Qiu*  
  NeurIPS 2025

6. **[ShortListing Model: A Streamlined Simplex Diffusion for Discrete Variable Generation](https://openreview.net/forum?id=ZAu7sADxfh)**  
  *Yuxuan Song, Zhe Zhang, Yu Pei, Jingjing Gong, Qiying Yu, Zheng Zhang, Mingxuan Wang, Hao Zhou, Jingjing Liu, Wei-Ying Ma*  
  NeurIPS 2025, **(Poster)**

### 2024

1. **[MolCRAFT: Structure-Based Drug Design in Continuous Parameter Space](https://proceedings.mlr.press/v235/qu24a.html)**  
  *Yanru Qu, Keyue Qiu, Yuxuan Song, Jingjing Gong, Jiawei Han, Mingyue Zheng, Hao Zhou, Wei-Ying Ma*  
  ICML 2024

2. **[Unified Generative Modeling of 3D Molecules via Bayesian Flow Networks](https://arxiv.org/abs/2403.15441)**  
  *Yuxuan Song, Jingjing Gong, Hao Zhou, Mingyue Zheng, Jingjing Liu, Wei-Ying Ma*  
  ICLR 2024, **(Oral Presentation)**

### 2023

1. **[Equivariant Flow Matching with Hybrid Probability Transport for 3D Molecule Generation](http://papers.nips.cc/paper_files/paper/2023/hash/01d64478381c33e29ed611f1719f5a37-Abstract-Conference.html)**  
  *Yuxuan Song, Jingjing Gong, Minkai Xu, Ziyao Cao, Yanyan Lan, Stefano Ermon, Hao Zhou, Wei-Ying Ma*  
  NeurIPS 2023

2. **[Coarse-to-Fine: A Hierarchical Diffusion Model for Molecule Generation in 3D](https://proceedings.mlr.press/v202/qiang23a.html)**  
  *Bo Qiang, Yuxuan Song, Minkai Xu, Jingjing Gong, Bowen Gao, Hao Zhou, Wei-Ying Ma, Yanyan Lan*  
  ICML 2023
