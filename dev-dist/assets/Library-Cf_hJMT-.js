import { Vt as __toESM, at as Plus, kt as require_jsx_runtime, vt as BookOpen, w as Button } from "./index-BgGqzoz0.js";
import { t as useResourceStore_default } from "./useResourceStore-B9sre4Br.js";
import { t as EmptyState } from "./empty-state-CiiGyVRm.js";
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function Library() {
	const [resources] = useResourceStore_default();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in flex flex-col h-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold tracking-tight text-foreground",
					children: "Biblioteca"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-base font-medium",
					children: "Seus ativos, referências e banco de imagens."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					size: 16,
					className: "mr-2"
				}), " Adicionar Recurso"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: BookOpen,
				title: "Biblioteca de Ativos",
				description: "Explore seus recursos salvos. Interface de galeria avançada em construção.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					children: "Upload de Arquivos"
				})
			})
		})]
	});
}
export { Library as default };

//# sourceMappingURL=Library-Cf_hJMT-.js.map