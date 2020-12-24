import fs from 'fs'
import readline from 'readline'
import { google } from 'googleapis'

const SUMMARY_TITLE = 'Anita off'
const MAX_RESULTS = 30
const TIMEOUT_INTERVAL = 5000
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';

export const processCalendarEvents = async (dates) => {
  const params = {
    dates
  }

  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), listEvents, params);
  });
}

export function listEvents(auth, params) {
  const { dates } = params
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: MAX_RESULTS,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      const preexisting = events.filter((event, i) => {
        return event.summary === SUMMARY_TITLE
      }).map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        return start
      });

      const filteredDates = dates.filter((date) => {
        return !preexisting.includes(date)
      })
      console.log('Time off to add', filteredDates);

      const params = {
        dates: filteredDates
      }
      // insertEvents(auth, params)

    }
  });
}

export function insertEvents(auth, params) {
  const { dates=[] } = params
  const calendar = google.calendar({version: 'v3', auth});
  dates.forEach((date) => {
    setTimeout(TIMEOUT_INTERVAL)

    const event = {
      summary: SUMMARY_TITLE,
      start: {
        date,
      },
      end: {
        date,
      },
    }

    // to prevent rate limit issues
    calendar.events.insert({
      auth,
      calendarId: 'primary',
      resource: event,
    }, (err, res) => {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
      }
      console.log('Event created: %s', event.start.date);
    });
  })
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, params) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    return callback(oAuth2Client, params);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      return callback(oAuth2Client);
    });
  });
}
