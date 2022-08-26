document.getElementById("zoomOut").onclick = function () {
  console.log("zooming out");
  var map = document.getElementById("mapOfNC");
  console.log(map.style.transform);
  var m = map.style.transform;
  var mt = m.substring(m.indexOf("(") + 1, m.indexOf(")")).split(",");
  // or else: var mt = m.substring(7, m.length - 1).split(',');
  var nextScale = mt[0] * 0.9;
  console.log(nextScale);
  map.style.transition = "transform .4s";
  map.style.transform =
    "scale(" + nextScale.toString() + "," + nextScale.toString() + ")";
};

document.getElementById("zoomIn").onclick = function () {
  console.log("zooming in");
  var map = document.getElementById("mapOfNC");
  console.log(map.style.transform);
  var m = map.style.transform;
  var mt = m.substring(m.indexOf("(") + 1, m.indexOf(")")).split(",");
  // or else: var mt = m.substring(7, m.length - 1).split(',');
  var nextScale = mt[0] * 1.2;
  console.log(nextScale);
  map.style.transition = "transform .4s";
  map.style.transform =
    "scale(" + nextScale.toString() + "," + nextScale.toString() + ")";
};

var offset = [0, 0];
var map = document.getElementById("mapOfNC");
var isDown = false;

map.addEventListener(
  "mousedown",
  function (e) {
    console.log("moving map");
    isDown = true;
    offset = [
      parseInt(map.style.left) - e.clientX,
      parseInt(map.style.top) - e.clientY,
    ];
  },
  true
);
document.addEventListener(
  "mouseup",
  function () {
    console.log("stopped moving map");
    isDown = false;
  },
  true
);
document.addEventListener(
  "mousemove",
  function (e) {
    console.log("moving");
    event.preventDefault();
    if (isDown) {
      map.style.left = e.clientX + offset[0] + "px";
      map.style.top = e.clientY + offset[1] + "px";
    }
  },
  true
);


function changeColor() {
  console.log(e);
}


var counties = document.querySelectorAll(".county");
counties.forEach((county) => {
 /* county.addEventListener("mouseover", function handleHover(e) {
    console.log("hovered over ", e);
    e.srcElement.style = "fill: #bc75e6;";
  });
  county.addEventListener("mouseout", function handleHover(e) {
    console.log("hovered over ", e);
    e.srcElement.style = "stroke:black;stroke-width:40;stroke-linejoin:round";
  });
  */
  county.addEventListener("click", function (e) {
    console.log(e.srcElement.id);
    document.getElementById("countyName").innerText = e.srcElement.id;
  });
});
