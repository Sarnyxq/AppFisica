// APP.JS - Fisica 3.0
// File principale che inizializza e coordina tutti i moduli del Grimorio della Fisica

class FisicaApp {
    constructor() {
        this.isInitialized = false;
        this.modules = {};
        this.initStartTime = null;
        this.debugMode = false;
    }

    // Inizializza l'applicazione
    async init() {
        console.log('🧙‍♂️ Inizializzazione del Grimorio della Fisica 3.0...');
        this.initStartTime = performance.now();

        try {
            // 1. Verifica prerequisiti
            this.checkPrerequisites();

            // 2. Inizializza storage manager
            await this.initStorageManager();

            // 3. Inizializza game state
            await this.initGameState();

            // 4. Inizializza sistema di notifiche
            await this.initNotificationSystem();

            // 5. Inizializza componenti UI
            await this.initUIComponents();

            // 6. Inizializza moduli principali
            await this.initCoreModules();

            // 7. Inizializza moduli di visualizzazione
            await this.initViewModules();

            // 8. Applica impostazioni e tema
            await this.applyUserSettings();

            // 9. Setup eventi globali
            this.setupGlobalEvents();

            // 10. Mostra interfaccia principale
            await this.showMainInterface();

            // 11. Finalizza inizializzazione
            this.finishInitialization();

        } catch (error) {
            console.error('❌ Errore durante l\'inizializzazione:', error);
            this.showErrorScreen(error);
        }
    }

    // Verifica prerequisiti
    checkPrerequisites() {
        console.log('🔍 Verifica prerequisiti...');
        
        // Verifica supporto browser
        if (!window.localStorage) {
            throw new Error('Il browser non supporta localStorage');
        }

        if (!window.JSON) {
            throw new Error('Il browser non supporta JSON');
        }

        // Verifica DOM
        if (document.readyState === 'loading') {
            throw new Error('DOM non ancora pronto');
        }

        // Verifica elementi essenziali
        const essentialElements = ['header', 'main-content'];
        for (const id of essentialElements) {
            if (!document.getElementById(id)) {
                throw new Error(`Elemento essenziale mancante: ${id}`);
            }
        }

        console.log('✅ Prerequisiti verificati');
    }

    // Inizializza storage manager
    async initStorageManager() {
        console.log('💾 Inizializzazione Storage Manager...');
        
        if (!window.storageManager) {
            throw new Error('Storage Manager non trovato');
        }

        const success = storageManager.init();
        if (!success) {
            throw new Error('Errore inizializzazione Storage Manager');
        }

        this.modules.storageManager = storageManager;
        console.log('✅ Storage Manager inizializzato');
    }

    // Inizializza game state
    async initGameState() {
        console.log('🎮 Inizializzazione Game State...');
        let attempts = 0;
        const maxAttempts = 20; // aumento tentativi
        while ((!window.gameState || typeof window.gameState !== 'object') && attempts < maxAttempts) {
            attempts++;
            console.warn(`Game State non ancora disponibile. Tentativo ${attempts}/${maxAttempts}...`);
            await new Promise(r => setTimeout(r, 75));
        }
        if (!window.gameState) {
            console.error('[App] Impossibile trovare window.gameState dopo i tentativi. Script gameState.js potrebbe non essere caricato correttamente.');
            // Fallback: prova a cercare il tag script
            const existing = [...document.scripts].find(s => s.src.includes('modules/gameState.js'));
            if (!existing) {
                console.warn('[App] Tag script gameState.js non trovato, lo aggiungo dinamicamente.');
                await new Promise((resolve, reject) => {
                    const sc = document.createElement('script');
                    sc.src = 'modules/gameState.js';
                    sc.onload = resolve;
                    sc.onerror = reject;
                    document.head.appendChild(sc);
                }).catch(e => console.error('[App] Errore caricamento dinamico gameState.js', e));
            }
            if (!window.gameState) {
                throw new Error('Game State non trovato (dopo tentativi estesi)');
            }
        }
        if (gameState.init && !gameState.isInitialized) {
            const success = gameState.init();
            if (!success) throw new Error('Errore inizializzazione Game State');
        }
        this.modules.gameState = gameState;
        console.log('✅ Game State inizializzato');
    }

