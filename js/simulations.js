/* --- LOGICA BUS (LEZIONE 8) --- */
let isBusSimRunning = false;
function runBusCycle(mode = 'read') {
    if (isBusSimRunning) return;
    isBusSimRunning = true;

    const btnRead = document.getElementById('start-bus-read');
    const btnWrite = document.getElementById('start-bus-write');
    const log = document.getElementById('bus-sim-log');
    const cpuStatus = document.getElementById('cpu-status');
    const ramStatus = document.getElementById('ram-status');
    const addrWire = document.getElementById('addr-wire');
    const dataWire = document.getElementById('data-wire');
    const pAddr = document.getElementById('packet-addr');
    const pData = document.getElementById('packet-data');
    const pControl = document.getElementById('packet-control');
    const addrBusStatus = document.getElementById('addr-bus-status');
    const dataBusStatus = document.getElementById('data-bus-status');
    const controlBusStatus = document.getElementById('control-bus-status');
    const controlWire = document.getElementById('control-wire');

    const buttons = [btnRead, btnWrite];
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    });

    pAddr.style.opacity = '0';
    pData.style.opacity = '0';
    pControl.style.opacity = '0';
    pAddr.classList.remove('animate-flow-lr', 'animate-flow-rl');
    pData.classList.remove('animate-flow-lr', 'animate-flow-rl');
    pControl.classList.remove('animate-flow-lr', 'animate-flow-rl');
    addrWire.classList.remove('bus-wire-active-addr');
    dataWire.classList.remove('bus-wire-active-data');
    controlWire.classList.remove('bus-wire-active-control');

    document.querySelectorAll('.stack-cell').forEach(c => c.classList.remove('active-ram-cell'));

    const addrValue = Math.floor(Math.random() * 8);
    const addressStr = "0x0" + addrValue;
    const targetCell = document.getElementById('cell-' + addressStr);
    const targetDataEl = targetCell.querySelector('.stack-cell-data');

    const dataVal = Math.floor(Math.random() * 256).toString(2).padStart(8, '0');
    const existingData = targetDataEl.textContent;

    if (mode === 'read') {
        log.textContent = "Inizio operazione di LETTURA...";
        cpuStatus.textContent = "Inizio Lettura";

        setTimeout(() => {
            log.textContent = "La CPU pone l'indirizzo sul bus indirizzi e invia un segnale di lettura tramite le linee di controllo.";
            addrBusStatus.textContent = "ATTIVO (Indirizzo)";
            controlBusStatus.textContent = "ATTIVO (Read)";
            addrWire.classList.add('bus-wire-active-addr');
            controlWire.classList.add('bus-wire-active-control');
            pAddr.textContent = addressStr;
            pControl.textContent = "READ";
            pAddr.classList.add('animate-flow-lr');
            pControl.classList.add('animate-flow-lr');

            setTimeout(() => {
                log.textContent = "La RAM riceve l'indirizzo e inizia la ricerca...";
                ramStatus.textContent = "Ricerca Cella...";
                addrWire.classList.remove('bus-wire-active-addr');
                controlWire.classList.remove('bus-wire-active-control');
                addrBusStatus.textContent = "Inattivo";
                controlBusStatus.textContent = "Inattivo";

                setTimeout(() => {
                    targetCell.classList.add('active-ram-cell');
                    ramStatus.textContent = "Cella Trovata!";

                    setTimeout(() => {
                        log.textContent = "La RAM legge il dato dall’indirizzo specificato sul bus indirizzi e lo mette sul bus dati.";
                        dataBusStatus.textContent = "ATTIVO (Dati)";
                        dataWire.classList.add('bus-wire-active-data');
                        pData.textContent = existingData;
                        pData.classList.add('animate-flow-rl');

                        setTimeout(() => {
                            log.textContent = "La CPU riceve il dato dal bus dati e lo usa per l’elaborazione.";
                            cpuStatus.textContent = "Dato ricevuto!";
                            dataBusStatus.textContent = "Inattivo";
                            dataWire.classList.remove('bus-wire-active-data');

                            setTimeout(() => {
                                targetCell.classList.remove('active-ram-cell');
                                finish();
                            }, 2000);
                        }, 4000);
                    }, 1500);
                }, 2000);
            }, 3000);
        }, 1000);
    } else {
        log.textContent = "Inizio operazione di SCRITTURA...";
        cpuStatus.textContent = "Inizio Scrittura";

        setTimeout(() => {
            log.textContent = "La CPU pone l'indirizzo sul bus indirizzi, il dato sul bus dati e invia il segnale di scrittura tramite le linee di controllo.";
            addrBusStatus.textContent = "ATTIVO (Indirizzo)";
            dataBusStatus.textContent = "ATTIVO (Dati)";
            controlBusStatus.textContent = "ATTIVO (Write)";
            addrWire.classList.add('bus-wire-active-addr');
            dataWire.classList.add('bus-wire-active-data');
            controlWire.classList.add('bus-wire-active-control');

            pAddr.textContent = addressStr;
            pData.textContent = dataVal;
            pControl.textContent = "WRITE";
            pAddr.classList.add('animate-flow-lr');
            pData.classList.add('animate-flow-lr');
            pControl.classList.add('animate-flow-lr');

            setTimeout(() => {
                log.textContent = "La RAM salva il dato dal bus dati nella cella specificata dal bus indirizzi.";
                ramStatus.textContent = "Salvataggio...";
                addrWire.classList.remove('bus-wire-active-addr');
                dataWire.classList.remove('bus-wire-active-data');
                controlWire.classList.remove('bus-wire-active-control');
                addrBusStatus.textContent = "Inattivo";
                dataBusStatus.textContent = "Inattivo";
                controlBusStatus.textContent = "Inattivo";

                setTimeout(() => {
                    targetCell.classList.add('active-ram-cell');

                    setTimeout(() => {
                        targetDataEl.textContent = dataVal;
                        targetDataEl.classList.add('text-white', 'scale-110');
                        ramStatus.textContent = "Dato Salvato!";
                        cpuStatus.textContent = "OK!";

                        setTimeout(() => {
                            targetDataEl.classList.remove('text-white', 'scale-110');
                            targetCell.classList.remove('active-ram-cell');
                            finish();
                        }, 2000);
                    }, 2000);
                }, 1000);
            }, 4000);
        }, 1000);
    }

    function finish() {
        log.textContent = "Operazione completata.";
        cpuStatus.textContent = "Attesa...";
        ramStatus.textContent = "Pronta";
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        });
        isBusSimRunning = false;
    }
}

