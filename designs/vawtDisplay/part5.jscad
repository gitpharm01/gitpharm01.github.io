//Vertical Axis Wind Turbine(VAWT) powered display stand by Gitpharm01
//Turbine shaft tip



	function main() {
	    return cylinder({start: [0,0,0], end: [0,0,2.5], r1: 5.6, r2: 5.6, fn: 6}).union( cylinder({start: [0,0,2.5], end: [0,0,5.5], r1: 5.6, r2: 3, fn: 6}) ).union( cylinder({start: [0,0,5.5], end: [0,0,10.5], r1: 2.5, r2: 0, fn: 64}) ).subtract(  
	    cylinder({start: [0,0,0], end: [0,0,2.5], r1: 4.2, r2:4.2, fn:6}) ).subtract( cylinder({start: [0,0,2.5], end: [0,0,4.5], r1: 4.2, r2: 2.5, fn: 6}) ).subtract( cylinder({start: [0,0,4.5], end: [0,0,8.5], r1: 2.5, r2: 0, fn: 64}) );
        

		
		
}



