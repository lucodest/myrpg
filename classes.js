class Vector2{
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }

    get magnitude(){
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    static add(a, b){
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    static sub(a, b){
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    static mul(a, f){
        return new Vector2(a.x * f, a.y * f);
    }

    static div(a, f){
        return new Vector2(a.x / f, a.y / f);
    }

    get normalized(){
        return Vector2.div(this, this.magnitude);
    }
}

//game chunk
class Chunk{
    constructor(_c) {
        this.coord = _c; //chunk coordinate
        this.features = []; //chunk features (like trees, rocks, buildings)
    }
}

class chunkFeature{
    constructor(_p, _r, _t) {
        this.position = _p;
        this.rotation = _r;
        this.type = _t;
    }
}

//constant objects

const drawables = {
    tree : {
        vao: 0,
        tex: 0,
        setup: async function (gl) {
            let square = geometry.t_square(5);
            let pb = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, pb);
            gl.bufferData(gl.ARRAY_BUFFER, square[0], gl.STATIC_DRAW);

            let va = gl.createVertexArray();
            gl.bindVertexArray(va);
            gl.enableVertexAttribArray(shaders['sprite'].attr['position']);
            gl.vertexAttribPointer(shaders['sprite'].attr['position'], 2, gl.FLOAT, false, 8, 0);

            let ib = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, square[1], gl.STATIC_DRAW);

            this.vao = va;

            this.tex = await loadTexture('res/tree1.png', gl);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
        },
        draw: function (gl, pos, rot) {
            gl.activeTexture(gl.TEXTURE0 + 1);
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            gl.bindVertexArray(this.vao);
            gl.useProgram(shaders['sprite'].sprogram);
            gl.uniform1i(shaders['sprite'].unifr['tex'], 1);
            gl.uniform2f(shaders['sprite'].unifr['view'],  player.position.x - pos.x, player.position.y - pos.y);
            gl.uniform1f(shaders['sprite'].unifr['rotation'], rot);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
        }
    },
    grass : {
        vao : 0,
        tex: 0,
        size: 2,
        setup : async function (gl) {
            let ss = geometry.t_square(2);
            let pb = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, pb);
            gl.bufferData(gl.ARRAY_BUFFER, ss[0], gl.STATIC_DRAW);

            let va = gl.createVertexArray();
            gl.bindVertexArray(va);
            gl.enableVertexAttribArray(shaders['overlay'].attr['position']);
            gl.vertexAttribPointer(shaders['overlay'].attr['position'], 2, gl.FLOAT, false, 8, 0);

            let ib = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ss[1], gl.STATIC_DRAW);

            this.vao = va;

            this.tex = await loadTexture('res/grass3c.png', gl);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
        },
        draw : function (gl) {
            gl.activeTexture(gl.TEXTURE0 + 2);
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            gl.bindVertexArray(this.vao);
            gl.useProgram(shaders['overlay'].sprogram);
            gl.uniform1i(shaders['overlay'].unifr['tex'], 2);
            gl.uniform1f(shaders['overlay'].unifr['viewsize'], this.size);
            gl.uniform2f(shaders['overlay'].unifr['view'],  -player.position.x / (viewsize * 2), player.position.y / (viewsize * 2));
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
        }
    },
    rock : {
        vao: 0,
        tex: 0,
        setup: async function (gl) {
            let square = geometry.t_square(5);
            let pb = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, pb);
            gl.bufferData(gl.ARRAY_BUFFER, square[0], gl.STATIC_DRAW);

            let va = gl.createVertexArray();
            gl.bindVertexArray(va);
            gl.enableVertexAttribArray(shaders['sprite'].attr['position']);
            gl.vertexAttribPointer(shaders['sprite'].attr['position'], 2, gl.FLOAT, false, 8, 0);

            let ib = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, square[1], gl.STATIC_DRAW);

            this.vao = va;

            this.tex = await loadTexture('res/rock1.png', gl);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
        },
        draw: function (gl, pos, rot) {
            gl.activeTexture(gl.TEXTURE0 + 3);
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            gl.bindVertexArray(this.vao);
            gl.useProgram(shaders['sprite'].sprogram);
            gl.uniform1i(shaders['sprite'].unifr['tex'], 3);
            gl.uniform2f(shaders['sprite'].unifr['view'],  player.position.x - pos.x, player.position.y - pos.y);
            gl.uniform1f(shaders['sprite'].unifr['rotation'], rot);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
        }
    }
};

