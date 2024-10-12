// by Jeran Poehls
precision highp float;
precision highp sampler3D;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec3 vOrigin;
in vec3 vDirection;
out vec4 color;

uniform sampler3D map;
uniform sampler2D cmap;
uniform vec3 scale;
uniform float threshold;
uniform float steps;
uniform bool flip;
uniform vec4 flatBounds;
uniform vec2 vertBounds;
uniform float intensity;

vec2 hitBox(vec3 orig, vec3 dir) {
    vec3 box_min = vec3(-(scale * 0.5));
    vec3 box_max = vec3(scale * 0.5);
    vec3 inv_dir = 1.0 / dir;
    vec3 tmin_tmp = (box_min - orig) * inv_dir;
    vec3 tmax_tmp = (box_max - orig) * inv_dir;
    vec3 tmin = min(tmin_tmp, tmax_tmp);
    vec3 tmax = max(tmin_tmp, tmax_tmp);
    float t0 = max(tmin.x, max(tmin.y, tmin.z));
    float t1 = min(tmax.x, min(tmax.y, tmax.z));
    return vec2(t0, t1);
}

float sample1(vec3 p) {
    return texture(map, p).r;
}

#define epsilon 0.0001

void main() {
    vec3 rayDir = normalize(vDirection);
    vec2 bounds = hitBox(vOrigin, rayDir);

    if (bounds.x > bounds.y) discard;

    bounds.x = max(bounds.x, 0.0);

    vec3 p = vOrigin + bounds.x * rayDir;
    vec3 inc = 1.0 / abs(rayDir);
    float delta = min(inc.x, min(inc.y, inc.z));
    delta /= steps;

    vec4 accumColor = vec4(0.0);
    float alphaAcc = 0.0;

    for (float t = bounds.x; t < bounds.y; t += delta) {
        if (p.x > -flatBounds.x || p.x < -flatBounds.y) {
            p += rayDir * delta;
            continue;
        }
        if (-p.z > -flatBounds.z || -p.z < -flatBounds.w) {
            p += rayDir * delta;
            continue;
        }
        if (p.y < vertBounds.x || p.y > vertBounds.y) {
            p += rayDir * delta;
            continue;
        }

        float d = sample1(p / scale + 0.5);
        bool cond = (d > threshold) || (d == 0.0 && threshold == 0.0);
        cond = flip ? !cond : cond;

        if (cond) {
            vec4 col = texture(cmap, vec2(d, 0.5));
            float alpha = col.a / intensity;
            accumColor.rgb += (1.0 - alphaAcc) * alpha * col.rgb;
            alphaAcc += alpha * (1.0 - alphaAcc);

            if (alphaAcc >= 1.0) break;
        }

        p += rayDir * delta;
    }

    accumColor.a = alphaAcc; // Set the final accumulated alpha
    color = accumColor;
    if (color.a == 0.0) discard;
}
