// MODALS - Fisica 3.0
// Sistema di modali per il Grimorio dell'Apprendista Stregone

class Modals {
    constructor() {
        this.challengeModal = null;
        this.currentChallengeId = null;
        this.currentModalType = null;
        this.isInitialized = false;
    }

    // Inizializza il sistema di modali
    init() {
        this.challengeModal = document.getElementById('challenge-modal');
        if (!this.challengeModal) {
            console.error('Container modale sfida non trovato!');
            return false;
        }
        this.isInitialized = true;
        return true;
    }

    // Apri il modale della sfida
    openChallengeModal(challengeId, type = 'main') {
        if (!this.challengeModal) {
            console.error('Sistema modali non inizializzato!');
            return;
        }

        this.currentChallengeId = challengeId;
        this.currentModalType = type;
        
        const challenge = castleData.challenges.find(c => c.id === challengeId);
        if (!challenge) {
            notificationSystem.show("Sfida non trovata!", "error");
            return;
        }

        this.challengeModal.innerHTML = this.renderChallengeModal(challenge, type);
        this.challengeModal.classList.remove('hidden');
        this.bindChallengeModalEvents();
        document.body.classList.add('modal-open');

        // Inizializza canvas se necessario
        if (type === 'main' && window.canvasComponent) {
            setTimeout(() => {
                // Forza reinizializzazione completa del canvas per ogni sfida
                this.initializeCanvasForChallenge();
                this.loadChallengeData(challengeId);
            }, 100);
        }

        gameState.openModal('challenge', { challengeId, type });
    }

