document.addEventListener("DOMContentLoaded", function(){

  // Grab users JSON data
  var userSubmissions = parseJson(userPicks);

  for (i in userSubmissions) {
    console.log(i);
    console.log(userSubmissions[i]);

    $("#myTab").append("<li class='nav-item'><a class='nav-link' id='"+i+"-tab' data-toggle='tab' href='#"+i+"' role='tab' aria-controls='"+i+"' aria-selected='false'>"+i+"</a></li>")

    $("#myTabContent").append("<div class='tab-pane fade' id='"+i+"' role='tabpanel' aria-labelledby='"+i+"-tab'>"+userSubmissions[i]+"</div>")
  }



  // Create a tab per submission



  //  <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">B</div>


});