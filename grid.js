document.write('<script type="text/javascript" src="ShapeMaker3D.js"></script>');

function showGrid(){
    program = initShaders( gl, "grid-vertex-shader", "grid-fragment-shader" );
    gl.useProgram( program );
    gl.enable(gl.DEPTH_TEST);
    if(checkBox.checked){
        // Load the data into the GPU
        var bufferId = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(gridPoints), gl.STATIC_DRAW );

        // Associate our shader variables with our data buffer
        var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );

        gl.drawArrays( gl.LINES, 0, gridPoints.length);
    }else{
        gl.clearColor(1.0,1.0,1.0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}

function showAxes(){
    program = initShaders( gl, "grid-vertex-shader", "grid-fragment-shader" );
    gl.useProgram( program );
    if(checkBox2.checked){
        var bufferId = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(gridPoints), gl.STATIC_DRAW );

        // Associate our shader variables with our data buffer
        var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );

        gl.lineWidth(3.0);
        gl.drawArrays( gl.LINES, 0, axis.length);
        gl.lineWidth(1.0);
    }else{
        gl.clearColor(1.0,1.0,1.0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}