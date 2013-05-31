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
        console.log(date);
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
    }
    resizeHeader();
};