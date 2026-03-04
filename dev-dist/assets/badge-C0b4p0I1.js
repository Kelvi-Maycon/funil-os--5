import { Rt as require_react, Vt as __toESM, bt as cva, et as cn, kt as require_jsx_runtime } from "./index-BgGqzoz0.js";
require_react();
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
		destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm",
		outline: "text-foreground border-border bg-background"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
export { Badge as t };

//# sourceMappingURL=badge-C0b4p0I1.js.map