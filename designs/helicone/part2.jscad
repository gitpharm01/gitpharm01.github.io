//Copyright (c) 2021 [gitpharm01] gitpharm01@gmail.com
function getParameterDefinitions() {
    return [
        {
            name: 'layerNumber',
            initial: '1',
            type: 'int',
            caption: 'Number of layers:'
        }
  ];
}
function main(params){
    var layerNumber = params.layerNumber;
     var totalLayerHeight =(4.5+0.1)*layerNumber + 5 ;
    var axis = cylinder({start: [0,0,0], end: [0,0,50], r: 3/Math.cos(30*Math.PI/180), fn: 6}).union(cylinder({start: [0,0,50], end: [0,0,totalLayerHeight+50], r: 3, fn: 64})).union(cylinder({start: [0,0,totalLayerHeight +50], end: [0,0,totalLayerHeight + 50 +3], r: 3*Math.cos(30*Math.PI/180), fn: 6}));
    return axis
}