/* --- LOGICA BOOT (LEZIONE 7) --- */
function startBootSequence() {
    const term = document.getElementById('boot-terminal');
    const btn = document.getElementById('boot-btn');
    if (!term || !btn) return;

    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');
    term.innerHTML = '';

    const messages = [
        { text: "> UEFI Firmware Version 4.2.0", delay: 300 },
        { text: "> CPU: Intel(R) Core(TM) i7 initialized [OK]", delay: 600 },
        { text: "> RAM: 16384 MB detected and tested [OK]", delay: 500 },
        { text: "> Checking storage devices...", delay: 800 },
        { text: "> Found bootable device: SSD (SATA 0) [OK]", delay: 400 },
        { text: "> Loading Bootstrap Loader...", delay: 600 },
        { text: "> Identifying System Partition...", delay: 400 },
        { text: "> Jumping to entry point at 0x7C00...", delay: 700 },
        { text: "> Loading OS Kernel into RAM...", delay: 900 },
        { text: "> Handing control to Operating System...", delay: 800 },
        { text: "------------------------------------", delay: 200 },
        { text: "SYSTEM BOOT COMPLETED SUCCESSFULLY", delay: 200, color: '#00ff9d' },
    ];

    let i = 0;
    function typeMessage() {
        if (i < messages.length) {
            const msg = messages[i];
            const div = document.createElement('div');
            div.textContent = msg.text;
            if (msg.color) div.style.color = msg.color;
            div.className = "mb-1";
            term.appendChild(div);
            term.scrollTop = term.scrollHeight;
            i++;
            setTimeout(typeMessage, msg.delay);
        } else {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
            btn.innerHTML = '<i data-lucide="refresh-cw" class="w-4 h-4"></i> RIAVVIA PC';
            lucide.createIcons();
        }
    }
    setTimeout(typeMessage, 200);
}

/* --- LOGICA VON NEUMANN (LEZIONE 2) --- */
let currentStep = 0;
function renderData(step) {
    const dataGroup = document.getElementById('data-group');
    if (!dataGroup) return;
    if (step < 3) {
        dataGroup.innerHTML = `
			<div class="w-10 h-10 bg-white text-black font-bold font-mono flex items-center justify-center rounded shadow-lg border-2 border-green-500">3</div>
			<div class="w-10 h-10 bg-gray-800 text-white font-bold font-mono flex items-center justify-center rounded shadow-lg border-2 border-gray-500">+</div>
			<div class="w-10 h-10 bg-white text-black font-bold font-mono flex items-center justify-center rounded shadow-lg border-2 border-green-500">5</div>
		`;
    } else {
        dataGroup.innerHTML = `
			<div class="w-12 h-12 bg-cyan-400 text-black font-bold font-mono flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(0,243,255,0.8)] border-2 border-white animate-pulse">8</div>
		`;
    }
}

function getTargetCoordinates(targetId) {
    const container = document.getElementById('vn-diagram');
    const target = document.getElementById(targetId);
    if (!container || !target) return { left: '50%', top: '50%' };
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    return {
        left: (targetRect.left - containerRect.left + (targetRect.width / 2)) + 'px',
        top: (targetRect.top - containerRect.top + (targetRect.height / 2)) + 'px'
    };
}

