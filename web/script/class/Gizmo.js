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
    //绘制单个网格
    this.GameGridBox=function () {
        this.inherit = GameComponents;
        this.inherit();
        delete this.inherit;
        this.verticesArray=[];
        this.gridBoxSize=[1.0,1.0];
        this.GREEN=[0.0,1.0,0.0,1.0];
        this.RED=[1.0,0.0,0.0,1.0];
        this.WHITE=[1.0,1.0,1.0,1.0];
        this.createBox=function (gl) {
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
            this.drawComponents(gl,gl.LINE_LOOP,4);
        }
    };
    //网格
    this.GameGrid=function () {
        //继承GameComponents
        this.inherit = GameComponents;
        this.inherit();
        delete this.inherit;
        //属性
        this.verticesArray=[];
        this.gridBoxs=[];
        for(var i=0;i<20;i++){
            this.gridBoxs[i]=[];
        }
        this.gridBox=new GameGridBox();
        this.createGrid=function () {
            this.id="GameGrid"+this.randomPostfix();
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
        };
    };

    this.GameComponents=function GameComponents() {
        this.id="";
        this.ANGLE=0;//旋转角度
        this.center=[0.0,0.0];//旋转中心
        this.xformMatrix=new Matrix4();//平移旋转矩阵
        this.xrecoverMatrix =new Matrix4();//恢复矩阵
        this.pointSize=10.0;//点的尺寸
        this.color=[1.0,1.0,1.0,1.0];//颜色
        this.speed=[0.0,0.0];//速度
        this.verticesArray=[];//边界点

        //TODO 包装到函数里面
        this.xformMatrix.setRotate(this.ANGLE,0,0,1);//平移旋转变换矩阵
        this.xformMatrix.translate(-this.center[0],-this.center[1],0);
        this.xrecoverMatrix.translate(this.center[0],this.center[1],0);//恢复矩阵
        //绘制图形
        this.drawComponents=function (gl,kind,n) {
            var a_Position = gl.getAttribLocation(gl.program,'a_Position');
            var u_xformMatrix = gl.getUniformLocation(gl.program,'u_xformMatrix');
            var u_recoverMatrix = gl.getUniformLocation(gl.program,'u_recoverMatrix');
            var a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize');
            var u_FragColor = gl.getUniformLocation(gl.program,'u_FragColor');
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.verticesArray),gl.STATIC_DRAW);
            gl.uniform4f(u_FragColor,this.color[0],this.color[1],this.color[2],this.color[3]);
            gl.uniformMatrix4fv(u_xformMatrix, false, this.xformMatrix.elements);
            gl.uniformMatrix4fv(u_recoverMatrix, false, this.xrecoverMatrix.elements);
            gl.vertexAttrib1f(a_PointSize,this.pointSize);
            gl.vertexAttribPointer(this.a_Position,2, gl.FLOAT,false, 0, 0);
            gl.enableVertexAttribArray(this.a_Position);
            gl.drawArrays(kind,0,n);
        }
        this.randomPostfix=function () {
            return (Math.floor(1000000*Math.random())+''+Math.floor(1000000*Math.random())).substring(0,10);
        }
    };

    this.PlayArea=function PlayArea() {
        this.gl=null;
        this.playAreaComponents=[];
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
        this.drawAll=function () {
            
        }
    };
    return{
        SHADERS: SHADERS,
        PlayArea: PlayArea,
        GameComponents: GameComponents,
        GameGrid: GameGrid
    }
})();