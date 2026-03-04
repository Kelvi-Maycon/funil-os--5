import { C as Input, Nt as Link, O as useFunnelStore_default, Rt as require_react, Vt as __toESM, at as Plus, dt as Folder, ht as ChevronRight, it as Search, k as useProjectStore_default, kt as require_jsx_runtime, m as useQuickActionStore_default, ot as Network, w as Button } from "./index-CBmeAG5q.js";
import { t as Badge } from "./badge-BotaLT9k.js";
import { t as EmptyState } from "./empty-state-DM-PkPFf.js";
import { t as Card } from "./card-Be521Qyd.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function Funnels() {
	const [funnels] = useFunnelStore_default();
	const [projects] = useProjectStore_default();
	const [, setAction] = useQuickActionStore_default();
	const [search, setSearch] = (0, import_react.useState)("");
	const filteredFunnels = funnels.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
	const getProjectName = (id) => {
		if (!id) return "Rascunho";
		return projects.find((p) => p.id === id)?.name || "Desconhecido";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold tracking-tight text-foreground",
					children: "Funis e Canvas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-base font-medium",
					children: "Desenhe e gerencie a estrutura dos seus funis de marketing."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => setAction({
					type: "canvas",
					mode: "create"
				}),
				className: "font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					size: 16,
					className: "mr-2"
				}), " Novo Canvas"]
			})]
		}), funnels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: Network,
			title: "Nenhum funil criado",
			description: "Você ainda não tem nenhum funil desenhado. Crie um novo canvas para mapear suas estratégias visuais.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setAction({
					type: "canvas",
					mode: "create"
				}),
				size: "lg",
				children: "Criar Novo Canvas"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
				className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
				size: 18
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Pesquisar funis...",
				value: search,
				onChange: (e) => setSearch(e.target.value),
				className: "pl-10 bg-card font-medium"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
			children: filteredFunnels.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: `/canvas/${f.id}`,
				className: "block group",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "h-full hover-lift border-border shadow-sm bg-card group-hover:border-info/50 transition-colors p-6 flex flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-start mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-xl bg-info/10 text-info flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { size: 20 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: f.status === "Ativo" ? "bg-success/10 text-success border-none font-bold" : "bg-muted text-muted-foreground border-none font-bold",
								children: f.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-lg group-hover:text-info transition-colors line-clamp-1 mb-2 text-foreground",
							children: f.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs font-bold text-muted-foreground mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: getProjectName(f.projectId)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto pt-4 border-t border-border flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-bold text-muted-foreground",
								children: [f.nodes.length, " blocos"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-info text-sm font-bold flex items-center opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0",
								children: ["Abrir ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 16 })]
							})]
						})
					]
				})
			}, f.id))
		})] })]
	});
}
export { Funnels as default };

//# sourceMappingURL=Funnels-BJ5eITk0.js.map