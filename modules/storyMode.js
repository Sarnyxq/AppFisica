// STORY MODE MODULE - Fisica 3.0
// Gestisce la modalità storia del Grimorio dell'Apprendista Stregone

class StoryMode {
    constructor() {
        this.isInitialized = false;
        this.currentChapter = null;
        this.currentRoom = null;
        this.storyData = null;
        this.container = null;
    }

    // Inizializza il modulo story mode
    init() {
        console.log('📚 [StoryMode] Inizializzazione in corso...');
        
        // Ottieni riferimento al container principale
        this.container = document.getElementById('main-content');
        if (!this.container) {
            console.error('❌ [StoryMode] Container main-content non trovato!');
            return false;
        }

        // Carica i dati della storia
        this.loadStoryData();
        
        this.isInitialized = true;
        console.log('✅ [StoryMode] Inizializzazione completata');
        return true;
    }

    // Carica i dati della storia
    loadStoryData() {
        if (window.storyData) {
            this.storyData = window.storyData;
            console.log('📖 [StoryMode] Dati storia caricati:', this.storyData.chapters?.length || 'Nessun capitolo', 'capitoli');
        } else {
            console.error('❌ [StoryMode] StoryData non disponibile! Verifica che data/storyData.js sia caricato correttamente.');
            // Crea dati di fallback minimali per evitare errori
            this.storyData = {
                chapters: [],
                getChapters: () => [],
                getTotalRoomsCount: () => 0,
                getChapterById: () => null,
                getChapterByChallengeId: () => null
            };
        }
    }

    // Renderizza la vista principale della modalità storia
    render() {
        if (!this.isInitialized) {
            if (!this.init()) return;
        }

        console.log('📚 [StoryMode] Rendering modalità storia...');

        // Verifica se i dati della storia sono disponibili
        if (!this.storyData || !this.storyData.chapters || this.storyData.chapters.length === 0) {
            this.renderErrorView();
            return;
        }

        // Nascondi altre viste
        this.hideOtherViews();

        // Costruisci l'interfaccia della modalità storia
        this.container.innerHTML = `
            <div id="story-view" class="story-container p-4">
                <!-- Header della Modalità Storia -->
                <div class="story-header text-center mb-6">
                    <h1 class="font-dnd text-4xl text-yellow-400 mb-2">📚 Modalità Storia</h1>
                    <p class="text-lg text-gray-300">
                        Segui il viaggio dell'Apprendista Stregone attraverso il Grimorio della Fisica
                    </p>
                </div>

                <!-- Informazioni Progresso -->
                <div class="story-progress-info bg-gray-800 p-4 rounded-lg mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                            <h3 class="font-bold text-yellow-400">Capitolo Corrente</h3>
                            <p id="current-chapter-info" class="text-xl text-white">Caricamento...</p>
                        </div>
                        <div>
                            <h3 class="font-bold text-yellow-400">Stanze Completate</h3>
                            <p id="completed-rooms-info" class="text-xl text-white">0 / 60</p>
                        </div>
                        <div>
                            <h3 class="font-bold text-yellow-400">Progresso Storia</h3>
                            <p id="story-progress-percent" class="text-xl text-white">0%</p>
                        </div>
                    </div>
                </div>

                <!-- Lista Capitoli -->
                <div class="chapters-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <!-- I capitoli verranno inseriti qui dinamicamente -->
                </div>

                <!-- Controlli Navigazione Storia -->
                <div class="story-controls flex flex-wrap justify-center gap-4">
                    <button id="continue-story-btn" class="btn-primary font-dnd text-lg py-3 px-6 rounded-lg">
                        📖 Continua Storia
                    </button>
                    <button id="reset-story-btn" class="btn-secondary font-dnd text-lg py-3 px-6 rounded-lg">
                        🔄 Ricomincia Storia
                    </button>
                    <button id="story-settings-btn" class="btn-accent font-dnd text-lg py-3 px-6 rounded-lg">
                        ⚙️ Impostazioni Storia
                    </button>
                </div>
            </div>
        `;

        // Inizializza la vista
        this.initializeStoryView();
    }

