document.write('<script type="text/javascript" src="interface.js"></script>');

var curVertices = [];
var vertexCount = 0;
var currentFace = 0;
var colors = [];
var pointColors = [];

function setVertexInfo(){
    var vertex = document.getElementById("vertIndex").value;
    var uiX = document.getElementById("coordX");
    var uiY = document.getElementById("coordY");
    var uiZ = document.getElementById("coordZ");
    var r1 = document.getElementById("r1");
    var g1 = document.getElementById("g1");
    var b1 = document.getElementById("b1");
    var a1 = document.getElementById("a1");

    if(+vertex+2 < +curVertices.length)
        if(arraysAreIdentical(curVertices[vertex],curVertices[+vertex+2]))
            curVertices[+vertex+2] = [uiX.value, uiY.value, uiZ.value];
    if(+vertex-2 > 0)
        if(arraysAreIdentical(curVertices[vertex],curVertices[+vertex-2]))
            curVertices[+vertex-2] = [uiX.value, uiY.value, uiZ.value];
    curVertices[vertex] = [uiX.value, uiY.value, uiZ.value];
    colors[vertex] = [r1.value, g1.value, b1.value, a1.value];
}

function changeSelVertex(){
    var vertex = document.getElementById("vertIndex").value;
    var uiX = document.getElementById("coordX");
    var uiY = document.getElementById("coordY");
    var uiZ = document.getElementById("coordZ");
    var r1 = document.getElementById("r1");
    var g1 = document.getElementById("g1");
    var b1 = document.getElementById("b1");
    var a1 = document.getElementById("a1");

    uiX.value = curVertices[vertex][0];
    uiY.value = curVertices[vertex][1];
    uiZ.value = curVertices[vertex][2];

    r1.value = colors[vertex][0];
    g1.value = colors[vertex][1];
    b1.value = colors[vertex][2];
    a1.value = colors[vertex][3];

    for(var i=0; i<pointColors.length; i++){
        pointColors[i] = [0.0,0.0,0.0,1.0];
        if(i == vertex) pointColors[i] = [0.0,1.0,0.0,1.0];
    }
}

function newLayer(){
    currentFace += vertexCount;
    for(var i=0; i<vertexCount; i++){
        curVertices.push([curVertices[i][0],curVertices[i][1],curVertices[i][2]]);
        colors.push(colors[i]);
        pointColors.push([0.0,0.0,0.0,1.0]);
    }
    document.getElementById("vertIndex").max = curVertices.length - 1;
}

function getNumVertices(){
    return curVertices.length();
}

function arraysAreIdentical(arr1, arr2){
    if (arr1.length != arr2.length) return false;
    for (var i = 0, len = arr1.length; i < len; i++){
        if (arr1[i] != arr2[i]){
            return false;
        }
    }
    return true; 
}

function flatten( v )
{
    if ( v.matrix === true ) {
        v = transpose( v );
    }

    var n = v.length;
    var elemsAreArrays = false;

    if ( Array.isArray(v[0]) ) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array( n );

    if ( elemsAreArrays ) {
        var idx = 0;
        for ( var i = 0; i < v.length; ++i ) {
            for ( var j = 0; j < v[i].length; ++j ) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for ( var i = 0; i < v.length; ++i ) {
            floats[i] = v[i];
        }
    }

    return floats;
}