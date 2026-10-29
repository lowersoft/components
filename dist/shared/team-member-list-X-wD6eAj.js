import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { n as a } from "./motion-CFWhFfc_.js";
import { i as o } from "./menu-BCEGADW6.js";
import { n as s } from "./swap-BK53XQML.js";
import { n as c, t as l } from "./people-C_zYMoEl.js";
import { ct as u } from "./lucide-BVbUPHVq.js";
import { n as d, t as f } from "./picker-CFtn-7gY.js";
//#region src/components/team-member-list/team-member-list.scss?inline
var p = ".picker-trigger{border-radius:var(--lw-radius-md);font:inherit;color:var(--lw-color-foreground);cursor:pointer;background:0 0;border:0;outline:none;align-items:center;gap:.375rem;padding:.375rem .5rem;display:inline-flex}.picker-trigger:hover,.picker-trigger[aria-expanded=true]{background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent)}.picker-trigger:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.picker-trigger>svg{color:var(--lw-color-muted-foreground);flex:none}.picker-label{color:var(--lw-color-muted-foreground)}:host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:32rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:.5rem;display:block}h2,p,ul{margin:0}.head{align-items:center;gap:.75rem;padding:.75rem .75rem 1rem;display:flex}.title{font-size:var(--lw-text-lg);flex:1;font-weight:500}.faces{display:flex}.face{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));width:1.625rem;height:1.625rem;box-shadow:0 0 0 2px var(--lw-color-background);border-radius:50%;place-items:center;font-size:.5625rem;font-weight:600;display:grid}.face+.face{margin-left:-.375rem}.count{color:var(--_muted)}.filter{border:1px solid var(--_line);border-radius:var(--lw-radius-lg);background:color-mix(in oklab, var(--lw-color-foreground) 4%, transparent);color:var(--_muted);align-items:center;gap:.625rem;padding:0 .875rem;display:flex}.filter:focus-within{border-color:color-mix(in oklab, var(--lw-color-foreground) 30%, transparent)}.query{min-width:0;height:2.75rem;font:var(--lw-text-md) var(--lw-font-sans);color:var(--lw-color-foreground);background:0 0;border:0;outline:none;flex:1}.query::placeholder{color:var(--_muted)}.query::-webkit-search-cancel-button{display:none}.list{margin-top:.5rem;padding:0;list-style:none}.member{align-items:center;gap:.875rem;padding:.625rem .5rem;display:flex;overflow:hidden}.member[hidden]{display:none}.avatar{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));width:2.5rem;height:2.5rem;font-size:var(--lw-text-xs);border-radius:50%;flex:none;place-items:center;font-weight:600;display:grid;position:relative}.online{border:2px solid var(--lw-color-background);background:var(--lw-color-accent);border-radius:50%;width:.75rem;height:.75rem;position:absolute;bottom:-1px;right:-1px}.who{flex:1;min-width:0}.name{font-size:var(--lw-text-md);align-items:center;gap:.5rem;display:flex}.you{border:1px solid var(--_line);border-radius:var(--lw-radius-sm);font-size:var(--lw-text-xs);color:var(--_muted);padding:.0625rem .375rem}.email{text-overflow:ellipsis;white-space:nowrap;color:var(--_muted);margin-top:.125rem;overflow:hidden}.role-cell{flex:none;justify-items:end;gap:.125rem;display:grid}.role.fixed{font-size:var(--lw-text-md);padding:.375rem .5rem}.picker-trigger{font-size:var(--lw-text-md)}.seen{color:var(--_muted);padding-right:.5rem}.none{text-align:center;color:var(--_muted);padding:1.5rem}.none[hidden]{display:none}", m = [
	{
		value: "Admin",
		label: "Admin",
		description: "Billing, members and every project"
	},
	{
		value: "Member",
		label: "Member",
		description: "Builds and edits projects"
	},
	{
		value: "Viewer",
		label: "Viewer",
		description: "Reads and comments"
	},
	{
		value: "remove",
		label: "Remove from workspace"
	}
], h = [
	{
		name: "Maya Lin",
		email: "maya@northwind.dev",
		role: "Owner",
		seen: "Active now",
		online: !0,
		you: !0
	},
	{
		name: "Theo Park",
		email: "theo@northwind.dev",
		role: "Admin",
		seen: "Active now",
		online: !0
	},
	{
		name: "Ana Ruiz",
		email: "ana@northwind.dev",
		role: "Member",
		seen: "2h ago"
	},
	{
		name: "Sam Okafor",
		email: "sam@northwind.dev",
		role: "Member",
		seen: "Yesterday"
	},
	{
		name: "Ines Alves",
		email: "ines@northwind.dev",
		role: "Viewer",
		seen: "Last week"
	}
], g = 4, _ = class extends e {
	static styles = [
		r,
		o,
		s,
		p
	];
	static props = { members: {
		type: Object,
		default: h
	} };
	#e = [];
	#t = null;
	render() {
		return `<header class="head"><h2 class="title">Members</h2><span class="faces" aria-hidden="true"></span><span class="count"></span></header>
<label class="filter">${i(u, 18)}<input class="query" type="search" placeholder="Filter by name, email or role" aria-label="Filter members" autocomplete="off"></label><ul class="list"></ul><p class="none" hidden>Nobody matches.</p>`;
	}
	connected() {
		this.query(".query").addEventListener("input", () => this.#i(), { signal: this.signal });
	}
	updated(e) {
		e.has("members") && (this.#e = this.members.map((e) => ({ ...e })), this.#n());
	}
	#n() {
		this.#t?.abort(), this.#t = new AbortController();
		let e = AbortSignal.any([this.signal, this.#t.signal]), t = this.query(".list");
		t.innerHTML = this.#e.map((e, t) => `<li class="member" data-index="${t}"><span class="avatar" style="--_hue: ${l(e.name)}">${n(c(e.name))}${e.online ? "<span class=\"online\" title=\"Online\"></span>" : ""}</span>
<div class="who"><p class="name">${n(e.name)}${e.you ? "<span class=\"you\">You</span>" : ""}</p><p class="email">${n(e.email)}</p></div>
<div class="role-cell">${e.role === "Owner" || e.you ? `<span class="role fixed">${n(e.role)}</span>` : d(`role-menu-${t}`)}<p class="seen">${n(e.seen)}</p></div></li>`).join(""), this.#e.forEach((n, r) => {
			let i = t.children[r];
			if (!i.querySelector(".picker")) return;
			let a = f(i.querySelector(".role-cell"), e, (e) => e === "remove" ? this.#o(r) : this.#a(r, e, a));
			a.set(m, n.role), i.querySelector(".picker-trigger").setAttribute("aria-label", `Role of ${n.name}: ${n.role}`);
		}), this.#r(), this.#i();
	}
	#r() {
		this.query(".faces").innerHTML = this.#e.slice(0, g).map((e) => `<span class="face" style="--_hue: ${l(e.name)}">${n(c(e.name))}</span>`).join(""), this.query(".count").textContent = `${this.#e.length} ${this.#e.length === 1 ? "person" : "people"}`;
	}
	#i() {
		let e = this.query(".query").value.trim().toLowerCase(), t = 0;
		for (let n of this.shadowRoot.querySelectorAll(".member")) {
			let r = this.#e[Number(n.dataset.index)], i = !e || [
				r.name,
				r.email,
				r.role
			].some((t) => t.toLowerCase().includes(e));
			n.hidden = !i, i && t++;
		}
		this.query(".none").hidden = t > 0;
	}
	#a(e, t, n) {
		let r = this.#e[e];
		r.role !== t && (r.role = t, n.set(m, t), this.query(`.member[data-index="${e}"] .picker-trigger`).setAttribute("aria-label", `Role of ${r.name}: ${t}`), this.emit("role", {
			email: r.email,
			role: t
		}));
	}
	async #o(e) {
		let t = this.query(`.member[data-index="${e}"]`), [n] = this.#e.splice(e, 1);
		a.matches || await t.animate({
			opacity: [1, 0],
			height: [`${t.offsetHeight}px`, "0px"]
		}, {
			duration: 250,
			easing: "ease-out"
		}).finished, this.#n(), this.emit("remove", { email: n.email });
	}
};
//#endregion
//#region src/components/team-member-list/index.js
t("team-member-list", _);
//#endregion
export { _ as t };
