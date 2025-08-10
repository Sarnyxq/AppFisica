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
        
        // Gestione speciale per modalità storia con ID capitolo
        if (type === 'story') {
            // Verifica se è un ID di capitolo (formato numerico 1-10)
            const isChapterId = /^[1-9]|10$/.test(challengeId.toString());
            
            if (isChapterId) {
                // È un ID di capitolo - renderizza il modale del capitolo
                this.challengeModal.innerHTML = this.renderChapterModal(challengeId);
                this.challengeModal.classList.remove('hidden');
                this.bindChallengeModalEvents();
                document.body.classList.add('modal-open');
                gameState.openModal('chapter', { chapterId: challengeId, type });
                return;
            }
        }
        
        // Logica normale per sfide
        const challenge = castleData.challenges.find(c => c.id === challengeId);
        if (!challenge) {
            notificationSystem.show("Sfida non trovata!", "error");
            return;
        }

        // Gestione per modalità storia con sfida specifica
        if (type === 'story') {
            this.challengeModal.innerHTML = this.renderStoryModal(challenge);
        } else {
            this.challengeModal.innerHTML = this.renderChallengeModal(challenge, type);
        }
        
        this.challengeModal.classList.remove('hidden');
        this.bindChallengeModalEvents();
        document.body.classList.add('modal-open');

        // Inizializza canvas se necessario
        if (type === 'main' && window.canvasComponent) {
            setTimeout(() => {
                // Forza reinizializzazione completa del canvas per ogni sfida
                this.initializeCanvasForChallenge();
                this.loadChallengeData(challengeId);
                // Carica il contenuto della storia nel tab
                this.loadStoryContent(challengeId);
            }, 100);
        }

        gameState.openModal('challenge', { challengeId, type });
    }

    // Mostra la storia pre-sfida (seguendo pattern ApprendimentoMatematica1)
    showChallengeStory(challengeId) {
        const storyData = window.storyData.getStoryForChallenge(challengeId);
        if (!storyData || !storyData.challengeStory) {
            // Se non c'è storia, apri direttamente la sfida
            this.openChallengeModal(challengeId, 'main');
            return;
        }

        const challenge = castleData.challenges.find(c => c.id === challengeId);
        const storyModal = document.getElementById('challenge-story-modal');
        
        if (!storyModal) {
            console.error('Modal storia sfida non trovato!');
            return;
        }

        storyModal.innerHTML = `
            <div class="modal modal-backdrop fixed inset-0 flex items-center justify-center p-4 z-50">
                <div class="modal-content bg-pergamena border-4 border-ink rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                    <div class="p-6">
                        <div class="text-center mb-6">
                            <span class="text-6xl">${challenge?.badge?.icon || '📚'}</span>
                            <h2 class="text-2xl font-dnd text-ink-dark mt-2">
                                ${storyData.chapterTitle || 'Capitolo ' + Math.ceil(challengeId / 6)}
                            </h2>
                            <p class="text-ink-light text-sm mt-1">Prima di affrontare: ${challenge?.title || 'Sfida'}</p>
                        </div>
                        
                        <div class="story-content text-ink prose prose-lg max-w-none">
                            ${storyData.challengeStory.replace(/\n/g, '</p><p class="mb-4">')}
                        </div>
                        
                        <div class="flex justify-center gap-4 mt-8">
                            <button id="story-continue-btn" class="btn-primary px-8 py-3 text-lg">
                                ⚡ Affronta la Sfida
                            </button>
                            <button id="story-close-btn" class="btn-secondary px-6 py-3">
                                ❌ Chiudi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        storyModal.classList.remove('hidden');
        document.body.classList.add('modal-open');

        // Eventi
        document.getElementById('story-continue-btn').addEventListener('click', () => {
            this.closeChallengeStoryModal();
            this.openChallengeModal(challengeId, 'main');
        });

        document.getElementById('story-close-btn').addEventListener('click', () => {
            this.closeChallengeStoryModal();
        });

        // Chiudi cliccando lo sfondo
        storyModal.addEventListener('click', (e) => {
            if (e.target === storyModal) {
                this.closeChallengeStoryModal();
            }
        });
    }

    // Mostra la storia post-completamento
    showCompletionStory(challengeId) {
        const storyData = window.storyData.getStoryForChallenge(challengeId);
        if (!storyData || !storyData.chapterIntro) {
            return; // Nessuna storia di completamento
        }

        const challenge = castleData.challenges.find(c => c.id === challengeId);
        const completionModal = document.getElementById('completion-story-modal');
        
        if (!completionModal) {
            console.error('Modal storia completamento non trovato!');
            return;
        }

        completionModal.innerHTML = `
            <div class="modal modal-backdrop fixed inset-0 flex items-center justify-center p-4 z-50">
                <div class="modal-content bg-pergamena border-4 border-ink rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                    <div class="p-6">
                        <div class="text-center mb-6">
                            <span class="text-6xl">🎉</span>
                            <h2 class="text-2xl font-dnd text-ink-dark mt-2">
                                Sfida Completata!
                            </h2>
                            <p class="text-ink-light text-sm mt-1">${challenge?.title || 'Sfida'} superata con successo</p>
                        </div>
                        
                        <div class="story-content text-ink prose prose-lg max-w-none">
                            ${storyData.chapterIntro.replace(/\n/g, '</p><p class="mb-4">')}
                        </div>
                        
                        <div class="flex justify-center gap-4 mt-8">
                            <button id="completion-continue-btn" class="btn-primary px-8 py-3 text-lg">
                                ✨ Continua
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        completionModal.classList.remove('hidden');
        document.body.classList.add('modal-open');

        // Eventi
        document.getElementById('completion-continue-btn').addEventListener('click', () => {
            this.closeCompletionStoryModal();
        });

        // Chiudi cliccando lo sfondo
        completionModal.addEventListener('click', (e) => {
            if (e.target === completionModal) {
                this.closeCompletionStoryModal();
            }
        });
    }

    // Chiudi modal storia challenge
    closeChallengeStoryModal() {
        const storyModal = document.getElementById('challenge-story-modal');
        if (storyModal) {
            storyModal.classList.add('hidden');
            storyModal.innerHTML = '';
            document.body.classList.remove('modal-open');
        }
    }

    // Chiudi modal storia completamento
    closeCompletionStoryModal() {
        const completionModal = document.getElementById('completion-story-modal');
        if (completionModal) {
            completionModal.classList.add('hidden');
            completionModal.innerHTML = '';
            document.body.classList.remove('modal-open');
        }
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
                            <button id="story-tab-btn" class="tab-btn active px-4 py-2 font-semibold text-ink-dark border-b-2 border-gold">📖 Storia</button>
                            <button id="text-tab-btn" class="tab-btn px-4 py-2 font-semibold text-ink-light border-b-2 border-transparent hover:text-ink-dark">📝 Annotazioni</button>
                            <button id="drawing-tab-btn" class="tab-btn px-4 py-2 font-semibold text-ink-light border-b-2 border-transparent hover:text-ink-dark">🎨 Disegno del Sigillo</button>
                            <div class="ml-auto flex items-center gap-3 text-xs md:text-sm text-ink-light">
                                <span id="autosave-indicator" class="opacity-0 transition-opacity">💾 Salvato</span>
                            </div>
                        </div>
                    </div>

                    <!-- Body -->
                    <div class="challenge-body flex-1 overflow-y-auto px-4 md:px-6 pb-6">
                        <!-- Story Content Area -->
                        <div id="story-content-area" class="mb-6">
                            <div id="story-content" class="prose prose-lg max-w-none text-ink">
                                <!-- Il contenuto della storia verrà caricato qui -->
                            </div>
                        </div>
                        <!-- Text Input Area -->
                        <div id="text-input-area" class="hidden mb-6">
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
                            <button id="complete-challenge-btn-footer" class="btn-primary font-dnd text-sm md:text-base py-2 px-4 md:px-6 rounded-lg">🔨 Forgia</button>
                            <button id="cancel-modal-btn" class="btn-secondary py-2 px-4 rounded-lg">Annulla</button>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    // Nuovo metodo per renderizzare modale capitolo
    renderChapterModal(chapterId) {
        if (!window.storyData) {
            console.error('StoryData non disponibile per il capitolo', chapterId);
            return '<div class="p-8 text-center text-red-500">Errore: Dati storia non disponibili</div>';
        }
        
        const chapter = storyData.getChapterById(chapterId);
        if (!chapter) {
            console.error('Capitolo non trovato:', chapterId);
            return '<div class="p-8 text-center text-red-500">Errore: Capitolo non trovato</div>';
        }

        const completedRooms = chapter.rooms.filter(room => {
            const challenge = window.castleData?.getChallengeById(room.challengeId);
            return challenge && gameState.isChallengeCompleted(challenge.id);
        }).length;

        const totalRooms = chapter.rooms.length;
        const progressPercent = Math.round((completedRooms / totalRooms) * 100);

        return `
            <div class="modal modal-backdrop fixed inset-0 flex flex-col p-0 z-50">
                <div class="modal-content chapter-modal-content max-w-5xl mx-auto my-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                    <!-- Header Capitolo -->
                    <div class="chapter-header p-6 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-b-2 border-amber-400 flex-shrink-0">
                        <div class="flex items-start justify-between">
                            <div class="flex items-center gap-4">
                                <span class="text-5xl">📚</span>
                                <div>
                                    <h2 class="text-3xl font-dnd text-amber-200 mb-2">${chapter.title}</h2>
                                    <p class="text-amber-100/80 text-lg italic">Capitolo ${chapter.id}</p>
                                    <div class="flex items-center gap-4 mt-2">
                                        <span class="text-sm text-amber-200">Progresso: ${completedRooms}/${totalRooms}</span>
                                        <div class="w-32 bg-amber-900/30 rounded-full h-2">
                                            <div class="bg-gradient-to-r from-amber-400 to-yellow-300 h-2 rounded-full" style="width: ${progressPercent}%"></div>
                                        </div>
                                        <span class="text-sm text-amber-200">${progressPercent}%</span>
                                    </div>
                                </div>
                            </div>
                            <button id="close-modal-btn" class="text-amber-200 hover:text-white text-4xl font-bold leading-none transition-colors">×</button>
                        </div>
                    </div>

                    <!-- Introduzione Capitolo -->
                    <div class="chapter-intro p-6 bg-amber-500/10 border-l-4 border-amber-400 mx-6 mt-4 rounded-r-lg flex-shrink-0">
                        <div class="text-amber-100/90 leading-relaxed font-serif text-lg">
                            ${chapter.introduction}
                        </div>
                    </div>

                    <!-- Lista Stanze -->
                    <div class="chapter-rooms flex-1 overflow-y-auto p-6">
                        <h3 class="text-2xl font-dnd text-purple-200 mb-4 text-center">🏛️ Stanze del Capitolo</h3>
                        <div class="rooms-grid grid gap-4">
                            ${chapter.rooms.map((room, index) => {
                                const challenge = window.castleData?.getChallengeById(room.challengeId);
                                const isCompleted = challenge && gameState.isChallengeCompleted(challenge.id);
                                const isUnlocked = index === 0 || chapter.rooms.slice(0, index).every(prevRoom => {
                                    const prevChallenge = window.castleData?.getChallengeById(prevRoom.challengeId);
                                    return prevChallenge && gameState.isChallengeCompleted(prevChallenge.id);
                                });

                                return `
                                    <div class="room-card bg-purple-900/30 border border-purple-400/40 rounded-lg p-4 ${isUnlocked ? 'cursor-pointer hover:bg-purple-800/40 transition-all' : 'opacity-60'}">
                                        <div class="flex items-start gap-4">
                                            <div class="room-icon text-3xl flex-shrink-0">
                                                ${isCompleted ? '✅' : isUnlocked ? '🚪' : '🔒'}
                                            </div>
                                            <div class="room-content flex-1">
                                                <h4 class="font-dnd text-lg text-purple-100 mb-2">
                                                    Stanza ${index + 1}: ${challenge ? challenge.title : 'Sfida Sconosciuta'}
                                                </h4>
                                                <div class="room-story text-purple-200/80 text-sm mb-3 font-serif leading-relaxed">
                                                    ${room.storyText.length > 200 ? room.storyText.substring(0, 200) + '...' : room.storyText}
                                                </div>
                                                ${isUnlocked ? `
                                                    <button class="btn-room-challenge btn-primary text-sm py-2 px-4 rounded-lg font-dnd" data-challenge-id="${room.challengeId}">
                                                        ${isCompleted ? '🔄 Ripeti Sfida' : '⚔️ Affronta Sfida'}
                                                    </button>
                                                ` : `
                                                    <span class="text-purple-400/60 text-sm italic">Completa la stanza precedente per sbloccare</span>
                                                `}
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Azioni Capitolo -->
                    <div class="chapter-actions p-6 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-t border-blue-400/30 flex-shrink-0">
                        <div class="flex justify-center gap-4">
                            <button id="continue-chapter-btn" class="btn-primary bg-purple-600 hover:bg-purple-500 text-purple-100 font-dnd text-lg py-2 px-6 rounded-lg transition-all">
                                📖 Continua dal Punto Attuale
                            </button>
                            <button id="back-to-story-btn" class="btn-secondary bg-gray-600 hover:bg-gray-500 text-gray-100 font-dnd text-lg py-2 px-6 rounded-lg transition-all">
                                🔙 Torna alla Storia
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Nuovo metodo per renderizzare modale storia
    renderStoryModal(challenge) {
        const storyContent = window.storyData ? storyData.getStoryForChallenge(challenge.id) : null;
        
        if (!storyContent) {
            console.warn(`Storia non trovata per la sfida ${challenge.id}`);
            // Fallback al modale normale se non c'è storia
            return this.renderChallengeModal(challenge, 'main');
        }
        
        return `
            <div class="modal modal-backdrop fixed inset-0 flex flex-col p-0 z-50">
                <div class="modal-content story-modal-content max-w-4xl mx-auto my-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-xl overflow-hidden shadow-2xl">
                    <!-- Header -->
                    <div class="story-header p-6 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-b-2 border-amber-400">
                        <div class="flex items-start justify-between">
                            <div class="flex items-center gap-4">
                                <span class="text-5xl">📖</span>
                                <div>
                                    <h2 class="text-3xl font-dnd text-amber-200 mb-2">${challenge.title}</h2>
                                    <p class="text-amber-100/80 text-lg italic">${storyContent.chapterTitle}</p>
                                </div>
                            </div>
                            <button id="close-modal-btn" class="text-amber-200 hover:text-white text-4xl font-bold leading-none transition-colors">×</button>
                        </div>
                    </div>
                    
                    <!-- Story Content -->
                    <div class="story-narrative p-6 overflow-y-auto max-h-96">
                        <div class="story-chapter-intro bg-amber-500/10 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
                            <h3 class="text-amber-300 font-bold mb-2 flex items-center gap-2">
                                <span>🏛️</span>
                                <span>Prologo del Capitolo</span>
                            </h3>
                            <p class="text-amber-100/90 leading-relaxed">${storyContent.chapterIntro}</p>
                        </div>
                        
                        <div class="story-challenge bg-purple-500/10 border border-purple-400/30 rounded-lg p-5">
                            <h3 class="text-purple-300 font-bold mb-3 flex items-center gap-2 text-xl">
                                <span>⚔️</span>
                                <span>La Storia della Sfida:</span>
                            </h3>
                            <div class="story-text text-purple-100/90 text-lg leading-relaxed font-serif">
                                ${storyContent.challengeStory}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="story-actions p-6 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-t border-blue-400/30">
                        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button id="start-challenge-btn" class="btn-primary bg-amber-600 hover:bg-amber-500 text-amber-100 font-dnd text-xl py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105">
                                🎯 Inizia la Sfida
                            </button>
                            <button id="story-continue-btn" class="btn-secondary bg-purple-600 hover:bg-purple-500 text-purple-100 font-dnd text-lg py-2 px-6 rounded-lg transition-all">
                                📚 Continua a Leggere
                            </button>
                        </div>
                        
                        <div class="mt-4 text-center">
                            <p class="text-blue-200/70 text-sm">
                                Ricompensa: <span class="text-amber-300 font-bold">${challenge.exp} EXP + ${challenge.badge.icon} ${challenge.badge.name}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
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
        
        // Click sul backdrop per chiudere
        this.challengeModal.addEventListener('click', (e) => { 
            if (e.target === this.challengeModal) this.closeChallengeModal(); 
        });
        
        // Gestione eventi per modal capitolo
        const roomChallengeButtons = this.challengeModal.querySelectorAll('.btn-room-challenge');
        if (roomChallengeButtons.length > 0) {
            roomChallengeButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const challengeId = btn.dataset.challengeId;
                    if (challengeId) {
                        // Chiudi il modal del capitolo e apri la sfida in modalità storia
                        this.closeChallengeModal();
                        setTimeout(() => {
                            this.openChallengeModal(challengeId, 'story');
                        }, 200);
                    }
                });
            });
        }

        const continueChapterBtn = this.challengeModal.querySelector('#continue-chapter-btn');
        if (continueChapterBtn) {
            continueChapterBtn.addEventListener('click', () => {
                // Torna alla modalità storia e continua dal punto attuale
                if (window.storyMode) {
                    this.closeChallengeModal();
                    setTimeout(() => {
                        storyMode.continueStory();
                    }, 200);
                }
            });
        }

        const backToStoryBtn = this.challengeModal.querySelector('#back-to-story-btn');
        if (backToStoryBtn) {
            backToStoryBtn.addEventListener('click', () => {
                // Torna alla vista principale della storia
                this.closeChallengeModal();
                if (window.header) {
                    setTimeout(() => {
                        header.navigate('story');
                    }, 200);
                }
            });
        }
        
        // Gestione pulsanti specifici per modalità storia
        if (this.currentModalType === 'story') {
            const startChallengeBtn = this.challengeModal.querySelector('#start-challenge-btn');
            const storyContinueBtn = this.challengeModal.querySelector('#story-continue-btn');
            
            if (startChallengeBtn) {
                startChallengeBtn.addEventListener('click', () => {
                    // Chiudi il modale storia e apri il modale normale
                    this.closeChallengeModal();
                    setTimeout(() => {
                        this.openChallengeModal(this.currentChallengeId, 'main');
                    }, 200);
                });
            }
            
            if (storyContinueBtn) {
                storyContinueBtn.addEventListener('click', () => this.closeChallengeModal());
            }
        } else {
            // Gestione normale per modali non-storia
            const completeBtn = this.challengeModal.querySelector('#complete-challenge-btn');
            if (completeBtn) completeBtn.addEventListener('click', () => this.handleCompleteChallenge());
            
            if (this.currentModalType === 'main') this.bindTabEvents();
            
            const textResponse = this.challengeModal.querySelector('#text-response');
            if (textResponse) {
                let autosaveTimer = null;
                textResponse.addEventListener('input', () => {
                    clearTimeout(autosaveTimer);
                    autosaveTimer = setTimeout(() => this.autoSaveChallengeDraft(), 500);
                });
            }
            
            document.addEventListener('canvasChanged', this._canvasChangeHandler = () => this.debouncedCanvasSave());
            
            const completeFooter = this.challengeModal.querySelector('#complete-challenge-btn-footer');
            if (completeFooter) completeFooter.addEventListener('click', () => this.handleCompleteChallenge());
        }
        
        // Gestione ESC key per tutti i tipi di modale
        if (!this._escHandler) this._escHandler = this.handleEscKey.bind(this);
        document.addEventListener('keydown', this._escHandler);
    }

    bindTabEvents() {
        const storyTabBtn = this.challengeModal.querySelector('#story-tab-btn');
        const textTabBtn = this.challengeModal.querySelector('#text-tab-btn');
        const drawingTabBtn = this.challengeModal.querySelector('#drawing-tab-btn');
        const storyArea = this.challengeModal.querySelector('#story-content-area');
        const textArea = this.challengeModal.querySelector('#text-input-area');
        const drawingArea = this.challengeModal.querySelector('#drawing-input-area');
        
        if (storyTabBtn && textTabBtn && drawingTabBtn && storyArea && textArea && drawingArea) {
            storyTabBtn.addEventListener('click', () => this.switchTab('story', storyTabBtn, textTabBtn, drawingTabBtn, storyArea, textArea, drawingArea));
            textTabBtn.addEventListener('click', () => this.switchTab('text', storyTabBtn, textTabBtn, drawingTabBtn, storyArea, textArea, drawingArea));
            drawingTabBtn.addEventListener('click', () => {
                this.switchTab('drawing', storyTabBtn, textTabBtn, drawingTabBtn, storyArea, textArea, drawingArea);
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

    switchTab(activeTab, storyBtn, textBtn, drawingBtn, storyArea, textArea, drawingArea) {
        // Reset tutti i pulsanti
        [storyBtn, textBtn, drawingBtn].forEach(btn => {
            btn.classList.remove('active', 'border-gold', 'text-ink-dark');
            btn.classList.add('text-ink-light', 'border-transparent');
        });

        // Reset tutte le aree
        [storyArea, textArea, drawingArea].forEach(area => {
            area.classList.add('hidden');
        });

        // Attiva il tab selezionato
        if (activeTab === 'story') {
            storyBtn.classList.add('active', 'border-gold', 'text-ink-dark');
            storyBtn.classList.remove('text-ink-light', 'border-transparent');
            storyArea.classList.remove('hidden');
        } else if (activeTab === 'text') {
            textBtn.classList.add('active', 'border-gold', 'text-ink-dark');
            textBtn.classList.remove('text-ink-light', 'border-transparent');
            textArea.classList.remove('hidden');
        } else if (activeTab === 'drawing') {
            drawingBtn.classList.add('active', 'border-gold', 'text-ink-dark');
            drawingBtn.classList.remove('text-ink-light', 'border-transparent');
            drawingArea.classList.remove('hidden');
        }
    }

    // Carica il contenuto della storia nel tab
    loadStoryContent(challengeId) {
        const storyContent = this.challengeModal.querySelector('#story-content');
        if (!storyContent) return;

        const storyData = window.storyData.getStoryForChallenge(challengeId);
        if (!storyData || !storyData.challengeStory) {
            storyContent.innerHTML = `
                <div class="text-center py-8 text-ink-light">
                    <span class="text-4xl">📜</span>
                    <p class="mt-2">Nessuna storia disponibile per questa sfida.</p>
                </div>
            `;
            return;
        }

        const challenge = castleData.challenges.find(c => c.id === challengeId);
        storyContent.innerHTML = `
            <div class="text-center mb-6">
                <span class="text-5xl">${challenge?.badge?.icon || '📚'}</span>
                <h3 class="text-xl font-dnd text-ink-dark mt-2">
                    ${storyData.chapterTitle || 'Capitolo ' + Math.ceil(challengeId / 6)}
                </h3>
            </div>
            <div class="story-text text-ink leading-relaxed">
                ${storyData.challengeStory.replace(/\n/g, '</p><p class="mb-4">')}
            </div>
        `;
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
            
            // Mostra la storia di completamento se disponibile (pattern ApprendimentoMatematica1)
            this.showCompletionStory(this.currentChallengeId);
            
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
