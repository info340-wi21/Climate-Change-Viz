'use strict';


let renderMap = function renderMap(year1, year2, country) {
    d3.csv("data/tempData.csv").then(function(data) {
        printData(data);
    });
}

function printData(data) {
    console.log(data);
}

renderMap();