// CASTLE MAP - Fisica 3.0
// Modulo per la visualizzazione della mappa del Grimorio

class CastleMap {
    constructor() {
        this.container = null;
        this.isInitialized = false;
    }

    // Inizializza il modulo della mappa
    init() {
        this.container = document.getElementById('main-content');
        if (!this.container) {
            console.error('Container principale non trovato!');
            return false;
        }
        this.isInitialized = true;
        return true;
    }

    // Renderizza la mappa del grimorio
    render() {
        if (!this.container) {
            console.error('Mappa non inizializzata!');
            return;
        }

        const zones = castleData.zones;
        
        this.container.innerHTML = `
            <div class="text-center mb-8">
                <h2 class="text-4xl font-dnd text-ink-dark mb-4">Il Grimorio dell'Apprendista Stregone</h2>
                <p class="text-lg text-ink-light max-w-3xl mx-auto">
                    Esplora i capitoli di questo antico grimorio per padroneggiare i segreti della fisica. 
                    Ogni zona racchiude conoscenze che ti avvicineranno alla maestria delle forze naturali.
                </p>
                ${this.renderProgressOverview()}
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${zones.map(zone => this.renderZoneCard(zone)).join('')}
            </div>
            
            ${this.renderQuickStats()}
        `;

        this.bindEvents();
    }

