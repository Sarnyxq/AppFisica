// GAME STATE - Fisica 3.0
// Gestione dello stato globale dell'applicazione del Grimorio

console.log('[GameState] Caricamento gameState.js...');

// Stato predefinito del giocatore (unificato con struttura completa)
const gameDefaultPlayerState = {
    playerName: '',
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    completedChallenges: [],
    completedSideQuests: [],
    discoveredZones: [1], // Zona 1 sempre disponibile
    currentChallenge: null,
    startDate: null,
    totalPlayTime: 0,
    badges: [],
    challengeData: {},
    // ===== STORY SYSTEM =====
    storyProgress: {
        currentChapter: 1,
        unlockedChapters: [1],
        completedChapters: [],
        storyMode: false,
        lastReadChapter: null,
        storyStartDate: null,
        totalStoryTime: 0
    },
    stats: {
        totalChallengesCompleted: 0,
        totalSideQuestsCompleted: 0,
        totalExpGained: 0,
        studyTimeMinutes: 0
    },
    preferences: {
        theme: 'pergamena',
        soundEnabled: true,
        notificationsEnabled: true
    }
};

class GameState {
    constructor() {
        this.playerState = { ...gameDefaultPlayerState };
        this.currentView = 'welcome';
        this.isInitialized = false;
        this.currentModal = null;
        this.listeners = {};
    }

    // Inizializza il game state
    init() {
        if (this.isInitialized) return true;
        try {
            const savedProgress = window.storageManager ? storageManager.loadProgress() : null;
            if (savedProgress) {
                this.playerState = { ...gameDefaultPlayerState, ...savedProgress };
                
                // Verifica e correggi il livello in base all'esperienza totale
                if (this.playerState.exp > 0) {
                    const { level: correctLevel } = getLevelFromExp(this.playerState.exp);
                    if (correctLevel !== this.playerState.level) {
                        console.log(`[GameState] Correzione livello al caricamento: ${this.playerState.level} → ${correctLevel} (EXP: ${this.playerState.exp})`);
                        this.playerState.level = correctLevel;
                        // Salva la correzione
                        this.saveProgress();
                    }
                }
            }
            
            // Salvaguardie per proprietà mancanti
            if (!this.playerState.challengeData) this.playerState.challengeData = {};
            if (!this.playerState.stats) this.playerState.stats = { ...gameDefaultPlayerState.stats };
            if (!this.playerState.preferences) this.playerState.preferences = { ...gameDefaultPlayerState.preferences };
            if (!this.playerState.playerName && this.playerState.name) {
                // Migrazione vecchia proprietà 'name' -> 'playerName'
                this.playerState.playerName = this.playerState.name;
                delete this.playerState.name;
            }
            
            this.isInitialized = true;
            this.emit('initialized');
            console.log('[GameState] Inizializzato - Livello:', this.playerState.level, 'EXP:', this.playerState.exp);
            return true;
        } catch (err) {
            console.error('[GameState] Errore in init():', err);
            return false;
        }
    }

    // Avvia una nuova partita
    startNewGame(playerName) {
        if (!playerName || playerName.trim() === '') {
            notificationSystem.show('Per favore, inserisci un nome per il tuo apprendista.', 'error');
            return false;
        }

        this.playerState = {
            ...gameDefaultPlayerState,
            playerName: playerName.trim(),
            startDate: new Date().toISOString()
        };

        this.saveProgress();
        this.emit('gameStarted', { playerName: playerName.trim() });
        
        notificationSystem.show(`Benvenuto nel Grimorio, ${playerName}!`, 'success');
        return true;
    }

    // Mostra l'applicazione principale
    showMainApp() {
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        this.currentView = 'map';
        this.emit('viewChanged', 'map');
        
        // Inizializza l'interfaccia
        this.updateUI();
        
        // Carica la vista della mappa
        if (window.castleMap) {
            castleMap.render();
        }
    }

