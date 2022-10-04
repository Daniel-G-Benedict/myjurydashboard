
// "global" variables

var offset = [0, 0];
var isDown = false;

var map = document.getElementById("mapOfNC");
var counties = document.querySelectorAll(".county");
var countyDropdown = document.getElementById("countyDropdown");



// ZOOM OUT
document.getElementById("zoomOut").onclick = function () {
  //console.log("zooming out");
  var map = document.getElementById("mapOfNC");
  //console.log(map.style.transform);
  var m = map.style.transform;
  var mt = m.substring(m.indexOf("(") + 1, m.indexOf(")")).split(",");
  // or else: var mt = m.substring(7, m.length - 1).split(',');
  var nextScale = mt[0] * 0.9;
  //console.log(nextScale);
  map.style.transition = "transform .4s";
  // setting a "zoom in" limit
  if (nextScale < 1) {
    console.log("Minimum size reached");
    return
  }
  else {

    map.style.transform =
    "scale(" + nextScale.toString() + "," + nextScale.toString() + ")";
  }
};

// ZOOM IN
document.getElementById("zoomIn").onclick = function () {
  //console.log("zooming in");
  var map = document.getElementById("mapOfNC");
  //console.log(map.style.transform);
  var m = map.style.transform;
  var mt = m.substring(m.indexOf("(") + 1, m.indexOf(")")).split(",");
  // or else: var mt = m.substring(7, m.length - 1).split(',');
  var nextScale = mt[0] * 1.2;
  //console.log(nextScale);
  map.style.transition = "transform .4s";

// set a "zoom in" limit
if (nextScale > 9) {
  console.log("Maximum magnification reached")
  return;
}
else {
  map.style.transform =
    "scale(" + nextScale.toString() + "," + nextScale.toString() + ")";
}
};

// MAP DRAG - MOUSE DOWN EVENT LISTENER
map.addEventListener(
  "mousedown",
  function (e) {

    //console.log("moving map");
    isDown = true;
    
    // get the map width and height to check against the "other" variables
    var map = document.getElementById("mapOfNC");
    //console.log(map)

    map.style.transition = "left 0s";
    
    //console.log(map.style.transform);
    var m = map.style.transform;
    var mt = m.substring(m.indexOf("(") + 1, m.indexOf(")")).split(",");


    var newMapX = parseInt(map.style.left) - e.clientX;
    var newMapY = parseInt(map.style.top) - e.clientY;

    offset = [
      newMapX, newMapY
    ];
  },
  true
);

// MAP DRAG - MOUSE UP EVENT LISTENER
document.addEventListener(
  "mouseup",
  function () {
    //console.log("stopped moving map");
    isDown = false;

    var map = document.getElementById("mapOfNC");

    var m = map.style.transform;
    var mt = m.substring(m.indexOf("(") + 1, m.indexOf(")")).split(",");
    // or else: var mt = m.substring(7, m.length - 1).split(',');
    var scale = mt[0];
    //console.log("current scale = " + scale);
    
    var mapLeft = parseInt(map.style.left);
    //console.log("Map distance from left = " + mapLeft)
    var mapTop = parseInt(map.style.top);
    //console.log("Map distance from top  = " + mapTop)

    //get frame width to check against map width / coordinates
    var mapFrameWidth = document.getElementById("map").offsetWidth;

    // right limit
    var limitR = (mapFrameWidth/2) * scale;
    // console.log("Right limit = " + limitR)

    var distToLimitR = mapLeft - limitR;

    // left limit
    var limitL = (50 - mapFrameWidth/2) * scale;

    var distToLimitL = mapLeft - limitL;
    //console.log("Left limit = " + limitL)
    // set transition
    map.style.transition = "left .4s, top .4s";

    // execute
    if (mapLeft > limitR) {
      
      var adjMapX = (mapLeft - distToLimitR);

      map.style.left = adjMapX + "px";
    }
    if (mapLeft < limitL) {

      var adjMapX = (mapLeft - distToLimitL);

      map.style.left = adjMapX + "px";

    }

    // get frame height to check against map style top value
    var mapFrameHeight = document.getElementById("map").offsetHeight;
    //console.log(" mapFrameHeight = " + mapFrameHeight)

    // top limit
    var limitTop = -50 * scale;
   // console.log("Top limit = " + limitTop)

    var distToLimitTop = mapTop - limitTop;

    // bottom limit
    var limitBottom = (mapFrameHeight - (150 * (1/scale)));
   // console.log("Bottom limit = " + limitBottom)

    var distToLimitBottom = limitBottom - mapTop;
   // console.log("Distance to bottom limit = " + distToLimitBottom);

    if (mapTop < limitTop) {
      var adjMapY = (mapTop - distToLimitTop);
      map.style.top = adjMapY + "px";
    }
    if (mapTop > limitBottom) {
      var adjMapY = (mapTop + distToLimitBottom);
      map.style.top = adjMapY + "px";
    }

    var distToLimitTop

   // console.log(map)
  },
  true
);

