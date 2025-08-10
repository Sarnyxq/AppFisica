// DATI DEL GRIMORIO - Fisica 3.0
// Contenuto specifico di Fisica dal fisica2.0 con struttura modulare di template v2.0

const castleData = {
    zones: [
        { 
            id: 1, 
            title: "Capitolo 1: Il Santuario delle Misure", 
            desc: "Le fondamenta della magia fisica: misure, dimensioni e vettori.", 
            minLevel: 1, 
            icon: "🏛️" 
        },
        { 
            id: 2, 
            title: "Capitolo 2: La Camera del Moto Unidimensionale", 
            desc: "Tessere i primi incantesimi per descrivere il movimento lungo una linea.", 
            minLevel: 1, 
            icon: "↔️" 
        },
        { 
            id: 3, 
            title: "Capitolo 3: L'Arena del Moto Bidimensionale", 
            desc: "Padroneggiare il movimento su un piano, dai proiettili ai vortici.", 
            minLevel: 1, 
            icon: "↗️" 
        },
        { 
            id: 4, 
            title: "Capitolo 4: La Cittadella delle Leggi del Moto", 
            desc: "Dominare le Leggi Arcane di Newton per comprendere le cause del moto.", 
            minLevel: 1, 
            icon: "🏰" 
        },
        { 
            id: 5, 
            title: "Capitolo 5: Il Dominio delle Forze Applicate", 
            desc: "Applicare le leggi di Newton a scenari complessi, includendo l'attrito e le forze centripete.", 
            minLevel: 1, 
            icon: "⚙️" 
        },
        { 
            id: 6, 
            title: "Capitolo 6: L'Aetherium del Lavoro e dell'Energia Cinetica", 
            desc: "Canalizzare il potere invisibile del lavoro e dell'energia del movimento.", 
            minLevel: 1, 
            icon: "✨" 
        },
        { 
            id: 7, 
            title: "Capitolo 7: Il Tempio dell'Energia Potenziale", 
            desc: "Comprendere l'energia immagazzinata e il suo principio di conservazione.", 
            minLevel: 1, 
            icon: "💎" 
        },
        { 
            id: 12, 
            title: "Capitolo 12: La Guglia del Moto Oscillatorio", 
            desc: "Padroneggiare i ritmi e le vibrazioni, dal moto armonico al pendolo.", 
            minLevel: 1, 
            icon: "〰️" 
        },
        { 
            id: 13, 
            title: "Capitolo 13: La Cattedrale del Moto Ondulatorio", 
            desc: "Studiare la propagazione delle onde, l'interferenza e il suono.", 
            minLevel: 1, 
            icon: "🌊" 
        },
        { 
            id: 15, 
            title: "Capitolo 15: La Biblioteca Sommersa della Fluidomeccanica", 
            desc: "Svelare i segreti di pressione, galleggiamento e dinamica dei fluidi.", 
            minLevel: 1, 
            icon: "💧" 
        }
    ],
    
    challenges: [
        // Capitolo 1: Il Santuario delle Misure
        { 
            id: 1, 
            zoneId: 1, 
            title: "I Campioni Primordiali", 
            desc: "Comprendere i campioni di lunghezza, massa e tempo.", 
            reference: "Pag. 24, Par. 1.1", 
            exp: 20, 
            badge: { id: 1, name: "Sigillo del Metro", icon: "📏" }, 
            sideQuest: { badge: { id: 1001, name: "Pergamena della Misura", icon: "📜" } } 
        },
        { 
            id: 2, 
            zoneId: 1, 
            title: "Il Modello della Materia", 
            desc: "Descrivere il modello semplificato della struttura della materia.", 
            reference: "Pag. 25, Par. 1.2", 
            exp: 20, 
            badge: { id: 2, name: "Glifo dell'Atomo", icon: "⚛️" }, 
            sideQuest: { badge: { id: 1002, name: "Pergamena della Struttura", icon: "📜" } } 
        },
        { 
            id: 3, 
            zoneId: 1, 
            title: "Il Crivello Dimensionale", 
            desc: "Usare l'analisi dimensionale per controllare la correttezza delle equazioni.", 
            reference: "Pag. 26, Par. 1.3", 
            exp: 30, 
            badge: { id: 3, name: "Glifo della Coerenza", icon: "🧬" }, 
            sideQuest: { badge: { id: 1003, name: "Pergamena della Coerenza", icon: "📜" } } 
        },
        { 
            id: 4, 
            zoneId: 1, 
            title: "L'Arte della Conversione", 
            desc: "Padroneggiare la conversione delle unità di misura.", 
            reference: "Pag. 28, Par. 1.4", 
            exp: 25, 
            badge: { id: 4, name: "Runa della Trasmutazione", icon: "🔄" }, 
            sideQuest: { badge: { id: 1004, name: "Pergamena della Conversione", icon: "📜" } } 
        },
        { 
            id: 5, 
            zoneId: 1, 
            title: "La Stima Arcana", 
            desc: "Imparare a effettuare calcoli di ordini di grandezza.", 
            reference: "Pag. 29, Par. 1.5", 
            exp: 20, 
            badge: { id: 5, name: "Occhio dell'Estimatore", icon: "👁️" }, 
            sideQuest: { badge: { id: 1005, name: "Pergamena della Stima", icon: "📜" } } 
        },
        { 
            id: 6, 
            zoneId: 1, 
            title: "La Bilancia della Precisione", 
            desc: "Comprendere e usare correttamente le cifre significative.", 
            reference: "Pag. 30, Par. 1.6", 
            exp: 25, 
            badge: { id: 6, name: "Marchio della Cifra Certa", icon: "⚖️" }, 
            sideQuest: { badge: { id: 1006, name: "Pergamena della Precisione", icon: "📜" } } 
        },
        { 
            id: 7, 
            zoneId: 1, 
            title: "Essenze Pure e Direzionali", 
            desc: "Distinguere tra grandezze scalari e vettoriali.", 
            reference: "Pag. 32, Par. 1.9", 
            exp: 20, 
            badge: { id: 7, name: "Bussola Interiore", icon: "🧭" }, 
            sideQuest: { badge: { id: 1007, name: "Pergamena delle Essenze", icon: "📜" } } 
        },
        { 
            id: 8, 
            zoneId: 1, 
            title: "La Manipolazione dei Vettori", 
            desc: "Apprendere le proprietà dei vettori, come l'uguaglianza e la somma.", 
            reference: "Pag. 33, Par. 1.10", 
            exp: 30, 
            badge: { id: 8, name: "Tavola delle Somme", icon: "➕" }, 
            sideQuest: { badge: { id: 1008, name: "Pergamena della Somma", icon: "📜" } } 
        },
        { 
            id: 9, 
            zoneId: 1, 
            title: "La Scomposizione dei Glifi", 
            desc: "Imparare a scomporre i vettori nelle loro componenti usando i versori.", 
            reference: "Pag. 35, Par. 1.11", 
            exp: 40, 
            badge: { id: 9, name: "Emblema del Cartografo", icon: "🗺️" }, 
            sideQuest: { badge: { id: 1009, name: "Pergamena della Scomposizione", icon: "📜" } } 
        },

        // Capitolo 2: La Camera del Moto Unidimensionale
        { 
            id: 10, 
            zoneId: 2, 
            title: "Il Sentiero della Velocità Media", 
            desc: "Definire e calcolare la velocità media in una dimensione.", 
            reference: "Pag. 46, Par. 2.1", 
            exp: 25, 
            badge: { id: 10, name: "Traccia del Viandante", icon: "👣" }, 
            sideQuest: { badge: { id: 1010, name: "Pergamena della Velocità", icon: "📜" } } 
        },
        { 
            id: 11, 
            zoneId: 2, 
            title: "Il Lampo della Velocità Istantanea", 
            desc: "Comprendere il concetto di velocità istantanea come limite.", 
            reference: "Pag. 48, Par. 2.2", 
            exp: 30, 
            badge: { id: 11, name: "Glifo della Celerità", icon: "⚡" }, 
            sideQuest: { badge: { id: 1011, name: "Pergamena della Celerità", icon: "📜" } } 
        },
        { 
            id: 12, 
            zoneId: 2, 
            title: "Il Flusso dell'Accelerazione", 
            desc: "Definire e calcolare l'accelerazione media e istantanea.", 
            reference: "Pag. 50, Par. 2.3", 
            exp: 30, 
            badge: { id: 12, name: "Vessillo del Cambiamento", icon: "🚩" }, 
            sideQuest: { badge: { id: 1012, name: "Pergamena dell'Accelerazione", icon: "📜" } } 
        },
        { 
            id: 13, 
            zoneId: 2, 
            title: "La Via dell'Accelerazione Costante", 
            desc: "Padroneggiare le equazioni del moto unidimensionale con accelerazione costante.", 
            reference: "Pag. 53, Par. 2.5", 
            exp: 40, 
            badge: { id: 13, name: "Runa dell'Accelerazione", icon: "📈" }, 
            sideQuest: { badge: { id: 1013, name: "Pergamena della Costanza", icon: "📜" } } 
        },
        { 
            id: 14, 
            zoneId: 2, 
            title: "Il Pozzo della Caduta Libera", 
            desc: "Analizzare il moto dei corpi in caduta libera come caso di accelerazione costante.", 
            reference: "Pag. 57, Par. 2.6", 
            exp: 35, 
            badge: { id: 14, name: "Piuma di Galileo", icon: "🪶" }, 
            sideQuest: { badge: { id: 1014, name: "Pergamena della Caduta", icon: "📜" } } 
        },

        // Capitolo 3: L'Arena del Moto Bidimensionale
        { 
            id: 15, 
            zoneId: 3, 
            title: "Il Vettore Spostamento", 
            desc: "Definire lo spostamento, la velocità e l'accelerazione in due dimensioni.", 
            reference: "Pag. 70, Par. 3.1", 
            exp: 30, 
            badge: { id: 15, name: "Freccia dello Spostamento", icon: "➡️" }, 
            sideQuest: { badge: { id: 1015, name: "Pergamena dello Spostamento", icon: "📜" } } 
        },
        { 
            id: 16, 
            zoneId: 3, 
            title: "Il Moto Bidimensionale", 
            desc: "Comprendere il moto in 2D con accelerazione costante.", 
            reference: "Pag. 72, Par. 3.2", 
            exp: 35, 
            badge: { id: 16, name: "Griglia del Moto", icon: "🏁" }, 
            sideQuest: { badge: { id: 1016, name: "Pergamena Bidimensionale", icon: "📜" } } 
        },
        { 
            id: 17, 
            zoneId: 3, 
            title: "L'Arena del Proiettile", 
            desc: "Analizzare il moto del proiettile, scomponendolo nelle sue componenti.", 
            reference: "Pag. 73, Par. 3.3", 
            exp: 45, 
            badge: { id: 17, name: "Marchio del Balistico", icon: "🎯" }, 
            sideQuest: { badge: { id: 1017, name: "Pergamena del Proiettile", icon: "📜" } } 
        },
        { 
            id: 18, 
            zoneId: 3, 
            title: "Il Rito del Vortice Uniforme", 
            desc: "Analizzare il moto circolare uniforme e l'accelerazione centripeta.", 
            reference: "Pag. 78, Par. 3.4", 
            exp: 40, 
            badge: { id: 18, name: "Orbita della Rotazione", icon: "🔄" }, 
            sideQuest: { badge: { id: 1018, name: "Pergamena del Vortice", icon: "📜" } } 
        },
        { 
            id: 19, 
            zoneId: 3, 
            title: "L'Accelerazione Tangenziale", 
            desc: "Comprendere l'accelerazione tangenziale e radiale nel moto curvilineo.", 
            reference: "Pag. 81, Par. 3.5", 
            exp: 35, 
            badge: { id: 19, name: "Spirale dell'Impeto", icon: "🌀" }, 
            sideQuest: { badge: { id: 1019, name: "Pergamena Tangenziale", icon: "📜" } } 
        },
        { 
            id: 20, 
            zoneId: 3, 
            title: "La Danza delle Velocità Relative", 
            desc: "Analizzare la velocità relativa e l'accelerazione relativa.", 
            reference: "Pag. 83, Par. 3.6", 
            exp: 35, 
            badge: { id: 20, name: "Doppia Freccia", icon: "↔️" }, 
            sideQuest: { badge: { id: 1020, name: "Pergamena della Relatività", icon: "📜" } } 
        },

        // Capitolo 4: La Cittadella delle Leggi del Moto
        { 
            id: 21, 
            zoneId: 4, 
            title: "L'Essenza della Forza", 
            desc: "Introdurre il concetto di forza.", 
            reference: "Pag. 96, Par. 4.1", 
            exp: 20, 
            badge: { id: 21, name: "Tomo della Forza", icon: "🧠" }, 
            sideQuest: { badge: { id: 1021, name: "Pergamena della Forza", icon: "📜" } } 
        },
        { 
            id: 22, 
            zoneId: 4, 
            title: "La Legge dell'Inerzia", 
            desc: "Enunciare la prima legge di Newton e definire i sistemi inerziali.", 
            reference: "Pag. 97, Par. 4.2", 
            exp: 30, 
            badge: { id: 22, name: "Sigillo dell'Inerzia", icon: "🛌" }, 
            sideQuest: { badge: { id: 1022, name: "Pergamena dell'Inerzia", icon: "📜" } } 
        },
        { 
            id: 23, 
            zoneId: 4, 
            title: "Il Concetto di Massa", 
            desc: "Definire la massa come misura dell'inerzia.", 
            reference: "Pag. 98, Par. 4.3", 
            exp: 25, 
            badge: { id: 23, name: "Pietra della Massa", icon: "🗿" }, 
            sideQuest: { badge: { id: 1023, name: "Pergamena della Massa", icon: "📜" } } 
        },
        { 
            id: 24, 
            zoneId: 4, 
            title: "La Legge della Potenza", 
            desc: "Enunciare e applicare la seconda legge di Newton (F=ma).", 
            reference: "Pag. 99, Par. 4.4", 
            exp: 45, 
            badge: { id: 24, name: "Formula della Potenza", icon: "📜" }, 
            sideQuest: { badge: { id: 1024, name: "Pergamena della Potenza", icon: "📜" } } 
        },
        { 
            id: 25, 
            zoneId: 4, 
            title: "La Forza del Mondo", 
            desc: "Definire la forza gravitazionale e il concetto di peso.", 
            reference: "Pag. 101, Par. 4.5", 
            exp: 30, 
            badge: { id: 25, name: "Mela di Newton", icon: "🍎" }, 
            sideQuest: { badge: { id: 1025, name: "Pergamena della Gravità", icon: "📜" } } 
        },
        { 
            id: 26, 
            zoneId: 4, 
            title: "La Legge della Reazione", 
            desc: "Enunciare e interpretare la terza legge di Newton.", 
            reference: "Pag. 102, Par. 4.6", 
            exp: 40, 
            badge: { id: 26, name: "Sigillo della Reciprocità", icon: "🤝" }, 
            sideQuest: { badge: { id: 1026, name: "Pergamena della Reazione", icon: "📜" } } 
        },
        { 
            id: 27, 
            zoneId: 4, 
            title: "L'Arte del Diagramma di Corpo Libero", 
            desc: "Applicare le leggi di Newton usando i diagrammi di corpo libero.", 
            reference: "Pag. 104, Par. 4.7", 
            exp: 50, 
            badge: { id: 27, name: "Glifo del Diagramma", icon: "✍️" }, 
            sideQuest: { badge: { id: 1027, name: "Pergamena del Diagramma", icon: "📜" } } 
        },

        // Capitolo 5: Il Dominio delle Forze Applicate
        { 
            id: 28, 
            zoneId: 5, 
            title: "Il Labirinto dell'Attrito", 
            desc: "Analizzare le forze d'attrito statico e dinamico.", 
            reference: "Pag. 122, Par. 5.1", 
            exp: 45, 
            badge: { id: 28, name: "Marchio della Resistenza", icon: "🚧" }, 
            sideQuest: { badge: { id: 1028, name: "Pergamena dell'Attrito", icon: "📜" } } 
        },
        { 
            id: 29, 
            zoneId: 5, 
            title: "La Seconda Legge nel Vortice", 
            desc: "Applicare la seconda legge di Newton al moto circolare uniforme.", 
            reference: "Pag. 127, Par. 5.2", 
            exp: 40, 
            badge: { id: 29, name: "Catena Centripeta", icon: "🔗" }, 
            sideQuest: { badge: { id: 1029, name: "Pergamena Centripeta", icon: "📜" } } 
        },
        { 
            id: 30, 
            zoneId: 5, 
            title: "Il Velo del Moto Apparente", 
            desc: "Introdurre le forze fittizie nei sistemi non inerziali.", 
            reference: "Pag. 131, Par. 5.4", 
            exp: 35, 
            badge: { id: 30, name: "Maschera dell'Apparenza", icon: "🎭" }, 
            sideQuest: { badge: { id: 1030, name: "Pergamena Fittizia", icon: "📜" } } 
        },
        { 
            id: 31, 
            zoneId: 5, 
            title: "La Resistenza del Mezzo", 
            desc: "Analizzare il moto in presenza di forze viscose.", 
            reference: "Pag. 133, Par. 5.5", 
            exp: 35, 
            badge: { id: 31, name: "Goccia Viscosa", icon: "💧" }, 
            sideQuest: { badge: { id: 1031, name: "Pergamena Viscosa", icon: "📜" } } 
        },

        // Capitolo 6: L'Aetherium del Lavoro e dell'Energia Cinetica
        { 
            id: 32, 
            zoneId: 6, 
            title: "Il Trasferimento di Mana", 
            desc: "Definire il lavoro svolto da una forza costante.", 
            reference: "Pag. 150, Par. 6.1", 
            exp: 30, 
            badge: { id: 32, name: "Runa del Lavoro", icon: "🔨" }, 
            sideQuest: { badge: { id: 1032, name: "Pergamena del Lavoro", icon: "📜" } } 
        },
        { 
            id: 33, 
            zoneId: 6, 
            title: "L'Intreccio di Forze", 
            desc: "Calcolare il lavoro come prodotto scalare di due vettori.", 
            reference: "Pag. 152, Par. 6.2", 
            exp: 35, 
            badge: { id: 33, name: "Intreccio Vettoriale", icon: "⚔️" }, 
            sideQuest: { badge: { id: 1033, name: "Pergamena Scalare", icon: "📜" } } 
        },
        { 
            id: 34, 
            zoneId: 6, 
            title: "Il Lavoro della Forza Mutevole", 
            desc: "Calcolare il lavoro svolto da una forza variabile (es. molla).", 
            reference: "Pag. 154, Par. 6.3", 
            exp: 40, 
            badge: { id: 34, name: "Spirale Elastica", icon: "➰" }, 
            sideQuest: { badge: { id: 1034, name: "Pergamena della Molla", icon: "📜" } } 
        },
        { 
            id: 35, 
            zoneId: 6, 
            title: "Il Potere del Movimento", 
            desc: "Definire l'energia cinetica e il teorema dell'energia cinetica.", 
            reference: "Pag. 158, Par. 6.4", 
            exp: 45, 
            badge: { id: 35, name: "Emblema Cinetico", icon: "💥" }, 
            sideQuest: { badge: { id: 1035, name: "Pergamena Cinetica", icon: "📜" } } 
        },
        { 
            id: 36, 
            zoneId: 6, 
            title: "La Rapidità del Mana", 
            desc: "Definire e calcolare la potenza.", 
            reference: "Pag. 163, Par. 6.5", 
            exp: 30, 
            badge: { id: 36, name: "Folgore della Potenza", icon: "💨" }, 
            sideQuest: { badge: { id: 1036, name: "Pergamena della Rapidità", icon: "📜" } } 
        },

        // Capitolo 7: Il Tempio dell'Energia Potenziale
        { 
            id: 37, 
            zoneId: 7, 
            title: "Il Potere Latente", 
            desc: "Definire l'energia potenziale di un sistema.", 
            reference: "Pag. 174, Par. 7.1", 
            exp: 35, 
            badge: { id: 37, name: "Cristallo Potenziale", icon: "🔮" }, 
            sideQuest: { badge: { id: 1037, name: "Pergamena Potenziale", icon: "📜" } } 
        },
        { 
            id: 38, 
            zoneId: 7, 
            title: "Il Biforco delle Forze", 
            desc: "Distinguere tra forze conservative e non conservative.", 
            reference: "Pag. 176, Par. 7.2", 
            exp: 40, 
            badge: { id: 38, name: "Biforco Conservativo", icon: "🔱" }, 
            sideQuest: { badge: { id: 1038, name: "Pergamena Conservativa", icon: "📜" } } 
        },
        { 
            id: 39, 
            zoneId: 7, 
            title: "Il Legame Energia-Forza", 
            desc: "Relazionare le forze conservative con l'energia potenziale.", 
            reference: "Pag. 179, Par. 7.3", 
            exp: 35, 
            badge: { id: 39, name: "Legame Energetico", icon: "🔗" }, 
            sideQuest: { badge: { id: 1039, name: "Pergamena del Legame", icon: "📜" } } 
        },
        { 
            id: 40, 
            zoneId: 7, 
            title: "Il Giuramento dell'Equilibrio", 
            desc: "Enunciare e applicare la conservazione dell'energia meccanica.", 
            reference: "Pag. 180, Par. 7.4", 
            exp: 50, 
            badge: { id: 40, name: "Sfera della Conservazione", icon: "🌐" }, 
            sideQuest: { badge: { id: 1040, name: "Pergamena dell'Equilibrio", icon: "📜" } } 
        },
        { 
            id: 41, 
            zoneId: 7, 
            title: "Il Lavoro delle Forze Dissipative", 
            desc: "Includere il lavoro delle forze non conservative nel bilancio energetico.", 
            reference: "Pag. 184, Par. 7.5", 
            exp: 45, 
            badge: { id: 41, name: "Tributo all'Attrito", icon: "🔥" }, 
            sideQuest: { badge: { id: 1041, name: "Pergamena Dissipativa", icon: "📜" } } 
        }
    ]
};

// Configurazione default del giocatore
const defaultPlayerState = {
    playerName: "",
    level: 1,
    exp: 0,
    completedChallenges: [],
    completedSideQuests: [],
    challengeData: {},
    settings: {
        theme: "grimorio",
        notifications: true,
        sound: false
    },
    stats: {
        totalChallengesCompleted: 0,
        totalSideQuestsCompleted: 0,
        totalExpGained: 0,
        studyTimeMinutes: 0
    }
};

// Calcola l'esperienza necessaria per il prossimo livello
function getExpForNextLevel(currentLevel = 1) {
    return currentLevel * 100;
}

// Calcola il livello in base all'esperienza totale
function getLevelFromExp(totalExp) {
    let level = 1;
    let totalRequiredExp = 0;
    
    // Trova il livello corretto
    while (totalExp >= totalRequiredExp + (level * 100)) {
        totalRequiredExp += level * 100;
        level++;
    }
    
    // Calcola l'esperienza nel livello attuale
    const currentLevelExp = totalExp - totalRequiredExp;
    
    return { level, currentLevelExp };
}
