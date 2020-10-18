# Design

## UI/X Design

### Wireframes

[Go to wireframes page](wireframes)

## Software Design

This page includes a short description of the overall architecture style of the system, its high-level system components, and their logical (what data they exchange) and control (how they invoke each other) dependencies.

### Component Diagram

In our component diagram we have three important views which are the viewer who is someone who just watches events as they come in, the parent who records the events and the coach who can manage the lineup. The viewer depends on the game and the events, the parent is dependent on all components in order to be able to record, and the coach is dependent on the roster and game to control the lineups. A roster also cannot exist without the required interface RosterMember. All components are secured by our infrastructure through the implementation of a login flow so they require the access control interface provided by the security component. All components are persisted by our infrastructure through the required interface TypeORM into the application database.

### Architecture Diagram

Below the component diagram is our N tier architecture. The client web browser calls the presentation layer's web server which uses the react framework, redux for state management, and material ui for consistent styling to create HTML that is displayed to the user. The web server gets the data it needs to display to the user from the web api. Also, the data that the user passes in is passed to the web api to be persisted. The swagger package in the application layer is used to document the API. The web api then calls services which can retrieve or save data using typeorm repositories as entities to the postgres db in the resource layer which is running inside of a docker container. The passport package is used to authenticate users before they can access any data. Furthermore, the services call teamsnap to get rosters, games and players which will be then persisted through typeorm to our postgres db.

![ComponentDiagrams](../images/design/componentDiagram/component-diagram.png)

### UML Class Diagram

A UML for the recording application Measure What Matters. This UML displays how the team managers will add recorders and set up a roster for matches. The recorders will record various event types that will be saved in both the players' profile and the team stats profile. These can later be retrieved by the Team Manager to better understand the analytics of how the team is performing.
![UML](../images/design/UML/UML.png)

### Sequence Diagram

The sequence diagram describes the flow of recording sports events. They are devided into three stages: pre game, during game, and post game.

![Sequence](../images/design/sequenceDiagram/sequence.png)
