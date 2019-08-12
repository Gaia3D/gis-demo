GAIA3D.Style = {
	point1: [
		new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({color: 'red'}),
                stroke: new ol.style.Stroke({color: 'black', width: 2})
            })
        })
	],

	point2: [
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({color: [255, 251, 137, 0.5]}),
                stroke: new ol.style.Stroke({color: [237, 85, 101, 1],width: 2})
            })
        })
    ],

	point3: [
		new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({color: [255, 251, 137, 0.5]}),
                stroke: new ol.style.Stroke({color: 'blue' ,width: 2})
            })
        })
    ],

    block: [
    	new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(255, 0, 0, 0.7)'
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(0, 0, 255, 1)',
				//lineDash: [10, 10],
				width: 3
			})
		})
    ]
};