    // Renderizza il modale della sfida
    renderChallengeModal(challenge, type) {
        if (type === 'side') {
            return this.renderSideQuestModal(challenge);
        }

        return `
            <div class="modal modal-backdrop fixed inset-0 flex flex-col p-0 z-50">
                <div class="modal-content challenge-fullscreen">
                    <!-- Header -->
                    <div class="p-4 md:p-6 border-b-2 border-ink flex items-start justify-between gap-4 bg-pergamena-dark/60">
                        <div class="flex items-center gap-4 flex-grow">
                            <span class="text-4xl">${challenge.badge.icon}</span>
                            <div>
                                <h2 class="text-2xl md:text-3xl font-dnd text-ink-dark">${challenge.title}</h2>
                                <p class="text-ink-light text-sm md:text-base">${challenge.desc}</p>
                                <div class="flex flex-wrap gap-2 mt-2 text-xs md:text-sm">
                                    <span class="bg-amber-200/50 px-2 py-1 rounded font-semibold text-ink-dark">🧠 ${challenge.reference}</span>
                                    <span class="bg-gold/20 px-2 py-1 rounded font-semibold text-ink-dark">🎯 ${challenge.exp} EXP + ${challenge.badge.icon} ${challenge.badge.name}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col items-end gap-2">
                            <button id="close-modal-btn" class="text-ink-light hover:text-ink-dark text-3xl font-bold leading-none">×</button>
                            <button id="complete-challenge-btn" class="btn-primary font-dnd text-lg py-2 px-4 rounded-lg hidden md:block">🔨 Forgia</button>
                        </div>
                    </div>

                    <!-- Tabs -->
                    <div class="px-4 md:px-6 pt-4 border-b border-ink/20 bg-pergamena-dark/30">
                        <div class="flex border-b border-ink/20 gap-2 flex-wrap">
                            <button id="text-tab-btn" class="tab-btn active px-4 py-2 font-semibold text-ink-dark border-b-2 border-gold">📝 Annotazioni</button>
                            <button id="drawing-tab-btn" class="tab-btn px-4 py-2 font-semibold text-ink-light border-b-2 border-transparent hover:text-ink-dark">🎨 Disegno del Sigillo</button>
                            <div class="ml-auto flex items-center gap-3 text-xs md:text-sm text-ink-light">
                                <span id="autosave-indicator" class="opacity-0 transition-opacity">💾 Salvato</span>
                            </div>
                        </div>
                    </div>

                    <!-- Body -->
                    <div class="challenge-body flex-1 overflow-y-auto px-4 md:px-6 pb-6">
                        <!-- Text Input Area -->
                        <div id="text-input-area" class="mb-6">
                            <label class="block text-sm font-semibold text-ink-dark mb-2">Scrivi le tue riflessioni e annotazioni:</label>
                            <textarea id="text-response" class="w-full h-40 md:h-56 p-3 border-2 border-ink-light rounded bg-pergamena text-ink resize-none" placeholder="Descrivi quello che hai imparato, scrivi formule importanti, o annota concetti chiave..."></textarea>
                        </div>
                        <!-- Drawing Input Area -->
                        <div id="drawing-input-area" class="hidden mb-6">
                            <div id="canvas-container"></div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="challenge-footer p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-pergamena-dark/60">
                        <p class="text-sm md:text-lg font-bold text-ink-dark text-center sm:text-left">Ricompensa: <span class="text-gold">${challenge.exp} EXP + ${challenge.badge.icon} ${challenge.badge.name}</span></p>
                        <div class="flex gap-2 w-full sm:w-auto justify-center">
                            <button id="complete-challenge-btn-mobile" class="btn-primary font-dnd text-lg py-2 px-6 rounded-lg md:hidden">🔨 Forgia il Sigillo</button>
                            <button id="cancel-modal-btn" class="btn-secondary py-2 px-4 rounded-lg">Annulla</button>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    // Renderizza il modale della missione secondaria
    renderSideQuestModal(challenge) {
        return `
            <div class="modal modal-backdrop fixed inset-0 flex flex-col p-0 z-50">
                <div class="modal-content challenge-fullscreen">
                    <div class="p-4 md:p-6 border-b-2 border-ink flex items-start justify-between gap-4 bg-pergamena-dark/60">
                        <div class="flex items-center gap-4 flex-grow">
                            <span class="text-4xl">${challenge.sideQuest.badge.icon}</span>
                            <div>
                                <h2 class="text-2xl md:text-3xl font-dnd text-ink-dark">Missione Secondaria</h2>
                                <p class="text-ink-light text-sm md:text-base">Il Rito della Pratica</p>
                            </div>
                        </div>
                        <button id="close-modal-btn" class="text-ink-light hover:text-ink-dark text-3xl font-bold leading-none">×</button>
                    </div>
                    <div class="challenge-body flex-1 overflow-y-auto px-4 md:px-6 pb-6">
                        <!-- Body -->
                        <div class="text-center mb-6 mt-4">
                            <div class="text-6xl mb-4">📿✨🧠</div>
                            <h3 class="text-xl font-dnd text-ink-dark mb-4">Il Rito della Pratica</h3>
                        </div>
                        <div class="space-y-4 text-ink-light max-w-3xl mx-auto">
                            <p>Hai acquisito la conoscenza teorica di <strong class="text-ink-dark">"${challenge.title}"</strong>. Ora è tempo di consolidarla attraverso la pratica.</p>
                            <p><strong class="text-ink-dark">Il Rito:</strong> Completa almeno 2 esercizi pratici dal tuo grimorio (libro di testo) relativi a questo argomento.</p>
                            <p>Una volta completati gli esercizi, torna qui per forgiare il <strong class="text-ink-dark">${challenge.sideQuest.badge.icon} ${challenge.sideQuest.badge.name}</strong>, simbolo della tua dedizione e maestria pratica.</p>
                        </div>
                        <div class="card p-4 mt-6 bg-gold/10 max-w-3xl mx-auto">
                            <h4 class="font-bold text-ink-dark mb-2">💡 Suggerimenti per la Pratica:</h4>
                            <ul class="text-sm text-ink-light space-y-1 list-disc pl-4 text-left">
                                <li>Risolvi gli esercizi senza guardare subito la soluzione</li>
                                <li>Cerca di capire il <em>perché</em> di ogni passaggio</li>
                                <li>Se sbagli, analizza l'errore per imparare</li>
                                <li>Prova esercizi di diversa difficoltà</li>
                            </ul>
                        </div>
                    </div>
                    <div class="challenge-footer p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-pergamena-dark/60">
                        <p class="text-sm md:text-lg font-bold text-ink-dark text-center sm:text-left">Ricompensa: <span class="text-magic-purple">${Math.floor(challenge.exp / 2)} EXP + ${challenge.sideQuest.badge.icon} ${challenge.sideQuest.badge.name}</span></p>
                        <div class="flex gap-2 w-full sm:w-auto justify-center">
                            <button id="complete-challenge-btn" class="btn-primary font-dnd text-lg py-2 px-6 rounded-lg">📿 Ho Completato la Pratica</button>
                            <button id="cancel-modal-btn" class="btn-secondary py-2 px-4 rounded-lg">Chiudi</button>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    // Associa gli eventi del modale sfida
    bindChallengeModalEvents() {
        if (!this.challengeModal) return;
        const closeBtn = this.challengeModal.querySelector('#close-modal-btn');
        const cancelBtn = this.challengeModal.querySelector('#cancel-modal-btn');
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeChallengeModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeChallengeModal());
        this.challengeModal.addEventListener('click', (e) => { if (e.target === this.challengeModal) this.closeChallengeModal(); });
        const completeBtn = this.challengeModal.querySelector('#complete-challenge-btn');
        if (completeBtn) completeBtn.addEventListener('click', () => this.handleCompleteChallenge());
        if (this.currentModalType === 'main') this.bindTabEvents();
        if (!this._escHandler) this._escHandler = this.handleEscKey.bind(this);
        document.addEventListener('keydown', this._escHandler);
        const textResponse = this.challengeModal.querySelector('#text-response');
        if (textResponse) {
            let autosaveTimer = null;
            textResponse.addEventListener('input', () => {
                clearTimeout(autosaveTimer);
                autosaveTimer = setTimeout(() => this.autoSaveChallengeDraft(), 500);
            });
        }
        document.addEventListener('canvasChanged', this._canvasChangeHandler = () => this.debouncedCanvasSave());
        const completeMobile = this.challengeModal.querySelector('#complete-challenge-btn-mobile');
        if (completeMobile) completeMobile.addEventListener('click', () => this.handleCompleteChallenge());
    }

