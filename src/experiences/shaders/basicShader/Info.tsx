import React from 'react';

import { Heading2 } from '../../../ui/components/Headings';

export default function BasicShaderExperienceInfo() {
  return (
    <div>
      <Heading2 heading="How Threejs renders things (the simple version)" />
      <p>
        Each pixel that threejs renders is using a shader. The shader is a piece
        of code that tells threejs how to render the pixel. There are two types
        of shaders:
        <ul>
          <li>Vertex Shader</li>
          <li>Fragment Shader</li>
        </ul>
        The vertex shader tells threejs how to render the vertices of the
        geometry. The fragment shader tells threejs how to render the pixel.
        Each geometry and material has a vertex shader and a fragment shader.
      </p>
      <Heading2 heading="The shader language"></Heading2>
      <p>
        Currently, there are a few ways to write shaders in threejs, but the
        classic way is to use .glsl files. These files are written in a special
        language called GLSL (OpenGL Shading Language). This language is a
        subset of C used for graphics programming. GLSL as a programming
        language is very restricted and simple and you will have to learn it to
        master shaders in threejs.
      </p>
    </div>
  );
}
