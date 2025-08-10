// DIARY HALL - Fisica 3.0
// Modulo per il diario delle sfide completate con riepilogo e annotazioni

class DiaryHall {
    constructor() {
        this.container = null;
        this.isInitialized = false;
        this.viewMode = 'timeline'; // timeline, category, achievements
    }

    // Inizializza il modulo
    init() {
        this.container = document.getElementById('main-content');
        if (!this.container) {
            console.error('Container principale non trovato!');
            return false;
        }
        // Rimosso caricamento annotazioni/immagini del diario - usa solo dati dalla forgia
        this.isInitialized = true;
        return true;
    }

    // METODI DI GESTIONE ANNOTAZIONI/IMMAGINI DIARIO RIMOSSI
    // Ora usa solo dati dalla forgia tramite loadForgeData()

    // Renderizza il diario
    render() {
        if (!this.container) {
            console.error('Diary Hall non inizializzato!');
            return;
        }

        const completedChallenges = this.getCompletedChallenges();
        const stats = this.calculateStats(completedChallenges);

        this.container.innerHTML = `
            <div class="text-center mb-8">
                <h2 class="text-4xl font-dnd text-ink-dark mb-4">📖 Diario dell'Apprendista</h2>
                <p class="text-lg text-ink-light max-w-3xl mx-auto mb-6">
                    Il tuo viaggio attraverso il Grimorio della Fisica, con tutte le riflessioni e i disegni 
                    creati durante la forgia dei sigilli. Ogni pagina custodisce le tue scoperte e le tue intuizioni.
                </p>
                ${this.renderStats(stats)}
            </div>

            ${this.renderViewModeSelector()}
            ${completedChallenges.length > 0 ? this.renderContent(completedChallenges) : this.renderEmptyDiary()}
        `;

        this.bindEvents();
        gameState.changeView('diary');
    }

