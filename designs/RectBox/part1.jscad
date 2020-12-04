//Copyright (c) 2020 [gitpharm01] gitpharm01@gmail.com
function getParameterDefinitions() {
  return [
    { name: 'xLength', type: 'float', initial: 40, caption: "Length on X axis:" },
    { name: 'yLength', type: 'float', initial: 60, caption: "Length on Y axis:" },
    { name: 'upperHeight', type: 'float', initial: 10, caption: "Depth of the Upper box:" },
	{ name: 'lowerHeight', type: 'float', initial: 15, caption: "Depth of the Lower box:" }
]
}


function main (params) {
    
  var xLength = (params.xLength) / 2;
  var yLength = (params.yLength) / 2;
  var upperHeight = params.upperHeight;
  var lowerHeight = params.lowerHeight;
  
  var bodyHeight = upperHeight + lowerHeight;
  var Rcube = CSG.roundedCube({ 
    center: [0, 0, 0],
    radius: [xLength,yLength,bodyHeight],
    roundradius: 10,
    resolution: 32,
});
  var Rcube2 = CSG.roundedCube({ 
    center: [0, 0, 0],
    radius: [xLength + 1.6,yLength + 1.6 , bodyHeight+ 1.6],
    roundradius: 10,
    resolution: 32,
});
 var plane1 = CSG.Plane.fromPoints(
     [xLength *2,bodyHeight *2 ,0], [-xLength-2, bodyHeight *2, 0], [-xLength*2, -bodyHeight *2, 0],[xLength*2,-bodyHeight *2,0]
);

var cylinderBase =CSG.cylinder({                      
  start: [-9, 0, 0],
  end: [5, 0, 0],
  radius:4,
  resolution: 32
});

var opening = CSG.cylinder({                      
  start: [-9, 0, 0],
  end: [5, 0, 0],
  radius:6,
  resolution: 32
}).subtract(cylinderBase).cutByPlane(plane1);

var grooveCutter = CSG.cylinder({                      
  start: [0, 0, 0],
  end: [xLength*2, 0, 0],
  radius:1,
  resolution: 32
}).translate([0,0,1]).rotateY(2);

var stopperCylinder = CAG.fromPoints([ [0,0],[4,0],[0,4]]).extrude({offset: [0,0,5]}).rotateX(-90);
var stopperSet = stopperCylinder.translate([-xLength,0,-upperHeight]).union(stopperCylinder.rotateZ(180).translate([xLength,0,-upperHeight])).union(stopperCylinder.rotateZ(-90).translate([0,yLength,-upperHeight])).union(stopperCylinder.rotateZ(90).translate([0,-yLength,-upperHeight]));

  return Rcube2.subtract(Rcube).cutByPlane(plane1).subtract(cylinderBase.translate([xLength,0,-bodyHeight+4.4])).union(opening.translate([xLength,0,-bodyHeight+4.4]).subtract(Rcube)).union(stopperSet).translate([0,0,bodyHeight]).subtract(grooveCutter);
}

