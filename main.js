// ESM syntax is supported.
import { getDaysOff, sortDaysOff, readCSV } from './src'

const FILENAME = process.env.INPUT_FILE || 'input.csv'
readCSV(FILENAME)
