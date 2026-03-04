import { t as CanvasBoard } from "./CanvasBoard-Bm0oRq8e.js";
import { n as TasksBoard, t as TaskDetailSheet } from "./TaskDetailSheet-D0_oCjnS.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CctlRPcX.js";
import { A as useProjectStore_default, D as useDocumentStore_default, Ft as useParams, Lt as require_react, Mt as Link, O as useTaskStore_default, Ot as require_jsx_runtime, Pt as useNavigate, T as Button, at as SquareCheckBig, ct as Network, d as useQuickActionStore_default, ft as FileText, ht as Check, k as useFunnelStore_default, m as format, rt as X, st as Plus, vt as createLucideIcon, w as Input, zt as __toESM } from "./index-C59AXJt2.js";
import { t as Badge } from "./badge-E-XZ20H7.js";
import "./ConfirmDialog-C-h31MzG.js";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BdPGic5X.js";
import { t as EmptyState } from "./empty-state-BRNxdKNW.js";
import { a as BreadcrumbPage, i as BreadcrumbList, n as BreadcrumbItem, o as BreadcrumbSeparator, r as BreadcrumbLink, t as Breadcrumb } from "./breadcrumb-Bayx2tHs.js";
var Pencil = createLucideIcon("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function ProjectDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [projects, setProjects] = useProjectStore_default();
	const [funnels, setFunnels] = useFunnelStore_default();
	const [tasks, setTasks] = useTaskStore_default();
	const [docs] = useDocumentStore_default();
	const [, setAction] = useQuickActionStore_default();
	const [selectedTask, setSelectedTask] = (0, import_react.useState)(null);
	const [selectedFunnelId, setSelectedFunnelId] = (0, import_react.useState)(null);
	const [isEditingName, setIsEditingName] = (0, import_react.useState)(false);
	const [editName, setEditName] = (0, import_react.useState)("");
	const project = projects.find((p) => p.id === id);
	const projectFunnels = (0, import_react.useMemo)(() => funnels.filter((f) => f.projectId === id), [funnels, id]);
	const projectTasks = (0, import_react.useMemo)(() => tasks.filter((t) => t.projectId === id), [tasks, id]);
	const projectDocs = (0, import_react.useMemo)(() => docs.filter((d) => d.projectId === id), [docs, id]);
	if (!project) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-muted-foreground",
		children: "Projeto não encontrado"
	});
	const completedTasks = projectTasks.filter((t) => t.status === "Concluído").length;
	const totalTasks = projectTasks.length;
	const updateTask = (taskId, updates) => {
		setTasks(tasks.map((t) => t.id === taskId ? {
			...t,
			...updates
		} : t));
	};
	const updateFunnel = (updated) => {
		setFunnels(funnels.map((f) => f.id === updated.id ? updated : f));
	};
	const startEditName = () => {
		setEditName(project.name);
		setIsEditingName(true);
	};
	const saveName = () => {
		if (editName.trim()) setProjects(projects.map((p) => p.id === id ? {
			...p,
			name: editName.trim()
		} : p));
		setIsEditingName(false);
	};
	const cancelEditName = () => {
		setIsEditingName(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "funnels",
		className: "flex flex-col h-full bg-background overflow-hidden animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col p-6 md:p-8 shrink-0 z-10 relative",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-[1600px] w-full mx-auto flex flex-col gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumb, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BreadcrumbList, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbLink, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/projetos",
									className: "text-base font-medium",
									children: "Projetos"
								})
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbItem, { children: isEditingName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: editName,
										onChange: (e) => setEditName(e.target.value),
										className: "h-10 w-64 text-3xl font-bold tracking-tight px-2",
										autoFocus: true,
										onKeyDown: (e) => {
											if (e.key === "Enter") saveName();
											if (e.key === "Escape") cancelEditName();
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-8 w-8",
										onClick: saveName,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-8 w-8",
										onClick: cancelEditName,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16 })
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BreadcrumbPage, {
								className: "font-bold text-3xl tracking-tight text-foreground group cursor-pointer flex items-center gap-2",
								onClick: startEditName,
								children: [project.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
									size: 16,
									className: "opacity-0 group-hover:opacity-50 transition-opacity text-muted-foreground"
								})]
							}) })
						] }) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "bg-card gap-1 p-1.5 rounded-lg flex flex-wrap justify-start border border-border inline-flex h-auto shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "funnels",
									className: "rounded-md px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground font-semibold transition-all text-base",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, {
										size: 16,
										className: "mr-2"
									}), " Funnels"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "tasks",
									className: "rounded-md px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground font-semibold transition-all text-base",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, {
										size: 16,
										className: "mr-2"
									}), " Tasks"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "documents",
									className: "rounded-md px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground font-semibold transition-all text-base",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
										size: 16,
										className: "mr-2"
									}), " Documents"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-6 bg-card py-3 px-6 rounded-xl border border-border shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col pr-6 border-r border-border last:border-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1",
										children: "Funis"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl font-bold text-foreground leading-none",
										children: projectFunnels.length
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col px-6 border-r border-border last:border-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1",
										children: "Tasks"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xl font-bold text-foreground leading-none",
										children: [
											completedTasks,
											"/",
											totalTasks
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col pl-6 border-r border-border last:border-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1",
										children: "Docs"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl font-bold text-foreground leading-none",
										children: projectDocs.length
									})]
								})
							]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto overflow-x-hidden p-6 pt-0 md:p-8 md:pt-0 bg-background relative flex flex-col min-h-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "funnels",
						className: "flex-1 m-0 data-[state=active]:flex flex-col border-none outline-none",
						children: !selectedFunnelId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col flex-1 max-w-[1600px] mx-auto w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center mb-6 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-2xl font-bold text-foreground",
									children: "Funis do Projeto"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setAction({
										type: "canvas",
										mode: "create",
										defaultProjectId: id
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
										size: 16,
										className: "mr-2"
									}), " Novo Funil"]
								})]
							}), projectFunnels.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
								children: projectFunnels.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "cursor-pointer hover-lift group overflow-hidden flex flex-col",
									onClick: () => setSelectedFunnelId(f.id),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "h-36 bg-card border-b border-border relative shrink-0",
											style: {
												backgroundImage: "radial-gradient(hsl(var(--border)) 1px, transparent 0)",
												backgroundSize: "16px 16px"
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/60 backdrop-blur-sm z-10",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "dark",
													className: "pointer-events-none",
													children: "Abrir Canvas"
												})
											}), f.nodes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "absolute inset-0 flex items-center justify-center opacity-30 scale-75",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, {
													size: 64,
													className: "text-muted-foreground"
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
											className: "p-6 pb-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
												className: "line-clamp-1 text-xl",
												children: f.name
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-6 pt-2 flex justify-between items-center flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-base text-muted-foreground",
												children: [f.nodes.length, " blocos"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "bg-muted text-muted-foreground border-none font-medium",
												children: f.status
											})]
										})
									]
								}, f.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								icon: Network,
								title: "Nenhum funil encontrado",
								description: "Comece mapeando a jornada do seu cliente. Crie o primeiro funil para este projeto.",
								action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setAction({
										type: "canvas",
										mode: "create",
										defaultProjectId: id
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
										size: 16,
										className: "mr-2"
									}), " Novo Funil"]
								})
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 relative rounded-xl border border-border overflow-hidden bg-background shadow-sm flex flex-col min-h-[600px] -mx-2 sm:mx-0 max-w-[1600px] mx-auto w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CanvasBoard, {
								funnel: projectFunnels.find((f) => f.id === selectedFunnelId),
								onChange: updateFunnel,
								hideHeader: true,
								onBack: () => setSelectedFunnelId(null)
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "tasks",
						className: "flex-1 m-0 data-[state=active]:flex flex-col border-none outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col flex-1 max-w-[1600px] mx-auto w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center mb-6 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-2xl font-bold text-foreground",
									children: "Tarefas"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setAction({
										type: "task",
										mode: "create",
										defaultProjectId: id
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
										size: 16,
										className: "mr-2"
									}), " Nova Tarefa"]
								})]
							}), projectTasks.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 overflow-hidden min-h-[500px] -mx-4 px-4 sm:mx-0 sm:px-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TasksBoard, {
									tasks: projectTasks,
									updateTask,
									onCardClick: setSelectedTask
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								icon: SquareCheckBig,
								title: "Nenhuma tarefa",
								description: "Organize as entregas do projeto criando tarefas para sua equipe.",
								action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setAction({
										type: "task",
										mode: "create",
										defaultProjectId: id
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
										size: 16,
										className: "mr-2"
									}), " Nova Tarefa"]
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "documents",
						className: "flex-1 m-0 data-[state=active]:flex flex-col border-none outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col flex-1 max-w-[1600px] mx-auto w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center mb-6 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-2xl font-bold text-foreground",
									children: "Documentos"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setAction({
										type: "document",
										mode: "create",
										defaultProjectId: id
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
										size: 16,
										className: "mr-2"
									}), " Novo Documento"]
								})]
							}), projectDocs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
								children: projectDocs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "cursor-pointer hover-lift group flex flex-col",
									onClick: () => navigate("/documentos"),
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
											className: "text-base text-muted-foreground line-clamp-2",
											children: d.content.replace(/<[^>]*>?/gm, "") || "Documento vazio"
										})]
									})]
								}, d.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								icon: FileText,
								title: "Nenhum documento",
								description: "Crie briefings, roteiros e textos centralizados neste projeto.",
								action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setAction({
										type: "document",
										mode: "create",
										defaultProjectId: id
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
										size: 16,
										className: "mr-2"
									}), " Novo Documento"]
								})
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskDetailSheet, {
				task: selectedTask,
				onClose: () => setSelectedTask(null),
				onUpdate: updateTask
			})
		]
	});
}
export { ProjectDetail as default };

//# sourceMappingURL=ProjectDetail-JeIaSMmM.js.map