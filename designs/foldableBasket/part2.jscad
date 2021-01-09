function main() {
    
    //generate groove insert and stablizers
    var insertBase = CAG.fromPoints([[1.5,0],[3,-2.2],[2,-2.2],[2,-6.3],[-2,-6.3],[-2,-2],[-3,-2],[-1.5,0]]).extrude({offset:[0,0,6]}).translate([0,-2.2,0]);
    var insertBaseA = insertBase.union(cube([6,3,10.5]).translate([-3,5.5,0]));
    var insertA = insertBaseA.union(insertBaseA.mirroredY()).union(cylinder({start: [3,0,0], end: [-3,0,0], r: 8.5, fn: 6}).cutByPlane(CSG.Plane.fromPoints([0,10,0],[0,0,0],[5,-5,0])));
    var insertB = insertBase.union(insertBase.mirroredY()).union(cylinder({start: [3,0,0], end: [-7,0,0], r: 8.5, fn: 6}).cutByPlane(CSG.Plane.fromPoints([0,10,0],[0,0,0],[5,-5,0])));
   return [insertA,insertA.translate([-10,0,0]), insertB.translate([15,0,0])]
}
