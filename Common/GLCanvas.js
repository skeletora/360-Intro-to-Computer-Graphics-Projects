function Canvas(width, height, locID){
    if(width == undefined || width < 0){
        width = 300;
    }
    
    if(height == undefined || height < 0){
        height = 300;
    }
    
    var canvas = document.createElement('canvas')
        canvas.height = height;
        canvas.width = width;
        
    if(locID == undefined){
        document.body.appendChild(canvas);
    } else{
        div = document.getElementById(locID);
        if(null == div){
            document.body.appendChild(canvas);
        } else{
            div.appendChild(canvas);
        }
    }
    
    document.body.appendChild(canvas);
    
    this.height = height;
    this.width = width;
    
    //new stuff
    this.gl = WebGLUtils.setupWebGL(canvas);
    if(!this.gl){
        alert ("WebGL isn't available");
    }
    
    this.gl.viewport(0, 0, width, height);
    
    program = initShaders(this.gl, "vertex-shader","fragment-shader");
    this.gl.useProgram(program);
    
    var bufferID = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferID);
    
    var vPosition = this.gl.getAttribLocation(program, "vPosition");
    this.gl.vertexAttribPointer(vPosition, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(vPosition);
    //end of new stuff
    
    this.count = 2000;
    this.Init();
    
    return this;
}

Canvas.prototype = {
    Init: function() {
        this.list = [];
        
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        
        var p1 = vec2(this.width/2, this.height-20);
        var p2 = vec2(20, 20);
        var p3 = vec2(this.width-20, 20);
        
        this.tri = [p1, p2, p3]
        
        this.MakePoints();
        
        var gl = this.gl;  //this is simply so I don't have to type this.gl all the time
        this.gl.bufferData(gl.ARRAY_BUFFER, flatten(this.list), gl.STATIC_DRAW);
    },
    
    Interp: function(a, b, s){
        return a * (1-s) + b * s;
    },
    
    RandPoint: function(p1, p2){
        var s = Math.random();
        var x = this.Interp(p1[0], p2[0], s);
        var y = this.Interp(p1[1], p2[1], s);
        return vec2(x, y);
    },
    
    HalfPoint: function(p1, p2){
        var x = this.Interp(p1[0], p2[0], 0.5);
        var y = this.Interp(p1[1], p2[1], 0.5);
        return vec2(x, y);
    },
    
    MakePoints: function(){
        var p, q, v;
        var tmp;
        
        var scaleFactor = 2/Math.max(this.height, this.width);
        
        var t1 = this.RandPoint(this.tri[0], this.tri[1]);
        p = this.RandPoint(t1, this.tri[2]);
        
        for(var i = 0; i < this.count; i++){
            var c = Math.floor(Math.random() * 3);
            v = this.tri[c];
            q = this.HalfPoint(p,v);
            
            //add and scale are matrix operations from ML.js
            tmp = add(q, [-this.width/2.0, - this.height/2.0]);
            tmp = scale(scaleFactor, tmp);
            
            this.list.push(tmp);
            
            p = q;
        }
        
        return;
        
    },
    
    Redisplay: function(){
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.POINTS, 0, this.count);
        return;
    }
}
