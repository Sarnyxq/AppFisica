// WING VIEW - Fisica 3.0
// Modulo per la visualizzazione delle sfide in una zona del Grimorio

class WingView {
    constructor() {
        this.container = null;
        this.currentZoneId = null;
        this.isInitialized = false;
    }

    // Inizializza il modulo
    init() {
        this.container = document.getElementById('main-content');
        if (!this.container) {
            console.error('Container principale non trovato!');
            return false;
        }
        this.isInitialized = true;
        return true;
    }

    // Renderizza la vista di una zona specifica
    render(zoneId) {
        if (!this.container) {
            console.error('WingView non inizializzato!');
            return;
        }

        const zone = castleData.zones.find(z => z.id === zoneId);
        if (!zone) {
            notificationSystem.show("Zona non trovata!", "error");
            return;
        }

        if (!gameState.isZoneUnlocked(zoneId)) {
            notificationSystem.show(`${zone.title} è ancora bloccata!`, "warning");
            return;
        }

        this.currentZoneId = zoneId;
        const challenges = castleData.challenges.filter(c => c.zoneId === zoneId);

        this.container.innerHTML = `
            <div class="mb-6">
                <button id="back-to-map" class="btn-secondary text-lg py-2 px-4 rounded-lg mb-4 hover:bg-pergamena-dark transition-colors">
                    ← Torna alla Mappa del Grimorio
                </button>
                
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4">${zone.icon}</div>
                    <h2 class="text-4xl font-dnd text-ink-dark mb-2">${zone.title}</h2>
                    <p class="text-lg text-ink-light max-w-3xl mx-auto mb-4">${zone.desc}</p>
                    ${this.renderZoneProgress(challenges)}
                </div>
            </div>

            <div class="space-y-4">
                <h3 class="text-2xl font-dnd text-ink-dark text-center mb-6">Sfide del Capitolo</h3>
                ${challenges.map(challenge => this.renderChallengeCard(challenge)).join('')}
            </div>

            ${this.renderZoneCompletion(challenges)}
        `;

        this.bindEvents();
        gameState.changeView('wing');
    }

