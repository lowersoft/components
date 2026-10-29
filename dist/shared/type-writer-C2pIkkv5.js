import { n as e, t } from "./core-WcEz9YgG.js";
import { n } from "./motion-CFWhFfc_.js";
import { t as r } from "./visibility--H4IXDjD.js";
//#region src/components/type-writer/type-writer.scss?inline
var i = ":host{font-family:var(--lw-font-mono);line-height:1.2;display:inline-block}.stage{white-space:pre;justify-items:start;padding-inline-end:.25em;display:inline-grid}@media (prefers-reduced-motion:no-preference){.stage{transition:opacity .5s var(--lw-ease-out)}@starting-style{.stage{opacity:0}}}.sizer,.line{grid-area:1/1}.sizer{visibility:hidden}.line{min-height:1.2em}.caret-box{width:0;display:inline-block;position:relative}.caret{background:currentColor;width:.08em;min-width:2px;height:1.05em;position:absolute;bottom:-.1em;left:.04em}@media (prefers-reduced-motion:no-preference){.caret[data-idle]{animation:1s linear infinite blink}}@keyframes blink{0%,33.333%{opacity:1}66.667%,to{opacity:0}}.selected{background:color-mix(in oklab, Highlight 35%, transparent);border-radius:.08em}.phrases{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}", a = 100, o = 500, s = 250, c = 120, l = 220, u = [
	"qwertyuiop",
	"asdfghjkl",
	"zxcvbnm"
], d = (e = "") => {
	let t = e.toLowerCase(), n = u.findIndex((e) => e.includes(t));
	if (n === -1) return "";
	let r = u[n].indexOf(t), i = [
		u[n][r - 1],
		u[n][r + 1],
		u[n - 1]?.[r],
		u[n + 1]?.[r]
	].filter(Boolean).join("");
	return e === t ? i : i.toUpperCase();
}, f = (e) => {
	let t = Math.abs(Math.floor(e)) % 2147483646 + 1;
	return () => (t = t * 16807 % 2147483647, (t - 1) / 2147483646);
}, p = class extends Error {}, m = class extends e {
	static styles = i;
	static props = {
		typingSpeed: {
			type: Number,
			default: 50
		},
		deleteSpeed: {
			type: Number,
			default: 30
		},
		startDelay: {
			type: Number,
			default: 200
		},
		pause: {
			type: Number,
			default: 1e3
		},
		loopDelay: {
			type: Number,
			default: 1e3
		},
		noLoop: { type: Boolean },
		steady: { type: Boolean },
		deleteMode: { default: "backspace" },
		typos: {
			type: Number,
			default: 0
		},
		seed: {
			type: Number,
			default: 7
		},
		paused: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = [];
	#t = {
		phrase: 0,
		char: 0,
		deleting: !1
	};
	#n = f(7);
	#r = null;
	#i = /* @__PURE__ */ new Set();
	#a = 0;
	#o = !1;
	render() {
		return "<span class=\"phrases\"></span><span class=\"stage\" part=\"text\" aria-hidden=\"true\"><span class=\"line\"><span class=\"kept\"></span><span class=\"caret-box\"><span class=\"caret\" part=\"caret\" data-idle></span></span><span class=\"selected\"></span></span></span>";
	}
	connected() {
		let e = { signal: this.signal }, t = new MutationObserver(() => this.#s());
		t.observe(this, {
			childList: !0,
			subtree: !0,
			characterData: !0,
			attributes: !0
		}), r(this, (e) => {
			this.#o = e, this.#c();
		}, this.signal), n.addEventListener("change", () => this.#c(), e), this.signal.addEventListener("abort", () => {
			t.disconnect(), this.#l();
		}), this.#s();
	}
	updated(e) {
		e.has("seed") && (this.#n = f(this.seed)), this.#c();
	}
	#s() {
		this.#e = [...this.children].map((e) => ({
			text: e.textContent.trim(),
			pause: e.dataset.pause ? Number(e.dataset.pause) : void 0
		})).filter(({ text: e }) => e), this.query(".phrases").textContent = this.#e.map(({ text: e }) => e).join(", ");
		let e = this.#e.map(({ text: e }) => Object.assign(document.createElement("span"), {
			className: "sizer",
			textContent: e
		}));
		this.query(".stage").replaceChildren(...e, this.query(".line")), this.#c();
	}
	#c() {
		if (!this.isConnected) return;
		if (n.matches) {
			this.#l(), this.#u(this.#e.at(-1)?.text ?? "");
			return;
		}
		let e = this.#o && !this.paused && this.#e.length > 0;
		e && !this.#r ? this.#p() : e || this.#l();
	}
	#l() {
		this.#r = null, this.#i.forEach(clearTimeout), this.#i.clear(), clearTimeout(this.#a), this.query(".caret").toggleAttribute("data-idle", !0);
	}
	#u(e, t = 0) {
		this.query(".kept").textContent = e.slice(0, e.length - t), this.query(".selected").textContent = e.slice(e.length - t);
	}
	#d() {
		let e = this.query(".caret");
		e.removeAttribute("data-idle"), clearTimeout(this.#a), this.#a = setTimeout(() => e.setAttribute("data-idle", ""), o);
	}
	#f() {
		let e = this.typingSpeed;
		if (this.steady) return e;
		let t = this.#n();
		return t < .1 ? e * 2 : t > .9 ? e * .5 : e * (.6 + this.#n() * .8);
	}
	async #p() {
		let e = {};
		this.#r = e;
		let t = this.#t, n = (t) => new Promise((n, r) => {
			if (this.#r !== e) return r(new p());
			let i = setTimeout(() => {
				this.#i.delete(i), this.#r === e ? n() : r(new p());
			}, t);
			this.#i.add(i);
		}), r = async (e) => {
			let r = d(e[t.char]);
			if (r && this.#n() < this.typos) {
				let i = r[Math.floor(this.#n() * r.length)];
				this.#u(e.slice(0, t.char) + i), this.#d(), await n(s + this.typingSpeed), this.#u(e.slice(0, t.char)), this.#d(), await n(this.typingSpeed * 1.5);
			}
			t.char += 1, this.#u(e.slice(0, t.char)), this.#d(), await n(this.#f());
		}, i = async (e) => {
			if (this.deleteMode === "select") {
				let r = t.char;
				for (let t = 1; t <= r; t++) this.#u(e.slice(0, r), t), this.#d(), await n(c / Math.max(r, 1));
				await n(l), t.char = 0, this.#u(""), this.#d();
			} else for (; t.char > 0;) --t.char, this.#u(e.slice(0, t.char)), this.#d(), await n(this.deleteSpeed);
		}, o = async (e) => {
			let r = t.phrase >= this.#e.length - 1;
			return r && this.noLoop ? !1 : (t.phrase = r ? 0 : t.phrase + 1, t.char = 0, t.deleting = !1, await n(r ? this.loopDelay : e), this.#u(""), !0);
		}, u = async () => {
			t.phrase >= this.#e.length && Object.assign(t, {
				phrase: 0,
				char: 0,
				deleting: !1
			});
			let e = this.#e[t.phrase];
			if (!e) return !1;
			let { text: s } = e;
			if (t.char = Math.min(t.char, s.length), this.#u(s.slice(0, t.char)), !t.deleting) {
				for (; t.char < s.length;) await r(s);
				if (t.phrase === this.#e.length - 1 && this.noLoop) return !1;
				await n(e.pause ?? this.pause), t.deleting = !0;
			}
			return await i(s), o(a);
		};
		try {
			for (await n(this.startDelay); await u(););
		} catch (e) {
			if (!(e instanceof p)) throw e;
		} finally {
			this.#r === e && (this.#r = null);
		}
	}
};
//#endregion
//#region src/components/type-writer/index.js
t("type-writer", m);
//#endregion
export { m as t };
