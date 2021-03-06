this.mainController=function main() {
   //属性
    var game=new Gizmo.Game();
    var playArea=game.playArea;
    var gameGrid=playArea.gameGrid;
    var gameGridBox=gameGrid.gridBox;
    var canvas=document.getElementById("playArea");
    var physicsEngine=new Gizmo.PhysicsEngine();
    init();
    runAllHandler=function () {};
    drawAllHandler=function () {};
    //点击新建事件
    document.getElementById("new-playArea").addEventListener("click",function () {
        game.modes=0;
        game.state=0;
        playArea.init();
        physicsEngine=new Gizmo.PhysicsEngine();
        if(runAllHandler)
            clearInterval(runAllHandler);
        if(drawAllHandler)
            clearInterval(drawAllHandler);
    });
    //点击保存事件
    document.getElementById("save-playArea").addEventListener("click",function () {
        var uploadInfo={};
        //网格数据
        uploadInfo.gridBoxs=gameGrid.gridBoxs;
        //组建数据
        var attachmentInfo=[];
        for(var item in playArea.playAreaComponents){
            var currentUploadComponent={};
            var currentComponent=playArea.playAreaComponents[item];
            currentUploadComponent.size=currentComponent.size;
            currentUploadComponent.center=currentComponent.center;
            currentUploadComponent.id=currentComponent.id;
            currentUploadComponent.color=currentComponent.color;
            currentUploadComponent.fixFlag=currentComponent.fixFlag;
            currentUploadComponent.angel=currentComponent.angel;
            if((currentComponent instanceof Track)||(currentComponent instanceof Absorber)){
                currentUploadComponent.centers=currentComponent.centers;
            }
            if((currentComponent instanceof Ball)){
                currentUploadComponent.scaleSize=currentComponent.scaleSize;
            }
            attachmentInfo.push(currentUploadComponent);
        }
        uploadInfo.attachmentInfo=attachmentInfo;
        var uploadInfoStr=JSON.stringify(uploadInfo);
        $.ajax({
            type: 'post',
            url: 'Index',
            data:{
                command:'save',
                userId:'1',
                value:uploadInfoStr
            },
            success: function (data) {
                var JSON_data=JSON.parse(data);
                // buildByFile(JSON_data);
            },
            error: function () {
                console.log("error")
            }
        })
    });
    //点击打开事件
    document.getElementById("open-playArea").addEventListener("click",function () {
        document.getElementById("main").style.cssText="filter: blur(1.5px);";
        document.getElementById("mainHidden").style.cssText="display:flex;";
        $.ajax({
            type: 'post',
            url: 'Index',
            data:{
                command:'open',
                userId:'1'
            },
            success: function (data) {
                var JSON_data=JSON.parse(data);
                var value=JSON_data.value;
                document.getElementById("sceneList").innerHTML="";
                for(let i in value){
                    let newDom=document.createElement("div");
                    newDom.innerHTML=value[i];
                    newDom.setAttribute("class","sceneContent-line2-item");
                    newDom.addEventListener("click",function () {
                        $.ajax({
                            type: 'post',
                            url: 'Index',
                            data:{
                                command:'read',
                                userId:'1',
                                sceneId: value[i]
                            },
                            success: function (data) {
                                var JSON_data=JSON.parse(data);
                                buildByFile(JSON_data);
                                document.getElementById("main").style.cssText="";
                                document.getElementById("mainHidden").style.cssText="";
                            },
                            error: function () {
                                console.log("error")
                            }
                        })
                    });
                    document.getElementById("sceneList").append(newDom);
                }
            },
            error: function () {
                console.log("error")
            }
        });
    });
    //网格颜色修改事件
    document.getElementById("changeColorGridBox").addEventListener("input",function () {
        var changeInput=document.getElementById("changeColorGridBox");
        document.getElementById("symbolBox-gridBox").style.cssText="background:"+changeInput.value;
        gameGrid.color= HexToFloat(changeInput.value);
        playArea.drawAll();
    },false);
    //网格盒子（ok）颜色修改事件
    document.getElementById("changeColorGridBoxS").addEventListener("input",function () {
        var changeInput=document.getElementById("changeColorGridBoxS");
        document.getElementById("symbolBox-gridBoxS").style.cssText="border: 1px solid "+changeInput.value;
        gameGrid.GREEN= HexToFloat(changeInput.value);
        playArea.drawAll();
    },false);
    //网格盒子（no）颜色修改事件
    document.getElementById("changeColorGridBoxSS").addEventListener("input",function () {
        var changeInput=document.getElementById("changeColorGridBoxSS");
        document.getElementById("symbolBox-gridBoxSS").style.cssText="border: 1px solid "+changeInput.value;
        gameGrid.RED= HexToFloat(changeInput.value);
        playArea.drawAll();
    },false);
    //三角形颜色改变事件监听
    document.getElementById("changeTri").addEventListener("input",function () {
        var changeInput=document.getElementById("changeTri");
        document.getElementById("symbolBox-tri").style.cssText="background:"+changeInput.value;
        playArea.drawAll();
    },false);
    //圆形颜色改变事件监听
    document.getElementById("changeCir").addEventListener("input",function () {
        var changeInput=document.getElementById("changeCir");
        document.getElementById("symbolBox-cir").style.cssText="background:"+changeInput.value;
        playArea.drawAll();
    },false);
    //小球颜色改变事件监听
    document.getElementById("changeBal").addEventListener("input",function () {
        var changeInput=document.getElementById("changeBal");
        document.getElementById("symbolBox-bal").style.cssText="background:"+changeInput.value;
        playArea.drawAll();
    },false);
    //挡板颜色改变事件监听
    document.getElementById("changeBaf").addEventListener("input",function () {
        var changeInput=document.getElementById("changeBaf");
        document.getElementById("symbolBox-baf").style.cssText="background:"+changeInput.value;
        playArea.drawAll();
    },false);
    //吸收器颜色改变事件监听
    document.getElementById("changeAbs").addEventListener("input",function () {
        var changeInput=document.getElementById("changeAbs");
        document.getElementById("symbolBox-abs").style.cssText="background:"+changeInput.value;
        playArea.drawAll();
    },false);
    //轨道颜色改变事件监听
    document.getElementById("changeTra").addEventListener("input",function () {
        var changeInput=document.getElementById("changeTra");
        document.getElementById("symbolBox-tra").style.cssText="background:"+changeInput.value;
        playArea.drawAll();
    },false);
    //左挡板颜色改变事件监听
    document.getElementById("changeLef").addEventListener("input",function () {
        var changeInput=document.getElementById("changeLef");
        document.getElementById("symbolBox-lef").style.cssText="border-left: 2px solid"+changeInput.value;
        playArea.drawAll();
    },false);
    //右挡板颜色改变事件监听
    document.getElementById("changeRig").addEventListener("input",function () {
        var changeInput=document.getElementById("changeRig");
        document.getElementById("symbolBox-rig").style.cssText="border-right: 2px solid"+changeInput.value;
        playArea.drawAll();
    },false);
    // 鼠标移动事件监听
    canvas.onmouseover=function (ev) {
        var gameComponents=null;//记录移动的时候正在操纵的附件
        if(game.modes===0){
            drawAllHandler=setInterval(function () {
                playArea.drawAll();
            },20);
            var clickEventIsOk=true;
            var outEventIsOk=true;
            //初始化组件
            switch (game.state){
                case 1:{
                    var triangle=new Gizmo.Triangle();
                    triangle.update([0.0,0.0]);
                    if(!isNaN(document.getElementById("tool-item1-size").value)){
                        triangle.size=document.getElementById("tool-item1-size").value;
                    }
                    if(!isNaN(document.getElementById("tool-item1-angel").value)){
                        triangle.angel=document.getElementById("tool-item1-angel").value;
                    }
                    triangle.color=HexToFloat(document.getElementById("changeTri").value);
                    playArea.playAreaComponents.push(triangle);
                    gameGridBox.gridBoxSize=[triangle.size,triangle.size];
                    break;
                }
                case 2:{
                    var circle=new Gizmo.Circle();
                    circle.update([0.0,0.0]);
                    if(!isNaN(document.getElementById("tool-item2-size").value)){
                        circle.size=document.getElementById("tool-item2-size").value;
                    }
                    if(!isNaN(document.getElementById("tool-item2-angel").value)){
                        circle.angel=document.getElementById("tool-item2-angel").value;
                    }
                    circle.color=HexToFloat(document.getElementById("changeCir").value);
                    playArea.playAreaComponents.push(circle);
                    gameGridBox.gridBoxSize=[circle.size,circle.size];
                    break;
                }
                case 3:{
                    var ball=new Gizmo.Ball();
                    ball.update([0.0,0.0]);
                    if(!isNaN(document.getElementById("tool-item3-size").value)){
                        ball.size=document.getElementById("tool-item3-size").value;
                    }
                    if(!isNaN(document.getElementById("tool-item3-angel").value)){
                        ball.angel=document.getElementById("tool-item3-angel").value;
                    }
                    ball.color=HexToFloat(document.getElementById("changeBal").value);
                    playArea.playAreaComponents.push(ball);
                    gameGridBox.gridBoxSize=[ball.size,ball.size];
                    break;
                }
                case 4:{
                    var baffle=new Gizmo.Baffle();
                    baffle.update([0.0,0.0]);
                    if(!isNaN(document.getElementById("tool-item4-size").value)){
                        baffle.size=document.getElementById("tool-item4-size").value;
                    }
                    if(!isNaN(document.getElementById("tool-item4-angel").value)){
                        baffle.angel=document.getElementById("tool-item4-angel").value;
                    }
                    baffle.color=HexToFloat(document.getElementById("changeBaf").value);
                    playArea.playAreaComponents.push(baffle);
                    gameGridBox.gridBoxSize=[baffle.size,baffle.size];
                    break;
                }
                case 5:{
                    var absorber= new Gizmo.Absorber();
                    absorber.center=[0.0,0.0];
                    if(!isNaN(document.getElementById("tool-item5-size").value)){
                        absorber.size=document.getElementById("tool-item5-size").value;
                    }
                    absorber.color=HexToFloat(document.getElementById("changeAbs").value);
                    playArea.playAreaComponents.push(absorber);
                    gameGridBox.gridBoxSize=[absorber.size,absorber.size];
                    break;
                }
                case 6:{
                    var track= new Gizmo.Track();
                    track.center=[0.0,0.0];
                    console.log("init");
                    if(!isNaN(document.getElementById("tool-item6-size").value)){
                        track.size=document.getElementById("tool-item6-size").value;
                    }
                    track.color=HexToFloat(document.getElementById("changeTra").value);
                    playArea.playAreaComponents.push(track);
                    gameGridBox.gridBoxSize=[track.size,track.size];
                    break;
                }
                case 7:{
                    var leftBaffle=new Gizmo.LeftBaffle();
                    leftBaffle.update([0.0,0.0]);
                    if(!isNaN(document.getElementById("tool-item7-size").value)){
                        leftBaffle.size=document.getElementById("tool-item7-size").value;
                    }
                    leftBaffle.color=HexToFloat(document.getElementById("changeLef").value);
                    playArea.playAreaComponents.push(leftBaffle);
                    gameGridBox.gridBoxSize=[leftBaffle.size,leftBaffle.size];
                    break;
                }
                case 8:{
                    var rightBaffle=new Gizmo.RightBaffle();
                    rightBaffle.update([0.0,0.0]);
                    if(!isNaN(document.getElementById("tool-item8-size").value)){
                        rightBaffle.size=document.getElementById("tool-item8-size").value;
                    }
                    rightBaffle.color=HexToFloat(document.getElementById("changeRig").value);
                    playArea.playAreaComponents.push(rightBaffle);
                    gameGridBox.gridBoxSize=[rightBaffle.size,rightBaffle.size];
                    break;
                }
                default:
                    break;
            }
            canvas.onmousemove = function (ev) {
                //获取鼠标在游戏网格中的位置
                gameGrid.gridBox.color=gameGrid.GREEN;
                var x=ev.clientX;
                var y=ev.clientY;
                var rect=ev.target.getBoundingClientRect();
                x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
                y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
                playArea.mousePosition=[x,y];
                //更新物体的center和检查是否重叠
                switch (game.state){
                    case 1: {
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y]);
                        if(gameGrid.compatibleBoxs(triangle,1)){
                            gameGridBox.color=gameGrid.GREEN;
                            clickEventIsOk=true;
                        }
                        else{
                            gameGridBox.color=gameGrid.RED;
                            clickEventIsOk=false;
                        }
                        break;
                    }
                    case 2: {
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y]);
                        if(gameGrid.compatibleBoxs(circle,1)){
                            gameGridBox.color=gameGrid.GREEN;
                            clickEventIsOk=true;
                        }
                        else{
                            gameGridBox.color=gameGrid.RED;
                            clickEventIsOk=false;
                        }
                        break;
                    }
                    case 3: {
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y]);
                        if(gameGrid.compatibleBoxs(ball,1)){
                            gameGridBox.color=gameGrid.GREEN;
                            clickEventIsOk=true;
                        }
                        else{
                            gameGridBox.color=gameGrid.RED;
                            clickEventIsOk=false;
                        }
                        break;
                    }
                    case 4: {
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y]);
                        if(gameGrid.compatibleBoxs(baffle,1)){
                            gameGridBox.color=gameGrid.GREEN;
                            clickEventIsOk=true;
                        }
                        else{
                            gameGridBox.color=gameGrid.RED;
                            clickEventIsOk=false;
                        }
                        break;
                    }
                    case 5: {
                        if(playArea.playAreaComponents[playArea.playAreaComponents.length - 1].startFlag){
                            if(gameGrid.compatibleBoxs(absorber,1)){
                                gameGridBox.color=gameGrid.GREEN;
                                outEventIsOk=true;
                                //需要根据center来判断是否覆盖冲突，所以需要一直update.true表示可以更新centers,false表示不能更新
                                playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y],true);
                            }
                            else{
                                gameGridBox.color=gameGrid.RED;
                                outEventIsOk=false;
                                //需要根据center来判断是否覆盖冲突，所以需要一直update.true表示可以更新centers,false表示不能更新
                                playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y],false);
                            }
                        }
                        else{
                            playArea.playAreaComponents[playArea.playAreaComponents.length - 1].updateCenter([x,y]);
                            if(gameGrid.compatibleBoxs(absorber,1)){
                                gameGridBox.color=gameGrid.GREEN;
                                outEventIsOk=true;
                            }
                            else{
                                gameGridBox.color=gameGrid.RED;
                                outEventIsOk=false;
                            }
                        }
                        break;
                    }
                    case 6: {
                        if(playArea.playAreaComponents[playArea.playAreaComponents.length - 1].startFlag){
                            if(gameGrid.compatibleBoxs(track,1)){
                                gameGridBox.color=gameGrid.GREEN;
                                outEventIsOk=true;
                                //需要根据center来判断是否覆盖冲突，所以需要一直update.true表示可以更新centers,false表示不能更新
                                playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y],true);
                            }
                            else{
                                gameGridBox.color=gameGrid.RED;
                                outEventIsOk=false;
                                //需要根据center来判断是否覆盖冲突，所以需要一直update.true表示可以更新centers,false表示不能更新
                                playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y],false);
                            }
                        }
                        else{
                            playArea.playAreaComponents[playArea.playAreaComponents.length - 1].updateCenter([x,y]);
                            if(gameGrid.compatibleBoxs(track,1)){
                                gameGridBox.color=gameGrid.GREEN;
                                outEventIsOk=true;
                            }
                            else{
                                gameGridBox.color=gameGrid.RED;
                                outEventIsOk=false;
                            }
                        }
                        break;
                    }
                    case 7: {
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y]);
                        if(gameGrid.compatibleBoxs(leftBaffle,2)){
                            gameGridBox.color=gameGrid.GREEN;
                            clickEventIsOk=true;
                        }
                        else{
                            gameGridBox.color=gameGrid.RED;
                            clickEventIsOk=false;
                        }
                        break;
                    }
                    case 8: {
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y]);
                        if(gameGrid.compatibleBoxs(rightBaffle,3)){
                            gameGridBox.color=gameGrid.GREEN;
                            clickEventIsOk=true;
                        }
                        else{
                            gameGridBox.color=gameGrid.RED;
                            clickEventIsOk=false;
                        }
                        break;
                    }
                    default:
                        break;
                }
            };
            canvas.onmousedown = function (ev) {
                switch (game.state){
                    case 1:{
                        if(clickEventIsOk){
                            triangle.fixFlag=true;
                            clickEventIsOk=false;
                            game.state=0;
                            gameGrid.fillGridBoxs(triangle,1);
                            canvas.onmousedown = null;
                        }
                        break;
                    }
                    case 2:{
                        if(clickEventIsOk){
                            circle.fixFlag=true;
                            clickEventIsOk=false;
                            game.state=0;
                            gameGrid.fillGridBoxs(circle,1);
                            canvas.onmousedown = null;
                        }
                        break;
                    }
                    case 3:{
                        if(clickEventIsOk){
                            ball.fixFlag=true;
                            clickEventIsOk=false;
                            game.state=0;
                            gameGrid.fillGridBoxs(ball,1);
                            canvas.onmousedown = null;
                        }
                        break;
                    }
                    case 4:{
                        if(clickEventIsOk){
                            baffle.fixFlag=true;
                            clickEventIsOk=false;
                            game.state=0;
                            gameGrid.fillGridBoxs(baffle,1);
                            canvas.onmousedown = null;
                        }
                        break;
                    }
                    case 5:{
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].startFlag=true;
                        outEventIsOk=false;
                        break;
                    }
                    case 6:{
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].startFlag=true;
                        outEventIsOk=false;
                        break;
                    }
                    case 7:{
                        if(clickEventIsOk){
                            leftBaffle.fixFlag=true;
                            clickEventIsOk=false;
                            game.state=0;
                            gameGrid.fillGridBoxs(leftBaffle,2);
                            canvas.onmousedown = null;
                        }
                        break;
                    }
                    case 8:{
                        if(clickEventIsOk){
                            rightBaffle.fixFlag=true;
                            clickEventIsOk=false;
                            game.state=0;
                            gameGrid.fillGridBoxs(rightBaffle,3);
                            canvas.onmousedown = null;
                        }
                        break;
                    }
                    default:
                        break;
                }
            };
            canvas.onmouseup = function (ev) {
                if(game.state===5){
                    if(outEventIsOk){
                        absorber.fixFlag=true;
                        outEventIsOk=false;
                        game.state=0;
                        gameGrid.fillGridBoxs(absorber,4);
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].startFlag=false;
                    }
                    else{
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].startFlag=false;
                        playArea.drawAll();
                    }
                }
                if(game.state===6){
                    if(outEventIsOk){
                        track.fixFlag=true;
                        outEventIsOk=false;
                        game.state=0;
                        gameGrid.fillGridBoxs(track,4);
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].startFlag=false;
                    }
                    else{
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].startFlag=false;
                        playArea.drawAll();
                    }
                }
            };
            canvas.onmouseout = function (ev) {
                clearInterval(drawAllHandler);
                gameGrid.gridBox.color=gameGrid.WHITE;
                if(game.state===1)
                    playArea.playAreaComponents.pop();
                if(game.state===2)
                    playArea.playAreaComponents.pop();
                if(game.state===3)
                    playArea.playAreaComponents.pop();
                if(game.state===4)
                    playArea.playAreaComponents.pop();
                if(game.state===5)
                    playArea.playAreaComponents.pop();
                if(game.state===6)
                    playArea.playAreaComponents.pop();
                if(game.state===7)
                    playArea.playAreaComponents.pop();
                if(game.state===8)
                    playArea.playAreaComponents.pop();
                playArea.drawAll();
                canvas.onmousemove=null;
            };
        }
        else if(game.modes===3){
            drawAllHandler=setInterval(function () {
                playArea.drawAll();
            },20);
            gameGridBox.gridBoxSize=[1,1];
            canvas.onmousemove = function (ev) {
                //获取鼠标在游戏网格中的位置
                gameGrid.gridBox.color=gameGrid.GREEN;
                var x=ev.clientX;
                var y=ev.clientY;
                var rect=ev.target.getBoundingClientRect();
                x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
                y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
                playArea.mousePosition=[x,y];
                if(gameGrid.gameComponentsId(playArea.mousePosition)&&gameGrid.gameComponentsId(playArea.mousePosition).length>2){
                    gameGrid.gridBox.color=gameGrid.GREEN;
                }
                else{
                    gameGrid.gridBox.color=gameGrid.RED;
                }
            };
            canvas.onmousedown = function (ev) {
                var oldComponentId=gameGrid.gameComponentsId(playArea.mousePosition);
                if(oldComponentId&&oldComponentId.length>2){
                    playArea.playAreaComponentsClearById(oldComponentId);
                    gameGrid.gameClearById(oldComponentId);
                }
            };
            canvas.onmouseout = function (ev) {
                clearInterval(drawAllHandler);
                gameGrid.gridBox.color=gameGrid.WHITE;
                playArea.drawAll();
                canvas.onmousemove=null;
            };
        }
        else if(game.modes===4){
            console.log(gameGrid.gridBoxs);
            game.state=0;
            drawAllHandler=setInterval(function () {
                playArea.drawAll();
            },20);
            var clickEventIsOk=true;
            var outEventIsOk=true;
            var moveFlag=true;//在移动的删除阶段(true)还是放置阶段(false)
            gameGridBox.gridBoxSize=[1,1];
            canvas.onmousemove = function (ev) {
                //获取鼠标在游戏网格中的位置
                gameGrid.gridBox.color=gameGrid.GREEN;
                var x=ev.clientX;
                var y=ev.clientY;
                var rect=ev.target.getBoundingClientRect();
                x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
                y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
                playArea.mousePosition=[x,y];
                //更新物体的center和检查是否重叠
                switch (game.state){
                    case 1: {
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y]);
                        gameGridBox.gridBoxSize=[gameComponents.size,gameComponents.size];
                        if(gameGrid.compatibleBoxs(gameComponents,1)){
                            gameGridBox.color=gameGrid.GREEN;
                            clickEventIsOk=true;
                        }
                        else{
                            gameGridBox.color=gameGrid.RED;
                            clickEventIsOk=false;
                        }
                        break;
                    }
                    case 2: {
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y]);
                        gameGridBox.gridBoxSize=[gameComponents.size,gameComponents.size];
                        if(gameGrid.compatibleBoxs(gameComponents,1)){
                            gameGridBox.color=gameGrid.GREEN;
                            clickEventIsOk=true;
                        }
                        else{
                            gameGridBox.color=gameGrid.RED;
                            clickEventIsOk=false;
                        }
                        break;
                    }
                    case 3: {
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y]);
                        gameGridBox.gridBoxSize=[gameComponents.size,gameComponents.size];
                        if(gameGrid.compatibleBoxs(gameComponents,1)){
                            gameGridBox.color=gameGrid.GREEN;
                            clickEventIsOk=true;
                        }
                        else{
                            gameGridBox.color=gameGrid.RED;
                            clickEventIsOk=false;
                        }
                        break;
                    }
                    case 4: {
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y]);
                        gameGridBox.gridBoxSize=[gameComponents.size,gameComponents.size];
                        if(gameGrid.compatibleBoxs(gameComponents,1)){
                            gameGridBox.color=gameGrid.GREEN;
                            clickEventIsOk=true;
                        }
                        else{
                            gameGridBox.color=gameGrid.RED;
                            clickEventIsOk=false;
                        }
                        break;
                    }
                    case 7: {
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y]);
                        gameGridBox.gridBoxSize=[gameComponents.size,gameComponents.size];
                        if(gameGrid.compatibleBoxs(gameComponents,2)){
                            gameGridBox.color=gameGrid.GREEN;
                            clickEventIsOk=true;
                        }
                        else{
                            gameGridBox.color=gameGrid.RED;
                            clickEventIsOk=false;
                        }
                        break;
                    }
                    case 8: {
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y]);
                        gameGridBox.gridBoxSize=[gameComponents.size,gameComponents.size];
                        if(gameGrid.compatibleBoxs(gameComponents,3)){
                            gameGridBox.color=gameGrid.GREEN;
                            clickEventIsOk=true;
                        }
                        else{
                            gameGridBox.color=gameGrid.RED;
                            clickEventIsOk=false;
                        }
                        break;
                    }
                    default:
                        break;
                }
            };
            canvas.onmousedown = function (ev) {
                if(moveFlag){
                    var oldComponentId=gameGrid.gameComponentsId(playArea.mousePosition);
                    if(oldComponentId&&oldComponentId.length>2){
                        moveFlag=false;
                        var oldComponent=playArea.playAreaComponentsClearById(oldComponentId);
                        gameGrid.gameClearById(oldComponentId);
                        switch (oldComponentId.substring(0,3)){
                            case "Tri":{
                                gameComponents=new Gizmo.Triangle();
                                gameComponents.update(playArea.mousePosition);
                                gameComponents.size=oldComponent.size;
                                gameComponents.angel=oldComponent.angel;
                                gameComponents.color=oldComponent.color;
                                playArea.playAreaComponents.push(gameComponents);
                                gameGridBox.gridBoxSize=[oldComponent.size,oldComponent.size];
                                game.state=1;
                                break;
                            }
                            case "Cir":{
                                gameComponents=new Gizmo.Circle();
                                gameComponents.update(playArea.mousePosition);
                                gameComponents.size=oldComponent.size;
                                gameComponents.angel=oldComponent.angel;
                                gameComponents.color=oldComponent.color;
                                playArea.playAreaComponents.push(gameComponents);
                                gameGridBox.gridBoxSize=[oldComponent.size,oldComponent.size];
                                game.state=2;
                                break;
                            }
                            case "Bal":{
                                gameComponents=new Gizmo.Ball();
                                gameComponents.update(playArea.mousePosition);
                                gameComponents.size=oldComponent.size;
                                gameComponents.angel=oldComponent.angel;
                                gameComponents.color=oldComponent.color;
                                gameComponents.scaleSize=oldComponent.scaleSize;
                                playArea.playAreaComponents.push(gameComponents);
                                gameGridBox.gridBoxSize=[oldComponent.size,oldComponent.size];
                                game.state=3;
                                break;
                            }
                            case "Baf":{
                                gameComponents=new Gizmo.Baffle();
                                gameComponents.update(playArea.mousePosition);
                                gameComponents.size=oldComponent.size;
                                gameComponents.angel=oldComponent.angel;
                                gameComponents.color=oldComponent.color;
                                playArea.playAreaComponents.push(gameComponents);
                                gameGridBox.gridBoxSize=[oldComponent.size,oldComponent.size];
                                game.state=4;
                                break;
                            }
                            case "Lef":{
                                gameComponents=new Gizmo.LeftBaffle();
                                gameComponents.update(playArea.mousePosition);
                                gameComponents.size=oldComponent.size;
                                gameComponents.color=oldComponent.color;
                                playArea.playAreaComponents.push(gameComponents);
                                gameGridBox.gridBoxSize=[oldComponent.size,oldComponent.size];
                                game.state=7;
                                break;
                            }
                            case "Rig":{
                                gameComponents=new Gizmo.RightBaffle();
                                gameComponents.update(playArea.mousePosition);
                                gameComponents.size=oldComponent.size;
                                gameComponents.color=oldComponent.color;
                                playArea.playAreaComponents.push(gameComponents);
                                gameGridBox.gridBoxSize=[oldComponent.size,oldComponent.size];
                                game.state=8;
                                break;
                            }
                            default:
                                break;
                        }
                    }
                }
                else{
                    switch (game.state){
                        case 1:{
                            if(clickEventIsOk){
                                gameComponents.fixFlag=true;
                                clickEventIsOk=false;
                                game.state=0;
                                gameGrid.fillGridBoxs(gameComponents,1);
                                gameGridBox.gridBoxSize=[1,1];
                                setTimeout(function () {
                                    moveFlag=true;
                                },500);
                            }
                            break;
                        }
                        case 2:{
                            if(clickEventIsOk){
                                gameComponents.fixFlag=true;
                                clickEventIsOk=false;
                                game.state=0;
                                moveFlag=true;
                                gameGrid.fillGridBoxs(gameComponents,1);
                                gameGridBox.gridBoxSize=[1,1];
                                setTimeout(function () {
                                    moveFlag=true;
                                },500);
                            }
                            break;
                        }
                        case 3:{
                            if(clickEventIsOk){
                                gameComponents.fixFlag=true;
                                clickEventIsOk=false;
                                game.state=0;
                                moveFlag=true;
                                gameGrid.fillGridBoxs(gameComponents,1);
                                gameGridBox.gridBoxSize=[1,1];
                                setTimeout(function () {
                                    moveFlag=true;
                                },500);
                            }
                            break;
                        }
                        case 4:{
                            if(clickEventIsOk){
                                gameComponents.fixFlag=true;
                                clickEventIsOk=false;
                                game.state=0;
                                moveFlag=true;
                                gameGrid.fillGridBoxs(gameComponents,1);
                                gameGridBox.gridBoxSize=[1,1];
                                setTimeout(function () {
                                    moveFlag=true;
                                },500);
                            }
                            break;
                        }
                        case 7:{
                            if(clickEventIsOk){
                                gameComponents.fixFlag=true;
                                clickEventIsOk=false;
                                game.state=0;
                                moveFlag=true;
                                gameGrid.fillGridBoxs(gameComponents,2);
                                gameGridBox.gridBoxSize=[1,1];
                                setTimeout(function () {
                                    moveFlag=true;
                                },500);
                            }
                            break;
                        }
                        case 8:{
                            if(clickEventIsOk){
                                gameComponents.fixFlag=true;
                                clickEventIsOk=false;
                                game.state=0;
                                moveFlag=true;
                                gameGrid.fillGridBoxs(gameComponents,3);
                                gameGridBox.gridBoxSize=[1,1];
                                setTimeout(function () {
                                    moveFlag=true;
                                },500);
                            }
                            break;
                        }
                        default:
                            break;
                    }
                }
            };
            canvas.onmouseout = function (ev) {
                clearInterval(drawAllHandler);
                gameGrid.gridBox.color=gameGrid.WHITE;
                //在game.state=0(已经放置下来以后)的时候，不用pop
                if(game.state===1)
                    playArea.playAreaComponents.pop();
                if(game.state===2)
                    playArea.playAreaComponents.pop();
                if(game.state===3)
                    playArea.playAreaComponents.pop();
                if(game.state===4)
                    playArea.playAreaComponents.pop();
                if(game.state===5)
                    playArea.playAreaComponents.pop();
                if(game.state===6)
                    playArea.playAreaComponents.pop();
                if(game.state===7)
                    playArea.playAreaComponents.pop();
                if(game.state===8)
                    playArea.playAreaComponents.pop();
                playArea.drawAll();
                canvas.onmousemove=null;
            };
        }
    };
    //点击新建三角形
    document.getElementById("symbolBox-tri").addEventListener("click",function () {
        if(game.state!==1){
            game.state=1;
        }
    });
    //点击新建圆
    document.getElementById("symbolBox-cir").addEventListener("click",function () {
        console.log("123");
        if(game.state!==2){
            game.state=2;
        }
    });
    //点击新建球
    document.getElementById("symbolBox-bal").addEventListener("click",function () {
        if(game.state!==3){
            game.state=3;
        }
    });
    //新建长板
    document.getElementById("symbolBox-baf").addEventListener("click",function () {
        if(game.state!==4){
            game.state=4;
        }
    });
    //新建吸收器
    document.getElementById("symbolBox-abs").addEventListener("click",function () {
        if(game.state!==5){
            game.state=5;
        }
    });
    //新建轨道
    document.getElementById("symbolBox-tra").addEventListener("click",function () {
        if(game.state!==6){
            game.state=6;
        }
    });
    //新建顺时针旋转挡板
    document.getElementById("symbolBox-lef").addEventListener("click",function () {
        if(game.state!==7){
            game.state=7;
        }
    });
    //新建逆时针旋转挡板
    document.getElementById("symbolBox-rig").addEventListener("click",function () {
        if(game.state!==8){
            game.state=8;
        }
    });
    //运行
    document.getElementById("run").addEventListener("click",function () {
        game.modes=1;
        runAllHandler=setInterval(function () {
            playArea.physicsAll(physicsEngine);
            playArea.drawAll();
        },20);
        window.addEventListener('keydown', doKeyDown, true);
    });
    //停止
    document.getElementById("stop").addEventListener("click",function () {
        game.modes=0;
        if(runAllHandler)
            clearInterval(runAllHandler);
        window.removeEventListener('keydown', doKeyDown, true);
    });
    //删除
    document.getElementById("delete").addEventListener("click",function () {
        game.modes=3;
        if(runAllHandler)
            clearInterval(runAllHandler);
        window.removeEventListener('keydown', doKeyDown, true);
    });
    //移动
    document.getElementById("move").addEventListener("click",function () {
        game.modes=4;
        if(runAllHandler)
            clearInterval(runAllHandler);
        window.removeEventListener('keydown', doKeyDown, true);
    });
    //放置
    document.getElementById("set").addEventListener("click",function () {
        game.modes=0;
        if(runAllHandler)
            clearInterval(runAllHandler);
        window.removeEventListener('keydown', doKeyDown, true);
    });
    //加号
    var addsDOM=document.getElementsByClassName("tool-num-add");
    for (let i = 0; i < addsDOM.length; i++) {
        addsDOM[i].addEventListener("click",function () {
            if(addsDOM[i].parentNode.childNodes[1].innerHTML==="尺寸"){
                if(addsDOM[i].parentNode.childNodes[5].childNodes[1].value<20){
                    addsDOM[i].parentNode.childNodes[5].childNodes[1].value=(addsDOM[i].parentNode.childNodes[5].childNodes[1].value-0)+1;
                }
            }
            else if(addsDOM[i].parentNode.childNodes[1].innerHTML==="角度"){
                if(addsDOM[i].parentNode.childNodes[5].childNodes[1].value<270){
                    addsDOM[i].parentNode.childNodes[5].childNodes[1].value=(addsDOM[i].parentNode.childNodes[5].childNodes[1].value-0)+90;
                    document.getElementById("symbolBox-tri").style.transform="rotate(-"+addsDOM[i].parentNode.childNodes[5].childNodes[1].value+"deg)";                }
            }
            else{
                if(addsDOM[i].parentNode.childNodes[5].childNodes[1].value<270){
                    addsDOM[i].parentNode.childNodes[5].childNodes[1].value=(addsDOM[i].parentNode.childNodes[5].childNodes[1].value-0)+90;
                }
            }
        });
    }
    //减号
    var addsDOM=document.getElementsByClassName("tool-num-minus");
    for (let i = 0; i < addsDOM.length; i++) {
        addsDOM[i].addEventListener("click",function () {
            if(addsDOM[i].parentNode.childNodes[1].innerHTML==="尺寸"){
                if(addsDOM[i].parentNode.childNodes[5].childNodes[1].value>1){
                    addsDOM[i].parentNode.childNodes[5].childNodes[1].value=(addsDOM[i].parentNode.childNodes[5].childNodes[1].value-0)-1;
                }
            }
            else if(addsDOM[i].parentNode.childNodes[1].innerHTML==="角度") {
                if(addsDOM[i].parentNode.childNodes[5].childNodes[1].value>0){
                    addsDOM[i].parentNode.childNodes[5].childNodes[1].value=(addsDOM[i].parentNode.childNodes[5].childNodes[1].value-0)-90;
                    document.getElementById("symbolBox-tri").style.transform="rotate(-"+addsDOM[i].parentNode.childNodes[5].childNodes[1].value+"deg)";
                }
            }
            else{
                if(addsDOM[i].parentNode.childNodes[5].childNodes[1].value>0){
                    addsDOM[i].parentNode.childNodes[5].childNodes[1].value=(addsDOM[i].parentNode.childNodes[5].childNodes[1].value-0)-90;
                }
            }
        });
    }
    //关闭场景列表
    document.getElementById("closeSceneList").addEventListener("click",function () {
        document.getElementById("main").style.cssText="";
        document.getElementById("mainHidden").style.cssText="";
    });
    //控制按键监听
    doKeyDown=function doKeyDown(e) {
        var keyID = e.keyCode ? e.keyCode :e.which;
        playArea.receiveKeyDown(keyID);
        // if(keyID === 38 || keyID === 87)  { // up arrow and W
        //     console.log('123');
        // }
        // if(keyID === 39 || keyID === 68)  { // right arrow and D
        //     console.log('234');
        // }
        // if(keyID === 40 || keyID === 83)  { // down arrow and S
        //     console.log('345');
        // }
        // if(keyID === 37 || keyID === 65)  { // left arrow and A
        //     console.log('456');
        // }
    };
    //根据JSON数据生成场景
    function  buildByFile(JSON_data) {
        console.log(JSON_data);
        var attachmentInfo=JSON_data.value.attachmentInfo;
        var gridBoxs=JSON_data.value.gridBoxs;
        game.modes=0;
        game.state=0;
        playArea.init();
        physicsEngine=new Gizmo.PhysicsEngine();
        clearInterval(runAllHandler);
        clearInterval(drawAllHandler);
        setTimeout(function () {
            gameGrid.gridBoxs=gridBoxs;
            for(var item in attachmentInfo){
                var currentComponent=attachmentInfo[item];
                switch (currentComponent.id.substring(0,3)){
                    case "Gam":{
                        if(currentComponent.id.substring(0,9)==="GameGridB"){//单个格子
                            gameGridBox.id=currentComponent.id;
                            gameGridBox.color=currentComponent.color;
                        }
                        else{//网格
                            gameGrid.id=currentComponent.id;
                            gameGrid.color=currentComponent.color;
                        }
                        break;
                    }
                    case "Tri":{
                        var triangle=new Gizmo.Triangle();
                        triangle.id=currentComponent.id;
                        triangle.center=currentComponent.center;
                        triangle.size=currentComponent.size;
                        triangle.color=currentComponent.color;
                        triangle.fixFlag=currentComponent.fixFlag;
                        triangle.angel=currentComponent.angel;
                        triangle.vertexsByCenter();
                        playArea.playAreaComponents.push(triangle);
                        break;
                    }
                    case "Cir":{
                        var circle=new Gizmo.Circle();
                        circle.id=currentComponent.id;
                        circle.center=currentComponent.center;
                        circle.size=currentComponent.size;
                        circle.color=currentComponent.color;
                        circle.fixFlag=currentComponent.fixFlag;
                        circle.angel=currentComponent.angel;
                        circle.vertexsByCenter();
                        playArea.playAreaComponents.push(circle);
                        break;
                    }
                    case "Bal":{
                        var ball=new Gizmo.Ball();
                        ball.id=currentComponent.id;
                        ball.center=currentComponent.center;
                        ball.size=currentComponent.size;
                        ball.color=currentComponent.color;
                        ball.fixFlag=currentComponent.fixFlag;
                        ball.angel=currentComponent.angel;
                        ball.sizeScal=currentComponent.sizeScal;
                        ball.vertexsByCenter();
                        playArea.playAreaComponents.push(ball);
                        break;
                    }
                    case "Baf":{
                        var baffle=new Gizmo.Baffle();
                        baffle.id=currentComponent.id;
                        baffle.center=currentComponent.center;
                        baffle.size=currentComponent.size;
                        baffle.color=currentComponent.color;
                        baffle.fixFlag=currentComponent.fixFlag;
                        baffle.angel=currentComponent.angel;
                        baffle.vertexsByCenter();
                        playArea.playAreaComponents.push(baffle);
                        break;
                    }
                    case "Abs":{
                        var absorber=new Gizmo.Absorber();
                        absorber.id=currentComponent.id;
                        absorber.center=currentComponent.center;
                        absorber.centers=currentComponent.centers;
                        absorber.size=currentComponent.size;
                        absorber.color=currentComponent.color;
                        absorber.fixFlag=currentComponent.fixFlag;
                        absorber.angel=currentComponent.angel;
                        absorber.vertexsByCenter();
                        playArea.playAreaComponents.push(absorber);
                        break;
                    }
                    case "Tra":{
                        var track=new Gizmo.Track();
                        track.id=currentComponent.id;
                        track.center=currentComponent.center;
                        track.centers=currentComponent.centers;
                        track.size=currentComponent.size;
                        track.color=currentComponent.color;
                        track.fixFlag=currentComponent.fixFlag;
                        track.angel=currentComponent.angel;
                        track.vertexsByCenter();
                        playArea.playAreaComponents.push(track);
                        break;
                    }
                    case "Rig":{
                        var rightBaffle=new Gizmo.RightBaffle();
                        rightBaffle.id=currentComponent.id;
                        rightBaffle.center=currentComponent.center;
                        rightBaffle.size=currentComponent.size;
                        rightBaffle.color=currentComponent.color;
                        rightBaffle.fixFlag=currentComponent.fixFlag;
                        rightBaffle.angel=currentComponent.angel;
                        rightBaffle.vertexsByCenter();
                        playArea.playAreaComponents.push(rightBaffle);
                        break;
                    }
                    case "Lef":{
                        var leftBaffle=new Gizmo.LeftBaffle();
                        leftBaffle.id=currentComponent.id;
                        leftBaffle.center=currentComponent.center;
                        leftBaffle.size=currentComponent.size;
                        leftBaffle.color=currentComponent.color;
                        leftBaffle.fixFlag=currentComponent.fixFlag;
                        leftBaffle.angel=currentComponent.angel;
                        leftBaffle.vertexsByCenter();
                        playArea.playAreaComponents.push(leftBaffle);
                        break;
                    }
                    default:
                        break;
                }
            }
            console.log(playArea.playAreaComponents);
            playArea.drawAll();
        },1000);
    }
    //十六进制颜色归一化
    function HexToFloat(value) {
        var color=[,,,1.0];
        color[0]=parseInt(value.substring(1,3),16)/255;
        color[1]=parseInt(value.substring(3,5),16)/255;
        color[2]=parseInt(value.substring(5,7),16)/255;
        return color;
    }
    //初始化函数
    function init() {
        //gridBox
        document.getElementById("symbolBox-gridBox").style.cssText="background:#87cefa";
        gameGrid.color= HexToFloat("#87cefa");
        //triangle
        document.getElementById("symbolBox-tri").style.cssText="background: #ff80c0;";
        document.getElementById("changeTri").value="#ff80c0";
        //circle
        document.getElementById("symbolBox-cir").style.cssText="background: #0080ff;";
        document.getElementById("changeCir").value="#0080ff";
        //ball
        document.getElementById("symbolBox-bal").style.cssText="background: #ffffff;";
        document.getElementById("changeBal").value="#ffffff";
        //Baffle
        document.getElementById("symbolBox-baf").style.cssText="background: #80ff80;";
        document.getElementById("changeBaf").value="#80ff80";
        //Absorber
        document.getElementById("symbolBox-abs").style.cssText="background: #ffffff;";
        document.getElementById("changeAbs").value="#ffffff";
        //Track
        document.getElementById("symbolBox-tra").style.cssText="background: #ff8040;";
        document.getElementById("changeTra").value="#ff8040";
        //LeftBaffle
        document.getElementById("symbolBox-lef").style.cssText="border-left: 2px solid #e9e975;";
        document.getElementById("changeLef").value="#e9e975";
        //RightBaffle
        document.getElementById("symbolBox-rig").style.cssText="border-right:2px solid #e9e975;";
        document.getElementById("changeRig").value="#e9e975";
        //GameGridBox(no)
        document.getElementById("symbolBox-gridBoxSS").style.cssText="border:1px solid #ff0000;";
        document.getElementById("changeColorGridBoxSS").value="#ff0000";
        //GameGridBox(ok)
        document.getElementById("symbolBox-gridBoxS").style.cssText="border:1px solid #00ff00;";
        document.getElementById("changeColorGridBoxS").value="#00ff00";
    }
};

