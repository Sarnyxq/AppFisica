// STORY PARSER - Fisica 3.0
// Parser per elaborare il file Storia.txt e convertirlo in struttura dati

class StoryParser {
    constructor() {
        this.chapters = [];
        this.currentChapter = null;
        this.currentRoom = null;
        this.debugMode = false;
    }

    // Metodo principale per parsare il file di storia
    static parseStoryFile(storyText) {
        const parser = new StoryParser();
        return parser.parse(storyText);
    }

    // Parsa il testo della storia
    parse(storyText) {
        if (!storyText || typeof storyText !== 'string') {
            console.error('[StoryParser] Testo storia non valido');
            return { chapters: [] };
        }

        const lines = storyText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        console.log(`[StoryParser] Parsing ${lines.length} righe di storia...`);

        this.chapters = [];
        this.currentChapter = null;
        this.currentRoom = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (this.isChapterStart(line)) {
                this.processChapter(line, lines, i);
            } else if (this.isRoomStart(line)) {
                this.processRoom(line, lines, i);
            } else if (this.isStoryStart(line)) {
                this.processStoryContent(lines, i);
            }
        }

        console.log(`[StoryParser] Parsing completato: ${this.chapters.length} capitoli trovati`);
        return { chapters: this.chapters };
    }

    // Verifica se la riga è l'inizio di un capitolo
    isChapterStart(line) {
        return line.startsWith('Capitolo') && line.includes(':');
    }

    // Verifica se la riga è l'inizio di una stanza
    isRoomStart(line) {
        return line.startsWith('Stanza') && line.includes('(Cap.') && line.includes('):');
    }

    // Verifica se la riga è l'inizio del contenuto narrativo
    isStoryStart(line) {
        return line === 'La Storia della Sfida:';
    }

    // Elabora un nuovo capitolo
    processChapter(line, lines, index) {
        // Estrai numero e titolo del capitolo
        const match = line.match(/Capitolo (\d+): (.+)/);
        if (!match) {
            console.warn(`[StoryParser] Formato capitolo non riconosciuto: ${line}`);
            return;
        }

        const [, chapterNum, title] = match;
        const chapterId = parseInt(chapterNum);

        // Trova il testo introduttivo del capitolo
        let introduction = '';
        for (let i = index + 1; i < lines.length; i++) {
            const nextLine = lines[i];
            if (this.isRoomStart(nextLine) || this.isChapterStart(nextLine)) {
                break;
            }
            if (introduction) introduction += ' ';
            introduction += nextLine;
        }

        this.currentChapter = {
            id: chapterId,
            title: title.trim(),
            introduction: introduction.trim(),
            conclusion: '', // Sarà popolato successivamente se presente
            rooms: []
        };

        this.chapters.push(this.currentChapter);
        
        if (this.debugMode) {
            console.log(`[StoryParser] Nuovo capitolo: ${chapterId} - ${title}`);
        }
    }

    // Elabora una nuova stanza
    processRoom(line, lines, index) {
        if (!this.currentChapter) {
            console.warn(`[StoryParser] Stanza trovata senza capitolo: ${line}`);
            return;
        }

        // Estrai informazioni della stanza
        const match = line.match(/Stanza (\d+) \(Cap\. (\d+)\): (.+)/);
        if (!match) {
            console.warn(`[StoryParser] Formato stanza non riconosciuto: ${line}`);
            return;
        }

        const [, roomNum, chapterNum, roomTitle] = match;
        
        // Verifica che la stanza appartenga al capitolo corrente
        if (parseInt(chapterNum) !== this.currentChapter.id) {
            console.warn(`[StoryParser] Stanza ${roomNum} non appartiene al capitolo corrente (${this.currentChapter.id} vs ${chapterNum})`);
        }

        // Calcola challengeId basato su capitolo e stanza
        const challengeId = this.calculateChallengeId(parseInt(chapterNum), parseInt(roomNum));

        this.currentRoom = {
            challengeId: challengeId,
            roomNumber: parseInt(roomNum),
            title: roomTitle.trim(),
            storyText: ''
        };

        this.currentChapter.rooms.push(this.currentRoom);

        if (this.debugMode) {
            console.log(`[StoryParser] Nuova stanza: ${roomTitle} (Challenge ID: ${challengeId})`);
        }
    }

    // Elabora il contenuto narrativo di una stanza
    processStoryContent(lines, startIndex) {
        if (!this.currentRoom) {
            console.warn(`[StoryParser] Contenuto storia trovato senza stanza`);
            return;
        }

        let storyText = '';
        for (let i = startIndex + 1; i < lines.length; i++) {
            const line = lines[i];
            
            // Fermati quando incontri una nuova sezione
            if (this.isRoomStart(line) || this.isChapterStart(line) || this.isStoryStart(line)) {
                break;
            }

            if (storyText) storyText += ' ';
            storyText += line;
        }

        this.currentRoom.storyText = storyText.trim();

        if (this.debugMode) {
            console.log(`[StoryParser] Contenuto storia aggiunto (${storyText.length} caratteri)`);
        }
    }

    // Calcola l'ID della sfida basato su capitolo e stanza
    calculateChallengeId(chapterId, roomNumber) {
        // Mapping personalizzato per far corrispondere la storia alle sfide esistenti
        const chapterStartIds = {
            1: 1,   // Capitolo 1 inizia da sfida 1
            2: 9,   // Capitolo 2 inizia da sfida 9
            3: 15,  // Capitolo 3 inizia da sfida 15
            4: 21,  // Capitolo 4 inizia da sfida 21
            5: 28,  // Capitolo 5 inizia da sfida 28
            6: 33,  // Capitolo 6 inizia da sfida 33
            7: 38,  // Capitolo 7 inizia da sfida 38
            12: 44, // Capitolo 12 inizia da sfida 44
            13: 50, // Capitolo 13 inizia da sfida 50
            15: 57  // Capitolo 15 inizia da sfida 57
        };

        const startId = chapterStartIds[chapterId];
        if (!startId) {
            console.warn(`[StoryParser] Capitolo ${chapterId} non mappato, usando fallback`);
            return chapterId * 10 + roomNumber; // Fallback
        }

        return startId + roomNumber - 1;
    }

    // Converte la struttura parsata nel formato di storyData
    static convertToStoryData(parsedData) {
        if (!parsedData || !parsedData.chapters) {
            console.error('[StoryParser] Dati parsati non validi per conversione');
            return { chapters: [] };
        }

        const convertedChapters = parsedData.chapters.map(chapter => ({
            id: chapter.id,
            title: chapter.title,
            introduction: chapter.introduction,
            conclusion: chapter.conclusion || `La ${this.getOrdinalRune(chapter.id)} Runa si materializza, completando la tua comprensione di ${chapter.title.toLowerCase()}.`,
            rooms: chapter.rooms.map(room => ({
                challengeId: room.challengeId,
                storyText: room.storyText
            }))
        }));

        return {
            chapters: convertedChapters,
            
            // Aggiungi i metodi utility
            getChapterById(id) {
                return convertedChapters.find(chapter => chapter.id === id);
            },
            
            getStoryForChallenge(challengeId) {
                for (const chapter of convertedChapters) {
                    const room = chapter.rooms.find(room => room.challengeId === challengeId);
                    if (room) {
                        return {
                            chapterIntro: chapter.introduction,
                            challengeStory: room.storyText,
                            chapterTitle: chapter.title
                        };
                    }
                }
                return null;
            }
        };
    }

    // Ottieni il numero ordinale della runa
    static getOrdinalRune(chapterNumber) {
        const ordinals = [
            '', 'prima', 'seconda', 'terza', 'quarta', 'quinta', 
            'sesta', 'settima', 'ottava', 'nona', 'decima'
        ];
        return ordinals[chapterNumber] || `${chapterNumber}ª`;
    }

    // Carica e parsa il file Storia.txt
    static async loadAndParseStory() {
        try {
            console.log('[StoryParser] Caricamento file Storia.txt...');
            
            const response = await fetch('./aStory/Storia.txt');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const storyText = await response.text();
            console.log(`[StoryParser] File caricato: ${storyText.length} caratteri`);
            
            const parsedStory = this.parseStoryFile(storyText);
            const storyData = this.convertToStoryData(parsedStory);
            
            // Sovrascrivi l'oggetto storyData globale con i dati parsati
            if (window.storyData) {
                // Mantieni i metodi esistenti e aggiungi i nuovi capitoli
                Object.assign(window.storyData, storyData);
                console.log('[StoryParser] storyData globale aggiornato con i dati parsati');
            } else {
                window.storyData = storyData;
                console.log('[StoryParser] storyData globale creato con i dati parsati');
            }
            
            return storyData;
            
        } catch (error) {
            console.error('[StoryParser] Errore nel caricamento della storia:', error);
            
            // Fallback: usa i dati predefiniti se il caricamento fallisce
            if (window.storyData) {
                console.log('[StoryParser] Usando dati storia predefiniti come fallback');
                return window.storyData;
            } else {
                console.error('[StoryParser] Nessun dato storia disponibile');
                return { chapters: [] };
            }
        }
    }

    // Valida la mappatura storia-sfide
    static validateStoryMapping() {
        if (!window.storyData || !window.castleData) {
            console.error('[StoryParser] storyData o castleData non disponibili per validazione');
            return { valid: false, errors: ['Dati mancanti'] };
        }

        const errors = [];
        const warnings = [];

        // Verifica che ogni capitolo corrisponda a una zona
        window.storyData.chapters.forEach(chapter => {
            const zone = window.castleData.zones.find(z => z.id === chapter.id);
            if (!zone) {
                errors.push(`Capitolo ${chapter.id} non ha zona corrispondente`);
            }
        });

        // Verifica che ogni stanza corrisponda a una sfida
        window.storyData.chapters.forEach(chapter => {
            chapter.rooms.forEach(room => {
                const challenge = window.castleData.challenges.find(c => c.id === room.challengeId);
                if (!challenge) {
                    errors.push(`Stanza con challengeId ${room.challengeId} non ha sfida corrispondente`);
                } else {
                    // Verifica che la sfida appartenga alla zona corretta
                    if (challenge.zoneId !== chapter.id) {
                        warnings.push(`Sfida ${room.challengeId} appartiene alla zona ${challenge.zoneId} ma è mappata al capitolo ${chapter.id}`);
                    }
                }
            });
        });

        const result = {
            valid: errors.length === 0,
            errors,
            warnings,
            stats: {
                totalChapters: window.storyData.chapters.length,
                totalRooms: window.storyData.chapters.reduce((sum, ch) => sum + ch.rooms.length, 0),
                totalZones: window.castleData.zones.length,
                totalChallenges: window.castleData.challenges.length
            }
        };

        if (result.valid) {
            console.log('[StoryParser] ✅ Validazione mappatura storia completata con successo');
        } else {
            console.error('[StoryParser] ❌ Errori nella mappatura storia:', errors);
        }

        if (warnings.length > 0) {
            console.warn('[StoryParser] ⚠️ Avvisi mappatura storia:', warnings);
        }

        return result;
    }

    // Debug info
    static getDebugInfo() {
        return {
            isLoaded: !!window.storyData,
            chaptersCount: window.storyData ? window.storyData.chapters.length : 0,
            roomsCount: window.storyData ? window.storyData.getTotalRooms() : 0,
            validation: this.validateStoryMapping()
        };
    }
}

// Rendi globale per l'accesso da altri moduli
window.StoryParser = StoryParser;

// Test automatico al caricamento (solo in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Aspetta che tutti i moduli siano caricati prima del test
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (window.storyData && window.castleData) {
                console.log('[StoryParser] Test di validazione automatico...');
                const validation = StoryParser.validateStoryMapping();
                if (!validation.valid) {
                    console.error('[StoryParser] ❌ Problemi di mappatura rilevati:', validation);
                } else {
                    console.log('[StoryParser] ✅ Mappatura storia valida');
                }
            }
        }, 2000);
    });
}

// Funzioni helper per debug in console
window.debugStoryParser = {
    validateMapping: () => StoryParser.validateStoryMapping(),
    getDebugInfo: () => StoryParser.getDebugInfo(),
    loadStory: () => StoryParser.loadAndParseStory(),
    testParser: (text) => StoryParser.parseStoryFile(text)
};