function updateVisuals() {
    const vnDiagram = document.getElementById('vn-diagram');
    const dataGroup = document.getElementById('data-group');
    const stepDesc = document.getElementById('step-desc');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    if (!vnDiagram) return;

    renderData(currentStep);
    if (dataGroup) {
        dataGroup.style.opacity = '1';
        dataGroup.style.transform = 'translate(-50%, -50%)';
    }

    let targetId = '';
    let extraTransform = '';

    switch (currentStep) {
        case 0:
            targetId = 'input-target';
            if (stepDesc) { stepDesc.textContent = "1: Inserimento dati (3 + 5)"; stepDesc.className = "font-mono text-green-400 text-sm font-bold truncate px-2"; }
            break;
        case 1:
            targetId = 'ram-target';
            if (stepDesc) { stepDesc.textContent = "2: Trasferimento in RAM"; stepDesc.className = "font-mono text-purple-400 text-sm font-bold truncate px-2"; }
            break;
        case 2:
            targetId = 'cpu-target';
            if (stepDesc) { stepDesc.textContent = "3: Prelievo della CPU"; stepDesc.className = "font-mono text-cyan-400 text-sm font-bold truncate px-2"; }
            break;
        case 3:
            targetId = 'cpu-target';
            extraTransform = 'scale(1.2)';
            if (stepDesc) { stepDesc.textContent = "4: Elaborazione (3 + 5 = 8)"; stepDesc.className = "font-mono text-cyan-500 text-sm font-bold truncate px-2"; }
            break;
        case 4:
            targetId = 'ram-target';
            if (stepDesc) { stepDesc.textContent = "5: Salvataggio in RAM"; stepDesc.className = "font-mono text-purple-400 text-sm font-bold truncate px-2"; }
            break;
        case 5:
            targetId = 'output-target';
            if (stepDesc) { stepDesc.textContent = "6: Scrittura dei dati"; stepDesc.className = "font-mono text-red-400 text-sm font-bold truncate px-2"; }
            break;
    }

    if (targetId && dataGroup) {
        const coords = getTargetCoordinates(targetId);
        dataGroup.style.left = coords.left;
        dataGroup.style.top = coords.top;
        if (extraTransform) dataGroup.style.transform = `translate(-50%, -50%) ${extraTransform}`;
    }

    if (btnPrev) btnPrev.disabled = currentStep === 0;
    if (btnNext) btnNext.disabled = currentStep === 5;
}

function nextStep() { if (currentStep < 5) { currentStep++; updateVisuals(); } }
function prevStep() { if (currentStep > 0) { currentStep--; updateVisuals(); } }

/* --- LOGICA FETCH CYCLE (LEZIONE 4) --- */
let fetchStep = 0;
function getFetchCoords(elementId) {
    const container = document.getElementById('fetch-diagram');
    const el = document.getElementById(elementId);
    if (!container || !el) return { left: '50%', top: '50%' };
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    return {
        left: (eRect.left - cRect.left + eRect.width / 2) + 'px',
        top: (eRect.top - cRect.top + eRect.height / 2) + 'px'
    };
}

function resetFetchHighlights() {
    ['f-ram', 'f-mem-cell', 'f-cu', 'f-alu', 'f-reg', 'f-ram-result', 'f-mem-data1', 'f-mem-data2', 'f-mem-instr'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.classList.remove('ring-2', 'ring-white/60', 'shadow-[0_0_15px_rgba(255,255,255,0.2)]', 'scale-105'); el.style.zIndex = '0'; }
    });
}

function highlightFetch(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.add('ring-2', 'ring-white/60', 'shadow-[0_0_15px_rgba(255,255,255,0.2)]', 'scale-105'); el.style.zIndex = '10'; }
}

