document.addEventListener("DOMContentLoaded", function(){

  // Grab users JSON data
  var userSubmissions = parseJson(userPicks);

  var afcRound1Array = document.getElementsByClassName("AFC");
  var nfcRound1Array = document.getElementsByClassName("NFC");


  // Grab team JSON datas
  var teams = parseJson(data)
  var result = parseJson(results)

  for (i in userSubmissions) {
    console.log(i);
    console.log(userSubmissions[i]);

    // Create a tab per submission
    $("#myTab").append("<li class='nav-item'><a class='nav-link' id='"+i+"-tab' data-toggle='tab' href='#"+i+"' role='tab' aria-controls='"+i+"' aria-selected='false'>"+i+"</a></li>")

    $("#myTabContent").append("<div class='tab-pane fade' id='"+i+"' role='tabpanel' aria-labelledby='"+i+"-tab'>"+userSubmissions[i]+"<div id='bracket-viewonly-replace-"+i+"' class='text-center'>TODO - spinner on load</div></div>")


    // Populate dropdowns with the previously selected result
    var selector = '#bracket-viewonly-replace-' +i;
    $(selector).load('htmlSegments/bracket.html', function() {

      // Round 1 (qualified teams)
      var afcStorageArray = firstRoundPopulate(afcRound1Array,teams, result.afcRound1)
      var nfcStorageArray = firstRoundPopulate(nfcRound1Array,teams, result.nfcRound1)

      var choicesSelect = selector +" button[round]"
      var choices=$(choicesSelect)

      console.log(choices.length)

      choices.each(function( index ) {
        console.log("index: " + userSubmissions[i].charAt(index))
        $( this ).attr('seed', userSubmissions[i].charAt(index))
      });


    });
  }
});