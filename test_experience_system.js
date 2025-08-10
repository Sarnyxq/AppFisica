// TEST DEL SISTEMA DI ESPERIENZA
// Esegui questo script nella console del browser per testare il sistema

console.log('🧪 Test del Sistema di Esperienza - Fisica 5.0');
console.log('================================================');

// Test delle funzioni di calcolo esperienza
function testExperienceFunctions() {
    console.log('📊 Test funzioni di calcolo esperienza...');
    
    const tests = [
        { exp: 0, expectedLevel: 1, expectedCurrentExp: 0 },
        { exp: 50, expectedLevel: 1, expectedCurrentExp: 50 },
        { exp: 100, expectedLevel: 2, expectedCurrentExp: 0 },
        { exp: 150, expectedLevel: 2, expectedCurrentExp: 50 },
        { exp: 300, expectedLevel: 3, expectedCurrentExp: 0 },
        { exp: 600, expectedLevel: 4, expectedCurrentExp: 0 },
        { exp: 650, expectedLevel: 4, expectedCurrentExp: 50 }
    ];
    
    tests.forEach(test => {
        const result = getLevelFromExp(test.exp);
        const expNeeded = getExpForNextLevel(result.level);
        
        console.log(`EXP ${test.exp} → Livello ${result.level} (${result.currentLevelExp}/${expNeeded})`);
        
        if (result.level !== test.expectedLevel) {
            console.error(`❌ ERRORE: Livello atteso ${test.expectedLevel}, ottenuto ${result.level}`);
        }
        if (result.currentLevelExp !== test.expectedCurrentExp) {
            console.error(`❌ ERRORE: EXP corrente atteso ${test.expectedCurrentExp}, ottenuto ${result.currentLevelExp}`);
        }
    });
}

// Test dello stato del giocatore
function testPlayerState() {
    console.log('👤 Test stato del giocatore...');
    
    if (window.gameState && gameState.isInitialized) {
        const state = gameState.playerState;
        const debugInfo = gameState.getDebugInfo();
        
        console.log(`Giocatore: ${state.playerName}`);
        console.log(`Livello salvato: ${state.level}`);
        console.log(`Esperienza totale: ${state.exp}`);
        console.log(`Livello calcolato: ${debugInfo.experienceInfo.calculatedLevel}`);
        console.log(`Esperienza livello corrente: ${debugInfo.experienceInfo.currentLevelExp}`);
        console.log(`Esperienza necessaria: ${debugInfo.experienceInfo.expForNextLevel}`);
        
        if (debugInfo.experienceInfo.levelMismatch) {
            console.warn('⚠️ ATTENZIONE: Inconsistenza rilevata nel livello!');
            console.log('🔧 Esegui gameState.repairExperienceSystem() per riparare');
        } else {
            console.log('✅ Sistema esperienza coerente');
        }
    } else {
        console.warn('⚠️ GameState non inizializzato');
    }
}

// Test aggiunta esperienza
function testAddExperience(amount = 50) {
    console.log(`🎯 Test aggiunta ${amount} EXP...`);
    
    if (window.gameState && gameState.isInitialized) {
        const beforeLevel = gameState.playerState.level;
        const beforeExp = gameState.playerState.exp;
        
        console.log(`Prima: Livello ${beforeLevel}, EXP ${beforeExp}`);
        
        gameState.addExperience(amount);
        
        const afterLevel = gameState.playerState.level;
        const afterExp = gameState.playerState.exp;
        
        console.log(`Dopo: Livello ${afterLevel}, EXP ${afterExp}`);
        
        if (afterLevel > beforeLevel) {
            console.log('🎉 Level up!');
        }
        
        // Forza aggiornamento barra
        console.log('🔄 Forzando aggiornamento barra...');
        gameState.updateExpBar();
        if (window.header) {
            header.update(gameState.playerState);
        }
        
    } else {
        console.warn('⚠️ GameState non inizializzato');
    }
}

// Test specifico per la barra dell'esperienza
function testExpBar() {
    console.log('📊 Test specifico barra esperienza...');
    
    if (!window.gameState || !gameState.isInitialized) {
        console.warn('⚠️ GameState non inizializzato');
        return;
    }
    
    const state = gameState.playerState;
    console.log(`Stato corrente: Livello ${state.level}, EXP ${state.exp}`);
    
    // Controlla elementi DOM
    const expBar = document.getElementById('exp-bar');
    const expDisplay = document.getElementById('exp-display');
    
    console.log('Elementi DOM:');
    console.log('- exp-bar:', !!expBar, expBar ? `width: ${expBar.style.width}` : 'N/A');
    console.log('- exp-display:', !!expDisplay, expDisplay ? `text: "${expDisplay.textContent}"` : 'N/A');
    
    if (expBar) {
        const expNeeded = getExpForNextLevel(state.level);
        const { currentLevelExp } = getLevelFromExp(state.exp);
        const percentage = (currentLevelExp / expNeeded) * 100;
        
        console.log('Calcoli:');
        console.log(`- EXP livello corrente: ${currentLevelExp}`);
        console.log(`- EXP necessari: ${expNeeded}`);
        console.log(`- Percentuale: ${percentage.toFixed(1)}%`);
        
        // Forza aggiornamento manuale
        expBar.style.width = `${percentage}%`;
        if (expDisplay) {
            expDisplay.textContent = `${currentLevelExp} / ${expNeeded} EXP`;
        }
        
        console.log('✅ Barra aggiornata manualmente');
    }
}

// Test riparazione sistema
function testRepairSystem() {
    console.log('🔧 Test riparazione sistema...');
    
    if (window.gameState && gameState.isInitialized) {
        const repaired = gameState.repairExperienceSystem();
        if (repaired) {
            console.log('✅ Sistema riparato');
        } else {
            console.log('ℹ️ Sistema già corretto');
        }
    }
}

// Esegui tutti i test
function runAllTests() {
    testExperienceFunctions();
    console.log('');
    testPlayerState();
    console.log('');
    testRepairSystem();
    console.log('');
    testExpBar();
    console.log('');
    console.log('🎮 Test completati! Usa testAddExperience(amount) per testare l\'aggiunta di esperienza');
    console.log('📊 Usa testExpBar() per controllare specificamente la barra dell\'esperienza');
}

// Rendi disponibili le funzioni globalmente
window.testExperience = {
    runAllTests,
    testExperienceFunctions,
    testPlayerState,
    testAddExperience,
    testRepairSystem,
    testExpBar
};

console.log('📝 Funzioni disponibili:');
console.log('- testExperience.runAllTests()');
console.log('- testExperience.testAddExperience(amount)');
console.log('- testExperience.testExpBar()');
console.log('- testExperience.testRepairSystem()');
