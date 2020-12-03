function getParameterDefinitions() {
    return [
        {
            name: 'tweakDistance',
            initial: '-0.5',
            type: 'float',
            caption: 'A small distance to "Tweak" the width of the clamp'
        }
  ];
}

function main(params) {

    var tweakDistance = params.tweakDistance
    var clampBar = linear_extrude({
        height: 25
    }, polygon([[0, 0], [0, 4], [5, 4], [5, -4]]));
    var clamp = clampBar.union(clampBar.rotateX(180).translate([0, -18 - tweakDistance, 25])).union(linear_extrude({
        height: 5
    }, polygon({
        points: [[0, 4], [5, 4], [5, -22 - tweakDistance], [0, -22 - tweakDistance]]
    }))).rotateY(90).translate([0, 30, 0]);

    return clamp
}
