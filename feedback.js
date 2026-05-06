// === Bench2Bytes Feedback System ===
// Injects rubric + Claude feedback prompts into every week card

const RUBRIC = {
    categories: [
        {
            name: "Scientific Rigor",
            weight: "30%",
            criteria: [
                "Biological question is clearly framed and relevant",
                "Dataset choice is justified and appropriate",
                "Results are interpreted with biological context, not just numbers",
                "Limitations and caveats are acknowledged"
            ]
        },
        {
            name: "Technical Execution",
            weight: "25%",
            criteria: [
                "Code runs without errors end-to-end",
                "Proper train/test split (no data leakage)",
                "Appropriate methods for the data type and question",
                "Results are reproducible (requirements.txt, random seeds)"
            ]
        },
        {
            name: "Communication",
            weight: "25%",
            criteria: [
                "README explains the project to both biologists and engineers",
                "Figures are publication-quality with proper labels and legends",
                "Code is organized and readable (even if AI-generated)",
                "Key findings are summarized in 3-5 bullet points"
            ]
        },
        {
            name: "Portfolio Impact",
            weight: "20%",
            criteria: [
                "Project demonstrates a skill relevant to bio+AI intersection",
                "Would be impressive in a job interview or on LinkedIn",
                "Shows YOUR domain expertise, not just generic ML",
                "Builds on or connects to your other projects"
            ]
        }
    ]
};

