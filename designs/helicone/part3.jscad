//Copyright (c) 2021 [gitpharm01] gitpharm01@gmail.com
function main(){
    var grooveCutterBase = polygon({points:[[0,0],[4,0],[4,2]]});
    var grooveCutter = rotate_extrude({fn: 64, startAngle: 0, angle: 360}, translate([5, 0, 0], grooveCutterBase));
        //bump on top of each layers
        var bumpBase = polygon({points:[[-0.5,0],[-0.5,-1.5],[2.6,-1.5],[2.6,0],[2.6,1.5],[2.3,1.5]]});
        var bump = rotate_extrude({fn: 32, startAngle: -15, angle: 30}, translate([6, 0, 0], bumpBase)).translate([0,0,4.5]);
    
    var baseLayer = cylinder({h:3,r: 10, fn: 32}).union(cylinder({start:[0,0,3],end:[0,0,4.5],r1:4.5,r2:4,fn:32})).subtract(cylinder({r:3/Math.cos(30*Math.PI/180) ,h:1.5, fn: 6})).subtract(cylinder({r:3+0.2 ,h:10, fn: 32})).union(bump).translate([-35,0,0]);
    var topLayer = cylinder({h:3,r: 10, fn: 32}).subtract(grooveCutter).subtract(cylinder({start: [0,0,0], end: [0,0,2], r: 3.2, fn: 64})).subtract(cylinder({start: [0,0,2], end: [0,0,3], r: 3*Math.cos(30*Math.PI/180), fn: 6}));
    
    return [baseLayer,topLayer.rotateX(180).translate([0,0,3])];
}

