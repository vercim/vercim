'use client';

import type { CSSProperties } from 'react';
import { ShaderMount, getShaderColorFromString } from '@paper-design/shaders-react';
import {
  DitheringShapes,
  DitheringTypes,
  ShaderFitOptions,
  defaultPatternSizing,
  ditheringFragmentShader,
} from '@paper-design/shaders';

interface Props {
  /** Fill of the brightest phase: 1 keeps the stock look, lower is sparser. Dim phases barely change. */
  maxDensity?: number;
  colorFront: string;
  /** Dot size in pixels; unchanged by `maxDensity`. */
  size?: number;
  speed?: number;
  scale?: number;
  style?: CSSProperties;
}

// The stock shader has no density control: a dot is drawn when its noise value is below the
// sphere's brightness, so the brightest phase is almost solid. The curve below maps brightness 1
// to `u_maxDensity` while leaving low brightness nearly untouched, and dot size is unchanged.
// If the shader source changes the patch is skipped and the stock shader is used.
const NOISE_TEST = 'step(hash21(ditheringNoiseUV), shape)';
const UNIFORM_DECLARATION = 'uniform float u_pxSize;';
const SPARSE_SHADER =
  ditheringFragmentShader.includes(NOISE_TEST) &&
  ditheringFragmentShader.includes(UNIFORM_DECLARATION)
    ? ditheringFragmentShader
        .replace(UNIFORM_DECLARATION, `${UNIFORM_DECLARATION}\nuniform float u_maxDensity;`)
        .replace(
          NOISE_TEST,
          'step(hash21(ditheringNoiseUV), shape * (1. - (1. - u_maxDensity) * shape))'
        )
    : ditheringFragmentShader;

export function SparseDithering({
  maxDensity = 1,
  colorFront,
  size = 2,
  speed = 1,
  scale = 0.6,
  style,
}: Props) {
  const sizing = defaultPatternSizing;

  return (
    <ShaderMount
      speed={speed}
      fragmentShader={SPARSE_SHADER}
      style={style}
      uniforms={{
        u_colorBack: getShaderColorFromString('#ffffff00'),
        u_colorFront: getShaderColorFromString(colorFront),
        u_shape: DitheringShapes.sphere,
        u_type: DitheringTypes.random,
        u_pxSize: size,
        u_maxDensity: maxDensity,
        u_fit: ShaderFitOptions[sizing.fit],
        u_scale: scale,
        u_rotation: sizing.rotation,
        u_offsetX: sizing.offsetX,
        u_offsetY: sizing.offsetY,
        u_originX: sizing.originX,
        u_originY: sizing.originY,
        u_worldWidth: sizing.worldWidth,
        u_worldHeight: sizing.worldHeight,
      }}
    />
  );
}
