
'use strict';
const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.8426dafc-b3cb-4e1f-9760-a954e52e75f9';


exports.handler = function( event, context, callback){
    console.log( "Export handler invoked...");
    var alexa = Alexa.handler( event, context);
    alexa.appId = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers( 
        initializationHandler
        );
    alexa.execute();
};

var initializationHandler = {
    'LaunchRequest': function () {
    console.log( "initializationHandler with LaunchRequest invoked...");
    this.emit( ':ask', this.t( 'WELCOME') );
    },    
    'QuantityIntent': function () {
        console.log( "initializationHandler with QuantityIntent invoked...");
        var number_of_options = get_number_from_quantity_slot( this.event.request.intent.slots.quantity.value);
        if ( number_of_options == 1){
            this.emit( ':ask', this.t( 'QUANTITY_ONE') );
        } else if ( number_of_options == 2){
            this.emit( ':ask', this.t( 'QUANTITY_TWO') );
        } else {
            this.emit( ':tell', this.t( 'QUANTITY_GOOD') );
        }
    }
};



var languageStrings = {
    'en-US': {
        'translation': {
            'WELCOME'       : "Welcome to Decision Coach. I will gladly help you in making a \
                               difficult decision, by asking you a couple of questions. \
                               Let's start right away: Between how many options do you have to decide?",
            'QUANTITY_GOOD' : " is a good amount of options.",
            'QUANTITY_ONE'  : "It's not really a decision if there is only one option. \
                              If you think about not pursuing the one option, or to do something \
                              else entirely, how many realistic options do you have?",
            'QUANTITY_TWO'  : "Alright, two options are perfectly plausible. However, there is a \
                              typical fallacy called the false dilemma, where people think they have \
                              to decide between two options when actually there are more options \
                              available. Are you sure there are only two options in your case?"                                
        }
    },
    'de-DE': {
        'translation': {
            'WELCOME'       : "Willkommen beim Entscheidungs Coach. Zwischen wie vielen Optionen \
                               musst Du Dich entscheiden?",
            'QUANTITY_GOOD' : " ist eine gute Anzahl von Optionen.",
            'QUANTITY_ONE'  : "Bei einer Option ist es nicht wirklich eine Entscheidung. Wenn Du \
                               auch die Möglichkeit einbeziehst, diese eine Option nicht umzusetzen, oder \
                               etwas ganz anderes zu tun, wie viele Möglichkeiten hast Du dann?",
            'QUANTITY_TWO'  : "Zwei Optionen sind vollkommen plausibel. Allerdings gibt es den häufigen \
                               Fehlschluss, es gäbe nur zwei Optionen, wenn es in Wirklichkeit noch \
                               andere gute Möglichkeiten gibt. Bist Du sicher, dass Du nur zwei Optionen hast?"
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