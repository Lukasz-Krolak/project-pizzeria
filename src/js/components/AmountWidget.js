//10.1
import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue); //10.3

    const thisWidget = this;
    thisWidget.getElements(element);
    // thisWidget.value = settings.amountWidget.defaultValue;
    // thisWidget.setValue(thisWidget.dom.input.value); //10.3
    
    thisWidget.initActions();
    console.log('AmountWidget:', thisWidget);
    console.log('constructor arguments:', element);

  }
  //8.7 nowy getElements
  getElements(){
    const thisWidget = this;

    // thisWidget.dom.wrapper = element;// 10.3
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    console.log('this widget',thisWidget.dom.input);
    // wartość dla przycisków plus i minus
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }
  //10.3 new methods
  isValid(value) {
    return !isNaN(value)
    && value >= settings.amountWidget.defaultMin 
    && value <= settings.amountWidget.defaultMax;
  }
  renderValue(){
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;

  }


  //8.7 listenery initAction 
  initActions() {
    const thisWidget = this;
    thisWidget.dom.input.addEventListener('change', function() {
      thisWidget.setValue(thisWidget.dom.input.value);
    });
    // przycisk minus
    thisWidget.dom.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      console.log('VALUE:', thisWidget.value);
      thisWidget.setValue((thisWidget.value) - 1);
    });
    // przycisk plus
    thisWidget.dom.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      console.log(thisWidget.value);
      thisWidget.setValue((thisWidget.value) + 1);
    });
  }


}
export default AmountWidget;