    // Completa una sfida
    completeChallenge(challengeId, challengeData = {}) {
        if (this.playerState.completedChallenges.includes(challengeId)) {
            notificationSystem.show("Questa sfida è già stata completata!", "info");
            return false;
        }

        const challenge = castleData.challenges.find(c => c.id === challengeId);
        if (!challenge) {
            notificationSystem.show("Sfida non trovata!", "error");
            return false;
        }

        // Aggiungi alla lista delle sfide completate
        this.playerState.completedChallenges.push(challengeId);
        
        // Salva i dati della sfida
        if (challengeData.text || challengeData.drawing) {
            if (!this.playerState.challengeData) this.playerState.challengeData = {};
            this.playerState.challengeData[challengeId] = challengeData;
        }

        // Aggiungi esperienza
        this.addExperience(challenge.exp);

        // Aggiorna il progresso della storia
        this.updateStoryProgress(challengeId);

        // Aggiorna statistiche
        storageManager.updateStats({
            totalChallengesCompleted: 1,
            totalExpGained: challenge.exp
        });

        // Salva e aggiorna UI
        this.saveProgress();
        this.updateUI();

        // Notifiche
        notificationSystem.show(`+${challenge.exp} EXP`, "exp");
        notificationSystem.show(`${challenge.badge.icon} ${challenge.badge.name} ottenuto!`, "badge");

        this.emit('challengeCompleted', { challengeId, challenge, challengeData });
        return true;
    }

    // Completa una missione secondaria
    completeSideQuest(challengeId) {
        if (this.playerState.completedSideQuests.includes(challengeId)) {
            notificationSystem.show("Questa missione secondaria è già stata completata!", "info");
            return false;
        }

        const challenge = castleData.challenges.find(c => c.id === challengeId);
        if (!challenge || !this.playerState.completedChallenges.includes(challengeId)) {
            notificationSystem.show("Devi prima completare la sfida principale!", "error");
            return false;
        }

        // Aggiungi alla lista delle missioni secondarie completate
        this.playerState.completedSideQuests.push(challengeId);

        // Bonus esperienza per le missioni secondarie
        const bonusExp = Math.floor(challenge.exp / 2);
        this.addExperience(bonusExp);

        // Aggiorna statistiche
        storageManager.updateStats({
            totalSideQuestsCompleted: 1,
            totalExpGained: bonusExp
        });

        // Salva e aggiorna UI
        this.saveProgress();
        this.updateUI();

        // Notifiche
        notificationSystem.show(`+${bonusExp} EXP (Bonus Pratica)`, "exp");
        notificationSystem.show(`${challenge.sideQuest.badge.icon} ${challenge.sideQuest.badge.name} ottenuto!`, "badge");

        this.emit('sideQuestCompleted', { challengeId, challenge });
        return true;
    }

    // Aggiungi esperienza
    addExperience(amount) {
        const oldLevel = this.playerState.level;
        const oldExp = this.playerState.exp;
        this.playerState.exp += amount;

        console.log(`[GameState] === AGGIUNTA ESPERIENZA ===`);
        console.log(`[GameState] Esperienza prima: ${oldExp}`);
        console.log(`[GameState] Esperienza aggiunta: ${amount}`);
        console.log(`[GameState] Esperienza dopo: ${this.playerState.exp}`);

        // Ricalcola il livello in base all'esperienza totale
        const { level: newLevel, currentLevelExp } = getLevelFromExp(this.playerState.exp);
        
        if (newLevel > oldLevel) {
            this.playerState.level = newLevel;
            notificationSystem.show(`🎉 Livello ${newLevel} raggiunto!`, "levelup");
            this.emit('levelUp', { oldLevel, newLevel });
            console.log(`[GameState] Level up! ${oldLevel} → ${newLevel} (EXP: ${oldExp} → ${this.playerState.exp})`);
        }

        console.log(`[GameState] Livello finale: ${this.playerState.level}`);
        console.log(`[GameState] === AGGIORNAMENTO UI ===`);
        
        // Forza aggiornamento immediato della UI
        this.updateUI();
        
        // Aggiornamento aggiuntivo della barra esperienza per sicurezza
        setTimeout(() => {
            console.log(`[GameState] Aggiornamento barra ritardato...`);
            this.updateExpBar();
            if (window.header) {
                header.update(this.playerState);
            }
        }, 100);

        console.log(`[GameState] Esperienza aggiunta: +${amount} (Totale: ${this.playerState.exp}, Livello: ${this.playerState.level})`);
        this.emit('experienceGained', { amount, totalExp: this.playerState.exp, newLevel: this.playerState.level });
    }

