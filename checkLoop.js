//import { checkStatus } from "./check-result.js";
const checkResult = require('./check-result.js');
const config = require('./CONFIG.js');

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkLoop(customNotification) {
    let result = await checkResult.check();
    if(result.Available) {
        if( result.Available && customNotification != null && customNotification instanceof Function) {
            customNotification(result.Text);
        }
    } else {
        await wait(config.loopIntervalMs);
        await checkLoop(customNotification);
    }
}

exports.Start = checkLoop;

