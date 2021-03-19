/**
 * Get Cookie Name and Value as parameters and set the cookie if cookie name
 * is not empty.
 */
var cookieDomain = '';

function setCookie(cookieName, cookieValue) {
  'use strict';

  var createCookie = '';
  if (cookieName && cookieName !== '') {
    createCookie = cookieName + '=' + encodeURIComponent(cookieValue);
    if (cookieDomain !== '') {
      createCookie = createCookie + '; domain=' + cookieDomain;
    }
    createCookie = createCookie + '; max-age=315360000';
    createCookie = createCookie + '; path=/';
    // createCookie = createCookie + '; secure';
  }

  if (createCookie !== '') {
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
  'use strict';

  var checkCookie = '';
  var cookieName = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var fetchCookie = 0;
  var matchedCookie = '';
  var splittedCookie = decodedCookie.split(';');

  while (fetchCookie < splittedCookie.length) {
    checkCookie = splittedCookie[fetchCookie];
    while (checkCookie.charAt(0)) {
      if (checkCookie.charAt(0) === ' ') {
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

(function($) {
  $(document).ready(function() {
    var startDate = new Date();
    var userName = '';

    if (getCookie('name')) {
      userName = getCookie('name');
    }

    if (userName === '') {
      person = prompt('Please enter your name:', '');
      if (person == null || person == '') {
        userName = 'random-generated-' + Math.floor(Math.random() * 100000);
      } else {
        userName = person;
      }
      setCookie('name', userName);
    }

    $('body').show();
    jQuery('#startedTime .start').text(startDate.getTime());

    const uuid = '6a51fcd7-2a58-4739-88f9-7c35937c7f5b';
    const pubnub = new PubNub({
      publishKey: 'pub-c-d9b65525-7942-49e6-bd56-e1c6d546dc7d',
      subscribeKey: 'sub-c-b5ab409c-88c4-11eb-99bb-ce4b510ebf19',
      uuid: uuid
    });

    $(document).on('click', '#publish-button', function() {
      pubnub.publish({
        channel: 'Channel-n73u8gzao',
        message: { 'user': userName, 'level': $(this).attr('data-curLevel'), 'score': $(this).attr('data-score') }
      });
    });

    pubnub.subscribe({
      channels: ['Channel-n73u8gzao'],
      withPresence: true
    });

    pubnub.addListener({
      message: function(event) {
        let pElement = document.createElement('p');
        document.body.appendChild(pElement);
      },
      presence: function(event) {
        let pElement = document.createElement('p');
        pElement.appendChild(document.createTextNode(event.uuid + ' has joined. That\'s you!'));
        document.body.appendChild(pElement);
      }
    });
    var mylist1 = '';
    var mylist2 = '';
    var mylist3 = '';
    pubnub.history(
      {
        channel: 'Channel-n73u8gzao',
        count: 10,
        stringifiedTimeToken: true,
      },
      function(status, response) {
        var msgs = response.messages;
        var fullTime = 0;
        var finalTime;
        var onlyTime;
        mylist1 = '<li style="order:-1"><span class="user-name">Name</span><span class="level">Level</span><span class="time">Time</span></li>';
        mylist2 = '<li style="order:-1"><span class="user-name">Name</span><span class="level">Level</span><span class="time">Time</span></li>';
        mylist3 = '<li style="order:-1"><span class="user-name">Name</span><span class="level">Level</span><span class="time">Time</span></li>';
        msgs.forEach(function(inner) {
          if (inner.entry.score) {
            fullTime = inner.entry.score;
            if (fullTime.indexOf('Seconds') == -1) {
              if (fullTime > 60) {
                finalTime = Math.floor(fullTime / 60);
                if (finalTime > 1) {
                  finalTime = finalTime + ' Minutes';
                } else {
                  finalTime = finalTime + ' Minute';
                }
              } else {
                fullTime = parseFloat(fullTime).toFixed(1);
                finalTime = fullTime + ' Seconds';
              }
            } else {
              finalTime = fullTime;
            }
            onlyTime = inner.entry.score;
            onlyTime = onlyTime.replace('Seconds', '');
            onlyTime = onlyTime.replace('Minutes', '');
            if (inner.entry.level == 1) {
              mylist1 += '<li style="order:' + Math.ceil(onlyTime) + '"><span class="user-name">' + inner.entry.user + '</span><span class="level">' + inner.entry.level + '</span><span class="Time">' + finalTime + '</span></li>';
            } else if (inner.entry.level == 2) {
              mylist2 += '<li style="order:' + Math.ceil(onlyTime) + '"><span class="user-name">' + inner.entry.user + '</span><span class="level">' + inner.entry.level + '</span><span class="Time">' + finalTime + '</span></li>';
            } else if (inner.entry.level == 3) {
              mylist3 += '<li style="order:' + Math.ceil(onlyTime) + '"><span class="user-name">' + inner.entry.user + '</span><span class="level">' + inner.entry.level + '</span><span class="Time">' + finalTime + '</span></li>';
            }
          }
        });
        $('.all-score.level1').append(mylist1);
        if ($('.all-score.level1 li').length > 1) {
          $('.all-score.level1').show();
          $('.score-card').show();
        }
        $('.all-score.level2').append(mylist2);
        if ($('.all-score.level2 li').length > 1) {
          $('.all-score.level2').show();
        }
        $('.all-score.level3').append(mylist3);
        if ($('.all-score.level3 li').length > 1) {
          $('.all-score.level3').show();
        }
      }
    );
  });

  $(window).on('load', function() {
    if (getCookie('levelNumber')) {
      $('.wrap').attr('data-level', getCookie('levelNumber'));
    }
    $(document).on('click', '.next-level', function(e) {
      if ($(this).attr('data-level') > 3) {
        $('.ws-game-over-outer').hide();
      } else {
        $('.wrap').attr('data-level', $(this).attr('data-level'));
        setCookie('levelNumber', $(this).attr('data-level'));
        location.reload();
      }
    });

    wordSearch();
    $('.userName').text(getCookie('name'));

    $(document).on('click', '.playagain', function() {
      setCookie('levelNumber', 1);
      $('.ws-game-over-inner').hide();
      location.reload();
    });
  });
})(jQuery);
