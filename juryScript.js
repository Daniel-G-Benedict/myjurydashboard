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

//chart data
var chartjson = {
  "title": "Expected Jury Composition",
  "data": [{
    "name": "Asian - Min",
    "score": 20
  }, {
    "name": "Asian - Max",
    "score": 73
  }, {
    "name": "Black - Min",
    "score": 20
  }, {
    "name": "Black - Max",
    "score": 89
  }, {
    "name": "Other - Min",
    "score": 24
  }, {
    "name": "Other - Max",
    "score": 86
  }, {
    "name": "White - Min",
    "score": 96
  }, {
    "name": "White - Max",
    "score": 71
  }],
  "xtitle": "Secured Marks",
  "ytitle": "Marks",
  "ymax": 100,
  "ykey": 'score',
  "xkey": "name",
  "prefix": "%"
}

//chart colors
var colors = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen'];

//constants
var TROW = 'tr',
  TDATA = 'td';

var chart = document.createElement('div');
//create the chart canvas
var barchart = document.createElement('table');
//create the title row
var titlerow = document.createElement(TROW);
//create the title data
var titledata = document.createElement(TDATA);
//make the colspan to number of records
titledata.setAttribute('colspan', chartjson.data.length + 1);
titledata.setAttribute('class', 'charttitle');
titledata.innerText = chartjson.title;
titlerow.appendChild(titledata);
barchart.appendChild(titlerow);
chart.appendChild(barchart);

//create the bar row
var barrow = document.createElement(TROW);

//lets add data to the chart
for (var i = 0; i < chartjson.data.length; i++) {
  barrow.setAttribute('class', 'bars');
  var prefix = chartjson.prefix || '';
  //create the bar data
  var bardata = document.createElement(TDATA);
  var bar = document.createElement('div');
  bar.setAttribute('class', colors[i]);
  bar.style.height = chartjson.data[i][chartjson.ykey] + prefix;
  bardata.innerText = chartjson.data[i][chartjson.ykey] + prefix;
  bardata.appendChild(bar);
  barrow.appendChild(bardata);
}

//create legends
var legendrow = document.createElement(TROW);
var legend = document.createElement(TDATA);
legend.setAttribute('class', 'legend');
legend.setAttribute('colspan', chartjson.data.length);

//add legend data
for (var i = 0; i < chartjson.data.length; i++) {
  var legbox = document.createElement('span');
  legbox.setAttribute('class', 'legbox');
  var barname = document.createElement('span');
  barname.setAttribute('class', colors[i] + ' xaxisname');
  var bartext = document.createElement('span');
  bartext.innerText = chartjson.data[i][chartjson.xkey];
  legbox.appendChild(barname);
  legbox.appendChild(bartext);
  legend.appendChild(legbox);
}
barrow.appendChild(legend);
barchart.appendChild(barrow);
barchart.appendChild(legendrow);
chart.appendChild(barchart);
document.getElementById('chart').innerHTML = chart.outerHTML;
