'use strict';
const motion = require('framer-motion').motion;
const React = require('react');
const ReactDOM = require('react-dom');

// Helper functions for fetching and rendering user progress
const getGoals = (userId) => {
  const goalsRef = firebase.database().ref(`users/${userId}/goals`);
  goalsRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderDataAsHtml(userId, data);
  });
};

const renderDataAsHtml = (userId, goalsData) => {
    document.querySelector("#historyLog").innerHTML=``;
    for (const goalItem in goalsData) {
        const goalId = goalsData[goalItem].id;
        const goalRef = firebase.database().ref(`goals/${goalId}`);
        goalRef.on('value', (snapshot) => {
            document.querySelector("#historyLog").insertAdjacentHTML("beforeend", `<div id=${goalId}></div>`);
            ReactDOM.render(createCard(userId, snapshot.val(), goalsData[goalItem]), document.querySelector(`#${goalId}`));
            
            // placeholder numbers for March-July for demo purposes, only August updates
            // used bestStreak to add variation to placeholder numbers....
            let data = [0, 1, 6+goalsData[goalItem].bestStreak, 0+goalsData[goalItem].bestStreak, 2, 0];
            
            const log = goalsData[goalItem].log;
            for(const time in log) {
                const date = new Date(log[time].milliseconds);
                if(date.getMonth()-2 < data.length) {
                    data[date.getMonth()-2]++;
                }
            }

            const labels = [
                'March',
                'April',
                'May',
                'June',
                'July',
                'August'
            ];
            const chartData = {
                labels: labels,
                datasets: [{
                    label: 'Your Progress',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: data,
                }]
            };
            const config = {
                type: 'line',
                data: chartData,
                options: {}
            };

            const chart = new Chart(document.querySelector("#chart"+goalId).getContext("2d"), config);
        });
    }
}

const createCard = (userId, goalDetails, userDetails) => {
    const chartId = "chart"+userDetails.id;
  return (
    <div class="columns is-centered is-variable is-5">
    <motion.div class="column is-one-quarter"
        animate={{x:50, y:5}}>
      <div class="card">
        <header class="card-header">
            <p class="card-header-title">{goalDetails.goalName}</p>
        </header>
        <div class="card-content">
          <div class="content">{goalDetails.description}</div>
        </div>
      </div>
    </motion.div>
    <motion.div class="column is-one-quarter"
        animate={{x:50, y:5}}>
      <div class="card">
        <header class="card-header">
          <p class="card-header-title"></p>
        </header>
        <div class="card-content">
          <div class="content">
              <div><canvas id={chartId}></canvas></div>
              <p>You've been accomplishing {goalDetails.goalName} more and more often over the past few months! Good job!</p>
          </div>
          <p>Best Streak: {userDetails.bestStreak}</p>
          <p>Current Streak: {userDetails.currentStreak}</p>
        </div>
        <footer class="card-footer">
            <button onClick={() => {deleteGoal(userId, userDetails.id)} /*TODO: replace "some user key"*/} class="card-footer-item button">Delete goal</button>
        </footer>
      </div>
    </motion.div>
    </div>
  );
}

// Helper functions for creating new goal
const addGoal = async (userId, newGoal) => {
    
    // check if goal with matching name already exists in database
    let goalId = await searchGoalsByName(newGoal.goalName);

    // if match exists, check if user already has goal
    if(goalId) {
        const result = await searchGoalsInUser(userId, goalId);
        if(result) {
            createNotif(`You already have a goal called "${newGoal.goalName}"! If this is different from what you're going for, try giving your new goal a more specific title?`);
            return;
        }
        createNotif(`A group of users have already created a public goal called "${newGoal.goalName}"! Please read over its description and see if it's close enough to your interests.`);
    }

    // if no match exists, push new goal to database
    if(!goalId) {
        goalId = firebase.database().ref(`goals`).push(newGoal).getKey();
    }

    // add goal to user
    const userGoal = {
        id: goalId,
        bestStreak: 0,
        currentStreak: 0,
        doneToday: false,
        log: []
    }
    firebase.database().ref(`users/${userId}/goals`).push(userGoal);
    createNotif(`${newGoal.goalName} added!`);
}

const searchGoalsInUser = async (userId, goalId) => {
    const snapshot = await firebase.database().ref(`users/${userId}/goals`).once('value');
    const goals = snapshot.val();
    for(const goal in goals) {
        if(goals[goal].id == goalId) {
            return goal;
        }
    }
    return 0;
}

