$(function($) {
    
    $('div#menuDashboard h2').each(function () {
       var menuLink = $(this).attr('id');
       var menuDiv = menuLink.split('Link')[0];
       if (!$(this).hasClass('active')) {
           $('div#dashboard').find('div#' + menuDiv).hide();
       };
    });
    
    $('div#menuDashboard h2').on('click', function(e) {
        if (!$(this).hasClass('active')) {
            var activeMenu = $('div#menuDashboard h2.active').attr('id');
            var activeDiv = activeMenu.split('Link')[0];
            $('div#menuDashboard h2.active').removeClass('active');
            $('div#dashboard div#' + activeDiv).hide();
            $(this).addClass('active');
            var menuLink = $(this).attr('id');
            var menuDiv = menuLink.split('Link')[0];            
            $('div#dashboard').find('div#' + menuDiv).show();
            resizeHeader();
            $(window).resize();
        }
    });    
    
    var now = moment();
    var lastc = moment($('span#lastConsultationDate').text(), 'DD-MM-YYYY');
    $('span#daysAgo').text(now.diff(lastc, 'days'));

    var latLng = new google.maps.LatLng(51.156315, 4.136194);

    var mapOptions = {
         zoom: 13,
         center: latLng,
         mapTypeId: google.maps.MapTypeId.ROADMAP
   };
    
   map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
   
   var marker = new google.maps.Marker({
      position: latLng,
      map: map
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
            newComm += '<p class="text">' + text + '</p></div>';
            $('div#commHistory').prepend(newComm);
            resizeHeader();
            $.ajax ({
               url: '/secure/klanten/bericht',
               type: 'POST',
               dataType: 'json',
               async: false,
               data: {msg: text }
            });
            $('textarea#sendMessage').val('');
        }
    });
});