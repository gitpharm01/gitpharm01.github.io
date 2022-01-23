//Vertical Axis Wind Turbine(VAWT) powered display stand by Gitpharm01
//TurbineCage upper part

//Make involute gear set model. 2022 Gitpharm01 at Foundry X
//reference:  Involute spur gear builder jscad script. (http://opensource.org/licenses/mit-license.php). Copyright 2014 Dr. Rainer Hessmer Licensed under the MIT license

function getParameterDefinitions() {
		return [    {
            //parameters to calculate the correct ring hole for platform pinion 
            name: 'gearRingDiameter',
            caption: 'A.Outer diameter of gear ring:',
            type: 'float',
            initial: 100
        },{
            name: 'pressureAngle',
            caption: 'B. Pressure Angle :',
            //(common values are 14.5, 20 and 25 degrees)
            type: 'float',
            initial: 20
        },
        {
            name: 'clearance',
            caption: 'C. Clearance :',
            //(minimal distance between the apex of a tooth and the trough of the other gear; in length units)
            type: 'float',
            initial: 0.1
        },
        {
            name: 'backlash',
            caption: 'D. Backlash :',
            //(minimal distance between meshing gears; in length units)
            type: 'float',
            initial: 0.3
        },
        {
            name: 'profileShift',
            caption: 'E. Profile Shift :',
            //(indicates what portion of gear one\'s addendum height should be shifted to gear two. E.g., a value of 0.1 means the adddendum of gear two is increased by a factor of 1.1 while the height of the addendum of gear one is reduced to 0.9 of its normal height.)
            type: 'float',
            initial: 0.0
        },
        {
            name: 'wheel1ToothCount',
            caption: 'F.Gear 1 Tooth Count :',
            //Fixed to internal gears
            //original : n1 > 0: external gear; n1 = 0: rack; n1 < 0: internal gear
            type: 'int',
            initial: 79
        },
        {
            name: 'wheel2ToothCount',
            caption: 'H. Gear 2 Tooth Count:',
            type: 'int',
            initial: 11
        }
			
		];
	}
		
var g_ExpandToCAGParams = {
    pathradius: 0.01,
    resolution: 2
};

var GearType = {
    Regular: 0,
    Internal: 1,
    Rack: 2
};


function main(params) {
        /*
	    //Constant setting: center distance between two bearing/gears = 35 mm 
	    const CENTER_DISTANCE = 25;
	    let radius = ( params['base_diameter'] /2 ) + 10;
        */
        
        //calculate platform pinion gear distance to the center
        let circularPitchRestored = params.gearRingDiameter * Math.PI / (Math.abs(params.wheel1ToothCount) + Math.abs(params.wheel2ToothCount));
        let diametralPitch = Math.PI / circularPitchRestored;
        let pitchDiameter1 =params.wheel1ToothCount / diametralPitch;
        let pitchDiameter2 =params.wheel2ToothCount / diametralPitch;
        let Distance = (pitchDiameter1 - pitchDiameter2 )/2;
        
        let radius = Distance*2;
        
	    //create socket for cage pillars
	    let tipSocket = CAG.circle( {center: [0,0], radius: 4.5, resolution: 6} );
	    let pillarHole = CAG.circle( {center: [0,0], radius: 2.5, resolution: 3} );
	    
	    let armBase = CAG.rectangle({center: [0,(radius / 2) ], radius: [ 2.5 , radius/2]}).subtract(tipSocket.translate([0,radius,0]));
		let cageArmCAG = union(armBase , tipSocket.subtract(pillarHole.rotateZ(-30)).translate([0,radius,0]));
		
		//create trhiplet CAG shapes for full turbine build
		let cageArm = linear_extrude({ height : 4}, cageArmCAG.union(cageArmCAG.rotateZ(120)).union(cageArmCAG.rotateZ(240))); 
		
		let cylinderBase = cylinder({start: [0,Distance,0], end: [0,Distance,10], r:7, fn: 64});
		
		let hoeCutter = cylinder({start: [0,Distance,0], end: [0,Distance,10], r:4.1, fn: 64});
		
		
	    let cageBase = cageArm.union(cylinder({start: [0,0,0], end: [0,0,8], r:7, fn: 64})).subtract( cylinder({start: [0,0,0], end: [0,0,5.8], r1:3, r2:0, fn: 64}) ).union(cylinder({start: [0,0,8], end: [0,0,18], r:3.9, fn: 64})).union(cylinderBase).union(cylinderBase.rotateZ(120)).union(cylinderBase.rotateZ(240)).subtract(hoeCutter).subtract(hoeCutter.rotateZ(120)).subtract(hoeCutter.rotateZ(240)) ;
	    return cageBase

		
		
}



