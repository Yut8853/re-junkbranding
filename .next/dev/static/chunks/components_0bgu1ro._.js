(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/hero-scene/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AMBER",
    ()=>AMBER,
    "BG",
    ()=>BG,
    "BLOOM_AMBER",
    ()=>BLOOM_AMBER,
    "BLOOM_INK",
    ()=>BLOOM_INK,
    "BLOOM_WARM",
    ()=>BLOOM_WARM,
    "CAM_END",
    ()=>CAM_END,
    "CAM_START",
    ()=>CAM_START,
    "INK",
    ()=>INK,
    "LAYERS",
    ()=>LAYERS,
    "OPENING_PHOTO_PRESENCE",
    ()=>OPENING_PHOTO_PRESENCE,
    "WARM",
    ()=>WARM,
    "smoothstep",
    ()=>smoothstep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/three@0.184.0/node_modules/three/build/three.core.js [app-client] (ecmascript)");
;
const BG = '#050608';
const INK = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#d8dce5');
const AMBER = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#f3f6fb');
const WARM = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#f7f9ff');
const BLOOM_INK = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#f2f6ff').multiplyScalar(1.95);
const BLOOM_AMBER = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#ffffff').multiplyScalar(2.2);
const BLOOM_WARM = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#ffffff').multiplyScalar(2.05);
const CAM_START = 5.8;
const CAM_END = -14.5;
const OPENING_PHOTO_PRESENCE = 0.38;
const LAYERS = [
    {
        photo: '/jp/cafe.png',
        label: '飲食 / Restaurant',
        pos: [
            2.0,
            0.1,
            -0.5
        ],
        rotY: -0.18,
        rotX: 0.02,
        h: 3.2,
        ar: 1.5,
        drift: 0.1,
        sweep: [
            3.6,
            -0.6
        ]
    },
    {
        photo: '/jp/salon.png',
        label: '美容 / Salon',
        pos: [
            4.6,
            1.7,
            -2.6
        ],
        rotY: -0.28,
        rotX: 0.0,
        h: 2.8,
        ar: 0.78,
        drift: 0.14,
        sweep: [
            4.2,
            1.6
        ]
    },
    {
        photo: '/jp/craft.png',
        label: 'ものづくり / Craft',
        pos: [
            -2.4,
            -1.6,
            -4.2
        ],
        rotY: 0.2,
        rotX: 0.05,
        h: 2.6,
        ar: 1.4,
        drift: 0.14,
        sweep: [
            -4.0,
            -1.8
        ]
    },
    {
        photo: '/jp/clinic.png',
        label: '医療 / Clinic',
        pos: [
            3.6,
            -0.6,
            -6.4
        ],
        rotY: -0.26,
        rotX: 0.0,
        h: 2.6,
        ar: 1.45,
        drift: 0.16,
        sweep: [
            4.0,
            -1.4
        ]
    },
    {
        photo: '/jp/store.png',
        label: '店舗 / Store',
        pos: [
            -2.2,
            1.8,
            -8.4
        ],
        rotY: 0.14,
        rotX: 0.02,
        h: 2.5,
        ar: 1.5,
        drift: 0.18,
        sweep: [
            -3.8,
            2.0
        ]
    },
    {
        photo: '/jp/farm.png',
        label: '農業 / Agriculture',
        pos: [
            2.4,
            -1.0,
            -10.6
        ],
        rotY: -0.16,
        rotX: 0.03,
        h: 2.4,
        ar: 1.5,
        drift: 0.2,
        sweep: [
            3.4,
            -1.6
        ]
    },
    {
        photo: '/jp/personal.png',
        label: '個人ブランド / Creator',
        pos: [
            -1.2,
            0.6,
            -12.8
        ],
        rotY: 0.1,
        rotX: 0.0,
        h: 2.2,
        ar: 1.3,
        drift: 0.22,
        sweep: [
            -3.0,
            1.2
        ]
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
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    const phase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PhotoLayer.useMemo[phase]": ()=>Math.random() * Math.PI * 2
    }["PhotoLayer.useMemo[phase]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "PhotoLayer.useFrame": (state, delta)=>{
            const g = group.current;
            const m = mat.current;
            if (!g || !m) return;
            const camZ = camera.position.z;
            const ahead = camZ - def.pos[2];
            const reveal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(15, 9.5, ahead);
            const opening = (1 - (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(0.04, 0.28, progress.current)) * (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(24, 12, ahead);
            const presence = Math.max(reveal, opening * __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OPENING_PHOTO_PRESENCE"]);
            const pass = reduced ? 0 : (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(3.2, -0.6, ahead);
            const passFade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(-1.2, 1.6, ahead);
            const baseTex = texture ? 1 : 0;
            m.opacity += (baseTex * presence * passFade - m.opacity) * Math.min(1, delta * 4);
            const t = state.clock.elapsedTime;
            const fx = reduced ? 0 : Math.cos(t * 0.3 + phase) * def.drift * 0.5;
            const fy = reduced ? 0 : Math.sin(t * 0.4 + phase) * def.drift;
            const approach = (1 - presence) * -1.2;
            g.position.x = def.pos[0] + def.sweep[0] * pass + fx;
            g.position.y = def.pos[1] + def.sweep[1] * pass + fy;
            g.position.z = def.pos[2] + approach;
            g.rotation.y = def.rotY - def.sweep[0] * 0.04 * pass;
            g.rotation.x = def.rotX;
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
                    lineNumber: 66,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                    ref: mat,
                    map: texture ?? undefined,
                    transparent: true,
                    opacity: 0,
                    toneMapped: false,
                    side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
                }, void 0, false, {
                    fileName: "[project]/components/hero-scene/parts.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/hero-scene/parts.tsx",
            lineNumber: 65,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/hero-scene/parts.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
_s(PhotoLayer, "qchl62fgkYZXSwGEFMpijFlvMIs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c = PhotoLayer;
function Motes({ progress, glow, reduced }) {
    _s1();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const bloom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const count = 260;
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
                    x: (Math.random() - 0.5) * 18,
                    y: (Math.random() - 0.5) * 11,
                    z: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAM_START"] - Math.random() * 32,
                    s: 0.018 + Math.random() * 0.055,
                    speed: 0.65 + Math.random() * 1.35,
                    phase: Math.random() * Math.PI * 2,
                    amber: Math.random() < 0.28
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
                    glowDummy.scale.setScalar(d.s * 2.8);
                    glowDummy.updateMatrix();
                    glowMesh.setMatrixAt(i, glowDummy.matrix);
                    col.copy(d.amber ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BLOOM_AMBER"] : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BLOOM_INK"]);
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
            const farZ = camZ - 34;
            const nearZ = camZ + 2.8;
            const stream = reduced ? 0.35 : 1.2 + progress.current * 4.2;
            let changed = false;
            data.forEach({
                "Motes.useFrame": (d, i)=>{
                    d.z += delta * stream * d.speed;
                    if (d.z > nearZ) {
                        d.z = farZ - Math.random() * 8;
                        d.x = (Math.random() - 0.5) * 18;
                        d.y = (Math.random() - 0.5) * 11;
                        d.s = 0.018 + Math.random() * 0.055;
                        d.speed = 0.65 + Math.random() * 1.35;
                        changed = true;
                    }
                    const depth = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp((d.z - farZ) / (nearZ - farZ), 0, 1);
                    const t = state.clock.elapsedTime;
                    const drift = reduced ? 0 : Math.sin(t * 0.5 + d.phase) * 0.08;
                    dummy.position.set(d.x + drift * depth, d.y - drift * 0.55 * depth, d.z);
                    const scale = d.s * (0.45 + depth * 2.65);
                    dummy.scale.setScalar(scale);
                    dummy.updateMatrix();
                    mesh.setMatrixAt(i, dummy.matrix);
                    glowDummy.position.copy(dummy.position);
                    glowDummy.scale.setScalar(scale * (2.8 + depth * 2.6));
                    glowDummy.updateMatrix();
                    glowMesh.setMatrixAt(i, glowDummy.matrix);
                }
            }["Motes.useFrame"]);
            mesh.instanceMatrix.needsUpdate = true;
            glowMesh.instanceMatrix.needsUpdate = true;
            if (changed && mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
            if (changed && glowMesh.instanceColor) glowMesh.instanceColor.needsUpdate = true;
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
                        lineNumber: 185,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        map: glow,
                        transparent: true,
                        opacity: 0.82,
                        depthWrite: false,
                        blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"],
                        toneMapped: false
                    }, void 0, false, {
                        fileName: "[project]/components/hero-scene/parts.tsx",
                        lineNumber: 186,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/hero-scene/parts.tsx",
                lineNumber: 184,
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
                        lineNumber: 196,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        transparent: true,
                        opacity: 0.95,
                        depthWrite: false,
                        blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"],
                        toneMapped: false
                    }, void 0, false, {
                        fileName: "[project]/components/hero-scene/parts.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/hero-scene/parts.tsx",
                lineNumber: 195,
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
                length: 9
            }, {
                "CloudField.useMemo[clouds]": ()=>({
                        x: -14 + Math.random() * 28,
                        y: -4.2 + Math.random() * 8.4,
                        z: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAM_START"] - 10 - Math.random() * 30,
                        speed: 0.018 + Math.random() * 0.036,
                        stream: 0.22 + Math.random() * 0.46,
                        phase: Math.random() * Math.PI * 2,
                        layers: Array.from({
                            length: 7 + Math.round(Math.random() * 9)
                        }, {
                            "CloudField.useMemo[clouds]": ()=>({
                                    x: (Math.random() - 0.5) * 4.8,
                                    y: (Math.random() - 0.5) * 2.4,
                                    z: (Math.random() - 0.5) * 3.2,
                                    scale: 1.8 + Math.random() * 3.2,
                                    aspect: 1.65 + Math.random() * 1.4,
                                    angle: Math.random() * Math.PI * 2,
                                    spin: (0.018 + Math.random() * 0.06) * (Math.random() > 0.5 ? 1 : -1),
                                    opacity: 0.09 + Math.random() * 0.14
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
            const nearZ = camera.position.z + 5;
            g.children.forEach({
                "CloudField.useFrame": (child, i)=>{
                    const cloud = clouds[i];
                    const cluster = child;
                    const driftSpeed = reduced ? cloud.speed * 0.28 : cloud.speed;
                    const streamSpeed = reduced ? cloud.stream * 0.2 : cloud.stream * (0.8 + progress.current * 1.4);
                    cluster.position.x += delta * driftSpeed;
                    cluster.position.z += delta * streamSpeed;
                    if (cluster.position.x > 14) {
                        cluster.position.x = -14 - Math.random() * 5;
                        cluster.position.y = -4.2 + Math.random() * 8.4;
                    }
                    if (cluster.position.z > nearZ) {
                        cluster.position.x = -14 + Math.random() * 28;
                        cluster.position.y = -4.2 + Math.random() * 8.4;
                        cluster.position.z = farZ - Math.random() * 12;
                    }
                    cluster.position.y = cloud.y + Math.sin(time * 0.08 + cloud.phase) * 0.42;
                    cluster.rotation.y = Math.sin(time * 0.035 + cloud.phase) * 0.08;
                    const depth = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp((cluster.position.z - farZ) / (nearZ - farZ), 0, 1);
                    const depthFade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(0.02, 0.24, depth) * (1 - (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(0.82, 1, depth));
                    cluster.children.forEach({
                        "CloudField.useFrame": (layerChild, j)=>{
                            const layer = cloud.layers[j];
                            const mesh = layerChild;
                            const mat = mesh.material;
                            mesh.quaternion.copy(camera.quaternion);
                            mesh.rotateZ(layer.angle + time * (reduced ? layer.spin * 0.2 : layer.spin));
                            mat.opacity = layer.opacity * depthFade * (0.82 + Math.sin(time * 0.13 + cloud.phase + j) * 0.18);
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
                                lineNumber: 295,
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
                                lineNumber: 296,
                                columnNumber: 15
                            }, this)
                        ]
                    }, j, true, {
                        fileName: "[project]/components/hero-scene/parts.tsx",
                        lineNumber: 289,
                        columnNumber: 13
                    }, this))
            }, i, false, {
                fileName: "[project]/components/hero-scene/parts.tsx",
                lineNumber: 287,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/hero-scene/parts.tsx",
        lineNumber: 285,
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
            const k = Math.min(1, delta * 3);
            const p = progress.current;
            const t = state.clock.elapsedTime;
            const autoX = Math.sin(t * 0.18) * 0.12;
            const autoY = Math.cos(t * 0.15) * 0.08;
            mouse.current.x += (target.current.x + autoX - mouse.current.x) * k;
            mouse.current.y += (target.current.y + autoY - mouse.current.y) * k;
            const z = reduced ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAM_START"] - p * 2.5 : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAM_START"] + (__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAM_END"] - __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAM_START"]) * p;
            camera.position.z += (z - camera.position.z) * k;
            const sway = reduced ? 0.25 : 1;
            const baseX = 0.6;
            camera.position.x += (baseX + mouse.current.x * 0.7 * sway - camera.position.x) * k;
            camera.position.y += (-mouse.current.y * 0.45 * sway - camera.position.y) * k;
            camera.rotation.y += (-mouse.current.x * 0.05 - camera.rotation.y) * k;
            camera.rotation.x += (mouse.current.y * 0.03 - camera.rotation.x) * k;
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
    const warmMat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const warm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$three$2b$fiber$40$9$2e$6$2e$1_$40$types$2b$react$40$19$2e$2$2e$14_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4_three$40$0$2e$184$2e$0$2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "Atmosphere.useFrame": ({ camera })=>{
            const p = progress.current;
            if (warmMat.current) warmMat.current.opacity = 0.3 + (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])(0.5, 1, p) * 0.55;
            if (warm.current) {
                warm.current.position.z = Math.min(-13, camera.position.z - 4);
            }
        }
    }["Atmosphere.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                ref: warm,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        1,
                        0.3,
                        0
                    ],
                    scale: [
                        42,
                        30,
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
                            lineNumber: 370,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                            ref: warmMat,
                            map: glow,
                            transparent: true,
                            depthWrite: false,
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BLOOM_WARM"],
                            toneMapped: false
                        }, void 0, false, {
                            fileName: "[project]/components/hero-scene/parts.tsx",
                            lineNumber: 371,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/hero-scene/parts.tsx",
                    lineNumber: 369,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/hero-scene/parts.tsx",
                lineNumber: 368,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    -6,
                    3,
                    -9
                ],
                scale: [
                    16,
                    14,
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
                        map: glow,
                        transparent: true,
                        opacity: 0.18,
                        depthWrite: false,
                        color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BLOOM_AMBER"],
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
        ]
    }, void 0, true, {
        fileName: "[project]/components/hero-scene/parts.tsx",
        lineNumber: 367,
        columnNumber: 5
    }, this);
}
_s4(Atmosphere, "3bYfnf0F0KDFbHGPeF6lbpyuG5s=", false, function() {
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
function makePhotoTexture(img, label, ar) {
    const H = 768;
    const W = Math.round(H * ar);
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');
    const r = 26;
    ctx.save();
    roundRect(ctx, 6, 6, W - 12, H - 12, r);
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
        ctx.fillStyle = '#1c2233';
        ctx.fillRect(0, 0, W, H);
    }
    const g = ctx.createLinearGradient(0, H * 0.5, 0, H);
    g.addColorStop(0, 'rgba(12,15,24,0)');
    g.addColorStop(1, 'rgba(12,15,24,0.62)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#e6b066';
    ctx.fillRect(40, H - 86, 34, 3);
    ctx.fillStyle = 'rgba(247,243,236,0.92)';
    ctx.font = '500 30px ui-sans-serif, system-ui, sans-serif';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(label, 40, H - 50);
    ctx.restore();
    roundRect(ctx, 6, 6, W - 12, H - 12, r);
    ctx.strokeStyle = 'rgba(243,221,180,0.16)';
    ctx.lineWidth = 2;
    ctx.stroke();
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
                            const tex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$scene$2f$textures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makePhotoTexture"])(image, def.label, def.ar);
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
                    6,
                    22
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
                0.6,
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
                    intensity: 0.95,
                    luminanceThreshold: 0.22,
                    luminanceSmoothing: 0.36,
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