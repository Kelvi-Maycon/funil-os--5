import { t as CanvasBoard } from "./CanvasBoard-CrfF-aDa.js";
import "./useResourceStore-GklaiWmT.js";
import "./tabs-Cw4GWDrh.js";
import { A as useFunnelStore_default, Jt as require_jsx_runtime, nn as useParams, on as __toESM } from "./index-C-022rlr.js";
import "./badge-CnMJl9W4.js";
import "./ConfirmDialog-DhTWSZW_.js";
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

//# sourceMappingURL=Canvas-Ca1YcJua.js.map