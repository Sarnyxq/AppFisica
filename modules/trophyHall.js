// TROPHY HALL - Fisica 3.0
// Modulo per la visualizzazione dei trofei e badge nel Grimorio

class TrophyHall {
    constructor() {
        this.container = null;
        this.isInitialized = false;
        this.filterMode = 'all'; // all, earned, locked
        this.sortMode = 'zone'; // zone, name, date
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

    // Renderizza la sala dei trofei
    render() {
        if (!this.container) {
            console.error('Trophy Hall non inizializzato!');
            return;
        }

        const allBadges = this.getAllBadges();
        const earnedBadges = this.getEarnedBadges();
        const stats = this.getStats(allBadges, earnedBadges);

        this.container.innerHTML = `
            <div class="text-center mb-8">
                <h2 class="text-4xl font-dnd text-ink-dark mb-4">🏆 Sala dei Trofei del Grimorio</h2>
                <p class="text-lg text-ink-light max-w-3xl mx-auto mb-6">
                    Qui sono custoditi tutti i sigilli che hai forgiato durante il tuo viaggio nell'apprendimento della fisica. 
                    Ogni sigillo rappresenta una conquista e una nuova conoscenza acquisita.
                </p>
                ${this.renderStats(stats)}
            </div>

            ${this.renderFilters()}
            ${this.renderBadgeCollection(allBadges, earnedBadges)}
            ${this.renderAchievementProgress()}
        `;

        this.bindEvents();
        gameState.changeView('trophy');
    }

    // Ottieni tutti i badge disponibili
    getAllBadges() {
        const mainBadges = castleData.challenges.map(challenge => ({
            ...challenge.badge,
            challengeId: challenge.id,
            challengeTitle: challenge.title,
            zoneId: challenge.zoneId,
            zoneName: castleData.zones.find(z => z.id === challenge.zoneId)?.title || 'Zona Sconosciuta',
            exp: challenge.exp,
            type: 'main',
            reference: challenge.reference
        }));

        const sideBadges = castleData.challenges.map(challenge => ({
            ...challenge.sideQuest.badge,
            challengeId: challenge.id,
            challengeTitle: `Pratica: ${challenge.title}`,
            zoneId: challenge.zoneId,
            zoneName: castleData.zones.find(z => z.id === challenge.zoneId)?.title || 'Zona Sconosciuta',
            exp: Math.floor(challenge.exp / 2),
            type: 'side',
            reference: challenge.reference
        }));

        return [...mainBadges, ...sideBadges];
    }

    // Ottieni i badge guadagnati
    getEarnedBadges() {
        const earnedMain = gameState.playerState.completedChallenges.map(challengeId => {
            const challenge = castleData.challenges.find(c => c.id === challengeId);
            return challenge ? { ...challenge.badge, challengeId, type: 'main' } : null;
        }).filter(badge => badge !== null);

        const earnedSide = gameState.playerState.completedSideQuests.map(challengeId => {
            const challenge = castleData.challenges.find(c => c.id === challengeId);
            return challenge ? { ...challenge.sideQuest.badge, challengeId, type: 'side' } : null;
        }).filter(badge => badge !== null);

        return [...earnedMain, ...earnedSide];
    }

    // Calcola le statistiche
    getStats(allBadges, earnedBadges) {
        const totalBadges = allBadges.length;
        const earnedCount = earnedBadges.length;
        const mainBadgesTotal = allBadges.filter(b => b.type === 'main').length;
        const sideBadgesTotal = allBadges.filter(b => b.type === 'side').length;
        const earnedMainCount = earnedBadges.filter(b => b.type === 'main').length;
        const earnedSideCount = earnedBadges.filter(b => b.type === 'side').length;

        return {
            total: totalBadges,
            earned: earnedCount,
            percentage: Math.round((earnedCount / totalBadges) * 100),
            mainTotal: mainBadgesTotal,
            sideTotal: sideBadgesTotal,
            earnedMain: earnedMainCount,
            earnedSide: earnedSideCount
        };
    }

    // Renderizza le statistiche
    renderStats(stats) {
        return `
            <div class="card p-6 max-w-4xl mx-auto">
                <h3 class="text-xl font-dnd text-ink-dark mb-4 text-center">Collezione di Sigilli</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div class="p-4">
                        <div class="text-4xl font-bold text-gold mb-2">${stats.earned}</div>
                        <div class="text-sm text-ink-light">Sigilli Forgiati</div>
                        <div class="text-xs text-ink-light">su ${stats.total} totali</div>
                        <div class="w-full bg-pergamena-darker rounded-full h-3 mt-2">
                            <div class="exp-bar-fill h-3 rounded-full" style="width: ${stats.percentage}%"></div>
                        </div>
                    </div>
                    <div class="p-4">
                        <div class="text-2xl font-bold text-magic-blue mb-1">${stats.earnedMain}</div>
                        <div class="text-sm text-ink-light">Sigilli Principali</div>
                        <div class="text-xs text-ink-light">su ${stats.mainTotal}</div>
                        <div class="text-xl mt-2">🏅</div>
                    </div>
                    <div class="p-4">
                        <div class="text-2xl font-bold text-magic-purple mb-1">${stats.earnedSide}</div>
                        <div class="text-sm text-ink-light">Sigilli di Pratica</div>
                        <div class="text-xs text-ink-light">su ${stats.sideTotal}</div>
                        <div class="text-xl mt-2">📿</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Renderizza i filtri
    renderFilters() {
        return `
            <div class="card p-4 mb-6 max-w-4xl mx-auto">
                <div class="flex flex-wrap justify-center gap-4 items-center">
                    <div class="flex gap-2">
                        <span class="text-sm font-semibold text-ink-dark">Mostra:</span>
                        <button class="filter-btn btn-secondary text-sm py-1 px-3 rounded ${this.filterMode === 'all' ? 'active' : ''}" data-filter="all">
                            Tutti
                        </button>
                        <button class="filter-btn btn-secondary text-sm py-1 px-3 rounded ${this.filterMode === 'earned' ? 'active' : ''}" data-filter="earned">
                            Guadagnati
                        </button>
                        <button class="filter-btn btn-secondary text-sm py-1 px-3 rounded ${this.filterMode === 'locked' ? 'active' : ''}" data-filter="locked">
                            Da Ottenere
                        </button>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-sm font-semibold text-ink-dark">Ordina per:</span>
                        <button class="sort-btn btn-secondary text-sm py-1 px-3 rounded ${this.sortMode === 'zone' ? 'active' : ''}" data-sort="zone">
                            Zona
                        </button>
                        <button class="sort-btn btn-secondary text-sm py-1 px-3 rounded ${this.sortMode === 'name' ? 'active' : ''}" data-sort="name">
                            Nome
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Renderizza la collezione di badge
    renderBadgeCollection(allBadges, earnedBadges) {
        const earnedIds = new Set(earnedBadges.map(b => `${b.id}_${b.type}`));
        
        // Filtra i badge
        let filteredBadges = allBadges;
        if (this.filterMode === 'earned') {
            filteredBadges = allBadges.filter(badge => earnedIds.has(`${badge.id}_${badge.type}`));
        } else if (this.filterMode === 'locked') {
            filteredBadges = allBadges.filter(badge => !earnedIds.has(`${badge.id}_${badge.type}`));
        }

        // Ordina i badge
        filteredBadges.sort((a, b) => {
            if (this.sortMode === 'zone') {
                if (a.zoneId !== b.zoneId) return a.zoneId - b.zoneId;
                return a.type === 'main' && b.type === 'side' ? -1 : 1;
            } else if (this.sortMode === 'name') {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });

        if (filteredBadges.length === 0) {
            return `
                <div class="card p-8 text-center">
                    <div class="text-6xl mb-4">🔍</div>
                    <h3 class="text-xl font-dnd text-ink-dark mb-2">Nessun sigillo trovato</h3>
                    <p class="text-ink-light">Non ci sono sigilli da mostrare con i filtri attuali.</p>
                </div>
            `;
        }

        // Raggruppa per zona se ordinato per zona
        if (this.sortMode === 'zone') {
            return this.renderBadgesByZone(filteredBadges, earnedIds);
        } else {
            return this.renderBadgeGrid(filteredBadges, earnedIds);
        }
    }

    // Renderizza i badge raggruppati per zona
    renderBadgesByZone(badges, earnedIds) {
        const zoneGroups = {};
        badges.forEach(badge => {
            if (!zoneGroups[badge.zoneId]) {
                zoneGroups[badge.zoneId] = {
                    zoneName: badge.zoneName,
                    zoneIcon: castleData.zones.find(z => z.id === badge.zoneId)?.icon || '🧠',
                    badges: []
                };
            }
            zoneGroups[badge.zoneId].badges.push(badge);
        });

        return Object.values(zoneGroups).map(group => `
            <div class="mb-8">
                <h3 class="text-2xl font-dnd text-ink-dark mb-4 text-center">
                    ${group.zoneIcon} ${group.zoneName}
                </h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    ${group.badges.map(badge => this.renderBadgeCard(badge, earnedIds)).join('')}
                </div>
            </div>
        `).join('');
    }

    // Renderizza i badge in griglia
    renderBadgeGrid(badges, earnedIds) {
        return `
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                ${badges.map(badge => this.renderBadgeCard(badge, earnedIds)).join('')}
            </div>
        `;
    }

    // Renderizza una singola card del badge
    renderBadgeCard(badge, earnedIds) {
        const isEarned = earnedIds.has(`${badge.id}_${badge.type}`);
        const typeLabel = badge.type === 'main' ? 'Principale' : 'Pratica';
        const typeColor = badge.type === 'main' ? 'text-blue-600' : 'text-purple-600';

        return `
            <div class="badge-display card p-4 cursor-pointer hover:transform hover:scale-105 transition-all" 
                 data-badge-id="${badge.id}" data-badge-type="${badge.type}"
                 title="${badge.name} - ${badge.challengeTitle}">
                
                <div class="text-center">
                    <!-- Icona del badge -->
                    <div class="text-5xl mb-2 ${isEarned ? 'badge-unlocked' : 'badge-locked'}">${badge.icon}</div>
                    
                    <!-- Nome del badge -->
                    <h4 class="font-bold text-sm ${isEarned ? 'text-ink-dark' : 'text-gray-400'} mb-1">
                        ${badge.name}
                    </h4>
                    
                    <!-- Tipo e EXP -->
                    <div class="text-xs ${isEarned ? 'text-ink-light' : 'text-gray-400'} mb-2">
                        <div class="${typeColor}">${typeLabel}</div>
                        <div>${badge.exp} EXP</div>
                    </div>
                    
                    <!-- Stato -->
                    ${isEarned ? `
                        <div class="bg-green-100 text-green-800 text-xs py-1 px-2 rounded">
                            ✅ Ottenuto
                        </div>
                    ` : `
                        <div class="bg-gray-100 text-gray-600 text-xs py-1 px-2 rounded">
                            🔒 Bloccato
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    // Renderizza il progresso degli achievement
    renderAchievementProgress() {
        const achievements = this.calculateAchievements();
        
        return `
            <div class="card p-6 mt-8">
                <h3 class="text-2xl font-dnd text-ink-dark mb-6 text-center">🎯 Traguardi Speciali</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${achievements.map(achievement => `
                        <div class="p-4 bg-pergamena-dark rounded-lg ${achievement.completed ? 'border-2 border-gold' : ''}">
                            <div class="text-center mb-3">
                                <div class="text-3xl mb-2 ${achievement.completed ? 'badge-unlocked' : 'opacity-50'}">${achievement.icon}</div>
                                <h4 class="font-bold text-ink-dark text-sm">${achievement.name}</h4>
                            </div>
                            <div class="text-xs text-ink-light text-center mb-2">${achievement.description}</div>
                            <div class="w-full bg-pergamena-darker rounded-full h-2">
                                <div class="exp-bar-fill h-2 rounded-full" style="width: ${achievement.progress}%"></div>
                            </div>
                            <div class="text-center text-xs text-ink-light mt-1">
                                ${achievement.current} / ${achievement.target}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Calcola i traguardi speciali
    calculateAchievements() {
        const stats = gameState.getStats();
        
        return [
            {
                name: "Primo Sigillo",
                description: "Forgia il tuo primo sigillo",
                icon: "🏆",
                current: Math.min(stats.challengesCompleted, 1),
                target: 1,
                progress: Math.min((stats.challengesCompleted / 1) * 100, 100),
                completed: stats.challengesCompleted >= 1
            },
            {
                name: "Esploratore",
                description: "Completa 10 sfide",
                icon: "🗺️",
                current: Math.min(stats.challengesCompleted, 10),
                target: 10,
                progress: Math.min((stats.challengesCompleted / 10) * 100, 100),
                completed: stats.challengesCompleted >= 10
            },
            {
                name: "Studioso",
                description: "Completa 5 missioni di pratica",
                icon: "🧠",
                current: Math.min(stats.sideQuestsCompleted, 5),
                target: 5,
                progress: Math.min((stats.sideQuestsCompleted / 5) * 100, 100),
                completed: stats.sideQuestsCompleted >= 5
            },
            {
                name: "Maestro",
                description: "Raggiungi il livello 10",
                icon: "👑",
                current: Math.min(gameState.playerState.level, 10),
                target: 10,
                progress: Math.min((gameState.playerState.level / 10) * 100, 100),
                completed: gameState.playerState.level >= 10
            },
            {
                name: "Collezionista",
                description: "Ottieni 25 sigilli",
                icon: "💎",
                current: Math.min(stats.challengesCompleted + stats.sideQuestsCompleted, 25),
                target: 25,
                progress: Math.min(((stats.challengesCompleted + stats.sideQuestsCompleted) / 25) * 100, 100),
                completed: (stats.challengesCompleted + stats.sideQuestsCompleted) >= 25
            },
            {
                name: "Gran Maestro",
                description: "Completa tutto il grimorio",
                icon: "✨",
                current: stats.challengesCompleted,
                target: castleData.challenges.length,
                progress: stats.completionPercentage,
                completed: stats.completionPercentage === 100
            }
        ];
    }

    // Associa gli eventi
    bindEvents() {
        if (!this.container) return;

        // Filtri
        const filterBtns = this.container.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterMode = e.currentTarget.dataset.filter;
                this.render();
            });
        });

        // Ordinamento
        const sortBtns = this.container.querySelectorAll('.sort-btn');
        sortBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.sortMode = e.currentTarget.dataset.sort;
                this.render();
            });
        });

        // Click sui badge per dettagli
        const badgeCards = this.container.querySelectorAll('.badge-display');
        badgeCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const badgeId = parseInt(e.currentTarget.dataset.badgeId);
                const badgeType = e.currentTarget.dataset.badgeType;
                this.showBadgeDetails(badgeId, badgeType);
            });
        });
    }

    // Mostra i dettagli di un badge
    showBadgeDetails(badgeId, badgeType) {
        const challenge = castleData.challenges.find(c => c.id === badgeId);
        if (!challenge) return;

        const badge = badgeType === 'main' ? challenge.badge : challenge.sideQuest.badge;
        const isEarned = badgeType === 'main' ? 
            gameState.isChallengeCompleted(badgeId) : 
            gameState.isSideQuestCompleted(badgeId);

        let message = `
            <div class="text-center">
                <div class="text-6xl mb-4">${badge.icon}</div>
                <h3 class="text-xl font-bold text-ink-dark mb-2">${badge.name}</h3>
                <p class="text-ink-light mb-4">${challenge.title}</p>
                <p class="text-sm text-ink-light mb-2">🧠 ${challenge.reference}</p>
                <p class="text-sm text-ink-light">🎯 ${challenge.exp} EXP</p>
        `;

        if (isEarned) {
            message += `<p class="text-green-600 font-bold mt-4">✅ Sigillo Forgiato!</p>`;
        } else {
            message += `<p class="text-gray-600 mt-4">🔒 Completa la sfida per ottenerlo</p>`;
        }

        message += `</div>`;

        // Simula un tooltip o un piccolo modale
        notificationSystem.show(`${badge.icon} ${badge.name} - ${isEarned ? 'Ottenuto' : 'Da ottenere'}`, isEarned ? "success" : "info", 3000);
    }

    // Aggiorna la vista quando cambia lo stato
    refresh() {
        if (this.isInitialized && gameState.currentView === 'trophy') {
            this.render();
        }
    }

    // Ottieni informazioni di debug
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            containerExists: !!this.container,
            filterMode: this.filterMode,
            sortMode: this.sortMode,
            totalBadges: this.getAllBadges().length,
            earnedBadges: this.getEarnedBadges().length
        };
    }
}

// Crea istanza globale
const trophyHall = new TrophyHall();

// Rendi globale per l'accesso da altri moduli
window.trophyHall = trophyHall;

// Inizializza automaticamente quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    trophyHall.init();
    
    // Ascolta eventi di game state per aggiornamenti
    if (window.gameState) {
        gameState.on('challengeCompleted', () => {
            setTimeout(() => trophyHall.refresh(), 500);
        });
        
        gameState.on('sideQuestCompleted', () => {
            setTimeout(() => trophyHall.refresh(), 500);
        });
    }
});