    // Aggiorna l'interfaccia utente
    updateUI() {
        // Aggiorna header
        if (window.header) {
            header.update(this.playerState);
        }

        // Aggiorna barra esperienza
        this.updateExpBar();

        // Forza aggiornamento del livello se il playerState è cambiato
        if (this.playerState.exp > 0) {
            const { level: calculatedLevel } = getLevelFromExp(this.playerState.exp);
            if (calculatedLevel !== this.playerState.level) {
                console.log(`[GameState] Correzione livello: ${this.playerState.level} → ${calculatedLevel}`);
                this.playerState.level = calculatedLevel;
                if (window.header) {
                    header.update(this.playerState);
                }
            }
        }

        this.emit('uiUpdated');
    }

    // Aggiorna la barra dell'esperienza
    updateExpBar() {
        const expBar = document.getElementById('exp-bar');
        const expDisplay = document.getElementById('exp-display');
        
        if (expBar && expDisplay) {
            const expNeeded = getExpForNextLevel(this.playerState.level);
            const { currentLevelExp } = getLevelFromExp(this.playerState.exp);
            const percentage = Math.min(Math.max((currentLevelExp / expNeeded) * 100, 0), 100);
            
            // Debug intensivo per capire il problema
            console.log('[GameState] === DEBUG BARRA ESPERIENZA ===');
            console.log('[GameState] Livello corrente:', this.playerState.level);
            console.log('[GameState] Esperienza totale:', this.playerState.exp);
            console.log('[GameState] Esperienza necessaria per prossimo livello:', expNeeded);
            console.log('[GameState] Esperienza nel livello corrente:', currentLevelExp);
            console.log('[GameState] Percentuale calcolata:', percentage);
            
            // Forza l'aggiornamento della barra
            expBar.style.width = `${percentage}%`;
            expBar.style.transition = 'width 0.8s ease-out';
            
            // Forza il reflow del browser
            expBar.offsetHeight;
            
            expDisplay.textContent = `${currentLevelExp} / ${expNeeded} EXP`;
            
            console.log('[GameState] Larghezza barra impostata a:', expBar.style.width);
            console.log('[GameState] Testo display impostato a:', expDisplay.textContent);
            console.log('[GameState] === FINE DEBUG ===');
        } else {
            console.warn('[GameState] Elementi barra esperienza non trovati:', {
                expBar: !!expBar,
                expDisplay: !!expDisplay
            });
        }
        
        // Aggiorna anche le barre mobile se esistono
        const expBarMobile = document.getElementById('exp-bar-mobile');
        const expDisplayMobile = document.getElementById('exp-display-mobile');
        
        if (expBarMobile && expDisplayMobile) {
            const expNeeded = getExpForNextLevel(this.playerState.level);
            const { currentLevelExp } = getLevelFromExp(this.playerState.exp);
            const percentage = Math.min(Math.max((currentLevelExp / expNeeded) * 100, 0), 100);
            
            expBarMobile.style.width = `${percentage}%`;
            expBarMobile.style.transition = 'width 0.8s ease-out';
            expBarMobile.offsetHeight;
            expDisplayMobile.textContent = `${currentLevelExp} / ${expNeeded}`;
            
            console.log('[GameState] Barra mobile aggiornata anche');
        }
    }

    // Salva i progressi
    saveProgress() {
        // Verifica coerenza prima del salvataggio
        if (this.playerState.exp > 0) {
            const { level: correctLevel } = getLevelFromExp(this.playerState.exp);
            if (correctLevel !== this.playerState.level) {
                console.log(`[GameState] Correzione livello prima del salvataggio: ${this.playerState.level} → ${correctLevel}`);
                this.playerState.level = correctLevel;
            }
        }
        
        const success = storageManager.saveProgress(this.playerState);
        if (success) {
            console.log(`[GameState] Progressi salvati - Livello: ${this.playerState.level}, EXP: ${this.playerState.exp}`);
        }
        return success;
    }
    // Aggiunta alias breve usato altrove
    save() { return this.saveProgress(); }

