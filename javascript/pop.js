/*VARIABLES*/
var GLOB_BG = chrome.extension.getBackgroundPage(); // background page
var GLOB_SET_BTN = document.getElementById('btn-start'); // start timer button
var web_button = document.getElementById('web'); // switch to website page
var color_button = document.getElementById('colors'); // switch to color page
var reset_websites = document.getElementById("reset-websites"); // reset websites

var slider = document.getElementById("myRange"); // slider
var timer_value = document.getElementById("timer"); // timer value
var restart = document.getElementById("btn-restart"); // restart button
var ball = document.querySelector(".ball"); // bouncing ball
var list = document.querySelector(".blocked-sites"); // list element of blocked sites
var color_list = document.querySelector(".color-list"); // list elements of colors


var colors = ["#FFFFFF", "#000000", "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#9400D3"];
var values = [1800, 3600, 5400, 7200, 10800, 14400, 18000];
var text = ["00h 30m 00s", "01h 00m 00s", "01h 30m 00s", "02h 00m 00s", "03h 00m 00s", "04h 00m 00s", "05h 00m 00s"];

//decrement timer while timer is running
if (GLOB_BG.timer01.IS_RUNNING) {
  doWhileRunning();
}

/*UPDATE COLORS*/
ball.style.backgroundColor = colors[GLOB_BG.COLOR_VALUE];
document.querySelector(".color-id").innerHTML = colors[GLOB_BG.COLOR_VALUE];
document.querySelector(".color-id").style.color = colors[GLOB_BG.COLOR_VALUE];
/*update slider*/
slider.oninput = function() {
  timer_value.innerHTML = text[this.value];
}

/*Button event listeners*/
GLOB_SET_BTN.addEventListener('click', () => {
  // reset timers
  resetAll();
  // get the durations of timer
  var timer01_dur = values[slider.value];
  //change ball color
  ball.style.backgroundColor = colors[GLOB_BG.COLOR_VALUE];

  //start timer
  GLOB_BG.timer01.setStartTime(timer01_dur);

  GLOB_BG.timer01.startTimer();

  doWhileRunning();
})
restart.addEventListener('click', () => {
  resetAll();
})
reset_websites.addEventListener('click', () => {
  chrome.storage.sync.set({
    urls: []
  }, function() {
    reloadWebsites();
    chrome.tabs.reload();
  })
})
web_button.addEventListener('click', () => {

  reloadWebsites();
  document.querySelector(".homepage").style.display = "none";
  document.querySelector(".sitepage").style.display = "inline";
  getURL();

})
color_button.addEventListener('click', () => {

  reloadColors();
  document.querySelector(".homepage").style.display = "none";
  document.querySelector(".colorpage").style.display = "inline";
})


/*Convert time from seconds*/
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


/*start timer and bounce ball*/
function doWhileRunning() {
  document.querySelector(".started").style.display = "none";
  document.querySelector(".unstarted").style.display = "flex";
  document.querySelector(".ball").style.animation = "bounce 1s infinite";
  document.querySelector(".shadow").style.animation = "shrink 1s infinite";
}


/*Update values accordingly*/
function IntervalUpdate() {
  // the required tasks on each update

  // update the html display
  if (GLOB_BG.timer01.IS_RUNNING)
    document.getElementById('timer').innerText = convertTime(GLOB_BG.timer01.CUR_DURATION);
  else {
    ball.style.backgroundColor = colors[GLOB_BG.COLOR_VALUE];
    document.querySelector(".started").style.display = "flex";
    document.querySelector(".unstarted").style.display = "none";
    document.querySelector(".ball").style.animation = "";
    document.querySelector(".shadow").style.animation = "";
    document.querySelector(".color-id").innerHTML = colors[GLOB_BG.COLOR_VALUE];
    document.querySelector(".color-id").style.color = colors[GLOB_BG.COLOR_VALUE];
  }

}

/*Reset Timer*/
function resetAll() {

  document.getElementById('timer').innerText = "02h 00m 00s";
  GLOB_BG.resetAll();
}


setInterval(() => {
  IntervalUpdate();
}, 20);