    // Renderizza il progresso della zona
    renderZoneProgress(challenges) {
        const completedChallenges = challenges.filter(c => gameState.isChallengeCompleted(c.id));
        const completedSideQuests = challenges.filter(c => gameState.isSideQuestCompleted(c.id));
        const totalExp = challenges.reduce((sum, c) => sum + c.exp, 0);
        const earnedExp = completedChallenges.reduce((sum, c) => sum + c.exp, 0);
        const progressPercentage = challenges.length > 0 ? Math.round((completedChallenges.length / challenges.length) * 100) : 0;

        return `
            <div class="card p-6 max-w-4xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div class="p-3">
                        <div class="text-2xl font-bold text-gold">${completedChallenges.length}</div>
                        <div class="text-sm text-ink-light">Sfide Completate</div>
                        <div class="text-xs text-ink-light">su ${challenges.length}</div>
                    </div>
                    <div class="p-3">
                        <div class="text-2xl font-bold text-magic-purple">${completedSideQuests.length}</div>
                        <div class="text-sm text-ink-light">Missioni Secondarie</div>
                        <div class="text-xs text-ink-light">pratiche completate</div>
                    </div>
                    <div class="p-3">
                        <div class="text-2xl font-bold text-magic-blue">${earnedExp}</div>
                        <div class="text-sm text-ink-light">EXP Guadagnati</div>
                        <div class="text-xs text-ink-light">su ${totalExp} totali</div>
                    </div>
                    <div class="p-3">
                        <div class="text-2xl font-bold text-magic-green">${progressPercentage}%</div>
                        <div class="text-sm text-ink-light">Completamento</div>
                        <div class="w-full bg-pergamena-darker rounded-full h-2 mt-2">
                            <div class="exp-bar-fill h-2 rounded-full" style="width: ${progressPercentage}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Renderizza una card della sfida
    renderChallengeCard(challenge) {
        const isCompleted = gameState.isChallengeCompleted(challenge.id);
        const isSideQuestCompleted = gameState.isSideQuestCompleted(challenge.id);
        const canDoSideQuest = isCompleted && !isSideQuestCompleted;

        return `
            <div class="challenge-card card p-6 ${isCompleted ? 'completed' : ''}">
                <div class="flex flex-col lg:flex-row items-start justify-between gap-4">
                    <div class="flex-grow">
                        <!-- Titolo principale -->
                        <div class="flex items-center gap-3 mb-2">
                            <span class="text-3xl ${isCompleted ? 'badge-unlocked' : ''}">${challenge.badge.icon}</span>
                            <div>
                                <h3 class="text-xl font-bold text-ink-dark">${challenge.title}</h3>
                                <p class="text-sm text-ink-light">${challenge.desc}</p>
                            </div>
                        </div>
                        
                        <!-- Informazioni della sfida -->
                        <div class="ml-12 space-y-2">
                            <div class="flex flex-wrap gap-4 text-sm">
                                <span class="bg-amber-200/50 px-2 py-1 rounded font-semibold text-ink-dark">
                                    🧠 ${challenge.reference}
                                </span>
                                <span class="bg-gold/20 px-2 py-1 rounded font-semibold text-ink-dark">
                                    ⭐ ${challenge.exp} EXP
                                </span>
                                ${isCompleted ? `
                                    <span class="bg-green-200 px-2 py-1 rounded text-green-800 font-semibold">
                                        ✅ Completata
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Pulsanti azione -->
                    <div class="flex-shrink-0 flex flex-col gap-2 w-full lg:w-auto">
                        ${isCompleted ? `
                            <div class="flex flex-col gap-2 w-full lg:w-auto">
                                <span class="btn-secondary py-2 px-4 rounded-lg text-center opacity-60 cursor-not-allowed">
                                    ${challenge.badge.icon} Sigillo Forgiato
                                </span>
                                <button class="btn-tertiary story-review-btn text-sm py-2 px-4 rounded-lg w-full lg:w-auto" 
                                        data-challenge-id="${challenge.id}" 
                                        data-story-available="${this.hasStoryContent(challenge.id)}"
                                        aria-label="Rivedi la storia della sfida ${challenge.title}"
                                        role="button"
                                        tabindex="0">
                                    📖 Storia
                                </button>
                            </div>
                        ` : `
                            <button class="btn-primary font-dnd text-lg py-2 px-6 rounded-lg w-full lg:w-auto challenge-btn" 
                                    data-challenge-id="${challenge.id}" data-type="main">
                                🔨 Affronta la Sfida
                            </button>
                        `}
                    </div>
                </div>

                <!-- Missione Secondaria -->
                ${isCompleted ? `
                    <div class="mt-6 pt-6 border-t border-ink/20">
                        <div class="flex flex-col lg:flex-row items-start justify-between gap-4">
                            <div class="flex-grow">
                                <div class="flex items-center gap-3 mb-2">
                                    <span class="text-2xl ${isSideQuestCompleted ? 'badge-unlocked' : 'opacity-60'}">${challenge.sideQuest.badge.icon}</span>
                                    <div>
                                        <h4 class="font-bold text-ink-dark">Missione Secondaria: Il Rito della Pratica</h4>
                                        <p class="text-sm text-ink-light">
                                            Completa 10 esercizi pratici dal tuo grimorio per consolidare la conoscenza e ottenere un sigillo speciale.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="flex-shrink-0 w-full lg:w-auto">
                                ${isSideQuestCompleted ? `
                                    <span class="btn-secondary py-2 px-4 rounded-lg text-center opacity-60 cursor-not-allowed">
                                        ${challenge.sideQuest.badge.icon} Pratica Completata
                                    </span>
                                ` : `
                                    <button class="btn-primary font-dnd text-lg py-2 px-6 rounded-lg w-full lg:w-auto challenge-btn" 
                                            data-challenge-id="${challenge.id}" data-type="side">
                                        📿 Inizia il Rito
                                    </button>
                                `}
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Renderizza il messaggio di completamento zona
    renderZoneCompletion(challenges) {
        const allCompleted = challenges.every(c => gameState.isChallengeCompleted(c.id));
        const allSideQuestsCompleted = challenges.every(c => gameState.isSideQuestCompleted(c.id));

        if (!allCompleted && !allSideQuestsCompleted) {
            return '';
        }

        let message = '';
        let icon = '';
        
        if (allCompleted && allSideQuestsCompleted) {
            message = 'Maestria Completa! Hai forgiato tutti i sigilli di questo capitolo, incluse tutte le pratiche avanzate. Sei un vero maestro di questa area della fisica!';
            icon = '👑✨🏆';
        } else if (allCompleted) {
            message = 'Capitolo Completato! Hai forgiato tutti i sigilli principali. Ora puoi consolidare la tua conoscenza con le missioni secondarie.';
            icon = '🎉⚡🧠';
        }

        return `
            <div class="card p-8 mt-8 text-center bg-gradient-to-r from-gold/10 to-pergamena">
                <div class="text-6xl mb-4">${icon}</div>
                <h3 class="text-2xl font-dnd text-ink-dark mb-4">Congratulazioni!</h3>
                <p class="text-lg text-ink-light max-w-2xl mx-auto">${message}</p>
                <button id="celebration-btn" class="btn-primary font-dnd text-xl py-3 px-8 rounded-lg mt-6">
                    🎊 Celebra il Successo
                </button>
            </div>
        `;
    }

    // Associa gli eventi
    bindEvents() {
        if (!this.container) return;

        // Pulsante torna alla mappa
        const backBtn = document.getElementById('back-to-map');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (window.castleMap) {
                    castleMap.render();
                }
            });
        }

