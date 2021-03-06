console.log("main")

let goal = "";
var currentGoalId = "";
let greenDates = [];
let calendar;
let googleUserId = "";

window.onload = (event) => {
    console.log("onload")
    affirmations();
    // Use this to retain user state between html pages.
  };

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
        
        readGoals(currentGoalId);

        checkbox.checked = false;
        for (const date in greenDates) {
            //console.log(greenDates[date].toString() === selectedDay.toString())
            if (greenDates[date].toString() === selectedDay.toString()) {
                //console.log("box should be checked")
                checkbox.checked = true;
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
            days[j].classList.remove("selected-green");
            
            // loops through the days where goal was completed to set color to green
            greenDates.forEach(date => {
                if(j=== date.getDate() + startDay -1 && month === date.getMonth() && year === date.getFullYear()){
                    //console.log(greenDates)
                    days[j].classList.add("selected-green");
                    //console.log("selected", date)
                }
            })
            if(selectedDay){
                if((j === selectedDay.getDate() + startDay - 1)&&(month === selectedDay.getMonth())&&(year === selectedDay.getFullYear())){
                    days[j].classList.add("selected");
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
            selected[0].classList.remove("selected");
        }
        //console.log(o);
        o.classList.add("selected");

        selectedDay = new Date(year, month, o.innerHTML);

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

// sets var greenDates to the days where goal was completed 
    const getDayStatuses = (userId) => {
        console.log("get day statuses", currentGoalId)
        while(greenDates.length) {
            greenDates.pop();
        }
        const goalsRef = firebase.database().ref(`users/${userId}/goals`);
        goalsRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if(currentGoalId){
                console.log("data in getstatus", data)
                let dates = data[currentGoalId]['log'];
                for(const key in dates){
                    console.log(key)
                    if (key === 0){

                    }
                    else{
                        let date = new Date(data[currentGoalId]['log'][key].milliseconds)
                        greenDates.push(date);
                    }
                }
                console.log(greenDates);
                readGoals(currentGoalId);
                Calendar.prototype.drawDays();
            }
            //console.log(greenDates);
            //Calendar.prototype.drawDays();
        });
    };

    //functions for reading from database
    const readGoals = (goalId) => {
        if(goalId === ""){
            document.querySelector('#goal').innerHTML = "Set a goal";
            document.querySelector('#goalDescriptionCal').innerHTML = "It seems like you don't have any goals yet. Click the blue button!";
            return;
        }
        else{
            const keyVal = goalId;
            const goalsRef = firebase.database().ref(`goals/${keyVal}`);
            goalsRef.on('value', (snapshot) => {
                const data = snapshot.val();
                document.querySelector('#goal').innerHTML = "Goal: " + data.goalName;
                document.querySelector('#goalDescriptionCal').innerHTML = "Description: " + data.description;
            });
        }

    };

    firebase.auth().onAuthStateChanged(function (user) {
        console.log("check state")
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            googleUserId = user.uid;
            //console.log("google user", googleUserId)
            const goalKeyRef = firebase.database().ref(`users/${googleUserId}/currentGoalkey`);
            goalKeyRef.on("value", (snapshot)=> {
                const data = snapshot.val();
                currentGoalId = data;
                console.log("current", data)
                readGoals(currentGoalId);
                getDayStatuses(googleUserId);
            })
        } else {
            console.log("not logged in")
            // If not logged in, navigate back to login page.
            window.location = 'index.html';
        };
    });

    

    calendar = new Calendar();
        
}, false);

})(jQuery);

const checkboxClicked = () => {

    if(currentGoalId == "") return;
    
    let checkbox = document.querySelector('#check');
    let headDay = document.getElementsByClassName('head-day'),
        headMonth = document.getElementsByClassName('head-month');

    let dateStr = headMonth[0].innerHTML;
    let monthStr = dateStr.substring(0, dateStr.indexOf('-'));
    let yearStr = dateStr.substring(dateStr.lastIndexOf(' '));

    let time = new Date(monthStr + headDay[0].innerHTML + ',' + yearStr);
    //console.log(time);
    let ms = Date.parse(time);
    //console.log(ms);

    //console.log("greenDates", greenDates);
    if (checkbox.checked === true) {
        firebase.database().ref(`users/${googleUserId}/goals/${currentGoalId}/log`).push({'milliseconds': ms});
        
    }
    else {
        let arr = firebase.database().ref(`users/${googleUserId}/goals/${goal}/log`);
        arr.on('value', (snapshot) => {
            const data = snapshot.val();
            for (const noteItem in data) {
                const note = data[noteItem];
                if(note.milliseconds === ms) {
                    arr.child(noteItem).remove();

                    for (let i in greenDates) {
                        if (greenDates[i].getTime() === ms) {
                            greenDates.splice(i, 1);
                        }
                    }
                }
            }
        });  
    }
    
    
    
}

const setGoals = async () => {
    let goal = document.querySelector("#goalToSet").value;
    let description = document.querySelector("#goalDescription").value;

    // search user's goals for matching goal
    const match = await searchByName(googleUserId, goal);
    if(match) {
        console.log("match found", match);
        firebase.database().ref(`users/${googleUserId}`).update({
            "currentGoalkey": match
        });
        
        // reset greenDates
        while(greenDates.length) {
            greenDates.pop();
        }
        
        return;
    }

    // if no match found, add new goal to database
    const goalId = firebase.database().ref(`goals`).push({
        "goalName": goal,
        "description":description
    }).getKey();
    
    firebase.database().ref(`users/${googleUserId}/goals`).child(goalId).update({
        "goalName": goal,
        "description":description,
        "bestStreak": 0,
        "currentStreak": 1,
        "doneToday":false,
        "log": [0],
        "id": goalId
    })

    firebase.database().ref(`users/${googleUserId}`).update({
        "currentGoalkey": goalId
    })
}

const searchByName = async (userId, goalName) => {
    const snapshot = await firebase.database().ref(`users/${userId}/goals`).once('value');
    const data = snapshot.val();
    for(item in data) {
        if(data[item].goalName.toLowerCase().replace(/\s/g, "") == goalName.toLowerCase().replace(/\s/g, "")) return item;
    }
    return 0;
}

const affirmations = () => {
    let affirmationText = "affirm";

    let urlToFetch = "https://api.allorigins.win/get?url=" + encodeURIComponent('https://www.affirmations.dev');
        fetch(urlToFetch)
        .then(response => response.json())
        .then(myJson => {
            console.log(myJson);
            affirmationText = String(myJson.contents);
            affirmationText = affirmationText.substring(affirmationText.indexOf(':') + 1, affirmationText.indexOf('}'));
            document.querySelector('#affirmationText').innerHTML = affirmationText;
        })
        .catch(error => {
            console.log("error:", error);
        })
}

const logOutClicked = () => {
    firebase.auth().signOut().then(() => {
        console.log("sign out successful");
    }).catch((error) => {
        console.log("log out error:", error);
    });
    window.location.href = "index.html";
}
