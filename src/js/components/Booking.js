
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
    thisBooking.submit = settings.booking.submit;
    // methods render and initWidgets 10.2.3
    thisBooking.render(bookingElement);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.initSelectTable();
    thisBooking.initActions();
    thisBooking.clearSelected();
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
        ]); 
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
      // console.log('bookings', bookings);
      // console.log('current', eventsCurrent);
      // console.log('repeat', eventsRepeat);
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
    console.log('undefhour', hour);
    const startHour = utils.hourToNumber(hour);

    // pętla z iteratorem
    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];  
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
  }
  updateDOM(){
    const thisBooking = this;
    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
      
    let allAvailable = false;
    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }
    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      console.log('tableId update',settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }
      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId) //srawdzenie czy elemnt tableId znajduje sie w tablicy
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
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);
  }
  initWidgets() {
    const thisBooking = this;
    // new AmountWidgets 10.2.5
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker); // 10.3
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    
    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
      console.log('sssss', thisBooking.dom.wrapper);
    });
    thisBooking.dom.datePicker.addEventListener('updated', function () {
      thisBooking.clearSelected();
    });
    thisBooking.dom.hourPicker.addEventListener('updated', function () {
      thisBooking.clearSelected();
    });
    thisBooking.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisBooking.sendReservation();
    });
  }
  //bookingTable
  bookingTable() {
    const thisBooking = this;
    for (let table of thisBooking.dom.tables) {
      table.addEventListener('click', function () {
        table.classList.add(classNames.booking.tableBooked);
        const bookingTableId = table.getAttribute(settings.booking.tableIdAttribute);
        console.log('bookingTable', bookingTableId);
      });
    }
  }
  sendReservation() {
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;
    
    const payload = {
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: thisBooking.tableSelected,
      duration: thisBooking.hoursAmount.value,
      ppl: thisBooking.peopleAmount.value,
      starters: [],
      phone: thisBooking.dom.phone.value,
      address: thisBooking.dom.address.value,
    };
    for (let starter of thisBooking.dom.starters) {
      if (starter.checked === true) {
        payload.starters.push(starter.value); 
      }
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        thisBooking.makeBooked(parsedResponse.date, parsedResponse.hour, parsedResponse.duration, parsedResponse.table);
        thisBooking.updateDOM();
      });
    
    
  }
  initActions(){
    const thisBooking = this;
    thisBooking.dom.form.addEventListener('submit', function(){
      event.preventDefault();
      thisBooking.sendReservation();
      console.log('submit' , thisBooking.sendReservation());
    });
    for (let table of thisBooking.dom.tables) {
      table.addEventListener('updated', function () {
        thisBooking.clearSelected();
      });
    }
  }
  //metoda clearSelected dezaktywuje wybrany (kliknięty) stolik
  clearSelected(){
    const thisBooking = this;
    //wyzerowanie wartości atrybutu thisBooking.tableSelected
    thisBooking.tableSelected = null;
    // ustanowienie stałej activeTables
    const activeTables = thisBooking.dom.wrapper.querySelectorAll(select.booking.activeTable);
    console.log('activetables',activeTables);
    //pętla wybierająca pojedynczy element z activeTables
    for (const activeTable of activeTables){
      //usunięcie klasy tableBookedActiv
      activeTable.classList.remove(classNames.booking.tableBookedActive);
    }
  }
  // inicjowanie metody w której nadajemy klasę aktywną dla klikniętego elementu DOM (stolik) 
  //selectTable klikniety na stronie "aktywny"
  initSelectTable() {
    const thisBooking = this;
    /* pętla iterująca po wszystkich elementach table, pobierająca ich atrybut - 
 liczbę, która jest do nich przypisana, zwracany jako liczba dzięki parseInt */
    for (let table of thisBooking.dom.tables) {
      const tableSelected = parseInt(table.getAttribute(settings.booking.tableIdAttribute));
      // dodanie eventlisnera na kliknięcie, na obbiekcie
      table.addEventListener('click', function () {
        /*jeśli atrybut klikniętego thisBooking.tableSelected jest równy 
         atrybutowi zawartemu w zmiennej tableSelected wtedy uruchamiana jest metoda clearSelected */
        if (thisBooking.tableSelected == tableSelected) {
          thisBooking.clearSelected();
          console.log('thisBooking.clearSelected',thisBooking.clearSelected);
          /* jeśli atrybut klikniętego thisBooking.tableSelected nie jest 
          równy atrybutowi zawartemu w zmiennej tableSelected nadaj mu klasę tableBookedActive */ 
        } else {
          thisBooking.clearSelected();
          table.classList.add(classNames.booking.tableBookedActive);
          thisBooking.tableSelected = tableSelected;
        }
      });
    }
  }
}
export default Booking;