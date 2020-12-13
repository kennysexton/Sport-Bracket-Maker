document.addEventListener("DOMContentLoaded", function(){
	let team = new Object()
	team.color = "#0085CA"
	team.secondaryColor = "#101820"
	team.location = "Carolina"
	team.name = "Panthers"
	team.logo = "panthers.jpg" // Get this systematically, not stored


	var firstSeed = document.getElementById("A1");
	//	var firstSeedLine = document.getElementById("line")

	console.log("-- Length of firstSeed: " + firstSeed)


	// Change Box to match teams information
	firstSeed.style.background = team.color;
	//	firstSeedLine.style.background = team.secondaryColor;
	firstSeed.innerText = team.location + " " +  team.name;


	// Add the line element
	const firstSeedLine = document.createElement("div"); 
	firstSeedLine.setAttribute("id", "line")
	firstSeed.appendChild(firstSeedLine); 

	firstSeedLine.style.background = team.secondaryColor;
	
	//	console.log("-- Length of firstSeedLine: " + firstSeedLine)
});
