$(function($) {
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
            newComm += '<p class="text">"' + text + '"</p></div>';
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