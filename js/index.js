'use strict';


let tempData = d3.csv("data/tempData.csv")
    .then( function(response) {
        let dataPromise = response.json();
        return dataPromise;
    })
    .then(function(data) {
        console.log(data);
    });

console.log(tempData);