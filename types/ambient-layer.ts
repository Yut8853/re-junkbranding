export type AmbientLayerVariant = 'calm' | 'glow' | 'deep'

export type AmbientLayerProps = {
  variant?: AmbientLayerVariant
  className?: string
}

export type AmbientParticlesProps = {
  count: number
}