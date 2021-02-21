//Copyright (c) 2021 [gitpharm01] gitpharm01@gmail.com
function getParameterDefinitions() {
    return [
       
        {
            name: 'maxWidth',
            initial: '100',
            type: 'float',
            caption: 'Width of the widest layer:'
        },
        {
            name: 'minWidth',
            initial: '55',
            type: 'float',
            caption: 'Width of the narrawest layer:'
        },
        {
            name: 'layerNumber',
            initial: '1',
            type: 'int',
            caption: 'Number of layers(slow when over 15!):'
        },
        {
            name: 'numberMarks',
            type: 'choice',
            values: ["on", "off"],   
            captions: ["On", "Off"], 
            caption: 'Marking Numbers on the bottom of each layer unit:',
            initial: "on",
            
        },
        {
            name: 'shapeRight',
            type: 'choice',
            values: ["elipse", "star","moon","sun"],   
            captions: ["elipse", "star","moon","sun"], 
            caption: 'Shape on the right tip:',
            initial: "elipse",
        },
        {
            name: 'shapeLeft',
            type: 'choice',
            values: ["elipse", "star","moon","sun"],   
            captions: ["elipse", "star","moon","sun"], 
            caption: 'Shape on the left tip:',
            initial: "elipse",
        }

  ];
}

