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
            document.querySelector("#historyLog").innerHTML += createCard(snapshot.val(), data[goalItem]);
        });
    }
}

const createCard = (goalDetails, userDetails) => {    
  return `
    <div class="columns is-centered is-variable is-5">
    <div class="column is-one-quarter">
      <div class="card">
        <header class="card-header">
            <motion.p class="card-header-title">${goalDetails.goalName}</motion.p>
        </header>
        <div class="card-content">
          <div class="content">${goalDetails.description}</div>
        </div>
        <footer class="card-footer">
            <p class="card-content">Best Streak: ${userDetails.bestStreak}</p>
            <a href="#" class="card-footer-item" onclick="">placeholder</a>
        </footer>
      </div>
    </div>
    <div class="column is-one-quarter">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title"></p>
        </header>
        <div class="card-content">
          <div class="content">second column for whatever</div>
        </div>
        <footer class="card-footer">
            <p class="card-content">Current Streak: </p>
            <a href="#" class="card-footer-item" onclick="">placeholder</a>
        </footer>
      </div>
    </div>
    </div>
  `;
}

// TODO: update this after we add authentication
getGoals("some user key");