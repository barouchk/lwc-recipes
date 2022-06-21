/**
 * Created by bkandov on 11/02/2021.
 */

import {LightningElement} from 'lwc';

export default class ChildComponent extends LightningElement {

    handleChildChanged(event) {
        // event.stopPropagation()
        console.log('child2 event fired >> ', {...event})
        
    }

}