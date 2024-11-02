/**
 * MapIt
 *
 * @copyright   Copyright 2013, Dimitris Krestos
 * @license     Apache License, Version 2.0 (http://www.opensource.org/licenses/apache2.0.php)
 * @link        http://vdw.staytuned.gr
 * @version     v0.2.2
 */

document.write('<scr' + 'ipt type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false" ></scr' + 'ipt>');
;(function($, window, undefined) {
    "use strict";

    $.fn.mapit = function(options) {

        var defaults = {
            latitude: -37.819294,
            longitude: 144.951676,
            zoom: 15,
            type: 'ROADMAP',
            scrollwheel: false,
            marker: {
                latitude: -37.819294,
                longitude: 144.951676,
                icon: 'assets/images/map/hotel_icon.png',
                title: 'Details',
                open: false,
                center: true
            },
            address: '<div class="mapbox-content"><h4><a href="#">Agent: US Rent a Car</a></h4><small class="mapbox-price">+00 987 666 55 44</small></br><div class="mapbox-address"><p>PO Box 16122 Collins Street West Victoria 8007 Australia</p></div></div>',
            styles: 'false'
        };

        var options = $.extend(defaults, options);

        $(this).each(function() {

            var $this = $(this);


            // Init Map
            var directionsDisplay = new google.maps.DirectionsRenderer();

            var mapOptions = {
                scrollwheel: options.scrollwheel,
                scaleControl: false,
                center: options.marker.center ? new google.maps.LatLng(options.marker.latitude, options.marker.longitude) : new google.maps.LatLng(options.latitude, options.longitude),
                zoom: options.zoom,
                mapTypeId: eval('google.maps.MapTypeId.' + options.type)
            };
            var map = new google.maps.Map(document.getElementById($this.attr('id')), mapOptions);
            directionsDisplay.setMap(map);

            // Home Marker
            var home = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(options.marker.latitude, options.marker.longitude),
                icon: new google.maps.MarkerImage(options.marker.icon),
                title: options.marker.title
            });

            // Add info on the home marker
            var info = new google.maps.InfoWindow({
                content: options.address
            });

            // Open the info window immediately
            if (options.marker.open) {
                info.open(map, home);
            } else {
                google.maps.event.addListener(home, 'click', function() {
                    info.open(map, home);
                });
            };

            // Create Markers (locations)
            var infowindow = new google.maps.InfoWindow();
            var marker, i;
            var markers = [];

            for (i = 0; i < options.locations.length; i++) {

                // Add Markers
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(options.locations[i][0], options.locations[i][1]),
                    map: map,
                    icon: new google.maps.MarkerImage(options.locations[i][2] || options.marker.icon),
                    title: options.locations[i][3]
                });

                // Create an array of the markers
                markers.push(marker);

                // Init info for each marker
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                        infowindow.setContent(options.locations[i][4]);
                        infowindow.open(map, marker);
                    }
                })(marker, i));

            };

            // Directions
            var directionsService = new google.maps.DirectionsService();

            $this.on('route', function(event, origin) {
                var request = {
                    origin: new google.maps.LatLng(options.origins[origin][0], options.origins[origin][1]),
                    destination: new google.maps.LatLng(options.marker.latitude, options.marker.longitude),
                    travelMode: google.maps.TravelMode.DRIVING
                };
                directionsService.route(request, function(result, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(result);
                    };
                });
            });

            // Hide Markers Once (helper)
            $this.on('hide_all', function() {
                for (var i = 0; i < options.locations.length; i++) {
                    markers[i].setVisible(false);
                };
            });

            // Show Markers Per Category (helper)
            $this.on('show', function(event, category) {
                $this.trigger('hide_all');
                $this.trigger('reset');

                // Set bounds
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < options.locations.length; i++) {
                    if (options.locations[i][6] == category) {
                        markers[i].setVisible(true);
                    };

                    // Add markers to bounds
                    bounds.extend(markers[i].position);
                };

                // Auto focus and center
                map.fitBounds(bounds);
            });

            // Hide Markers Per Category (helper)
            $this.on('hide', function(event, category) {
                for (var i = 0; i < options.locations.length; i++) {
                    if (options.locations[i][6] == category) {
                        markers[i].setVisible(false);
                    };
                };
            });

            // Clear Markers (helper)
            $this.on('clear', function() {
                if (markers) {
                    for (var i = 0; i < markers.length; i++) {
                        markers[i].setMap(null);
                    };
                };
            });

            $this.on('reset', function() {
                map.setCenter(new google.maps.LatLng(options.latitude, options.longitude), options.zoom);
            });

            // Hide all locations once
            //$this.trigger('hide_all');

        });

    };

    $(document).ready(function() {
        $('[data-toggle="mapit"]').mapit();
    });

})(jQuery);


// Run javascript after DOM is initialized
$(document).ready(function() {

    $('#similar_map_wrap').mapit();

});