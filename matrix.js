document.write('<script type="text/javascript" src="ShapeMaker3D.js"></script>');

function myRotate(x,y,z,objOrCamera) {
    var m;
    if(x!=0) m = rotateX(x*0.1);
    else if(y!=0) m = rotateY(y*0.1);
    else m = rotateZ(z*0.1);

    if(objOrCamera == 'o'){
        for(var i=currentFace; i<curVertices.length; i++){
            var curVerticesAux = [[curVertices[i][0]],[curVertices[i][1]],
            [curVertices[i][2]],[1]];
            var resultMatrix = mult(m,curVerticesAux);
            curVertices[i] = [resultMatrix[0][0],resultMatrix[1][0],resultMatrix[2][0]];
        }
    } else {
        cameraRotate = mult(m,cameraRotate);
        gl.uniformMatrix4fv(objRotateLoc, false, flatten(cameraRotate));
    }
}

function myTranslate(x,y,z){
    var tMat = [
        [1,0,0,x],
        [0,1,0,y],
        [0,0,1,z],
        [0,0,0,1]
    ];

    for(var i=currentFace; i<curVertices.length; i++){
        var curVerticesAux = [[curVertices[i][0]],[curVertices[i][1]],
        [curVertices[i][2]],[1]];
        var resultMatrix = mult(tMat,curVerticesAux);
        curVertices[i] = [resultMatrix[0][0],resultMatrix[1][0],resultMatrix[2][0]];
    }
}

function myScale(x,y,z){
    var sMat = [[x,0,0,0],
                [0,y,0,0],
                [0,0,z,0],
                [0,0,0,1]];

    for(var i=currentFace; i<curVertices.length; i++){
        var curVerticesAux = [[curVertices[i][0]],[curVertices[i][1]],
        [curVertices[i][2]],[1]];
        var resultMatrix = mult(sMat,curVerticesAux);
        curVertices[i] = [resultMatrix[0][0],resultMatrix[1][0],resultMatrix[2][0]];
    }
}

function rotateX(theta){
    var rMat = [
        [1,0,0,0],
        [0,Math.cos(theta),Math.sin(theta),0],
        [0,-Math.sin(theta),Math.cos(theta),0],
        [0,0,0,1]   
    ];

    return rMat;
}

function rotateY(theta){
    var rMat = [
        [Math.cos(theta),0,-Math.sin(theta),0],
        [0,1,0,0],
        [Math.sin(theta),0,Math.cos(theta),0],
        [0,0,0,1]
    ];

    return rMat;
}

function rotateZ(theta){
    var rMat = [
        [Math.cos(theta),-Math.sin(theta),0,0],
        [Math.sin(theta),Math.cos(theta),0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];
    
    return rMat;
}

function mult(m1, m2) {
    var newM = [];
    var result = [];
    if(m1[0].length != m2.length) throw "Invalid sizes"; 
    else {
        for(var i = 0; i < m1.length; i++){
            newM = [];
            for(var j = 0; j < m2[0].length; j++) {
                var temp = 0;
                for(var k = 0; k < m2.length; k++){
                    temp += m1[i][k] * m2[k][j];
                }
                newM.push(temp);
            }
            result.push(newM);
        }
        return result;
    }
}

function ortho( left, right, bottom, top, near, far )
{
    if ( left == right ) { throw "ortho(): left and right are equal"; }
    if ( bottom == top ) { throw "ortho(): bottom and top are equal"; }
    if ( near == far )   { throw "ortho(): near and far are equal"; }

    var w = right - left;
    var h = top - bottom;
    var d = far - near;

    var result = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
    result[0][0] = 2.0 / w;
    result[1][1] = 2.0 / h;
    result[2][2] = -2.0 / d;
    result[0][3] = -(left + right) / w;
    result[1][3] = -(top + bottom) / h;
    result[2][3] = -(near + far) / d;

    return result;
}

function radians( degrees ) {
    return degrees * Math.PI / 180.0;
}

function perspective( fovy, aspect, near, far )
{
    var f = 1.0 / Math.tan( radians(fovy) / 2 );
    var d = far - near;

    var result = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
    result[0][0] = f / aspect;
    result[1][1] = f;
    result[2][2] = -(near + far) / d;
    result[2][3] = -2 * near * far / d;
    result[3][2] = -1;
    result[3][3] = 0.0;

    return result;
}

function lookAt( eye, at, up )
{
    if ( !Array.isArray(eye) || eye.length != 3) {
        throw "lookAt(): first parameter [eye] must be an a vec3";
    }

    if ( !Array.isArray(at) || at.length != 3) {
        throw "lookAt(): first parameter [at] must be an a vec3";
    }

    if ( !Array.isArray(up) || up.length != 3) {
        throw "lookAt(): first parameter [up] must be an a vec3";
    }

    if ( equal(eye, at) ) {
        return mat4();
    }

    var v = normalize( subtract(at, eye) );  // view direction vector
    var n = normalize( cross(v, up) );       // perpendicular vector
    var u = normalize( cross(n, v) );        // "new" up vector

    v = negate( v );

    var result = mat4(
        vec4( n, -dot(n, eye) ),
        vec4( u, -dot(u, eye) ),
        vec4( v, -dot(v, eye) ),
        vec4()
    );

    return result;
}
