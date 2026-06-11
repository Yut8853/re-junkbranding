import glitchVert from './shaders/glitch.vert.glsl?raw';
import glitchFrag from './shaders/glitch.frag.glsl?raw';

/**
 * 散らばりギャラリーのホバーグリッチ。
 *
 * 固定配置の WebGL キャンバスを 1 枚だけ用意し、ホバー中のパネルの
 * 真上に重ねて、その画像の RGB 分離 + 走査線バージョンを描画する。
 * オーバーレイは最初の pointerenter で遅延生成されるため、
 * 誰もホバーしなければ一切コストがかからない。
 */
const initGlitchOverlay = (panels: HTMLElement[], allowHover: boolean): void => {
  if (!panels.length) return;

  // ---- オーバーレイキャンバスの生成（普段はサイズ 0 で不可視） ----
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576;
  Object.assign(canvas.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: '0',
    height: '0',
    zIndex: '18',
    pointerEvents: 'none',
    opacity: '0',
    border: '1px solid rgba(225, 238, 255, 0.16)',
    borderRadius: '2px',
    boxShadow: '0 1.4rem 3.2rem rgba(0, 0, 0, 0.34), 0 0 2.4rem rgba(188, 239, 255, 0.08)',
  });
  document.body.append(canvas);

  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: false,
    premultipliedAlpha: false,
  });
  if (!gl) return;

  // ---- シェーダーのコンパイルとプログラムのリンク ----
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertexShader = compile(gl.VERTEX_SHADER, glitchVert);
  const fragmentShader = compile(gl.FRAGMENT_SHADER, glitchFrag);
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  // 画面いっぱいの三角形ストリップ（クアッド）1 枚だけを描く。
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    image: gl.getUniformLocation(program, 'uImage'),
    imageSize: gl.getUniformLocation(program, 'uImageSize'),
    canvasSize: gl.getUniformLocation(program, 'uCanvasSize'),
    hover: gl.getUniformLocation(program, 'uHover'),
    time: gl.getUniformLocation(program, 'uTime'),
  };
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.uniform1i(uniforms.image, 0);
  gl.uniform2f(uniforms.canvasSize, canvas.width, canvas.height);

  // ---- ホバー状態とレンダーループ ----
  let targetHover = 0; // 目標値（enter で 1、leave で 0）
  let hover = 0;       // イージング後の現在値
  let raf = 0;
  let imageReady = false;
  let activePanel: HTMLElement | null = null;
  let activeSrc = '';
  const image = new Image();

  /** キャンバスをホバー中パネルの位置・サイズにぴったり重ねる。 */
  const positionCanvas = () => {
    if (!activePanel) return;
    const rect = activePanel.getBoundingClientRect();
    canvas.style.left = `${rect.left}px`;
    canvas.style.top = `${rect.top}px`;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  };

  const render = (time: number) => {
    // hover をなめらかに追従させ、出入りをフェードにする。
    hover += (targetHover - hover) * 0.14;
    if (!imageReady) {
      raf = requestAnimationFrame(render);
      return;
    }

    positionCanvas();
    canvas.style.opacity = String(Math.min(1, hover * 1.18));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(uniforms.hover, hover);
    gl.uniform1f(uniforms.time, time * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (Math.abs(targetHover - hover) > 0.001 || targetHover > 0) {
      raf = requestAnimationFrame(render);
    } else {
      // フェードアウト完了。ループを止めてキャンバスを畳む。
      raf = 0;
      canvas.style.opacity = '0';
      canvas.style.width = '0';
      canvas.style.height = '0';
    }
  };

  const requestRender = () => {
    if (!raf) raf = requestAnimationFrame(render);
  };

  // パネル画像の読み込み完了でテクスチャへ転送する。
  image.onload = () => {
    imageReady = true;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform2f(uniforms.imageSize, image.naturalWidth, image.naturalHeight);
    requestRender();
  };

  if (!allowHover) return;

  // ---- パネルごとのホバーイベント ----
  panels.forEach((panel) => {
    panel.addEventListener('pointerenter', () => {
      const src = panel.dataset.src;
      if (!src) return;
      activePanel = panel;
      positionCanvas();
      // 同じ画像なら読み込み済みフラグを維持、違う画像なら読み直す。
      imageReady = src === activeSrc && imageReady;
      if (src !== activeSrc) {
        activeSrc = src;
        imageReady = false;
        image.src = src;
      }
      targetHover = 1;
      requestRender();
    });
    panel.addEventListener('pointerleave', () => {
      targetHover = 0;
      requestRender();
    });
  });
};

/**
 * 遅延ブートの配線。
 * 最初のホバーでオーバーレイを生成し、その pointerenter を
 * 再ディスパッチしてグリッチを即座に再生する。
 */
export const initScatterGlitch = (reduced: boolean): void => {
  const glitchPanels = Array.from(document.querySelectorAll<HTMLElement>('[data-glitch-panel]'));
  let glitchOverlayReady = false;

  const bootGlitchOverlay = (initialPanel?: HTMLElement, initialEvent?: PointerEvent) => {
    if (glitchOverlayReady || reduced) return;
    glitchOverlayReady = true;
    initGlitchOverlay(glitchPanels, true);

    if (initialPanel && initialEvent) {
      initialPanel.dispatchEvent(new PointerEvent('pointerenter', initialEvent));
    }
  };

  glitchPanels.forEach((panel) => {
    panel.addEventListener(
      'pointerenter',
      (event) => bootGlitchOverlay(panel, event),
      { once: true },
    );
  });
};
