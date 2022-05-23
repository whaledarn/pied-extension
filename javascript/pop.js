var GLOB_BG = chrome.extension.getBackgroundPage();


var GLOB_SET_BTN = document.getElementById('btn-start');
var web_button = document.getElementById('web');
var color_button = document.getElementById('colors');

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var timer_value = document.getElementById("timer");
var restart = document.getElementById("btn-restart");
var ball = document.querySelector(".ball");

var colors = ["#FFFFFF", "#000000", "#FF0000", "#FFFF00", "#0000FF"]
var values = [1, 1800, 3600, 5400, 7200, 10800, 14400, 18000];
var text = ["00:00:01", "00:30:00", "01:00:00", "01:30:00", "02:00:00", "03:00:00", "04:00:00", "05:00:00"];


if (GLOB_BG.timer01.IS_RUNNING) {
  doWhileRunning();
}


ball.style.backgroundColor = colors[GLOB_BG.COLOR_VALUE];
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
  document.querySelector(".homepage").style.display = "none";
  document.querySelector(".sitepage").style.display = "inline";

})

function convertTime(aDur) {
  // this formats minutes and seconds for display
  var hour = parseInt(aDur / 3600, 10);
  var min = parseInt(aDur / 60 - hour * 60, 10);
  var sec = parseInt(aDur % 60, 10);

  var format_hour = hour < 10 ? "0" + hour : hour;
  var format_min = min < 10 ? "0" + min : min;
  var format_sec = sec < 10 ? "0" + sec : sec;

  return format_hour + ":" + format_min + ":" + format_sec;

}

function doWhileRunning() {
  document.querySelector(".started").style.display = "none";
  document.querySelector(".unstarted").style.display = "flex";
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
  }

}

function resetAll() {

  document.getElementById('timer').innerText = "00:00:00";
  GLOB_BG.resetAll();
}



setInterval(() => {
  IntervalUpdate();
}, 20);
