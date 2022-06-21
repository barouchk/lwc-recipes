/**
 * Created by bkandov on 10/11/2020.
 */

import {LightningElement, api} from 'lwc';

export default class LightningTabComponent extends LightningElement {

    @api c__recordId

    handleClick() {
        console.log(this.c__recordId)
    }
}