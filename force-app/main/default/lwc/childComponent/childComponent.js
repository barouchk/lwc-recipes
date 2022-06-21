/**
 * Created by bkandov on 11/02/2021.
 */

import {LightningElement} from 'lwc';

export default class ChildComponent extends LightningElement {

    onButtonClicked() {
        console.log('child1 event fired >> ')

        this.dispatchEvent(
            // Default values for bubbles and composed are false.
            // must be in lower case
            new CustomEvent('childchanged', {bubbles: true, composed: true})
        );
    }

}