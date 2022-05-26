/*VARIABLES*/
var return_button_colors = document.querySelector('.return-colors');
var reset_colors = document.querySelector('#reset-colors');
var mashed_colors = document.querySelector('.mashed-color');
var add_color = document.querySelector('.add-color');
var mixed_colors = [8, 8, 8];
var color = ConvertRGBtoHex(8,8,8);



/*Button Event Listeners*/
return_button_colors.addEventListener('click', () => {
  document.querySelector(".homepage").style.display = "inline";
  document.querySelector(".colorpage").style.display = "none";
})
reset_colors.addEventListener('click', resetColors);
add_color.addEventListener("click", addColor);


/*Clear colors*/
function resetColors() {

  var emptyMap = new Map();
  chrome.storage.sync.set({
    colors: JSON.stringify(Array.from(emptyMap.entries()))
  }, function() {})
  reloadColors();
}

/*Add new color to list*/
function addColor(){
  let checkboxes = document.querySelectorAll('input[name="color"]:checked');
  if(checkboxes.length<2){
    return;
  }
  chrome.storage.sync.get(["colors"], function(result) {
    var colorMap;
    if (result["colors"] == null) {
      colorMap = new Map();
    }
    else{
      colorMap = new Map(JSON.parse(result["colors"]));
    }

    checkboxes.forEach((checkbox) => {
      var rgb = hexToRGB(checkbox.value);
      colorMap.set(checkbox.value,colorMap.get(checkbox.value)-1);
    });

    if(colorMap.has(color)){
      colorMap.set(color,colorMap.get(color)+1);
    }
    else{
      colorMap.set(color,1);
    }
    chrome.storage.sync.set({
      colors: JSON.stringify(Array.from(colorMap.entries()))
    }, function() {
      reloadColors();
    })
  })

}

/*Update the colors when mixed*/
function getMixedColors() {
  mixed_colors = [0, 0, 0];

  let checkboxes = document.querySelectorAll('input[name="color"]:checked');
  checkboxes.forEach((checkbox) => {
    var rgb = hexToRGB(checkbox.value);
    // alert(rgb[0]);
    mixed_colors[0] += rgb[0];
    mixed_colors[1] += rgb[1];
    mixed_colors[2] += rgb[2];
  });
  if (checkboxes.length <=1)
    mashed_colors.style.backgroundColor = "rgba(8, 8, 8, 0.05)";
  else {
    var r = Math.round(mixed_colors[0] / checkboxes.length);
    var g = Math.round(mixed_colors[1] / checkboxes.length);
    var b = Math.round(mixed_colors[2] / checkboxes.length);
    color = ConvertRGBtoHex(r, g, b)
    mashed_colors.style.backgroundColor = color;
  }

}


/*CONVERSION FUNCTIONS*/
function hexToRGB(c) {
  var hex = c.replace("#", "");
  var r = hex.substring(0, 2);
  var g = hex.substring(2, 4);
  var b = hex.substring(4, 6);
  // alert(parseInt(r, 16)+ " " + parseInt(g, 16) + " " + parseInt(b, 16));
  return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
}

function ColorToHex(color) {
  var hexadecimal = color.toString(16).toUpperCase();
  return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
}

function ConvertRGBtoHex(red, green, blue) {
  return "#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
}

/*Reload the color list*/
function reloadColors() {
  color_list.innerHTML = "";
  chrome.storage.sync.get(["colors"], function(result) {
    var colorMap;
    if (result["colors"] == null) {
      colorMap = new Map();
    } else {
      colorMap = new Map(JSON.parse(result["colors"]));
    }

    for (const [key, value] of colorMap.entries()) {
      if (value > 0) {
        let color_row = document.createElement("div");
        color_row.classList.add("row");

        let color_check = document.createElement("input");
        color_check.classList.add("color-check");
        color_check.value = key;
        color_check.name = "color";
        color_check.type = "checkbox";

        let color_ball = document.createElement("div");
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
        color_list.appendChild(color_row);
        color_list.appendChild(document.createElement("hr"));
      }
    }

  })
}


/*Constantly check if colors are being updated*/
setInterval(() => {
  getMixedColors();
}, 20);
