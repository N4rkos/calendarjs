class Calendar {

    static init() {
        const calendar = document.getElementById('calendar')
        const previous = document.getElementById('previous')
        const next = document.getElementById('next')
        new Calendar(calendar, [previous, next])
    }

    /**
     * Construct a calendar
     * @param {HTMLElement} calendar 
     */
    constructor(calendar, controls) {
        this.MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
        this.DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
        this.handleControl = this.handleControl.bind(this)
        this.currentDate = new Date()
        this.today = new Date()
        this.calendar = calendar
        this.controls = controls
        this.completeMonth = this.getDaysInMonthUTC()
        for (let control of this.controls) {
            control.addEventListener('click', this.handleControl)
        }
        this.injectDate()
        this.injectLabels()
        this.buildCalendar()
    }

    /**
     * Build date and inject it to HTML
     */
    injectDate() {
        var date = document.getElementById('month')
        var month = this.MONTHS[this.currentDate.getMonth()];
        date.innerText = `${month} ${this.currentDate.getFullYear()}`
    }

    /**
     * Build days labels and inject them to HTML
     */
    injectLabels() {
        let labels = document.createElement('div')
        labels.setAttribute('class', 'days-label')
        for (let day of this.DAYS) {
            let dayLabel = document.createElement('div')
            dayLabel.setAttribute('class', 'day-label')
            dayLabel.innerText = this.format(day, 3)
            labels.appendChild(dayLabel)
        }
        this.calendar.appendChild(labels)
    }

    /**
     * Format a string
     * @param {string} str 
     * @param {number|null} length 
     */
    format(str, length) {
        return length ? str.substr(0, length) + '.' : str
    }

    handleControl(e) {
        if (e.target.getAttribute('id') === 'previous')
            this.setPreviousMonth()
        else
            this.setNextMonth()
    }

    setNextMonth() {
        let date = new Date(Date.UTC(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1))
        this.setDate(date)
    }

    setPreviousMonth() {
        let date = new Date(Date.UTC(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1))
        this.setDate(date)
    }

    setDate(date) {
        this.currentDate = date
        this.completeMonth = this.getDaysInMonthUTC()
        this.clearCalendar()
        this.injectDate()
        this.buildCalendar()
    }

    /**
     * Returns true if date is already past
     * @param {Date} date 
     */
    isPastDate(date) {
        return this.today.getDate() > date.getDate() && this.today.getMonth() >= date.getMonth() && this.today.getFullYear() >= date.getFullYear()
    }

    getDaysInMonthUTC() {
        const month = this.currentDate.getMonth()
        const year = this.currentDate.getFullYear()
        var date = new Date(Date.UTC(year, month, 1))
        var days = []
        while (date.getUTCMonth() === month) {
            days.push(new Date(date))
            date.setUTCDate(date.getUTCDate() + 1)
        }
        return days
    }

    /**
     * Build the calendar
     */
    buildCalendar() {
        //Build container
        let container = document.createElement('div')
        container.setAttribute('class', 'days-grid')
        container.setAttribute('id', 'days-grid')
        let offsetTop = 0;
        for (let i = 0; i < this.completeMonth.length; i++) {
            let day = this.completeMonth[i]
            if (day) {
                container.appendChild(this.buildDayCard(day, offsetTop))
                if (this.isSunday(day.getDay()))
                    offsetTop += 100 / this.getNumberOfWeeks()
            }
        }
        this.calendar.appendChild(container)
    }

    /**
     * Build a day card
     * @param {Date} day the day
     * @param {number} offsetTop the space between top of card and top
     */
    buildDayCard(day, offsetTop) {
        let today = this.isToday(day);
        let dayCard = document.createElement('div')
        dayCard.setAttribute('class', 'day-card')
        if (today) dayCard.style.backgroundColor = "#6236ff"
        dayCard.style.height = `calc(100% / ${this.getNumberOfWeeks()} - 5px)`
        dayCard.style.left = `calc(${this.whichDay(day.getDay())} * (100%/7))`
        dayCard.style.top = offsetTop + '%';
        dayCard.innerHTML = `<span style="color:${today ? "#fff" : "rgba(114, 114, 114, 0.664)"}">${day.getDate()}</span>`
        return dayCard
    }

    /**
     * Clear the calendar
     */
    clearCalendar() {
        document.getElementById('days-grid').remove()
    }
    /**
     * Returns true if day is today
     * @param {Date} day 
     */
    isToday(day) {
        return day.getFullYear() === this.today.getFullYear() && this.today.getMonth() === day.getMonth() && this.today.getDate() === day.getDate()
    }

    /**
     * Returns true if monday
     * @param {number} weekday 
     */
    isSunday(weekday) {
        return weekday === 0;
    }

    /**
     * Determine which column is day
     * @param {number} weekday 
     */
    whichDay(weekday) {
        return this.isSunday(weekday) ? 6 : weekday - 1
    }

    /**
     * Returns the number of weeks in the month
     */
    getNumberOfWeeks() {
        let count = 1
        for (let i = 0; i < this.completeMonth.length; i++) {
            if (i % 7 === 0)
                count++
        }
        return count
    }
}
Calendar.init();