function main(params) {
    function csgFromSegments (segments) {
        let output = [];
        segments.forEach(segment => output.push(
            rectangular_extrude(segment, { w:1, h:1 })
        ));
    return union(output);
    }
    
    function geoCenterXY(g) {
        var deltax = -(g.getBounds()[0].x + g.getBounds()[1].x) / 2;
        var deltay = -(g.getBounds()[0].y + g.getBounds()[1].y) / 2;

        return g.translate([deltax, deltay,0])
    }

    function makeStar(pointNumber, outerRadius, innerRadius){
        //must have at lesat 3 points
        var pNumber;
        if(pointNumber <3){
            pNumber = 3;
        }else{ pNumber = pointNumber}
        
        var angle = 2* Math.PI / pNumber;
        var points = [];
        for(var i=0; i <pNumber; i++){
            points.push( [outerRadius*Math.cos(angle*i),outerRadius*Math.sin(angle*i)]);
            points.push( [innerRadius*Math.cos(angle*(i+0.5)),innerRadius*Math.sin(angle*(i+0.5))]);
        }
        var star = polygon({points:points});
        return star;
    }
    
    //Points for generating the star
    
    var r1 =12;
    var r2 =7;
    var pOuter =[ [r1*Math.cos(38*Math.PI/180),r1*Math.sin(38*Math.PI/180)], 
                [r1*Math.cos(110*Math.PI/180),r1*Math.sin(110*Math.PI/180)], 
                [r1*Math.cos(182*Math.PI/180),r1*Math.sin(182*Math.PI/180)], 
                [r1*Math.cos(254*Math.PI/180),r1*Math.sin(254*Math.PI/180)], 
                [r1*Math.cos(326*Math.PI/180),r1*Math.sin(326*Math.PI/180)], 
    ];
    var pInner =[ [r2*Math.cos(74*Math.PI/180),r2*Math.sin(74*Math.PI/180)], 
                [r2*Math.cos(146*Math.PI/180),r2*Math.sin(146*Math.PI/180)], 
                [r2*Math.cos(218*Math.PI/180),r2*Math.sin(218*Math.PI/180)], 
                [r2*Math.cos(290*Math.PI/180),r2*Math.sin(290*Math.PI/180)], 
                [r2*Math.cos(362*Math.PI/180),r2*Math.sin(362*Math.PI/180)], 
    ];
    
    //grooveCutter
        var grooveCutterBase = polygon({points:[[0,0],[4,0],[4,2]]});
        var grooveCutter = rotate_extrude({fn: 64, startAngle: 180, angle: 90}, translate([5, 0, 0], grooveCutterBase));
        //bump on top of each layers
        var bumpBase = polygon({points:[[-0.5,0],[-0.5,-1.5],[2.6,-1.5],[2.6,0],[2.6,1.5],[2.3,1.5]]});
        var bump = rotate_extrude({fn: 32, startAngle: -15, angle: 30}, translate([6, 0, 0], bumpBase)).translate([0,0,4.5]);
        
        //central circle plate
        var centralBodyBase = cylinder({r: 10, h: 3,fn: 64}).subtract(grooveCutter).union(bump).union(cylinder({start:[0,0,3],end:[0,0,4.5],r1:4.5,r2:4,fn:32})).subtract(cylinder({r: 3.2, h: 5,fn: 64}));
        
        //tip 
        //Elipse
        var endShape1 = CAG.ellipse({center: [0,0], radius: [6,10],resolution: 72}); 
        //crescent moon
        var endShape2 = circle({ r: 10, resolution: 36}).subtract(circle({ r: 6, resolution: 36}) ).rotateZ(-30); 
        // Star
        var endShape3 = polygon({points:[pOuter[0],pInner[0],
                            pOuter[1],pInner[1],
                            pOuter[2],pInner[2],
                            pOuter[3],pInner[3],
                            pOuter[4],pInner[4]]});
        // sun
        var endShape4 =  makeStar(12,13,6.5).union(circle({r:8,center:true}));
        // Decide tip's shapes "elipse", "star","moon","sun"
        var endShapeR,endShapeL;
        switch (params.shapeRight) {
            case  "elipse":
                endShapeR = endShape1;
                break;
            case "star":
                endShapeR =endShape3;
                break;
            case "moon":
                endShapeR =endShape2;
                break;
            case "sun":
                endShapeR =endShape4;
                break;
            
        }
        switch (params.shapeLeft) {
            case  "elipse":
                endShapeL = endShape1;
                break;
            case "star":
                endShapeL =endShape3;
                break;
            case "moon":
                endShapeL =endShape2;
                break;
            case "sun":
                endShapeL =endShape4;
                break;
            
        }
    //Function to generate all layers
    function makeLayers(layerNumber){
        var layerList = [];
        var layerUnit;
    
        //loop
        for(var i =0; i<layerNumber; i++){
            //arm
            var layerWidth;
            if(layerNumber >1){
               layerWidth = params.minWidth + ((params.maxWidth - params.minWidth) * Math.sin( Math.PI * (i) / (layerNumber -1))); 
            }else{
                layerWidth = (params.minWidth + params.maxWidth)/2;
            }
            var armBase = cube({size:  [layerWidth-15,4,2.8], center: [true,true,false]}).subtract(cylinder({r:10,h:4,fn:64}));
            var endR = geoCenterXY(linear_extrude({height:2.8}, endShapeR));
            var endL = geoCenterXY(linear_extrude({height:2.8}, endShapeL));
            if(params.numberMarks == "on"){
                let vChar =vectorText({ height: 3}, (i+1)+"");
                var charSign = csgFromSegments(vChar).mirroredY().translate([-3,3,0]);
                if(i % 2 ===0){
                layerUnit = centralBodyBase.union(armBase).union(endL.translate([-layerWidth/2 + 6,0,0])).union(endR.mirroredX().mirroredY().translate([layerWidth/2 -6,0,0])).subtract(charSign.translate([layerWidth/2 -7,0,0]));
                layerList.push(layerUnit.translate([0,(i *25)+1,0]));
                }else{
                layerUnit = centralBodyBase.union(armBase).union(endR.translate([-layerWidth/2 + 6,0,0])).union(endL.mirroredX().mirroredY().translate([layerWidth/2 -6,0,0])).subtract(charSign.translate([layerWidth/2 -7,0,0]));
                layerList.push(layerUnit.translate([0,(i *25)+1,0]));
                }
            }else{
                if(i % 2 ===0){
                layerUnit = centralBodyBase.union(armBase).union(endL.translate([-layerWidth/2 + 6,0,0])).union(endR.mirroredX().mirroredY().translate([layerWidth/2 -6,0,0])).subtract(charSign.translate([layerWidth/2 -7,0,0]));
                layerList.push(layerUnit.translate([0,(i *25)+1,0]));
                }else{
                layerUnit = centralBodyBase.union(armBase).union(endR.translate([-layerWidth/2 + 6,0,0])).union(endL.mirroredX().mirroredY().translate([layerWidth/2 -6,0,0])).subtract(charSign.translate([layerWidth/2 -7,0,0]));
                layerList.push(layerUnit.translate([0,(i *25)+1,0]));
                }
            }

            
        }
        
        return layerList
    }
    
   
    var layerNumber = params.layerNumber;
    var totalLayerHeight =(4+0.1)*layerNumber + 3 ;
    
    return  union(makeLayers(params.layerNumber))

}
