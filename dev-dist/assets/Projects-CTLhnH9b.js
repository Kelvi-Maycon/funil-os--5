import { C as Input, Nt as Link, Rt as require_react, Vt as __toESM, _ as format, _t as Calendar, at as Plus, dt as Folder, ht as ChevronRight, it as Search, k as useProjectStore_default, kt as require_jsx_runtime, m as useQuickActionStore_default, w as Button } from "./index-CBmeAG5q.js";
import { t as Badge } from "./badge-BotaLT9k.js";
import { t as EmptyState } from "./empty-state-DM-PkPFf.js";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-Be521Qyd.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function Projects() {
	const [projects] = useProjectStore_default();
	const [, setAction] = useQuickActionStore_default();
	const [search, setSearch] = (0, import_react.useState)("");
	const filteredProjects = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold tracking-tight text-foreground",
					children: "Projetos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-base font-medium",
					children: "Gerencie seus lançamentos, campanhas e funis perpétuos."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => setAction({
					type: "project",
					mode: "create"
				}),
				className: "font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					size: 16,
					className: "mr-2"
				}), " Novo Projeto"]
			})]
		}), projects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: Folder,
			title: "Nenhum projeto encontrado",
			description: "Você ainda não tem nenhum projeto. Crie seu primeiro projeto para começar a organizar seus funis e tarefas.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setAction({
					type: "project",
					mode: "create"
				}),
				size: "lg",
				children: "Criar Projeto"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
					size: 18
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Pesquisar projetos...",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "pl-10 bg-card font-medium"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
				children: filteredProjects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: `/projetos/${p.id}`,
					className: "block group",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "h-full hover-lift border-border shadow-sm bg-card group-hover:border-primary/50 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
										size: 20,
										className: "fill-current opacity-20"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: p.status === "Ativo" ? "bg-success/10 text-success border-none font-bold" : p.status === "Pausado" ? "bg-warning/10 text-warning border-none font-bold" : "bg-muted text-muted-foreground border-none font-bold",
									children: p.status
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-xl group-hover:text-primary transition-colors line-clamp-1",
								children: p.name
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground line-clamp-2 mb-6 font-medium h-10",
							children: p.description || "Nenhuma descrição fornecida."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-border pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-xs font-bold text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { size: 14 }), format(new Date(p.createdAt), "dd MMM yyyy")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0",
								children: ["Acessar ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 16 })]
							})]
						})] })]
					})
				}, p.id))
			}),
			filteredProjects.length === 0 && search && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-12 text-center text-muted-foreground font-medium bg-card rounded-xl border border-dashed border-border",
				children: [
					"Nenhum projeto encontrado para \"",
					search,
					"\"."
				]
			})
		] })]
	});
}
export { Projects as default };

//# sourceMappingURL=Projects-CTLhnH9b.js.map