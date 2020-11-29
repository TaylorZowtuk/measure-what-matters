# MWM Documentation

## Video Demo

[Measure What Matters Video Demonstration](https://youtu.be/Z0JGxdxM1kk?vq=hd1080)

## Presentation Slides

<object data="./Presentation-Slides.pdf" type="application/pdf" width="700px" height="700px">
    <embed src="./Presentation-Slides.pdf">
        <p>This browser does not support PDFs. Please download the PDF to view it: <a href="./Presentation-Slides.pdf">Download PDF</a>.</p>
    </embed>
</object>

## User Manual

<object data="./MWM-UserManual.pdf" type="application/pdf" width="700px" height="700px">
    <embed src="./MWM-UserManual.pdf">
        <p>This browser does not support PDFs. Please download the PDF to view it: <a href="./MWM-UserManual.pdf">Download PDF</a>.</p>
    </embed>
</object>

## Deployment Docs

<object data="./DeploymentDocs.pdf" type="application/pdf" width="700px" height="700px">
    <embed src="./DeploymentDocs.pdf">
        <p>This browser does not support PDFs. Please download the PDF to view it: <a href="./DeploymentDocs.pdf">Download PDF</a>.</p>
    </embed>
</object>

## Api Docs

In order to view the MWM Api documentation locally. Run

```bash
npm run start
```

Then navigate to [http://localhost:3001/api](http://localhost:3001/api)
**_Note:_** 3001 is the default port. Remember to use the port you have set in main.ts in the backend/src directory.

The following demonstrates how db objects, api endpoints, and stats can be calculated/

Docs can be found <a href="./SwaggerUI.html" target="_blank">here</a>

### Ball Possession

![Possession Plan](../images/api/ballPossession.jpg)

Ball possession can be in 3 states during a game:

1. A player has the ball.
1. An opponent has the ball.
1. The ball is neutral.

There is a POST API endpoint that can be used to set the state of the ball. The ball is assumed to start in a neutral state at the beginning of the match AND at the beginning of the second half. When calculating stats this should be taken into account.

The timeline demonstrates how this would work.

The DELETE API endpoint does not delete the entity from the DB but instead sets an "archived" flag to true. This will allow for easier modification later.

## Testing Docs

### Testing Documentation

<object data="./MWM-testing-documentation.pdf" type="application/pdf" width="700px" height="700px">
    <embed src="./MWM-testing-documentation.pdf">
        <p>This browser does not support PDFs. Please download the PDF to view it: <a href="./MWM-testing-documentation.pdf">Download PDF</a>.</p>
    </embed>
</object>

### Testing Report (Selenium)

The html version can be found in the /selenium_testing/ReportDirectory/ from the root folder.

<object data="./MWM-SeleniumTestingReport.pdf" type="application/pdf" width="700px" height="700px">
    <embed src="./MWM-SeleniumTestingReport.pdf">
        <p>This browser does not support PDFs. Please download the PDF to view it: <a href="./MWM-SeleniumTestingReport.pdf">Download PDF</a>.</p>
    </embed>
</object>
