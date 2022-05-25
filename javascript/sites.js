var return_button_websites = document.querySelector('.return-websites');
var submit = document.getElementById('submit');
// var website = document.getElementById('website-entry');

var list = document.querySelector(".blocked-sites");



submit.addEventListener('click', () => {

  // alert("adding website " + website.value);
  chrome.tabs.query({
    "active": true,
    "lastFocusedWindow": true
  }, function(tabs) {

    chrome.storage.sync.get(["urls"], function(result) {
      if (result["urls"] == null)
        result["urls"] = [];
      // alert(validateUrl(website.value));
      // url_to_add = changeUrl(tabs[0]);
      // alert(url_to_add);

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
