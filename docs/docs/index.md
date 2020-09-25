# Overview
The experiments database system is intended to replace an existing desktop application for storing experiments. This system will be a web application that has all the functionality of the existing desktop application with online capabilities and the ability for different users. This system is intended for all participants in a research group. This system will be used to actively store experimental data for a research lab.

## Storyboarding
This is a storyboard describing user flow, the numbers correspond with something.
![Storyboard](../images/storyboard.png)

## Use Cases or User Stories
[User stories can be found under the requirements section here.](requirements)

## Technical Resources
* Backend: Flask + PostgreSQL
* Deployment: Docker + k8s + TravisCI
* Frontend: Vue.js + Buefy

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
* [eLabFTW](https://github.com/elabftw/elabftw)
    - Experiment notebook software
    - &lt;functionalities, with comments on how they may be used for code or inspiration&gt; 

## Project Glossary
[Go to glossary](glossary)