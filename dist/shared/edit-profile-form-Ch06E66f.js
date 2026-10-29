import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./icons-HWomdoMw.js";
import { r } from "./icons-Dv1KN71n.js";
import { i } from "./menu-BCEGADW6.js";
import { n as a } from "./swap-BK53XQML.js";
import { n as o } from "./people-C_zYMoEl.js";
import { K as s, V as c, l, w as u, y as d } from "./lucide-BVbUPHVq.js";
import { n as f, t as p } from "./picker-CFtn-7gY.js";
//#region src/components/edit-profile-form/edit-profile-form.scss?inline
var m = ".picker-trigger{border-radius:var(--lw-radius-md);font:inherit;color:var(--lw-color-foreground);cursor:pointer;background:0 0;border:0;outline:none;align-items:center;gap:.375rem;padding:.375rem .5rem;display:inline-flex}.picker-trigger:hover,.picker-trigger[aria-expanded=true]{background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent)}.picker-trigger:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.picker-trigger>svg{color:var(--lw-color-muted-foreground);flex:none}.picker-label{color:var(--lw-color-muted-foreground)}:host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:36rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:0;display:block;overflow:hidden;container-type:inline-size}p{margin:0}a,button{font:inherit;color:inherit;outline:none}a:focus-visible,button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.preview{background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));padding:1.5rem 1.75rem}.preview-head{color:var(--_muted);justify-content:space-between;margin-bottom:1rem;display:flex}.scope{align-items:center;gap:.375rem;display:inline-flex}.card{border:1px solid var(--_line);background:var(--lw-color-background);border-radius:1rem;padding:0 1.5rem 1.5rem;position:relative;overflow:hidden}.banner{border-bottom:1px solid var(--_line);fill:none;width:calc(100% + 3rem);height:4rem;stroke:color-mix(in oklab, var(--lw-color-foreground) 30%, transparent);stroke-width:1px;margin:0 -1.5rem;display:block}.avatar{background:50%/cover;border-radius:50%;place-items:center;font-weight:600;display:grid}.avatar.big{width:4.5rem;height:4.5rem;box-shadow:0 0 0 4px var(--lw-color-background);margin-top:-2.25rem;font-size:1.375rem}.avatar.small{width:2.25rem;height:2.25rem;font-size:var(--lw-text-xs)}.avatar[data-style=ring]{background-color:color-mix(in oklab, var(--lw-color-foreground) 10%, var(--lw-color-background))}.avatar[data-style=light]{background-color:var(--lw-color-foreground);color:var(--lw-color-background)}.avatar[data-style=gray]{background-color:color-mix(in oklab, var(--lw-color-foreground) 35%, var(--lw-color-background))}.avatar[data-style=outline]{box-shadow:inset 0 0 0 1.5px color-mix(in oklab, var(--lw-color-foreground) 50%, transparent)}.avatar[data-style=dots]{background-image:radial-gradient(color-mix(in oklab, var(--lw-color-foreground) 35%, transparent) 1px, transparent 1.2px);background-size:5px 5px}.avatar[data-image]{color:#0000}.site{text-underline-offset:.25em;align-items:center;gap:.375rem;text-decoration:underline;text-decoration-thickness:1px;display:inline-flex;position:absolute;top:4.75rem;right:1.5rem}.site svg{color:var(--_muted)}.site[hidden]{display:none}.who{font-size:var(--lw-text-lg);margin-top:.75rem}.who b{font-weight:600}.p-pronouns,.p-handle{color:var(--_muted)}.p-pronouns{font-size:var(--lw-text-md)}.p-handle{font-size:var(--lw-text-md);margin-top:.125rem}.facts{color:var(--_muted);flex-wrap:wrap;gap:.5rem 1.25rem;margin-top:1rem;display:flex}.fact{align-items:center;gap:.375rem;display:inline-flex}.p-bio{font-size:var(--lw-text-md);margin-top:1rem;line-height:1.6}.form{border-top:1px solid var(--_line);padding:1.5rem 1.75rem 1.75rem}.label{margin-bottom:.375rem;font-weight:500;display:block}.avatars{align-items:center;gap:1rem;margin-bottom:1.5rem;display:flex}.avatars .label{flex:1;margin:0}.styles{border-right:1px solid var(--_line);gap:.375rem;padding-right:1rem;display:flex}.style{cursor:pointer;background:0 0;border:0;border-radius:50%;padding:2px}.style[aria-checked=true]{box-shadow:0 0 0 2px var(--lw-color-foreground)}.upload{border:1px solid var(--_line);border-radius:var(--lw-radius-md);cursor:pointer;padding:.5rem .875rem}.upload:hover{background:color-mix(in oklab, var(--lw-color-foreground) 5%, transparent)}.upload:focus-within{outline:2px solid var(--lw-color-ring);outline-offset:2px}.upload input{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.grid{gap:1.25rem 1rem;display:grid}@container (width>=30rem){.grid{grid-template-columns:1fr 1fr}}.grid lw-text-input,.grid lw-textarea{width:100%}.wide{grid-column:1/-1}.pronouns .picker,.pronouns .picker-trigger{width:100%;display:flex}.pronouns .picker-trigger{box-sizing:border-box;border:1px solid var(--_line);justify-content:space-between;height:2.5rem;padding:0 .75rem}.foot{align-items:center;gap:.5rem;margin-top:1.75rem;display:flex}.state{color:var(--_muted);flex:1}", h = [
	"they/them",
	"she/her",
	"he/him",
	"any pronouns"
].map((e) => ({
	value: e,
	label: e
})), g = [
	"ring",
	"light",
	"gray",
	"outline",
	"dots"
], _ = /^[a-z0-9_]{3,20}$/, v = 160, y = {
	name: "Alex Morgan",
	pronouns: "they/them",
	username: "alexmorgan",
	website: "alexmorgan.dev",
	role: "Systems engineer",
	location: "Lisbon",
	timeZone: "Europe/Lisbon",
	bio: "Writing small, fast C at LowerSoft. Slow mornings, fast binaries."
}, b = `<svg class="banner" viewBox="0 0 400 60" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${Array.from({ length: 22 }, (e, t) => `<path d="M${10 + t * 8} 0V60"/>`).join("")}${Array.from({ length: 8 }, (e, t) => `<circle cx="350" cy="64" r="${8 + t * 9}"/>`).join("")}</svg>`, x = class extends e {
	static styles = [
		n,
		i,
		a,
		m
	];
	static props = {
		profile: {
			type: Object,
			default: y
		},
		avatarStyle: {
			default: "ring",
			reflect: !0
		}
	};
	#e = {};
	#t = {};
	#n = null;
	#r;
	#i = 0;
	render() {
		return `<section class="preview" aria-label="Preview"><header class="preview-head"><span>Preview · how others see you</span><span class="scope">${r(u, 15)}Workspace</span></header>
<div class="card">${b}<span class="avatar big" aria-hidden="true"></span><a class="site">${r(c, 15)}<span class="site-text"></span></a><p class="who"><b class="p-name"></b> <span class="p-pronouns"></span></p><p class="p-handle"></p>
<p class="facts"><span class="fact">${r(l, 15)}<span class="p-role"></span></span><span class="fact">${r(s, 15)}<span class="p-location"></span></span><span class="fact">${r(d, 15)}<span class="p-time"></span></span></p><p class="p-bio"></p></div></section>
<form class="form" novalidate><div class="row avatars"><span class="label" id="avatar-label">Avatar</span><div class="styles" role="radiogroup" aria-labelledby="avatar-label">${g.map((e) => `<button class="style" type="button" role="radio" data-style="${e}" aria-label="${e}"><span class="avatar small" data-style="${e}"></span></button>`).join("")}</div><label class="upload"><input class="file" type="file" accept="image/*">Upload</label></div>
<div class="grid"><lw-text-input class="field" data-key="name" label="Display name" autocomplete="name"></lw-text-input><div class="pronouns"><span class="label">Pronouns</span>${f("pronoun-menu")}</div>
<lw-text-input class="field" data-key="username" label="Username" autocomplete="username" maxlength="20"><span slot="start">@</span></lw-text-input><lw-text-input class="field" data-key="website" label="Website" type="url" inputmode="url"><span slot="start">https://</span></lw-text-input>
<lw-text-input class="field" data-key="role" label="Role"><span slot="start">${r(l, 16)}</span></lw-text-input><lw-text-input class="field" data-key="location" label="Location"><span slot="start">${r(s, 16)}</span></lw-text-input>
<lw-textarea class="field wide" data-key="bio" label="Bio" rows="3" maxlength="${v}" counter></lw-textarea></div>
<footer class="foot"><p class="state" aria-live="polite"></p><lw-button class="reset" variant="ghost">Reset</lw-button><lw-button class="save" type="submit">Save profile</lw-button></footer></form>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.#r = p(this.query(".pronouns"), this.signal, (e) => this.#o("pronouns", e)), this.query(".pronouns .picker-trigger").setAttribute("aria-label", "Pronouns"), this.query(".grid").addEventListener("input", (e) => {
			let t = e.target.closest(".field");
			t && this.#o(t.dataset.key, t.value ?? "");
		}, e);
		let t = this.query(".styles");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".style");
			t && (this.#n = null, this.avatarStyle = t.dataset.style, this.#l());
		}, e), t.addEventListener("keydown", (e) => {
			let t = {
				ArrowRight: 1,
				ArrowDown: 1,
				ArrowLeft: -1,
				ArrowUp: -1
			}[e.key];
			t && (e.preventDefault(), this.avatarStyle = g[(g.indexOf(this.avatarStyle) + t + g.length) % g.length], this.query(`.style[data-style="${this.avatarStyle}"]`).focus());
		}, e), this.query(".file").addEventListener("change", (e) => {
			let t = e.target.files[0];
			t && (this.#n && URL.revokeObjectURL(this.#n.url), this.#n = {
				file: t,
				url: URL.createObjectURL(t)
			}, this.#l());
		}, e), this.query(".form").addEventListener("submit", (e) => {
			e.preventDefault(), this.#d();
		}, e), this.query(".reset").addEventListener("click", () => this.#a(this.#t), e), this.#i = setInterval(() => this.#u(), 3e4), this.signal.addEventListener("abort", () => {
			clearInterval(this.#i), this.#n && URL.revokeObjectURL(this.#n.url);
		});
	}
	updated(e) {
		e.has("profile") ? (this.#t = {
			...y,
			...this.profile
		}, this.#a(this.#t)) : this.#l();
	}
	#a(e) {
		this.#e = { ...e };
		for (let t of this.shadowRoot.querySelectorAll(".field")) t.value = e[t.dataset.key] ?? "";
		this.#l();
	}
	#o(e, t) {
		this.#e[e] = t, this.#l();
	}
	get #s() {
		let e = this.#e.username ?? "";
		return _.test(e) ? "" : "3 to 20 lowercase letters, numbers or underscores.";
	}
	get #c() {
		return !!(this.#n && !this.#n.saved) || Object.keys(this.#e).some((e) => this.#e[e] !== this.#t[e]);
	}
	#l() {
		let e = this.#e, t = o(e.name || "?");
		for (let e of this.shadowRoot.querySelectorAll(".avatar")) e.textContent = t, e.classList.contains("big") && (e.dataset.style = this.avatarStyle, e.style.backgroundImage = this.#n ? `url("${this.#n.url}")` : "", e.toggleAttribute("data-image", !!this.#n));
		for (let e of this.shadowRoot.querySelectorAll(".style")) {
			let t = !this.#n && e.dataset.style === this.avatarStyle;
			e.ariaChecked = String(t), e.tabIndex = t || this.#n && e.dataset.style === g[0] ? 0 : -1;
		}
		this.query(".p-name").textContent = e.name || "Your name", this.query(".p-pronouns").textContent = e.pronouns ?? "", this.query(".p-handle").textContent = `@${e.username || "username"}`, this.query(".p-role").textContent = e.role || "Role", this.query(".p-location").textContent = e.location || "Location", this.query(".p-bio").textContent = e.bio ?? "";
		let n = this.query(".site");
		n.hidden = !e.website, n.href = e.website ? `https://${e.website.replace(/^https?:\/\//, "")}` : "#", this.query(".site-text").textContent = (e.website ?? "").replace(/^https?:\/\//, ""), this.#u(), this.#r?.set(h, e.pronouns);
		let r = this.query(".field[data-key=\"username\"]");
		r && (r.error = e.username === this.#t.username ? "" : this.#s);
		let i = this.#c;
		this.query(".save").disabled = !i || !!this.#s, this.query(".reset").hidden = !i, this.query(".state").textContent = i ? "Unsaved changes" : "";
	}
	#u() {
		let e = "";
		try {
			e = new Intl.DateTimeFormat("en-US", {
				hour: "numeric",
				minute: "2-digit",
				timeZone: this.#e.timeZone
			}).format(/* @__PURE__ */ new Date());
		} catch {
			e = new Intl.DateTimeFormat("en-US", {
				hour: "numeric",
				minute: "2-digit"
			}).format(/* @__PURE__ */ new Date());
		}
		this.query(".p-time").textContent = `${e} local`;
	}
	#d() {
		if (!this.#c || this.#s) return;
		this.#t = { ...this.#e };
		let e = this.#n?.file ?? null;
		this.emit("save", {
			profile: { ...this.#t },
			avatar: e
		}), this.#n = this.#n ? {
			...this.#n,
			saved: !0
		} : null, this.#l(), this.query(".state").textContent = "Saved";
	}
};
//#endregion
//#region src/components/edit-profile-form/index.js
t("edit-profile-form", x);
//#endregion
export { x as t };
