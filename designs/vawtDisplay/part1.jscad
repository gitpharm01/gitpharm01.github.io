//Vertical Axis Wind Turbine(VAWT) powered display stand by Gitpharm01
//Savonius Turbine

function getParameterDefinitions() {
		return [
			{ name: 'base_diameter', type: 'float', initial: 110, caption: "diameter of turbine base" },
//			{ name: 'shaft_diameter', type: 'float', initial: 8, caption: "diameter of shaft" },
			{ name: 'central_gap', type: 'float', initial: 16, caption: "gap/hollow in the center of turbine" },
			{ name: 'blade_thickness', type: 'float', initial: 2.2, caption: "Max Thickness of each blade" },
			{ name: 'height', type: 'float', initial: 80, caption: "Height of this turbine" },
			{ name: 'blade_twist', type: 'int', initial: 30, caption: "twist angle of a blade" },
			{ name: 'blade_number', type: 'int', initial: 3, caption: "Number of blades" },
			
		];
	}
		
	function main(params) {
	    let base_diameter = params.base_diameter;
	    let central_gap = params.central_gap;
	    let blade_thickness = params.blade_thickness;
	    let height = params.height;
	    
	    let blade_diameter=(base_diameter/2)+(central_gap/2); 
	    
	    let blade_twist = params.blade_twist;
	    let blade_number= params.blade_number;
	    let shaft_diameter = 8.1;
	    
	    
	    
	    
	    let blade_set =  bladeStyle2(base_diameter, central_gap, blade_thickness, height, blade_diameter, blade_twist, blade_number );
		return cylinder({r: base_diameter/2 , h: 0.8, fn:64}).union(cylinder({r: (shaft_diameter/2) + 2.2 , h: 15, fn: 6})).subtract(cylinder({r: (shaft_diameter/2) + 0.2 , h: 20, fn:6})).union(blade_set)
}

							



function bladeStyle1(base_diameter, central_gap, blade_thickness, height, blade_diameter, blade_twist, blade_number){
    let blade_set = []
    
    for(let i=1; i <blade_number+1; i++){
        let cutter =  CAG.circle({ radius: blade_diameter/2 , resolution: 64});
		let bladeCAG = CAG.circle({ radius: blade_diameter/2 , resolution: 64}).subtract(cutter.translate([0,-blade_thickness,0])  )
		let blade = linear_extrude( {height : height, twist:blade_twist, slices: 30} , bladeCAG).translate([- (blade_diameter/2) + (central_gap/2),0,0]).rotateZ(i*(360/blade_number));
	    blade_set.push(blade);
	}
	
    return  union(blade_set ) 
    
}


function bladeStyle2(base_diameter, central_gap, blade_thickness, height, blade_diameter, blade_twist, blade_number){
    let blade_set = []
    //A switch to determine the direction of rotation 
	let isClockwise;
	if (blade_twist >= 0){ isClockwise =1}else{ isClockwise = -1 }
    
    for(let i=1; i <blade_number+1; i++){
        let cutter =  CAG.circle({ radius: (blade_diameter/2 )-blade_thickness/2 , resolution: 64});
        let cutter2 = CAG.rectangle({center: [isClockwise *base_diameter/2 ,0],radius: [base_diameter/2, base_diameter/2]});

		let bladeCAG = CAG.circle({ radius: blade_diameter/2 , resolution: 64}).subtract(cutter  ).subtract(cutter2)
		let blade = linear_extrude( {height : height, twist:  blade_twist, slices: 30} , bladeCAG).translate([0,-(blade_diameter/2)+ (central_gap/2),0]).rotateZ(i*(360/blade_number));
		let bladeFortification;
		if(isClockwise ==1){
		    bladeFortification = torus({ ri:  blade_thickness ,fni:3,fno:64, roti :-30 ,ro: (blade_diameter -blade_thickness)/ 2}).subtract( cube({ size:[blade_diameter + blade_thickness/2,blade_diameter+blade_thickness,5] ,center:[0,-blade_diameter/2  ,  blade_thickness/2]})).translate([0,central_gap/2 - blade_diameter/2,0.8+ blade_thickness/2]).rotateZ(i*( 360/blade_number));
		
		}else{
		
		    bladeFortification = torus({ ri:  blade_thickness ,fni:3,fno:64, roti :-30 ,ro: (blade_diameter -blade_thickness)/ 2}).subtract( cube({ size:[blade_diameter + blade_thickness/2,blade_diameter+blade_thickness,5] ,center:[0, -blade_diameter/2  ,  blade_thickness/2]})).rotateZ(180).translate([0,central_gap/2 - blade_diameter/2,0.8+ blade_thickness/2]).rotateZ(i*( 360/blade_number));
		}
		
		
	    blade_set.push(blade.union(bladeFortification));
	}
	
    return  union(blade_set ) 
    
}


