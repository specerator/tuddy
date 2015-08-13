# Tuddy

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/specerator/tuddy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## EXPERIMENTAL

*Export, import, synchronize, stories, tasks, todos, such as Trello, Pivotal Tracker, JIRA, Github, etc.*

```javascript

var client = new tuddy();

client.registerIntegration({ name: 'myTello', type: 'trello', token: 'a1b2c3'});

client.registerIntegration({ name: 'myGithub', type: 'github', token: 'a1b2c3'});

```

**If you would like to pull data from an integration:**

```javascript

client.pull('myTrello').then((stories) => {
   console.log(stories);
});

client.pull('myGithub').then((stories) => {
   console.log(stories);
});

```

**If you would like to sync your Trello to your Github**

```javascript

client.sync('myTrello', 'myGithub');


```
