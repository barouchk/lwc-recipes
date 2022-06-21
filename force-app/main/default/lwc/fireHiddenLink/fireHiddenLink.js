/**
 * Created by bkandov on 18/10/2020.
 */

import {LightningElement} from 'lwc';

export default class FireHiddenLink extends LightningElement {

    fireHref() {
        const link = this.template.querySelector('a')
        link.click();
    }

}