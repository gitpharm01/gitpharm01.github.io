//Copyright (c) 2020 [gitpharm01] gitpharm01@gmail.com
function getParameterDefinitions () {
  return [
    {name: 'handleWidth', initial: '16', type: 'float', caption: 'Width of the handle'},
    {name: 'handleLength', initial: '50', type: 'float', caption: 'Height of the handle'},
    {name: 'volume', initial: '2500', type: 'float', caption: 'Volume of the spoon'},
	{name: 'text', initial: "Volume: 2.5 cc", type: 'text', caption: 'text or mark on the handle'}
  ];
}

function main (params) {
  var handleWidth = params.handleWidth;
  var handleLength = params.handleLength;
  var volume = params.volume;
  var bowlRadius = Math.cbrt( (3 * volume )/( 2 * Math.PI));
  console.log(bowlRadius )
  var handleText = vector_text(0,0,params.text);
  var textList = [];
  handleText.forEach(function(pl) {
      textList.push(rectangular_extrude(pl, {w: 6, h: 2}));
  });
  var exturdedText = union(textList).scale([0.2,0.2,1]).translate([bowlRadius+2,0,-3]).mirroredY().rotateZ(90);
  
  var bowl = sphere(bowlRadius+2).subtract(sphere(bowlRadius)).cutByPlane(CSG.Plane.fromPoints([0,0,0], [10, 0, 0], [10, 10, 0]));
  
  var handle = cube([handleWidth,handleLength,2]).union(cylinder({start: [handleWidth/2,handleLength,0], end: [handleWidth/2,handleLength,2], r: handleWidth/2, fn: 50})).translate([-handleWidth/2,bowlRadius*0.6,-2]).subtract(sphere(bowlRadius))  

  return handle.union(bowl).union(exturdedText).rotateX(180)
}

