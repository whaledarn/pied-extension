var GLOB_BG = chrome.extension.getBackgroundPage();


var GLOB_SET_BTN = document.getElementById('btn');

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");


var values = [1,1800, 3600, 5400, 7200, 10800, 14400, 18000];
var text = ["1sec","30min", "60min", "90min", "2hr", "3hr", "4hr", "5hr"];
output.innerHTML = "2hr"; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = text[this.value];
}

GLOB_SET_BTN.addEventListener('click', () => {
  // reset timers
  resetAll();
  // get the durations of each timer
  var timer01_dur = values[slider.value];


  GLOB_BG.timer01.setStartTime(timer01_dur);

  GLOB_BG.timer01.startTimer();
})


function convertTime(aDur) {
      // this formats minutes and seconds for display
      var hour = parseInt(aDur/3600,10);
      var min = parseInt(aDur/60-hour*60,10);
      var sec = parseInt(aDur%60,10);

      var format_hour = hour < 10 ? "0" + hour : hour;
      var format_min = min < 10 ? "0" + min : min;
      var format_sec = sec < 10 ? "0" + sec : sec;

      return format_hour +":" + format_min + ":" + format_sec;

}



function IntervalUpdate() {
  // the required tasks on each update

  // update the html display
  if(GLOB_BG.timer01.IS_RUNNING)
    document.getElementById('timer').innerText = convertTime(GLOB_BG.timer01.CUR_DURATION);
  else{
    document.getElementById('timer').innerText = "";
  }

}

function resetAll() {
  document.getElementById('timer').innerText = "00";
  GLOB_BG.resetAll();
  alert("reset all");
}



setInterval(() => {
  IntervalUpdate();
}, 20);
