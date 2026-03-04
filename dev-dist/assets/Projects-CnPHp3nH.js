import { i as Trash2, n as Root$1, r as createRovingFocusGroupScope, t as Item } from "./dist-CGT36Zh6.js";
import { A as useDocumentStore_default, B as DialogTitle, Ct as cva, D as Input, F as Dialog, Ft as composeEventHandlers, Gt as __toESM, Ht as require_react, I as DialogContent, It as useToast, L as DialogDescription, M as useFunnelStore_default, Mt as createContextScope, N as useProjectStore_default, Nt as require_jsx_runtime, O as Button, P as createStore, St as createLucideIcon, Tt as useControllableState, V as DialogTrigger, at as cn, c as SelectItem, dt as Plus, f as useDirection, ht as Folder, j as useTaskStore_default, kt as Primitive, l as SelectTrigger, o as Select, p as generateId, s as SelectContent, u as SelectValue, ut as Search, z as DialogHeader, zt as useNavigate } from "./index-EdMs8eqF.js";
import { t as Badge } from "./badge-CeYKpMjG.js";
import { t as ConfirmDialog } from "./ConfirmDialog-B3Ds-W27.js";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-CAeBHRFd.js";
import { t as EmptyState } from "./empty-state-B2I3dmbm.js";
import { a as BreadcrumbPage, i as BreadcrumbList, n as BreadcrumbItem, o as BreadcrumbSeparator, r as BreadcrumbLink, t as Breadcrumb } from "./breadcrumb-DxlHfK8P.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-xDuRpCxh.js";
var FolderPlus = createLucideIcon("folder-plus", [
	["path", {
		d: "M12 10v6",
		key: "1bos4e"
	}],
	["path", {
		d: "M9 13h6",
		key: "1uhe8q"
	}],
	["path", {
		d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
		key: "1kt360"
	}]
]);
var LayoutGrid = createLucideIcon("layout-grid", [
	["rect", {
		width: "7",
		height: "7",
		x: "3",
		y: "3",
		rx: "1",
		key: "1g98yp"
	}],
	["rect", {
		width: "7",
		height: "7",
		x: "14",
		y: "3",
		rx: "1",
		key: "6d4xhi"
	}],
	["rect", {
		width: "7",
		height: "7",
		x: "14",
		y: "14",
		rx: "1",
		key: "nxv5o0"
	}],
	["rect", {
		width: "7",
		height: "7",
		x: "3",
		y: "14",
		rx: "1",
		key: "1bb6yr"
	}]
]);
var List = createLucideIcon("list", [
	["path", {
		d: "M3 5h.01",
		key: "18ugdj"
	}],
	["path", {
		d: "M3 12h.01",
		key: "nlz23k"
	}],
	["path", {
		d: "M3 19h.01",
		key: "noohij"
	}],
	["path", {
		d: "M8 5h13",
		key: "1pao27"
	}],
	["path", {
		d: "M8 12h13",
		key: "1za7za"
	}],
	["path", {
		d: "M8 19h13",
		key: "m83p4d"
	}]
]);
var Move = createLucideIcon("move", [
	["path", {
		d: "M12 2v20",
		key: "t6zp3m"
	}],
	["path", {
		d: "m15 19-3 3-3-3",
		key: "11eu04"
	}],
	["path", {
		d: "m19 9 3 3-3 3",
		key: "1mg7y2"
	}],
	["path", {
		d: "M2 12h20",
		key: "9i4pu4"
	}],
	["path", {
		d: "m5 9-3 3 3 3",
		key: "j64kie"
	}],
	["path", {
		d: "m9 5 3-3 3 3",
		key: "l8vdw6"
	}]
]);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var useFolderStore_default = createStore("funilos_folders", [
	{
		id: "f1",
		projectId: "p1",
		module: "funnel",
		name: "Planejamento",
		parentId: null,
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		isExpanded: true
	},
	{
		id: "f2",
		projectId: "p1",
		module: "funnel",
		name: "Pesquisas",
		parentId: "f1",
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		isExpanded: true
	},
	{
		id: "f3",
		module: "project",
		name: "Q3 - Lançamentos",
		parentId: null,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "f4",
		module: "asset",
		name: "Imagens para Meta Ads",
		parentId: null,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}
]);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var NAME = "Toggle";
var Toggle$1 = import_react.forwardRef((props, forwardedRef) => {
	const { pressed: pressedProp, defaultPressed, onPressedChange, ...buttonProps } = props;
	const [pressed, setPressed] = useControllableState({
		prop: pressedProp,
		onChange: onPressedChange,
		defaultProp: defaultPressed ?? false,
		caller: NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
		type: "button",
		"aria-pressed": pressed,
		"data-state": pressed ? "on" : "off",
		"data-disabled": props.disabled ? "" : void 0,
		...buttonProps,
		ref: forwardedRef,
		onClick: composeEventHandlers(props.onClick, () => {
			if (!props.disabled) setPressed(!pressed);
		})
	});
});
Toggle$1.displayName = NAME;
var Root = Toggle$1;
var TOGGLE_GROUP_NAME = "ToggleGroup";
var [createToggleGroupContext, createToggleGroupScope] = createContextScope(TOGGLE_GROUP_NAME, [createRovingFocusGroupScope]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var ToggleGroup$1 = import_react.forwardRef((props, forwardedRef) => {
	const { type, ...toggleGroupProps } = props;
	if (type === "single") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupImplSingle, {
		...toggleGroupProps,
		ref: forwardedRef
	});
	if (type === "multiple") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupImplMultiple, {
		...toggleGroupProps,
		ref: forwardedRef
	});
	throw new Error(`Missing prop \`type\` expected on \`${TOGGLE_GROUP_NAME}\``);
});
ToggleGroup$1.displayName = TOGGLE_GROUP_NAME;
var [ToggleGroupValueProvider, useToggleGroupValueContext] = createToggleGroupContext(TOGGLE_GROUP_NAME);
var ToggleGroupImplSingle = import_react.forwardRef((props, forwardedRef) => {
	const { value: valueProp, defaultValue, onValueChange = () => {}, ...toggleGroupSingleProps } = props;
	const [value, setValue] = useControllableState({
		prop: valueProp,
		defaultProp: defaultValue ?? "",
		onChange: onValueChange,
		caller: TOGGLE_GROUP_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupValueProvider, {
		scope: props.__scopeToggleGroup,
		type: "single",
		value: import_react.useMemo(() => value ? [value] : [], [value]),
		onItemActivate: setValue,
		onItemDeactivate: import_react.useCallback(() => setValue(""), [setValue]),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupImpl, {
			...toggleGroupSingleProps,
			ref: forwardedRef
		})
	});
});
var ToggleGroupImplMultiple = import_react.forwardRef((props, forwardedRef) => {
	const { value: valueProp, defaultValue, onValueChange = () => {}, ...toggleGroupMultipleProps } = props;
	const [value, setValue] = useControllableState({
		prop: valueProp,
		defaultProp: defaultValue ?? [],
		onChange: onValueChange,
		caller: TOGGLE_GROUP_NAME
	});
	const handleButtonActivate = import_react.useCallback((itemValue) => setValue((prevValue = []) => [...prevValue, itemValue]), [setValue]);
	const handleButtonDeactivate = import_react.useCallback((itemValue) => setValue((prevValue = []) => prevValue.filter((value2) => value2 !== itemValue)), [setValue]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupValueProvider, {
		scope: props.__scopeToggleGroup,
		type: "multiple",
		value,
		onItemActivate: handleButtonActivate,
		onItemDeactivate: handleButtonDeactivate,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupImpl, {
			...toggleGroupMultipleProps,
			ref: forwardedRef
		})
	});
});
ToggleGroup$1.displayName = TOGGLE_GROUP_NAME;
var [ToggleGroupContext$1, useToggleGroupContext] = createToggleGroupContext(TOGGLE_GROUP_NAME);
var ToggleGroupImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeToggleGroup, disabled = false, rovingFocus = true, orientation, dir, loop = true, ...toggleGroupProps } = props;
	const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeToggleGroup);
	const direction = useDirection(dir);
	const commonProps = {
		role: "group",
		dir: direction,
		...toggleGroupProps
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupContext$1, {
		scope: __scopeToggleGroup,
		rovingFocus,
		disabled,
		children: rovingFocus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$1, {
			asChild: true,
			...rovingFocusGroupScope,
			orientation,
			dir: direction,
			loop,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
				...commonProps,
				ref: forwardedRef
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			...commonProps,
			ref: forwardedRef
		})
	});
});
var ITEM_NAME = "ToggleGroupItem";
var ToggleGroupItem$1 = import_react.forwardRef((props, forwardedRef) => {
	const valueContext = useToggleGroupValueContext(ITEM_NAME, props.__scopeToggleGroup);
	const context = useToggleGroupContext(ITEM_NAME, props.__scopeToggleGroup);
	const rovingFocusGroupScope = useRovingFocusGroupScope(props.__scopeToggleGroup);
	const pressed = valueContext.value.includes(props.value);
	const disabled = context.disabled || props.disabled;
	const commonProps = {
		...props,
		pressed,
		disabled
	};
	const ref = import_react.useRef(null);
	return context.rovingFocus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
		asChild: true,
		...rovingFocusGroupScope,
		focusable: !disabled,
		active: pressed,
		ref,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupItemImpl, {
			...commonProps,
			ref: forwardedRef
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupItemImpl, {
		...commonProps,
		ref: forwardedRef
	});
});
ToggleGroupItem$1.displayName = ITEM_NAME;
var ToggleGroupItemImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeToggleGroup, value, ...itemProps } = props;
	const valueContext = useToggleGroupValueContext(ITEM_NAME, __scopeToggleGroup);
	const singleProps = {
		role: "radio",
		"aria-checked": props.pressed,
		"aria-pressed": void 0
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle$1, {
		...valueContext.type === "single" ? singleProps : void 0,
		...itemProps,
		ref: forwardedRef,
		onPressedChange: (pressed) => {
			if (pressed) valueContext.onItemActivate(value);
			else valueContext.onItemDeactivate(value);
		}
	});
});
var Root2 = ToggleGroup$1;
var Item2 = ToggleGroupItem$1;
var toggleVariants = cva("inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2", {
	variants: {
		variant: {
			default: "bg-transparent",
			outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
		},
		size: {
			default: "h-10 px-3 min-w-10",
			sm: "h-9 px-2.5 min-w-9",
			lg: "h-11 px-5 min-w-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Toggle = import_react.forwardRef(({ className, variant, size, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(toggleVariants({
		variant,
		size,
		className
	})),
	...props
}));
Toggle.displayName = Root.displayName;
var ToggleGroupContext = import_react.createContext({
	size: "default",
	variant: "default"
});
var ToggleGroup = import_react.forwardRef(({ className, variant, size, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2, {
	ref,
	className: cn("flex items-center justify-center gap-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupContext.Provider, {
		value: {
			variant,
			size
		},
		children
	})
}));
ToggleGroup.displayName = Root2.displayName;
var ToggleGroupItem = import_react.forwardRef(({ className, children, variant, size, ...props }, ref) => {
	const context = import_react.useContext(ToggleGroupContext);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		ref,
		className: cn(toggleVariants({
			variant: context.variant || variant,
			size: context.size || size
		}), className),
		...props,
		children
	});
});
ToggleGroupItem.displayName = Item2.displayName;
function ViewToggle({ view, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToggleGroup, {
		type: "single",
		value: view,
		onValueChange: (v) => v && onChange(v),
		className: "bg-card border border-border p-1 rounded-lg shadow-sm h-10 gap-0 inline-flex items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupItem, {
			value: "grid",
			"aria-label": "Grid view",
			className: "rounded-md w-8 h-8 p-0 data-[state=on]:bg-background data-[state=on]:text-foreground text-muted-foreground hover:text-foreground transition-all",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { size: 16 })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupItem, {
			value: "list",
			"aria-label": "List view",
			className: "rounded-md w-8 h-8 p-0 data-[state=on]:bg-background data-[state=on]:text-foreground text-muted-foreground hover:text-foreground transition-all",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { size: 16 })
		})]
	});
}
function FolderBreadcrumbs({ currentFolderId, folders, onNavigate, rootName }) {
	const path = (0, import_react.useMemo)(() => {
		const result = [];
		let current = folders.find((f) => f.id === currentFolderId);
		while (current) {
			result.unshift(current);
			current = folders.find((f) => f.id === current?.parentId);
		}
		return result;
	}, [currentFolderId, folders]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumb, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BreadcrumbList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbItem, { children: currentFolderId === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbPage, {
		className: "font-medium text-muted-foreground",
		children: rootName
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbLink, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => onNavigate(null),
			className: "font-medium cursor-pointer text-muted-foreground",
			children: rootName
		})
	}) }), path.map((folder, index) => {
		const isLast = index === path.length - 1;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "contents",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbSeparator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbItem, { children: isLast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbPage, { children: folder.name }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbLink, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onNavigate(folder.id),
					className: "cursor-pointer",
					children: folder.name
				})
			}) })]
		}, folder.id);
	})] }) });
}
function CreateFolderDialog({ onConfirm }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const handleSave = (e) => {
		e.preventDefault();
		if (name.trim()) {
			onConfirm(name);
			setName("");
			setOpen(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, {
					size: 16,
					className: "mr-2"
				}), " Nova Pasta"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Criar Nova Pasta" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
			className: "sr-only",
			children: "Insira o nome para a nova pasta."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSave,
			className: "space-y-4 pt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Nome da pasta",
				value: name,
				onChange: (e) => setName(e.target.value),
				autoFocus: true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				children: "Criar Pasta"
			})]
		})] })]
	});
}
function MoveDialog({ folders, currentFolderId, onMove }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(currentFolderId || "root");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "icon",
				className: "h-8 w-8",
				onClick: (e) => e.stopPropagation(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Move, {
					size: 14,
					className: "text-foreground"
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Mover Item" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
				className: "sr-only",
				children: "Selecione a pasta de destino para mover o item."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: selected,
					onValueChange: setSelected,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione o destino" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "root",
						children: "Raiz"
					}), folders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: f.id,
						children: f.name
					}, f.id))] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						onMove(selected === "root" ? null : selected);
						setOpen(false);
					},
					className: "w-full",
					children: "Confirmar Movimentação"
				})]
			})]
		})]
	});
}
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
		className: "p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
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
				className: "relative max-w-md",
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

//# sourceMappingURL=Projects-CnPHp3nH.js.map