function updateFetchVisuals() {
    const diagram = document.getElementById('fetch-diagram');
    if (!diagram) return;

    const tokenInstr = document.getElementById('f-token-instr');
    const tokenData1 = document.getElementById('f-token-data1');
    const tokenData2 = document.getElementById('f-token-data2');
    const tokenResult = document.getElementById('f-token-result');
    const desc = document.getElementById('fetch-desc');
    const prevBtn = document.getElementById('btn-f-prev');
    const nextBtn = document.getElementById('btn-f-next');
    const resultCell = document.getElementById('f-ram-result');

    if (!tokenInstr) return;
    resetFetchHighlights();

    tokenInstr.style.display = 'none';
    tokenData1.style.display = 'none';
    tokenData2.style.display = 'none';
    tokenResult.style.display = 'none';

    if (fetchStep < 4 && resultCell) {
        resultCell.innerHTML = '';
        resultCell.className = "w-full h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-between px-4 text-gray-400 text-sm font-mono opacity-50 transition-all duration-500";
    }

    switch (fetchStep) {
        case 0:
            tokenInstr.style.display = 'flex'; tokenData1.style.display = 'flex'; tokenData2.style.display = 'flex';
            highlightFetch('f-ram'); highlightFetch('f-mem-instr'); highlightFetch('f-mem-data1'); highlightFetch('f-mem-data2');
            const cI0 = getFetchCoords('f-mem-instr'); tokenInstr.style.left = cI0.left; tokenInstr.style.top = cI0.top; tokenInstr.style.transform = 'translate(-50%, -50%)';
            const cD1 = getFetchCoords('f-mem-data1'); tokenData1.style.left = cD1.left; tokenData1.style.top = cD1.top; tokenData1.style.transform = 'translate(-50%, -50%)';
            const cD2 = getFetchCoords('f-mem-data2'); tokenData2.style.left = cD2.left; tokenData2.style.top = cD2.top; tokenData2.style.transform = 'translate(-50%, -50%)';
            if (desc) { desc.textContent = "Inizio: istruzione (somma) e dati (3 e 5) presenti in RAM"; desc.className = "font-mono text-white-400 text-xs font-bold px-2"; }
            break;
        case 1:
            tokenInstr.style.display = 'flex'; tokenData1.style.display = 'flex'; tokenData2.style.display = 'flex';
            highlightFetch('f-reg');
            const cR = getFetchCoords('f-reg');
            tokenInstr.style.left = cR.left; tokenInstr.style.top = cR.top; tokenInstr.style.transform = 'translate(-150%, -50%)';
            tokenData1.style.left = cR.left; tokenData1.style.top = cR.top; tokenData1.style.transform = 'translate(-50%, -50%)';
            tokenData2.style.left = cR.left; tokenData2.style.top = cR.top; tokenData2.style.transform = 'translate(50%, -50%)';
            if (desc) { desc.textContent = "1 - FETCH: Dati e istruzioni vengono caricati nei Registri della CPU"; desc.className = "font-mono text-blue-400 text-xs font-bold px-2"; }
            break;
        case 2:
            tokenInstr.style.display = 'flex'; tokenData1.style.display = 'flex'; tokenData2.style.display = 'flex';
            highlightFetch('f-cu'); highlightFetch('f-alu');
            const cCU = getFetchCoords('f-cu'); tokenInstr.style.left = cCU.left; tokenInstr.style.top = cCU.top; tokenInstr.style.transform = 'translate(-50%, -50%)';
            const cAL = getFetchCoords('f-alu'); tokenData1.style.left = cAL.left; tokenData1.style.top = cAL.top; tokenData1.style.transform = 'translate(-60%, -50%)';
            tokenData2.style.left = cAL.left; tokenData2.style.top = cAL.top; tokenData2.style.transform = 'translate(60%, -50%)';
            if (desc) { desc.textContent = "2 - DECODE: l'operazione viene interpretata dalla CU come somma; viene dunque comunicata alla ALU insieme ai dati."; desc.className = "font-mono text-neon-yellow text-xs font-bold px-2"; }
            break;
        case 3:
            tokenResult.style.display = 'flex'; highlightFetch('f-alu');
            const cEX = getFetchCoords('f-alu'); tokenResult.style.left = cEX.left; tokenResult.style.top = cEX.top; tokenResult.style.transform = 'translate(-50%, -50%) scale(1.2)';
            if (desc) { desc.textContent = "3 - EXECUTE: La ALU effettua la somma tra i valori e ottiene il risultato (8)"; desc.className = "font-mono text-neon-red text-xs font-bold px-2"; }
            break;
        case 4:
            tokenResult.style.display = 'flex'; highlightFetch('f-ram'); highlightFetch('f-ram-result');
            const cST = getFetchCoords('f-ram-result'); tokenResult.style.left = cST.left; tokenResult.style.top = cST.top; tokenResult.style.transform = 'translate(-50%, -50%)';
            if (resultCell) { resultCell.innerHTML = '<span class="text-xs">0x03</span> <span class="text-neon-green font-bold">DATA: 8</span>'; resultCell.className = "w-full h-10 bg-green-900/30 border border-neon-green rounded flex items-center justify-between px-4 text-white text-sm font-mono opacity-100 shadow-[0_0_15px_rgba(0,255,157,0.3)] transition-all duration-500"; }
            if (desc) { desc.textContent = "4 - STORE: Il risultato viene salvato in RAM in un altro indirizzo."; desc.className = "font-mono text-green-400 text-xs font-bold px-2"; }
            break;
    }
    if (prevBtn) prevBtn.disabled = fetchStep === 0;
    if (nextBtn) nextBtn.disabled = fetchStep === 4;
    lucide.createIcons();
}

function nextFetchStep() { if (fetchStep < 4) { fetchStep++; updateFetchVisuals(); } }
function prevFetchStep() { if (fetchStep > 0) { fetchStep--; updateFetchVisuals(); } }

