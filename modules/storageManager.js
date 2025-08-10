// STORAGE MANAGER - Fisica 3.0
// Gestione del salvataggio e caricamento dei progressi

class StorageManager {
    constructor() {
        this.storageKey = 'grimorio_fisica_progress';
        this.settingsKey = 'grimorio_fisica_settings';
        this.isInitialized = false;
    }

    // Inizializza il storage manager
    init() {
        try {
            // Test del localStorage
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error('LocalStorage non disponibile:', error);
            return false;
        }
    }

    // Salva i progressi del giocatore
    saveProgress(playerState) {
        try {
            const dataToSave = {
                ...playerState,
                lastSaved: new Date().toISOString(),
                version: '3.0'
            };
            localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
            return true;
        } catch (error) {
            console.error('Errore nel salvataggio:', error);
            return false;
        }
    }

    // Carica i progressi del giocatore
    loadProgress() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                const progress = JSON.parse(savedData);
                // Verifica compatibilità versione
                if (progress.version && parseFloat(progress.version) >= 2.0) {
                    return progress;
                }
            }
            return null;
        } catch (error) {
            console.error('Errore nel caricamento:', error);
            return null;
        }
    }

    // Salva le impostazioni
    saveSettings(settings) {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Errore nel salvataggio impostazioni:', error);
            return false;
        }
    }

    // Carica le impostazioni
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem(this.settingsKey);
            if (savedSettings) {
                return JSON.parse(savedSettings);
            }
            return null;
        } catch (error) {
            console.error('Errore nel caricamento impostazioni:', error);
            return null;
        }
    }

    // Esporta i dati per backup
    exportData() {
        const progress = this.loadProgress();
        const settings = this.loadSettings();
        
        return {
            progress,
            settings,
            exportDate: new Date().toISOString(),
            version: '3.0'
        };
    }

    // Importa i dati da backup
    importData(backupData) {
        try {
            if (backupData.progress) {
                this.saveProgress(backupData.progress);
            }
            if (backupData.settings) {
                this.saveSettings(backupData.settings);
            }
            return true;
        } catch (error) {
            console.error('Errore nell\'importazione:', error);
            return false;
        }
    }

    // Cancella tutti i dati
    clearAllData() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.settingsKey);
            // Rimuovi anche eventuali chiavi legacy
            localStorage.removeItem('grimorio_fisica_playerName');
            localStorage.removeItem('userSettings');
            localStorage.removeItem('completionHistory');
            localStorage.removeItem('reviewHistory');
            localStorage.removeItem('difficultyChallenges');
            return true;
        } catch (error) {
            console.error('Errore nella cancellazione:', error);
            return false;
        }
    }

    // Reset solo dei progressi (mantiene le impostazioni)
    resetProgress() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem('grimorio_fisica_playerName');
            localStorage.removeItem('completionHistory');
            localStorage.removeItem('reviewHistory');
            localStorage.removeItem('difficultyChallenges');
            return true;
        } catch (error) {
            console.error('Errore nel reset dei progressi:', error);
            return false;
        }
    }

    // Verifica se ci sono dati salvati
    hasExistingData() {
        return localStorage.getItem(this.storageKey) !== null;
    }

    // Salva i dati di una sfida specifica
    saveChallengeData(challengeId, data) {
        const progress = this.loadProgress();
        if (progress) {
            if (!progress.challengeData) {
                progress.challengeData = {};
            }
            progress.challengeData[challengeId] = {
                ...data,
                lastModified: new Date().toISOString()
            };
            this.saveProgress(progress);
            return true;
        }
        return false;
    }

    // Carica i dati di una sfida specifica
    loadChallengeData(challengeId) {
        const progress = this.loadProgress();
        if (progress && progress.challengeData && progress.challengeData[challengeId]) {
            return progress.challengeData[challengeId];
        }
        return { text: "", drawing: "" };
    }

    // Aggiorna le statistiche
    updateStats(statUpdates) {
        const progress = this.loadProgress();
        if (progress) {
            if (!progress.stats) {
                progress.stats = {
                    totalChallengesCompleted: 0,
                    totalSideQuestsCompleted: 0,
                    totalExpGained: 0,
                    studyTimeMinutes: 0
                };
            }
            
            Object.keys(statUpdates).forEach(key => {
                if (progress.stats.hasOwnProperty(key)) {
                    progress.stats[key] += statUpdates[key];
                }
            });
            
            this.saveProgress(progress);
            return true;
        }
        return false;
    }

    // Ottieni informazioni di debug
    getDebugInfo() {
        return {
            storageSupported: typeof(Storage) !== "undefined",
            dataExists: this.hasExistingData(),
            storageUsed: this.getStorageSize(),
            lastSaved: this.getLastSaveDate()
        };
    }

    // Calcola la dimensione dello storage utilizzato
    getStorageSize() {
        try {
            const progress = localStorage.getItem(this.storageKey);
            const settings = localStorage.getItem(this.settingsKey);
            const totalSize = (progress ? progress.length : 0) + (settings ? settings.length : 0);
            return `${(totalSize / 1024).toFixed(2)} KB`;
        } catch (error) {
            return 'Non disponibile';
        }
    }

    // Ottieni la data dell'ultimo salvataggio
    getLastSaveDate() {
        try {
            const progress = this.loadProgress();
            return progress && progress.lastSaved ? new Date(progress.lastSaved).toLocaleString() : 'Mai';
        } catch (error) {
            return 'Non disponibile';
        }
    }

    // Metodi generici per compatibilità con altri moduli
    getData(key) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error('Errore getData', key, e);
            return null;
        }
    }
    saveData(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Errore saveData', key, e);
            return false;
        }
    }
    removeData(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Errore removeData', key, e);
            return false;
        }
    }
    clearAll() { return this.clearAllData(); }
}

// Crea istanza globale
const storageManager = new StorageManager();

// Rendi globale per l'accesso da altri moduli
window.storageManager = storageManager;
