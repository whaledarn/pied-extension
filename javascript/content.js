var shouldBlock = false; // is timer running?

/*Code for HTML page*/
const generateHTML = () => {
  return `
  <div class="container">
    <div class="circle"> </div>
    <div class="circle"> </div>
    <div class="circle"> </div>
    <div class="circle"> </div>

    <div class="panel"> </div>

  </div>
  `;
}

/*Code for CSS page*/
const generateCSS = () => {
  return `
  <style>
  body{
     background: linear-gradient(to right, lightblue,  whitesmoke,  lightblue);
  }

  .container{
    text-align: center;
    margin-top: 25%;

  }

  .circle:nth-child(1),
  .circle:nth-child(2),
  .circle:nth-child(3),
  .circle:nth-child(4){
    width: 30px;
    height: 30px;
    background: black;
    display: inline-flex;
    border-radius: 2em;
    animation: PopUp 1s ease-in infinite;
  }

  .circle:nth-child(1){
    background: #F46036;
  }
  .circle:nth-child(2){
    background: #00A6A6;
    animation-delay: .15s;
  }
  .circle:nth-child(3){
    background: #E5D942;
    animation-delay: .25s;
  }
  .circle:nth-child(4){
    background: #2F427A;
    animation-delay: .35s
  }

  .panel{
    width: 300px;
    height: 2px;
    border-radius: 2em;
    background: black;
    margin: auto;
  }

  @keyframes PopUp{
    0%{
      transform: translateY(0px);
    }
    50%{
      transform: translateY(-155px);
    }
    100%{
      transform: translateY(0px);
    }
  }
</style>
  `;
}


/*Check if should block*/
chrome.runtime.sendMessage({
  greeting: "hello"
}, function(response) {
  shouldBlock = response.farewell;
  chrome.storage.sync.get(["urls"], function(result) {
    if (result["urls"] == null)
      var blocked = [];
    else
      var blocked = result["urls"];

    if (shouldBlock) {
      if (blocked.includes(window.location.host)) {
        document.body.innerHTML = generateHTML();
        document.head.innerHTML = generateCSS();
      }
    }
  })

});
