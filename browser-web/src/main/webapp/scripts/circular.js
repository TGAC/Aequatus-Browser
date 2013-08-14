/**
 * Created with IntelliJ IDEA.
 * User: thankia
 * Date: 13/08/2013
 * Time: 14:05
 * To change this template use File | Settings | File Templates.
 */



var left = 100;
var middle;

function drawCircle(x, y) {
    var svgdiv = jQuery('#svgcircle').svg('get');
//  var svgWrapper = new $.svg._wrapperClass(svgdiv);

    svgdiv.circle(middle, 400, x, {class:'genome',fill: y, opacity:0.7});
}

function drawLines(a, b) {
    var x2 =  parseInt(jQuery("#canvas").css("width")) / 10 * b;

    var svg = jQuery('#svgcircle').svg('get');

    var x = middle + (middle - 450) * Math.cos(a * Math.PI / 180);
    var y = 400 + (middle - 450) * Math.sin(a * Math.PI / 180);

    svg.line(middle, 400, x, y, {strokeWidth: 1, stroke: "#D3D3D3"});
    svg.line(x, y, x2, 0, {strokeWidth: 1, stroke: "#D3D3D3"});
//  svg.line(x2, 250, x2, 0, {strokeWidth: 1, stroke: "gray"});
}

function paths(a, b, l, s, c) {

    var svg = jQuery('#svgcircle').svg('get');
    var path = svg.createPath();

    var x1 = middle + (middle - (s + l / 2)) * Math.cos(a * Math.PI / 180);
    var y1 = 400 + (middle - (s + l / 2)) * Math.sin(a * Math.PI / 180);

    var x2 = middle + (middle - (s + l / 2)) * Math.cos(b * Math.PI / 180);
    var y2 = 400 + (middle - (s + l / 2)) * Math.sin(b * Math.PI / 180);


    svg.path(path.move(x1, y1).arc(middle - s - l / 2, middle - s - l / 2, 30, false, true, x2, y2),
        {id:'trackcircle', title:'here', class:'trackcircle', fill: 'none', stroke: c, strokeWidth: l});

//svg.path(path.move(x1, y1).curveC(x1, y1, (x1+x2)/2, (y1+y2)/2, x2, y2),
    //  {fill: 'none', stroke: '#D90000', strokeWidth: 2});

}

function initiate() {
    middle = parseInt(jQuery("#canvas").css("width")) / 2;
    jQuery('#svgcircle').svg();
    drawCircle(middle - 450, 'lightgray');
    drawCircle(middle - 550, 'gray');
    drawCircle(middle - 650, 'darkgray');
    var a = 10;
    for (var i = 0; i >= -180; i = i - 18) {

        drawLines(i, a);
        a--;
    }
    drawCircle(middle - 750, 'black');

    jQuery('#clear').click(function() {
        jQuery('#svgcircle').svg('get').clear();
    });
    jQuery('#export').click(function() {
        var xml = jQuery('#svgcircle').svg('get').toSVG();
        jQuery('#svgexport').html(xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    });
}

function findAngle(x){

    var startposition = -180+(x - newStart) * 180 / (newEnd - newStart);

    return startposition;
}

function drawoncircle(x,y, l){
    if(x < getBegin()){x = getBegin()}
    if(y > getEnd()){y = getEnd()}

    paths(findAngle(x), findAngle(y), 5, 450+(l*5), "blue");
}

function svgClear(){
    jQuery('#svgcircle').svg();
    jQuery('#svgcircle').svg('get').clear();
    initiate()
}

function screenshot(){
    var canvas = document.getElementById("trackssss");
    var img    = canvas.toDataURL("image/png");


    document.write('<img src="'+img+'"/>');


}