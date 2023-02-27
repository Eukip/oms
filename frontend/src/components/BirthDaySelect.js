import React, { useState, useEffect } from 'react'
import {CFormGroup, CSelect, CRow, CCol, CLabel} from "@coreui/react"
import { getDays, getMonths, getYears, daysInMonth } from '../utils/date'

const days = getDays()
const months = getMonths()
const years = getYears()

function BirthDaySelect({ day = 1, month = 1, year = 1970, disabled, setBirthDate }) {

    const [selectedDay, setSelectedDay] = useState(day)
    const [selectedMonth, setSelectedMonth] = useState(month)
    const [selectedYear, setSelectedYear] = useState(year)
    const [error, setError] = useState(null)

    useEffect(() => {
        const dim = daysInMonth(selectedMonth, selectedYear)

        if (selectedDay > dim){
            setError('Неправильная дата')
        } else {
            setError(null)
            setBirthDate(`${year}-${month}-${day}`)
        }

    }, [selectedDay, selectedMonth, selectedYear])

    const onYearChange = event => {
        const year = event.target.value
        setSelectedYear(year)
    }

    const onMonthChange = event => {
        const month = event.target.value
        setSelectedMonth(month)
    }

    const onDayChange = event => {
        const day = event.target.value
        setSelectedDay(day)
    }

    return (
        <>
            <CLabel>Дата рождения</CLabel>
            <CRow>
                <CCol md={3}>
                    <CSelect value={selectedDay} onChange={onDayChange} className={error ? 'border-danger' : ''} disabled={disabled}>
                        { days.map(d => <option key={d} value={d}>{d}</option>) }
                    </CSelect>
                </CCol>
                <CCol md={5}>
                    <CSelect value={selectedMonth} onChange={onMonthChange} disabled={disabled}>
                        { months.map(({value, label}) => <option key={value} value={value}>{label}</option> ) }
                    </CSelect>
                </CCol>
                <CCol md={4}>
                    <CSelect value={selectedYear} onChange={onYearChange} disabled={disabled}>
                        { years.map(y => <option key={y} value={y}>{y}</option>) }
                    </CSelect>
                </CCol>
            </CRow>
            { error && <div className="text-danger">{ error }</div> }
        </>
    )
}

export default BirthDaySelect