# Overview
In the world of sports, data is a critical tool in informed decision making. Coaches of minor league teams have been recording game statistics with paper and pencil - equipped with only their best recall. In this manner, there is limited data collection ability. 

There is the opportunity to use modern technologies to assist in this statistics gathering process - and that is precisely what this product will provide. The goal of this product is to use technology to improve upon current means by making the process easier, more reliable, and to allow the recording of statistics that would previously have been too difficult. In addition, this information will be used to output detailed reports to assist in decision making. The scope of this release will be limited to the game of soccer but we will strive for the product to be easily extended to other sports in the future.

If you want to take your game to the next level, you need data to inform decision making.

## Use Cases or User Stories
[User stories can be found under the requirements section here.](requirements)

## Technical Resources
Our goal is to build a progressive web app to offer ease of use and enable device flexibility.
* Front-end: React, Redux, & TypeScript
* Back-end: Nest & PostgreSQL
* Deployment: Cybera & GitHub Actions

* TeamSnap
    - TeamSnap is the product we will likely integrate into for populating our app with a teams various information as need (such as games, rosters, and lineups)
    - General site - https://www.teamsnap.com/
    - Developer portal - https://developer.teamsnap.com/ 
    - Statistics - https://www.teamsnap.com/teams/features/statistics

## Similar Products
* [TeamStuff](https://teamstuff.com/)
    - Tool used to organize teams offering scheduling and availability tracking.
    - Allows managing a team roster.
    - One of many sites which offers this feature set and is a possible product that we can integrate our application into.
    - If we are developing our application in a generic manner, we should consider all the various platforms to which we may integrate and how the process of integrating may differ between them.

* [Steal Predictor](https://jabrils.com/sp/)
    - Features a noise free aesthetic and a simple and intuitive design.
    - Can be used as a design inspiration.
    - Includes a log of data entered and ability to undo which would also be important to include in our application for data entry verification and correction.

* [Ollie](https://www.olliesports.com/)
    - An app with the same goal of offering a means of recording a diverse set of stats.
    - Features few buttons to have purity of purpose. We should implement a similarly simple interface in order to make recording events quick and easy.
    - Features a built in interactive tutorial which we can use as inspiration for our own in app help. This would be useful to get parents who are unfamiliar with the technology up to speed quick.
    - Features live stats streaming for individuals who aren't able to attend the game; this was a feature requested by our client.


## Similar Open-source Projects
* [Tracking-Data](https://github.com/KubaMichalczyk/Tracking-Data)
    - A visualization that would be very useful to include in our reports for defensive zone coverage and offensive zone pressure.
    - Can be repurposed for other sports.
    - Also, in general, a great source of inspiration when thinking about useful reports that we could generate.

* [Balaban](https://github.com/anenglishgoat/balaban)
    - A small Python package for estimating & plotting Bayesian hierarchical models for player-level soccer data.
    - We can utilize many of these calculations and models for the reports that we produce.
    - For a general list of open-source statistics tools for various sports we can refer to: https://opensource.pysport.org/

* [Various Resources](https://awesomeopensource.com/project/matiasmascioto/awesome-soccer-analytics#open-source-libraries)
    - This website offers a compilation of open-source software specific to the game of soccer.
    - It includes various visualizations that may be useful to use as recording screens or outputs in our application.
    - It also includes many stats libraries specific to soccer statistics that we can reuse (and possibly repurpose) rather than needing to reimplement.

## Project Glossary
[Go to glossary](glossary)

## Storyboarding
This is a storyboard describing user flow, the numbers correspond with something.
![Storyboard](../images/storyboard.png)