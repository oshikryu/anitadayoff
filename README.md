# anitadayoff
Determine days off by reading a csv file and parsing dates using luxon.js. From list of dates, create google calendar events

### Install
```
yarn install
```
1. create a `input.csv` file to read dates with the headers:
```
year,month,day
2020,12,25
```

### Run

- you need a `credentials.json` and `token.json` in the `src/` directory
- `node src/gcal.js`

```
yarn start

// Or optionally your own csv file
yarn start INPUT_FILE="another.csv"
```

### Development plan
current version 0.0.1
- read csv or external file
- log out days off
- google calendar entry created from output

future:
- OCR from picture for initials
- Holidays are treated like weekends?


### Resources
https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html

https://stackoverflow.com/questions/41776978/how-to-read-csv-file-in-node-js

https://developers.google.com/calendar/quickstart/nodejs

https://developers.google.com/calendar/auth

