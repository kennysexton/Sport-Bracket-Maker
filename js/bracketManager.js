document.addEventListener("DOMContentLoaded", function () {

  // 0 if pick window is still open
  if (0) {
    leaderBoardLogic()
    $('#submissionForm').hide()
  } else {
    newBracketLogic()
  }
});

// Load default bracket
function newBracketLogic() {
  $('#bracket-replace').load('htmlSegments/bracket.html', function () {

    // Grab team JSON datas
    var teams = parseJson(data)
    var result = parseJson(results)

    var aRound1Array = document.getElementsByClassName("A1");
    var aRound3Array = document.getElementsByClassName("A3");
    var aRound4Array = document.getElementsByClassName("A4");
    var bRound1Array = document.getElementsByClassName("B1");
    var bRound3Array = document.getElementsByClassName("B3");
    var bRound4Array = document.getElementsByClassName("B4");
    var aChampion = document.getElementById("AFinal");
    var bChampion = document.getElementById("BFinal");

    // Stored local version of team seeds
    var aStorageArray = [];
    var bStorageArray = [];

    // Remove spinner
    $('#spinner').remove();

    // Round 1 (qualified teams)
    var aStorageArray = firstRoundPopulate(aRound1Array, teams, result.aRound1)
    var bStorageArray = firstRoundPopulate(bRound1Array, teams, result.bRound1)

    // Round 3 (Division round)
    multipleOptionsPopulate(aRound3Array, aStorageArray)
    multipleOptionsPopulate(bRound3Array, bStorageArray)

    // Round 4 (A Bracket final / B Bracket final)
    multipleOptionsPopulate(aRound4Array, aStorageArray)
    multipleOptionsPopulate(bRound4Array, bStorageArray)

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

  if (round.startsWith("A")) {
    if (round.endsWith("3")) {

      // Go to A3 relevant object
      var dropdownElement = $(".A4[default*='" + seed + "']")
      resetDropdown(dropdownElement.get(0))
      dropdownElement.attr('seed', seed);
      teamStyleLogic(aStorageArray[seed], dropdownElement.get(0))

      // TODO: Cascade eliminated team to final game
      // console.log("test block")
      // var dropdownElement2 = $("#AFinal")
      // resetDropdown(dropdownElement2.get(0))
      // dropdownElement2.attr('seed', seed);
      // teamStyleLogic(afcStorageArray[seed],dropdownElement2.get(0))

    } else if (round.endsWith("4")) {

      var dropdownElement = $('#AFinal')
      resetDropdown(dropdownElement.get(0))
      dropdownElement.attr('seed', seed);
      teamStyleLogic(aStorageArray[seed], dropdownElement.get(0))
    }
  } else if (round.startsWith("B")) {
    if (round.endsWith("3")) {
      // Go to B3 relevant object
      var dropdownElement = $(".B4[default*='" + seed + "']")
      resetDropdown(dropdownElement.get(0))
      dropdownElement.attr('seed', seed);
      teamStyleLogic(bStorageArray[seed], dropdownElement.get(0))

    } else if (round.endsWith("4")) {
      var dropdownElement = $('#BFinal')
      resetDropdown(dropdownElement.get(0))
      dropdownElement.attr('seed', seed);
      teamStyleLogic(bStorageArray[seed], dropdownElement.get(0))
    }

  } else { // round = "Championship Game / Superbowl"
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

  if (choices.length == 7) {
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

  return picksString
}

// this is the id of the form
$("#submissionForm").submit(function (e) {

  e.preventDefault(); // avoid to execute the actual submit of the form.

  var picksString = getPickStringFromUi();

  // Set picks inputs
  $('#picks').val(picksString)

  // AJAX Submit
  var form = $(this);
  var url = form.attr('action');

  $.ajax({
    type: "POST",
    url: url,
    data: form.serialize(), // serializes the form's elements.
    success: function (data) {
      console.log("POST Sent!")
      $("#message").removeClass('d-none');

      // Pull tabs again
      reloadUserTabs()
    }
  });
});