import { t as Circle } from "./circle-1Qpm-15J.js";
import { t as Clock } from "./clock-Cyxd-rTq.js";
import { t as Ellipsis } from "./ellipsis-DgeJ1E6W.js";
import { a as Checkbox, o as MessageSquare } from "./tabs-DanDQTSo.js";
import { t as Trash2 } from "./trash-2-pWUrSV2v.js";
import { B as Primitive, C as SheetTitle, Dt as CircleAlert, Jt as require_jsx_runtime, Mt as Check, Nt as Calendar, Pt as createLucideIcon, S as SheetDescription, Vt as useCallbackRef, _t as Plus, a as SelectItem, an as __commonJSMin, b as Sheet, bt as Network, f as ptBR, ft as cn, i as SelectContent, in as require_react, j as useProjectStore_default, m as format, o as SelectTrigger, on as __toESM, r as Select, s as SelectValue, tn as useNavigate, u as generateId, x as SheetContent, zt as useLayoutEffect2 } from "./index-D26CbVOK.js";
import { t as Badge } from "./badge-BzGf268W.js";
import { n as CardContent, t as Card } from "./card-BDZfNr4e.js";
var AtSign = createLucideIcon("at-sign", [["circle", {
	cx: "12",
	cy: "12",
	r: "4",
	key: "4exip2"
}], ["path", {
	d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8",
	key: "7n84p3"
}]]);
var CircleCheck = createLucideIcon("circle-check", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]);
var Paperclip = createLucideIcon("paperclip", [["path", {
	d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
	key: "1miecu"
}]]);
var Send = createLucideIcon("send", [["path", {
	d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
	key: "1ffxy3"
}], ["path", {
	d: "m21.854 2.147-10.94 10.939",
	key: "12cjpa"
}]]);
var Share2 = createLucideIcon("share-2", [
	["circle", {
		cx: "18",
		cy: "5",
		r: "3",
		key: "gq8acd"
	}],
	["circle", {
		cx: "6",
		cy: "12",
		r: "3",
		key: "w7nqdw"
	}],
	["circle", {
		cx: "18",
		cy: "19",
		r: "3",
		key: "1xt0gg"
	}],
	["line", {
		x1: "8.59",
		x2: "15.42",
		y1: "13.51",
		y2: "17.49",
		key: "47mynk"
	}],
	["line", {
		x1: "15.41",
		x2: "8.59",
		y1: "6.51",
		y2: "10.49",
		key: "1n3mei"
	}]
]);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function createContextScope(scopeName, createContextScopeDeps = []) {
	let defaultContexts = [];
	function createContext3(rootComponentName, defaultContext) {
		const BaseContext = import_react.createContext(defaultContext);
		BaseContext.displayName = rootComponentName + "Context";
		const index = defaultContexts.length;
		defaultContexts = [...defaultContexts, defaultContext];
		const Provider = (props) => {
			const { scope, children, ...context } = props;
			const Context = scope?.[scopeName]?.[index] || BaseContext;
			const value = import_react.useMemo(() => context, Object.values(context));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Context.Provider, {
				value,
				children
			});
		};
		Provider.displayName = rootComponentName + "Provider";
		function useContext2(consumerName, scope) {
			const Context = scope?.[scopeName]?.[index] || BaseContext;
			const context = import_react.useContext(Context);
			if (context) return context;
			if (defaultContext !== void 0) return defaultContext;
			throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
		}
		return [Provider, useContext2];
	}
	const createScope = () => {
		const scopeContexts = defaultContexts.map((defaultContext) => {
			return import_react.createContext(defaultContext);
		});
		return function useScope(scope) {
			const contexts = scope?.[scopeName] || scopeContexts;
			return import_react.useMemo(() => ({ [`__scope${scopeName}`]: {
				...scope,
				[scopeName]: contexts
			} }), [scope, contexts]);
		};
	};
	createScope.scopeName = scopeName;
	return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
	const baseScope = scopes[0];
	if (scopes.length === 1) return baseScope;
	const createScope = () => {
		const scopeHooks = scopes.map((createScope2) => ({
			useScope: createScope2(),
			scopeName: createScope2.scopeName
		}));
		return function useComposedScopes(overrideScopes) {
			const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
				const currentScope = useScope(overrideScopes)[`__scope${scopeName}`];
				return {
					...nextScopes2,
					...currentScope
				};
			}, {});
			return import_react.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
		};
	};
	createScope.scopeName = baseScope.scopeName;
	return createScope;
}
var PROGRESS_NAME = "Progress";
var DEFAULT_MAX = 100;
var [createProgressContext, createProgressScope] = createContextScope(PROGRESS_NAME);
var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
var Progress$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeProgress, value: valueProp = null, max: maxProp, getValueLabel = defaultGetValueLabel, ...progressProps } = props;
	if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
	const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
	if (valueProp !== null && !isValidValueNumber(valueProp, max)) console.error(getInvalidValueError(`${valueProp}`, "Progress"));
	const value = isValidValueNumber(valueProp, max) ? valueProp : null;
	const valueLabel = isNumber(value) ? getValueLabel(value, max) : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressProvider, {
		scope: __scopeProgress,
		value,
		max,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			"aria-valuemax": max,
			"aria-valuemin": 0,
			"aria-valuenow": isNumber(value) ? value : void 0,
			"aria-valuetext": valueLabel,
			role: "progressbar",
			"data-state": getProgressState(value, max),
			"data-value": value ?? void 0,
			"data-max": max,
			...progressProps,
			ref: forwardedRef
		})
	});
});
Progress$1.displayName = PROGRESS_NAME;
var INDICATOR_NAME = "ProgressIndicator";
var ProgressIndicator = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeProgress, ...indicatorProps } = props;
	const context = useProgressContext(INDICATOR_NAME, __scopeProgress);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		"data-state": getProgressState(context.value, context.max),
		"data-value": context.value ?? void 0,
		"data-max": context.max,
		...indicatorProps,
		ref: forwardedRef
	});
});
ProgressIndicator.displayName = INDICATOR_NAME;
function defaultGetValueLabel(value, max) {
	return `${Math.round(value / max * 100)}%`;
}
function getProgressState(value, maxValue) {
	return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function isNumber(value) {
	return typeof value === "number";
}
function isValidMaxNumber(max) {
	return isNumber(max) && !isNaN(max) && max > 0;
}
function isValidValueNumber(value, max) {
	return isNumber(value) && !isNaN(value) && value <= max && value >= 0;
}
function getInvalidMaxError(propValue, componentName) {
	return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(propValue, componentName) {
	return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Root$1 = Progress$1;
var Indicator = ProgressIndicator;
var Progress = import_react.forwardRef(({ className, value, indicatorColor = "bg-primary", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$1, {
	ref,
	className: cn("relative h-[8px] w-full overflow-hidden rounded-full bg-border", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: cn("h-full w-full flex-1 transition-all", indicatorColor),
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root$1.displayName;
var columnsConfig = [
	{
		id: "Pendente",
		label: "PENDENTE",
		dot: "bg-[#8C7B6C]",
		countColor: "bg-[#E8E2D9] text-[#8C7B6C]"
	},
	{
		id: "Em Progresso",
		label: "EM PROGRESSO",
		dot: "bg-[#E5B567]",
		countColor: "bg-[#F3EEE7] text-[#C2714F]"
	},
	{
		id: "Concluída",
		label: "CONCLUÍDA",
		dot: "bg-[#A1C9A3]",
		countColor: "bg-[#E8F2E8] text-[#4CAF50]"
	}
];
function TasksBoard({ tasks, updateTask, onCardClick }) {
	const [draggingId, setDraggingId] = (0, import_react.useState)(null);
	const [dragOverCol, setDragOverCol] = (0, import_react.useState)(null);
	const handleDragStart = (e, id) => {
		e.dataTransfer.setData("taskId", id);
		e.dataTransfer.effectAllowed = "move";
		setDraggingId(id);
	};
	const handleDragEnd = () => {
		setDraggingId(null);
		setDragOverCol(null);
	};
	const handleDrop = (e, status) => {
		e.preventDefault();
		const id = e.dataTransfer.getData("taskId");
		if (id) updateTask(id, { status });
		setDraggingId(null);
		setDragOverCol(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-6 overflow-x-auto pb-4 h-full items-start no-scrollbar",
		children: [columnsConfig.map((col) => {
			const colTasks = tasks.filter((t) => t.status === col.id);
			const isDragOver = dragOverCol === col.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("w-[340px] shrink-0 flex flex-col rounded-2xl transition-all duration-200 relative", isDragOver && "bg-black/5 ring-2 ring-primary/20"),
				onDragOver: (e) => {
					e.preventDefault();
					e.dataTransfer.dropEffect = "move";
					if (!isDragOver) setDragOverCol(col.id);
				},
				onDrop: (e) => handleDrop(e, col.id),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center mb-4 px-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-2 h-2 rounded-full ${col.dot}` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-[13px] text-[#3D2B1F] tracking-wide",
								children: col.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("text-[11px] font-bold rounded-full px-2.5 py-0.5", col.countColor),
								children: colTasks.length
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "text-[#8C7B6C] hover:text-[#3D2B1F] transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { size: 16 })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 flex-1 overflow-y-auto min-h-[150px] pb-4 no-scrollbar",
					children: [colTasks.map((t) => {
						const isDragging = draggingId === t.id;
						const isCompleted = t.status === "Concluída";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							draggable: true,
							onDragStart: (e) => handleDragStart(e, t.id),
							onDragEnd: handleDragEnd,
							onClick: () => onCardClick(t),
							className: cn("cursor-grab active:cursor-grabbing border-[#E8E2D9] rounded-[14px] bg-white transition-all", isDragging ? "opacity-40 shadow-none" : "shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-[#C2714F]/40"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-4 flex flex-col gap-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: cn("px-2 py-0.5 text-[10px] font-bold border-[#E8E2D9] bg-white", t.categoryColor || "text-[#8C7B6C]", isCompleted && "opacity-60"),
											children: t.category || "Geral"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: cn("text-[#8C7B6C]", isCompleted && "opacity-60"),
											children: [
												t.iconType === "clock" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { size: 14 }),
												t.iconType === "alert" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
													size: 14,
													className: "text-[#C2714F]"
												}),
												t.iconType === "dot" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, {
													size: 10,
													className: "fill-[#E5B567] text-[#E5B567]"
												}),
												t.iconType === "comment" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { size: 14 }),
												t.iconType === "check" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
													size: 14,
													className: "text-[#A1C9A3]"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("font-bold text-[14px] leading-snug", isCompleted ? "line-through text-[#8C7B6C] opacity-70" : "text-[#3D2B1F]"),
										children: t.title
									}),
									t.status === "Em Progresso" && t.progress !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full mt-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
											value: t.progress,
											indicatorColor: "bg-[#E5B567]",
											className: "h-1 bg-[#F3EEE7]"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-end mt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex -space-x-1.5",
											children: t.assignees?.map((assignee, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: cn("w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-[1.5px] border-white", assignee.color, isCompleted && "opacity-70"),
												children: assignee.initials
											}, idx))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("text-[10px] font-bold uppercase tracking-wider", t.dateColor || "text-[#8C7B6C]", isCompleted && "opacity-60", t.status === "Em Progresso" && t.progress !== void 0 && "text-[#3D2B1F]"),
												children: t.dateLabel
											})
										})]
									})
								]
							})
						}, t.id);
					}), col.id === "Pendente" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "w-full mt-1 py-3 rounded-[14px] border border-dashed border-[#E8E2D9] text-[#8C7B6C] text-xs font-bold hover:bg-[#F3EEE7] hover:text-[#3D2B1F] flex items-center justify-center gap-1.5 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							size: 14,
							className: "stroke-[3]"
						}), " Adicionar"]
					})]
				})]
			}, col.id);
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-[340px] shrink-0 flex flex-col rounded-2xl border border-dashed border-[#E8E2D9] h-[140px] items-center justify-center text-[#8C7B6C] hover:bg-[#F3EEE7] hover:text-[#3D2B1F] transition-colors cursor-pointer mt-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-8 h-8 rounded-full border border-current flex items-center justify-center mb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					size: 16,
					className: "stroke-[3]"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-bold",
				children: "Criar Coluna"
			})]
		})]
	});
}
/**
* @license React
* use-sync-external-store-shim.development.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_use_sync_external_store_shim_development = /* @__PURE__ */ __commonJSMin(((exports) => {
	(function() {
		function is(x, y) {
			return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
		}
		function useSyncExternalStore$2(subscribe$1, getSnapshot) {
			didWarnOld18Alpha || void 0 === React.startTransition || (didWarnOld18Alpha = !0, console.error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."));
			var value = getSnapshot();
			if (!didWarnUncachedGetSnapshot) {
				var cachedValue = getSnapshot();
				objectIs(value, cachedValue) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), didWarnUncachedGetSnapshot = !0);
			}
			cachedValue = useState$2({ inst: {
				value,
				getSnapshot
			} });
			var inst = cachedValue[0].inst, forceUpdate = cachedValue[1];
			useLayoutEffect(function() {
				inst.value = value;
				inst.getSnapshot = getSnapshot;
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			}, [
				subscribe$1,
				value,
				getSnapshot
			]);
			useEffect$1(function() {
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
				return subscribe$1(function() {
					checkIfSnapshotChanged(inst) && forceUpdate({ inst });
				});
			}, [subscribe$1]);
			useDebugValue(value);
			return value;
		}
		function checkIfSnapshotChanged(inst) {
			var latestGetSnapshot = inst.getSnapshot;
			inst = inst.value;
			try {
				var nextValue = latestGetSnapshot();
				return !objectIs(inst, nextValue);
			} catch (error) {
				return !0;
			}
		}
		function useSyncExternalStore$1(subscribe$1, getSnapshot) {
			return getSnapshot();
		}
		"undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var React = require_react(), objectIs = "function" === typeof Object.is ? Object.is : is, useState$2 = React.useState, useEffect$1 = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue = React.useDebugValue, didWarnOld18Alpha = !1, didWarnUncachedGetSnapshot = !1, shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
		exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
		"undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
}));
var import_shim = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_use_sync_external_store_shim_development();
})))();
function useIsHydrated() {
	return (0, import_shim.useSyncExternalStore)(subscribe, () => true, () => false);
}
function subscribe() {
	return () => {};
}
var AVATAR_NAME = "Avatar";
var [createAvatarContext, createAvatarScope] = createContextScope(AVATAR_NAME);
var [AvatarProvider, useAvatarContext] = createAvatarContext(AVATAR_NAME);
var Avatar$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeAvatar, ...avatarProps } = props;
	const [imageLoadingStatus, setImageLoadingStatus] = import_react.useState("idle");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarProvider, {
		scope: __scopeAvatar,
		imageLoadingStatus,
		onImageLoadingStatusChange: setImageLoadingStatus,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
			...avatarProps,
			ref: forwardedRef
		})
	});
});
Avatar$1.displayName = AVATAR_NAME;
var IMAGE_NAME = "AvatarImage";
var AvatarImage$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeAvatar, src, onLoadingStatusChange = () => {}, ...imageProps } = props;
	const context = useAvatarContext(IMAGE_NAME, __scopeAvatar);
	const imageLoadingStatus = useImageLoadingStatus(src, imageProps);
	const handleLoadingStatusChange = useCallbackRef((status) => {
		onLoadingStatusChange(status);
		context.onImageLoadingStatusChange(status);
	});
	useLayoutEffect2(() => {
		if (imageLoadingStatus !== "idle") handleLoadingStatusChange(imageLoadingStatus);
	}, [imageLoadingStatus, handleLoadingStatusChange]);
	return imageLoadingStatus === "loaded" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.img, {
		...imageProps,
		ref: forwardedRef,
		src
	}) : null;
});
AvatarImage$1.displayName = IMAGE_NAME;
var FALLBACK_NAME = "AvatarFallback";
var AvatarFallback$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeAvatar, delayMs, ...fallbackProps } = props;
	const context = useAvatarContext(FALLBACK_NAME, __scopeAvatar);
	const [canRender, setCanRender] = import_react.useState(delayMs === void 0);
	import_react.useEffect(() => {
		if (delayMs !== void 0) {
			const timerId = window.setTimeout(() => setCanRender(true), delayMs);
			return () => window.clearTimeout(timerId);
		}
	}, [delayMs]);
	return canRender && context.imageLoadingStatus !== "loaded" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
		...fallbackProps,
		ref: forwardedRef
	}) : null;
});
AvatarFallback$1.displayName = FALLBACK_NAME;
function resolveLoadingStatus(image, src) {
	if (!image) return "idle";
	if (!src) return "error";
	if (image.src !== src) image.src = src;
	return image.complete && image.naturalWidth > 0 ? "loaded" : "loading";
}
function useImageLoadingStatus(src, { referrerPolicy, crossOrigin }) {
	const isHydrated = useIsHydrated();
	const imageRef = import_react.useRef(null);
	const image = (() => {
		if (!isHydrated) return null;
		if (!imageRef.current) imageRef.current = new window.Image();
		return imageRef.current;
	})();
	const [loadingStatus, setLoadingStatus] = import_react.useState(() => resolveLoadingStatus(image, src));
	useLayoutEffect2(() => {
		setLoadingStatus(resolveLoadingStatus(image, src));
	}, [image, src]);
	useLayoutEffect2(() => {
		const updateStatus = (status) => () => {
			setLoadingStatus(status);
		};
		if (!image) return;
		const handleLoad = updateStatus("loaded");
		const handleError = updateStatus("error");
		image.addEventListener("load", handleLoad);
		image.addEventListener("error", handleError);
		if (referrerPolicy) image.referrerPolicy = referrerPolicy;
		if (typeof crossOrigin === "string") image.crossOrigin = crossOrigin;
		return () => {
			image.removeEventListener("load", handleLoad);
			image.removeEventListener("error", handleError);
		};
	}, [
		image,
		crossOrigin,
		referrerPolicy
	]);
	return loadingStatus;
}
var Root = Avatar$1;
var Image = AvatarImage$1;
var Fallback = AvatarFallback$1;
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Root.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = Image.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fallback, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = Fallback.displayName;
function TaskMetadata({ task, onUpdate }) {
	const statusColors = getStatusColors(task.status);
	const priorityColors = getPriorityColors(task.priority);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-2 gap-x-6 gap-y-5 mb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-[10px] font-bold uppercase tracking-widest text-[#8C7B6C] block",
					children: "Responsável"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 bg-white border border-[#E8E2D9] rounded-xl px-3 h-11 transition-colors hover:border-[#C2714F]/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
						className: "w-6 h-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: task.avatar }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
							className: "bg-[#F3EEE7] text-[#C2714F] text-[10px] font-bold",
							children: task.assignee?.slice(0, 2).toUpperCase() || "U"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: task.assignee || "",
						onChange: (e) => onUpdate({ assignee: e.target.value }),
						placeholder: "Atribuir",
						className: "bg-transparent text-sm font-semibold text-[#3D2B1F] outline-none flex-1 placeholder:text-[#8C7B6C]/50"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-[10px] font-bold uppercase tracking-widest text-[#8C7B6C] block",
					children: "Prioridade"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: task.priority,
					onValueChange: (val) => onUpdate({ priority: val }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: cn("h-11 border-none font-bold text-xs rounded-xl px-4 focus:ring-0 shadow-none hover:opacity-90 transition-opacity", priorityColors.bg, priorityColors.text),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Prioridade" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "Baixa",
							children: "Baixa"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "Média",
							children: "Média"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "Alta",
							children: "Alta"
						})
					] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-[10px] font-bold uppercase tracking-widest text-[#8C7B6C] block",
					children: "Data de Entrega"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 bg-white border border-[#E8E2D9] rounded-xl px-3 h-11 relative focus-within:border-[#C2714F]/50 transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
							size: 16,
							className: "text-[#8C7B6C]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: task.deadline ? format(new Date(task.deadline), "yyyy-MM-dd") : "",
							onChange: (e) => onUpdate({ deadline: new Date(e.target.value).toISOString() }),
							className: "bg-transparent text-sm font-semibold text-[#3D2B1F] outline-none flex-1 absolute inset-0 opacity-0 cursor-pointer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-[#3D2B1F] pointer-events-none",
							children: task.deadline ? format(new Date(task.deadline), "dd 'de' MMM, yyyy", { locale: ptBR }) : "Sem data"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-[10px] font-bold uppercase tracking-widest text-[#8C7B6C] block",
					children: "Status"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: task.status,
					onValueChange: (val) => onUpdate({ status: val }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: cn("h-11 border-none font-bold text-xs rounded-xl px-4 focus:ring-0 shadow-none hover:opacity-90 transition-opacity", statusColors.bg, statusColors.text),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("w-2 h-2 rounded-full", statusColors.dot, task.status === "Em Progresso" ? "animate-pulse" : "") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "A Fazer",
							children: "A Fazer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "Em Progresso",
							children: "Em Andamento"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "Em Revisão",
							children: "Em Revisão"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "Concluído",
							children: "Concluído"
						})
					] })]
				})]
			})
		]
	});
}
function getStatusColors(status) {
	switch (status) {
		case "Em Progresso": return {
			text: "text-[#F2C166]",
			bg: "bg-[#F2C166]/10",
			dot: "bg-[#F2C166]"
		};
		case "Concluído": return {
			text: "text-[#4CAF50]",
			bg: "bg-[#4CAF50]/10",
			dot: "bg-[#4CAF50]"
		};
		case "Em Revisão": return {
			text: "text-[#9C27B0]",
			bg: "bg-[#9C27B0]/10",
			dot: "bg-[#9C27B0]"
		};
		default: return {
			text: "text-[#8C7B6C]",
			bg: "bg-[#E8E2D9]/50",
			dot: "bg-[#8C7B6C]"
		};
	}
}
function getPriorityColors(priority) {
	switch (priority) {
		case "Alta": return {
			text: "text-[#C2714F]",
			bg: "bg-[#C2714F]/10"
		};
		case "Média": return {
			text: "text-[#F2C166]",
			bg: "bg-[#F2C166]/10"
		};
		default: return {
			text: "text-[#8C7B6C]",
			bg: "bg-[#E8E2D9]/50"
		};
	}
}
function TaskSubtasks({ task, onAdd, onToggle, onUpdateTitle, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-[10px] font-bold uppercase tracking-widest text-[#8C7B6C] flex items-center",
				children: ["Subtasks", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-2 bg-[#F3EEE7] text-[#C2714F] px-1.5 py-0.5 rounded-md text-[9px]",
					children: [
						task.subtasks?.filter((st) => st.isCompleted).length || 0,
						"/",
						task.subtasks?.length || 0
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onAdd,
				className: "text-[10px] font-bold text-[#C2714F] hover:text-[#3D2B1F] uppercase tracking-widest transition-colors",
				children: "Adicionar"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [task.subtasks?.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 bg-white p-3.5 rounded-xl border border-[#E8E2D9] group transition-all hover:border-[#C2714F]/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: st.isCompleted,
						onCheckedChange: () => onToggle(st.id),
						className: "w-[18px] h-[18px] rounded-[5px] data-[state=checked]:bg-[#C2714F] data-[state=checked]:border-[#C2714F] border-[#E8E2D9] transition-colors"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: st.title,
						onChange: (e) => onUpdateTitle(st.id, e.target.value),
						placeholder: "Título da subtask",
						className: cn("flex-1 bg-transparent text-sm outline-none transition-colors font-medium", st.isCompleted ? "text-[#8C7B6C] line-through" : "text-[#3D2B1F]")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onRemove(st.id),
						className: "text-[#8C7B6C] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 })
					})
				]
			}, st.id)), (!task.subtasks || task.subtasks.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-[#8C7B6C] italic text-center py-4 bg-white/50 border border-dashed border-[#E8E2D9] rounded-xl",
				children: "Nenhuma subtask adicionada."
			})]
		})]
	});
}
function TaskActivity({ task }) {
	const mockActivity = [{
		id: "hist1",
		type: "history",
		author: task.assignee || "Sistema",
		action: "criou a tarefa",
		date: task.deadline ? (/* @__PURE__ */ new Date(new Date(task.deadline).getTime() - 864e5)).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
	}, ...(task.comments || []).map((c) => ({
		type: "comment",
		date: c.createdAt,
		...c
	}))].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "text-[10px] font-bold uppercase tracking-widest text-[#8C7B6C] mb-5 block",
		children: "Atividade"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative pl-6 before:absolute before:inset-y-2 before:left-[11px] before:w-px before:bg-[#E8E2D9] space-y-6",
		children: mockActivity.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative flex gap-4",
			children: item.type === "history" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-[30px] top-1.5 w-[14px] h-[14px] rounded-full bg-[#E8E2D9] border-[3px] border-[#FAF7F2] z-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[13px] pt-0.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-[#3D2B1F]",
						children: item.author
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[#8C7B6C] ml-1",
						children: item.action
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-[#8C7B6C] ml-2 font-medium",
						children: format(new Date(item.date), "dd MMM, HH:mm", { locale: ptBR })
					})
				]
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -left-9 top-0 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
					className: "w-7 h-7 border-2 border-[#FAF7F2]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: item.avatar }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
						className: "bg-[#F3EEE7] text-[#C2714F] text-[10px] font-bold",
						children: item.author?.slice(0, 2).toUpperCase()
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#F3EEE7] px-4 py-3 rounded-2xl rounded-tl-none text-[13px] text-[#3D2B1F] italic leading-relaxed",
					children: [
						"\"",
						item.content,
						"\""
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] text-[#8C7B6C] font-medium mt-1.5 ml-1",
					children: format(new Date(item.date), "dd 'de' MMM, HH:mm", { locale: ptBR })
				})]
			})] })
		}, item.id))
	})] });
}
function TaskDetailSheet({ task, onClose, onUpdate }) {
	const [localTask, setLocalTask] = (0, import_react.useState)(null);
	const [projects] = useProjectStore_default();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (task) setLocalTask(task);
	}, [task]);
	if (!localTask) return null;
	const handleUpdate = (updates) => {
		setLocalTask({
			...localTask,
			...updates
		});
		onUpdate(localTask.id, updates);
	};
	const addSubtask = () => {
		const newSt = {
			id: generateId("st"),
			title: "",
			isCompleted: false
		};
		handleUpdate({ subtasks: [...localTask.subtasks || [], newSt] });
	};
	const project = projects.find((p) => p.id === localTask.projectId);
	const projectName = project ? project.name : "Sem Projeto";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: !!task,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			overlayClassName: "bg-[#3D2B1F]/40 backdrop-blur-[4px]",
			className: "w-full sm:max-w-2xl p-0 flex flex-col font-inter border-l border-[#E8E2D9] bg-[#FAF7F2] gap-0 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
					className: "sr-only",
					children: "Detalhes da Tarefa"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, {
					className: "sr-only",
					children: "Visualize e edite as informações e subtarefas da tarefa selecionada."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white px-6 py-5 flex flex-col border-b border-[#E8E2D9] z-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center mb-4 pr-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-[#8C7B6C] text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "uppercase tracking-widest text-[10px]",
								children: "Projeto:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: projectName })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [
								localTask.funnelId && localTask.nodeId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										onClose();
										navigate(`/canvas/${localTask.funnelId}?nodeId=${localTask.nodeId}`);
									},
									className: "h-8 px-3 mr-2 rounded-full bg-[#F3EEE7] text-[#C2714F] text-xs font-bold hover:bg-[#C2714F] hover:text-white transition-colors flex items-center gap-1.5 shadow-sm hover:scale-105 transform",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { size: 14 }), " Canvas"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "w-8 h-8 flex items-center justify-center rounded-full text-[#8C7B6C] hover:bg-[#F3EEE7] hover:text-[#3D2B1F] transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { size: 16 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "w-8 h-8 flex items-center justify-center rounded-full text-[#8C7B6C] hover:bg-[#F3EEE7] hover:text-[#3D2B1F] transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { size: 16 })
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleUpdate({ status: localTask.status === "Concluída" ? "Pendente" : "Concluída" }),
							className: cn("w-7 h-7 rounded-full border flex items-center justify-center transition-colors shrink-0", localTask.status === "Concluída" ? "bg-[#4CAF50] border-[#4CAF50] text-white" : "border-[#E8E2D9] text-transparent hover:border-[#C2714F] hover:text-[#C2714F]/50"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								size: 16,
								strokeWidth: 3
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: localTask.title,
							onChange: (e) => handleUpdate({ title: e.target.value }),
							className: "text-2xl font-bold text-[#3D2B1F] bg-transparent outline-none flex-1 placeholder:text-[#E8E2D9]",
							placeholder: "Título da tarefa"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto task-scrollbar p-6 pb-32",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskMetadata, {
							task: localTask,
							onUpdate: handleUpdate
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] font-bold uppercase tracking-widest text-[#8C7B6C] mb-3 block",
								children: "Descrição"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-white rounded-2xl p-5 border border-[#E8E2D9] focus-within:border-[#C2714F]/50 focus-within:ring-2 focus-within:ring-[#C2714F]/10 transition-all",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: localTask.description || "",
									onChange: (e) => handleUpdate({ description: e.target.value }),
									placeholder: "Adicione mais detalhes a esta tarefa...",
									className: "w-full bg-transparent outline-none text-[#3D2B1F] text-sm resize-none min-h-[120px] placeholder:text-[#8C7B6C]/50"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskSubtasks, {
							task: localTask,
							onAdd: addSubtask,
							onToggle: (id) => handleUpdate({ subtasks: localTask.subtasks?.map((st) => st.id === id ? {
								...st,
								isCompleted: !st.isCompleted
							} : st) }),
							onUpdateTitle: (id, title) => handleUpdate({ subtasks: localTask.subtasks?.map((st) => st.id === id ? {
								...st,
								title
							} : st) }),
							onRemove: (id) => handleUpdate({ subtasks: localTask.subtasks?.filter((st) => st.id !== id) })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskActivity, { task: localTask })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-0 left-0 right-0 bg-[#FAF7F2] border-t border-[#E8E2D9] p-4 flex items-end gap-3 z-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						className: "w-9 h-9 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
							className: "bg-[#C2714F] text-white text-xs font-bold",
							children: "ME"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 bg-white rounded-2xl border border-[#E8E2D9] flex flex-col p-2 focus-within:border-[#C2714F]/50 focus-within:ring-2 focus-within:ring-[#C2714F]/10 transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							placeholder: "Escreva um comentário...",
							className: "w-full bg-transparent outline-none text-sm text-[#3D2B1F] placeholder:text-[#8C7B6C] resize-none h-[40px] px-2 py-1"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 text-[#8C7B6C]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "p-1.5 hover:text-[#C2714F] hover:bg-[#F3EEE7] rounded-md transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtSign, { size: 14 })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "p-1.5 hover:text-[#C2714F] hover:bg-[#F3EEE7] rounded-md transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { size: 14 })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "w-8 h-8 rounded-full bg-[#C2714F] text-white flex items-center justify-center hover:bg-[#a65d3f] transition-all shadow-sm hover:scale-105 transform shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
									size: 14,
									className: "ml-0.5"
								})
							})]
						})]
					})]
				})
			]
		})
	});
}
export { TasksBoard as n, TaskDetailSheet as t };

//# sourceMappingURL=TaskDetailSheet-DDBKTQP9.js.map