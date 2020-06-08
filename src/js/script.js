/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';
  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };
  
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };
  
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
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
            thisProduct.params[paramId].options[optionId] = option.label;
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

    
      /* set the contents of thisProduct.priceElem to be the value of variable price */
      price *= thisProduct.amountWidget.value;
      thisProduct.price = price;
      thisProduct.priceSingle = price;
      // console.log(price); 
      thisProduct.priceElem.innerHTML = thisProduct.price;
      console.log(thisProduct.priceElem);

    }
    initAmountWidget(){
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      //listener 
      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.processOrder();
      });
                
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
      if(newValue >= 10) {
        newValue = 10;
      } else if(newValue <= 1) {
        newValue = 1;
      }
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

      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
    }
  }

  const app = {
    initMenu: function(){

      const thisApp = this;
      console.log('thisApp.data:',thisApp.data);
      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
      console.log('thisApp.data:',thisApp.data);
      // const testProduct = new Product();
      // console.log('testProduct:', testProduct);
    },
    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;
    },
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      thisApp.initData();
      thisApp.initMenu();
    },
  };
  
  app.init();
  
  

}