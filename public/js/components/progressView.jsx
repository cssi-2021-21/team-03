'use strict';
const motion = require('framer-motion').motion;
const React = require('react');
const ReactDOM = require('react-dom');


const getGoals = (userId) => {
  const goalsRef = firebase.database().ref(`users/${userId}/goals`);
  goalsRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
};

const renderDataAsHtml = (data) => {
    document.querySelector("#historyLog").innerHTML=``;
    for (const goalItem in data) {
        const goalId = data[goalItem].id;
        const goalRef = firebase.database().ref(`goals/${goalId}`);
        goalRef.on('value', (snapshot) => {
            document.querySelector("#historyLog").insertAdjacentHTML("beforeend", `<div id=${goalId}></div>`);
            ReactDOM.render(createCard(snapshot.val(), data[goalItem]), document.querySelector(`#${goalId}`));
        });
    }
}

const createCard = (goalDetails, userDetails) => {    
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
        <footer class="card-footer">
            <p class="card-content">Best Streak: {userDetails.bestStreak}</p>
            <a href="#" class="card-footer-item">placeholder</a>
        </footer>
      </div>
    </motion.div>
    <motion.div class="column is-one-quarter"
        animate={{x:50, y:5}}>
      <div class="card">
        <header class="card-header">
          <p class="card-header-title"></p>
        </header>
        <div class="card-content">
          <div class="content">second column for whatever</div>
        </div>
        <footer class="card-footer">
            <p class="card-content">Current Streak: </p>
            <a href="#" class="card-footer-item">placeholder</a>
        </footer>
      </div>
    </motion.div>
    </div>
  );
}

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

ReactDOM.render(<a href="index.html">
    <motion.div
        animate={{x:50, y:15}}
        whileHover={{fill: "#007bff", originX: 0}}
        onMouseOver={toFancy}
        onMouseLeave={toSimple}>
            <motion.svg 
                initial="hidden"
                animate="visible"
                variants={svgVariants}
                width="120" height="100" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <motion.path variants={pathVariants} id="tasks-icon" d={checkDoubleSVG}/>
            </motion.svg>
    </motion.div>
</a>, document.querySelector('#animated_stuff_container'));

// TODO: update this after we add authentication
getGoals("some user key");