    bindTabEvents() {
        const textTabBtn = this.challengeModal.querySelector('#text-tab-btn');
        const drawingTabBtn = this.challengeModal.querySelector('#drawing-tab-btn');
        const textArea = this.challengeModal.querySelector('#text-input-area');
        const drawingArea = this.challengeModal.querySelector('#drawing-input-area');
        if (textTabBtn && drawingTabBtn && textArea && drawingArea) {
            textTabBtn.addEventListener('click', () => this.switchTab('text', textTabBtn, drawingTabBtn, textArea, drawingArea));
            drawingTabBtn.addEventListener('click', () => {
                this.switchTab('drawing', textTabBtn, drawingTabBtn, textArea, drawingArea);
                // Assicurati che il canvas sia visibile e correttamente dimensionato
                if (window.canvasComponent) { 
                    console.log('🎨 [Modals] Switching to drawing tab - reinitializing canvas...');
                    canvasComponent.onShown();
                    // Aggiungi un resize aggiuntivo dopo che il DOM si è stabilizzato
                    setTimeout(() => {
                        canvasComponent.smartResize(true);
                        console.log('🔧 [Modals] Canvas resized on tab switch');
                    }, 100);
                }
            });
        }
    }

    switchTab(activeTab, textBtn, drawingBtn, textArea, drawingArea) {
        if (activeTab === 'text') {
            textBtn.classList.add('active', 'border-gold', 'text-ink-dark');
            textBtn.classList.remove('text-ink-light', 'border-transparent');
            drawingBtn.classList.remove('active', 'border-gold', 'text-ink-dark');
            drawingBtn.classList.add('text-ink-light', 'border-transparent');
            textArea.classList.remove('hidden');
            drawingArea.classList.add('hidden');
        } else {
            drawingBtn.classList.add('active', 'border-gold', 'text-ink-dark');
            drawingBtn.classList.remove('text-ink-light', 'border-transparent');
            textBtn.classList.remove('active', 'border-gold', 'text-ink-dark');
            textBtn.classList.add('text-ink-light', 'border-transparent');
            drawingArea.classList.remove('hidden');
            textArea.classList.add('hidden');
        }
    }

    handleCompleteChallenge() {
        if (this.currentModalType === 'side') {
            const success = gameState.completeSideQuest(this.currentChallengeId);
            if (success) {
                this.closeChallengeModal();
                notificationSystem.show("Rito della Pratica completato! La tua dedizione è stata ricompensata.", "success");
            }
            return;
        }
        const textResponse = this.challengeModal.querySelector('#text-response');
        const text = textResponse ? textResponse.value.trim() : '';
        let drawing = '';
        if (window.canvasComponent) drawing = canvasComponent.getCanvasData();
        if (!text && !drawing) {
            notificationSystem.show("Scrivi qualche annotazione o disegna un sigillo prima di procedere!", "warning");
            return;
        }
        const challengeData = { text, drawing };
        const success = gameState.completeChallenge(this.currentChallengeId, challengeData);
        if (success) {
            this.closeChallengeModal();
            notificationSystem.show("Sigillo forgiato con successo! La conoscenza è ora tua.", "success");
        }
    }

    loadChallengeData(challengeId) {
        const savedData = storageManager.loadChallengeData(challengeId);
        const textResponse = this.challengeModal.querySelector('#text-response');
        if (textResponse && savedData.text) textResponse.value = savedData.text;
        if (window.canvasComponent && savedData.drawing) canvasComponent.loadCanvasData(savedData.drawing);
    }

