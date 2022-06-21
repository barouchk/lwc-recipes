// import { ProductService } from './productService'
// import apex call
// check apex call  - 

import getProducts from '@salesforce/apex/ServiceController.getProducts'

class CartService {

    async loadProducts(){
        return await getProducts();
    }
}

export default new CartService();