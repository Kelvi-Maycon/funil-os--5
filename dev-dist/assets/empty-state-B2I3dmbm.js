import { Gt as __toESM, Nt as require_jsx_runtime, at as cn } from "./index-EdMs8eqF.js";
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function EmptyState({ icon: Icon, title, description, action, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-card p-12 min-h-[400px] text-center shadow-sm w-full animate-fade-in", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 32 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xl font-bold text-foreground mb-2",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground max-w-md text-base mb-8 font-medium",
				children: description
			}),
			action
		]
	});
}
export { EmptyState as t };

//# sourceMappingURL=empty-state-B2I3dmbm.js.map