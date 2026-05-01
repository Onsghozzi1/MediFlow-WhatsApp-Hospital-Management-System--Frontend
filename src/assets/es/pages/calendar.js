function getDate(dayString) {
    const today = new Date()
    const year = today.getFullYear().toString()
    let month = (today.getMonth() + 1).toString()

    if (month.length === 1) {
        month = '0' + month
    }

    return dayString.replace('YEAR', year).replace('MONTH', month)
}

const defaultColorList = {
    red: {
        bg: 'bg-red-50 dark:bg-red-500/10',
        text: 'text-red-500 dark:text-red-100',
        dot: 'bg-red-500',
    },
    orange: {
        bg: 'bg-orange-50 dark:bg-orange-500/10',
        text: 'text-orange-500 dark:text-orange-100',
        dot: 'bg-orange-500',
    },
    amber: {
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        text: 'text-amber-500 dark:text-amber-100',
        dot: 'bg-amber-500',
    },
    yellow: {
        bg: 'bg-yellow-50 dark:bg-yellow-500/10',
        text: 'text-yellow-500 dark:text-yellow-100',
        dot: 'bg-yellow-500',
    },
    lime: {
        bg: 'bg-lime-50 dark:bg-lime-500/10',
        text: 'text-lime-500 dark:text-lime-100',
        dot: 'bg-lime-500',
    },
    green: {
        bg: 'bg-green-50 dark:bg-green-500/10',
        text: 'text-green-500 dark:text-green-100',
        dot: 'bg-green-500',
    },
    emerald: {
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        text: 'text-emerald-500 dark:text-emerald-100',
        dot: 'bg-emerald-500',
    },
    teal: {
        bg: 'bg-teal-50 dark:bg-teal-500/10',
        text: 'text-teal-500 dark:text-teal-100',
        dot: 'bg-teal-500',
    },
    cyan: {
        bg: 'bg-cyan-50 dark:bg-cyan-500/10',
        text: 'text-cyan-500 dark:text-cyan-100',
        dot: 'bg-cyan-500',
    },
    sky: {
        bg: 'bg-sky-50 dark:bg-sky-500/10',
        text: 'text-sky-500 dark:text-sky-100',
        dot: 'bg-sky-500',
    },
    blue: {
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        text: 'text-blue-500 dark:text-blue-100',
        dot: 'bg-blue-500',
    },
    indigo: {
        bg: 'bg-indigo-50 dark:bg-indigo-500/10',
        text: 'text-indigo-500 dark:text-indigo-100',
        dot: 'bg-indigo-500',
    },
    purple: {
        bg: 'bg-purple-50 dark:bg-purple-500/10',
        text: 'text-purple-500 dark:text-purple-100',
        dot: 'bg-purple-500',
    },
    fuchsia: {
        bg: 'bg-fuchsia-50 dark:bg-fuchsia-500/10',
        text: 'text-fuchsia-500 dark:text-fuchsia-100',
        dot: 'bg-fuchsia-500',
    },
    pink: {
        bg: 'bg-pink-50 dark:bg-pink-500/10',
        text: 'text-pink-500 dark:text-pink-100',
        dot: 'bg-pink-500',
    },
    rose: {
        bg: 'bg-rose-50 dark:bg-rose-500/10',
        text: 'text-rose-500 dark:text-rose-100',
        dot: 'bg-rose-500',
    },
}

const eventsData = [
    {
        id: '0',
        title: 'All Day Event',
        start: getDate('YEAR-MONTH-01'),
        eventColor: 'orange',
    },
    {
        id: '1',
        title: 'Long Event',
        start: getDate('YEAR-MONTH-07'),
        end: getDate('YEAR-MONTH-10'),
        eventColor: 'red',
    },
    {
        id: '2',
        groupId: '999',
        title: 'Repeating Event',
        start: getDate('YEAR-MONTH-09T16:00:00+00:00'),
        eventColor: 'blue',
    },
    {
        id: '3',
        groupId: '999',
        title: 'Repeating Event',
        start: getDate('YEAR-MONTH-16T16:00:00+00:00'),
        eventColor: 'blue',
    },
    {
        id: '4',
        title: 'Conference',
        start: 'YEAR-MONTH-17',
        end: getDate('YEAR-MONTH-19'),
        eventColor: 'blue',
    },
    {
        id: '5',
        title: 'Meeting',
        start: getDate('YEAR-MONTH-18T10:30:00+00:00'),
        end: getDate('YEAR-MONTH-18T12:30:00+00:00'),
        eventColor: 'blue',
    },
    {
        id: '6',
        title: 'Lunch',
        start: getDate('YEAR-MONTH-18T12:00:00+00:00'),
        eventColor: 'emerald',
    },
    {
        id: '7',
        title: 'Birthday Party',
        start: getDate('YEAR-MONTH-19T07:00:00+00:00'),
        eventColor: 'purple',
    },
    {
        id: '8',
        title: 'Meeting',
        start: getDate('YEAR-MONTH-18T14:30:00+00:00'),
        eventColor: 'blue',
    },
    {
        id: '9',
        title: 'Happy Hour',
        start: getDate('YEAR-MONTH-18T17:30:00+00:00'),
        eventColor: 'cyan',
    },
    {
        id: '10',
        title: 'Dinner',
        start: getDate('YEAR-MONTH-18T20:00:00+00:00'),
        eventColor: 'emerald',
    },
]

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'title',
            center: '',
            right: 'dayGridMonth,timeGridWeek,timeGridDay prev,next',
        },
        selectable: true,
        editable: true,
        events: eventsData,
        eventContent: (args) => {
            const extendedProps = args.event.extendedProps
            const { isEnd, isStart } = args

            const bgColor = extendedProps.eventColor ? defaultColorList[extendedProps.eventColor]?.bg : ''
            const textColor = extendedProps.eventColor ? defaultColorList[extendedProps.eventColor]?.text : ''
            const badgeColor = extendedProps.eventColor ? defaultColorList[extendedProps.eventColor]?.dot : ''
            const rediusLeft = (isEnd &&  !isStart && '!rounded-tl-none !rounded-bl-none !rtl:rounded-tr-none !rtl:rounded-br-none') || ''
            const radiusRight = (!isEnd && isStart && '!rounded-tr-none !rounded-br-none !rtl:rounded-tl-none !rtl:rounded-bl-none') || ''

            const badge = `<span class="badge-dot mr-1 rtl:ml-1 ${badgeColor}"></span>`
            const timeText = `<span>${args.timeText}</span>`

            const text = `<div class="custom-calendar-event ${[bgColor, textColor, rediusLeft, radiusRight].join(' ')}" >${!(isEnd && !isStart) ? badge + timeText : ''}<span class="font-semibold ml-1 rtl:mr-1">${args.event._def.title}</span>
                    </div>`;

            return {
                html: text
            };
        }
    });

    calendar.render();
  });
