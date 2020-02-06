let adhocData;
let communities;

const mappa = new Mappa('Leaflet');
let arrMap;
let canvas;

let data = [];

const options = {
  lat: 36.15,
  lng: 37.1,
  zoom: 9.1,
  style: 	'	https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
}

function preload(){
  adhocData = loadTable('adhocData.csv', 'header');
  communities = loadJSON('latlon.json');
}
function setup() {
  canvas = createCanvas(800, 700);
  arrMap = mappa.tileMap(options);
  arrMap.overlay(canvas);

  let maxArr = 0;
  let minArr = Infinity;

  for (let row of adhocData.rows) {
    let community = row.get('Com_Pcode');
    let latlon = communities[community];
    if (latlon) {
      let lat = latlon[0];
      let lon = latlon[1];
      let arrCount = Number(row.get('Sum_Arr'));
      data.push({
        lat,
        lon,
        arrCount
      });
      if (arrCount > maxArr) {
        maxArr = arrCount;
      }
      if (arrCount < minArr) {
        minArr = arrCount;
      }
    }
  }
    let minD = sqrt(minArr);
    let maxD = sqrt(maxArr);

    for(let community of data) {
      community.diameter = map(sqrt(community.arrCount), minD, maxD, 0, 0.1);
 }
}

function draw(){
    clear();
    for(let community of data) {
      const pix = arrMap.latLngToPixel(community.lat, community.lon);
      fill(238, 88, 89, 100);
      const zoom = arrMap.zoom();
      const scl = pow(2,zoom);
      ellipse(pix.x, pix.y, community.diameter * scl);
    }
}
