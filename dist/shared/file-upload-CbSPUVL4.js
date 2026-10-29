import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./icons-HWomdoMw.js";
import { t as r } from "./icons-Dv1KN71n.js";
import { n as i, t as a } from "./form-QHOiInAj.js";
import { n as o } from "./motion-CFWhFfc_.js";
//#region src/components/file-upload/file-upload.scss?inline
var s = ":host{--_tint:color-mix(in oklab, var(--lw-color-foreground) 4%, transparent);--_tint-strong:color-mix(in oklab, var(--lw-color-foreground) 8%, transparent);--_line:color-mix(in oklab, var(--lw-color-foreground) 22%, transparent);max-width:24rem;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);display:block}[hidden]{display:none!important}.card{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-lg);background:var(--lw-color-background);box-shadow:var(--lw-shadow-sm);padding:.5rem}button{font:inherit;color:inherit;cursor:pointer}.zone{border:1px dashed var(--_line);border-radius:var(--lw-radius-md);background:var(--_tint);text-align:center;outline:none;flex-direction:column;align-items:center;gap:.75rem;width:100%;padding:1.5rem 1rem;transition:border-color .15s ease-out,background-color .15s ease-out;display:flex}.zone:hover:not([aria-disabled]),.zone[data-armed]{border-color:color-mix(in oklab, var(--lw-color-foreground) 40%, transparent);background:var(--_tint-strong)}.zone:active:not([aria-disabled]){background:var(--lw-color-muted)}.zone[data-over]{border-style:solid;border-color:var(--lw-color-foreground);background:var(--lw-color-muted)}.zone[aria-disabled]{cursor:not-allowed;border-color:var(--lw-color-border)}.zone:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.zone-icon{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);background:var(--lw-color-background);width:2.25rem;height:2.25rem;box-shadow:var(--lw-shadow-sm);color:var(--lw-color-muted-foreground);justify-content:center;align-items:center;transition:color .15s ease-out,border-color .15s ease-out;display:flex}:is([data-armed],[data-over])>.zone-icon{border-color:var(--_line);color:var(--lw-color-foreground)}.upload{transition:translate .2s ease-out}@media (prefers-reduced-motion:no-preference){:is([data-armed],[data-over]) .upload{translate:0 -2px}}.copy{flex-direction:column;gap:.25rem;display:flex}.title{font-size:var(--lw-text-sm);font-weight:500}[aria-disabled] .title{color:var(--lw-color-muted-foreground)}.browse{text-decoration:underline;-webkit-text-decoration-color:var(--_line);text-decoration-color:var(--_line);text-underline-offset:3px;transition:text-decoration-color .15s ease-out}.zone:hover .browse{text-decoration-color:currentColor}.hint,.summary,.clear{font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground)}.notice{font-size:var(--lw-text-xs);color:var(--lw-color-destructive);margin:.5rem 0 0;padding-inline:.25rem}.list{margin:.25rem 0 0;padding:0 .25rem;list-style:none}.row,.footer{overflow:hidden}.row-body{align-items:center;gap:.75rem;padding:.625rem .25rem;display:flex;position:relative}.thumb{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-sm);background:var(--_tint) center/cover;width:2.25rem;height:2.25rem;font:500 9px/1 var(--lw-font-mono);letter-spacing:.05em;color:var(--lw-color-muted-foreground);flex:none;justify-content:center;align-items:center;display:flex}.thumb[data-image]{border-color:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent)}.info{flex-direction:column;flex:1;min-width:0;display:flex}.name,.meta{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.name{font-size:.8125rem;font-weight:500;line-height:1.25rem}.meta{font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);line-height:1rem}.dot{opacity:.5;padding-inline:.25rem}:is([data-status=error],[data-status=rejected]) .status{color:var(--lw-color-destructive)}.actions{flex:none;align-items:center;gap:.25rem;display:flex}.done,.action{justify-content:center;align-items:center;min-width:1.75rem;height:1.75rem;display:flex}.done{color:var(--lw-color-accent)}.action{border-radius:var(--lw-radius-sm);font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);background:0 0;border:0;outline:none;gap:.25rem;padding:0;transition:color .15s ease-out,background-color .15s ease-out}.action:hover{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.action:active{background:var(--_tint-strong)}.action:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.action .icon{width:.875rem;height:.875rem}.retry{padding-inline:.5rem}.retry .icon{width:.75rem;height:.75rem}.row:not([data-status=done]) .done,.row:not([data-status=error]) .retry{display:none}.track{background:var(--lw-color-muted);height:1px;position:absolute;inset:auto .25rem 0}.bar{background:var(--lw-color-foreground);transform-origin:0;height:100%;transition:transform .2s linear,opacity .2s linear,background-color .2s linear;display:block}.bar[data-instant]{transition:none}[data-status=done] .bar{background:var(--lw-color-accent);opacity:0;transition-duration:.3s;transition-delay:.3s;transition-timing-function:ease-out}:is([data-status=error],[data-status=rejected]) .bar{background:var(--lw-color-destructive)}.footer-body{justify-content:space-between;align-items:center;padding:.5rem .5rem .125rem;display:flex}.count{color:var(--lw-color-foreground)}.failed{color:var(--lw-color-destructive)}.clear{border-radius:var(--lw-radius-sm);background:0 0;border:0;outline:none;margin-right:-.25rem;padding:.25rem .375rem;transition:color .15s ease-out}.clear:hover{color:var(--lw-color-foreground)}.clear:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}", c = [
	"B",
	"KB",
	"MB",
	"GB",
	"TB"
], l = 80, u = (e) => {
	if (!e) return "0 B";
	let t = Math.min(Math.floor(Math.log(e) / Math.log(1024)), c.length - 1), n = e / 1024 ** t;
	return `${n >= 10 || t === 0 ? Math.round(n) : Number(n.toFixed(1))} ${c[t]}`;
}, d = (e, t) => {
	let n = t.toLowerCase();
	if (n.startsWith(".")) return e.name.toLowerCase().endsWith(n);
	let r = e.type.toLowerCase();
	return n.endsWith("/*") ? r.startsWith(n.slice(0, -1)) : r === n;
}, f = (e) => {
	if (e.startsWith(".")) return e.slice(1).toUpperCase();
	let [t = "", n = ""] = e.split("/");
	return n === "*" ? `${t.toLowerCase()}s` : n.split("+")[0].toUpperCase();
}, p = (e) => {
	let t = e.map(f).filter(Boolean);
	if (t.length === 0) return "Any file";
	let n = t.length > 1 ? `${t.slice(0, -1).join(", ")} or ${t.at(-1)}` : t[0];
	return n.charAt(0).toUpperCase() + n.slice(1);
}, m = (e) => {
	let t = e.lastIndexOf(".");
	return t <= 0 || t === e.length - 1 ? "FILE" : e.slice(t + 1, t + 5).toUpperCase();
}, h = (e) => !!e.dataTransfer?.types.includes("Files"), g = (e) => [...e.items].filter((e) => e.kind === "file").length, _ = ({ onProgress: e, signal: t }, n, r) => new Promise((i, a) => {
	if (n <= 0) {
		i();
		return;
	}
	let o = 0, s = setInterval(() => {
		o = Math.min(o + 8e3 * (.4 + Math.random() * 1.2) / n, 100), r && o >= 58 ? (clearInterval(s), a(/* @__PURE__ */ Error("Connection lost"))) : (e(o), !(o < 100) && (clearInterval(s), i()));
	}, l);
	t.addEventListener("abort", () => {
		clearInterval(s), a(t.reason);
	});
}), v = 3, y = "cubic-bezier(0.23, 1, 0.32, 1)", b = (e, t = "") => `<svg class="icon ${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, x = b("<path d=\"M12 3v12\"/><path d=\"m17 8-5-5-5 5\"/><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/>", "upload"), S = b("<path d=\"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8\"/><path d=\"M21 3v5h-5\"/>"), C = b("<path d=\"M18 6 6 18\"/><path d=\"m6 6 12 12\"/>"), w = document.createElement("template");
w.innerHTML = `<li class="row"><div class="row-body"><span class="thumb" aria-hidden="true"></span><span class="info"><span class="name"></span><span class="meta"><span class="size"></span><span class="dot" aria-hidden="true">·</span><span class="status"></span></span></span><span class="actions"><span class="done">${r}</span><button class="action retry" type="button">${S}Retry</button><button class="action remove" type="button">${C}</button></span><span class="track"><span class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"></span></span></div></li>`;
var T = {
	queued: () => "Waiting",
	uploading: (e) => `${Math.round(e.progress)}%`,
	done: () => "Uploaded"
}, E = (e) => {
	o.matches || (e.animate({ height: ["0px", `${e.scrollHeight}px`] }, {
		duration: 350,
		easing: y
	}), e.animate({ opacity: [0, 1] }, {
		duration: 200,
		delay: 50,
		easing: y,
		fill: "backwards"
	}));
}, D = (e, t) => {
	if (o.matches) {
		t();
		return;
	}
	e.animate({ opacity: [1, 0] }, {
		duration: 120,
		easing: y,
		fill: "forwards"
	});
	let n = e.animate({ height: [`${e.offsetHeight}px`, "0px"] }, {
		duration: 200,
		easing: y,
		fill: "forwards"
	});
	n.onfinish = t, n.oncancel = t;
}, O = class extends a(e) {
	static styles = [n, s];
	static props = {
		accept: {},
		multiple: { type: Boolean },
		maxFiles: {
			type: Number,
			default: 5
		},
		maxSize: {
			type: Number,
			default: 5242880
		},
		name: {},
		uploadDelay: {
			type: Number,
			default: 2e3
		},
		simulateFailure: { type: Boolean }
	};
	#e = [];
	#t = !1;
	#n = !1;
	#r = 0;
	#i = 0;
	render() {
		return `<div class="card" part="base"><button class="zone" part="zone" type="button" aria-describedby="hint"><span class="zone-icon">${x}</span><span class="copy"><span class="title"></span><span class="hint" id="hint"></span></span></button><input class="input" type="file" tabindex="-1" hidden><p class="notice" role="alert" hidden></p><ul class="list" part="list" aria-label="Files"></ul><div class="footer" hidden><div class="footer-body"><output class="summary" aria-live="polite"></output><button class="clear" type="button"></button></div></div></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".zone"), n = this.query(".input");
		t.addEventListener("click", () => !this.#c && n.click(), e), t.addEventListener("paste", (e) => this.#E(e), e), t.addEventListener("dragenter", (e) => this.#w(e), e), t.addEventListener("dragover", (e) => this.#w(e), e), t.addEventListener("dragleave", (e) => !t.contains(e.relatedTarget) && this.#S({ over: 0 }), e), t.addEventListener("drop", (e) => this.#T(e), e), n.addEventListener("change", () => {
			this.addFiles(n.files), n.value = "";
		}, e), this.query(".list").addEventListener("click", (e) => this.#x(e), e), this.query(".clear").addEventListener("click", () => this.clear(), e), this.#C(e), this.signal.addEventListener("abort", () => this.#p()), this.#u();
	}
	updated(e) {
		let t = this.query(".input");
		t.accept = this.#a.join(","), t.multiple = this.multiple, e.has("name") && this.#g(), this.#_();
	}
	get files() {
		return this.#e.filter((e) => e.status === "done").map((e) => e.file);
	}
	addFiles(e) {
		let t = [...e ?? []];
		if (t.length === 0) return;
		let n = Math.max(0, this.#o - this.#s), r = 0, i = this.query(".list");
		for (let e of t) {
			let t = this.#l(e);
			if (!t && n === 0) {
				r += 1;
				continue;
			}
			t || --n;
			let a = {
				index: this.#i++,
				file: e,
				status: t ? "rejected" : "queued",
				progress: 0,
				attempts: 0,
				error: t
			};
			!t && e.type.startsWith("image/") && (a.previewUrl = URL.createObjectURL(e)), a.row = this.#y(a), this.#e.push(a), i.append(a.row), E(a.row), t && this.emit("upload-error", {
				error: t,
				file: e
			});
		}
		this.#v(r ? `${r} ${r === 1 ? "file was" : "files were"} not added. The limit is ${this.#o}.` : ""), this.#u();
	}
	clear() {
		[...this.#e].forEach((e) => this.#f(e));
	}
	formResetCallback() {
		this.clear();
	}
	get #a() {
		return (this.accept ?? "").split(",").map((e) => e.trim()).filter(Boolean);
	}
	get #o() {
		return this.multiple ? Math.max(1, this.maxFiles) : 1;
	}
	get #s() {
		return this.#e.filter((e) => e.status !== "rejected").length;
	}
	get #c() {
		return this.#s >= this.#o;
	}
	#l(e) {
		let t = this.#a;
		return t.length && !t.some((t) => d(e, t)) ? {
			message: `Not ${p(t)}`,
			code: "INVALID_FILE_TYPE"
		} : e.size > this.maxSize ? {
			message: `Larger than ${u(this.maxSize)}`,
			code: "FILE_TOO_LARGE"
		} : this.validateFile?.(e) ?? null;
	}
	#u() {
		if (!this.isConnected) return;
		let e = this.#e.filter((e) => e.status === "uploading").length;
		this.#e.filter((e) => e.status === "queued").slice(0, Math.max(0, v - e)).forEach((e) => this.#d(e)), this.#m();
	}
	#d(e) {
		let t = new AbortController(), { signal: n } = t;
		Object.assign(e, {
			controller: t,
			status: "uploading",
			progress: 0,
			error: null,
			attempts: e.attempts + 1
		}), this.#b(e);
		let r = (t) => {
			n.aborted || (e.progress = Math.min(Math.max(t, 0), 100), this.#b(e));
		}, i = (t) => {
			n.aborted || (Object.assign(e, { controller: null }, t), this.#b(e), t.status === "done" ? this.emit("upload-success", { file: e.file }) : this.emit("upload-error", {
				error: e.error,
				file: e.file
			}), this.#u());
		};
		(this.upload ? Promise.resolve().then(() => this.upload(e.file, {
			onProgress: r,
			signal: n
		})) : _({
			onProgress: r,
			signal: n
		}, this.uploadDelay, this.simulateFailure && e.attempts === 1 && e.index % 3 == 1)).then(() => i({
			status: "done",
			progress: 100
		}), (e) => i({
			status: "error",
			error: {
				message: e instanceof Error && e.message || "Upload failed",
				code: "UPLOAD_FAILED"
			}
		}));
	}
	#f(e) {
		e.controller?.abort(), e.previewUrl && URL.revokeObjectURL(e.previewUrl), this.#e = this.#e.filter((t) => t !== e), e.row.inert = !0, D(e.row, () => e.row.remove()), this.#v(""), this.emit("remove", { file: e.file }), this.#u();
	}
	#p() {
		for (let e of this.#e) e.status === "uploading" && (e.controller.abort(), Object.assign(e, {
			controller: null,
			status: "queued",
			attempts: e.attempts - 1,
			progress: 0
		}), this.#b(e));
	}
	#m() {
		let e = 0, t = 0, n = !1;
		for (let { status: r } of this.#e) r === "done" ? e += 1 : r === "error" || r === "rejected" ? t += 1 : n = !0;
		this.#t && !n && this.emit("complete", { files: this.files }), this.#t = n;
		let r = [Object.assign(document.createElement("span"), {
			className: "count",
			textContent: e
		}), ` of ${this.#e.length} uploaded`];
		t && r.push(Object.assign(document.createElement("span"), {
			className: "failed",
			textContent: ` · ${t} failed`
		})), this.query(".summary").replaceChildren(...r), this.query(".clear").textContent = n ? "Cancel all" : "Clear", this.#h(this.#e.length > 0), this.#_(), this.#g();
	}
	#h(e) {
		let t = this.query(".footer");
		(e !== !t.hidden || t.dataset.leaving) && (t.getAnimations().forEach((e) => e.cancel()), e ? (delete t.dataset.leaving, t.hidden = !1, E(t)) : (t.dataset.leaving = "", D(t, () => {
			t.dataset.leaving !== void 0 && (delete t.dataset.leaving, t.hidden = !0);
		})));
	}
	#g() {
		if (!this.name) {
			this[i].setFormValue(null);
			return;
		}
		let e = new FormData();
		this.files.forEach((t) => e.append(this.name, t)), this[i].setFormValue(e);
	}
	#_() {
		let e = this.query(".zone"), t = this.#c, n = this.multiple ? "files" : "a file", r = this.maxSize > 0 && Number.isFinite(this.maxSize) ? ` up to ${u(this.maxSize)}` : "", i = `Drop ${n} here or `, a = `${p(this.#a)}${r}${this.multiple ? ` · ${this.#o} max` : ""}`;
		t ? (i = "File limit reached", a = "Remove a file to add another") : this.#r ? i = `Release to add ${this.#r} ${this.#r === 1 ? "file" : "files"}` : this.#n && (i = `Drop ${n} here`);
		let o = !t && !this.#r && !this.#n;
		this.query(".title").replaceChildren(i, ...o ? [Object.assign(document.createElement("span"), {
			className: "browse",
			textContent: "browse"
		})] : []), this.query(".hint").textContent = a, e.ariaDisabled = t ? "true" : null, e.toggleAttribute("data-armed", this.#n && !t), e.toggleAttribute("data-over", this.#r > 0 && !t);
	}
	#v(e) {
		let t = this.query(".notice");
		t.textContent = e, t.hidden = !e;
	}
	#y(e) {
		let t = w.content.firstElementChild.cloneNode(!0), { name: n, size: r } = e.file;
		t.querySelector(".name").textContent = n, t.querySelector(".size").textContent = u(r), t.querySelector(".retry").ariaLabel = `Retry ${n}`, t.querySelector(".bar").ariaLabel = `Uploading ${n}`;
		let i = t.querySelector(".thumb");
		return e.previewUrl ? i.style.backgroundImage = `url("${e.previewUrl}")` : i.textContent = m(n), i.toggleAttribute("data-image", !!e.previewUrl), this.#b(e, t), t;
	}
	#b(e, t = e.row) {
		let { status: n, progress: r } = e, i = n === "queued" || n === "uploading";
		t.dataset.status = n, t.querySelector(".status").textContent = T[n]?.(e) ?? e.error?.message ?? "Upload failed", t.querySelector(".remove").ariaLabel = `${i ? "Cancel" : "Remove"} ${e.file.name}`;
		let a = t.querySelector(".bar");
		a.toggleAttribute("data-instant", r === 0), a.style.transform = `scaleX(${r / 100})`, a.ariaValueNow = String(Math.round(r));
	}
	#x(e) {
		let t = e.target.closest(".action"), n = t && this.#e.find(({ row: e }) => e.contains(t));
		n && (t.classList.contains("remove") ? (this.#f(n), this.query(".zone").focus()) : (n.status = "queued", n.progress = 0, this.#b(n), this.#u()));
	}
	#S({ windowDrag: e = this.#n, over: t = this.#r }) {
		(e !== this.#n || t !== this.#r) && (this.#n = e, this.#r = t, this.#_());
	}
	#C(e) {
		let t = 0, n = (e) => {
			h(e) && e.preventDefault(), t = 0, this.#S({
				windowDrag: !1,
				over: 0
			});
		};
		window.addEventListener("dragenter", (e) => {
			h(e) && (t += 1, this.#S({ windowDrag: !0 }));
		}, e), window.addEventListener("dragleave", (e) => {
			h(e) && (t = Math.max(0, t - 1), t === 0 && this.#S({ windowDrag: !1 }));
		}, e), window.addEventListener("dragover", (e) => h(e) && e.preventDefault(), e), window.addEventListener("drop", n, e), window.addEventListener("dragend", n, e);
	}
	#w(e) {
		h(e) && (e.preventDefault(), e.dataTransfer.dropEffect = this.#c ? "none" : "copy", this.#S({ over: Math.max(1, g(e.dataTransfer)) }));
	}
	#T(e) {
		e.preventDefault(), this.#S({
			windowDrag: !1,
			over: 0
		}), this.#c || this.addFiles(e.dataTransfer.files);
	}
	#E(e) {
		e.clipboardData.files.length !== 0 && (e.preventDefault(), this.addFiles(e.clipboardData.files));
	}
};
//#endregion
//#region src/components/file-upload/index.js
t("file-upload", O);
//#endregion
export { O as t };
