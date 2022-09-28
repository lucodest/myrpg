#version 300 es
in vec2 position;

uniform float proj[4];
uniform vec2 view;

void main(){
    gl_Position = vec4((proj[0] * (position.x - view.x)) + proj[1], (proj[2] * (position.y - view.y)) + proj[3], 0, 1);
}

////

#version 300 es
precision highp float;

uniform vec3 c;
out vec4 color;

void main(){
    color = vec4(c, 1);
}