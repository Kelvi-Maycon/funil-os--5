import { Jt as require_jsx_runtime, ft as cn, on as __toESM } from "./index-BBQ0CWHy.js";
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function EmptyState({ icon: Icon, title, description, action, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-card p-12 min-h-[400px] text-center shadow-sm w-full", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 32 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xl font-bold text-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground mt-2 mb-6 max-w-sm text-base mx-auto",
				children: description
			}),
			action
		]
	});
}
export { EmptyState as t };

//# sourceMappingURL=empty-state-lPQ62j68.js.map