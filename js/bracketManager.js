document.addEventListener("DOMContentLoaded", function () {

  var league = getLeague();
  var year = getYear();

  // Set header text
  $('#year').text(year)

  // See if league is marked as open
  var open = $('h1')[0].hasAttribute('open')

  // A backet is open when the h1 element has the 'open' attribute
  if (!open) {
    console.log(`bracket is not open for submissions at this time`)

    leaderboardLogic(league)
    $('#submissionForm').hide()
  } else {
    console.log(`bracket is not open for submissions`)
    
    newBracketLogic(league)
  }

  loadUserTabs(league);
});

// Load default bracket
function newBracketLogic(league) {
  $('#bracket-replace').load(`htmlSegments/${league}bracket.html`, function () {

    // Grab team JSON datas
    var teams = parseJson(data)
    var result = parseJson(results)

    var aRound0Array = document.getElementsByClassName("A0");
    var aRound1Array = document.getElementsByClassName("A1");
    var aRound2Array = document.getElementsByClassName("A2");
    var aRound3Array = document.getElementsByClassName("A3");

    var bRound0Array = document.getElementsByClassName("B0");
    var bRound1Array = document.getElementsByClassName("B1");
    var bRound2Array = document.getElementsByClassName("B2");
    var bRound3Array = document.getElementsByClassName("B3");

    var aChampion = document.getElementById("AFinal");
    var bChampion = document.getElementById("BFinal");

    // Stored local version of team seeds
    var aStorageArray = [];
    var bStorageArray = [];

    // Remove spinner
    $('#spinner').css('display', 'none');

    // Round 0 (list of qualified teams)
    var aStorageArray = firstRoundPopulate(aRound0Array, teams, result.a)
    var bStorageArray = firstRoundPopulate(bRound0Array, teams, result.b)

    // Round 1
    multipleOptionsPopulate(aRound1Array, aStorageArray)
    multipleOptionsPopulate(bRound1Array, bStorageArray)

    // Round 2 (NFL - A & B Bracket finals)
    multipleOptionsPopulate(aRound2Array, aStorageArray)
    multipleOptionsPopulate(bRound2Array, bStorageArray)

    // Round 3 
    multipleOptionsPopulate(aRound3Array, aStorageArray)
    multipleOptionsPopulate(bRound3Array, bStorageArray)

    // Championship Game / Super Bowl
    superBowlPopulate(aChampion, aStorageArray)
    superBowlPopulate(bChampion, bStorageArray)

    $(function () {
      $(".dropdown-menu").on('click', 'p', function () {

        var dropdownButton = $(this).parent().prev()
        var seed = $(this).attr("seed");
        var division = $(this).attr("division");

        // Button styling
        dropdownButton.text($(this).text());
        dropdownButton.css('background', $(this).css('background'));
        dropdownButton.attr('seed', seed)
        if (division != null) {
          dropdownButton.attr('division', division)
        }

        var round = dropdownButton.attr("round")
        buttonUpdate(seed, round, aStorageArray, bStorageArray);
        checkifAllChociesAreMade();
      });
    });
  });
}

// Logic used for getting populating team buttons
function teamStyleLogic(teamObject, divisionArrayElement) {

  // Change Box to match teams information
  divisionArrayElement.style.background = teamObject.cPrim;
  divisionArrayElement.innerText = teamObject.city + " " + teamObject.name;

  // Line below name with secondary color
  const firstSeedLine = document.createElement("div");
  firstSeedLine.setAttribute("id", "line")
  divisionArrayElement.appendChild(firstSeedLine);

  firstSeedLine.style.background = teamObject.cSecn;
}

function backwardCheckLogic(seed, dropdownElement) {
  const appendDropdown = document.createElement("p");
  appendDropdown.setAttribute("seed", seed)
  appendDropdown.setAttribute("class", "drop-item");
  appendDropdown.setAttribute("temporary", "");
  dropdownElement.insertAdjacentElement('afterend', appendDropdown)
  return appendDropdown;
}

function firstRoundPopulate(elementArray, teamsObject, resultObject) {
  var storageArray = [];
  for (var i = 0; i < elementArray.length; i++) {

    // Get the seed for the current html element
    seed = parseInt(elementArray[i].getAttribute("seed"))

    // Get the right team index
    teamObject = binarySearch(teamsObject, resultObject[seed - 1])
    storageArray[seed] = teamObject
    teamStyleLogic(teamObject, elementArray[i])
  }
  return storageArray;
}

function secondRoundPopulate(elementArray, divisionStorage) {
  for (var i = 0; i < elementArray.length; i++) {
    seed = parseInt(elementArray[i].getAttribute("default"))
    teamStyleLogic(divisionStorage[seed], elementArray[i])
    elementArray[i].setAttribute("seed", seed)
  }
}

function multipleOptionsPopulate(elementArray, divisionStorage) {
  for (var i = 0; i < elementArray.length; i++) {
    seedString = elementArray[i].getAttribute("default")

    styleAndAppendOptionsIfNeeded(seedString, elementArray[i], divisionStorage)
  }
}

function superBowlPopulate(element, divisionStorage) {
  seedString = element.getAttribute("default")

  styleAndAppendOptionsIfNeeded(seedString, element, divisionStorage)
}

