/**
 * Created by bkandov on 10/11/2020.
 */

import {LightningElement} from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

export default class LightningTabComponentMisc extends NavigationMixin(LightningElement) {


    url;

    connectedCallback() {
        // Store the PageReference in a variable to use in handleClick.
        // This is a plain Javascript object that conforms to the
        // PageReference type by including 'type' and 'attributes' properties.
        // The 'state' property is optional.
        this.componentRef = {
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'test_lightning_tab'
            },
            state: {
                c__recordId: '5'
            }
        };
    }

    handleClick(evt) {
        // Stop the event's default behavior.
        // Stop the event from bubbling up in the DOM.
        evt.preventDefault();
        evt.stopPropagation();
        // Navigate to the Account Home page.
        this[NavigationMixin.Navigate](this.componentRef);
    }

}