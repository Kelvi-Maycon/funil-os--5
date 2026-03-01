import { t as CanvasBoard } from "./CanvasBoard-CgZ6eBar.js";
import "./useResourceStore-I6An2X6I.js";
import "./tabs-DanDQTSo.js";
import { A as useFunnelStore_default, Jt as require_jsx_runtime, nn as useParams, on as __toESM } from "./index-D26CbVOK.js";
import "./badge-BzGf268W.js";
import "./ConfirmDialog-DQV43ZRn.js";
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function Canvas() {
	const { id } = useParams();
	const [funnels, setFunnels] = useFunnelStore_default();
	const funnel = funnels.find((f) => f.id === id);
	if (!funnel) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-[#8C7B6C] font-bold",
		children: "Funil não encontrado."
	});
	const updateFunnel = (updated) => {
		setFunnels((prev) => prev.map((f) => f.id === id ? updated : f));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex-1 w-full h-full flex flex-col overflow-hidden animate-fade-in bg-[#FAF7F2] relative",
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

//# sourceMappingURL=Canvas-BTDKmvLj.js.map