    closeChallengeModal() {
        console.log('🚪 [Modals] Chiusura modale sfida...');
        
        // Cleanup del canvas se esiste
        if (window.canvasComponent && canvasComponent.isInitialized) {
            console.log('🎨 [Modals] Cleanup canvas in corso...');
            canvasComponent.hideEraserCursor();
            canvasComponent.hidePenCursor();
            // Non resettiamo isInitialized qui per permettere il riutilizzo
        }
        
        if (this.challengeModal) { 
            this.challengeModal.classList.add('hidden'); 
            this.challengeModal.innerHTML=''; 
        }
        this.currentChallengeId = null; 
        this.currentModalType = null; 
        gameState.closeModal(); 
        document.body.classList.remove('modal-open');
        
        if (this._escHandler) document.removeEventListener('keydown', this._escHandler);
        if (this._canvasChangeHandler) { 
            document.removeEventListener('canvasChanged', this._canvasChangeHandler); 
            this._canvasChangeHandler = null; 
        }
        
        console.log('✅ [Modals] Modale chiuso e cleanup completato');
    }

    handleEscKey(e) { if (e.key === 'Escape') this.closeChallengeModal(); }

    autoSaveChallengeDraft() {
        if (!this.currentChallengeId) return;
        const textEl = this.challengeModal ? this.challengeModal.querySelector('#text-response') : null;
        const text = textEl ? textEl.value : '';
        let drawing = '';
        if (window.canvasComponent && canvasComponent.isInitialized) drawing = canvasComponent.getCanvasData();
        if (window.storageManager) storageManager.saveChallengeData(this.currentChallengeId, { text, drawing });
        const indicator = document.getElementById('autosave-indicator');
        if (indicator) {
            indicator.classList.remove('opacity-0'); indicator.classList.add('opacity-100');
            clearTimeout(this._autosaveHideTimer);
            this._autosaveHideTimer = setTimeout(() => indicator.classList.add('opacity-0'), 1500);
        }
    }

    debouncedCanvasSave() {
        clearTimeout(this._canvasSaveTimer);
        this._canvasSaveTimer = setTimeout(() => this.autoSaveChallengeDraft(), 800);
    }

    // Reinizializza completamente il canvas per ogni nuova sfida
    initializeCanvasForChallenge() {
        console.log('🎨 [Modals] Reinizializzazione canvas per nuova sfida...');
        
        if (!window.canvasComponent) {
            console.warn('[Modals] CanvasComponent non disponibile');
            return;
        }

        try {
            // Reset dello stato di inizializzazione per forzare re-init completo
            canvasComponent.isInitialized = false;
            
            // Cleanup degli observer precedenti se esistono
            if (canvasComponent._resizeObserver) {
                canvasComponent._resizeObserver.disconnect();
                canvasComponent._resizeObserver = null;
            }
            if (canvasComponent._mutationObserver) {
                canvasComponent._mutationObserver.disconnect();
                canvasComponent._mutationObserver = null;
            }
            
            // Rimuovi event listeners dei cursori dalla pagina precedente
            canvasComponent.hideEraserCursor();
            canvasComponent.hidePenCursor();
            
            // Reset delle proprietà interne
            canvasComponent.canvas = null;
            canvasComponent.ctx = null;
            canvasComponent.isDrawing = false;
            canvasComponent._initRetries = 0;
            
            // Inizializzazione completa
            const initSuccess = canvasComponent.init();
            
            if (initSuccess) {
                console.log('✅ [Modals] Canvas reinizializzato con successo');
                
                // Forza un resize immediato per assicurarsi che le dimensioni siano corrette
                setTimeout(() => {
                    canvasComponent.smartResize(true);
                    console.log('🔧 [Modals] Canvas ridimensionato forzatamente');
                }, 50);
                
                // Secondo tentativo di resize dopo un breve delay per DOM stabilizzato
                setTimeout(() => {
                    canvasComponent.smartResize(true);
                    console.log('🔧 [Modals] Secondo resize canvas completato');
                }, 200);
                
            } else {
                console.error('❌ [Modals] Fallimento reinizializzazione canvas');
            }
            
        } catch (error) {
            console.error('❌ [Modals] Errore durante reinizializzazione canvas:', error);
        }
    }
}

if (!window.modals) {
    const modals = new Modals();
    window.modals = modals;
    document.addEventListener('DOMContentLoaded', () => { modals.init(); });
}
