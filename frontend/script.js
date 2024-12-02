const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Database completo del menu e FAQ
const menuDatabase = {
    "antipasti": [
        { nome: "Bruschetta", prezzo: "€6", descrizione: "Pane tostato con pomodorini freschi e basilico" },
        { nome: "Caprese", prezzo: "€8", descrizione: "Mozzarella di bufala con pomodori e basilico" },
        { nome: "Carpaccio", prezzo: "€12", descrizione: "Sottili fette di manzo con rucola e parmigiano" }
    ],
    "primi": [
        { nome: "Carbonara", prezzo: "€12", descrizione: "Spaghetti con uova, guanciale e pecorino" },
        { nome: "Amatriciana", prezzo: "€11", descrizione: "Bucatini con guanciale e pomodoro" },
        { nome: "Risotto", prezzo: "€14", descrizione: "Risotto allo zafferano alla milanese" }
    ],
    "pizze": [
        { nome: "Margherita", prezzo: "€8", descrizione: "Pomodoro, mozzarella e basilico" },
        { nome: "Marinara", prezzo: "€7", descrizione: "Pomodoro, aglio e origano" },
        { nome: "Diavola", prezzo: "€10", descrizione: "Pomodoro, mozzarella e salame piccante" },
        { nome: "Quattro Formaggi", prezzo: "€11", descrizione: "Mozzarella, gorgonzola, parmigiano, fontina" },
        { nome: "Capricciosa", prezzo: "€12", descrizione: "Pomodoro, mozzarella, prosciutto, funghi, olive" },
        { nome: "Bufalina", prezzo: "€13", descrizione: "Pomodoro, mozzarella di bufala e basilico" }
    ],
    "insalate": [
        { nome: "Caesar", prezzo: "€10", descrizione: "Lattuga, pollo, crostini, parmigiano" },
        { nome: "Mediterranea", prezzo: "€9", descrizione: "Insalata mista, tonno, olive, mozzarella" }
    ],
    "dessert": [
        { nome: "Tiramisù", prezzo: "€6", descrizione: "Classico dessert al caffè" },
        { nome: "Panna Cotta", prezzo: "€5", descrizione: "Con coulis ai frutti di bosco" }
    ]
};

const faq = {
    "menu": "Il nostro menu include antipasti, primi piatti, pizze, insalate e dessert. Quale sezione ti interessa?",
    "prenotazione": "Puoi prenotare un tavolo chiamandoci al numero +39 123 456 789 o online. Per gruppi sopra le 8 persone, è richiesta una prenotazione con almeno 24 ore di anticipo.",
    "orari": `🕐 I nostri orari:
    Lun-Ven: 12:00-15:00, 19:00-23:00
    Sab-Dom: 10:00-23:00 (brunch 10:00-12:00)
    La cucina chiude 30 minuti prima`,
    "posizione": "📍 Via Roma 1, Milano\nMetro: Linea M1 fermata Duomo\nParcheggio convenzionato in Via Verdi 5",
    "allergie": "Disponiamo di opzioni per intolleranti e allergici. Il nostro staff è formato per gestire allergie alimentari. Informaci delle tue esigenze al momento dell'ordine.",
    "contatti": "📞 Tel: +39 123 456 789\n📧 Email: info@ristorante.com\n🌐 Web: www.ristorante.com",
    "eventi": `Organizziamo:
    - Feste private (max 50 persone)
    - Eventi aziendali
    - Cene di gala
    - Compleanni con menu personalizzato
    Richiedi un preventivo!`,
    "delivery": `🛵 Servizio delivery:
    - Ordine minimo: €20
    - Consegna gratuita entro 3km
    - Consegna in 30-45 minuti
    - Ordina via app o telefono
    🥡 Sconto 10% su asporto`,
    "come raggiungerci": "📍 Ci troviamo in Via Roma 1, Milano. Puoi raggiungerci in metro con la Linea M1, fermata Duomo. Disponiamo di un parcheggio convenzionato in Via Verdi 5.",
    "opzioni vegetariane": "🌱 Offriamo diverse opzioni vegetariane, tra cui la pizza Margherita, Caprese, Risotto allo zafferano, Insalata Mediterranea, e altre. Informaci delle tue preferenze al momento dell'ordine.",
    "prenota un tavolo": "Per prenotare un tavolo, chiamaci al numero +39 123 456 789 o visita il nostro sito web per prenotare online."

};

