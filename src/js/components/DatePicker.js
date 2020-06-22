/* global flatpickr*/
//10.3
import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';
import {utils} from '../utils.js';

class DatePicker extends BaseWidget{

  //10.2.2 Add Class Booking with constructor,  

  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));
    
    const thisWidget = this;
    
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();

  
  }
  //10.3.2
  initPlugin() {
    const thisWidget = this;
    //definiowanie daty wyjsciowej i maksymalnej
    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    // montowanie flatpickr
    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      'disable': [
        function(date) {
          return (date.getDay() === 1);
        },
      ],
      'locale': {
        'firstDayOfWeek': 2,
      },
      //w momencie wykrycia zmian przypisujemy wartosć
      onChange: function(selectedDates, dateStr) {
        thisWidget.value = dateStr;
      },
    });
  }
  parseValue(value) {
    return value;
  }

  isValid() {
    return true;
  }

  renderValue() {

  }
}
export default DatePicker;