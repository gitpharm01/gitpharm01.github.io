//Copyright (c) 2020 [gitpharm01] gitpharm01@gmail.com
function getParameterDefinitions() {
    return [
        {
            name: 'textSize',
            initial: '12',
            type: 'float',
            caption: 'Size of each character:'
        },
        {
            name: 'strokeThickness',
            initial: '4',
            type: 'float',
            caption: 'Stroke thickness:'
        },
        {
            name: 'basePlateHeight',
            initial: "5",
            type: 'float',
            caption: 'Height of the BasePlate:'
        },
        {
            name: 'text1',
            initial: "MESSAGE",
            type: 'text',
            caption: 'text on the front'
        },
        
        {
            name: 'text2',
            initial: "1234567",
            type: 'text',
            caption: 'secondary text '
        }
  ];
}

function main(params) {
    var text1 = params.text1;
    var text2 = params.text2;
    var textSize = params.textSize
    //Function to get geometry's geometry center to the point[0,0,0]
    function geoCenter(g) {
        var deltax = -(g.getBounds()[0].x + g.getBounds()[1].x) / 2;
        var deltay = -(g.getBounds()[0].y + g.getBounds()[1].y) / 2;
        var deltaz = -(g.getBounds()[0].z + g.getBounds()[1].z) / 2;
        return g.translate([deltax, deltay, deltaz])
    }
    //Function to turn a char into
    function csgFromChar(charVector) {
		console.log("character:");
		console.log( charVector)
        var segments = charVector.segments;
        let output = [];
        segments.forEach(segment => output.push(
            rectangular_extrude(segment, {
                w: params.strokeThickness,
                h: charVector.width *2
            })
        ));
        return union(output);
    }
    //Make geometry fro a character
    function makeCharGeometry(character){
        //Detect "blank" and add a cube of the full character size
        if(character == " "){
            return cube({size:[textSize*1.6,textSize*2,textSize*2]})
        }else{
            return csgFromChar(vectorChar({height : textSize, width :textSize},character))
        }
    }
    
    //compare the lengths of two texts, Fill shorter one with blanks to get identical length
    if(params.text1.length > params.text2.length){
        for(var i =0; i < (params.text1.length - params.text2.length);i++){
            text2 += " ";
        }
    }else if(params.text1.length < params.text2.length){
        for(var i =0; i <(params.text2.length - params.text1.length);i++){
            text1 += " ";
        }
    }
    //console.log("text1: " + text1+ "// ");
    //console.log("text2: " + text2 + "// ");
    var o = [];
    for (var i = 0; i < text1.length; i++) {
        var shape1 = makeCharGeometry( text1.charAt(i));
		//console.log(shape1.getBounds()[0].x - shape1.getBounds()[1].x)
        var shape2 = makeCharGeometry( text2.charAt(i));
        o.push(intersection(geoCenter(shape1), geoCenter(shape2.rotateY(90))).translate([textSize *1.6 * i, 0, -(textSize*1.6 * i)]));
        
        
    }
    var circleBase = circle({r: textSize, fn:64});
    var hull =chain_hull( circleBase.translate([-textSize,-textSize,0]), circleBase.translate([(text1.length -1.5)* textSize *1.6,(text1.length-1.5) * textSize*1.6,0]));
    
    var basePlate = linear_extrude({ height: params.basePlateHeight },hull).rotateX(-90);
    var finalOutPut = [];
    for(var i =0; i<text1.length;i++){
        
        finalOutPut.push( o[i].translate([0, -o[i].getBounds()[0].y + params.basePlateHeight -1 ,0])) ;
    }

    return union(finalOutPut).union(basePlate).rotateX(90)

}
