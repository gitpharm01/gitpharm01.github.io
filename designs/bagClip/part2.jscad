function getParameterDefinitions () {
  return [
    {name: 'openingRadius', initial: '15', type: 'float', caption: 'Radius of the Opening'}
    
  ];
}

function main(params) {
    var openingRadius = params.openingRadius;
    var insertBase = CAG.fromPoints([ [2.3,0],[1.2,1.1],[-1.2,1.1],[-2.3,0], [-7.5,0],[-7.5,3],[7.5,3],[7.5,0]]); 
    
    var insertRing = rotate_extrude({fn:64}, insertBase.rotateZ(90).translate([openingRadius,0,0]) );
    
	var sqrt3 = Math.sqrt(3) / 2;
	var radius = openingRadius;

	var hex = CSG.Polygon.createFromPoints([
			[radius, 0, 0]
			,[radius + 1.5, 0, 1.5]
			,[radius, 0, 3]
	]);
	var hex2 = CSG.Polygon.createFromPoints([
			[radius, 0, 0]
			,[radius + 1.65, 0, 1.65]
			,[radius, 0, 3.15]
	]);
	var angle = 5;
	var thread = hex.solidFromSlices({
		numslices: 360 * 2 / angle,
		callback: function(t, slice) {
			return this.translate([0, 0, t * 10]).rotate(
						[0,0,0], //center
						[0, 0, 20], //direction
						angle * slice
					);
		}
	});
	
	var upperRing = CSG.cylinder({
  start: [0, 0, 6],
  end: [0, 0, 22],
  radius:openingRadius,
  resolution: 64
}).subtract(
    CSG.cylinder({
  start: [0, 0, 6],
  end: [0, 0, 22],
  radius:openingRadius-3,
  resolution: 64
})
    );
	
	var insertRingComplete = insertRing.union(thread.translate([0,0,8])).union(upperRing)
	
	var ringCap = CSG.cylinder({
  start: [0, 0, 11],
  end: [0, 0, 24],
  radius:openingRadius+3,
  resolution: 64
}).subtract(
    CSG.cylinder({
  start: [0, 0, 11],
  end: [0, 0, 22],
  radius:openingRadius+0.2,
  resolution: 64
})
    ).subtract( hex2.solidFromSlices({
		numslices: 360 * 2 / angle,
		callback: function(t, slice) {
			return this.translate([0, 0, t * 10]).rotate(
						[0,0,0], //center
						[0, 0, 20], //direction
						angle * slice
					);
		}
	}).translate([0,0,8]));
	return [insertRingComplete.translate([0,0,13]), ringCap.rotateX(180).translate(openingRadius * 2,0,0)]}

