'use strict';

let countries = [];
let countryLocations = [];
d3.csv('/data/countriesLocation.csv').then(function(data) {
    for(let country of data) {
        countryLocations.push(country);
    }
})

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

let updateGraph = function updateGraph(data, yearFrom, yearTo, country) {
    let chosenCountryTemp = '';
    let chosenCountryYear = '';

    for(let i = 0; i < data.length; i++) {
        let temp = data[i].AverageTemperature;
        let year = data[i].dt;
        if(data[i].dt === (yearFrom) && data[i].Country === country) {
            chosenCountryTemp += temp + ',';
            chosenCountryYear += year + ',';
        }
        if(data[i].dt > (yearFrom) && data[i].dt <= (yearTo) && data[i].Country === country) {
            chosenCountryTemp += ',' + temp;
            chosenCountryYear += ',' + year;
        }
    }
    let chosenCountryTempArr = chosenCountryTemp.split(',').map(Number);
    let chosenCountryYearArr = chosenCountryYear.split(',').map(Number);
    new Chart('chart', {
        type: 'line',
        data: {
            labels: chosenCountryYearArr,
            datasets: [
                {
                    label: 'Temp Changes Comparing to Global Mean',
                    fill: false,
                    backgroundColor: 'rgba(-17, 10, 12, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    data: chosenCountryTempArr
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(value) {
                            return value + '°';
                        }
                    }
                }]
            }
        }
    });
}

let renderChart = function renderChart() {
    d3.csv('/data/TempDataOnlyYears.csv').then(function(data) {
        addCountries();
        let yearFrom = document.querySelector("#yearFrom");
        let yearTo = document.querySelector("#yearTo");
        let country = document.querySelector("#country");
        let graphBtn = document.querySelector("#updGraph");
        updateGraph(data, 1900, 2013, country.value);
        graphBtn.addEventListener("click",function() {
            if(yearFrom.value === '' || yearFrom.value < 1900 || yearFrom.value > 2012 || yearFrom.value >= yearTo.value) {
                yearFrom.value = 1900;
            }
            if(yearTo.value === '' || yearTo.value > 2013 || yearTo.value < 1901) {
                yearTo.value = 2013;
            }
            updateGraph(data, yearFrom.value, yearTo.value, country.value);
        })
    });
    
}

renderChart();