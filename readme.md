# Sport Bracket Maker

![Webpage image](https://imgur.com/F6eZkCy.png)

Tool for making sports playoff brackets.


### Sports
- [x] NFL 🏈
- [x] NBA 🏀
- [x] NHL 🏒
- [ ] MLS ⚽️
- [ ] MLB ⚾️


## How it works 
### Hosting

**Github pages** - Where the static portion of the application is hosted (html,css,js).

**Heroku** - Used for hosting the [API endpoint](https://github.com/kennysexton/express-api-server).  Using [Kaffeine](http://kaffeine.herokuapp.com/) to keep Heroku from sleeping after 30 minutes of inactivity.

<br>

### Technology

**Express** - REST routing and operations of the API

**MongoDB** - Persistent storage of data.

## Limits

**NFL Playoffs** can only be represented as a bracket after the wildcard round. 
```
The NFL does not use a fixed bracket system; 
the outcomes of the Wild Card games determine the matchups of the Divisional playoffs games, 
with the lowest remaining seed in each conference traveling to the first seed, 
and the second-lowest remaining seed traveling to the second-highest remaining seed.
```
[(wikipedia)](https://en.wikipedia.org/wiki/NFL_playoffs)
