Gizmo=(function () {
    var SHADERS=[{
        VASHADER_SOURCE:'attribute vec4 a_Position;\n' +
                        'attribute float a_PointSize;\n'+
                        'uniform mat4 u_xformMatrix;\n'+
                        'uniform mat4 u_recoverMatrix;\n'+
                        'void main(){\n' +
                        '  gl_Position = u_recoverMatrix*u_xformMatrix*a_Position;\n' +
                        '  gl_PointSize = a_PointSize;\n' +
                        '}\n',
        FASHADER_SOURCE:'precision mediump float;\n'+
                        'uniform vec4 u_FragColor;\n'+
                        'void main(){\n'+
                        '  gl_FragColor = u_FragColor;\n' +
                        '}\n'
    }];//测试用
    var panelController=new PanelController();
    function PanelController() {
        this.newPlayArea=function () {

        }
    }
    this.GameGridBox=function (gl) {
        this.inherit = GameComponents;
        this.inherit(gl);
        delete this.inherit;
        this.verticesArray=[];
        this.gridBoxSize=[1.0,2.0];
        this.GREEN=[0.0,1.0,0.0,1.0];
        this.RED=[1.0,0.0,0.0,1.0];
        this.WHITE=[1.0,1.0,1.0,1.0];
        this.createBox=function () {
            this.verticesArray=[];
            console.log(Math.floor(10*mousePosition[0])+10);
            console.log(Math.floor(10*mousePosition[1])+10);
            var leftBottomX=Math.floor(10*mousePosition[0])/10;
            var leftBottomY=Math.floor(10*mousePosition[1])/10;
            this.verticesArray.push(leftBottomX,leftBottomY);
            this.verticesArray.push(leftBottomX+0.1,leftBottomY);
            this.verticesArray.push(leftBottomX+0.1,leftBottomY+0.1);
            this.verticesArray.push(leftBottomX,leftBottomY+0.1);
            console.log(this);
            this.drawComponents(this.gl.LINE_LOOP,4);
        }
    };

    this.GameGrid=function (gl) {
        this.inherit = GameComponents;
        this.inherit(gl);
        delete this.inherit;
        this.verticesArray=[];
        this.gridBoxs=[];
        for(var i=0;i<20;i++){
            this.gridBoxs[i]=[];
        }
        this.gridBox=new GameGridBox(gl);
        this.createGrid=function () {
            this.verticesArray=[];
            var x_start=-1.0;
            while(Math.abs(x_start-1.0)>0.0001){
                x_start=x_start+0.1;
                this.verticesArray.push(x_start,-1.0);
                this.verticesArray.push(x_start,1.0);
            }
            x_start=-1.0;
            while(Math.abs(x_start-1.0)>0.0001){
                x_start=x_start+0.1;
                this.verticesArray.push(-1.0,x_start);
                this.verticesArray.push(1.0,x_start);
            }
            this.drawComponents(this.gl.LINES,80);
        };
    };

    this.GameComponents=function GameComponents(gl) {
        this.ANGLE=0;//旋转角度
        this.center=[0.0,0.0];//旋转中心
        this.xformMatrix=new Matrix4();//平移旋转矩阵
        this.xrecoverMatrix =new Matrix4();//恢复矩阵
        this.pointSize=10.0;//点的尺寸
        this.color=[1.0,1.0,1.0,1.0];//颜色
        this.speed=[0.0,0.0];
        this.direction=[0.0,0.0];
        this.verticesArray=[
            -0.9, 0.7, -0.9, 0.0, 0.0, 0.0,0.0, 0.7
        ];
        this.gl=gl;
        this.xformMatrix.setRotate(this.ANGLE,0,0,1);
        this.xformMatrix.translate(-this.center[0],-this.center[1],0);
        this.xrecoverMatrix.translate(this.center[0],this.center[1],0);
        this.drawComponents=function (kind,n) {
            var a_Position = this.gl.getAttribLocation(this.gl.program,'a_Position');
            var u_xformMatrix = this.gl.getUniformLocation(this.gl.program,'u_xformMatrix');
            var u_recoverMatrix = this.gl.getUniformLocation(this.gl.program,'u_recoverMatrix');
            var a_PointSize = this.gl.getAttribLocation(this.gl.program,'a_PointSize');
            var u_FragColor = this.gl.getUniformLocation(this.gl.program,'u_FragColor');
            this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(this.verticesArray),this.gl.STATIC_DRAW);
            this.gl.uniform4f(u_FragColor,this.color[0],this.color[1],this.color[2],this.color[3]);
            this.gl.uniformMatrix4fv(u_xformMatrix, false, this.xformMatrix.elements);
            this.gl.uniformMatrix4fv(u_recoverMatrix, false, this.xrecoverMatrix.elements);
            this.gl.vertexAttrib1f(a_PointSize,this.pointSize);
            this.gl.vertexAttribPointer(this.a_Position,2, this.gl.FLOAT,false, 0, 0);
            this.gl.enableVertexAttribArray(this.a_Position);
            this.gl.drawArrays(kind,0,n);
        }
    };

    this.PlayArea=function PlayArea() {
        this.gl=null;
        this.SHADERS=[{
            VASHADER_SOURCE:'attribute vec4 a_Position;\n' +
            'attribute float a_PointSize;\n'+
            'uniform mat4 u_xformMatrix;\n'+
            'uniform mat4 u_recoverMatrix;\n'+
            'void main(){\n' +
            '  gl_Position = u_recoverMatrix*u_xformMatrix*a_Position;\n' +
            '  gl_PointSize = a_PointSize;\n' +
            '}\n',
            FASHADER_SOURCE:'precision mediump float;\n'+
            'uniform vec4 u_FragColor;\n'+
            'void main(){\n'+
            '  gl_FragColor = u_FragColor;\n' +
            '}\n'
        }];
        this.createPlayArea=function(){
            this.gl=getWebGLContext(document.getElementById("playArea"));
            if(!this.gl){
                console.log("Fail to get the rendering context for Webgl");
                return;
            }
            var program = createProgram(this.gl,this.SHADERS[0].VASHADER_SOURCE,this.SHADERS[0].FASHADER_SOURCE);
            if(!program){
                console.log('Failed to create program');
            }
            this.gl.useProgram(program);
            this.gl.program = program;
            this.gl.clearColor(0.0,0.0,0.0,1.0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            var vertexBuffer =this.gl.createBuffer();
            if(!vertexBuffer){
                console.log('Failed to create the buffer object');
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        };
    };
    return{
        SHADERS: SHADERS,
        PanelController:panelController,
        PlayArea: PlayArea,
        GameComponents: GameComponents,
        GameGrid: GameGrid,
    }
})();