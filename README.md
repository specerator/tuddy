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

# Super Common Story Format

Super Common Story Format (SCSF) is an experimental attempt to unify task systems such that a common container format can be used as an interchange format between different systems.

## EXPERIMENTAL


|  **Field** | **Description** | **Example** | **JIRA** | **Trello** | **Pivotal** | **GitHub** |
|  ------ | ------ | ------ | ------ | ------ | ------ | ------ |
|  **id** | unique identifier | 237623762 | id | id | id | id |
|  **self** | API url for item | http://example.com/api/item/5 | self | - | - | url |
|  **key** | alternate unique identifier | TSK-01 | key | idShort |  | number |
|  **source** | name of source | trello |  | "trello" |  | "github" |
|  **name** | summary of the item | do a thing | fields.summary | name | name | title |
|  **description** | full description of the item | We want do a thing not because it is easy but because it is hard. | fields.description | desc |  | body |
|  **project** | parent identifier | 347632746 | fields.project.id | idBoard | project_id | this.integration.repo |
|  **type** | type of item | task | issue | bug | feature | story | issuetype.name | - | kind |  |
|  **url** | url for item in it's native UI | http://example.com/item/5 |  | url | urk | html_url |
|  **archived** | is item archived indicator | yes | no |  |  | - |  |
|  **status** | working status of item | open | closed | backlog | current |  |  | current_state | state |
|  **due** | datetime item is due | 2015-08-14T15:05:55+00:00 | fields.duedate | due |  |  |
|  **completedAt** | datetime item was completed | 2015-08-14T15:05:55+00:00 |  |  |  | closed_at |
|  **createdAt** | datetime item was created | 2015-08-14T15:05:55+00:00 | fields.created | dateLastActivity | created_at | created_at |
|  **updatedAt** | datetime item was last updated | 2015-08-14T15:05:55+00:00 | fields.updated | dateLastActivity | updated_at | updated_at |
