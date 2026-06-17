# Exhibit media — Digital Showroom

The showroom exhibits use autoplaying, muted, looping website videos as
`THREE.VideoTexture` sources. A painted placeholder is shown until each video
metadata event arrives.

## Video files

| File             | Site     | Source URL                  |
| ---------------- | -------- | --------------------------- |
| `/toplace.mp4`   | TO PLACE | https://to-place.co.jp/     |
| `/luzreal.mp4`   | Luz Real | https://luz-real.com/       |
| `/trans.mp4`     | Trans-B  | https://trans-b.vercel.app/ |

## Format

- 16:9, preferably 1920x1080.
- `.mp4`, browser-playable H.264.
- Muted video is required for reliable autoplay.

## Swapping Later

To use a different path or format, edit `EXHIBIT_VIDEO_SRC` in
`src/scenes/showroom/Showroom.ts`.
