class DigitalClock {
    constructor() {
        this.timezones = [];
        this.storageKey = 'digitalClockTimezones';
        this.initializeElements();
        this.loadTimezones();
        this.attachEventListeners();
        this.render();
        this.startClock();
    }

    initializeElements() {
        this.timezoneInput = document.getElementById('timezoneInput');
        this.addBtn = document.getElementById('addBtn');
        this.clocksContainer = document.getElementById('clocksContainer');
        this.clearAllBtn = document.getElementById('clearAll');
        this.quickBtns = document.querySelectorAll('.quick-btn');
    }

    attachEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTimezone());
        this.timezoneInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTimezone();
        });
        this.clearAllBtn.addEventListener('click', () => this.clearAll());
        this.quickBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const zone = e.target.dataset.zone;
                this.addTimezoneIfUnique(zone);
            });
        });
    }

    addTimezone() {
        const timezone = this.timezoneInput.value.trim();
        if (timezone === '') {
            alert('Please enter a timezone!');
            return;
        }
        try {
            new Intl.DateTimeFormat('en-US', { timeZone: timezone });
        } catch (error) {
            alert('Invalid timezone: ' + timezone);
            return;
        }
        this.addTimezoneIfUnique(timezone);
    }

    addTimezoneIfUnique(timezone) {
        if (this.timezones.some(tz => tz.name === timezone)) {
            alert(timezone + ' is already added!');
            return;
        }
        this.timezones.push({ id: Date.now(), name: timezone });
        this.timezoneInput.value = '';
        this.timezoneInput.focus();
        this.saveTimezones();
        this.render();
    }

    removeTimezone(id) {
        this.timezones = this.timezones.filter(tz => tz.id !== id);
        this.saveTimezones();
        this.render();
    }

    clearAll() {
        if (confirm('Are you sure you want to remove all time zones?')) {
            this.timezones = [];
            this.saveTimezones();
            this.render();
        }
    }

    getTimeInTimezone(timezone) {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        const dateFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
        const time = formatter.format(now);
        const date = dateFormatter.format(now);
        const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        const offset = (tzDate - utcDate) / (1000 * 60 * 60);
        const offsetStr = offset >= 0 ? '+' + offset.toFixed(1) : offset.toFixed(1);
        return { time: time, date: date, offset: offsetStr };
    }

    render() {
        this.clocksContainer.innerHTML = '';
        if (this.timezones.length === 0) {
            this.clocksContainer.innerHTML = '<div class="empty-state"><p>Add a time zone to get started!</p></div>';
        } else {
            this.timezones.forEach(tz => {
                const data = this.getTimeInTimezone(tz.name);
                const card = document.createElement('div');
                card.className = 'clock-card';
                card.innerHTML = '<div class="timezone-name">' + this.escapeHtml(tz.name) + '</div>' +
                    '<div class="time-display">' + data.time + '</div>' +
                    '<div class="date-display">' + data.date + '</div>' +
                    '<div class="timezone-offset">UTC ' + data.offset + '</div>' +
                    '<button class="remove-btn" onclick="clock.removeTimezone(' + tz.id + ')">Remove</button>';
                this.clocksContainer.appendChild(card);
            });
        }
    }

    startClock() {
        setInterval(() => this.render(), 1000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTimezones() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.timezones));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    loadTimezones() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.timezones = JSON.parse(stored);
            } else {
                this.timezones = [
                    { id: 1, name: 'UTC' },
                    { id: 2, name: 'America/New_York' },
                    { id: 3, name: 'Asia/Tokyo' }
                ];
                this.saveTimezones();
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            this.timezones = [];
        }
    }
}

let clock;
document.addEventListener('DOMContentLoaded', () => {
    clock = new DigitalClock();
});