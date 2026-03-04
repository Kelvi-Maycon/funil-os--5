import { E as useDocumentStore_default, Vt as __toESM, at as Plus, ft as FileText, kt as require_jsx_runtime, m as useQuickActionStore_default, w as Button } from "./index-WvayVERT.js";
import { t as EmptyState } from "./empty-state-B1X4nJoc.js";
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function Documents() {
	const [docs] = useDocumentStore_default();
	const [, setAction] = useQuickActionStore_default();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in flex flex-col h-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold tracking-tight text-foreground",
					children: "Documentos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-base font-medium",
					children: "Centralize seus scripts de vendas, copys e pesquisas."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => setAction({
					type: "document",
					mode: "create"
				}),
				className: "font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					size: 16,
					className: "mr-2"
				}), " Novo Documento"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: FileText,
				title: "Gestão de Documentos",
				description: "O editor rico de documentos em tela cheia será implementado na próxima versão.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setAction({
						type: "document",
						mode: "create"
					}),
					children: "Criar Documento Rápido"
				})
			})
		})]
	});
}
export { Documents as default };

//# sourceMappingURL=Documents-Ej6UDZB_.js.map