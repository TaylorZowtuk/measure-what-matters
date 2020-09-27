# User Stories

User Stories are described with a specific format: "As a", "I want", and "So That". They also provide an acceptance criteria for their completion. User stories are also further organized using the MoSCoW method (must have, should have, could have, won't have) under their own sections. These were sorted by our client and may be renegotiated slightly as the team gets a better understanding of velocity.

<!--  TEMPLATE

#### TICKET NUMBER - TICKET TITLE

> **As a SOMETHING,** <br></br> > **I want** THE WANT TEXT,<br></br> > **So that** SO THAT TEXT.

> **Acceptance:** SOME ACCEPTANCE TEXT

 -->

## Pregame

---

### 1.1 Making account and editing account, retrieving account info

---

#### 1.1.1 - Create An Account

> **As a user,** <br></br> > **I want** to be able to create an account with a unique username from the log in,<br></br> > **So that** I can have a saved profile for future use.

> **Acceptance:** User has own account to keep local information and rosters, unique username and password satisfied.

#### 1.1.2 - User Login

> **As a user,** <br></br> > **I want** to be able to log into my account,<br></br> > **So that** I can access my profile.

> **Acceptance:** Log in process completes, logs into correct account, profile shows up.

#### 1.1.3 - User Logout

> **As a user,** <br></br> > **I want**to be able to log out of my account,<br></br> > **So that** no one else can use my account.

> **Acceptance:** Log out completes and return to home screen achieved.

#### 1.1.4 - View Account Profile and Info

> **As a user,** <br></br> > **I want** to be able to view my account information,<br></br> > **So that** I can ensure it is correct and be reminded of the information entered.

> **Acceptance:** Interface with correct account information showing accessible.

#### 1.1.5 - Edit Account Info

> **As a user,** <br></br> > **I want** to be able to edit my account information,<br></br> > **So that** I can correct any misinformation or add changes.

> **Acceptance:** Edits have simple interface, view account information show updates correctly.

---

### 1.2 Making roster, team manager role

---

#### 1.2.1 - Create A Team

> **As a team manager,** <br></br> > **I want** to be able to create team(s), with a team name, logo, and initial roster,<br></br> > **So that** a nice interface can be used to represent my team.

> **Acceptance:** Interface for team creation has team name, logo, and initial roster available. Once executed the team information is shown correctly.

#### 1.2.2 - Edit Team Roster

> **As a team manager,** <br></br> > **I want** to be able to edit my roster,<br></br> > **So that** I can associate statistics with the players on my roster.

> **Acceptance:** Roster edit interface easily accessible and simple, roster shows up correctly after edits.

#### 1.2.3 - Create a Match Lineup

> **As a team manager,** <br></br> > **I want** to be able to create a match lineup from my teams roster,<br></br> > **So that** I can associate the players who attended a match with a particular match.

> **Acceptance:** Match lineup interface allows for simple roster creation, roster for game is correct after added.

---

### 1.3 Adding recorders

---

#### 1.3.1 - Add Recorders To A Match

> **As a team manager,** <br></br> > **I want** to be able to add recorders to have access to my lineup,<br></br> > **So that** so that they can also record events during games.

> **Acceptance:** Recorders sent notification after invite, recorders can join game if sent invite.

---

### 1.4 Starting the game

---

#### 1.4.1 - Select Game Recording Responsibilities

> **As a recorder,** <br></br> > **I want** to select which events I am responsible for recording,<br></br> > **So that** the event recording is properly distributed.

> **Acceptance:** Recorder events selected assign properly.

#### 1.4.2 - Start A Match Recording Session

> **As a team manager,** <br></br> > **I want** an icon that will begin the “during game” process,<br></br> > **So that** I can synchronize all my recorders to start the match.

> **Acceptance:** Selection of icon properly puts manager and recorders into “during game” activity.

---

## During game

---

### 2.1 Recording Events

---

#### 2.1.1 - Game Event - Substitutions

> **As a recorder,** <br></br> > **I want** to be able to record which players got substituted, who they were substituted with and at what time the substitution occurred,<br></br> > **So that** I can track how many minutes they have played.

> **Acceptance:** Selection of players to substitute results in the lineup being updated.

#### 2.1.2 - Goal Location Details

> **As a recorder,** <br></br> > **I want** to be able to record where a goal was scored from and where in the net it went in,<br></br> > **So that** I can track a player's effectiveness.

> **Acceptance:** A goal event including the location is persisted and associated with the current game and player.

#### 2.1.3 - Game Event - Shots on Net

> **As a recorder,** <br></br> > **I want** to be able to record where shots are taken from,<br></br> > **So that** I can determine weak points in defense and our chances on offense.

> **Acceptance:** A shot taken event including the location and time is persisted and associated with the current game.

#### 2.1.4 - Game Event - Throw Ins

> **As a recorder,** <br></br> > **I want** to be able to record who took a throw in and which team gained possession,<br></br> > **So that** that I can determine how well our throwins are.

> **Acceptance:** A throw in event is persisted and associated with the current game along with the resulting possession.

#### 2.1.5 - Game Event - Goal

> **As a recorder,** <br></br> > **I want** to be able to record which players scored a goal and at what time they scored a goal,<br></br> > **So that** I can track a player’s effectiveness.

> **Acceptance:** A goal event is persisted with the time it occurred and associated with the current game and the player who scored it.

#### 2.1.6 - Game Event - Assists

> **As a recorder,** <br></br> > **I want** to be able to record which player got an assist and at what time the assist occurred,<br></br> > **So that** I can track a player’s effectiveness.

> **Acceptance:** An assist event is persisted with the time it occurred and associated with the current game and the player who got the assist.

#### 2.1.7 - Game Event - Corner Kick

> **As a recorder,** <br></br> > **I want** to be able to record which player got a corner kick and at what time the corner kick occurred,<br></br> > **So that** I can track a player’s effectiveness.

> **Acceptance:** A corner kick event is persisted with the time it occurred and associated with the current game.

#### 2.1.8 - Game Event - Penalty Shot

> **As a recorder,** <br></br> > **I want** to be able to record which player got a penalty and at what time the penalty occurred,<br></br> > **So that** I can track a player’s effectiveness.

> **Acceptance:** A penalty event is persisted with the time it occurred and associated with the current game and the player who committed the penalty.

#### 2.1.9 - Cache Event Recordings if Network is Down

> **As a recorder,** <br></br> > **I want** be able to record events even without a network connection,<br></br> > **So that** I won’t have to worry about spotty connection.

> **Acceptance:** Events recorded without network connection should be persisted when network connection is reestablished.

#### 2.1.10 - Game Event - Touches

> **As a recorder,** <br></br> > **I want** to be able to record which player touched the ball and at what time the touch occurred,<br></br> > **So that** I can track a player’s effectiveness.

> **Acceptance:** A ball touch event is persisted with the time it occurred and associated with the current game and the player who touched the ball.

#### 2.1.11 - Game Event - Ball Possession

> **As a recorder,** <br></br> > **I want** to be able to record ball possession and at what time the possession changes,<br></br> > **So that** that I can track a lineup’s effectiveness.

> **Acceptance:** A possession change event is persisted with the time it occurred and associated with the current game.

#### 2.1.12 - Flag An Event for Later Accuracy Check

> **As a recorder,** <br></br> > **I want** to be able to flag an event that I have entered,<br></br> > **So that** it’s accuracy can be confirmed later.

> **Acceptance:** A flagged event should show some visual feedback to the user that the event has been marked and the flag should be persisted and associated with the event.

#### 2.1.13 - Undo Game Event

> **As a recorder,** <br></br> > **I want** to be able to undo an event that I have entered,<br></br> > **So that** the accuracy of events are preserved.

> **Acceptance:** An undone event should be removed and not persisted.

#### 2.1.14 - List Game Events while Recording

> **As a recorder,** <br></br> > **I want** to be able to see the history of my recorded events,<br></br> > **So that** I can verify that I have correctly entered an event.

> **Acceptance:** All events that were recorded for a game by that recorder should appear when the user requests their history.

---

### 2.2 Viewing events during game

---

#### 2.2.1 - Game Event Stream

> **As a fan,** <br></br> > **I want** to be able to view a livestream of events for a game that is currently underway,<br></br> > **So that** I can view events as they occur.

> **Acceptance:** All events that were recorded for a game by any recorder should appear as they occur without refreshing the view.

---

### 2.3 Coach view during game

---

#### 2.3.1 - On Field Timer

> **As a coach,** <br></br> > **I want** to be able to see the amount of time each player has been playing on the current lineup,<br></br> > **So that** I can judge how much stamina they have left.

> **Acceptance:** At the request of the coach they should be able to view the amount of time each player on the current lineup has been playing.

---

## Post Game

---

### 3.1 Dashboard

---

#### 3.1.1 - Stat Dashboard

> **As a user,** <br></br> > **I want** a 1 page dashboard to see a high level overview of team stats,<br></br> > **So that** I can see at a high level how my team is performing.

> **Acceptance:** User can navigate here and view wins, losses, games played, and a summary of the last match.

---

### 3.2 Reports

---

#### 3.2.1 - Time on Field

> **As a user,** <br></br> > **I want** to view player time on the field,<br></br> > **So that** I can make decisions about shift length.

> **Acceptance:** Can view time on the field for an individual player and at the team level can see the average time on field for all players.

#### 3.2.2 - Plus Minus

> **As a user,** <br></br> > **I want** to view player +/-,<br></br> > **So that** so that I can see patterns in player performance over time.

> **Acceptance:** Can see the +/- stat on an individual players profile.

#### 3.2.3 - Lineup During Goals

> **As a user,** <br></br> > **I want** to see which players are on the field at the same time for goals against and goals for,<br></br> > **So that** I can make informed decisions about lineups.

> **Acceptance:** The user can see a list of players on the field for each goal scored. This can be seen as extra detail on a goal event.

#### 3.2.4 - Visualization - Shots on Net Location On Field

> **As a user,** <br></br> > **I want** to view the shot zone reports differentiated by scores and misses for a specific game,<br></br> > **So that** I can identify the weak or strong areas in our defense or offense.

> **Acceptance:** I can view all shots on an image of a half a field for either team.

#### 3.2.5 - Visualization - Shot On Net Accuracy

> **As a user,** <br></br> > **I want** to visualize goals in an area of the net,<br></br> > **So that** I can identify our goalies weak spots.

> **Acceptance:** I can view all shots on an image of a net for either team.

#### 3.2.6 - Stat - Ball Possession Time / Percentage

> **As a user,** <br></br> > **I want** to view ball possession times for a specific game,<br></br> > **So that** I can identify how long we had the ball.

> **Acceptance:** I can view possession minutes and a percentage per team on the game stats page. We can also report an average possession percentage at a team level.

#### 3.2.7 - Visualization - Event Timeline

> **As a user,** <br></br> > **I want** to be able to navigate game events on a timeline,<br></br> > **So that** I can quickly get an idea of which events occurred at when during the match.

> **Acceptance:** Events are displayed on a timeline, can hover to see details, and can click to get more details.

#### 3.2.8 - Strategy Suggestions

> **As a coach,** <br></br> > **I want** to see suggestions on where I can make changes to strategy,<br></br> > **So that** can quickly improve on my coaching skills.

> **Acceptance:** The coach receives at least novel advice, like a reminder to make subs earlier for a particular player.

3.2.8 As a coach,
I want to see suggestions on where I can make changes to strategy. Could have
Acceptance: The coach receives at least novel advice, like a reminder to make subs earlier for a particular player.

#### 3.2.9 - Export as CSV

> **As a coach,** <br></br> > **I want** to export my stats to CSV or Excel file,<br></br> > **So that** I can further analysis/process the data.

> **Acceptance:** The coach can export a csv w/ all stats.

#### 3.2.10 - Stat - Date Range Selection

> **As a user,** <br></br> > **I want** to be able to view stats for any date-range,<br></br> > **So that** I can see how my team has improved over time.

> **Acceptance:** All stats should be viewable by match, week, month, or season, date pick.

#### 3.2.11- List and Edit Game Events Post Game

> **As a coach/parent,** <br></br> > **I want** to view each recorded event as a list where I can edit and adjust some details,<br></br> > **So that** I can adjust details like timing etc.

> **Acceptance:** Any individual data point can be edited in the post game summary.

#### 3.2.12 - Stat - Player Summary

> **As a user,** <br></br> > **I want** to see stats of an individual player,<br></br> > **So that** I can see more specific details about a player's skills.

> **Acceptance:** Stats of a player can be viewed on their own page, w/ player specific data.

---

## Prioritization

---

#### Must Have

- 1.1.1 - Create An Account
- 1.1.2 - User Login
- 1.1.4 - View Account Profile and Info
- 1.1.5 - Edit Account Info
- 1.2.1 - Create A Team
- 1.2.2 - Edit Team Roster
- 1.2.3 - Create a Match Lineup
- 2.1.1 - Game Event - Substitutions
- 2.1.2 - Goal Location Details
- 2.1.5 - Game Event - Goal
- 2.1.6 - Game Event - Assists
- 2.1.9 - Cache Event Recordings if Network is Down
- 2.1.13 - Undo Game Event
- 2.1.14 - List Game Events while Recording
- 3.1.1 - Stat Dashboard
- 3.2.1 - Time on Field
- 3.2.2 - Plus Minus
- 3.2.3 - Lineup During Goals
- 3.2.10 - Stat - Date Range Selection
- 3.2.11- List and Edit Game Events Post Game
- 3.2.12 - Stat - Player Summary

#### Should Have

- 1.3.1 - Add Recorders To A Match
- 1.4.1 - Select Game Recording Responsibilities
- 1.4.2 - Start A Match Recording Session
- 2.1.12 - Flag An Event for Later Accuracy Check
- 2.3.1 - On Field Timer
- 3.2.6 - Stat - Ball Possession Time / Percentage
- 3.2.7 - Visualization - Event Timeline

#### Could Have

- 2.1.3 - Game Event - Shots on Net
- 2.1.4 - Game Event - Throw Ins
- 2.1.7 - Game Event - Corner Kick
- 2.1.8 - Game Event - Penalty Shot
- 2.1.10 - Game Event - Touches
- 2.1.11 - Game Event - Ball Possession
- 2.2.1 - Game Event Stream
- 3.2.4 - Visualization - Shots on Net Location On Field
- 3.2.5 - Visualization - Shot On Net Accuracy
- 3.2.8 - Strategy Suggestions
- 3.2.9 - Export as CSV

#### Won't Have

- 1.1.3 - User Logout
