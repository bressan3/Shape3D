var gl;

var GRIDWIDTH=0.1;
var gridBuffer;
var gridColorBuffer;
var gridPoints;
var gridColors = [];

var axisBuffer;
var axisColorBuffer;
var axis;
var axisColors = [];

var bufferId;
var colorId;
var vColor;
var vPosition;
var program;

var objRotate;
var objRotateLoc;
var changed=false;

var pMatrixLoc;

var pointColors;
var lastY = 0;

var checkBox;
var checkBox2;
var checkBox3;

var cameraRotate = [];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    gl = canvas.getContext("webgl");
    if ( !gl ) { alert( "WebGL isn't available" ); }
    checkBox = document.getElementById("ShowGrid");
    checkBox2 = document.getElementById("ShowAxes");
    checkBox3 = document.getElementById("ShowPoints");

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // turn on hidden-surface removal algorithm
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    gridPoints=[];
    for(var i=-1;i<=1;i+=GRIDWIDTH) { //grid lines
        gridPoints.push([i,0,-1]); gridColors.push([0.0,0.0,0.0,0.5]);
        gridPoints.push([i,0,1]); gridColors.push([0.0,0.0,0.0,0.5]);
        gridPoints.push([-1,0,i]); gridColors.push([0.0,0.0,0.0,0.5]);
        gridPoints.push([1,0,i]); gridColors.push([0.0,0.0,0.0,0.5]);
    }
    gridBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, gridBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(gridPoints), gl.STATIC_DRAW);

    gridColorBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, gridColorBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(gridColors), gl.STATIC_DRAW);
    
    axis = [
        [-2,0,0],[2,0,0],
        [0,-2,0],[0,2,0],
        [0,0,-2],[0,0,2]
    ];

    axisColors = [  
        [1.0,0.0,0.0,1.0],[1.0,0.0,0.0,1.0],
        [0.0,1.0,0.0,1.0],[0.0,1.0,0.0,1.0],
        [0.0,0.0,1.0,1.0],[0.0,0.0,1.0,1.0],
    ];

    axisBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, axisBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(axis), gl.STATIC_DRAW);

    axisColorBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, axisColorBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(axisColors), gl.STATIC_DRAW);

    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(curVertices), gl.STATIC_DRAW);

    colorId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorId);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    objRotate = [
     [0.5071067811865475, 0, -0.7071067811865475, -0],
     [-0.408248290463863, 0.816496580927726, -0.408248290463863, -0],
     [0.5773502691896257, 0.5773502691896257, 0.5773502691896257, -0.08660254037844387],
     [0, 0, 0, 1]];
    objRotateLoc = gl.getUniformLocation(program, "vTrans");
    gl.uniformMatrix4fv(objRotateLoc, false, flatten(objRotate));
    pMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    gl.uniformMatrix4fv(pMatrixLoc, false, flatten(ortho(-2,2,-2,2,2,-2)));

    cameraRotate = objRotate.slice(0);

    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    if(checkBox.checked) showGrid();
    if(checkBox2.checked) showAxes();
    renderShape();
    if(checkBox3.checked) renderPoints();

    requestAnimFrame(render);
}

function renderShape(){
    // Load the data into the GPU
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(curVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, colorId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );

    gl.drawArrays( gl.TRIANGLES, 0, curVertices.length);
}

function showGrid(){
    if(checkBox.checked){
        gl.bindBuffer( gl.ARRAY_BUFFER, gridColorBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(gridColors), gl.STATIC_DRAW );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );        

        gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(gridPoints), gl.STATIC_DRAW );
        gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

        gl.drawArrays( gl.LINES, 0, gridPoints.length);
    }else{
        gl.clearColor(1.0,1.0,1.0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}

function showAxes(){
    if(checkBox2.checked){
        gl.bindBuffer( gl.ARRAY_BUFFER, axisColorBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(axisColors), gl.STATIC_DRAW );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );

        gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(axis), gl.STATIC_DRAW );
        gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

        gl.lineWidth(3.0);
        gl.drawArrays( gl.LINES, 0, axis.length);
        gl.lineWidth(1.0);
    }else{
        gl.clearColor(1.0,1.0,1.0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}

function renderPoints(){
    gl.bindBuffer(gl.ARRAY_BUFFER, colorId);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointColors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(curVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    
    gl.drawArrays(gl.POINTS, 0, curVertices.length);
}