    // Carica i progressi
    loadProgress() {
        const savedData = storageManager.loadProgress();
        if (savedData) {
            this.playerState = { ...gameDefaultPlayerState, ...savedData };
            return true;
        }
        return false;
    }

    // Cambia vista
    changeView(newView) {
        if (this.currentView !== newView) {
            this.currentView = newView;
            this.emit('viewChanged', newView);
        }
    }

    // Apri modale
    openModal(modalType, data = {}) {
        this.currentModal = { type: modalType, data };
        this.emit('modalOpened', this.currentModal);
    }

    // Chiudi modale
    closeModal() {
        const oldModal = this.currentModal;
        this.currentModal = null;
        this.emit('modalClosed', oldModal);
    }

    // Ottieni statistiche
    getStats() {
        const totalChallenges = castleData.challenges.length;
        const totalZones = castleData.zones.length;
        
        return {
            ...this.playerState.stats,
            challengesCompleted: this.playerState.completedChallenges.length,
            sideQuestsCompleted: this.playerState.completedSideQuests.length,
            totalChallenges,
            totalZones,
            completionPercentage: Math.round((this.playerState.completedChallenges.length / totalChallenges) * 100)
        };
    }

    // Verifica se una zona è sbloccata
    isZoneUnlocked(zoneId) {
        const zone = castleData.zones.find(z => z.id === zoneId);
        return zone && this.playerState.level >= zone.minLevel;
    }

    // Verifica se una sfida è completata
    isChallengeCompleted(challengeId) {
        return this.playerState.completedChallenges.includes(challengeId);
    }

    // Verifica se una missione secondaria è completata
    isSideQuestCompleted(challengeId) {
        return this.playerState.completedSideQuests.includes(challengeId);
    }

    // ===== STORY SYSTEM METHODS =====
    
    // Inizializza il sistema storia
    initStorySystem() {
        if (!this.playerState.storyProgress) {
            this.playerState.storyProgress = {
                currentChapter: 1,
                unlockedChapters: [1],
                completedChapters: [],
                storyMode: false,
                lastReadChapter: null,
                storyStartDate: null,
                totalStoryTime: 0
            };
            this.saveProgress();
        }
    }

    // Aggiorna il progresso della storia quando una sfida viene completata
    updateStoryProgress(challengeId) {
        if (!window.storyData) return false;

        this.initStorySystem();

        // Trova il capitolo che contiene questa sfida
        const chapter = storyData.getChapterByChallengeId(challengeId);
        if (!chapter) return false;

        // Controlla se il capitolo è ora completato
        if (this.isStoryChapterCompleted(chapter.id)) {
            // Aggiungi ai capitoli completati se non già presente
            if (!this.playerState.storyProgress.completedChapters.includes(chapter.id)) {
                this.playerState.storyProgress.completedChapters.push(chapter.id);
                
                // Sblocca il prossimo capitolo
                this.unlockNextStoryChapter(chapter.id);
                
                // Notifica completamento capitolo
                this.emit('storyChapterCompleted', { chapterId: chapter.id, chapter });
                
                // Mostra notifica
                if (window.notificationSystem) {
                    notificationSystem.show(`📚 Capitolo "${chapter.title}" completato!`, 'success');
                }
            }
        }

        this.saveProgress();
        return true;
    }

    // Verifica se un capitolo è completato
    isStoryChapterCompleted(chapterId) {
        if (!window.storyData) return false;

        const chapter = storyData.getChapterById(chapterId);
        if (!chapter) return false;

        // Controlla se tutte le stanze del capitolo sono completate
        return chapter.rooms.every(room => {
            return this.playerState.completedChallenges.includes(room.challengeId);
        });
    }

