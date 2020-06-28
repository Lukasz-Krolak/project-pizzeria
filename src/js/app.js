//10.1
import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js'; //10.2.1

const app = {
  init: function(){
    const thisApp = this;
    thisApp.initCart(); //9
    thisApp.initData();
    // thisApp.initMenu();//9.7
    thisApp.initPages(); //10.2
    thisApp.initBooking(); //10.2.1
  },
  initPages: function() {
    const thisApp = this;
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    const idFromHash = window.location.hash.replace('#/', '');
    let pageMatchingHash = thisApp.pages[0].id; // wczesniej false

    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }
    thisApp.activatePage(pageMatchingHash);
    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');
        /* run thisApp.activatePage with that id */
        thisApp.activatePage(id);
        /* change URL hash */
        window.location.hash = '#/' + id;
      });
    }
  },
  //10.2
  activatePage: function (pageId) {
    const thisApp = this;
    /* add class "active" to matching pages, remove from non-matching */
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    /* add class "active" to matching links, remove from non-matching */
    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },
  initBooking: function(){ //10.2.1
    const thisApp = this;
    const bookingElement = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking (bookingElement);
  },
  initMenu: function(){
    const thisApp = this;
    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);//9.7
    }
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
        thisApp.data.products = parsedResponse; /* save parsedResponse as thisApp.data.products */
        thisApp.initMenu(); /* execute initMenu method */
      });
      
  },

  // 9 inicjacja cart!!!!!! w app pod initMenu!!!!!
  initCart: function(){
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);
    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart',function(event){
      app.cart.add(event.detail.product);
    });
  },
};
app.init();
