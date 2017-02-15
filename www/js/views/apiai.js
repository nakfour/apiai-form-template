/**
 *
 * This function connects to api.ai and starts the conversation.
 * populates the form fields
 *
 *
 * @param callback
 */
App.apiai = function(callback) {

   // Connect to api.ai
    ApiAIPlugin.init(
    {
       clientAccessToken: "INSERT YOU CLIENT ACCESS TOKEN", // insert your client access key here
       lang: "en" // set lang tag from list of supported languages
     },
     // Success Connect to api.ai
     function(result)
     {
       console.log("Success connecting to api.ai: " + result);

       TTS.speak('Hello Joanna!! What would you like to do ?',
       // Success TTS
       function ()
       {
            try {
                    ApiAIPlugin.requestVoice({}, // empty for simple requests, some optional parameters can be here
                     function (response)
                     {
                        var question = JSON.stringify(response.result.fulfillment.speech);
                        var isConversationDone = JSON.stringify(response.result.actionIncomplete);
                        console.log("Initial question: " + question + " Initial action: " + isConversationDone);
                        App.sendVoice(question);

                     },
                     function (error)
                     {
                         alert(error);
                     });
            } catch (e)
            {
               alert(e);
            }


       },
       //FAIL TTS
       function (reason)
       {
            alert(reason);
       });

     },
     //FAIL Connect to API.ai
     function(error)
     {
       console.log("Fail Connecting to api.ai: " + error);
     });
};

App.sendVoice = function(question) {

    console.log("App.sendVoice");
    TTS.speak(question,
    // Success TTS
     function ()
     {

        try {
                 ApiAIPlugin.requestVoice(
                 {}, // empty for simple requests, some optional parameters can be here
                 function (response2) {
                     var question2 = JSON.stringify(response2.result.fulfillment.speech);
                     var isConversationDone = JSON.stringify(response2.result.actionIncomplete);
                     console.log("question: " + question2 + " action: " + isConversationDone);
                     //console.log(response2);

                     ///////////////// TO DO////////////////////
                     // READ FIELDS TO POPULATE FORM VIEW
                     App.populateForm(response2);
                     // Take care of this error

                     if(isConversationDone == "true")
                     {
                            console.log("We are not done with the conversation, calling recursive");
                            App.sendVoice(question2);
                     }
                     else
                     {
                            // Speak the last conversation
                            TTS.speak(question2, function () {
                                  //alert('success');
                            }, function (reason) {
                                  alert(reason);
                            });
                     }
                 },
                 function (error) {
                    // place your error processing here
                    alert(error);
                 });
         } catch (e) {
            alert(e);
         }
      },
      function (reason) {
        alert(reason);
      });



};

// A function to populate the form fields
// At this time we populate during the conversation, one at a time
// For efficiency we might need to populate at the end only
App.populateForm = function(response) {

    /*Response json: {   "id": "3a23ebfa-eff1-4125-9eb7-700f10c78837",   "timestamp": "2017-02-15T03:05:01.991Z",   "lang": "en",
    "result": {     "source": "agent",     "resolvedQuery": "Porsche",     "action": "createnewcarreport",     "actionIncomplete": true,
    "parameters": {       "CarMake": "Porsche",       "CarModel": "",       "CarYear": "",       "NumberOfLaps": "",       "TrackName": ""     },     "contexts": [       {         "name": "47c48814-3321-46ce-af64-6e10f6a3364d_id_dialog_context",         "parameters": {           "TrackName.original": "",           "CarMake": "Porsche",           "CarModel": "",           "NumberOfLaps": "",           "NumberOfLaps.original": "",           "CarModel.original": "",           "CarMake.original": "Porsche",           "TrackName": "",           "CarYear": "",           "CarYear.original": ""         },         "lifespan": 2       },       {         "name": "create_report-car_dialog_context",         "parameters": {           "TrackName.original": "",           "CarMake": "Porsche",           "CarModel": "",           "NumberOfLaps": "",           "NumberOfLaps.original": "",           "CarModel.original": "",           "CarMake.original": "Porsche",           "TrackName": "",           "CarYear": "",           "CarYear.original": ""         },         "lifespan": 2       },       {         "name": "create_report-car_dialog_params_carmodel",         "parameters": {           "TrackName.original": "",           "CarMake": "Porsche",           "CarModel": "",           "NumberOfLaps": "",           "NumberOfLaps.original": "",           "CarModel.original": "",           "CarMake.original": "Porsche",           "TrackName": "",           "CarYear": "",           "CarYear.original": ""         },         "lifespan": 1       }     ],     "metadata": {       "intentId": "47c48814-3321-46ce-af64-6e10f6a3364d",       "webhookUsed": "false",       "webhookForSlotFillingUsed": "false",       "intentName": "create.report-car"     },     "fulfillment": {       "speech": "What is the car model?",       "messages": [         {           "type": 0,           "speech": "What is the car model?"         }       ]     },     "score": 1.0   },   "status": {     "code": 200,     "errorType": "success"   },   "sessionId": "ecf99cd2-bb54-4dab-b300-d648832e656f" }

    */
    //console.log(response.result.parameters.CarMake);
    //console.log(response);
    console.log("CarMake:" + response.result.parameters.CarMake);
    console.log("CarModel:" + response.result.parameters.CarModel);
    console.log("CarYear:" + response.result.parameters.CarYear);
    console.log("NumberOfLaps:" + response.result.parameters.NumberOfLaps);
    console.log("TrackName:" + response.result.parameters.TrackName);
    console.log("Comment:" + response.result.parameters.Comment);

    if(response.result.parameters.CarMake) {
        console.log("CarMake has value");
        App.populateFieldData("carmake",response.result.parameters.CarMake , function(err,value) { console.log("Error: " + err + " Value: " +value); })
    }
     if(response.result.parameters.CarModel) {
        console.log("CarModel has value");
        App.populateFieldData("carmodel",response.result.parameters.CarModel , function(err,value) { console.log("Error: " + err + " Value: " +value); })
    }
    if(response.result.parameters.CarYear) {
        console.log("CarYear has value");
        App.populateFieldData("caryear",parseInt(response.result.parameters.CarYear) , function(err,value) { console.log("Error: " + err + " Value: " +value); })
    }
    if(response.result.parameters.NumberOfLaps) {
            console.log("NumberOfLaps has value");
            App.populateFieldData("numberoflaps",parseInt(response.result.parameters.NumberOfLaps) , function(err,value) { console.log("Error: " + err + " Value: " +value); })
        }
    if(response.result.parameters.TrackName) {
        console.log("TrackName has value");
        App.populateFieldData("trackname",response.result.parameters.TrackName , function(err,value) { console.log("Error: " + err + " Value: " +value); })
    }
    if(response.result.parameters.Comment) {
        console.log("Comment has value");
        App.populateFieldData("comment",response.result.parameters.Comment , function(err,value) { console.log("Error: " + err + " Value: " +value); })
    }


};