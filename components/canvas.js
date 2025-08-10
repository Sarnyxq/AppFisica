// Sostituito intero file con implementazione a classe compatibile con modals.js
class CanvasComponent {
    constructor() {
        this.canvas = null; this.ctx = null; this.isDrawing = false; this.isEraser = false; this.lastX = 0; this.lastY = 0; this.isInitialized = false;
        this.tools = { pen: { size: 3, color: '#4a3c28' }, eraser: { baseSize: 10, maxSize: 48, size: 14 } };
        this.penThickness = 3; this.eraserThicknessSliderValue = 10; // slider values (memorizzati separatamente)
        this._resizeObserver = null; this._mutationObserver = null; this._windowResizeTO = null; this._initRetries = 0;
        this._autoSwitched = false; // traccia se passaggio a gomma avvenuto automaticamente
    }
    init() {
        if (this.isInitialized) return true;
        const container = document.getElementById('canvas-container');
        if (!container) { console.error('[Canvas] container non trovato'); return false; }
        container.innerHTML = this.render();
        this.canvas = container.querySelector('#drawing-canvas');
        if (!this.canvas) { console.error('[Canvas] canvas mancante'); return false; }
        this.ctx = this.canvas.getContext('2d');
        this.bindUI(container);
        this.setupObservers();
        this.smartResize(); // primo resize
        this.isInitialized = true;
        return true;
    }
    render() {
        return `
            <div class="canvas-tools mb-3 flex flex-wrap gap-3 items-center">
                <div class="flex items-center gap-2">
                    <button id="pen-tool" class="tool-button active px-3 py-1 rounded bg-gold/30">✏️ Penna</button>
                    <button id="eraser-tool" class="tool-button px-3 py-1 rounded bg-pergamena-dark">🧽 Gomma</button>
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-xs font-semibold">Colore</label>
                    <input type="color" id="color-picker" value="#4a3c28" class="w-10 h-8 border-2 border-ink-light rounded" />
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-xs font-semibold">Spessore</label>
                    <input type="range" id="size-picker" min="1" max="32" value="3" class="w-28" />
                    <span id="size-display" class="text-xs text-ink-light">3px</span>
                </div>
                <div class="flex items-center gap-2">
                    <button id="clear-canvas-btn" class="btn-secondary px-3 py-1 text-xs rounded">🗑️ Pulisci</button>
                    <button id="save-canvas-btn" class="btn-primary px-3 py-1 text-xs rounded">💾 Salva</button>
                </div>
            </div>
            <div class="relative w-full h-full" style="min-height:55vh;">
                <canvas id="drawing-canvas" class="border-2 border-ink rounded bg-white w-full h-full block" style="touch-action:none;"></canvas>
            </div>`;
    }
    // --- Osservatori e resize avanzato ---
    setupObservers() {
        // ResizeObserver sul parent
        const parent = this.canvas.parentElement;
        if (parent && !this._resizeObserver) {
            this._resizeObserver = new ResizeObserver(() => { this.debouncedSmartResize(15); });
            this._resizeObserver.observe(parent);
        }
        // MutationObserver (se contenitore nascosto/mostrato)
        if (!this._mutationObserver) {
            this._mutationObserver = new MutationObserver(muts => {
                let show = false;
                muts.forEach(m => { if (m.type === 'attributes' && m.target.classList && !m.target.classList.contains('hidden')) show = true; });
                if (show) setTimeout(() => this.smartResize(), 50);
            });
            // osserva l'intero container principale del modal
            const modalBody = document.querySelector('.challenge-body');
            if (modalBody) this._mutationObserver.observe(modalBody, { attributes:true, attributeFilter:['class'], subtree:true });
        }
        // Window resize
        window.addEventListener('resize', () => this.debouncedSmartResize(120));
        // Inizializzazione ritentata se dimensioni 0
        if (this.canvas.parentElement?.offsetWidth === 0 && this._initRetries < 30) {
            this._initRetries++;
            setTimeout(() => this.smartResize(), 80);
        }
        // Espone funzione globale
        window.__resizeArcaneCanvas = () => this.smartResize(true);
        window.__clearArcaneCanvas = (skipRestore=true) => this.clear(true, skipRestore);
    }
    debouncedSmartResize(delay=30){ clearTimeout(this._resizeTO); this._resizeTO = setTimeout(()=>this.smartResize(), delay); }
    smartResize(force=false){ if(!this.canvas) return; const parent=this.canvas.parentElement; if(!parent) return; const rect=parent.getBoundingClientRect(); if(!rect.width||rect.width<10){ if(this._initRetries<30){ this._initRetries++; setTimeout(()=>this.smartResize(),100);} return;} this.resize(rect, force); }
    resize(rectOverride=null, force=false) {
        if (!this.canvas) return;
        const rect = rectOverride || this.canvas.parentElement.getBoundingClientRect();
        const widthCSS = rect.width;
        const minH = Math.max(rect.height, window.innerHeight * 0.55, 300);
        const dpr = window.devicePixelRatio || 1;
        const targetW = Math.round(widthCSS);
        const targetH = Math.round(minH);
        const need = force || (this.canvas.width !== targetW * dpr || this.canvas.height !== targetH * dpr);
        let prev = null;
        if (need && this.canvas.width && this.canvas.height) {
            try { prev = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height); } catch(e) { prev = null; }
        }
        this.canvas.style.width = targetW + 'px';
        this.canvas.style.height = targetH + 'px';
        if (need) {
            this.canvas.width = targetW * dpr; this.canvas.height = targetH * dpr;
            this.ctx.setTransform(1,0,0,1,0,0); this.ctx.scale(dpr,dpr); this.ctx.imageSmoothingEnabled = false;
            if (prev) try { this.ctx.putImageData(prev,0,0); } catch(e) {}
            this.applyToolSettings();
        }
    }
    bindUI(root) {
        const penBtn = root.querySelector('#pen-tool'); const eraserBtn = root.querySelector('#eraser-tool');
        this.colorPicker = root.querySelector('#color-picker'); this.sizePicker = root.querySelector('#size-picker'); this.sizeDisplay = root.querySelector('#size-display');
        const clearBtn = root.querySelector('#clear-canvas-btn'); const saveBtn = root.querySelector('#save-canvas-btn');
        penBtn?.addEventListener('click', () => this.selectTool('pen'));
        eraserBtn?.addEventListener('click', () => this.selectTool('eraser'));
        this.colorPicker?.addEventListener('input', e => this.changeColor(e.target.value));
        this.sizePicker?.addEventListener('input', e => this.onSizeChange(parseInt(e.target.value)));
        clearBtn?.addEventListener('click', () => this.clear());
        saveBtn?.addEventListener('click', () => this.exportImage());
        // mouse / touch
        this.canvas.addEventListener('mousedown', e => this.start(e));
        this.canvas.addEventListener('mousemove', e => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stop());
        this.canvas.addEventListener('mouseleave', () => this.stop());
        this.canvas.addEventListener('touchstart', e => this.start(e), { passive:false });
        this.canvas.addEventListener('touchmove', e => this.draw(e), { passive:false });
        this.canvas.addEventListener('touchend', () => this.stop());
        // pointer (Surface Pen auto-switch)
        this.canvas.addEventListener('pointerdown', e => this.handlePointerDown(e));
        this.canvas.addEventListener('pointermove', e => this.handlePointerMove(e));
        this.canvas.addEventListener('pointerup', () => this.handlePointerUp());
        this.canvas.addEventListener('pointerleave', () => this.handlePointerLeave());
        // global for eraser cursor tracking
        document.body.addEventListener('mousemove', e => { this.updateEraserCursor(e); this.updatePenCursor(e); });
        document.body.addEventListener('pointermove', e => { this.updateEraserCursor(e); this.updatePenCursor(e); }); // aggiunto per penna
        document.body.addEventListener('mouseleave', () => { this.hideEraserCursor(); this.hidePenCursor(); });
        this.applyToolSettings();
        this.syncSizeControls();
        this.ensureEraserCursorElement(); // crea icona gomma quadrata se manca
        this.ensurePenCursorElement(); // crea icona penna rotonda se manca
    }
    // --- Tool & drawing logic ---
    applyToolSettings(){ if(!this.ctx) return; this.ctx.lineCap='round'; this.ctx.lineJoin='round'; this.ctx.strokeStyle=this.tools.pen.color; this.ctx.globalCompositeOperation=this.isEraser?'destination-out':'source-over'; this.ctx.lineWidth=this.isEraser?this.computeEraserSize():this.penThickness; }
    onSizeChange(val){ if(this.isEraser){ this.eraserThicknessSliderValue = val; this.updateEraserCursorSize(); } else { this.penThickness = val; this.updatePenCursorSize(); } this.applyToolSettings(); this.updateSizeDisplay(); this.updateEraserCursor(); this.updatePenCursor(); }
    computeEraserSize(){ const min=this.tools.eraser.baseSize; const max=this.tools.eraser.maxSize; const sliderMin=parseInt(this.sizePicker.min||'1'); const sliderMax=parseInt(this.sizePicker.max||'32'); const norm=(this.eraserThicknessSliderValue-sliderMin)/(sliderMax-sliderMin); return Math.round(min + norm*(max-min)); }
    getPos(e){ const rect=this.canvas.getBoundingClientRect(); const p=e.touches?e.touches[0]:e; return { x: p.clientX-rect.left, y: p.clientY-rect.top }; }
    start(e){ e.preventDefault(); this.isDrawing=true; const p=this.getPos(e); this.lastX=p.x; this.lastY=p.y; }
    draw(e){ if(!this.isDrawing) { if(this.isEraser) this.updateEraserCursor(e); else this.updatePenCursor(e); return; } e.preventDefault(); const p=this.getPos(e); this.ctx.beginPath(); this.ctx.moveTo(this.lastX,this.lastY); this.ctx.lineTo(p.x,p.y); this.ctx.stroke(); this.lastX=p.x; this.lastY=p.y; document.dispatchEvent(new Event('canvasChanged')); if(this.isEraser) this.updateEraserCursor(e); else this.updatePenCursor(e); }
    stop(){ if(this.isDrawing){ this.isDrawing=false; } }
    selectTool(tool){ const wasEraser=this.isEraser; this.isEraser = tool==='eraser'; if(wasEraser!==this.isEraser) this.applyToolSettings(); const penBtn=document.getElementById('pen-tool'); const eraserBtn=document.getElementById('eraser-tool'); penBtn&&penBtn.classList.toggle('active', !this.isEraser); eraserBtn&&eraserBtn.classList.toggle('active', this.isEraser); this.syncSizeControls(); if(this.isEraser) { this.updateEraserCursorSize(); this.hidePenCursor(); } else { this.updatePenCursorSize(); this.hideEraserCursor(); } this.updateEraserCursor(); this.updatePenCursor(); }
    changeColor(color){ this.tools.pen.color=color; if(!this.isEraser) this.ctx.strokeStyle=color; }
    clear(internal=false, skipRestore=false){ if(!this.ctx) return; if(!internal && !confirm('Cancellare il disegno?')) return; this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height); if(!internal) document.dispatchEvent(new Event('canvasChanged')); if(skipRestore) this._skipNextRestore=true; }
    exportImage(){ const dataURL=this.canvas.toDataURL('image/png'); const a=document.createElement('a'); a.download='sigillo.png'; a.href=dataURL; a.click(); }
    getCanvasData(){ if(!this.canvas) return ''; const img=this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height); const has=img.data.some((v,i)=> i%4===3 && v>0); return has?this.canvas.toDataURL('image/png'):''; }
    loadCanvasData(dataURL){ if(!dataURL||!this.canvas) return; const img=new Image(); img.onload=()=>{ this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height); this.ctx.drawImage(img,0,0); }; img.src=dataURL; }
    // --- Surface Pen handlers ---
    handlePointerDown(e){ this.autoSwitchTool(e); this.start(e); }
    handlePointerMove(e){ this.autoSwitchTool(e); this.draw(e); }
    handlePointerUp(){ this.stop(); }
    handlePointerLeave(){ this.hideEraserCursor(); this.hidePenCursor(); this.stop(); }
    autoSwitchTool(e){ if(e.pointerType==='pen'){ const isEraserEnd = (e.buttons === 32);
            if(isEraserEnd && !this.isEraser){ this.selectTool('eraser'); this._autoSwitched = true; }
            else if(!isEraserEnd && this.isEraser && this._autoSwitched){ // torna automaticamente alla penna
                this.selectTool('pen'); this._autoSwitched = false;
            } else if(!isEraserEnd && !this.isEraser){ this._autoSwitched = false; }
        } }
    // --- Gestione UI spessori separati ---
    syncSizeControls(){ if(!this.sizePicker) return; if(this.isEraser){ // mantieni range uniforme 1-32 per mapping gomma
            this.sizePicker.min = '1'; this.sizePicker.max = '32'; this.sizePicker.value = this.eraserThicknessSliderValue; this.updateEraserCursorSize();
        } else { // penna: limiti più piccoli per finezza (es. 1-12)
            this.sizePicker.min = '1'; this.sizePicker.max = '12'; if(this.penThickness > 12) this.penThickness = 12; this.sizePicker.value = this.penThickness; this.updatePenCursorSize();
        } this.updateSizeDisplay(); }
    updateSizeDisplay(){ if(!this.sizeDisplay || !this.sizePicker) return; const displayVal = this.isEraser ? this.computeEraserSize() : this.penThickness; this.sizeDisplay.textContent = displayVal + 'px'; }
    // --- Creazione icona gomma ---
    ensureEraserCursorElement(){ 
        let cursor=document.getElementById('eraser-cursor'); 
        if(!cursor){ 
            cursor=document.createElement('div'); 
            cursor.id='eraser-cursor'; 
            cursor.className='hidden'; 
            document.body.appendChild(cursor);
        } 
        // Applica sempre gli stili, anche se l'elemento esisteva già
        Object.assign(cursor.style,{ 
            position:'absolute', 
            left:'0', 
            top:'0', 
            width:'20px', 
            height:'20px', 
            border:'2px solid #000', 
            boxSizing:'border-box', 
            background:'white', 
            pointerEvents:'none', 
            zIndex:'9999', 
            borderRadius:'0px'
        }); 
    }
    // --- Creazione icona penna ---
    ensurePenCursorElement(){ 
        let cursor=document.getElementById('pen-cursor'); 
        if(!cursor){ 
            cursor=document.createElement('div'); 
            cursor.id='pen-cursor'; 
            cursor.className='hidden'; 
            document.body.appendChild(cursor);
        } 
        // Applica sempre gli stili per il cursore penna (cerchio nero)
        Object.assign(cursor.style,{ 
            position:'absolute', 
            left:'0', 
            top:'0', 
            width:'6px', 
            height:'6px', 
            border:'none', 
            boxSizing:'border-box', 
            background:'black', 
            pointerEvents:'none', 
            zIndex:'9999', 
            borderRadius:'50%'
        }); 
    }
    // --- Aggiornamento dimensioni cursore gomma ---
    updateEraserCursorSize() {
        if (this.isEraser) {
            const cursor = document.getElementById('eraser-cursor');
            if (!cursor) return;
            
            // Scala la dimensione della gomma: minimo 10px, massimo 48px
            const sliderValue = this.eraserThicknessSliderValue;
            const minEraserSize = this.tools.eraser.baseSize;
            const maxEraserSize = this.tools.eraser.maxSize;
            const sliderMin = parseInt(this.sizePicker?.min || '1');
            const sliderMax = parseInt(this.sizePicker?.max || '32');
            
            // Mappa il valore dello slider al range della gomma
            const normalizedValue = (sliderValue - sliderMin) / (sliderMax - sliderMin);
            const eraserSize = minEraserSize + (normalizedValue * (maxEraserSize - minEraserSize));
            
            cursor.style.width = `${eraserSize}px`;
            cursor.style.height = `${eraserSize}px`;
            cursor.style.borderRadius = '0px';
            cursor.style.background = 'white';
            cursor.style.border = '2px solid #000';
            
            // Mantieni la posizione centrata se il cursore è già visibile
            if (!cursor.classList.contains('hidden')) {
                const currentLeft = parseFloat(cursor.style.left) || 0;
                const currentTop = parseFloat(cursor.style.top) || 0;
                // Ricentra il cursore mantenendo la posizione del mouse
                const oldSize = parseFloat(cursor.dataset.oldSize) || eraserSize;
                const sizeDiff = (eraserSize - oldSize) / 2;
                cursor.style.left = `${currentLeft - sizeDiff}px`;
                cursor.style.top = `${currentTop - sizeDiff}px`;
            }
            cursor.dataset.oldSize = eraserSize;
        }
    }
    // --- Aggiornamento dimensioni cursore penna ---
    updatePenCursorSize() {
        if (!this.isEraser) {
            const cursor = document.getElementById('pen-cursor');
            if (!cursor) return;
            
            // Usa direttamente la dimensione della penna
            const penSize = this.penThickness;
            
            cursor.style.width = `${penSize}px`;
            cursor.style.height = `${penSize}px`;
            cursor.style.borderRadius = '50%';
            cursor.style.background = 'black';
            cursor.style.border = 'none';
            
            // Mantieni la posizione centrata se il cursore è già visibile
            if (!cursor.classList.contains('hidden')) {
                const currentLeft = parseFloat(cursor.style.left) || 0;
                const currentTop = parseFloat(cursor.style.top) || 0;
                // Ricentra il cursore mantenendo la posizione del mouse
                const oldSize = parseFloat(cursor.dataset.oldSize) || penSize;
                const sizeDiff = (penSize - oldSize) / 2;
                cursor.style.left = `${currentLeft - sizeDiff}px`;
                cursor.style.top = `${currentTop - sizeDiff}px`;
            }
            cursor.dataset.oldSize = penSize;
        }
    }
    // --- Eraser cursor ---
    updateEraserCursor(e){ const cursor=document.getElementById('eraser-cursor'); if(!cursor) return; if(!this.isEraser){ cursor.classList.add('hidden'); return; }
        // Usa clientX/Y (compatibile pointer/pen) e limita visualizzazione al canvas
        const evt = e || window.event; const clientX = evt?.clientX; const clientY = evt?.clientY;
        const rect = this.canvas?.getBoundingClientRect(); if(!rect || clientX==null){ return; }
        const inside = clientX>=rect.left && clientX<=rect.right && clientY>=rect.top && clientY<=rect.bottom;
        if(!inside){ cursor.classList.add('hidden'); return; }
        const size=this.computeEraserSize(); cursor.style.width=size+'px'; cursor.style.height=size+'px'; cursor.style.borderRadius='0px'; cursor.style.background='white'; cursor.style.border='2px solid #000';
        // Posiziona centrando il quadrato
        const pageX = evt.pageX || (clientX + window.scrollX); const pageY = evt.pageY || (clientY + window.scrollY);
        cursor.style.left=(pageX-size/2)+'px'; cursor.style.top=(pageY-size/2)+'px'; cursor.classList.remove('hidden'); }
    // --- Pen cursor ---
    updatePenCursor(e){ const cursor=document.getElementById('pen-cursor'); if(!cursor) return; if(this.isEraser){ cursor.classList.add('hidden'); return; }
        // Usa clientX/Y (compatibile pointer/pen) e limita visualizzazione al canvas
        const evt = e || window.event; const clientX = evt?.clientX; const clientY = evt?.clientY;
        const rect = this.canvas?.getBoundingClientRect(); if(!rect || clientX==null){ return; }
        const inside = clientX>=rect.left && clientX<=rect.right && clientY>=rect.top && clientY<=rect.bottom;
        if(!inside){ cursor.classList.add('hidden'); return; }
        const size=this.penThickness; cursor.style.width=size+'px'; cursor.style.height=size+'px'; cursor.style.borderRadius='50%'; cursor.style.background='black'; cursor.style.border='none';
        // Posiziona centrando il cerchio
        const pageX = evt.pageX || (clientX + window.scrollX); const pageY = evt.pageY || (clientY + window.scrollY);
        cursor.style.left=(pageX-size/2)+'px'; cursor.style.top=(pageY-size/2)+'px'; cursor.classList.remove('hidden'); }
    hideEraserCursor(){ const cursor=document.getElementById('eraser-cursor'); if(cursor) cursor.classList.add('hidden'); }
    hidePenCursor(){ const cursor=document.getElementById('pen-cursor'); if(cursor) cursor.classList.add('hidden'); }
    onShown() { if (!this.isInitialized) { this.init(); setTimeout(()=>this.smartResize(),50); } else { this.smartResize(); } }
}
// Istanza globale
const canvasComponent = new CanvasComponent();
window.canvasComponent = canvasComponent; window.canvas = canvasComponent;
