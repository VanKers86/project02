$(function($) {
    $('div#consults div.consult:not(:first)').addClass('hidden').hide();
    
    $('select#previousConsults').on('change', function(e) {
        var val = $(this).val();
        $('div#consults div.consult').addClass("hidden").slideUp('normal', function() {
            if ($(window).width() > 750 && $('header#small').height() < $('section#console').height()) {
                $('header#small').height($('section#console').height());
            }  
        });
//$('div#consults div.consult').addClass("hidden").hide();
        $('div#consults div#' + val).removeClass('hidden').slideDown('normal', function() {
            if ($(window).width() > 750 && $('header#small').height() < $('section#console').height()) {
                $('header#small').height($('section#console').height());
            }  
        }); 
//$('div#consults div#' + val).removeClass('hidden').show();
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
    
 $('#chartBMI').highcharts({
            chart: {
                type: 'line',
                backgroundColor: 'rgba(255, 255, 255, 0.0)'          
            },
            title: {
                text: 'BMI Progressie'
            },
            xAxis: {
                tickInterval: 1,
                min: 1,
                title: {
                    text: 'Consultatie'
                }
            },
            yAxis: {
                title: {
                    text: 'BMI Waarde'
                },
                tickInterval: 5,
                min: 15,
                max: 40,
                minorGridLineWidth: 0,
                gridLineWidth: 0,
                alternateGridColor: null,
                plotBands: [{
                    from: 15,
                    to: 18.4,
                    color: 'rgba(255, 204, 0, 0.5)',
                    label: {
                        text: 'Ondergewicht',
                        style: {
                            color: '#FFF'
                        }
                    }
                }, {
                    from: 18.5,
                    to: 25,
                    color: 'rgba(0, 153, 0, 0.5)',
                    label: {
                        text: 'Gezond gewicht',
                        style: {
                            color: '#FFF'
                        }
                    }
                }, {
                    from: 25,
                    to: 30,
                    color: 'rgba(255, 165, 0, 0.5)',
                    label: {
                        text: 'Overgewicht',
                        style: {
                            color: '#FFF'
                        }
                    }
                }, {
                    from: 30,
                    to: 35,
                    color: 'rgba(193, 0, 21, 0.5)',
                    label: {
                        text: 'Obesitas',
                        style: {
                            color: '#FFF'
                        }
                    }
                }, {
                    from: 35,
                    to: 40,
                    color: 'rgba(136, 0, 17, 0.5)',
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
                    color: '#008FC5',
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
                headerFormat: '<b>Consultatie {point.x}</b><br />',
                pointFormat: 'BMI {point.y}'
            },
            series: [{
                name: 'BMI',
                data: bmiArray
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