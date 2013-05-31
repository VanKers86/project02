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
});