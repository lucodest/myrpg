#version 300 es
in vec2 position;

uniform float aspect;
uniform vec2 view;

out vec2 tc;
uniform float viewsize;

void main(){

    vec2 m = view * (viewsize * 2.0);
    switch(gl_VertexID){
        case 0:
            tc = vec2(0.0, 0.0) - m;
            break;
        case 1:
            tc = vec2(0.0,  viewsize) - m;
            break;
        case 2:
            tc = vec2(aspect  * viewsize, viewsize) - m;
            break;
        case 3:
            tc = vec2(aspect  * viewsize, 0.0) - m;
            break;
    }

    gl_Position = vec4(position, 0, 1);
}

////

#version 300 es
precision highp float;

in vec2 tc;
uniform sampler2D tex;

out vec4 color;

void main(){
    vec4 c = texture(tex, tc);
    c.a = 1.0;
    color = c;
}