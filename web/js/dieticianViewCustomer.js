$(function($) {
    $('div#consults ul.hidden').hide();
    var shownCons = $('div#consults ul.shownConsult').attr('id');
    $('select#previousConsults').on('change', function(e) {
        var val = $(this).val();
        $('div#consults ul').addClass("hidden").slideUp('normal', function() {
            
            if ($(window).width() > 750 && $('header#small').height() < $('section#console').height()) {
                $('header#small').height($('section#console').height());
            }  
        });
        $('div#consults ul#' + val).removeClass('hidden').slideDown('normal', function() {
            if ($(window).width() > 750 && $('header#small').height() < $('section#console').height()) {
                $('header#small').height($('section#console').height());
            }  
        });
        if (val === shownCons) {
            $('h3 span#headerConsult').html('Recentste (3E) consultatie');
        }
        else {
            $('h3 span#headerConsult').html('(1STE) consultatie');
        }     
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
});