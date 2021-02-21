//Copyright (c) 2021 [gitpharm01] gitpharm01@gmail.com
function main(){
    function csgFromSegments (segments) {
        let output = [];
        segments.forEach(segment => output.push(
        rectangular_extrude(segment, { w:1, h:1 })
        ));
    return union(output);
    }
    var gitpharm =vectorText({ height: 4, align: 'right', lineSpacing: 2, extrudeOffset: 1 }, 'GitPharm');
    
    var baseStand = cylinder({start: [0,0,0], end: [0,0,10], r1: 30,r2:25, fn: 6}).union(cylinder({r: 6, h: 15,fn :32})).rotateZ(30).subtract(cylinder({start: [0,0,0], end: [0,0,50], r: 3/Math.cos(30*Math.PI/180)+0.2, fn: 6}));
return baseStand.union(csgFromSegments(gitpharm).translate([-15,-14,10]));
}
