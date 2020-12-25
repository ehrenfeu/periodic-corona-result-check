//import { checkStatus } from "./check-result.js";
const checkResult = require('./check-result.js');
const config = require('./CONFIG.js');

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function checkLoop(customNotification) {
    return checkResult.check()
        .then(result => {
            if(result.Available)
            {
                if( result.Available && 
                    customNotification != null && 
                    customNotification instanceof Function) 
                {
                    customNotification(result.Text);
                }
            }
            else
            {
                wait(config.loopIntervalMs)
                    .then(val => checkLoop(customNotification));
            }
        });
}

exports.Start = checkLoop;

