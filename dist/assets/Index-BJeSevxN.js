import { t as ArrowRight } from "./arrow-right-uMwOpU6q.js";
import { t as Clock } from "./clock-HXeWqZTx.js";
import { $t as Link, A as useFunnelStore_default, Dt as CircleAlert, E as Button, Jt as require_jsx_runtime, O as useDocumentStore_default, Pt as createLucideIcon, St as Layers, T as Input, Tt as FileText, _ as normalizeDates, bt as Network, d as useQuickActionStore_default, f as ptBR, g as startOfDay, h as isSameDay, ht as SquareCheckBig, in as require_react, j as useProjectStore_default, k as useTaskStore_default, m as format, mt as Target, on as __toESM, p as isBefore, v as startOfWeek, y as constructFrom } from "./index-BBQ0CWHy.js";
import { t as Badge } from "./badge-DCdqCiWu.js";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-D1b0ahcN.js";
var CalendarClock = createLucideIcon("calendar-clock", [
	["path", {
		d: "M16 14v2.2l1.6 1",
		key: "fo4ql5"
	}],
	["path", {
		d: "M16 2v4",
		key: "4m81vk"
	}],
	["path", {
		d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5",
		key: "1osxxc"
	}],
	["path", {
		d: "M3 10h5",
		key: "r794hk"
	}],
	["path", {
		d: "M8 2v4",
		key: "1cmpym"
	}],
	["circle", {
		cx: "16",
		cy: "16",
		r: "6",
		key: "qoo3c4"
	}]
]);
var CalendarDays = createLucideIcon("calendar-days", [
	["path", {
		d: "M8 2v4",
		key: "1cmpym"
	}],
	["path", {
		d: "M16 2v4",
		key: "4m81vk"
	}],
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "4",
		rx: "2",
		key: "1hopcy"
	}],
	["path", {
		d: "M3 10h18",
		key: "8toen8"
	}],
	["path", {
		d: "M8 14h.01",
		key: "6423bh"
	}],
	["path", {
		d: "M12 14h.01",
		key: "1etili"
	}],
	["path", {
		d: "M16 14h.01",
		key: "1gbofw"
	}],
	["path", {
		d: "M8 18h.01",
		key: "lrp35t"
	}],
	["path", {
		d: "M12 18h.01",
		key: "mhygvu"
	}],
	["path", {
		d: "M16 18h.01",
		key: "kzsmim"
	}]
]);
function constructNow(date) {
	return constructFrom(date, Date.now());
}
function isSameWeek(laterDate, earlierDate, options) {
	const [laterDate_, earlierDate_] = normalizeDates(options?.in, laterDate, earlierDate);
	return +startOfWeek(laterDate_, options) === +startOfWeek(earlierDate_, options);
}
function isThisWeek(date, options) {
	return isSameWeek(constructFrom(options?.in || date, date), constructNow(options?.in || date), options);
}
function isToday(date, options) {
	return isSameDay(constructFrom(options?.in || date, date), constructNow(options?.in || date));
}
function startOfToday(options) {
	return startOfDay(Date.now(), options);
}
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function isValidDate(dateStr) {
	if (!dateStr) return false;
	const d = new Date(dateStr);
	return !isNaN(d.getTime());
}
function safeFormatDate(dateStr, dateFormat = "dd/MM") {
	if (!isValidDate(dateStr)) return "---";
	return format(new Date(dateStr), dateFormat);
}
function Index() {
	const [projects] = useProjectStore_default();
	const [tasks] = useTaskStore_default();
	const [funnels] = useFunnelStore_default();
	const [docs] = useDocumentStore_default();
	const [, setAction] = useQuickActionStore_default();
	const [quickTask, setQuickTask] = (0, import_react.useState)("");
	const activeProjects = projects.filter((p) => p.status === "Ativo").length;
	const pendingTasks = tasks.filter((t) => t.status !== "Concluído");
	const completedTasks = tasks.filter((t) => t.status === "Concluído").length;
	const activeFunnels = funnels.filter((f) => f.status === "Ativo").length;
	const today = startOfToday();
	const overdueTasks = pendingTasks.filter((t) => isValidDate(t.deadline) && isBefore(new Date(t.deadline), today));
	const todayTasks = pendingTasks.filter((t) => isValidDate(t.deadline) && isToday(new Date(t.deadline)));
	const weekTasks = pendingTasks.filter((t) => {
		if (!isValidDate(t.deadline)) return false;
		const d = new Date(t.deadline);
		return isThisWeek(d) && !isToday(d) && !isBefore(d, today);
	});
	const addQuickTask = (e) => {
		e.preventDefault();
		if (!quickTask.trim()) return;
		setAction({
			type: "task",
			mode: "create"
		});
		setQuickTask("");
	};
	const getProjectStats = (projectId) => {
		return {
			pFunnels: funnels.filter((f) => f.projectId === projectId).length,
			pTasks: tasks.filter((t) => t.projectId === projectId).length,
			pDocs: docs.filter((d) => d.projectId === projectId).length
		};
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold tracking-tight text-foreground",
						children: "Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-success animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
							children: "Sistema Online"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						children: "Exportar Relatório"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setAction({
							type: "task",
							mode: "create"
						}),
						children: "Quick Action"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold tracking-tight text-foreground",
					children: "Bom dia, Diego"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground capitalize text-base",
					children: format(/* @__PURE__ */ new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "hover-lift",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-sm font-medium text-muted-foreground",
								children: "Projetos Ativos"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-muted-foreground" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-4xl font-bold text-foreground",
							children: activeProjects
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: [projects.length, " total"]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "hover-lift",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-sm font-medium text-muted-foreground",
								children: "Funis Ativos"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4 text-muted-foreground" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-4xl font-bold text-foreground",
							children: activeFunnels
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: [funnels.length, " total"]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "hover-lift",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-sm font-medium text-muted-foreground",
								children: "Tasks Pendentes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-muted-foreground" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-4xl font-bold text-warning",
							children: pendingTasks.length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: [tasks.length, " total"]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "hover-lift",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-sm font-medium text-muted-foreground",
								children: "Tasks Concluídas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "h-4 w-4 text-muted-foreground" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-4xl font-bold text-success",
							children: completedTasks
						}), tasks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 bg-muted rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-success rounded-full transition-all",
									style: { width: `${Math.round(completedTasks / tasks.length * 100)}%` }
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: [Math.round(completedTasks / tasks.length * 100), "% concluído"]
							})]
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold tracking-tight text-foreground",
						children: "Plano de Ação"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: overdueTasks.length > 0 ? "border-danger/30 bg-danger/5" : "",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "flex flex-row items-center justify-between pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
										className: "text-sm font-medium text-danger flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { size: 14 }), " Atrasadas"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "bg-danger/10 text-danger border-danger/20",
										children: overdueTasks.length
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "space-y-2",
									children: [overdueTasks.slice(0, 4).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5 border-b border-border last:border-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium text-foreground truncate flex-1 mr-2",
											children: t.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-danger font-semibold shrink-0",
											children: safeFormatDate(t.deadline, "dd/MM")
										})]
									}, t.id)), overdueTasks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground py-2",
										children: "Nenhuma tarefa atrasada 🎉"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: todayTasks.length > 0 ? "border-warning/30 bg-warning/5" : "",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "flex flex-row items-center justify-between pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
										className: "text-sm font-medium text-warning flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { size: 14 }), " Hoje"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "bg-warning/10 text-warning border-warning/20",
										children: todayTasks.length
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "space-y-2",
									children: [todayTasks.slice(0, 4).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5 border-b border-border last:border-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium text-foreground truncate flex-1 mr-2",
											children: t.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] px-1.5 py-0",
											children: t.priority
										})]
									}, t.id)), todayTasks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground py-2",
										children: "Nenhuma tarefa para hoje"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "flex flex-row items-center justify-between pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-sm font-medium text-info flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { size: 14 }), " Esta Semana"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "bg-info/10 text-info border-info/20",
									children: weekTasks.length
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-2",
								children: [weekTasks.slice(0, 4).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between py-1.5 border-b border-border last:border-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium text-foreground truncate flex-1 mr-2",
										children: t.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground font-semibold shrink-0",
										children: safeFormatDate(t.deadline, "dd/MM")
									})]
								}, t.id)), weekTasks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground py-2",
									children: "Nenhuma tarefa esta semana"
								})]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: addQuickTask,
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "➕ Adicionar task rápida...",
							value: quickTask,
							onChange: (e) => setQuickTask(e.target.value),
							className: "flex-1"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "dark",
							size: "sm",
							children: "Criar"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 md:grid-cols-1 lg:max-w-3xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex flex-col bg-foreground text-background relative overflow-hidden border-none shadow-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-12 -top-12 w-48 h-48 rounded-full border-[12px] border-background opacity-5 pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-12 -bottom-12 w-32 h-32 rounded-full border-[8px] border-background opacity-5 pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "relative z-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "flex items-center gap-2 text-background",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
									size: 18,
									className: "text-primary"
								}), " Próximas Tasks"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "flex-1 relative z-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: pendingTasks.slice(0, 5).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-background/20 pb-3 last:border-0 last:pb-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-base text-background",
											children: t.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs uppercase font-semibold text-background/60",
											children: safeFormatDate(t.deadline, "dd/MM/yyyy")
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: t.priority === "Alta" ? "bg-danger text-danger-foreground border-none" : "bg-background/20 text-background border-none",
										children: t.priority
									})]
								}, t.id))
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold tracking-tight text-foreground",
						children: "Projetos Recentes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/projetos",
						className: "text-sm text-primary hover:underline font-medium flex items-center gap-1",
						children: ["Ver todos ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-3",
					children: projects.slice(0, 3).map((p) => {
						const stats = getProjectStats(p.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: `/projetos/${p.id}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "hover-lift cursor-pointer h-full group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
									className: "pb-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-start",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
											className: "text-xl group-hover:text-primary transition-colors",
											children: p.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: p.status === "Ativo" ? "bg-success/10 text-success border-none" : "bg-muted text-muted-foreground border-none",
											children: p.status
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground line-clamp-2 mb-3",
									children: p.description
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { size: 12 }),
												" ",
												stats.pFunnels,
												" funis"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { size: 12 }),
												" ",
												stats.pTasks,
												" tasks"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 12 }),
												" ",
												stats.pDocs,
												" docs"
											]
										})
									]
								})] })]
							})
						}, p.id);
					})
				})]
			})
		]
	});
}
export { Index as default };

//# sourceMappingURL=Index-BJeSevxN.js.map