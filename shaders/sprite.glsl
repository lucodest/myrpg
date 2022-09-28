#version 300 es
in vec2 position;

uniform float proj[4];
uniform vec2 view;
uniform float rotation;

out vec2 tc;

void main(){
    switch(gl_VertexID){
        case 0:
            tc = vec2(0.0, 1.0);
            break;
        case 1:
            tc = vec2(0.0, 0.0);
            break;
        case 2:
            tc = vec2(1.0, 0.0);
            break;
        case 3:
            tc = vec2(1.0, 1.0);
            break;
    }

    //apply rotation
    vec2 pos;
    pos.x = ((cos(rotation) * position.x) - (sin(rotation) * position.y));
    pos.y = ((sin(rotation) * position.x) + (cos(rotation) * position.y));

    //apply view
    pos -= view;

    //apply projection
    gl_Position = vec4((proj[0] * (pos.x)) + proj[1], (proj[2] * (pos.y)) + proj[3], 0, 1);
}

////

#version 300 es
precision highp float;

in vec2 tc;
uniform sampler2D tex;

out vec4 color;

void main(){
    vec4 c = texture(tex, tc);
    color = c;
}