const searchGoalsByName = async (goalName) => {
    const goalsRef = firebase.database().ref(`goals`);
    const snapshot = await goalsRef.once('value');
    const data = snapshot.val();
    for(const goalKey in data) {
      if(data[goalKey].goalName.toLowerCase().replace(/\s/g, "") == goalName.toLowerCase().replace(/\s/g, "")) {
          return goalKey;
      }
    }
    return 0;
};

// Helper functions for deleting goal
const deleteGoal = async (userId, goalId) => {
    const snapshot = await firebase.database().ref(`users/${userId}/goals`).once('value');
    const goals = snapshot.val();
    for(const goal in goals) {
        if(goals[goal].id == goalId) {
            firebase.database().ref(`users/${userId}/goals/${goal}`).remove();
            createNotif("Goal deleted");
            return;
        }
    }
}

// Create notif
const createNotif = (content) => {
    Toastify({
        text: content,
        className: "info",
        duration: 3500,
        close: true
    }).showToast();
}

// Info for home icon
const homeSVG = `M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z`;
const checkDoubleSVG = `M505 174.8l-39.6-39.6c-9.4-9.4-24.6-9.4-33.9 0L192 374.7 80.6 263.2c-9.4-9.4-24.6-9.4-33.9 0L7 302.9c-9.4 9.4-9.4 24.6 0 34L175 505c9.4 9.4 24.6 9.4 33.9 0l296-296.2c9.4-9.5 9.4-24.7.1-34zm-324.3 106c6.2 6.3 16.4 6.3 22.6 0l208-208.2c6.2-6.3 6.2-16.4 0-22.6L366.1 4.7c-6.2-6.3-16.4-6.3-22.6 0L192 156.2l-55.4-55.5c-6.2-6.3-16.4-6.3-22.6 0L68.7 146c-6.2 6.3-6.2 16.4 0 22.6l112 112.2z`;

const toFancy = function(){
  Snap.select('#tasks-icon').animate({ d: homeSVG }, 200);  
}
const toSimple = function(){
  Snap.select('#tasks-icon').animate({ d: checkDoubleSVG }, 200); 
}

const svgVariants = {
  hidden: { rotate: -180 },
  visible: { 
    rotate: 0,
    transition: { duration : 1 }
  },
}

const pathVariants = {
  hidden: {
    opacity: 0,
    pathLength: 0,
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    transition: { 
      duration: 2,
      ease: "easeInOut",
    }
  }
}

const renderPage = (googleUserId) => {
    // Render home icon
    ReactDOM.render(<div class="navbar-brand">
    <a href="index.html" class="navbar-item">
        <motion.div
            whileHover={{fill: "#39cb75", originX: 0}}
            onMouseOver={toFancy}
            onMouseLeave={toSimple}>
                <motion.svg 
                    initial="hidden"
                    animate="visible"
                    variants={svgVariants}
                    width="64" height="50" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <motion.path variants={pathVariants} id="tasks-icon" d={checkDoubleSVG}/>
                </motion.svg>
        </motion.div>
    </a></div>, document.querySelector('#animated_stuff_container'));

    // Render user progress
    // TODO: update user key after we add authentication
    getGoals(googleUserId);

    // Render the New Goals form
    ReactDOM.render(<motion.div class="columns is-centered is-variable is-5"
                                animate={{x:50, y:5}}>
                    <div class="column is-half">
                        <motion.div class="card"
                                initial={{opacity:0.25}}
                                whileHover={{opacity:1}}>
                            <header class="card-header">
                                <input id="newGoalName" class="input is-medium card-header-title" placeholder="New Goal"/>
                            </header>
                            <div class="card-content">
                                <textarea id="newGoalDescription" class="textarea is-medium content" placeholder="Remember, keep it specific and bite-sized!"/>
                            </div>
                            <footer class="card-footer">
                                <button id="createGoalButton" class="btn btn-primary">Submit</button>
                            </footer>
                        </motion.div>
                    </div>
                </motion.div>,  
                document.querySelector("#insert_goal_container"));

    const nameInput = document.querySelector("#newGoalName");
    const descriptionInput = document.querySelector("#newGoalDescription");
    document.querySelector("#createGoalButton").addEventListener("click", () => {
        const newGoal = {goalName: nameInput.value, description: descriptionInput.value};
        nameInput.value = "";
        descriptionInput.value = "";
        addGoal(googleUserId, newGoal);
    });
}

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      let googleUserId = user.uid;
      //renderPage("some user key");
      renderPage(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html';
    };
  });
};