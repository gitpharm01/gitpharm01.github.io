function getParameterDefinitions () {
  return [
    {name: 'openingRadius', initial: '15', type: 'float', caption: 'Radius of the Opening'},
    {name: 'clipBarLength', initial: '80', type: 'float', caption: 'Total length of the clip'}
    
  ];
}

function main (params) {

var openingRadius = params.openingRadius;    
var clipBarLength = params.clipBarLength - params.openingRadius;

var grooveBase = CAG.fromPoints([ [2.2,0],[1.2,1],[-1.2,1],[-2.2,0] ]);  
var ringBase = CAG.fromPoints([ [2.2,0],[1.2,1],[-1.2,1],[-2.2,0], [-7.5,0],[-7.5,-3],[7.5,-3],[7.5,0]]);  
var clipRing = rotate_extrude({fn:64}, ringBase.rotateZ(90).translate([openingRadius,0,0]) );
var clampBarCutter = linear_extrude({ height:25 }, polygon([ [0-0.2,0],[0-0.2,4],[5.2,4],[5.2,-4] ])).rotateY(90).translate([clipBarLength + openingRadius-20, 8,2.5]);
var clipBar = CSG.cube({
    center: [openingRadius + clipBarLength/2, 4, 0],
    radius: [clipBarLength/2, 4, 7.5]
});

var c1 = CAG.circle({center: [0,0], radius: 5, resolution: 32});
var c2 =polygon([ [-5,0],[8,0],[8,-6] ]);
var h1 = c1.union(c2)
var clipJointBase =linear_extrude({ height: 3.5}, h1);
var clipJointPlusBar = clipJointBase.union(clipJointBase.translate([0,0,8])).union(cylinder({r: 2.5, h: 15}))

var clipPartA = clipRing.cutByPlane(CSG.Plane.fromPoints(
     [openingRadius *3,0,30], [-openingRadius *3, 0, 30], [-openingRadius *3, 0 , -30],[openingRadius *3,0,-30]
)).union(clipBar).union(grooveBase.extrude({offset: [0,0,clipBarLength]}).rotateZ(180).rotateY(90).translate([openingRadius,0,0])).subtract(clampBarCutter);
 
var clipPartB = clipRing.cutByPlane(CSG.Plane.fromPoints(
     [openingRadius *3,0,30], [-openingRadius *3, 0, 30], [-openingRadius *3, 0 , -30],[openingRadius *3,0,-30]
)).union(clipBar).rotateX(180).subtract(grooveBase.extrude({offset: [0,0,clipBarLength+2]}).rotateZ(180).rotateY(90).translate([openingRadius-2,0,0])).union(clipJointPlusBar.translate([-(openingRadius + 5+3.5),0,-7.5])).subtract(clampBarCutter.mirroredY());

return [clipPartA.union(clipJointBase.mirroredY().translate([-(openingRadius + 5+3.5),0,4.5])).union(clipJointBase.mirroredY().translate([-(openingRadius + 5+3.5),0,-3.5])).subtract(cylinder({start: [-(openingRadius + 5+3.5),0,-8], end: [-(openingRadius + 5+3.5),0,8], r: 2.65, fn: 50})), clipPartB.rotate([-(openingRadius + 5+3.5),0,0],[0, 0, 1], -30)]; 

}