    // Inizializza sistema di notifiche
    async initNotificationSystem() {
        console.log('🔔 Inizializzazione Sistema Notifiche...');
        
        if (!window.notificationSystem) {
            throw new Error('Sistema Notifiche non trovato');
        }

        const success = notificationSystem.init();
        if (!success) {
            throw new Error('Errore inizializzazione Sistema Notifiche');
        }

        this.modules.notificationSystem = notificationSystem;
        console.log('✅ Sistema Notifiche inizializzato');
    }

    // Inizializza componenti UI
    async initUIComponents() {
        console.log('🖼️ Inizializzazione Componenti UI...');
        
        // Header
        if (window.header) {
            header.init();
            this.modules.header = header;
        }

        // Modali
        if (window.modals) {
            modals.init();
            this.modules.modals = modals;
        }

        // Settings Modal
        if (window.settingsModal) {
            settingsModal.init();
            this.modules.settingsModal = settingsModal;
        }

        // Canvas
        if (window.canvas) {
            canvas.init();
            this.modules.canvas = canvas;
        }

        console.log('✅ Componenti UI inizializzati');
    }

    // Inizializza moduli principali
    async initCoreModules() {
        console.log('⚙️ Inizializzazione Moduli Principali...');

        // Castle Map
        if (window.castleMap) {
            castleMap.init();
            this.modules.castleMap = castleMap;
        }

        // Wing View
        if (window.wingView) {
            wingView.init();
            this.modules.wingView = wingView;
        }

        console.log('✅ Moduli Principali inizializzati');
    }

    // Inizializza moduli di visualizzazione
    async initViewModules() {
        console.log('👁️ Inizializzazione Moduli Visualizzazione...');

        // Trophy Hall
        if (window.trophyHall) {
            trophyHall.init();
            this.modules.trophyHall = trophyHall;
        }

        // Memory Hall
        if (window.memoryHall) {
            memoryHall.init();
            this.modules.memoryHall = memoryHall;
        }

        console.log('✅ Moduli Visualizzazione inizializzati');
    }

    // Applica impostazioni utente
    async applyUserSettings() {
        console.log('🎨 Applicazione impostazioni utente...');
        
        if (this.modules.settingsModal) {
            this.modules.settingsModal.applySettings();
        }

        console.log('✅ Impostazioni applicate');
    }

