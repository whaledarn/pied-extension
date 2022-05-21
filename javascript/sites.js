var return_button = document.getElementById('return');
var submit = document.getElementById('submit');
var website = document.getElementById('website-entry');

btn.addEventListener('click', () => {
  alert("entered");
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    alert("message sent");
  chrome.tabs.sendMessage(tabs[0].id, {greeting: "add", website: "penis.com"}, function(response) {
  });
});
})


return_button.addEventListener('click', () => {
  alert("worked");
  document.querySelector(".homepage").style.display = "inline";
  document.querySelector(".sitepage").style.display = "none";
})
