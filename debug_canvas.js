// === DEBUG CANVAS MODALS ===
// Script per testare il comportamento del canvas nelle sfide multiple

console.log('🔧 Canvas Debug Utils Loaded');

window.canvasDebug = {
    // Testa l'apertura di sfide multiple
    testMultipleChallenges() {
        console.log('🧪 Test apertura sfide multiple...');
        
        // Apri prima sfida
        console.log('1️⃣ Apertura sfida "misure"');
        modals.openChallengeModal('misure');
        
        setTimeout(() => {
            console.log('2️⃣ Chiusura prima sfida');
            modals.closeChallengeModal();
            
            setTimeout(() => {
                console.log('3️⃣ Apertura seconda sfida "errori"');
                modals.openChallengeModal('errori');
                
                setTimeout(() => {
                    console.log('4️⃣ Switch al tab disegno');
                    const drawingTab = document.getElementById('drawing-tab-btn');
                    if (drawingTab) {
                        drawingTab.click();
                        console.log('✅ Test completato - verifica il canvas!');
                    }
                }, 500);
            }, 500);
        }, 2000);
    },
    
    // Forza reinizializzazione canvas
    forceCanvasReset() {
        console.log('🔄 Forzatura reset canvas...');
        if (window.canvasComponent) {
            canvasComponent.isInitialized = false;
            const container = document.getElementById('canvas-container');
            if (container) {
                container.innerHTML = '';
                canvasComponent.init();
                console.log('✅ Canvas resettato');
            }
        }
    },
    
    // Mostra informazioni canvas
    canvasInfo() {
        if (!window.canvasComponent) {
            console.log('❌ CanvasComponent non disponibile');
            return;
        }
        
        console.log('📊 Informazioni Canvas:');
        console.log('- Inizializzato:', canvasComponent.isInitialized);
        console.log('- Canvas elemento:', !!canvasComponent.canvas);
        console.log('- Dimensioni canvas:', canvasComponent.canvas ? 
            `${canvasComponent.canvas.width}x${canvasComponent.canvas.height}` : 'N/A');
        console.log('- Dimensioni CSS:', canvasComponent.canvas ? 
            `${canvasComponent.canvas.style.width} x ${canvasComponent.canvas.style.height}` : 'N/A');
        console.log('- Container:', !!document.getElementById('canvas-container'));
        console.log('- Modale attivo:', !!document.querySelector('.challenge-fullscreen:not(.hidden)'));
    },
    
    // Testa tab switching
    testTabSwitching() {
        console.log('🔄 Test switching tabs...');
        
        const textTab = document.getElementById('text-tab-btn');
        const drawingTab = document.getElementById('drawing-tab-btn');
        
        if (!textTab || !drawingTab) {
            console.log('❌ Tab non trovati');
            return;
        }
        
        console.log('1️⃣ Switch a testo');
        textTab.click();
        
        setTimeout(() => {
            console.log('2️⃣ Switch a disegno');
            drawingTab.click();
            
            setTimeout(() => {
                this.canvasInfo();
            }, 500);
        }, 1000);
    }
};

// Funzioni rapide
window.testCanvas = () => canvasDebug.testMultipleChallenges();
window.resetCanvas = () => canvasDebug.forceCanvasReset();
window.canvasInfo = () => canvasDebug.canvasInfo();

console.log('');
console.log('🎮 Comandi disponibili:');
console.log('- testCanvas() - Testa apertura sfide multiple');
console.log('- resetCanvas() - Forza reset canvas');
console.log('- canvasInfo() - Mostra info canvas');
console.log('- canvasDebug.testTabSwitching() - Testa switch tab');