// MAP DRAG - MOUSE MOVE EVENT LISTENER
document.addEventListener(
  "mousemove",
  function (e) {
    //console.log("moving");
    event.preventDefault();
    if (isDown) {
      map.style.left = e.clientX + offset[0] + "px";
      map.style.top = e.clientY + offset[1] + "px";
    }
  },
  true
);

// SELCTING A COUNTY FROM THE DROPDOWN
countyDropdown.onchange = function() {
  console.log(countyDropdown.value);
  changeMap(countyDropdown.value);
    // change paragraph
    changeData(countyDropdown.value);
}

// event for clicking on a county
counties.forEach((county) => {

  county.addEventListener("click", function (e) {

    //update the dropdown to the selected county
    countyDropdown.value = e.path[0].id;
    console.log("Clicked " + e.path[0].id + " county");

    // change paragraph
    changeData(e.path[0].id);

    // change the map
    changeMap(e.path[0].id);

    console.log(e.path[0].id);

  });
});

function changeMap(target) {
  //console.log(target)
  
  var countyToChange = document.getElementById(target);

  // reset all counties to purple
  counties.forEach((county) => {
    county.style.fill = "#4d2066";
  })

  // change the selected county to a lighter shade of purple
  countyToChange.style.fill = "#bc75e6";

} // close changeMap()



function changeData(target) {

      console.log("The target is...");
      console.log(target)
      console.log(censusData);

      //Get the census info from JSON
        var countyData = censusData.filter(obj => {
            return obj.County === target;
        })

      console.log("logging county data")
      
      console.log(countyData);

      // change the paragraph county title 
      document.getElementById("countyName").innerText = target;
      // change the paragraph county word
      document.getElementById("countyNameParagraph").innerText = target;
      // change the population count in the paragraph
      document.getElementById("countyTotalPopulation").innerText = (countyData[0].Asian.Total + countyData[0].Black.Total + countyData[0].Other.Total + countyData[0].White.Total).toLocaleString("en-US");
      // change the paragraph to show the minimum number of individuals of Asian descent on the jury
        document.getElementById("minAsian").innerText = countyData[0].Asian.Min;
      // change the paragraph to show the minimum number of individuals of Black descent on the jury
        document.getElementById("minBlack").innerText = countyData[0].Black.Min;
      // change the paragraph to show the minimum number of individuals of "other" descent on the jury
        document.getElementById("minOther").innerText = countyData[0].Other.Min;
      // change the paragraph to show the minimum number of individuals of White descent on the jury
        document.getElementById("minWhite").innerText = countyData[0].White.Min;
      // change the paragraph to show the max number of individuals of Asian descent on the jury
      document.getElementById("maxAsian").innerText = countyData[0].Asian.Max;
      // change the paragraph max number of individuals of Black descent on the jury
      document.getElementById("maxBlack").innerText = countyData[0].Black.Max;
      // change the paragraph max number of individuals of Other descent on the jury
      document.getElementById("maxOther").innerText = countyData[0].White.Min;
      // change the paragraph max number of individuals of White descent on the jury
      document.getElementById("maxWhite").innerText = countyData[0].White.Max;


        // change the chart data
        document.getElementById(colors[0]).style.height = (countyData[0].Asian.Min.toString() * 8) + "%";        
        document.getElementById("barNumber" + colors[0] + 'Text').innerText = countyData[0].Asian.Min;

        
        // change the chart data
        document.getElementById(colors[1]).style.height  = (countyData[0].Asian.Max.toString() * 8) + "%";
        document.getElementById("barNumber" + colors[1] + 'Text').innerText = countyData[0].Asian.Max;
        
        // change the chart data
        document.getElementById(colors[2]).style.height = (countyData[0].Black.Min.toString() * 8) + "%";
        document.getElementById("barNumber" + colors[2] + 'Text').innerText = countyData[0].Black.Min;

        // change the chart data
        document.getElementById(colors[3]).style.height = (countyData[0].Black.Max.toString() * 8) + "%";
        document.getElementById("barNumber" + colors[3] + 'Text').innerText = countyData[0].Black.Max;

        // change the chart data
        document.getElementById(colors[4]).style.height = (countyData[0].Other.Min.toString() * 8) + "%";
        document.getElementById("barNumber" + colors[4] + 'Text').innerText = countyData[0].Other.Min;
        
        // change the chart data
        document.getElementById(colors[5]).style.height = (countyData[0].Other.Max.toString() * 8) + "%";
        document.getElementById("barNumber" + colors[5] + 'Text').innerText = countyData[0].Other.Max;
        
        // change the chart data
        document.getElementById(colors[6]).style.height = (countyData[0].White.Min.toString() * 8) + "%";
        document.getElementById("barNumber" + colors[6] + 'Text').innerText = countyData[0].White.Min;
        
        // change the chart data
        document.getElementById(colors[7]).style.height = (countyData[0].White.Max.toString() * 8) + "%";
        document.getElementById("barNumber" + colors[7] + 'Text').innerText = countyData[0].White.Max;


    }// close changeData()


