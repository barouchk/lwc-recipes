// Import message service features required for publishing and the message channel
import { subscribe, publish, createMessageContext } from 'lightning/messageService';

const messageContext = createMessageContext()

/**
 * 
 * @param {*} channel send the desire messageChannel
 * @param {*} event send objects of data related to your messageChannel description
 */
const publishEvent = function (channel, event) {
    publish(messageContext, channel, event);
}

/**
 * 
 * @param {*} channel register to desire channel
 * @param {*} callBackFunc callback function when getting response
 */
const subscribeEvent = function (channel, callBackFunc) {
    return subscribe(
        messageContext,
        channel,
        (message) => callBackFunc(message)
    );
}

/**
 * 
 * @param {*} subscription pass the subscription created on subscribeEvent
 */
const unsubscribeEvent = function (subscription) {
    unsubscribe(subscription);
}

export {
    publishEvent,
    subscribeEvent,
    unsubscribeEvent
}