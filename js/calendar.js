/**
 * CalendarJS is a free open source html css js calendar for integration in website or apps.
 * The project is currently under development.
 * @author Thomas Gouveia
 * @version 0.2
 * @see https://github.com/N4rkos/calendar-js
 */
class Calendar {

    /**
     * Initialize a new calendar
     */
    static init() {
        const calendar = document.getElementById('calendar')
        const previous = document.getElementById('previous')
        const next = document.getElementById('next')
        const panel = document.getElementById('panel')
        new Calendar(calendar, panel, [previous, next])
    }

    /**
     * Construct a calendar
     * @param {HTMLElement} calendar 
     */
    constructor(calendar, panel, controls) {
        //Define constants
        this.MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
        this.DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
        //Bind methods
        this.handleControl = this.handleControl.bind(this)
        this.handleDayClicked = this.handleDayClicked.bind(this)
        //Attributes
        this.currentDate = new Date()
        this.today = new Date()
        this.calendar = calendar
        this.controls = controls
        this.panel = panel
        this.active = null
        this.completeMonth = this.getDaysInMonthUTC()
        //Set the control listener
        for (let control of this.controls) control.addEventListener('click', this.handleControl)
        //Build the UI
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
        if(str === undefined) {
            str = this.DAYS[this.DAYS.length - 1]
        }
        return length ? str.substr(0, length) + '.' : str
    }

    /**
     * Format a date for display in the panel
     * @param {Date} date 
     */
    formatDate(date) {
        const day = date.getDate()
        const month = this.MONTHS[date.getMonth()]
        const dayLabel = this.format(this.DAYS[date.getDay() - 1], 3)
        return `${dayLabel} ${day} ${month.toLowerCase()}`
    }

    /**
     * Handle controls for the calendar
     * @param {Event} e 
     */
    handleControl(e) {
        if (e.target.getAttribute('id') === 'previous')
            this.setPreviousMonth()
        else
            this.setNextMonth()
    }

    /**
     * Set the date to the next month
     */
    setNextMonth() {
        let date = new Date(Date.UTC(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1))
        this.setDate(date)
    }

    /**
     * Set the date to the previous month
     */
    setPreviousMonth() {
        let date = new Date(Date.UTC(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1))
        this.setDate(date)
    }

    /**
     * Set the new date
     * @param {Date} date 
     */
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

    /**
     * Returns an array of all dates in the current month
     */
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
        dayCard.setAttribute('date', day.toUTCString())
        if (today) dayCard.style.backgroundColor = '#6236ff'
        dayCard.style.height = `calc(100% / ${this.getNumberOfWeeks()} - 5px)`
        dayCard.style.left = `calc(${this.whichDay(day.getDay())} * (100%/7))`
        dayCard.style.top = offsetTop + '%';
        dayCard.innerHTML = `<span style="color:${today ? "#fff" : "rgba(114, 114, 114, 0.664)"}">${day.getDate()}</span>`
        dayCard.addEventListener('click', this.handleDayClicked)
        return dayCard
    }

    buildPanel() {
        //Header
        let header = document.createElement('div')
        header.setAttribute('class', 'panel-header')
        header.innerHTML = `<h1>${this.formatDate(this.currentDate)}</h1>`
        //Content

        //Button
        let button = document.createElement('button')
        button.setAttribute('class', 'panel-add-button')
        button.innerText = 'Ajouter une tâche'


        this.panel.appendChild(header)
        this.panel.appendChild(button)
    }

    handleDayClicked(event) {
        let clicked = event.target
        if (clicked === this.active)
            this.clearActive()
        else
            this.setActive(clicked)
    }

    /**
     * Set active the calendar
     * @param {HTMLElement} e card which was clicked
     */
    setActive(e) {
        if (this.active != null) this.clearActive()
        //Store the active day card into active attribute
        this.currentDate = new Date(Date.parse(e.getAttribute('date')))
        this.active = e
        this.calendar.classList.add('active')
        this.panel.classList.add('active')
        this.active.classList.add('active')
        this.clearPanel()
        this.buildPanel()
    }

    /**
     * Remove active from calendar
     */
    clearActive() {
        this.clearPanel()
        let activeElements = document.querySelectorAll('.active')
        this.active = null
        this.currentDate = this.today
        if (activeElements.length != 0)
            for (let active of activeElements)
                active.classList.remove('active')
    }

    /**
     * Clear the panel content
     */
    clearPanel() {
        var e = this.panel
        var child = e.lastElementChild;
        while (child) {
            e.removeChild(child);
            child = e.lastElementChild;
        }
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