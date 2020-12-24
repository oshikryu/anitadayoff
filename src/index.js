import { DateTime } from 'luxon'
import fs from 'fs'
import csvParse from 'csv-parse'

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

  const monthsTouched = new Set()

  // assign days on and off
  input.forEach((arr) => {
    const [year, month, day] = arr
    const dt = DateTime.local(Number(year), Number(month), Number(day))
    const dayOfWeek = dt.weekday
    monthsTouched.add(dt.month)

    if (WEEKDAYS.includes(dayOfWeek)) {
      // day off
      daysOff.push(dt)
    } else if (WEEKEND.includes(dayOfWeek)) {
      weekendDaysOn.push(dt.day)
    }
  })

  // assign weekend days off
  Array.from(monthsTouched).forEach((month) => {
    const currentYear = DateTime.local().get('year')
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

const callback = (input) => {
  const daysOff = getDaysOff(input)
  const sorted = sortDaysOff(daysOff)
  const formatted = sorted.map((off) => {
    return `${off.weekdayShort} ${off.year}-${off.month}-${off.day}`
  })
  console.log(formatted);
  return formatted
}

/**
 *  read csv file
 *  export to array of arrays
 *
 *  @param {String} input file
 *  @return {Array}
 */
export const readCSV = (inputPath) => {
  const input = []
  fs.readFile(inputPath, function (err, fileData) {
    return csvParse(fileData, {columns: false, trim: true}, function(err, rows, idx) {
      callback(rows.splice(1))
      // Your CSV data is in an array of arrys passed to this callback as rows.
    })
  })
}
