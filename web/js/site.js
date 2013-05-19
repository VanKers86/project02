$(function($) {
    $('.tooltip').tooltip({
        position: {
            my: "center bottom",
            at: "center top"
        }
    });
    
    var paswVal = 'Paswoord';
    var emailVal = 'you@yourdomain.com';
    $('input#form_Paswoord').val(paswVal).addClass('watermark');
    $('input#form_Email').val(emailVal).addClass('watermark');
    
    $('input#form_Paswoord').blur(function(){
        if ($(this).val().length === 0){
            $(this).val(paswVal).addClass('watermark');
            $(this).attr('type', 'text');
        }
    });
    
     $('input#form_Email').blur(function(){
        if ($(this).val().length === 0){
            $(this).val(emailVal).addClass('watermark');
            $(this).attr('type', 'text');
        }
    });
    
    //if focus and text is watermrk, set it to empty and remove the watermark class
    $('input#form_Paswoord').focus(function(){
        $(this).attr('type', 'password');        
        if ($(this).val() === paswVal){
            $(this).val('').removeClass('watermark');
        }
    });
    
     $('input#form_Email').focus(function(){
        $(this).attr('type', 'email');        
        if ($(this).val() === emailVal){
            $(this).val('').removeClass('watermark');
        }
    });     
    
    
    if ($(window).width() > 750 && $('header#small').height() < $('section#console').height()) {
        $('header#small').height($('section#console').height());
    }
    
    $(window).resize(function() {
        if ($(window).width() > 750 && $('header#small').height() < $('section#console').height()) {
            $('header#small').height($('section#console').height());
        }
        else if ($(window).width() < 750) {
            $('header#small').height('auto');
        }
    });
//    if ($(window).width() > 750 && $(window).resize()) {
//        var headerLeft = $('header#small');
//        var consoleRight = $('section#console');
//
//        var hh = headerLeft.height();
//        var hs = consoleRight.height();
//
//        if (hh > hs) {
//            consoleRight.height(hh);
//        }
//        else {
//            headerLeft.height(hs);
//        }
//    }

});
