function getParameterDefinitions() {
    return [
        {
            name: 'basketWidth',
            initial: '100',
            type: 'float',
            caption: 'Width of the Basket in mm:'
        },
        {
            name: 'layerNumber',
            initial: '3',
            type: 'float',
            caption: 'Nuber of layers, Minimum is 2:'
        }
  ];
}


function main(params){
    var basketWidth = params.basketWidth;
    var edgeNumber = 4;
    var radius = ( basketWidth /2 ) /(Math.sin(180/edgeNumber * Math.PI / 180))-5;
    
    var interLayerNumber;
    if(params.layerNumber<2){
        interLayerNumber =0;
    }else{
        interLayerNumber = params.layerNumber -2;
    }
    //Inner piece
    var baseShape1 = CAG.fromPoints([ [0,0],[3,0],[3,0.4],[2,1.4],[2, 8.1],[3, 9.1], [3,9.5], [1,9.5], [0,8.5] ]);
    //Inter piece
    var baseShape2 = CAG.fromPoints([ [0,0],[2.4,0],[2.4,0.4],[1.4,1.4],[1.4, 8.1],[2.4, 9.1], [2.4,9.5], [0.4,9.5], [-0.6,8.5],[-0.6,2.9], [-1.6,1.9],[-1.6,1.5] ]);
    //Outer piece
    var baseShape3 = CAG.fromPoints([ [0,0],[2.4,0],[3.9,1.5],[3.9,8], [2.4,9.5], [0.4,9.5], [-0.6,8.5],[-0.6,2.9], [-1.6,1.9],[-1.6,1.5] ]);
    //Frame
    var baseShape4 = CAG.fromPoints([ [-2.5,0],[3,0],[4,1],[4,8.5], [3,9.5], [-2.5,9.5] ]);
    
    //joint for flipping the basket body horizontally 
    var jointCylinder = cylinder({start: [0,0,0], end: [0,0,6], r1: 3.5, r2: 2, fn: 64}).rotateX(90).translate([0, -(radius*(Math.sin(180/edgeNumber * Math.PI / 180))) +5.5 ,4.75]);
    var cutterCylinder =  cylinder({start: [0,0,0], end: [0,0,6], r1: 3.8, r2: 2.3, fn: 64}).rotateX(90).translate([0, -(radius*(Math.sin(180/edgeNumber * Math.PI / 180))) +5.5 ,4.75]);
    var jointPair = jointCylinder.union(jointCylinder.mirroredY());
    var jointHoleCutter = cutterCylinder.translate([0,-0.5]).union(cutterCylinder.translate([0,-0.5]).mirroredY());
    
    //generate a groove cutter for the stablizers to slide in
    var cutterBase = CAG.fromPoints([[1.75,0],[3.25,-2.5],[-3.25,-2.5],[-1.75,0]]).rotateZ(180).extrude({offset:[0,0,6]}).translate([0,2.25,0]);
    var cutter = cutterBase.union(cutterBase.mirroredY());
    
    //Create a base for the system to sit on
    var frameBaseInner = cylinder({r: 6, h: 9.5, center: [true, true, false]}).cutByPlane( CSG.Plane.fromPoints([0,5,0], [0, 10, 5], [0, 2, 3])).scale([1.5, 2.6*basketWidth / 45,1]).subtract(cutter.scale([1,1,2]).rotateX(90).rotateZ(90).translate([-12,12.5,4.75])).translate([(basketWidth/2) + 10,0,0]);
    
    var frameBaseCutter = cylinder({r: 6, h: 9.5, center: [true, true, false]}).cutByPlane( CSG.Plane.fromPoints([0,5,0], [0, 10, 5], [0, 2, 3])).scale([1.7, 2.9 * basketWidth /45,1]).translate([(basketWidth/2) + 10,0,0]);
    
    var frameBaseOuter = CSG.cube({  center: [basketWidth/2 +2, 0, 4.75],  radius: [8 , basketWidth/2, 4.75]} ).subtract(frameBaseCutter);
    
    var frameBaseAxis = cylinder({start: [basketWidth/2+10 ,0,4.75], end: [basketWidth/2 + 6 ,0,4.75], r:4.75 / (Math.sin(60 *Math.PI/180)), fn: 6}).union(cylinder({start: [basketWidth/2 +6 ,0,4.75], end: [basketWidth/2-3 ,0,4.75], r:2.65, fn: 50}));
    var frameBaseAxisCutter = cylinder({start: [basketWidth/2+10 ,0,4.75], end: [basketWidth/2 +5 ,0,4.75], r:6, fn: 50}).union(cylinder({start: [basketWidth/2 + 6,0,4.75], end: [basketWidth/2 ,0,4.75], r:3, fn: 50}));
    
    var frameBase = frameBaseOuter.union(frameBaseInner).subtract(frameBaseAxisCutter).union(frameBaseAxis);
    
    // Create the outer piece and frame geometry from shapes
    var outerPiece =  rotate_extrude({
        fn: 4
    }, baseShape3.translate([radius - 10 , 0, 0]));
    
    var frame =  rotate_extrude({
        fn: 4
    }, baseShape4.translate([radius, 0, 0])).subtract(jointHoleCutter.rotateZ(-45)).union(outerPiece);
    
    //Made by gitpharm
    var l = vectorText({height:3},"GPharm");
    var o = [];
    l.forEach(function(pl) {                  
        o.push(rectangular_extrude(pl, {w: 1, h: 1})); 
    });
    
    frame = frame.rotateZ(45).subtract(cutter.rotateX(90).rotateZ(90).translate([-basketWidth/2 ,0,4.75])).subtract(cutter.rotateX(90).translate([9,-basketWidth/2 +6,4.75])).subtract(cutter.rotateX(90).translate([9,basketWidth/2 ,4.75])).union(union(o).rotateX(90).translate([-20,-basketWidth/2+1 ,2.75])).rotateZ(-45);
    var temp;
    function addPieces(framePlusOuter){
        
        for (var i =1; i<(interLayerNumber+2); i++){
        if(i == interLayerNumber+1){
        //add the inner layer piece
            temp = rotate_extrude({fn: 4}, baseShape1.translate([(radius-10) - (3.7*i) -0.7 , 0, 0]));
            var basePlateSize = ((radius-10) - 3.7*i)*(Math.sin(180/edgeNumber * Math.PI / 180));
            var basePlate = CSG.cube({  center: [0, 0, 1.25],  radius: [basePlateSize , basePlateSize , 1.25]} );
            framePlusOuter = framePlusOuter.union(temp).union(basePlate.rotateZ(45));
        }else{
        //add inter layer pieces
            temp = rotate_extrude({fn: 4}, baseShape2.translate([(radius-10) - 3.7*i, 0, 0]));
            framePlusOuter = framePlusOuter.union(temp);

        }
    }   
    return framePlusOuter;
    }
    
//.cutByPlane( CSG.Plane.fromPoints([0,5,0], [0, 10, 5], [0, 2, 3]))    
    return addPieces(frame).rotateZ(45).union(jointPair).union(frameBase)
}
