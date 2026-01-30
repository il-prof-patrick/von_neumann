// Inizializzazione Globale
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Carica la home all'inizio se il contenuto è vuoto
    const contentArea = document.getElementById('main-content');
    if (contentArea && contentArea.innerHTML.trim().length < 100) {
        navigateTo('home').catch(console.error);
    }
});

// Menu Logic
function openMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.remove('opacity-0'), 10);
}

function closeMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.add('translate-x-full');
    overlay.classList.add('opacity-0');
    setTimeout(() => overlay.classList.add('hidden'), 300);
}

// Navigation Logic (Dynamic Loader)
async function navigateTo(viewId) {
    const contentArea = document.getElementById('main-content');
    const filename = viewId === 'home' ? 'lezioni/home.html' : `lezioni/${viewId}.html`;

    try {
        const response = await fetch(filename);
        if (!response.ok) throw new Error(`Errore nel caricamento della lezione: ${viewId}`);

        const html = await response.text();
        contentArea.innerHTML = html;

        // Chiudi menu
        closeMenu();

        // Scroll to top
        window.scrollTo(0, 0);

        // Re-inizializza icone Lucide
        lucide.createIcons();

        // Inizializzazioni specifiche per lezione
        handleLessonInitialization(viewId);

    } catch (err) {
        console.error("Navigation Error:", err);
        contentArea.innerHTML = `
			<div class="flex flex-col items-center justify-center p-20 text-center">
				<i data-lucide="alert-triangle" class="w-16 h-16 text-red-500 mb-4"></i>
				<h2 class="text-2xl font-bold text-white mb-2">Ops! Caricamento fallito</h2>
				<p class="text-gray-400">Assicurati di usare un server locale (es. Live Server) per caricare i file delle lezioni.<br>L'errore riscontrato è: ${err.message}</p>
				<button onclick="location.reload()" class="mt-8 px-6 py-2 bg-neon-blue text-black font-bold rounded-full">Ricarica Pagina</button>
			</div>
		`;
        if (window.lucide) lucide.createIcons();
    }
}

// Esponi le funzioni globalmente per sicurezza
window.navigateTo = navigateTo;
window.handleLessonInitialization = handleLessonInitialization;
window.openMenu = openMenu;
window.closeMenu = closeMenu;

function handleLessonInitialization(viewId) {
    if (viewId === 'lesson-2') {
        setTimeout(() => { if (typeof updateVisuals === 'function') updateVisuals(); }, 100);
    }
    if (viewId === 'lesson-4') {
        setTimeout(() => { if (typeof updateFetchVisuals === 'function') updateFetchVisuals(); }, 100);
    }
    if (viewId === 'lesson-5') {
        setTimeout(() => { if (typeof initRace === 'function') initRace(); }, 100);
    }
    if (viewId === 'lesson-6') {
        setTimeout(() => {
            if (typeof initRamLesson === 'function') initRamLesson();
            if (typeof initAccessSim === 'function') initAccessSim();
            if (typeof initRefreshSim === 'function') initRefreshSim();
            if (typeof initMatrixSim === 'function') initMatrixSim();
        }, 100);
    }
    if (viewId === 'lesson-7') {
        const term = document.getElementById('boot-terminal');
        const btn = document.getElementById('boot-btn');
        if (term) term.innerHTML = '<div class="opacity-50 italic mb-2">// Premere il tasto di accensione</div>';
        if (btn) {
            btn.innerHTML = '<i data-lucide="power" class="w-4 h-4"></i> ACCENDI PC';
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        lucide.createIcons();
    }
}

// Lente di Ingrandimento
let isMagnifierOpen = false;
let isDragging = false;
let isResizingBL = false;
let offsetPosX, offsetPosY;

window.openMagnifier = function (text) {
    const magnifierBox = document.getElementById('magnifier-box');
    const magnifierContent = document.getElementById('magnifier-content');
    if (!text || text.trim().length === 0) return;
    magnifierContent.textContent = text.trim();
    magnifierBox.style.display = 'flex';
    magnifierBox.style.top = '50%';
    magnifierBox.style.left = '50%';
    magnifierBox.style.transform = 'translate(-50%, -50%)';
    magnifierBox.style.width = '800px';
    magnifierBox.style.height = '350px';
    isMagnifierOpen = true;
    lucide.createIcons();
};

window.closeMagnifier = function () {
    const box = document.getElementById('magnifier-box');
    if (box) box.style.display = 'none';
    isMagnifierOpen = false;
};

// Event Listeners Globale
document.addEventListener('keydown', (e) => {
    // Alt + Z per Zoom
    if (e.altKey && (e.key === 'z' || e.key === 'Z')) {
        const selection = window.getSelection().toString();
        if (selection) openMagnifier(selection);
    }
    // Escape per chiudere zoom
    if (e.key === 'Escape' && isMagnifierOpen) closeMagnifier();

    // Shortcut per Lezione 6 (RAM Access)
    const lessonVisible = document.getElementById('ram-access-track'); // Controlla se esiste
    if (lessonVisible && !isBusy) {
        const key = e.key.toUpperCase();
        if (labels.includes(key)) {
            const input = document.getElementById('letter-input');
            if (input) { input.value = key; simulateUnifiedAccess(key); }
        }
    }
});

// Drag & Resize Logic per Magnifier
document.addEventListener('mousedown', (e) => {
    const magnifierBox = document.getElementById('magnifier-box');
    const magnifierHeader = document.getElementById('magnifier-header');
    const closeIcon = document.getElementById('magnifier-close');
    const resizeHandleBL = document.getElementById('magnifier-resize-bl');

    if (e.target.closest('#magnifier-header') && !e.target.closest('#magnifier-close')) {
        isDragging = true;
        const rect = magnifierBox.getBoundingClientRect();
        offsetPosX = e.clientX - rect.left;
        offsetPosY = e.clientY - rect.top;
        magnifierBox.style.transform = 'none';
        magnifierBox.style.left = rect.left + 'px';
        magnifierBox.style.top = rect.top + 'px';
    }

    if (e.target === resizeHandleBL) {
        isResizingBL = true;
    }
});

document.addEventListener('mousemove', (e) => {
    const magnifierBox = document.getElementById('magnifier-box');
    if (isDragging) {
        magnifierBox.style.left = (e.clientX - offsetPosX) + 'px';
        magnifierBox.style.top = (e.clientY - offsetPosY) + 'px';
    } else if (isResizingBL) {
        const rect = magnifierBox.getBoundingClientRect();
        const newWidth = rect.right - e.clientX;
        const newHeight = e.clientY - rect.top;
        if (newWidth > 300 && newWidth < window.innerWidth * 0.95) {
            magnifierBox.style.width = newWidth + 'px';
            magnifierBox.style.left = e.clientX + 'px';
        }
        if (newHeight > 150 && newHeight < window.innerHeight * 0.85) {
            magnifierBox.style.height = newHeight + 'px';
        }
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    isResizingBL = false;
});
