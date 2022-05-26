COLOR_VALUE = Math.floor(Math.random()*8); // GLOBAL VALUE to determine color #
var colors = ["#FFFFFF", "#000000", "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#9400D3"]; // determines color of current ball

class Timer {
  constructor() {
    this.DURATION = 60;
    this.CUR_DURATION = 60;
    this.IS_RUNNING = false;
    this.IS_DONE = false;
    this.IS_PAUSED = false;
    this.TIMING_INTERVAL;

  }

  setStartTime(duration) {
    if (duration > 0) {
      this.DURATION = duration;
      this.CUR_DURATION = duration;
    } else {
      this.DURATION = 0;
      this.CUR_DURATION = 0;
    }
  }
  getTime() {
    return this.CUR_DURATION;
  }

  getDone() {
    return this.IS_DONE;
  }
  startTimer() {

    this.CUR_DURATION = this.DURATION;
    this.IS_RUNNING = true;

    this.TIMING_INTERVAL = setInterval(this.intervalCheck.bind(this), 1000)
  }
  intervalCheck() {

    // the function that is called when interval runs
    if (this.IS_DONE != true) {
      if (this.CUR_DURATION > 0) {
        this.decrementTime();

      } else {
        addColor(colors[COLOR_VALUE]);
        COLOR_VALUE = Math.floor(Math.random()*8);
        this.IS_DONE = true;
        alert("FINISHED!");
        resetAll();
      }
    }
  }
  decrementTime() {
    // subtracts time
    this.CUR_DURATION -= 1;
  }

  clear() {
    // clears timer
    clearInterval(this.TIMING_INTERVAL);
    this.IS_DONE = false;
    this.CUR_DURATION = this.DURATION;
  }

  setDone(aBool) {
    this.IS_DONE = aBool;
  }
}

/*Adds color after timer is complete*/
function addColor(c){
  chrome.storage.sync.get(["colors"], function(result) {
    var colorMap;
    if (result["colors"] == null) {
      colorMap = new Map();
    }
    else{
      colorMap = new Map(JSON.parse(result["colors"]));
    }

    if(colorMap.has(c)){
      colorMap.set(c,colorMap.get(c)+1);
    }
    else{
      colorMap.set(c,1);
    }
    chrome.storage.sync.set({
      colors: JSON.stringify(Array.from(colorMap.entries()))
    }, function() {
    })
  })
}

/*reset timer*/
function resetAll() {
    timer01.clear();
  timer01 = new Timer();
}

/*add listener to determine if timer is running*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting === "hello"){
      sendResponse({farewell: timer01.IS_RUNNING});
    }
  }
);


//create timer
var timer01 = new Timer();
