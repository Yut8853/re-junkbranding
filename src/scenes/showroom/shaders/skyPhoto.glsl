// ============================================================
// フォト空チャンク
// three.js 標準 Sky のフラグメントシェーダー末尾
// `gl_FragColor = vec4( retColor, 1.0 );` を置換して差し込まれる断片。
// 物理散乱の結果 (retColor) をほぼ捨て、夕暮れのパステルな
// グラデーション + 沈む太陽を手描きする。
// 注意: 最終行の gl_FragColor 代入と変数構成は置換の前提なので変えないこと。
// ============================================================
vec3 skyDir = normalize(vWorldPosition);
// 高さに応じた 3 つの帯: 上空の青み / 地平線の桃色 / 太陽近くの金色。
float upperSky = smoothstep(0.02, 0.82, skyDir.y);
float horizonGlow = 1.0 - smoothstep(-0.03, 0.34, skyDir.y);
float warmCore = 1.0 - smoothstep(-0.02, 0.18, skyDir.y);
vec3 clearBlue = vec3(0.32, 0.62, 0.94);
vec3 paleBlue = vec3(0.78, 0.88, 0.99);
vec3 peach = vec3(1.0, 0.79, 0.64);
vec3 gold = vec3(1.0, 0.93, 0.74);
vec3 photoSky = mix(paleBlue, clearBlue, upperSky);
photoSky = mix(photoSky, peach, horizonGlow * 0.36);
photoSky = mix(photoSky, gold, warmCore * 0.3);
// 沈む太陽: 明るく澄んだ芯と、シャンパン色の柔らかいハロー。
// 重たくならないよう光量は控えめに保ち、空の透明感を優先する。
float sunCos = clamp(dot(skyDir, vSunDirection), 0.0, 1.0);
photoSky += vec3(1.0, 0.82, 0.6) * pow(sunCos, 14.0) * 0.4;
photoSky += vec3(1.0, 0.9, 0.72) * pow(sunCos, 90.0) * 0.85;
// 太陽の円盤そのもの（非常に狭い smoothstep で輪郭を出す）。
float sunDisk = smoothstep(0.99935, 0.99977, sunCos);
photoSky += vec3(1.25, 1.1, 0.92) * sunDisk * 2.2;
// 物理散乱 (retColor) はささやき程度（6%）だけ残し、
// 濁らず明るく澄んだグラデーションを保つ。
vec3 color = mix(retColor, photoSky, 0.94) * uSkyExposure;
gl_FragColor = vec4(color, 1.0 );
