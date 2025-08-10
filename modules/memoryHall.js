// MEMORY HALL - Fisica 3.0
// Modulo per la revisione e il ripasso delle sfide completate

class MemoryHall {
    constructor() {
        this.container = null;
        this.isInitialized = false;
        this.reviewQueue = [];
        this.currentReview = null;
        this.reviewMode = 'spaced'; // spaced, random, zone
        this.difficultyChallenges = new Set();
        this.spacedRepetitionIntervals = [1, 3, 7, 14, 30]; // giorni
    }

    // Inizializza il modulo
    init() {
        this.container = document.getElementById('main-content');
        if (!this.container) {
            console.error('Container principale non trovato!');
            return false;
        }
        this.loadDifficultyChallenges();
        this.isInitialized = true;
        return true;
    }

    // Carica le sfide marcate come difficili
    loadDifficultyChallenges() {
        const saved = storageManager.getData('difficultyChallenges');
        if (saved && Array.isArray(saved)) {
            this.difficultyChallenges = new Set(saved);
        }
    }

    // Salva le sfide marcate come difficili
    saveDifficultyChallenges() {
        storageManager.saveData('difficultyChallenges', Array.from(this.difficultyChallenges));
    }

    // Renderizza la sala della memoria
    render() {
        if (!this.container) {
            console.error('Memory Hall non inizializzato!');
            return;
        }

        const completedChallenges = this.getCompletedChallenges();
        const reviewData = this.calculateReviewData(completedChallenges);

        this.container.innerHTML = `
            <div class="text-center mb-8">
                <h2 class="text-4xl font-dnd text-ink-dark mb-4">🧠 Sala della Memoria</h2>
                <p class="text-lg text-ink-light max-w-3xl mx-auto mb-6">
                    Ripassa le conoscenze acquisite per consolidare l'apprendimento. 
                    La ripetizione distanziata ti aiuterà a memorizzare meglio i concetti fisici.
                </p>
                ${this.renderOverviewStats(reviewData)}
            </div>

            ${this.renderReviewOptions(reviewData)}
            ${this.renderReviewProgress()}
            ${completedChallenges.length > 0 ? this.renderCompletedChallenges(completedChallenges) : this.renderNoChallenges()}
        `;

        this.bindEvents();
        gameState.changeView('memory');
    }