    // Sblocca il prossimo capitolo
    unlockNextStoryChapter(currentChapterId) {
        if (!window.storyData) return false;

        const nextChapterId = currentChapterId + 1;
        const chapters = storyData.getChapters();
        const nextChapter = chapters.find(ch => ch.id === nextChapterId);

        if (nextChapter && !this.playerState.storyProgress.unlockedChapters.includes(nextChapterId)) {
            this.playerState.storyProgress.unlockedChapters.push(nextChapterId);
            this.playerState.storyProgress.currentChapter = nextChapterId;
            
            this.emit('storyChapterUnlocked', { chapterId: nextChapterId, chapter: nextChapter });
            
            // Mostra notifica
            if (window.notificationSystem) {
                notificationSystem.show(`🆕 Nuovo capitolo sbloccato: "${nextChapter.title}"!`, 'success');
            }
            
            return true;
        }
        
        return false;
    }

    // Verifica se un capitolo è sbloccato
    isStoryChapterUnlocked(chapterId) {
        this.initStorySystem();
        return this.playerState.storyProgress.unlockedChapters.includes(chapterId);
    }

    // Ottieni il capitolo corrente della storia
    getCurrentStoryChapter() {
        if (!window.storyData) return null;

        this.initStorySystem();
        
        // Trova il primo capitolo non completato
        const chapters = storyData.getChapters();
        for (const chapter of chapters) {
            if (this.isStoryChapterUnlocked(chapter.id) && !this.isStoryChapterCompleted(chapter.id)) {
                return chapter;
            }
        }

        // Se tutti i capitoli sono completati, ritorna l'ultimo
        return chapters[chapters.length - 1];
    }

    // Ottieni la prossima sfida nella storia
    getNextStoryChallenge() {
        const currentChapter = this.getCurrentStoryChapter();
        if (!currentChapter) return null;

        // Trova la prima stanza non completata nel capitolo corrente
        const nextRoom = currentChapter.rooms.find(room => {
            return !this.playerState.completedChallenges.includes(room.challengeId);
        });

        if (nextRoom) {
            return window.castleData ? castleData.getChallengeById(nextRoom.challengeId) : null;
        }

        return null;
    }

    // Attiva/disattiva modalità storia
    toggleStoryMode() {
        this.initStorySystem();
        this.playerState.storyProgress.storyMode = !this.playerState.storyProgress.storyMode;
        
        if (this.playerState.storyProgress.storyMode && !this.playerState.storyProgress.storyStartDate) {
            this.playerState.storyProgress.storyStartDate = new Date().toISOString();
        }
        
        this.saveProgress();
        this.emit('storyModeToggled', { storyMode: this.playerState.storyProgress.storyMode });
        
        return this.playerState.storyProgress.storyMode;
    }

    // Imposta l'ultimo capitolo letto
    setLastReadChapter(chapterId) {
        this.initStorySystem();
        this.playerState.storyProgress.lastReadChapter = chapterId;
        this.saveProgress();
    }

    // Ottieni statistiche della storia
    getStoryStats() {
        if (!window.storyData) return null;

        this.initStorySystem();
        
        const totalChapters = storyData.getChapters().length;
        const totalRooms = storyData.getTotalRoomsCount();
        const completedChapters = this.playerState.storyProgress.completedChapters.length;
        const completedRooms = this.getCompletedStoryRoomsCount();
        
        return {
            totalChapters,
            totalRooms,
            completedChapters,
            completedRooms,
            chapterProgress: Math.round((completedChapters / totalChapters) * 100),
            roomProgress: Math.round((completedRooms / totalRooms) * 100),
            currentChapter: this.playerState.storyProgress.currentChapter,
            unlockedChapters: this.playerState.storyProgress.unlockedChapters.length,
            storyMode: this.playerState.storyProgress.storyMode
        };
    }

    // Ottieni il numero di stanze completate nella storia
    getCompletedStoryRoomsCount() {
        if (!window.storyData) return 0;

        const chapters = storyData.getChapters();
        let completedCount = 0;

        chapters.forEach(chapter => {
            chapter.rooms.forEach(room => {
                if (this.playerState.completedChallenges.includes(room.challengeId)) {
                    completedCount++;
                }
            });
        });

        return completedCount;
    }

