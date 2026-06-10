export const WATER_PRESET = {
  waveStrength: 0.186,
  waveScale: 22.3,
  waveSpeed: -0.524,
  rippleStrength: 0.045,
  rippleScale: 23.5,
  rippleSpeed: 0.631,
  crestSoftness: 0.73,

  fogStrength: 0.607,
  horizonFade: 0.705,
  vignetteStrength: 0.693,
  depthDarkness: 0.55,

  parallaxStrength: 0,
  cameraForwardAmount: 1,

  showGuides: false,
  showWaterOnly: false,
} as const;

export type WaterPreset = typeof WATER_PRESET;
