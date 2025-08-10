# AppFisica - Applicazione di Apprendimento Fisica

## 🎯 Descrizione
AppFisica è un'applicazione interattiva per l'apprendimento della fisica attraverso sfide, storie narrative e un sistema di progressione coinvolgente. L'app utilizza un'estetica fantasy con elementi di gamification per rendere l'apprendimento più engaging.

## ✨ Funzionalità Principali

### 🏰 Sistema del Grimorio
- **Mappa del Castello**: Navigazione visuale tra diverse zone di apprendimento
- **Zone Tematiche**: Ogni zona copre argomenti specifici di fisica
- **Sistema di Unlock**: Le zone si sbloccano progressivamente

### ⚔️ Sistema Sfide
- **Sfide Principali**: Esercizi di fisica con sistema di completamento
- **Side Quest**: Missioni secondarie per praticare ulteriormente
- **Sistema Badge**: Ricompense visuali per il completamento
- **Progressione EXP**: Sistema di punti esperienza

### 📖 **Funzionalità Storia Sfide** ⭐ **NUOVA**

#### Revisione Storia Sfide Completate
- **Pulsante Storia**: Appare automaticamente sotto le sfide completate che hanno contenuto narrativo
- **Modal Revisione**: Interfaccia dedicata per rileggere le storie delle sfide completate
- **Contenuto Completo**: Include introduzione capitolo, storia sfida specifica, e informazioni sfida

#### Come Usare
1. Completa una sfida che ha contenuto storia
2. Il pulsante "📖 Storia" apparirà sotto il badge "Sigillo Forgiato"
3. Clicca il pulsante per aprire il modal di revisione storia
4. Leggi il contenuto e chiudi il modal quando finito

#### Caratteristiche Tecniche
- ✅ Auto-rilevamento sfide con storia
- ✅ Modal responsive per tutti i dispositivi
- ✅ Formattazione elegante del testo
- ✅ Chiusura con ESC, click fuori, o pulsanti
- ✅ Integrazione seamless con sistema esistente
- ✅ Animazioni fluide e transizioni
- ✅ Accessibilità WCAG 2.1 compliant
- ✅ Focus management per screen readers

### 🖊️ **Supporto S Pen Samsung** ⭐ **NUOVA**

#### Samsung Galaxy S6 Lite Ottimizzato
- **Switch Automatico**: Modalità penna/gomma tramite pulsante laterale S Pen
- **Palm Rejection Avanzata**: Ignora tocchi accidentali della mano
- **Pressure Sensitivity**: Spessore linea basato su pressione della penna
- **Feedback Visivo**: Notifiche eleganti per cambio modalità automatico

#### Come Usare S Pen
1. Apri il modal di disegno in una sfida
2. Usa S Pen normalmente per disegnare (modalità penna ✏️)
3. Premi e tieni premuto il pulsante laterale per modalità gomma (🧹)
4. Rilascia il pulsante per tornare alla modalità penna
5. Feedback visivo automatico mostra modalità corrente

#### Caratteristiche Tecniche
- ✅ Rilevamento automatico dispositivi Samsung compatibili
- ✅ Gestione eventi pointer ottimizzata per S Pen
- ✅ Debouncing anti-flickering per switch modalità
- ✅ Configurazione palm rejection regolabile
- ✅ Test suite completa per validazione funzionalità
- ✅ Performance ottimizzate per drawing real-time
- ✅ Compatibilità mantenuta con Surface Pro e altri dispositivi

#### Dispositivi Supportati
- **Samsung Galaxy S6 Lite** (target primario) 
- **Altri dispositivi Samsung con S Pen** (supporto generico)
- **Surface Pro 7** (supporto esistente mantenuto)
- **Fallback touch/mouse** (dispositivi senza penna)

## 🛠️ Tecnologie Utilizzate

### Frontend
- **HTML5**: Struttura semantica dell'applicazione
- **CSS3**: Styling avanzato con Flexbox, Grid, e animazioni
- **JavaScript ES6+**: Logica dell'applicazione e interattività
- **Tailwind CSS**: Framework utility-first per styling rapido

### Architettura
- **Modular Design**: Codice organizzato in moduli specifici
- **Event-Driven**: Sistema basato su eventi per la comunicazione tra moduli
- **Responsive First**: Design ottimizzato per tutti i dispositivi
- **Progressive Enhancement**: Funzionalità che si arricchiscono progressivamente

## 📁 Struttura del Progetto

```
AppFisica/
├── index.html                 # Punto di ingresso dell'applicazione
├── assets/                    # Risorse statiche
│   ├── css/                   # Fogli di stile
│   │   ├── main.css          # Stili principali
│   │   ├── components.css    # Stili componenti
│   │   ├── animations.css    # Animazioni e transizioni
│   │   └── story.css         # Stili per sistema storia ⭐ NUOVO
│   ├── js/                   # JavaScript utilities
│   └── images/               # Immagini e icone
├── components/               # Componenti UI riutilizzabili
├── data/                     # Dati dell'applicazione
│   ├── castleData.js        # Dati zone e sfide
│   └── storyData.js         # Contenuti narrativi
├── modules/                  # Moduli principali
│   ├── castleMap.js         # Gestione mappa del castello
│   ├── wingView.js          # Vista zone e sfide ⭐ AGGIORNATO
│   ├── gameState.js         # Stato del gioco
│   ├── storageManager.js    # Persistenza dati
│   └── notificationSystem.js # Sistema notifiche
└── test-storia-button.js    # Test automatizzato ⭐ NUOVO
```