    // Reset del progresso della storia
    resetStoryProgress() {
        if (confirm('🔄 Sei sicuro di voler resettare il progresso della storia? Questo non influenzerà le sfide completate.')) {
            this.playerState.storyProgress = {
                currentChapter: 1,
                unlockedChapters: [1],
                completedChapters: [],
                storyMode: false,
                lastReadChapter: null,
                storyStartDate: null,
                totalStoryTime: 0
            };
            
            this.saveProgress();
            this.emit('storyProgressReset');
            
            if (window.notificationSystem) {
                notificationSystem.show('📚 Progresso storia resettato!', 'info');
            }
            
            return true;
        }
        
        return false;
    }

    // Reset completo di tutte le sfide (influenza anche la storia)
    resetAllChallenges() {
        if (confirm('⚠️ Questo resetterà TUTTE le sfide completate e il progresso della storia. Continuare?')) {
            this.playerState.completedChallenges = [];
            this.playerState.completedSideQuests = [];
            this.playerState.challengeData = {};
            this.playerState.storyProgress = {
                currentChapter: 1,
                unlockedChapters: [1],
                completedChapters: [],
                storyMode: false,
                lastReadChapter: null,
                storyStartDate: null,
                totalStoryTime: 0
            };
            
            // Reset anche exp e livello se desiderato
            if (confirm('🔄 Vuoi resettare anche il livello e l\'esperienza?')) {
                this.playerState.exp = 0;
                this.playerState.level = 1;
            }
            
            this.saveProgress();
            this.updateUI();
            this.emit('allChallengesReset');
            
            if (window.notificationSystem) {
                notificationSystem.show('🔄 Tutte le sfide e la storia sono state resettate!', 'info');
            }
            
            return true;
        }
        
        return false;
    }

    // ===== END STORY SYSTEM METHODS =====

