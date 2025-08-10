// HEADER COMPONENT - Fisica 3.0
// Componente header del Grimorio dell'Apprendista Stregone

class HeaderComponent {
    constructor() {
        this.container = null;
        this.isInitialized = false;
    }

    // Inizializza il componente header
    init() {
        this.container = document.getElementById('header');
        if (!this.container) {
            console.error('Container header non trovato!');
            return false;
        }

        this.render();
        this.bindEvents();
        this.isInitialized = true;
        return true;
    }

    // Renderizza l'header
    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="magic-header sticky top-0 z-50 p-4 text-white shadow-lg">
                <div class="container mx-auto">
                    <!-- Mobile Header -->
                    <div class="flex md:hidden justify-between items-center mb-4">
                        <div class="text-center flex-grow">
                            <h1 id="player-name-mobile" class="font-dnd text-xl text-yellow-300"></h1>
                            <p id="player-level-mobile" class="text-sm"></p>
                        </div>
                        <button id="mobile-menu-btn" class="text-white hover:text-yellow-300">
                            <span class="text-2xl">☰</span>
                        </button>
                    </div>

                    <!-- Desktop Header -->
                    <div class="hidden md:flex justify-between items-center gap-4 mb-4">
                        <div class="text-center sm:text-left">
                            <h1 id="player-name-display" class="font-dnd text-2xl text-yellow-300"></h1>
                            <p id="player-level-display" class="text-lg"></p>
                        </div>
                        
                        <div class="w-full sm:w-1/2 lg:w-1/3">
                            <div class="flex justify-between text-sm mb-1">
                                <span>Esperienza</span>
                                <span id="exp-display">0 / 100 EXP</span>
                            </div>
                            <div class="exp-bar-container h-6">
                                <div id="exp-bar" class="exp-bar-fill" style="width: 0%;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Mobile Experience Bar -->
                    <div class="md:hidden mb-4">
                        <div class="flex justify-between text-sm mb-1">
                            <span>Esperienza</span>
                            <span id="exp-display-mobile">0 / 100 EXP</span>
                        </div>
                        <div class="exp-bar-container h-6">
                            <div id="exp-bar-mobile" class="exp-bar-fill" style="width: 0%;"></div>
                        </div>
                    </div>

                    <!-- Navigation Buttons -->
                    <div id="nav-buttons" class="flex flex-wrap justify-center gap-2">
                        <button id="map-btn" class="nav-btn btn-primary font-dnd text-lg py-2 px-4 rounded-lg active">
                            🗺️ Mappa del Grimorio
                        </button>
                        <button id="trophy-hall-btn" class="nav-btn btn-primary font-dnd text-lg py-2 px-4 rounded-lg">
                            🏆 Sala dei Trofei
                        </button>
                        <button id="diary-btn" class="nav-btn btn-primary font-dnd text-lg py-2 px-4 rounded-lg">
                            🧠 Memoria
                        </button>
                        <button id="settings-btn" class="nav-btn btn-primary font-dnd text-lg py-2 px-4 rounded-lg">
                            ⚙️ Impostazioni
                        </button>
                    </div>

