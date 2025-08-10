// STORY DATA - Fisica 3.0
// Dati narrativi del Grimorio dell'Apprendista Stregone

const storyData = {
    chapters: [
        {
            id: 1,
            title: "Il Santuario delle Misure",
            introduction: "La prima pagina del grimorio si illumina. La voce dell'Archimaga risuona nella tua mente: \"Prima di poter riparare la realtà, devi impararne il linguaggio. La Camera delle Fondamenta è la tua prima prova. Qui non imparerai a lanciare fulmini, ma a misurare, definire e quantificare il mondo. Senza questa conoscenza, ogni tuo tentativo di riparare il Cuore non farebbe che peggiorare le cose.\"",
            conclusion: "Con la prima Runa nelle tue mani, senti il potere delle misure fondamentali scorrere attraverso di te. Ora puoi quantificare il mondo con precisione divina.",
            rooms: [
                {
                    challengeId: 1,
                    storyText: "La prima pagina del grimorio si illumina, mostrando un'immagine tremolante del Cuore dell'Equilibrio. Una voce antica, quella del primo Stregone, emana dal tomo: \"Per riparare ciò che è rotto, devi prima conoscerne la misura. Il Cuore è un costrutto di precisione divina. Una deviazione di un capello nelle sue dimensioni potrebbe disfare la creazione. Prima di poterlo toccare, devi dimostrare di comprendere le unità sacre: il Metro per lo spazio, il Chilogrammo per la sostanza, il Secondo per il tempo. Non sono parole, ma la scala assoluta dell'esistenza. Mostrami che ne comprendi la santità.\""
                },
                {
                    challengeId: 2,
                    storyText: "La voce continua: \"Il Cuore non è una macchina di ingranaggi e leve; è intessuto con l'essenza stessa della materia. Per capire la sua malattia, devi guardare più a fondo. Osserva il mondo non come forme solide, ma come una danza vorticosa di atomi, un reticolo vibrante di energia. Descrivimi questa danza. Spiegami il modello atomico, perché solo conoscendo le parti più piccole potrai comprendere il tutto.\""
                },
                {
                    challengeId: 3,
                    storyText: "Lo Stregone ti sottopone a una prova crudele. Davanti a te appaiono tre pergamene con equazioni fisiche. Una è corretta, due contengono errori dimensionali. \"Molti apprendisti sono morti per aver usato formule sbagliate,\" dice la voce sinistra. \"Il Crivello Dimensionale è la tua salvezza. Non ti dirà se i tuoi calcoli sono giusti, ma ti dirà se sono almeno sensati. Usa l'analisi dimensionale. Identifica l'equazione corretta, o la prossima porta non si aprirà.\""
                },
                {
                    challengeId: 4,
                    storyText: "\"Ogni tradizione magica ha le sue unità di misura,\" sussurra la voce. \"I Druidi misurano in braccia e leghe, i Nani in pugni e pollici, gli Elfi in passi lunari. Ma tu devi essere un diplomatico della precisione. L'Arte della Conversione ti permetterà di tradurre tra i linguaggi del mondo. Converti queste antiche misure elfiche in unità moderne. La sopravvivenza della tua missione dipende dalla tua precisione.\""
                },
                {
                    challengeId: 5,
                    storyText: "L'Archimaga Elara ti pone davanti a un dilemma: \"Non sempre avrai tempo per misurazioni precise. A volte, in battaglia, dovrai stimare al volo. La Stima Arcana è l'arte di calcolare ordini di grandezza. Questa torre è alta alcuni piani. Quanti metri? Questo calderone contiene un liquido. Quanti litri? Impara a vedere i numeri nelle forme, o i tuoi incantesimi saranno sempre imprecisi.\""
                },
                {
                    challengeId: 6,
                    storyText: "\"Presta attenzione!\" tuona la voce del Grimorio. \"Ogni cifra che scrivi ha un significato. Ogni zero che aggiungi è una promessa di precisione. La Bilancia della Precisione ti insegna che tre cifre significative non sono uguali a sei. Un apprendista arrogante che dichiara di aver misurato il diametro di un atomo con un righello sarà deriso dai saggi. Usa solo le cifre che meriti. Rispetta la precisione dei tuoi strumenti.\""
                },
                {
                    challengeId: 7,
                    storyText: "Elara evoca due illusioni di energia. Una è una sfera uniforme che ruota lentamente su se stessa. L'altra è una freccia scintillante che punta verso il nord magico. \"Osserva,\" dice. \"Una ha grandezza ma non direzione. L'altra ha entrambe. Queste sono le Essenze Pure e Direzionali, gli scalari e i vettori. Il calore è scalare: non ha verso. La velocità è vettoriale: ha direzione e intensità. Confondere le due nature è l'errore più comune dei novizi.\""
                },
                {
                    challengeId: 8,
                    storyText: "La prima sfida pratica ti attende. Su un tavolo di marmo nero sono disposti tre vettori di forza, rappresentati da frecce di luce magica. \"Per spostare questo cristallo sulla posizione desiderata, devi combinare queste forze,\" spiega Elara. \"Ma i vettori non si sommano come i numeri comuni. Devi usare la Legge Parallelogramma o scomporli in componenti. Calcola la forza risultante. Il cristallo deve arrivare esattamente al centro del cerchio arcano.\""
                }
            ]
        },
        {
            id: 2,
            title: "La Camera del Moto Unidimensionale",
            introduction: "La prima Runa pulsa nella tua mano mentre una nuova porta si materializza nel grimorio. La voce dello Stregone ti guida: \"Ora che conosci il linguaggio delle misure, è tempo di descrivere il cambiamento. Il movimento è l'essenza stessa della vita e dell'energia. In questa camera imparerai a tracciare il percorso di ogni particella, a predire dove sarà e quando ci arriverà.\"",
            conclusion: "Con la seconda Runa si forma il potere di descrivere ogni movimento lungo una linea. Ora puoi predire il futuro di ogni corpo in movimento rettilineo.",
            rooms: [
                {
                    challengeId: 9,
                    storyText: "\"Il movimento inizia con una definizione,\" dichiara la voce. \"Posizione non è un luogo assoluto, ma un punto relativamente a un'origine che tu scegli. Una perla magica si muove lungo questo filo d'argento. Il filo è il tuo sistema di riferimento unidimensionale. Dimmi la posizione della perla in ogni istante. Stabilisci la tua origine, definisci la tua scala. Solo allora potrai iniziare a tracciare il movimento.\""
                },
                {
                    challengeId: 10,
                    storyText: "\"Descrivere dove sei è inutile se non sai dove stai andando,\" continua lo Stregone. \"Lo Spostamento è il cambiamento di posizione. Non confonderlo con la distanza percorsa: è un vettore che punta dall'inizio alla fine del viaggio. Una fata vola avanti e indietro lungo questo ramo. Calcola il suo spostamento totale. Ricorda: il percorso non conta, conta solo da dove parti e dove arrivi.\""
                },
                {
                    challengeId: 11,
                    storyText: "\"Ora imparerai il ritmo del cambiamento,\" sussurra Elara. \"La Velocità non è solo 'quanto veloce', ma anche 'in quale direzione'. È il tasso di cambiamento della posizione. Osserva questo spiritello del vento che corre lungo il sentiero. In media, quanto velocemente si muove? E in questo istante preciso, qual è la sua velocità istantanea? La pendenza del grafico posizione-tempo ti rivelerà tutti i segreti.\""
                },
                {
                    challengeId: 12,
                    storyText: "\"Ma il movimento non è sempre uniforme,\" avverte lo Stregone. \"Un cavallo che galoppa accelera dal trotto. Un proiettile magico rallenta mentre attraversa uno scudo. L'Accelerazione è il tasso di cambiamento della velocità. Studia questo golem che sta cambiando la sua velocità di marcia. Calcola la sua accelerazione. È la curvatura della sua storia.\""
                },
                {
                    challengeId: 13,
                    storyText: "\"Ecco il primo vero incantesimo del movimento!\" esclama la voce del Grimorio. \"Se conosci la posizione e la velocità iniziale di un oggetto, e sai che si muove con accelerazione costante, puoi prevedere dove sarà in qualsiasi momento futuro. Questa è la Formula della Profezia: x = x₀ + v₀t + ½at². Un dardo stregato è stato lanciato con queste condizioni iniziali. Dimmi dove si troverà tra dieci secondi.\""
                },
                {
                    challengeId: 14,
                    storyText: "\"Non sempre avrai il tempo a disposizione,\" dice Elara, creando un'illusione di un corpo che cade. \"Ma se conosci velocità e accelerazione, puoi scoprire velocità e distanze senza bisogno del tempo. Questo è il Teorema di Torricelli: v² = v₀² + 2aΔx. Un cristallo cade da una torre alta 45 metri. Con quale velocità colpirà il suolo? Non ti serve sapere quanto tempo ci metterà.\""
                }
            ]
        },
        {
            id: 3,
            title: "L'Arena del Moto Bidimensionale",
            introduction: "La seconda Runa risuona con il potere del movimento lineare. Ora una vasta arena si apre davanti a te, e la voce dello Stregone si fa più solenne: \"Il mondo reale non è una linea, apprendista. È un piano, uno spazio, un universo di infinite direzioni. Qui imparerai a dominare il movimento su due dimensioni, dalla traiettoria di una freccia al vortice di un incantesimo.\"",
            conclusion: "La terza Runa si materializza, vibrante del potere di tracciare ogni traiettoria nel piano. Ora puoi predire il percorso di qualsiasi proiettile e navigare in ogni direzione.",
            rooms: [
                {
                    challengeId: 15,
                    storyText: "\"Nel mondo bidimensionale, ogni vettore ha due facce,\" spiega lo Stregone. \"Le Componenti del Movimento. Una velocità che punta a nord-est non è altro che una velocità verso nord più una velocità verso est. Scomponi questo vettore velocità nelle sue componenti cartesiane. È la chiave per risolvere tutti i problemi bidimensionali.\""
                },
                {
                    challengeId: 16,
                    storyText: "Elara lancia una sfera di luce in aria. La sfera descrive una parabola perfetta prima di ricadere. \"Ecco la danza del Moto Parabolico,\" dice. \"Orizzontalmente, si muove con velocità costante. Verticalmente, cade sotto l'influenza della gravità. Due movimenti indipendenti che insieme creano questa curva elegante. Calcola dove atterrerà la sfera.\""
                },
                {
                    challengeId: 17,
                    storyText: "\"L'arte della guerra magica richiede precisione,\" dichiara lo Stregone mentre evoca l'immagine di un arciere elfico. \"Un Proiettile Magico deve colpire un bersaglio distante. L'arciere deve considerare la gravità: non può mirare direttamente al bersaglio, ma deve puntare più in alto. Calcola l'angolo di lancio necessario per centrare il bersaglio.\""
                },
                {
                    challengeId: 18,
                    storyText: "\"Il moto circolare è la danza degli dei,\" sussurra la voce con riverenza. \"Pianeti che orbitano attorno a stelle, elettroni che danzano attorno ai nuclei. In questa danza sacra, la velocità è costante in grandezza ma cambia continuamente direzione. Calcola la velocità di questo cristallo che orbita in cerchio. Comprendi che sta sempre accelerando verso il centro.\""
                },
                {
                    challengeId: 19,
                    storyText: "Come predetto, il vortice inizia a pulsare, la sua rotazione si fa più rapida e violenta. \"Sta accelerando!\" avverte la voce. \"Ora non c'è solo un'accelerazione verso il centro, ma anche un'accelerazione tangenziale che ne aumenta la velocità di rotazione. L'accelerazione totale è ora un vettore che cambia continuamente. Per placare questo vortice, devi lanciare un contro-incantesimo che si opponga a entrambe le accelerazioni. Calcola il vettore di accelerazione totale in questo istante.\""
                },
                {
                    challengeId: 20,
                    storyText: "Elara crea una nuova, complessa illusione. Tu sei su una piattaforma fluttuante che si muove verso nord. Un goblin sciamano, su un'altra piattaforma che si muove verso est, sta per lanciare un incantesimo di corruzione sul Cuore. Devi colpirlo con un dardo di energia. \"Ma la tua mira sarà ingannata,\" ti avverte l'Archimaga. \"Il tuo movimento e il suo si combinano. Dal tuo punto di vista, il suo movimento è diverso da quello che vedrebbe un osservatore fermo. Padroneggia la velocità relativa.\""
                }
            ]
        },
        {
            id: 4,
            title: "La Cittadella delle Leggi del Moto",
            introduction: "Il dardo colpisce il bersaglio. Il goblin svanisce in una nuvola di fumo e la terza Runa si materializza nella tua mano. Ora puoi descrivere qualsiasi movimento, non importa quanto complesso. Ma descrivere non basta. La voce dello Stregone si fa più grave, più solenne: \"Hai imparato a leggere i sintomi, apprendista. Ora devi capire la malattia. Hai visto il come, ora devi affrontare il perché. Benvenuto nella Cittadella delle Forze, il cuore della nostra dottrina.\"",
            conclusion: "La quarta Runa si forma nella tua mano, vibrando del potere delle Leggi del Moto. Ora conosci le cause di ogni movimento.",
            rooms: [
                {
                    challengeId: 21,
                    storyText: "\"Finora hai osservato il movimento come un dato di fatto,\" dice la voce. \"Ma nulla si muove senza una ragione. Una spinta, un'attrazione, un'influenza... questa è la Forza. È l'intenzione che si cela dietro ogni cambiamento, il comando che l'universo impartisce alla materia. Prima di poter lanciare incantesimi di forza, devi comprenderne il concetto. Cos'è una forza? Come si manifesta?\""
                },
                {
                    challengeId: 22,
                    storyText: "Un'illusione mostra una cometa che solca il vuoto cosmico, muovendosi in linea retta senza sosta. \"Guarda,\" sussurra lo Stregone. \"Nessuno la spinge. Il suo stato naturale è il movimento. Questa è la Prima Legge di Newton: un oggetto non cambia il suo stato di moto a meno che una forza non lo costringa. Questa resistenza al cambiamento è l'Inerzia.\""
                },
                {
                    challengeId: 23,
                    storyText: "L'Archimaga Elara ti mostra due sfere identiche nell'aspetto, una di legno e una di piombo. \"Prova a spostarle con un semplice incantesimo di spinta,\" ti dice. La sfera di legno schizza via, quella di piombo si muove a malapena. \"Hanno lo stesso volume, ma non la stessa massa. La massa è la misura dell'inerzia di un corpo, la sua testarda riluttanza a cambiare il proprio stato di moto.\""
                },
                {
                    challengeId: 24,
                    storyText: "\"Ecco l'incantesimo supremo, il cuore della dinamica,\" annuncia la voce del Grimorio. \"F = ma. La Seconda Legge di Newton. Non è una semplice formula, è un nesso causale. Ti dice esattamente quanta Forza serve per impartire una certa Accelerazione a una data Massa. Un golem di pietra sta bloccando il passaggio. Calcola la forza esatta che il tuo incantesimo deve applicare.\""
                },
                {
                    challengeId: 25,
                    storyText: "\"Ti sei mai chiesto perché, non importa quanto in alto salti, torni sempre a terra?\" spiega Elara. \"È perché il mondo stesso esercita una forza su di te. Questa è la forza gravitazionale, e la sua manifestazione su di te è il tuo peso. È una forza costante, sempre presente, che lega ogni cosa al suolo. Calcola il tuo peso su questo mondo, e poi calcola quale sarebbe sulla luna.\""
                },
                {
                    challengeId: 26,
                    storyText: "Lo Stregone ti sfida: \"Colpisci questo muro di pietra con un pugno di forza magica.\" Tu lo fai, e mentre il muro trema, senti un contraccolpo sulle tue mani. \"Questa è la Terza Legge di Newton. Per ogni azione, c'è una reazione uguale e contraria. Le forze nascono sempre in coppia. Spiegami questo principio di equilibrio universale.\""
                },
                {
                    challengeId: 27,
                    storyText: "\"La realtà è un groviglio di forze invisibili,\" dice l'Archimaga. \"Un libro sulla scrivania è spinto verso il basso dalla gravità, ma anche verso l'alto dalla scrivania. È fermo perché queste forze si bilanciano. Per analizzare situazioni complesse, devi prima compiere un rituale di visualizzazione: il Diagramma di Corpo Libero. Disegna tutte le forze che agiscono su questo golem appeso.\""
                }
            ]
        },
        {
            id: 5,
            title: "Il Dominio delle Forze Applicate",
            introduction: "La quarta Runa si forma nella tua mano, vibrando del potere delle Leggi del Moto. Ora conosci le cause. Ma la voce del Grimorio ti avverte: \"Le leggi sono pure, apprendista, ma il mondo è imperfetto. Le tue magie non opereranno nel vuoto, ma in un mondo pieno di resistenza, attrito e complessità. Per applicare le Leggi, devi prima padroneggiare le forze che si oppongono loro.\"",
            conclusion: "La quinta Runa si materializza, fredda al tocco, simboleggiando le forze dissipative che hai imparato a dominare.",
            rooms: [
                {
                    challengeId: 28,
                    storyText: "Elara ti pone di fronte a un pesante tomo di pietra. \"Spingilo,\" ordina. Tu lanci un piccolo incantesimo di spinta, ma il tomo non si muove. \"Stai combattendo una forza invisibile: l'attrito. È una forza subdola che si oppone al moto. Calcola la forza esatta necessaria per vincere l'attrito statico e muovere il tomo.\""
                },
                {
                    challengeId: 29,
                    storyText: "Ti trovi di nuovo di fronte al vortice di energia, ma ora la tua comprensione è più profonda. \"Nel Capitolo 3 hai descritto il suo moto,\" dice lo Stregone. \"Ora ne analizzerai la causa. Sai che per mantenere un oggetto in moto circolare serve una forza centripeta. Applica la Seconda Legge di Newton a questo scenario.\""
                },
                {
                    challengeId: 30,
                    storyText: "L'Archimaga ti fa salire su una grande piattaforma rotante. Mentre gira, ti lancia una sfera di luce. Per te, la sfera sembra curvare magicamente. \"Ma per me, che sono ferma, la sfera ha viaggiato in linea retta,\" spiega Elara. \"Tu sei in un sistema di riferimento non inerziale. Ciò che percepisci è una forza fittizia, un'illusione creata dalla tua stessa accelerazione.\""
                },
                {
                    challengeId: 31,
                    storyText: "\"Il Cuore è protetto non solo da mura, ma da un'aura di denso etere. Ogni incantesimo che lanci attraverso di esso viene rallentato. Questa è la resistenza del mezzo, una forma di attrito che dipende dalla velocità. Calcola la velocità terminale di un dardo magico lanciato attraverso l'etere protettivo.\""
                },
                {
                    challengeId: 32,
                    storyText: "\"Hai maneggiato la gravità, l'attrito, le tensioni... ma queste sono solo manifestazioni superficiali,\" rivela lo Stregone. \"Nel profondo, la realtà è governata da quattro Forze Fondamentali: la Gravità che lega i mondi, l'Elettromagnetismo che lega gli atomi, e le forze Nucleari Forte e Debole che governano il cuore delle stelle.\""
                }
            ]
        },
        {
            id: 6,
            title: "L'Aetherium del Lavoro e dell'Energia Cinetica",
            introduction: "La quinta Runa si materializza, fredda al tocco, simboleggiando le forze dissipative che hai imparato a dominare. La voce dello Stregone ti spinge oltre: \"Le forze sono il modo rozzo di vedere il mondo, apprendista. È la magia dei bruti e dei golem. Un vero Arcimago non pensa in termini di 'spinte', ma di 'costi'. Il costo per compiere un'azione, il trasferimento di potenziale.\"",
            conclusion: "La sesta Runa si illumina nella tua mano, risuonando con il potere che hai imparato a scatenare.",
            rooms: [
                {
                    challengeId: 33,
                    storyText: "Un enorme blocco di pietra astrale blocca il tuo cammino nell'Aetherium. \"Per spostarlo, potresti calcolare la forza necessaria,\" dice la voce. \"Ma un mago saggio calcola il costo. Il Lavoro è il prezzo in mana che paghi per usare una forza su una certa distanza. Calcola il lavoro necessario per spostare questo blocco.\""
                },
                {
                    challengeId: 34,
                    storyText: "Per spostare il blocco, lo leghi con una fune di mana e lo tiri in diagonale, verso l'alto. \"Attento!\" ti avverte Elara. \"Non tutta la tua forza sta contribuendo a spostare il blocco in avanti. Il lavoro utile è solo quello compiuto dalla componente della forza che giace nella stessa direzione dello spostamento.\""
                },
                {
                    challengeId: 35,
                    storyText: "Il tuo cammino è bloccato da una barriera di energia elastica. Per attraversarla, devi allargarla. Ma più la allarghi, più la barriera si oppone. \"Questa è una forza variabile,\" spiega lo Stregone. \"Per calcolare il lavoro totale, devi usare un incantesimo più potente: l'integrazione.\""
                },
                {
                    challengeId: 36,
                    storyText: "Hai speso mana, hai compiuto lavoro sul blocco di pietra. Ora il blocco si muove. \"Ma dov'è finito il mana che hai speso?\" chiede la voce. \"Non è svanito. Si è trasformato. È diventato Energia Cinetica, l'energia del movimento. Questo è il Teorema dell'Energia Cinetica.\""
                },
                {
                    challengeId: 37,
                    storyText: "Tu e un altro apprendista dovete sollevare due identici blocchi di pietra sulla stessa altezza. Entrambi compirete lo stesso lavoro. Ma il tuo rivale lo fa in dieci secondi, tu in cinque. \"Chi è più potente?\" chiede Elara. \"La Potenza non è quanto lavoro fai, ma quanto velocemente lo fai.\""
                }
            ]
        },
        {
            id: 7,
            title: "Il Tempio dell'Energia Potenziale",
            introduction: "La sesta Runa si illumina nella tua mano, risuonando con il potere che hai imparato a scatenare. Hai compreso l'energia del movimento. Ma la voce del Grimorio si fa più sottile, quasi un sussurro: \"Hai visto l'energia spesa e l'energia manifesta. Ma che dire dell'energia in attesa? Il potere che dorme in una corda d'arco tesa, o in un masso in bilico sulla cima di una montagna?\"",
            conclusion: "La settima Runa si materializza, splendente di energia conservata. Ora vedi il mondo come un grande bilancio di mana.",
            rooms: [
                {
                    challengeId: 38,
                    storyText: "Elara ti mostra un pesante candelabro appeso al soffitto. \"Ora non si muove,\" dice. \"La sua energia cinetica è zero. Ma c'è del potere lì. Un potere immagazzinato, pronto a essere liberato. Se la fune si spezzasse, da dove verrebbe l'energia che lo farebbe schiantare al suolo?\""
                },
                {
                    challengeId: 39,
                    storyText: "\"Perché possiamo immagazzinare energia contro la gravità, ma non contro l'attrito?\" chiede la voce dello Stregone. \"Perché la gravità è una forza conservativa. Il lavoro che fai contro di essa ti viene restituito interamente. L'attrito è una forza non conservativa. Il lavoro che fai contro di esso è perso.\""
                },
                {
                    challengeId: 40,
                    storyText: "\"C'è un legame profondo tra una forza conservativa e l'energia potenziale che essa genera,\" sussurra il Grimorio. \"Una forza conservativa spinge sempre nella direzione in cui l'energia potenziale diminuisce più rapidamente. Ti mostro una mappa dell'energia potenziale attorno a un artefatto.\""
                },
                {
                    challengeId: 41,
                    storyText: "\"Questo è l'incantesimo che unisce tutto ciò che hai imparato finora,\" annuncia Elara. \"La Conservazione dell'Energia Meccanica. In un sistema dove agiscono solo forze conservative, la somma di energia cinetica e potenziale è una costante sacra e immutabile.\""
                },
                {
                    challengeId: 42,
                    storyText: "\"Il Giuramento è potente, ma il mondo reale è imperfetto,\" ti ammonisce lo Stregone. \"L'attrito, la resistenza dell'aria... queste forze non conservative rubano energia dal tuo sistema. La differenza tra l'energia iniziale e quella finale è esattamente uguale al lavoro compiuto dalla forza d'attrito.\""
                },
                {
                    challengeId: 43,
                    storyText: "\"Hai visto il paesaggio energetico. Ora impara a leggerne la topografia,\" dice Elara, mostrando un diagramma fluttuante. \"I Diagrammi di Energia ti mostrano le valli della stabilità e le cime dell'instabilità. Analizza il diagramma energetico del Cuore.\""
                }
            ]
        },
        {
            id: 12,
            title: "La Guglia del Moto Oscillatorio",
            introduction: "La settima Runa si materializza, splendente di energia conservata. Ora vedi il mondo come un grande bilancio di mana. Ma una nuova minaccia si manifesta nel Cuore. Non più una crepa statica, ma una vibrazione profonda e ritmica che lo percorre, minacciando di mandarlo in frantumi come un calice di cristallo.",
            conclusion: "Hai fermato il pendolo e l'ottava Runa si è formata, vibrando in armonia con la tua mano. Hai imparato a controllare un'oscillazione in un punto.",
            rooms: [
                {
                    challengeId: 44,
                    storyText: "\"La vibrazione che scuote il Cuore è un'oscillazione,\" spiega Elara, indicando un cristallo fluttuante che trema avanti e indietro attorno a un punto di equilibrio. \"Il suo movimento segue una legge precisa: la forza che cerca di riportarlo all'equilibrio è proporzionale a quanto se ne è allontanato. Questo è il Moto Armonico Semplice.\""
                },
                {
                    challengeId: 45,
                    storyText: "\"Questa vibrazione non è solo un movimento, è energia,\" continua lo Stregone. \"Un'energia che si trasforma incessantemente. Quando il cristallo è ai limiti della sua oscillazione, tutta la sua energia è potenziale. Quando passa per il centro, tutta la sua energia è cinetica. Calcola questa energia totale.\""
                },
                {
                    challengeId: 46,
                    storyText: "Uno dei contrappesi arcani che stabilizzano il Cuore si è sganciato e ora oscilla pericolosamente come un enorme pendolo. \"Questo è un altro archetipo di oscillazione,\" dice Elara. \"Il pendolo. Il suo ritmo non dipende dalla sua massa, ma solo dalla sua lunghezza e dalla gravità.\""
                },
                {
                    challengeId: 47,
                    storyText: "\"Il pendolo che hai fermato era un'idealizzazione,\" dice lo Stregone. \"Ora affronta la realtà. Qualsiasi oggetto può oscillare attorno a un perno. Questo è un pendolo fisico. Il suo ritmo dipende da come la sua massa è distribuita. Calcola il periodo di un'antica campana rituale.\""
                },
                {
                    challengeId: 48,
                    storyText: "\"La vibrazione del Cuore non durerà per sempre, anche se non facessimo nulla. L'attrito interno, la resistenza eterea... queste forze dissipative smorzano l'oscillazione. Questo è il moto smorzato. Solo così potrai creare incantesimi di smorzamento efficaci.\""
                },
                {
                    challengeId: 49,
                    storyText: "\"Il pericolo più grande!\" tuona la voce del Grimorio. \"Forze esterne e periodiche stanno colpendo il Cuore, tentando di alimentarne la vibrazione. Se la frequenza di queste forze si avvicina alla frequenza naturale del Cuore, accadrà il disastro: la Risonanza.\""
                }
            ]
        },
        {
            id: 13,
            title: "La Cattedrale del Moto Ondulatorio",
            introduction: "Hai fermato il pendolo e l'ottava Runa si è formata, vibrando in armonia con la tua mano. Hai imparato a controllare un'oscillazione in un punto. Ma la voce del Grimorio ti avverte di un pericolo maggiore. \"L'oscillazione che hai placato era solo la sorgente, il sasso gettato nello stagno. Ora la sua energia si sta propagando all'esterno, viaggiando attraverso il tessuto della realtà come un'onda.\"",
            conclusion: "La nona Runa si materializza, un sigillo di pura risonanza. Hai placato le onde.",
            rooms: [
                {
                    challengeId: 50,
                    storyText: "Un'onda di energia visibile si propaga attraverso la stanza. \"Un'onda non è un oggetto,\" spiega lo Stregone. \"È un trasferimento di energia senza un trasferimento di materia. Per comprenderla, devi impararne l'anatomia.\" La voce ti sfida a identificare le sue caratteristiche fondamentali: ampiezza, lunghezza d'onda, frequenza e periodo."
                },
                {
                    challengeId: 51,
                    storyText: "Elara evoca due illusioni. Nella prima, una corda magica viene scossa su e giù, e l'onda viaggia in orizzontale: un'onda trasversale. Nella seconda, una lunga molla astrale viene compressa e rilasciata: un'onda longitudinale. \"Le onde sonore sono longitudinali. Le onde di luce sono trasversali.\""
                },
                {
                    challengeId: 52,
                    storyText: "\"La velocità di un'onda non dipende da come la crei, ma dal mezzo in cui viaggia,\" spiega Elara. \"Un'onda su una corda di liuto tesa è più rapida di una su una corda allentata. Un'onda di instabilità si sta propagando lungo un filamento di mana. Calcola la sua velocità.\""
                },
                {
                    challengeId: 53,
                    storyText: "\"Il vero pericolo non è una singola onda, ma molte,\" dice la voce del Grimorio. Due onde di instabilità si dirigono l'una verso l'altra. \"Quando si incontreranno, obbediranno al Principio di Sovrapposizione: i loro effetti si sommeranno. Disegna l'onda risultante.\""
                },
                {
                    challengeId: 54,
                    storyText: "\"Ricorda, un'onda trasporta energia. L'intensità di un'onda dipende dal quadrato della sua ampiezza e dal quadrato della sua frequenza,\" ti ammonisce lo Stregone. \"Un'onda caotica emana dal Cuore. Calcola la sua potenza, il flusso di energia distruttiva che sta vomitando ogni secondo.\""
                },
                {
                    challengeId: 55,
                    storyText: "\"La mia stessa voce ti raggiunge come un'onda di compressione e rarefazione dell'aria. Le onde sonore sono il nostro strumento di comunicazione più antico,\" spiega Elara. \"Comprendi la loro natura. Spiega perché nel vuoto astrale tra i mondi, nessuno può sentirti urlare.\""
                },
                {
                    challengeId: 56,
                    storyText: "Un frammento di cristallo si stacca dal Cuore e inizia a emettere un'onda sonora acuta mentre si allontana velocemente da te. Noti che il suono diventa sempre più grave. \"Questo è l'Effetto Doppler. Calcola la velocità del frammento basandoti sul cambiamento di tonalità che percepisci.\""
                }
            ]
        },
        {
            id: 15,
            title: "La Biblioteca Sommersa della Fluidomeccanica",
            introduction: "La nona Runa si materializza, un sigillo di pura risonanza. Hai placato le onde. Ma ora, una minaccia finale e più profonda si rivela. Il Cuore dell'Equilibrio non è un solido, ma un nesso di correnti energetiche fluide. La sua malattia non è una crepa o un'onda, ma un'alterazione del suo stesso flusso vitale.",
            conclusion: "Hai completato il Rito del Ripristino. Il Cuore dell'Equilibrio pulsa di nuovo con forza, e la realtà stessa è stata salvata dalla dissoluzione.",
            rooms: [
                {
                    challengeId: 57,
                    storyText: "L'ingresso alla Biblioteca è sommerso da un oceano di etere denso. Per entrare, devi aprire un antico portale di pietra. \"L'etere sopra di te ha un peso,\" ti avverte Elara. \"Questo peso si manifesta come Pressione. Usa la Legge di Stevino per calcolare la pressione a questa profondità.\""
                },
                {
                    challengeId: 58,
                    storyText: "All'interno, antichi tomi di conoscenza fluttuano nell'etere liquido. Un tomo cruciale sta lentamente affondando verso un crepaccio oscuro. \"Non puoi sollevarlo con la forza bruta,\" dice lo Stregone. \"Ma puoi salvarlo con l'astuzia. Ogni corpo immerso riceve una spinta verso l'alto. Questo è il Principio di Archimede.\""
                },
                {
                    challengeId: 59,
                    storyText: "Le correnti di mana che alimentano il Cuore scorrono attraverso dei condotti eterei. In un punto, dove un condotto si restringe, il flusso è diventato pericolosamente turbolento. \"Il mana non si crea né si distrugge, semplicemente scorre. Questa è l'Equazione di Continuità.\""
                },
                {
                    challengeId: 60,
                    storyText: "Sei giunto al cospetto del Cuore. Le correnti di mana che lo circondano sono caotiche. \"Questa è la tua prova finale,\" annuncia l'Archimaga Elara. \"Il Teorema di Bernoulli. Usa questo teorema per progettare e lanciare un'ala di energia stabilizzante che riporterà finalmente la stabilità nel flusso del Cuore.\""
                }
            ]
        }
    ],

    // Metodi utility per accedere ai dati
    getChapterById(id) {
        return this.chapters.find(chapter => chapter.id === id);
    },

    getChapterByZoneId(zoneId) {
        return this.chapters.find(chapter => chapter.id === zoneId);
    },

    getChapterByChallengeId(challengeId) {
        for (const chapter of this.chapters) {
            const room = chapter.rooms.find(room => room.challengeId === challengeId);
            if (room) return chapter;
        }
        return null;
    },

    getStoryForChallenge(challengeId) {
        for (const chapter of this.chapters) {
            const room = chapter.rooms.find(room => room.challengeId === challengeId);
            if (room) {
                return {
                    chapterIntro: chapter.introduction,
                    challengeStory: room.storyText,
                    chapterTitle: chapter.title
                };
            }
        }
        return null;
    },

    getChapterTitle(chapterId) {
        const chapter = this.getChapterById(chapterId);
        return chapter ? chapter.title : '';
    },

    getChapterText(chapterId) {
        const chapter = this.getChapterById(chapterId);
        if (!chapter) return '';
        
        let text = chapter.introduction + '\n\n';
        chapter.rooms.forEach(room => {
            text += room.storyText + '\n\n';
        });
        text += chapter.conclusion;
        return text;
    },

    getAllChapters() {
        return this.chapters;
    },

    getTotalChapters() {
        return this.chapters.length;
    },

    getTotalRooms() {
        return this.chapters.reduce((total, chapter) => total + chapter.rooms.length, 0);
    },

    // Metodi aggiuntivi per compatibilità con storyMode.js
    getChapters() {
        return this.chapters;
    },

    getTotalRoomsCount() {
        return this.getTotalRooms();
    },

    getChapterById(chapterId) {
        return this.chapters.find(chapter => chapter.id === chapterId);
    },

    getChapterByChallengeId(challengeId) {
        return this.chapters.find(chapter => 
            chapter.rooms.some(room => room.challengeId === challengeId)
        );
    },

    getChapterTitle(chapterId) {
        const chapter = this.getChapterById(chapterId);
        return chapter ? chapter.title : `Capitolo ${chapterId}`;
    },

    getStoryForChallenge(challengeId) {
        const chapter = this.getChapterByChallengeId(challengeId);
        if (!chapter) return null;
        
        const room = chapter.rooms.find(room => room.challengeId === challengeId);
        if (!room) return null;
        
        return {
            chapterIntro: chapter.introduction,
            challengeStory: room.storyText,
            chapterTitle: chapter.title
        };
    }
};

// Rendi globale per l'accesso da altri moduli
window.storyData = storyData;
