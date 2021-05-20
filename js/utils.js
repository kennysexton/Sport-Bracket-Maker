// grab the the team info that matches the results value. 
// credit - wOxxOm (https://codereview.stackexchange.com/questions/144821/binary-search-on-string-in-alphabetical-order)
function binarySearch(haystack, needle) {
  var a = 0;
  var b = haystack.length - 1;
  if (needle < haystack[0].city || needle > haystack[b].city) {
    return {};
  }
  while (a < b - 1) {
    var c = (a + b) / 2 | 0;
    if (needle < haystack[c].city) {
      b = c;
    } else {
      a = c;
    }
  }
  //Multiple teams play in the same city edge case. Use format (New York*Giants)
  if (needle.includes('*')) {
    teamName = needle.split('*')[1] // City name will be after star. 
    if (teamName === haystack[a].name) {
      return haystack[a]
    } else { // I don't think any city in a sport has more that 2 professional team, so use second
      return haystack[a - 1]
    }
  } else if (haystack[a].city === needle) {
    return haystack[a]
  } else if (haystack[a + 1].city === needle) {
    return haystack[a + 1]
  } else {
    console.error("Something went wrong in binary search when searching for - " + needle)
    return {}
  }
}

// Grab json files
function parseJson(jsonObject) {
  try {
    return jsonObject
  } catch (e) {
    console.error("Failed to parse JSON: " + e)
    return null
  }
}

function httpGet(url, callback) {
  const Http = new XMLHttpRequest();
  Http.open("GET", url, true);
  Http.send();

  Http.onreadystatechange = function () {
    if (Http.readyState == 4 && Http.status == 200) {
      callback(Http.responseText)
    }
  }
  Http.onerror = function (e) {
    console.error(Http.statusText);
  };
}

// Re-Add spaces and other problem character
function removeSpaces(string) {
  let newString = ""
  // remove dashes
  newString = string.replace(/-/g, ' ');
  //remove underscores
  newString = string.replace(/_/g, ' ');
  return newString
}

// Remove spaces in names so that the code doesn't break
function cleanInput(string) {
  let newString = ""
  // remove spaces
  newString = string.replace(/ /g, '_');
  return newString
}

// Gives a percentage as a string
function getPercentage(part, total) {
  return Math.round(part / total * 100) + "%";
}

// Get the league using the url ex.) url.com/nba.html -> NBA
function getLeague() {
  var league = location.pathname.split("/")[1]
  return league.split(".")[0]
}
