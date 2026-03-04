import { D as Input, Gt as __toESM, Ht as require_react, M as useFunnelStore_default, Nt as require_jsx_runtime, O as Button, dt as Plus, ft as Network, m as useQuickActionStore_default, ut as Search, zt as useNavigate } from "./index-BBV0FkD8.js";
import { t as Badge } from "./badge-C2lK6XB7.js";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BB2tOtMW.js";
import { t as EmptyState } from "./empty-state-bzBu_vBK.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function Funnels() {
	const [funnels] = useFunnelStore_default();
	const [, setAction] = useQuickActionStore_default();
	const [search, setSearch] = (0, import_react.useState)("");
	const navigate = useNavigate();
	const filteredFunnels = funnels.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold tracking-tight text-foreground",
						children: "Canvas & Funis"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-medium text-muted-foreground",
						children: "Mapeie a jornada do seu cliente e arquiteturas de conversão"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setAction({
						type: "canvas",
						mode: "create"
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						size: 16,
						className: "mr-2"
					}), " Novo Funil"]
				})]
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
					className: "pl-10"
				})]
			}),
			filteredFunnels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: Network,
				title: "Nenhum funil encontrado",
				description: "Você ainda não criou nenhum funil. Comece agora mapeando sua primeira estratégia.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setAction({
						type: "canvas",
						mode: "create"
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						size: 16,
						className: "mr-2"
					}), " Criar Meu Primeiro Funil"]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				children: filteredFunnels.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "cursor-pointer hover-lift group overflow-hidden flex flex-col",
					onClick: () => navigate(`/canvas/${f.id}`),
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
			})
		]
	});
}
export { Funnels as default };

//# sourceMappingURL=Funnels-DpiyXA57.js.map