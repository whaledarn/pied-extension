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
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            greeting: "hello"
          }, function(response) {
          });
        });

      } else {
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

  toString() {
    return "hello";
  }


}

function resetAll() {
  timer01.clear();
  timer01 = new Timer();
}



var timer01 = new Timer();




var boxes = [1, 2, 3, 4];
