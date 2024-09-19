 // by Jeran Poehls
precision highp float;
precision highp sampler3D;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec4 color;

in vec2 Vuv;

uniform sampler2D map;
uniform sampler2D cmap;

uniform vec3 scale;
uniform float threshold;
uniform float steps;
uniform bool flip;
uniform vec4 flatBounds;
uniform vec2 vertBounds;


void main(){

    float strength = texture2D(map, Vuv).r;

    color = vec4(strength,0.,0.,1.);

    color.rgb = texture2D(cmap, vec2(strength, 0.5)).rgb;

}