const PROJECT_PROMPTS = {
    w1: {
        name: "Dev Environment Setup",
        repo: "bench2bytes-workspace",
        prompt: `Review my GitHub repository for my first project in a bio+AI course. This is a development environment setup project where I configured Claude Code, created a CLAUDE.md, and built a Python project scaffold.

Please evaluate on these criteria (score each 1-5):

**Scientific Rigor (30%)**
- Is the CLAUDE.md biologically specific and useful?
- Does it set up good conventions for scientific computing?

**Technical Execution (25%)**
- Is the project structure clean and well-organized?
- Are dependencies properly specified?
- Is .gitignore appropriate (excluding data files, __pycache__, etc.)?

**Communication (25%)**
- Does the README explain what this workspace is for?
- Would another scientist be able to clone and start working?

**Portfolio Impact (20%)**
- Does it demonstrate good engineering practices?
- Is it a solid foundation for future projects?

Give me:
1. An overall score (1-5) with brief justification
2. Top 3 things done well
3. Top 3 things to improve (be specific — tell me exactly what to change)
4. One suggestion to make this project stand out more on my GitHub`
    },
    w2: {
        name: "Lab Data Processor",
        repo: "lab-data-processor",
        prompt: `Review my GitHub repository for a lab data processing tool I built. It processes plate reader data (96-well format), does QC (Z-factor, CV%), and fits dose-response curves with IC50 calculation.

Please evaluate on these criteria (score each 1-5):

**Scientific Rigor (30%)**
- Is the plate QC analysis statistically sound (Z-factor calculation, CV thresholds)?
- Is the dose-response fitting appropriate (4-parameter logistic / Hill equation)?
- Are edge cases handled (failed fits, outlier wells)?

**Technical Execution (25%)**
- Does the code run end-to-end without errors?
- Are functions modular and reusable?
- Is the IC50 calculation correct with proper confidence intervals?

**Communication (25%)**
- Does the README explain the biological context (what plate reader data is, why QC matters)?
- Are figures clear with proper axis labels and units?
- Would a lab scientist understand how to use this tool?

**Portfolio Impact (20%)**
- Does this demonstrate practical value for pharma/biotech?
- Would this impress a hiring manager at GSK or a biotech startup?

Give me:
1. An overall score (1-5) with brief justification
2. Top 3 things done well
3. Top 3 things to improve (be specific — tell me exactly what to change)
4. One suggestion to make this project stand out more`
    },
    w3: {
        name: "Gene Expression Explorer",
        repo: "gene-expression-explorer",
        prompt: `Review my GitHub repository for an RNA-seq gene expression analysis project. I loaded RNA-seq count data from GEO, performed EDA including normalization, PCA, volcano plots, and heatmaps of differentially expressed genes.

Please evaluate on these criteria (score each 1-5):

**Scientific Rigor (30%)**
- Is the normalization method appropriate for the data type?
- Is the PCA interpretation biologically meaningful?
- Are the DEG thresholds reasonable (log2FC and p-value cutoffs)?
- Are known biology patterns reflected in the results?

**Technical Execution (25%)**
- Is the data preprocessing pipeline correct (filtering, normalization)?
- Are statistical methods properly applied?
- Is the code reproducible (data download instructions, random seeds)?

**Communication (25%)**
- Does the README provide biological context for the dataset?
- Are figures publication-quality (labels, legends, color schemes)?
- Are key findings summarized clearly?

**Portfolio Impact (20%)**
- Does this show competence in genomics data analysis?
- Does it demonstrate biological insight beyond just running code?

Give me:
1. An overall score (1-5) with brief justification
2. Top 3 things done well
3. Top 3 things to improve
4. One suggestion to make this project stand out more`
    },
    w4: {
        name: "Toxicity Classifier",
        repo: "toxicity-classifier",
        prompt: `Review my GitHub repository for a compound toxicity classification project. I trained Logistic Regression, Random Forest, and XGBoost models to predict hepatotoxicity from molecular features, evaluated with AUC-ROC, and analyzed feature importance.

Please evaluate (score each 1-5):

**Scientific Rigor (30%)**
- Is the classification question well-framed biologically?
- Is class imbalance handled appropriately?
- Are the feature importance results biologically interpretable?
- Are model limitations discussed?

**Technical Execution (25%)**
- Is the train/test split stratified properly?
- Is cross-validation implemented correctly (no data leakage)?
- Are evaluation metrics appropriate (AUC-ROC for imbalanced data, not just accuracy)?
- Are models compared fairly?

**Communication (25%)**
- Are ROC curves, confusion matrices, and SHAP plots well-presented?
- Does the README explain what the model learned in biological terms?

**Portfolio Impact (20%)**
- Does this demonstrate the full ML classification workflow?
- Is there biological insight that goes beyond what an ML engineer could provide?

Give me: overall score (1-5), top 3 strengths, top 3 improvements, one standout suggestion.`
    },
    w5: {
        name: "Compound Activity Predictor",
        repo: "compound-activity-predictor",
        prompt: `Review my GitHub repository for a compound activity prediction project. I engineered RDKit molecular descriptors (Lipinski Ro5 features, TPSA, fingerprints), trained regression models (Linear, Ridge, RF, XGBoost), and analyzed residuals to understand where the model fails.

Please evaluate (score each 1-5):

**Scientific Rigor (30%)**
- Are the engineered descriptors chemically meaningful for activity prediction?
- Is the regression framing appropriate (pIC50 vs. raw IC50, log scaling)?
- Does the residual analysis reveal chemistry insights (e.g., out-of-distribution scaffolds)?

**Technical Execution (25%)**
- Is feature engineering implemented correctly with RDKit?
- Are regression metrics appropriate (R², MAE, RMSE)?
- Is the predicted vs. actual plot informative?

**Communication (25%)**
- Does the README explain the chemistry intuition (Lipinski rules, lipophilicity, etc.)?
- Are results presented in a way useful for medicinal chemists?

**Portfolio Impact (20%)**
- Is this directly relevant to early drug discovery?
- Does it demonstrate feature engineering skill (descriptors vs. fingerprints)?

Give me: overall score (1-5), top 3 strengths, top 3 improvements, one standout suggestion.`
    },
    w6: {
        name: "Protein Embedding Explorer",
        repo: "protein-embedding-explorer",
        prompt: `Review my GitHub repository for a protein embedding project. I generated ESM-2 embeddings for a protein family, visualized with UMAP, compared against hand-crafted features, and built nearest-neighbor search.

Please evaluate (score each 1-5):

**Scientific Rigor** - Do functional subfamilies cluster meaningfully? Is the ESM-2 vs. hand-crafted comparison fair?
**Technical Execution** - Are embeddings generated correctly (mean pooling)? Is UMAP parameterized well?
**Communication** - Does the README explain what embeddings are to a biologist? Are interactive plots effective?
**Portfolio Impact** - Does this show understanding of foundation models in biology?

Give me: overall score (1-5), top 3 strengths, top 3 improvements, one standout suggestion.`
    },
    w7: {
        name: "Immune Signature Classifier",
        repo: "immune-signature-classifier",
        prompt: `Review my GitHub repository for an immune gene signature project. I used RNA-seq data from IFN-treated cells, ran DEG analysis with pydeseq2, trained an ML classifier, and compared ML-selected genes vs. known ISGs.

Please evaluate (score each 1-5):

**Scientific Rigor** - Is the DEG vs. ML comparison insightful? Are non-canonical ISGs discovered by ML biologically plausible?
**Technical Execution** - Is pydeseq2 used correctly? Is the ML pipeline sound?
**Communication** - Does the Venn diagram / comparison tell a clear story?
**Portfolio Impact** - Does this leverage published IFN expertise?

Give me: overall score (1-5), top 3 strengths, top 3 improvements, one standout suggestion.`
    },
    w8: {
        name: "Cell Phenotype Classifier",
        repo: "cell-phenotype-classifier",
        prompt: `Review my GitHub repository for a cell image classification project. I fine-tuned a pre-trained ResNet18 on fluorescence microscopy images (BBBC), classified cell phenotypes, and applied GradCAM to visualize what the model sees.

Please evaluate (score each 1-5):

**Scientific Rigor** - Are the GradCAM results biologically interpretable? Does the model focus on relevant cellular features?
**Technical Execution** - Is transfer learning implemented correctly? Are data augmentation choices appropriate for microscopy?
**Communication** - Are example images and GradCAM overlays well-presented?
**Portfolio Impact** - Does this show understanding of DL for bioimage analysis?

Give me: overall score (1-5), top 3 strengths, top 3 improvements, one standout suggestion.`
    },
    w9: {
        name: "Drug Safety Dashboard",
        repo: "drug-safety-dashboard",
        prompt: `Review my deployed Streamlit app and GitHub repository for a drug safety dashboard. It queries FDA FAERS data, shows adverse event profiles, compares drugs, and clusters drugs by safety profiles.

Please evaluate (score each 1-5):

**Scientific Rigor** - Are adverse events properly categorized by organ system? Is the clustering meaningful?
**Technical Execution** - Does the app load quickly? Is API error handling robust? Is caching implemented?
**Communication** - Is the dashboard intuitive for a non-technical user? Are visualizations clear?
**Portfolio Impact** - Does this demonstrate data product skills? Is it deployed and shareable?

Give me: overall score (1-5), top 3 strengths, top 3 improvements, one standout suggestion.`
    },
    w10: {
        name: "BioPaper Mining Tool",
        repo: "biopaper-mining-tool",
        prompt: `Review my deployed Streamlit app and GitHub repository for a literature mining tool. It fetches PubMed abstracts, uses Claude API to extract structured data (compound, target, model system, findings), and displays analytics.

Please evaluate (score each 1-5):

**Scientific Rigor** - Is the extraction accurate? Are edge cases handled (no compound mentioned, multiple targets)?
**Technical Execution** - Is the Claude API used efficiently (batching, model choice)? Is PubMed rate limiting respected?
**Communication** - Is the extracted data presented clearly? Are analytics useful?
**Portfolio Impact** - Does this show LLM API skills? Is it a tool people would actually use?

Give me: overall score (1-5), top 3 strengths, top 3 improvements, one standout suggestion.`
    },
    w11: {
        name: "ML-Ready Data Playbook",
        repo: "ml-ready-bio-data",
        prompt: `Review my GitHub repository for an ML-ready data strategy guide. It includes a written guide on generating ML-ready biological data, a demo notebook showing how batch effects corrupt ML models, and a checklist template for wet-lab teams.

Please evaluate (score each 1-5):

**Scientific Rigor** - Is the batch effect demonstration convincing? Is the ComBat correction shown properly?
**Technical Execution** - Is the synthetic data realistic? Is the before/after comparison fair?
**Communication** - Is the guide actionable for a wet-lab scientist? Is the checklist practical?
**Portfolio Impact** - Does this position me as someone who understands data strategy for ML?

Give me: overall score (1-5), top 3 strengths, top 3 improvements, one standout suggestion.`
    },
    w12: {
        name: "Compound ML Pipeline (Capstone)",
        repo: "compound-ml-pipeline",
        prompt: `Review my capstone GitHub repository for an end-to-end small-molecule property prediction ML pipeline. It covers data ingestion, EDA, feature engineering (RDKit descriptors + Morgan fingerprints), model training/comparison, SHAP interpretation, and Streamlit deployment.

This is the capstone project for a 12-week bio+AI course. Please evaluate (score each 1-5):

**Scientific Rigor (30%)** - Is the full pipeline scientifically sound? Are biological assumptions justified?
**Technical Execution (25%)** - Does the pipeline run end-to-end? Is it modular and well-structured?
**Communication (25%)** - Could this README serve as a mini-paper? Is the app demo-ready?
**Portfolio Impact (20%)** - Does this capstone tie together all the skills? Would this impress in a startup interview?

Give me:
1. Overall score (1-5) with justification
2. Top 3 strengths
3. Top 3 improvements
4. How this project positions me for a Scientific Data Lead role
5. One thing to add that would make this exceptional`
    }
};

