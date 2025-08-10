// === SCRIPT DI EMERGENZA BARRA ESPERIENZA ===
// Copia questo codice nella console del browser (F12) per risolvere il problema della barra

console.log('🚨 Script di Emergenza - Riparazione Barra Esperienza');
console.log('===================================================');

// Funzione per forzare l'aggiornamento della barra esperienza
function forceUpdateExpBar() {
    console.log('🔧 Forzando aggiornamento barra esperienza...');
    
    // Controlla se gameState esiste
    if (!window.gameState || !gameState.isInitialized) {
        console.error('❌ GameState non trovato o non inizializzato');
        return false;
    }
    
    const state = gameState.playerState;
    console.log(`📊 Stato corrente: Livello ${state.level}, EXP ${state.exp}`);
    
    // Trova elementi della barra
    const expBar = document.getElementById('exp-bar');
    const expDisplay = document.getElementById('exp-display');
    const expBarMobile = document.getElementById('exp-bar-mobile');
    const expDisplayMobile = document.getElementById('exp-display-mobile');
    
    console.log('🔍 Elementi trovati:');
    console.log('- Desktop exp-bar:', !!expBar);
    console.log('- Desktop exp-display:', !!expDisplay);
    console.log('- Mobile exp-bar:', !!expBarMobile);
    console.log('- Mobile exp-display:', !!expDisplayMobile);
    
    if (!expBar && !expBarMobile) {
        console.error('❌ Nessun elemento barra esperienza trovato!');
        return false;
    }
    
    // Calcola valori corretti
    const expNeeded = getExpForNextLevel(state.level);
    const { currentLevelExp } = getLevelFromExp(state.exp);
    const percentage = Math.min(Math.max((currentLevelExp / expNeeded) * 100, 0), 100);
    
    console.log('📏 Calcoli:');
    console.log(`- EXP nel livello corrente: ${currentLevelExp}`);
    console.log(`- EXP necessari per prossimo livello: ${expNeeded}`);
    console.log(`- Percentuale: ${percentage.toFixed(2)}%`);
    
    // Aggiorna barra desktop
    if (expBar) {
        expBar.style.width = `${percentage}%`;
        expBar.style.transition = 'width 0.8s ease-out';
        expBar.offsetHeight; // Forza reflow
        console.log(`✅ Barra desktop aggiornata: ${expBar.style.width}`);
    }
    
    if (expDisplay) {
        expDisplay.textContent = `${currentLevelExp} / ${expNeeded} EXP`;
        console.log(`✅ Display desktop aggiornato: "${expDisplay.textContent}"`);
    }
    
    // Aggiorna barra mobile
    if (expBarMobile) {
        expBarMobile.style.width = `${percentage}%`;
        expBarMobile.style.transition = 'width 0.8s ease-out';
        expBarMobile.offsetHeight; // Forza reflow
        console.log(`✅ Barra mobile aggiornata: ${expBarMobile.style.width}`);
    }
    
    if (expDisplayMobile) {
        expDisplayMobile.textContent = `${currentLevelExp} / ${expNeeded}`;
        console.log(`✅ Display mobile aggiornato: "${expDisplayMobile.textContent}"`);
    }
    
    console.log('✅ Aggiornamento completato!');
    return true;
}

// Funzione per testare aggiunta esperienza
function testAddExp(amount = 25) {
    console.log(`🎯 Test aggiunta di ${amount} EXP...`);
    
    if (!window.gameState || !gameState.isInitialized) {
        console.error('❌ GameState non disponibile');
        return;
    }
    
    const before = {
        level: gameState.playerState.level,
        exp: gameState.playerState.exp
    };
    
    // Aggiungi esperienza
    gameState.addExperience(amount);
    
    const after = {
        level: gameState.playerState.level,
        exp: gameState.playerState.exp
    };
    
    console.log(`📈 Prima: Livello ${before.level}, EXP ${before.exp}`);
    console.log(`📈 Dopo: Livello ${after.level}, EXP ${after.exp}`);
    
    if (after.level > before.level) {
        console.log('🎉 LEVEL UP!');
    }
    
    // Forza aggiornamento
    setTimeout(() => {
        forceUpdateExpBar();
    }, 100);
}

// Funzione per diagnostica completa
function diagnoseExpSystem() {
    console.log('🔍 Diagnostica Sistema Esperienza');
    console.log('================================');
    
    // 1. Controlla gameState
    if (!window.gameState) {
        console.error('❌ window.gameState non esistente');
        return;
    }
    
    if (!gameState.isInitialized) {
        console.error('❌ gameState non inizializzato');
        return;
    }
    
    console.log('✅ GameState OK');
    
    // 2. Controlla funzioni di calcolo
    if (typeof getLevelFromExp !== 'function') {
        console.error('❌ getLevelFromExp non definita');
        return;
    }
    
    if (typeof getExpForNextLevel !== 'function') {
        console.error('❌ getExpForNextLevel non definita');
        return;
    }
    
    console.log('✅ Funzioni di calcolo OK');
    
    // 3. Test calcoli
    const testExp = 150;
    const result = getLevelFromExp(testExp);
    const needed = getExpForNextLevel(result.level);
    
    console.log(`📊 Test calcolo (${testExp} EXP): Livello ${result.level}, EXP corrente ${result.currentLevelExp}, Necessari ${needed}`);
    
    // 4. Controlla elementi DOM
    const elements = {
        'exp-bar': document.getElementById('exp-bar'),
        'exp-display': document.getElementById('exp-display'),
        'exp-bar-mobile': document.getElementById('exp-bar-mobile'),
        'exp-display-mobile': document.getElementById('exp-display-mobile')
    };
    
    console.log('🔍 Elementi DOM:');
    Object.entries(elements).forEach(([name, element]) => {
        console.log(`- ${name}: ${element ? '✅' : '❌'}`);
    });
    
    // 5. Stato corrente
    const state = gameState.playerState;
    console.log(`📊 Stato giocatore: ${state.playerName}, Livello ${state.level}, EXP ${state.exp}`);
    
    console.log('🎯 Usa forceUpdateExpBar() per aggiornare la barra');
    console.log('🎯 Usa testAddExp(25) per testare aggiunta esperienza');
}

// Esegui diagnostica automaticamente
diagnoseExpSystem();

// Prova aggiornamento immediato
forceUpdateExpBar();

// Rendi funzioni disponibili globalmente
window.expBarFix = {
    forceUpdateExpBar,
    testAddExp,
    diagnoseExpSystem
};

console.log('');
console.log('🎮 Funzioni disponibili:');
console.log('- expBarFix.forceUpdateExpBar() - Forza aggiornamento barra');
console.log('- expBarFix.testAddExp(amount) - Testa aggiunta esperienza');
console.log('- expBarFix.diagnoseExpSystem() - Esegui diagnostica completa');
