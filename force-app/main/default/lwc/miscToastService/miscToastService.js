import { LightningElement } from 'lwc';
import { showError, showSuccess, showWarning, showInfo } from "c/toastService";

export default class MiscToastService extends LightningElement {

    connectedCallback() {
        showSuccess.call(this, 'succes title', 'success message')
        showError.call(this, 'error title', 'error message')
        showWarning.call(this, 'warning title', 'warning message')
        showInfo.call(this, 'info title', 'info message')
    }
}