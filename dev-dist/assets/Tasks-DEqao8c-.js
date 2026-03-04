import { n as TasksBoard, t as TaskDetailSheet } from "./TaskDetailSheet-D0_oCjnS.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CctlRPcX.js";
import { Lt as require_react, O as useTaskStore_default, Ot as require_jsx_runtime, Pt as useNavigate, T as Button, ct as Network, d as useQuickActionStore_default, m as format, st as Plus, vt as createLucideIcon, zt as __toESM } from "./index-C59AXJt2.js";
import { t as Badge } from "./badge-E-XZ20H7.js";
import "./card-BdPGic5X.js";
import { t as EmptyState } from "./empty-state-BRNxdKNW.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BhnccXWw.js";
var ArrowUpDown = createLucideIcon("arrow-up-down", [
	["path", {
		d: "m21 16-4 4-4-4",
		key: "f6ql7i"
	}],
	["path", {
		d: "M17 20V4",
		key: "1ejh1v"
	}],
	["path", {
		d: "m3 8 4-4 4 4",
		key: "11wl7u"
	}],
	["path", {
		d: "M7 4v16",
		key: "1glfcx"
	}]
]);
var Inbox = createLucideIcon("inbox", [["polyline", {
	points: "22 12 16 12 14 15 10 15 8 12 2 12",
	key: "o97t9d"
}], ["path", {
	d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
	key: "oot6mr"
}]]);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var statusConfig = {
	Pendente: {
		label: "Todo",
		color: "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
	},
	"Em Progresso": {
		label: "In Progress",
		color: "bg-warning/10 text-warning border-transparent hover:bg-warning/20"
	},
	Concluída: {
		label: "Done",
		color: "bg-success/10 text-success border-transparent hover:bg-success/20"
	}
};
var priorityConfig = {
	Baixa: {
		label: "BAIXA",
		color: "bg-muted text-muted-foreground border-transparent"
	},
	Média: {
		label: "MÉDIA",
		color: "bg-info/10 text-info border-transparent"
	},
	Alta: {
		label: "ALTA",
		color: "bg-danger/10 text-danger border-transparent"
	}
};
function TasksList({ tasks, onRowClick }) {
	const navigate = useNavigate();
	if (tasks.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		icon: Inbox,
		title: "Sem Tarefas",
		description: "Não há nenhuma tarefa nesta lista."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border border-border bg-card overflow-hidden shadow-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
			className: "bg-muted/30",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "font-semibold text-foreground",
					children: "Título"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "font-semibold text-foreground",
					children: "Categoria"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "font-semibold text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							"Prioridade",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "w-3 h-3 text-muted-foreground" })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "font-semibold text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: ["Prazo ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "w-3 h-3 text-muted-foreground" })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-right font-semibold text-foreground",
					children: "Status"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-right font-semibold text-foreground",
					children: "Ações"
				})
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: tasks.map((t) => {
			const sc = statusConfig[t.status] || {
				label: t.status,
				color: "bg-muted text-muted-foreground"
			};
			const pc = priorityConfig[t.priority];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				onClick: () => onRowClick(t),
				className: "cursor-pointer hover:bg-muted/50 transition-colors",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium text-foreground",
						children: t.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "font-normal text-muted-foreground border-border bg-background",
						children: t.category || "Geral"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: pc.color,
						children: pc.label
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-muted-foreground",
						children: t.deadline ? format(new Date(t.deadline), "dd/MM/yyyy") : t.dateLabel || "-"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: sc.color,
							children: sc.label
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: t.funnelId && t.nodeId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: (e) => {
								e.stopPropagation();
								navigate(`/canvas/${t.funnelId}?nodeId=${t.nodeId}`);
							},
							className: "text-primary border-primary/20 bg-primary/5 hover:bg-primary/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, {
								size: 14,
								className: "mr-1.5"
							}), " Canvas"]
						})
					})
				]
			}, t.id);
		}) })] })
	});
}
function Tasks() {
	const [tasks, setTasks] = useTaskStore_default();
	const [, setAction] = useQuickActionStore_default();
	const [selectedTask, setSelectedTask] = (0, import_react.useState)(null);
	const updateTask = (taskId, updates) => {
		setTasks(tasks.map((t) => t.id === taskId ? {
			...t,
			...updates
		} : t));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-[1600px] w-full mx-auto h-full flex flex-col animate-fade-in",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "board",
			className: "flex-1 flex flex-col min-h-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold tracking-tight text-foreground",
						children: "Tarefas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-medium text-muted-foreground",
						children: "Gerencie seu fluxo de trabalho e prioridades"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "board",
							className: "px-4 py-1.5 font-bold",
							children: "Board"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "list",
							className: "px-4 py-1.5 font-bold",
							children: "Lista"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setAction({
							type: "task",
							mode: "create"
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							size: 16,
							className: "mr-2"
						}), " Nova Tarefa"]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-auto pb-8 no-scrollbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "board",
					className: "mt-0 h-full border-none outline-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TasksBoard, {
						tasks,
						updateTask,
						onCardClick: setSelectedTask
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "list",
					className: "mt-0 h-full border-none outline-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TasksList, {
						tasks,
						onRowClick: setSelectedTask
					})
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskDetailSheet, {
			task: selectedTask,
			onClose: () => setSelectedTask(null),
			onUpdate: updateTask
		})]
	});
}
export { Tasks as default };

//# sourceMappingURL=Tasks-DEqao8c-.js.map