// TEST SCRIPT - Reset Functionality
// Script per testare le funzionalità di reset implementate

console.log('🧪 Test delle funzionalità di Reset - Fisica 5.0');

// Test di base del sistema
function runBasicTests() {
    console.log('\n=== TEST BASE ===');
    
    // Test 1: Verifica esistenza moduli
    console.log('1. Verifica moduli...');
    const modules = {
        storageManager: window.storageManager,
        gameState: window.gameState,
        settingsModal: window.settingsModal
    };
    
    Object.entries(modules).forEach(([name, module]) => {
        if (module) {
            console.log(`✅ ${name} - OK`);
        } else {
            console.log(`❌ ${name} - MANCANTE`);
        }
    });
    
    // Test 2: Verifica funzioni reset
    console.log('\n2. Verifica funzioni reset...');
    
    if (window.storageManager) {
        if (typeof storageManager.resetProgress === 'function') {
            console.log('✅ storageManager.resetProgress - OK');
        } else {
            console.log('❌ storageManager.resetProgress - MANCANTE');
        }
        
        if (typeof storageManager.clearAllData === 'function') {
            console.log('✅ storageManager.clearAllData - OK');
        } else {
            console.log('❌ storageManager.clearAllData - MANCANTE');
        }
    }
    
    if (window.gameState) {
        if (typeof gameState.resetProgressOnly === 'function') {
            console.log('✅ gameState.resetProgressOnly - OK');
        } else {
            console.log('❌ gameState.resetProgressOnly - MANCANTE');
        }
        
        if (typeof gameState.createBackup === 'function') {
            console.log('✅ gameState.createBackup - OK');
        } else {
            console.log('❌ gameState.createBackup - MANCANTE');
        }
    }
}

// Test UI elements
function testUIElements() {
    console.log('\n=== TEST ELEMENTI UI ===');
    
    // Test 1: Pulsante impostazioni
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        console.log('✅ Pulsante impostazioni trovato');
    } else {
        console.log('❌ Pulsante impostazioni non trovato');
    }
    
    // Test 2: Container notifiche
    const notificationArea = document.getElementById('notification-area');
    if (notificationArea) {
        console.log('✅ Area notifiche trovata');
    } else {
        console.log('❌ Area notifiche non trovata');
    }
}

// Test creazione dati di test
function createTestData() {
    console.log('\n=== CREAZIONE DATI TEST ===');
    
    if (window.gameState && gameState.playerState) {
        // Simula alcuni progressi
        gameState.playerState.level = 3;
        gameState.playerState.exp = 250;
        gameState.playerState.completedChallenges = ['challenge1', 'challenge2'];
        gameState.playerState.badges = ['first_steps', 'quick_learner'];
        
        gameState.save();
        console.log('✅ Dati di test creati');
        console.log('   - Livello: 3');
        console.log('   - Esperienza: 250');
        console.log('   - Sfide completate: 2');
        console.log('   - Badge: 2');
    } else {
        console.log('❌ Impossibile creare dati di test');
    }
}

// Test backup
function testBackup() {
    console.log('\n=== TEST BACKUP ===');
    
    if (window.gameState && typeof gameState.createBackup === 'function') {
        try {
            const result = gameState.createBackup();
            if (result) {
                console.log('✅ Backup creato con successo');
            } else {
                console.log('❌ Errore nella creazione del backup');
            }
        } catch (error) {
            console.log('❌ Errore nel test backup:', error);
        }
    } else {
        console.log('❌ Funzione backup non disponibile');
    }
}

// Test completo
function runAllTests() {
    console.log('🚀 Avvio test completi...\n');
    
    runBasicTests();
    testUIElements();
    createTestData();
    testBackup();
    
    console.log('\n✨ Test completati!');
    console.log('\n📋 Per testare manualmente:');
    console.log('1. Apri le impostazioni (⚙️)');
    console.log('2. Scorri fino a "Reset e Gestione Dati"');
    console.log('3. Prova "Reset Progressi" per test sicuro');
    console.log('4. Verifica che il backup sia scaricato');
    console.log('5. Controlla che solo i progressi siano resettati');
}

// Funzioni di utility per debug
window.debugReset = {
    runTests: runAllTests,
    createTestData: createTestData,
    testBackup: testBackup,
    
    // Utility per ispezionare i dati
    showCurrentData: function() {
        console.log('📊 DATI ATTUALI:');
        if (window.gameState) {
            console.log('GameState:', gameState.playerState);
        }
        if (window.storageManager) {
            console.log('Storage debug:', storageManager.getDebugInfo());
        }
    },
    
    // Reset sicuro per test (senza conferme)
    unsafeReset: function() {
        console.warn('⚠️ RESET NON SICURO PER TEST');
        if (window.storageManager) {
            storageManager.resetProgress();
            console.log('✅ Reset completato');
            setTimeout(() => location.reload(), 1000);
        }
    }
};

// Esegui test automaticamente se in dev mode
if (localStorage.getItem('dev_mode') === 'true') {
    setTimeout(runAllTests, 2000);
}

console.log('💡 Usa debugReset.runTests() per avviare i test');
console.log('💡 Usa debugReset.showCurrentData() per vedere i dati attuali');
