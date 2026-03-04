import { D as useTaskStore_default, Vt as __toESM, at as Plus, kt as require_jsx_runtime, m as useQuickActionStore_default, nt as SquareCheckBig, w as Button } from "./index-CBmeAG5q.js";
import { t as EmptyState } from "./empty-state-DM-PkPFf.js";
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function Tasks() {
	const [tasks] = useTaskStore_default();
	const [, setAction] = useQuickActionStore_default();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in flex flex-col h-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold tracking-tight text-foreground",
					children: "Tarefas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-base font-medium",
					children: "Gerencie todas as atividades do seu workspace."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => setAction({
					type: "task",
					mode: "create"
				}),
				className: "font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					size: 16,
					className: "mr-2"
				}), " Nova Tarefa"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: SquareCheckBig,
				title: "Central de Tarefas",
				description: "A visualização Kanban detalhada será implementada em breve. Use o dashboard para ver as tarefas pendentes por enquanto.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setAction({
						type: "task",
						mode: "create"
					}),
					children: "Adicionar Nova Tarefa"
				})
			})
		})]
	});
}
export { Tasks as default };

//# sourceMappingURL=Tasks-C-7bhivZ.js.map