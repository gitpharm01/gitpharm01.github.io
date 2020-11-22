function main() {
var clampBar = linear_extrude({ height:25 }, polygon([ [0,0],[0,4],[5,4],[5,-4] ]));
var clamp = clampBar.union(clampBar.rotateX(180).translate([0,-18,25])).union(linear_extrude({ height: 5 }, polygon({points:[ [0,4],[5,4],[5,-22],[0,-22] ]}))).rotateY(90).translate([0,30,5]);

    return clamp
}
