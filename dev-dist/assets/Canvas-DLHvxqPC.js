import { t as CanvasBoard } from "./CanvasBoard-DwpuOdd2.js";
import "./tabs-CO9jZsMA.js";
import { Bt as useParams, Gt as __toESM, M as useFunnelStore_default, Nt as require_jsx_runtime } from "./index-BBV0FkD8.js";
import "./badge-C2lK6XB7.js";
import "./ConfirmDialog-6Ch-j5lQ.js";
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function Canvas() {
	const { id } = useParams();
	const [funnels, setFunnels] = useFunnelStore_default();
	const funnel = funnels.find((f) => f.id === id);
	if (!funnel) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-muted-foreground font-bold",
		children: "Funil não encontrado."
	});
	const updateFunnel = (updated) => {
		setFunnels((prev) => prev.map((f) => f.id === id ? updated : f));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex-1 w-full h-full flex flex-col overflow-hidden animate-fade-in bg-background relative",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 w-full h-full relative flex overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CanvasBoard, {
				funnel,
				onChange: updateFunnel
			})
		})
	});
}
export { Canvas as default };

//# sourceMappingURL=Canvas-DLHvxqPC.js.map