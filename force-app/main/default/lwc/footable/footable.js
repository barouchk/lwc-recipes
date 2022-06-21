/**
 * Created by bkandov on 16/11/2020.
 */

import {LightningElement} from 'lwc';
import {loadStyle, loadScript} from 'lightning/platformResourceLoader';

import footablejs from '@salesforce/resourceUrl/footablejs'
import footablecss from '@salesforce/resourceUrl/footablecss'

export default class Footable extends LightningElement {

    init = false;

    renderedCallback() {
        if (this.init) {
            return;
        }
        this.init = true;

        console.log('footablejs >> ', footablejs)
        console.log('footablecss >> ', footablecss)

        // Promise.all([
        //     loadScript(this, footablejs + '/d3.v5.min.js'),
        //     loadStyle(this, footablecss + '/style.css')
        // ])
        //     .then(() => {
        //         this.initializeD3();
        //     })
        //     .catch(error => {
        //         this.dispatchEvent(
        //             new ShowToastEvent({
        //                 title: 'Error loading D3',
        //                 message: error.message,
        //                 variant: 'error'
        //             })
        //         );
        //     });
    }
}