//Game world is made of chunks of finite sizes
const world = {
    seed: 69, //world gen seed (integer)
    chunkSize: 100, //viewsize of each chunk
    modChunks : [], //modified chunk cache
    chunksCache: [],
    chunkGrid:{//chunk grid visual debug element
        vao : 0,//VAO object
        es: 0,//element index buffer viewsize
        draw : function (gl) { //draw the grid
            gl.bindVertexArray(this.vao);
            gl.useProgram(shaders['solid'].sprogram);
            gl.uniform3f(shaders['solid'].unifr['c'], 0, 1, 0);//green color
            gl.uniform2f(shaders['solid'].unifr['view'], player.position.x, player.position.y);
            gl.drawElements(gl.LINES, this.es, gl.UNSIGNED_INT, 0);
        }
    },
    genChunk : function (coord) { //function to generate chunk features by chunk coordinate and seed
        let magic = Math.abs(97 * this.seed * (Math.sin(coord.y - 2.1052) * -Math.sin(coord.x - 3.1325))); //gets cool number heh
        let treecount = (magic % 90) + 10; //calculate tree count
        let rockcount = (magic % 30) + 5; //calculate tree count
        Math.seedrandom(magic.toString()); //set seed

        let chunk = new Chunk(coord);//create new chunk

        for(let i = 0; i < rockcount; i++){//generate each rock
            chunk.features.push(new chunkFeature(new Vector2(Math.random() * this.chunkSize, Math.random() * this.chunkSize), Math.PI * 2 * Math.random(), 2));
        }

        for(let i = 0; i < treecount; i++){//generate each tree
          chunk.features.push(new chunkFeature(new Vector2(Math.random() * this.chunkSize, Math.random() * this.chunkSize), Math.PI * 2 * Math.random(), 1));
        }

        return chunk;
    },
    setup : function (gl) {
        //setup chunk grid graphics
        let grid = geometry.l_grid(10000, 100);
        let pb = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pb);
        gl.bufferData(gl.ARRAY_BUFFER, grid[0], gl.STATIC_DRAW);

        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        gl.enableVertexAttribArray(shaders['solid'].attr['position']);
        gl.vertexAttribPointer(shaders['solid'].attr['position'], 2, gl.FLOAT, false, 8, 0);

        let ib = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, grid[1], gl.STATIC_DRAW);

        this.chunkGrid['vao'] = vao;
        this.chunkGrid['es'] = grid[1].length;
    }
};

//player object
const player = {
    name:"lucas",
    position: new Vector2(0, 0),
    rotation:0
};

//Utils

function ortho(r, l, t, b) {
    return {
        xa: 2/(r-l),
        xb: -((r+l)/(r-l)),
        ya: 2/(t-b),
        yb: -((t+b)/(t-b))
    }
}

const geometry = {
    t_square : function (size) { //generate square to be rendered in GL.TRIANGLES mode with index (uint8) / points are 2 float <x, y>
        let points = [];
        let s = (size / 2);
        points.push(-s, s);
        points.push(-s, -s);
        points.push(s, -s);
        points.push(s, s);

        points = new Float32Array(points);
        let index = new Uint8Array([0,1,2,0,2,3]);

        return [points, index];
    },
    l_grid: function (size, div) { //generate a grid geometry to be rendered in GL.LINES mode with index (uint32) / points are 2 float <x, y>
        let points = [];
        let index = [];
        let s = (size / 2);
        let step = size / div;
        let idx = 0;

        for(let i = 1; i < div; i++){
            let y = s - (i * step);

            points.push(-s, y);
            index.push(idx++);
            points.push(s, y);
            index.push(idx++);

            points.push(y, -s);
            index.push(idx++);
            points.push(y, s);
            index.push(idx++);
        }

        points = new Float32Array(points);
        index = new Uint32Array(index);
        return [points, index];
    }
};

async function loadShader(filename) {
    let txt = await fetch(filename).then(response => response.text());
    let p = txt.split("////");
    p.forEach((v, i) => {
        p[i] = v.trim();
    })

    let vshader = gl.createShader(gl.VERTEX_SHADER);
    let fshader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vshader, p[0]);
    gl.shaderSource(fshader, p[1]);
    gl.compileShader(vshader);
    gl.compileShader(fshader);
    if(!gl.getShaderParameter(vshader, gl.COMPILE_STATUS) || !gl.getShaderParameter(fshader, gl.COMPILE_STATUS)){
        //print errors
        alert("Vertex shader info log: "+gl.getShaderInfoLog(vshader));
        alert("Fragment shader info log: "+gl.getShaderInfoLog(fshader));
    }

    let program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        //print errors
        alert(gl.getProgramInfoLog(program));
    }
    gl.detachShader(program, vshader);
    gl.deleteShader(vshader);
    gl.detachShader(program, fshader);
    gl.deleteShader(fshader);

    let shdr = {
        sprogram: program,
        attr : {},
        unifr: {}
    }

    //find all atributes
    while(p[0].search(/in /i) > -1){
        //find index of in
        let idx = p[0].search(/in /i);
        //find start of atribute name
        let atsid = p[0].indexOf(' ', idx + 4) + 1;
        //find end
        let ateid = p[0].indexOf(';', atsid);
        //get atribute name
        let attrn = p[0].substring(atsid, ateid)
        shdr.attr[attrn] = gl.getAttribLocation(program, attrn);

        p[0] = p[0].substring(ateid+1);
    }

    //find all uniforms
    while(txt.search(/uniform /i) > -1){
        //find index of in
        let idx = txt.search(/uniform /i);
        //find start of atribute name
        let atsid = txt.indexOf(' ', idx + 8) + 1;
        //find end
        let ateid = txt.indexOf(';', atsid);
        //get uniform name
        let attrn = txt.substring(atsid, ateid)
        //remove brackets if contains
        if(attrn.includes('['))
            attrn = attrn.substring(0, attrn.indexOf('['));
        if(shdr.unifr[attrn] === undefined)
            shdr.unifr[attrn] = gl.getUniformLocation(program, attrn);

        txt = txt.substring(ateid+1);
    }

    return shdr;
}

async function loadTexture(filename, gl){
    let tex = gl.createTexture();

    let img = new Image();
    img.src = filename;
    await img.decode();

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    //gl.generateMipmap(gl.TEXTURE_2D);

    return tex;
}