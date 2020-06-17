import {select,classNames,templates} from './settings.js';
import utils from './utils.js';
import AmountWidget from './components.AmountValue';

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
    // app.cart.add(thisProduct);
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail:{
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
  }
    
}
export default Product;