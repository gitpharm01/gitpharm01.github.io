function getParameterDefinitions() {
  return [
    { name: 'edgeNumber', type: 'int', initial: 6, caption: "Number of edges" },
    { name: 'bodyRadius', type: 'float', initial: 30, caption: "Radius of the box:" },
	{ name: 'upperHeight', type: 'float', initial: 10, caption: "Depth of the Upper box:" },
	{ name: 'lowerHeight', type: 'float', initial: 15, caption: "Depth of the Lower box:" }
]
}

function main (params) {
  var edgeNumber = params.edgeNumber;
  var bodyRadius = params.bodyRadius;
  var upperHeight = params.upperHeight;
  var lowerHeight = params.lowerHeight;

  var bodyHeight = upperHeight + lowerHeight;
  
  var cubeSpacer = CAG.circle({center: [0,0], radius: bodyRadius-2.5, resolution: edgeNumber}).extrude({offset: [0,0,2]});
  var plateRim = cubeSpacer.subtract(CAG.circle({center: [0,0], radius: bodyRadius-5.5, resolution: edgeNumber}).extrude({offset: [0,0,2]})) 

var rectBase = CAG.rectangle({center: [0,0], radius: [0.8, bodyRadius*2]});
var barBase = rectBase.extrude({offset: [0,0,2]});
barBase = barBase.rotateZ(45).union(barBase.rotateZ(-45));

for (i=1; 8*i < bodyRadius; i++ ){
    barBase = barBase.union(barBase.translate([0,8*i,0])).union(barBase.translate([0,-8*i,0]))
}
  return barBase.intersect(cubeSpacer).union(plateRim)
}
