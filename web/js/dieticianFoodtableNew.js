$(function($) {

    $("form :input").on("keypress", function(e) {
        return e.keyCode !== 13;
    });
    
    $('input.spinner').numeric();
    $('input.spinner').spinner({
       step: 1,
       numberFormat: "n"
    });
    
    $('input.spinner').spinner('option', 'min', 0);
     
});

