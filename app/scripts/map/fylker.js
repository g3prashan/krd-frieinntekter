'use strict';

var friApp = friApp || {};

friApp.fylker = function (_) {
    // private property
    var map,
    	info,
    	config,
		fylkerLayer,
		kommunerGeoJson,
		kommunerList;

	function addFylker(topoJsonData) {
	    var fylkeGeoJson = topojson.feature(topoJsonData, topoJsonData.objects.N5000_fylker);
		
		fylkerLayer = L.geoJson(fylkeGeoJson, { 
		    style: style,
		    onEachFeature: onEachFeature
		}).addTo(map);

		map.setMaxBounds(map.getBounds());
	};

	function style(feature) {
	    return {
	        fillColor: '#bada55',
	        weight: 1,
	        opacity: 1,
	        color: 'white',
	        dashArray: '3',
	        fillOpacity: 0.7
	    };
	};

	function onEachFeature(feature, layer) {
	    layer.on({
	        mouseover: highlightFeature,
	        mouseout: resetHighlight,
	        click: zoomToFeature
	    });
	};

	function highlightFeature(e) {
	    var layer = e.target;

	    layer.setStyle({
	        weight: 2,
	        color: '#666',
	        dashArray: '',
	        fillOpacity: 0.7
	    });
	    if (map.getZoom() === config.zoom && !L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	    }
	    info.update(layer.feature.properties.NAVN + ' fylke');
	}

	function resetHighlight(e) {
	    fylkerLayer.resetStyle(e.target);
	    info.reset();
	}

	function zoomToFeature(e) {
		// zoom in
	    map.fitBounds(e.target.getBounds());
	    // get kommuner within fylke, and show
	    friApp.kommuner.show(padFylkeId(e.target.feature.properties.FYLKE_NR));
	}

	function padFylkeId(fylkeId) {
		if(fylkeId < 10) {
			return '0' + fylkeId;
		}
		return fylkeId + '';
	}

    return {
        // public method
        init: function (fylkerTopoJsonData, mapArg, infoArg, kommunerTopoJsonData, kommunerListData, configArg) {
        	map = mapArg;
        	info = infoArg;
        	config = configArg;
        	kommunerGeoJson = topojson.feature(kommunerTopoJsonData, kommunerTopoJsonData.objects.geojson);
        	kommunerList = kommunerListData;
            addFylker(fylkerTopoJsonData);

            friApp.kommuner.init(map, kommunerGeoJson, kommunerList, info, config);
        }
    };
}(_);