## 🚀 Installazione e Avvio

### Metodo 1: Apertura Diretta
```bash
# Apri semplicemente index.html nel browser
open index.html
# oppure
start index.html
```

### Metodo 2: Server Locale (Opzionale)
```bash
# Con Python
python -m http.server 8000

# Con Node.js (se disponibile)
npx serve .

# Con PHP
php -S localhost:8000
```

## 🧪 Testing

### Test Automatizzato
L'applicazione include script di test automatizzati:

```javascript
// Test sistema Storia
// Apri la console del browser e esegui:
// Copia e incolla il contenuto di test-storia-button.js

// Test S Pen Samsung ⭐ NUOVO
// Apri la console del browser e esegui:
testSPenSupport();
```

### Test S Pen Samsung
1. **Setup**: Apri AppFisica su Samsung Galaxy S6 Lite
2. **Console Test**: Esegui `testSPenSupport()` in console browser
3. **Test Rilevamento**: Verifica rilevamento automatico S Pen
4. **Test Switch Modalità**: 
   - Disegna normalmente con S Pen (modalità penna)
   - Premi pulsante laterale S Pen (modalità gomma)
   - Verifica notifica visiva cambio modalità
   - Rilascia pulsante (ritorno modalità penna)
5. **Test Palm Rejection**: Tocca schermo con mano mentre usi S Pen

### Test Manuali
1. **Test Base**: Apri l'applicazione e completa una sfida
2. **Test Pulsante**: Verifica che appaia il pulsante "📖 Storia"
3. **Test Modal**: Clicca il pulsante e verifica apertura modal
4. **Test Responsive**: Testa su dispositivi diversi
5. **Test Accessibilità**: Naviga con tastiera e screen reader
6. **Test S Pen**: Segui procedura test S Pen sopra

## 🎨 Personalizzazione

### Temi e Stili
I colori e lo stile possono essere personalizzati modificando le variabili CSS in `assets/css/main.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --accent-color: #fbbf24;
    /* ... altre variabili */
}
```

### Contenuti
- **Sfide**: Modifica `data/castleData.js` per aggiungere nuove sfide
- **Storie**: Aggiungi contenuti narrativi in `data/storyData.js`
- **Zone**: Configura nuove aree di apprendimento

## 🤝 Contribuire

### Sviluppo
1. Fai fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/nuova-funzionalita`)
3. Testa le modifiche con lo script di test
4. Commit le modifiche (`git commit -am 'Aggiunge nuova funzionalità'`)
5. Push al branch (`git push origin feature/nuova-funzionalita`)
6. Crea una Pull Request

### Segnalazione Bug
Utilizza il sistema di Issues per segnalare:
- Errori nell'applicazione
- Problemi di performance
- Suggerimenti di miglioramento

## 📋 Changelog

### Versione 3.2.0 ⭐ **NUOVA**
- **Aggiunto**: Supporto completo S Pen Samsung Galaxy S6 Lite
- **Aggiunto**: Switch automatico penna/gomma tramite pulsante laterale
- **Aggiunto**: Palm rejection avanzata per S Pen
- **Aggiunto**: Pressure sensitivity ottimizzata 
- **Aggiunto**: Feedback visivo elegante per cambio modalità
- **Aggiunto**: Test suite dedicata per S Pen (`test-spen.js`)
- **Migliorato**: Compatibilità multi-dispositivo (Samsung + Surface Pro)
- **Migliorato**: Performance sistema disegno per dispositivi pen

### Versione 3.1.0
- **Aggiunto**: Pulsante Storia per sfide completate
- **Aggiunto**: Modal di revisione storia con animazioni
- **Aggiunto**: Sistema di accessibilità completo
- **Aggiunto**: Ottimizzazioni mobile avanzate
- **Aggiunto**: Test automatizzato per nuove funzionalità
- **Migliorato**: Focus management e keyboard navigation
- **Migliorato**: Responsive design per tutti i dispositivi

### Versione 3.0.0
- Sistema di storie integrato
- Animazioni e transizioni avanzate
- Design responsive completo
- Sistema di persistenza migliorato

## 📞 Supporto

Per supporto e domande:
- **Issues**: Utilizza il sistema di Issues di GitHub
- **Documentazione**: Consulta `istruzioni3.md` per dettagli implementazione
- **Test**: Esegui `test-storia-button.js` per verifiche automatiche

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

---

### 🎯 Caratteristiche Distintive

- **Apprendimento Gamificato**: Trasforma lo studio della fisica in un'avventura
- **Narrativa Immersiva**: Storie coinvolgenti per ogni concetto
- **Progressione Motivante**: Sistema di badge e ricompense
- **Accessibilità Universale**: Utilizzabile da tutti, inclusi utenti con disabilità
- **Performance Ottimali**: Caricamento rapido e animazioni fluide
- **Cross-Platform**: Funziona su desktop, tablet e mobile

**AppFisica - Dove la Fisica Diventa Avventura! ⚡🧙‍♂️**
