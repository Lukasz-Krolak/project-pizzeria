//10.1
import {settings,select} from '../settings.js';
class AmountWidget {
  constructor(element) {
    const thisWidget = this;
    thisWidget.getElements(element);
    thisWidget.value = settings.amountWidget.defaultValue;
    thisWidget.setValue(thisWidget.input.value);
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
    // wartość dla przycisków plus i minus
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }
  // 8.7 ustawienie wartości value, wartość maks i min
  setValue(value){
    const thisWidget = this;
    let newValue = parseInt(value);
    /* TODO: Add validation */
    if(thisWidget.value != newValue && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
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
export default AmountWidget;