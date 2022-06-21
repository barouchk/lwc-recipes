import { LightningElement, track } from 'lwc';
import { labels } from './constants'

import CartCtrl from './cartController';

export default class Cart extends LightningElement {

    @track cart = {};
    
    cartController;
    
    @track labels = labels

    connectedCallback(){
        this.cartController = new CartCtrl(this.cart)
    }

    handleCartTitleChanged(event){
        const {value} = event.target
        this.cartController.setCartTitle(value);
    }

    handleButtonClicked(){
        this.cartController.loadData()
    }
}