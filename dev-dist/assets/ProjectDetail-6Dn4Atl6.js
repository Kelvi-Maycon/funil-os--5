import { a as ArrowLeft, i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-5_rNOjog.js";
import { D as useTaskStore_default, Ft as useNavigate, It as useParams, Nt as Link, O as useFunnelStore_default, Vt as __toESM, _ as format, _t as Calendar, at as Plus, dt as Folder, ft as FileText, k as useProjectStore_default, kt as require_jsx_runtime, m as useQuickActionStore_default, nt as SquareCheckBig, ot as Network, rt as Settings, w as Button, yt as createLucideIcon } from "./index-CBmeAG5q.js";
import { t as Badge } from "./badge-BotaLT9k.js";
import { t as EmptyState } from "./empty-state-DM-PkPFf.js";
import { t as Card } from "./card-Be521Qyd.js";
var EllipsisVertical = createLucideIcon("ellipsis-vertical", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "1",
		key: "41hilf"
	}],
	["circle", {
		cx: "12",
		cy: "5",
		r: "1",
		key: "gxeob9"
	}],
	["circle", {
		cx: "12",
		cy: "19",
		r: "1",
		key: "lyex9k"
	}]
]);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function ProjectDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [projects] = useProjectStore_default();
	const [funnels] = useFunnelStore_default();
	const [tasks] = useTaskStore_default();
	const [, setAction] = useQuickActionStore_default();
	const project = projects.find((p) => p.id === id);
	const projectFunnels = funnels.filter((f) => f.projectId === id);
	const projectTasks = tasks.filter((t) => t.projectId === id);
	if (!project) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 text-center text-muted-foreground font-bold",
		children: ["Projeto não encontrado.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "link",
			onClick: () => navigate("/projetos"),
			children: "Voltar para Projetos"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4 text-sm font-bold text-muted-foreground mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/projetos",
						className: "hover:text-foreground flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }), " Projetos"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: project.name
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
							size: 32,
							className: "fill-current opacity-20"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-3xl font-bold tracking-tight text-foreground",
									children: project.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: project.status === "Ativo" ? "bg-success/10 text-success border-none font-bold" : "bg-muted text-muted-foreground border-none font-bold",
									children: project.status
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground text-base max-w-2xl font-medium leading-relaxed",
								children: project.description || "Sem descrição."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-4 text-xs font-bold text-muted-foreground pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { size: 14 }),
										" Criado em",
										" ",
										format(new Date(project.createdAt), "dd/MM/yyyy")
									]
								})
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 shrink-0 w-full md:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => setAction({
							type: "project",
							mode: "edit",
							itemId: project.id
						}),
						className: "flex-1 md:flex-none font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {
							size: 16,
							className: "mr-2"
						}), " Configurações"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setAction({
							type: "canvas",
							mode: "create",
							defaultProjectId: project.id
						}),
						className: "flex-1 md:flex-none font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							size: 16,
							className: "mr-2"
						}), " Novo Funil"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "funnels",
				className: "w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "w-full sm:w-auto grid grid-cols-3 h-auto p-1.5 bg-background rounded-xl border border-border mb-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "funnels",
								className: "text-sm font-bold py-2.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, {
										size: 16,
										className: "mr-2"
									}),
									" Funis (",
									projectFunnels.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "tasks",
								className: "text-sm font-bold py-2.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, {
										size: 16,
										className: "mr-2"
									}),
									" Tarefas (",
									projectTasks.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "docs",
								className: "text-sm font-bold py-2.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
									size: 16,
									className: "mr-2"
								}), " Docs"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "funnels",
						className: "space-y-6 outline-none",
						children: projectFunnels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							icon: Network,
							title: "Nenhum funil neste projeto",
							description: "Crie seu primeiro canvas para desenhar a estratégia deste projeto.",
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => setAction({
									type: "canvas",
									mode: "create",
									defaultProjectId: project.id
								}),
								children: "Criar Primeiro Funil"
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-6 md:grid-cols-2 xl:grid-cols-3",
							children: projectFunnels.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: `/canvas/${f.id}`,
								className: "group",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "p-6 hover-lift border-border bg-card h-full flex flex-col group-hover:border-primary/50 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between mb-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-12 h-12 rounded-xl bg-info/10 text-info flex items-center justify-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { size: 20 })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "font-bold bg-background",
												children: f.status
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors",
											children: f.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-auto pt-4 border-t border-border flex items-center justify-between text-sm font-bold text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [f.nodes.length, " nós"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Atualizado hoje" })]
										})
									]
								})
							}, f.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "tasks",
						className: "outline-none",
						children: projectTasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							icon: SquareCheckBig,
							title: "Nenhuma tarefa",
							description: "Comece a adicionar tarefas para acompanhar o progresso deste projeto.",
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => setAction({
									type: "task",
									mode: "create",
									defaultProjectId: project.id
								}),
								children: "Adicionar Tarefa"
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: projectTasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm hover:border-primary/50 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-3 h-3 rounded-full ${t.status === "Concluída" ? "bg-success" : "bg-warning"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `font-bold text-sm ${t.status === "Concluída" ? "line-through text-muted-foreground" : "text-foreground"}`,
										children: t.title
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "font-bold text-[10px] uppercase",
										children: t.priority
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "text-muted-foreground w-8 h-8 rounded-lg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { size: 16 })
									})]
								})]
							}, t.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "docs",
						className: "outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							icon: FileText,
							title: "Área de Documentos",
							description: "Armazene scripts, copys e referências deste projeto aqui.",
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => setAction({
									type: "document",
									mode: "create",
									defaultProjectId: project.id
								}),
								children: "Criar Documento"
							})
						})
					})
				]
			})
		]
	});
}
export { ProjectDetail as default };

//# sourceMappingURL=ProjectDetail-6Dn4Atl6.js.map