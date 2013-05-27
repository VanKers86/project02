var bmiProgression = [];
var customerId;
var minBMI = 100;
var maxBMI = 0;

$(function($) {
    var href = $(this).context.URL;
    customerId = href.substr(href.lastIndexOf('/') + 1);
    
    $('div#consults div.consult:not(:first)').addClass('hidden').hide();
    
    $('select#previousConsults').on('change', function(e) {
        var val = $(this).val();
        $('div#consults div.consult').addClass("hidden").slideUp('normal', function() {
            if ($(window).width() > 750 && $('header#small').height() < $('section#console').height()) {
                $('header#small').height($('section#console').height());
            }  
        });
        $('div#consults div#' + val).removeClass('hidden').slideDown('normal', function() {
            if ($(window).width() > 750 && $('header#small').height() < $('section#console').height()) {
                $('header#small').height($('section#console').height());
            }  
        }); 
    });
    
    $('div.subfield h2').on('click', function(e) {
        if ($(this).parent().hasClass('shown')) {
            $(this).parent().removeClass('shown');
            $(this).nextAll(":not(.hidden)").slideUp('normal', function() {
                $(this).parent().addClass('hidden');
            });
        }
        else if ($(this).parent().hasClass('hidden')) {
            $(this).parent().removeClass('hidden');
            $(this).nextAll(":not(.hidden)").slideDown('normal', function() {
                $(this).parent().addClass('shown');
            });
        }
    });
    
    $('div#deleteCustomer a').on('click', function(e) {
       e.preventDefault();
       $(this).hide();
       $('form#deleteConfirmation').show();
    });
    
    $('input#deleteAnnulation').on('click', function(e) {
       e.preventDefault();
       $(this).parent().hide();
       $(this).parent().parent().find('a').show();
    });
    
    var bmiArray = [];
    $('ul.consult li.bmi span.bmiSpan').each(function (index) {
        bmiArray.push(Number($(this).text()));  
    });
    
    bmiArray.reverse();
    bmiArray.insert(0, 0);
    
    $('select#previousConsults span.consDate').each(function (index) {
        var split = $(this).text().split('/');
        console.log(split);
        var date = new Date(split[2], split[1], split[0]);
        console.log(date);
    });
    

    $.ajax ({
       url: '/api/klanten/' + customerId + '/bmi',
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
    
    console.log(maxBMI);
    console.log(minBMI);

    Highcharts.setOptions({
	lang: {
            months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 
                    'juli', 'augustus', 'september', 'oktober', 'november', 'december']
	}
    });
    
    $('#chartBMI').highcharts({
        chart: {
            type: 'spline',
            backgroundColor: 'rgba(255, 255, 255, 0.0)'          
        },
        title: {
            text: 'BMI Progressie'
        },
        xAxis: {
            type: 'datetime',

            title: {
                text: 'Consultatie'
            }
        },
        yAxis: {
            title: {
                text: 'BMI Waarde'
            },
            tickInterval: 1,
            min: minBMI - 5,
            max: maxBMI + 5,
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
        },
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
                    return '<b>Consultatie ' + Highcharts.dateFormat('%e %B %Y', this.x) + '</b><br/>' +
                    'BMI: '+ this.y;
            }
        },
        series: [{
            name: 'BMI',
            data: bmiProgression
        }]
        ,
        navigation: {
            menuItemStyle: {
                fontSize: '1em'
            }
        },
         legend: {
             enabled: false
        }
    });

});

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};