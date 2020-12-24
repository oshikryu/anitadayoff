# anitadayoff
Determine days off 

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
```
yarn start
```

v0
Or optionally your own csv file
```
yarn start INPUT_FILE="another.csv"
```

v1
- you need a credentials.json and token.json in the root directory
- `node gcal.js`

### Development plan
v0
- read csv?? or external file
- log out days off

v1
- google calendar entry created from output

v2
- OCR from picture for initials
