
import { templates, select, settings } from '../settings.js';
import utils from '../utils.js';
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
    thisBooking.getData();
  }
  //11.1
  getData(){
    const thisBooking = this;
    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        // settings.db.booking,
        startDateParam,        
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,        
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam, 
        endDateParam,
      ],
    };
    // console.log('getData params', params);
    const urls = {
      booking:        settings.db.url + '/' + settings.db.booking 
                                      + '?' + params.booking.join('&'),
      eventsCurrent:  settings.db.url + '/' + settings.db.event   
                                      + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:   settings.db.url + '/' + settings.db.event   
                                      + '?' + params.eventsRepeat.join('&'),
    };
    // console.log('getData urls', urls);
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all ([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        console.log('bookings', bookings);
        console.log('current', eventsCurrent);
        console.log('repeat', eventsRepeat);
      });

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
    // console.log('this BOOOOOKING',select.widgets.datePicker.wrapper);
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

  }
}

export default Booking;