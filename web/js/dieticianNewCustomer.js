var day = false;
var month = false;
var year = false;
var pal;

$(function($) {

    $("form :input").on("keypress", function(e) {
        return e.keyCode !== 13;
    });

//    $(document).tooltip({
//        position: {
//            my: "center bottom+20",
//            at: "center top",
//            using: function( position, feedback ) {
//                $( this ).css( position );
//                $( "<div>" )
//                .addClass( "arrow" )
//                .addClass( feedback.vertical )
//                .addClass( feedback.horizontal )
//                .appendTo( this );
//            }
//        }
//    });
    
    $('input[name="length"]').numeric();
    $('input[name="weight"]').numeric();
    $('input.number').numeric();
    $('input.spinner').spinner({
       step: 1,
       numberFormat: "n"
    });
    
    $('input.spinner').spinner('option', 'min', 0);
    
    $('input#spinnerWeight').on('spinstop', function() {
        calculateBMI();
        calculateKcal();
    });
    
    $('input[name="weight"]').keyup(function () {
        calculateBMI();
        calculateKcal();
    });
    
    $('input#spinnerHeight').on('spinstop', function() {
        calculateBMI();
    });
    
    $('input[name="height"]').keyup(function () {
        calculateBMI();
    });

    $("input[name=gender]").change(function () {
        calculateKcal();
    });
    
    document.getElementById('PALInput').onchange = function() {
        setPal();
        calculateKcal();
    };

    $('#age span').html("&nbsp;");
    
    if ($('#day').val() !== "" && $('#month').val() !== "" && $('#year').val() !== "") {
        day = true;
        month = true;
        year = true;
        checkAge();
    }
    
    $('#day').change(function() {
        if ($(this).val() === "") {
            day = false;
            $('#age span').html("0");
        }
        else {
            day = true;
            checkAge();
        }
    });
    
    $('#month').change(function() {
        if ($(this).val() === "") {
            month = false;
            $('#age span').html("0");
        }
        else {
            month = true;
            checkAge();
        }
    });

    $('#year').change(function() {
        if ($(this).val() === "") {
            year = false;
            $('#age span').html("0");
        }
        else {
            year = true;
            checkAge();
        }
    });

    calculateBMI();
    setPal();
    calculateKcal();
    
    $('span.editOk').hide();
    $('span.editData').on('click', function(e) {
        $(this).hide();
        $(this).parent().find('span.value').hide();
        $(this).parent().find('span.editOk').show();
        $(this).parent().find('input[type=hidden]').attr('type', 'text');
    });
    $('span.editOk').on('click', function(e) {
        $(this).hide();
        var input = $(this).parent().find('input[type=text]');
        input.attr('type', 'hidden');
        $(this).parent().find('span.value').html(input.val());
        $(this).parent().find('span.editData').show(); 
        $(this).parent().find('span.value').show();
        input.attr('type', 'hidden');
    });
});

var checkAge = function() {
    if (day && month && year) {
        var date = $('#year').val() + '-' + $('#month').val() + '-' + $('#day').val();
        var today = new Date();
        var dob = new Date(date);
        var age = Math.floor((today-dob) / (365.25 * 24 * 60 * 60 * 1000));
        $('#age span#ageSpan').html(age);
        calculateKcal();
    }
    else {
        $('#age span#ageSpan').html("0");
    }
};

var setPal = function() {
    pal = document.getElementById('PALInput').value;
    if (pal === "1") {
        $('#PAL').html('Licht');
    }
    else if (pal === "2") {
        $('#PAL').html('Middelmatig');
    }
    else if (pal === "3") {
        $('#PAL').html('Zwaar');
    }
};

