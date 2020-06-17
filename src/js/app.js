//10.1
import {settings,select, classNames, templates} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';



const app = {
  initMenu: function(){

    const thisApp = this;
    console.log('thisApp.data:',thisApp.data);
    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);//9.7
    }
    console.log('thisApp.data:',thisApp.data);
    // const testProduct = new Product();
    // console.log('testProduct:', testProduct);
  },
  initData: function(){
    const thisApp = this;
    //9.7
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);

        thisApp.data.products = parsedResponse; /* save parsedResponse as thisApp.data.products */

        thisApp.initMenu(); /* execute initMenu method */
      });
    console.log('thisApp.data', JSON.stringify(thisApp.data));
      
  },
  init: function(){
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);
    thisApp.initCart(); //9
    thisApp.initData();
    // thisApp.initMenu();//9.7
  },
  // 9 inicjacja cart!!!!!! w app pod initMenu!!!!!
  initCart: function(){
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    console.log(cartElem);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart',function(event){
      app.cart.add(event.detail.product);
    });
     
  },
};
  
