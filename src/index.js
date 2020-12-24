import { DateTime } from 'luxon'
import fs from 'fs'
import csvParse from 'csv-parse'
import { processCalendarEvents } from './calendar'

export const WEEKDAYS = [ 1,2,3,4,5 ]
export const WEEKEND = [ 6,7 ]

/**
 * Given array of days, return only days off
 *
 * Weekday input = day off
 * Weekend input = day on
 *
 * @param {Array} input - array of arrays [[YYYY, MM, DD]]
 * @method getDaysOff
 * @return {Array}
 */
export function getDaysOff(input) {
  // array of DateTime 
  const daysOff = []
  // array of numbers
  const weekendDaysOn = []

  const monthCounter = []
  const monthsTouched = []

  // assign days on and off
  input.forEach((arr) => {
    const [year, month, day] = arr
    const dt = DateTime.local(Number(year), Number(month), Number(day))
    const dayOfWeek = dt.weekday

    const curMonth = dt.month
    if (!monthCounter.includes(curMonth)) {
      monthsTouched.push(dt)
      monthCounter.push(curMonth)
    }

    if (WEEKDAYS.includes(dayOfWeek)) {
      // day off
      daysOff.push(dt)
    } else if (WEEKEND.includes(dayOfWeek)) {
      weekendDaysOn.push(dt.day)
    }
  })

  // assign weekend days off
  monthsTouched.forEach((dt) => {
    const currentYear = dt.get('year')
    const month = dt.get('month')
    const luxonMonth = DateTime.local(currentYear, month)
    const daysInMonth = luxonMonth.get('daysInMonth')
    for (let idx=1; idx<=daysInMonth; idx +=1) {
      const curDay = DateTime.local(currentYear, month, idx)
      const dayOfWeek = curDay.weekday
      if (WEEKEND.includes(dayOfWeek)) {
        if (!weekendDaysOn.includes(curDay.day)) {
          daysOff.push(curDay)
        }
      }
    }
  })
  return daysOff
}

/**
 * Sort dates by timestamp
 *
 * @param {Array}
 * @return {Array}
*/
export const sortDaysOff = (input) => {
  return input.sort((a,b) => {
    return a.toMillis() - b.toMillis()
  })
}

const processCsv = (input) => {
  const daysOff = getDaysOff(input)
  const sorted = sortDaysOff(daysOff)
  const debugMode = sorted.map((off) => {
    return `${off.weekdayShort} ${off.year}-${off.month}-${off.day}`
  })
  // console.log(debugMode);
  return sorted.map((off) => {
    const paddedMonth = `${off.month}`.padStart(2, 0)
    const paddedDay = `${off.day}`.padStart(2, 0)
    return `${off.year}-${paddedMonth}-${paddedDay}`
  })
}

/**
 *  read csv file
 *  export to array of arrays
 *
 *  @param {String} input file
 *  @return {Array}
 */
export const readCSV = (inputPath) => {
  fs.readFile(inputPath, function (err, fileData) {
    csvParse(fileData, {columns: false, trim: true}, function(err, rows, idx) {
      const results = processCsv(rows.splice(1))
      processCalendarEvents(results)
      // Your CSV data is in an array of arrys passed to this callback as rows.
    })

  })
}
