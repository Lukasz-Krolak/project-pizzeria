/* global rangeSlider*/
//10.3
import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';
import {utils} from '../utils.js';

class HourPicker extends BaseWidget{

  //10.2.2 Add Class Booking with constructor,  

  constructor(wrapper) {
    super(wrapper, settings.hours.open);
    
    const thisWidget = this;
    
    console.log ('!!!!!!!!',select.widgets.hourPicker.input);
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    thisWidget.initPlugin();
    // handler thisWidget.value, listener input
    thisWidget.value = thisWidget.dom.input;
    thisWidget.renderValue();

  
  }
  //10.3.2
  initPlugin() {
    const thisWidget = this;
    
    rangeSlider.create(thisWidget.dom.input);
    thisWidget.dom.input.addEventListener('input', function () {
      thisWidget.value = thisWidget.dom.input.value;
      
    });
 
  }
  parseValue(value) {
    //zwraca wartość funkcji
    return utils.numberToHour(value);
    
  }

  isValid() {
    return true;
  }

  renderValue() {
    const thisWidget = this;
    // widocznosć godziny po uruchomieniu
    thisWidget.dom.output.innerHTML = thisWidget.value;
  }
}
export default HourPicker;