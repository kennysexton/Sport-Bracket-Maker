var total = 0, correct = 0, wrong = 0;

function leaderboardLogic(league) {

  // TODO: Needs to be replaced,
  var year = $('#year').text()
  console.log(`${league} , ${year}`)
  const url = `https://express-api-app.herokuapp.com/users?league=${league}&year=${year}&sort=-1`;
  // const url = `https://express-api-app.herokuapp.com/users?sort=-1`;

  $('#bracket-replace').load('htmlSegments/leaderboard.html', function () {
    // Change tab
    $('#home-tab').text("Leaderboard")
  });

  // Async receive leaderboard
  httpGet(url, populateLeaderBoard)

}

function populateLeaderBoard(response) {
  userSubmissions = JSON.parse(response)
  console.log(userSubmissions)

  // Remove spinner
  $('#spinner').remove();

  for (var i = 0; i < Object.keys(userSubmissions).length; i++) {
    var user = userSubmissions[i].name
    var wins = userSubmissions[i].wins
    var loses = userSubmissions[i].loses
    var total = userSubmissions[i].total

    $("#table-append").append("<tr><th scope='row'>" + (i + 1) + "</th><th scope='row'>" + user + "</th><td>" + wins + "</td><td>" + loses + "</td><td>" + total + "</td><td>" + getPercentage(wins, total) + "</td></tr>")
  }

}