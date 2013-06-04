var customerId;
var dieticianId;
var cache = $('body');
var unseen;
var unseenMessages;

$(function($) {
    customerId = Number($('input#customerId').attr('value'));
    dieticianId = Number($('input#dieticianId').attr('value'));

    getUnseenDates();

    
    //Check if this customer has unseen messages
    $.ajax ({
       url: '/secure/dietist/klanten/' + customerId + '/bericht/nieuw',
       type: 'GET',
       dataType: 'json',
       async: true,
       success: function(data) {
           if (data) {
               $('h2#communicationLink').css('border-bottom', '0.4em solid #71D01C');
               unseenMessages = true;
           }
       }
    });

    $('div#menuCustomer h2').each(function () {
       var menuLink = $(this).attr('id');
       var menuDiv = menuLink.split('Link')[0];
       if (!$(this).hasClass('active')) {
           $('div#consoleContent').find('div#' + menuDiv).hide();
       };
    });
    
    $('div#menuCustomer h2').on('click', function(e) {
        if (!$(this).hasClass('active')) {
            var activeMenu = $('div#menuCustomer h2.active').attr('id');
            var activeDiv = activeMenu.split('Link')[0];
            $('div#menuCustomer h2.active').removeClass('active');
            $('div#consoleContent div#' + activeDiv).hide();
            $(this).addClass('active');
            var menuLink = $(this).attr('id');
            var menuDiv = menuLink.split('Link')[0];            
            $('div#consoleContent').find('div#' + menuDiv).show();
            resizeHeader();
            $(window).resize();
        }
    });
    
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
    
    $('body').on('change', 'select#drpUnseenData', function(e) {
       if ($(this).val() !== '-1') {
           $('#datepickerShowMeals').datepicker('setDate', $(this).val());
           getMealInfo();
           $(this).find(':selected').remove();           
           var count = $(this).children('option').length;
           $('span#countDates').html(count - 1);
           if (count === 1) {
                $('div#unseenData').html('<p>U heeft alle maaltijden van deze klant bekeken.</p>');
           }
       }
    });
    
    $('a#addMessage').on('click', function(e) {
        e.preventDefault();
        var text = $('textarea#sendMessage').val();
        if (text === "") {
            $('div.top p.empty').show();
        }
        else {
            var now = moment();
            $('div.top p.empty').hide();
            var newComm = '<div class="comm fromMe">';
            newComm += '<p class="time">' + now.format("DD-MM-YYYY HH:mm") + '</p>';
            newComm += '<p class="text"><img align="left" src="/img/userfiles/dietician/' + dieticianId + 'profilepicture.jpg">';
            newComm += text + '</p></div>';
            $('div#commHistory').prepend(newComm);
            resizeHeader();
            $.ajax ({
               url: '/secure/dietist/klanten/' + customerId + '/bericht',
               type: 'POST',
               dataType: 'json',
               async: true,
               data: {msg: text }
            });
            $('textarea#sendMessage').val('');
        }
    });
    
    //Update unseen 
    $('h2#communicationLink').on('click', function(e) {
        if (unseenMessages) {
            $(this).css('border-bottom', '0');
            $.ajax ({
               url: '/secure/dietist/klanten/' + customerId + '/bericht/update',
               type: 'POST',
               dataType: 'json',
               async: true
            });        
        }
    });
    
});

