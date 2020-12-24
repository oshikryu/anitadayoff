// ESM syntax is supported.
import fs from 'fs'
import csvParse from 'csv-parse'

import { getDaysOff, sortDaysOff, readCSV } from './src'

const FILENAME = process.env.INPUT_FILE || 'input.csv'
readCSV(FILENAME)
