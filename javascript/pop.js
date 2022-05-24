var GLOB_BG = chrome.extension.getBackgroundPage();


var GLOB_SET_BTN = document.getElementById('btn-start');
var web_button = document.getElementById('web');
var color_button = document.getElementById('colors');

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var timer_value = document.getElementById("timer");
var restart = document.getElementById("btn-restart");
var ball = document.querySelector(".ball");
var list = document.querySelector(".blocked-sites");

var colors = ["#FFFFFF", "#000000", "#FF0000", "#FFFF00", "#0000FF"]
var values = [1, 1800, 3600, 5400, 7200, 10800, 14400, 18000];
var text = ["00h 00m 01s", "00h 30m 00s", "01h 00m 00s", "01h 30m 00s", "02h 00m 00s", "03h 00m 00s", "04h 00m 00s", "05h 00m 00s"];


if (GLOB_BG.timer01.IS_RUNNING) {
  doWhileRunning();
}


ball.style.backgroundColor = colors[GLOB_BG.COLOR_VALUE];
document.querySelector(".color-id").innerHTML = colors[GLOB_BG.COLOR_VALUE];
document.querySelector(".color-id").style.color = colors[GLOB_BG.COLOR_VALUE];
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  timer_value.innerHTML = text[this.value];
}

GLOB_SET_BTN.addEventListener('click', () => {
  // reset timers
  resetAll();
  // get the durations of each timer
  var timer01_dur = values[slider.value];
  // alert(GLOB_BG.COLOR_VALUE);
  ball.style.backgroundColor = colors[GLOB_BG.COLOR_VALUE];


  GLOB_BG.timer01.setStartTime(timer01_dur);

  GLOB_BG.timer01.startTimer();

  doWhileRunning();
})

restart.addEventListener('click', () => {
  resetAll();
  document.querySelector(".homepage").style.display = "inline";
  document.querySelector(".sitepage").style.display = "none";

})

web_button.addEventListener('click', () => {

  reloadWebsites();
  document.querySelector(".homepage").style.display = "none";
  document.querySelector(".sitepage").style.display = "inline";

})

function removeUrl(url) {
    // alert("removing "+url);
    chrome.storage.sync.get(["urls"], function(result) {
        let index = result["urls"].indexOf(url)
        if (index !== -1) {
            result["urls"].splice(index, 1)
            chrome.storage.sync.set({urls: result["urls"]}, function() {
              reloadWebsites();
            })
        }
    })
}

function reloadWebsites(){
  list.innerHTML = "";
  chrome.storage.sync.get(["urls"], function(result) {

    if (result["urls"] == null) {
      result["urls"] = [];
    }

    for (var i = 0; i < result["urls"].length; i++) {
      var image = document.createElement("img");
      var image = "<img style='max-width:10%; margin-right:5px;' src='https://icon.horse/icon/" + result["urls"][i] + "'>";

      var website_text = document.createElement("a");
      website_text.classList.add("list-group-item");
      website_text.classList.add("list-group-item-action");
      website_text.innerHTML = image + result["urls"][i];
      // alert(website_text.innerText);
      // website_text.addEventListener("click", function() {
      //   removeUrl(website_text.innerText);
      // });
      // website_text.appendChild(image);

      // list.appendChild(image);
      list.appendChild(website_text);
      // list.appendChild(button);
    }
    // alert("wtf " + button.innerText);
    for(var i = 1; i<=result["urls"].length; i++){
      var button = document.querySelector('.blocked-sites :nth-child('+i+')');
      // button.addEventListener("mouseover", function() {
      //   button.classList.add("list-group-item-danger");
      // });
      // button.addEventListener("mouseleave", function() {
      //   button.classList.remove("list-group-item-danger");
      // });
      button.addEventListener("click", function() {
        removeUrl(button.innerText);
        chrome.tabs.reload();
      });
    }
  })
}

function convertTime(aDur) {
  // this formats minutes and seconds for display
  var hour = parseInt(aDur / 3600, 10);
  var min = parseInt(aDur / 60 - hour * 60, 10);
  var sec = parseInt(aDur % 60, 10);

  var format_hour = hour < 10 ? "0" + hour : hour;
  var format_min = min < 10 ? "0" + min : min;
  var format_sec = sec < 10 ? "0" + sec : sec;

  return format_hour + "h " + format_min + "m " + format_sec + "s";

}

function doWhileRunning() {
  document.querySelector(".started").style.display = "none";
  document.querySelector(".unstarted").style.display = "flex";
  document.querySelector(".ball").style.animation = "bounce 1s infinite";
  document.querySelector(".shadow").style.animation = "shrink 1s infinite";
}

function IntervalUpdate() {
  // the required tasks on each update

  // update the html display
  if (GLOB_BG.timer01.IS_RUNNING)
    document.getElementById('timer').innerText = convertTime(GLOB_BG.timer01.CUR_DURATION);
  else {
    // document.getElementById('timer').innerText = "00:00:00";
    ball.style.backgroundColor = colors[GLOB_BG.COLOR_VALUE];
    document.querySelector(".started").style.display = "flex";
    document.querySelector(".unstarted").style.display = "none";
    document.querySelector(".ball").style.animation = "";
    document.querySelector(".shadow").style.animation = "";
    document.querySelector(".color-id").innerHTML = colors[GLOB_BG.COLOR_VALUE];
    document.querySelector(".color-id").style.color = colors[GLOB_BG.COLOR_VALUE];
    // reloadWebsites();
  }

}

function resetAll() {

  document.getElementById('timer').innerText = "00h 00m 00s";
  GLOB_BG.resetAll();
}



setInterval(() => {
  IntervalUpdate();
}, 20);
