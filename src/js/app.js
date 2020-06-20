//10.1
import {settings, select, classNames,} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';



const app = {
  initPages: function() {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    thisApp.activatePage(thisApp.pages[0].id); //czemu [0] - jak to działa
    for( let link of thisApp.navLinks){
      link.addEventListener('click',function(event){
        const clickedElement = this;
        event.preventDefault();

        //get page id from href attribute 
        const id = clickedElement.getAttribute('href').replace('#','');


        //run thisApp.activatedPage with that id 
        thisApp.activatePage(id);
      });
    }
  
  },
  //10.2
  activetePage: function(pageId){
    const thisApp = this;
    // add class "active" to matching pages, remove from non-matching//-10.2
  
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active.page.id == pageId);
    }
    // add class "active" to matching links, remove from non-matching//-10.2
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );
    
    }


  },

 
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
    // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    // console.log('settings:', settings);
    // console.log('templates:', templates);
    thisApp.initPages(); //10.2
    
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
app.init();
