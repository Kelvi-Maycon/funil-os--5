import { i as ViewToggle, n as FolderBreadcrumbs, r as MoveDialog, t as CreateFolderDialog } from "./FolderComponents-BkH-MEAD.js";
import { t as Trash2 } from "./trash-2-CuduQ2jc.js";
import { A as useFunnelStore_default, E as Button, Jt as require_jsx_runtime, L as DialogHeader, N as Dialog, O as useDocumentStore_default, P as DialogContent, Qt as useToast, R as DialogTitle, T as Input, _t as Plus, gt as Search, in as require_react, j as useProjectStore_default, k as useTaskStore_default, on as __toESM, tn as useNavigate, u as generateId, wt as Folder, z as DialogTrigger } from "./index-BBQ0CWHy.js";
import { t as Badge } from "./badge-DCdqCiWu.js";
import { t as ConfirmDialog } from "./ConfirmDialog-CKn8aREZ.js";
import { t as useFolderStore_default } from "./useFolderStore-B5wMy0Mu.js";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-D1b0ahcN.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C1CXOUul.js";
import "./breadcrumb-CxbOsWWf.js";
import { t as EmptyState } from "./empty-state-lPQ62j68.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function Projects() {
	const [projects, setProjects] = useProjectStore_default();
	const [allFolders, setFolders] = useFolderStore_default();
	const [search, setSearch] = (0, import_react.useState)("");
	const [view, setView] = (0, import_react.useState)("grid");
	const [currentFolderId, setCurrentFolderId] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [newName, setNewName] = (0, import_react.useState)("");
	const [projectToDelete, setProjectToDelete] = (0, import_react.useState)(null);
	const [tasks, setTasks] = useTaskStore_default();
	const [funnels, setFunnels] = useFunnelStore_default();
	const [docs, setDocs] = useDocumentStore_default();
	const { toast } = useToast();
	const navigate = useNavigate();
	const moduleFolders = allFolders.filter((f) => f.module === "project");
	const currentFolders = moduleFolders.filter((f) => {
		if (search) return f.name.toLowerCase().includes(search.toLowerCase());
		return f.parentId === currentFolderId;
	});
	const filteredProjects = projects.filter((p) => {
		if (search) return p.name.toLowerCase().includes(search.toLowerCase());
		return (p.folderId || null) === currentFolderId;
	});
	const handleCreateFolder = (name) => {
		setFolders([...allFolders, {
			id: generateId("f"),
			module: "project",
			name,
			parentId: currentFolderId,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}]);
		toast({ title: "Pasta criada com sucesso!" });
	};
	const handleCreateProject = (e) => {
		e.preventDefault();
		if (!newName.trim()) return;
		const newProject = {
			id: generateId("p"),
			name: newName,
			description: "Sem descrição",
			status: "Ativo",
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			folderId: currentFolderId
		};
		setProjects([...projects, newProject]);
		setNewName("");
		setOpen(false);
		toast({ title: "Projeto criado com sucesso!" });
	};
	const updateProjectFolder = (id, folderId) => {
		setProjects(projects.map((p) => p.id === id ? {
			...p,
			folderId
		} : p));
		toast({ title: "Projeto movido com sucesso!" });
	};
	const handleDeleteProject = () => {
		if (!projectToDelete) return;
		const id = projectToDelete;
		setTasks(tasks.filter((t) => t.projectId !== id));
		setFunnels(funnels.filter((f) => f.projectId !== id));
		setDocs(docs.filter((d) => d.projectId !== id));
		setProjects(projects.filter((p) => p.id !== id));
		setProjectToDelete(null);
		toast({ title: "Projeto e itens vinculados excluídos!" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-6 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold tracking-tight text-foreground",
						children: "Projetos"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderBreadcrumbs, {
						currentFolderId,
						folders: moduleFolders,
						onNavigate: setCurrentFolderId,
						rootName: "Workspace"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewToggle, {
							view,
							onChange: setView
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateFolderDialog, { onConfirm: handleCreateFolder }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
							open,
							onOpenChange: setOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
									size: 16,
									className: "mr-2"
								}), " Novo Projeto"] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Criar Novo Projeto" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleCreateProject,
								className: "space-y-4 pt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Nome do Projeto",
									value: newName,
									onChange: (e) => setNewName(e.target.value),
									autoFocus: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "w-full",
									children: "Criar Projeto"
								})]
							})] })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-md mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
					size: 18
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Buscar projetos...",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "pl-10"
				})]
			}),
			currentFolders.length === 0 && filteredProjects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: Folder,
				title: "Vazio",
				description: "Crie um projeto ou uma pasta para começar a organizar seu trabalho.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						size: 16,
						className: "mr-2"
					}), " Criar Primeiro Projeto"]
				})
			}) : view === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: [currentFolders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					onClick: () => setCurrentFolderId(f.id),
					className: "hover-lift cursor-pointer h-full group flex items-center p-6 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
							size: 24,
							className: "fill-current opacity-50"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-lg group-hover:text-primary transition-colors",
						children: f.name
					})]
				}, f.id)), filteredProjects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					onClick: () => navigate(`/projetos/${p.id}`),
					className: "hover-lift cursor-pointer h-full group flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-4 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-xl group-hover:text-primary transition-colors line-clamp-1",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: p.status === "Ativo" ? "bg-success/10 text-success border-none" : "bg-muted text-muted-foreground border-none",
									children: p.status
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: (e) => {
										e.preventDefault();
										e.stopPropagation();
									},
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveDialog, {
										folders: moduleFolders,
										currentFolderId: p.folderId,
										onMove: (id) => updateProjectFolder(p.id, id)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full",
										onClick: () => setProjectToDelete(p.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 16 })
									})]
								})]
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base text-muted-foreground line-clamp-2",
						children: p.description
					}) })]
				}, p.id))]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-card border rounded-xl overflow-hidden shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Nome" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Ações" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [currentFolders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					onClick: () => setCurrentFolderId(f.id),
					className: "cursor-pointer group",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "font-medium flex items-center gap-3 py-4 text-base",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
								className: "text-primary opacity-50 group-hover:opacity-100 transition-colors",
								size: 20
							}), f.name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {})
					]
				}, f.id)), filteredProjects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					onClick: () => navigate(`/projetos/${p.id}`),
					className: "cursor-pointer text-base",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium py-4",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: p.status === "Ativo" ? "bg-success/10 text-success border-none" : "bg-muted text-muted-foreground border-none",
							children: p.status
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: (e) => {
								e.preventDefault();
								e.stopPropagation();
							},
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveDialog, {
								folders: moduleFolders,
								currentFolderId: p.folderId,
								onMove: (id) => updateProjectFolder(p.id, id)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full",
								onClick: () => setProjectToDelete(p.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 16 })
							})]
						}) })
					]
				}, p.id))] })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!projectToDelete,
				onOpenChange: (open$1) => !open$1 && setProjectToDelete(null),
				title: "Excluir Projeto?",
				description: "Esta ação é irreversível. O projeto e todos os funis, tarefas e documentos vinculados a ele serão excluídos permanentemente.",
				confirmLabel: "Excluir",
				variant: "destructive",
				onConfirm: handleDeleteProject
			})
		]
	});
}
export { Projects as default };

//# sourceMappingURL=Projects-BDWdqr6U.js.map