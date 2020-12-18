//Copyright (c) 2020 [gitpharm01] gitpharm01@gmail.com
function getParameterDefinitions() {
    return [
        {
            name: 'openingRadius',
            initial: '15',
            type: 'float',
            caption: 'Radius of the Opening'
        }

  ];
}

function main(params) {
    var radius = params.openingRadius;
    //Clip insert basic form(have a groove in the middle)
    var insertBase = CAG.fromPoints([[2.3, 0], [1.2, 1.1], [-1.2, 1.1], [-2.2, 0], [-7.5, 0], [-7.5, 2], [7.5, 2], [7.5, 0]]);
    var insertRing = rotate_extrude({
        fn: 64
    }, insertBase.rotateZ(90).translate([radius, 0, 0]));

    //cutting a hole to fix the insert
    insertRing = insertRing.subtract(sphere({r: 3.9}).translate([radius,0,-7.5]));


    var capEdgeCutterBase = CAG.fromPoints([[0, 0], [0, 3], [3, 0]]);
    var capEdgeCutter = rotate_extrude({
        fn: 64
    }, capEdgeCutterBase.rotateZ(90).translate([radius + 3, 0, 0]));
    //basic form for thread on the insert rint
    var hex = CSG.Polygon.createFromPoints([
			[radius, 0, 0.5]
			, [radius + 1.5, 0, 1.5]
			, [radius, 0, 2.5]
	]);
    //basic form for cutting groove on the cap
    var hex2 = CSG.Polygon.createFromPoints([
			[radius + 0.1, 0, 0.2]
			, [radius + 1.7, 0, 1.7]
			, [radius + 0.1, 0, 2.8]
	]);
    var angle = 5;
    var thread = hex.solidFromSlices({
        numslices: 360 * 2.5 / angle,
        callback: function (t, slice) {
            return this.translate([0, 0, t * 7]).rotate(
						[0, 0, 0], //center
						[0, 0, 20], //direction
                angle * slice
            );
        }
    });

    //Upper ring part for the clip insert, have thread  on it to combine with the cap
    var upperRing = CSG.cylinder({
        start: [0, 0, 6],
        end: [0, 0, 18],
        radius: radius,
        resolution: 64
    }).subtract(
        CSG.cylinder({
            start: [0, 0, 6],
            end: [0, 0, 18],
            radius: radius - 2,
            resolution: 64
        })
    );

    var insertRingComplete = insertRing.union(thread.translate([0, 0, 8])).union(upperRing);


    var ringCap = CSG.cylinder({
        start: [0, 0, 11],
        end: [0, 0, 24],
        radius: radius + 3,
        resolution: 64
    }).subtract(
        CSG.cylinder({
            start: [0, 0, 11],
            end: [0, 0, 22],
            radius: radius + 0.2,
            resolution: 64
        })
    ).subtract(hex2.solidFromSlices({
        numslices: 360 * 2.5 / angle,
        callback: function (t, slice) {
            return this.translate([0, 0, t * 7]).rotate(
						[0, 0, 0], //center
						[0, 0, 20], //direction
                angle * slice
            );
        }
    }).translate([0, 0, 8.8])).subtract(capEdgeCutter.rotateX(180).translate([0, 0, 24]));
    //var insertZDelta =-(insertRingComplete.getBounds()[0].z + insertRingComplete.getBounds()[1].z )/ 2
    var ringCapDelta = -ringCap.getBounds()[1].z 
    var insertZDelta =- insertRingComplete.getBounds()[1].z  + ((insertRingComplete.getBounds()[1].z - insertRingComplete.getBounds()[0].z ))
        return [insertRingComplete.translate([0, 0, insertZDelta]), ringCap.translate( [radius * 3, 0, ringCapDelta] ).rotateX(180) ]
}

