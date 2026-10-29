import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { n as r } from "./motion-CFWhFfc_.js";
//#region src/components/onboarding-checklist/onboarding-checklist.scss?inline
var i = ":host{--_ease:cubic-bezier(.23, 1, .32, 1);--_done:var(--lightningcss-light,#10b981)var(--lightningcss-dark,#34d399);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:24rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);border-radius:1.5rem;padding:1.25rem;display:block}p{margin:0}.head{align-items:center;gap:.875rem;display:flex}.ring{flex:none;place-items:center;width:2.75rem;height:2.75rem;display:grid;position:relative}.ring svg{position:absolute;inset:0;rotate:-90deg}.ring circle{fill:none;stroke-width:4px}.track{stroke:var(--lw-color-muted)}.arc{stroke:var(--lw-color-foreground);stroke-linecap:round}@media (prefers-reduced-motion:no-preference){.arc{transition:stroke-dashoffset .5s var(--_ease), stroke .3s ease-out}}:host([data-complete]) .arc{stroke:var(--_done)}.count{font-variant-numeric:tabular-nums;font-size:11px;font-weight:600;transition:opacity .2s ease-out}:host([data-complete]) .count{opacity:0}.tick{color:var(--_done);opacity:0;display:grid;position:absolute}.tick svg{width:1.125rem;height:1.125rem}.tick path{stroke-dasharray:1;stroke-dashoffset:1px}:host([data-complete]) .tick{opacity:1}:host([data-complete]) .tick path{stroke-dashoffset:0;transition:stroke-dashoffset .4s var(--_ease) .15s}svg path{fill:none;stroke:currentColor;stroke-width:2px;stroke-linecap:round;stroke-linejoin:round}.heading{font-size:var(--lw-text-md);font-weight:600}.left{font-size:var(--lw-text-sm);color:var(--lw-color-muted-foreground)}.steps{margin:1rem -.5rem 0;padding:0;list-style:none}:host([data-complete]) .steps{display:none}.steps li{border-radius:var(--lw-radius-lg);padding:.5rem;transition:background-color .2s ease-out}.steps li[data-open]{background:var(--lw-color-muted)}.row{align-items:center;gap:.75rem;display:flex}.check{box-sizing:border-box;border:1.5px solid var(--lw-color-ring);background:var(--lw-color-background);color:#fff;cursor:pointer;border-radius:50%;outline:none;flex:none;place-items:center;width:1.375rem;height:1.375rem;padding:0;transition:background-color .2s ease-out,border-color .2s ease-out;display:grid}.check:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.check svg{width:.875rem;height:.875rem}.check path{stroke-width:2.5px;stroke-dasharray:1;stroke-dashoffset:1px}[data-done] .check{border-color:var(--_done);background:var(--_done)}[data-done] .check path{stroke-dashoffset:0;transition:stroke-dashoffset .3s var(--_ease)}.title{font-size:var(--lw-text-sm);font-weight:500;transition:color .2s ease-out}[data-done] .title{color:var(--lw-color-muted-foreground);text-decoration:line-through}.fold{opacity:0;grid-template-rows:0fr;display:grid}@media (prefers-reduced-motion:no-preference){.fold{transition:grid-template-rows .3s var(--_ease), opacity .25s var(--_ease)}}[data-open]>.fold{opacity:1;grid-template-rows:1fr}.fold-inner{padding-left:2.125rem;overflow:hidden}.fold-inner lw-button{margin:.625rem 0 .25rem}.description{font-size:var(--lw-text-sm);color:var(--lw-color-muted-foreground);margin-top:.25rem;line-height:1.5}.all-set{border-radius:var(--lw-radius-lg);background:color-mix(in oklab, var(--_done) 10%, transparent);margin-top:1rem;padding:1rem;display:none}:host([data-complete]) .all-set{display:block}@media (prefers-reduced-motion:no-preference){:host([data-complete]) .all-set{animation:rise .4s var(--_ease)}}.all-set lw-button{margin-top:.75rem}.set-title{font-size:var(--lw-text-sm);font-weight:600}.set-text{font-size:var(--lw-text-sm);color:var(--lw-color-muted-foreground);margin-top:.25rem}@keyframes rise{0%{opacity:0;translate:0 8px}}", a = [
	{
		id: "profile",
		title: "Complete your profile",
		description: "Add a photo and a short bio so your team knows who you are.",
		action: "Edit profile"
	},
	{
		id: "invite",
		title: "Invite your team",
		description: "Projects move faster together. Invite up to five teammates for free.",
		action: "Invite people"
	},
	{
		id: "project",
		title: "Create your first project",
		description: "Start from a template or an empty repo, then build it on every push.",
		action: "New project"
	},
	{
		id: "integrate",
		title: "Connect a repository",
		description: "Build every push from GitHub or GitLab, and post the results to Slack.",
		action: "Connect a repo"
	},
	{
		id: "notify",
		title: "Set up notifications",
		description: "Choose what reaches you, and where: email, desktop or mobile.",
		action: "Open settings"
	}
], o = 2 * Math.PI * 18, s = "<svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M3.5 8.5 6.5 11.5 12.5 4.5\" pathLength=\"1\"/></svg>", c = class extends e {
	static styles = i;
	static props = {
		heading: { default: "Get started" },
		steps: {
			type: Object,
			default: a
		},
		done: {
			type: Object,
			default: ["profile"]
		}
	};
	#e = null;
	render() {
		return `<div class="head"><div class="ring" aria-hidden="true"><svg viewBox="0 0 44 44"><circle class="track" cx="22" cy="22" r="18"/><circle class="arc" cx="22" cy="22" r="18" stroke-dasharray="${o}"/></svg><span class="count"></span><span class="tick">${s}</span></div><div class="titles"><p class="heading"></p><p class="left" aria-live="polite"></p></div></div>
<ol class="steps"></ol>
<div class="all-set"><p class="set-title">You're all set</p><p class="set-text">Everything is in place. You can find these steps again in Settings.</p><lw-button class="dismiss" variant="secondary" size="sm">Dismiss</lw-button></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".steps").addEventListener("click", (e) => this.#i(e), e), this.query(".dismiss").addEventListener("click", () => {
			this.hidden = !0, this.emit("dismiss");
		}, e);
	}
	updated(e) {
		e.has("steps") && this.#n(), this.query(".heading").textContent = this.heading ?? "", this.#r();
	}
	get #t() {
		return new Set(this.done ?? []);
	}
	#n() {
		this.query(".steps").innerHTML = this.steps.map((e) => `<li data-id="${n(e.id)}"><div class="row"><button class="check" type="button" role="checkbox">${s}</button><span class="title">${n(e.title)}</span></div><div class="fold"><div class="fold-inner">${e.description ? `<p class="description">${n(e.description)}</p>` : ""}${e.action ? `<lw-button class="action" size="sm">${n(e.action)}</lw-button>` : ""}</div></div></li>`).join("");
	}
	#r() {
		let e = this.#t, t = this.steps.length, n = this.steps.filter(({ id: t }) => e.has(t)).length, i = this.steps.find(({ id: t }) => !e.has(t))?.id;
		for (let t of this.shadowRoot.querySelectorAll(".steps li")) {
			let n = e.has(t.dataset.id);
			t.toggleAttribute("data-done", n), t.toggleAttribute("data-open", t.dataset.id === i);
			let r = t.querySelector(".check");
			r.ariaChecked = String(n), r.ariaLabel = t.querySelector(".title").textContent, t.querySelector(".fold").inert = t.dataset.id !== i;
		}
		this.query(".arc").style.strokeDashoffset = String(o * (1 - (t ? n / t : 0))), this.query(".count").textContent = `${n}/${t}`;
		let a = t - n;
		this.query(".left").textContent = a ? `${a} step${a === 1 ? "" : "s"} left` : "All done";
		let s = t > 0 && a === 0;
		this.toggleAttribute("data-complete", s), this.query(".steps").inert = s, this.query(".all-set").inert = !s, s && this.#e === !1 && (this.emit("complete"), r.matches || this.query(".ring").animate([
			{ scale: 1 },
			{ scale: 1.12 },
			{ scale: 1 }
		], {
			duration: 420,
			easing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
		})), this.#e = s;
	}
	#i(e) {
		let t = e.target.closest("li");
		if (!t) return;
		let { id: n } = t.dataset;
		if (e.target.closest(".action")) {
			this.emit("action", { id: n });
			return;
		}
		if (!e.target.closest(".check")) return;
		let r = this.#t, i = !r.has(n);
		i ? r.add(n) : r.delete(n), this.done = this.steps.map((e) => e.id).filter((e) => r.has(e)), this.emit("change", {
			id: n,
			done: i
		});
	}
};
//#endregion
//#region src/components/onboarding-checklist/index.js
t("onboarding-checklist", c);
//#endregion
export { c as t };
