import React, { useEffect, useRef } from "react";

interface WebGLBackgroundProps {
  images: string[];
  currentIndex: number;
}

export const WebGLBackground: React.FC<WebGLBackgroundProps> = ({
  images,
  currentIndex,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<{
    currentIndex: number;
    prevIndex: number;
    textures: { [key: string]: { texture: WebGLTexture; aspect: number } };
    currentTexture: WebGLTexture | null;
    nextTexture: WebGLTexture | null;
    currentAspect: number;
    nextAspect: number;
    progress: number;
    isTransitioning: boolean;
    gl: WebGLRenderingContext | null;
    program: WebGLProgram | null;
    animationFrameId: number | null;
    width: number;
    height: number;
  }>({
    currentIndex,
    prevIndex: currentIndex,
    textures: {},
    currentTexture: null,
    nextTexture: null,
    currentAspect: 1.777, // default 16:9
    nextAspect: 1.777,
    progress: 1.0,
    isTransitioning: false,
    gl: null,
    program: null,
    animationFrameId: null,
    width: 0,
    height: 0,
  });

  const vertexShaderSource = `
    attribute vec2 position;
    varying vec2 v_texCoord;
    void main() {
      v_texCoord = position * 0.5 + 0.5;
      v_texCoord.y = 1.0 - v_texCoord.y; // Flip Y for WebGL
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_texture1;
    uniform sampler2D u_texture2;
    uniform float u_progress;
    uniform float u_canvasAspect;
    uniform float u_texAspect1;
    uniform float u_texAspect2;

    vec2 getCoverUV(vec2 uv, float canvasAspect, float texAspect) {
      vec2 result = uv;
      if (canvasAspect > texAspect) {
        float scaleY = texAspect / canvasAspect;
        result.y = (uv.y - 0.5) * scaleY + 0.5;
      } else {
        float scaleX = canvasAspect / texAspect;
        result.x = (uv.x - 0.5) * scaleX + 0.5;
      }
      return result;
    }

    void main() {
      vec2 uv = v_texCoord;
      float p = u_progress;
      
      // Beautiful Liquid Distortion Wave
      float pi = 3.14159265359;
      float strength = 0.06 * sin(p * pi);
      
      // Wavy distortion coordinates
      vec2 dUv1 = uv;
      vec2 dUv2 = uv;
      
      // Directional liquid slide
      dUv1.x += sin(uv.y * 10.0 + p * pi) * strength;
      dUv1.y += cos(uv.x * 10.0 + p * pi) * strength;
      
      dUv2.x += sin(uv.y * 10.0 + (1.0 - p) * pi) * strength;
      dUv2.y += cos(uv.x * 10.0 + (1.0 - p) * pi) * strength;
      
      // Apply linear sliding movement with organic displacement
      dUv1.x -= p * 0.15;
      dUv2.x += (1.0 - p) * 0.15;
      
      vec2 coverUV1 = getCoverUV(dUv1, u_canvasAspect, u_texAspect1);
      vec2 coverUV2 = getCoverUV(dUv2, u_canvasAspect, u_texAspect2);
      
      // Safe texture fetch
      vec4 color1 = texture2D(u_texture1, clamp(coverUV1, 0.0, 1.0));
      vec4 color2 = texture2D(u_texture2, clamp(coverUV2, 0.0, 1.0));
      
      // Dynamic cross-fade matching the blend
      gl_FragColor = mix(color1, color2, p);
    }
  `;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize WebGL context
    const gl = canvas.getContext("webgl", { alpha: false, depth: false });
    if (!gl) {
      console.warn("WebGL not supported, using image fallback");
      canvas.style.display = 'none';
      const fallback = document.createElement('img');
      fallback.src = images[currentIndex] || images[0];
      fallback.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';
      canvas.parentElement?.appendChild(fallback);
      return;
    }

    stateRef.current.gl = gl;

    // Shader builder helpers
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Error linking program:", gl.getProgramInfoLog(program));
      return;
    }

    stateRef.current.program = program;
    gl.useProgram(program);

    // Set up quad vertices
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Function to load texture
    const loadTexture = (url: string): Promise<{ texture: WebGLTexture; aspect: number }> => {
      return new Promise((resolve) => {
        if (stateRef.current.textures[url]) {
          resolve(stateRef.current.textures[url]);
          return;
        }

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const tex = gl.createTexture();
          if (!tex) return;

          gl.bindTexture(gl.TEXTURE_2D, tex);
          
          // Set texture parameters
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

          const aspect = img.width / img.height;
          const data = { texture: tex, aspect };
          stateRef.current.textures[url] = data;
          resolve(data);
        };
        img.onerror = () => {
          console.warn("Failed to load image as texture, retrying without anonymous crossOrigin: ", url);
          // Retry loader without crossOrigin
          const retryImg = new Image();
          retryImg.onload = () => {
            const tex = gl.createTexture();
            if (!tex) return;
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, retryImg);
            const aspect = retryImg.width / retryImg.height;
            const data = { texture: tex, aspect };
            stateRef.current.textures[url] = data;
            resolve(data);
          };
          retryImg.src = url;
        };
        img.src = url;
      });
    };

    // Compile render draw call
    const draw = () => {
      const {
        gl,
        program,
        currentTexture,
        nextTexture,
        currentAspect,
        nextAspect,
        progress,
        width,
        height,
      } = stateRef.current;

      if (!gl || !program || !width || !height) return;

      gl.useProgram(program);

      // Pass textures
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, currentTexture || nextTexture);
      gl.uniform1i(gl.getUniformLocation(program, "u_texture1"), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, nextTexture || currentTexture);
      gl.uniform1i(gl.getUniformLocation(program, "u_texture2"), 1);

      // Pass transition uniforms
      gl.uniform1f(gl.getUniformLocation(program, "u_progress"), progress);
      gl.uniform1f(gl.getUniformLocation(program, "u_canvasAspect"), width / height);
      gl.uniform1f(gl.getUniformLocation(program, "u_texAspect1"), currentAspect);
      gl.uniform1f(gl.getUniformLocation(program, "u_texAspect2"), nextAspect);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const animateTransition = () => {
      const startTime = performance.now();
      const duration = 1800; // 1.8 seconds transition time

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const rawProgress = Math.min(elapsed / duration, 1.0);
        
        // Custom cubic easeInOut
        const easeProgress = rawProgress < 0.5
          ? 4 * rawProgress * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

        stateRef.current.progress = easeProgress;
        draw();

        if (rawProgress < 1.0) {
          stateRef.current.animationFrameId = requestAnimationFrame(tick);
        } else {
          // Finalize transition
          stateRef.current.isTransitioning = false;
          stateRef.current.currentTexture = stateRef.current.nextTexture;
          stateRef.current.currentAspect = stateRef.current.nextAspect;
          stateRef.current.progress = 1.0;
          draw();
        }
      };

      if (stateRef.current.animationFrameId) {
        cancelAnimationFrame(stateRef.current.animationFrameId);
      }
      stateRef.current.animationFrameId = requestAnimationFrame(tick);
    };

    // Expose background change trigger helper
    const triggerBgChange = (nextIndex: number) => {
      const currentUrl = images[stateRef.current.currentIndex];
      const nextUrl = images[nextIndex];

      Promise.all([loadTexture(currentUrl), loadTexture(nextUrl)]).then(([curr, nxt]) => {
        stateRef.current.prevIndex = stateRef.current.currentIndex;
        stateRef.current.currentIndex = nextIndex;
        stateRef.current.currentTexture = curr.texture;
        stateRef.current.currentAspect = curr.aspect;
        stateRef.current.nextTexture = nxt.texture;
        stateRef.current.nextAspect = nxt.aspect;
        stateRef.current.progress = 0.0;
        stateRef.current.isTransitioning = true;
        animateTransition();
      });
    };

    // Initialize resize observer
    const handleResize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (stateRef.current.width !== width || stateRef.current.height !== height) {
        canvas.width = width;
        canvas.height = height;
        stateRef.current.width = width;
        stateRef.current.height = height;
        gl.viewport(0, 0, width, height);
        draw();
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(canvas.parentElement || canvas);
    handleResize();

    // Load initial texture
    const initBg = images[currentIndex];
    loadTexture(initBg).then(({ texture, aspect }) => {
      stateRef.current.currentTexture = texture;
      stateRef.current.currentAspect = aspect;
      draw();
    });

    // Keep reference in container to trigger outside React loop safely on value change
    (canvas as any)._triggerBgChange = triggerBgChange;

    return () => {
      resizeObserver.disconnect();
      if (stateRef.current.animationFrameId) {
        cancelAnimationFrame(stateRef.current.animationFrameId);
      }
      // Remove buffer & program to prevent memory leak
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      Object.values(stateRef.current.textures).forEach(({ texture }) => {
        gl.deleteTexture(texture);
      });
    };
  }, [images]);

  // Handle external React index change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && (canvas as any)._triggerBgChange) {
      (canvas as any)._triggerBgChange(currentIndex);
    }
  }, [currentIndex]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
      id="homepage-webgl-canvas"
    />
  );
};
