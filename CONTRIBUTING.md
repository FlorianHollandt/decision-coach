# Contributing

Every form of positive engagement, feedback and contribution is welcome!


## Neccessary points for the Beta Version

- Include more Score and Modifier questions
- Define a Pass intent that makes the Skill proceed to the next question without evaluating the current question, and include it in the corresponding handlers. Possible utterances are "Doesn't matter", "I don't know" or "Next question".
- Define cards on which the current question is diplayed on a Fire TV, Echo Show or the Alexa app
- Implement the Cancel, Stop and Help intents in all handlers


## Ideas

- Define a Skip intent that makes the Skill skip all other questions and gives the preliminary result right away, and include it in the according handlers. Possible utterances are "Skip" or "Show result".
- Introduce a 'Negative' question type that follows up on a 'Score' question, e.g. first "Which option is best for you in the long run?", adding one point to the chosen answer's score, then "And which option is least favorable in that regard?", subtracting one point from its respectively chosen answer
- Implement reprompts for all questions
- Extending or modifying the documentation (readme, installation, background, contributing...)
- Feedback on the presentation of this repository, especially in terms of contributor-friendlyness

More ideas are very welcome!


## Process

I want to make sure that contributing is as easy and convenient for you as possible.
If you have an idea of what to improve or extend, feel free to get in touch with me about how to integrate your contribution. :)


## Credits

- This Skill was developed using Amazon's developer ressources, especially [the example Decision Tree Skill](https://github.com/botmaker-florian/skill-sample-nodejs-decision-tree) and the documentation of the [Skill Kit SDK](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs)


## Code of Conduct

To make engagement in this project a positive experience for everyone involved, please take not of and adhere to the [Contributor Covenant code of conduct](https://github.com/botmaker-florian/decision-coach/blob/master/CODE_OF_CONDUCT.md).