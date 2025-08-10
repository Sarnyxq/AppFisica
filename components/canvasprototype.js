// canvas.js - Gestione del canvas per il disegno
function setupCanvas() {
    const canvas = document.getElementById('arcane-canvas');
    const eraserCursor = document.getElementById('eraser-cursor');
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let isErasing = false;

    const penBtn = document.getElementById('tool-pen');
    const eraserBtn = document.getElementById('tool-eraser');
    const colorPicker = document.getElementById('tool-color');
    const thicknessSlider = document.getElementById('tool-thickness');
    const clearBtn = document.getElementById('tool-clear');

    // Sistema di memoria separata per le dimensioni
    let penThickness = 3; // Dimensione predefinita penna
    let eraserThickness = 10; // Dimensione predefinita gomma (mappata nel range 10-48px)
    let skipNextRestore = false; // Evita che un resize reimporti il vecchio disegno dopo clear
    
    // Inizializza lo slider con la dimensione della penna
    thicknessSlider.value = penThickness;

    // --- Sistema di ridimensionamento dinamico reattivo ---
    function resizeCanvas() {
        const container = canvas.parentElement;
        
        // Assicurati che il container sia visibile e abbia dimensioni
        if (!container || !container.offsetWidth || !container.offsetHeight) {
            return;
        }
        
        // Salva contenuto precedente
        const prev = canvas.width && canvas.height && canvas.width > 0 && canvas.height > 0 ? canvas.toDataURL() : null;
        
        // Usa getBoundingClientRect per dimensioni precise
        const containerRect = container.getBoundingClientRect();
        const padding = 4; // Padding interno del container
        const width = Math.max(Math.floor(containerRect.width - padding), 100);
        const height = Math.max(Math.floor(containerRect.height - padding), 100);
        
        const dpr = window.devicePixelRatio || 1;
        
        // Aggiorna sempre il canvas per assicurarsi che segua il contenitore
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        // Ridimensiona il buffer solo se necessario
        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            
            // Reset e scaling
            ctx.setTransform(1,0,0,1,0,0);
            ctx.scale(dpr, dpr);
            ctx.imageSmoothingEnabled = false;
            
            // Ripristina contenuto precedente
            if (prev && prev !== 'data:,' && !skipNextRestore) {
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, width, height);
                };
                img.src = prev;
            } else if (skipNextRestore) {
                // Consumiamo il flag per i prossimi resize
                skipNextRestore = false;
            }
        }
    }
    window.__resizeArcaneCanvas = resizeCanvas;
    
    // Observer sul container con debounce
    let resizeTimeout;
    const resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            requestAnimationFrame(resizeCanvas);
        }, 10);
    });
    resizeObserver.observe(canvas.parentElement);
    
    // Mutation observer per cambiamenti di visibilità più preciso
    const mutationObserver = new MutationObserver((mutations) => {
        let shouldResize = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes') {
                const target = mutation.target;
                if (target.id === 'content-draw' && mutation.attributeName === 'class') {
                    if (!target.classList.contains('hidden')) {
                        shouldResize = true;
                    }
                }
            }
        });
        if (shouldResize) {
            setTimeout(() => requestAnimationFrame(resizeCanvas), 50);
        }
    });
    mutationObserver.observe(document.getElementById('content-draw'), { 
        attributes: true, 
        attributeFilter: ['class'] 
    });
    
    // Event listener su finestra con debounce
    let windowResizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(windowResizeTimeout);
        windowResizeTimeout = setTimeout(() => {
            requestAnimationFrame(resizeCanvas);
        }, 100);
    });
    
    // Inizializzazione più robusta
    let initRetries = 0;
    function initializeCanvas() {
        if (canvas.parentElement && canvas.parentElement.offsetWidth > 0) {
            resizeCanvas();
        } else if (initRetries < 30) {
            initRetries++;
            setTimeout(initializeCanvas, 50);
        }
    }
    initializeCanvas();
    // --- FINE FIX 3 ---
    
    function getPos(evt) {
        const rect = canvas.getBoundingClientRect();
        const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
        const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
        // Con ctx scalato al DPR, usiamo coordinate CSS dirette
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function start(e) {
        e.preventDefault();
        drawing = true;
        ctx.beginPath();
        const pos = getPos(e);
        ctx.moveTo(pos.x, pos.y);
    }

    function stop() {
        if (drawing) {
            drawing = false;
        }
    }

    function draw(e) {
        if (!drawing) return;
        e.preventDefault();
        const pos = getPos(e);
        
        // Aggiorna la posizione del cursore gomma durante il disegno
        if (isErasing) {
            updateEraserCursor(e);
        }
        
        // Calcola la dimensione appropriata in base al tool
        let lineWidth;
        if (isErasing) {
            // Per la gomma usa il range esteso (10-48px)
            const sliderValue = parseInt(thicknessSlider.value);
            const minEraserSize = 10;
            const maxEraserSize = 48;
            const sliderMin = parseInt(thicknessSlider.min);
            const sliderMax = parseInt(thicknessSlider.max);
            const normalizedValue = (sliderValue - sliderMin) / (sliderMax - sliderMin);
            lineWidth = minEraserSize + (normalizedValue * (maxEraserSize - minEraserSize));
        } else {
            // Per la penna usa il valore diretto dello slider
            lineWidth = thicknessSlider.value;
        }
        
        ctx.lineWidth = lineWidth;
        ctx.lineCap = isErasing ? 'square' : 'round';
        ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
        ctx.strokeStyle = isErasing ? 'rgba(0,0,0,1)' : colorPicker.value;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }

    function updateEraserCursor(e) {
        if (isErasing) {
            // Verifica che il mouse sia sopra il canvas
            const rect = canvas.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right && 
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                
                // Scala la dimensione della gomma: minimo 10px, massimo 48px
                const sliderValue = parseInt(thicknessSlider.value);
                const minEraserSize = 10;
                const maxEraserSize = 48;
                const sliderMin = parseInt(thicknessSlider.min);
                const sliderMax = parseInt(thicknessSlider.max);
                
                // Mappa il valore dello slider al range della gomma
                const normalizedValue = (sliderValue - sliderMin) / (sliderMax - sliderMin);
                const eraserSize = minEraserSize + (normalizedValue * (maxEraserSize - minEraserSize));
                
                eraserCursor.style.left = `${e.pageX - eraserSize/2}px`;
                eraserCursor.style.top = `${e.pageY - eraserSize/2}px`;
                eraserCursor.style.width = `${eraserSize}px`;
                eraserCursor.style.height = `${eraserSize}px`;
                eraserCursor.classList.remove('hidden');
            } else {
                hideEraserCursor();
            }
        } else {
            hideEraserCursor();
        }
    }

    function hideEraserCursor() {
        eraserCursor.classList.add('hidden');
    }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mouseup', (e) => {
        stop();
        if (isErasing) {
            // Aggiorna la posizione del cursore dopo aver rilasciato il mouse
            updateEraserCursor(e);
        }
    });
    canvas.addEventListener('mousemove', (e) => {
        draw(e);
        // Aggiorna il cursore anche quando non stiamo disegnando
        if (!drawing && isErasing) {
            updateEraserCursor(e);
        }
    });
    canvas.addEventListener('mouseout', () => {
        stop();
        hideEraserCursor();
    });
    canvas.addEventListener('mouseleave', hideEraserCursor);

    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchend', (e) => {
        stop();
        hideEraserCursor(); // Nascondi sempre il cursore sui dispositivi touch
    });
    canvas.addEventListener('touchmove', draw, { passive: false });
    
    // Surface Pen support - Rilevamento automatico della gomma
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerout', handlePointerOut);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    
    // Variabile per tracciare lo stato precedente della penna
    let previousPenState = null;
    
    function handlePointerDown(e) {
        // Rileva se stiamo usando la parte posteriore della penna (gomma)
        const isEraserEnd = e.pointerType === 'pen' && e.buttons === 32; // Eraser button
        const isPenTip = e.pointerType === 'pen' && e.buttons === 1; // Pen tip
        
        if (isEraserEnd && !isErasing) {
            // Passa automaticamente alla modalità gomma
            previousPenState = 'pen';
            penThickness = parseInt(thicknessSlider.value); // Salva dimensione penna
            switchToEraser();
        } else if (isPenTip && isErasing && previousPenState === 'pen') {
            // Torna alla modalità penna quando usi la punta
            eraserThickness = parseInt(thicknessSlider.value); // Salva dimensione gomma
            switchToPen();
            previousPenState = null;
        }
        
        // Chiama la funzione start normale
        start(e);
    }
    
    function handlePointerMove(e) {
        const isEraserEnd = e.pointerType === 'pen' && e.buttons === 32;
        const isPenTip = e.pointerType === 'pen' && e.buttons === 1;
        
        // Aggiorna lo stato se necessario durante il movimento
        if (isEraserEnd && !isErasing) {
            previousPenState = 'pen';
            penThickness = parseInt(thicknessSlider.value); // Salva dimensione penna
            switchToEraser();
        } else if (isPenTip && isErasing && previousPenState === 'pen') {
            eraserThickness = parseInt(thicknessSlider.value); // Salva dimensione gomma
            switchToPen();
            previousPenState = null;
        }
        
        // Aggiorna cursore gomma se attivo
        if (isErasing) {
            updateEraserCursor(e);
        }
        
        // Chiama la funzione draw normale
        draw(e);
    }
    
    function handlePointerUp(e) {
        stop();
        if (isErasing) {
            // Aggiorna la posizione del cursore dopo aver rilasciato la penna
            updateEraserCursor(e);
        }
    }
    
    function handlePointerOut(e) {
        stop();
        hideEraserCursor();
    }
    
    function handlePointerLeave(e) {
        hideEraserCursor();
    }
    
    function switchToEraser() {
        isErasing = true;
        canvas.classList.add('canvas-erasing');
        eraserBtn.style.backgroundColor = '#DAA520'; // Evidenzia il pulsante gomma
        penBtn.style.backgroundColor = '#8B4513'; // Reset pulsante penna
        
        // Aggiorna lo slider con la dimensione della gomma
        thicknessSlider.value = eraserThickness;
        updateEraserCursorSize();
    }
    
    function switchToPen() {
        isErasing = false;
        canvas.classList.remove('canvas-erasing');
        hideEraserCursor();
        penBtn.style.backgroundColor = '#DAA520'; // Evidenzia il pulsante penna
        eraserBtn.style.backgroundColor = '#8B4513'; // Reset pulsante gomma
        
        // Aggiorna lo slider con la dimensione della penna
        thicknessSlider.value = penThickness;
    }
    
    // Event listener per il movimento del mouse globale (per la gomma)
    canvas.addEventListener('pointermove', (e) => {
        if (!drawing && isErasing) {
            updateEraserCursor(e);
        }
    });
    document.body.addEventListener('mousemove', updateEraserCursor);
    document.body.addEventListener('mouseleave', hideEraserCursor);

    penBtn.addEventListener('click', () => {
        // Salva la dimensione corrente della gomma se stiamo passando dalla gomma
        if (isErasing) {
            eraserThickness = parseInt(thicknessSlider.value);
        }
        
        isErasing = false;
        canvas.classList.remove('canvas-erasing');
        hideEraserCursor(); // Nascondi sempre il cursore quando passi alla penna
        // Aggiorna lo stile dei pulsanti
        penBtn.style.backgroundColor = '#DAA520';
        eraserBtn.style.backgroundColor = '#8B4513';
        
        // Ripristina la dimensione della penna
        thicknessSlider.value = penThickness;
    });
    
    eraserBtn.addEventListener('click', () => {
        // Salva la dimensione corrente della penna se stiamo passando dalla penna
        if (!isErasing) {
            penThickness = parseInt(thicknessSlider.value);
        }
        
        isErasing = true;
        canvas.classList.add('canvas-erasing');
        updateEraserCursorSize();
        // Aggiorna lo stile dei pulsanti
        eraserBtn.style.backgroundColor = '#DAA520';
        penBtn.style.backgroundColor = '#8B4513';
        
        // Ripristina la dimensione della gomma
        thicknessSlider.value = eraserThickness;
    });
    
    thicknessSlider.addEventListener('input', () => {
        // Aggiorna la memoria del tool attivo quando cambi la dimensione
        if (isErasing) {
            eraserThickness = parseInt(thicknessSlider.value);
            updateEraserCursorSize();
        } else {
            penThickness = parseInt(thicknessSlider.value);
        }
    });
    
    function updateEraserCursorSize() {
        if (isErasing) {
            // Scala la dimensione della gomma: minimo 10px, massimo 48px
            const sliderValue = parseInt(thicknessSlider.value);
            const minEraserSize = 10;
            const maxEraserSize = 48;
            const sliderMin = parseInt(thicknessSlider.min);
            const sliderMax = parseInt(thicknessSlider.max);
            
            // Mappa il valore dello slider al range della gomma
            const normalizedValue = (sliderValue - sliderMin) / (sliderMax - sliderMin);
            const eraserSize = minEraserSize + (normalizedValue * (maxEraserSize - minEraserSize));
            
            eraserCursor.style.width = `${eraserSize}px`;
            eraserCursor.style.height = `${eraserSize}px`;
            // Aggiorna la posizione per mantenere il centro
            const currentLeft = parseInt(eraserCursor.style.left) || 0;
            const currentTop = parseInt(eraserCursor.style.top) || 0;
            eraserCursor.style.left = `${currentLeft}px`;
            eraserCursor.style.top = `${currentTop}px`;
        }
    }

    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Funzione globale per reset completo prima di un nuovo sigillo
    window.__clearArcaneCanvas = function(forceSkipRestore = true) {
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        // Reset completo del buffer (assorbe anche eventuali stati compositing)
        const w = canvas.width; const h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        // Forza anche reset dimensionale per pulizia garantita
        ctx.restore();
        if (forceSkipRestore) skipNextRestore = true;
    };
}
