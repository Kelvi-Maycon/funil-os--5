import { a as EllipsisVertical, i as DropdownMenuTrigger, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-CzgVB68K.js";
import { n as FolderPlus } from "./list-DKhAOg2y.js";
import { i as ViewToggle } from "./FolderComponents-0WDnd-Km.js";
import { A as useFunnelStore_default, Ct as House, E as Button, Jt as require_jsx_runtime, L as DialogHeader, M as createStore, N as Dialog, P as DialogContent, Qt as useToast, R as DialogTitle, T as Input, _t as Plus, a as SelectItem, bt as Network, d as useQuickActionStore_default, gt as Search, i as SelectContent, in as require_react, j as useProjectStore_default, o as SelectTrigger, on as __toESM, r as Select, s as SelectValue, tn as useNavigate, u as generateId, wt as Folder } from "./index-D26CbVOK.js";
import { t as Badge } from "./badge-BzGf268W.js";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BDZfNr4e.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CaSLK0aM.js";
import { a as BreadcrumbPage, i as BreadcrumbList, n as BreadcrumbItem, o as BreadcrumbSeparator, r as BreadcrumbLink, t as Breadcrumb } from "./breadcrumb-DrlMzZMX.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var useFunnelFolderStore_default = createStore("funilos_funnel_folders", [{
	id: "ff1",
	name: "Lançamentos",
	parentId: null,
	createdAt: (/* @__PURE__ */ new Date()).toISOString()
}, {
	id: "ff2",
	name: "2026",
	parentId: "ff1",
	createdAt: (/* @__PURE__ */ new Date()).toISOString()
}]);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function FunnelGrid({ folders, funnels, onOpenFolder, onRename, onMove, onDelete }) {
	const [projects] = useProjectStore_default();
	const navigate = useNavigate();
	const getProjectName = (id) => projects.find((p) => p.id === id)?.name || "Nenhum Projeto";
	if (folders.length === 0 && funnels.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-muted-foreground border border-dashed rounded-lg bg-card",
		children: "Esta pasta está vazia"
	});
	const ActionMenu = ({ item, type }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			size: "icon",
			className: "h-8 w-8 text-muted-foreground hover:text-foreground",
			onClick: (e) => e.stopPropagation(),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { size: 16 })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		onClick: (e) => e.stopPropagation(),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
				onClick: (e) => {
					e.stopPropagation();
					onRename({
						id: item.id,
						type,
						name: item.name
					});
				},
				children: type === "folder" ? "Renomear" : "Editar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
				onClick: (e) => {
					e.stopPropagation();
					onMove({
						id: item.id,
						type
					});
				},
				children: "Mover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
				className: "text-destructive",
				onClick: (e) => {
					e.stopPropagation();
					onDelete(item.id, type);
				},
				children: "Excluir"
			})
		]
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
		children: [folders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "relative hover:border-primary/50 cursor-pointer transition-colors",
			onClick: () => onOpenFolder(f.id),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex flex-row items-center gap-3 space-y-0 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-10 h-10 rounded-lg bg-blue-100/50 flex items-center justify-center text-blue-600 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
						size: 20,
						className: "fill-current opacity-20"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base font-medium truncate flex-1 pr-6",
					children: f.name
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-3 right-2 z-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionMenu, {
					item: f,
					type: "folder"
				})
			})]
		}, f.id)), funnels.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "relative hover:border-primary/50 transition-colors flex flex-col cursor-pointer",
			onClick: () => navigate(`/canvas/${f.id}`),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-start gap-3 space-y-0 p-4 pb-2 z-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-lg bg-orange-100/50 flex items-center justify-center text-orange-600 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { size: 20 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col flex-1 overflow-hidden pr-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base font-medium truncate",
							children: f.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground truncate",
							children: getProjectName(f.projectId)
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 pt-2 z-10 flex justify-between items-center mt-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: f.status === "Ativo" ? "bg-green-100 text-green-700 border-green-200" : f.status === "Pausado" ? "bg-amber-100 text-amber-700 border-amber-200" : f.status === "Concluído" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-slate-100 text-slate-600 border-slate-200",
						children: f.status
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: [f.nodes.length, " blocos"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-3 right-2 z-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionMenu, {
						item: f,
						type: "funnel"
					})
				})
			]
		}, f.id))]
	});
}
function FunnelList({ folders, funnels, onOpenFolder, onRename, onMove, onDelete }) {
	const [projects] = useProjectStore_default();
	const navigate = useNavigate();
	const getProjectName = (id) => projects.find((p) => p.id === id)?.name || "Nenhum Projeto";
	if (folders.length === 0 && funnels.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl bg-card",
		children: "Esta pasta está vazia"
	});
	const ActionMenu = ({ item, type }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			size: "icon",
			className: "h-8 w-8 text-muted-foreground hover:text-foreground",
			onClick: (e) => e.stopPropagation(),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { size: 16 })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		onClick: (e) => e.stopPropagation(),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
				onClick: (e) => {
					e.stopPropagation();
					onRename({
						id: item.id,
						type,
						name: item.name
					});
				},
				children: type === "folder" ? "Renomear" : "Editar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
				onClick: (e) => {
					e.stopPropagation();
					onMove({
						id: item.id,
						type
					});
				},
				children: "Mover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
				className: "text-danger",
				onClick: (e) => {
					e.stopPropagation();
					onDelete(item.id, type);
				},
				children: "Excluir"
			})
		]
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border border-border bg-card overflow-hidden shadow-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Nome" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Projeto" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Ações"
			})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [folders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
			className: "hover:bg-[#F9FAFB] cursor-pointer text-base",
			onClick: () => onOpenFolder(f.id),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
					className: "font-semibold flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-lg bg-info-bg flex items-center justify-center text-info shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
							size: 20,
							className: "fill-current opacity-20"
						})
					}), f.name]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-muted-foreground",
					children: "--"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					className: "bg-info-bg text-info-foreground hover:bg-info-bg/80 border-none font-medium",
					children: "Pasta"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionMenu, {
						item: f,
						type: "folder"
					})
				})
			]
		}, f.id)), funnels.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
			className: "hover:bg-[#F9FAFB] cursor-pointer text-base",
			onClick: () => navigate(`/canvas/${f.id}`),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
					className: "font-medium flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-lg bg-orange-100/50 flex items-center justify-center text-orange-600 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { size: 20 })
					}), f.name]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-muted-foreground",
					children: getProjectName(f.projectId)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: f.status === "Ativo" ? "bg-success-bg text-success-foreground border-none font-medium" : "bg-muted text-muted-foreground border-none font-medium",
					children: f.status
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionMenu, {
						item: f,
						type: "funnel"
					})
				})
			]
		}, f.id))] })] })
	});
}
function Funnels() {
	const [funnels, setFunnels] = useFunnelStore_default();
	const [folders, setFolders] = useFunnelFolderStore_default();
	const [projects] = useProjectStore_default();
	const [, setAction] = useQuickActionStore_default();
	const { toast } = useToast();
	const [currentFolderId, setCurrentFolderId] = (0, import_react.useState)(null);
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	const [search, setSearch] = (0, import_react.useState)("");
	const [isCreateFolderOpen, setIsCreateFolderOpen] = (0, import_react.useState)(false);
	const [newFolderName, setNewFolderName] = (0, import_react.useState)("");
	const [renameItem, setRenameItem] = (0, import_react.useState)(null);
	const [moveItem, setMoveItem] = (0, import_react.useState)(null);
	const [targetFolderId, setTargetFolderId] = (0, import_react.useState)("root");
	const currentFolders = (0, import_react.useMemo)(() => {
		const base = folders.filter((f) => f.parentId === currentFolderId);
		if (search) return base.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
		return base;
	}, [
		folders,
		currentFolderId,
		search
	]);
	const currentFunnels = (0, import_react.useMemo)(() => {
		const base = funnels.filter((f) => (f.folderId || null) === currentFolderId);
		if (search) return base.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
		return base;
	}, [
		funnels,
		currentFolderId,
		search
	]);
	const breadcrumbs = (0, import_react.useMemo)(() => {
		const crumbs = [];
		let curr = currentFolderId;
		while (curr) {
			const f = folders.find((folder) => folder.id === curr);
			if (f) {
				crumbs.unshift(f);
				curr = f.parentId;
			} else break;
		}
		return crumbs;
	}, [currentFolderId, folders]);
	const handleCreateFunnel = () => {
		setAction({
			type: "canvas",
			mode: "create"
		});
	};
	const handleCreateFolder = (e) => {
		e.preventDefault();
		if (!newFolderName.trim()) return;
		const newFolder = {
			id: generateId("ff"),
			name: newFolderName,
			parentId: currentFolderId,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		setFolders([...folders, newFolder]);
		setNewFolderName("");
		setIsCreateFolderOpen(false);
		toast({ title: "Pasta criada!" });
	};
	const handleEditItem = (item) => {
		if (item.type === "folder") setRenameItem(item);
		else setAction({
			type: "canvas",
			mode: "edit",
			itemId: item.id
		});
	};
	const handleRenameFolder = (e) => {
		e.preventDefault();
		if (!renameItem || !renameItem.name.trim() || renameItem.type !== "folder") return;
		setFolders(folders.map((f) => f.id === renameItem.id ? {
			...f,
			name: renameItem.name
		} : f));
		setRenameItem(null);
		toast({ title: "Renomeado com sucesso!" });
	};
	const handleDelete = (id, type) => {
		if (type === "folder") {
			const getChildrenIds = (parentId) => {
				const children = folders.filter((f) => f.parentId === parentId).map((f) => f.id);
				return children.reduce((acc, childId) => [...acc, ...getChildrenIds(childId)], children);
			};
			const idsToDelete = [id, ...getChildrenIds(id)];
			setFolders(folders.filter((f) => !idsToDelete.includes(f.id)));
			setFunnels(funnels.map((f) => idsToDelete.includes(f.folderId || "") ? {
				...f,
				folderId: null
			} : f));
		} else setFunnels(funnels.filter((f) => f.id !== id));
		toast({ title: "Excluído com sucesso!" });
	};
	const handleOpenMove = (item) => {
		setMoveItem(item);
		let currentParent = null;
		if (item.type === "folder") {
			const f = folders.find((f$1) => f$1.id === item.id);
			if (f && f.parentId) currentParent = f.parentId;
		} else {
			const f = funnels.find((f$1) => f$1.id === item.id);
			if (f && f.folderId) currentParent = f.folderId;
		}
		setTargetFolderId(currentParent || "root");
	};
	const handleMove = (e) => {
		e.preventDefault();
		if (!moveItem) return;
		const finalTarget = targetFolderId === "root" ? null : targetFolderId;
		if (moveItem.type === "folder") setFolders(folders.map((f) => f.id === moveItem.id ? {
			...f,
			parentId: finalTarget
		} : f));
		else setFunnels(funnels.map((f) => f.id === moveItem.id ? {
			...f,
			folderId: finalTarget
		} : f));
		setMoveItem(null);
		setTargetFolderId("root");
		toast({ title: "Movido com sucesso!" });
	};
	const moveOptions = (0, import_react.useMemo)(() => {
		if (!moveItem) return [];
		const getDescendants = (id) => {
			const children = folders.filter((f) => f.parentId === id).map((f) => f.id);
			return children.reduce((acc, childId) => [...acc, ...getDescendants(childId)], children);
		};
		const invalidIds = moveItem.type === "folder" ? [moveItem.id, ...getDescendants(moveItem.id)] : [];
		return folders.filter((f) => !invalidIds.includes(f.id));
	}, [moveItem, folders]);
	const getFolderPath = (folderId) => {
		if (!folderId) return "Home";
		const path = [];
		let curr = folderId;
		while (curr) {
			const f = folders.find((f$1) => f$1.id === curr);
			if (f) {
				path.unshift(f.name);
				curr = f.parentId;
			} else break;
		}
		return `Home > ${path.join(" > ")}`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-6 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl font-bold tracking-tight text-foreground",
					children: "Canvas de Funis"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewToggle, {
							view: viewMode,
							onChange: setViewMode
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => setIsCreateFolderOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, {
								size: 16,
								className: "mr-2"
							}), " Nova Pasta"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleCreateFunnel,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
								size: 16,
								className: "mr-2"
							}), " Novo Funil"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumb, {
				className: "bg-card px-5 py-3 border border-border rounded-xl shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BreadcrumbList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbLink, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setCurrentFolderId(null),
						className: "flex items-center gap-1 cursor-pointer font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { size: 16 }), " Home"]
					})
				}) }), breadcrumbs.map((crumb, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbSeparator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbItem, { children: idx === breadcrumbs.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbPage, {
					className: "font-semibold",
					children: crumb.name
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbLink, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCurrentFolderId(crumb.id),
						className: "cursor-pointer font-medium",
						children: crumb.name
					})
				}) })] }, crumb.id))] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
					size: 18
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Buscar funis...",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "pl-10 bg-card"
				})]
			}),
			viewMode === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunnelGrid, {
				folders: currentFolders,
				funnels: currentFunnels,
				onOpenFolder: setCurrentFolderId,
				onRename: handleEditItem,
				onMove: handleOpenMove,
				onDelete: handleDelete
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunnelList, {
				folders: currentFolders,
				funnels: currentFunnels,
				onOpenFolder: setCurrentFolderId,
				onRename: handleEditItem,
				onMove: handleOpenMove,
				onDelete: handleDelete
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isCreateFolderOpen,
				onOpenChange: setIsCreateFolderOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Nova Pasta" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleCreateFolder,
					className: "space-y-4 pt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Nome da pasta",
						value: newFolderName,
						onChange: (e) => setNewFolderName(e.target.value),
						autoFocus: true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						children: "Criar Pasta"
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!renameItem,
				onOpenChange: (open) => !open && setRenameItem(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Renomear Pasta" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleRenameFolder,
					className: "space-y-4 pt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Novo nome",
						value: renameItem?.name || "",
						onChange: (e) => renameItem && setRenameItem({
							...renameItem,
							name: e.target.value
						}),
						autoFocus: true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						children: "Salvar"
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!moveItem,
				onOpenChange: (open) => !open && setMoveItem(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Mover ", moveItem?.type === "folder" ? "Pasta" : "Funil"] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleMove,
					className: "space-y-4 pt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: targetFolderId || "root",
						onValueChange: setTargetFolderId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione o destino" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "root",
							children: "Home (Raiz)"
						}), moveOptions.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: f.id,
							children: getFolderPath(f.id)
						}, f.id))] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						children: "Mover"
					})]
				})] })
			})
		]
	});
}
export { Funnels as default };

//# sourceMappingURL=Funnels-S3uZWKlu.js.map