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
    ],

    marker: [
		new ol.style.Style({
			image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
				//rotation: 180*Math.PI/180,
				rotateWithView: true,
				scale : 0.5,
				anchor: [0.5, 0.5],
                anchorOrigin: 'bottom-left',
				anchorXUnits: 'fraction',
		        anchorYUnits: 'pixels',
                opacity: 1,
				src: './images/marker.png'
	        })),
	        text: new ol.style.Text({
                text: '126번 정류장',
                font: '15px sans-serif',
                fill: new ol.style.Fill({
                    color: 'black'
                }),
                offsetY: -50
            })
        })
    ],

    line: [
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'black',
				width: 3
			})
        })
	]
};