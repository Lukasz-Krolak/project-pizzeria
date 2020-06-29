
import { templates, select, settings, classNames} from '../settings.js';
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
    console.log('getData params', params);
    const urls = {
      booking:        settings.db.url + '/' + settings.db.booking 
                                      + '?' + params.booking.join('&'),
      eventsCurrent:  settings.db.url + '/' + settings.db.event   
                                      + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:   settings.db.url + '/' + settings.db.event   
                                      + '?' + params.eventsRepeat.join('&'),
    };
    console.log('getData urls', urls);
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
          console.log('B',bookingsResponse),
          console.log('R',eventsRepeatResponse),
        ]); 
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        console.log('bookings', bookings);
        console.log('current', eventsCurrent);
        console.log('repeat', eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
        
      });

  }
  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;
    thisBooking.booked = {};

    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);

    }

    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);

    }
    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;
    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate,1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    console.log('thisBooking.booked',thisBooking.booked);
    thisBooking.updateDOM();
  }
  makeBooked(date, hour, duration, table){
    const thisBooking = this;
    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }
    const startHour = utils.hourToNumber(hour);

    // pętla z iteratorem
    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      // console.log('thisBooking.booked',thisBooking.booked); tu może być błąd startHour a HourBlock
      if(typeof thisBooking.booked[date][startHour] == 'undefined'){
        thisBooking.booked[date][startHour] = [];  
      }
      thisBooking.booked[date][startHour].push(table);
    }
  }

  updateDOM(){
    const thisBooking = this;
    thisBooking.date = thisBooking.datePicker.value;
    console.log('DPv',thisBooking.datePicker.value);
    thisBooking.hour = utils.numberToHour(thisBooking.hourPicker.value);
    console.log('HPv',thisBooking.hourPicker.value);
      
    let allAvaible = false;
    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvaible = true;
    }
    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }
      if(
        !allAvaible
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
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
 
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);

  }

  initWidgets() {
    const thisBooking = this;
    // new AmountWidgets 10.2.5
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker); // 10.3
    thisBooking.dom.wrapper.addEventListener('updated',function(){
      thisBooking.updateDOM();
    });
  }
}

export default Booking;