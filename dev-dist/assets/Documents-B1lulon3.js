import { D as useDocumentStore_default, Lt as require_react, Ot as require_jsx_runtime, T as Button, d as useQuickActionStore_default, ft as FileText, m as format, ot as Search, st as Plus, w as Input, zt as __toESM } from "./index-C59AXJt2.js";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BdPGic5X.js";
import { t as EmptyState } from "./empty-state-BRNxdKNW.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function Documents() {
	const [docs] = useDocumentStore_default();
	const [, setAction] = useQuickActionStore_default();
	const [search, setSearch] = (0, import_react.useState)("");
	const filteredDocs = docs.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold tracking-tight text-foreground",
						children: "Documentos"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-medium text-muted-foreground",
						children: "Centralize scripts, copys e roteiros"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setAction({
						type: "document",
						mode: "create"
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						size: 16,
						className: "mr-2"
					}), " Novo Documento"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
					size: 18
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Buscar documentos...",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "pl-10"
				})]
			}),
			filteredDocs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: FileText,
				title: "Nenhum documento encontrado",
				description: "Você ainda não criou nenhum documento. Comece agora criando scripts e roteiros.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setAction({
						type: "document",
						mode: "create"
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						size: 16,
						className: "mr-2"
					}), " Criar Documento"]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				children: filteredDocs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "cursor-pointer hover-lift group flex flex-col h-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "p-6 pb-4 flex flex-row items-start justify-between space-y-0 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center text-info mb-2 group-hover:scale-105 transition-transform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 24 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted-foreground font-medium",
							children: format(new Date(d.updatedAt), "dd/MM/yyyy")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-6 pt-0 flex-1 flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-xl line-clamp-1 mb-2",
							children: d.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base text-muted-foreground line-clamp-3",
							children: d.content.replace(/<[^>]*>?/gm, "") || "Documento vazio"
						})]
					})]
				}, d.id))
			})
		]
	});
}
export { Documents as default };

//# sourceMappingURL=Documents-B1lulon3.js.map