//chart data
var chartjson = {
  "title": "Expected Jury Composistion",
  "data": [{
    "title": "Asian - Min",
    "number": 2
  }, {
    "title": "Asian - Max",
    "number": 7
  }, {
    "title": "Black - Min",
    "number": 2
  }, {
    "title": "Black - Max",
    "number": 8
  }, {
    "title": "Other - Min",
    "number": 2
  }, {
    "title": "Other - Max",
    "number": 8
  }, {
    "title": "White - Min",
    "number": 9
  }, {
    "title": "White - Max",
    "number": 7
  }],
  "xtitle": "Secured Marks",
  "ytitle": "Marks",
  "ymax": 12,
  "ykey": 'number',
  "xkey": "title",
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
  bardata.setAttribute('id', 'barNumber' + colors[i]);
  
  // create the actual bar element
  var bar = document.createElement('div');
  bar.setAttribute('class', colors[i]);
  bar.setAttribute('id',colors[i]);
  bar.style.transition = 'height .3s';
  bar.style.height = chartjson.data[i][chartjson.ykey] + prefix;
  bar.style.width = '30px';
  
  // create the bar text label
  var barText = document.createElement('div');
  barText.setAttribute('id', 'barNumber' + colors[i] + 'Text')
  barText.innerText = chartjson.data[i][chartjson.ykey];

  bardata.appendChild(barText);
  bardata.appendChild(bar);
  barrow.appendChild(bardata);
}

//create legends
var legendrow = document.createElement(TROW);
var legend = document.createElement(TDATA);
legend.setAttribute('class', 'legend');
legend.setAttribute('colspan', chartjson.data.length);

//add legend data and text to side of chart
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

