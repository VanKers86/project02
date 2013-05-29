var bmiProgression = [];
var minBMI = 100;
var maxBMI = 0;
var weightProgression = [];
var minWeight = 500;
var maxWeight = 0;
var containerChart;
var customerIdChart;

Highcharts.setOptions({
    lang: {
        months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 
                'juli', 'augustus', 'september', 'oktober', 'november', 'december']
    }
});


var setChart = function(container, value, customerId) {
    containerChart = container;
    customerIdChart = customerId;
    if (value === 'bmi') {
        setBmiChart();
    }
    if (value === 'weight') {
        setWeightChart();
    }
};

var setWeightChart = function() {
    if (weightProgression.length === 0) {
        $.ajax ({
           url: '/api/klanten/' + customerIdChart + '/gewicht',
           type: 'POST',
           dataType: 'json',
           async: false,
           success: function(data) {
               $.each(data, function(i, item) {
                   var dateTime = item['date'].split(/[- :]/);
                   var date = Date.UTC(dateTime[0], dateTime[1] - 1, dateTime[2]);
                   var weight = Number(item['weight']);
                   weightProgression[i] = (new Array(date, weight));
                   if (maxWeight < weight) {
                       maxWeight = weight;
                   }
                   if (minWeight > weight) {
                       minWeight = weight;
                   }               
               });
           }
        });  
    }
    
    $(containerChart).highcharts({
        chart: {
            type: 'spline',
            backgroundColor: 'rgba(255, 255, 255, 0.0)',
             zoomType: 'xy'
        },
        title: {
            text: 'Gewicht Progressie'
        },
        xAxis: {
            type: 'datetime',

            title: {
                text: null
            }
        },
        yAxis: [ {
            title: {
                text: null
            },
            style: {
                color: '#333'
            },
            tickInterval: 5,
            min: minWeight - 10,
            max: maxWeight + 10,
            minorGridLineWidth: 1,
            gridLineWidth: 1
        }],
        plotOptions: {
            spline: {
                lineWidth: 4,
                color: 'rgba(0, 143, 197, 1)',
                states: {
                    hover: {
                        lineWidth: 4
                    }
                },
                marker: {
                    enabled: true
                }
            }
        },
        tooltip: {
            formatter: function() {
                var s = '<b>Consultatie '+ Highcharts.dateFormat('%e %B %Y', this.x) + '</b>';
                s += '<br/>Gewicht: ' + this.y + 'kg';
                
                return s;
            }
        },
        series: [ {
            name: 'Gewicht',
            data: weightProgression,
            zIndex: 2,
            marker: {
                fillColor: '#FFF',
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[0]
            },
            type: 'spline'
        }],
        navigation: {
            menuItemStyle: {
                fontSize: '1em'
            }
        },
         legend: {
             enabled: false
        }
    });
};

var setBmiChart = function() {
     $.ajax ({
       url: '/api/klanten/' + customerIdChart + '/bmi',
       type: 'POST',
       dataType: 'json',
       async: false,
       success: function(data) {
           $.each(data, function(i, item) {
               var dateTime = item['date'].split(/[- :]/);
               var date = Date.UTC(dateTime[0], dateTime[1] - 1, dateTime[2]);
               var bmi = Number(item['bmi']);
               bmiProgression[i] = (new Array(date, bmi));
               if (maxBMI < bmi) {
                   maxBMI = bmi;
               }
               if (minBMI > bmi) {
                   minBMI = bmi;
               }
           });
       }
    });
    
    
    $.ajax ({
       url: '/api/klanten/' + customerIdChart + '/gewicht',
       type: 'POST',
       dataType: 'json',
       async: false,
       success: function(data) {
           $.each(data, function(i, item) {
               var dateTime = item['date'].split(/[- :]/);
               var date = Date.UTC(dateTime[0], dateTime[1] - 1, dateTime[2]);
               var weight = Number(item['weight']);
               weightProgression[i] = (new Array(date, weight));
               if (maxWeight < weight) {
                   maxWeight = weight;
               }
               if (minWeight > weight) {
                   minWeight = weight;
               }               
           });
       }
    });   
    
    $(containerChart).highcharts({
        chart: {
            type: 'spline',
            backgroundColor: 'rgba(255, 255, 255, 0.0)',
             zoomType: 'xy'
        },
        title: {
            text: 'BMI Progressie'
        },
        xAxis: {
            type: 'datetime',

            title: {
                text: null
            }
        },
        yAxis: [ {
            title: {
                text: null
            },
            style: {
                color: '#333'
            },
            tickInterval: 2,
            min: minBMI - 3,
            max: maxBMI + 3,
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: null,
            plotBands: [{
                from: 15,
                to: 18.5,
                color: 'rgba(255, 204, 0, 0.6)',
                label: {
                    text: 'Ondergewicht',
                    style: {
                        color: '#FFF'
                    }
                }
            }, {
                from: 18.5,
                to: 25,
                color: 'rgba(0, 153, 0, 0.6)',
                label: {
                    text: 'Gezond gewicht',
                    style: {
                        color: '#FFF'
                    }
                }
            }, {
                from: 25,
                to: 30,
                color: 'rgba(255, 165, 0, 0.6)',
                label: {
                    text: 'Overgewicht',
                    style: {
                        color: '#FFF'
                    }
                }
            }, {
                from: 30,
                to: 35,
                color: 'rgba(193, 0, 21, 0.6)',
                label: {
                    text: 'Obesitas',
                    style: {
                        color: '#FFF'
                    }
                }
            }, {
                from: 35,
                to: 40,
                color: 'rgba(136, 0, 17, 0.6)',
                label: {
                    text: 'Extreme obesitas',
                    style: {
                        color: '#FFF'
                    }
                }
            }]
        }],
        plotOptions: {
            spline: {
                lineWidth: 4,
                color: 'rgba(0, 143, 197, 1)',
                states: {
                    hover: {
                        lineWidth: 4
                    }
                },
                marker: {
                    enabled: true
                }
            }
        },
        tooltip: {
            formatter: function() {
                var s = '<b>Consultatie '+ Highcharts.dateFormat('%e %B %Y', this.x) + '</b>';
                $.each(this.points, function(i, point) {
                    s += '<br/>' + point.series.name +': ';
                    if (point.series.name === 'BMI') {
                        s += point.y;
                    }
                    else if (point.series.name === 'Gewicht') {
                        s += point.y + 'kg';
                    }
                });
                
                return s;
            },
            shared: true
        },
        series: [ {
            name: 'BMI',
            data: bmiProgression,
            zIndex: 2,
            marker: {
                fillColor: '#FFF',
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[0]
            },
            type: 'spline'
        }, {
            name: 'Gewicht',
            data: weightProgression
        }],
        navigation: {
            menuItemStyle: {
                fontSize: '1em'
            }
        },
         legend: {
             enabled: false
        }
    });
};