    // Event listener system
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Errore nell'event listener per ${event}:`, error);
                }
            });
        }
    }

    // Reset completo
    resetProgress() {
        if (confirm("Sei sicuro di voler azzerare tutti i progressi? Questa azione non può essere annullata.")) {
            this.playerState = { ...gameDefaultPlayerState };
            storageManager.clearAllData();
            location.reload();
        }
    }

    // Reset solo progressi (mantiene impostazioni)
    resetProgressOnly() {
        return new Promise((resolve) => {
            const modal = this.createResetConfirmationModal();
            
            const handleConfirm = () => {
                // Controlla se creare backup
                const createBackupCheckbox = modal.querySelector('#create-backup');
                const shouldCreateBackup = createBackupCheckbox ? createBackupCheckbox.checked : true;
                
                if (shouldCreateBackup) {
                    const backupSuccess = this.createBackup();
                    if (!backupSuccess) {
                        // Chiede se continuare senza backup
                        if (!confirm('Il backup non è riuscito. Vuoi continuare comunque con il reset?')) {
                            modal.remove();
                            resolve(false);
                            return;
                        }
                    }
                }
                
                // Procedi con il reset
                this.playerState = { ...gameDefaultPlayerState };
                storageManager.resetProgress();
                
                // Notifica e ricarica
                if (window.notificationSystem) {
                    notificationSystem.show('🔄 Progressi azzerati con successo!', 'success');
                }
                
                setTimeout(() => {
                    location.reload();
                }, 1500);
                
                modal.remove();
                resolve(true);
            };
            
            const handleCancel = () => {
                modal.remove();
                resolve(false);
            };
            
            modal.querySelector('#confirm-reset').addEventListener('click', handleConfirm);
            modal.querySelector('#cancel-reset').addEventListener('click', handleCancel);
            modal.querySelector('.modal-close').addEventListener('click', handleCancel);
        });
    }

    // Crea modale di conferma per il reset
    createResetConfirmationModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000;';
        
        modal.innerHTML = `
            <div class="modal-content" style="background: var(--pergamena); border: 3px solid var(--ink); border-radius: 12px; padding: 2rem; max-width: 500px; margin: 1rem;">
                <div class="modal-header" style="border-bottom: 2px solid var(--ink-light); padding-bottom: 1rem; margin-bottom: 1.5rem;">
                    <h3 class="font-dnd text-2xl text-ink-dark">⚠️ Conferma Reset Progressi</h3>
                    <button class="modal-close" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--ink-light);">&times;</button>
                </div>
                <div class="modal-body" style="margin-bottom: 2rem;">
                    <p class="text-ink mb-4">Stai per azzerare <strong>tutti i tuoi progressi</strong> nel Grimorio:</p>
                    <ul class="text-ink-light text-sm mb-4" style="list-style-type: disc; margin-left: 2rem;">
                        <li>Livello e esperienza</li>
                        <li>Sfide completate</li>
                        <li>Badge ottenuti</li>
                        <li>Dati delle sfide salvate</li>
                        <li>Statistiche di gioco</li>
                    </ul>
                    <div class="bg-amber-200/50 p-3 rounded-lg border-l-4 border-yellow-500">
                        <p class="text-ink-dark font-semibold">⚠️ Questa azione non può essere annullata!</p>
                        <p class="text-ink text-sm">Le impostazioni del sistema saranno conservate.</p>
                    </div>
                    <div class="mt-4" style="margin-top: 1rem;">
                        <label class="flex items-center gap-2 text-ink text-sm">
                            <input type="checkbox" id="create-backup" checked class="form-checkbox">
                            <span>🗄️ Crea backup automatico prima del reset</span>
                        </label>
                    </div>
                </div>
                <div class="modal-footer" style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button id="cancel-reset" class="btn-secondary" style="padding: 0.5rem 1rem;">Annulla</button>
                    <button id="confirm-reset" class="btn-danger" style="background: #dc2626; color: white; border: 2px solid #b91c1c; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: bold;">🗑️ Azzera Progressi</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    // Crea backup automatico
    createBackup() {
        try {
            const backupData = {
                playerState: this.playerState,
                settings: window.settingsModal ? settingsModal.getSettings() : {},
                completionHistory: storageManager.getData('completionHistory'),
                reviewHistory: storageManager.getData('reviewHistory'),
                difficultyChallenges: storageManager.getData('difficultyChallenges'),
                backupDate: new Date().toISOString(),
                backupType: 'automatic_before_reset',
                version: '3.0'
            };

            const dataStr = JSON.stringify(backupData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `grimorio-fisica-backup-reset-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            
            if (window.notificationSystem) {
                notificationSystem.show('💾 Backup creato automaticamente', 'success');
            }
            
            return true;
        } catch (error) {
            console.error('Errore nella creazione del backup:', error);
            if (window.notificationSystem) {
                notificationSystem.show('❌ Errore nella creazione del backup', 'error');
            }
            return false;
        }
    }

    // Debug info
    getDebugInfo() {
        const expInfo = this.playerState.exp > 0 ? getLevelFromExp(this.playerState.exp) : { level: 1, currentLevelExp: 0 };
        return {
            currentView: this.currentView,
            currentModal: this.currentModal,
            playerState: this.playerState,
            isInitialized: this.isInitialized,
            experienceInfo: {
                totalExp: this.playerState.exp,
                currentLevel: this.playerState.level,
                calculatedLevel: expInfo.level,
                currentLevelExp: expInfo.currentLevelExp,
                expForNextLevel: getExpForNextLevel(this.playerState.level),
                levelMismatch: expInfo.level !== this.playerState.level
            },
            storage: storageManager.getDebugInfo()
        };
    }

    // Ripara il sistema di esperienza
    repairExperienceSystem() {
        console.log('[GameState] Riparazione sistema esperienza...');
        const oldLevel = this.playerState.level;
        const { level: correctLevel } = getLevelFromExp(this.playerState.exp);
        
        if (correctLevel !== oldLevel) {
            this.playerState.level = correctLevel;
            console.log(`[GameState] Livello corretto: ${oldLevel} → ${correctLevel}`);
            this.saveProgress();
            this.updateUI();
            notificationSystem.show(`🔧 Sistema esperienza riparato! Livello ${correctLevel}`, 'success');
            return true;
        }
        
        console.log('[GameState] Sistema esperienza già corretto');
        return false;
    }

    // Aggiunta metodo per ottenere la vista corrente
    getCurrentView() { return this.currentView; }
}

// Crea istanza globale (semplificato)
const gameState = new GameState();
window.gameState = gameState;
console.log('[GameState] Istanza creata');
gameState.init();
