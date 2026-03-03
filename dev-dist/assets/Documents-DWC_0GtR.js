import { t as CanvasBoard } from "./CanvasBoard-B5XHPPe4.js";
import { n as Image } from "./useResourceStore-Bruwuntg.js";
import { t as List } from "./list-BsOJe8Z4.js";
import { i as ViewToggle, n as FolderBreadcrumbs, r as MoveDialog, t as CreateFolderDialog } from "./FolderComponents-BkH-MEAD.js";
import "./tabs-CwtWyOT0.js";
import { t as Trash2 } from "./trash-2-CuduQ2jc.js";
import { A as useFunnelStore_default, At as ChevronLeft, E as Button, Et as Download, F as DialogDescription, Jt as require_jsx_runtime, L as DialogHeader, N as Dialog, O as useDocumentStore_default, Ot as ChevronUp, P as DialogContent, Pt as createLucideIcon, Qt as useToast, R as DialogTitle, T as Input, Tt as FileText, _t as Plus, a as SelectItem, bt as Network, ft as cn, gt as Search, i as SelectContent, in as require_react, j as useProjectStore_default, jt as ChevronDown, o as SelectTrigger, on as __toESM, pt as X, r as Select, s as SelectValue, tn as useNavigate, u as generateId, vt as PanelLeft, w as Separator, wt as Folder, yt as PanelLeftClose, z as DialogTrigger } from "./index-BBQ0CWHy.js";
import "./badge-DCdqCiWu.js";
import { t as ConfirmDialog } from "./ConfirmDialog-CKn8aREZ.js";
import { t as useFolderStore_default } from "./useFolderStore-B5wMy0Mu.js";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-D1b0ahcN.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C1CXOUul.js";
import "./breadcrumb-CxbOsWWf.js";
var ArrowDownFromLine = createLucideIcon("arrow-down-from-line", [
	["path", {
		d: "M19 3H5",
		key: "1236rx"
	}],
	["path", {
		d: "M12 21V7",
		key: "gj6g52"
	}],
	["path", {
		d: "m6 15 6 6 6-6",
		key: "h15q88"
	}]
]);
var ArrowLeftFromLine = createLucideIcon("arrow-left-from-line", [
	["path", {
		d: "m9 6-6 6 6 6",
		key: "7v63n9"
	}],
	["path", {
		d: "M3 12h14",
		key: "13k4hi"
	}],
	["path", {
		d: "M21 19V5",
		key: "b4bplr"
	}]
]);
var ArrowRightFromLine = createLucideIcon("arrow-right-from-line", [
	["path", {
		d: "M3 5v14",
		key: "1nt18q"
	}],
	["path", {
		d: "M21 12H7",
		key: "13ipq5"
	}],
	["path", {
		d: "m15 18 6-6-6-6",
		key: "6tx3qv"
	}]
]);
var ArrowUpFromLine = createLucideIcon("arrow-up-from-line", [
	["path", {
		d: "m18 9-6-6-6 6",
		key: "kcunyi"
	}],
	["path", {
		d: "M12 3v14",
		key: "7cf3v8"
	}],
	["path", {
		d: "M5 21h14",
		key: "11awu3"
	}]
]);
var Bold = createLucideIcon("bold", [["path", {
	d: "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8",
	key: "mg9rjx"
}]]);
var GripVertical = createLucideIcon("grip-vertical", [
	["circle", {
		cx: "9",
		cy: "12",
		r: "1",
		key: "1vctgf"
	}],
	["circle", {
		cx: "9",
		cy: "5",
		r: "1",
		key: "hp0tcf"
	}],
	["circle", {
		cx: "9",
		cy: "19",
		r: "1",
		key: "fkjjf6"
	}],
	["circle", {
		cx: "15",
		cy: "12",
		r: "1",
		key: "1tmaij"
	}],
	["circle", {
		cx: "15",
		cy: "5",
		r: "1",
		key: "19l28e"
	}],
	["circle", {
		cx: "15",
		cy: "19",
		r: "1",
		key: "f4zoj3"
	}]
]);
var Heading1 = createLucideIcon("heading-1", [
	["path", {
		d: "M4 12h8",
		key: "17cfdx"
	}],
	["path", {
		d: "M4 18V6",
		key: "1rz3zl"
	}],
	["path", {
		d: "M12 18V6",
		key: "zqpxq5"
	}],
	["path", {
		d: "m17 12 3-2v8",
		key: "1hhhft"
	}]
]);
var Heading2 = createLucideIcon("heading-2", [
	["path", {
		d: "M4 12h8",
		key: "17cfdx"
	}],
	["path", {
		d: "M4 18V6",
		key: "1rz3zl"
	}],
	["path", {
		d: "M12 18V6",
		key: "zqpxq5"
	}],
	["path", {
		d: "M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1",
		key: "9jr5yi"
	}]
]);
var Italic = createLucideIcon("italic", [
	["line", {
		x1: "19",
		x2: "10",
		y1: "4",
		y2: "4",
		key: "15jd3p"
	}],
	["line", {
		x1: "14",
		x2: "5",
		y1: "20",
		y2: "20",
		key: "bu0au3"
	}],
	["line", {
		x1: "15",
		x2: "9",
		y1: "4",
		y2: "20",
		key: "uljnxc"
	}]
]);
var Quote = createLucideIcon("quote", [["path", {
	d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
	key: "rib7q0"
}], ["path", {
	d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
	key: "1ymkrd"
}]]);
var SeparatorHorizontal = createLucideIcon("separator-horizontal", [
	["path", {
		d: "m16 16-4 4-4-4",
		key: "3dv8je"
	}],
	["path", {
		d: "M3 12h18",
		key: "1i2n21"
	}],
	["path", {
		d: "m8 8 4-4 4 4",
		key: "2bscm2"
	}]
]);
var Table$1 = createLucideIcon("table", [
	["path", {
		d: "M12 3v18",
		key: "108xh3"
	}],
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
	}]
]);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var getCanvasPreviewInnerHtml = (canvas) => {
	const nodes = canvas.nodes;
	const edges = canvas.edges;
	let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
	nodes.forEach((n) => {
		if (n.x < minX) minX = n.x;
		if (n.x + 280 > maxX) maxX = n.x + 280;
		if (n.y < minY) minY = n.y;
		if (n.y + 74 > maxY) maxY = n.y + 74;
	});
	const containerWidth = 600;
	const containerHeight = 240;
	if (nodes.length === 0) {
		minX = 0;
		maxX = containerWidth;
		minY = 0;
		maxY = containerHeight;
	}
	const padding = 24;
	const contentWidth = maxX - minX || containerWidth;
	const contentHeight = maxY - minY || containerHeight;
	const scale = Math.min((containerWidth - padding * 2) / contentWidth, (containerHeight - padding * 2) / contentHeight, 1);
	const xOffset = (containerWidth - contentWidth * scale) / 2 - minX * scale;
	const yOffset = (containerHeight - contentHeight * scale) / 2 - minY * scale;
	const nodesHtml = nodes.map((n) => {
		return `<div style="position: absolute; left: ${n.x * scale + xOffset}px; top: ${n.y * scale + yOffset}px; width: ${280 * scale}px; height: ${74 * scale}px; background: hsl(var(--card)); border: 1px solid hsl(var(--border)); border-radius: ${8 * scale}px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); display: flex; align-items: center; padding: ${8 * scale}px; box-sizing: border-box; overflow: hidden; pointer-events: none;">
      <div style="flex-shrink: 0; width: ${24 * scale}px; height: ${24 * scale}px; background: hsl(var(--muted)); border-radius: ${6 * scale}px; margin-right: ${10 * scale}px; border: 1px solid hsl(var(--border)); display: flex; align-items: center; justify-content: center; color: hsl(var(--muted-foreground));">
        <svg xmlns="http://www.w3.org/2000/svg" width="${14 * scale}" height="${14 * scale}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>
      </div>
      <div style="min-width: 0; flex: 1;">
         <div style="font-size: ${12 * scale}px; font-weight: 600; color: hsl(var(--foreground)); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2;">${n.data.name}</div>
         <div style="font-size: ${10 * scale}px; color: hsl(var(--muted-foreground)); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: ${2 * scale}px;">${n.data.subtitle || "Configure this step"}</div>
      </div>
    </div>`;
	}).join("");
	const edgesHtml = edges.map((e) => {
		const sourceNode = nodes.find((n) => n.id === e.source);
		const targetNode = nodes.find((n) => n.id === e.target);
		if (!sourceNode || !targetNode) return "";
		const startX = (sourceNode.x + 280) * scale + xOffset;
		const startY = (sourceNode.y + 37) * scale + yOffset;
		const endX = targetNode.x * scale + xOffset;
		const endY = (targetNode.y + 37) * scale + yOffset;
		return `<path d="${`M ${startX} ${startY} C ${startX + 30 * scale} ${startY}, ${endX - 30 * scale} ${endY}, ${endX} ${endY}`}" stroke="hsl(var(--border))" stroke-width="${2 * scale}" fill="none" pointer-events="none" />`;
	}).join("");
	const emptyStateHtml = nodes.length === 0 ? `
    <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: hsl(var(--muted-foreground)); pointer-events: none;">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 8px; opacity: 0.5;"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 17V7h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z"/></svg>
      <span style="font-size: 13px; font-weight: 500;">Canvas vazio</span>
    </div>
  ` : "";
	return `
    <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: hsl(var(--foreground)); font-family: inherit; line-height: 1; pointer-events: none;">${canvas.name}</h4>
    <div class="border border-border bg-muted/20 rounded-xl overflow-hidden shadow-sm cursor-pointer transition-all hover:border-primary/40 hover:shadow-md ring-offset-background hover:ring-1 hover:ring-primary/20" style="width: 100%; max-width: 600px; height: ${containerHeight}px; position: relative;">
      <div style="position: absolute; inset: 0; background-image: radial-gradient(hsl(var(--border)) 1px, transparent 0); background-size: 16px 16px; opacity: 0.4; pointer-events: none;"></div>
      ${emptyStateHtml}
      <svg style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;">
        ${edgesHtml}
      </svg>
      ${nodesHtml}
      <div class="absolute inset-0 flex items-center justify-center gap-3 bg-background/60 backdrop-blur-[2px] opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
         <div data-action="preview" class="bg-card px-4 py-2 rounded-xl shadow-lg text-sm font-semibold text-foreground flex items-center gap-2 transform translate-y-2 transition-all hover:bg-muted border border-border cursor-pointer pointer-events-auto group-hover:translate-y-0">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
           Visualizar Lateral
         </div>
         <div data-action="navigate" class="bg-primary px-4 py-2 rounded-xl shadow-lg text-sm font-semibold text-primary-foreground flex items-center gap-2 transform translate-y-2 transition-all hover:brightness-110 border border-primary cursor-pointer pointer-events-auto group-hover:translate-y-0">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/><path d="m21 3-9 9"/><path d="M15 3h6v6"/></svg>
           Ir até o Canvas
         </div>
      </div>
    </div>
  `;
};
function RichTextEditor({ doc, onChange, onTitleChange, onProjectChange }) {
	const navigate = useNavigate();
	const editorRef = (0, import_react.useRef)(null);
	const containerRef = (0, import_react.useRef)(null);
	const [funnels, setFunnels] = useFunnelStore_default();
	const [projects] = useProjectStore_default();
	const [canvasModalOpen, setCanvasModalOpen] = (0, import_react.useState)(false);
	const [selectedCanvasId, setSelectedCanvasId] = (0, import_react.useState)(null);
	const [imageModalOpen, setImageModalOpen] = (0, import_react.useState)(false);
	const [imageUrl, setImageUrl] = (0, import_react.useState)("");
	const [savedRange, setSavedRange] = (0, import_react.useState)(null);
	const [editingCanvasId, setEditingCanvasId] = (0, import_react.useState)(null);
	const [isOutlineOpen, setIsOutlineOpen] = (0, import_react.useState)(false);
	const [activeTableNode, setActiveTableNode] = (0, import_react.useState)(null);
	const [activeTableCell, setActiveTableCell] = (0, import_react.useState)(null);
	const [headers, setHeaders] = (0, import_react.useState)([]);
	const extractHeaders = (0, import_react.useCallback)(() => {
		if (!editorRef.current) return;
		const headerElements = editorRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6");
		const extracted = [];
		headerElements.forEach((el, index) => {
			if (!el.id) el.id = `header-${index}-${Date.now()}`;
			extracted.push({
				id: el.id,
				text: el.textContent || "Sem Título",
				level: parseInt(el.tagName.replace("H", ""), 10)
			});
		});
		setHeaders(extracted);
	}, []);
	const [panelWidth, setPanelWidth] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			if (window.innerWidth >= 1280) return 600;
			if (window.innerWidth >= 1024) return 500;
			return 450;
		}
		return 500;
	});
	const [isResizing, setIsResizing] = (0, import_react.useState)(false);
	const isResizingRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (editorRef.current && editorRef.current.innerHTML !== doc.content) {
			editorRef.current.innerHTML = doc.content;
			let hasChanges = false;
			editorRef.current.querySelectorAll(".canvas-preview-block").forEach((block) => {
				const canvasId = block.getAttribute("data-canvas-id");
				if (canvasId) {
					const canvas = funnels.find((f) => f.id === canvasId);
					if (canvas) {
						block.setAttribute("style", "margin: 32px 0; user-select: none; display: flex; flex-direction: column; align-items: flex-start;");
						const newInnerHtml = getCanvasPreviewInnerHtml(canvas);
						if (block.innerHTML !== newInnerHtml) {
							block.innerHTML = newInnerHtml;
							hasChanges = true;
						}
					}
				}
			});
			if (hasChanges) onChange(editorRef.current.innerHTML);
			extractHeaders();
		}
	}, [doc.id, doc.content]);
	const saveSelection = (0, import_react.useCallback)(() => {
		const selection = window.getSelection();
		if (selection && selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
				setSavedRange(range.cloneRange());
				let node = range.commonAncestorContainer;
				if (node?.nodeType === Node.TEXT_NODE) node = node.parentNode;
				const cell = node?.closest?.("td, th");
				const table = node?.closest?.("table");
				setActiveTableCell(cell);
				setActiveTableNode(table);
			} else {
				setActiveTableCell(null);
				setActiveTableNode(null);
			}
		}
	}, []);
	const restoreSelection = (0, import_react.useCallback)(() => {
		editorRef.current?.focus();
		if (savedRange) {
			const selection = window.getSelection();
			if (selection) {
				selection.removeAllRanges();
				selection.addRange(savedRange);
			}
		} else if (editorRef.current) {
			const range = document.createRange();
			range.selectNodeContents(editorRef.current);
			range.collapse(false);
			const selection = window.getSelection();
			if (selection) {
				selection.removeAllRanges();
				selection.addRange(range);
			}
		}
	}, [savedRange]);
	const insertHtmlAtSelection = (htmlString) => {
		restoreSelection();
		let success = false;
		try {
			success = document.execCommand("insertHTML", false, htmlString);
		} catch (e) {
			success = false;
		}
		if (!success) {
			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				range.deleteContents();
				const el = document.createElement("div");
				el.innerHTML = htmlString;
				const frag = document.createDocumentFragment();
				let node, lastNode;
				while (node = el.firstChild) lastNode = frag.appendChild(node);
				range.insertNode(frag);
				if (lastNode) {
					range.setStartAfter(lastNode);
					range.collapse(true);
					selection.removeAllRanges();
					selection.addRange(range);
				}
			}
		}
		if (editorRef.current) onChange(editorRef.current.innerHTML);
	};
	const exec = (cmd, val) => {
		document.execCommand(cmd, false, val);
		editorRef.current?.focus();
		if (editorRef.current) onChange(editorRef.current.innerHTML);
	};
	const insertImage = (e) => {
		e.preventDefault();
		if (!imageUrl.trim()) return;
		insertHtmlAtSelection(`<img src="${imageUrl}" alt="Imagem Inserida" style="max-width: 100%; border-radius: 8px; margin: 16px 0;" /><p><br></p>`);
		setImageUrl("");
		setImageModalOpen(false);
	};
	const insertCanvas = () => {
		if (!selectedCanvasId) return;
		const canvas = funnels.find((f) => f.id === selectedCanvasId);
		if (!canvas) return;
		insertHtmlAtSelection(`
      <div contenteditable="false" class="canvas-preview-block group" data-canvas-id="${canvas.id}" style="margin: 32px 0; user-select: none; display: flex; flex-direction: column; align-items: flex-start;">
        ${getCanvasPreviewInnerHtml(canvas)}
      </div>
      <p><br></p>
    `);
		setCanvasModalOpen(false);
		setSelectedCanvasId(null);
	};
	const handleToolbarMouseDown = (e) => {
		e.preventDefault();
	};
	const handleEditorClick = (e) => {
		const target = e.target;
		const canvasBlock = target.closest(".canvas-preview-block");
		if (canvasBlock) {
			e.preventDefault();
			const canvasId = canvasBlock.getAttribute("data-canvas-id");
			if (canvasId) if (target.closest("[data-action]")?.getAttribute("data-action") === "navigate") navigate(`/canvas/${canvasId}`);
			else setEditingCanvasId(canvasId);
		}
		let node = target;
		const cell = node?.closest?.("td, th");
		const table = node?.closest?.("table");
		setActiveTableCell(cell);
		setActiveTableNode(table);
	};
	const insertTable = () => {
		insertHtmlAtSelection(`
      <table class="w-full border-collapse border border-border my-4 shadow-sm rounded-lg overflow-hidden bg-card text-sm">
        <thead>
          <tr class="bg-muted/50 border-b border-border">
            <th class="border border-border p-3 text-left font-semibold">Cabeçalho 1</th>
            <th class="border border-border p-3 text-left font-semibold">Cabeçalho 2</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-border">
            <td class="border border-border p-3">Linha 1, Col 1</td>
            <td class="border border-border p-3">Linha 1, Col 2</td>
          </tr>
          <tr class="border-b border-border">
            <td class="border border-border p-3">Linha 2, Col 1</td>
            <td class="border border-border p-3">Linha 2, Col 2</td>
          </tr>
        </tbody>
      </table>
      <p><br/></p>
    `);
	};
	const addRow = (direction) => {
		if (!activeTableCell || !activeTableNode) return;
		const tr = activeTableCell.closest("tr");
		if (!tr) return;
		const newTr = document.createElement("tr");
		newTr.className = "border-b border-border";
		const cellCount = tr.children.length;
		for (let i = 0; i < cellCount; i++) {
			const td = document.createElement("td");
			td.className = "border border-border p-3";
			td.innerHTML = "<br/>";
			newTr.appendChild(td);
		}
		if (direction === "above") tr.parentNode?.insertBefore(newTr, tr);
		else tr.parentNode?.insertBefore(newTr, tr.nextSibling);
		onChange(editorRef.current.innerHTML);
	};
	const addColumn = (direction) => {
		if (!activeTableCell || !activeTableNode) return;
		const tr = activeTableCell.closest("tr");
		if (!tr) return;
		const cellIndex = Array.from(tr.children).indexOf(activeTableCell);
		activeTableNode.querySelectorAll("tr").forEach((row) => {
			const isHeader = row.parentNode?.nodeName.toLowerCase() === "thead";
			const cell = document.createElement(isHeader ? "th" : "td");
			cell.className = isHeader ? "border border-border p-3 text-left font-semibold" : "border border-border p-3";
			cell.innerHTML = "<br/>";
			const targetCell = row.children[cellIndex];
			if (targetCell) if (direction === "left") row.insertBefore(cell, targetCell);
			else row.insertBefore(cell, targetCell.nextSibling);
		});
		onChange(editorRef.current.innerHTML);
	};
	const deleteRow = () => {
		if (!activeTableCell || !activeTableNode) return;
		const tr = activeTableCell.closest("tr");
		if (!tr) return;
		if (activeTableNode.querySelectorAll("tr").length <= 2) return deleteTable();
		tr.remove();
		setActiveTableCell(null);
		onChange(editorRef.current.innerHTML);
	};
	const deleteTable = () => {
		if (!activeTableNode) return;
		activeTableNode.remove();
		setActiveTableNode(null);
		setActiveTableCell(null);
		onChange(editorRef.current.innerHTML);
	};
	const insertNewGuide = () => {
		insertHtmlAtSelection(`
      <div contenteditable="false" style="margin: 80px -40px; height: 32px; background: #f8fafc; border-top: 1px dashed #cbd5e1; border-bottom: 1px dashed #cbd5e1; display: flex; align-items: center; justify-content: center; user-select: none;">
         <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; font-weight: 600;">Nova Seção</span>
      </div>
      <h2>Nova Guia</h2>
      <p><br/></p>
    `);
		setTimeout(() => {
			if (editorRef.current) {
				const h2s = editorRef.current.querySelectorAll("h2");
				const lastH2 = h2s[h2s.length - 1];
				if (lastH2) {
					const selection = window.getSelection();
					const range = document.createRange();
					range.selectNodeContents(lastH2);
					selection?.removeAllRanges();
					selection?.addRange(range);
					lastH2.scrollIntoView({
						behavior: "smooth",
						block: "center"
					});
				}
			}
		}, 50);
	};
	const handleCanvasChange = (updatedFunnel) => {
		setFunnels(funnels.map((f) => f.id === updatedFunnel.id ? updatedFunnel : f));
		if (editorRef.current) {
			let hasChanges = false;
			editorRef.current.querySelectorAll(`.canvas-preview-block[data-canvas-id="${updatedFunnel.id}"]`).forEach((block) => {
				block.setAttribute("style", "margin: 32px 0; user-select: none; display: flex; flex-direction: column; align-items: flex-start;");
				block.innerHTML = getCanvasPreviewInnerHtml(updatedFunnel);
				hasChanges = true;
			});
			if (hasChanges) onChange(editorRef.current.innerHTML);
		}
	};
	const startResizing = (0, import_react.useCallback)((e) => {
		e.preventDefault();
		e.stopPropagation();
		isResizingRef.current = true;
		setIsResizing(true);
		document.body.style.cursor = "col-resize";
		document.body.style.userSelect = "none";
		const handleMouseMove = (ev) => {
			if (!isResizingRef.current || !containerRef.current) return;
			const containerRect = containerRef.current.getBoundingClientRect();
			const newWidth = containerRect.right - ev.clientX;
			const minW = 450;
			const maxW = Math.min(window.innerWidth * .8, containerRect.width - 300);
			if (newWidth >= minW && newWidth <= maxW) setPanelWidth(newWidth);
			else if (newWidth < minW) setPanelWidth(minW);
			else if (newWidth > maxW) setPanelWidth(maxW);
		};
		const handleMouseUp = () => {
			isResizingRef.current = false;
			setIsResizing(false);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	}, []);
	const activeCanvas = funnels.find((f) => f.id === editingCanvasId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		className: "flex w-full h-full overflow-hidden bg-transparent relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("hidden xl:flex shrink-0 bg-transparent flex-col transition-all duration-200 ease-in-out border-r border-slate-200/50", isOutlineOpen ? "w-64" : "w-[56px] items-center"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("flex flex-col w-full transition-all duration-200 ease-in-out", isOutlineOpen ? "py-5 px-6 gap-4" : "py-3 px-0 items-center gap-3"),
					children: isOutlineOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center w-full justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-sm font-semibold text-foreground flex items-center gap-2 whitespace-nowrap overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
								size: 16,
								className: "text-primary shrink-0"
							}), " Guias no documento"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsOutlineOpen(false),
							className: "h-8 w-8 flex items-center justify-center text-muted-foreground shrink-0 rounded-lg hover:bg-slate-100 cursor-pointer outline-none transition-colors",
							title: "Minimizar Guias",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { size: 16 })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "h-8 shadow-sm flex-1 font-semibold text-xs border-dashed text-muted-foreground hover:text-foreground hover:border-solid hover:border-primary/50 hover:bg-primary/5",
							onClick: insertNewGuide,
							title: "Adicionar novo título",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
								size: 14,
								className: "mr-1.5"
							}), " Adicionar Guia"]
						})
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsOutlineOpen(true),
							className: "h-8 w-8 flex items-center justify-center text-muted-foreground shrink-0 rounded-lg hover:bg-slate-100 cursor-pointer outline-none transition-colors",
							title: "Expandir Guias",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeft, { size: 20 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "outline",
							className: "h-8 w-8 shrink-0 rounded-lg border-dashed text-muted-foreground hover:text-foreground hover:border-solid hover:border-primary/50 hover:bg-primary/5",
							onClick: insertNewGuide,
							title: "Adicionar Guia",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 16 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsOutlineOpen(true),
							className: "h-8 w-8 flex items-center justify-center text-primary/50 shrink-0 hover:bg-slate-100 rounded-lg cursor-pointer outline-none transition-colors",
							title: "Ver Guias",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { size: 18 })
						})
					] })
				}), isOutlineOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto space-y-1 p-6 pt-0 pr-4 no-scrollbar animate-fade-in w-full",
					children: headers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground italic",
						children: "Adicione títulos (H1, H2, etc.) para criar o sumário do documento."
					}) : headers.map((header) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							const el = document.getElementById(header.id);
							if (el) el.scrollIntoView({
								behavior: "smooth",
								block: "center"
							});
						},
						style: { paddingLeft: `${(header.level - 1) * 12}px` },
						className: cn("w-full text-left text-sm py-1.5 px-2 rounded-md hover:bg-primary/10 transition-colors line-clamp-2", header.level === 1 ? "font-semibold text-foreground mt-2" : "text-muted-foreground"),
						children: header.text
					}, header.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("flex flex-col h-full overflow-y-auto ease-in-out flex-1 min-w-0 px-4 sm:px-6 lg:px-8", !isResizing && "transition-all duration-300"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex flex-col mx-auto w-full bg-white shadow-sm border border-slate-200/60 rounded-xl relative my-4 sm:my-6 lg:my-8", !isResizing && "transition-all duration-300", "max-w-[1000px] min-h-[max-content]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-30 shrink-0 p-6 lg:px-10 lg:pt-10 lg:pb-4 rounded-t-xl shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: doc.title,
								onChange: (e) => onTitleChange(e.target.value),
								className: "text-3xl font-bold border-none outline-none focus-visible:ring-0 px-0 h-auto shadow-none bg-transparent flex-1",
								placeholder: "Título do Documento"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0",
								children: [doc.funnelId && doc.nodeId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => navigate(`/canvas/${doc.funnelId}?nodeId=${doc.nodeId}`),
									className: "text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-100 shrink-0 h-9",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, {
										size: 14,
										className: "mr-1.5"
									}), " Ver no Canvas"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: doc.projectId || "none",
									onValueChange: (val) => onProjectChange(val === "none" ? null : val),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[180px] h-9 bg-muted/30 border-slate-200",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Project" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "none",
										children: "Nenhum Projeto"
									}), projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: p.id,
										children: p.name
									}, p.id))] })]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 shrink-0 flex-wrap mt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onMouseDown: handleToolbarMouseDown,
									onClick: () => exec("formatBlock", "H1"),
									title: "Título 1",
									className: "rounded-lg h-8 w-8 hover:bg-slate-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading1, { size: 16 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onMouseDown: handleToolbarMouseDown,
									onClick: () => exec("formatBlock", "H2"),
									title: "Título 2",
									className: "rounded-lg h-8 w-8 hover:bg-slate-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading2, { size: 16 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {
									orientation: "vertical",
									className: "h-4 mx-1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onMouseDown: handleToolbarMouseDown,
									onClick: () => exec("bold"),
									title: "Negrito",
									className: "rounded-lg h-8 w-8 hover:bg-slate-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bold, { size: 16 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onMouseDown: handleToolbarMouseDown,
									onClick: () => exec("italic"),
									title: "Itálico",
									className: "rounded-lg h-8 w-8 hover:bg-slate-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Italic, { size: 16 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onMouseDown: handleToolbarMouseDown,
									onClick: () => exec("underline"),
									title: "Sublinhado",
									className: "rounded-lg h-8 w-8 text-slate-700 font-serif font-bold underline hover:bg-slate-100",
									children: "U"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onMouseDown: handleToolbarMouseDown,
									onClick: () => exec("strikeThrough"),
									title: "Tachado",
									className: "rounded-lg h-8 w-8 text-slate-700 font-serif font-bold line-through hover:bg-slate-100",
									children: "S"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {
									orientation: "vertical",
									className: "h-4 mx-1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onMouseDown: handleToolbarMouseDown,
									onClick: () => exec("insertUnorderedList"),
									title: "Lista",
									className: "rounded-lg h-8 w-8 hover:bg-slate-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { size: 16 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onMouseDown: handleToolbarMouseDown,
									onClick: () => exec("insertOrderedList"),
									title: "Lista Numerada",
									className: "rounded-lg h-8 w-8 font-mono text-sm font-bold hover:bg-slate-100",
									children: "1."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {
									orientation: "vertical",
									className: "h-4 mx-1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "icon",
									onMouseDown: handleToolbarMouseDown,
									onClick: () => exec("justifyLeft"),
									title: "Alinhar à Esquerda",
									className: "rounded-lg h-8 w-8 flex flex-col items-start gap-0.5 justify-center py-1.5 hover:bg-slate-100",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-0.5 w-4 bg-slate-700 rounded-full" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-0.5 w-3 bg-slate-700 rounded-full" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-0.5 w-4 bg-slate-700 rounded-full" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "icon",
									onMouseDown: handleToolbarMouseDown,
									onClick: () => exec("justifyCenter"),
									title: "Centralizar",
									className: "rounded-lg h-8 w-8 flex flex-col items-center gap-0.5 justify-center py-1.5 hover:bg-slate-100",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-0.5 w-4 bg-slate-700 rounded-full" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-0.5 w-3 bg-slate-700 rounded-full" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-0.5 w-4 bg-slate-700 rounded-full" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "icon",
									onMouseDown: handleToolbarMouseDown,
									onClick: () => exec("justifyRight"),
									title: "Alinhar à Direita",
									className: "rounded-lg h-8 w-8 flex flex-col items-end gap-0.5 justify-center py-1.5 hover:bg-slate-100",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-0.5 w-4 bg-slate-700 rounded-full" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-0.5 w-3 bg-slate-700 rounded-full" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-0.5 w-4 bg-slate-700 rounded-full" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {
									orientation: "vertical",
									className: "h-4 mx-1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onMouseDown: handleToolbarMouseDown,
									onClick: () => exec("formatBlock", "BLOCKQUOTE"),
									title: "Citação",
									className: "rounded-lg h-8 w-8 hover:bg-slate-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { size: 16 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onMouseDown: handleToolbarMouseDown,
									onClick: () => exec("insertHorizontalRule"),
									title: "Divisor",
									className: "rounded-lg h-8 w-8 hover:bg-slate-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeparatorHorizontal, { size: 16 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {
									orientation: "vertical",
									className: "h-4 mx-1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onMouseDown: handleToolbarMouseDown,
									onClick: insertTable,
									title: "Tabela",
									className: "rounded-lg h-8 w-8 hover:bg-slate-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table$1, { size: 16 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
									open: imageModalOpen,
									onOpenChange: setImageModalOpen,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onMouseDown: () => saveSelection(),
											title: "Adicionar Imagem",
											className: "rounded-lg h-8 w-8 hover:bg-slate-100",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { size: 16 })
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Adicionar Imagem" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
										className: "sr-only",
										children: "Insira a URL da imagem que deseja adicionar ao documento."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: insertImage,
										className: "space-y-4 pt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "URL da Imagem (ex: https://...)",
											value: imageUrl,
											onChange: (e) => setImageUrl(e.target.value),
											autoFocus: true
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											className: "w-full",
											children: "Inserir Imagem"
										})]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
									open: canvasModalOpen,
									onOpenChange: setCanvasModalOpen,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "ghost",
												size: "sm",
												onMouseDown: () => saveSelection(),
												className: "ml-2 flex items-center bg-primary/10 hover:bg-primary/20 text-primary transition-colors shrink-0 rounded-xl font-semibold px-4 h-8",
												title: "Importar Canvas",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, {
													size: 14,
													className: "mr-2"
												}), " Importar Canvas"]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "ghost",
											size: "sm",
											className: "flex items-center text-muted-foreground hover:text-foreground transition-colors shrink-0 rounded-xl px-3 h-8",
											title: "Exportar como texto",
											onClick: () => {
												const text = editorRef.current?.innerText || "";
												const blob = new Blob([`# ${doc.title}\n\n${text}`], { type: "text/plain" });
												const url = URL.createObjectURL(blob);
												const a = document.createElement("a");
												a.href = url;
												a.download = `${doc.title.replace(/\s+/g, "_")}.txt`;
												a.click();
												URL.revokeObjectURL(url);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
												size: 14,
												className: "mr-1.5"
											}), " Exportar"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
											className: "max-w-2xl",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Selecionar Canvas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
													className: "sr-only",
													children: "Selecione um funil/canvas da lista para importar sua visualização."
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-2 gap-4 py-4 max-h-[60vh] overflow-y-auto px-1",
													children: [funnels.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														onClick: () => setSelectedCanvasId(f.id),
														className: cn("border rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2", selectedCanvasId === f.id ? "border-primary ring-1 ring-primary bg-primary/5" : "hover:border-primary/50 bg-card"),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-1",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, {
																size: 20,
																className: selectedCanvasId === f.id ? "text-primary" : "text-muted-foreground"
															})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
															className: "font-medium text-sm",
															children: f.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-xs text-muted-foreground",
															children: [f.nodes.length, " blocos mapeados"]
														})] })]
													}, f.id)), funnels.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "col-span-2 text-center py-8 text-muted-foreground text-sm",
														children: "Nenhum canvas disponível para importação."
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													onClick: insertCanvas,
													disabled: !selectedCanvasId,
													className: "w-full",
													children: "Importar Visualização"
												})
											]
										})
									]
								}),
								activeTableNode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200 ml-4 py-1 px-2 bg-primary/10 border border-primary/20 rounded-lg shrink-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold text-primary mr-1 px-1",
											children: "Tabela"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {
											orientation: "vertical",
											className: "h-4 mx-1 bg-primary/20"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onMouseDown: handleToolbarMouseDown,
											onClick: () => addRow("above"),
											className: "h-7 w-7 text-primary hover:bg-primary/20 rounded-md",
											title: "Adicionar Linha Acima",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpFromLine, { size: 14 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onMouseDown: handleToolbarMouseDown,
											onClick: () => addRow("below"),
											className: "h-7 w-7 text-primary hover:bg-primary/20 rounded-md",
											title: "Adicionar Linha Abaixo",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownFromLine, { size: 14 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {
											orientation: "vertical",
											className: "h-4 mx-1 bg-primary/20"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onMouseDown: handleToolbarMouseDown,
											onClick: () => addColumn("left"),
											className: "h-7 w-7 text-primary hover:bg-primary/20 rounded-md",
											title: "Adicionar Coluna à Esquerda",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftFromLine, { size: 14 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onMouseDown: handleToolbarMouseDown,
											onClick: () => addColumn("right"),
											className: "h-7 w-7 text-primary hover:bg-primary/20 rounded-md",
											title: "Adicionar Coluna à Direita",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightFromLine, { size: 14 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {
											orientation: "vertical",
											className: "h-4 mx-1 bg-primary/20"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onMouseDown: handleToolbarMouseDown,
											onClick: deleteRow,
											className: "h-7 w-7 text-destructive hover:bg-destructive/10 rounded-md",
											title: "Excluir Linha",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
												size: 13,
												className: "opacity-80"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onMouseDown: handleToolbarMouseDown,
											onClick: deleteTable,
											className: "h-7 w-7 text-destructive hover:bg-destructive/10 rounded-md",
											title: "Excluir Tabela Inteira",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 })
										})
									]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-6 lg:mx-10 mb-12 mt-8 flex-1 flex flex-col relative w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: editorRef,
							contentEditable: true,
							className: "flex-1 outline-none prose prose-slate max-w-none focus:outline-none min-h-[500px] pb-32 prose-headings:font-bold prose-h1:text-4xl prose-h2:text-2xl prose-p:text-base prose-p:leading-relaxed",
							onBlur: (e) => {
								saveSelection();
								onChange(e.currentTarget.innerHTML);
								extractHeaders();
							},
							onKeyUp: () => {
								saveSelection();
								extractHeaders();
							},
							onMouseUp: saveSelection,
							onInput: (e) => {
								onChange(e.currentTarget.innerHTML);
							},
							onClick: handleEditorClick,
							style: { caretColor: "hsl(var(--primary))" }
						})
					})]
				})
			}),
			editingCanvasId && activeCanvas && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: { width: `${panelWidth}px` },
				className: cn("h-full flex flex-col bg-background shadow-[-10px_0_40px_rgba(0,0,0,0.08)] z-20 shrink-0 border-l border-border relative", !isResizing && "transition-all duration-300", "animate-in slide-in-from-right"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute -left-3 top-0 bottom-0 w-6 cursor-col-resize z-50 group/resizer flex items-center justify-center",
						onMouseDown: startResizing,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-1.5 h-full left-1/2 -translate-x-1/2 opacity-0 group-hover/resizer:opacity-100 bg-primary/20 transition-opacity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-[20px] h-[48px] bg-slate-900 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover/resizer:scale-105 z-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, {
								size: 14,
								className: "opacity-80"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "h-16 border-b flex items-center justify-between px-6 bg-card shrink-0 shadow-sm z-10 relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { size: 20 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-base text-foreground",
								children: activeCanvas.name
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => setEditingCanvasId(null),
							className: "text-muted-foreground hover:text-foreground hover:bg-muted rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 relative flex overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CanvasBoard, {
							funnel: activeCanvas,
							onChange: handleCanvasChange,
							hideHeader: true,
							onBack: () => setEditingCanvasId(null)
						})
					})
				]
			})
		]
	});
}
function Documents() {
	const [docs, setDocs] = useDocumentStore_default();
	const [allFolders, setFolders] = useFolderStore_default();
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	const [currentFolderId, setCurrentFolderId] = (0, import_react.useState)(null);
	const [view, setView] = (0, import_react.useState)("grid");
	const [search, setSearch] = (0, import_react.useState)("");
	const [docToDelete, setDocToDelete] = (0, import_react.useState)(null);
	const [isCreateOpen, setIsCreateOpen] = (0, import_react.useState)(false);
	const [newDocTitle, setNewDocTitle] = (0, import_react.useState)("");
	const [sortConfig, setSortConfig] = (0, import_react.useState)({
		key: "type",
		direction: "asc"
	});
	const { toast } = useToast();
	const activeDoc = docs.find((d) => d.id === activeId);
	const moduleFolders = allFolders.filter((f) => f.module === "project");
	const currentFolders = moduleFolders.filter((f) => {
		if (search) return f.name.toLowerCase().includes(search.toLowerCase());
		return f.parentId === currentFolderId;
	});
	const filteredDocs = docs.filter((d) => {
		if (search) return d.title.toLowerCase().includes(search.toLowerCase());
		return (d.folderId || null) === currentFolderId;
	});
	const combinedItems = (0, import_react.useMemo)(() => {
		const items = [];
		currentFolders.forEach((f) => items.push({
			id: f.id,
			type: "folder",
			name: f.name,
			date: f.createdAt,
			raw: f
		}));
		filteredDocs.forEach((d) => items.push({
			id: d.id,
			type: "doc",
			name: d.title,
			date: d.updatedAt,
			raw: d
		}));
		return items;
	}, [currentFolders, filteredDocs]);
	const sortedItems = (0, import_react.useMemo)(() => {
		return [...combinedItems].sort((a, b) => {
			let aVal = a[sortConfig.key];
			let bVal = b[sortConfig.key];
			if (sortConfig.key === "date") {
				aVal = new Date(aVal).getTime();
				bVal = new Date(bVal).getTime();
			} else if (sortConfig.key === "name") {
				aVal = aVal.toLowerCase();
				bVal = bVal.toLowerCase();
			}
			if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
			if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
			if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
			return 0;
		});
	}, [combinedItems, sortConfig]);
	const handleSort = (key) => {
		setSortConfig((prev) => ({
			key,
			direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
		}));
	};
	const renderSortIcon = (key) => {
		if (sortConfig.key !== key) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
			size: 14,
			className: "opacity-0 group-hover:opacity-50 transition-opacity ml-1"
		});
		return sortConfig.direction === "asc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, {
			size: 14,
			className: "text-primary ml-1"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
			size: 14,
			className: "text-primary ml-1"
		});
	};
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
	const handleCreateDoc = (e) => {
		e.preventDefault();
		const newDoc = {
			id: generateId("d"),
			projectId: null,
			title: newDocTitle.trim() || "Novo Documento",
			content: "",
			updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			folderId: currentFolderId
		};
		setDocs([...docs, newDoc]);
		setNewDocTitle("");
		setIsCreateOpen(false);
		toast({ title: "Documento criado com sucesso!" });
		setActiveId(newDoc.id);
	};
	const updateDocFolder = (id, folderId) => {
		setDocs(docs.map((d) => d.id === id ? {
			...d,
			folderId
		} : d));
		toast({ title: "Documento movido com sucesso!" });
	};
	const handleDeleteDoc = () => {
		if (!docToDelete) return;
		setDocs(docs.filter((d) => d.id !== docToDelete));
		setDocToDelete(null);
		toast({ title: "Documento excluído!" });
	};
	if (activeDoc) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col h-full bg-[#f8fafc] overflow-hidden animate-fade-in w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-4 px-6 py-3 border-b border-border bg-white shrink-0 shadow-sm z-30",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					onClick: () => setActiveId(null),
					className: "text-muted-foreground hover:text-foreground h-9 px-3 -ml-3 font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
						size: 16,
						className: "mr-1"
					}), "Voltar para Documentos"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-[1px] bg-border mx-1" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium text-foreground truncate",
					children: activeDoc.title || "Sem Título"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-hidden w-full relative",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichTextEditor, {
				doc: activeDoc,
				onTitleChange: (title) => setDocs(docs.map((d) => d.id === activeDoc.id ? {
					...d,
					title
				} : d)),
				onProjectChange: (projectId) => setDocs(docs.map((d) => d.id === activeDoc.id ? {
					...d,
					projectId
				} : d)),
				onChange: (content) => setDocs(docs.map((d) => d.id === activeDoc.id ? {
					...d,
					content
				} : d))
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-6 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 md:px-8 border-b border-border -mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-8 min-h-[80px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-bold tracking-tight text-foreground",
						children: "Documentos"
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
							open: isCreateOpen,
							onOpenChange: setIsCreateOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
									size: 16,
									className: "mr-2"
								}), " Novo Documento"] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Criar Novo Documento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "sr-only",
								children: "Insira o nome do novo documento."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleCreateDoc,
								className: "space-y-4 pt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Título do Documento",
									value: newDocTitle,
									onChange: (e) => setNewDocTitle(e.target.value),
									autoFocus: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "w-full",
									children: "Criar Documento"
								})]
							})] })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-md shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					className: "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground",
					size: 18
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Buscar documentos...",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "pl-12 bg-card"
				})]
			}),
			sortedItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-20 text-center flex flex-col items-center bg-card rounded-2xl border border-dashed border-border shadow-sm max-w-2xl mx-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4 text-primary/50",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 32 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl font-bold text-foreground",
						children: "Vazio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base text-muted-foreground mt-2 mb-6",
						children: "Nenhum documento ou pasta encontrado neste local."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setIsCreateOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							size: 16,
							className: "mr-2"
						}), " Criar Primeiro Documento"]
					})
				]
			}) : view === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-12",
				children: sortedItems.map((item) => {
					if (item.type === "folder") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						onClick: () => setCurrentFolderId(item.id),
						className: "hover:shadow-md hover:border-primary/40 transition-all cursor-pointer h-full group flex items-center p-6 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
								size: 24,
								className: "fill-current opacity-20"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1",
							children: item.name
						})]
					}, item.id);
					else {
						const doc = item.raw;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							onClick: () => setActiveId(item.id),
							className: "hover:shadow-md hover:border-primary/40 transition-all cursor-pointer h-full group flex flex-col relative overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "pb-4 flex-1 flex flex-col gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-start",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 24 })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: (e) => {
											e.preventDefault();
											e.stopPropagation();
										},
										className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveDialog, {
											folders: moduleFolders,
											currentFolderId: doc.folderId,
											onMove: (id) => updateDocFolder(item.id, id)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full",
											onClick: () => setDocToDelete(item.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 16 })
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-xl group-hover:text-primary transition-colors line-clamp-2 leading-snug",
									children: item.name
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "pt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground font-medium",
									children: [
										"Modificado em",
										" ",
										new Date(item.date).toLocaleDateString("pt-BR")
									]
								})
							})]
						}, item.id);
					}
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-card border rounded-2xl overflow-hidden shadow-sm pb-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						onClick: () => handleSort("name"),
						className: "cursor-pointer group hover:bg-muted/50 select-none w-1/2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center",
							children: ["Nome ", renderSortIcon("name")]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						onClick: () => handleSort("type"),
						className: "cursor-pointer group hover:bg-muted/50 select-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center",
							children: ["Tipo ", renderSortIcon("type")]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						onClick: () => handleSort("date"),
						className: "cursor-pointer group hover:bg-muted/50 select-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center",
							children: ["Última Modificação ", renderSortIcon("date")]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-[100px] text-right",
						children: "Ações"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: sortedItems.map((item) => {
					if (item.type === "folder") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						onClick: () => setCurrentFolderId(item.id),
						className: "cursor-pointer group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
								className: "font-medium flex items-center gap-3 py-4 text-base",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
									className: "text-primary fill-primary/20 group-hover:text-primary transition-colors shrink-0",
									size: 20
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "group-hover:text-primary transition-colors truncate",
									children: item.name
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-muted-foreground font-medium",
								children: "Pasta"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-muted-foreground font-medium",
								children: new Date(item.date).toLocaleDateString("pt-BR")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {})
						]
					}, item.id);
					else {
						const doc = item.raw;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							onClick: () => setActiveId(item.id),
							className: "cursor-pointer text-base group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-medium py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
											className: "text-primary shrink-0",
											size: 20
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "group-hover:text-primary transition-colors truncate",
											children: item.name
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-muted-foreground font-medium",
									children: "Documento"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-muted-foreground font-medium",
									children: new Date(item.date).toLocaleDateString("pt-BR")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: (e) => {
											e.preventDefault();
											e.stopPropagation();
										},
										className: "flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveDialog, {
											folders: moduleFolders,
											currentFolderId: doc.folderId,
											onMove: (id) => updateDocFolder(item.id, id)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full",
											onClick: () => setDocToDelete(item.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 16 })
										})]
									})
								})
							]
						}, item.id);
					}
				}) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!docToDelete,
				onOpenChange: (open) => !open && setDocToDelete(null),
				title: "Excluir Documento?",
				description: "Esta ação é irreversível. O documento será excluído permanentemente.",
				confirmLabel: "Excluir",
				variant: "destructive",
				onConfirm: handleDeleteDoc
			})
		]
	});
}
export { Documents as default };

//# sourceMappingURL=Documents-DWC_0GtR.js.map