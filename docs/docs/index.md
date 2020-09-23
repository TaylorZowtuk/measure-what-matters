# Overview

The experiments database system is intended to replace an existing desktop application for storing experiments. This system will be a web application that has all the functionality of the existing desktop application with online capabilities and the ability for different users. This system is intended for all participants in a research group. This system will be used to actively store experimental data for a research lab.

## Project Glossary
- **Attempt** An attempt is one data entry recorded from the procedure and assigned to an experiment.

- **Common Attribute** - A common attribute is a data column that all subjects have initially. It is pre-defined by the researcher’s data files that the robots create.

- **Custom Attribute** - A custom attribute is a user defined data column that does not already exist in the researcher's data files created by the robots.

- **Experiment** - An experiment is the collection of subjects and the attempts they have done for a scientific procedure. An example is “Spinal Damage Recovery Experiment (SDRE).”

- **Researcher** - A researcher manages the experiments and subjects. They can upload data, add custom attributes, query data, and export their results to an external CSV file.

- **Result** - A result is the returned attempts from a search query on some experiments. Results can be exported as an external CSV file.

- **Subject** - A subject is an animal used as part of an experiment. Each subject will have a unique ID.

## Storyboarding
This is a storyboard describing user flow, the numbers correspond with something.
[![Storyboard](https://raw.githubusercontent.com/UAlberta-CMPUT401/example-documentation/master/docs/images/storyboard.png)](https://github.com/UAlberta-CMPUT401/example-documentation/blob/master/docs/files/storyboard.pdf)

## Use Cases or User Stories
[User stories can be found under the requirements section here.](/example-documentation/requirements)

## Techincal Resources
* Backend: Flask + PostgreSQL
* Deployment: Docker + k8s + TravisCI
* Frontend: Vue.js + Buefy

## Similar Products
* [Digikey](http://www.digikey.ca/products/en)
    - Search inventory management
    - &lt;functionalities, with comments on how they may be used for code or inspiration&gt;
* [LORIS](http://www.loris.ca/)
    - Neuroimaging data managemen
    - &lt;functionalities, with comments on how they may be used for code or inspiration&gt;

## Similar Open-source Projects
* [eLabFTW](https://github.com/elabftw/elabftw)
    - Experiment notebook software
    - &lt;functionalities, with comments on how they may be used for code or inspiration&gt; 