        // Pulsanti delle sfide
        const challengeBtns = this.container.querySelectorAll('.challenge-btn');
        challengeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const challengeId = parseInt(e.currentTarget.dataset.challengeId);
                const type = e.currentTarget.dataset.type;
                this.openChallenge(challengeId, type);
            });
        });

        // Event listener per i pulsanti storia
        const storyReviewBtns = this.container.querySelectorAll('.story-review-btn');
        storyReviewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const challengeId = parseInt(e.currentTarget.dataset.challengeId);
                const hasStory = e.currentTarget.dataset.storyAvailable === 'true';
                
                if (hasStory) {
                    this.showStoryReview(challengeId);
                } else {
                    notificationSystem.show("Nessuna storia disponibile per questa sfida.", "info");
                }
            });
        });

        // Pulsante celebrazione
        const celebrationBtn = document.getElementById('celebration-btn');
        if (celebrationBtn) {
            celebrationBtn.addEventListener('click', () => {
                this.triggerCelebration();
            });
        }
    }

    // Apri una sfida
    openChallenge(challengeId, type) {
        const challenge = castleData.challenges.find(c => c.id === challengeId);
        if (!challenge) {
            notificationSystem.show("Sfida non trovata!", "error");
            return;
        }

        // Apri il modale appropriato
        if (window.modals) {
            // Se è una sfida principale, mostra prima la storia (pattern ApprendimentoMatematica1)
            if (type === 'main') {
                modals.showChallengeStory(challengeId);
            } else {
                // Per side quest o altri tipi, apri direttamente
                modals.openChallengeModal(challengeId, type);
            }
        }
    }

    // Celebrazione completamento zona
    triggerCelebration() {
        // Effetti visivi di celebrazione
        notificationSystem.show("🎉 Maestria raggiunta in questo capitolo!", "levelup");
        
        // Animazione confetti (simulata con notifiche)
        const celebrations = [
            "✨ La tua conoscenza brilla come le stelle!",
            "🔮 I segreti della fisica si svelano davanti a te!",
            "🧠 Ogni pagina del grimorio ti rende più saggio!",
            "⚡ L'energia della conoscenza scorre nelle tue vene!"
        ];

        celebrations.forEach((msg, index) => {
            setTimeout(() => {
                notificationSystem.show(msg, "success", 3000);
            }, index * 800);
        });

        // Mostra messaggio motivazionale
        setTimeout(() => {
            notificationSystem.showMotivationalMessage();
        }, 4000);
    }

    // Mostra il modal di revisione storia per una sfida completata
    showStoryReview(challengeId) {
        if (!window.storyData) {
            console.error('StoryData non disponibile');
            notificationSystem.show("Sistema storia non disponibile.", "error");
            return;
        }

        const challenge = castleData.challenges.find(c => c.id === challengeId);
        const storyContent = storyData.getStoryForChallenge(challengeId);

        if (!challenge) {
            console.error('Sfida non trovata:', challengeId);
            return;
        }

        if (!storyContent || (!storyContent.challengeStory && !storyContent.chapterIntro)) {
            notificationSystem.show("Nessuna storia disponibile per questa sfida.", "info");
            return;
        }

        // Imposta contenuto del modal
        this.loadStoryReviewContent(challenge, storyContent);
        
        // Mostra il modal
        const modal = document.getElementById('story-review-modal');
        modal.classList.remove('hidden');
        modal.classList.add('story-review-modal-enter');
        document.body.classList.add('modal-open');
        
        // Focus management per accessibilità
        setTimeout(() => {
            const closeBtn = document.getElementById('story-review-close-btn');
            if (closeBtn) closeBtn.focus();
        }, 100);
        
        // Bind eventi di chiusura
        this.bindStoryReviewEvents();
    }

    // Carica il contenuto della storia nel modal di revisione
    loadStoryReviewContent(challenge, storyContent) {
        // Aggiorna header
        document.getElementById('story-review-icon').textContent = challenge.badge.icon;
        document.getElementById('story-review-title').textContent = 
            `Storia: ${challenge.title}`;
        document.getElementById('story-review-subtitle').textContent = 
            `${storyContent.chapterTitle || 'Capitolo della Sfida'} - Sfida Completata`;

        // Costruisci contenuto
        const contentDiv = document.getElementById('story-review-content');
        let contentHTML = '';

        // Intro del capitolo (se disponibile)
        if (storyContent.chapterIntro) {
            contentHTML += `
                <div class="story-review-section story-review-intro">
                    <h3 class="story-review-chapter-title">
                        <span>🏛️</span>
                        <span>${storyContent.chapterTitle || 'Introduzione al Capitolo'}</span>
                    </h3>
                    <div class="story-review-text">
                        ${this.formatStoryText(storyContent.chapterIntro)}
                    </div>
                </div>
            `;
        }

        // Storia specifica della sfida
        if (storyContent.challengeStory) {
            contentHTML += `
                <div class="story-review-section story-review-challenge">
                    <h3 class="story-review-chapter-title">
                        <span>⚔️</span>
                        <span>La Storia della Sfida</span>
                    </h3>
                    <div class="story-review-text">
                        ${this.formatStoryText(storyContent.challengeStory)}
                    </div>
                </div>
            `;
        }

        // Informazioni sulla sfida
        contentHTML += `
            <div class="story-review-section">
                <h3 class="story-review-chapter-title">
                    <span>${challenge.badge.icon}</span>
                    <span>Informazioni sulla Sfida</span>
                </h3>
                <div class="story-review-text">
                    <p><strong>Titolo:</strong> ${challenge.title}</p>
                    <p><strong>Descrizione:</strong> ${challenge.desc}</p>
                    <p><strong>Argomento:</strong> ${challenge.reference}</p>
                    <p><strong>Ricompensa:</strong> ${challenge.exp} EXP + ${challenge.badge.name}</p>
                    <p class="text-green-300 font-semibold mt-2">✅ Sfida Completata con Successo!</p>
                </div>
            </div>
        `;

        contentDiv.innerHTML = contentHTML;
        
        // Aggiungi animazioni fade-in al contenuto
        setTimeout(() => {
            const sections = contentDiv.querySelectorAll('.story-review-section');
            sections.forEach((section, index) => {
                setTimeout(() => {
                    section.classList.add('story-content-fade-in');
                }, index * 150);
            });
        }, 50);
    }

    // Formatta il testo della storia per la visualizzazione
    formatStoryText(text) {
        if (!text) return '';
        
        // Converte i break di linea in paragrafi HTML
        return text
            .split('\n\n')
            .map(paragraph => `<p class="mb-4">${paragraph.trim()}</p>`)
            .join('');
    }

    // Bind eventi per il modal di revisione storia
    bindStoryReviewEvents() {
        const modal = document.getElementById('story-review-modal');
        const closeBtn = document.getElementById('story-review-close-btn');
        const closeFooterBtn = document.getElementById('story-review-close-footer-btn');

        // Funzione di chiusura
        const closeModal = () => {
            modal.classList.add('hidden');
            modal.classList.remove('story-review-modal-enter');
            document.body.classList.remove('modal-open');
            
            // Ripristina focus al pulsante che ha aperto il modal per accessibilità
            const activeStoryBtn = document.querySelector('.story-review-btn:focus');
            if (activeStoryBtn) {
                setTimeout(() => activeStoryBtn.focus(), 100);
            }
        };

        // Event listeners
        closeBtn.onclick = closeModal;
        closeFooterBtn.onclick = closeModal;

        // Chiudi cliccando fuori dal modal
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModal();
            }
        };

        // Chiudi con tasto ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    // Controlla se una sfida ha contenuto storia disponibile
    hasStoryContent(challengeId) {
        if (!window.storyData) return false;
        
        const storyContent = storyData.getStoryForChallenge(challengeId);
        return !!(storyContent && (storyContent.challengeStory || storyContent.chapterIntro));
    }

    // Aggiorna la vista quando cambia lo stato
    refresh() {
        if (this.currentZoneId && gameState.currentView === 'wing') {
            this.render(this.currentZoneId);
        }
    }

    // Ottieni informazioni di debug
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            containerExists: !!this.container,
            currentZoneId: this.currentZoneId,
            challengesInZone: this.currentZoneId ? castleData.challenges.filter(c => c.zoneId === this.currentZoneId).length : 0
        };
    }
}

// Crea istanza globale
const wingView = new WingView();

// Rendi globale per l'accesso da altri moduli
window.wingView = wingView;

// Inizializza automaticamente quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    wingView.init();
    
    // Ascolta eventi di game state per aggiornamenti
    if (window.gameState) {
        gameState.on('challengeCompleted', () => {
            setTimeout(() => wingView.refresh(), 500);
        });
        
        gameState.on('sideQuestCompleted', () => {
            setTimeout(() => wingView.refresh(), 500);
        });
    }
});
