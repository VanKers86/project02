var cache = $('body');
var previousValue = "";
var list;

$(function($) {
    $('p#addThisMeal').hide();
    
     $( "#datepicker" ).datepicker(
        { 
            minDate: -2, 
            maxDate: +0,
            showOn: "button",
            buttonImage: "/img/icons/calendar.png",
            buttonImageOnly: true,
            dateFormat: 'dd-mm-yy',
            altField: "input#date",
            altFormat: "yy-mm-dd"
        }
    );
         
    $('input.spinner').spinner({
       step: 5,
       numberFormat: "n"
    }).numeric();
    
     $('input.spinner').spinner('option', 'min', 5);
     
     var todayDatepicker = moment().format('DD-MM-YYYY');
     var todayMysql = moment().format('YYYY-MM-DD');
         
     $('#datepicker').attr('value', todayDatepicker);
     $('input#date').attr('value', todayMysql);

     if ($('select#type').val() === '0') {
         $('.typeDependant').hide();
     }
     else {
         $('.typeDependant').show();
     }
     
     if ($('select#category').val() === '0') {
         $('.categoryDependant').hide();
     }
     else {
         $('.categoryDependant').show();
     }
     
     $('select#type').on('change', function(e) {
        if ($(this).val() === '0') {
            $('.typeDependant').hide();
        }
        else {
            $('p.initial').hide();
            $('div#overviewMeal span#mealHeader').html($('select#type option:selected').text() + ' op ' + $('input#datepicker').val()); 
            $('.typeDependant').show();
        }
        resizeHeader();
     });
     
     $('select#category').on('change', function(e) {
        if ($(this).val() === '0') {
            $('.categoryDependant').hide();
        }
        else {
            var url = 'food/' + $(this).val();
            list = getFoodsByCategory(url);
            $('.categoryDependant').show();
            $('input#food').autocomplete({
                autoFocus: true,
                source: list,
                minLength: 1,
                scroll: true
            });
            if ($(this).val() === '6') {
                $('span#quantity').html('cl');
            }
            else {
                $('span#quantity').html('gr');
            }
            $('input#food').val("");
        }
        resizeHeader();
     });
     
     $('a#editInitial').on('click', function(e) {
        e.preventDefault();
        $('div.typeDependant').hide();
        $('select#type').val('0');
        $('select#category').val('0');
        $('.categoryDependant').hide();
        $('div#overviewMeal ul').empty();
        $('span#errorFood').empty();
        $('p.initial').show();
        
     });
     
     $('a#addFood').on('click', function(e) {
         e.preventDefault();
         var food = $('input#food').val();
         var gram = $('input#gram').val();
         var allOk = true;
         if (food === "") {
             allOk = false;
             $('span#errorFood').html('Gelieve een voedingsmiddel te zoeken en te selecteren');

         }
         else {
             allOk = false;
             $.each(list, function(index, item) {
                 if (item === food) {
                     allOk = true;
                 }
             });
             $('span#errorFood').html('Dit voedingsmiddel werd niet teruggevonden');
         }
         if (isNaN(gram) || gram === "") {
             $('span#errorFood').html('Gelieve een hoeveelheid in te geven');
             allOk = false;
         }
         if (allOk) {
            $('span#errorFood').empty();
            var liValue = '<li>' + gram + $('span#quantity').text() + ' ' + food + '<a href="#" title="Verwijder" class="deleteFood">Verwijder</a>';
            liValue += '<input type="hidden" name="gram[]" value="' + gram + '"/>';
            liValue += '<input type="hidden" name="food[]" value="' + food + '"/>';
            liValue += '</li>';
            $('div#overviewMeal ul').append(liValue);
            resizeHeader();
            checkSubmitOption();
         }
     });
   
     $('body').on('click', 'ul li a.deleteFood', function(e) {
         e.preventDefault();
         $(this).parent().remove();
         resizeHeader();
         checkSubmitOption();
     });
     
     
});
     

var checkSubmitOption = function() {
     if ($('div#overviewMeal ul li').length > 0) {
         $('p#addThisMeal').show();
     }
     else {
         $('p#addThisMeal').hide();
     } 
};

var getFoodsByCategory = function(url) {
    if (!cache.data(url)) {
        $.ajax ({
           url: '/api/' + url,
           type: 'POST',
           dataType: 'json',
           async: false,
           success: function(data) {
                var array = [];
                $.each(data, function(i, item) {
                    array.push(item['name']);
                });
                cache.data(url, array);
           }
        }); 
    }
    return cache.data(url);
    
};