    // Ottieni le sfide completate con metadati aggiuntivi
    getCompletedChallenges() {
        const completed = [];
        const baseDate = gameState.playerState.startDate ? new Date(gameState.playerState.startDate) : new Date();
        
        // Sfide principali completate
        gameState.playerState.completedChallenges.forEach((challengeId, index) => {
            const challenge = castleData.challenges.find(c => c.id === challengeId);
            if (challenge) {
                const key = `${challengeId}_main`;
                let completionDate = this.getStoredCompletionDate(challengeId, 'main');
                
                // Se non c'è una data salvata, stima basata sull'ordine e data di inizio
                if (!completionDate) {
                    const estimatedDate = new Date(baseDate);
                    estimatedDate.setDate(estimatedDate.getDate() + index);
                    completionDate = this.saveCompletionDate(challengeId, 'main', estimatedDate.toISOString());
                }
                
                // Carica dati dalla forgia invece che dalle annotazioni del diario
                const forgeData = this.loadForgeData(challengeId);
                
                completed.push({
                    ...challenge,
                    type: 'main',
                    completedDate: completionDate,
                    annotation: forgeData.text || '',
                    image: forgeData.drawing || null,
                    key: key
                });
            }
        });

        // Missioni secondarie completate
        gameState.playerState.completedSideQuests.forEach((challengeId, index) => {
            const challenge = castleData.challenges.find(c => c.id === challengeId);
            if (challenge && challenge.sideQuest) {
                const key = `${challengeId}_side`;
                let completionDate = this.getStoredCompletionDate(challengeId, 'side');
                
                // Se non c'è una data salvata, stima basata sull'ordine
                if (!completionDate) {
                    const estimatedDate = new Date(baseDate);
                    estimatedDate.setDate(estimatedDate.getDate() + gameState.playerState.completedChallenges.length + index);
                    completionDate = this.saveCompletionDate(challengeId, 'side', estimatedDate.toISOString());
                }
                
                // Le missioni secondarie non hanno dati forgia, mantieni vuoti
                completed.push({
                    ...challenge,
                    type: 'side',
                    completedDate: completionDate,
                    annotation: '',
                    image: null,
                    key: key
                });
            }
        });

        return completed.sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));
    }

    // Calcola le statistiche del diario
    calculateStats(completedChallenges) {
        const totalChallenges = completedChallenges.length;
        const mainChallenges = completedChallenges.filter(c => c.type === 'main').length;
        const sideChallenges = completedChallenges.filter(c => c.type === 'side').length;
        const annotatedChallenges = completedChallenges.filter(c => c.annotation && c.annotation.trim()).length;
        const illustratedChallenges = completedChallenges.filter(c => c.image).length;
        
        const zones = new Set(completedChallenges.map(c => c.zoneId));
        const zonesExplored = zones.size;

        return {
            totalChallenges,
            mainChallenges,
            sideChallenges,
            annotatedChallenges,
            illustratedChallenges,
            zonesExplored
        };
    }

    // Renderizza le statistiche
    renderStats(stats) {
        return `
            <div class="card p-6 max-w-6xl mx-auto">
                <h3 class="text-xl font-dnd text-ink-dark mb-4 text-center">Il Tuo Viaggio in Numeri</h3>
                <div class="diary-stats-grid">
                    <div class="diary-stat-item">
                        <div class="diary-stat-number text-blue-600">${stats.totalChallenges}</div>
                        <div class="diary-stat-label">Sfide Totali</div>
                    </div>
                    <div class="diary-stat-item">
                        <div class="diary-stat-number text-purple-600">${stats.mainChallenges}</div>
                        <div class="diary-stat-label">Sfide Principali</div>
                    </div>
                    <div class="diary-stat-item">
                        <div class="diary-stat-number text-green-600">${stats.sideChallenges}</div>
                        <div class="diary-stat-label">Missioni Pratiche</div>
                    </div>
                    <div class="diary-stat-item">
                        <div class="diary-stat-number text-orange-600">${stats.zonesExplored}</div>
                        <div class="diary-stat-label">Capitoli Esplorati</div>
                    </div>
                    <div class="diary-stat-item">
                        <div class="diary-stat-number text-red-600">${stats.annotatedChallenges}</div>
                        <div class="diary-stat-label">Con Riflessioni</div>
                    </div>
                    <div class="diary-stat-item">
                        <div class="diary-stat-number text-yellow-600">${stats.illustratedChallenges}</div>
                        <div class="diary-stat-label">Con Disegni</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Renderizza il selettore modalità visualizzazione
    renderViewModeSelector() {
        return `
            <div class="card p-4 mb-6 max-w-4xl mx-auto">
                <div class="flex justify-center gap-2">
                    <button class="view-mode-btn btn-primary px-4 py-2 rounded ${this.viewMode === 'timeline' ? 'view-mode-active' : ''}" 
                            data-mode="timeline">
                        🕐 Cronologia
                    </button>
                    <button class="view-mode-btn btn-primary px-4 py-2 rounded ${this.viewMode === 'category' ? 'view-mode-active' : ''}" 
                            data-mode="category">
                        📚 Per Capitolo
                    </button>
                    <button class="view-mode-btn btn-primary px-4 py-2 rounded ${this.viewMode === 'achievements' ? 'view-mode-active' : ''}" 
                            data-mode="achievements">
                        🏆 Conquiste
                    </button>
                </div>
            </div>
        `;
    }

    // Renderizza il contenuto in base alla modalità
    renderContent(completedChallenges) {
        switch (this.viewMode) {
            case 'timeline':
                return this.renderTimeline(completedChallenges);
            case 'category':
                return this.renderByCategory(completedChallenges);
            case 'achievements':
                return this.renderAchievements(completedChallenges);
            default:
                return this.renderTimeline(completedChallenges);
        }
    }

    // Renderizza la cronologia
    renderTimeline(completedChallenges) {
        const groupedByDate = this.groupByDate(completedChallenges);
        
        return `
            <div class="max-w-6xl mx-auto">
                <h3 class="text-2xl font-dnd text-ink-dark mb-6 text-center">Cronologia delle Scoperte</h3>
                ${Object.entries(groupedByDate).map(([date, challenges]) => `
                    <div class="mb-8">
                        <div class="sticky-date-header p-3 rounded-lg shadow-md mb-4">
                            <h4 class="text-lg font-bold text-ink-dark text-center">${this.formatDate(date)}</h4>
                        </div>
                        <div class="space-y-4">
                            ${challenges.map((challenge, index) => `
                                <div class="diary-timeline-item diary-card" style="animation-delay: ${index * 100}ms">
                                    ${this.renderChallengeCard(challenge, true)}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Renderizza per categoria/capitolo
    renderByCategory(completedChallenges) {
        const zoneGroups = this.groupByZone(completedChallenges);

        return `
            <div class="max-w-6xl mx-auto">
                <h3 class="text-2xl font-dnd text-ink-dark mb-6 text-center">Sfide per Capitolo</h3>
                ${Object.entries(zoneGroups).map(([zoneId, group]) => `
                    <div class="card p-6 mb-8">
                        <h4 class="text-xl font-bold text-ink-dark mb-4 flex items-center">
                            <span class="text-2xl mr-3">${group.zoneIcon}</span>
                            ${group.zoneName}
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${group.challenges.map((challenge, index) => `
                                <div class="diary-card" style="animation-delay: ${index * 100}ms">
                                    ${this.renderChallengeCard(challenge, false)}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Renderizza le conquiste speciali
    renderAchievements(completedChallenges) {
        const achievements = this.calculateAchievements(completedChallenges);
        
        return `
            <div class="max-w-6xl mx-auto">
                <h3 class="text-2xl font-dnd text-ink-dark mb-6 text-center">Conquiste Speciali</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    ${achievements.map((achievement, index) => `
                        <div class="card p-6 text-center achievement-card ${achievement.unlocked ? 'achievement-unlocked' : 'achievement-locked'}" style="animation-delay: ${index * 100}ms">
                            <div class="text-4xl mb-3">${achievement.icon}</div>
                            <h4 class="text-lg font-bold ${achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'} mb-2">
                                ${achievement.name}
                            </h4>
                            <p class="text-sm ${achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'} mb-3">
                                ${achievement.description}
                            </p>
                            <div class="text-xs ${achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'}">
                                ${achievement.unlocked ? `Sbloccata: ${this.formatDate(achievement.unlockedDate)}` : `Progresso: ${achievement.progress}/${achievement.requirement}`}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="space-y-4">
                    <h4 class="text-xl font-bold text-ink-dark text-center mb-4">Sfide più Significative</h4>
                    ${this.getHighlightedChallenges(completedChallenges).map(challenge => 
                        this.renderChallengeCard(challenge, true)
                    ).join('')}
                </div>
            </div>
        `;
    }

    // Renderizza una card di sfida
    renderChallengeCard(challenge, showDate = false) {
        const zone = castleData.zones.find(z => z.id === challenge.zoneId);
        const badge = challenge.type === 'main' ? challenge.badge : challenge.sideQuest.badge;

        return `
            <div class="card p-6 mb-4">
                <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 text-center">
                        <div class="text-3xl mb-2">${badge.icon}</div>
                        <span class="inline-block px-2 py-1 rounded-full text-xs ${
                            challenge.type === 'main' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }">
                            ${challenge.type === 'main' ? 'Principale' : 'Pratica'}
                        </span>
                    </div>
                    
                    <div class="flex-grow">
                        <div class="flex justify-between items-start mb-2">
                            <h5 class="text-lg font-bold text-ink-dark">${challenge.title}</h5>
                            ${showDate ? `<span class="text-sm text-ink-light">${this.formatDate(challenge.completedDate)}</span>` : ''}
                        </div>
                        
                        <p class="text-sm text-ink-light mb-2">${zone?.icon} ${zone?.title}</p>
                        <p class="text-sm text-ink-light mb-3">${challenge.reference}</p>
                        
                        ${challenge.image ? `
                            <div class="mb-3">
                                <img src="${challenge.image}" alt="Immagine sfida" class="diary-image-preview" onclick="this.classList.toggle('diary-image-expanded')">
                            </div>
                        ` : ''}
                        
                        ${challenge.annotation ? `
                            <div class="diary-annotation mb-3">
                                <p class="text-sm text-yellow-800"><strong>Riflessioni dalla Forgia:</strong></p>
                                <p class="text-sm text-yellow-700">${challenge.annotation}</p>
                            </div>
                        ` : ''}
                        
                        ${challenge.image ? `
                            <div class="mb-3">
                                <p class="text-sm text-ink-dark mb-2"><strong>Disegno del Sigillo:</strong></p>
                                <img src="${challenge.image}" alt="Disegno del sigillo" class="diary-image-preview" onclick="this.classList.toggle('diary-image-expanded')">
                            </div>
                        ` : ''}
                        
                        <div class="flex gap-2 mt-3">
                            <span class="text-xs text-ink-light px-3 py-1 rounded bg-pergamena-light">
                                ${challenge.annotation || challenge.image ? '✨ Creato nella Forgia' : '📝 Forgia vuota'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Renderizza diario vuoto
    renderEmptyDiary() {
        return `
            <div class="card p-12 text-center max-w-2xl mx-auto">
                <div class="text-6xl mb-4">📖</div>
                <h3 class="text-2xl font-dnd text-ink-dark mb-4">Il Diario è Vuoto</h3>
                <p class="text-lg text-ink-light mb-6">
                    Il tuo diario dell'apprendimento inizierà a riempirsi man mano che completi le sfide nel Grimorio
                    e forgi i tuoi sigilli. Le annotazioni e i disegni che creerai durante la forgia 
                    verranno automaticamente aggiunti qui.
                </p>
                <button class="btn-primary font-dnd text-lg px-6 py-3 rounded-lg" onclick="header.navigate('map')">
                    🗺️ Inizia la Tua Avventura
                </button>
            </div>
        `;
    }

    // Associa gli eventi
    bindEvents() {
        // Selettori modalità visualizzazione
        document.querySelectorAll('.view-mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Rimuovi classe attiva da tutti i pulsanti
                document.querySelectorAll('.view-mode-btn').forEach(b => b.classList.remove('view-mode-active'));
                // Aggiungi classe attiva al pulsante cliccato
                e.target.classList.add('view-mode-active');
                
                this.viewMode = e.target.dataset.mode;
                this.render();
            });
        });

        // RIMOSSI: eventi per pulsanti di modifica (non più presenti nell'interfaccia)
    }

    // METODI DI EDITING RIMOSSI - Il diario ora mostra solo dati dalla forgia

    // Carica i dati dalla forgia per una sfida specifica
    loadForgeData(challengeId) {
        if (window.storageManager) {
            return storageManager.loadChallengeData(challengeId);
        }
        return { text: "", drawing: "" };
    }

    // Metodi di utilità
    getStoredCompletionDate(challengeId, type) {
        const key = `completion_${challengeId}_${type}`;
        return storageManager.getData(key);
    }

    getCompletionDate(challengeId, type) {
        const key = `completion_${challengeId}_${type}`;
        let savedDate = storageManager.getData(key);
        
        // Se non esiste una data salvata, usa la data corrente e salvala
        if (!savedDate) {
            savedDate = new Date().toISOString();
            this.saveCompletionDate(challengeId, type, savedDate);
        }
        
        return savedDate;
    }

    // Salva la data di completamento di una sfida
    saveCompletionDate(challengeId, type, date = null) {
        const key = `completion_${challengeId}_${type}`;
        const completionDate = date || new Date().toISOString();
        storageManager.saveData(key, completionDate);
        return completionDate;
    }

    groupByDate(challenges) {
        const groups = {};
        challenges.forEach(challenge => {
            const date = challenge.completedDate.split('T')[0];
            if (!groups[date]) groups[date] = [];
            groups[date].push(challenge);
        });
        return groups;
    }

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

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    calculateAchievements(completedChallenges) {
        const achievements = [
            {
                id: 'first_steps',
                name: 'Primi Passi',
                description: 'Completa la tua prima sfida',
                icon: '👶',
                requirement: 1,
                progress: completedChallenges.length,
                unlocked: completedChallenges.length >= 1,
                unlockedDate: completedChallenges.length >= 1 ? completedChallenges[completedChallenges.length - 1].completedDate : null
            },
            {
                id: 'dedicated_learner',
                name: 'Studioso Dedito',
                description: 'Completa 10 sfide',
                icon: '📚',
                requirement: 10,
                progress: completedChallenges.length,
                unlocked: completedChallenges.length >= 10,
                unlockedDate: completedChallenges.length >= 10 ? completedChallenges[Math.max(0, completedChallenges.length - 10)].completedDate : null
            },
            {
                id: 'note_taker',
                name: 'Scriba della Forgia',
                description: 'Scrivi riflessioni in 5 forgie diverse',
                icon: '📝',
                requirement: 5,
                progress: completedChallenges.filter(c => c.annotation).length,
                unlocked: completedChallenges.filter(c => c.annotation).length >= 5,
                unlockedDate: null
            },
            {
                id: 'illustrator',
                name: 'Artista dei Sigilli',
                description: 'Crea disegni in 3 forgie diverse',
                icon: '🎨',
                requirement: 3,
                progress: completedChallenges.filter(c => c.image).length,
                unlocked: completedChallenges.filter(c => c.image).length >= 3,
                unlockedDate: null
            }
        ];

        return achievements;
    }

    getHighlightedChallenges(completedChallenges) {
        return completedChallenges
            .filter(c => c.annotation || c.image)
            .slice(0, 3);
    }

    // Ottieni informazioni di debug
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            containerExists: !!this.container,
            viewMode: this.viewMode,
            usesForgeData: true, // Ora usa dati dalla forgia invece che annotazioni personalizzate
            storageManagerAvailable: !!window.storageManager
        };
    }
}

// Crea istanza globale
const diaryHall = new DiaryHall();

// Rendi globale per l'accesso da altri moduli
window.diaryHall = diaryHall;

// Inizializza automaticamente quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    diaryHall.init();
});
