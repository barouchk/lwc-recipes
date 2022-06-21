/**
 * Created by bkandov.
 *
 * HOW TO USE:
 * 1. import service to your custom component: 
 * import {showToast} from 'c/toastService'
 *  
 * 2. call service by .call javascript method to bind this parameter: 
 * showToast.call(this, 'title', 'message', 'warning','sticky')
 * showSuccess.call(this, 'title', 'message')
 * same to all other functions (warning, info, error)
 */
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

/**
 *
 * @param title - (Required) The title of the toast, displayed as a heading.
 *
 * @param msg - (Required) A string representing the body of the message.
 * It can contain placeholders in the form of {0} ... {N}.
 * The placeholders are replaced with the links on messageData
 *
 * @param type - Changes the appearance of the notice.
 * Toasts inherit styling from toasts in the Lightning Design System.
 * Valid values are: info (default), success, warning, and error.
 */
const showToast = function (title, message, type, visibleMode) {
    const variant = type || 'info'
    const mode = visibleMode || 'dismissable'

    const event = new ShowToastEvent({
        title,
        message,
        variant,
        mode
    });
    this.dispatchEvent(event);
}

const showError = function (title, message) {
    const event = getToastEvent(title, message, 'error', 'sticky')
    this.dispatchEvent(event)
}

const showWarning = function (title, message) {
    const event = getToastEvent(title, message, 'warning')
    this.dispatchEvent(event)
}

const showSuccess = function (title, message) {
    const event = getToastEvent(title, message, 'success')
    this.dispatchEvent(event)
}

const showInfo = function (title, message) {
    const event = getToastEvent(title, message)
    this.dispatchEvent(event)
}

const getToastEvent = function (title, message, type, visibleMode) {

    const variant = type || 'info'
    const mode = visibleMode || 'dismissable'

    const event = new ShowToastEvent({
        title,
        message,
        variant,
        mode
    })

    return event
}

export {
    showToast,
    showError,
    showWarning,
    showSuccess,
    showInfo
}