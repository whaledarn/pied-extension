var GLOB_BG = chrome.extension.getBackgroundPage();


var GLOB_SET_BTN = document.getElementById('btn-start');
var web_button = document.getElementById('web');
var color_button = document.getElementById('colors');
var reset_websites = document.getElementById("reset-websites");

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var timer_value = document.getElementById("timer");
var restart = document.getElementById("btn-restart");
var ball = document.querySelector(".ball");
var list = document.querySelector(".blocked-sites");
var color_list = document.querySelector(".color-list");


var colors = ["#FFFFFF", "#000000", "#FF0000", "#FFFF00", "#0000FF"];
var values = [1, 1800, 3600, 5400, 7200, 10800, 14400, 18000];
var text = ["00h 00m 01s", "00h 30m 00s", "01h 00m 00s", "01h 30m 00s", "02h 00m 00s", "03h 00m 00s", "04h 00m 00s", "05h 00m 00s"];


if (GLOB_BG.timer01.IS_RUNNING) {
  doWhileRunning();
}


ball.style.backgroundColor = colors[GLOB_BG.COLOR_VALUE];
document.querySelector(".color-id").innerHTML = colors[GLOB_BG.COLOR_VALUE];
document.querySelector(".color-id").style.color = colors[GLOB_BG.COLOR_VALUE];
// document.querySelector(".website-name").innerHTML = getURL;
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
  // getURL();

})

function getURL() {
  var url =
    chrome.tabs.query({
      "active": true,
      "lastFocusedWindow": true
    }, function(tabs) {

      var url = changeUrl(tabs[0].url);
      var image = "<img style='max-width:13%; margin-right:5px;' src='https://icon.horse/icon/" + url + "'>";
      document.querySelector(".website-name").innerHTML = image + url;
      if (url.length > 20) {
        document.querySelector(".website-name").style.fontSize = "18px";
      }
      if (url.length > 40) {
        document.querySelector(".website-name").style.fontSize = "10px";
      }
      // document.querySelector(".website-name").style.maxWidth = "300px";
      // document.querySelector(".website-name").style.display = "block";
      // document.querySelector(".website-name").style.width = "100%";
      // alert("the tab is " + url);
    })

  // alert("the tab is " + url);
  // document.querySelector(".website-name").innerText = url;
}

function changeUrl(url) {


  try {
    const paramUrl = new URL(url);
    var newUrl = paramUrl.host;
    // newUrl = "*" + newUrl.substring(newUrl.indexOf(":")) + "*"
    return newUrl
  } catch (e) {
    console.error(e);
    alert("Bad URL");
    return null;
  }


}

function removeUrl(url) {
  // alert("removing "+url);
  chrome.storage.sync.get(["urls"], function(result) {
    let index = result["urls"].indexOf(url)
    if (index !== -1) {
      result["urls"].splice(index, 1)
      chrome.storage.sync.set({
        urls: result["urls"]
      }, function() {
        reloadWebsites();
      })
    }
  })
}

function reloadWebsites() {
  // document.querySelector(".website-name").innerText = getURL();
  list.innerHTML = "";
  chrome.storage.sync.get(["urls"], function(result) {

    if (result["urls"] == null) {
      result["urls"] = [];
    }

    for (var i = 0; i < result["urls"].length; i++) {
      var image = document.createElement("img");
      var image = "<img style='max-width:10%; margin-right:5px;' src='https://icon.horse/icon/" + result["urls"][i] + "'>";

      let website_text = document.createElement("a");
      website_text.classList.add("list-group-item");
      website_text.classList.add("list-group-item-action");
      website_text.innerHTML = image + result["urls"][i];

      website_text.addEventListener("mouseover", function() {
        website_text.classList.add("list-group-item-danger");
      });
      website_text.addEventListener("mouseleave", function() {
        website_text.classList.remove("list-group-item-danger");
      });

      website_text.title = "Click to remove";

      website_text.onclick = function() {
        alert(website_text.innerText);
        removeUrl(website_text.innerText);
        chrome.tabs.reload();
      }
      // website_text.style.maxWidth = "300px";

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
    // for(var i = 1; i<=result["urls"].length; i++){
    //   var button = document.querySelector('.blocked-sites :nth-child('+i+')');
    //
    //   button.onclick = function() {
    //     alert(button.innerText);
    //     removeUrl(button.innerText);
    //     chrome.tabs.reload();
    //   }
    // button.addEventListener("mouseover", function() {
    //   button.classList.add("list-group-item-danger");
    // });
    // button.addEventListener("mouseleave", function() {
    //   button.classList.remove("list-group-item-danger");
    // });

    // button.addEventListener("click", function() {
    //   alert(button.innerText);
    //   removeUrl(button.innerText);
    //   chrome.tabs.reload();
    // });
    // }
  })
}

function reloadColors() {
  color_list.innerHTML = "";
  chrome.storage.sync.get(["colors"], function(result) {
    var colorMap;
    if (result["colors"] == null) {
      colorMap = new Map();
    } else {
      alert(JSON.parse(result["colors"]));
      colorMap = new Map(JSON.parse(result["colors"]));
    }

    for (const [key, value] of colorMap.entries()) {

      // alert("key is " + key);
      let color_row = document.createElement("div");
      color_row.classList.add("row");

      let color_check = document.createElement("input");
      color_check.classList.add("color-check");
      color_check.type = "checkbox";

      let color_ball = document.createElement("div");
      // color_ball.classList.add("list-group-item");
      color_ball.classList.add("col");
      color_ball.classList.add("color-ball");
      color_ball.style.backgroundColor = key;


      let color_text = document.createElement("p");
      color_text.classList.add("color-text");
      color_text.classList.add("col");
      color_text.innerHTML = key;

      let color_value = document.createElement("h3");
      color_value.classList.add("color-value-text");
      color_value.innerText = value;

      color_row.appendChild(color_check);
      color_row.appendChild(color_ball);
      color_row.appendChild(color_text);
        color_row.appendChild(color_value);
      // website_text.classList.add("list-group-item-action");


      // website_text.title="Click to remove";
      //
      // website_text.onclick = function() {
      //   alert(website_text.innerText);
      //   removeUrl(website_text.innerText);
      //   chrome.tabs.reload();
      // }
      // website_text.style.maxWidth = "300px";

      // alert(website_text.innerText);
      // website_text.addEventListener("click", function() {
      //   removeUrl(website_text.innerText);
      // });
      // website_text.appendChild(image);

      // list.appendChild(image);
      // color_list.appendChild(website_text);
      color_list.appendChild(color_row);
      color_list.appendChild(document.createElement("hr"));
      // list.appendChild(button);
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