//工具菜单栏缩放控制
function toolMenuControl(id){
    switch (id){
        case 0: {
            var toolMenuBar = document.getElementById("toolBar-gridBox");
            var toolContent = document.getElementById("toolContent-gridBox");
            if(toolMenuBar.getAttribute("data")==="true"){
                toolMenuBar.setAttribute("data","false");
                toolMenuBar.children[1].style.cssText="transform:rotate(-90deg)";
                toolContent.style.cssText="height: 0";
            }
            else{
                toolMenuBar.setAttribute("data","true");
                toolMenuBar.children[1].style.cssText="transform:rotate(0)";
                toolContent.style.cssText="height: 2.7em";
            }
            break;
        }
        case 1: {
            var toolMenuBar = document.getElementById("toolBar-gridBoxS");
            var toolContent = document.getElementById("toolContent-gridBoxS");
            if(toolMenuBar.getAttribute("data")==="true"){
                toolMenuBar.setAttribute("data","false");
                toolMenuBar.children[1].style.cssText="transform:rotate(-90deg)";
                toolContent.style.cssText="height: 0";
            }
            else{
                toolMenuBar.setAttribute("data","true");
                toolMenuBar.children[1].style.cssText="transform:rotate(0)";
                toolContent.style.cssText="height: 5.4em";
            }
            break;
        }
        case 2: {
            var toolMenuBar = document.getElementById("toolBar-tri");
            var toolContent = document.getElementById("toolContent-tri");
            if(toolMenuBar.getAttribute("data")==="true"){
                toolMenuBar.setAttribute("data","false");
                toolMenuBar.children[1].style.cssText="transform:rotate(-90deg)";
                toolContent.style.cssText="height: 0";
            }
            else{
                toolMenuBar.setAttribute("data","true");
                toolMenuBar.children[1].style.cssText="transform:rotate(0)";
                toolContent.style.cssText="height: 8.1em";
            }
            break;
        }
        case 3: {
            var toolMenuBar = document.getElementById("toolBar-cir");
            var toolContent = document.getElementById("toolContent-cir");
            if(toolMenuBar.getAttribute("data")==="true"){
                toolMenuBar.setAttribute("data","false");
                toolMenuBar.children[1].style.cssText="transform:rotate(-90deg)";
                toolContent.style.cssText="height: 0";
            }
            else{
                toolMenuBar.setAttribute("data","true");
                toolMenuBar.children[1].style.cssText="transform:rotate(0)";
                toolContent.style.cssText="height: 5.4em";
            }
            break;
        }
        case 4: {
            var toolMenuBar = document.getElementById("toolBar-bal");
            var toolContent = document.getElementById("toolContent-bal");
            if(toolMenuBar.getAttribute("data")==="true"){
                toolMenuBar.setAttribute("data","false");
                toolMenuBar.children[1].style.cssText="transform:rotate(-90deg)";
                toolContent.style.cssText="height: 0";
            }
            else{
                toolMenuBar.setAttribute("data","true");
                toolMenuBar.children[1].style.cssText="transform:rotate(0)";
                toolContent.style.cssText="height: 5.4em";
            }
            break;
        }
        case 5: {
            var toolMenuBar = document.getElementById("toolBar-baf");
            var toolContent = document.getElementById("toolContent-baf");
            if(toolMenuBar.getAttribute("data")==="true"){
                toolMenuBar.setAttribute("data","false");
                toolMenuBar.children[1].style.cssText="transform:rotate(-90deg)";
                toolContent.style.cssText="height: 0";
            }
            else{
                toolMenuBar.setAttribute("data","true");
                toolMenuBar.children[1].style.cssText="transform:rotate(0)";
                toolContent.style.cssText="height: 5.4em";
            }
            break;
        }
        case 6: {
            var toolMenuBar = document.getElementById("toolBar-abs");
            var toolContent = document.getElementById("toolContent-abs");
            if(toolMenuBar.getAttribute("data")==="true"){
                toolMenuBar.setAttribute("data","false");
                toolMenuBar.children[1].style.cssText="transform:rotate(-90deg)";
                toolContent.style.cssText="height: 0";
            }
            else{
                toolMenuBar.setAttribute("data","true");
                toolMenuBar.children[1].style.cssText="transform:rotate(0)";
                toolContent.style.cssText="height: 5.4em";
            }
            break;
        }
        case 7: {
            var toolMenuBar = document.getElementById("toolBar-tra");
            var toolContent = document.getElementById("toolContent-tra");
            if(toolMenuBar.getAttribute("data")==="true"){
                toolMenuBar.setAttribute("data","false");
                toolMenuBar.children[1].style.cssText="transform:rotate(-90deg)";
                toolContent.style.cssText="height: 0";
            }
            else{
                toolMenuBar.setAttribute("data","true");
                toolMenuBar.children[1].style.cssText="transform:rotate(0)";
                toolContent.style.cssText="height: 5.4em";
            }
            break;
        }
        case 8: {
            var toolMenuBar = document.getElementById("toolBar-lef");
            var toolContent = document.getElementById("toolContent-lef");
            if(toolMenuBar.getAttribute("data")==="true"){
                toolMenuBar.setAttribute("data","false");
                toolMenuBar.children[1].style.cssText="transform:rotate(-90deg)";
                toolContent.style.cssText="height: 0";
            }
            else{
                toolMenuBar.setAttribute("data","true");
                toolMenuBar.children[1].style.cssText="transform:rotate(0)";
                toolContent.style.cssText="height: 5.4em";
            }
            break;
        }
        case 9: {
            var toolMenuBar = document.getElementById("toolBar-rig");
            var toolContent = document.getElementById("toolContent-rig");
            if(toolMenuBar.getAttribute("data")==="true"){
                toolMenuBar.setAttribute("data","false");
                toolMenuBar.children[1].style.cssText="transform:rotate(-90deg)";
                toolContent.style.cssText="height: 0";
            }
            else{
                toolMenuBar.setAttribute("data","true");
                toolMenuBar.children[1].style.cssText="transform:rotate(0)";
                toolContent.style.cssText="height: 5.4em";
            }
            break;
        }
        default:
            break;
    }
}




