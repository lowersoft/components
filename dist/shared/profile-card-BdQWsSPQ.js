import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { n as r, t as i } from "./rolling-VjfpUD4B.js";
import { n as a, t as o } from "./people-C_zYMoEl.js";
//#region src/components/profile-card/profile-card.scss?inline
var s = ":host{box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:20rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);border-radius:1.5rem;padding:.5rem;display:block}p{margin:0}.portrait{aspect-ratio:4/4.2;background:radial-gradient(circle at 30% 25%, oklch(.85 .08 var(--_hue)), transparent 60%), linear-gradient(160deg, oklch(.7 .12 var(--_hue)), oklch(.42 .1 calc(var(--_hue) + 40)));border-radius:1.125rem;place-items:center;display:grid;position:relative;overflow:hidden}.portrait img{object-fit:cover;width:100%;height:100%;position:absolute;inset:0}.portrait img[hidden]{display:none}.initials{letter-spacing:-.02em;color:#ffffffe6;font-size:3rem;font-weight:600}.body{padding:1rem .75rem .75rem}.name{font-size:var(--lw-text-lg);font-weight:600}.handle,.role{font-size:var(--lw-text-sm);color:var(--lw-color-muted-foreground)}.bio{font-size:var(--lw-text-sm);margin-top:.75rem;line-height:1.5}.stats{border-block:1px solid var(--lw-color-muted);grid-template-columns:repeat(3,1fr);margin:1rem 0 0;padding-block:.75rem;display:grid}.stats div+div{border-left:1px solid var(--lw-color-muted);padding-left:.75rem}.stats dt{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}.stats dd{font-size:var(--lw-text-md);font-variant-numeric:tabular-nums;margin:.125rem 0 0;font-weight:600}.mutuals{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);align-items:center;gap:.5rem;margin-top:.75rem;display:flex}.mutuals[hidden]{display:none}.faces{display:flex}.faces span{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));width:1.375rem;height:1.375rem;box-shadow:0 0 0 2px var(--lw-color-background);border-radius:50%;place-items:center;font-size:8px;font-weight:600;display:grid}.faces span+span{margin-left:-.375rem}.actions{gap:.5rem;margin-top:1rem;display:flex}.actions>*{flex:1}", c = [
	"Ana Ruiz",
	"Leo Park",
	"Sam Kato",
	"Riley Moss"
], l = new Intl.NumberFormat("en-US", {
	notation: "compact",
	maximumFractionDigits: 1
}), u = new Intl.NumberFormat("en-US"), d = class extends e {
	static styles = [r, s];
	static props = {
		name: { default: "Maya Chen" },
		handle: { default: "@mayachen" },
		role: { default: "Systems engineer · Lisbon" },
		bio: { default: "Writing small, fast C at LowerSoft. Previously on compilers and kernel drivers. Slow coffee, fast binaries." },
		image: { default: "" },
		followers: {
			type: Number,
			default: 12480
		},
		following: {
			type: Number,
			default: 342
		},
		posts: {
			type: Number,
			default: 1208
		},
		mutuals: {
			type: Object,
			default: c
		},
		mutualCount: {
			type: Number,
			default: 14
		},
		followed: {
			type: Boolean,
			reflect: !0
		}
	};
	render() {
		return "<div class=\"portrait\" aria-hidden=\"true\"><img alt=\"\" hidden><span class=\"initials\"></span></div>\n<div class=\"body\"><p class=\"name\"></p><p class=\"handle\"></p><p class=\"role\"></p><p class=\"bio\"></p>\n<dl class=\"stats\"><div><dt>Followers</dt><dd class=\"followers rolling\"></dd></div><div><dt>Following</dt><dd class=\"following-count\"></dd></div><div><dt>Posts</dt><dd class=\"posts\"></dd></div></dl>\n<div class=\"mutuals\"><span class=\"faces\" aria-hidden=\"true\"></span><span class=\"mutual-text\"></span></div>\n<div class=\"actions\"><lw-follow-button class=\"follow\"></lw-follow-button><lw-button class=\"message\" variant=\"secondary\">Message</lw-button></div></div>";
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".follow").addEventListener("lw-change", (e) => {
			this.followed = e.detail.following, this.emit("change", { followed: this.followed });
		}, e), this.query(".message").addEventListener("click", () => this.emit("message"), e);
	}
	updated() {
		let e = this.query("img");
		e.hidden = !this.image, this.image && (e.src = this.image), this.query(".portrait").style.setProperty("--_hue", o(this.name ?? "")), this.query(".initials").textContent = a(this.name ?? ""), this.query(".name").textContent = this.name ?? "", this.query(".handle").textContent = this.handle ?? "", this.query(".role").textContent = this.role ?? "", this.query(".bio").textContent = this.bio ?? "", i(this.query(".followers"), u.format(this.followers + +!!this.followed)), this.query(".following-count").textContent = l.format(this.following), this.query(".posts").textContent = l.format(this.posts), this.query(".follow").following = !!this.followed;
		let t = this.mutuals ?? [];
		this.query(".faces").innerHTML = t.slice(0, 3).map((e) => `<span style="--_hue: ${o(e)}">${n(a(e))}</span>`).join("");
		let r = Math.max(0, this.mutualCount - Math.min(2, t.length)), s = t.slice(0, 2).map((e) => e.split(" ")[0]);
		this.query(".mutuals").hidden = !t.length, this.query(".mutual-text").textContent = `Followed by ${s.join(", ")}${r ? ` and ${r} other${r === 1 ? "" : "s"}` : ""}`;
	}
};
//#endregion
//#region src/components/profile-card/index.js
t("profile-card", d);
//#endregion
export { d as t };
