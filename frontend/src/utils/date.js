export const getYears = () => {
    const years = []
    const startYear = 1900
    const endYear = 2021

    for (let year = endYear; year >= startYear; year--){
        years.push(year)
    }

    return years
}

export const getMonths = () => ([
    {value: 1, label: 'Январь'},
    {value: 2, label: 'Февраль'},
    {value: 3, label: 'Март'},
    {value: 4, label: 'Апрель'},
    {value: 5, label: 'Май'},
    {value: 6, label: 'Июнь'},
    {value: 7, label: 'Июль'},
    {value: 8, label: 'Август'},
    {value: 9, label: 'Сентябрь'},
    {value: 10, label: 'Октябрь'},
    {value: 11, label: 'Ноябрь'},
    {value: 12, label: 'Декабрь'}
])

export const getDays = () => {
    const days = []
    const startDay = 1
    const endDay = 31

    for (let day = startDay; day <= endDay; day++){
        days.push(day)
    }

    return days
}

// Use 1 for January, 2 for February, etc.
export const daysInMonth = (month, year) => new Date(year, month, 0).getDate()