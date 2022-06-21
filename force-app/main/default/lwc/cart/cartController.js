import cartService from "./cartService";
import { labels } from './constants'

import { ProductController, ProductService } from 'c/cartUtils'

class CartCtrl {

    constructor(cart){
        this.cart = cart;
        this.cart.title = labels.CART_TITLE_LABEL
        this.productCtrl = new ProductController();
        ProductService.showMessage();
    }

    loadData = async () => {
        this.cart.products = await cartService.loadProducts()
        this.productCtrl.showMessage();
    }

    setCartTitle = (title) => {
        this.cart.title = title
    }
}

export default CartCtrl