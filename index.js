
'use strict';
const Alexa = require('alexa-sdk');

//const APP_ID = 'amzn1.ask.skill.id';


exports.handler = function( event, context, callback){
    console.log( "Export handler invoked...");
    var alexa = Alexa.handler( event, context);
    //alexa.appId = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers( 
        newSessionHandlers,
        quantifyOptionHandlers,
        confirmOptionHandlers,
        polarQuestionHandlers,
        choiceQuestionHandlers,
        resultHandlers
        );
    alexa.execute();
};

//==================================================================================================
// STATES
//==================================================================================================

var states = {
    QUANTIFY_OPTIONS : '_QUANTIFY_OPTIONS',
    CONFIRM_OPTIONS  : '_CONFIRM_OPTIONS',
    QUESTION_POLAR   : '_QUESTION_POLAR',
    QUESTION_CHOICE  : '_QUESTION_CHOICE',
    RESULT           : '_RESULT'
};

//==================================================================================================
// HANDLERS
//==================================================================================================

var newSessionHandlers = {
    'LaunchRequest': function () {
        console.log( "newSessionHandler with LaunchRequest invoked...");
        this.handler.state = states.QUANTIFY_OPTIONS;
        this.emit( 
            ':ask', 
            this.t( 'WELCOME') 
        );
    },
    'Unhandled': function() {
        console.log( "newSessionHandler with Unhandled Request invoked...");        
        this.handler.state = states.QUANTIFY_OPTIONS;
        this.emit( 
            ':ask', 
            this.t( 'WELCOME') 
        );
    }    
};

// --------------- quantifyOptionHandlers  -----------------------

var quantifyOptionHandlers = Alexa.CreateStateHandler( states.QUANTIFY_OPTIONS, {
    'QuantityIntent': function () {
        console.log( "quantifyOptionHandlers with QuantityIntent invoked...");
        this.attributes.number_of_options = get_number_from_slot( 
            this.event.request.intent.slots.quantity.value
        );
        if ( this.attributes.number_of_options == 1){
            this.emit( 
                ':ask', 
                this.t( 'QUANTITY_ONE') 
            );
        } else if ( this.attributes.number_of_options == 2){
            this.handler.state = states.CONFIRM_OPTIONS;
            this.emit( 
                ':ask', 
                this.t( 'QUANTITY_TWO') 
            );
        } else if ( this.attributes.number_of_options > 4){
            this.handler.state = states.CONFIRM_OPTIONS;            
            this.emit( 
                ':ask', 
                this.t( 'QUANTITY_TOO_MANY') 
            );
        } else {
            this.handler.state = states.CONFIRM_OPTIONS;                        
            this.emit( 
                ':ask', 
                this.attributes.number_of_options + this.t( 'QUANTITY_GOOD') 
            );
        }
    },
    'Unhandled': function() {
        console.log( "quantifyOptionHandlers with Unhandled Request invoked...");        
        this.emit( ':ask', this.t( 'REPEAT_QUANTITY') );
    }       
});

// --------------- confirmOptionHandlers  -----------------------

var confirmOptionHandlers = Alexa.CreateStateHandler( states.CONFIRM_OPTIONS, {
    'YesIntent': function () {
        console.log("confirmOptionHandlers with YesIntent invoked...");
        this.attributes.node_current = 'experience';
        this.attributes.node_next = question_mapping[ this.attributes.node_current].next;;
        this.handler.state = question_mapping[ this.attributes.node_current].mode;
        this.emit( 
            ':ask', 
            this.t( question_mapping[ this.attributes.node_current].question) 
        );
    },
    'QuantityIntent': function () {
        console.log( "confirmOptionHandlers with QuantityIntent invoked...");
        this.attributes.number_of_options = get_number_from_slot( 
            this.event.request.intent.slots.quantity.value
        );
        if ( this.attributes.number_of_options == 1){
            this.emit( 
                ':ask', 
                this.t( 'QUANTITY_ONE') 
            );
        } else if ( this.attributes.number_of_options == 2){
            this.handler.state = states.CONFIRM_OPTIONS;
            this.emit( 
                ':ask', 
                this.t( 'QUANTITY_TWO') 
            );
        } else if ( this.attributes.number_of_options > 4){
            this.handler.state = states.CONFIRM_OPTIONS;            
            this.emit( 
                ':ask', 
                this.t( 'QUANTITY_TOO_MANY') 
            );
        } else {
            this.handler.state = states.CONFIRM_OPTIONS;                        
            this.emit( 
                ':ask', 
                this.attributes.number_of_options + this.t( 'QUANTITY_GOOD') 
            );
        }
    },
    'Unhandled': function() {
        console.log( "quantifyOptionHandlers with Unhandled Request invoked...");        
        this.emit( 
            ':ask', 
            this.t( 'REPEAT_QUANTITY_2') 
        );
    }       
});

