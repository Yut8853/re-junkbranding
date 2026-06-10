(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/hero-scene/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BG",
    ()=>BG,
    "BLOOM_INK",
    ()=>BLOOM_INK,
    "BLOOM_WARM",
    ()=>BLOOM_WARM,
    "CAM_END",
    ()=>CAM_END,
    "CAM_START",
    ()=>CAM_START,
    "ENTER_END",
    ()=>ENTER_END,
    "ENTER_START",
    ()=>ENTER_START,
    "INK",
    ()=>INK,
    "LAYERS",
    ()=>LAYERS,
    "WARM",
    ()=>WARM,
    "smoothstep",
    ()=>smoothstep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/three@0.184.0/node_modules/three/build/three.core.js [app-client] (ecmascript)");
;
const BG = '#06070b';
const INK = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#c9ced8');
const WARM = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#eef2f9');
const BLOOM_INK = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#eaf0ff').multiplyScalar(1.5);
const BLOOM_WARM = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#ffffff').multiplyScalar(1.7);
const CAM_START = 6.0;
const CAM_END = -2.5;
const ENTER_START = 0.24;
const ENTER_END = 0.46;
const LAYERS = [
    // 主役：入り込む1枚の世界（大きく・近く・中央右）。
    {
        photo: '/jp/cafe.png',
        role: 'main',
        pos: [
            1.9,
            0,
            -0.8
        ],
        rotY: -0.08,
        rotX: 0.01,
        h: 5.0,
        ar: 1.5,
        maxOpacity: 1
    },
    // 奥の断片：他業種の気配。薄く・小さく・深く。
    {
        photo: '/jp/salon.png',
        role: 'fragment',
        pos: [
            -3.6,
            1.8,
            -13.5
        ],
        rotY: 0.22,
        rotX: 0.0,
        h: 2.0,
        ar: 0.82,
        maxOpacity: 0.24
    },
    {
        photo: '/jp/craft.png',
        role: 'fragment',
        pos: [
            4.4,
            -2.1,
            -16.5
        ],
        rotY: -0.24,
        rotX: 0.02,
        h: 2.2,
        ar: 1.4,
        maxOpacity: 0.2
    },
    {
        photo: '/jp/clinic.png',
        role: 'fragment',
        pos: [
            -2.2,
            -1.4,
            -19.5
        ],
        rotY: 0.18,
        rotX: 0.0,
        h: 2.0,
        ar: 1.45,
        maxOpacity: 0.16
    }
];
function smoothstep(edge0, edge1, x) {
    const t = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/hero-scene/parts.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Atmosphere",
    ()=>Atmosphere,
    "CloudField",
    ()=>CloudField,
    "Motes",
    ()=>Motes,
    "PhotoLayer",
    ()=>PhotoLayer,
    "Rig",
    ()=>Rig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_@babel+core@7.29.7_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_@babel+core@7.29.7_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-three+fiber@9.6.1_@types+react@19.2.14_react-dom@19.2.4_react@19.2.4__react@19.2.4_three@0.184.0/node_modules/@react-three/fiber/dist/events-b389eeca.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-three+fiber@9.6.1_@types+react@19.2.14_react-dom@19.2.4_react@19.2.4__react@19.2.4_three@0.184.0/node_modules/@react-three/fiber/dist/events-b389eeca.esm.js [app-client] (ecmascript) <export C as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/three@0.184.0/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/hero-scene/constants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function PhotoLayer({ def, texture, progress, reduced }) {
    _s();
    const group = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const phase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PhotoLayer.useMemo[phase]": ()=>Math.random() * Math.PI * 2
    }["PhotoLayer.useMemo[phase]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "PhotoLayer.useFrame": (state, delta)=>{
            const g = group.current;
            const m = mat.current;
            if (!g || !m) return;
            const p = progress.current;
            const t = state.clock.elapsedTime;
            const baseTex = texture ? 1 : 0;
            const k = Math.min(1, delta * 4);
            if (def.role === 'main') {
                // 最初から世界が見えている → 近づく → 一度だけ中を通り抜けて画面外へ。
                const intro = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(0, 0.04, p);
                const approach = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTER_START"], p);
                const enter = reduced ? 0 : (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTER_START"], __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTER_END"], p);
                const pass = 1 - (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(0.5, 1, enter);
                const target = baseTex * intro * pass;
                m.opacity += (target - m.opacity) * k;
                const float = reduced ? 0 : Math.sin(t * 0.14 + phase) * 0.05;
                g.position.x = def.pos[0] + enter * 2.2;
                g.position.y = def.pos[1] + enter * 0.8 + float;
                g.position.z = def.pos[2] + approach * 0.5 + enter * 4.4;
                g.rotation.y = def.rotY - enter * 0.14;
                g.rotation.x = def.rotX;
                g.scale.setScalar(1 + approach * 0.1 + enter * 1.6);
            } else {
                // 断片：薄く立ち上がり、Meaning に向けて静かに消えていく。
                const appear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(0.02, 0.16, p);
                const fade = 1 - (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(0.32, 0.66, p);
                const target = baseTex * def.maxOpacity * appear * fade;
                m.opacity += (target - m.opacity) * Math.min(1, delta * 3);
                const float = reduced ? 0 : Math.sin(t * 0.1 + phase) * 0.05;
                g.position.x = def.pos[0];
                g.position.y = def.pos[1] + float;
                g.position.z = def.pos[2] - p * 1.6;
            }
        }
    }["PhotoLayer.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: group,
        position: def.pos,
        rotation: [
            def.rotX,
            def.rotY,
            0
        ],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
            scale: [
                def.h * def.ar,
                def.h,
                1
            ],
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                    args: [
                        1,
                        1
                    ]
                }, void 0, false, {
                    fileName: "[project]/components/hero-scene/parts.tsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                    ref: mat,
                    map: texture ?? undefined,
                    transparent: true,
                    opacity: 0,
                    toneMapped: false,
                    side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"],
                    depthWrite: false
                }, void 0, false, {
                    fileName: "[project]/components/hero-scene/parts.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/hero-scene/parts.tsx",
            lineNumber: 75,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/hero-scene/parts.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
_s(PhotoLayer, "m5aS/Qz3YHEBDJjUz8lp48APeO4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c = PhotoLayer;
function Motes({ progress, glow, reduced }) {
    _s1();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const bloom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const count = 30;
    const dummy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Motes.useMemo[dummy]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Object3D"]()
    }["Motes.useMemo[dummy]"], []);
    const glowDummy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Motes.useMemo[glowDummy]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Object3D"]()
    }["Motes.useMemo[glowDummy]"], []);
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Motes.useMemo[data]": ()=>{
            const arr = [];
            for(let i = 0; i < count; i++){
                arr.push({
                    x: (Math.random() - 0.5) * 9,
                    y: (Math.random() - 0.5) * 5.5,
                    z: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAM_START"] - Math.random() * 30,
                    s: 0.014 + Math.random() * 0.024,
                    speed: 0.4 + Math.random() * 0.7,
                    phase: Math.random() * Math.PI * 2
                });
            }
            return arr;
        }
    }["Motes.useMemo[data]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Motes.useEffect": ()=>{
            const mesh = ref.current;
            const glowMesh = bloom.current;
            if (!mesh || !glowMesh) return;
            const col = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]();
            data.forEach({
                "Motes.useEffect": (d, i)=>{
                    dummy.position.set(d.x, d.y, d.z);
                    dummy.scale.setScalar(d.s);
                    dummy.updateMatrix();
                    mesh.setMatrixAt(i, dummy.matrix);
                    glowDummy.position.set(d.x, d.y, d.z);
                    glowDummy.scale.setScalar(d.s * 2.2);
                    glowDummy.updateMatrix();
                    glowMesh.setMatrixAt(i, glowDummy.matrix);
                    col.copy(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BLOOM_INK"]);
                    mesh.setColorAt(i, col);
                    glowMesh.setColorAt(i, col);
                }
            }["Motes.useEffect"]);
            mesh.instanceMatrix.needsUpdate = true;
            glowMesh.instanceMatrix.needsUpdate = true;
            if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
            if (glowMesh.instanceColor) glowMesh.instanceColor.needsUpdate = true;
        }
    }["Motes.useEffect"], [
        data,
        dummy,
        glowDummy
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "Motes.useFrame": (state, delta)=>{
            const mesh = ref.current;
            const glowMesh = bloom.current;
            if (!mesh || !glowMesh) return;
            const camZ = state.camera.position.z;
            const farZ = camZ - 32;
            const nearZ = camZ + 2;
            const stream = reduced ? 0.12 : 0.4 + progress.current * 1.0;
            data.forEach({
                "Motes.useFrame": (d, i)=>{
                    d.z += delta * stream * d.speed;
                    if (d.z > nearZ) {
                        d.z = farZ - Math.random() * 6;
                        d.x = (Math.random() - 0.5) * 9;
                        d.y = (Math.random() - 0.5) * 5.5;
                    }
                    const depth = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp((d.z - farZ) / (nearZ - farZ), 0, 1);
                    const t = state.clock.elapsedTime;
                    const drift = reduced ? 0 : Math.sin(t * 0.32 + d.phase) * 0.04;
                    dummy.position.set(d.x + drift * depth, d.y - drift * 0.5 * depth, d.z);
                    const scale = d.s * (0.4 + depth * 1.6);
                    dummy.scale.setScalar(scale);
                    dummy.updateMatrix();
                    mesh.setMatrixAt(i, dummy.matrix);
                    glowDummy.position.copy(dummy.position);
                    glowDummy.scale.setScalar(scale * (1.8 + depth * 1.6));
                    glowDummy.updateMatrix();
                    glowMesh.setMatrixAt(i, glowDummy.matrix);
                }
            }["Motes.useFrame"]);
            mesh.instanceMatrix.needsUpdate = true;
            glowMesh.instanceMatrix.needsUpdate = true;
        }
    }["Motes.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("instancedMesh", {
                ref: bloom,
                args: [
                    undefined,
                    undefined,
                    count
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                        args: [
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/hero-scene/parts.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        map: glow,
                        transparent: true,
                        opacity: 0.16,
                        depthWrite: false,
                        blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"],
                        toneMapped: false
                    }, void 0, false, {
                        fileName: "[project]/components/hero-scene/parts.tsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/hero-scene/parts.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("instancedMesh", {
                ref: ref,
                args: [
                    undefined,
                    undefined,
                    count
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circleGeometry", {
                        args: [
                            1,
                            12
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/hero-scene/parts.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        transparent: true,
                        opacity: 0.28,
                        depthWrite: false,
                        blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"],
                        toneMapped: false
                    }, void 0, false, {
                        fileName: "[project]/components/hero-scene/parts.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/hero-scene/parts.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s1(Motes, "aSfD/j5J333K0UWp7kNBSPyizrw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c1 = Motes;
function CloudField({ texture, progress, reduced }) {
    _s2();
    const group = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clouds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CloudField.useMemo[clouds]": ()=>{
            return Array.from({
                length: 3
            }, {
                "CloudField.useMemo[clouds]": ()=>({
                        x: -10 + Math.random() * 20,
                        y: -3 + Math.random() * 6,
                        z: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAM_START"] - 16 - Math.random() * 22,
                        speed: 0.01 + Math.random() * 0.018,
                        stream: 0.12 + Math.random() * 0.24,
                        phase: Math.random() * Math.PI * 2,
                        layers: Array.from({
                            length: 5 + Math.round(Math.random() * 3)
                        }, {
                            "CloudField.useMemo[clouds]": ()=>({
                                    x: (Math.random() - 0.5) * 4.4,
                                    y: (Math.random() - 0.5) * 2.2,
                                    z: (Math.random() - 0.5) * 3,
                                    scale: 2 + Math.random() * 3,
                                    aspect: 1.6 + Math.random() * 1.3,
                                    angle: Math.random() * Math.PI * 2,
                                    spin: (0.008 + Math.random() * 0.03) * (Math.random() > 0.5 ? 1 : -1),
                                    opacity: 0.03 + Math.random() * 0.035
                                })
                        }["CloudField.useMemo[clouds]"])
                    })
            }["CloudField.useMemo[clouds]"]);
        }
    }["CloudField.useMemo[clouds]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "CloudField.useFrame": ({ clock, camera }, delta)=>{
            const g = group.current;
            if (!g) return;
            const time = clock.elapsedTime;
            const farZ = camera.position.z - 42;
            const nearZ = camera.position.z + 4;
            g.children.forEach({
                "CloudField.useFrame": (child, i)=>{
                    const cloud = clouds[i];
                    const cluster = child;
                    const driftSpeed = reduced ? cloud.speed * 0.28 : cloud.speed;
                    const streamSpeed = reduced ? cloud.stream * 0.2 : cloud.stream * (0.8 + progress.current * 0.9);
                    cluster.position.x += delta * driftSpeed;
                    cluster.position.z += delta * streamSpeed;
                    if (cluster.position.x > 12) {
                        cluster.position.x = -12 - Math.random() * 4;
                        cluster.position.y = -3 + Math.random() * 6;
                    }
                    if (cluster.position.z > nearZ) {
                        cluster.position.x = -10 + Math.random() * 20;
                        cluster.position.y = -3 + Math.random() * 6;
                        cluster.position.z = farZ - Math.random() * 10;
                    }
                    cluster.position.y = cloud.y + Math.sin(time * 0.06 + cloud.phase) * 0.3;
                    cluster.rotation.y = Math.sin(time * 0.025 + cloud.phase) * 0.05;
                    const depth = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp((cluster.position.z - farZ) / (nearZ - farZ), 0, 1);
                    const depthFade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(0.04, 0.26, depth) * (1 - (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(0.78, 1, depth));
                    cluster.children.forEach({
                        "CloudField.useFrame": (layerChild, j)=>{
                            const layer = cloud.layers[j];
                            const mesh = layerChild;
                            const mat = mesh.material;
                            mesh.quaternion.copy(camera.quaternion);
                            mesh.rotateZ(layer.angle + time * (reduced ? layer.spin * 0.2 : layer.spin));
                            mat.opacity = layer.opacity * depthFade * (0.84 + Math.sin(time * 0.1 + cloud.phase + j) * 0.16);
                        }
                    }["CloudField.useFrame"]);
                }
            }["CloudField.useFrame"]);
        }
    }["CloudField.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: group,
        children: clouds.map((cloud, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    cloud.x,
                    cloud.y,
                    cloud.z
                ],
                children: cloud.layers.map((layer, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            layer.x,
                            layer.y,
                            layer.z
                        ],
                        rotation: [
                            0,
                            0,
                            layer.angle
                        ],
                        scale: [
                            layer.scale * layer.aspect,
                            layer.scale,
                            1
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                                args: [
                                    1,
                                    1
                                ]
                            }, void 0, false, {
                                fileName: "[project]/components/hero-scene/parts.tsx",
                                lineNumber: 300,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                                map: texture,
                                transparent: true,
                                opacity: layer.opacity,
                                depthWrite: false,
                                blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NormalBlending"],
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INK"],
                                toneMapped: false
                            }, void 0, false, {
                                fileName: "[project]/components/hero-scene/parts.tsx",
                                lineNumber: 301,
                                columnNumber: 15
                            }, this)
                        ]
                    }, j, true, {
                        fileName: "[project]/components/hero-scene/parts.tsx",
                        lineNumber: 294,
                        columnNumber: 13
                    }, this))
            }, i, false, {
                fileName: "[project]/components/hero-scene/parts.tsx",
                lineNumber: 292,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/hero-scene/parts.tsx",
        lineNumber: 290,
        columnNumber: 5
    }, this);
}
_s2(CloudField, "aUK24+sDgRULqNhqwH/2SPuc/XY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c2 = CloudField;
function Rig({ progress, reduced }) {
    _s3();
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    const mouse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0
    });
    const target = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Rig.useEffect": ()=>{
            const onMove = {
                "Rig.useEffect.onMove": (e)=>{
                    target.current.x = e.clientX / window.innerWidth * 2 - 1;
                    target.current.y = e.clientY / window.innerHeight * 2 - 1;
                }
            }["Rig.useEffect.onMove"];
            window.addEventListener('pointermove', onMove);
            return ({
                "Rig.useEffect": ()=>window.removeEventListener('pointermove', onMove)
            })["Rig.useEffect"];
        }
    }["Rig.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "Rig.useFrame": (state, delta)=>{
            const k = Math.min(1, delta * 2.2);
            const p = progress.current;
            const t = state.clock.elapsedTime;
            const enter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTER_START"], __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTER_END"], p);
            const autoX = Math.sin(t * 0.14) * 0.06;
            const autoY = Math.cos(t * 0.12) * 0.04;
            mouse.current.x += (target.current.x + autoX - mouse.current.x) * k;
            mouse.current.y += (target.current.y + autoY - mouse.current.y) * k;
            const z = reduced ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAM_START"] - p * 1.2 : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAM_START"] + (__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAM_END"] - __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAM_START"]) * p;
            camera.position.z += (z - camera.position.z) * k;
            // 通り抜ける瞬間だけ、わずかに主役側へ寄る（入り込む手応え）。
            const baseX = 0.3 + enter * 0.5;
            const sway = reduced ? 0.2 : 1;
            camera.position.x += (baseX + mouse.current.x * 0.32 * sway - camera.position.x) * k;
            camera.position.y += (-mouse.current.y * 0.22 * sway - camera.position.y) * k;
            camera.rotation.y += (-mouse.current.x * 0.025 - camera.rotation.y) * k;
            camera.rotation.x += (mouse.current.y * 0.018 - camera.rotation.x) * k;
        }
    }["Rig.useFrame"]);
    return null;
}
_s3(Rig, "2gdvO9205JOKUKR+QoLbT8jlWlg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c3 = Rig;
function Atmosphere({ progress, glow }) {
    _s4();
    const mat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const grp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "Atmosphere.useFrame": ({ camera })=>{
            const p = progress.current;
            const enter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTER_START"], __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTER_END"], p);
            const settle = 1 - (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(0.62, 0.95, p);
            if (mat.current) {
                mat.current.opacity = (0.1 + enter * 0.46) * (0.5 + settle * 0.5);
            }
            if (grp.current) {
                grp.current.position.z = Math.min(-10, camera.position.z - 6);
            }
        }
    }["Atmosphere.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: grp,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
            position: [
                0.5,
                0.1,
                0
            ],
            scale: [
                30,
                22,
                1
            ],
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                    args: [
                        1,
                        1
                    ]
                }, void 0, false, {
                    fileName: "[project]/components/hero-scene/parts.tsx",
                    lineNumber: 382,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                    ref: mat,
                    map: glow,
                    transparent: true,
                    depthWrite: false,
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BLOOM_WARM"],
                    toneMapped: false
                }, void 0, false, {
                    fileName: "[project]/components/hero-scene/parts.tsx",
                    lineNumber: 383,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/hero-scene/parts.tsx",
            lineNumber: 381,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/hero-scene/parts.tsx",
        lineNumber: 380,
        columnNumber: 5
    }, this);
}
_s4(Atmosphere, "m3wbM0tI/AV9H9bZ5UjUq9CyUO0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c4 = Atmosphere;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "PhotoLayer");
__turbopack_context__.k.register(_c1, "Motes");
__turbopack_context__.k.register(_c2, "CloudField");
__turbopack_context__.k.register(_c3, "Rig");
__turbopack_context__.k.register(_c4, "Atmosphere");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/hero-scene/textures.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makeCloudTexture",
    ()=>makeCloudTexture,
    "makeGlowTexture",
    ()=>makeGlowTexture,
    "makePhotoTexture",
    ()=>makePhotoTexture
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/three@0.184.0/node_modules/three/build/three.core.js [app-client] (ecmascript)");
;
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}
function makePhotoTexture(img, ar, soft = false) {
    const H = 768;
    const W = Math.round(H * ar);
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');
    // 主役は「入り込む世界」なので角丸をほぼ消す。断片はもう少し丸く。
    const r = soft ? 8 : 4;
    ctx.save();
    roundRect(ctx, 2, 2, W - 4, H - 4, r);
    ctx.clip();
    if (img) {
        const ir = img.width / img.height;
        const tr = W / H;
        let dw = W;
        let dh = H;
        let dx = 0;
        let dy = 0;
        if (ir > tr) {
            dh = H;
            dw = H * ir;
            dx = (W - dw) / 2;
        } else {
            dw = W;
            dh = W / ir;
            dy = (H - dh) / 2;
        }
        ctx.drawImage(img, dx, dy, dw, dh);
    } else {
        ctx.fillStyle = '#0c0f15';
        ctx.fillRect(0, 0, W, H);
    }
    if (soft) {
        // 断片：端を強く暗部へ溶かし、全体も沈めて「遠い記憶」に。
        const edge = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.14, W / 2, H / 2, Math.max(W, H) * 0.56);
        edge.addColorStop(0, 'rgba(6,7,11,0.18)');
        edge.addColorStop(0.55, 'rgba(6,7,11,0.5)');
        edge.addColorStop(1, 'rgba(6,7,11,1)');
        ctx.fillStyle = edge;
        ctx.fillRect(0, 0, W, H);
    } else {
        // 主役：中央は鮮明に保ち、外周のわずかにだけビネット。カードの枠を感じさせない。
        const edge = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.42, W / 2, H / 2, Math.max(W, H) * 0.7);
        edge.addColorStop(0, 'rgba(6,7,11,0)');
        edge.addColorStop(0.8, 'rgba(6,7,11,0.16)');
        edge.addColorStop(1, 'rgba(6,7,11,0.62)');
        ctx.fillStyle = edge;
        ctx.fillRect(0, 0, W, H);
        // 下方向のごく薄い沈み（奥行きの余韻）。
        const g = ctx.createLinearGradient(0, H * 0.6, 0, H);
        g.addColorStop(0, 'rgba(6,7,11,0)');
        g.addColorStop(1, 'rgba(6,7,11,0.34)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
    const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
    tex.anisotropy = 8;
    tex.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    return tex;
}
function makeGlowTexture() {
    const S = 256;
    const c = document.createElement('canvas');
    c.width = S;
    c.height = S;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.5)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
}
function makeCloudTexture() {
    const S = 512;
    const c = document.createElement('canvas');
    c.width = S;
    c.height = S;
    const ctx = c.getContext('2d');
    for(let i = 0; i < 58; i++){
        const x = S * (0.16 + Math.random() * 0.68);
        const y = S * (0.24 + Math.random() * 0.52);
        const r = S * (0.07 + Math.random() * 0.13);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(255,255,255,${0.24 + Math.random() * 0.2})`);
        g.addColorStop(0.48, `rgba(255,255,255,${0.16 + Math.random() * 0.12})`);
        g.addColorStop(0.74, 'rgba(255,255,255,0.04)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, S, S);
    }
    ctx.globalCompositeOperation = 'destination-in';
    const mask = ctx.createRadialGradient(S / 2, S / 2, S * 0.12, S / 2, S / 2, S * 0.46);
    mask.addColorStop(0, 'rgba(255,255,255,1)');
    mask.addColorStop(0.64, 'rgba(255,255,255,0.96)');
    mask.addColorStop(0.84, 'rgba(255,255,255,0.34)');
    mask.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = mask;
    ctx.fillRect(0, 0, S, S);
    ctx.globalCompositeOperation = 'source-over';
    const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
    tex.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    return tex;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/hero-scene/scene.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeroSceneScene",
    ()=>HeroSceneScene
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_@babel+core@7.29.7_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_@babel+core@7.29.7_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/hero-scene/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$parts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/hero-scene/parts.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$textures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/hero-scene/textures.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function HeroSceneScene({ progress, reduced }) {
    _s();
    const glow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HeroSceneScene.useMemo[glow]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$textures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeGlowTexture"])()
    }["HeroSceneScene.useMemo[glow]"], []);
    const cloud = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HeroSceneScene.useMemo[cloud]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$textures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeCloudTexture"])()
    }["HeroSceneScene.useMemo[cloud]"], []);
    const [textures, setTextures] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroSceneScene.useEffect": ()=>{
            let alive = true;
            const made = [];
            __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LAYERS"].forEach({
                "HeroSceneScene.useEffect": (def, i)=>{
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.src = def.photo;
                    const build = {
                        "HeroSceneScene.useEffect.build": (image)=>{
                            if (!alive) return;
                            const tex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$textures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makePhotoTexture"])(image, def.ar, def.role === 'fragment');
                            made.push(tex);
                            setTextures({
                                "HeroSceneScene.useEffect.build": (prev)=>({
                                        ...prev,
                                        [i]: tex
                                    })
                            }["HeroSceneScene.useEffect.build"]);
                        }
                    }["HeroSceneScene.useEffect.build"];
                    img.onload = ({
                        "HeroSceneScene.useEffect": ()=>build(img)
                    })["HeroSceneScene.useEffect"];
                    img.onerror = ({
                        "HeroSceneScene.useEffect": ()=>build(null)
                    })["HeroSceneScene.useEffect"];
                }
            }["HeroSceneScene.useEffect"]);
            return ({
                "HeroSceneScene.useEffect": ()=>{
                    alive = false;
                    made.forEach({
                        "HeroSceneScene.useEffect": (t)=>t.dispose()
                    }["HeroSceneScene.useEffect"]);
                }
            })["HeroSceneScene.useEffect"];
        }
    }["HeroSceneScene.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroSceneScene.useEffect": ()=>({
                "HeroSceneScene.useEffect": ()=>{
                    glow.dispose();
                    cloud.dispose();
                }
            })["HeroSceneScene.useEffect"]
    }["HeroSceneScene.useEffect"], [
        cloud,
        glow
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("color", {
                attach: "background",
                args: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BG"]
                ]
            }, void 0, false, {
                fileName: "[project]/components/hero-scene/scene.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fog", {
                attach: "fog",
                args: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BG"],
                    8,
                    30
                ]
            }, void 0, false, {
                fileName: "[project]/components/hero-scene/scene.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$parts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atmosphere"], {
                progress: progress,
                glow: glow
            }, void 0, false, {
                fileName: "[project]/components/hero-scene/scene.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$parts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CloudField"], {
                texture: cloud,
                progress: progress,
                reduced: reduced
            }, void 0, false, {
                fileName: "[project]/components/hero-scene/scene.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$parts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Motes"], {
                progress: progress,
                glow: glow,
                reduced: reduced
            }, void 0, false, {
                fileName: "[project]/components/hero-scene/scene.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LAYERS"].map((def, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$parts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PhotoLayer"], {
                    def: def,
                    texture: textures[i] ?? null,
                    progress: progress,
                    reduced: reduced
                }, i, false, {
                    fileName: "[project]/components/hero-scene/scene.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$parts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Rig"], {
                progress: progress,
                reduced: reduced
            }, void 0, false, {
                fileName: "[project]/components/hero-scene/scene.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(HeroSceneScene, "KPWkohAhv0dvlafG6DjqysFo+Js=");
_c = HeroSceneScene;
var _c;
__turbopack_context__.k.register(_c, "HeroSceneScene");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/hero-scene.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeroScene",
    ()=>HeroScene
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_@babel+core@7.29.7_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-three+fiber@9.6.1_@types+react@19.2.14_react-dom@19.2.4_react@19.2.4__react@19.2.4_three@0.184.0/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$postprocessing$40$3$2e$0$2e$4_$40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$d_7ce6cef6ad2682a314cd1f0e8a4cedcf$2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-three+postprocessing@3.0.4_@react-three+fiber@9.6.1_@types+react@19.2.14_react-d_7ce6cef6ad2682a314cd1f0e8a4cedcf/node_modules/@react-three/postprocessing/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/hero-scene/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$scene$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/hero-scene/scene.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
;
function HeroScene({ progress, reduced = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
        gl: {
            antialias: true,
            powerPreference: 'high-performance'
        },
        dpr: [
            1,
            2
        ],
        camera: {
            position: [
                0.3,
                0,
                __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAM_START"]
            ],
            fov: 50
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$scene$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HeroSceneScene"], {
                progress: progress,
                reduced: reduced
            }, void 0, false, {
                fileName: "[project]/components/hero-scene.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            !reduced && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$postprocessing$40$3$2e$0$2e$4_$40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$d_7ce6cef6ad2682a314cd1f0e8a4cedcf$2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EffectComposer"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$postprocessing$40$3$2e$0$2e$4_$40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$d_7ce6cef6ad2682a314cd1f0e8a4cedcf$2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bloom"], {
                    intensity: 0.32,
                    luminanceThreshold: 0.45,
                    luminanceSmoothing: 0.6,
                    mipmapBlur: true
                }, void 0, false, {
                    fileName: "[project]/components/hero-scene.tsx",
                    lineNumber: 22,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/hero-scene.tsx",
                lineNumber: 21,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/hero-scene.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = HeroScene;
var _c;
__turbopack_context__.k.register(_c, "HeroScene");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/hero-scene.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/hero-scene.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_0bgu1ro._.js.map