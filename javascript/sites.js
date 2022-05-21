var return_button = document.getElementById('return');
var submit = document.getElementById('btn');
var website = document.getElementById('submit');

btn.addEventListener('click', () => {
  alert("entered");
})


return_button.addEventListener('click', () => {
  alert("worked");
  chrome.browserAction.setPopup({popup: "popout.html"});
})