// Kicks of future games cascade
function buttonUpdate(seed, round, aStorageArray, bStorageArray) {

  // Get if in A or B division
  var division = round.charAt(0);

  if (round.endsWith("1")) {

    // Go to A2 relevant object
    var dropdownElement = $(`.${division}2[default*='${seed}']`)
    resetDropdown(dropdownElement.get(0))
    dropdownElement.attr('seed', seed);

    if (division == 'A') {
      teamStyleLogic(aStorageArray[seed], dropdownElement.get(0))
    } else {
      teamStyleLogic(bStorageArray[seed], dropdownElement.get(0))
    }

  } else if (round.endsWith("2")) {
    // IF FOOTBALL
    if (league == "NFL") {
      console.log("This is a football bracket")
      var dropdownElement = $(`#${division}Final`)
      resetDropdown(dropdownElement.get(0))
      dropdownElement.attr('seed', seed);

      if (division == 'A') {
        teamStyleLogic(aStorageArray[seed], dropdownElement.get(0))
      } else {
        teamStyleLogic(bStorageArray[seed], dropdownElement.get(0))
      }
    }
    // IF NBA or NHL 
    else {
      // Go to A3 relevant object
      var dropdownElement = $(`.${division}3[default*='${seed}']`)
      resetDropdown(dropdownElement.get(0))
      dropdownElement.attr('seed', seed);

      if (division == 'A') {
        teamStyleLogic(aStorageArray[seed], dropdownElement.get(0))
      } else {
        teamStyleLogic(bStorageArray[seed], dropdownElement.get(0))
      }
    }
  } else if (round.endsWith("3")) {
    console.log("This is a NBA or NHL bracket")
    var dropdownElement = $(`#${division}Final`)
    resetDropdown(dropdownElement.get(0))
    dropdownElement.attr('seed', seed);

    if (division == 'A') {
      teamStyleLogic(aStorageArray[seed], dropdownElement.get(0))
    } else {
      teamStyleLogic(bStorageArray[seed], dropdownElement.get(0))
    }
  }
  else { // round = "Championship Game / Superbowl"
    // No action needed.
  }
}

function styleAndAppendOptionsIfNeeded(seedString, element, divisionStorage) {
  var seedArray = seedString.split(",")
  var needsDivision = false;

  if (element.hasAttribute("id")) {
    needsDivision = true;
  }

  for (var j = 0; j < seedArray.length; j++) {
    if (j == 0) { // No need to append for first option, just change the style
      teamStyleLogic(divisionStorage[seedArray[j]], element)
      element.setAttribute("seed", seedArray[j])

    } else { // every other option must be appended
      var appendedElement = backwardCheckLogic(seedArray[j], element);
      teamStyleLogic(divisionStorage[seedArray[j]], appendedElement)

      // Superbowl only logic
      if (needsDivision) {
        appendedElement.setAttribute("division", (element.getAttribute("id").substring(0, 1)))
      }
    }
  }
}

function resetDropdown(element) {
  sibling = element.nextElementSibling

  while (sibling != null && sibling.hasAttribute("temporary")) {
    sibling.remove();
    sibling = element.nextElementSibling;
  }
  var defaultSeed = element.getAttribute("default")
  element.setAttribute("seed", defaultSeed)
}

function replaceUnusedSeeds(newSeed, tier) {
  if (tier == 'upper') {
    newSeed = newSeed.replace(/,|1|4|5/g, '');
  } else { //tier = 'lower'
    newSeed = newSeed.replace(/,|2|3|6|7/g, '');
  }

  var buildSeed = ""

  for (var i = 0; i < newSeed.length; i++) {
    if (i == 0) {
      buildSeed += newSeed.substring(i, i + 1)
    } else {
      buildSeed += "," + newSeed.substring(i, i + 1)
    }
    console.log("building " + buildSeed)
  }
  return buildSeed;
}

function checkifAllChociesAreMade() {
  var choices = $(".dropdown-toggle[seed]")
  var possibleChoices = $(".dropdown-toggle")

  $('#num-choices-made').text(`${choices.length} out of ${possibleChoices.length} picked`)

  if (choices.length == possibleChoices.length) {
    $('#num-choices-made').text(`${choices.length} out of ${possibleChoices.length} picked \u2705`)
    // enable submit
    $('#submit').prop('disabled', false);
  }
}

function getPickStringFromUi() {
  var picksString = ""
  var choices = $(".dropdown-toggle[seed]")

  choices.each(function (index) {
    picksString += $(this).attr('seed')
  });

  // Get if the picked winner was from A or B Bracket
  var winner = $("button[round='SB']").attr('division')
  picksString += winner

  console.log(picksString)

  return picksString
}

// this is the id of the form
$("#submissionForm").submit(function (e) {

  e.preventDefault(); // avoid to execute the actual submit of the form.

  // Spinner is back
  $('#spinner').css('display', 'block');

  var picksString = getPickStringFromUi();
  var league = getLeague()
  var year = getYear()

  // Set hidden inputs
  $('#picks').val(picksString)
  $('#league').val(league)
  $('#bracketYear').val(year)

  console.log(`submiting ${picksString}, ${league}, ${year}`)

  // AJAX Submit
  var form = $(this);
  var url = form.attr('action');

  $.ajax({
    type: "POST",
    url: url,
    crossDomain: true,  
    data: form.serialize(), // serializes the form's elements.
    headers: { 
      "accept": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    success: function (data) {
      console.log("POST Sent!")
      $("#message").removeClass('d-none');

      // Pull tabs again
      reloadUserTabs()
      $('#spinner').css('display', 'none');
    },
    error: function () {
      console.error("Something went wrong with your submission");
      $('#spinner').css('display', 'none');
    }
  });
});