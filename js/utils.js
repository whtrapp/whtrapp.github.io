export function dayOfTheWeek(day, month, year) {
    const weekday = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    return weekday[new Date(`${year}-${month}-${day}`).getDay()];
}

export function getMonth(day, month, year) {
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const d = new Date(new Date(`${year}-${month}-${day}`));
    return monthNames[d.getMonth()];
}
