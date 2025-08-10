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
L'applicazione include uno script di test automatizzato per verificare il funzionamento del pulsante Storia:

```javascript
// Apri la console del browser e esegui:
// Copia e incolla il contenuto di test-storia-button.js
```

### Test Manuali
1. **Test Base**: Apri l'applicazione e completa una sfida
2. **Test Pulsante**: Verifica che appaia il pulsante "📖 Storia"
3. **Test Modal**: Clicca il pulsante e verifica apertura modal
4. **Test Responsive**: Testa su dispositivi diversi
5. **Test Accessibilità**: Naviga con tastiera e screen reader

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

### Versione 3.1.0 ⭐ **NUOVA**
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