// --------------- polarQuestionHandlers  -----------------------

var polarQuestionHandlers = Alexa.CreateStateHandler( states.QUESTION_POLAR, {
    'YesIntent': function () {
        console.log("polarQuestionHandlers with YesIntent invoked...");
        this.attributes[ this.attributes.node_current] = 1
        // Start processing the next question
        this.attributes.node_current = this.attributes.node_next;
        this.attributes.node_next = question_mapping[ this.attributes.node_current].next;;
        this.handler.state = question_mapping[ this.attributes.node_current].mode;
        this.emit( 
            ':ask', 
            this.t( question_mapping[ this.attributes.node_current].question) 
        );
    },
    'NoIntent': function () {
        console.log("polarQuestionHandlers with NoIntent invoked...");
        this.attributes[ this.attributes.node_current] = 0
        // Start processing the next question
        this.attributes.node_current = this.attributes.node_next;
        this.attributes.node_next = question_mapping[ this.attributes.node_current].next;;
        this.handler.state = question_mapping[ this.attributes.node_current].mode;
        this.emit( 
            ':ask', 
            this.t( question_mapping[ this.attributes.node_current].question) 
        );
    },    
    'Unhandled': function() {
        console.log( "quantifyOptionHandlers with Unhandled Request invoked...");        
        this.emit( 
            ':ask', 
            this.t( 'REPEAT_POLAR')
        );
    }       
});

// --------------- choiceQuestionHandlers  -----------------------

var choiceQuestionHandlers = Alexa.CreateStateHandler( states.QUESTION_CHOICE, {
    'ChoiceIntent': function () {
        console.log("choiceQuestionHandlers with ChoiceIntent invoked...");
        var chosen_option = get_number_from_slot( 
            this.event.request.intent.slots.choice.value
        );
        if ( chosen_option > this.attributes.number_of_options ){
            // Selected choice out of bounds
            console.log( 
                "Invalid option chosen: " + chosen_option + 
                ' of ' + this.attributes.number_of_options
            );        
            var text = this.t( 'REPEAT_CHOICE_TOO_HIGH').replace(
                "XYZ",
                this.attributes.number_of_options
            )
            this.emit( 
                ':ask', 
                text
            );
        } else if ( chosen_option <= this.attributes.number_of_options &&
            chosen_option > 0 ){
            // Valid choice, save result and proceed
            this.attributes[ this.attributes.node_current] = chosen_option;
            if ( this.attributes.node_next == 'result' ){
                // Sum up the answer values and determine best option
                var result_table = {};
                for (var i = 1; i <= this.attributes.number_of_options; i++){
                    result_table[ i] = 0;
                }
                for ( var question_key in question_mapping) {
                    if ( question_mapping[ question_key].type == 'value'){
                        result_table[ 
                            this.attributes[ question_key] 
                        ] += question_mapping[ 
                            question_key
                        ].value;
                    } else if ( question_mapping[ question_key].type == 'modifier' ){
                        result_table[ 
                            this.attributes[ // Reference to target question of modifier question
                                question_mapping[ question_key][ 'target']
                            ]
                        ] += question_mapping[ // Reference to target question of modifier question
                            question_mapping[ question_key][ 'target']
                        ].value * ( question_mapping[ // Modifier value of modifier question
                            question_key
                        ][ 'value'] - 1 ) * this.attributes[ // Boolean answer to modifier question
                            question_key
                        ]
                    }
                }
                var winning_option = Object.keys( result_table ).reduce( // StackOverflow Magic
                    function(a, b){ return result_table[a] > result_table[b] ? a : b }
                ); // To be improved: Does not indicate draw situation! :(
                this.handler.state = states.RESULT;
                var result_text = this.t( 'RESULT').replace(
                    "XYZ",
                    winning_option
                )
                this.emit( 
                    ':tell', 
                    result_text 
                ); 
            } else {
                // Start processing the next question
                this.attributes.node_current = this.attributes.node_next;
                this.attributes.node_next = question_mapping[ this.attributes.node_current].next;
                this.handler.state = question_mapping[ this.attributes.node_current].mode;
                this.emit( 
                    ':ask', 
                    this.t( question_mapping[ this.attributes.node_current].question) 
                ); 
            }           
        } else {
            console.log( 
                "Invalid option chosen: " + chosen_option
            );
            this.emit( 
            ':ask', 
            this.t( 'REPEAT_CHOICE') // Better: 'REPEAT_CHOICE_3'
        ); 
        }
    }, 
    'QuantityIntent': function () {
        console.log("choiceQuestionHandlers with QuantityIntent invoked...");
        var chosen_option = get_number_from_slot( 
            this.event.request.intent.slots.quantity.value
        );
        if ( chosen_option > this.attributes.number_of_options ){
            console.log( 
                "Invalid option chosen: " + chosen_option + 
                ' of ' + this.attributes.number_of_options
            );
            var text = this.t( 'REPEAT_CHOICE_TOO_HIGH').replace(
                "XYZ",
                this.attributes.number_of_options
            )
            this.emit( ':ask', text);
        } else if ( chosen_option <= this.attributes.number_of_options &&
            chosen_option > 0 ){
            this.attributes[ this.attributes.node_current] = chosen_option;
            // Start processing the next question
            this.attributes.node_current = this.attributes.node_next;
            this.attributes.node_next = question_mapping[ this.attributes.node_current].next;;
            this.handler.state = question_mapping[ this.attributes.node_current].mode;
            this.emit( ':ask', this.t( question_mapping[ this.attributes.node_current].question) );            
        } else {
            console.log( 
                "Invalid option chosen: " + chosen_option
            );
            this.emit( ':ask', this.t( 'REPEAT_CHOICE')); // Better: 'REPEAT_CHOICE_3'
        }
    },     
    'Unhandled': function() {
        console.log( "choiceQuestionHandlers with Unhandled Request invoked...");        
        this.emit( ':ask', this.t( 'REPEAT_CHOICE')); // Better: 'REPEAT_CHOICE_3'
    }       
});

