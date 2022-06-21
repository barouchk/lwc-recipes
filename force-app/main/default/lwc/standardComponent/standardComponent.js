import { LightningElement, track } from 'lwc';

import CART_TITLE_LABEL from '@salesforce/label/c.Cart_title'

import getProducts from '@salesforce/apex/ServiceController.getProducts'

export default class StandardComponent extends LightningElement {

    @track cart = {
        title: CART_TITLE_LABEL
    }

    handleButtonClicked() {
        getProducts()
            .then(result => {
                this.cart.products = result;
            })
            .catch(error => {
                this.error = error;
            });
    }

    handleCartTitleChanged(event){
        const {value} = event.target
        this.cart.title = value
    }
}