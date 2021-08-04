console.log("main")
window.onload = (event) => {
    console.log("onload")
    // Use this to retain user state between html pages.
    firebase.auth().onAuthStateChanged(function (user) {
        console.log("check state")
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            googleUserId = user.uid;
        } else {
            console.log("not logged in")
            // If not logged in, navigate back to login page.
            window.location = 'signIn.html';
        };
    });
  };

let greenDates = [];

(function($) {
	"use strict";

	document.addEventListener('DOMContentLoaded', function(){
    var today = new Date(),
        year = today.getFullYear(),
        month = today.getMonth(),
        monthTag =["January","February","March","April","May","June","July","August","September","October","November","December"],
        day = today.getDate(),
        days = document.getElementsByTagName('td'),
        selectedDay,
        setDate,
        daysLen = days.length;
// options should like '2014-01-01'
    
function Calendar(selector, options) {
        this.options = options;
        this.draw();
    }
    
    Calendar.prototype.draw  = function() {
        this.getCookie('selected_day');
        this.getOptions();
        this.drawDays();
        var that = this,
            //reset = document.getElementById('reset'),
            pre = document.getElementsByClassName('pre-button'),
            next = document.getElementsByClassName('next-button');
            
            pre[0].addEventListener('click', function(){that.preMonth(); });
            next[0].addEventListener('click', function(){that.nextMonth(); });
            //reset.addEventListener('click', function(){that.reset(); });
        while(daysLen--) {
            days[daysLen].addEventListener('click', function(){that.clickDay(this); });
        }
    };
    
    Calendar.prototype.drawHeader = function(e) {
        var headDay = document.getElementsByClassName('head-day'),
            headMonth = document.getElementsByClassName('head-month');
        let checkbox = document.querySelector("#check");

        e?headDay[0].innerHTML = e : headDay[0].innerHTML = day;
        headMonth[0].innerHTML = monthTag[month] +" - " + year;
        
        readGoals();

        checkbox.checked = false;
        for (const date in greenDates) {
            console.log(greenDates[date])
            console.log(selectedDay)
            console.log(greenDates[date].toString() === selectedDay.toString())
            if (greenDates[date].toString() === selectedDay.toString()) {
                console.log("box should be checked")
                checkbox.checked = true;
                break;
                
            }
        }
     };
    
    
    
    Calendar.prototype.drawDays = function() {
        var startDay = new Date(year, month, 1).getDay(),
//      how many days are in this month
            nDays = new Date(year, month + 1, 0).getDate(),
    
            n = startDay;
//      clear original style and date
        for(var k = 0; k <42; k++) {
            days[k].innerHTML = '';
            days[k].id = '';
            days[k].className = '';
        }

        for(var i  = 1; i <= nDays ; i++) {
            days[n].innerHTML = i; 
            n++;
        }
        
        for(var j = 0; j < 42; j++) {
            if(days[j].innerHTML === ""){
                
                days[j].id = "disabled";
                
            }else if(j === day + startDay - 1){
                
                if((this.options && (month === setDate.getMonth()) && (year === setDate.getFullYear())) || (!this.options && (month === today.getMonth())&&(year===today.getFullYear()))){
                    this.drawHeader(day);
                    days[j].id = "today";
                } 
            }
            // loops through the days where goal was completed to set color to green
            greenDates.forEach(date => {
                if(j=== date.getDate() + startDay -1 && month === date.getMonth() && year === date.getFullYear()){
                    console.log(greenDates)
                    days[j].className = "selected-green";
                    console.log("selected", date)
                }
            })
            if(selectedDay){
                if((j === selectedDay.getDate() + startDay - 1)&&(month === selectedDay.getMonth())&&(year === selectedDay.getFullYear())){
                    days[j].className = "selected";
                    //days[j-1].className ="selected"; 
                        
                    this.drawHeader(selectedDay.getDate());

                    /*
                    for(day in days) {
                        console.log(day);
                    }
                    */
                }
            }
        }
    };
    
    Calendar.prototype.clickDay = function(o) {
        var selected = document.getElementsByClassName("selected"),
            len = selected.length;
        if(len !== 0){
            selected[0].className = "";
        }
        //console.log(o);
        o.className = "selected";

        selectedDay = new Date(year, month, o.innerHTML);
        console.log("selectedDay", selectedDay)
        if(selectedDay in greenDates){
            console.log("selectedDay in greenDates", selectedDay in greenDates)
            checkbox.checked = true;
        }
        this.drawHeader(o.innerHTML);
        this.setCookie('selected_day', 1);
    };
    
    Calendar.prototype.preMonth = function() {
        if(month < 1){ 
            month = 11;
            year = year - 1; 
        }else{
            month = month - 1;
        }
        this.drawHeader(1);
        this.drawDays();
    };
    
    Calendar.prototype.nextMonth = function() {
        if(month >= 11){
            month = 0;
            year =  year + 1; 
        }else{
            month = month + 1;
        }
        this.drawHeader(1);
        this.drawDays();
    };
    
    Calendar.prototype.getOptions = function() {
        if(this.options){
            var sets = this.options.split('-');
                setDate = new Date(sets[0], sets[1]-1, sets[2]);
                day = setDate.getDate();
                year = setDate.getFullYear();
                month = setDate.getMonth();
        }
    };
    
     Calendar.prototype.reset = function() {
         month = today.getMonth();
         year = today.getFullYear();
         day = today.getDate();
         this.options = undefined;
         this.drawDays();
     };
    
    Calendar.prototype.setCookie = function(name, expiredays){
        if(expiredays) {
            var date = new Date();
            date.setTime(date.getTime() + (expiredays*24*60*60*1000));
            var expires = "; expires=" +date.toGMTString();
        }else{
            var expires = "";
        }
        document.cookie = name + "=" + selectedDay + expires + "; path=/";
    };
    
    Calendar.prototype.getCookie = function(name) {
        if(document.cookie.length){
            var arrCookie  = document.cookie.split(';'),
                nameEQ = name + "=";
            for(var i = 0, cLen = arrCookie.length; i < cLen; i++) {
                var c = arrCookie[i];
                while (c.charAt(0)==' ') {
                    c = c.substring(1,c.length);
                    
                }
                if (c.indexOf(nameEQ) === 0) {
                    selectedDay =  new Date(c.substring(nameEQ.length, c.length));
                }
            }
        }
    };

    let goal = "asdf"
// sets var greenDates to the days where goal was completed 
    const getDayStatuses = (userId) => {
        const goalsRef = firebase.database().ref(`users/${userId}/goals`);
        goalsRef.on('value', (snapshot) => {
            const data = snapshot.val();
            console.log(data)
            let dates = data[goal]["log"];
            for(const key in dates){
                let date = new Date(data[goal]['log'][key].milliseconds)
                greenDates.push(date);
            }
            console.log(greenDates)
            Calendar.prototype.drawDays();
        });
        
    };

    getDayStatuses("some user key");

    var calendar = new Calendar();
        
}, false);

})(jQuery);


//functions for reading from database
const readGoals = () => {
    const keyVal = 'goalkey1';
    const goalsRef = firebase.database().ref(`goals/${keyVal}`);
    goalsRef.on('value', (snapshot) => {
        const data = snapshot.val();
        
        document.querySelector('#goal').innerHTML = "Goal: " + data.goalName;
        document.querySelector('#goalDescription').innerHTML = "Description: " + data.description;

        console.log(data.goalName);
  });
};

const checkboxClicked = () => {
    let checkbox = document.querySelector('#check');
    let headDay = document.getElementsByClassName('head-day'),
        headMonth = document.getElementsByClassName('head-month');

    let dateStr = headMonth[0].innerHTML;
    let monthStr = dateStr.substring(0, dateStr.indexOf('-'));
    let yearStr = dateStr.substring(dateStr.lastIndexOf(' '));

    let time = new Date(monthStr + headDay[0].innerHTML + ',' + yearStr);
    console.log(time);
    let ms = Date.parse(time);
    console.log(ms);

    let userKey = 'some user key';
    let goal = 'asdf';

    if (checkbox.checked === true) {
        firebase.database().ref(`users/${userKey}/goals/${goal}/log`).push({'milliseconds': ms});
    }
}
