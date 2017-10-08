
// This code is for testing the scoring function in the final stage of 
// Decision Coach's Skill conversation.
// It is supposed to be run in the REPL of your choice

var number_of_options = 3;
var result_table = {};

for (var i = 1; i <= number_of_options; i++){
    result_table[ i] = 0;
};

var states = {
    QUANTIFY_OPTIONS : '_QUANTIFY_OPTIONS',
    CONFIRM_OPTIONS  : '_CONFIRM_OPTIONS',
    QUESTION_POLAR   : '_QUESTION_POLAR',
    QUESTION_CHOICE  : '_QUESTION_CHOICE',
    RESULT           : '_RESULT'
};


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
        'next'     : 'regret',
        'type'     : 'value',
        'value'    : 1
    },
    'regret'      : {
        'mode'     : states.QUESTION_CHOICE,
        'question' : 'REGRET',
        'next'     : 'values',
        'type'     : 'value',
        'value'    : 1
    },
    'values'      : {
        'mode'     : states.QUESTION_CHOICE,
        'question' : 'VALUES',
        'next'     : 'longterm',
        'type'     : 'value',
        'value'    : 2
    },    
    'longterm'     : {
        'mode'     : states.QUESTION_CHOICE,
        'question' : 'LONGTERM',
        'next'     : 'result',
        'type'     : 'value',
        'value'    : 2        
    }    
}

var event = {
    "attributes": {
      "node_next": "result",
      "number_of_options": 3,
      "node_current": "longterm",
      "regret": 1,
      "relieve": 2,
      "values": 2,
      "STATE": "_QUESTION_CHOICE",
      "feeling": 1,
      "experience": 1
    }
};


for ( var question_key in question_mapping) {
    if ( question_mapping[ question_key].type == 'value'){
        result_table[ 
            event.attributes[ question_key] 
        ] += question_mapping[ 
            question_key
        ].value;
    } else if ( question_mapping[ question_key].type == 'modifier' ){
        result_table[ 
            event.attributes[ 
                question_mapping[ question_key][ 'target']
            ]
        ] += question_mapping[
            question_mapping[ question_key][ 'target']
        ].value * ( question_mapping[ 
            question_key
        ][ 'value'] - 1 ) * event.attributes[
            question_key
        ]
    }
};

var winning_option = Object.keys( result_table ).reduce(function(a, b){ return result_table[a] > result_table[b] ? a : b });
