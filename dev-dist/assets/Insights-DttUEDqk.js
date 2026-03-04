import { A as createStore, C as Input, F as DialogHeader, I as DialogTitle, L as DialogTrigger, M as DialogContent, Mt as useToast, N as DialogDescription, Ot as createContextScope, R as Slot, Rt as require_react, St as useControllableState, Tt as Primitive, Vt as __toESM, _ as format, at as Plus, bt as cva, c as SelectItem, dt as Folder, et as cn, f as useDirection, ht as ChevronRight, it as Search, j as Dialog, jt as composeEventHandlers, kt as require_jsx_runtime, l as SelectTrigger, m as useQuickActionStore_default, o as Select, p as generateId, s as SelectContent, st as Lightbulb, u as SelectValue, w as Button, yt as createLucideIcon } from "./index-CBmeAG5q.js";
import { n as Root$1, r as createRovingFocusGroupScope, t as Item } from "./dist-COqHm3cv.js";
import { t as Badge } from "./badge-BotaLT9k.js";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-Be521Qyd.js";
var Ellipsis = createLucideIcon("ellipsis", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "1",
		key: "41hilf"
	}],
	["circle", {
		cx: "19",
		cy: "12",
		r: "1",
		key: "1wjl8i"
	}],
	["circle", {
		cx: "5",
		cy: "12",
		r: "1",
		key: "1pcz8c"
	}]
]);
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
var Pin = createLucideIcon("pin", [["path", {
	d: "M12 17v5",
	key: "bb1du9"
}], ["path", {
	d: "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",
	key: "1nkz8b"
}]]);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var useInsightStore_default = createStore("funilos_insights", [
	{
		id: "i1",
		title: "Aumentar contraste no CTA",
		content: "Notei que botões vermelhos convertem melhor que azuis em nossa audiência.",
		type: "Observação",
		status: "Aplicado",
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		isPinned: true
	},
	{
		id: "i2",
		title: "Usar storytelling no Email 2",
		content: "A história do fundador pode conectar mais com os leads frios.",
		type: "Ideia",
		status: "Salvo",
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		isPinned: false
	},
	{
		id: "i3",
		title: "Testar Order Bump",
		content: "Podemos adicionar uma planilha de R$27 no checkout.",
		type: "Hipótese",
		status: "Rascunho",
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		isPinned: false
	}
]);
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
var Table = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "relative w-full overflow-auto no-scrollbar",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		ref,
		className: cn("w-full caption-bottom text-base", className),
		...props
	})
}));
Table.displayName = "Table";
var TableHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
	ref,
	className: cn("[&_tr]:border-b bg-muted/50", className),
	...props
}));
TableHeader.displayName = "TableHeader";
var TableBody = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
var TableFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
var TableRow = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
	ref,
	className: cn("border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted align-middle", className),
	...props
}));
TableRow.displayName = "TableRow";
var TableHead = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
	ref,
	className: cn("h-10 px-4 text-left align-middle text-[11px] font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className),
	...props
}));
TableHead.displayName = "TableHead";
var TableCell = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
	ref,
	className: cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className),
	...props
}));
TableCell.displayName = "TableCell";
var TableCaption = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
var Breadcrumb = import_react.forwardRef(({ ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
	ref,
	"aria-label": "breadcrumb",
	...props
}));
Breadcrumb.displayName = "Breadcrumb";
var BreadcrumbList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
	ref,
	className: cn("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5", className),
	...props
}));
BreadcrumbList.displayName = "BreadcrumbList";
var BreadcrumbItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
	ref,
	className: cn("inline-flex items-center gap-1.5", className),
	...props
}));
BreadcrumbItem.displayName = "BreadcrumbItem";
var BreadcrumbLink = import_react.forwardRef(({ asChild, className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "a", {
		ref,
		className: cn("transition-colors hover:text-foreground", className),
		...props
	});
});
BreadcrumbLink.displayName = "BreadcrumbLink";
var BreadcrumbPage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
	ref,
	role: "link",
	"aria-disabled": "true",
	"aria-current": "page",
	className: cn("font-normal text-foreground", className),
	...props
}));
BreadcrumbPage.displayName = "BreadcrumbPage";
var BreadcrumbSeparator = ({ children, className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
	role: "presentation",
	"aria-hidden": "true",
	className: cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className),
	...props,
	children: children ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
});
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
var BreadcrumbEllipsis = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
	role: "presentation",
	"aria-hidden": "true",
	className: cn("flex h-9 w-9 items-center justify-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "sr-only",
		children: "More"
	})]
});
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";
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
function Insights() {
	const [insights, setInsights] = useInsightStore_default();
	const [allFolders, setFolders] = useFolderStore_default();
	const [, setAction] = useQuickActionStore_default();
	const [search, setSearch] = (0, import_react.useState)("");
	const [view, setView] = (0, import_react.useState)("grid");
	const [currentFolderId, setCurrentFolderId] = (0, import_react.useState)(null);
	const { toast } = useToast();
	const moduleFolders = allFolders.filter((f) => f.module === "insight");
	const currentFolders = moduleFolders.filter((f) => {
		if (search) return f.name.toLowerCase().includes(search.toLowerCase());
		return f.parentId === currentFolderId;
	});
	const filteredInsights = insights.filter((i) => {
		if (search) return i.title.toLowerCase().includes(search.toLowerCase()) || i.content.toLowerCase().includes(search.toLowerCase());
		return (i.folderId || null) === currentFolderId;
	}).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
	const handleCreateFolder = (name) => {
		setFolders([...allFolders, {
			id: generateId("f"),
			module: "insight",
			name,
			parentId: currentFolderId,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}]);
		toast({ title: "Pasta criada com sucesso!" });
	};
	const updateInsightFolder = (id, folderId) => {
		setInsights(insights.map((i) => i.id === id ? {
			...i,
			folderId
		} : i));
		toast({ title: "Insight movido com sucesso!" });
	};
	const togglePin = (e, id) => {
		e.preventDefault();
		e.stopPropagation();
		setInsights(insights.map((i) => i.id === id ? {
			...i,
			isPinned: !i.isPinned
		} : i));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-6 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-4xl font-bold tracking-tight text-foreground",
						children: "Insights"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderBreadcrumbs, {
						currentFolderId,
						folders: moduleFolders,
						onNavigate: setCurrentFolderId,
						rootName: "Insights"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewToggle, {
							view,
							onChange: setView
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateFolderDialog, { onConfirm: handleCreateFolder }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setAction({
								type: "insight",
								mode: "create"
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
								size: 16,
								className: "mr-2"
							}), " Novo Insight"]
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
					placeholder: "Pesquisar insights...",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "pl-10 bg-card"
				})]
			}),
			currentFolders.length === 0 && filteredInsights.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-20 text-center flex flex-col items-center bg-card rounded-xl border border-dashed border-border shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { size: 32 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl font-bold text-foreground",
						children: "Vazio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base text-muted-foreground mb-6 mt-2",
						children: "Crie um insight ou uma pasta para se organizar."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setAction({
							type: "insight",
							mode: "create"
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							size: 16,
							className: "mr-2"
						}), " Novo Insight"]
					})
				]
			}) : view === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: [currentFolders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					onClick: () => setCurrentFolderId(f.id),
					className: "hover:shadow-md transition-all cursor-pointer h-full group flex items-center p-6 gap-4 min-h-[180px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-16 h-16 rounded-xl bg-accent flex items-center justify-center text-primary shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
							size: 32,
							className: "fill-current opacity-20"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-xl group-hover:text-primary transition-colors",
						children: f.name
					})]
				}, f.id)), filteredInsights.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "relative hover:shadow-md transition-shadow group flex flex-col cursor-pointer",
					onClick: () => setAction({
						type: "insight",
						mode: "edit",
						itemId: i.id
					}),
					children: [
						i.isPinned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
							className: "absolute top-6 right-6 text-primary fill-primary z-10 drop-shadow-sm",
							size: 20,
							onClick: (e) => togglePin(e, i.id)
						}),
						!i.isPinned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
							className: "absolute top-6 right-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10",
							size: 20,
							onClick: (e) => togglePin(e, i.id)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-2 pr-16 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-3 items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "bg-accent text-accent-foreground border-none",
									children: i.type
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-xl leading-snug",
									children: i.title
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "flex-1 flex flex-col pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground text-base line-clamp-4 leading-relaxed flex-1",
								children: i.content
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 pt-4 border-t border-border flex justify-between items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground font-medium uppercase tracking-wider",
										children: format(new Date(i.createdAt), "dd MMM yyyy")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										onClick: (e) => {
											e.preventDefault();
											e.stopPropagation();
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveDialog, {
											folders: moduleFolders,
											currentFolderId: i.folderId,
											onMove: (id) => updateInsightFolder(i.id, id)
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "bg-muted text-muted-foreground border-none font-medium",
									children: i.status
								})]
							})]
						})
					]
				}, i.id))]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-card border rounded-xl overflow-hidden shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Título" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tipo" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Ações" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [currentFolders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					onClick: () => setCurrentFolderId(f.id),
					className: "cursor-pointer group text-base",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "font-semibold flex items-center gap-3 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 flex items-center justify-center bg-accent rounded-lg text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
									className: "fill-current opacity-20",
									size: 20
								})
							}), f.name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: "-" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: "-" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {})
					]
				}, f.id)), filteredInsights.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					className: "cursor-pointer text-base",
					onClick: () => setAction({
						type: "insight",
						mode: "edit",
						itemId: i.id
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium py-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [i.title, i.isPinned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
									className: "text-primary fill-primary",
									size: 16
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "bg-accent text-accent-foreground border-none",
							children: i.type
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "bg-muted text-muted-foreground border-none font-medium",
							children: i.status
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							onClick: (e) => e.stopPropagation(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveDialog, {
								folders: moduleFolders,
								currentFolderId: i.folderId,
								onMove: (id) => updateInsightFolder(i.id, id)
							})
						})
					]
				}, i.id))] })] })
			})
		]
	});
}
export { Insights as default };

//# sourceMappingURL=Insights-DttUEDqk.js.map