    // Setup eventi globali
    setupGlobalEvents() {
        console.log('🔗 Setup eventi globali...');

        // Gestione errori globali
        window.addEventListener('error', (e) => {
            console.error('Errore globale:', e.error);
            this.handleGlobalError(e.error);
        });

        // Gestione unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rejection non gestita:', e.reason);
            this.handleGlobalError(e.reason);
        });

        // Auto-save periodico
        setInterval(() => {
            if (this.modules.gameState && this.modules.gameState.autoSave) {
                this.modules.gameState.save();
            }
        }, 30000); // Ogni 30 secondi

        // Gestione visibilità pagina
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pagina nascosta - salva stato
                if (this.modules.gameState) {
                    this.modules.gameState.save();
                }
            } else {
                // Pagina visibile - aggiorna UI se necessario
                this.refreshUI();
            }
        });

        // Gestione resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Shortcuts da tastiera
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        console.log('✅ Eventi globali configurati');
    }

    // Mostra interfaccia principale
    async showMainInterface() {
        console.log('🏠 Caricamento interfaccia principale...');

        // Nascondi loader se presente
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.style.display = 'none';
        }

        // NON nascondere il welcome screen automaticamente - sarà gestito dal welcome script
        // Prepara solo il contenuto principale per quando sarà necessario
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.display = 'block';
        }

        // Carica vista iniziale solo se non c'è welcome screen attivo
        const welcomeScreen = document.getElementById('welcome-screen');
        const mainApp = document.getElementById('main-app');
        
        if (!welcomeScreen || welcomeScreen.style.display === 'none') {
            // Non c'è welcome screen o è già nascosto, procedi normalmente
            await this.loadInitialView();
        } else {
            // Welcome screen presente, aspetta che venga gestito
            console.log('🎭 Welcome screen attivo, in attesa di input utente...');
        }

        console.log('✅ Interfaccia principale preparata');
    }

    // Carica vista iniziale
    async loadInitialView() {
        const lastView = this.modules.gameState?.getCurrentView();
        
        if (lastView && this.modules[lastView]) {
            // Carica ultima vista utilizzata
            this.modules[lastView].render();
        } else if (this.modules.castleMap) {
            // Vista predefinita: mappa del castello
            this.modules.castleMap.render();
        } else {
            // Fallback: mostra messaggio di benvenuto
            this.showWelcomeMessage();
        }
    }

    // Finalizza inizializzazione
    finishInitialization() {
        const initTime = performance.now() - this.initStartTime;
        
        this.isInitialized = true;
        
        console.log(`🎉 Grimorio della Fisica 3.0 inizializzato con successo in ${Math.round(initTime)}ms`);
        
        // Mostra notifica di benvenuto
        if (this.modules.notificationSystem) {
            this.modules.notificationSystem.show(
                '🧙‍♂️ Benvenuto nel Grimorio della Fisica!', 
                'success', 
                3000
            );
        }

        // Registra app globalmente per debug
        window.fisicaApp = this;
        
        // Trigget evento personalizzato
        document.dispatchEvent(new CustomEvent('fisicaAppReady', {
            detail: { app: this, initTime }
        }));
    }

    // Mostra schermata di errore
    showErrorScreen(error) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="error-screen card p-8 text-center max-w-2xl mx-auto mt-20">
                    <div class="text-6xl mb-4">⚠️</div>
                    <h2 class="text-2xl font-bold text-red-600 mb-4">Errore di Inizializzazione</h2>
                    <p class="text-gray-700 mb-4">Si è verificato un errore durante l'avvio del Grimorio della Fisica.</p>
                    <details class="text-left bg-gray-100 p-4 rounded mb-4">
                        <summary class="cursor-pointer font-bold">Dettagli Tecnici</summary>
                        <pre class="mt-2 text-sm overflow-auto">${error.message}\n\n${error.stack || ''}</pre>
                    </details>
                    <div class="flex gap-4 justify-center">
                        <button onclick="location.reload()" class="btn-primary px-6 py-2 rounded">
                            Ricarica Pagina
                        </button>
                        <button onclick="localStorage.clear(); location.reload()" class="btn-danger px-6 py-2 rounded">
                            Reset Completo
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // Mostra messaggio di benvenuto
    showWelcomeMessage() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="welcome-screen text-center">
                    <div class="card p-8 max-w-4xl mx-auto">
                        <h1 class="text-5xl font-dnd text-ink-dark mb-6">🧙‍♂️ Grimorio dell'Apprendista Stregone</h1>
                        <h2 class="text-3xl text-magic-blue mb-8">Fisica 3.0</h2>
                        
                        <p class="text-xl text-ink-light mb-8 max-w-3xl mx-auto">
                            Benvenuto nel tuo viaggio magico attraverso i misteri della fisica! 
                            Questo grimorio ti guiderà nell'apprendimento dei segreti dell'universo 
                            attraverso sfide interattive e sigilli da forgiare.
                        </p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div class="feature-card p-6">
                                <div class="text-4xl mb-4">🏰</div>
                                <h3 class="text-xl font-bold text-ink-dark mb-2">Esplora la Mappa</h3>
                                <p class="text-ink-light">Naviga attraverso le zone della fisica e scopri nuove sfide</p>
                            </div>
                            
                            <div class="feature-card p-6">
                                <div class="text-4xl mb-4">⚡</div>
                                <h3 class="text-xl font-bold text-ink-dark mb-2">Forgia Sigilli</h3>
                                <p class="text-ink-light">Completa sfide interattive e crea i tuoi sigilli magici</p>
                            </div>
                            
                            <div class="feature-card p-6">
                                <div class="text-4xl mb-4">🧠</div>
                                <h3 class="text-xl font-bold text-ink-dark mb-2">Ripassa e Memorizza</h3>
                                <p class="text-ink-light">Consolida l'apprendimento con il sistema di ripasso intelligente</p>
                            </div>
                        </div>
                        
                        <button onclick="castleMap.render()" class="btn-primary text-xl px-8 py-4 rounded-lg">
                            🚀 Inizia il Viaggio
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // Gestisce errori globali
    handleGlobalError(error) {
        console.error('Errore nell\'applicazione:', error);
        // Silenziata notifica generica per non disturbare l'utente
        // Manteniamo solo console log. Se serve in futuro si può riattivare.
        if (this.debugMode) {
            alert(`Errore: ${error.message}`);
        }
    }

    // Aggiorna UI
    refreshUI() {
        if (!this.isInitialized) return;

        // Aggiorna header
        if (this.modules.header) {
            this.modules.header.updateStats();
        }

        // Aggiorna vista corrente
        const currentView = this.modules.gameState?.getCurrentView();
        if (currentView && this.modules[currentView] && this.modules[currentView].refresh) {
            this.modules[currentView].refresh();
        }
    }

    // Gestisce resize finestra
    handleResize() {
        // Aggiorna canvas se presente
        if (this.modules.canvas) {
            this.modules.canvas.handleResize();
        }

        // Aggiorna layout responsive
        this.updateResponsiveLayout();
    }

    // Aggiorna layout responsive
    updateResponsiveLayout() {
        const isMobile = window.innerWidth < 768;
        document.body.classList.toggle('mobile-layout', isMobile);
    }

    // Gestisce shortcuts da tastiera
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + S: Salva
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (this.modules.gameState) {
                this.modules.gameState.save();
                if (this.modules.notificationSystem) {
                    this.modules.notificationSystem.show('Progressi salvati!', 'success', 2000);
                }
            }
        }

        // Ctrl/Cmd + ,: Apri impostazioni
        if ((e.ctrlKey || e.metaKey) && e.key === ',') {
            e.preventDefault();
            if (this.modules.settingsModal) {
                this.modules.settingsModal.show();
            }
        }

        // Escape: Chiudi modali
        if (e.key === 'Escape') {
            // Chiudi eventuali modali aperti
            if (this.modules.modals) {
                this.modules.modals.closeAll();
            }
            if (this.modules.settingsModal && this.modules.settingsModal.isVisible) {
                this.modules.settingsModal.hide();
            }
        }

        // F1: Aiuto/Debug info
        if (e.key === 'F1') {
            e.preventDefault();
            this.showDebugInfo();
        }
    }

    // Mostra informazioni di debug
    showDebugInfo() {
        if (!this.debugMode) {
            this.debugMode = true;
            console.log('🐛 Modalità debug attivata');
        }

        const debugInfo = {
            app: {
                initialized: this.isInitialized,
                modules: Object.keys(this.modules),
                initTime: this.initStartTime ? performance.now() - this.initStartTime : 'N/A'
            },
            modules: {}
        };

        // Raccogli debug info da tutti i moduli
        for (const [name, module] of Object.entries(this.modules)) {
            if (module.getDebugInfo) {
                debugInfo.modules[name] = module.getDebugInfo();
            }
        }

        console.table(debugInfo);
        
        if (this.modules.notificationSystem) {
            this.modules.notificationSystem.show(
                'Informazioni di debug salvate nella console (F12)',
                'info',
                3000
            );
        }
    }

    // Ottieni stato dell'applicazione
    getStatus() {
        return {
            initialized: this.isInitialized,
            modules: Object.keys(this.modules),
            currentView: this.modules.gameState?.getCurrentView(),
            debugMode: this.debugMode
        };
    }

    // Metodi di utilità per l'interfaccia pubblica
    navigateTo(view) {
        if (this.modules[view] && this.modules[view].render) {
            this.modules[view].render();
        }
    }

    getModule(name) {
        return this.modules[name];
    }

    // Avvia l'interfaccia principale (chiamato dal welcome screen)
    startMainInterface() {
        if (this.isInitialized) {
            this.loadInitialView();
        } else {
            console.log('App non ancora inizializzata, in attesa...');
        }
    }

    // Cleanup per test o ricaricamento
    destroy() {
        // Rimuovi event listeners
        window.removeEventListener('error', this.handleGlobalError);
        window.removeEventListener('unhandledrejection', this.handleGlobalError);
        
        // Salva stato finale
        if (this.modules.gameState) {
            this.modules.gameState.save();
        }

        this.isInitialized = false;
        this.modules = {};
    }
}

// Funzione di inizializzazione globale
function initFisicaApp() {
    const app = new FisicaApp();
    app.init();
    return app;
}

// Auto-inizializzazione quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    // Piccolo delay per assicurarsi che tutti i moduli siano caricati
    setTimeout(() => {
        window.fisicaApp = initFisicaApp();
    }, 100);
});

// Esporta per uso in altri contesti
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FisicaApp, initFisicaApp };
}
