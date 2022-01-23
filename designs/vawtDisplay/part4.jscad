//Vertical Axis Wind Turbine(VAWT) powered display stand by Gitpharm01
//cage pillars and Main shaft


function getParameterDefinitions() {
		return [
					{ name: 'height', type: 'float', initial: 80, caption: "Height of turbine" },
			
		];
	}
		
	function main(params) {
	    let pillarHeight = params['height'] + 30;
	    let shaftHeight =  params['height'] + 18;

	    //create cage pillars
	    let pillarBody = cylinder({r: 3, h: pillarHeight,center: true,fn: 3});
	    let pillarTip = cylinder({r: 2.3, h:4 ,fn: 3}).translate([ 0.7,0,0  ]);
	    let pillar = ( pillarBody.union(pillarTip.translate([0,0,pillarHeight / 2])).union(pillarTip.translate([0,0, (-pillarHeight / 2) -4])) ).rotateZ(-30).rotateX(90);
	    pillar = pillar.translate([0,0, - pillar.getBounds()[0].z]);
	    let shaft =  cylinder({start: [-10,0, -shaftHeight/2], end: [-10,0,shaftHeight/2], r:4, fn:6}).rotateX(90)
	    shaft = shaft.translate([0,0,- shaft.getBounds()[0].z])
	    return [pillar, pillar.translate([10,0,0]), pillar.translate([20,0,0]),shaft]

}