                    <!-- Mobile Menu (Hidden by default) -->
                    <div id="mobile-menu" class="md:hidden hidden mt-4 p-4 bg-pergamena-dark rounded-lg">
                        <div class="grid grid-cols-2 gap-2">
                            <button class="mobile-nav-btn btn-secondary text-sm py-2 px-3 rounded" data-view="map">
                                🗺️ Mappa
                            </button>
                            <button class="mobile-nav-btn btn-secondary text-sm py-2 px-3 rounded" data-view="trophy">
                                🏆 Trofei
                            </button>
                            <button class="mobile-nav-btn btn-secondary text-sm py-2 px-3 rounded" data-view="diary">
                                🧠 Memoria
                            </button>
                            <button class="mobile-nav-btn btn-secondary text-sm py-2 px-3 rounded" data-view="settings">
                                ⚙️ Impostazioni
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Associa gli eventi
    bindEvents() {
        if (!this.container) return;

        // Pulsanti di navigazione desktop
        const mapBtn = document.getElementById('map-btn');
        const trophyBtn = document.getElementById('trophy-hall-btn');
        const diaryBtn = document.getElementById('diary-btn');
        const settingsBtn = document.getElementById('settings-btn');

        if (mapBtn) mapBtn.addEventListener('click', () => this.navigate('map'));
        if (trophyBtn) trophyBtn.addEventListener('click', () => this.navigate('trophy'));
        if (diaryBtn) diaryBtn.addEventListener('click', () => this.navigate('diary'));
        if (settingsBtn) settingsBtn.addEventListener('click', () => this.navigate('settings'));

        // Menu mobile
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Pulsanti navigazione mobile
        const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
        mobileNavBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.navigate(view);
                if (mobileMenu) mobileMenu.classList.add('hidden');
            });
        });

        // Chiudi menu mobile quando si clicca fuori
        document.addEventListener('click', (e) => {
            if (mobileMenu && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // Naviga verso una vista
    navigate(view) {
        console.log(`🧭 Navigazione verso: ${view}`); // Debug
        
        // Aggiorna stato attivo dei pulsanti
        this.updateActiveButton(view);

        // Naviga verso la vista
        switch (view) {
            case 'map':
                if (window.castleMap) castleMap.render();
                break;
            case 'trophy':
                if (window.trophyHall) trophyHall.render();
                break;
            case 'diary':
                if (window.memoryHall) memoryHall.render();
                break;
            case 'settings':
                console.log('🔧 Tentativo di apertura impostazioni...'); // Debug
                if (window.settingsModal) {
                    console.log('✅ SettingsModal trovato, chiamata show()'); // Debug
                    settingsModal.show();
                } else {
                    console.error('❌ SettingsModal non trovato!'); // Debug
                }
                break;
        }

        // Aggiorna game state
        if (window.gameState) {
            gameState.changeView(view);
        }
    }

    // Aggiorna il pulsante attivo
    updateActiveButton(activeView) {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        const buttonMap = {
            map: 'map-btn',
            trophy: 'trophy-hall-btn',
            diary: 'diary-btn',
            settings: 'settings-btn'
        };

        const activeBtn = document.getElementById(buttonMap[activeView]);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    // Aggiorna i dati del giocatore
    update(playerState) {
        if (!playerState) return;

        // Aggiorna nome e livello (desktop)
        const nameDisplay = document.getElementById('player-name-display');
        const levelDisplay = document.getElementById('player-level-display');
        
        if (nameDisplay) nameDisplay.textContent = playerState.playerName;
        if (levelDisplay) levelDisplay.textContent = `Livello ${playerState.level} - Apprendista Stregone`;

        // Aggiorna nome e livello (mobile)
        const nameMobile = document.getElementById('player-name-mobile');
        const levelMobile = document.getElementById('player-level-mobile');
        
        if (nameMobile) nameMobile.textContent = playerState.playerName;
        if (levelMobile) levelMobile.textContent = `Livello ${playerState.level}`;

        // Aggiorna barra esperienza
        this.updateExperienceBar(playerState);
    }

    // Aggiorna la barra dell'esperienza
    updateExperienceBar(playerState) {
        if (!playerState) {
            console.warn('[Header] PlayerState non fornito per aggiornamento barra esperienza');
            return;
        }
        
        const expNeeded = getExpForNextLevel(playerState.level);
        const { currentLevelExp } = getLevelFromExp(playerState.exp);
        const percentage = Math.min(Math.max((currentLevelExp / expNeeded) * 100, 0), 100);

        console.log(`[Header] === DEBUG BARRA ESPERIENZA HEADER ===`);
        console.log(`[Header] PlayerState ricevuto:`, playerState);
        console.log(`[Header] Livello: ${playerState.level}, EXP totale: ${playerState.exp}`);
        console.log(`[Header] EXP necessari: ${expNeeded}, EXP correnti: ${currentLevelExp}`);
        console.log(`[Header] Percentuale: ${percentage.toFixed(1)}%`);

        // Desktop
        const expBar = document.getElementById('exp-bar');
        const expDisplay = document.getElementById('exp-display');
        
        console.log(`[Header] Elementi trovati - expBar:`, !!expBar, 'expDisplay:', !!expDisplay);
        
        if (expBar) {
            const oldWidth = parseFloat(expBar.style.width) || 0;
            const newWidth = percentage;
            
            // Aggiunge animazione se la barra cresce
            if (newWidth > oldWidth) {
                expBar.classList.add('growing');
                setTimeout(() => {
                    expBar.classList.remove('growing');
                }, 800);
            }
            
            expBar.style.width = `${percentage}%`;
            expBar.style.transition = 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Forza il repaint
            expBar.offsetHeight;
            
            console.log(`[Header] Barra desktop: ${oldWidth}% → ${expBar.style.width}`);
        }
        if (expDisplay) {
            const newText = `${currentLevelExp} / ${expNeeded} EXP`;
            expDisplay.textContent = newText;
            console.log(`[Header] Display desktop aggiornato:`, newText);
        }

        // Mobile
        const expBarMobile = document.getElementById('exp-bar-mobile');
        const expDisplayMobile = document.getElementById('exp-display-mobile');
        
        if (expBarMobile) {
            const oldWidthMobile = parseFloat(expBarMobile.style.width) || 0;
            const newWidthMobile = percentage;
            
            // Aggiunge animazione se la barra cresce
            if (newWidthMobile > oldWidthMobile) {
                expBarMobile.classList.add('growing');
                setTimeout(() => {
                    expBarMobile.classList.remove('growing');
                }, 800);
            }
            
            expBarMobile.style.width = `${percentage}%`;
            expBarMobile.style.transition = 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            // Forza il repaint
            expBarMobile.offsetHeight;
            console.log(`[Header] Barra mobile aggiornata:`, expBarMobile.style.width);
        }
        if (expDisplayMobile) {
            const newTextMobile = `${currentLevelExp} / ${expNeeded}`;
            expDisplayMobile.textContent = newTextMobile;
            console.log(`[Header] Display mobile aggiornato:`, newTextMobile);
        }
        
        console.log(`[Header] === FINE DEBUG HEADER ===`);
    }

    // Mostra animazione di level up
    showLevelUpAnimation() {
        const levelDisplays = [
            document.getElementById('player-level-display'),
            document.getElementById('player-level-mobile')
        ];

        levelDisplays.forEach(element => {
            if (element) {
                element.classList.add('level-up');
                setTimeout(() => {
                    element.classList.remove('level-up');
                }, 2000);
            }
        });
    }

    // Mostra notifica di esperienza guadagnata
    showExpGain(amount) {
        const expDisplays = [
            document.getElementById('exp-display'),
            document.getElementById('exp-display-mobile')
        ];

        expDisplays.forEach(element => {
            if (element) {
                const originalText = element.textContent;
                element.textContent = `+${amount} EXP!`;
                element.classList.add('shimmer');
                
                setTimeout(() => {
                    element.classList.remove('shimmer');
                    // Il testo verrà aggiornato dal prossimo update()
                }, 1500);
            }
        });
    }

    // Ottieni informazioni di debug
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            containerExists: !!this.container,
            buttonsCount: this.container ? this.container.querySelectorAll('button').length : 0
        };
    }
}

// Crea istanza globale
const headerComponent = new HeaderComponent();

// Rendi globale per l'accesso da altri moduli
window.header = headerComponent;

// Inizializza automaticamente quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    headerComponent.init();
    
    // Ascolta eventi di game state
    if (window.gameState) {
        gameState.on('levelUp', () => {
            headerComponent.showLevelUpAnimation();
        });
        
        gameState.on('experienceGained', (data) => {
            headerComponent.showExpGain(data.amount);
        });
        
        gameState.on('initialized', () => {
            // Aggiorna l'UI quando il game state è inizializzato
            if (gameState.playerState.playerName) {
                headerComponent.update(gameState.playerState);
            }
        });
        
        gameState.on('uiUpdated', () => {
            // Sincronizza la barra dell'esperienza quando l'UI viene aggiornata
            headerComponent.updateExperienceBar(gameState.playerState);
        });
    }
});