    // Renderizza la panoramica del progresso
    renderProgressOverview() {
        const stats = gameState.getStats();
        const totalChallenges = castleData.challenges.length;
        const completedChallenges = gameState.playerState.completedChallenges.length;
        const completionPercentage = Math.round((completedChallenges / totalChallenges) * 100);

        return `
            <div class="card p-6 max-w-4xl mx-auto my-6">
                <h3 class="text-xl font-dnd text-ink-dark mb-4 text-center">Il Tuo Progresso nel Grimorio</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div class="p-4">
                        <div class="text-3xl font-bold text-gold">${completedChallenges}</div>
                        <div class="text-sm text-ink-light">Sfide Completate</div>
                        <div class="text-xs text-ink-light">su ${totalChallenges} totali</div>
                    </div>
                    <div class="p-4">
                        <div class="text-3xl font-bold text-gold">${gameState.playerState.level}</div>
                        <div class="text-sm text-ink-light">Livello Apprendista</div>
                        <div class="text-xs text-ink-light">${gameState.playerState.exp} EXP totali</div>
                    </div>
                    <div class="p-4">
                        <div class="text-3xl font-bold text-gold">${completionPercentage}%</div>
                        <div class="text-sm text-ink-light">Completamento</div>
                        <div class="w-full bg-pergamena-darker rounded-full h-2 mt-2">
                            <div class="exp-bar-fill h-2 rounded-full" style="width: ${completionPercentage}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Renderizza una card della zona
    renderZoneCard(zone) {
        const isUnlocked = gameState.isZoneUnlocked(zone.id);
        const zoneChallenges = castleData.challenges.filter(c => c.zoneId === zone.id);
        const completedInZone = zoneChallenges.filter(c => 
            gameState.isChallengeCompleted(c.id)
        ).length;
        
        const zoneProgress = zoneChallenges.length > 0 ? 
            Math.round((completedInZone / zoneChallenges.length) * 100) : 0;

        return `
            <div class="zone-card card p-6 text-center transition-all duration-300 ${!isUnlocked ? 'locked cursor-not-allowed' : 'cursor-pointer hover:transform hover:scale-105'}" 
                 data-zone-id="${zone.id}" 
                 ${isUnlocked ? '' : 'title="Zona bloccata - Livello ' + zone.minLevel + ' richiesto"'}>
                
                <!-- Icona della zona -->
                <div class="text-6xl mb-4 ${isUnlocked ? '' : 'grayscale opacity-50'}">${zone.icon}</div>
                
                <!-- Titolo e descrizione -->
                <h3 class="text-xl font-dnd text-ink-dark mb-2 ${!isUnlocked ? 'text-gray-500' : ''}">${zone.title}</h3>
                <p class="text-ink-light text-sm mb-4 ${!isUnlocked ? 'text-gray-400' : ''}">${zone.desc}</p>
                
                ${isUnlocked ? `
                    <!-- Progresso della zona -->
                    <div class="mb-4">
                        <div class="flex justify-between text-xs mb-1">
                            <span>Progresso</span>
                            <span>${completedInZone}/${zoneChallenges.length}</span>
                        </div>
                        <div class="w-full bg-pergamena-darker rounded-full h-2">
                            <div class="exp-bar-fill h-2 rounded-full" style="width: ${zoneProgress}%"></div>
                        </div>
                        <div class="text-xs text-ink-light mt-1">${zoneProgress}% completato</div>
                    </div>
                    
                    <!-- Pulsante esplora -->
                    <button class="btn-primary font-dnd text-lg py-2 px-6 rounded-lg w-full">
                        Esplora Zona
                    </button>
                ` : `
                    <!-- Zona bloccata -->
                    <div class="p-4 bg-gray-200 rounded-lg">
                        <p class="font-bold text-red-700 mb-2">🔒 Zona Bloccata</p>
                        <p class="text-sm text-gray-600">Livello ${zone.minLevel} richiesto</p>
                        <p class="text-xs text-gray-500 mt-1">Il tuo livello: ${gameState.playerState.level}</p>
                    </div>
                `}
                
                <!-- Badge preview -->
                ${this.renderZoneBadgePreview(zoneChallenges)}
            </div>
        `;
    }

    // Renderizza l'anteprima dei badge della zona
    renderZoneBadgePreview(zoneChallenges) {
        const mainBadges = zoneChallenges
            .filter(c => gameState.isChallengeCompleted(c.id))
            .map(c => c.badge.icon)
            .slice(0, 3);
        
        const sideQuestBadges = zoneChallenges
            .filter(c => gameState.isSideQuestCompleted(c.id))
            .map(c => c.sideQuest.badge.icon)
            .slice(0, 2);

        if (mainBadges.length === 0 && sideQuestBadges.length === 0) {
            return '';
        }

        return `
            <div class="mt-4 pt-4 border-t border-ink/20">
                <div class="text-xs text-ink-light mb-2">Sigilli Forgiati:</div>
                <div class="flex justify-center gap-1 text-sm">
                    ${mainBadges.map(icon => `<span class="badge-unlocked">${icon}</span>`).join('')}
                    ${sideQuestBadges.map(icon => `<span class="badge-unlocked opacity-75">${icon}</span>`).join('')}
                    ${mainBadges.length + sideQuestBadges.length > 5 ? '<span class="text-ink-light">...</span>' : ''}
                </div>
            </div>
        `;
    }

    // Renderizza le statistiche rapide
    renderQuickStats() {
        const recentChallenges = gameState.playerState.completedChallenges
            .slice(-3)
            .map(id => castleData.challenges.find(c => c.id === id))
            .filter(c => c);

        if (recentChallenges.length === 0) {
            return `
                <div class="card p-6 mt-8 text-center">
                    <h3 class="text-xl font-dnd text-ink-dark mb-4">Inizia la Tua Avventura</h3>
                    <p class="text-ink-light">Clicca su una zona per iniziare a esplorare il grimorio e forgiare i tuoi primi sigilli!</p>
                    <div class="text-4xl mt-4">🔮✨🧠</div>
                </div>
            `;
        }

        return `
            <div class="card p-6 mt-8">
                <h3 class="text-xl font-dnd text-ink-dark mb-4 text-center">Ultime Conquiste</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${recentChallenges.map(challenge => `
                        <div class="text-center p-3 bg-pergamena-dark rounded-lg">
                            <div class="text-2xl mb-2">${challenge.badge.icon}</div>
                            <div class="text-sm font-semibold text-ink-dark">${challenge.title}</div>
                            <div class="text-xs text-ink-light mt-1">+${challenge.exp} EXP</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Associa gli eventi
    bindEvents() {
        if (!this.container) return;

        // Eventi per le zone sbloccate
        const zoneCards = this.container.querySelectorAll('.zone-card:not(.locked)');
        zoneCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const zoneId = parseInt(e.currentTarget.dataset.zoneId);
                this.navigateToZone(zoneId);
            });
        });

        // Effetti hover per le zone bloccate
        const lockedCards = this.container.querySelectorAll('.zone-card.locked');
        lockedCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const zoneId = parseInt(card.dataset.zoneId);
                const zone = castleData.zones.find(z => z.id === zoneId);
                notificationSystem.show(
                    `${zone.title} richiede livello ${zone.minLevel}. Il tuo livello attuale: ${gameState.playerState.level}`, 
                    "warning", 
                    2000
                );
            });
        });
    }

    // Naviga verso una zona specifica
    navigateToZone(zoneId) {
        const zone = castleData.zones.find(z => z.id === zoneId);
        if (!zone) {
            notificationSystem.show("Zona non trovata!", "error");
            return;
        }

        if (!gameState.isZoneUnlocked(zoneId)) {
            notificationSystem.show(`${zone.title} richiede livello ${zone.minLevel}!`, "warning");
            return;
        }

        // Naviga verso la vista della zona
        if (window.wingView) {
            wingView.render(zoneId);
        }
    }

    // Aggiorna la mappa quando cambia lo stato del gioco
    refresh() {
        if (this.isInitialized && gameState.currentView === 'map') {
            this.render();
        }
    }

    // Ottieni informazioni di debug
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            containerExists: !!this.container,
            zonesCount: castleData.zones.length,
            currentView: gameState.currentView
        };
    }
}

// Crea istanza globale
const castleMap = new CastleMap();

// Rendi globale per l'accesso da altri moduli
window.castleMap = castleMap;

// Inizializza automaticamente quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    castleMap.init();
    
    // Ascolta eventi di game state per aggiornamenti
    if (window.gameState) {
        gameState.on('challengeCompleted', () => {
            setTimeout(() => castleMap.refresh(), 500);
        });
        
        gameState.on('levelUp', () => {
            setTimeout(() => castleMap.refresh(), 1000);
        });
    }
});
