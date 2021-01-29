# Sport Bracket Maker

Tool for making brackets for American professional sports playoffs.

### Sports (only NFL so far)
- [x] NFL 🏈
- [ ] NBA 🏀
- [ ] NHL 🏒
- [ ] MLS ⚽️
- [ ] MLB ⚾️



## Architecture

### Hosting
**Github pages** - Where the static portion of the application is hosted (html,css,js).

**Heroku** - Used for hosting an API endpoint.  Using [kaffine](http://kaffeine.herokuapp.com/) to keep Heroku from sleeping after 30 minutes of inactivity (free tier apps do not stay warm).


### Technology
**Node & Express** - REST routing and operations of the API

**MongoDB** - Persistent storage of data.
