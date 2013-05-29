var cache = $('body');
var previousValue = "";

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
       step: 20,
       numberFormat: "n"
    }).numeric();
     
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
            var list = getFoodsByCategory(url);
            $('.categoryDependant').show();
            $('input#food').autocomplete({
                autoFocus: true,
                source: list,
                minLength: 1,
                scroll: true
            });
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
        $('p.initial').show();
     });
     
     $('a#addFood').on('click', function(e) {
         e.preventDefault();
         $('div#overviewMeal ul').append('<li>Test <a href="#" title="Verwijder" class="deleteFood">Verwijder</a></li>');
         resizeHeader();
         checkSubmitOption();
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