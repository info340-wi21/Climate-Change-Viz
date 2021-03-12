'use strict';

let map = L.map('mapid').setView([0, 0], 2);
let markerGroup = L.layerGroup().addTo(map);
let countries = [];
let countryLocations = [];
d3.csv('/data/countriesLocation.csv').then(function(data) {
    for(let country of data) {
        countryLocations.push(country);
    }
})

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
    minZoom: 2,
    maxZoom: 6,
    attribution: '&copy; <a href="https://carto.com/">carto.com</a> contributors'
}).addTo(map);

let addCountries = function addCountries() {
    let selectCountryElem = document.querySelector("#country");
    for(let i = 0; i < countryLocations.length; i++) {
        let optionElem = document.createElement("option");
        optionElem.value = countryLocations[i].name;
        optionElem.innerHTML = countryLocations[i].name;
        countries.push(countryLocations[i].name);
        selectCountryElem.appendChild(optionElem);
    }
}

let getDiff = function getDiff(data, yearFrom, yearTo, country) {
    //GET TEMP DIFF BETWEEN YEARS
    let tempYearFrom = 0;
    let tempYearTo = 0;
    for(let i = 0; i < data.length; i++) {
        if(data[i].dt === (yearFrom + "-01-01") && data[i].Country === country) {
            tempYearFrom = data[i].AverageTemperature;
        } else if(data[i].dt === (yearTo + "-01-01") && data[i].Country === country) {
            tempYearTo = data[i].AverageTemperature;
        }
    }
    let diff = tempYearTo - tempYearFrom;
    return diff.toFixed(2)
}

let updateMap = function updateMap(data, yearFrom, yearTo, country) {
    markerGroup.clearLayers()
    let marker;
    for(let i = 0; i < countries.length; i++) {
        let diff = getDiff(data, yearFrom, yearTo, countries[i]);
        if(countries[i] === country) {
            marker = L.marker(getLocation(countries[i])).addTo(markerGroup)
                .bindPopup('Temp difference for ' + countries[i] + ' from ' + yearFrom + '->' + yearTo + ': ' + diff + '\u00B0F')
        } else {
            L.marker(getLocation(countries[i])).addTo(markerGroup)
                .bindPopup('Temp difference for ' + countries[i] + ' from ' + yearFrom + '->' + yearTo + ': ' + diff + '\u00B0F')
        }
    }
    if(country !== 'World') {
        marker.openPopup();
    }
}

function getLocation(country) {
    let location = [];
    for(let data of countryLocations) {
        if(data.name === country) {
            location[0] = data.latitude;
            location[1] = data.longitude;
            return location;
        }
    }
}

let renderMap = function renderMap() {
    d3.csv("data/tempData.csv").then(function(data) {
        addCountries();

        let yearFrom = document.querySelector("#yearFrom");
        let yearTo = document.querySelector("#yearTo");
        let country = document.querySelector("#country");
        let updateBtn = document.querySelector("button");
        updateMap(data, 1900, 2013, country.value);

        updateBtn.addEventListener("click", function() {
            if(yearFrom.value === '' || yearFrom.value < 1900 || yearFrom.value > 2012 || yearFrom.value >= yearTo.value) {
                yearFrom.value = 1900;
            }
            if(yearTo.value === '' || yearTo.value > 2013 || yearTo.value < 1901) {
                yearTo.value = 2013;
            }
            updateMap(data, yearFrom.value, yearTo.value, country.value);
        })
    });
}

renderMap();