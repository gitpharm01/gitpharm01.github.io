//Copyright (c) 2020 [gitpharm01] gitpharm01@gmail.com
function getParameterDefinitions() {
    return [
        {
            name: 'clipBarLength',
            initial: '80',
            type: 'float',
            caption: 'Total length of the clip:'
        }

  ];
}

function main(params) {


    var clipBarLength = params.clipBarLength;
    //2d shape of the groove
    var grooveBase = CAG.fromPoints([[2.2, 0], [1.2, 1], [-1.2, 1], [-2.2, 0]]);
    //2d shape of the ring intersection
    var ringBase = CAG.fromPoints([[2.2, 0], [1.2, 1], [-1.2, 1], [-2.2, 0], [-7.5, 0], [-7.5, -3], [7.5, -3], [7.5, 0]]);

    //piece for cutting the end of the clip bars to create grooves for the fixing clamp(at part 3)
    var clampBarCutter = linear_extrude({
        height: 25
    }, polygon([[0 - 0.2, 0], [0 - 0.2, 4], [5.2, 4], [5.2, -4]])).rotateY(90).translate([clipBarLength - 20, 8, 2.5]);

    var clipBar = CSG.cube({
        center: [clipBarLength / 2, 4, 0],
        radius: [clipBarLength / 2, 4, 7.5]
    });

    //make a circle and merge with a triangle to form the basic form of the joint:h1
    var c1 = CAG.circle({
        center: [0, 0],
        radius: 5,
        resolution: 32
    });
    var triangle = polygon([[-5, 0], [8, 0], [8, -8]]);
    var h1 = c1.union(triangle)
    var clipJointBase = linear_extrude({
        height: 3.5
    }, h1);
    //joint part cutted to have a beveld edge for printing(avoid adhesion caused by hanging filament)
    var clipJointBaseCutted = linear_extrude({
        height: 6
    }, h1).cutByPlane(CSG.Plane.fromPoints([-5, 0, 2], [8, 0, 0], [8, -6, 0]));

    var clipJointBaseCuttedPlusHole = clipJointBaseCutted.subtract(cylinder({start: [0,0,-5], end: [0,0,10], r: 2.7, fn: 50}));
    var clipJointPlusBar = clipJointBase.union(clipJointBaseCutted.translate([0, 0, 10])).union(cylinder({
        r: 2.5,
        h: 15
    }))

    var clipPartA = clipBar.union(grooveBase.extrude({
        offset: [0, 0, clipBarLength]
    }).rotateZ(180).rotateY(90)).subtract(clampBarCutter).translate([8,0,0]).union(clipJointBaseCuttedPlusHole.mirroredY().translate([0,0,-4]));

    var clipPartB =clipBar.rotateX(180).subtract(grooveBase.extrude({
        offset: [0, 0, clipBarLength + 2]
    }).rotateZ(180).rotateY(90)).subtract(clampBarCutter.mirroredY()).translate([8,0,0]).union(clipJointPlusBar.translate([0,0,-7.5]));

    return clipPartA.union(clipPartB.rotateZ(-60))
}
