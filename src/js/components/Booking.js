
import { templates, select } from '../settings.js';

//10.2
import  AmountWidget  from './AmountWidget.js';
import datePicker from './DatePicker.js';


//10.2.2 Add Class Booking with constructor,  
class Booking{
  constructor(bookingElement) {
    //stała
    const thisBooking = this;
    //init methods render and initWidgets 10.2.3
    thisBooking.render(bookingElement);
    thisBooking.initWidgets();

  }
  //10.2.4
  render(bookingElement) {
    const thisBooking = this;
    //generate HTML with scheme templates.bookingWidget - no arg
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = bookingElement;
    //transform bookingElement as HTML
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    //10.2.4 
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    thisBooking.dom.table = thisBooking.dom.wrapper.querySelectorAll(select.booking.table);
    //10.3
    thisBooking.dom.datePicker = select.widgets.datePicker.querySelector(maxDaysInFuture);
  }

  initWidgets() {
    const thisBooking = this;
    // new AmountWidgets 10.2.5
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    // thisBooking.dom.table = new AmountWidget(thisBooking.dom.table);
    thisBooking.datePicker = new AmountWidget(thisBooking.dom.datePicker); // 10.3

  }
}

export default Booking;