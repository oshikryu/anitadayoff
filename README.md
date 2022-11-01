# anitadayoff
Determine days off by reading a csv file and parsing dates using luxon.js. From list of dates, create google calendar events

### Install and dependencies
```
yarn install
```

Create a `input.csv` file to read dates with the headers:
```
year,month,day
2020,12,25
```


You need to generate a `credentials.json` and `token.json` in the `root` directory.
Optionally do the quickstart method by running
```
node gcal.js
```

### Run


```
yarn start

// Or optionally your own csv file
yarn start INPUT_FILE="another.csv"
```

### Maintenance
#### Holidays
To maintain holiday logic, update the `holidayDateArray` in `src/constants.js` so they are treated
like weekends. They change from year to year

### Development plan
current version 0.0.1
- read csv or external file
- log out days off
- google calendar entry created from output
- Holidays are treated like weekends

future:
- OCR from picture for initials


### Resources
https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html

https://stackoverflow.com/questions/41776978/how-to-read-csv-file-in-node-js

https://developers.google.com/calendar/quickstart/nodejs

https://developers.google.com/calendar/auth