/* --- LOGICA CLOCK --- */
function changeClockSpeed(speed, btn) {
    const stick = document.getElementById('metronome-stick');
    const statusText = document.getElementById('clock-status-text');
    document.querySelectorAll('.clock-btn').forEach(b => {
        b.className = "clock-btn bg-transparent text-gray-400 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-xs font-mono transition-all border border-transparent";
    });
    btn.className = "clock-btn bg-neon-teal text-black font-bold px-4 py-2 rounded-lg text-xs font-mono transition-all scale-105 border border-transparent shadow-[0_0_10px_rgba(45,212,191,0.3)]";

    switch (speed) {
        case 'slow': stick.style.animationDuration = '2s'; statusText.textContent = "1 Hz (Didattico)"; statusText.className = "absolute bottom-4 text-neon-teal font-mono text-xs font-bold tracking-widest uppercase z-30"; break;
        case 'medium': stick.style.animationDuration = '0.6s'; statusText.textContent = "100 MHz (Vintage)"; statusText.className = "absolute bottom-4 text-yellow-400 font-mono text-xs font-bold tracking-widest uppercase z-30"; btn.className = "clock-btn bg-neon-yellow text-black font-bold px-4 py-2 rounded-lg text-xs font-mono transition-all scale-105 border border-transparent shadow-[0_0_15px_rgba(255,51,51,0.5)]"; break;
        case 'fast': stick.style.animationDuration = '0.15s'; statusText.textContent = "4 GHz (Moderno)"; statusText.className = "absolute bottom-4 text-neon-teal font-mono text-xs font-bold tracking-widest uppercase z-30"; btn.className = "clock-btn bg-neon-red text-black font-bold px-4 py-2 rounded-lg text-xs font-mono transition-all scale-105 border border-transparent shadow-[0_0_15px_rgba(255,51,51,0.5)]"; break;
    }
}

/* --- LOGICA PROCESSI (SIMULATORE) --- */
let simMode = null; let simTimeouts = []; let pendingTasks = []; let coresStatus = { 1: false, 2: false };
const TASKS_CONFIG = [
    { id: 'T1', color: 'bg-blue-600', name: 'Word', duration: 3000 },
    { id: 'T2', color: 'bg-green-600', name: 'Spotify', duration: 1500 },
    { id: 'T3', color: 'bg-yellow-600', name: 'Chrome', duration: 4500 }
];

function setSimMode(mode) {
    simTimeouts.forEach(t => clearTimeout(t)); simTimeouts = [];
    pendingTasks = []; coresStatus = { 1: false, 2: false };
    document.getElementById('sim-queue').innerHTML = ''; document.getElementById('sim-finished').innerHTML = '';
    ['sim-core-1', 'sim-core-2'].forEach(id => {
        const c = document.getElementById(id); const p = document.getElementById(`progress-${id}`);
        if (c) { const t = c.querySelector('.sim-task'); if (t) t.remove(); const s = c.querySelector('span'); s.textContent = (id === 'sim-core-2' && mode !== 'parallel') ? "OFFLINE" : "IDLE"; s.style.display = 'block'; }
        if (p) { p.style.transition = 'none'; p.style.width = '0%'; }
    });

    simMode = mode;
    ['seq', 'multi', 'para'].forEach(m => {
        const btn = document.getElementById(`btn-${m}`);
        btn.className = (mode === 'sequential' && m === 'seq') ? "px-4 py-2 rounded-md text-xs font-mono font-bold transition-all bg-neon-blue text-black shadow-[0_0_10px_rgba(0,243,255,0.4)] scale-105" :
            (mode === 'multitasking' && m === 'multi') ? "px-4 py-2 rounded-md text-xs font-mono font-bold transition-all bg-neon-purple text-black shadow-[0_0_10px_rgba(188,19,254,0.4)] scale-105" :
                (mode === 'parallel' && m === 'para') ? "px-4 py-2 rounded-md text-xs font-mono font-bold transition-all bg-neon-teal text-black shadow-[0_0_10px_rgba(45,212,191,0.4)] scale-105" :
                    "px-4 py-2 rounded-md text-xs font-mono font-bold transition-all text-gray-400 hover:text-white";
    });

    const c2 = document.getElementById('core-2-container'); if (c2) { if (mode === 'parallel') c2.classList.remove('opacity-30', 'blur-[2px]'); else c2.classList.add('opacity-30', 'blur-[2px]'); }
    const desc = document.getElementById('sim-description');
    if (mode === 'sequential') desc.innerHTML = "<strong>Sequenziale:</strong> Esegue un processo alla volta.";
    if (mode === 'multitasking') desc.innerHTML = "<strong>Multitasking:</strong> Divisione del tempo (Time Slice).";
    if (mode === 'parallel') desc.innerHTML = "<strong>Parallelo (Multi-core):</strong> Esecuzione simultanea reale.";

    pendingTasks = TASKS_CONFIG.map(t => ({ ...t, executed: 0, domId: `vis-${t.id}` }));
    pendingTasks.forEach(t => {
        const el = document.createElement('div'); el.id = t.domId; el.className = `sim-task ${t.color} w-full h-10 rounded-md flex items-center justify-between px-2 shadow-lg mb-1 task-queue-enter text-white text-xs font-bold font-mono`;
        el.innerHTML = `<span>${t.id}</span><span class="opacity-75 text-[10px]">${t.name}</span>`;
        document.getElementById('sim-queue').appendChild(el);
    });

    if (mode === 'sequential') runSequential(); else if (mode === 'multitasking') runMultitasking(); else if (mode === 'parallel') runParallel();
}

function runSequential() {
    if (pendingTasks.length === 0) return;
    const t = pendingTasks.shift(); runTaskOnCore(t, 1, runSequential);
}

