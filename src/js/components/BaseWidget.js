class BaseWidget {
  //wrapperElement - element dom w którym znajduje sie ten widget, poczatkowa wartość
  constructor (wrapperElement, initialValue){
    const thisWidget = this;
    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.correctValue = initialValue;

  }
  //10.3 getter
  get value(){
    const thisWidget = this;
    return thisWidget.correctValue;
  }
  // 8.7 ustawienie wartości value, wartość maks i min
  //10.3 setter
  set value(value){
    const thisWidget = this;

    let newValue = thisWidget.parseValue(value);
    /* TODO: Add validation */
    if(thisWidget.correctValue != newValue && thisWidget.isValid(newValue)) {
      thisWidget.correctValue = newValue;

      thisWidget.announce(); //wywolanie announce
    }

    thisWidget.renderValue();
  }
  setValue(value){
    const thisWidget = this;
    thisWidget.value = value;
  }
  parseValue(value) {
    return parseInt(value);
  }

  isValid(value) {
    return !isNaN(value);
  }
  renderValue(){
    const thisWidget = this;

    thisWidget.dom.wrapper.innerHTML = thisWidget.correctValue;

  }
  announce() {
    const thisWidget = this;
    //wlączenie bąbelkowania
    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }

}
export default BaseWidget;