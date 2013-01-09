// Scriber singleton
gui.scriber = (function($, gui) {

    var scriber = null;
    
    // =======================================Private variables
    var backupCanvas = document.createElement('canvas');
    var toolbox, canvasContainer, circle, toolsCenter, imgMover, imgResizer, imgDeleter;
    var ctx, imgctx, sizectx, sizesetctx, backupCtx = backupCanvas.getContext('2d');
    var closeBn, confirmBn, resizeBn, toolbox, anchor, imgBn, drawBn, eraseBn, sizeBn, sizeset, sizebloc, colorset;
    var colors = ['#201b21', '#ef1c22', '#f77100', '#ffdf1a', '#21d708', '#0182e7', '#914ce4'];
    var sizes = [3, 4, 5, 6, 7];
    var startx, starty, startr, starta, originx, originy, originw, originh;
    var curr = {
        manip: "none"
    };
    var resizeCb, moveImgCb, resizeImgCb;
    
    // =======================================Private functions
    
    // Property updates
    var updateSize = function(sid) {
        if(isNaN(sid)) return;
        
        if(curr.manip != 'Erase') ctx.lineWidth = sizes[sid];
        else ctx.lineWidth = sizes[sid] + 5;
        sizectx.lineWidth = sizes[sid];
    
        sizectx.clearRect(0, 0, 32, 32);
        sizectx.beginPath();
        sizectx.moveTo(15, 4);
        sizectx.bezierCurveTo(-5, 16, 56, 12, 4, 30);
        sizectx.stroke();
        
        sizebloc.css('top', 40 * (sid+1)-2);
    };
    
    var updateColor = function(cid) {
        colorset.children().removeClass('active');
        colorset.children().eq(cid).addClass('active');
        drawBn.css('background', colors[cid]);
        
        ctx.strokeStyle = colors[cid];
        sizectx.strokeStyle = colors[cid];
        sizesetctx.strokeStyle = colors[cid];
        
        sizectx.clearRect(0, 0, 32, 32);
        sizesetctx.clearRect(0, 0, 32, 300);
        // Size icon update
        sizectx.beginPath();
        sizectx.moveTo(15, 4);
        sizectx.bezierCurveTo(-5, 16, 56, 12, 4, 30);
        sizectx.stroke();
        // Size set canvas update
        for(var i = 0; i < sizes.length; ++i) {
            var offset = 2+i*40;
            sizesetctx.lineWidth = sizes[i];
            sizesetctx.beginPath();
            sizesetctx.moveTo(15, 4+offset);
            sizesetctx.bezierCurveTo(-5, 16+offset, 56, 12+offset, 4, 30+offset);
            sizesetctx.stroke();
        }
    };
    
    // Update current tool
    var updateToolbox = function(id) {
        var tools = toolbox.children('ul').children();
        tools.removeClass('active');
        tools.eq(id).addClass('active');
    };
    
    // Update draw Canvas
    var updateCanvas = function(w, h) {
        scriber.drawCanvas.width = w;
        scriber.drawCanvas.height = h;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = sizes[scriber.sizeid];
        ctx.strokeStyle = colors[scriber.colorid];
        ctx.drawImage(backupCanvas, 0, 0);
    };
    
    
    // Canvas resize
    var bodyResizeHandler = function(e) {
        if(e.type == "gestureUpdate") canvasResizing(e);
        else if(e.type == "gestureEnd") finiCanvasResize(e);
    };
    resizeCb = new Callback(bodyResizeHandler, null);
    var startCanvasResize = function(e) {
        if(curr.manip != "none") return;
        startx = e.windowX;
        starty = e.windowY;
        originw = canvasContainer.width();
        originh = canvasContainer.height();
        $('body').mseInteraction().mseInteraction('addListener', 'gestureSingle', resizeCb);
        
        backupCanvas.width = originw;
        backupCanvas.height = originh;
        backupCtx.drawImage(scriber.drawCanvas, 0, 0);
        
        curr.manip = "CanvasResize";
    };
    var canvasResizing = function(e) {
        if(curr.manip != "CanvasResize") return;
        var dx = e.windowX - startx;
        var dy = e.windowY - starty;
        var w = originw + dx, h = originh + dy;
        if(w < 50 || h < 50) return;
        canvasContainer.css({'width': w, 'height': h});
        updateCanvas(w, h);
    };
    var finiCanvasResize = function(e) {
        if(curr.manip != "CanvasResize") return;
        curr.manip = "none";
        $('body').mseInteraction('destroy');
    };
    
    
    // Move toolbox
    var startMoveToolbox = function(e) {
        if(curr.manip != "none") return;
        startx = e.pageX;
        starty = e.pageY;
        originx = toolbox.position().left;
        originy = toolbox.position().top;
        $('body').mouseup(finiToolboxMove).mousemove(toolboxMoving);
        
        curr.manip = "ToolboxMove";
    };
    var toolboxMoving = function(e) {
        if(curr.manip != "ToolboxMove") return;
        var dx = e.pageX - startx;
        var dy = e.pageY - starty;
        var x = originx + dx, y = originy + dy;
        toolbox.css({'left': x, 'top': y});
    };
    var finiToolboxMove = function(e) {
        if(curr.manip != "ToolboxMove") return;
        curr.manip = "none";
        $('body').unbind('mouseup', finiToolboxMove);
        $('body').unbind('mousemove', toolboxMoving);
    };
    
    
    // Draw functions
    var startDraw = function(e) {
        if(curr.manip != "none") return;
        startx = e.offsetX;
        starty = e.offsetY;
        
        ctx.beginPath();
        ctx.moveTo(startx, starty);
        
        curr.manip = "Draw";
    };
    var drawing = function(e) {
        if(curr.manip != "Draw") return;
        var x = e.offsetX, y = e.offsetY;
        
        ctx.lineTo(x, y);
        ctx.stroke();
    };
    var finiDraw = function(e) {
        if(curr.manip != "Draw") return;
        curr.manip = "none";
    };
    
    
    // Eraser functions
    var startErase = function(e) {
        if(curr.manip != "none") return;
        startx = e.offsetX;
        starty = e.offsetY;
        
        $(this).css('cursor', 'default');
        ctx.save();
        ctx.globalCompositeOperation = "copy";
        ctx.strokeStyle = "rgba(0,0,0,0)";
        ctx.lineWidth += 5;
        ctx.beginPath();
        ctx.moveTo(startx, starty);
        
        curr.manip = "Erase";
    };
    var erasing = function(e) {
        if(curr.manip != "Erase") return;
        var x = e.offsetX, y = e.offsetY;
        
        ctx.lineTo(x, y);
        ctx.stroke();
    };
    var finiErase = function(e) {
        if(curr.manip != "Erase") return;
        ctx.restore();
        curr.manip = "none";
    };
    
    
    // Image move function
    var moveImgHandler = function(e) {
        if(e.type == "gestureUpdate") imgMoving(e);
        else if(e.type == "gestureEnd") finiImgMove(e);
    };
    moveImgCb = new Callback(moveImgHandler, null);
    var startMoveImg = function(e) {
        if(curr.manip != "none") return;
        startx = e.windowX;
        starty = e.windowY;
        originx = scriber.imgPos[0];
        originy = scriber.imgPos[1];
        canvasContainer.mseInteraction('addListener', 'gestureSingle', moveImgCb);
        
        curr.manip = "ImgMove";
    };
    var imgMoving = function(e) {
        if(curr.manip != "ImgMove") return;
        var dx = e.windowX - startx;
        var dy = e.windowY - starty;
        var x = originx + dx, y = originy + dy;
        scriber.setimgPos([x, y]);
        toolsCenter.css({left:x+scriber.imgSize[0]/2, top:y+scriber.imgSize[1]/2});
    };
    var finiImgMove = function(e) {
        if(curr.manip != "ImgMove") return;
        curr.manip = "none";
        canvasContainer.mseInteraction('addListener', 'gestureSingle', scriber.cb.showImgTools); 
    };
    // Remove image function
    var deleteImg = function(e) {
        imgctx.clearRect(0, 0, scriber.imgSize[0], scriber.imgSize[1]);
    };
    // Image resize function
    var resizeImgHandler = function(e) {
        if(e.type == "gestureUpdate") imgResizing(e);
        else if(e.type == "gestureEnd") finiImgResize(e);
    };
    resizeImgCb = new Callback(resizeImgHandler, null);
    var startResizeImg = function(e) {
        if(curr.manip != "none") return;
        
        startx = e.windowX;
        starty = e.windowY;
        var pos = imgResizer.position();
        originx = pos.left;
        originy = pos.top;
        
        var ox = imgMover.position().left,
            oy = imgMover.position().top,
            rx = imgResizer.position().left,
            ry = imgResizer.position().top;
        startr = distance2Pts(ox, oy, rx, ry);
        starta = mseAngleForLine(ox, oy, rx, ry);
        
        var img = $(scriber.imgCanvas);
        originw = img.width();
        originh = img.height();
        
        backupCanvas.width = originw;
        backupCanvas.height = originh;
        backupCtx.drawImage(scriber.imgCanvas, 0, 0);
        
        canvasContainer.mseInteraction('addListener', 'gestureSingle', resizeImgCb);
        curr.manip = "ImgResize";
    };
    var imgResizing = function(e) {
        if(curr.manip != "ImgResize") return;
        
        var dx = e.windowX - startx;
        var dy = e.windowY - starty;
        if(dx == 0 && dy == 0) return;
        
        var ox = -25,
            oy = -25,
            rx = originx+dx,
            ry = originy+dy;
        var r = distance2Pts(ox, oy, rx, ry);
        var a = angleForLine(ox, oy, rx, ry);
        
        imgResizer.css({left: r*Math.cos(a)-25, top: r*Math.sin(a)-25});
        
        circle.css({
            left: -r,
            top: -r,
            width: r*2,
            height: r*2,
            'border-radius': r
        });
        
        var scale = r / startr;
        var w = originw * scale, h = originh * scale;
        var cx = toolsCenter.position().left, cy = toolsCenter.position().top;
        scriber.setimgPos([cx-w/2, cy-h/2]);
        scriber.setimgSize([w, h]);
        scriber.setimgRot(Math.round(180 * a/(Math.PI)));
        imgctx.drawImage(backupCanvas, 0, 0, originw, originh, 0, 0, w, h);
    };
    var finiImgResize = function(e) {
        if(curr.manip != "ImgResize") return;
        curr.manip = "none";
        canvasContainer.mseInteraction('addListener', 'gestureSingle', scriber.cb.showImgTools);
    };
    
    
    // =======================================Scriber Class
    var Scriber = function(){
        this.init();
    };
    Scriber.prototype = {
        jq: null,
        imgCanvas: null,
        drawCanvas: null,
        sizeid: 0,
        colorid: 0,
        toolid: 0,
        imgPos: [0, 0],
        imgSize: [0, 0],
        imgRot: 0,
        
        updateImagePos: function(pos) {
            $(this.imgCanvas).css({left: pos[0], top: pos[1]});
        },
        updateImageSize: function(size) {
            this.imgCanvas.width = size[0];
            this.imgCanvas.height = size[1];
            this.imgCanvas.style.width = size[0];
            this.imgCanvas.style.height = size[1];
            $(this.imgCanvas).css({width: size[0], height: size[1]});
        },
        updateImageRot: function(rotation) {
            $(this.imgCanvas).css({'-webkit-transform' : 'rotate('+rotation+'deg)',
                                   '-moz-transform' : 'rotate('+rotation+'deg)',
                                   '-ms-transform' : 'rotate('+rotation+'deg)',
                                   '-o-transform' : 'rotate('+rotation+'deg)',
                                   'transform' : 'rotate('+rotation+'deg)'});
        },
        inImgCanvas: function(e) {
            var res = ptRotated(e.offsetX, e.offsetY, 
                                this.imgPos[0]+this.imgSize[0]/2, this.imgPos[1]+this.imgSize[1]/2, 
                                Math.PI * this.imgRot / 180);
            var ox = res.x - this.imgPos[0], oy = res.y - this.imgPos[1];
            if(ox >= 0 && ox <= this.imgSize[0] && oy >= 0 && oy <= this.imgSize[1])
                return true;
            else return false;
        },
        
        drawHandler: function(e) {
            if(e.type == "gestureStart") startDraw(e);
            else if(e.type == "gestureUpdate") drawing(e);
            else if(e.type == "gestureEnd") finiDraw(e);
        },
        eraseHandler: function(e) {
            if(e.type == "gestureStart") startErase(e);
            else if(e.type == "gestureUpdate") erasing(e);
            else if(e.type == "gestureEnd") finiErase(e);
        },
        resizeHandler: function(e) {
            if(e.type == "gestureStart") startCanvasResize(e);
            else if(e.type == "gestureEnd") finiCanvasResize(e);
        },
        moveImgHandler: function(e) {
            if(e.type == "gestureStart") startMoveImg(e);
            else if(e.type == "gestureEnd") finiImgMove(e);
        },
        resizeImgHandler: function(e) {
            if(e.type == "gestureStart") startResizeImg(e);
            else if(e.type == "gestureEnd") finiImgResize(e);
        },
        showImgTools: function(e) {
            if(e.type == "gestureStart") {
                if(!toolsCenter.hasClass('active') && this.inImgCanvas(e)) {
                    var x = this.imgPos[0] + this.imgSize[0]/2;
                    var y = this.imgPos[1] + this.imgSize[1]/2;
                    toolsCenter.css({left:x, top:y}).addClass('active');
                }
                else toolsCenter.removeClass('active');
            }
        },
        
        desactiveTools: function() {
            $(this.drawCanvas).unbind('mouseout').mseInteraction('removeListener', 'gestureSingle');
            canvasContainer.mseInteraction('removeListener', 'gestureSingle');
            toolsCenter.removeClass('active');
        },
        activeTool: function(id) {
            switch(id) {
            case 0: // Image resizer
                this.desactiveTools();
                var img = $(this.imgCanvas);
                // Active Image resizer
                canvasContainer.mseInteraction('addListener', 'gestureSingle', this.cb.showImgTools); 
            break;
            case 1: // Pencil
                this.desactiveTools();
                $(this.drawCanvas).mseInteraction('addListener', 'gestureSingle', this.cb.draw).mouseout(finiDraw);
            break;
            case 2: // Eraser
                this.desactiveTools();
                $(this.drawCanvas).mseInteraction('addListener', 'gestureSingle', this.cb.erase).mouseout(finiErase);
            break;
            }
        },
        
        showWithImg: function(imgData, width, height) {
            gui.center.append(gui.scriber.jq);
            this.jq.show();
            this.jq.css({
                'left': -(width>210 ? width : 210)/2,
                'top': -(50+height)/2
            });
            
            canvasContainer.css({'width':width, 'height':height});
            // Resize draw canvas
            this.drawCanvas.width = width;
            this.drawCanvas.height = height;
            
            // Set initial image configs
            this.setimgPos([0, 0]);
            this.setimgSize([width, height]);
            this.setimgRot(0);
            
            // Set initial color and size
            this.setsizeid(0);
            this.setcolorid(0);
            // Set initial tool to pencil
            this.settoolid(1);
            
            // Init circle tools
            circle.css({
                left: -75, top: -75,
                width: 150, height: 150,
                'border-radius': 75
            });
            imgResizer.css({left: 50, top: -25});
            imgMover.mseInteraction('addListener', 'gestureSingle', this.cb.moveimg);
            imgResizer.mseInteraction('addListener', 'gestureSingle', this.cb.resizeimg);
            //imgDeleter.click(deleteImg);
            
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            imgctx.putImageData(imgData, 0, 0);
        },
        close: function() {
            this.desactiveTools();
            imgMover.mseInteraction('removeListener', 'gestureSingle');
            imgResizer.mseInteraction('removeListener', 'gestureSingle');
            //imgDeleter.unbind('click', deleteImg);
        
            this.jq.detach();
        },
        init: function() {
            // Private variable
            closeBn = $('#scriber .close');
            confirmBn = $('#scriber #sb_confirm');
            resizeBn = $('#scriber .resize');
            toolbox = $('#scriber .toolbox');
            anchor = $('#scriber .anchor');
            imgBn = $('#scriber .toolbox #sb_img');
            drawBn = $('#scriber .toolbox #sb_pencil').css('background', colors[0]);
            colorset = $('#scriber .toolbox #sb_colorset');
            eraseBn = $('#scriber .toolbox #sb_eraser');
            sizeBn = $('#scriber .toolbox #sb_size');
            sizeset = $('#scriber .toolbox #sb_sizeset');
            sizebloc = $('#scriber .toolbox #sb_sizebloc');
            canvasContainer = $('#scriber .canvas_container');
            circle = $('#scriber .circle');
            toolsCenter = $('#scriber #circle_center');
            imgMover = toolsCenter.children('.moveicon');
            imgResizer = toolsCenter.children('.dragicon');
            imgDeleter = toolsCenter.children('.deleteicon');
            
            sizectx = sizeBn.get(0).getContext('2d');
            sizesetctx = sizeset.get(0).getContext('2d');
            sizectx.strokeColor = colors[0];
            sizesetctx.strokeColor = colors[0];
            sizectx.lineCap = 'round';
            sizectx.lineJoin = 'round';
            sizesetctx.lineCap = 'round';
            sizesetctx.lineJoin = 'round';
            var scriber = this;
            
            // Public variable
            this.jq = $('#scriber');
            this.imgCanvas = $('#scriber #sb_imgcanvas').get(0);
            this.drawCanvas = $('#scriber #sb_drawcanvas').get(0);
            
            ctx = this.drawCanvas.getContext('2d');
            imgctx = this.imgCanvas.getContext('2d');
            
            // Mvc model init
            mmvc.makeModel(this, ['sizeid', 'colorid', 'toolid', 'imgSize', 'imgPos', 'imgRot']);
            this.observe('sizeid', new Callback(updateSize, null));
            this.observe('colorid', new Callback(updateColor, null));
            this.observe('toolid', new Callback(updateToolbox, null));
            // Tools functions
            this.observe('toolid', new Callback(this.activeTool, this));
            // Image canvas update functions
            this.observe('imgSize', new Callback(this.updateImageSize, this));
            this.observe('imgPos', new Callback(this.updateImagePos, this));
            this.observe('imgRot', new Callback(this.updateImageRot, this));
            
            
            // =======================================Scriber interaction
            
            // MseInteraction
            $(this.drawCanvas).mseInteraction();
            imgMover.mseInteraction();
            imgResizer.mseInteraction();
            canvasContainer.mseInteraction();
            this.cb = {
                'draw': new Callback(this.drawHandler, this),
                'erase': new Callback(this.eraseHandler, this),
                'resize': new Callback(this.resizeHandler, this),
                'moveimg': new Callback(this.moveImgHandler, this),
                'resizeimg': new Callback(this.resizeImgHandler, this),
                'showImgTools': new Callback(this.showImgTools, this)
            };
                        
            // Close
            closeBn.bind('click', {scriber:this}, function(e){
                // Retrieve the cavnvas image data
                var canvas = e.data.scriber.imgCanvas;
                var img = canvas.toDataURL();
                
                e.data.scriber.close();
                
                gui.openComment();
                gui.setCommentImage(img, 'base64');
            });
            // Confirm
            confirmBn.bind('click', {scriber:this}, function(e) {
                var sc = e.data.scriber;
                // Retrieve the cavnvas image data
                backupCanvas.width = sc.drawCanvas.width;
                backupCanvas.height = sc.drawCanvas.height;
                backupCtx.save();
                backupCtx.translate(sc.imgPos[0]+sc.imgSize[0]/2, sc.imgPos[1]+sc.imgSize[1]/2);
                backupCtx.rotate(Math.PI * sc.imgRot / 180);
                backupCtx.translate(-sc.imgSize[0]/2, -sc.imgSize[1]/2);
                backupCtx.drawImage(sc.imgCanvas, 0, 0);
                backupCtx.restore();
                backupCtx.drawImage(sc.drawCanvas, 0, 0);
                
                var img = backupCanvas.toDataURL();
                
                sc.close();
                
                gui.openComment();
                gui.setCommentImage(img, 'base64');
            });
            // Colorset choose
            colorset.children().each(function(id) {
                $(this).click(function() {
                    // For mmvc call
                    scriber.setcolorid(id);
                    
                });
            });
            // Sizeset choose
            sizeset.click(function(e) {
                var i = Math.floor(e.offsetY / 40);
                // For mmvc call
                scriber.setsizeid(i);
            });
            // Resize
            resizeBn.mseInteraction().mseInteraction("addListener", "gestureSingle", this.cb.resize);
            // Move toolbox
            anchor.mousedown(startMoveToolbox);
            // Tool choose
            toolbox.children('ul').children('li:lt(3)').each(function(id) {
                $(this).click(function() {
                    scriber.settoolid(id);
                });
            });
            
            
            // Remove scriber temporarly
            this.jq.detach();
        }
    };
    
    return {
        init: function() {
            if(!(scriber instanceof Scriber)) 
                scriber = new Scriber();
            gui.scriber = scriber;
        }
    };
}(jQuery, gui));