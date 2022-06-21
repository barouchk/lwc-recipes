/**
 * Created by bkandov on 29/12/2020.
 */

import {LightningElement, api} from 'lwc';

export default class CustomProgressIndicator extends LightningElement {

    @api currentStep

    @api type = 'base'

    @api hasError = false

    // example: options = ['step-1','step-2','step-3']
    @api options

}