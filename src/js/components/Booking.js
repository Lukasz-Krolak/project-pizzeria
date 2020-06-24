
import { templates, select } from '../settings.js';

//10.2
import  AmountWidget  from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';


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
    //10.2.4 increase / decrease
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    // thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    //10.3
    console.log('this BOOOOOKING',select.widgets.datePicker.wrapper);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper); 
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.submit = thisBooking.dom.wrapper.querySelector(select.widgets.button.submit);
  
  }

  initWidgets() {
    const thisBooking = this;
    // new AmountWidgets 10.2.5
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker); // 10.3
    thisBooking.dom.hourPicker.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
    thisBooking.dom.datePicker.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
    //11
    // console.log(thisBooking.dom.submit);
    // thisBooking.dom.submit.addEventListener('click', function(event){
    //   event.preventDefault();
    //   thisBooking.sendReservation();
    // });

    // thisBooking.checkTables();
  }
}

export default Booking;