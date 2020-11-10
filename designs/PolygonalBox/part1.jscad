function getParameterDefinitions() {
  return [
    { name: 'edgeNumber', type: 'int', initial: 6, caption: "Number of edges" },
    { name: 'bodyRadius', type: 'float', initial: 30, caption: "Radius of the box:" },
	{ name: 'upperHeight', type: 'float', initial: 10, caption: "Depth of the Upper box:" },
	{ name: 'lowerHeight', type: 'float', initial: 15, caption: "Depth of the Lower box:" }
]
}

function makeStopperSet(edges,stopperBase){
    var stopperSet;
    if (edges %2 ==1){
        stopperSet= stopperBase.rotateZ(360/edges * 1.5);
        for (i=0;i <edges+1;i++){
		stopperSet = stopperSet.union(stopperBase.rotateZ(360/edges *1.5 - 360/edges*i));
		console.log("added!" + i);}
    }else{
        stopperSet= stopperBase.rotateZ(360/edges);
        for (i=2;i <edges+1;i++){
		stopperSet = stopperSet.union(stopperBase.rotateZ(360/edges *i));
		console.log("added!" + i);}
    }
	 
	
	return stopperSet
}

function main (params) {
var edgeNumber =params.edgeNumber;
var bodyRadius =params.bodyRadius;
var upperHeight = params.upperHeight;
var lowerHeight =params.lowerHeight;
var bodyHeight = upperHeight + lowerHeight;

var Container = CAG.circle({center: [0,0], radius: bodyRadius, resolution: edgeNumber}).extrude({offset: [0,0,bodyHeight]}).intersect(CSG.cylinder({ 
  start: [0, 0, 0],
  end: [0, 0, bodyHeight],
  radius: bodyRadius * 0.98,                        // true cylinder
  resolution: 128
}));

var cutter = CAG.circle({center: [0,0], radius: bodyRadius-2, resolution: edgeNumber}).extrude({offset: [0,0,bodyHeight]}).intersect(CSG.cylinder({ 
  start: [0, 0, 0],
  end: [0, 0, bodyHeight],
  radius: bodyRadius * 0.98,                        // true cylinder
  resolution: 128
}));

var plane1 = CSG.Plane.fromPoints(
     [bodyRadius *2,bodyRadius *2 ,0], [-bodyRadius*2, bodyRadius *2, 0], [-bodyRadius*2, -bodyRadius *2, 0],[bodyRadius*2,-bodyRadius *2,0]
);

var cylinderBase =CSG.cylinder({                      
  start: [-9, 0, 0],
  end: [4, 0, 0],
  radius:4,
  resolution: 32
});

var opening = CSG.cylinder({                      
  start: [-9, 0, 0],
  end: [4, 0, 0],
  radius:6,
  resolution: 32
}).subtract(cylinderBase).cutByPlane(plane1);


var stopperCylinder = CAG.fromPoints([ [0,0],[4,0],[0,4]]).extrude({offset: [0,0,5]}).rotateX(-90).translate([-bodyRadius*(Math.cos(Math.PI/edgeNumber))+1,0,lowerHeight]).rotateZ(180/edgeNumber);

var stopperSet = makeStopperSet(edgeNumber, stopperCylinder);

return Container.subtract(cutter.translate([0,0,2])).union(opening.translate([bodyRadius*(Math.cos(Math.PI/edgeNumber))+2,0,6]).rotateZ(-180/edgeNumber).subtract(cutter.translate([0,0,2]))).subtract(cylinderBase.translate([bodyRadius*(Math.cos(Math.PI/edgeNumber))+2,0,6]).rotateZ(-180/edgeNumber)).union(stopperSet)
}