function runParallel() {
    const check = () => {
        if (pendingTasks.length === 0 && !coresStatus[1] && !coresStatus[2]) return;
        [1, 2].forEach(id => {
            if (!coresStatus[id] && pendingTasks.length > 0) {
                coresStatus[id] = true; runTaskOnCore(pendingTasks.shift(), id, () => { coresStatus[id] = false; check(); });
            }
        });
    };
    check();
}

function runTaskOnCore(task, id, cb) {
    const c = document.getElementById(`sim-core-${id}`); const p = document.getElementById(`progress-core-${id}`); const tEl = document.getElementById(task.domId);
    c.querySelector('span').style.display = 'none'; c.appendChild(tEl);
    p.style.transition = 'none'; p.style.width = '0%'; void p.offsetWidth;
    simTimeouts.push(setTimeout(() => { p.style.transition = `width ${task.duration}ms linear`; p.style.width = '100%'; }, 50));
    simTimeouts.push(setTimeout(() => { p.style.transition = 'none'; p.style.width = '0%'; c.querySelector('span').style.display = 'block'; document.getElementById('sim-finished').appendChild(tEl); if (cb) cb(); }, task.duration + 50));
}

function runMultitasking() {
    const SLICE = 1000;
    const next = () => {
        if (pendingTasks.length === 0) return;
        const t = pendingTasks.shift(); const only = pendingTasks.length === 0;
        const rem = t.duration - t.executed; const slice = only ? rem : Math.min(SLICE, rem);
        const sPct = (t.executed / t.duration) * 100; const ePct = ((t.executed + slice) / t.duration) * 100;
        t.executed += slice; const fin = t.executed >= t.duration;

        const c = document.getElementById('sim-core-1'); const p = document.getElementById('progress-core-1'); const tEl = document.getElementById(t.domId);
        c.querySelector('span').style.display = 'none'; c.appendChild(tEl);
        p.style.transition = 'none'; p.style.width = sPct + '%'; void p.offsetWidth;
        setTimeout(() => { p.style.transition = `width ${slice}ms linear`; p.style.width = ePct + '%'; }, 20);

        simTimeouts.push(setTimeout(() => {
            if (fin) { document.getElementById('sim-finished').appendChild(tEl); p.style.width = '0%'; c.querySelector('span').style.display = 'block'; }
            else { pendingTasks.push(t); if (!only) { const q = document.getElementById('sim-queue'); q.insertBefore(tEl, q.firstChild); c.querySelector('span').style.display = 'block'; } }
            simTimeouts.push(setTimeout(next, 200));
        }, slice + 50));
    };
    next();
}

/* --- LOGICA GPU RACE (LEZIONE 5) --- */
function getPixelValue(idx) {
    const x = idx % 100; const y = Math.floor(idx / 100); const dx = x - 50, dy = y - 50, dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 45) return false;
    if (y > 30 && y < 45 && ((x > 30 && x < 40) || (x > 60 && x < 70))) return false;
    if (y > 65 && y < 75 && Math.abs(dx) < 25) return false;
    return true;
}

function initRace() {
    const v = document.getElementById('cpu-cores-visual'); if (v) { v.innerHTML = ''; for (let i = 0; i < 32; i++) { const d = document.createElement('div'); d.className = 'w-1.5 h-1.5 bg-neon-teal rounded-sm m-0.5'; v.appendChild(d); } }
    const c1 = document.getElementById('cpu-canvas'); const c2 = document.getElementById('gpu-canvas');
    if (c1 && c2) { c1.getContext('2d').clearRect(0, 0, 100, 100); c2.getContext('2d').clearRect(0, 0, 100, 100); }
}

function startCpuGpuRace() {
    const btn = document.getElementById('btn-race'); btn.disabled = true; btn.classList.add('opacity-50', 'cursor-not-allowed');
    const d = document.getElementById('race-countdown-display'); let c = 3; d.innerText = c;
    const t = setInterval(() => {
        c--; if (c > 0) d.innerText = c; else if (c === 0) d.innerText = "GO!"; else { clearInterval(t); d.innerText = ""; launchRaceLogic(); }
    }, 800);
}

function launchRaceLogic() {
    const cC = document.getElementById('cpu-canvas').getContext('2d'); const gC = document.getElementById('gpu-canvas').getContext('2d');
    cC.clearRect(0, 0, 100, 100); gC.clearRect(0, 0, 100, 100);
    let cpuP = 0; const start = performance.now();
    const raceIn = setInterval(() => {
        cC.fillStyle = '#2dd4bf'; for (let k = 0; k < 32; k++) { if (cpuP < 10000) { if (getPixelValue(cpuP)) cC.fillRect(cpuP % 100, Math.floor(cpuP / 100), 1, 1); cpuP++; } }
        document.getElementById('cpu-progress').style.width = (cpuP / 100) + '%';
        document.getElementById('cpu-stats').innerText = cpuP >= 10000 ? `Completato: ${(performance.now() - start).toFixed(0)}ms` : `Elaborazione: ${cpuP}/10.000`;
        if (cpuP >= 10000) { clearInterval(raceIn); document.getElementById('btn-race').disabled = false; document.getElementById('btn-race').classList.remove('opacity-50'); }
    }, 16);
    requestAnimationFrame(() => {
        const gStart = performance.now(); gC.fillStyle = '#ff0099';
        for (let i = 0; i < 10000; i++) if (getPixelValue(i)) gC.fillRect(i % 100, Math.floor(i / 100), 1, 1);
        document.getElementById('gpu-progress').style.width = '100%'; document.getElementById('gpu-stats').innerText = `Completato: ${(performance.now() - gStart).toFixed(2)}ms`;
    });
}

