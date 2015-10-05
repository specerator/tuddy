# Tuddy

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/specerator/tuddy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## EXPERIMENTAL

*Export, import, synchronize, stories, tasks, todos, such as Trello, Pivotal Tracker, JIRA, Github, Sprintly, Teuxdeux, etc.*

```javascript

var client = tuddy();

client.addIntegration({ name: 'myTello', type: 'trello', key: '', token: '', board_id: ''});

client.addIntegration({ name: 'myGithub', type: 'github', user: '', repo: '', access_token: ''});

client.addIntegration({ name: 'myJira', type: 'jira', host: '', username: '', password: ''});

client.addIntegration({ name: 'myPivotal', type: 'pivotal', project: '', token: ''});

client.addIntegration({ name: 'myTeuxdeux', type: 'teuxdeux', username: '', password: ''})

client.addIntegration({ name: 'mySprintly', type: 'sprintly', product: '', email: '', key: ''})
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

client.pull('myTeuxdeux').then((stories) => {
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

|  **Field** | **Description** | **Example** | **JIRA** | **Trello** | **Pivotal** | **GitHub** | **Teuxdeux** |
|  ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
|  **meta.source.name** | A text identifier of the source service | trello |  | "trello" |  |  |  |
|  **meta.source.data** | Array of data from source |  |  |  |  |  |  |
|  **data.id** | unique identifier | 237623762 | id | id | id | id | id |
|  **data.self** | API url for item | http://example.com/api/item/5 | self | - | - | url | - |
|  **data.key** | alternate unique identifier | TSK-01 | key | idShort |  | number | uuid |
|  **data.name** | summary of the item | do a thing | fields.summary | name | name | title | text |
|  **data.description** | full description of the item | We want do a thing not because it is easy but because it is hard. | fields.description | desc |  | body | - |
|  **data.project.id** | parent identifier | 347632746 | fields.project.id | idBoard | project_id | this.integration.repo |  |
|  **data.type** | type of item | task | issue | bug | feature | story | issuetype.name | - | kind |  |  |
|  **data.url** | url for item in it's native UI | http://example.com/item/5 |  | url | urk | html_url |  |
|  **data.archived** | is item archived indicator | yes | no |  |  | - |  |  |
|  **data.status** | working status of item | open | closed | backlog | current |  |  | current_state | state | done |
|  **data.date.start** | datetime and item should begin |  |  |  |  |  |  |
|  **data.date.end** | synonomous to date.due |  |  |  |  |  |  |
|  **data.date.due** | datetime item is due | 2015-08-14T15:05:55+00:00 | fields.duedate | due |  |  |  |
|  **data.date.completed** | datetime item was completed | 2015-08-14T15:05:55+00:00 |  |  |  | closed_at |  |
|  **data.date.created** | datetime item was created | 2015-08-14T15:05:55+00:00 | fields.created | dateLastActivity | created_at | created_at |  |
|  **data.date.updated** | datetime item was last updated | 2015-08-14T15:05:55+00:00 | fields.updated | dateLastActivity | updated_at | updated_at | deletedAt |
|  **data.date.deleted** | datetime and item was deleted |  |  |  |  |  | start_date |
|  **data.lists** | array of lists/columns to which the story belongs |  |  |  |  |  |  |
|  **data.lists.list.id** |  |  |  |  |  |  |  |
|  **data.lists.list.position** |  |  |  |  |  |  |  |
|  **data.labels** |  |  |  |  |  |  |  |
|  **data.email** |  |  |  |  |  |  |  |
|  **data.shortUrl** |  |  |  |  |  |  |  |