    // Renderizza vista di errore quando i dati non sono disponibili
    renderErrorView() {
        console.warn('⚠️ [StoryMode] Rendering vista errore - dati storia non disponibili');

        this.hideOtherViews();

        this.container.innerHTML = `
            <div id="story-error-view" class="story-container p-4">
                <div class="story-header text-center mb-6">
                    <h1 class="font-dnd text-4xl text-red-600 mb-2">⚠️ Errore Modalità Storia</h1>
                    <p class="text-lg text-pergamena-light">
                        I dati della storia non sono attualmente disponibili
                    </p>
                </div>

                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <p class="font-bold">Problema rilevato:</p>
                    <p>Il file <code>storyData.js</code> non è stato caricato correttamente o non contiene dati validi.</p>
                    <p class="mt-2">Possibili soluzioni:</p>
                    <ul class="list-disc ml-6 mt-2">
                        <li>Verifica che il file <code>data/storyData.js</code> esista</li>
                        <li>Controlla la console del browser per errori JavaScript</li>
                        <li>Ricarica la pagina</li>
                        <li>Contatta l'assistenza tecnica</li>
                    </ul>
                </div>

                <div class="text-center">
                    <button id="retry-story-btn" class="btn-primary font-dnd text-lg py-3 px-6 rounded-lg mr-4">
                        🔄 Riprova
                    </button>
                    <button id="back-to-map-btn" class="btn-secondary font-dnd text-lg py-3 px-6 rounded-lg">
                        🗺️ Torna alla Mappa
                    </button>
                </div>
            </div>
        `;

        // Aggiungi event listeners per i pulsanti di errore
        const retryBtn = document.getElementById('retry-story-btn');
        const backBtn = document.getElementById('back-to-map-btn');

        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.loadStoryData();
                this.render();
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (window.header) {
                    header.navigate('map');
                }
            });
        }
    }

    // Inizializza la vista della modalità storia
    initializeStoryView() {
        // Aggiorna le informazioni di progresso
        this.updateProgressInfo();
        
        // Renderizza la griglia dei capitoli
        this.renderChaptersGrid();
        
        // Associa gli eventi
        this.bindStoryEvents();
    }

    // Aggiorna le informazioni di progresso
    updateProgressInfo() {
        if (!this.storyData || !window.gameState) return;

        const currentChapter = this.getCurrentChapter();
        const completedRooms = this.getCompletedRoomsCount();
        const totalRooms = this.storyData.getTotalRoomsCount();
        const progressPercent = Math.round((completedRooms / totalRooms) * 100);

        // Aggiorna gli elementi dell'interfaccia
        const currentChapterInfo = document.getElementById('current-chapter-info');
        const completedRoomsInfo = document.getElementById('completed-rooms-info');
        const storyProgressPercent = document.getElementById('story-progress-percent');

        if (currentChapterInfo) {
            currentChapterInfo.textContent = currentChapter ? 
                `${currentChapter.id} - ${currentChapter.title}` : 
                'Inizia l\'avventura!';
        }

        if (completedRoomsInfo) {
            completedRoomsInfo.textContent = `${completedRooms} / ${totalRooms}`;
        }

        if (storyProgressPercent) {
            storyProgressPercent.textContent = `${progressPercent}%`;
        }
    }

    // Renderizza la griglia dei capitoli
    renderChaptersGrid() {
        if (!this.storyData) return;

        const chaptersGrid = document.querySelector('.chapters-grid');
        if (!chaptersGrid) return;

        const chapters = this.storyData.getChapters();
        chaptersGrid.innerHTML = '';

        chapters.forEach(chapter => {
            const isUnlocked = this.isChapterUnlocked(chapter);
            const completedRooms = this.getChapterCompletedRooms(chapter);
            const totalRooms = chapter.rooms.length;
            const progressPercent = totalRooms > 0 ? Math.round((completedRooms / totalRooms) * 100) : 0;

            const chapterCard = document.createElement('div');
            chapterCard.className = `chapter-card bg-gray-800 p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                isUnlocked ? 'border-yellow-400 hover:border-yellow-300' : 'border-gray-600 opacity-60'
            }`;
            
            chapterCard.dataset.chapterId = chapter.id;

            chapterCard.innerHTML = `
                <div class="chapter-header text-center mb-3">
                    <h3 class="font-dnd text-xl ${isUnlocked ? 'text-yellow-400' : 'text-gray-400'}">${chapter.title}</h3>
                    <p class="text-sm text-gray-300 mt-1">Capitolo ${chapter.id}</p>
                </div>
                
                <div class="chapter-progress mb-3">
                    <div class="flex justify-between text-sm mb-1 text-white">
                        <span>Progresso</span>
                        <span>${completedRooms}/${totalRooms}</span>
                    </div>
                    <div class="progress-bar bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div class="progress-fill bg-gradient-to-r from-yellow-400 to-yellow-300 h-full transition-all" 
                             style="width: ${progressPercent}%"></div>
                    </div>
                </div>

                <div class="chapter-description text-sm text-gray-300 text-center">
                    ${this.getChapterDescription(chapter)}
                </div>

                ${!isUnlocked ? '<div class="locked-overlay text-center mt-2"><span class="text-gray-500">🔒 Completa il capitolo precedente</span></div>' : ''}
            `;

            // Aggiungi event listener solo se il capitolo è sbloccato
            if (isUnlocked) {
                chapterCard.addEventListener('click', () => this.openChapter(chapter));
            }

            chaptersGrid.appendChild(chapterCard);
        });
    }

    // Associa gli eventi della modalità storia
    bindStoryEvents() {
        // Pulsante continua storia
        const continueBtn = document.getElementById('continue-story-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.continueStory());
        }

        // Pulsante reset storia
        const resetBtn = document.getElementById('reset-story-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetStory());
        }

        // Pulsante impostazioni storia
        const settingsBtn = document.getElementById('story-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openStorySettings());
        }
    }

    // Ottieni il capitolo corrente
    getCurrentChapter() {
        if (!this.storyData || !window.gameState) return null;

        const chapters = this.storyData.getChapters();
        
        // Trova il primo capitolo non completato
        for (const chapter of chapters) {
            if (!this.isChapterCompleted(chapter)) {
                return chapter;
            }
        }

        // Se tutti i capitoli sono completati, ritorna l'ultimo
        return chapters[chapters.length - 1];
    }

    // Verifica se un capitolo è sbloccato
    isChapterUnlocked(chapter) {
        if (!window.gameState) return false;

        const chapters = this.storyData.getChapters();
        const chapterIndex = chapters.findIndex(c => c.id === chapter.id);

        // Il primo capitolo è sempre sbloccato
        if (chapterIndex === 0) return true;

        // Gli altri capitoli richiedono il completamento del precedente
        const previousChapter = chapters[chapterIndex - 1];
        return this.isChapterCompleted(previousChapter);
    }

    // Verifica se un capitolo è completato
    isChapterCompleted(chapter) {
        if (!window.gameState) return false;

        return chapter.rooms.every(room => {
            const challenge = window.castleData?.getChallengeById(room.challengeId);
            return challenge && gameState.isChallengeCompleted(challenge.id);
        });
    }

    // Ottieni il numero di stanze completate per un capitolo
    getChapterCompletedRooms(chapter) {
        if (!window.gameState) return 0;

        return chapter.rooms.filter(room => {
            const challenge = window.castleData?.getChallengeById(room.challengeId);
            return challenge && gameState.isChallengeCompleted(challenge.id);
        }).length;
    }

    // Ottieni il numero totale di stanze completate
    getCompletedRoomsCount() {
        if (!this.storyData || !window.gameState) return 0;

        const chapters = this.storyData.getChapters();
        let totalCompleted = 0;

        chapters.forEach(chapter => {
            totalCompleted += this.getChapterCompletedRooms(chapter);
        });

        return totalCompleted;
    }

    // Ottieni la descrizione di un capitolo
    getChapterDescription(chapter) {
        const completedRooms = this.getChapterCompletedRooms(chapter);
        const totalRooms = chapter.rooms.length;

        if (completedRooms === 0) {
            return chapter.introduction || 'Un nuovo capitolo ti aspetta...';
        } else if (completedRooms === totalRooms) {
            return chapter.conclusion || 'Capitolo completato con successo!';
        } else {
            return `Progresso: ${completedRooms}/${totalRooms} stanze completate`;
        }
    }

    // Apri un capitolo specifico
    openChapter(chapter) {
        console.log('📖 [StoryMode] Apertura capitolo:', chapter.title);

        if (!this.isChapterUnlocked(chapter)) {
            this.showNotification('🔒 Questo capitolo non è ancora disponibile!', 'warning');
            return;
        }

        // Apri il modal della storia per questo capitolo
        if (window.modals) {
            modals.openChallengeModal('story', chapter.id);
        }
    }

    // Continua la storia dalla posizione corrente
    continueStory() {
        const currentChapter = this.getCurrentChapter();
        
        if (!currentChapter) {
            this.showNotification('🎉 Hai completato tutta la storia!', 'success');
            return;
        }

        // Trova la prima stanza non completata del capitolo corrente
        const nextRoom = currentChapter.rooms.find(room => {
            const challenge = window.castleData?.getChallengeById(room.challengeId);
            return challenge && !gameState.isChallengeCompleted(challenge.id);
        });

        if (nextRoom) {
            // Apri la sfida corrispondente CON MODALITÀ STORIA
            if (window.modals) {
                modals.openChallengeModal(nextRoom.challengeId, 'story');
            }
        } else {
            // Il capitolo è completato, passa al successivo
            this.openChapter(currentChapter);
        }
    }

    // Reset della storia
    resetStory() {
        if (!window.gameState) return;

        // Chiedi conferma
        if (!confirm('🔄 Sei sicuro di voler ricominciare la storia? Questo resetterà tutto il progresso delle sfide!')) {
            return;
        }

        // Reset del progresso delle sfide
        gameState.resetAllChallenges();
        
        // Aggiorna la vista
        this.render();
        
        this.showNotification('🔄 Storia resettata con successo!', 'info');
    }

    // Apri le impostazioni della storia
    openStorySettings() {
        // TODO: Implementare modal delle impostazioni della storia
        this.showNotification('⚙️ Impostazioni storia in arrivo!', 'info');
    }

    // Nascondi altre viste
    hideOtherViews() {
        const viewIds = ['castle-view', 'trophy-hall-view', 'memory-hall-view'];
        viewIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
    }

    // Mostra notifica
    showNotification(message, type = 'info') {
        if (window.notificationSystem) {
            notificationSystem.show(message, type);
        } else {
            console.log(`[StoryMode] ${message}`);
        }
    }

    // Ottieni informazioni di debug
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            currentChapter: this.currentChapter?.id,
            currentRoom: this.currentRoom?.id,
            storyDataLoaded: !!this.storyData,
            chaptersCount: this.storyData?.getChapters().length || 0,
            completedRooms: this.getCompletedRoomsCount()
        };
    }
}

// Crea istanza globale
const storyMode = new StoryMode();

// Rendi globale per l'accesso da altri moduli
window.storyMode = storyMode;

// Inizializza automaticamente quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    if (window.storyData && window.gameState) {
        storyMode.init();
    } else {
        // Aspetta che le dipendenze siano caricate
        const checkDependencies = () => {
            if (window.storyData && window.gameState) {
                storyMode.init();
            } else {
                setTimeout(checkDependencies, 100);
            }
        };
        checkDependencies();
    }
});
