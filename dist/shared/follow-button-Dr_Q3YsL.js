import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./icons-Dv1KN71n.js";
import { t as n } from "./button-CQIqPjy6.js";
import { n as r, t as i } from "./rolling-VjfpUD4B.js";
import { i as a, n as o, t as s } from "./menu-BCEGADW6.js";
//#region src/components/follow-button/follow-button.scss?inline
var c = ":host([following]){--_bg:var(--lw-color-secondary);--_fg:var(--lw-color-secondary-foreground);--_border:transparent}.main{gap:.625rem}:host([count]) .main{padding-inline-end:.375rem}:host([following]) .main:is(.armed:hover,:focus-visible){color:var(--lw-color-destructive)}.labels{display:grid}.label{transition:opacity var(--lw-duration-fast) var(--lw-ease-out);grid-area:1/1;justify-content:center;align-items:center;gap:.375rem;display:flex}.following,.unfollow,:host([following]) .follow,:host([following]) .main:is(.armed:hover,:focus-visible) .following{opacity:0}:host([following]) .following,:host([following]) .main:is(.armed:hover,:focus-visible) .unfollow{opacity:1}.bell{opacity:0;border-width:0;flex:none;width:0;margin-inline-start:0;padding:0;overflow:hidden}@media (prefers-reduced-motion:no-preference){.bell{transition:width var(--lw-duration-normal) var(--lw-ease-out), margin var(--lw-duration-normal) var(--lw-ease-out), opacity var(--lw-duration-normal) var(--lw-ease-out), background-color var(--lw-duration-fast) var(--lw-ease-out)}}:host([following]) .bell{width:var(--_height);opacity:1;border-width:1px;margin-inline-start:.375rem}.bell .icon{display:none}:host(:not([notifications=highlights],[notifications=none])) .bell .ring,:host([notifications=highlights]) .bell .plain,:host([notifications=none]) .bell .off{display:block}", l = (e, t) => `<svg class="icon ${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${t}</svg>`, u = "<path d=\"M10.3 21a2 2 0 0 0 3.4 0M3.3 15.3A1 1 0 0 0 4 17h16a1 1 0 0 0 .7-1.7C19.4 14 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.4 6-2.7 7.3\"/>", d = [
	l("ring", `${u}<path d="M22 8c0-2.3-.8-4.3-2-6M4 2C2.8 3.7 2 5.7 2 8"/>`),
	l("plain", u),
	l("off", `${u}<path d="m2 2 20 20"/>`)
].join(""), f = new Intl.NumberFormat(void 0, { numberingSystem: "latn" }), p = class extends n {
	static styles = [
		...n.styles,
		r,
		a,
		c
	];
	static props = {
		...n.props,
		following: {
			type: Boolean,
			reflect: !0
		},
		count: {
			type: Number,
			reflect: !0
		},
		notifications: {
			default: "all",
			reflect: !0
		},
		label: { default: "Follow" },
		followingLabel: { default: "Following" },
		unfollowLabel: { default: "Unfollow" },
		countLabel: { default: "followers" },
		bellLabel: { default: "Notifications" },
		allLabel: { default: "All posts" },
		highlightsLabel: { default: "Highlights only" },
		noneLabel: { default: "None" }
	};
	#e = null;
	render() {
		return `<button class="button main armed" part="button" type="button"><span class="labels" aria-hidden="true"><span class="label follow"></span><span class="label following">${t}<span class="following-text"></span></span><span class="label unfollow"></span></span><span class="count rolling" aria-hidden="true" hidden></span></button><button class="button bell" part="bell" type="button" aria-haspopup="menu" aria-controls="menu" aria-expanded="false">${d}</button>${s}`;
	}
	connected() {
		super.connected();
		let e = this.query(".main"), t = { signal: this.signal }, n = () => e.classList.add("armed");
		e.addEventListener("pointerleave", n, t), e.addEventListener("blur", n, t), this.#e ??= new o({
			trigger: this.query(".bell"),
			menu: this.query(".menu"),
			onPick: (e) => this.#t(e)
		}), this.#e.connect(this.signal);
	}
	updated(e) {
		super.updated(e);
		let t = this.query(".main"), n = this.query(".bell");
		for (let [t, n] of Object.entries({
			label: ".follow",
			followingLabel: ".following-text",
			unfollowLabel: ".unfollow"
		})) e.has(t) && (this.query(n).textContent = this[t]);
		e.has("bellLabel") && (n.ariaLabel = this.bellLabel), [
			"allLabel",
			"highlightsLabel",
			"noneLabel"
		].some((t) => e.has(t)) && (this.#e.setItems([
			{
				value: "all",
				label: this.allLabel
			},
			{
				value: "highlights",
				label: this.highlightsLabel
			},
			{
				value: "none",
				label: this.noneLabel
			}
		]), this.#e.setChecked(this.notifications)), e.has("notifications") && this.#e.setChecked(this.notifications), e.has("following") && (t.ariaPressed = String(this.following), n.inert = !this.following, this.following || this.#e.close()), [
			"label",
			"count",
			"countLabel",
			"following"
		].some((t) => e.has(t)) && this.#n();
	}
	handleClick(e) {
		super.handleClick(e);
		let t = this.query(".main");
		if (this.following && e.detail !== 0 && !t.classList.contains("armed")) return;
		let n = !this.following;
		this.emit("change", { following: n }) && (this.following = n, n && t.classList.remove("armed"));
	}
	#t(e) {
		e !== this.notifications && this.emit("notifications-change", { notifications: e }) && (this.notifications = e);
	}
	#n() {
		let e = this.query(".count"), t = this.query(".main");
		if (e.hidden = this.count == null, e.hidden) {
			t.ariaLabel = this.label;
			return;
		}
		let n = f.format(this.count + +!!this.following);
		t.ariaLabel = `${this.label}, ${n} ${this.countLabel}`, i(e, n);
	}
};
//#endregion
//#region src/components/follow-button/index.js
e("follow-button", p);
//#endregion
export { p as t };
