var selectorArray = [];
var j =  0;
var successCounter = 0;
var tabLength = 0;



document.addEventListener("DOMContentLoaded", function(){

	// Grab users JSON data
	var userSubmissions = parseJson(userPicks);

	var afcRound1Array = document.getElementsByClassName("AFC");
	var nfcRound1Array = document.getElementsByClassName("NFC");


	// Grab team JSON datas
	var teams = parseJson(data)
	var result = parseJson(results)
	tabLength = Object.keys(userSubmissions).length
	console.log("tab length:" + tabLength)

	for (i in userSubmissions) {
		console.log(i);
		console.log(userSubmissions[i]);

		// Create a tab per submission
		$("#myTab").append("<li class='nav-item user'><a class='nav-link' id='"+i+"-tab' data-toggle='tab' href='#"+i+"' role='tab' aria-controls='"+i+"' aria-selected='false'>"+i+"</a></li>")

		$("#myTabContent").append("<div class='tab-pane fade' id='"+i+"' role='tabpanel' aria-labelledby='"+i+"-tab'>"+userSubmissions[i]+"<div id='bracket-viewonly-replace-"+i+"' class='text-center'>TODO - spinner on load</div></div>")

		// Populate dropdowns with the previously selected result
		var selector = '#bracket-viewonly-replace-' +i;
		console.log("Selector: " + selector)
		selectorArray[j] = selector

		$(selector).load('htmlSegments/bracket.html', function (response, status) {
			//get selector
			//			var user = selector
			if( status == 'success'){
				console.log("load success")
				successCounter++;
			} else {
				console.error("failed to load a bracket in one of the tabs")
			}
			
			// Run on last success
			buildHandler(j)
			//					console.log("appear twice?" + i)
			//		
			//					// Round 1 (qualified teams)
			//					var afcStorageArray = firstRoundPopulate(afcRound1Array,teams, result.afcRound1)
			//					var nfcStorageArray = firstRoundPopulate(nfcRound1Array,teams, result.nfcRound1)
			//		
			//					var choicesSelect = selector +" button[round]"
			//					var choices=$(choicesSelect)
			//		
			//					console.log(choices.length)
			//		
			//					choices.each(function( index ) {
			//						console.log("index: " + userSubmissions[i].charAt(index))
			//						$( this ).attr('seed', userSubmissions[i].charAt(index))
			//					});
		});
		j++
	}

});

//
function buildHandler(j) {
	console.log(successCounter)
	console.log(tabLength)
	if(successCounter == tabLength){
		console.log("start population")
	}
//	for(var i=0; i< selectorArray.length; i++){
//		console.log("saved in list!" + selectorArray[i]);
//	}
}
