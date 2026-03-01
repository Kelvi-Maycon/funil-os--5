import { a as EllipsisVertical, i as DropdownMenuTrigger, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-CzgVB68K.js";
import { n as Image, r as ExternalLink, t as useResourceStore_default } from "./useResourceStore-I6An2X6I.js";
import { n as FolderPlus, t as List } from "./list-DKhAOg2y.js";
import { t as Trash2 } from "./trash-2-pWUrSV2v.js";
import { E as Button, Jt as require_jsx_runtime, L as DialogHeader, M as createStore, N as Dialog, P as DialogContent, Pt as createLucideIcon, Qt as useToast, R as DialogTitle, T as Input, _t as Plus, ft as cn, gt as Search, in as require_react, n as Textarea, on as __toESM, u as generateId, wt as Folder } from "./index-D26CbVOK.js";
import { t as Badge } from "./badge-BzGf268W.js";
import { n as CardContent, t as Card } from "./card-BDZfNr4e.js";
var Copy = createLucideIcon("copy", [["rect", {
	width: "14",
	height: "14",
	x: "8",
	y: "8",
	rx: "2",
	ry: "2",
	key: "17jyea"
}], ["path", {
	d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
	key: "zix9uf"
}]]);
var FileUp = createLucideIcon("file-up", [
	["path", {
		d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
		key: "1oefj6"
	}],
	["path", {
		d: "M14 2v5a1 1 0 0 0 1 1h5",
		key: "wfsgrz"
	}],
	["path", {
		d: "M12 12v6",
		key: "3ahymv"
	}],
	["path", {
		d: "m15 15-3-3-3 3",
		key: "15xj92"
	}]
]);
var Grid3x3 = createLucideIcon("grid-3x3", [
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}],
	["path", {
		d: "M3 9h18",
		key: "1pudct"
	}],
	["path", {
		d: "M3 15h18",
		key: "5xshup"
	}],
	["path", {
		d: "M9 3v18",
		key: "fh3hqa"
	}],
	["path", {
		d: "M15 3v18",
		key: "14nvp0"
	}]
]);
var Link2 = createLucideIcon("link-2", [
	["path", {
		d: "M9 17H7A5 5 0 0 1 7 7h2",
		key: "8i5ue5"
	}],
	["path", {
		d: "M15 7h2a5 5 0 1 1 0 10h-2",
		key: "1b9ql8"
	}],
	["line", {
		x1: "8",
		x2: "16",
		y1: "12",
		y2: "12",
		key: "1jonct"
	}]
]);
var PinOff = createLucideIcon("pin-off", [
	["path", {
		d: "M12 17v5",
		key: "bb1du9"
	}],
	["path", {
		d: "M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89",
		key: "znwnzq"
	}],
	["path", {
		d: "m2 2 20 20",
		key: "1ooewy"
	}],
	["path", {
		d: "M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11",
		key: "c9qhm2"
	}]
]);
var Pin = createLucideIcon("pin", [["path", {
	d: "M12 17v5",
	key: "bb1du9"
}], ["path", {
	d: "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",
	key: "1nkz8b"
}]]);
var StickyNote = createLucideIcon("sticky-note", [["path", {
	d: "M21 9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z",
	key: "1dfntj"
}], ["path", {
	d: "M15 3v5a1 1 0 0 0 1 1h5",
	key: "6s6qgf"
}]]);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var useResourceFolderStore_default = createStore("funilos_resource_folders", []);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var TYPE_CONFIG = {
	image: {
		label: "Imagem",
		icon: Image,
		bg: "bg-purple-100 text-purple-700"
	},
	link: {
		label: "Link",
		icon: Link2,
		bg: "bg-blue-100 text-blue-700"
	},
	note: {
		label: "Nota",
		icon: StickyNote,
		bg: "bg-amber-100 text-amber-700"
	},
	file: {
		label: "Arquivo",
		icon: FileUp,
		bg: "bg-green-100 text-green-700"
	}
};
function Library() {
	const [resources, setResources] = useResourceStore_default();
	const [folders, setFolders] = useResourceFolderStore_default();
	const { toast } = useToast();
	const [search, setSearch] = (0, import_react.useState)("");
	const [filterType, setFilterType] = (0, import_react.useState)(null);
	const [currentFolderId, setCurrentFolderId] = (0, import_react.useState)(null);
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [addType, setAddType] = (0, import_react.useState)("note");
	const [addTitle, setAddTitle] = (0, import_react.useState)("");
	const [addContent, setAddContent] = (0, import_react.useState)("");
	const [addTags, setAddTags] = (0, import_react.useState)("");
	const [folderOpen, setFolderOpen] = (0, import_react.useState)(false);
	const [folderName, setFolderName] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			const activeEl = document.activeElement;
			if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.contentEditable === "true")) return;
			const items = e.clipboardData?.items;
			if (!items) return;
			for (const item of Array.from(items)) if (item.type.startsWith("image/")) {
				const file = item.getAsFile();
				if (!file) continue;
				const reader = new FileReader();
				reader.onloadend = () => {
					const dataUrl = reader.result;
					setResources([{
						id: generateId("res"),
						type: "image",
						title: `Imagem colada ${(/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR")}`,
						content: dataUrl,
						tags: ["colado"],
						folderId: currentFolderId,
						isPinned: false,
						createdAt: (/* @__PURE__ */ new Date()).toISOString()
					}, ...resources]);
					toast({ title: "📋 Imagem colada com sucesso!" });
				};
				reader.readAsDataURL(file);
				return;
			}
			const text = e.clipboardData?.getData("text/plain");
			if (text) try {
				new URL(text);
				setResources([{
					id: generateId("res"),
					type: "link",
					title: text.replace(/^https?:\/\//, "").split("/")[0],
					content: text,
					tags: ["colado"],
					folderId: currentFolderId,
					isPinned: false,
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				}, ...resources]);
				toast({ title: "🔗 Link colado com sucesso!" });
			} catch {
				setResources([{
					id: generateId("res"),
					type: "note",
					title: text.slice(0, 50) + (text.length > 50 ? "..." : ""),
					content: text,
					tags: ["colado"],
					folderId: currentFolderId,
					isPinned: false,
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				}, ...resources]);
				toast({ title: "📝 Nota colada com sucesso!" });
			}
		};
		window.addEventListener("paste", handler);
		return () => window.removeEventListener("paste", handler);
	}, [resources, currentFolderId]);
	const currentFolders = (0, import_react.useMemo)(() => {
		let f = folders.filter((f$1) => f$1.parentId === currentFolderId);
		if (search) f = f.filter((f$1) => f$1.name.toLowerCase().includes(search.toLowerCase()));
		return f;
	}, [
		folders,
		currentFolderId,
		search
	]);
	const filteredResources = (0, import_react.useMemo)(() => {
		let list = resources.filter((r) => (r.folderId || null) === currentFolderId);
		if (search) list = list.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()) || r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));
		if (filterType) list = list.filter((r) => r.type === filterType);
		return list.sort((a, b) => {
			if (a.isPinned && !b.isPinned) return -1;
			if (!a.isPinned && b.isPinned) return 1;
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		});
	}, [
		resources,
		currentFolderId,
		search,
		filterType
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
	const addResource = (e) => {
		e.preventDefault();
		if (!addTitle.trim()) return;
		setResources([{
			id: generateId("res"),
			type: addType,
			title: addTitle.trim(),
			content: addContent.trim(),
			tags: addTags.split(",").map((t) => t.trim()).filter(Boolean),
			folderId: currentFolderId,
			isPinned: false,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}, ...resources]);
		setAddTitle("");
		setAddContent("");
		setAddTags("");
		setAddOpen(false);
	};
	const createFolder = (e) => {
		e.preventDefault();
		if (!folderName.trim()) return;
		setFolders([...folders, {
			id: generateId("rf"),
			name: folderName.trim(),
			parentId: currentFolderId,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}]);
		setFolderName("");
		setFolderOpen(false);
	};
	const togglePin = (id) => {
		setResources(resources.map((r) => r.id === id ? {
			...r,
			isPinned: !r.isPinned
		} : r));
	};
	const deleteResource = (id) => {
		setResources(resources.filter((r) => r.id !== id));
	};
	const deleteFolder = (id) => {
		setFolders(folders.filter((f) => f.id !== id));
		setResources(resources.map((r) => r.folderId === id ? {
			...r,
			folderId: currentFolderId
		} : r));
	};
	const handleFileDrop = (e) => {
		e.preventDefault();
		const files = Array.from(e.dataTransfer.files);
		files.forEach((file) => {
			if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onloadend = () => {
					const newRes = {
						id: generateId("res"),
						type: "image",
						title: file.name,
						content: reader.result,
						tags: ["upload"],
						folderId: currentFolderId,
						isPinned: false,
						createdAt: (/* @__PURE__ */ new Date()).toISOString()
					};
					setResources((prev) => [newRes, ...prev]);
				};
				reader.readAsDataURL(file);
			} else {
				const newRes = {
					id: generateId("res"),
					type: "file",
					title: file.name,
					content: `Arquivo: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
					tags: ["upload"],
					folderId: currentFolderId,
					isPinned: false,
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				};
				setResources((prev) => [newRes, ...prev]);
			}
		});
		toast({ title: `📁 ${files.length} arquivo(s) adicionado(s)!` });
	};
	const ResourceCard = ({ r }) => {
		const cfg = TYPE_CONFIG[r.type];
		const Icon = cfg.icon;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: cn("group relative overflow-hidden transition-all hover:shadow-md cursor-default", r.isPinned && "ring-1 ring-amber-300/50"),
			children: [r.type === "image" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-32 bg-muted overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: r.content,
					alt: r.title,
					className: "w-full h-full object-cover",
					onError: (e) => e.currentTarget.style.display = "none"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: cn("p-4 space-y-2", r.type === "image" ? "" : "pt-4"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: cn("shrink-0 text-[10px] px-1.5 py-0", cfg.bg),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									size: 10,
									className: "mr-1"
								}), cfg.label]
							}), r.isPinned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
								size: 12,
								className: "text-amber-500 shrink-0"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { size: 14 })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onClick: () => togglePin(r.id),
									children: r.isPinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinOff, {
										size: 14,
										className: "mr-2"
									}), " Desafixar"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
										size: 14,
										className: "mr-2"
									}), " Fixar"] })
								}),
								r.type === "link" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => window.open(r.content, "_blank"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
										size: 14,
										className: "mr-2"
									}), " Abrir Link"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => {
										navigator.clipboard.writeText(r.content);
										toast({ title: "Copiado!" });
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
										size: 14,
										className: "mr-2"
									}), " Copiar"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									className: "text-destructive",
									onClick: () => deleteResource(r.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
										size: 14,
										className: "mr-2"
									}), " Excluir"]
								})
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-foreground truncate",
						children: r.title
					}),
					r.type !== "image" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground line-clamp-2",
						children: r.content
					}),
					r.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1 pt-1",
						children: r.tags.slice(0, 3).map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full",
							children: tag
						}, tag))
					})
				]
			})]
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-6 animate-fade-in",
		onDragOver: (e) => e.preventDefault(),
		onDrop: handleFileDrop,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl font-bold tracking-tight text-foreground",
					children: "Biblioteca"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Cole (Ctrl+V) imagens, links ou textos a qualquer momento • Arraste arquivos para cá"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => setFolderOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, {
							size: 16,
							className: "mr-2"
						}), " Nova Pasta"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "dark",
						onClick: () => setAddOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							size: 16,
							className: "mr-2"
						}), " Adicionar"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 text-sm shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCurrentFolderId(null),
							className: cn("hover:underline font-medium", !currentFolderId ? "text-primary" : "text-muted-foreground"),
							children: "Home"
						}), breadcrumbs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "/"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCurrentFolderId(f.id),
								className: "hover:underline text-muted-foreground font-medium",
								children: f.name
							})]
						}, f.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full sm:max-w-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
							size: 16
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Buscar recursos...",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							className: "pl-9 bg-card"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-0.5 border rounded-lg p-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: viewMode === "grid" ? "default" : "ghost",
							size: "icon",
							className: "h-7 w-7",
							onClick: () => setViewMode("grid"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { size: 14 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: viewMode === "list" ? "default" : "ghost",
							size: "icon",
							className: "h-7 w-7",
							onClick: () => setViewMode("list"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { size: 14 })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setFilterType(null),
					className: cn("text-xs px-3 py-1.5 rounded-full border transition-colors font-medium", !filterType ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/50"),
					children: [
						"Todos (",
						resources.filter((r) => (r.folderId || null) === currentFolderId).length,
						")"
					]
				}), Object.keys(TYPE_CONFIG).map((type) => {
					const cfg = TYPE_CONFIG[type];
					const count = resources.filter((r) => r.type === type && (r.folderId || null) === currentFolderId).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setFilterType(filterType === type ? null : type),
						className: cn("text-xs px-3 py-1.5 rounded-full border transition-colors font-medium flex items-center gap-1.5", filterType === type ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/50"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(cfg.icon, { size: 12 }),
							" ",
							cfg.label,
							" (",
							count,
							")"
						]
					}, type);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn(viewMode === "grid" ? "grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "flex flex-col gap-2"),
				children: [currentFolders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "group relative hover:border-primary/50 cursor-pointer transition-colors",
					onClick: () => setCurrentFolderId(f.id),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4 flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 rounded-lg bg-blue-100/50 flex items-center justify-center text-blue-600 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
									size: 20,
									className: "fill-current opacity-20"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-sm truncate flex-1",
								children: f.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "h-7 w-7 opacity-0 group-hover:opacity-100",
									onClick: (e) => e.stopPropagation(),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { size: 14 })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
								align: "end",
								onClick: (e) => e.stopPropagation(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									className: "text-destructive",
									onClick: () => deleteFolder(f.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
										size: 14,
										className: "mr-2"
									}), " Excluir pasta"]
								})
							})] })
						]
					})
				}, f.id)), filteredResources.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceCard, { r }, r.id))]
			}),
			currentFolders.length === 0 && filteredResources.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-16 text-center border border-dashed rounded-xl bg-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-4xl mb-3",
						children: "📋"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground font-medium",
						children: "Nenhum recurso ainda"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1",
						children: "Cole algo (Ctrl+V), arraste um arquivo, ou clique em \"Adicionar\""
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: addOpen,
				onOpenChange: setAddOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Adicionar Recurso" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: addResource,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-2",
								children: Object.keys(TYPE_CONFIG).map((type) => {
									const cfg = TYPE_CONFIG[type];
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setAddType(type),
										className: cn("flex-1 py-2 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-colors", addType === type ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/50"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(cfg.icon, { size: 16 }), cfg.label]
									}, type);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Título",
								value: addTitle,
								onChange: (e) => setAddTitle(e.target.value),
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								placeholder: addType === "image" ? "Cole a URL da imagem..." : addType === "link" ? "https://..." : addType === "note" ? "Escreva sua nota, insight ou swipe..." : "Descrição do arquivo...",
								value: addContent,
								onChange: (e) => setAddContent(e.target.value),
								rows: 4
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Tags (separadas por vírgula)",
								value: addTags,
								onChange: (e) => setAddTags(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full",
								children: "Adicionar"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: folderOpen,
				onOpenChange: setFolderOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Nova Pasta" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: createFolder,
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Nome da pasta",
							value: folderName,
							onChange: (e) => setFolderName(e.target.value),
							required: true,
							autoFocus: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							children: "Criar"
						})]
					})]
				})
			})
		]
	});
}
export { Library as default };

//# sourceMappingURL=Library-CJC1eUL9.js.map