var return_button = document.getElementById('return');
var submit = document.getElementById('submit');
var website = document.getElementById('website-entry');

submit.addEventListener('click', () => {
  if(website.value!="")
    alert("adding website "+website.value);

})


return_button.addEventListener('click', () => {
  document.querySelector(".homepage").style.display = "inline";
  document.querySelector(".sitepage").style.display = "none";
})