// Suggerimenti rapidi per l'utente
const quickSuggestions = [
    "Menu del giorno",
    "Prenota un tavolo",
    "Orari di apertura",
    "Come raggiungerci",
    "Opzioni vegetariane",
    "Delivery"
];

// Funzione per formattare i messaggi del menu
function formatMenuSection(section) {
    if (!menuDatabase[section]) return null;

    let response = `🍽️ Ecco i nostri ${section}:\n\n`;
    menuDatabase[section].forEach(item => {
        response += `${item.nome} - ${item.prezzo}\n`;
        response += `${item.descrizione}\n\n`;
    });
    return response;
}

// Funzione per aggiungere un messaggio alla chat con formattazione migliorata
function addMessage(sender, message) {
    const msg = document.createElement('div');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    msg.className = `message ${sender.toLowerCase()}-message`;
    msg.innerHTML = `
        <div class="message-header">
            <span class="sender">${sender}</span>
            <span class="time">${time}</span>
        </div>
        <div class="message-content">${message}</div>
    `;

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Funzione per aggiungere suggerimenti cliccabili
function addSuggestions() {
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'suggestions';

    quickSuggestions.forEach(suggestion => {
        const btn = document.createElement('button');
        btn.className = 'suggestion-btn';
        btn.textContent = suggestion;
        btn.onclick = () => {
            userInput.value = suggestion;
            sendMessage();
        };
        suggestionsDiv.appendChild(btn);
    });

    chatBox.appendChild(suggestionsDiv);
}

// Funzione migliorata per cercare risposte
function findResponse(userMessage) {
    userMessage = userMessage.toLowerCase();

    // Cerca nelle sezioni del menu
    for (const section in menuDatabase) {
        if (userMessage.includes(section)) {
            return formatMenuSection(section);
        }
    }

    // Cerca piatti specifici
    for (const section in menuDatabase) {
        const found = menuDatabase[section].find(item =>
            userMessage.includes(item.nome.toLowerCase())
        );
        if (found) {
            return `${found.nome} - ${found.prezzo}\n${found.descrizione}`;
        }
    }

    // Cerca nelle FAQ
    for (const key in faq) {
        if (userMessage.includes(key)) {
            return faq[key];
        }
    }

    return null;
}

// Funzione per gestire l'invio del messaggio
function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage('Tu', message);
    userInput.value = '';

    // Cerca una risposta locale
    const localResponse = findResponse(message);
    if (localResponse) {
        addMessage('Staff di Magna che te passa', localResponse);
    } else {
        addMessage('Staff di Magna che te passa', 'Mi dispiace, al momento non riesco a rispondere.');
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    addMessage('Staff di Magna che te passa', 'Ciao! Come posso aiutarti oggi? 😊');
    addSuggestions();
    startContinuousScroll();  // Avvia lo scorrimento continuo
    addCarouselControlEvents(); // Aggiungi eventi ai pulsanti di scorrimento
});

// Funzione per scorrimento continuo del carosello
const menuCarousel = document.querySelector('.menu-carousel');

function startContinuousScroll() {
    let scrollSpeed = 3; // Velocità dello scorrimento
    function scroll() {
        menuCarousel.scrollLeft += scrollSpeed;
        if (menuCarousel.scrollLeft >= menuCarousel.scrollWidth - menuCarousel.clientWidth) {
            menuCarousel.scrollLeft = 0; // Torna all'inizio
        }
        requestAnimationFrame(scroll);
    }
    scroll();
}

// Eventi per i pulsanti di scorrimento del carosello
function addCarouselControlEvents() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    prevBtn.addEventListener('click', () => {
        menuCarousel.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        menuCarousel.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    });
}