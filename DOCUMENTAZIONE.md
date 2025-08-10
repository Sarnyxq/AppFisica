# 📚 Il Grimorio dell'Apprendista Stregone - Fisica 3.0
## Documentazione Completa del Sistema

---

## 📋 Indice

1. [Panoramica del Progetto](#panoramica-del-progetto)
2. [Architettura del Sistema](#architettura-del-sistema)
3. [Struttura File e Directory](#struttura-file-e-directory)
4. [Moduli e Componenti](#moduli-e-componenti)
5. [Sistema di Dati](#sistema-di-dati)
6. [Interfaccia Utente](#interfaccia-utente)
7. [Funzionalità Principali](#funzionalità-principali)
8. [Gamification](#gamification)
9. [Guida per Sviluppatori](#guida-per-sviluppatori)
10. [Configurazione e Deploy](#configurazione-e-deploy)

---

## 🎯 Panoramica del Progetto

**Il Grimorio dell'Apprendista Stregone - Fisica 3.0** è un'applicazione web educativa gamificata per l'apprendimento della fisica. Il progetto combina:

- **Tema fantastico medievale**: Un'esperienza immersiva con terminologia magica
- **Apprendimento interattivo**: Sfide con canvas per disegnare e spiegazioni testuali
- **Sistema di progressione**: Livelli, esperienza, badge e sigilli da forgiare
- **Design responsivo**: Ottimizzato per desktop e mobile
- **Architettura modulare**: Codice organizzato e manutenibile

### 🎮 Concetti Chiave

- **Grimorio**: L'applicazione principale
- **Apprendista Stregone**: Il giocatore/studente
- **Zone**: Capitoli di fisica organizzati tematicamente
- **Sfide**: Esercizi e problemi interattivi
- **Sigilli**: Badge ottenuti completando le sfide
- **Esperienza (EXP)**: Sistema di punti per la progressione
- **Castello**: Metafora per la mappa delle zone di apprendimento

---

## 🏗️ Architettura del Sistema

### Struttura Modulare

```
AppFisica/
├── index.html              # Entry point principale
├── package.json             # Configurazione del progetto
├── assets/                  # Risorse statiche
│   ├── css/                # Fogli di stile
│   └── js/                 # Script applicazione principale
├── components/             # Componenti UI riutilizzabili
├── data/                   # Dati del contenuto educativo
├── modules/                # Moduli core dell'applicazione
└── .git/                   # Repository Git
```

### Tecnologie Utilizzate

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **UI Framework**: Tailwind CSS
- **Fonts**: Google Fonts (MedievalSharp, Lora)
- **Storage**: LocalStorage per persistenza dati
- **Architettura**: Modular JavaScript con classe-based design

---

## 📁 Struttura File e Directory

### File Principali

#### `index.html` (Entry Point)
- **Scopo**: Pagina principale dell'applicazione
- **Caratteristiche**:
  - Welcome screen con input nome giocatore
  - Caricamento di tutti i moduli e dipendenze
  - Layout responsivo con header, main content e modali
  - Gestione automatica skip welcome se progressi esistenti

#### `package.json`
```json
{
  "name": "grimorio-fisica-3.0",
  "version": "3.0.0",
  "description": "Il Grimorio dell'Apprendista Stregone - Sistema di apprendimento della fisica gamificato",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2"
  },
  "keywords": ["fisica", "education", "gamification", "learning"]
}
```

### Directory `assets/`

#### `assets/css/`

**`theme.css`** - Tema visuale principale
- **Variabili CSS**: Palette colori pergamena, oro, inchiostro
- **Tipografia medievale**: Font personalizzati per l'ambientazione
- **Componenti UI**: Card, pulsanti, barre esperienza
- **Animazioni**: Effetti glow, shimmer, transizioni

**`components.css`** - Componenti riutilizzabili
- **Layout system**: Griglia responsiva, flexbox utilities
- **Spacing system**: Padding, margin, gap standardizzati
- **Interactive elements**: Stati hover, focus, attivi
- **Modal system**: Stili per popup e overlay

**`animations.css`** - Sistema animazioni
- **Keyframes**: magical-glow, shimmer, bounce, float
- **Transizioni**: Smooth per interazioni UI
- **Performance**: will-change per ottimizzazione GPU
- **Accessibilità**: Rispetto per prefers-reduced-motion

#### `assets/js/`

**`app.js`** - Controller principale
- **Classe FisicaApp**: Orchestrazione completa dell'applicazione
- **Inizializzazione modulare**: Caricamento sequenziale controllato
- **Gestione errori**: Error handling robusto
- **Eventi globali**: Shortcuts keyboard, auto-save, gestione visibilità

### Directory `components/`

**Componenti UI specializzati**:
- `header.js` - Barra superiore con stats giocatore
- `modals.js` - Sistema modale per sfide e contenuti
- `settingsModal.js` - Pannello impostazioni avanzato
- `canvas.js` - Canvas interattivo per disegno
- `canvasprototype.js` - Versione sperimentale canvas

### Directory `data/`

**`castleData.js`** - Core educativo
- **Zone configuration**: 10 capitoli di fisica
- **Challenges database**: 41 sfide complete
- **Badge system**: Sigilli e ricompense
- **Progression logic**: Calcoli esperienza e livelli

### Directory `modules/`

**Moduli core del sistema**:
- `storageManager.js` - Persistenza dati
- `gameState.js` - Stato giocatore e progressione  
- `notificationSystem.js` - Sistema messaggi
- `castleMap.js` - Visualizzazione mappa
- `wingView.js` - Vista dettaglio zone
- `trophyHall.js` - Galleria achievement
- `memoryHall.js` - Sistema ripasso spaziale

---

## 🔧 Moduli e Componenti

### Storage Manager (`storageManager.js`)

**Responsabilità**: Gestione completa della persistenza dati

```javascript
class StorageManager {
    // Chiavi storage
    storageKey = 'grimorio_fisica_progress'
    settingsKey = 'grimorio_fisica_settings'
    
    // Metodi principali
    saveProgress(playerState)    // Salva stato giocatore
    loadProgress()               // Carica progressi
    exportData()                 // Backup dati
    importData(backupData)       // Restore dati
    clearAllData()              // Reset completo
    resetProgress()             // Reset solo progressi
}
```

**Caratteristiche**:
- ✅ Backup/restore completo
- ✅ Versioning per compatibilità
- ✅ Gestione errori robusta
- ✅ Debug info dettagliate
- ✅ Cleanup automatico chiavi legacy

### Game State (`gameState.js`)

**Responsabilità**: Stato centrale del giocatore e logica di gioco

```javascript
class GameState {
    playerState = {
        playerName: "",
        level: 1,
        exp: 0,
        completedChallenges: [],
        completedSideQuests: [],
        challengeData: {},
        settings: {},
        stats: {}
    }
    
    // Metodi core
    init()                      // Inizializzazione
    startNewGame(playerName)    // Nuovo gioco
    addExperience(amount)       // Aggiunge EXP
    completeChallenge(id)       // Completa sfida
    updateUI()                  // Aggiorna interfaccia
}
```

**Features**:
- 🎮 Sistema esperienza con level-up automatico
- 📊 Tracking completo statistiche
- 🏆 Gestione achievement e badge
- 💾 Auto-save intelligente
- 🔄 Sincronizzazione UI real-time

### App Controller (`app.js`)

**Responsabilità**: Orchestrazione generale dell'applicazione

```javascript
class FisicaApp {
    // Inizializzazione in 11 fasi
    1. checkPrerequisites()     // Verifica compatibilità
    2. initStorageManager()     // Setup persistenza
    3. initGameState()          // Carica stato giocatore
    4. initNotificationSystem() // Sistema messaggi
    5. initUIComponents()       // Componenti interfaccia
    6. initCoreModules()        // Moduli principali
    7. initViewModules()        // Moduli visualizzazione
    8. applyUserSettings()      // Applica preferenze
    9. setupGlobalEvents()      // Eventi sistema
    10. showMainInterface()     // Mostra UI
    11. finishInitialization()  // Finalizza setup
}
```

**Gestione Eventi**:
- ⌨️ Shortcuts tastiera (Ctrl+S save, Ctrl+, settings, F1 debug)
- 👁️ Gestione visibilità pagina (auto-save su hide)
- 📱 Responsive resize handling
- ⚠️ Error handling globale

### Notification System (`notificationSystem.js`)

**Responsabilità**: Sistema di messaggi e feedback utente

**Tipi supportati**:
- `success` - Azioni completate con successo
- `error` - Errori e problemi
- `info` - Informazioni generiche
- `warning` - Avvisi e attenzioni

**Features**:
- 🎨 Styling tematico per ogni tipo
- ⏱️ Auto-dismiss configurabile
- 📱 Layout responsive
- 🔗 Queue gestione multipli messaggi

---

## 📊 Sistema di Dati

### Castle Data (`castleData.js`)

**Struttura Zone**:
```javascript
zones: [
    {
        id: 1,
        title: "Capitolo 1: Il Santuario delle Misure",
        desc: "Le fondamenta della magia fisica...",
        minLevel: 1,
        icon: "🏛️"
    }
    // ... 10 zone totali
]
```

**Struttura Challenge**:
```javascript
challenges: [
    {
        id: 1,
        zoneId: 1,
        title: "I Campioni Primordiali",
        desc: "Comprendere i campioni di lunghezza...",
        reference: "Pag. 24, Par. 1.1",
        exp: 20,
        badge: { id: 1, name: "Sigillo del Metro", icon: "📏" },
        sideQuest: { badge: { id: 1001, name: "Pergamena della Misura", icon: "📜" } }
    }
    // ... 41 sfide totali
]
```

### Mappatura Contenuti Educativi

**Capitoli coperti**:
1. **Santuario delle Misure** (9 sfide) - Misure, dimensioni, vettori
2. **Camera del Moto Unidimensionale** (5 sfide) - Cinematica 1D
3. **Arena del Moto Bidimensionale** (6 sfide) - Cinematica 2D
4. **Cittadella delle Leggi del Moto** (7 sfide) - Dinamica Newton
5. **Dominio delle Forze Applicate** (4 sfide) - Applicazioni forze
6. **Aetherium del Lavoro e Energia Cinetica** (5 sfide) - Lavoro/Energia
7. **Tempio dell'Energia Potenziale** (5 sfide) - Energia potenziale

**Sistema Progressione**:
- **Base EXP**: 20-50 per sfida (media 32 EXP)
- **Level formula**: level_exp = level * 100
- **Badge system**: 41 sigilli principali + 41 pergamene side-quest
- **Riferimenti**: Ogni sfida linkda a pagina/paragrafo specifico

---

## 🎨 Interfaccia Utente

### Design System

**Palette Colori**:
```css
:root {
  /* Pergamena */
  --pergamena-light: #f9f6e8;
  --pergamena: #f4efdf;
  --pergamena-dark: #e8dcc6;
  
  /* Inchiostro */
  --ink-light: #5d4e37;
  --ink: #4a3c28;
  --ink-dark: #3d2f1f;
  
  /* Accenti magici */
  --gold: #d4af37;
  --magic-blue: #4a6fa5;
  --magic-purple: #6b4c93;
}
```

**Tipografia**:
- **Headers**: MedievalSharp (atmosfera fantasy)
- **Body**: Lora (leggibilità ottimale)
- **UI Elements**: System fonts (performance)

### Componenti UI

**Card System**:
- Texture pergamena con effetti radial-gradient
- Bordi inchiostro con shadow progressive
- Hover effects con transform e glow
- Lock state per contenuti non accessibili

**Button System**:
```css
.btn-primary    /* Oro gradiente per azioni principali */
.btn-secondary  /* Pergamena per azioni secondarie */
.btn-warning    /* Arancione per reset progressi */
.btn-danger     /* Rosso per cancellazioni definitive */
```

**Progress Bars**:
- Container pergamena con bordo inchiostro
- Fill oro gradiente con shimmer effect
- Transizioni smooth 0.8s cubic-bezier
- Height 24px per leggibilità ottimale

### Layout Responsivo

**Breakpoints**:
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

**Grid System**:
- CSS Grid per layout principale
- Flexbox per componenti
- Auto-responsive con `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`

---

## ⚙️ Funzionalità Principali

### Welcome Screen

**Flow utente**:
1. **Check existing data**: Auto-skip se nome salvato
2. **Name input**: Campo obbligatorio per iniziare
3. **Game state sync**: Collegamento con sistema progressione
4. **Keyboard support**: Enter per confermare

### Mappa Castello

**Caratteristiche**:
- **Zone cards**: Visual representation di ogni capitolo
- **Progress indication**: Barre completamento per zona
- **Level gating**: Zone sbloccate in base al livello
- **Responsive grid**: Adattamento automatico schermo

### Sistema Sfide

**Modalità sfida**:
1. **Modal popup**: Layout contenuto sfida
2. **Canvas interattivo**: Area disegno per schemi/grafici  
3. **Text area**: Spazio spiegazione testuale
4. **Tools palette**: Penna, gomma, colori, dimensioni
5. **Save system**: Auto-save progressi in real-time

**Completion flow**:
```
Apri Sfida → Leggi Descrizione → Disegna/Scrivi → Salva → Completa → Ottieni EXP/Badge
```

### Sistema Esperienza

**Meccaniche**:
- **EXP gain**: 20-50 per sfida completata
- **Level calculation**: Requisiti crescenti (100, 200, 300, ...)
- **UI feedback**: Barra esperienza animata
- **Level up**: Notifiche celebrative

**Formula progresso**:
```javascript
function getLevelFromExp(totalExp) {
    let level = 1;
    let totalRequiredExp = 0;
    
    while (totalExp >= totalRequiredExp + (level * 100)) {
        totalRequiredExp += level * 100;
        level++;
    }
    
    const currentLevelExp = totalExp - totalRequiredExp;
    return { level, currentLevelExp };
}
```

### Settings & Preferences

**Opzioni disponibili**:
- **Theme selection**: Grimorio (default) + alternative future
- **Notifications**: Toggle sistema messaggi
- **Sound**: Toggle effetti audio (preparato per futuro)
- **Data management**: Export/import/reset progressi

**Sezioni settings**:
1. **Personalizzazione**: Nome, tema, preferenze
2. **Notifiche**: Controllo feedback sistema
3. **Dati e Privacy**: Gestione progressi e backup
4. **Reset e Gestione**: Reset selettivo o completo

---

## 🎮 Gamification

### Sistema Badge

**Tipologie**:
- **Sigilli Principali**: Badge per completamento sfide (41 totali)
- **Pergamene Side-Quest**: Achievement opzionali (41 totali)  
- **Temi Badge**: Icone emoji coordinate per categoria

**Iconografia badge**:
```
Misure: 📏 ⚛️ 🧬 🔄 👁️ ⚖️ 🧭 ➕ 🗺️
Moto 1D: 👣 ⚡ 🚩 📈 🪶
Moto 2D: ➡️ 🏁 🎯 🔄 🌀 ↔️
Forze: 🧠 🛌 🗿 📜 🍎 🤝 ✍️
Applicazioni: 🚧 🔗 🎭 💧
Lavoro/Energia: 🔨 ⚔️ ➰ 💥 💨
Energia Potenziale: 🔮 🔱 🔗 🌐 🔥
```

### Progression System

**Elementi progressione**:
- **Player Level**: Calcolato da esperienza totale
- **Zone Completion**: Percentuale sfide completate per zona
- **Badge Collection**: Sigilli e pergamene ottenuti
- **Study Stats**: Tempo studio, sfide completate, EXP totale

**Reward Mechanics**:
- **Immediate feedback**: Notifiche instant per completion
- **Visual celebration**: Animazioni glow e bounce per achievement
- **Progress tracking**: Barre esperienza con smooth transitions
- **Collection aspect**: Gallery di badge sbloccati

### Retention Features

**Engagement**:
- **Auto-save**: Progressi mai persi
- **Resume capability**: Ritorno seamless dopo pausa
- **Mobile responsive**: Gioco ovunque
- **Achievement hunting**: Collection badge come motivazione

---

## 👨‍💻 Guida per Sviluppatori

### Setup Ambiente

**Prerequisiti**:
```bash
# Server statico (opzionale)
npm install -g http-server

# O usa Python
python -m http.server 8000

# O usa live-server per dev
npm install -g live-server
```

**Clone e avvio**:
```bash
git clone [repository-url]
cd AppFisica
live-server .
```

### Aggiungere Nuove Sfide

**1. Modifica `castleData.js`**:
```javascript
// Aggiungi a zones[] se nuova zona
{ 
    id: 11, 
    title: "Nuovo Capitolo", 
    desc: "Descrizione...", 
    minLevel: 1, 
    icon: "🔬" 
}

// Aggiungi a challenges[]
{ 
    id: 42, 
    zoneId: 11, 
    title: "Nuova Sfida", 
    desc: "Comprende il concetto...", 
    reference: "Pag. X, Par. Y", 
    exp: 30, 
    badge: { id: 42, name: "Nuovo Sigillo", icon: "🆕" },
    sideQuest: { badge: { id: 1042, name: "Nuova Pergamena", icon: "📜" } }
}
```

**2. Test e verifica**:
- Controlla che la sfida appaia nella zona corretta
- Verifica funzionamento completion e EXP
- Testa save/load della sfida

### Aggiungere Nuovi Moduli

**1. Crea file modulo**:
```javascript
// modules/newModule.js
class NewModule {
    constructor() {
        this.isInitialized = false;
    }
    
    init() {
        // Setup logic
        this.isInitialized = true;
        return true;
    }
    
    render() {
        // UI rendering
    }
    
    getDebugInfo() {
        return { initialized: this.isInitialized };
    }
}

const newModule = new NewModule();
window.newModule = newModule;
```

**2. Integra in app.js**:
```javascript
// In initCoreModules() o initViewModules()
if (window.newModule) {
    newModule.init();
    this.modules.newModule = newModule;
}
```

**3. Aggiungi script tag in index.html**:
```html
<script src="modules/newModule.js"></script>
```

### Customizzare Temi

**1. Modifica variabili CSS in `theme.css`**:
```css
:root {
    --custom-primary: #your-color;
    --custom-secondary: #your-color;
}
```

**2. Aggiungi classe tema**:
```css
.theme-custom {
    --pergamena: var(--custom-primary);
    --gold: var(--custom-secondary);
}
```

**3. Integra in settings**:
```javascript
// In settingsModal.js
const themes = [
    { id: 'grimorio', name: 'Grimorio Classico' },
    { id: 'custom', name: 'Tema Personalizzato' }
];
```

### Debug e Testing

**Console commands**:
```javascript
// Stato app
fisicaApp.getStatus()

// Debug info
fisicaApp.showDebugInfo()

// Forza aggiornamento UI
gameState.updateUI()

// Simula completamento sfida
gameState.completeChallenge(1)

// Reset progressi (dev only)
storageManager.clearAllData()
```

**Breakpoints strategici**:
- App initialization: `app.js:50`
- Challenge completion: `gameState.js:200`
- Save/Load operations: `storageManager.js:30`
- UI updates: Componenti render methods

---

## 🚀 Configurazione e Deploy

### Deploy Statico

**GitHub Pages**:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
# Enable Pages in repository settings
```

**Netlify**:
1. Connect repository
2. Build command: (empty - static site)
3. Publish directory: `/`
4. Deploy automatically

**Vercel**:
```bash
npm install -g vercel
vercel
# Follow CLI prompts
```

### Server Node.js (opzionale)

**Setup Express**:
```javascript
// server.js
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

**Deploy su piattaforme cloud**:
- **Heroku**: Push repository con package.json
- **Railway**: Connect GitHub repo
- **Render**: Static site deployment

### Ottimizzazioni Produzione

**Performance**:
- Minifica CSS/JS se necessario
- Ottimizza immagini (attualmente solo emoji)
- Abilita compression server-side
- Cache headers per assets statici

**SEO & Meta**:
```html
<meta name="description" content="Il Grimorio dell'Apprendista Stregone - Impara la fisica attraverso sfide interattive">
<meta name="keywords" content="fisica, educazione, gamification, apprendimento">
<meta property="og:title" content="Grimorio della Fisica">
<meta property="og:description" content="Sistema gamificato per l'apprendimento della fisica">
```

**PWA (futuro)**:
- Manifest.json per installabilità mobile
- Service Worker per funzionamento offline
- Icons set per home screen

---

## 📈 Metriche e Analytics

### Tracking Implementato

**Local storage data**:
```javascript
stats: {
    totalChallengesCompleted: number,
    totalSideQuestsCompleted: number, 
    totalExpGained: number,
    studyTimeMinutes: number
}
```

**Eventi trackabili**:
- Challenge start/completion
- Time spent per session
- Level progression
- Badge unlocks
- Settings changes

### Possibili Estensioni Analytics

**Google Analytics 4**:
```javascript
// Custom events
gtag('event', 'challenge_complete', {
    'challenge_id': challengeId,
    'zone_id': zoneId,
    'exp_gained': expAmount
});
```

**Learning Analytics**:
- Tempo medio per sfida
- Pattern di drop-off
- Sfide più difficili
- Percorsi di apprendimento ottimali

---

## 🔮 Roadmap Futura

### Features Pianificate

**Breve termine (v3.1)**:
- [ ] Sistema audio/musica ambientale
- [ ] Più temi visuali alternativi  
- [ ] Esportazione sigilli come immagini
- [ ] Tutorial interattivo primo avvio

**Medio termine (v3.5)**:
- [ ] Multiplayer asincrono (classifiche)
- [ ] Sistema achievement avanzato
- [ ] Integrazione AI per hint personalizzati
- [ ] Mobile app nativa (React Native/Flutter)

**Lungo termine (v4.0)**:
- [ ] VR/AR support per esperimenti 3D
- [ ] Sistema tutoring peer-to-peer
- [ ] Integration con LMS (Moodle, Canvas)
- [ ] Analytics avanzati per insegnanti

### Limitazioni Attuali

**Tecniche**:
- Storage limitato a localStorage (quota browser)
- No backend per sync multi-device
- Performance canvas su mobile older

**Contenuto**:
- Solo primi 7 capitoli di fisica
- Mancano simulazioni interattive avanzate
- Assessment automatico limitato

**UX**:
- No guidance adattiva per difficoltà
- Feedback limitato su errori comuni
- Non personalizzazione learning path

---

## 📞 Supporto e Contributi

### Bug Report

**Template issue**:
```
## Bug Description
[Descrizione chiara del problema]

## Steps to Reproduce
1. [Passo 1]
2. [Passo 2] 
3. [Risultato atteso vs ottenuto]

## Environment
- Browser: [nome e versione]
- OS: [sistema operativo]
- Screen size: [risoluzione]

## Additional Info
[Screenshots, console errors, etc.]
```

### Feature Request

**Valutazione criteri**:
- ✅ Allineamento con mission educativa
- ✅ Fattibilità tecnica
- ✅ Impatto su user experience
- ✅ Maintenance overhead

### Contributing Code

**Process**:
1. Fork repository
2. Create feature branch
3. Follow coding conventions
4. Add appropriate tests
5. Submit pull request

**Coding Standards**:
- JavaScript ES6+ con classi
- Nomi descriptivi per variabili/funzioni
- Commenti per logica complessa
- Consistent indentation (2 spaces)

---

## 📄 Licenza e Credits

### Licenza
MIT License - Vedi file LICENSE per dettagli completi

### Credits
- **Framework UI**: Tailwind CSS
- **Fonts**: Google Fonts (MedievalSharp, Lora)
- **Icons**: Emoji Unicode standard
- **Inspiration**: Gamification principles, Medieval aesthetics

### Acknowledgments
- Fisica curriculum basato su standard universitari
- UX patterns da gaming educativo
- Accessibility guidelines WCAG 2.1

---

*Documentazione aggiornata: Agosto 2025*  
*Versione App: 3.0.0*  
*Status: ✅ Produzione Ready*
