// === TEST VISIVO BARRA ESPERIENZA ===
// Copia questo nella console del browser per testare la barra

console.log('🎯 Test Visivo Barra Esperienza');
console.log('===============================');

function testVisualExpBar() {
    console.log('🔍 Controllandp elementi della barra esperienza...');
    
    // Cerca tutti gli elementi della barra
    const expBar = document.getElementById('exp-bar');
    const expDisplay = document.getElementById('exp-display');
    const expBarMobile = document.getElementById('exp-bar-mobile');
    const expDisplayMobile = document.getElementById('exp-display-mobile');
    
    console.log('📊 Elementi trovati:');
    console.log('- exp-bar (desktop):', !!expBar);
    console.log('- exp-display (desktop):', !!expDisplay);
    console.log('- exp-bar-mobile:', !!expBarMobile);
    console.log('- exp-display-mobile:', !!expDisplayMobile);
    
    // Se non ci sono elementi, proviamo a creare manualmente
    if (!expBar && !expBarMobile) {
        console.warn('⚠️ Elementi barra non trovati, provo a creare manualmente...');
        createTestExpBar();
        return;
    }
    
    // Test visivo progressivo
    console.log('🎬 Avvio test visivo...');
    
    const percentages = [0, 25, 50, 75, 100];
    let index = 0;
    
    function animateNext() {
        if (index >= percentages.length) {
            console.log('✅ Test visivo completato!');
            return;
        }
        
        const percentage = percentages[index];
        console.log(`📊 Impostando barra al ${percentage}%...`);
        
        // Aggiorna barra desktop
        if (expBar) {
            expBar.style.width = `${percentage}%`;
            expBar.style.transition = 'width 1s ease-out';
        }
        
        // Aggiorna barra mobile
        if (expBarMobile) {
            expBarMobile.style.width = `${percentage}%`;
            expBarMobile.style.transition = 'width 1s ease-out';
        }
        
        // Aggiorna display
        const displayText = `${percentage} / 100 EXP`;
        if (expDisplay) expDisplay.textContent = displayText;
        if (expDisplayMobile) expDisplayMobile.textContent = displayText;
        
        index++;
        setTimeout(animateNext, 1500);
    }
    
    animateNext();
}

function createTestExpBar() {
    console.log('🔧 Creando barra di test...');
    
    // Trova header o crea contenitore
    let header = document.getElementById('header');
    if (!header) {
        header = document.createElement('div');
        header.id = 'test-header';
        header.style.cssText = 'position: fixed; top: 10px; left: 10px; right: 10px; z-index: 9999; background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 10px;';
        document.body.appendChild(header);
    }
    
    // Crea HTML della barra
    const expBarHTML = `
        <div style="margin-bottom: 10px;">
            <h3 style="margin: 0 0 10px 0; color: #FFD700;">🧪 Test Barra Esperienza</h3>
            <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 5px;">
                <span>Esperienza:</span>
                <span id="exp-display-test">0 / 100 EXP</span>
            </div>
            <div style="background: #8B4513; border: 2px solid #4A4A4A; border-radius: 12px; height: 24px; overflow: hidden;">
                <div id="exp-bar-test" style="background: linear-gradient(90deg, #DAA520, #FFD700, #FFFF99); height: 100%; width: 0%; transition: width 0.8s ease-out; border-radius: 8px; position: relative;">
                </div>
            </div>
        </div>
    `;
    
    header.innerHTML = expBarHTML + header.innerHTML;
    
    console.log('✅ Barra di test creata!');
    
    // Test la barra creata
    setTimeout(() => {
        const testBar = document.getElementById('exp-bar-test');
        const testDisplay = document.getElementById('exp-display-test');
        
        if (testBar && testDisplay) {
            console.log('🎬 Test animazione barra...');
            
            const percentages = [0, 30, 60, 100];
            let i = 0;
            
            function animateTest() {
                if (i >= percentages.length) {
                    console.log('✅ Test completato! La barra dovrebbe essere visibile e animata.');
                    return;
                }
                
                const p = percentages[i];
                testBar.style.width = `${p}%`;
                testDisplay.textContent = `${p} / 100 EXP`;
                console.log(`📊 Barra al ${p}%`);
                
                i++;
                setTimeout(animateTest, 1500);
            }
            
            animateTest();
        }
    }, 500);
}

function checkGameStateAndBar() {
    console.log('🔍 Controllo GameState e barra...');
    
    if (!window.gameState || !gameState.isInitialized) {
        console.warn('⚠️ GameState non inizializzato');
        return false;
    }
    
    const state = gameState.playerState;
    console.log(`👤 Giocatore: ${state.playerName}`);
    console.log(`📊 Livello: ${state.level}, EXP: ${state.exp}`);
    
    // Forza aggiornamento usando le funzioni del sistema
    if (window.header) {
        console.log('🔄 Aggiornamento via header...');
        header.update(state);
    }
    
    if (gameState.updateExpBar) {
        console.log('🔄 Aggiornamento via gameState...');
        gameState.updateExpBar();
    }
    
    return true;
}

function fixExpBarNow() {
    console.log('🛠️ Riparazione immediata barra esperienza...');
    
    // Prima controlla se gameState esiste
    if (checkGameStateAndBar()) {
        console.log('✅ Sistema esistente aggiornato');
    }
    
    // Poi esegui test visivo
    setTimeout(() => {
        testVisualExpBar();
    }, 1000);
}

// Esegui riparazione immediata
fixExpBarNow();

// Rendi funzioni disponibili
window.expBarTest = {
    testVisualExpBar,
    createTestExpBar,
    checkGameStateAndBar,
    fixExpBarNow
};

console.log('');
console.log('🎮 Funzioni disponibili:');
console.log('- expBarTest.testVisualExpBar() - Test visivo della barra');
console.log('- expBarTest.createTestExpBar() - Crea barra di test');
console.log('- expBarTest.checkGameStateAndBar() - Controlla sistema');
console.log('- expBarTest.fixExpBarNow() - Riparazione completa');
