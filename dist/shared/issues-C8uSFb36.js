import { t as e } from "./dom-Dlk1FlsZ.js";
import { n as t, t as n } from "./people-C_zYMoEl.js";
//#region src/core/issues.js
var r = [
	{
		id: "backlog",
		label: "Backlog"
	},
	{
		id: "todo",
		label: "Todo"
	},
	{
		id: "progress",
		label: "In progress"
	},
	{
		id: "review",
		label: "In review"
	},
	{
		id: "done",
		label: "Done"
	}
], i = [
	{
		id: "urgent",
		label: "Urgent"
	},
	{
		id: "high",
		label: "High"
	},
	{
		id: "medium",
		label: "Medium"
	},
	{
		id: "low",
		label: "Low"
	}
], a = {
	Bug: "#e5484d",
	Feature: "#8e4ec6",
	Perf: "#0090ff",
	Docs: "#12a594",
	Build: "#f76b15"
}, o = [
	{
		id: "LOW-214",
		title: "Crash when the symbol cache is on a full disk",
		status: "progress",
		priority: "urgent",
		label: "Bug",
		assignee: "Leo Martins"
	},
	{
		id: "LOW-212",
		title: "Flame graph loses frames past depth 512",
		status: "review",
		priority: "high",
		label: "Bug",
		assignee: "Maya Chen"
	},
	{
		id: "LOW-209",
		title: "Export traces to Perfetto",
		status: "todo",
		priority: "medium",
		label: "Feature",
		assignee: "Sam Okafor"
	},
	{
		id: "LOW-207",
		title: "Linker drops debug info on ARM builds",
		status: "todo",
		priority: "high",
		label: "Build",
		assignee: "Leo Martins"
	},
	{
		id: "LOW-205",
		title: "Document the allocator tuning flags",
		status: "backlog",
		priority: "low",
		label: "Docs",
		assignee: ""
	},
	{
		id: "LOW-203",
		title: "Cold start regressed 8 ms on Linux",
		status: "progress",
		priority: "high",
		label: "Perf",
		assignee: "Maya Chen"
	},
	{
		id: "LOW-201",
		title: "SIMD path for the JSON scanner",
		status: "progress",
		priority: "medium",
		label: "Perf",
		assignee: "Priya Raman"
	},
	{
		id: "LOW-198",
		title: "Reproducible builds by default",
		status: "backlog",
		priority: "medium",
		label: "Build",
		assignee: "Theo Park"
	},
	{
		id: "LOW-196",
		title: "Profiler opens straight from a crash report",
		status: "done",
		priority: "high",
		label: "Feature",
		assignee: "Ana Ruiz"
	},
	{
		id: "LOW-193",
		title: "Man pages for every CLI command",
		status: "done",
		priority: "low",
		label: "Docs",
		assignee: "Theo Park"
	},
	{
		id: "LOW-190",
		title: "Webhook retries back off too slowly",
		status: "progress",
		priority: "medium",
		label: "Bug",
		assignee: "Sam Okafor"
	},
	{
		id: "LOW-188",
		title: "Arena allocator in the standard runtime",
		status: "todo",
		priority: "medium",
		label: "Feature",
		assignee: "Priya Raman"
	}
], s = {
	backlog: "<circle cx=\"8\" cy=\"8\" r=\"6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-dasharray=\"2 2.2\"/>",
	todo: "<circle cx=\"8\" cy=\"8\" r=\"6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/>",
	progress: "<circle cx=\"8\" cy=\"8\" r=\"6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/><path d=\"M8 4a4 4 0 0 1 0 8z\" fill=\"currentColor\"/>",
	review: "<circle cx=\"8\" cy=\"8\" r=\"6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/><path d=\"M8 4a4 4 0 1 1-4 4h4z\" fill=\"currentColor\"/>",
	done: "<circle cx=\"8\" cy=\"8\" r=\"7\" fill=\"currentColor\"/><path d=\"m5 8.2 2 2 4-4.2\" fill=\"none\" stroke=\"var(--lw-color-background)\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>"
}, c = (e) => `<svg class="status-icon" data-status="${e}" viewBox="0 0 16 16" width="16" height="16" role="img" aria-label="${r.find((t) => t.id === e)?.label ?? e}">${s[e] ?? s.todo}</svg>`, l = (e) => {
	let t = i.find((t) => t.id === e)?.label ?? e;
	if (e === "urgent") return `<svg class="priority-icon" data-priority="urgent" viewBox="0 0 16 16" width="16" height="16" role="img" aria-label="${t}"><rect x="1" y="1" width="14" height="14" rx="3"/><path d="M8 4.5v4.5M8 11.2v.3" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>`;
	let n = {
		high: 3,
		medium: 2,
		low: 1
	}[e] ?? 0;
	return `<svg class="priority-icon" viewBox="0 0 16 16" width="16" height="16" role="img" aria-label="${t}">${[
		0,
		1,
		2
	].map((e) => `<rect x="${2 + e * 5}" y="${10 - e * 3}" width="3" height="${4 + e * 3}" rx="1"${e < n ? " data-on" : ""}/>`).join("")}</svg>`;
}, u = (t) => `<span class="label-chip" style="--_label: ${a[t] ?? "#71717a"}">${e(t)}</span>`, d = (r) => r ? `<span class="assignee" style="--_hue: ${n(r)}" title="${e(r)}">${e(t(r))}</span>` : "<span class=\"assignee\" data-none title=\"Unassigned\"></span>";
//#endregion
export { d as a, c, r as i, a as n, u as o, i as r, l as s, o as t };
