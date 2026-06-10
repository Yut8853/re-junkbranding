(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/lenis.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getLenisInstance",
    ()=>getLenisInstance,
    "setLenisInstance",
    ()=>setLenisInstance
]);
'use client';
let lenisInstance = null;
function setLenisInstance(lenis) {
    lenisInstance = lenis;
}
function getLenisInstance() {
    return lenisInstance;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/lenis-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LenisProvider",
    ()=>LenisProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_@babel+core@7.29.7_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lenis$40$1$2e$3$2e$23_react$40$19$2e$2$2e$4$2f$node_modules$2f$lenis$2f$dist$2f$lenis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lenis@1.3.23_react@19.2.4/node_modules/lenis/dist/lenis.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$lenis$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/lenis.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function LenisProvider() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LenisProvider.useEffect": ()=>{
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
            if (reduce.matches) return;
            const lenis = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lenis$40$1$2e$3$2e$23_react$40$19$2e$2$2e$4$2f$node_modules$2f$lenis$2f$dist$2f$lenis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
                autoRaf: false,
                smoothWheel: true,
                syncTouch: false
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$lenis$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLenisInstance"])(lenis);
            let frame = 0;
            const onFrame = {
                "LenisProvider.useEffect.onFrame": (time)=>{
                    lenis.raf(time);
                    frame = window.requestAnimationFrame(onFrame);
                }
            }["LenisProvider.useEffect.onFrame"];
            frame = window.requestAnimationFrame(onFrame);
            return ({
                "LenisProvider.useEffect": ()=>{
                    window.cancelAnimationFrame(frame);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$lenis$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLenisInstance"])(null);
                    lenis.destroy();
                }
            })["LenisProvider.useEffect"];
        }
    }["LenisProvider.useEffect"], []);
    return null;
}
_s(LenisProvider, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = LenisProvider;
var _c;
__turbopack_context__.k.register(_c, "LenisProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_08~9d7r._.js.map