// Inject feedback UI into week cards
function initFeedback() {
    const weekCards = document.querySelectorAll('.week-card');

    weekCards.forEach(card => {
        const weekId = card.id; // e.g., "week1" or "week3"
        // map card id to prompt key
        const weekNum = weekId.replace('week', '');
        const promptKey = `w${weekNum}`;
        const projectData = PROJECT_PROMPTS[promptKey];

        if (!projectData) return;

        const feedbackSection = document.createElement('div');
        feedbackSection.className = 'feedback-section';
        feedbackSection.innerHTML = `
            <div class="feedback-toggle" onclick="this.parentElement.classList.toggle('open')">
                <span class="feedback-toggle-icon">&#9656;</span>
                <span>Get Claude Feedback on This Project</span>
            </div>
            <div class="feedback-content">
                <div class="rubric">
                    <h6>Project Rubric</h6>
                    <div class="rubric-grid">
                        ${RUBRIC.categories.map(cat => `
                            <div class="rubric-item">
                                <div class="rubric-name">${cat.name} <span class="rubric-weight">${cat.weight}</span></div>
                                <ul>${cat.criteria.map(c => `<li>${c}</li>`).join('')}</ul>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="feedback-prompt-section">
                    <h6>How to Get Feedback</h6>
                    <div class="feedback-steps">
                        <div class="feedback-step">
                            <span class="step-num">1</span>
                            <p>Push your project to GitHub: <code>${projectData.repo}</code></p>
                        </div>
                        <div class="feedback-step">
                            <span class="step-num">2</span>
                            <p>Open Claude (claude.ai or Claude Code CLI)</p>
                        </div>
                        <div class="feedback-step">
                            <span class="step-num">3</span>
                            <p>Copy the prompt below and paste it along with your code or repo link</p>
                        </div>
                    </div>

                    <div class="feedback-prompt-box">
                        <div class="feedback-prompt-header">
                            <span>Claude Review Prompt for: ${projectData.name}</span>
                            <button class="copy-btn" onclick="copyPrompt(this, '${promptKey}')">Copy</button>
                        </div>
                        <pre class="feedback-prompt-text">${escapeHtml(projectData.prompt)}</pre>
                    </div>

                    <div class="feedback-tip">
                        <strong>Pro tip:</strong> In Claude Code CLI, navigate to your project directory and run:
                        <code>claude</code> then paste the prompt. Claude Code can read all your files directly and give more specific feedback than pasting code manually.
                    </div>

                    <div class="self-check">
                        <h6>Quick Self-Check Before Submitting</h6>
                        <label class="check-item"><input type="checkbox"> README has biological context (not just code docs)</label>
                        <label class="check-item"><input type="checkbox"> Code runs end-to-end from a fresh clone</label>
                        <label class="check-item"><input type="checkbox"> At least 2 publication-quality figures</label>
                        <label class="check-item"><input type="checkbox"> Results are interpreted, not just computed</label>
                        <label class="check-item"><input type="checkbox"> requirements.txt or environment.yml is present</label>
                        <label class="check-item"><input type="checkbox"> .gitignore excludes data files and __pycache__</label>
                    </div>
                </div>
            </div>
        `;

        card.querySelector('.week-body').appendChild(feedbackSection);
    });
}

function copyPrompt(btn, key) {
    const text = PROJECT_PROMPTS[key].prompt;
    navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
        }, 2000);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeedback);
} else {
    initFeedback();
}
