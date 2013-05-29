var customerId;

$(function($) {
    var href = $(this).context.URL;
    customerId = href.substr(href.lastIndexOf('/') + 1);
    
    $('div#consults div.consult:not(:first)').addClass('hidden').hide();
    
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
});