// SETTINGS MODAL - Fisica 3.0
// Componente modale per le impostazioni del Grimorio

class SettingsModal {
    constructor() {
        this.isVisible = false;
        this.settings = {
            theme: 'pergamena', // pergamena, dark, light
            notifications: true,
            soundEffects: true,
            autoSave: true,
            reviewReminders: true,
            animationSpeed: 'normal', // slow, normal, fast
            canvasLineWidth: 3,
            canvasColor: '#8B4513',
            difficultyMode: 'adaptive', // fixed, adaptive
            language: 'it' // it, en
        };
        this.originalSettings = {};
    }

    // Inizializza il componente
    init() {
        console.log('🔧 Inizializzazione Settings Modal...');
        
        // Verifica che i prerequisiti siano disponibili
        if (!window.storageManager) {
            console.error('❌ storageManager non disponibile per settingsModal');
            return false;
        }
        
        if (!window.notificationSystem) {
            console.error('❌ notificationSystem non disponibile per settingsModal');
            return false;
        }
        
        this.loadSettings();
        this.createModal();
        this.bindEvents();
        
        console.log('✅ Settings Modal inizializzato');
        return true;
    }

    // Carica le impostazioni salvate
    loadSettings() {
        if (!window.storageManager) {
            console.warn('🔧 storageManager non disponibile per caricare impostazioni');
            return;
        }
        
        try {
            const savedSettings = storageManager.getData('userSettings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...savedSettings };
                console.log('🔧 Impostazioni caricate:', this.settings);
            }
        } catch (error) {
            console.error('🔧 Errore caricamento impostazioni:', error);
        }
    }

    // Salva le impostazioni
    saveSettings() {
        try {
            if (window.storageManager) {
                storageManager.saveData('userSettings', this.settings);
            }
            
            this.applySettings();
            
            if (window.notificationSystem) {
                notificationSystem.show('Impostazioni salvate!', 'success');
            }
            
            console.log('🔧 Impostazioni salvate:', this.settings);
        } catch (error) {
            console.error('🔧 Errore salvataggio impostazioni:', error);
            if (window.notificationSystem) {
                notificationSystem.show('Errore nel salvataggio delle impostazioni', 'error');
            }
        }
    }

    // Applica le impostazioni al sistema
    applySettings() {
        // Applica tema
        this.applyTheme();
        
        // Applica velocità animazioni
        this.applyAnimationSpeed();
        
        // Notifiche
        if (window.notificationSystem) {
            notificationSystem.enabled = this.settings.notifications;
        }
        
        // Auto-save
        if (window.gameState) {
            gameState.autoSave = this.settings.autoSave;
        }
        
        // Canvas (solo se inizializzato)
        if (window.canvas) {
            if (canvas.isInitialized && canvas.ctx) {
                canvas.setLineWidth(this.settings.canvasLineWidth);
                canvas.setLineColor(this.settings.canvasColor);
            } else {
                // Memorizza preferenze per applicarle al momento dell'inizializzazione
                canvas.tools.pen.size = this.settings.canvasLineWidth;
                canvas.tools.pen.color = this.settings.canvasColor;
            }
        }
    }

    // Applica il tema
    applyTheme() {
        const body = document.body;
        body.classList.remove('theme-pergamena', 'theme-dark', 'theme-light');
        body.classList.add(`theme-${this.settings.theme}`);
        
        // Aggiorna variabili CSS per il tema
        const root = document.documentElement;
        switch (this.settings.theme) {
            case 'dark':
                root.style.setProperty('--bg-primary', '#1a1a1a');
                root.style.setProperty('--bg-secondary', '#2d2d2d');
                root.style.setProperty('--text-primary', '#ffffff');
                root.style.setProperty('--text-secondary', '#cccccc');
                break;
            case 'light':
                root.style.setProperty('--bg-primary', '#ffffff');
                root.style.setProperty('--bg-secondary', '#f5f5f5');
                root.style.setProperty('--text-primary', '#333333');
                root.style.setProperty('--text-secondary', '#666666');
                break;
            default: // pergamena
                root.style.setProperty('--bg-primary', '#f4f1e8');
                root.style.setProperty('--bg-secondary', '#e8e2d0');
                root.style.setProperty('--text-primary', '#3d2f1f');
                root.style.setProperty('--text-secondary', '#6b5b3f');
        }
    }

