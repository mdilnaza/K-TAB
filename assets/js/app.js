function initMap(){
    var options = {
        center: {lat: 51.169392, lng: 71.449074},
        zoom: 12
    }
    map = new google.maps.Map(document.getElementById("map"),options)

    function addMarker(location) {
        const marker = new google.maps.Marker({
            position: location,
            map: map,
        });
    }
    addMarker({lat: 51.089, lng: 71.4075});
    addMarker({lat: 51.098554, lng: 71.417113});
    addMarker({lat: 43.26721639442528, lng: 76.93906782513254});
}