<!DOCTYPE html>
<html lang="ko-KR">
<head>
<meta charset="utf-8">
<meta content="IE=edge" http-equiv="X-UA-Compatible">
<title>HHI Sample Page</title>
<link rel="stylesheet" href="../css/style.css">
</head>
<body>
	<div id="map" class="map"></div>
	<div class="mapControl">
		<p>지도</p>
		<button>지도확대</button>
		<button>지도축소</button>
		<button class="rotate" data-direction="right">지도회전(&lt;)</button>
		<button class="rotate" data-direction="left">지도회전(&gt;)</button>
		<button>초기화</button>
		<p>블록</p>
		<button>블록조회</button>
		<button>블록지우기</button>
		<button>블록이동</button>
	</div>
</body>
<script type="text/javascript" src="../externlib/jquery-3.3.1/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="../externlib/ol45/ol-debug.js"></script>
<script type="text/javascript" src="../externlib/proj4js-2.4.3/proj4.min.js"></script>
<script type="text/javascript" src="../js/mapInit.js"></script>
<script type="text/javascript" src="../js/mapTools.js"></script>
<script type="text/javascript" src="../js/mapUtils.js"></script>
<script type="text/javascript" src="../js/mapEvent.js"></script>
<script type="text/javascript">
var HHI = HHI||{};

HHI.Policy = {}
HHI.Policy.serverUrl = 'http://localhost';
HHI.Policy.geoserverDataUrl = 'http://localhost:8080/geoserver';
HHI.Policy.geoserverDataWorkspace = 'hhi';
HHI.Policy.coordinate = 'EPSG:5187';
HHI.Policy.mapDefaultLayer = '2017_hhi';
HHI.Policy.mapExtent = [-415909.65, -426336.34, 649203.95, 865410.62];
HHI.Policy.mapCenter = [239700, 324800];

// 맵 생성
HHI.Map = new MapWrapper(HHI.Policy).create('map');
// 툴바
HHI.Tools = new MapTools(HHI.Map);
// 유틸
HHI.Utils = new MapUtils(HHI.Map);

</script>
</html>