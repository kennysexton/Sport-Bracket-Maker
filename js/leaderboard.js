var total = 0, correct = 0, wrong = 0;

function leaderBoardLogic(){
  $('#bracket-replace').load('htmlSegments/leaderboard.html', function() {
    $('#home-tab').text("Leaderboard")
      insertLeaderboardRows()
  });	
  
}

function insertLeaderboardRows(){

  // Grab users JSON data
  const Http = new XMLHttpRequest();
  const url='https://express-api-app.herokuapp.com/users?sort=-1';
  Http.open("GET", url, true);
  Http.send();

  Http.onreadystatechange =function(){
    if (Http.readyState == 4 && Http.status == 200){
      populateLeaderBoard(Http.responseText)
    } 
  }
}

function populateLeaderBoard(response){
  userSubmissions = JSON.parse(response)
  console.log(userSubmissions)
  
  // Remove spinner
  $('#spinner').remove();

  for(var i=0; i<Object.keys(userSubmissions).length; i++){
    var userClean = cleanInput(userSubmissions[i].name)
    var wins = userSubmissions[i].wins
    var loses = userSubmissions[i].loses
    var total = userSubmissions[i].total

    $("#table-append").append("<tr><th scope='row'>"+(i+1)+"</th><th scope='row'>"+userClean+"</th><td>"+wins+"</td><td>"+loses+"</td><td>"+total+"</td><td>"+getPercentage(wins, total)+"</td></tr>")
  }
}