    // Applica la velocità delle animazioni
    applyAnimationSpeed() {
        const root = document.documentElement;
        switch (this.settings.animationSpeed) {
            case 'slow':
                root.style.setProperty('--animation-duration', '0.8s');
                break;
            case 'fast':
                root.style.setProperty('--animation-duration', '0.2s');
                break;
            default: // normal
                root.style.setProperty('--animation-duration', '0.4s');
        }
    }

    // Crea il modale
    createModal() {
        // Rimuovi modale esistente se presente
        const existingModal = document.getElementById('settings-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'settings-modal';
        modal.className = 'modal-overlay';
        modal.style.display = 'none'; // Inizialmente nascosto
        modal.innerHTML = `
            <div class="modal-content large-modal">
                <div class="modal-header">
                    <h2 class="text-2xl font-dnd text-ink-dark">⚙️ Impostazioni del Grimorio</h2>
                    <button class="modal-close text-3xl text-ink-light hover:text-ink-dark">&times;</button>
                </div>
                <div class="modal-body">
                    ${this.renderSettingsContent()}
                </div>
                <div class="modal-footer">
                    <button id="settings-reset" class="btn-danger">Reset</button>
                    <div class="flex gap-2">
                        <button id="settings-cancel" class="btn-secondary">Annulla</button>
                        <button id="settings-save" class="btn-primary">Salva</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        console.log('🔧 Modale impostazioni creato');
    }

    // Renderizza il contenuto delle impostazioni
    renderSettingsContent() {
        return `
            <div class="settings-grid">
                <!-- Sezione Aspetto -->
                <div class="settings-section">
                    <h3 class="settings-section-title">🎨 Aspetto</h3>
                    
                    <div class="setting-item">
                        <label class="setting-label">Tema</label>
                        <select id="setting-theme" class="setting-input">
                            <option value="pergamena" ${this.settings.theme === 'pergamena' ? 'selected' : ''}>Pergamena Magica</option>
                            <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Tema Scuro</option>
                            <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Tema Chiaro</option>
                        </select>
                    </div>

                    <div class="setting-item">
                        <label class="setting-label">Velocità Animazioni</label>
                        <select id="setting-animation-speed" class="setting-input">
                            <option value="slow" ${this.settings.animationSpeed === 'slow' ? 'selected' : ''}>Lente</option>
                            <option value="normal" ${this.settings.animationSpeed === 'normal' ? 'selected' : ''}>Normali</option>
                            <option value="fast" ${this.settings.animationSpeed === 'fast' ? 'selected' : ''}>Veloci</option>
                        </select>
                    </div>
                </div>

                <!-- Sezione Gameplay -->
                <div class="settings-section">
                    <h3 class="settings-section-title">🎮 Gameplay</h3>
                    
                    <div class="setting-item">
                        <label class="setting-label checkbox-label">
                            <input type="checkbox" id="setting-notifications" ${this.settings.notifications ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            Notifiche
                        </label>
                        <small class="setting-description">Mostra notifiche per eventi e progressi</small>
                    </div>

                    <div class="setting-item">
                        <label class="setting-label checkbox-label">
                            <input type="checkbox" id="setting-sound-effects" ${this.settings.soundEffects ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            Effetti Sonori
                        </label>
                        <small class="setting-description">Riproduce suoni per azioni e completamenti</small>
                    </div>

                    <div class="setting-item">
                        <label class="setting-label checkbox-label">
                            <input type="checkbox" id="setting-auto-save" ${this.settings.autoSave ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            Salvataggio Automatico
                        </label>
                        <small class="setting-description">Salva automaticamente il progresso</small>
                    </div>

                    <div class="setting-item">
                        <label class="setting-label">Modalità Difficoltà</label>
                        <select id="setting-difficulty-mode" class="setting-input">
                            <option value="fixed" ${this.settings.difficultyMode === 'fixed' ? 'selected' : ''}>Fissa</option>
                            <option value="adaptive" ${this.settings.difficultyMode === 'adaptive' ? 'selected' : ''}>Adattiva</option>
                        </select>
                        <small class="setting-description">La modalità adattiva regola automaticamente la difficoltà</small>
                    </div>
                </div>

                <!-- Sezione Canvas -->
                <div class="settings-section">
                    <h3 class="settings-section-title">✏️ Disegno Sigilli</h3>
                    
                    <div class="setting-item">
                        <label class="setting-label">Spessore Linea</label>
                        <input type="range" id="setting-canvas-line-width" min="1" max="10" value="${this.settings.canvasLineWidth}" class="setting-range">
                        <span class="range-value">${this.settings.canvasLineWidth}px</span>
                    </div>

                    <div class="setting-item">
                        <label class="setting-label">Colore Pennello</label>
                        <div class="color-picker-container">
                            <input type="color" id="setting-canvas-color" value="${this.settings.canvasColor}" class="color-picker">
                            <div class="color-presets">
                                <button class="color-preset" data-color="#8B4513" style="background-color: #8B4513;" title="Marrone Magico"></button>
                                <button class="color-preset" data-color="#000000" style="background-color: #000000;" title="Nero"></button>
                                <button class="color-preset" data-color="#4A4A4A" style="background-color: #4A4A4A;" title="Grigio Scuro"></button>
                                <button class="color-preset" data-color="#8B0000" style="background-color: #8B0000;" title="Rosso Scuro"></button>
                                <button class="color-preset" data-color="#006400" style="background-color: #006400;" title="Verde Scuro"></button>
                                <button class="color-preset" data-color="#4B0082" style="background-color: #4B0082;" title="Indaco"></button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sezione Studio -->
                <div class="settings-section">
                    <h3 class="settings-section-title">🧠 Studio e Ripasso</h3>
                    
                    <div class="setting-item">
                        <label class="setting-label checkbox-label">
                            <input type="checkbox" id="setting-review-reminders" ${this.settings.reviewReminders ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            Promemoria Ripasso
                        </label>
                        <small class="setting-description">Ricorda quando è tempo di ripassare</small>
                    </div>
                </div>

                <!-- Sezione Sistema -->
                <div class="settings-section">
                    <h3 class="settings-section-title">🔧 Sistema</h3>
                    
                    <div class="setting-item">
                        <label class="setting-label">Lingua</label>
                        <select id="setting-language" class="setting-input">
                            <option value="it" ${this.settings.language === 'it' ? 'selected' : ''}>Italiano</option>
                            <option value="en" ${this.settings.language === 'en' ? 'selected' : ''}>English</option>
                        </select>
                    </div>

                    <div class="setting-item">
                        <button id="export-data" class="btn-secondary w-full">📥 Esporta Dati</button>
                        <small class="setting-description">Esporta i tuoi progressi in un file di backup</small>
                    </div>

                    <div class="setting-item">
                        <button id="import-data" class="btn-secondary w-full">📤 Importa Dati</button>
                        <input type="file" id="import-file" accept=".json" style="display: none;">
                        <small class="setting-description">Importa progressi da un file di backup</small>
                    </div>
                </div>

                <!-- Sezione Reset e Gestione Dati -->
                <div class="settings-section">
                    <h3 class="settings-section-title">🔄 Reset e Gestione Dati</h3>
                    
                    <div class="setting-item">
                        <button id="reset-progress" class="btn-warning w-full">🔄 Reset Progressi</button>
                        <small class="setting-description">Azzera tutti i progressi mantenendo le impostazioni</small>
                    </div>

                    <div class="setting-item">
                        <button id="clear-data" class="btn-danger w-full">🗑️ Cancella Tutti i Dati</button>
                        <small class="setting-description">⚠️ Cancella progressi E impostazioni - Non reversibile!</small>
                    </div>
                </div>
            </div>
        `;
    }

    // Associa gli eventi
    bindEvents() {
        document.addEventListener('click', (e) => {
            // Apri impostazioni - CORREZIONE: aggiungo #settings-btn
            if (e.target.matches('#settings-button, #settings-btn, .settings-trigger')) {
                e.preventDefault();
                this.show();
            }
            
            // Chiudi modale
            if (e.target.matches('#settings-modal .modal-close, #settings-cancel')) {
                e.preventDefault();
                this.hide();
            }
            
            // Salva impostazioni
            if (e.target.matches('#settings-save')) {
                e.preventDefault();
                this.saveCurrentSettings();
            }
            
            // Reset impostazioni
            if (e.target.matches('#settings-reset')) {
                e.preventDefault();
                this.resetSettings();
            }
            
            // Preset colori
            if (e.target.matches('.color-preset')) {
                e.preventDefault();
                const color = e.target.dataset.color;
                document.getElementById('setting-canvas-color').value = color;
            }
            
            // Esporta dati
            if (e.target.matches('#export-data')) {
                e.preventDefault();
                this.exportData();
            }
            
            // Importa dati
            if (e.target.matches('#import-data')) {
                e.preventDefault();
                document.getElementById('import-file').click();
            }
            
            // Reset progressi (nuovo)
            if (e.target.matches('#reset-progress')) {
                e.preventDefault();
                this.resetProgress();
            }
            
            // Cancella tutti i dati
            if (e.target.matches('#clear-data')) {
                e.preventDefault();
                this.clearAllData();
            }
        });

        // Chiudi cliccando fuori
        document.addEventListener('click', (e) => {
            if (e.target.matches('#settings-modal')) {
                this.hide();
            }
        });

        // Range slider update
        document.addEventListener('input', (e) => {
            if (e.target.matches('#setting-canvas-line-width')) {
                const valueSpan = e.target.parentNode.querySelector('.range-value');
                if (valueSpan) {
                    valueSpan.textContent = e.target.value + 'px';
                }
            }
        });

        // File import
        document.addEventListener('change', (e) => {
            if (e.target.matches('#import-file')) {
                this.importData(e.target.files[0]);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.isVisible) {
                if (e.key === 'Escape') {
                    this.hide();
                } else if (e.key === 'Enter' && e.ctrlKey) {
                    this.saveCurrentSettings();
                }
            }
        });
    }

    // Mostra il modale
    show() {
        console.log('🔧 Apertura menu impostazioni...'); // Debug
        
        let modal = document.getElementById('settings-modal');
        if (!modal) {
            console.log('🔧 Creazione modale impostazioni...'); // Debug
            this.createModal();
            modal = document.getElementById('settings-modal');
        }
        
        if (!modal) {
            console.error('❌ Impossibile creare il modale impostazioni!');
            return;
        }
        
        this.originalSettings = { ...this.settings };
        this.updateModalValues();
        
        // Assicurati che il modale sia visibile
        modal.style.display = 'flex';
        modal.classList.add('show');
        this.isVisible = true;
        
        console.log('✅ Menu impostazioni aperto'); // Debug
        
        // Focus management
        setTimeout(() => {
            const firstInput = modal.querySelector('input, select, button');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    // Alias per compatibilità
    open() {
        return this.show();
    }

    // Nascondi il modale
    hide() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }
        this.isVisible = false;
        console.log('🔧 Menu impostazioni chiuso');
    }

    // Aggiorna i valori nel modale
    updateModalValues() {
        Object.keys(this.settings).forEach(key => {
            const element = document.getElementById(`setting-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.settings[key];
                } else {
                    element.value = this.settings[key];
                }
            }
        });
    }

    // Salva le impostazioni correnti dal modale
    saveCurrentSettings() {
        const modal = document.getElementById('settings-modal');
        if (!modal) return;

        // Raccogli tutti i valori
        this.settings.theme = document.getElementById('setting-theme').value;
        this.settings.notifications = document.getElementById('setting-notifications').checked;
        this.settings.soundEffects = document.getElementById('setting-sound-effects').checked;
        this.settings.autoSave = document.getElementById('setting-auto-save').checked;
        this.settings.reviewReminders = document.getElementById('setting-review-reminders').checked;
        this.settings.animationSpeed = document.getElementById('setting-animation-speed').value;
        this.settings.canvasLineWidth = parseInt(document.getElementById('setting-canvas-line-width').value);
        this.settings.canvasColor = document.getElementById('setting-canvas-color').value;
        this.settings.difficultyMode = document.getElementById('setting-difficulty-mode').value;
        this.settings.language = document.getElementById('setting-language').value;

        this.saveSettings();
        this.hide();
    }

    // Reset alle impostazioni predefinite
    resetSettings() {
        if (confirm('Sei sicuro di voler ripristinare tutte le impostazioni ai valori predefiniti?')) {
            this.settings = {
                theme: 'pergamena',
                notifications: true,
                soundEffects: true,
                autoSave: true,
                reviewReminders: true,
                animationSpeed: 'normal',
                canvasLineWidth: 3,
                canvasColor: '#8B4513',
                difficultyMode: 'adaptive',
                language: 'it'
            };
            
            this.updateModalValues();
            notificationSystem.show('Impostazioni ripristinate ai valori predefiniti', 'info');
        }
    }

    // Esporta i dati
    exportData() {
        const allData = {
            playerState: gameState.playerState,
            settings: this.settings,
            completionHistory: storageManager.getData('completionHistory'),
            reviewHistory: storageManager.getData('reviewHistory'),
            difficultyChallenges: storageManager.getData('difficultyChallenges'),
            exportDate: new Date().toISOString(),
            version: '3.0'
        };

        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `grimorio-fisica-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        notificationSystem.show('Dati esportati con successo!', 'success');
    }

    // Importa i dati
    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!data.playerState || !data.version) {
                    throw new Error('File non valido');
                }

                if (confirm('Importare questi dati sovrascriverà tutti i progressi attuali. Continuare?')) {
                    // Salva i dati importati
                    if (data.playerState) gameState.playerState = data.playerState;
                    if (data.settings) this.settings = data.settings;
                    if (data.completionHistory) storageManager.saveData('completionHistory', data.completionHistory);
                    if (data.reviewHistory) storageManager.saveData('reviewHistory', data.reviewHistory);
                    if (data.difficultyChallenges) storageManager.saveData('difficultyChallenges', data.difficultyChallenges);
                    
                    this.saveSettings();
                    gameState.save();
                    
                    notificationSystem.show('Dati importati con successo!', 'success');
                    
                    // Ricarica la pagina per applicare tutto
                    setTimeout(() => location.reload(), 1000);
                }
            } catch (error) {
                notificationSystem.show('Errore nell\'importazione: file non valido', 'error');
            }
        };
        
        reader.readAsText(file);
    }

    // Reset solo progressi (mantiene impostazioni)
    async resetProgress() {
        this.hide(); // Chiudi il menu impostazioni
        
        if (window.gameState && typeof gameState.resetProgressOnly === 'function') {
            await gameState.resetProgressOnly();
        } else {
            // Fallback se il metodo non esiste
            if (confirm('Sei sicuro di voler azzerare tutti i progressi? Le impostazioni saranno conservate.\n\nQuesta azione non può essere annullata.')) {
                storageManager.resetProgress();
                notificationSystem.show('Progressi azzerati con successo!', 'success');
                setTimeout(() => location.reload(), 1500);
            }
        }
    }

    // Cancella tutti i dati
    clearAllData() {
        const confirmText = 'CANCELLA TUTTO';
        const userInput = prompt(`Questa azione cancellerà TUTTI I TUOI DATI (progressi e impostazioni) e non può essere annullata.\n\nPer confermare, scrivi: ${confirmText}`);
        
        if (userInput === confirmText) {
            storageManager.clearAll();
            notificationSystem.show('Tutti i dati sono stati cancellati', 'info');
            setTimeout(() => location.reload(), 1000);
        }
    }

    // Ottieni le impostazioni correnti
    getSettings() {
        return { ...this.settings };
    }

    // Ottieni informazioni di debug
    getDebugInfo() {
        return {
            isVisible: this.isVisible,
            settings: this.settings,
            modalExists: !!document.getElementById('settings-modal')
        };
    }
}

// Crea istanza globale
const settingsModal = new SettingsModal();

// Rendi globale per l'accesso da altri moduli
window.settingsModal = settingsModal;

// Inizializza automaticamente quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    // Aspetta che i prerequisiti siano pronti
    function initSettingsModal() {
        if (window.storageManager && window.notificationSystem) {
            settingsModal.init();
            settingsModal.applySettings(); // Applica le impostazioni salvate all'avvio
            console.log('🔧 Settings Modal inizializzato automaticamente');
        } else {
            console.log('🔧 Settings Modal in attesa dei prerequisiti...');
            setTimeout(initSettingsModal, 100); // Riprova dopo 100ms
        }
    }
    
    initSettingsModal();
});

// Test function per debugging
window.testSettings = function() {
    console.log('🧪 Test apertura impostazioni...');
    
    if (window.settingsModal) {
        console.log('✅ SettingsModal disponibile');
        try {
            settingsModal.show();
            console.log('✅ show() chiamato con successo');
        } catch (error) {
            console.error('❌ Errore in show():', error);
        }
    } else {
        console.error('❌ SettingsModal non disponibile');
    }
    
    const modal = document.getElementById('settings-modal');
    if (modal) {
        console.log('✅ Elemento settings-modal trovato');
        console.log('Style display:', modal.style.display);
        console.log('Classes:', modal.className);
    } else {
        console.error('❌ Elemento settings-modal non trovato');
    }
};