/* --- LOGICA RAM (LEZIONE 6) --- */
let ramPower = true; const ramData = ["OS_KERNEL", "CHROME_EXE", "WORD_DOC", "GPU_DRIVERS", "CLIPBOARD", "SPOTIFY", "FLOWGORITHM_PROGR", "USER_SESS"];
function initRamLesson() {
    const g = document.getElementById('ram-grid'); if (!g) return; g.innerHTML = '';
    ramData.forEach((d, i) => {
        const r = document.createElement('div'); r.className = "flex border-b border-white/5 last:border-0";
        r.innerHTML = `<div class="bg-black/40 px-2 py-3 border-r border-white/5 text-[8px] font-mono text-gray-600 flex items-center justify-center min-w-[50px]">0x${(i * 16).toString(16).toUpperCase().padStart(3, '0')}</div>
					   <div id="ram-val-${i}" class="ram-cell flex-1 px-4 py-3 bg-neon-purple/5 text-[9px] font-mono text-neon-purple font-bold flex items-center justify-center shadow-inner">${ramPower ? d : ""}</div>`;
        g.appendChild(r);
    });
    updateRamVisuals();
}
function toggleRamPower() { ramPower = !ramPower; updateRamVisuals(); }
function updateRamVisuals() {
    const b = document.getElementById('ram-power-btn'); if (!b) return;
    ramData.forEach((d, i) => { const c = document.getElementById(`ram-val-${i}`); if (c) { c.textContent = ramPower ? d : ""; if (ramPower) c.classList.remove('off'); else c.classList.add('off'); } });
    b.innerHTML = ramPower ? '<i data-lucide="power"></i> ALIMENTATO' : '<i data-lucide="power-off"></i> OFFLINE';
    b.className = ramPower ? "px-4 py-2 bg-neon-green text-black font-bold rounded-full text-xs transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,157,0.3)]" : "px-4 py-2 bg-neon-red text-white font-bold rounded-full text-xs transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,51,51,0.3)]";
    lucide.createIcons();
}

/* --- LOGICA LENTE / VELOCITÀ --- */
let speedAnimating = false;
function requestFrom(type) {
    if (speedAnimating) return; speedAnimating = true;
    const p = document.getElementById('data-packet'); const i = document.getElementById('speed-info');
    const t = type === 'ram' ? 250 : 250000; const h = t / 2;
    i.textContent = `Richiesta inviata a ${type.toUpperCase()}...`; i.className = `text-[10px] font-mono mt-4 uppercase tracking-widest text-center ${type === 'ram' ? 'text-neon-purple' : 'text-neon-amber'}`;
    p.classList.remove('hidden'); p.style.left = "calc(50% - 8px)"; p.style.top = "160px";
    setTimeout(() => { p.style.transition = `top ${h}ms linear`; p.style.top = (type === 'ram' ? 30 : 290) + "px"; }, 50);
    setTimeout(() => {
        i.textContent = `Dati ricevuti!`; p.style.transition = `top ${h}ms linear`; p.style.top = "160px";
        setTimeout(() => { p.classList.add('hidden'); speedAnimating = false; }, h);
    }, h + 50);
}

/* --- LOGICA ACCESSO RAM (LEZIONE 6) --- */
const labels = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); let isBusy = false;
function initAccessSim() {
    const rT = document.getElementById('ram-access-track'); const tT = document.getElementById('tape-track-static');
    if (!rT || !tT) return; rT.innerHTML = ''; tT.innerHTML = '';
    labels.forEach((l, i) => {
        const r = document.createElement('div'); r.className = "flex-1 flex flex-col items-center overflow-hidden";
        r.innerHTML = `<div id="ram-${l}" class="access-cell w-full h-6 bg-white/5 rounded-[1px] border border-white/5 flex items-center justify-center font-mono text-[6px] text-gray-600">${l}</div><span class="text-[4px] text-gray-700 mt-1 font-mono">${i * 8}</span>`;
        rT.appendChild(r);
        const t = document.createElement('div'); t.id = `tape-${l}`; t.className = "access-cell flex-1 h-6 bg-white/5 rounded-[1px] border border-white/5 flex items-center justify-center font-mono text-[6px] text-gray-600"; t.textContent = l;
        tT.appendChild(t);
    });
}
async function simulateUnifiedAccess(letter) {
    if (isBusy) return; isBusy = true; const idx = labels.indexOf(letter);
    document.querySelectorAll('.access-cell').forEach(c => { c.classList.remove('active-ram', 'active-seq', 'opacity-20'); c.classList.add('text-gray-600'); });
    document.getElementById('calc-display').innerHTML = `<p class="text-white font-mono text-[10px]">Indirizzo = Indice ${idx} &times; 8 = <span class="text-neon-purple font-bold underline">Indirizzo ${idx * 8}</span></p>`;
    setTimeout(() => { const r = document.getElementById(`ram-${letter}`); if (r) { r.classList.add('active-ram'); r.classList.remove('text-gray-600'); } }, 150);
    const head = document.getElementById('read-head'); const track = document.querySelectorAll('#tape-track-static .access-cell');
    head.style.opacity = "1";
    for (let i = 0; i <= idx; i++) {
        head.style.left = `${track[i].offsetLeft}px`; head.style.width = `${track[i].offsetWidth}px`;
        track[i].classList.add('active-seq'); track[i].classList.remove('text-gray-600');
        await new Promise(r => setTimeout(r, 250)); if (i < idx) { track[i].classList.remove('active-seq'); track[i].classList.add('opacity-20'); }
    }
    isBusy = false;
}

