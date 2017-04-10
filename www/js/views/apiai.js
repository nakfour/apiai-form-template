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
            console.log("TTS Retuned tyrying requestVoice");
            try {
                    ApiAIPlugin.requestVoice({}, // empty for simple requests, some optional parameters can be here
                     function (response)
                     {
                        var question = JSON.stringify(response.result.fulfillment.speech);
                        var isConversationDone = JSON.stringify(response.result.actionIncomplete);
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
                            /*Great Work we know from your location you are at $trackname, your total distance covered is $numberoflaps*1000 miles we will submit your report on $carmodel, $carmake for $caryear.*/
                            /* Construct the final answer before we submit*/
                            // Only submit report when fields are valid
                            // Sometimes we can cancel and this ends the convestation
                            if((response2.result.parameters.carmake) &&
                            (response2.result.parameters.carmodel) &&
                            (response2.result.parameters.caryear) &&
                            (response2.result.parameters.trackname) &&
                            (response2.result.parameters.drivetime) &&
                            (response2.result.parameters.comment))
                            {


                                var driveTimeInhr = parseInt(response2.result.parameters.drivetime)/60;
                                var finalString= "Great Work !! Your total distance for "
                                + response2.result.parameters.carmodel + " " + response2.result.parameters.carmake + " at " + response2.result.parameters.trackname + " was " + parseInt(response2.result.parameters.numberoflaps)*13 + " miles " +
                                " and your average speed was " + Math.round(parseInt(response2.result.parameters.numberoflaps)*13/driveTimeInhr) + " miles per hour. We will submit your report.";
                                console.log(finalString);


                                TTS.speak(finalString, function () {
                                  // Submitting report
                                  App.views.form.submit();
                                }, function (reason) {
                                  alert(reason);
                                });
                            } else
                            {
                                TTS.speak(question2, function () {
                                     }, function (reason) {
                                         alert(reason);
                                    });
                            }


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
    "parameters": {       "carmake": "Porsche",       "carmodel": "",       "caryear": "",       "numberoflaps": "",       "trackname": ""     },     "contexts": [       {         "name": "47c48814-3321-46ce-af64-6e10f6a3364d_id_dialog_context",         "parameters": {           "trackname.original": "",           "carmake": "Porsche",           "carmodel": "",           "numberoflaps": "",           "numberoflaps.original": "",           "carmodel.original": "",           "carmake.original": "Porsche",           "trackname": "",           "caryear": "",           "caryear.original": ""         },         "lifespan": 2       },       {         "name": "create_report-car_dialog_context",         "parameters": {           "trackname.original": "",           "carmake": "Porsche",           "carmodel": "",           "numberoflaps": "",           "numberoflaps.original": "",           "carmodel.original": "",           "carmake.original": "Porsche",           "trackname": "",           "caryear": "",           "caryear.original": ""         },         "lifespan": 2       },       {         "name": "create_report-car_dialog_params_carmodel",         "parameters": {           "trackname.original": "",           "carmake": "Porsche",           "carmodel": "",           "numberoflaps": "",           "numberoflaps.original": "",           "carmodel.original": "",           "carmake.original": "Porsche",           "trackname": "",           "caryear": "",           "caryear.original": ""         },         "lifespan": 1       }     ],     "metadata": {       "intentId": "47c48814-3321-46ce-af64-6e10f6a3364d",       "webhookUsed": "false",       "webhookForSlotFillingUsed": "false",       "intentName": "create.report-car"     },     "fulfillment": {       "speech": "What is the car model?",       "messages": [         {           "type": 0,           "speech": "What is the car model?"         }       ]     },     "score": 1.0   },   "status": {     "code": 200,     "errorType": "success"   },   "sessionId": "ecf99cd2-bb54-4dab-b300-d648832e656f" }

    */
    console.log("carmake:" + response.result.parameters.carmake);
    console.log("carmodel:" + response.result.parameters.carmodel);
    console.log("caryear:" + response.result.parameters.caryear);
    console.log("numberoflaps:" + response.result.parameters.numberoflaps);
    console.log("trackname:" + response.result.parameters.trackname);
    console.log("drivetime:" + response.result.parameters.drivetime);
    console.log("comment:" + response.result.parameters.comment);

    if(response.result.parameters.carmake) {
        console.log("carmake has value");
        App.populateFieldData("carmake",response.result.parameters.carmake , function(err,value) { console.log("Error: " + err + " Value: " +value); })
    }
     if(response.result.parameters.carmodel) {
        console.log("carmodel has value");
        App.populateFieldData("carmodel",response.result.parameters.carmodel , function(err,value) { console.log("Error: " + err + " Value: " +value); })
    }
    if(response.result.parameters.caryear) {
        console.log("caryear has value");
        App.populateFieldData("caryear",parseInt(response.result.parameters.caryear) , function(err,value) { console.log("Error: " + err + " Value: " +value); })
    }
    if(response.result.parameters.numberoflaps) {
            console.log("numberoflaps has value");
            App.populateFieldData("numberoflaps",parseInt(response.result.parameters.numberoflaps) , function(err,value) { console.log("Error: " + err + " Value: " +value); })
        }
    if(response.result.parameters.trackname) {
        console.log("trackname has value");
        App.populateFieldData("trackname",response.result.parameters.trackname , function(err,value) { console.log("Error: " + err + " Value: " +value); })
        //Setting Driving Distance
        if(response.result.parameters.numberoflaps) {
            // We can add more tracks later
            console.log("drivedistance assuming Nurburgring which is around 13miles/21km");
            var totalDistance=parseInt(response.result.parameters.numberoflaps)*13;
            console.log("Total Driving Distance is: " + totalDistance);
            App.populateFieldData("drivedistance",totalDistance , function(err,value) { console.log("Error: " + err + " Value: " +value);})
        }
    }
    if(response.result.parameters.drivetime) {
            console.log("drivetime has value");
            App.populateFieldData("drivetime",parseInt(response.result.parameters.drivetime) , function(err,value) { console.log("Error: " + err + " Value: " +value); })
            //Setting Average Speed
            if((response.result.parameters.numberoflaps) && (response.result.parameters.trackname)){
                // We can add more tracks later
                console.log("speed assuming Nurburgring which is around 13miles/21km");
                var driveTimeInhr = parseInt(response.result.parameters.drivetime)/60;
                console.log("driveTimenhr: " + driveTimeInhr);
                var averageSpeed=Math.round((parseInt(response.result.parameters.numberoflaps)*13)/driveTimeInhr);
                console.log("Average speed is: " + averageSpeed);
                App.populateFieldData("speed",averageSpeed , function(err,value) { console.log("Error: " + err + " Value: " +value);})
            }
        }
    if(response.result.parameters.comment) {
        console.log("comment has value");
        App.populateFieldData("comment",response.result.parameters.comment , function(err,value) { console.log("Error: " + err + " Value: " +value); })
    }


};
