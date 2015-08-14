# Tuddy

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/specerator/tuddy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## EXPERIMENTAL

*Export, import, synchronize, stories, tasks, todos, such as Trello, Pivotal Tracker, JIRA, Github, Sprintly, etc.*

```javascript

var client = tuddy();

client.registerIntegration({ name: 'myTello', type: 'trello', key: '', token: '', board_id: ''});

client.registerIntegration({ name: 'myGithub', type: 'github', user: '', repo: '', access_token: ''});

client.registerIntegration({ name: 'myJira', type: 'jira', host: '', username: '', password: ''});

client.registerIntegration({ name: 'myPivotal', type: 'pivotal', project: '', token: ''});

client.registerIntegration({ name: 'mySprintly', type: 'sprintly', email: '', key: ''});
```

**If you would like to pull data from an integration:**

```javascript

client.pull('myTrello').then((stories) => {
   console.log(stories);
});

client.pull('myGithub').then((stories) => {
   console.log(stories);
});

client.pull('myJira').then((stories) => {
   console.log(stories);
});

client.pull('myPivotal').then((stories) => {
   console.log(stories);
});

client.pull('mySprintly').then((stories) => {
   console.log(stories);
});

```

**If you would like to push data to an integration:**

```javascript

var stories = [
  {
    name: 'I love creating Trello cards',
    description: 'Writing cards to any system using the same format is fun.'
  }
];

client.push('myTrello', stories).then((result) => {
   console.log(result);
});

```