    // Ottieni le sfide completate
    getCompletedChallenges() {
        const completed = [];
        
        // Sfide principali completate
        gameState.playerState.completedChallenges.forEach(challengeId => {
            const challenge = castleData.challenges.find(c => c.id === challengeId);
            if (challenge) {
                completed.push({
                    ...challenge,
                    type: 'main',
                    completedDate: this.getCompletionDate(challengeId, 'main'),
                    isDifficult: this.difficultyChallenges.has(`${challengeId}_main`),
                    reviewCount: this.getReviewCount(challengeId, 'main'),
                    lastReviewDate: this.getLastReviewDate(challengeId, 'main')
                });
            }
        });

        // Missioni secondarie completate
        gameState.playerState.completedSideQuests.forEach(challengeId => {
            const challenge = castleData.challenges.find(c => c.id === challengeId);
            if (challenge) {
                completed.push({
                    ...challenge,
                    type: 'side',
                    completedDate: this.getCompletionDate(challengeId, 'side'),
                    isDifficult: this.difficultyChallenges.has(`${challengeId}_side`),
                    reviewCount: this.getReviewCount(challengeId, 'side'),
                    lastReviewDate: this.getLastReviewDate(challengeId, 'side')
                });
            }
        });

        return completed.sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));
    }

    // Calcola i dati per il ripasso
    calculateReviewData(completedChallenges) {
        const dueForReview = this.getDueForReview(completedChallenges);
        const difficultCount = completedChallenges.filter(c => c.isDifficult).length;
        const totalReviews = completedChallenges.reduce((sum, c) => sum + c.reviewCount, 0);

        return {
            totalCompleted: completedChallenges.length,
            dueForReview: dueForReview.length,
            difficultCount,
            totalReviews,
            dueList: dueForReview
        };
    }

    // Ottieni le sfide da ripassare
    getDueForReview(completedChallenges) {
        const now = new Date();
        return completedChallenges.filter(challenge => {
            if (challenge.isDifficult) return true; // Le difficili sono sempre da ripassare
            
            const daysSinceCompletion = Math.floor((now - new Date(challenge.completedDate)) / (1000 * 60 * 60 * 24));
            const daysSinceLastReview = challenge.lastReviewDate ? 
                Math.floor((now - new Date(challenge.lastReviewDate)) / (1000 * 60 * 60 * 24)) : 
                daysSinceCompletion;
            
            const nextInterval = this.spacedRepetitionIntervals[Math.min(challenge.reviewCount, this.spacedRepetitionIntervals.length - 1)];
            return daysSinceLastReview >= nextInterval;
        });
    }

    // Renderizza le statistiche generali
    renderOverviewStats(reviewData) {
        return `
            <div class="card p-6 max-w-4xl mx-auto">
                <h3 class="text-xl font-dnd text-ink-dark mb-4 text-center">Stato del Ripasso</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div class="p-3">
                        <div class="text-3xl font-bold text-blue-600 mb-1">${reviewData.totalCompleted}</div>
                        <div class="text-sm text-ink-light">Sfide Completate</div>
                    </div>
                    <div class="p-3">
                        <div class="text-3xl font-bold text-orange-600 mb-1">${reviewData.dueForReview}</div>
                        <div class="text-sm text-ink-light">Da Ripassare</div>
                    </div>
                    <div class="p-3">
                        <div class="text-3xl font-bold text-red-600 mb-1">${reviewData.difficultCount}</div>
                        <div class="text-sm text-ink-light">Difficili</div>
                    </div>
                    <div class="p-3">
                        <div class="text-3xl font-bold text-green-600 mb-1">${reviewData.totalReviews}</div>
                        <div class="text-sm text-ink-light">Ripassi Totali</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Renderizza le opzioni di ripasso
    renderReviewOptions(reviewData) {
        return `
            <div class="card p-6 mb-6 max-w-4xl mx-auto">
                <h3 class="text-xl font-dnd text-ink-dark mb-4 text-center">Modalità di Ripasso</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button class="review-mode-btn btn-primary p-4 rounded-lg ${reviewData.dueForReview > 0 ? '' : 'opacity-50 cursor-not-allowed'}" 
                            data-mode="spaced" ${reviewData.dueForReview > 0 ? '' : 'disabled'}>
                        <div class="text-2xl mb-2">🕐</div>
                        <div class="font-bold">Ripasso Programmato</div>
                        <div class="text-sm mt-1">${reviewData.dueForReview} sfide pronte</div>
                    </button>
                    
                    <button class="review-mode-btn btn-primary p-4 rounded-lg ${reviewData.difficultCount > 0 ? '' : 'opacity-50 cursor-not-allowed'}"
                            data-mode="difficult" ${reviewData.difficultCount > 0 ? '' : 'disabled'}>
                        <div class="text-2xl mb-2">⚡</div>
                        <div class="font-bold">Sfide Difficili</div>
                        <div class="text-sm mt-1">${reviewData.difficultCount} sfide marcate</div>
                    </button>
                    
                    <button class="review-mode-btn btn-primary p-4 rounded-lg ${reviewData.totalCompleted > 0 ? '' : 'opacity-50 cursor-not-allowed'}"
                            data-mode="random" ${reviewData.totalCompleted > 0 ? '' : 'disabled'}>
                        <div class="text-2xl mb-2">🎲</div>
                        <div class="font-bold">Ripasso Casuale</div>
                        <div class="text-sm mt-1">Tutte le sfide</div>
                    </button>
                </div>
            </div>
        `;
    }

    // Renderizza il progresso del ripasso
    renderReviewProgress() {
        if (!this.currentReview) return '';

        const progress = ((this.currentReview.index + 1) / this.reviewQueue.length) * 100;

        return `
            <div class="card p-6 mb-6 max-w-4xl mx-auto">
                <h3 class="text-lg font-dnd text-ink-dark mb-4 text-center">Sessione di Ripasso</h3>
                <div class="w-full bg-pergamena-darker rounded-full h-4 mb-2">
                    <div class="exp-bar-fill h-4 rounded-full" style="width: ${progress}%"></div>
                </div>
                <div class="text-center text-sm text-ink-light">
                    ${this.currentReview.index + 1} di ${this.reviewQueue.length} sfide
                </div>
                ${this.renderCurrentChallenge()}
            </div>
        `;
    }

    // Renderizza la sfida corrente in ripasso
    renderCurrentChallenge() {
        if (!this.currentReview) return '';

        const challenge = this.reviewQueue[this.currentReview.index];
        const badge = challenge.type === 'main' ? challenge.badge : challenge.sideQuest.badge;

        return `
            <div class="mt-6 p-6 bg-pergamena-dark rounded-lg">
                <div class="text-center mb-4">
                    <div class="text-4xl mb-2">${badge.icon}</div>
                    <h4 class="text-xl font-bold text-ink-dark">${challenge.title}</h4>
                    <p class="text-sm text-ink-light">${challenge.reference}</p>
                    <span class="inline-block mt-2 px-3 py-1 rounded-full text-sm ${challenge.type === 'main' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}">
                        ${challenge.type === 'main' ? 'Sfida Principale' : 'Missione di Pratica'}
                    </span>
                </div>
                
                <div class="mb-4">
                    <p class="text-ink-dark mb-2"><strong>Domanda:</strong></p>
                    <p class="text-ink-light">${challenge.type === 'main' ? challenge.challenge : challenge.sideQuest.task}</p>
                </div>
                
                <div class="flex justify-center gap-4 mt-6">
                    <button class="review-action-btn btn-success px-6 py-2 rounded" data-action="easy">
                        😊 Facile
                    </button>
                    <button class="review-action-btn btn-warning px-6 py-2 rounded" data-action="medium">
                        🤔 Medio
                    </button>
                    <button class="review-action-btn btn-danger px-6 py-2 rounded" data-action="hard">
                        😰 Difficile
                    </button>
                </div>
                
                <div class="text-center mt-4">
                    <button class="show-answer-btn btn-secondary px-4 py-2 rounded text-sm">
                        Mostra Risposta
                    </button>
                </div>
                
                <div class="answer-section hidden mt-4 p-4 bg-green-50 rounded-lg">
                    <p class="text-green-800 mb-2"><strong>Risposta:</strong></p>
                    <p class="text-green-700">${challenge.type === 'main' ? challenge.solution : challenge.sideQuest.solution}</p>
                </div>
            </div>
        `;
    }

    // Renderizza le sfide completate
    renderCompletedChallenges(completedChallenges) {
        const zoneGroups = this.groupByZone(completedChallenges);

        return `
            <div class="card p-6 max-w-6xl mx-auto">
                <h3 class="text-xl font-dnd text-ink-dark mb-6 text-center">Archivio delle Conoscenze</h3>
                ${Object.entries(zoneGroups).map(([zoneId, group]) => `
                    <div class="mb-8">
                        <h4 class="text-lg font-bold text-ink-dark mb-4">${group.zoneIcon} ${group.zoneName}</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${group.challenges.map(challenge => this.renderChallengeCard(challenge)).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Raggruppa le sfide per zona
    groupByZone(challenges) {
        const groups = {};
        challenges.forEach(challenge => {
            if (!groups[challenge.zoneId]) {
                const zone = castleData.zones.find(z => z.id === challenge.zoneId);
                groups[challenge.zoneId] = {
                    zoneName: zone?.title || 'Zona Sconosciuta',
                    zoneIcon: zone?.icon || '🧠',
                    challenges: []
                };
            }
            groups[challenge.zoneId].challenges.push(challenge);
        });
        return groups;
    }

    // Renderizza una card di sfida completata
    renderChallengeCard(challenge) {
        const badge = challenge.type === 'main' ? challenge.badge : challenge.sideQuest.badge;
        const daysSinceCompletion = Math.floor((new Date() - new Date(challenge.completedDate)) / (1000 * 60 * 60 * 24));

        return `
            <div class="challenge-memory-card p-4 bg-pergamena-light rounded-lg border ${challenge.isDifficult ? 'border-red-300' : 'border-pergamena-darker'} hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-3">
                    <div class="text-2xl">${badge.icon}</div>
                    <div class="flex gap-1">
                        ${challenge.isDifficult ? '<span class="text-red-500 text-xs">⚡</span>' : ''}
                        <button class="difficulty-toggle text-xs px-2 py-1 rounded ${challenge.isDifficult ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}"
                                data-challenge-id="${challenge.id}" data-challenge-type="${challenge.type}">
                            ${challenge.isDifficult ? 'Difficile' : 'Normale'}
                        </button>
                    </div>
                </div>
                
                <h5 class="font-bold text-ink-dark text-sm mb-2">${challenge.title}</h5>
                <p class="text-xs text-ink-light mb-3">${challenge.reference}</p>
                
                <div class="text-xs text-ink-light">
                    <div class="mb-1">📅 Completata ${daysSinceCompletion} giorni fa</div>
                    <div class="mb-1">🔁 Ripassata ${challenge.reviewCount} volte</div>
                    ${challenge.lastReviewDate ? 
                        `<div>⏰ Ultimo ripasso ${Math.floor((new Date() - new Date(challenge.lastReviewDate)) / (1000 * 60 * 60 * 24))} giorni fa</div>` : 
                        '<div>⏰ Mai ripassata</div>'
                    }
                </div>
                
                <button class="single-review-btn btn-secondary w-full mt-3 py-1 text-xs"
                        data-challenge-id="${challenge.id}" data-challenge-type="${challenge.type}">
                    Ripassa Ora
                </button>
            </div>
        `;
    }

    // Renderizza messaggio quando non ci sono sfide
    renderNoChallenges() {
        return `
            <div class="card p-8 text-center">
                <div class="text-6xl mb-4">🧠</div>
                <h3 class="text-xl font-dnd text-ink-dark mb-2">Nessuna Conoscenza da Ripassare</h3>
                <p class="text-ink-light mb-4">Completa alcune sfide per iniziare a costruire il tuo archivio di conoscenze!</p>
                <button class="btn-primary px-6 py-2 rounded" onclick="castleMap.render()">
                    Esplora la Mappa
                </button>
            </div>
        `;
    }

    // Associa gli eventi
    bindEvents() {
        if (!this.container) return;

        // Modalità di ripasso
        const reviewModeBtns = this.container.querySelectorAll('.review-mode-btn');
        reviewModeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.currentTarget.disabled) return;
                const mode = e.currentTarget.dataset.mode;
                this.startReviewSession(mode);
            });
        });

        // Azioni durante il ripasso
        const reviewActionBtns = this.container.querySelectorAll('.review-action-btn');
        reviewActionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleReviewAction(action);
            });
        });

        // Mostra risposta
        const showAnswerBtn = this.container.querySelector('.show-answer-btn');
        if (showAnswerBtn) {
            showAnswerBtn.addEventListener('click', () => {
                const answerSection = this.container.querySelector('.answer-section');
                if (answerSection) {
                    answerSection.classList.remove('hidden');
                    showAnswerBtn.style.display = 'none';
                }
            });
        }

        // Toggle difficoltà
        const difficultyToggles = this.container.querySelectorAll('.difficulty-toggle');
        difficultyToggles.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const challengeId = parseInt(e.currentTarget.dataset.challengeId);
                const challengeType = e.currentTarget.dataset.challengeType;
                this.toggleDifficulty(challengeId, challengeType);
            });
        });

        // Ripasso singolo
        const singleReviewBtns = this.container.querySelectorAll('.single-review-btn');
        singleReviewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const challengeId = parseInt(e.currentTarget.dataset.challengeId);
                const challengeType = e.currentTarget.dataset.challengeType;
                this.startSingleReview(challengeId, challengeType);
            });
        });
    }

    // Inizia una sessione di ripasso
    startReviewSession(mode) {
        const completedChallenges = this.getCompletedChallenges();
        
        switch (mode) {
            case 'spaced':
                this.reviewQueue = this.getDueForReview(completedChallenges);
                break;
            case 'difficult':
                this.reviewQueue = completedChallenges.filter(c => c.isDifficult);
                break;
            case 'random':
                this.reviewQueue = [...completedChallenges].sort(() => Math.random() - 0.5);
                break;
        }

        if (this.reviewQueue.length === 0) {
            notificationSystem.show('Nessuna sfida da ripassare in questa modalità!', 'info');
            return;
        }

        this.currentReview = { index: 0, mode };
        this.render();
    }

    // Inizia il ripasso di una singola sfida
    startSingleReview(challengeId, challengeType) {
        const completedChallenges = this.getCompletedChallenges();
        const challenge = completedChallenges.find(c => c.id === challengeId && c.type === challengeType);
        
        if (challenge) {
            this.reviewQueue = [challenge];
            this.currentReview = { index: 0, mode: 'single' };
            this.render();
        }
    }

    // Gestisce le azioni durante il ripasso
    handleReviewAction(action) {
        if (!this.currentReview || !this.reviewQueue[this.currentReview.index]) return;

        const challenge = this.reviewQueue[this.currentReview.index];
        
        // Registra il ripasso
        this.recordReview(challenge.id, challenge.type, action);
        
        // Gestisce la difficoltà automaticamente
        if (action === 'hard' && !challenge.isDifficult) {
            this.toggleDifficulty(challenge.id, challenge.type);
        } else if (action === 'easy' && challenge.isDifficult) {
            // Rimuove dalla lista difficili se ripassata facilmente per 3 volte consecutive
            const recentReviews = this.getRecentReviews(challenge.id, challenge.type, 3);
            if (recentReviews.every(r => r.difficulty === 'easy')) {
                this.toggleDifficulty(challenge.id, challenge.type);
            }
        }

        // Passa alla prossima sfida
        this.currentReview.index++;
        
        if (this.currentReview.index >= this.reviewQueue.length) {
            // Fine sessione
            this.finishReviewSession();
        } else {
            this.render();
        }
    }

    // Finisce la sessione di ripasso
    finishReviewSession() {
        const completedCount = this.reviewQueue.length;
        this.currentReview = null;
        this.reviewQueue = [];
        
        notificationSystem.show(`Sessione di ripasso completata! ${completedCount} sfide ripassate.`, 'success');
        
        // Aggiorna EXP per il ripasso
        const expGained = Math.floor(completedCount * 5);
        gameState.addExp(expGained);
        
        this.render();
    }

    // Toggle dello stato di difficoltà
    toggleDifficulty(challengeId, challengeType) {
        const key = `${challengeId}_${challengeType}`;
        
        if (this.difficultyChallenges.has(key)) {
            this.difficultyChallenges.delete(key);
            notificationSystem.show('Sfida rimossa dalle difficili', 'info');
        } else {
            this.difficultyChallenges.add(key);
            notificationSystem.show('Sfida marcata come difficile', 'warning');
        }
        
        this.saveDifficultyChallenges();
        this.render();
    }

    // Registra un ripasso
    recordReview(challengeId, challengeType, difficulty) {
        const reviews = storageManager.getData('reviewHistory') || [];
        reviews.push({
            challengeId,
            challengeType,
            difficulty,
            date: new Date().toISOString()
        });
        storageManager.saveData('reviewHistory', reviews);
    }

    // Metodi di utilità per date e statistiche
    getCompletionDate(challengeId, type) {
        const completionHistory = storageManager.getData('completionHistory') || {};
        return completionHistory[`${challengeId}_${type}`] || new Date().toISOString();
    }

    getReviewCount(challengeId, type) {
        const reviews = storageManager.getData('reviewHistory') || [];
        return reviews.filter(r => r.challengeId === challengeId && r.challengeType === type).length;
    }

    getLastReviewDate(challengeId, type) {
        const reviews = storageManager.getData('reviewHistory') || [];
        const challengeReviews = reviews.filter(r => r.challengeId === challengeId && r.challengeType === type);
        return challengeReviews.length > 0 ? challengeReviews[challengeReviews.length - 1].date : null;
    }

    getRecentReviews(challengeId, type, count) {
        const reviews = storageManager.getData('reviewHistory') || [];
        return reviews
            .filter(r => r.challengeId === challengeId && r.challengeType === type)
            .slice(-count);
    }

    // Aggiorna la vista quando cambia lo stato
    refresh() {
        if (this.isInitialized && gameState.currentView === 'memory') {
            this.render();
        }
    }

    // Ottieni informazioni di debug
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            containerExists: !!this.container,
            currentReview: this.currentReview,
            reviewQueueLength: this.reviewQueue.length,
            difficultyChallengesCount: this.difficultyChallenges.size,
            reviewMode: this.reviewMode
        };
    }
}

// Crea istanza globale
const memoryHall = new MemoryHall();

// Rendi globale per l'accesso da altri moduli
window.memoryHall = memoryHall;

// Inizializza automaticamente quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    memoryHall.init();
    
    // Ascolta eventi di game state per aggiornamenti
    if (window.gameState) {
        gameState.on('challengeCompleted', () => {
            // Registra la data di completamento
            const completionHistory = storageManager.getData('completionHistory') || {};
            const lastCompleted = gameState.playerState.completedChallenges[gameState.playerState.completedChallenges.length - 1];
            if (lastCompleted) {
                completionHistory[`${lastCompleted}_main`] = new Date().toISOString();
                storageManager.saveData('completionHistory', completionHistory);
            }
            
            setTimeout(() => memoryHall.refresh(), 500);
        });
        
        gameState.on('sideQuestCompleted', () => {
            // Registra la data di completamento
            const completionHistory = storageManager.getData('completionHistory') || {};
            const lastCompleted = gameState.playerState.completedSideQuests[gameState.playerState.completedSideQuests.length - 1];
            if (lastCompleted) {
                completionHistory[`${lastCompleted}_side`] = new Date().toISOString();
                storageManager.saveData('completionHistory', completionHistory);
            }
            
            setTimeout(() => memoryHall.refresh(), 500);
        });
    }
});
