# Tuddy

*Export, import, synchronie, stories, tasks, todos, such as Trello, Pivotal Tracker, JIRA, Github, etc.*

`

var client = new tuddy();

client.registerIntegration({ name: 'myTello', type: 'trello', token: 'a1b2c3'});

client.registerIntegration({ name: 'myGithub', type: 'github', token: 'a1b2c3'});

`

**If you would like to pull data from an integration:**

`

client.pull('myTrello').then((stories) => {
   console.log(stories);
});

client.pull('myGithub').then((stories) => {
   console.log(stories);
});

`

**If you would like to sync your Trello to your Github**

`

client.sync('myTrello', 'myGithub');


`