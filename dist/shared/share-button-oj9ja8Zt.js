import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./icons-HWomdoMw.js";
import { n as r, t as i } from "./morph-Bksu_5a3.js";
import { i as a, n as o, r as s } from "./menu-BCEGADW6.js";
import { n as c, t as l } from "./swap-BK53XQML.js";
import { t as u } from "./clipboard-BCkfa02P.js";
//#region src/components/share-button/share-button.scss?inline
var d = ":host([status=open]) .shell{border-radius:var(--lw-radius-lg);box-shadow:var(--lw-shadow-md)}.trigger{height:calc(2.25rem - 2px);color:inherit;font:inherit;white-space:nowrap;cursor:pointer;transition:background-color var(--lw-duration-fast) var(--lw-ease-out);background:0 0;border:0;align-items:center;gap:.5rem;padding-inline:.375rem .875rem;font-weight:500;display:flex}.trigger:hover{background:var(--lw-color-muted)}.trigger:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;outline-offset:-3px}.avatars{display:flex}.avatars .avatar{width:1.5rem;height:1.5rem;box-shadow:0 0 0 2px var(--lw-color-background);font-size:.625rem}.avatars .avatar+.avatar{margin-inline-start:-.375rem}.avatar{border-radius:var(--lw-radius-full);background:oklch(.62 .12 var(--_hue,260));color:#fff;width:2rem;height:2rem;font-size:var(--lw-text-xs);flex:none;justify-content:center;align-items:center;font-weight:600;display:inline-flex;overflow:hidden}.avatar img{object-fit:cover;width:100%;height:100%}.avatar.more{background:var(--lw-color-muted);color:var(--lw-color-muted-foreground)}.panel{gap:1rem;padding:1rem;display:grid}.heading{margin:0;font-weight:600}.invite{gap:.5rem;display:flex}.email{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);background:var(--lw-color-background);min-width:0;height:2rem;color:var(--lw-color-foreground);font:inherit;font-size:var(--lw-text-sm);flex:1;padding-inline:.625rem}.email::placeholder{color:var(--lw-color-muted-foreground)}.email:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.picker{display:inline-flex}.select{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);background:var(--lw-color-background);height:2rem;color:var(--lw-color-foreground);font:inherit;font-size:var(--lw-text-sm);white-space:nowrap;cursor:pointer;transition:background-color var(--lw-duration-fast) var(--lw-ease-out);flex:1;justify-content:space-between;align-items:center;gap:.25rem;padding-inline:.625rem .5rem;display:inline-flex}.select:hover,.select[aria-expanded=true]{background:var(--lw-color-muted)}.select:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.select .chevron{width:.875rem;height:.875rem;color:var(--lw-color-muted-foreground);transition:rotate var(--lw-duration-normal) var(--lw-ease-out)}.select[aria-expanded=true] .chevron{rotate:180deg}.role .select{color:var(--lw-color-muted-foreground);border-color:#0000}.people{gap:.75rem;margin:0;padding:0;list-style:none;display:grid}.person{align-items:center;gap:.625rem;display:flex}.who{flex:1;min-width:0;display:grid}.name,.address{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.name{font-size:var(--lw-text-sm);font-weight:500}.address,.owner,.access-label{color:var(--lw-color-muted-foreground);font-size:var(--lw-text-xs)}.owner{padding-inline:.5rem}.access{border-top:1px solid var(--lw-color-border);gap:.5rem;padding-top:1rem;display:grid}.access-label{font-weight:500}.access-row{align-items:center;gap:.625rem;display:flex}.access-icon{border-radius:var(--lw-radius-full);background:var(--lw-color-muted);justify-content:center;align-items:center;width:2rem;height:2rem;display:inline-flex}.access-icon .icon{display:none}:host(:not([access=link])) .access-icon .lock,:host([access=link]) .access-icon .globe{display:block}.access-picker{flex:1}.footer{justify-content:flex-end;display:flex}", f = 200, p = {
	opacity: [0, 1],
	translate: ["0 4px", "0 0"],
	filter: ["blur(4px)", "blur(0)"]
}, m = 1600, h = 3, g = "remove", _ = (e, t) => `<svg class="icon ${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${t}</svg>`, v = _("lock", "<rect x=\"4\" y=\"11\" width=\"16\" height=\"10\" rx=\"2\"/><path d=\"M8 11V7a4 4 0 0 1 8 0v4\"/>"), y = _("globe", "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18\"/>"), b = _("link", "<path d=\"M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7\"/><path d=\"M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7\"/>"), x = _("chevron", "<path d=\"m6 9 6 6 6-6\"/>"), S = (e, t, n = "") => `<span class="picker ${e}"><button class="select" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="${t}" ${n}><span class="select-text swap"></span>${x}</button>${s(t)}</span>`, C = ({ name: e, email: t }) => (e || t).split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((e) => e[0].toUpperCase()).join(""), w = (e) => [...e].reduce((e, t) => (e * 31 + t.charCodeAt(0)) % 360, 7), T = (e) => {
	let t = Object.assign(document.createElement("span"), { className: "avatar" });
	return t.style.setProperty("--_hue", w(e.email)), e.avatar ? t.append(Object.assign(document.createElement("img"), {
		src: e.avatar,
		alt: ""
	})) : t.textContent = C(e), t;
}, E = class extends e {
	static styles = [
		n,
		r,
		a,
		c,
		d
	];
	static props = {
		status: {
			default: "idle",
			reflect: !0
		},
		people: {
			type: Object,
			default: []
		},
		access: {
			default: "restricted",
			reflect: !0
		},
		link: { default: "" },
		label: { default: "Share" },
		heading: { default: "Share" },
		invitePlaceholder: { default: "Add people by email" },
		inviteLabel: { default: "Invite" },
		viewerLabel: { default: "Can view" },
		editorLabel: { default: "Can edit" },
		ownerLabel: { default: "Owner" },
		removeLabel: { default: "Remove access" },
		accessLabel: { default: "General access" },
		restrictedLabel: { default: "Only people invited" },
		linkLabel: { default: "Anyone with the link" },
		copyLabel: { default: "Copy link" },
		copiedLabel: { default: "Copied" },
		width: {
			type: Number,
			default: 380
		},
		align: {
			default: "start",
			reflect: !0
		}
	};
	#e = null;
	#t = null;
	#n = /* @__PURE__ */ new Map();
	#r = 0;
	#i = "viewer";
	#a = null;
	#o = !1;
	#s = 0;
	render() {
		return `<div class="shell" part="shell"><button class="trigger" type="button" aria-haspopup="dialog" aria-controls="panel" aria-expanded="false"><span class="avatars" aria-hidden="true"></span><span class="label"></span></button><div class="panel" id="panel" role="dialog" aria-labelledby="heading" hidden><p class="heading" id="heading"></p><form class="invite"><input class="email" type="email" required autocomplete="off">${S("invite-role", "invite-menu")}<lw-button class="invite-button" type="submit" size="sm" disabled></lw-button></form><ul class="people"></ul><div class="access"><span class="access-label" id="access-label"></span><div class="access-row"><span class="access-icon">${v}${y}</span>${S("access-picker", "access-menu", "aria-labelledby=\"access-label access-text\"")}</div></div><div class="footer"><lw-button class="copy" variant="outline" size="sm"><span slot="start">${b}</span><span class="copy-text"></span></lw-button></div></div></div><span class="live" aria-live="polite"></span>`;
	}
	connected() {
		this.#e ??= {
			shell: this.query(".shell"),
			trigger: this.query(".trigger"),
			panel: this.query(".panel"),
			email: this.query(".email"),
			inviteButton: this.query(".invite-button"),
			copy: this.query(".copy")
		};
		let { trigger: e, panel: t, email: n, copy: r } = this.#e, i = { signal: this.signal };
		if (this.query(".access-picker .select-text").id = "access-text", this.#t = {
			invite: this.#c(this.query(".invite-role"), this.signal, (e) => {
				this.#i = e, this.#u();
			}),
			access: this.#c(this.query(".access-picker"), this.signal, (e) => this.#h(e))
		}, e.addEventListener("click", () => this.status = "open", i), t.addEventListener("keydown", (e) => e.key === "Escape" && !e.defaultPrevented && (this.status = "idle"), i), this.query(".invite").addEventListener("submit", this.#p, i), n.addEventListener("input", () => this.#e.inviteButton.disabled = !n.value || !n.checkValidity(), i), r.addEventListener("click", () => this.#g(), i), document.addEventListener("pointerdown", (e) => e.composedPath().includes(this) || (this.status = "idle"), i), this.signal.addEventListener("abort", () => clearTimeout(this.#s)), this.#n.size) {
			for (let e of this.#n.values()) e.node.remove();
			this.#n.clear(), this.#d();
		}
	}
	updated(e) {
		let { panel: t, email: n, inviteButton: r } = this.#e;
		for (let [t, n] of Object.entries({
			label: ".label",
			heading: ".heading",
			accessLabel: ".access-label",
			copyLabel: ".copy-text"
		})) e.has(t) && (this.query(n).textContent = this[t]);
		e.has("invitePlaceholder") && (n.placeholder = this.invitePlaceholder, n.ariaLabel = this.invitePlaceholder), e.has("inviteLabel") && (r.textContent = this.inviteLabel), e.has("width") && (t.style.width = `${this.width - 2}px`), [
			"access",
			"viewerLabel",
			"editorLabel",
			"restrictedLabel",
			"linkLabel"
		].some((t) => e.has(t)) && this.#u(), [
			"people",
			"viewerLabel",
			"editorLabel",
			"ownerLabel",
			"removeLabel"
		].some((t) => e.has(t)) && this.#d(), e.has("status") && this.#_();
	}
	#c(e, t, n) {
		let r = e.querySelector(".select"), i = new o({
			trigger: r,
			menu: e.querySelector(".menu"),
			onPick: n
		});
		return i.connect(t), { set(e, t) {
			i.setItems(e), i.setChecked(t), l(r.querySelector(".select-text"), e.find((e) => e.value === t)?.label ?? "", r);
		} };
	}
	get #l() {
		return [{
			value: "viewer",
			label: this.viewerLabel
		}, {
			value: "editor",
			label: this.editorLabel
		}];
	}
	#u() {
		this.#t.invite.set(this.#l, this.#i), this.#t.access.set([{
			value: "restricted",
			label: this.restrictedLabel
		}, {
			value: "link",
			label: this.linkLabel
		}], this.access);
	}
	#d() {
		let e = this.people ?? [], t = e.slice(0, h).map(T);
		e.length > h && t.push(Object.assign(document.createElement("span"), {
			className: "avatar more",
			textContent: `+${e.length - h}`
		})), this.query(".avatars").replaceChildren(...t);
		let n = [...this.#l, {
			value: g,
			label: this.removeLabel
		}], r = this.query(".people"), i = new Set(e.map((e) => e.email));
		for (let [e, t] of this.#n) i.has(e) || (t.controller.abort(), t.node.remove(), this.#n.delete(e));
		e.forEach((e, t) => {
			let i = this.#n.get(e.email);
			i || (i = this.#f(e), this.#n.set(e.email, i)), i.update(e, n), r.children[t] !== i.node && r.insertBefore(i.node, r.children[t] ?? null);
		});
	}
	#f(e) {
		let t = Object.assign(document.createElement("li"), { className: "person" }), n = Object.assign(document.createElement("span"), { className: "name" }), r = Object.assign(document.createElement("span"), { className: "address" }), i = Object.assign(document.createElement("span"), { className: "who" });
		i.append(n, r);
		let a = new AbortController(), o, s = null;
		if (e.role === "owner") o = Object.assign(document.createElement("span"), { className: "owner" });
		else {
			let t = document.createElement("template");
			t.innerHTML = S("role", `role-menu-${++this.#r}`), o = t.content.firstElementChild;
			let n = AbortSignal.any([this.signal, a.signal]);
			s = this.#c(o, n, (t) => this.#m(e.email, t));
		}
		return t.append(T(e), i, o), {
			node: t,
			controller: a,
			update: (e, t) => {
				if (n.textContent = e.name || e.email, r.textContent = e.name ? e.email : "", !s) {
					o.textContent = this.ownerLabel;
					return;
				}
				s.set(t, e.role);
				let i = t.find((t) => t.value === e.role)?.label ?? "";
				o.querySelector(".select").ariaLabel = `${e.name || e.email}: ${i}`;
			}
		};
	}
	#p = (e) => {
		e.preventDefault();
		let { email: t, inviteButton: n } = this.#e, r = t.value.trim().toLowerCase(), i = this.#i;
		r && t.checkValidity() && !this.people.some((e) => e.email === r) && this.emit("invite", {
			email: r,
			role: i
		}) && (this.people = [...this.people, {
			email: r,
			role: i
		}], t.value = "", n.disabled = !0, t.focus());
	};
	#m(e, t) {
		let n = this.people.find((t) => t.email === e);
		if (!n || t === n.role) return;
		let r = () => this.#n.get(e)?.update(n, [...this.#l, {
			value: g,
			label: this.removeLabel
		}]);
		t === g ? this.emit("remove", { email: e }) ? this.people = this.people.filter((e) => e !== n) : r() : this.emit("role-change", {
			email: e,
			role: t
		}) ? this.people = this.people.map((e) => e === n ? {
			...e,
			role: t
		} : e) : r();
	}
	#h(e) {
		e !== this.access && (this.emit("access-change", { access: e }) ? this.access = e : this.#u());
	}
	async #g() {
		try {
			await u(this.link);
		} catch {
			return;
		}
		this.emit("copy", { link: this.link }), this.query(".copy-text").textContent = this.copiedLabel, this.query(".live").textContent = this.copiedLabel, clearTimeout(this.#s), this.#s = setTimeout(() => {
			this.query(".copy-text").textContent = this.copyLabel, this.query(".live").textContent = "";
		}, m);
	}
	#_() {
		let e = this.status === "open" ? "open" : "idle", t = this.#a;
		if (e === t) return;
		this.#a = e;
		let { shell: n, trigger: r, panel: a, email: o } = this.#e;
		i({
			host: this,
			shell: n,
			parts: {
				trigger: r,
				panel: a
			},
			visible: [e === "open" ? "panel" : "trigger"],
			opening: t === "idle",
			closing: e === "idle" && t !== null,
			animate: t !== null,
			isClosed: () => this.#a === "idle",
			enter: (e) => [e === a ? p : { opacity: [0, 1] }, {
				duration: f,
				delay: e === a ? 80 : 100,
				easing: "ease-out",
				fill: "backwards"
			}]
		}), r.ariaExpanded = String(e === "open"), e === "open" ? (o.focus({ preventScroll: !0 }), this.#o = !0) : this.#o && (this.#o = !1, (this.matches(":focus-within") || document.activeElement === document.body) && r.focus({ preventScroll: !0 }));
	}
};
//#endregion
//#region src/components/share-button/index.js
t("share-button", E);
//#endregion
export { E as t };
