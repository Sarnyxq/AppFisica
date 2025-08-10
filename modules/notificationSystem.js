// NOTIFICATION SYSTEM - Fisica 3.0
// Sistema di notifiche per il Grimorio dell'Apprendista Stregone

class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.maxNotifications = 5;
        this.defaultDuration = 4000;
    }

    // Inizializza il sistema di notifiche
    init() {
        this.container = document.getElementById('notification-area');
        if (!this.container) {
            console.error('Container delle notifiche non trovato!');
            return false;
        }
        return true;
    }

    // Mostra una notifica
    show(message, type = "info", duration = null) {
        if (!this.container) {
            console.warn('Sistema di notifiche non inizializzato');
            return;
        }

        // Limita il numero di notifiche visibili
        if (this.notifications.length >= this.maxNotifications) {
            this.removeOldest();
        }

        const notification = this.createNotification(message, type, duration);
        this.notifications.push(notification);
        this.container.appendChild(notification.element);

        // Animazione di ingresso
        setTimeout(() => {
            notification.element.classList.add('appear');
        }, 10);

        // Auto-rimozione
        if (notification.duration > 0) {
            notification.timeout = setTimeout(() => {
                this.remove(notification.id);
            }, notification.duration);
        }

        return notification.id;
    }

    // Crea l'elemento notifica
    createNotification(message, type, duration) {
        const id = this.generateId();
        const element = document.createElement('div');
        
        // Configurazione basata sul tipo
        const config = this.getTypeConfig(type);
        
        element.className = `notification ${config.classes}`;
        element.dataset.id = id;
        
        element.innerHTML = `
            <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2 flex-grow">
                    <span class="text-xl">${config.icon}</span>
                    <span class="text-sm font-medium">${message}</span>
                </div>
                <button class="notification-close text-white hover:text-gray-200 text-lg" onclick="notificationSystem.remove('${id}')">
                    ×
                </button>
            </div>
        `;

        return {
            id,
            element,
            type,
            message,
            duration: duration || config.duration,
            createdAt: Date.now()
        };
    }

    // Configurazione per i diversi tipi di notifica
    getTypeConfig(type) {
        const configs = {
            info: {
                classes: 'bg-blue-500 text-white',
                icon: 'ℹ️',
                duration: this.defaultDuration
            },
            success: {
                classes: 'bg-green-500 text-white',
                icon: '✅',
                duration: this.defaultDuration
            },
            warning: {
                classes: 'bg-yellow-500 text-white',
                icon: '⚠️',
                duration: this.defaultDuration + 1000
            },
            error: {
                classes: 'bg-red-500 text-white',
                icon: '❌',
                duration: this.defaultDuration + 2000
            },
            exp: {
                classes: 'bg-yellow-500 text-white shimmer',
                icon: '⭐',
                duration: 3000
            },
            levelup: {
                classes: 'bg-purple-500 text-white new-badge',
                icon: '🎉',
                duration: 5000
            },
            badge: {
                classes: 'bg-gold text-ink-dark badge-unlocked',
                icon: '🏆',
                duration: 4000
            }
        };

        return configs[type] || configs.info;
    }

    // Rimuove una notifica specifica
    remove(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;

        // Cancella il timeout se esiste
        if (notification.timeout) {
            clearTimeout(notification.timeout);
        }

        // Animazione di uscita
        notification.element.classList.add('disappear');
        
        setTimeout(() => {
            if (notification.element.parentNode) {
                notification.element.parentNode.removeChild(notification.element);
            }
            this.notifications = this.notifications.filter(n => n.id !== notificationId);
        }, 300);
    }

    // Rimuove la notifica più vecchia
    removeOldest() {
        if (this.notifications.length > 0) {
            const oldest = this.notifications.reduce((prev, current) => 
                prev.createdAt < current.createdAt ? prev : current
            );
            this.remove(oldest.id);
        }
    }

    // Rimuove tutte le notifiche
    removeAll() {
        this.notifications.forEach(notification => {
            if (notification.timeout) {
                clearTimeout(notification.timeout);
            }
            if (notification.element.parentNode) {
                notification.element.parentNode.removeChild(notification.element);
            }
        });
        this.notifications = [];
    }

    // Notifiche specifiche per il Grimorio
    showChallengeCompleted(challenge) {
        this.show(`${challenge.badge.icon} ${challenge.title} completata!`, "success");
        this.show(`+${challenge.exp} EXP`, "exp");
        this.show(`${challenge.badge.name} ottenuto!`, "badge");
    }

    showSideQuestCompleted(challenge, bonusExp) {
        this.show(`Missione Secondaria completata!`, "success");
        this.show(`+${bonusExp} EXP (Bonus Pratica)`, "exp");
        this.show(`${challenge.sideQuest.badge.name} ottenuto!`, "badge");
    }

    showLevelUp(newLevel) {
        this.show(`🎉 Livello ${newLevel} raggiunto!`, "levelup", 6000);
    }

    showZoneUnlocked(zone) {
        this.show(`${zone.icon} ${zone.title} sbloccato!`, "success", 5000);
    }

    showProgressSaved() {
        this.show("Progressi salvati", "info", 2000);
    }

    showError(message) {
        this.show(message, "error");
    }

    showWarning(message) {
        this.show(message, "warning");
    }

    showInfo(message) {
        this.show(message, "info");
    }

    // Notifica di benvenuto personalizzata
    showWelcome(playerName) {
        this.show(`Benvenuto nel Grimorio, ${playerName}!`, "success", 5000);
        setTimeout(() => {
            this.show("Esplora le zone per iniziare il tuo viaggio nell'apprendimento della fisica!", "info", 6000);
        }, 1000);
    }

    // Notifica per errori di validazione
    showValidationError(field) {
        const messages = {
            name: "Per favore, inserisci un nome per il tuo apprendista.",
            drawing: "Completa il disegno del sigillo prima di procedere.",
            text: "Scrivi qualche annotazione prima di forgiare il sigillo."
        };
        this.show(messages[field] || "Controlla i dati inseriti.", "error");
    }

    // Notifica di motivazione casuale
    showMotivationalMessage() {
        const messages = [
            "Continua così, la conoscenza ti attende! 🧠",
            "Ogni sfida ti avvicina alla maestria! ⚡",
            "Il sapere è il potere più grande! 🔮",
            "La fisica svela i segreti dell'universo! 🌟",
            "Perseveranza e studio portano alla saggezza! 💎"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.show(randomMessage, "info", 3000);
    }

    // Genera ID unico per le notifiche
    generateId() {
        return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Ottieni statistiche delle notifiche
    getStats() {
        return {
            active: this.notifications.length,
            total: this.notifications.length,
            types: this.notifications.reduce((acc, notif) => {
                acc[notif.type] = (acc[notif.type] || 0) + 1;
                return acc;
            }, {})
        };
    }

    // Debug info
    getDebugInfo() {
        return {
            containerExists: !!this.container,
            activeNotifications: this.notifications.length,
            maxNotifications: this.maxNotifications,
            notifications: this.notifications.map(n => ({
                id: n.id,
                type: n.type,
                message: n.message.substring(0, 50) + '...',
                age: Date.now() - n.createdAt
            }))
        };
    }
}

// Crea istanza globale
const notificationSystem = new NotificationSystem();

// Rendi globale per l'accesso da altri moduli
window.notificationSystem = notificationSystem;

// Inizializza automaticamente quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    notificationSystem.init();
});
