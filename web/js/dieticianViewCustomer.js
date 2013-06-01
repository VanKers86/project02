var customerId;
var dieticianId;
var cache = $('body');

$(function($) {
    customerId = Number($('input#customerId').attr('value'));
    dieticianId = Number($('input#dieticianId').attr('value'));
    
    $('div#consults div.consult:not(:first)').addClass('hidden').hide();
    
    $("#datepickerShowMeals").datepicker(
            {
                maxDate: +0,
                dateFormat: 'dd-mm-yy',
                altField: "input#showMeals",
                altFormat: 'yy-mm-dd',
                numberOfMonths: 1,
                dayNamesMin: ['Zon', 'Maa', 'Din', 'Woe', 'Don', 'Vri', 'Zat'],
                monthNames: [ "Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
                onSelect: function() {
                    getMealInfo();
                }
            }
    );    
        
    getMealInfo();    
    
    $('select#previousConsults').on('click', function(e) {
        e.stopPropagation();
    });
    
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

    var now = moment();

    $('div.consult').each(function(e) {
        var date = $(this).find('.consDateFormat').val();
        var dateMoment = moment(date, 'DD-MM-YYYY');
        $(this).find('span.consDate').append(' op ' + date);
        $(this).find('span.consDate').append(' (' + now.diff(dateMoment, 'days') + ' dagen geleden)');
    });
    
    $('div.subfield h2').on('click', function(e) {
        e.stopPropagation();
        if ($(this).parent().hasClass('shown')) {
            $(this).find('select#previousConsults').hide();
            $(this).parent().removeClass('shown');
            $(this).nextAll(":not(.hidden)").slideUp('normal', function() {
                $(this).parent().addClass('hidden');
                resizeHeader();
            });
        }
        else if ($(this).parent().hasClass('hidden')) {
            $(this).find('select#previousConsults').show();
            $(this).parent().removeClass('hidden');
            $(this).nextAll(":not(.hidden)").slideDown('normal', function() {
                $(this).parent().addClass('shown');
                resizeHeader();
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
    
    setChart('#chartBMI', 'bmi', customerId); 
    setChart('#chartWeight', 'weight', customerId);
    
    $('body').on('mouseover mouseout', 'span.val', function(e) {
        var classes = $(this).attr('class');
        var className = classes.split(' ');
        if (e.type === 'mouseover') {
            $('.' + className[0]).css('background-color', '#008FC5');
            $('.' + className[0]).css('color', '#FFF');
        }
        else {
            $('.' + className[0]).css('background-color', 'inherit');
            $('.' + className[0]).css('color', 'inherit');        
        }
    });
});

var getMealInfo = function() {
    var dateMeals = customerId + 'd' + dieticianId + $('input#showMeals').val();
    if (!cache.data(dateMeals)) {
        $.ajax ({
           url: '/api/dietist/klanten/' + customerId + '/maaltijden',
           type: 'POST',
           dataType: 'json',
           async: false,
           data: {date: $('input#showMeals').val() },
           success: function(data) {
               cache.data(dateMeals, data);
           }
        });
    }
    var data = cache.data(dateMeals);
    $('div#showMealsDate h3').html('Maaltijden op ' + moment($('input#showMeals').val()).format("DD-MM-YYYY"));
    $('div#showMealsDate ul').empty();
    if (!data) {
        $('div#showMealsDate ul').append('<li>Geen maaltijden toegevoegd</li>');
        $('div#meals div#chart').html('');

    }
    else {
        var topLi = '<li class="top">';
        topLi += '<span class="info">&nbsp;</span>';
        topLi += '<span class="lkcal energy tooltip val" title="Energie">&nbsp;</span>';
        topLi += '<span class="lcarbohydrates carbs tooltip val" title="Koolhydraten">&nbsp;</span>';
        topLi += '<span class="lsugars sugar tooltip val" title="Suikers">&nbsp;</span>';
        topLi += '<span class="lproteins protein tooltip val" title="Eiwitten">&nbsp;</span>';
        topLi += '<span class="lfats fat tooltip val" title="Vetten">&nbsp;</span>';
        topLi += '<span class="lcholesterol cholesterol tooltip val" title="Cholesterol">&nbsp;</span>';
        topLi += '<span class="lfibres fibre tooltip val" title="Vezels">&nbsp;</span>';
        topLi += '<span class="lsodium salt tooltip val" title="Natrium">&nbsp;</span>';        
        topLi += '</li>';
        $('div#showMealsDate ul').append(topLi);
        $.each(data.meals, function(i, meal) {
            var mealLi = '<li class="type">';
            mealLi += '<span class="info">' + meal.type + '</span>';
            mealLi += '<span class="lkcal val">' + meal.total.kcal + '</span>';
            mealLi += '<span class="lcarbohydrates val">' + meal.total.carbohydrates + '</span>';
            mealLi += '<span class="lsugars val">' + meal.total.sugars + '</span>';
            mealLi += '<span class="lproteins val">' + meal.total.proteins + '</span>';
            mealLi += '<span class="lfats val">' + meal.total.fats + '</span>';
            mealLi += '<span class="lcholesterol val">' + meal.total.cholesterol + '</span>';
            mealLi += '<span class="lfibres val">' + meal.total.fibres + '</span>';
            mealLi += '<span class="lsodium val">' + meal.total.sodium + '</span>';
            mealLi += '</li>';
            $('div#showMealsDate ul').append(mealLi);
            $.each(meal.food, function(i, food) {
                var foodLi = '<li class="food"><span class="info">' + food.quantity;
                if (food.foodcategory === "Dranken") {
                    foodLi += 'cl ';   
                }
                else {
                    foodLi += 'gr ';    
                }
                
                foodLi += food.foodname + '</span>';
                foodLi += '<span class="lkcal val">' + food.kcal + '</span>';
                foodLi += '<span class="lcarbohydrates val">' + food.carbohydrates + '</span>';
                foodLi += '<span class="lsugars val">' + food.sugars + '</span>';
                foodLi += '<span class="lproteins val">' + food.proteins + '</span>';
                foodLi += '<span class="lfats val">' + food.fats + '</span>';
                foodLi += '<span class="lcholesterol val">' + food.cholesterol + '</span>';
                foodLi += '<span class="lfibres val">' + food.fibres + '</span>';
                foodLi += '<span class="lsodium val">' + food.sodium + '</span>';
                foodLi += '</li>';
                
                $('div#showMealsDate ul').append(foodLi); 
            });
           
        });
        var totals = data.total;
        var totalLi = '<li class="total">';
        totalLi += '<span class="info">Totaal</span>';
        totalLi += '<span class="lkcal val">' + totals.kcal + '<br />kcal</span>';
        totalLi += '<span class="lcarbohydrates val">' + totals.carbohydrates + '<br />g</span>';
        totalLi += '<span class="lsugars val">' + totals.sugars + '<br />g</span>';
        totalLi += '<span class="lproteins val">' + totals.proteins + '<br />g</span>';
        totalLi += '<span class="lfats val">' + totals.fats + '<br />g</span>';
        totalLi += '<span class="lcholesterol val">' + totals.cholesterol + '<br />g</span>';
        totalLi += '<span class="lfibres val">' + totals.fibres + '<br />mg</span>';
        totalLi += '<span class="lsodium val">' + totals.sodium + '<br />mg</span>';
        totalLi += '</li>';
        $('div#showMealsDate ul').append(totalLi);
        $('div#meals div#chart').html('<div id="chartMeals" class="chart"></div>');
        setMealsChart(data);

    }
    
    resizeHeader();
};

var setMealsChart = function(data) {

    var meals = [];
    $.each(data.meals, function(i, meal) {
        var mealObject = {};
        var pKcal = Math.round(meal.total.kcal / data.max.kcal * 10000) / 100;
        var pCarbo = Math.round(meal.total.carbohydrates / data.max.carbohydrates * 10000) / 100;
        var pSugars = Math.round(meal.total.sugars / data.max.sugars * 10000) / 100;
        var pProteins = Math.round(meal.total.proteins / data.max.proteins * 10000) / 100;
        var pFats = Math.round(meal.total.fats / data.max.fats * 10000) / 100;
//        var pCholesterol = Math.round(meal.total.cholesterol / data.max.cholesterol * 100);
//        var pFibres = Math.round(meal.total.fibres / data.max.fibres * 100);
//        var pSodium = Math.round(meal.total.sodium / data.max.sodium * 100);
        mealObject['name'] = meal.type;
        mealObject['data'] = [pKcal, pCarbo, pSugars, pProteins, pFats];
        meals[i] = mealObject;
    });
    var maxObject = {};
    maxObject['name'] = 'GDA';
    maxObject['data'] = [data.max.kcal, data.max.carbohydrates, data.max.sugars, data.max.proteins, data.max.fats];

    
    $('#chartMeals').highcharts({
        chart: {
            type: 'bar',
            backgroundColor: 'rgba(255, 255, 255, 0.0)',
            zoomType: 'xy'            
        },
        title: {
            text: null
        },
        xAxis: {
            categories: ['Energie', 'Koolhydraten', 'Suikers', 'Eiwitten', 'Vetten']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Percentage van GDA (%)'
            }
,

            plotLines: [{
                value: 100,
                color: '#FF0000',
                width: 3,
                zIndex: 5
            }],
            minRange: 100,
            tickInterval: 20
        },
        legend: {
            backgroundColor: '#FFFFFF',
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: meals,
        tooltip: {
            formatter: function() {
                var s = '<b>'+ this.x + '</b>';
                var total = 0;
                var maxT;
                var gda;
                $.each(this.points, function(i, point) {
                    s += '<br/>' + point.series.name +': ' + point.y + '%';
                    total += point.y;
                });
                if (this.x === 'Energie') {
                    maxT = Math.round(total / 100 * data.max.kcal * 10) / 10 + 'kcal';
                    gda = data.max.kcal + 'kcal';
                }
                else if (this.x === 'Koolhydraten') {
                    maxT = Math.round(total / 100 * data.max.carbohydrates * 10) / 10 + 'g';
                    gda = data.max.carbohydrates + 'g';
                }
                else if (this.x === 'Suikers') {
                    maxT = Math.round(total / 100 * data.max.sugars * 10) / 10 + 'g';
                    gda = data.max.sugars + 'g';
                }
                else if (this.x === 'Eiwitten') {
                    maxT = Math.round(total / 100 * data.max.proteins * 10) / 10 + 'g';
                    gda = data.max.proteins + 'g';
                }
                else if (this.x === 'Vetten') {
                    maxT = Math.round(total / 100 * data.max.fats * 10) / 10 + 'g';
                    gda = data.max.fats + 'g';
                }
                s += '<br /><b>Totaal: ' + Math.round(total * 100) / 100 + '% = ' + maxT + '</b>';
                s += '<br /><b>GDA: 100% = ' + gda + '</b>';
                
                return s;
            },
            shared: true
        }     
    });
};