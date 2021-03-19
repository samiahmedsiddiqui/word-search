/**
 * Get Cookie Name and Value as parameters and set the cookie if cookie name
 * is not empty.
 */
var cookieDomain = "";

function setCookie(cookieName, cookieValue) {
  "use strict";

  var createCookie = "";
  if (cookieName && cookieName !== "") {
    createCookie = cookieName + "=" + encodeURIComponent(cookieValue);
    if (cookieDomain !== "") {
      createCookie = createCookie + "; domain=" + cookieDomain;
    }
    createCookie = createCookie + "; max-age=315360000";
    createCookie = createCookie + "; path=/";
    // createCookie = createCookie + "; secure";
  }

  if (createCookie !== "") {
    document.cookie = createCookie;
  }
}

/**
 * Decode the cookie and return the appropriate cookie value if found
 * Otherwise empty string is returned.
 *
 * return string
 */
function getCookie(cname) {
  "use strict";

  var checkCookie = "";
  var cookieName = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var fetchCookie = 0;
  var matchedCookie = "";
  var splittedCookie = decodedCookie.split(";");

  while (fetchCookie < splittedCookie.length) {
    checkCookie = splittedCookie[fetchCookie];
    while (checkCookie.charAt(0)) {
      if (checkCookie.charAt(0) === " ") {
        checkCookie = checkCookie.substring(1);
      } else {
        break;
      }
    }
    if (checkCookie.indexOf(cookieName) === 0) {
      matchedCookie = checkCookie.substring(cookieName.length, checkCookie.length);
      break;
    }
    fetchCookie += 1;
  }

  return matchedCookie;
}
function wordSearch() {
  var gameAreaEl = document.getElementById('ws-area');
  var gameobj = gameAreaEl.wordSearch();
  // Put words into `.ws-words`
  var words = gameobj.settings.wordsList,
    wordsWrap = document.querySelector('.ws-words');
  for (i in words) {
    var liEl = document.createElement('li');
    liEl.setAttribute('class', 'ws-word');
    liEl.innerText = words[i];
    wordsWrap.appendChild(liEl);
  }
}
(function ($) {
  $(window).on("load", function () {
    if (getCookie("levelNumber")) {
      $(".wrap").attr("data-level", getCookie("levelNumber"));
    }
    $(document).on('click', '.next-level', function (e) {
      if ($(this).attr("data-level") > 3) {
        $(".ws-game-over-outer").hide();
      } else {
        $(".wrap").attr("data-level", $(this).attr("data-level"));
        setCookie("levelNumber", $(this).attr("data-level"));
        location.reload();
      }
    });

    // $(".wrap").html("");
    wordSearch();
    $(".userName").text(getCookie("name"));

    $(document).on('click', '.playagain', function () {
      setCookie("levelNumber", 1);
      $(".ws-game-over-inner").hide();
      location.reload();

    });

  });

})(jQuery);
