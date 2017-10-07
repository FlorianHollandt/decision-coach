![Release v1.0](https://img.shields.io/badge/release-v1.0-yellow.svg)
![Node.js 6.10](https://img.shields.io/badge/node.js-6.10-brightgreen.svg)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)
![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)
[![Twitter URL](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/Coachybot)

# Decision Coach

An Alexa Skill designed to help in making decisions.<br/>
Available in English and German language.

## Description

Decision Coach asks the user a series of questions to learn about the decision they are facing, and how they rate their respective options. It keeps a score and, in the final step, gives a recommendation based on the highest result.

Decision Coach operates in three stages:
1. In the first stage, it will ask the user between how many options they have to decide. The number of options should be between two and four.
2. In the middle stages, it asks the user two types of questions: **Score** questions about which option is best in various regards, and **Modifier** questions about the weight of a question's score.
3. In the final stage, it will tell the user the recommended option, based on the accumulated and weighted scores from the second stage. 

Each of these three stages has one or more modes associated, in which only certain intents are processed:

| Stage | Mode | Intents & Requests | Example |
| --- | --- | --- | --- |
| 1 | None | LaunchRequest | Alexa, launch Decision Coach |
| 1 | QUANTIFY_OPTIONS | QuantityIntent | I have three options |
| 1 | CONFIRM_OPTIONS | YesIntent | Yes |
| 1 | CONFIRM_OPTIONS | QuantityIntent | There are four possibilities |
| 2 | QUESTION_POLAR | YesIntent | Yes |
| 2 | QUESTION_POLAR | NoIntent | No |
| 2 | QUESTION_CHOICE | ChoiceIntent | The second option |
| 3 | RESULT | None | - |


Decision Coach uses the [Alexa Skills Kit SDK for Node.js](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs), and is implemented with AWS Lambda. The German and English localizations are implemented using the in-buildt [i18next](https://github.com/i18next/i18next) support.

In terms of maturity, Decision Coach is between proof-of-concept and alpha stage. As the developer, I have not yet submitted this Skill for beta-testing and certification review. In [CONTRIBUTING.md](https://github.com/botmaker-florian/decision-coach/blob/master/CONTRIBUTING.md) I have marked the features that I still plan to implement before publishing. 

Most notably, I will add more questions for the middle part, and add handlers for further intents like Cancel, Help, Stop, Restart and Skip.

## Installation and Testing

The major part of how this Skill is set up is exactly the same as for [Alexa's](https://github.com/alexa) demo Skills, so I will reference you to their [excellent installation guide](https://github.com/alexa/skill-sample-nodejs-fact) and just mention where the process is different for setting up Decision Coach.

### Setting up the Skill's VUI in the Amazon Developer Portal 

This step largely corresponds to what is described [here](https://github.com/alexa/skill-sample-nodejs-fact/blob/master/step-by-step/1-voice-user-interface.md), with the following exceptions:
- In point 8, instead of defining the intents, slots and slot types by yourself, paste the code from [this repository's intent scheme](https://github.com/botmaker-florian/decision-coach/blob/master/speechAssets/IntentSchema_en_US.json) into the Code Editor, using the language of your choice (English or German)

### Setting up your Skill's Lambda function

Again, follow [this instruction](https://github.com/alexa/skill-sample-nodejs-fact/blob/master/step-by-step/2-lambda-function.md), with the following exceptions:
- In point 7, choose "Node.js 6.10" as your runtime environment
- In point 8, paste the content of [this repository's Skill source code](https://github.com/botmaker-florian/decision-coach/blob/master/src/index.js) into the code box and click 'Save'

### Connecting the Skill's VUI and Lambda function

Like above, simply follow the steps described [here](https://github.com/alexa/skill-sample-nodejs-fact/blob/master/step-by-step/3-connect-vui-to-code.md).

### Testing 

You can test your new Skill either with the Service Sinmulator in the Developer Portal as described [in point 4 of this guide](https://github.com/alexa/skill-sample-nodejs-fact/blob/master/step-by-step/4-testing.md), or by setting up a unit test suite in [Postman](https://www.getpostman.com/) [as described here](https://github.com/botmaker-florian/skill-sample-nodejs-decision-tree/blob/master/unit-testing.md).

## Contribution

This is my second open source project, and every form of positive engagement and contribution is welcome!

Please check [CONTRIBUTING.md](https://github.com/botmaker-florian/decision-coach/blob/master/CONTRIBUTING.md) for ideas about how and what to contribute. To make engagement in this project a positive experience for everyone involved, please take not of and adhere to the [Contributor Covenant code of conduct](https://github.com/botmaker-florian/decision-coach/blob/master/CODE_OF_CONDUCT.md).


## License

To keep the bar for contribution and evolution of Decision Coach as low as possible, it is published under the [MIT license](https://github.com/botmaker-florian/decision-coach/blob/master/LICENSE.md).

However, please do not submit your own branch of Decision Coach for publication in the Amazon Skill Store unless you have developed it into something conceptually different from the master version. :)

## Contact

I look forward to getting in touch with you! The choice of channel is yours:
- [email](mailto:botmaker.florian@gmail.com)
- GitHub issue
- [LinkedIn](https://www.linkedin.com/in/florian-hollandt-2a362083/)
- [Twitter](https://twitter.com/Coachybot)
