//get canvas and resize it
var canvas = document.getElementById("canvas");
var aspect = (16/9);
canvas.height = innerHeight * .95;
canvas.width = canvas.height * aspect;

//fps counter
var fps = document.getElementById("fps");
var lastts = 0;

//variables
var sen = .2;

var shaders = {};

var velocity = new Vector2(0, 0);

//generate some chunks
var chunks = [];
for(let x = 0; x < 6; x++){
    for(let y = 0; y < 6; y++){
        chunks.push(world.genChunk(new Vector2(x - 3, y - 3)));
    }
}

//projection matrix setup
var viewsize = 20;

let s = viewsize / 2;
var projection = ortho(s * aspect, -s * aspect, s, -s);

//get WebGL2 context
var gl = canvas.getContext("webgl2");

if(!gl){
    alert("Seu pc e veio pra caraio e n suporta WebGL2\ncompra um pc mais novo seu burro fudido");
}

//set clear color
gl.clearColor(0, 0, 0, 1);

//enable transparency
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

//set viewport
gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

//setup function
setup = async function () {
    //loads solid shader
    shaders['solid'] = await loadShader('shaders/solid.glsl');
    gl.useProgram(shaders['solid'].sprogram);
    gl.uniform1fv(shaders['solid'].unifr['proj'], new Float32Array([projection.xa, projection.xb, projection.ya, projection.yb]));

    //loads sprite shader
    shaders['sprite'] = await loadShader('shaders/sprite.glsl');
    gl.useProgram(shaders['sprite'].sprogram);
    gl.uniform1fv(shaders['sprite'].unifr['proj'], new Float32Array([projection.xa, projection.xb, projection.ya, projection.yb]));

    //loads overlay shader
    shaders['overlay'] = await loadShader('shaders/overlay.glsl');
    gl.useProgram(shaders['overlay'].sprogram);
    gl.uniform1f(shaders['overlay'].unifr['aspect'], aspect);

    //setup drawables
    world.setup(gl);
    await drawables.grass.setup(gl);
    await drawables.tree.setup(gl);
    await drawables.rock.setup(gl);

    renderloop();
}

setup();

function renderloop(t) {
    requestAnimationFrame(renderloop);

    fps.innerText = (1000 / (t - lastts)).toFixed(2);
    lastts = t;

    player.position = Vector2.add(player.position, velocity);

    gl.clear(gl.COLOR_BUFFER_BIT);
    //world.chunkGrid.draw(gl);
    drawables.grass.draw(gl);

    chunks.forEach((chunk) => {
        chunk.features.forEach((f) => {
            switch (f.type) {
                case 1:
                    drawables.tree.draw(gl, Vector2.add(Vector2.mul(chunk.coord, world.chunkSize), f.position), f.rotation);
                    break;
                case 2:
                    drawables.rock.draw(gl, Vector2.add(Vector2.mul(chunk.coord, world.chunkSize), f.position), f.rotation);
                    break;
            }
        });
    });

}

//movement code

function dmove(e) {
    if(e.code === 'KeyW')
        velocity.y = sen;
    if(e.code === 'KeyS')
        velocity.y = -sen;
    if(e.code === 'KeyD')
        velocity.x = sen;
    if(e.code === 'KeyA')
        velocity.x = -sen;
}

function umove(e) {
    if(e.code === 'KeyW')
        velocity.y = 0;
    if(e.code === 'KeyS')
        velocity.y = -0;
    if(e.code === 'KeyD')
        velocity.x = 0;
    if(e.code === 'KeyA')
        velocity.x = -0;
}

//movement listener
window.addEventListener("keydown", dmove);
window.addEventListener("keyup", umove);