// --------------- resultHandlers  -----------------------

var resultHandlers = Alexa.CreateStateHandler( states.RESULT, {
    'Unhandled': function() {
        console.log( "resultHandlers with Unhandled Request invoked...");        
        this.emit( 
            ':ask', 
            this.t( 'REPEAT_CHOICE') // To Do: 'Thank you for playing!'
        ); 
    }       
});

//==================================================================================================
// QUESTION MAPPING
//==================================================================================================

var question_mapping = {
    'experience'   : {
        'mode'     : states.QUESTION_POLAR,
        'question' : 'EXPERIENCE',
        'next'     : 'feeling',
        'type'     : 'modifier',
        'target'   : 'feeling',
        'value'    : 2
    },
    'feeling'      : {
        'mode'     : states.QUESTION_CHOICE,
        'question' : 'FEELING',
        'next'     : 'relieve',
        'type'     : 'value',
        'value'    : 1        
    },
    'relieve'      : {
        'mode'     : states.QUESTION_CHOICE,
        'question' : 'RELIEVE',
        'next'     : 'pride',
        'type'     : 'value',
        'value'    : 1
    },
    'pride'      : {
        'mode'     : states.QUESTION_CHOICE,
        'question' : 'PRIDE',
        'next'     : 'development',
        'type'     : 'value',
        'value'    : 1
    },
    'values'      : {
        'mode'     : states.QUESTION_CHOICE,
        'question' : 'VALUES',
        'next'     : 'longterm',
        'type'     : 'value',
        'value'    : 2
    },,
    'longterm'     : {
        'mode'     : states.QUESTION_CHOICE,
        'question' : 'LONGTERM',
        'next'     : 'result',
        'type'     : 'value',
        'value'    : 2        
    }    
}

//==================================================================================================
// RESSOURCES
//==================================================================================================