var calculateBMI = function() {
    var height = $('input#spinnerHeight').spinner("value");
    var weight = $('input#spinnerWeight').spinner("value");
    if ($.isNumeric(height) && $.isNumeric(weight)) {
        var bmi = weight / Math.pow((height / 100), 2);
        bmi = (Math.round(bmi * 10) / 10);
        var type;
        if (bmi <= 18.5) {
            type = "Ondergewicht";
            $('#BMI span#bmiSpan').attr('class', 'bmi1');
        }
        else if (bmi >= 18.6 && bmi <= 25.0) {
            type = "Gezond gewicht";
            $('#BMI span#bmiSpan').attr('class', 'bmi2');
        }
        else if (bmi >= 25.1 && bmi <= 30.0) {
            type = "Overgewicht";
            $('#BMI span#bmiSpan').attr('class', 'bmi3');
        }
        else if (bmi >= 30.1 && bmi <= 35.0) {
            type = "Obesitas";
            $('#BMI span#bmiSpan').attr('class', 'bmi4');
        }
        else if (bmi >= 35.1) {
            type = "Extreme obesitas";
            $('#BMI span#bmiSpan').attr('class', 'bmi5');
        }

        $('#BMI span#bmiSpan').html(bmi + ' (' + type + ')');
        $('input[name=bmi]').val(bmi);
    }
    else {
        $('#BMI span#bmiSpan span.value').html("0");
        $('input[name=bmi]').val("0");    
    }
};

var calculateKcal = function() {
    var age = $('#age span#ageSpan').html();
    var gender = $('input[name=gender]:checked', '#newCustomer').val();
    var weight = $('input#spinnerWeight').val();
    var pal = document.getElementById('PALInput').value;
    var kcal;
    var pre;
    if ($.isNumeric(age) && $.isNumeric(weight)) {

        if (gender === "M") {
            if (age >= 18 && age <= 29) {
                pre = (15.3 * weight + 679);
            }
            else if (age >= 30 && age <= 59) {
                pre = (11.6 * weight + 879);
            }
            else if (age >= 60 && age <= 74) {
                pre = (11.9 * weight + 700);
            }
            else if (age > 75) {
                pre = (8.4 * weight + 820);
            }

            if (pal === "1") {
                kcal = pre * 1.55;
            }
            else if (pal === "2") {
                kcal = pre * 1.78;
            }
            else if (pal === "3") {
                kcal = pre * 2.1;
            }
        }
        else if (gender === "F") {
            if (age >= 18 && age <= 29) {
                pre = (14.7 * weight + 496);
            }
            else if (age >= 30 && age <= 59) {
                pre = (8.7 * weight + 829);
            }
            else if (age >= 60 && age <= 74) {
                pre = (9.2 * weight + 688);
            }
            else if (age > 75) {
                pre = (9.8 * weight + 624);
            }

            if (pal === "1") {
                kcal = pre * 1.56;
            }
            else if (pal === "2") {
                kcal = pre * 1.64;
            }
            else if (pal === "3") {
                kcal = pre * 1.82;
            }    
        }
        $('#kcalSpan span.value').html(Math.round(kcal));
        $('input[name=kcal]').val(Math.round(kcal));       
        calculateOthers(Math.round(kcal));
    }
    else {
        $('#kcalSpan span.value').html("0");
        $('input[name=kcal]').val("0");
        calculateOthers();
    }

};

var calculateOthers = function(kcal) {
    if (kcal) {
        var carbs = Math.round((kcal * 0.55 / 4 )* 10) / 10;
        var sugars = Math.round((kcal * 0.10 / 4) * 10) / 10;
        var proteins = Math.round((kcal * 0.11 / 4) * 10) / 10;
        var fats = Math.round((kcal * 0.30 / 9) * 10) / 10;
        
        $('#carbsSpan span.value').html(carbs);
        $('input[name=carbs]').val(carbs);
        $('#sugarsSpan span.value').html(sugars);
        $('input[name=sugars]').val(sugars);
        $('#proteinsSpan span.value').html(proteins);
        $('input[name=proteins]').val(proteins);
        $('#fatsSpan span.value').html(fats);
        $('input[name=fats]').val(fats);
    }
    else {
        $('#carbsSpan span.value').html("0");
        $('input[name=carbs]').val("0");  
        $('#sugarsSpan span.value').html("0");
        $('input[name=sugars]').val("0");
        $('#proteinsSpan span.value').html("0");
        $('input[name=proteins]').val("0");
        $('#fatsSpan span.value').html("0");
        $('input[name=fats]').val("0");        
    }
};