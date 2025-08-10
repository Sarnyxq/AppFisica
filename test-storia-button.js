// TEST AUTOMATIZZATO PULSANTE STORIA
// Esegui questo script nella console del browser per testare l'implementazione

console.log('🧪 INIZIO TEST PULSANTE STORIA');
console.log('===============================');

// Test 1: Verifica disponibilità sistemi necessari
console.log('\n📋 Test 1: Verifica Sistemi Necessari');
const systems = {
    storyData: !!window.storyData,
    wingView: !!window.wingView,
    gameState: !!window.gameState,
    castleData: !!window.castleData,
    notificationSystem: !!window.notificationSystem
};

console.table(systems);

if (Object.values(systems).every(Boolean)) {
    console.log('✅ Tutti i sistemi necessari sono disponibili');
} else {
    console.log('❌ Alcuni sistemi mancano - il test potrebbe fallire');
}

// Test 2: Verifica funzione hasStoryContent
console.log('\n📋 Test 2: Verifica hasStoryContent()');
if (window.wingView && typeof wingView.hasStoryContent === 'function') {
    console.log('✅ Funzione hasStoryContent() trovata');
    
    // Test con alcune sfide
    const testChallenges = [1, 2, 3, 4, 5];
    testChallenges.forEach(challengeId => {
        const hasStory = wingView.hasStoryContent(challengeId);
        const storyContent = window.storyData ? storyData.getStoryForChallenge(challengeId) : null;
        console.log(`Sfida ${challengeId}: hasStory=${hasStory}, storyContent=`, storyContent);
    });
} else {
    console.log('❌ Funzione hasStoryContent() non trovata');
}

// Test 3: Verifica presenza pulsanti Storia
console.log('\n📋 Test 3: Verifica Pulsanti Storia nel DOM');
const storyButtons = document.querySelectorAll('.story-review-btn');
console.log(`Pulsanti Storia trovati: ${storyButtons.length}`);

storyButtons.forEach((btn, index) => {
    console.log(`Pulsante ${index + 1}:`, {
        challengeId: btn.dataset.challengeId,
        storyAvailable: btn.dataset.storyAvailable,
        visible: !btn.classList.contains('hidden'),
        disabled: btn.disabled,
        text: btn.textContent.trim()
    });
});

// Test 4: Verifica modal HTML
console.log('\n📋 Test 4: Verifica Modal HTML');
const modal = document.getElementById('story-review-modal');
const modalElements = {
    modal: !!modal,
    closeBtn: !!document.getElementById('story-review-close-btn'),
    closeFooterBtn: !!document.getElementById('story-review-close-footer-btn'),
    title: !!document.getElementById('story-review-title'),
    subtitle: !!document.getElementById('story-review-subtitle'),
    content: !!document.getElementById('story-review-content'),
    icon: !!document.getElementById('story-review-icon')
};

console.table(modalElements);

// Test 5: Test funzionalità modal (se ci sono pulsanti)
console.log('\n📋 Test 5: Test Funzionalità Modal');
if (storyButtons.length > 0) {
    const testBtn = storyButtons[0];
    console.log('Testando primo pulsante Storia...');
    
    try {
        // Simula click
        testBtn.click();
        
        setTimeout(() => {
            const isModalVisible = modal && !modal.classList.contains('hidden');
            console.log('Modal aperto:', isModalVisible);
            
            if (isModalVisible) {
                console.log('✅ Modal si apre correttamente');
                
                // Test chiusura con ESC
                const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                document.dispatchEvent(escEvent);
                
                setTimeout(() => {
                    const isModalClosed = modal.classList.contains('hidden');
                    console.log('Modal chiuso con ESC:', isModalClosed);
                    console.log(isModalClosed ? '✅ Chiusura ESC funziona' : '❌ Chiusura ESC non funziona');
                }, 100);
            }
        }, 100);
        
    } catch (error) {
        console.log('❌ Errore durante test pulsante:', error);
    }
} else {
    console.log('⚠️ Nessun pulsante Storia trovato per il test');
}

// Test 6: Verifica CSS applicati
console.log('\n📋 Test 6: Verifica CSS');
const cssClasses = [
    'story-review-btn',
    'story-review-section',
    'story-review-chapter-title',
    'story-review-text'
];

cssClasses.forEach(className => {
    const hasRule = Array.from(document.styleSheets).some(sheet => {
        try {
            return Array.from(sheet.cssRules || []).some(rule => 
                rule.selectorText && rule.selectorText.includes(className)
            );
        } catch (e) {
            return false;
        }
    });
    console.log(`CSS .${className}:`, hasRule ? '✅ Presente' : '❌ Mancante');
});

// Test 7: Test responsive
console.log('\n📋 Test 7: Verifica Responsive');
const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
    isDesktop: window.innerWidth > 1024
};

console.table(viewport);

// Riepilogo finale
console.log('\n🎯 RIEPILOGO TEST');
console.log('==================');
console.log('1. Sistemi necessari:', Object.values(systems).every(Boolean) ? '✅' : '❌');
console.log('2. hasStoryContent():', typeof wingView?.hasStoryContent === 'function' ? '✅' : '❌');
console.log('3. Pulsanti Storia:', storyButtons.length > 0 ? '✅' : '❌');
console.log('4. Modal HTML:', Object.values(modalElements).every(Boolean) ? '✅' : '❌');
console.log('5. Responsive ready:', viewport.width > 0 ? '✅' : '❌');

console.log('\n🧪 TEST COMPLETATO');
console.log('Per test manuali aggiuntivi:');
console.log('- Completa una sfida per vedere i pulsanti Storia');
console.log('- Testa apertura/chiusura modal su dispositivi diversi');
console.log('- Verifica animazioni e transizioni');
