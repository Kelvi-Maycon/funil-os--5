import { n as Image, t as Link } from "./link-CV0B2ciU.js";
import { D as Input, Gt as __toESM, Ht as require_react, Nt as require_jsx_runtime, O as Button, dt as Plus, m as useQuickActionStore_default, ut as Search, xt as BookOpen } from "./index-EdMs8eqF.js";
import { t as Badge } from "./badge-CeYKpMjG.js";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-CAeBHRFd.js";
import { t as EmptyState } from "./empty-state-B2I3dmbm.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function Library() {
	const [, setAction] = useQuickActionStore_default();
	const [search, setSearch] = (0, import_react.useState)("");
	const filtered = [{
		id: "1",
		title: "Referência VSL",
		type: "link",
		tags: ["swipe"]
	}, {
		id: "2",
		title: "Paleta Lançamento",
		type: "image",
		tags: ["asset"]
	}].filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold tracking-tight text-foreground",
						children: "Biblioteca"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-medium text-muted-foreground",
						children: "Seus assets, referências e insights salvos"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setAction({
						type: "asset",
						mode: "create"
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						size: 16,
						className: "mr-2"
					}), " Novo Recurso"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
					size: 18
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Buscar recursos...",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "pl-10"
				})]
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: BookOpen,
				title: "Nenhum recurso encontrado",
				description: "Sua biblioteca está vazia. Adicione assets, referências ou insights.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setAction({
						type: "asset",
						mode: "create"
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						size: 16,
						className: "mr-2"
					}), " Adicionar Recurso"]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				children: filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "cursor-pointer hover-lift group flex flex-col h-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "p-6 pb-4 flex flex-row items-start justify-between space-y-0 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-105 transition-transform",
							children: r.type === "link" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { size: 24 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { size: 24 })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-6 pt-0 flex-1 flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-xl line-clamp-1 mb-2",
							children: r.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 mt-auto pt-4 flex-wrap",
							children: r.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "uppercase text-[10px]",
								children: tag
							}, tag))
						})]
					})]
				}, r.id))
			})
		]
	});
}
export { Library as default };

//# sourceMappingURL=Library-xbTn2CYu.js.map