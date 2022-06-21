/**
 * Created by bkandov on 11/02/2021.
 */

import {LightningElement} from 'lwc';

export default class SubChildComponent extends LightningElement {

    onButtonClicked() {
        this.dispatchEvent(
            // Default values for bubbles and composed are false.
            // must be in lower case
            new CustomEvent('buttonclicked', {bubbles: true, composed: true})
        );
    }

}