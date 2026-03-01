import { n as TasksBoard, t as TaskDetailSheet } from "./TaskDetailSheet-B7uemqs2.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DOIyDmDW.js";
import { E as Button, Jt as require_jsx_runtime, Pt as createLucideIcon, _t as Plus, bt as Network, d as useQuickActionStore_default, in as require_react, k as useTaskStore_default, m as format, on as __toESM, tn as useNavigate } from "./index-BR9ufIAD.js";
import { t as Badge } from "./badge-Cfv7mjn-.js";
import "./card-9V4xMHlM.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-ijDpcKPD.js";
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
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var statusConfig = {
	Pendente: {
		label: "Todo",
		color: "bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200"
	},
	"Em Progresso": {
		label: "In Progress",
		color: "bg-amber-100 text-amber-700 border-transparent hover:bg-amber-200"
	},
	Concluída: {
		label: "Done",
		color: "bg-green-100 text-green-700 border-transparent hover:bg-green-200"
	}
};
var priorityConfig = {
	Baixa: {
		label: "LOW",
		color: "bg-slate-100 text-slate-700 border-transparent"
	},
	Média: {
		label: "MEDIUM",
		color: "bg-indigo-500 text-white border-transparent"
	},
	Alta: {
		label: "HIGH",
		color: "bg-red-500 text-white border-transparent"
	}
};
function TasksList({ tasks, onRowClick }) {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border bg-card overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
			className: "bg-muted/30",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "font-semibold text-foreground",
					children: "Title"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "font-semibold text-foreground",
					children: "Project"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "font-semibold text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							"Priority",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "w-3 h-3 text-muted-foreground" })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "font-semibold text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							"Deadline",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "w-3 h-3 text-muted-foreground" })
						]
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
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [tasks.map((t) => {
			const sc = statusConfig[t.status] || {
				label: t.status,
				color: "bg-gray-100 text-gray-700"
			};
			const pc = priorityConfig[t.priority];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				onClick: () => onRowClick(t),
				className: "cursor-pointer hover:bg-muted/50 transition-colors",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: t.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "font-normal text-teal-600 border-teal-200 bg-teal-50",
						children: t.category || (t.projectId === "p1" ? "Backend API" : t.projectId === "p2" ? "Marketing" : "NovaBoard App")
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: pc.color,
						children: pc.label
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-muted-foreground",
						children: t.deadline ? format(new Date(t.deadline), "MMM dd, yyyy") : t.dateLabel || "-"
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
							className: "text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-100",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, {
								size: 14,
								className: "mr-1.5"
							}), " Canvas"]
						})
					})
				]
			}, t.id);
		}), tasks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			colSpan: 6,
			className: "h-24 text-center text-muted-foreground",
			children: "No tasks found."
		}) })] })] })
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
						className: "text-[28px] font-bold tracking-tight text-[#3D2B1F]",
						children: "Tarefas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[15px] font-medium text-[#8C7B6C]",
						children: "Gerencie seu fluxo de trabalho e prioridades"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-white border border-[#E8E2D9] h-10 p-1 rounded-lg shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "board",
							className: "rounded-md px-4 py-1.5 text-[13px] font-bold data-[state=active]:bg-[#FAF7F2] data-[state=active]:text-[#3D2B1F] text-[#8C7B6C] data-[state=active]:shadow-none",
							children: "Board"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "list",
							className: "rounded-md px-4 py-1.5 text-[13px] font-bold data-[state=active]:bg-[#FAF7F2] data-[state=active]:text-[#3D2B1F] text-[#8C7B6C] data-[state=active]:shadow-none",
							children: "Lista"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setAction({
							type: "task",
							mode: "create"
						}),
						className: "bg-[#C2714F] hover:bg-[#a65d3f] text-white rounded-full px-5 h-10 shadow-none font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							size: 16,
							className: "mr-2 stroke-[3]"
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

//# sourceMappingURL=Tasks-DOgn6GAf.js.map