var languageStrings = {
    'en-US': {
        'translation': {
            'WELCOME'       : "Welcome to Decision Coach. I will gladly help you in making a " +
                              " difficult decision, by asking you a couple of questions. " +
                              " Let's start right away: Between how many options do you have to decide?",
            'QUANTITY_GOOD' : " is a good amount of options. Are you ready to answer some questions " +
                              " about these options?",
            'QUANTITY_ONE'  : "It's not really a decision if there is only one option. " +
                              " If you think about not pursuing the one option, or to do something " +
                              " else entirely, how many realistic options do you have?",
            'QUANTITY_TWO'  : "Alright, two options are perfectly plausible. However, there is a " +
                              " typical fallacy called the false dilemma, where people think they have " +
                              " to decide between two options when actually there are more options " +
                              " available. Are you sure there are only two options in your case?",
            'QUANTITY_TOO_MANY' : "Sorry, but these are too many options, if you want to " +
                              " give a fair consideration for each of them. Can you narrow down your " +
                              " range of options to the four most plausible ones?",
            'REPEAT_QUANTITY' : "How many options did you say you have?",
            'REPEAT_QUANTITY_2' : "In this case, how many relevant options do you have?",
            'REPEAT_POLAR'  : "Was this a yes or a no?",
            'REPEAT_CHOICE' : "Please choose one option by saying 'Number one', 'option B', " +
                              " 'the third' or similar.",
            'REPEAT_CHOICE_TOO_HIGH' : "You have narrowed down your options to XYZ before. " +
                              " Please choose one of those, or start over again.",
            'FEELING'       : "Which option feels most 'right' to you?",
            'RELIEVE'       : "Which option would you feel most relieved about?",
            'PRIDE'         : "Which option would make yo feel most proud about yourself?",
            'VALUES'        : "Which option aligns best with your core values?",
            'LONGTERM'      : "Which option is best for you in the long run?",
            'RESULT'        : "Alright, here is your result: Option XYZ seems to be best for you."
        }
    },
    'de-DE': {
        'translation': {
            'WELCOME'       : "Willkommen beim Entscheidungs Coach. Zwischen wie vielen Optionen " +
                              " musst Du Dich entscheiden?",
            'QUANTITY_GOOD' : " ist eine gute Anzahl von Optionen. Bist Du bereit, einige Fragen zu diesen " +
                              " Optionen zu beantworten?",
            'QUANTITY_ONE'  : "Bei einer Option ist es nicht wirklich eine Entscheidung. Wenn Du " +
                              " auch die Möglichkeit einbeziehst, diese eine Option nicht umzusetzen, oder" +
                              " etwas ganz anderes zu tun, wie viele Möglichkeiten hast Du dann?",
            'QUANTITY_TWO'  : "Zwei Optionen sind vollkommen plausibel. Allerdings gibt es den häufigen " +
                              " Fehlschluss, es gäbe nur zwei Optionen, wenn es in Wirklichkeit noch " +
                              " andere gute Möglichkeiten gibt. Bist Du sicher, dass Du nur zwei Optionen hast?",
            'QUANTITY_TOO_MANY' : "Es tut mir leid, aber das sind zu viele Optionen, wenn Du eine faire " +
                              " Abwägung vornehmen willst. Kannst Du Deine Optionen auf die vier plausibelsten " +
                              " eingrenzen?",     
            'REPEAT_QUANTITY' : "Kannst Du bitte nochmal wiederholen, zwischen wie vielen Optionen Du " +
                              " Dich entscheiden musst?",     
            'REPEAT_QUANTITY_2' : "Zwischen wie vielen Optionen musst Du Dich in diesem Fall entscheiden?",
            'REPEAT_POLAR'  : "War das ein Ja oder ein Nein?" ,
            'REPEAT_CHOICE' : "Bitte wähle eine Option aus, indem Du 'Nummer Eins', 'Option B', " +
                              " 'die Dritte' or etwas ähnliches sagst.",
            'REPEAT_CHOICE_TOO_HIGH' : "Du hattest Dich auf XYZ Optionen eingeschränkt. " +
                              " Bitte wähle eine dieser Optionen aus, oder starte von vorne.",  
            'EXPERIENCE'    : "Hast Du Erfahrung darin, Entscheidungen wie diese zu treffen?",
            'FEELING'       : "Welche Option fühlt sich für Dich am meisten 'richtig' an?",
            'RELIEVE'       : "Über welche Option wärst Du am meisten erleichtert?",
            'PRIDE'         : "Welcher Option würde Dich am meisten stolz machen?",
            'VALUES'        : "Welche Option hat die größte Übereinstimmung mit Deinen Werten und Zielen?",
            'LONGTERM'      : "Welche Option ist langfristig für Dich am Besten?",
            'RESULT'        : "Alles klar, hier ist Dein Ergebnis: Ich würde sagen, Option XYZ " +
                              " scheint für Dich am Besten zu sein."
        }
    }    
};

//==================================================================================================
// HELPERS
//==================================================================================================

function get_number_from_slot( key){
    var number_dict = {
        '1' : 1,
        1 : 1,
        '1st' : 1,
        'a' : 1,
        'eins' : 1,
        'eine' : 1,
        'eine einzige' : 1,
        'erste' : 1,
        'one' : 1,
        'a single' : 1,
        'one single': 1,
        'only one' : 1,
        'first' : 1,
        '2' : 2,
        2 : 2,
        '2nd' : 2,
        'b' : 2,
        'two' : 2,
        'second': 2,
        'other' : 2,
        'zwei' : 2,
        'zweite' : 2,
        'andere' : 2,
        '3' : 3,
        3 : 3,
        '3rd' : 3,
        'c' : 3,
        'three' : 3,
        'third' : 3,
        'drei' : 3,
        'dritte' : 3,
        4 : 4,
        '4' : 4,
        '4th' : 4,
        'd' : 4,
        'four' : 4,
        'fourth' : 4,
        'vier' : 4,
        'vierte' : 4,
        5 : 5,
        '5' : 5,
        '5th' : 5,
        'e' : 5,
        'five' : 5,
        'fifth' : 5,
        'fünf' : 5,
        'fünfte' : 5,
        6 : 6,
        '6' : 6,
        '6th' : 6,
        'f' : 6,
        'six' : 6,
        'sixth' : 6,
        'sechs' : 6,
        'sechste' : 6
    };
    return number_dict[ key];
};