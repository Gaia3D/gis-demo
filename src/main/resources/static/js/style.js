GAIA3D.Style = {
	Point1: [
		new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({color: 'red'}),
                stroke: new ol.style.Stroke({color: 'black', width: 2})
            })
        })
	],

	Point2: [
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({color: [255, 251, 137, 0.5]}),
                stroke: new ol.style.Stroke({color: [237, 85, 101, 1],width: 2})
            })
        })
    ],

	Point3: [
		new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({color: [255, 251, 137, 0.5]}),
                stroke: new ol.style.Stroke({color: 'blue' ,width: 2})
            })
        })
    ]
};