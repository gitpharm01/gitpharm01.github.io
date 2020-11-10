function getParameterDefinitions() {
  return [
    { name: 'xLength', type: 'float', initial: 40, caption: "Length on X axis:" },
    { name: 'yLength', type: 'float', initial: 60, caption: "Length on Y axis:" },
   
]
}

function main (params) {
  var xLength = (params.xLength) / 2;
  var yLength = (params.yLength) / 2;

  
  var RcubeSpacer = CSG.roundedCube({ 
    center: [0, 0, 0],
    radius: [xLength-0.5,yLength-0.5,15],
    roundradius: 10,
    resolution: 32,
});

  var rimRect = CAG.roundedRectangle({center: [0,0], radius: [xLength-0.5,yLength-0.5], roundradius: 10, resolution:32});
var rimCSG = rimRect.extrude({offset: [0,0,2]}).subtract(rimRect.extrude({offset: [0,0,2]}).scale([0.9,0.9,1]));
var rectBase = CAG.rectangle({center: [0,0], radius: [0.8, yLength+xLength]});
var barBase = rectBase.extrude({offset: [0,0,2]});
barBase = barBase.rotateZ(45).union(barBase.rotateZ(-45));

for (i=1; 8*i < yLength; i++ ){
    barBase = barBase.union(barBase.translate([0,8*i,0])).union(barBase.translate([0,-8*i,0]))
}
  return barBase.intersect(RcubeSpacer).union(rimCSG)
}

