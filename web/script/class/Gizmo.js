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

    this.Absorber=function () {
        this.inherit = GameComponents;
        this.inherit();
        delete this.inherit;

        this.id="Absorber"+this.randomPostfix();
        this.size=1;
        this.fixFlag=false;
        this.startFlag=false;
        this.centers=[];
        this.physicsAttr=true;
        this.update=function (mousePosition) {
            this.verticesArray=[];
            var leftUpperX=Math.floor(10*mousePosition[0])/10;
            var leftUpperY=Math.floor(10*mousePosition[1])/10+0.1;
            this.center=[leftUpperX+0.05*this.size,leftUpperY-0.05*this.size];
            this.vertexsByCenter();
        };
        this.draw=function (gl,mousePosition) {
            if(!this.fixFlag)
                this.update(mousePosition);
            this.drawComponents(gl,gl.TRIANGLES,this.verticesArray.length/2);
        };
        this.updateCenters=function () {
            if(this.centers.length===0){
                this.centers.push(this.center[0],this.center[1]);
            }
            else{
                var lastCentersX=this.centers[this.centers.length-2];
                var lastCentersY=this.centers[this.centers.length-1];
                while (Math.abs(this.center[0]-lastCentersX)>0.001){
                    if(this.center[0]<lastCentersX){
                        lastCentersX=lastCentersX-0.1;
                    }
                    else{
                        lastCentersX=lastCentersX+0.1;
                    }
                    if(!this.againCenter(lastCentersX,lastCentersY)){
                        this.centers.push(lastCentersX,lastCentersY);
                    }
                }
                while (Math.abs(this.center[1]-lastCentersY)>0.001){
                    if(this.center[1]<lastCentersY){
                        lastCentersY=lastCentersY-0.1;
                    }
                    else{
                        lastCentersY=lastCentersY+0.1;
                    }
                    if(!this.againCenter(lastCentersX,lastCentersY)){
                        this.centers.push(lastCentersX,lastCentersY);
                    }
                }
            }
            console.log(this.centers);
        };
        this.vertexsByCenter=function () {
            this.verticesArray=[];
            for(var i=0;i<this.centers.length;i=i+2){
                var tempCenterX=this.centers[i];
                var tempCenterY=this.centers[i+1];
                //左上角
                this.verticesArray.push(tempCenterX-0.05*this.size,tempCenterY+0.05*this.size);
                this.verticesArray.push(tempCenterX-0.05*this.size,tempCenterY-0.05*this.size);
                this.verticesArray.push(tempCenterX+0.05*this.size,tempCenterY+0.05*this.size);
                //右下角
                this.verticesArray.push(tempCenterX+0.05*this.size,tempCenterY+0.05*this.size);
                this.verticesArray.push(tempCenterX-0.05*this.size,tempCenterY-0.05*this.size);
                this.verticesArray.push(tempCenterX+0.05*this.size,tempCenterY-0.05*this.size);
            }
        };
        this.againCenter=function (distX,distY) {
            for(var i=0;i<this.centers.length;i=i+2){
                if(Math.abs(distX-this.centers[i])<0.0001&&Math.abs(distY-this.centers[i+1])<0.0001){
                    return true;
                }
                else{
                    return false;
                }
            }
            return false;
        }
    };

    this.Baffle=function () {
        this.inherit = GameComponents;
        this.inherit();
        delete this.inherit;

        this.id="Baffle"+this.randomPostfix();
        this.size=1;
        this.fixFlag=false;
        this.physicsAttr=true;
        this.rotateSpeed=3.0;//旋转速度
        this.update=function (mousePosition) {
            this.verticesArray=[];
            var leftUpperX=Math.floor(10*mousePosition[0])/10;
            var leftUpperY=Math.floor(10*mousePosition[1])/10+0.1;
            this.center=[leftUpperX+0.05*this.size,leftUpperY-0.05*this.size];
            this.verticesArray.push(this.center[0]-0.05*this.size,this.center[1]+0.01);
            this.verticesArray.push(this.center[0]-0.05*this.size,this.center[1]-0.01);
            this.verticesArray.push(this.center[0]+0.05*this.size,this.center[1]-0.01);
            this.verticesArray.push(this.center[0]+0.05*this.size,this.center[1]+0.01);
            this.rotateAngle();
        };
        this.draw=function (gl,mousePosition) {
            if(!this.fixFlag)
                this.update(mousePosition);
            this.drawComponents(gl,gl.TRIANGLE_FAN,4);
        };
        this.vertexsByCenter=function () {
            this.verticesArray=[];
            this.verticesArray.push(this.center[0]-0.05*this.size,this.center[1]+0.01);
            this.verticesArray.push(this.center[0]-0.05*this.size,this.center[1]-0.01);
            this.verticesArray.push(this.center[0]+0.05*this.size,this.center[1]-0.01);
            this.verticesArray.push(this.center[0]+0.05*this.size,this.center[1]+0.01);
            this.rotateAngle();
        }
    };

    this.Ball=function () {
        this.inherit = GameComponents;
        this.inherit();
        delete this.inherit;

        this.id="Ball"+this.randomPostfix();
        this.size=1;
        this.scaleSize=50;
        this.fixFlag=false;
        this.speed=[0.0,0.0];//[0.5,0.0]
        this.acceleration=[0.0,-1.0];
        this.extraAcce=[0.0,0.0];
        this.physicsAttr=true;
        this.minSpeed=0.2;
        this.update=function (mousePosition) {
            this.verticesArray=[];
            var leftUpperX=Math.floor(10*mousePosition[0])/10;
            var leftUpperY=Math.floor(10*mousePosition[1])/10+0.1;
            this.center=[leftUpperX+0.05*this.size,leftUpperY-0.05*this.size];
            var n=128;
            for(var i=0;i<n;i++){
                var radian=Math.PI*2*i/n;
                var cosB=Math.cos(radian);
                var sinB=Math.sin(radian);
                this.verticesArray.push(this.center[0]+0.1*this.size*cosB*this.scaleSize/200,this.center[1]+0.1*this.size*sinB*this.scaleSize/200);
            }
            this.rotateAngle();
        };
        this.draw=function (gl,mousePosition) {
            if(!this.fixFlag)
                this.update(mousePosition);
            this.drawComponents(gl,gl.TRIANGLE_FAN,this.verticesArray.length/2);
        };
        this.vertexsByCenter=function () {
            this.verticesArray=[];
            var n=128;
            for(var i=0;i<n;i++){
                var radian=Math.PI*2*i/n;
                var cosB=Math.cos(radian);
                var sinB=Math.sin(radian);
                this.verticesArray.push(this.center[0]+0.1*this.size*cosB*this.scaleSize/200,this.center[1]+0.1*this.size*sinB*this.scaleSize/200);
            }
        }
    };

    this.Circle=function () {
        this.inherit = GameComponents;
        this.inherit();
        delete this.inherit;

        this.id="Circle"+this.randomPostfix();
        this.size=1;
        this.fixFlag=false;
        this.physicsAttr=true;
        this.update=function (mousePosition) {
            this.verticesArray=[];
            var leftUpperX=Math.floor(10*mousePosition[0])/10;
            var leftUpperY=Math.floor(10*mousePosition[1])/10+0.1;
            this.center=[leftUpperX+0.05*this.size,leftUpperY-0.05*this.size];
            var n=128;
            for(var i=0;i<n;i++){
                var radian=Math.PI*2*i/n;
                var cosB=Math.cos(radian);
                var sinB=Math.sin(radian);
                this.verticesArray.push(this.center[0]+0.1*this.size*cosB/2,this.center[1]+0.1*this.size*sinB/2);
            }
        };
        this.draw=function (gl,mousePosition) {
            if(!this.fixFlag)
                this.update(mousePosition);
            this.drawComponents(gl,gl.TRIANGLE_FAN,this.verticesArray.length/2);
        };
    };

    this.Triangle=function () {
        this.inherit = GameComponents;
        this.inherit();
        delete this.inherit;

        this.id="Triangle"+this.randomPostfix();
        this.size=0;
        this.fixFlag=false;
        this.physicsAttr=true;
        this.update=function (mousePosition) {
            this.verticesArray=[];
            var leftUpperX=Math.floor(10*mousePosition[0])/10;
            var leftUpperY=Math.floor(10*mousePosition[1])/10+0.1;
            this.center=[leftUpperX+0.05*this.size,leftUpperY-0.05*this.size];
            this.verticesArray.push(this.center[0]-0.05*this.size,this.center[1]+0.05*this.size);
            this.verticesArray.push(this.center[0]-0.05*this.size,this.center[1]-0.05*this.size);
            this.verticesArray.push(this.center[0]+0.05*this.size,this.center[1]+0.05*this.size);
            this.rotateAngle();
        };
        this.draw=function (gl,mousePosition) {
            if(!this.fixFlag)
                this.update(mousePosition);
            this.drawComponents(gl,gl.TRIANGLES,3);
        };

    };

    //绘制单个网格
    this.GameGridBox=function () {
        this.inherit = GameComponents;
        this.inherit();
        delete this.inherit;

        this.id="GameGridBox"+this.randomPostfix();
        this.verticesArray=[];
        this.gridBoxSize=[1.0,1.0];
        this.init=function () {
            this.verticesArray=[];
        };
        this.update=function (mousePosition) {
            this.verticesArray=[];
            if(mousePosition){
                var leftUpperX=Math.floor(10*mousePosition[0])/10;
                var leftUpperY=Math.floor(10*mousePosition[1])/10+0.1;
                this.verticesArray.push(leftUpperX,leftUpperY);
                this.verticesArray.push(leftUpperX+0.1*this.gridBoxSize[0],leftUpperY);
                this.verticesArray.push(leftUpperX+0.1*this.gridBoxSize[0],leftUpperY-0.1*this.gridBoxSize[1]);
                this.verticesArray.push(leftUpperX,leftUpperY-0.1*this.gridBoxSize[1]);
            }
        };
        this.draw=function (gl,mousePosition) {
            if(!this.fixFlag)
                this.update(mousePosition);
            this.drawComponents(gl,gl.LINE_LOOP,4);
        };
    };
    //网格
    this.GameGrid=function () {
        //继承GameComponents
        this.inherit = GameComponents;
        this.inherit();
        delete this.inherit;
        //属性
        this.id="GameGrid"+this.randomPostfix();
        this.verticesArray=[];
        this.gridBoxs=[];//记录每一格的属性
        this.gridBox=new GameGridBox();
        this.init=function(){
            for(var i=0;i<20;i++){
                this.gridBoxs[i]=[];
            }
            this.verticesArray=[];
            this.update();
            this.gridBox.init();
        };
        this.update=function (mousePosition) {
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
        this.draw=function (gl,mousePosition) {
            if(!this.fixFlag)
                this.update(mousePosition);
            this.drawComponents(gl,gl.LINES,80);
        };
        this.fillGridBoxs=function (component,kind) {
            switch (kind){
                case 1: {
                    var centerX=Math.floor(10*(component.center[0]+0.01))+10;
                    var centerY=Math.floor(10*(component.center[1]+0.01))+10;
                    if(component.size%2===0){
                        var leftBottomX=centerX-component.size/2;
                        var leftBottomY=centerY-component.size/2;
                        for(var i=0;i<component.size;i++){
                            for(var j=0;j<component.size;j++){
                                this.gridBoxs[leftBottomX+i][leftBottomY+j]=component.id;
                            }
                        }
                    }
                    else{
                        var leftBottomX=centerX-(component.size-1)/2;
                        var leftBottomY=centerY-(component.size-1)/2;
                        for(var i=0;i<component.size;i++){
                            for(var j=0;j<component.size;j++){
                                this.gridBoxs[leftBottomX+i][leftBottomY+j]=component.id;
                            }
                        }
                    }
                    break;
                }
                case 2:{
                    for(var i=0;i<component.centers.length;i=i+2){
                        var centerX=Math.floor(10*(component.centers[i]+0.01))+10;
                        var centerY=Math.floor(10*(component.centers[i+1]+0.01))+10;
                        if(component.size%2===0){
                            var leftBottomX=centerX-component.size/2;
                            var leftBottomY=centerY-component.size/2;
                            for(var i=0;i<component.size;i++){
                                for(var j=0;j<component.size;j++){
                                    this.gridBoxs[leftBottomX+i][leftBottomY+j]=component.id;
                                }
                            }
                        }
                        else{
                            var leftBottomX=centerX-(component.size-1)/2;
                            var leftBottomY=centerY-(component.size-1)/2;
                            for(var k=0;k<component.size;k++){
                                for(var j=0;j<component.size;j++){
                                    this.gridBoxs[leftBottomX+k][leftBottomY+j]=component.id;
                                }
                            }
                        }
                    }
                    console.log(this.gridBoxs);
                    break;
                }
                default:
                    break;
            }
        };
        this.compatibleBoxs=function (component,kind) {
            var result=true;
            switch (kind){
                default: {
                    var centerX=Math.floor(10*(component.center[0]+0.01))+10;
                    var centerY=Math.floor(10*(component.center[1]+0.01))+10;
                    if(component.size%2===0){
                        var leftBottomX=centerX-component.size/2;
                        var leftBottomY=centerY-component.size/2;
                        for(var i=0;i<component.size;i++){
                            for(var j=0;j<component.size;j++){
                                if(leftBottomX+i>19){
                                    result=false;
                                    break;
                                }
                                if(leftBottomY+j<0){
                                    result=false;
                                    break;
                                }
                                if(!this.gridBoxs[leftBottomX+i]){
                                    result=false;
                                    break;
                                }
                                if(this.gridBoxs[leftBottomX+i][leftBottomY+j]&&this.gridBoxs[leftBottomX+i][leftBottomY+j].length>2){
                                    result=false;
                                }
                            }
                        }
                    }
                    else{
                        var leftBottomX=centerX-(component.size-1)/2;
                        var leftBottomY=centerY-(component.size-1)/2;
                        for(var i=0;i<component.size;i++){
                            for(var j=0;j<component.size;j++){
                                if(leftBottomX+i>19){
                                    result=false;
                                    break;
                                }
                                if(leftBottomY+j<0){
                                    result=false;
                                    break;
                                }
                                if(!this.gridBoxs[leftBottomX+i]){
                                    result=false;
                                    break;
                                }
                                if(this.gridBoxs[leftBottomX+i][leftBottomY+j]&&this.gridBoxs[leftBottomX+i][leftBottomY+j].length>2){
                                    result=false;
                                }
                            }
                        }
                    }
                    break;
                }
            }
            return result;
        };
    };

    this.GameComponents=function GameComponents(){
        this.id="";
        this.ANGLE_DEFAULT=0;//旋转默认角度
        this.angel=0;
        this.center=[0.0,0.0];//旋转中心
        this.xformMatrix=new Matrix4();//平移旋转矩阵
        this.xrecoverMatrix =new Matrix4();//恢复矩阵
        this.pointSize=10.0;//点的尺寸
        this.color=[1.0,1.0,1.0,1.0];//颜色
        this.speed=[0.0,0.0];//速度
        this.acceleration=[0.0,0.0];//加速度
        this.rotateSpeed=0.0;//旋转速度
        this.rotateDirection=true;//true--逆时针，false--顺时针
        this.verticesArray=[];//边界点
        this.size=1;
        this.fixFlag=false;//是否跟随鼠标移动
        this.physicsAttr=false;//是否拥有物理特性
        this.minSpeed=0.2;
        this.extraAcce=[0.0,0.0];//暂时地给组件加速度
        this.collisionObject="";
        this.nextCollisionTheta=[];

        this.GREEN=[0.0,1.0,0.0,1.0];
        this.RED=[1.0,0.0,0.0,1.0];
        this.WHITE=[1.0,1.0,1.0,1.0];

        //TODO 包装到函数里面
        this.xformMatrix.setRotate(this.ANGLE_DEFAULT,0,0,1);//平移旋转变换矩阵
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
        };
        this.randomPostfix=function () {
            return (Math.floor(1000000*Math.random())+''+Math.floor(1000000*Math.random())).substring(0,10);
        };
        this.rotatePoint=function (x,y) {
            x=x-this.center[0];
            y=y-this.center[1];
            var radian = Math.PI*this.angel/180.0;
            var cosB=Math.cos(radian);
            var sinB=Math.sin(radian);
            var tempX=x;
            var tempY=y;
            x=tempX*cosB-tempY*sinB;
            y=tempX*sinB+tempY*cosB;
            x=x+this.center[0];
            y=y+this.center[1];
            return [x,y];
        };
        this.rotateAngle=function () {
            var newVerticesArray=[];
            for(var i=0;i<this.verticesArray.length;i=i+2){
                var newPoint=this.rotatePoint(this.verticesArray[i],this.verticesArray[i+1]);
                newVerticesArray.push(newPoint[0],newPoint[1]);
            }
            this.verticesArray=newVerticesArray;
        };
        this.vertexsByCenter=function () {}
    };

    this.PlayArea=function PlayArea() {
        this.gl=null;
        this.playAreaComponents=[];
        this.mousePosition=[0.0,0.0];
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
        this.gameGrid=new Gizmo.GameGrid();
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
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            for(var playAreaComponent in this.playAreaComponents){
                this.playAreaComponents[playAreaComponent].draw(this.gl,this.mousePosition);
            }
        };
        this.physicsAll=function (physicsEngine){
            for(var playAreaComponent in this.playAreaComponents){
                //更新下一次的状态
                var collisionDocu={num:0,theta:[],objectId:'',kind:''};
                if(this.playAreaComponents[playAreaComponent]&&this.playAreaComponents[playAreaComponent].physicsAttr){
                    //如果是球才更新下一秒的状态
                    if(this.playAreaComponents[playAreaComponent] instanceof Ball){
                        //获取下一秒的状态，并且暂时保存
                        var currentBall=physicsEngine.nextState(this.playAreaComponents[playAreaComponent]);
                        for(var physicsComponent in this.playAreaComponents){
                            //设置下一秒的碰撞状态
                            if(physicsComponent!==playAreaComponent&&this.playAreaComponents[physicsComponent].physicsAttr){
                                physicsEngine.componentCollisionCheck(this.playAreaComponents[playAreaComponent],currentBall,this.playAreaComponents[physicsComponent],collisionDocu);
                            }
                            if(collisionDocu.dissCompId&&collisionDocu.dissCompId.length>0){
                                break;
                            }
                        }
                        if(collisionDocu.dissCompId&&collisionDocu.dissCompId.length>0){
                            var newPlayAreaComponents=[];
                            for(var component in this.playAreaComponents){
                                if(this.playAreaComponents[component].id!==collisionDocu.dissCompId){
                                    newPlayAreaComponents.push(this.playAreaComponents[component])
                                }
                            }
                            this.playAreaComponents=newPlayAreaComponents;
                        }
                    }
                }
                if(this.playAreaComponents[playAreaComponent].rotateSpeed&&(this.playAreaComponents[playAreaComponent].rotateSpeed-0)!==0){
                    this.playAreaComponents[playAreaComponent].angel=(this.playAreaComponents[playAreaComponent].angel-0)+(this.playAreaComponents[playAreaComponent].rotateSpeed-0);
                    if(this.playAreaComponents[playAreaComponent].angel>180){
                        this.playAreaComponents[playAreaComponent].angel=this.playAreaComponents[playAreaComponent].angel%180;
                    }
                }
                //判断当前是否和边界碰撞
                physicsEngine.edgeCollision(this.playAreaComponents[playAreaComponent],collisionDocu);
                physicsEngine.enterNextState(this.playAreaComponents[playAreaComponent],collisionDocu);
            }
        };
        this.init=function () {
            this.gameGrid.init();
            this.playAreaComponents=[];
            this.playAreaComponents.push(this.gameGrid);
            this.playAreaComponents.push(this.gameGrid.gridBox);
            this.mousePosition=[0.0,0.0];
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.drawAll();
        }
    };

    this.Game=function () {
        this.GREEN=[0.0,1.0,0.0,1.0];
        this.RED=[1.0,0.0,0.0,1.0];
        this.WHITE=[1.0,1.0,1.0,1.0];
        this.state=0;//1-三角形
        this.modes=0; //0-Building Model;1-Running Model
        this.playArea=new Gizmo.PlayArea();

        //初始化
        this.playArea.createPlayArea();
        this.playArea.init();
    };

    this.Vector=function (startX,startY,stopX,stopY) {
        this.startX=startX;
        this.startY=startY;
        this.stopX=stopX;
        this.stopY=stopY;
        this.basicForm=function () {
            return [this.stopY-this.startY,this.stopX-this.startX];
        };
        this.angelBetween=function (vector) {
            var vect1=this.basicForm();
            var vect2=vector.basicForm();
            return (vect1[0]*vect2[0]+vect1[1]*vect2[1])/Math.sqrt(Math.pow(vect1[0],2)+Math.pow(vect1[1],2));
        };
        this.heightCross=function (centerX,centerY,vertex1X,vertex1Y,vertex2X,vertex2Y) {
            var A=vertex2Y-vertex1Y;
            var B=vertex1X-vertex2X;
            var C=(((vertex2X-vertex1X)*(centerY+vertex1Y))-((vertex2Y-vertex1Y)*(centerX+vertex1X)))/2
            var resultX=centerX-2*A*((A*centerX+B*centerY+C)/(A*A+B*B));
            var resultY=centerY-2*B*((A*centerX+B*centerY+C)/(A*A+B*B));
            return [resultX,resultY];
        };
        this.distBetween=function (vertex1X,vertex1Y,vertex2X,vertex2Y) {
            return Math.sqrt((vertex2X-0-vertex1X)*(vertex2X-0-vertex1X)+(vertex2Y-0-vertex1Y)*(vertex2Y-0-vertex1Y))
        };
        this.XDirtAngle=function () {
            var basicFormVector=this.basicForm();
            return [basicFormVector[0]/this.distBetween(0,0,basicFormVector[0],basicFormVector[1]),basicFormVector[1]/this.distBetween(0,0,basicFormVector[0],basicFormVector[1])];
        }
        this.isCrossLine=function (startX,startY,stopX,stopY) {
            if ( Math.max(this.startX, this.stopX)<Math.min(startX,stopX) )
            {
                return false;
            }
            if ( Math.max(this.startY, this.stopY)<Math.min(startY, stopY) )
            {
                return false;
            }
            if ( Math.max(startX, stopX)<Math.min(this.startX,this.stopX) )
            {
                return false;
            }
            if ( Math.max(startY, stopY)<Math.min(this.startY, this.stopY) )
            {
                return false;
            }
            if ( this.mult([startX,startY], [this.stopX,this.stopY], [this.startX,this.startY])*this.mult([this.stopX,this.stopY], [stopX,stopY], [this.startX,this.startY])<0 )
            {
                return false;
            }
            if( this.mult([this.startX,this.startY], [stopX,stopY], [startX,startY])*this.mult([stopX,stopY], [this.stopX,this.stopY], [startX,startY])<0 )
            {
                return false;
            }
            return true;
        };
        this.mult=function(a,b,c) {
            return (a[0]-c[0])*(b[1]-c[1])-(b[0]-c[0])*(a[1]-c[1]);
        }//叉积
    };

    this.PhysicsEngine=function () {
        this.intervalTime=0.02;
        this.gravity=1.0;
        this.nextState=function (component) {
            var acceX=component.acceleration[0]+component.extraAcce[0];
            var acceY=component.acceleration[1]+component.extraAcce[1];
            var oldSpeedX=component.speed[0];
            var oldSpeedY=component.speed[1];
            var newSpeedX=oldSpeedX+acceX*this.intervalTime;
            var newSpeedY=oldSpeedY+acceY*this.intervalTime;
            if(Math.abs(newSpeedX)<0.01){
                newSpeedX=0;
            }
            if(Math.abs(newSpeedY)<0.01){
                newSpeedY=0;
            }
            var distX=(oldSpeedX+newSpeedX)*this.intervalTime/2;
            var distY=(oldSpeedY+newSpeedY)*this.intervalTime/2;
            return {
                center:[(component.center[0]+distX),(component.center[1]+distY)],
                size:component.size,
                scaleSize:component.scaleSize
            };
        };
        this.enterNextState=function (component,collisionDocu) {
            //如果碰撞超过两个物体
            if(collisionDocu.num>1){
                if(Math.max(Math.abs(component.speed[1]),Math.abs(component.speed[0]))-component.minSpeed<=0.001) {
                    component.speed[0]=0.0;
                    component.speed[1]=0.0;
                    component.acceleration=[0.0,0.0];
                    component.extraAcce=[0.0,0.0];
                }
            }
            if(collisionDocu.theta!=null&&collisionDocu.theta.length===2){
                var tempX=2*component.speed[1]*collisionDocu.theta[0]*collisionDocu.theta[1]+component.speed[0]*(collisionDocu.theta[1]*collisionDocu.theta[1]-collisionDocu.theta[0]*collisionDocu.theta[0]);
                var tempY=2*component.speed[0]*collisionDocu.theta[0]*collisionDocu.theta[1]+component.speed[1]*(collisionDocu.theta[0]*collisionDocu.theta[0]-collisionDocu.theta[1]*collisionDocu.theta[1]);
                console.log(collisionDocu.kind);
                if(collisionDocu.kind==="acceRightBottom"){
                    component.speed[0]=tempX*1.05;
                    component.speed[1]=tempY*1.05;
                    if(Math.min(component.speed[0],component.speed[1])>0.4){
                        component.speed[0]=component.speed[0]*0.4;
                        component.speed[1]=component.speed[1]*0.4;
                    }
                    if(tempX>0&&tempX<1.0) {
                        component.speed[0]=tempX-0.8;
                    }
                    if(tempX<0&&tempX>-1.0){
                        component.speed[0]=-tempX-0.5;
                    }
                    if(tempY<1.0&&tempY>0){
                        component.speed[1]=tempY+0.8;
                    }
                    if(tempY<0&&tempY>-1.0){
                        component.speed[1]=-tempY+0.5;
                    }
                }
                else if(collisionDocu.kind==="acceLeftBottom"){
                    component.speed[0]=(tempX)*1.05;
                    component.speed[1]=(tempY)*1.05;
                    if(Math.min(component.speed[0],component.speed[1])>0.4){
                        component.speed[0]=component.speed[0]*0.4;
                        component.speed[1]=component.speed[1]*0.4;
                    }
                    if(tempX>0&&tempX<1.0) {
                        component.speed[0]=tempX+0.8;
                    }
                    if(tempX<0&&tempX>-1.0){
                        component.speed[0]=-tempX+0.5;
                    }
                    if(tempY<1.0&&tempY>0){
                        component.speed[1]=-tempY-0.5;
                    }
                    if(tempY<0&&tempY>-1.0){
                        component.speed[1]=tempY-0.8;
                    }
                }
                else if(collisionDocu.kind==="acceLeftUpper"){
                    component.speed[0]=(tempX)*1.05;
                    component.speed[1]=(tempY)*1.05;
                    if(Math.min(component.speed[0],component.speed[1])>0.4){
                        component.speed[0]=component.speed[0]*0.4;
                        component.speed[1]=component.speed[1]*0.4;
                    }
                    if(tempX>0&&tempX<1.0) {
                        component.speed[0]=-tempX-0.5;
                    }
                    if(tempX<0&&tempX>-1.0){
                        component.speed[0]=tempX-0.8;
                    }
                    if(tempY<1.0&&tempY>0){
                        component.speed[1]=-tempY-0.5;
                    }
                    if(tempY<0&&tempY>-1.0){
                        component.speed[1]=tempY-0.8;
                    }
                }
                else if(collisionDocu.kind==="acceRightUpper"){
                    component.speed[0]=(tempX)*1.05;
                    component.speed[1]=(tempY)*1.05;
                    if(Math.min(component.speed[0],component.speed[1])>0.4){
                        component.speed[0]=component.speed[0]*0.4;
                        component.speed[1]=component.speed[1]*0.4;
                    }
                    if(tempX>0&&tempX<1.0) {
                        component.speed[0]=-tempX-0.5;
                    }
                    if(tempX<0&&tempX>-1.0){
                        component.speed[0]=tempX-0.8;
                    }
                    if(tempY<1.0&&tempY>0){
                        component.speed[1]=tempY+0.8;
                    }
                    if(tempY<0&&tempY>-1.0)
                        component.speed[1]=-tempY+0.5;
                }
                else{
                    component.speed[0]=tempX*0.80;
                    component.speed[1]=tempY*0.80;
                }
            }
            var acceX=component.acceleration[0]+component.extraAcce[0];
            var acceY=component.acceleration[1]+component.extraAcce[1];
            var oldSpeedX=component.speed[0];
            var oldSpeedY=component.speed[1];
            var newSpeedX=oldSpeedX+acceX*this.intervalTime;
            var newSpeedY=oldSpeedY+acceY*this.intervalTime;
            if(Math.abs(newSpeedX)<0.01){
                newSpeedX=0;
            }
            if(Math.abs(newSpeedY)<0.01){
                newSpeedY=0;
            }
            var distX=(oldSpeedX+newSpeedX)*this.intervalTime/2;
            var distY=(oldSpeedY+newSpeedY)*this.intervalTime/2;

            //更新下一时刻的状态
            component.speed[0]=newSpeedX;
            component.speed[1]=newSpeedY;
            component.center[0]=component.center[0]+distX;
            component.center[1]=component.center[1]+distY;
            component.vertexsByCenter();
            component.extraAcce[0]=0.0;
            component.extraAcce[1]=0.0;
        };
        /**
         * 边界控制
         * @param component 检测的物体
         * @param collisionDocu 碰撞存储的信息
         */
        this.edgeCollision=function (component,collisionDocu) {
            if(component.speed[0]===0.0&&component.speed[1]===0.0&&component.acceleration[1]===0.0&&component.acceleration[0]===0.0){
                return;
            }
            //与上边界碰撞
            if(component.center[0]-(component.size*0.1*component.scaleSize/200-1.0)<0.00001&&component.speed[0]<0){
                collisionDocu.num++;
                component.speed[0]=-component.speed[0];
                component.speed[0]=component.speed[0]*0.8;
            }
            //与下边界碰撞
            if(component.center[1]-(component.size*0.1*component.scaleSize/200-1.0)<0.00001&&component.speed[1]<=0){//底边
                collisionDocu.num++;
                if(Math.abs(component.speed[1])-component.minSpeed<=0.001) {
                    component.extraAcce[1]=1.0;
                }
                component.speed[1]=-component.speed[1];
                component.speed[1]=component.speed[1]*0.8;
            }
            //与右边界碰撞
            if(0.00001>1.0-component.size*0.1*component.scaleSize/200-component.center[0]&&component.speed[0]>0){
                collisionDocu.num++;
                component.speed[0]=-component.speed[0];
                component.speed[0]=component.speed[0]*0.8;
            }
            //与左边界碰撞
            if(0.00001>1.0-component.size*0.1*component.scaleSize/200-component.center[1]&&component.speed[1]>0){
                collisionDocu.num++;
                component.speed[1]=-component.speed[1];
                component.speed[1]=component.speed[1]*0.8;
            }
        };

        /**
         * 判断小球是否和游戏组件发生碰撞
         * @param oldBall 上一时刻的小球
         * @param ball 下一个时刻的小球
         * @param component 游戏组件
         * @param collisionDocu 记录碰撞次数
         * @returns {*}
         * 需要设置小球碰撞的物体id(避免在相邻的两个时刻重复碰撞同一个物体)
         * 需要设置小球碰撞斜面的与X轴夹角的正余弦
         */
        this.componentCollisionCheck=function (oldBall,ball,component,collisionDocu){
            //如果小球静止不做碰撞判断
            if(oldBall.speed[0]===0.0&&oldBall.speed[1]===0.0&&oldBall.acceleration[1]===0.0&&oldBall.acceleration[0]===0.0){
                return [];
            }
            var collisionNum=collisionDocu.num;
            var collisionTheta=collisionDocu.theta;
            //碰撞检测
            var vector=new Vector(ball.center[0],ball.center[1],component.center[0],component.center[1]);
            //检测每一条边
            var crossMoreEdgeInfo={num:0,line:[],dist:[]};
            //如果是吸收器
            for(var i=0;i<component.verticesArray.length;i=i+2){
                var centerX=ball.center[0];
                var centerY=ball.center[1];
                var vertex1X=component.verticesArray[i];
                var vertex1Y=component.verticesArray[i+1];
                if(i+2>=component.verticesArray.length){
                    var vertex2X=component.verticesArray[0];
                    var vertex2Y=component.verticesArray[1];
                }
                else{
                    var vertex2X=component.verticesArray[i+2];
                    var vertex2Y=component.verticesArray[i+3];
                }
                //获取小球到边的垂线与边所在直线的交点
                var heightCrossVertex=vector.heightCross(centerX,centerY,vertex1X,vertex1Y,vertex2X,vertex2Y);
                //判断在不进入游戏组件的时刻会不会发生碰撞（当垂线交点在线段上）
                if((heightCrossVertex[0]<=Math.max(vertex1X,vertex2X))&&(heightCrossVertex[0]>=Math.min(vertex1X,vertex2X))&&(heightCrossVertex[1]<=Math.max(vertex1Y,vertex2Y))&&(heightCrossVertex[1]>=Math.min(vertex1Y,vertex2Y))){
                    //判断垂线的交点是否在小球的半径里面
                    var dist=vector.distBetween(heightCrossVertex[0],heightCrossVertex[1],ball.center[0],ball.center[1]);
                    //小于小球的半径就发生碰撞
                    if(dist<ball.size*0.1*ball.scaleSize/200){
                        console.log("1");
                        //如果碰撞物体是吸收器，直接销毁
                        if(component instanceof Absorber){
                            collisionDocu.dissCompId=oldBall.id;
                            return;
                        }
                        //如果是碰撞同一个物体，则不算发生了碰撞
                        if(oldBall.collisionObject===component.id){
                            break;
                        }
                        //如果不是碰撞同一个物体，则算是发生了碰撞
                        else{
                            //碰撞次数为0，发生了实际碰撞，需要更新球的数据
                            if(collisionNum===0){
                                collisionDocu.objectId=component.id;
                                if(vertex2X>=vertex1X){
                                    var vectorSlop=new Vector(vertex1X,vertex1Y,vertex2X,vertex2Y);
                                }
                                else{
                                    var vectorSlop=new Vector(vertex2X,vertex2Y,vertex1X,vertex1Y);
                                }
                                collisionDocu.theta=vectorSlop.XDirtAngle();
                                if(component instanceof Baffle){
                                    collisionDocu.theta=[Math.sin(component.angel),Math.cos(component.angel)];
                                }
                                //如果是逆时针旋转的挡板
                                if(component instanceof Baffle){
                                    if(component.center[0]>ball.center[0]){
                                        if(component.center[1]>ball.center[1]){
                                            collisionDocu.kind="acceLeftBottom";
                                        }
                                        else{
                                            collisionDocu.kind="acceLeftUpper";
                                        }
                                    }
                                    else{
                                        if(component.center[1]>ball.center[1]){
                                            collisionDocu.kind="acceRightBottom";
                                        }
                                        else{
                                            collisionDocu.kind="acceRightUpper";
                                        }
                                    }
                                }
                            }
                            if(Math.abs(component.rotateSpeed)<0.001)
                                collisionDocu.num=collisionNum+1;
                        }

                    }
                }
                if((!(component instanceof Circle))&&(!(component instanceof Baffle))){
                    //判断物体各个顶点是否发生碰撞，优先级别高于边碰撞（因为小球运动轨迹很可能是抛物线）
                    var vertexVertor=new Vector();
                    if(vertexVertor.distBetween(ball.center[0],ball.center[1],vertex1X,vertex1Y)-ball.size*0.1*ball.scaleSize/200<0.001){
                        console.log("2");
                        //如果碰撞的物体是吸收器
                        if(component instanceof Absorber){
                            collisionDocu.dissCompId=oldBall.id;
                            return;
                        }
                        //如果碰撞的是同一个物体，则不算发生了碰撞
                        if(oldBall.collisionObject===component.id){
                            break;
                        }
                        else{
                            //碰撞次数为0，可能发生实际碰撞，但需要考虑是否是碰撞同一个物体
                            if(collisionNum===0){
                                collisionDocu.objectId=component.id;
                                if(component.center[0]<=vertex1X){
                                    var vectorVertical=new Vector(component.center[0],component.center[1],vertex1X,vertex1Y);
                                }
                                else{
                                    var vectorVertical=new Vector(component.center[0],component.center[1],vertex1X,vertex1Y);
                                }
                                var tempX=-vectorVertical.basicForm()[1];
                                var tempY=vectorVertical.basicForm()[0];
                                var vectorSlop=new Vector(0.0,0.0,tempX,tempY);
                                collisionDocu.theta=vectorSlop.XDirtAngle();
                                if(component instanceof Baffle){
                                    collisionDocu.theta=[Math.sin(component.angel),Math.cos(component.angel)];
                                }
                                //如果是逆时针旋转的挡板
                                if(component instanceof Baffle){
                                    if(component.center[0]>ball.center[0]){
                                        if(component.center[1]>ball.center[1]){
                                            collisionDocu.kind="acceLeftBottom";
                                        }
                                        else{
                                            collisionDocu.kind="acceLeftUpper";
                                        }
                                    }
                                    else{
                                        if(component.center[1]>ball.center[1]){
                                            collisionDocu.kind="acceRightBottom";
                                        }
                                        else{
                                            collisionDocu.kind="acceRightUpper";
                                        }
                                    }
                                }
                            }
                            if(Math.abs(component.rotateSpeed)<0.001)
                                collisionDocu.num=collisionNum+1;
                        }
                    }
                }
                //判断下一个时刻会不会进入游戏组件里面，如果进入游戏里面，需要使用两个时刻圆心的连线是否与边碰撞
                var oldNewCenter=new Vector(oldBall.center[0],oldBall.center[1],ball.center[0],ball.center[1]);
                if(oldNewCenter.isCrossLine(vertex1X,vertex1Y,vertex2X,vertex2Y)){
                    if(!(component instanceof Baffle)){
                        console.log("3");
                        crossMoreEdgeInfo.num = (crossMoreEdgeInfo.num - 0) + 1;
                        if (oldBall.collisionObject === component.id) {
                            break;
                        }
                        else {
                            //碰撞次数为0，可能发生实际碰撞，但需要考虑是否是碰撞同一个物体
                            if (collisionNum === 0) {
                                collisionDocu.objectId = component.id;
                                if (vertex2X >= vertex1X) {
                                    var vectorSlop = new Vector(vertex1X, vertex1Y, vertex2X, vertex2Y);
                                }
                                else {
                                    var vectorSlop = new Vector(vertex2X, vertex2Y, vertex1X, vertex1Y);
                                }
                                collisionDocu.theta = vectorSlop.XDirtAngle();
                            }
                            if (component instanceof Baffle) {
                                collisionDocu.theta = [Math.sin(component.angel), Math.cos(component.angel)];
                            }
                            //如果是逆时针旋转的挡板
                            if(component instanceof Baffle){
                                if(component.center[0]>ball.center[0]){
                                    if(component.center[1]>ball.center[1]){
                                        collisionDocu.kind="acceLeftBottom";
                                    }
                                    else{
                                        collisionDocu.kind="acceLeftUpper";
                                    }
                                }
                                else{
                                    if(component.center[1]>ball.center[1]){
                                        collisionDocu.kind="acceRightBottom";
                                    }
                                    else{
                                        collisionDocu.kind="acceRightUpper";
                                    }
                                }
                            }

                            if (Math.abs(component.rotateSpeed) < 0.001)
                                collisionDocu.num = collisionNum + 1;
                        }
                    }
                }
            }
        };
    };

    return{
        SHADERS: SHADERS,
        PlayArea: PlayArea,
        GameComponents: GameComponents,
        GameGrid: GameGrid,
        Game: Game,
        Triangle: Triangle,
        Circle:Circle,
        Ball:Ball,
        PhysicsEngine:PhysicsEngine,
        Vector:Vector,
        Baffle:Baffle,
        Absorber: Absorber
    }
})();