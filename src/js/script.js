/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';
  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };
  
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };
  
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    db: {
      url: '//localhost:3131',
      product: 'product',
      order: 'order',
    },
    // CODE ADDED END
  };
  
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };
  
  class Product{
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget(); // 8.7 
      thisProduct.processOrder();
      console.log('new Product', thisProduct);
    }
    renderInMenu(){
      const thisProduct = this;

      /*generate HTML based on template */

      const generatedHTML = templates.menuProduct(thisProduct.data);
      // console.log(gene)
      /* create element usign utils.createElementFromHTML */

      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /*find menu container */
     
      const menuContainer = document.querySelector(select.containerOf.menu);

      /*add element to menu */

      menuContainer.appendChild(thisProduct.element);

    }
    getElements(){
      const thisProduct = this;
    
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem); //8.5
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper); //8.6 
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget); //8.7
    }
    initAccordion(){
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      // const accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      /* START: click event listener to trigger */
      
      // thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

      thisProduct.accordionTrigger.addEventListener('click',function(event){

        /* prevent default action for event */
        
        event.preventDefault();
        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
        /* find all active products */
        const activeElements = document.querySelectorAll('.product.active');
        console.log(activeElements);
        /* START LOOP: for each active product */
        for (const activeElement of activeElements){

          /* START: if the active product isn't the element of thisProduct */
          if (activeElement != thisProduct.element) {

            /* remove class active for the active product */
            activeElement.classList.remove(classNames.menuProduct.wrapperActive);

          /* END: if the active product isn't the element of thisProduct */
          }

          /* END LOOP: for each active product */ 
        }

      /* END: click event listener to trigger */
      });
    
    } 
    initOrderForm(){
      const thisProduct = this;
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();//9.3
      });
      // console.log(initOrderForm);
    }
    processOrder(){
      const thisProduct = this;
      thisProduct.params = {};
      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData',formData);

      /* set variable price to equal thisProduct.data.price */
      thisProduct.params = {};//9.3
      let price = thisProduct.data.price; //let bo bedzie sie zmieniac 
      
      /* START LOOP: for each paramId in thisProduct.data.params */
      for (let paramId in thisProduct.data.params) {
        /* save the element in thisProduct.data.params with key paramId as const param */
        const param = thisProduct.data.params[paramId];
        
        /* START LOOP: for each optionId in param.options */
        for (let optionId in param.options){
          /* save the element in param.options with key optionId as const option */
          const option = param.options[optionId];
          /* START IF: if option is selected and option is not default */

          // rozwiązanie problemu co jesli dodatek  jest/ nie jest zaznaczony od razu (...)
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          if(optionSelected && !option.default) { 

            /* add price of option to variable price */

            price += option.price; //dodaje cene dodatku
            console.log('J Cena dodany skl', price, option.price);
            /* END IF: if option is selected and option is not default */
            /* START ELSE IF: if option is not selected and option is default */

          } else if (!optionSelected && option.default){

            /* deduct price of option from price */
            price -= option.price;
            console.log('John Cena zdjęty skl', price, option.price);
          }
          //stworzona stała 8.6
          const activeImages = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
          console.log('aktywny obrazek',activeImages);
          
          //jesli coś wybraliśmy to się obrazek zmieni 8,6
          if(optionSelected) {
            if(!thisProduct.params[paramId]) {
              thisProduct.params[paramId] = {
                label: param.label,
                options: {},
              };
            }
            thisProduct.params[paramId].options[optionId] = option.label; //9.3
            for(let activeImage of activeImages) {
              activeImage.classList.add(classNames.menuProduct.imageVisible);
            }
          } else {
            for (let activeImage of activeImages) {
              activeImage.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
          /* END ELSE IF: if option is not selected and option is default */
        }
        /* END LOOP: for each optionId in param.options */
      }
      /* END LOOP: for each paramId in thisProduct.data.params */
      //9.3
      /* multiply price by amount */
      thisProduct.priceSingle = price;
      thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

      /* set the contents of thisProduct.priceElem to be the value of variable price */
      thisProduct.priceElem.innerHTML = thisProduct.price;
      console.log('thisproductparams',thisProduct.params);
    }
    initAmountWidget(){
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      //listener 
      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.processOrder();
      });        
    }
    //9.3 uproszczenie / wyciągnięcie danych
    addToCart(){
      const thisProduct = this;
      thisProduct.name = thisProduct.data.name;
      thisProduct.amount = thisProduct.amountWidget.value;
      app.cart.add(thisProduct);
    }


    
  }
  //8.7

  //8.7 nowa klasa, nowy konstruktor
  class AmountWidget {
    constructor(element) {
      const thisWidget = this;
      thisWidget.getElements(element);
      thisWidget.setValue(settings.amountWidget.defaultValue);
      thisWidget.initActions();
      console.log('AmountWidget:', thisWidget);
      console.log('constructor arguments:', element);

    }
    //8.7 nowy getElements
    getElements(element){
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      console.log('this widget',thisWidget.input);
      // wartość dla przycisków
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }
    // 8.7 ustawienie wartości value, wartość maks i min
    setValue(value){
      const thisWidget = this;
      let newValue = parseInt(value);
      /* TODO: Add validation */

      if((thisWidget.value != newValue) && (newValue >= settings.amountWidget.defaultMin) && (newValue <= settings.amountWidget.defaultMax)) {
        thisWidget.value = newValue;
        thisWidget.announce(); //wywolanie announce
      }

      thisWidget.input.value = thisWidget.value;
    }
    //8.7 listenery initAction 
    initActions() {
      const thisWidget = this;
      thisWidget.input.addEventListener('change', function() {
        thisWidget.setValue(thisWidget.input.value);
      });
      // przycisk minus
      thisWidget.linkDecrease.addEventListener('click', function(event){
        event.preventDefault();
        console.log('VALUE:', thisWidget.value);
        thisWidget.setValue((thisWidget.value) - 1);
      });
      // przycisk plus
      thisWidget.linkIncrease.addEventListener('click', function(event){
        event.preventDefault();
        console.log(thisWidget.value);
        thisWidget.setValue((thisWidget.value) + 1);
      });
    }

    announce() {
      const thisWidget = this;
      //wlączenie bąbelkowania
      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
    }
  }
  // 9 dodanie klasy Cart
  class Cart{
    constructor(element){
      const thisCart = this;

      thisCart.products = [];
      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.getElements(element);
      thisCart.initActions();

      console.log('new Cart', thisCart);
    }
    getElements(element) {
      const thisCart = this;
      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);   
      //9.7 formularz
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
      //9.4 wyswietlanie aktualnych sum
      thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
      thisCart.dom.phone = document.querySelector(select.cart.phone);
      thisCart.dom.address = document.querySelector(select.cart.address);

      for(let key of thisCart.renderTotalsKeys){
        thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
      }
    }
    initActions(){
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function(event){
        event.preventDefault();
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
      thisCart.dom.productList.addEventListener('updated', function() {
        thisCart.update(); // aktualizuje ilosc produktów w cart, czemu ilosc pod plus i minus dalej sie nie zmienia
      });
      thisCart.dom.productList.addEventListener('remove', function () {
        thisCart.remove(event.detail.cartProduct);
      });
      thisCart.dom.form.addEventListener('submit', function(){
        event.preventDefault();
        thisCart.sendOrder();
      });
    }
    //9.5 remove is not a function? błąd nie może przeczytać "dom"
    remove(cartProduct) {
      const thisCart = this;
      console.log(thisCart.products);
      //9.5 tiaaa
      const index = thisCart.products.indexOf(cartProduct);
      thisCart.products.splice(index, 1);
      cartProduct.dom.wrapper.remove();
      this.update();
    }
    //9.7
    sendOrder() {
      const thisCart = this;
      const url = settings.db.url + '/' + settings.db.order;

      const payload = {
        totalPrice: thisCart.totalPrice,
        telephone: thisCart.dom.phone,
        address: thisCart.dom.address,
        totalNumber: thisCart.totalNumber,
        subtotalPrice: thisCart.subtotalPrice,
        deliveryFee: thisCart.deliveryFee,
        products: []

      };

      for (var product in thisCart.products) {
        payload.products = product.getData();
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      fetch(url, options)
        .then(function(response){
          return response.json();
        }).then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse);
        });
    
    }

    //9.3 powienie się produktu w koszyku, z poprawnymi informacjami
    add(menuProduct){
      const thisCart = this;
      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      console.log('GENERATEDDOM', generatedDOM);
      console.log('THISCARTPRODUCTLIST', thisCart.dom.productList);
      thisCart.dom.productList.appendChild(generatedDOM);
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      console.log('thisCart.products', thisCart.products);
      thisCart.update();//9.4
    }

    //9.4 wyswietlanie aktualnych sum-- błąd update, błąd nie ta klasa
    update() {
      const thisCart = this;
      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;
      console.log('thisCart.deliveryFee!!!', thisCart.deliveryFee);

      for (let product of thisCart.products) {
        thisCart.subtotalPrice += product.price;
        thisCart.totalNumber += product.amount;
      }

      if(thisCart.subtotalPrice > 0) {
        thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      } else {
        thisCart.totalPrice = 0;
      }
      // 9.4 uaktualnienie renderTotalKeys
      for(let key of thisCart.renderTotalsKeys){
        for(let elem of thisCart.dom[key]) {
          elem.innerHTML = thisCart[key];
        }
      }

      console.log('totalNumber', thisCart.totalNumber);
      console.log('subtotalPrice', thisCart.subtotalPrice);
      console.log('thisCart.totalPrice', thisCart.totalPrice);
    }

  }
  //9.4 klasa pozwalajaca na funkcjonowanie pojedynczych pozycji w koszyku
  class CartProduct {
    constructor(menuProduct, element) {
      const thisCartProduct = this;
      
      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.amount = menuProduct.amount;
    
      thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));
      
      thisCartProduct.getElements(element);
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();

      console.log('new CartProduct', thisCartProduct);
      console.log('productData', menuProduct);
    }
    getElements(element) {
      const thisCartProduct = this;

      thisCartProduct.dom = {};
      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);  
      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
    }
    initAmountWidget(){
      const thisCartProduct = this;
      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);

      //9.4 tworzymy cene
      thisCartProduct.dom.amountWidget.addEventListener('updated', function(){
        console.log(thisCartProduct);
        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
      });
    }
    //9.5 usuwamy produkt z koszyka
    remove(){
      const thisCartProduct = this;

      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        },
      });
      thisCartProduct.dom.wrapper.dispatchEvent(event);
      console.log(event);
    }
    //9.5 listenery
    initActions(){
      const thisCartProduct = this;

      thisCartProduct.dom.edit.addEventListener('click', function (event){
        event.preventDefault();
      });
      thisCartProduct.dom.remove.addEventListener('click', function (event){
        event.preventDefault();
        thisCartProduct.remove();

      });
    }
    getData(){
      const thisCartProduct = this;

      const productData = {
        id: thisCartProduct.id,
        amount: thisCartProduct.amount,
        price: thisCartProduct.price,
        priceSingle: thisCartProduct.priceSingle,
        params: thisCartProduct.params
      };

      return productData;
    }

  }
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
     
    },
  };
  
  app.init();
  
  

}