var getMealInfo = function() {
    var dateMeals = customerId + 'd' + dieticianId + $('input#showMeals').val();
    if (!cache.data(dateMeals)) {
        $.ajax ({
           url: '/secure/dietist/klanten/' + customerId + '/maaltijden',
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
    $('div#adhperc ul').empty();
    if (!data) {
        $('div#showMealsDate ul').append('<li>Geen maaltijden toegevoegd</li>');
        $('div#meals div#chart').html('');
    }
    else {
        var topLi = '<li class="top">';
        topLi += '<span class="info">&nbsp;</span>';
        topLi += '<span class="lkcal energy tooltip val" title="Energie">En</span>';
        topLi += '<span class="lproteins protein tooltip val" title="Eiwitten">Ew</span>';
        topLi += '<span class="lfats fat tooltip val" title="Vetten">Vet</span>';
        topLi += '<span class="lcarbohydrates carbs tooltip val" title="Koolhydraten">Kh</span>';
        topLi += '<span class="lsugars sugar tooltip val" title="Suikers">Skr</span>';        
        topLi += '<span class="lcholesterol cholesterol tooltip val" title="Cholesterol">Chol</span>';
        topLi += '<span class="lfibres fibre tooltip val" title="Vezels">Vez</span>';
        topLi += '<span class="lsodium salt tooltip val" title="Natrium">Na</span>';        
        topLi += '</li>';
        $('div#showMealsDate ul').append(topLi);
        $.each(data.meals, function(i, meal) {
            var mealLi = '<li class="type">';
            mealLi += '<span class="info">' + meal.type + '</span>';
            mealLi += '<span class="lkcal val">' + meal.total.kcal + '</span>';
            mealLi += '<span class="lproteins val">' + meal.total.proteins + '</span>';
            mealLi += '<span class="lfats val">' + meal.total.fats + '</span>';
            mealLi += '<span class="lcarbohydrates val">' + meal.total.carbohydrates + '</span>';
            mealLi += '<span class="lsugars val">' + meal.total.sugars + '</span>';            
            mealLi += '<span class="lcholesterol val">' + meal.total.cholesterol + '</span>';
            mealLi += '<span class="lfibres val">' + meal.total.fibres + '</span>';
            mealLi += '<span class="lsodium val">' + meal.total.sodium + '</span>';
            mealLi += '</li>';
            $('div#showMealsDate ul').append(mealLi);
            $.each(meal.food, function(i, food) {
                var foodLi = '<li class="food"><span class="info">' + food.quantity;
                if (food.foodcategory === "Dranken") {
                    foodLi += 'ml ';   
                }
                else {
                    foodLi += 'gr ';    
                }
                
                foodLi += food.foodname + '</span>';
                foodLi += '<span class="lkcal val">' + food.kcal + '</span>';
                foodLi += '<span class="lproteins val">' + food.proteins + '</span>';
                foodLi += '<span class="lfats val">' + food.fats + '</span>';
                foodLi += '<span class="lcarbohydrates val">' + food.carbohydrates + '</span>';
                foodLi += '<span class="lsugars val">' + food.sugars + '</span>';
                foodLi += '<span class="lcholesterol val">' + food.cholesterol + '</span>';
                foodLi += '<span class="lfibres val">' + food.fibres + '</span>';
                foodLi += '<span class="lsodium val">' + food.sodium + '</span>';
                foodLi += '</li>';
                
                $('div#showMealsDate ul').append(foodLi); 
            });
           
        });
        var totals = data.total;
        var totalLi = '<li class="total">';
        totalLi += '<span class="info">Totaal<br />Totaal in kcal</span>';
        totalLi += '<span class="lkcal val"><br />' + totals.kcal + '</span>';
        totalLi += '<span class="lproteins val">' + totals.proteins + 'g<br/>' + totals.proteins * 4 + '</span>';
        totalLi += '<span class="lfats val">' + totals.fats + 'g<br/>' + totals.fats * 9 + '</span>';
        totalLi += '<span class="lcarbohydrates val">' + totals.carbohydrates + 'g<br/>' + totals.carbohydrates * 4 + '</span>';
        totalLi += '<span class="lsugars val">' + totals.sugars + 'g<br/>&nbsp;</span>';        
        totalLi += '<span class="lcholesterol val">' + totals.cholesterol + 'mg<br/>&nbsp;</span>';
        totalLi += '<span class="lfibres val">' + totals.fibres + 'g<br/>&nbsp;</span>';
        totalLi += '<span class="lsodium val">' + totals.sodium + 'mg<br/>&nbsp;</span>';
        totalLi += '</li>';
        $('div#showMealsDate ul').append(totalLi);
        $('div#meals div#chart').html('<div id="chartKcalAll" class="chart"></div>');
        setMealsKcal(data);
        
        var max = data.max;
        $('div#adhperc ul').append('<li>Energie ADH <span class="adhtotal">' + Math.round(totals.kcal / max.kcal * 100) + '%</span></li>');
        $('div#adhperc ul').append('<li>Eiwitten ADH <span class="adhtotal">' + Math.round(totals.proteins / max.proteins * 100) + '%</span></li>');
        $('div#adhperc ul').append('<li>Vetten ADH <span class="adhtotal">' + Math.round(totals.fats / max.fats * 100) + '%</span></li>');
        $('div#adhperc ul').append('<li>Koolhydraten ADH <span class="adhtotal">' + Math.round(totals.carbohydrates / max.carbohydrates * 100) + '%</span></li>');
        $('div#adhperc ul').append('<li>Suikers ADH <span class="adhtotal">' + Math.round(totals.sugars / max.sugars * 100) + '%</span></li>');
    }
    
    resizeHeader();
};

var setMealsKcal = function(data) {
    
    var allMax = [Math.round(data.max.kcal), Math.round(data.max.proteins) * 4, Math.round(data.max.fats) * 9, Math.round(data.max.carbohydrates) *4];
    var allTotal = [Math.round(data.total.kcal), Math.round(data.total.proteins) * 4, Math.round(data.total.fats) * 9, Math.round(data.total.carbohydrates) * 4];
    console.log(allMax);
    console.log(allTotal);
    $('#chartKcalAll').highcharts({
            chart: {
                type: 'column',
                backgroundColor: 'rgba(255, 255, 255, 0.0)',
                zoomType: 'xy'                   
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                x: 0,
                y: 30,
                floating: true
            },            
            title: {
                text: 'Totale macro nutriënten inname',
                style: {
                    fontSize: '1.3em',
                    fontFamily: 'Segoe UI, sans-serif',
                    fontWeight: 'bold'                        
                }                
            },
            xAxis: {
                categories: [
                    'Totaal',
                    'Eiwitten',
                    'Vetten', 
                    'Koolhydraten'
                ],
                labels: {
                    formatter: function() {
                        var icon = '';
                        if (this.value === 'Totaal') {
                            icon = 'energy';
                        }
                        else if (this.value === 'Koolhydraten') {
                            icon = 'carbs';
                        }
                        else if (this.value === 'Eiwitten') {
                            icon = 'protein';
                        }
                        else if (this.value === 'Vetten') {
                            icon = 'fat';
                        }
                        return '<img src="/img/icons/' + icon + '.png" width="20px;" height="20px;" style="margin-right: 5px; margin-top: 5px;" alt="' + this.value + '" />' + this.value;
                    },                
                    useHTML: true
                }                
            },
            yAxis: {
                min: 0,
                title: {
                    text: null
                },
                tickInterval: 500        
            },
            tooltip: {
                shared: true,
                formatter: function() {
                var s = '<b>' + this.x + '</b>';
                    $.each(this.points, function(i, point) {
                        s += '<br/><span style="color:' + point.series.color + ';">' + point.series.name +'</span>: ';
                        s += this.y + 'kcal';
                        if (this.x === 'Totaal') {
                            s += ' (' + Math.round((this.y / data.max.kcal) * 100) + '%)';
                        }
                        else if (this.x === 'Eiwitten') {
                            s += ' (' + Math.round(((this.y / 4) / data.max.proteins) * 100) + '%)';
                        }
                        else if (this.x === 'Vetten') {
                            s += ' (' + Math.round(((this.y / 9) / data.max.fats) * 100) + '%)';
                        }
                        else if (this.x === 'Koolhydraten') {
                            s += ' (' + Math.round(((this.y / 4)/ data.max.carbohydrates) * 100) + '%)';
                        }
                    });
                return s;
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'ADH',
                data: allMax,
                color: '#008FC5',
                dataLabels: {
                    enabled: true,
                    color: '#008FC5',
                    align: 'center',
                    style: {
                        fontSize: '1em',
                        fontFamily: 'Segoe UI, sans-serif',
                        fontWeight: 'bold'                        
                    }
                }    
            }, {
                name: 'Inname',
                data: allTotal,
                color: '#71D01C',
                dataLabels: {
                    enabled: true,
                    color: '#71D01C',
                    align: 'center',
                    style: {
                        fontSize: '1em',
                        fontFamily: 'Segoe UI, sans-serif',
                        fontWeight: 'bold'
                    }
                }
            }]
        });    
};

var getUnseenDates = function() {
    $.ajax ({
        url: '/secure/dietist/klanten/' + customerId + '/maaltijden/nieuw',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function(data) {
           unseen = data;
        }
    });
    //all data seen
    if (unseen.length === 0) {
       $('div#unseenData').html('<p>U heeft alle maaltijden van deze klant bekeken.</p>');
    }
    else {       
        var unseenContent = '<p>Er zijn nog niet bekeken maaltijden op volgende <span id="countDates">' + unseen.length + '</span> data: <select id="drpUnseenData">';
        unseenContent += '<option value="-1">Selecteer ...</option>';

        $.each(unseen, function(i, date) {            
            unseenContent += '<option value="' + date.dateFormat + '">' + date.dateFormat + '</option>';
        });
        
        unseenContent += '</select></p>';

        $('div#unseenData').html(unseenContent);

    }
};