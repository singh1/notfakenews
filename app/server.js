import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import botkit from 'botkit';
import axios from 'axios';

dotenv.config({ silent: true });

// initialize
const app = express();
// const ROOT_URL = 'http://singh1-blog.herokuapp.com/api';


// enable/disable cross origin resource sharing if necessary
app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static('static'));
// enables static assets from folder static
app.set('views', path.join(__dirname, '../app/views'));
// this just allows us to render ejs from the ../app/views directory

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// botkit controller
const controller = botkit.slackbot({
  debug: false,
});

 // initialize slackbot
const slackbot = controller.spawn({
  token: process.env.SLACK_BOT_TOKEN,
   // this grabs the slack token we exported earlier
}).startRTM((err) => {
   // start the real time message client
  if (err) { throw new Error(err); }
});

 // prepare webhook
 // for now we won't use this but feel free to look up slack webhooks
controller.setupWebserver(process.env.PORT || 3001, (err, webserver) => {
  controller.createWebhookEndpoints(webserver, slackbot, () => {
    if (err) { throw new Error(err); }
  });
});

// example hello response
controller.hears(['hello', 'hi', 'howdy', 'help'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
  bot.api.users.info({ user: message.user }, (err, res) => {
    if (res) {
      bot.reply(message, `Welcome, ${res.user.name}! I can tell you the most poppin' articles in the New York Times today. Tell me which section you're interested in! (World | U.S. | Business Day | Technology | Sports | Opinion)`);
    } else {
      bot.reply(message, 'Hello there!');
    }
  });
});

controller.hears(['World', 'International'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
  const url = 'http://api.nytimes.com/svc/mostpopular/v2/mostviewed/world/1.json?api-key=5bd5133c6a064469a5d82dc9895f2fe7';
  axios.get(`${url}`).then((response) => {
  // do something with response.data  (some json)
    const result = `Today's most viewed article in the world section: ${response.data.results[0].title} ${response.data.results[0].url}`;
    bot.reply(message, result);
  }).catch((error) => {
    console.log(`got an error${error}`);
  // hit an error do something else!
  });
});

controller.hears(['U.S.', 'America'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
  const url = 'http://api.nytimes.com/svc/mostpopular/v2/mostviewed/U.S./1.json?api-key=5bd5133c6a064469a5d82dc9895f2fe7';
  axios.get(`${url}`).then((response) => {
  // do something with response.data  (some json)
    const result = `Today's most viewed article in the U.S. section: ${response.data.results[0].title} ${response.data.results[0].url}`;
    bot.reply(message, result);
  }).catch((error) => {
    console.log(`got an error${error}`);
  // hit an error do something else!
  });
});

controller.hears(['Business Day', 'Business'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
  const url = 'http://api.nytimes.com/svc/mostpopular/v2/mostviewed/Business%20Day/1.json?api-key=5bd5133c6a064469a5d82dc9895f2fe7';
  axios.get(`${url}`).then((response) => {
  // do something with response.data  (some json)
    const result = `Today's most viewed article in the Business section: ${response.data.results[0].title} ${response.data.results[0].url}`;
    bot.reply(message, result);
  }).catch((error) => {
    console.log(`got an error${error}`);
  // hit an error do something else!
  });
});

controller.hears(['Technology', 'Tech'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
  const url = 'http://api.nytimes.com/svc/mostpopular/v2/mostviewed/Technology/1.json?api-key=5bd5133c6a064469a5d82dc9895f2fe7';
  axios.get(`${url}`).then((response) => {
  // do something with response.data  (some json)
    const result = `Today's most viewed article in the Technology section: ${response.data.results[0].title} ${response.data.results[0].url}`;
    bot.reply(message, result);
  }).catch((error) => {
    console.log(`got an error${error}`);
  // hit an error do something else!
  });
});

controller.hears(['Sports'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
  const url = 'http://api.nytimes.com/svc/mostpopular/v2/mostviewed/Sports/1.json?api-key=5bd5133c6a064469a5d82dc9895f2fe7';
  axios.get(`${url}`).then((response) => {
  // do something with response.data  (some json)
    const result = `Today's most viewed article in the Sports section: ${response.data.results[0].title} ${response.data.results[0].url}`;
    bot.reply(message, result);
  }).catch((error) => {
    console.log(`got an error${error}`);
  // hit an error do something else!
  });
});

controller.hears(['Opinion'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
  const url = 'http://api.nytimes.com/svc/mostpopular/v2/mostviewed/Opinion/1.json?api-key=5bd5133c6a064469a5d82dc9895f2fe7';
  axios.get(`${url}`).then((response) => {
  // do something with response.data  (some json)
    const result = `Today's most viewed article in the Opinion section: ${response.data.results[0].title} ${response.data.results[0].url}`;
    bot.reply(message, result);
  }).catch((error) => {
    console.log(`got an error${error}`);
  // hit an error do something else!
  });
});

controller.on('outgoing_webhook', (bot, message) => {
  bot.replyPublic(message, 'yeah yeah');
});

// default index route
app.get('/', (req, res) => {
  res.send('hi');
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
