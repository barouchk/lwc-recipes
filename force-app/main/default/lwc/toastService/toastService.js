/**
 * Created by bkandov.
 *
 * HOW TO USE:
 * 1. import service to your custom component: 
 * import {showToast} from 'c/toastService'
 *  
 * 2. call service by .call javascript method to bind this parameter: 
 * showToast.call(this, 'title', 'message', 'warning','sticky')
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

export { showToast }