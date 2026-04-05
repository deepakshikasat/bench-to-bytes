// === Bench2Bytes Progress Tracker ===
// Uses localStorage to track module completion and unlock progression

const STORAGE_KEY = 'bench2bytes_progress';
const TOTAL_MODULES = 5;

function getProgress() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        return { completed: [], current: 1 };
    }
    return JSON.parse(stored);
}

function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function isModuleUnlocked(moduleNum) {
    if (moduleNum === 1) return true;
    const progress = getProgress();
    return progress.completed.includes(moduleNum - 1);
}

function isModuleCompleted(moduleNum) {
    const progress = getProgress();
    return progress.completed.includes(moduleNum);
}

function completeModule(moduleNum) {
    const progress = getProgress();
    if (!progress.completed.includes(moduleNum)) {
        progress.completed.push(moduleNum);
        progress.completed.sort((a, b) => a - b);
    }
    progress.current = Math.min(moduleNum + 1, TOTAL_MODULES);
    saveProgress(progress);
}

function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
}

// === Hub Page (index.html) ===
function initHub() {
    const cards = document.querySelectorAll('.module-card');
    cards.forEach(card => {
        const num = parseInt(card.dataset.module);
        const unlocked = isModuleUnlocked(num);
        const completed = isModuleCompleted(num);

        if (completed) {
            card.classList.add('completed');
            card.querySelector('.module-status').textContent = 'Completed';
            card.querySelector('.module-status').classList.add('status-completed');
        } else if (unlocked) {
            card.classList.add('unlocked');
            card.querySelector('.module-status').textContent = 'Start Module';
            card.querySelector('.module-status').classList.add('status-unlocked');
        } else {
            card.classList.add('locked');
            card.querySelector('.module-status').textContent = 'Locked';
            card.querySelector('.module-status').classList.add('status-locked');
        }

        card.addEventListener('click', () => {
            if (unlocked || completed) {
                window.location.href = `module${num}.html`;
            }
        });
    });

    // Update progress bar
    const progress = getProgress();
    const pct = (progress.completed.length / TOTAL_MODULES) * 100;
    const bar = document.querySelector('.progress-fill');
    const label = document.querySelector('.progress-label');
    if (bar) bar.style.width = pct + '%';
    if (label) label.textContent = `${progress.completed.length} / ${TOTAL_MODULES} modules completed`;
}

// === Module Pages ===
function initModule(moduleNum) {
    // Check if unlocked
    if (!isModuleUnlocked(moduleNum)) {
        document.querySelector('.module-content').innerHTML = `
            <div class="locked-message">
                <h2>Module Locked</h2>
                <p>Complete Module ${moduleNum - 1} to unlock this module.</p>
                <a href="index.html" class="btn">Back to Hub</a>
            </div>
        `;
        return;
    }

    // Set up completion button
    const btn = document.querySelector('.complete-btn');
    if (btn) {
        if (isModuleCompleted(moduleNum)) {
            btn.textContent = 'Completed! Re-visit anytime.';
            btn.classList.add('btn-completed');
        }

        btn.addEventListener('click', () => {
            completeModule(moduleNum);
            btn.textContent = 'Completed! Next module unlocked.';
            btn.classList.add('btn-completed');

            if (moduleNum < TOTAL_MODULES) {
                setTimeout(() => {
                    window.location.href = `module${moduleNum + 1}.html`;
                }, 1200);
            } else {
                setTimeout(() => {
                    window.location.href = 'resume.html';
                }, 1200);
            }
        });
    }

    // Week checklist tracking
    const checks = document.querySelectorAll('.week-check');
    const weekKey = `bench2bytes_m${moduleNum}_weeks`;
    const savedWeeks = JSON.parse(localStorage.getItem(weekKey) || '[]');

    checks.forEach(check => {
        const weekId = check.dataset.week;
        if (savedWeeks.includes(weekId)) {
            check.classList.add('checked');
            check.querySelector('input').checked = true;
        }

        check.querySelector('input').addEventListener('change', (e) => {
            const weeks = JSON.parse(localStorage.getItem(weekKey) || '[]');
            if (e.target.checked) {
                if (!weeks.includes(weekId)) weeks.push(weekId);
                check.classList.add('checked');
            } else {
                const idx = weeks.indexOf(weekId);
                if (idx > -1) weeks.splice(idx, 1);
                check.classList.remove('checked');
            }
            localStorage.setItem(weekKey, JSON.stringify(weeks));
        });
    });
}
