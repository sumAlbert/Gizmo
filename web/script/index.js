function main() {
    var canvas=document.getElementById("playArea");
    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log("Fail to get the rendering context for Webgl");
        return;
    }
    var program = createProgram(gl,Gizmo.SHADERS[0].VASHADER_SOURCE,Gizmo.SHADERS[0].FASHADER_SOURCE);
    if(!program){
        console.log('Failed to create program');
    }
    gl.useProgram(program);
    gl.program = program;
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var ANGLE=0;
    var xformMatrix = new Matrix4();
    var xrecoverMatrix =new Matrix4();
    // xformMatrix.setTranslate(0,-0.7,0);
    xformMatrix.setRotate(ANGLE,0,0,1);
    xformMatrix.translate(0.5,-0.7,0);//(-x,-y,)
    xrecoverMatrix.translate(-0.5,0.7,0);//(x,y,)
    var u_xformMatrix = gl.getUniformLocation(gl.program,'u_xformMatrix');
    var u_recoverMatrix = gl.getUniformLocation(gl.program,'u_recoverMatrix');
    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    var a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize');
    var u_FragColor = gl.getUniformLocation(gl.program,'u_FragColor');
    if(a_Position < 0){
        console.log("Failed to get the storage location of a_Position");
    }
    var vertexBuffer = gl.createBuffer();
    var vertices = new Float32Array([
        -1.0, 0.7, -1.0, 0.0, 0.0, 0.0,0.0, 0.7
    ]);
    if(!vertexBuffer){
        console.log('Failed to create the buffer object');
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position,2, gl.FLOAT,false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.uniform4f(u_FragColor,1.0,1.0,0.0,1.0);
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);
    gl.uniformMatrix4fv(u_recoverMatrix, false, xrecoverMatrix.elements);
    gl.vertexAttrib1f(a_PointSize,5.0);
    gl.drawArrays(gl.POINTS,0,3);
    // var vertices = new Float32Array([
    //     0.0, 0.25, -0.25, -0.25, 0.25, -0.25
    // ]);
    gl.uniform4f(u_FragColor,1.0,0.0,0.0,1.0);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);


    canvas.onmousedown = function (ev) {
        var x=ev.clientX;
        var y=ev.clientY;
        var rect=ev.target.getBoundingClientRect();
        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
        console.log([x,y]);
    };
}

function main2() {
    console.log(Gizmo);
    //事件监听
    var PlayArea=new Gizmo.PlayArea();
    PlayArea.createPlayArea();
    var GameGrid=new Gizmo.GameGrid();
    GameGrid.createGrid();
    GameGrid.drawComponents(PlayArea.gl,PlayArea.gl.LINES,80);
    var canvas=document.getElementById("playArea");
    // 鼠标移动事件监听
    // canvas.onmouseover=function () {
    //     drawAllHandler=setInterval(function () {
    //         drawAll();
    //     },16);
    //     canvas.onmousemove = function (ev) {
    //         GameGrid.gridBox.color=GameGrid.gridBox.GREEN;
    //         var x=ev.clientX;
    //         var y=ev.clientY;
    //         var rect=ev.target.getBoundingClientRect();
    //         x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    //         y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    //         mousePosition=[x,y];
    //     };
    //     canvas.onmouseout = function (ev) {
    //         clearInterval(drawAllHandler);
    //         GameGrid.gridBox.color=GameGrid.gridBox.WHITE;
    //         drawAll();
    //         canvas.onmousemove=null;
    //     };
    // };
    //
    // //重新绘制
    // function drawAll() {
    //     PlayArea.gl.clear((PlayArea.gl.COLOR_BUFFER_BIT));
    //     GameGrid.createGrid(PlayArea.gl);
    //     GameGrid.gridBox.createBox(PlayArea.gl);
    // }
}
