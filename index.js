
'use strict';
const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.8426dafc-b3cb-4e1f-9760-a954e52e75f9';


exports.handler = function( event, context, callback){
    console.log( "Export handler invoked...");
    var alexa = Alexa.handler( event, context);
    alexa.appId = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers( 
        newSessionHandlers,
        quantifyOptionHandlers,
        confirmOptionHandlers
        );
    alexa.execute();
};

var states = {
    QUANTIFY_OPTIONS: '_QUANTIFY_OPTIONS',
    CONFIRM_OPTIONS : '_CONFIRM_OPTIONS',
    QUESTION_POLAR : '_QUESTION_POLAR'
};

var newSessionHandlers = {
    'LaunchRequest': function () {
        console.log( "newSessionHandler with LaunchRequest invoked...");
        this.handler.state = states.QUANTIFY_OPTIONS;
        this.emit( ':ask', this.t( 'WELCOME') );
    },
    'Unhandled': function() {
        console.log( "newSessionHandler with Unhandled Request invoked...");        
        this.handler.state = states.QUANTIFY_OPTIONS;
        this.emit( ':ask', this.t( 'WELCOME') );
    }    
};

var quantifyOptionHandlers = Alexa.CreateStateHandler( states.QUANTIFY_OPTIONS, {
    'QuantityIntent': function () {
        console.log( "quantifyOptionHandlers with QuantityIntent invoked...");
        var number_of_options = get_number_from_quantity_slot( this.event.request.intent.slots.quantity.value);
        if ( number_of_options == 1){
            this.emit( ':ask', this.t( 'QUANTITY_ONE') );
        } else if ( number_of_options == 2){
            this.handler.state = states.CONFIRM_OPTIONS;
            this.emit( ':ask', this.t( 'QUANTITY_TWO') );
        } else if ( number_of_options > 4){
            this.handler.state = states.CONFIRM_OPTIONS;            
            this.emit( ':ask', this.t( 'QUANTITY_TOO_MANY') );
        } else {
            this.handler.state = states.CONFIRM_OPTIONS;                        
            this.emit( ':ask', number_of_options + this.t( 'QUANTITY_GOOD') );
        }
    },
    'Unhandled': function() {
        console.log( "quantifyOptionHandlers with Unhandled Request invoked...");        
        this.emit( ':ask', this.t( 'QUANTITY_REPEAT') );
    }       
});

var confirmOptionHandlers = Alexa.CreateStateHandler( states.CONFIRM_OPTIONS, {
    'AMAZON.YesIntent': function () {
        console.log("confirmOptionHandlers with AMAZON.YesIntent invoked...");
        this.handler.state = states.QUESTION_POLAR;;
        this.emit( ':ask', this.t( 'EXPERIENCE') );
    },
    'QuantityIntent': function () {
        console.log( "confirmOptionHandlers with QuantityIntent invoked...");
        var number_of_options = get_number_from_quantity_slot( this.event.request.intent.slots.quantity.value);
        if ( number_of_options == 1){
            this.emit( ':ask', this.t( 'QUANTITY_ONE') );
        } else if ( number_of_options == 2){
            this.handler.state = states.CONFIRM_OPTIONS;
            this.emit( ':ask', this.t( 'QUANTITY_TWO') );
        } else if ( number_of_options > 4){
            this.handler.state = states.CONFIRM_OPTIONS;            
            this.emit( ':ask', this.t( 'QUANTITY_TOO_MANY') );
        } else {
            this.handler.state = states.CONFIRM_OPTIONS;                        
            this.emit( ':ask', number_of_options + this.t( 'QUANTITY_GOOD') );
        }
    },
    'Unhandled': function() {
        console.log( "quantifyOptionHandlers with Unhandled Request invoked...");        
        this.emit( ':ask', this.t( 'QUANTITY_REPEAT_2') );
    }       
});

var languageStrings = {
    'en-US': {
        'translation': {
            'WELCOME'       : "Welcome to Decision Coach. I will gladly help you in making a \
                               difficult decision, by asking you a couple of questions. \
                               Let's start right away: Between how many options do you have to decide?",
            'QUANTITY_GOOD' : " is a good amount of options. Are you ready to answer some questions \
                               about these options?",
            'QUANTITY_ONE'  : "It's not really a decision if there is only one option. \
                               If you think about not pursuing the one option, or to do something \
                               else entirely, how many realistic options do you have?",
            'QUANTITY_TWO'  : "Alright, two options are perfectly plausible. However, there is a \
                               typical fallacy called the false dilemma, where people think they have \
                               to decide between two options when actually there are more options \
                               available. Are you sure there are only two options in your case?",
            'QUANTITY_TOO_MANY' : "Sorry, but these are too many options, if you want to \
                               give a fair consideration for each of them. Can you narrow down your \
                               range of options to the four most plausible ones?",
            'QUANTITY_REPEAT' : "How many options did you say you have?",
            'QUANTITY_REPEAT_2' : "In this case, how many relevant options do you have?",
            'EXPERIENCE' : "Do you have experience in making decisions like this one?"                           
        }
    },
    'de-DE': {
        'translation': {
            'WELCOME'       : "Willkommen beim Entscheidungs Coach. Zwischen wie vielen Optionen \
                               musst Du Dich entscheiden?",
            'QUANTITY_GOOD' : " ist eine gute Anzahl von Optionen. Bist Du bereit, einige Fragen zu diesen \
                               Optionen zu beantworten?",
            'QUANTITY_ONE'  : "Bei einer Option ist es nicht wirklich eine Entscheidung. Wenn Du \
                               auch die Möglichkeit einbeziehst, diese eine Option nicht umzusetzen, oder \
                               etwas ganz anderes zu tun, wie viele Möglichkeiten hast Du dann?",
            'QUANTITY_TWO'  : "Zwei Optionen sind vollkommen plausibel. Allerdings gibt es den häufigen \
                               Fehlschluss, es gäbe nur zwei Optionen, wenn es in Wirklichkeit noch \
                               andere gute Möglichkeiten gibt. Bist Du sicher, dass Du nur zwei Optionen hast?",
            'QUANTITY_TOO_MANY' : "Es tut mir leid, aber das sind zu viele Optionen, wenn Du eine faire \
                               Abwägung vornehmen willst. Kannst Du Deine Optionen auf die vier plausibelsten \
                               eingrenzen?",     
            'QUANTITY_REPEAT' : "Kannst Du bitte nochmal wiederholen, zwischen wie vielen Optionen Du \
                               Dich entscheiden musst?"     
            'QUANTITY_REPEAT_2' : "Zwischen wie vielen Optionen musst Du Dich in diesem Fall entscheiden?",
            'EXPERIENCE'    : "Hast Du Erfahrung darin, Entscheidungen wie diese zu treffen?"
        }
    }    
};


function get_number_from_quantity_slot( key){
    var number_dict = {
        '1' : 1,
        1 : 1,
        'eins' : 1,
        'eine' : 1,
        'eine einzige' : 1,
        'one' : 1,
        'a single' : 1,
        'one single': 1,
        'only one' : 1,
        '2' : 2,
        2 : 2,
        'two' : 2,
        'zwei' : 2,
        '3' : 3,
        3 : 3,
        'three' : 3,
        'drei' : 3,
        4 : 4,
        '4' : 4,
        'four' : 4,
        'vier' : 4,
        5 : 5,
        '5' : 5,
        'five' : 5,
        'fünf' : 5,
        6 : 6,
        '6' : 6,
        'six' : 6,
        'sechs' : 6
    };
    return number_dict[ key];
};