var  censusData = [
  {"County" : "Alamance", "Asian" : {"Total" : 2679, "Min" : 0,"Max" : 1},"Black" : {"Total" : 32917,"Min" : 2, "Max" : 3},"Other" : {"Total" : 15431, "Min" : 1, "Max" : 2},"White" : {"Total" : 114429, "Min" : 8, "Max" :9}},
  {"County" : "Alexander" , "Asian" : { "Total" : 394, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 1924,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 1933, "Min" : 0, "Max" : 1}, "White" : {"Total" : 32670, "Min" : 10, "Max" :11}},
  {"County" : "Alleghany" , "Asian" : { "Total" : 47, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 183,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 275, "Min" : 0, "Max" : 1}, "White" : {"Total" : 10526, "Min" : 11, "Max" :12}},
  {"County" : "Anson" , "Asian" : { "Total" : 315, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 11990,"Min" : 5, "Max" : 6}, "Other" : {"Total" : 477, "Min" : 0, "Max" : 1}, "White" : {"Total" : 11540, "Min" : 5, "Max" :6}},
  {"County" : "Ashe" , "Asian" : { "Total" : 162, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 199,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 680, "Min" : 0, "Max" : 1}, "White" : {"Total" : 25891, "Min" : 11, "Max" :12}},
  {"County" : "Avery" , "Asian" : { "Total" : 76, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 762,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 376, "Min" : 0, "Max" : 1}, "White" : {"Total" : 16099, "Min" : 11, "Max" :12}},
  {"County" : "Beaufort" , "Asian" : { "Total" : 49, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 11607,"Min" : 2, "Max" : 3}, "Other" : {"Total" : 1893, "Min" : 0, "Max" : 1}, "White" : {"Total" : 33548, "Min" : 8, "Max" :9}},
  {"County" : "Bertie" , "Asian" : { "Total" : 136, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 11803,"Min" : 7, "Max" : 8}, "Other" : {"Total" : 425, "Min" : 0, "Max" : 1}, "White" : {"Total" : 6641, "Min" : 4, "Max" :5}},
  {"County" : "Bladen" , "Asian" : { "Total" : 53, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 11520,"Min" : 4, "Max" : 5}, "Other" : {"Total" : 1535, "Min" : 0, "Max" : 1}, "White" : {"Total" : 19225, "Min" : 6, "Max" :7}},
  {"County" : "Brunswick" , "Asian" : { "Total" : 725, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 12919,"Min" : 1, "Max" : 2}, "Other" : {"Total" : 7670, "Min" : 0, "Max" : 1}, "White" : {"Total" : 115159, "Min" : 10, "Max" :11}},
  {"County" : "Buncombe" , "Asian" : { "Total" : 3268, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 15957,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 11670, "Min" : 0, "Max" : 1}, "White" : {"Total" : 227845, "Min" : 10, "Max" :11}},
  {"County" : "Burke" , "Asian" : { "Total" : 3343, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 5521,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 4708, "Min" : 0, "Max" : 1}, "White" : {"Total" : 75763, "Min" : 10, "Max" :11}},
  {"County" : "Cabarrus" , "Asian" : { "Total" : 8780, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 39530,"Min" : 2, "Max" : 3}, "Other" : {"Total" : 16279, "Min" : 0, "Max" : 1}, "White" : {"Total" : 146344, "Min" : 8, "Max" :9}},
  {"County" : "Caldwell" , "Asian" : { "Total" : 428, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 3509,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 5425, "Min" : 0, "Max" : 1}, "White" : {"Total" : 72500, "Min" : 10, "Max" :11}},
  {"County" : "Camden" , "Asian" : { "Total" : 195, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 1181,"Min" : 1, "Max" : 2}, "Other" : {"Total" : 533, "Min" : 0, "Max" : 1}, "White" : {"Total" : 8721, "Min" : 9, "Max" :10}},
  {"County" : "Carteret" , "Asian" : { "Total" : 786, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 3418,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 3170, "Min" : 0, "Max" : 1}, "White" : {"Total" : 61715, "Min" : 10, "Max" :11}},
  {"County" : "Caswell" , "Asian" : { "Total" : 204, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 7391,"Min" : 3, "Max" : 4}, "Other" : {"Total" : 727, "Min" : 0, "Max" : 1}, "White" : {"Total" : 14241, "Min" : 7, "Max" :8}},
  {"County" : "Catawba" , "Asian" : { "Total" : 7064, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 13148,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 13278, "Min" : 1, "Max" : 2}, "White" : {"Total" : 124385, "Min" : 9, "Max" :10}},
  {"County" : "Chatham" , "Asian" : { "Total" : 1182, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 8598,"Min" : 1, "Max" : 2}, "Other" : {"Total" : 5313, "Min" : 0, "Max" : 1}, "White" : {"Total" : 57630, "Min" : 9, "Max" :10}},
  {"County" : "Cherokee" , "Asian" : { "Total" : 219, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 365,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 907, "Min" : 0, "Max" : 1}, "White" : {"Total" : 26433, "Min" : 11, "Max" :12}},
  {"County" : "Chowan" , "Asian" : { "Total" : 68, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 4790,"Min" : 4, "Max" : 5}, "Other" : {"Total" : 609, "Min" : 0, "Max" : 1}, "White" : {"Total" : 8463, "Min" : 7, "Max" :8}},
  {"County" : "Clay" , "Asian" : { "Total" : 20, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 215,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 103, "Min" : 0, "Max" : 1}, "White" : {"Total" : 10754, "Min" : 11, "Max" :12}},
  {"County" : "Cleveland" , "Asian" : { "Total" : 985, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 20260,"Min" : 2, "Max" : 3}, "Other" : {"Total" : 3850, "Min" : 0, "Max" : 1}, "White" : {"Total" : 72430, "Min" : 8, "Max" :9}},
  {"County" : "Columbus" , "Asian" : { "Total" : 246, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 16519,"Min" : 3, "Max" : 4}, "Other" : {"Total" : 2160, "Min" : 0, "Max" : 1}, "White" : {"Total" : 34770, "Min" : 7, "Max" :8}},
  {"County" : "Craven" , "Asian" : { "Total" : 2982, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 21899,"Min" : 2, "Max" : 3}, "Other" : {"Total" : 5458, "Min" : 0, "Max" : 1}, "White" : {"Total" : 71278, "Min" : 8, "Max" :9}},
  {"County" : "Cumberland" , "Asian" : { "Total" : 8452, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 124500,"Min" : 4, "Max" : 5}, "Other" : {"Total" : 35022, "Min" : 1, "Max" : 2}, "White" : {"Total" : 162289, "Min" : 5, "Max" :6}},
  {"County" : "Currituck" , "Asian" : { "Total" : 111, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 1496,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 1249, "Min" : 0, "Max" : 1}, "White" : {"Total" : 24261, "Min" : 10, "Max" :11}},
  {"County" : "Dare" , "Asian" : { "Total" : 200, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 1223,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 1776, "Min" : 0, "Max" : 1}, "White" : {"Total" : 33445, "Min" : 10, "Max" :11}},
  {"County" : "Davidson" , "Asian" : { "Total" : 2572, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 15760,"Min" : 1, "Max" : 2}, "Other" : {"Total" : 7114, "Min" : 0, "Max" : 1}, "White" : {"Total" : 140969, "Min" : 10, "Max" :11}},
  {"County" : "Davie" , "Asian" : { "Total" : 295, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 2035,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 2244, "Min" : 0, "Max" : 1}, "White" : {"Total" : 37696, "Min" : 10, "Max" :11}},
  {"County" : "Duplin" , "Asian" : { "Total" : 187, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 13655,"Min" : 2, "Max" : 3}, "Other" : {"Total" : 4255, "Min" : 0, "Max" : 1}, "White" : {"Total" : 40646, "Min" : 8, "Max" :9}},
  {"County" : "Durham" , "Asian" : { "Total" : 15802, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 112965,"Min" : 4, "Max" : 5}, "Other" : {"Total" : 26460, "Min" : 1, "Max" : 2}, "White" : {"Total" : 161588, "Min" : 6, "Max" :7}},
  {"County" : "Edgecombe" , "Asian" : { "Total" : 84, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 29920,"Min" : 6, "Max" : 7}, "Other" : {"Total" : 1392, "Min" : 0, "Max" : 1}, "White" : {"Total" : 20497, "Min" : 4, "Max" :5}},
  {"County" : "Forsyth" , "Asian" : { "Total" : 9070, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 98741,"Min" : 3, "Max" : 4}, "Other" : {"Total" : 26572, "Min" : 0, "Max" : 1}, "White" : {"Total" : 242798, "Min" : 7, "Max" :8}},
  {"County" : "Franklin" , "Asian" : { "Total" : 311, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 16389,"Min" : 2, "Max" : 3}, "Other" : {"Total" : 5305, "Min" : 1, "Max" : 2}, "White" : {"Total" : 45378, "Min" : 8, "Max" :9}},
  {"County" : "Gaston" , "Asian" : { "Total" : 3764, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 36817,"Min" : 1, "Max" : 2}, "Other" : {"Total" : 12394, "Min" : 0, "Max" : 1}, "White" : {"Total" : 168479, "Min" : 9, "Max" :10}},
  {"County" : "Gates" , "Asian" : { "Total" : 178, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 3638,"Min" : 3, "Max" : 4}, "Other" : {"Total" : 350, "Min" : 0, "Max" : 1}, "White" : {"Total" : 7260, "Min" : 7, "Max" :8}},
  {"County" : "Graham" , "Asian" : { "Total" : 0, "Min" : 0,"Max" : 0},  "Black" : { "Total" : 16,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 278, "Min" : 1, "Max" : 2}, "White" : {"Total" : 7443, "Min" : 10, "Max" :11}},
  {"County" : "Granville" , "Asian" : { "Total" : 324, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 17635,"Min" : 3, "Max" : 4}, "Other" : {"Total" : 5545, "Min" : 1, "Max" : 2}, "White" : {"Total" : 36105, "Min" : 7, "Max" :8}},
  {"County" : "Greene" , "Asian" : { "Total" : 10, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 7087,"Min" : 4, "Max" : 5}, "Other" : {"Total" : 1826, "Min" : 1, "Max" : 2}, "White" : {"Total" : 11961, "Min" : 6, "Max" :7}},
  {"County" : "Guilford" , "Asian" : { "Total" : 27443, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 182467,"Min" : 4, "Max" : 5}, "Other" : {"Total" : 32437, "Min" : 0, "Max" : 1}, "White" : {"Total" : 288050, "Min" : 6, "Max" :7}},
  {"County" : "Halifax" , "Asian" : { "Total" : 367, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 26439,"Min" : 6, "Max" : 7}, "Other" : {"Total" : 2023, "Min" : 0, "Max" : 1}, "White" : {"Total" : 20078, "Min" : 4, "Max" :5}},
  {"County" : "Harnett" , "Asian" : { "Total" : 1810, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 28169,"Min" : 2, "Max" : 3}, "Other" : {"Total" : 13263, "Min" : 1, "Max" : 2}, "White" : {"Total" : 89770, "Min" : 8, "Max" :9}},
  {"County" : "Haywood" , "Asian" : { "Total" : 468, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 541,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 2045, "Min" : 0, "Max" : 1}, "White" : {"Total" : 58482, "Min" : 11, "Max" :12}},
  {"County" : "Henderson" , "Asian" : { "Total" : 1618, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 4168,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 4850, "Min" : 0, "Max" : 1}, "White" : {"Total" : 105339, "Min" : 10, "Max" :11}},
  {"County" : "Hertford" , "Asian" : { "Total" : 206, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 14295,"Min" : 7, "Max" : 8}, "Other" : {"Total" : 684, "Min" : 0, "Max" : 1}, "White" : {"Total" : 8255, "Min" : 4, "Max" :5}},
  {"County" : "Hoke" , "Asian" : { "Total" : 780, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 18320,"Min" : 4, "Max" : 5}, "Other" : {"Total" : 7233, "Min" : 2, "Max" : 3}, "White" : {"Total" : 24060, "Min" : 5, "Max" :6}},
  {"County" : "Hyde" , "Asian" : { "Total" : 0, "Min" : 0,"Max" : 0},  "Black" : { "Total" : 1501,"Min" : 3, "Max" : 4}, "Other" : {"Total" : 351, "Min" : 0, "Max" : 1}, "White" : {"Total" : 3231, "Min" : 7, "Max" :8}},
  {"County" : "Iredell" , "Asian" : { "Total" : 4365, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 21605,"Min" : 1, "Max" : 2}, "Other" : {"Total" : 9186, "Min" : 0, "Max" : 1}, "White" : {"Total" : 143147, "Min" : 9, "Max" :10}},
  {"County" : "Jackson" , "Asian" : { "Total" : 318, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 899,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 2934, "Min" : 1, "Max" : 2}, "White" : {"Total" : 36039, "Min" : 9, "Max" :10}},
  {"County" : "Johnston" , "Asian" : { "Total" : 1334, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 32889,"Min" : 1, "Max" : 2}, "Other" : {"Total" : 15825, "Min" : 0, "Max" : 1}, "White" : {"Total" : 152289, "Min" : 8, "Max" :9}},
  {"County" : "Jones" , "Asian" : { "Total" : 35, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 2790,"Min" : 3, "Max" : 4}, "Other" : {"Total" : 460, "Min" : 0, "Max" : 1}, "White" : {"Total" : 6079, "Min" : 7, "Max" :8}},
  {"County" : "Lee" , "Asian" : { "Total" : 896, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 11994,"Min" : 2, "Max" : 3}, "Other" : {"Total" : 3456, "Min" : 0, "Max" : 1}, "White" : {"Total" : 44316, "Min" : 8, "Max" :9}},
  {"County" : "Lenoir" , "Asian" : { "Total" : 195, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 21871,"Min" : 4, "Max" : 5}, "Other" : {"Total" : 4296, "Min" : 0, "Max" : 1}, "White" : {"Total" : 29875, "Min" : 6, "Max" :7}},
  {"County" : "Lincoln" , "Asian" : { "Total" : 702, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 4190,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 4490, "Min" : 0, "Max" : 1}, "White" : {"Total" : 75047, "Min" : 10, "Max" :11}},
  {"County" : "McDowell" , "Asian" : { "Total" : 465, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 1672,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 1970, "Min" : 0, "Max" : 1}, "White" : {"Total" : 41218, "Min" : 10, "Max" :11}},
  {"County" : "Macon" , "Asian" : { "Total" : 329, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 522,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 1351, "Min" : 0, "Max" : 1}, "White" : {"Total" : 32746, "Min" : 11, "Max" :12}},
  {"County" : "Madison" , "Asian" : { "Total" : 107, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 320,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 613, "Min" : 0, "Max" : 1}, "White" : {"Total" : 20496, "Min" : 11, "Max" :12}},
  {"County" : "Martin" , "Asian" : { "Total" : 145, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 9523,"Min" : 5, "Max" : 6}, "Other" : {"Total" : 777, "Min" : 0, "Max" : 1}, "White" : {"Total" : 12132, "Min" : 6, "Max" :7}},
  {"County" : "Mecklenburg" , "Asian" : { "Total" : 66376, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 346514,"Min" : 3, "Max" : 4}, "Other" : {"Total" : 110149, "Min" : 1, "Max" : 2}, "White" : {"Total" : 568313, "Min" : 6, "Max" :7}},
  {"County" : "Mitchell" , "Asian" : { "Total" : 28, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 21,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 511, "Min" : 0, "Max" : 1}, "White" : {"Total" : 14322, "Min" : 11, "Max" :12}},
  {"County" : "Montgomery" , "Asian" : { "Total" : 419, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 4729,"Min" : 2, "Max" : 3}, "Other" : {"Total" : 1380, "Min" : 0, "Max" : 1}, "White" : {"Total" : 20566, "Min" : 9, "Max" :10}},
  {"County" : "Moore" , "Asian" : { "Total" : 1358, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 10994,"Min" : 1, "Max" : 2}, "Other" : {"Total" : 5934, "Min" : 0, "Max" : 1}, "White" : {"Total" : 80195, "Min" : 9, "Max" :10}},
  {"County" : "Nash" , "Asian" : { "Total" : 858, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 38174,"Min" : 4, "Max" : 5}, "Other" : {"Total" : 6216, "Min" : 0, "Max" : 1}, "White" : {"Total" : 48456, "Min" : 6, "Max" :7}},
  {"County" : "New Hanover", "Asian" : { "Total" : 3145, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 30436,"Min" : 1, "Max" : 2}, "Other" : {"Total" : 10642, "Min" : 0, "Max" : 1}, "White" : {"Total" : 186681, "Min" : 9, "Max" :10}},
  {"County" : "Northampton" , "Asian" : { "Total" : 63, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 10903,"Min" : 6, "Max" : 7}, "Other" : {"Total" : 866, "Min" : 0, "Max" : 1}, "White" : {"Total" : 7740, "Min" : 4, "Max" :5}},
  {"County" : "Onslow" , "Asian" : { "Total" : 3958, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 28312,"Min" : 1, "Max" : 2}, "Other" : {"Total" : 18235, "Min" : 1, "Max" : 2}, "White" : {"Total" : 146790, "Min" : 8, "Max" :9}},
  {"County" : "Orange" , "Asian" : { "Total" : 11564, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 16364,"Min" : 1, "Max" : 2}, "Other" : {"Total" : 7593, "Min" : 0, "Max" : 1}, "White" : {"Total" : 110108, "Min" : 9, "Max" :10}},
  {"County" : "Pamlico" , "Asian" : { "Total" : 73, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 2355,"Min" : 2, "Max" : 3}, "Other" : {"Total" : 545, "Min" : 0, "Max" : 1}, "White" : {"Total" : 9671, "Min" : 9, "Max" :10}},
  {"County" : "Pasquotank" , "Asian" : { "Total" : 466, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 14334,"Min" : 4, "Max" : 5}, "Other" : {"Total" : 1979, "Min" : 0, "Max" : 1}, "White" : {"Total" : 22930, "Min" : 6, "Max" :7}},
  {"County" : "Pender" , "Asian" : { "Total" : 321, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 8791,"Min" : 1, "Max" : 2}, "Other" : {"Total" : 4711, "Min" : 0, "Max" : 1}, "White" : {"Total" : 47895, "Min" : 9, "Max" :10}},
  {"County" : "Perquimans" , "Asian" : { "Total" : 63, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 3203,"Min" : 2, "Max" : 3}, "Other" : {"Total" : 258, "Min" : 0, "Max" : 1}, "White" : {"Total" : 9962, "Min" : 8, "Max" :9}},
  {"County" : "Person" , "Asian" : { "Total" : 150, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 10075,"Min" : 3, "Max" : 4}, "Other" : {"Total" : 2568, "Min" : 0, "Max" : 1}, "White" : {"Total" : 26525, "Min" : 8, "Max" :9}},
  {"County" : "Pitt" , "Asian" : { "Total" : 3227, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 62752,"Min" : 4, "Max" : 5}, "Other" : {"Total" : 12229, "Min" : 0, "Max" : 1}, "White" : {"Total" : 101118, "Min" : 6, "Max" :7}},
  {"County" : "Polk" , "Asian" : { "Total" : 153, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 996,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 690, "Min" : 0, "Max" : 1}, "White" : {"Total" : 18768, "Min" : 10, "Max" :11}},
  {"County" : "Randolph" , "Asian" : { "Total" : 1763, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 8855,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 11772, "Min" : 1, "Max" : 2}, "White" : {"Total" : 120630, "Min" : 10, "Max" :11}},
  {"County" : "Richmond" , "Asian" : { "Total" : 458, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 14269,"Min" : 3, "Max" : 4}, "Other" : {"Total" : 1812, "Min" : 0, "Max" : 1}, "White" : {"Total" : 27065, "Min" : 7, "Max" :8}},
  {"County" : "Robeson" , "Asian" : { "Total" : 769, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 31370,"Min" : 2, "Max" : 3}, "Other" : {"Total" : 10712, "Min" : 5, "Max" : 6}, "White" : {"Total" : 35898, "Min" : 3, "Max" :4}},
  {"County" : "Rockingham" , "Asian" : { "Total" : 639, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 16580,"Min" : 2, "Max" : 3}, "Other" : {"Total" : 5205, "Min" : 0, "Max" : 1}, "White" : {"Total" : 68154, "Min" : 8, "Max" :9}},
  {"County" : "Rowan" , "Asian" : { "Total" : 1431, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 22737,"Min" : 1, "Max" : 2}, "Other" : {"Total" : 8578, "Min" : 0, "Max" : 1}, "White" : {"Total" : 107430, "Min" : 9, "Max" :10}},
  {"County" : "Rutherford" , "Asian" : { "Total" : 345, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 6138,"Min" : 1, "Max" : 2}, "Other" : {"Total" : 2873, "Min" : 0, "Max" : 1}, "White" : {"Total" : 57134, "Min" : 10, "Max" :11}},
  {"County" : "Sampson" , "Asian" : { "Total" : 370, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 16115,"Min" : 3, "Max" : 4}, "Other" : {"Total" : 7042, "Min" : 1, "Max" : 2}, "White" : {"Total" : 38439, "Min" : 7, "Max" :8}},
  {"County" : "Scotland" , "Asian" : { "Total" : 269, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 13542,"Min" : 4, "Max" : 5}, "Other" : {"Total" : 1824, "Min" : 2, "Max" : 3}, "White" : {"Total" : 15069, "Min" : 5, "Max" :6}},
  {"County" : "Stanly" , "Asian" : { "Total" : 1058, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 7206,"Min" : 1, "Max" : 2}, "Other" : {"Total" : 1832, "Min" : 0, "Max" : 1}, "White" : {"Total" : 51637, "Min" : 9, "Max" :10}},
  {"County" : "Stokes" , "Asian" : { "Total" : 175, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 1810,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 1069, "Min" : 0, "Max" : 1}, "White" : {"Total" : 42399, "Min" : 11, "Max" :12}},
  {"County" : "Surry" , "Asian" : { "Total" : 464, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 2703,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 4303, "Min" : 0, "Max" : 1}, "White" : {"Total" : 64195, "Min" : 10, "Max" :11}},
  {"County" : "Swain" , "Asian" : { "Total" : 64, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 95,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 567, "Min" : 4, "Max" : 5}, "White" : {"Total" : 9221, "Min" : 7, "Max" :8}},
  {"County" : "Transylvania" , "Asian" : { "Total" : 56, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 1454,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 1261, "Min" : 0, "Max" : 1}, "White" : {"Total" : 31138, "Min" : 10, "Max" :11}},
  {"County" : "Tyrrell" , "Asian" : { "Total" : 19, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 1422,"Min" : 4, "Max" : 5}, "Other" : {"Total" : 183, "Min" : 0, "Max" : 1}, "White" : {"Total" : 2330, "Min" : 7, "Max" :8}},
  {"County" : "Union" , "Asian" : { "Total" : 7804, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 27297,"Min" : 1, "Max" : 2}, "Other" : {"Total" : 12971, "Min" : 0, "Max" : 1}, "White" : {"Total" : 187121, "Min" : 9, "Max" :10}},
  {"County" : "Vance" , "Asian" : { "Total" : 375, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 21924,"Min" : 5, "Max" : 6}, "Other" : {"Total" : 3172, "Min" : 0, "Max" : 1}, "White" : {"Total" : 18644, "Min" : 5, "Max" :6}},
  {"County" : "Wake" , "Asian" : { "Total" : 80059, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 220232,"Min" : 2, "Max" : 3}, "Other" : {"Total" : 91332, "Min" : 1, "Max" : 2}, "White" : {"Total" : 696626, "Min" : 7, "Max" :8}},
  {"County" : "Warren" , "Asian" : { "Total" : 99, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 9913,"Min" : 6, "Max" : 7}, "Other" : {"Total" : 908, "Min" : 1, "Max" : 2}, "White" : {"Total" : 7707, "Min" : 4, "Max" :5}},
  {"County" : "Washington" , "Asian" : { "Total" : 35, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 5727,"Min" : 5, "Max" : 6}, "Other" : {"Total" : 557, "Min" : 0, "Max" : 1}, "White" : {"Total" : 5416, "Min" : 5, "Max" :6}},
  {"County" : "Watauga" , "Asian" : { "Total" : 649, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 958,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 1763, "Min" : 0, "Max" : 1}, "White" : {"Total" : 52021, "Min" : 11, "Max" :12}},
  {"County" : "Wayne" , "Asian" : { "Total" : 1473, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 37614,"Min" : 3, "Max" : 4}, "Other" : {"Total" : 7551, "Min" : 0, "Max" : 1}, "White" : {"Total" : 76823, "Min" : 7, "Max" :8}},
  {"County" : "Wilkes" , "Asian" : { "Total" : 406, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 2642,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 3373, "Min" : 0, "Max" : 1}, "White" : {"Total" : 61780, "Min" : 10, "Max" :11}},
  {"County" : "Wilson" , "Asian" : { "Total" : 516, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 32464,"Min" : 4, "Max" : 5}, "Other" : {"Total" : 7476, "Min" : 1, "Max" : 2}, "White" : {"Total" : 40722, "Min" : 5, "Max" :6}},
  {"County" : "Yadkin" , "Asian" : { "Total" : 38, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 1211,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 1879, "Min" : 0, "Max" : 1}, "White" : {"Total" : 34336, "Min" : 10, "Max" :11}},
  {"County" : "Yancey" , "Asian" : { "Total" : 53, "Min" : 0,"Max" : 1},  "Black" : { "Total" : 114,"Min" : 0, "Max" : 1}, "Other" : {"Total" : 600, "Min" : 0, "Max" : 1}, "White" : {"Total" : 17004, "Min" : 11, "Max" :12}}
];

changeData("Alamance");
changeMap("Alamance");