/* --- REFRESH SIM --- */
let capacitors = [100, 0, 100, 100, 0, 100, 0, 0]; let refreshInterval = null;
function initRefreshSim() {
    const c = document.getElementById('refresh-sim-container'); if (!c) return;
    if (refreshInterval) clearInterval(refreshInterval); c.innerHTML = '';
    capacitors.forEach((charge, i) => {
        const b = document.createElement('div'); b.className = "flex flex-col items-center gap-3";
        b.innerHTML = `<div class="w-8 md:w-10 h-48 bg-gray-900 border border-white/10 rounded-full relative overflow-hidden flex flex-col justify-end"><div id="cap-fill-${i}" class="w-full capacitor-charge bg-neon-blue/40" style="height: ${charge}%"></div></div>
					   <div class="flex flex-col items-center"><span id="cap-val-${i}" class="font-mono text-lg font-bold ${charge > 0 ? 'text-white' : 'text-gray-700'}">${charge > 0 ? '1' : '0'}</span></div>`;
        c.appendChild(b);
    });
    const obs = new IntersectionObserver((es) => { if (es[0].isIntersecting) startDischarging(); }, { threshold: 0.5 });
    obs.observe(document.getElementById('refresh-sim-target'));
}
function startDischarging() {
    if (refreshInterval) clearInterval(refreshInterval); refreshInterval = setInterval(() => {
        capacitors.forEach((charge, i) => { if (charge > 0) { capacitors[i] = Math.max(0, charge - 0.8); const f = document.getElementById(`cap-fill-${i}`); if (f) f.style.height = capacitors[i] + "%"; if (capacitors[i] <= 0) { document.getElementById(`cap-val-${i}`).textContent = "0"; f.style.backgroundColor = "transparent"; } else if (capacitors[i] < 30) f.style.backgroundColor = "#ff3333"; } });
    }, 100);
}
function performRefresh() { capacitors.forEach((q, i) => { if (q > 0) { capacitors[i] = 100; const f = document.getElementById(`cap-fill-${i}`); f.style.height = "100%"; f.style.backgroundColor = ""; const v = document.getElementById(`cap-val-${i}`); v.textContent = "1"; v.className = "font-mono text-lg font-bold text-white"; } }); }

/* --- MATRIX SIM --- */
function initMatrixSim() {
    const m = document.getElementById('matrix-container'); if (!m) return; m.innerHTML = '';
    for (let r = 0; r < 8; r++) {
        const row = document.createElement('div'); row.className = "matrix-row flex items-center rounded py-1 border border-transparent hover:border-neon-purple/30";
        row.innerHTML = `<div class="row-addr w-10 text-[8px] font-mono text-gray-500 text-center font-bold">0x${(r * 8).toString(16).toUpperCase().padStart(2, '0')}</div>`;
        const bc = document.createElement('div'); bc.className = "flex-1 flex justify-center gap-1 px-2";
        for (let b = 0; b < 8; b++) { const on = Math.random() > 0.5; bc.innerHTML += `<div class="matrix-bit w-5 h-5 border border-white/10 rounded-[1px] font-mono text-[8px] font-bold ${on ? 'bg-neon-purple/60 text-white' : 'bg-black/80 text-gray-700'}">${on ? '1' : '0'}</div>`; }
        row.appendChild(bc); m.appendChild(row);
    }
}

// Esponi le funzioni globalmente
window.runBusCycle = runBusCycle;
window.startBootSequence = startBootSequence;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.nextFetchStep = nextFetchStep;
window.prevFetchStep = prevFetchStep;
window.changeClockSpeed = changeClockSpeed;
window.setSimMode = setSimMode;
window.startCpuGpuRace = startCpuGpuRace;
window.toggleRamPower = toggleRamPower;
window.requestFrom = requestFrom;
window.simulateUnifiedAccess = simulateUnifiedAccess;
window.performRefresh = performRefresh;
window.updateVisuals = updateVisuals;
window.updateFetchVisuals = updateFetchVisuals;
window.initRace = initRace;
window.initRamLesson = initRamLesson;
window.initAccessSim = initAccessSim;
window.initRefreshSim = initRefreshSim;
window.initMatrixSim = initMatrixSim;
