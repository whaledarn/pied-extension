var return_button_websites = document.querySelector('.return-websites'); // return to home page
var submit = document.getElementById('submit'); // add a new website
var list = document.querySelector(".blocked-sites"); // list of blocked sites

/*Button Event Listeners*/
submit.addEventListener('click', () => {
  chrome.tabs.query({
    "active": true,
    "lastFocusedWindow": true
  }, function(tabs) {

    chrome.storage.sync.get(["urls"], function(result) {
      if (result["urls"] == null)
        result["urls"] = [];
      newUrl = changeUrl(tabs[0].url);
      if (newUrl != null && !result["urls"].includes(newUrl))
        result["urls"].push(newUrl);

      chrome.storage.sync.set({
        urls: result["urls"]
      }, function() {
        reloadWebsites();
        chrome.tabs.reload();
      })
    })

  })
})
return_button_websites.addEventListener('click', () => {
  document.querySelector(".homepage").style.display = "inline";
  document.querySelector(".sitepage").style.display = "none";
})

/*Get url from current tab*/
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
    })
}

/*Get the host name of website*/
function changeUrl(url) {

  try {
    const paramUrl = new URL(url);
    var newUrl = paramUrl.host;
    return newUrl
  } catch (e) {
    console.error(e);
    alert("Bad URL");
    return null;
  }


}

/*Remove url from block list*/
function removeUrl(url) {
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

/*Reload list of websites*/
function reloadWebsites() {
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
        alert("Unblock "+website_text.innerText+"?");
        removeUrl(website_text.innerText);
        chrome.tabs.reload();
      }
      list.appendChild(website_text);
    }

  })
}
