// An orthographic globe drawn in one ink: land dots, a hairline rim and an
// orbit ring, routes hugging the surface with a bright pulse along each,
// and ringed region markers. Angles are in radians.

const ARC_SAMPLES = 64;
// Routes ride just above the surface, a touch higher the longer they are.
const MAX_LIFT = 0.06;
// The pulse's length, as a share of the route.
const TRAIL = 0.16;
const DOT_LEVELS = 4;

export const toRadians = (degrees) => (degrees * Math.PI) / 180;

const unit = (lat, lon) => [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)];

/** Great-circle distance between two points, in radians of arc. */
export const arcAngle = (a, b) => {
  const [ax, ay, az] = unit(a.lat, a.lon);
  const [bx, by, bz] = unit(b.lat, b.lon);
  return Math.acos(Math.min(1, Math.max(-1, ax * bx + ay * by + az * bz)));
};

/** Samples a route along its great circle: flat [latitude, longitude, lift] triples. */
export const routeArc = (a, b) => {
  const angle = arcAngle(a, b);
  const [ax, ay, az] = unit(a.lat, a.lon);
  const [bx, by, bz] = unit(b.lat, b.lon);
  const sin = Math.sin(angle) || 1;
  const peak = Math.min(MAX_LIFT, angle * 0.05);
  const points = new Float32Array((ARC_SAMPLES + 1) * 3);
  for (let i = 0; i <= ARC_SAMPLES; i++) {
    const t = i / ARC_SAMPLES;
    // Spherical interpolation between the two ends.
    const wa = Math.sin((1 - t) * angle) / sin;
    const wb = Math.sin(t * angle) / sin;
    const x = wa * ax + wb * bx;
    const y = wa * ay + wb * by;
    const z = wa * az + wb * bz;
    points[i * 3] = Math.atan2(z, Math.hypot(x, y));
    points[i * 3 + 1] = Math.atan2(y, x);
    points[i * 3 + 2] = Math.sin(Math.PI * t) * peak;
  }
  return points;
};

/**
 * Projects a point at `lift` above the surface into `out`: screen `x`, `y`,
 * its depth `z` (1 facing the viewer, -1 behind) and whether it shows.
 */
export const project = (view, lat, lon, lift, out) => {
  const dl = lon - view.lon;
  const cosLat = Math.cos(lat);
  const x = cosLat * Math.sin(dl);
  const y = Math.cos(view.lat) * Math.sin(lat) - Math.sin(view.lat) * cosLat * Math.cos(dl);
  const z = Math.sin(view.lat) * Math.sin(lat) + Math.cos(view.lat) * cosLat * Math.cos(dl);
  const scale = view.r * (1 + lift);
  out.x = view.cx + x * scale;
  out.y = view.cy - y * scale;
  out.z = z;
  // A lifted point behind the globe still shows once it clears the limb.
  out.visible = z > 0 || Math.hypot(x, y) * (1 + lift) > 1;
  return out;
};

const at = { x: 0, y: 0, z: 0, visible: false };

/** The rim, a tilted orbit ring and the land dots, nearer dots brighter. */
export const drawEarth = (context, view, dots, ink) => {
  context.strokeStyle = ink;
  context.fillStyle = ink;
  context.lineWidth = 1;
  context.globalAlpha = 0.16;
  context.beginPath();
  context.arc(view.cx, view.cy, view.r, 0, Math.PI * 2);
  context.stroke();
  context.globalAlpha = 0.12;
  context.beginPath();
  context.ellipse(view.cx + view.r * 0.06, view.cy - view.r * 0.04, view.r * 1.08, view.r * 0.98, -0.25, Math.PI * 1.05, Math.PI * 1.95);
  context.stroke();
  const paths = Array.from({ length: DOT_LEVELS }, () => new Path2D());
  const radius = Math.max(0.9, view.r / 300);
  for (let i = 0; i < dots.length; i += 2) {
    project(view, dots[i], dots[i + 1], 0, at);
    if (at.z <= 0) continue;
    const path = paths[Math.min(DOT_LEVELS - 1, Math.floor(at.z * DOT_LEVELS))];
    path.moveTo(at.x + radius, at.y);
    path.arc(at.x, at.y, radius, 0, Math.PI * 2);
  }
  paths.forEach((path, level) => {
    context.globalAlpha = 0.25 + (0.6 * (level + 1)) / DOT_LEVELS;
    context.fill(path);
  });
  context.globalAlpha = 1;
};

/** Strokes the visible stretches of a route from `from` to `to` (0 to 1). */
const strokeArc = (context, view, points, from, to) => {
  const last = points.length / 3 - 1;
  const start = Math.max(0, Math.floor(from * last));
  const end = Math.min(last, Math.ceil(to * last));
  let drawing = false;
  context.beginPath();
  for (let i = start; i <= end; i++) {
    project(view, points[i * 3], points[i * 3 + 1], points[i * 3 + 2], at);
    if (!at.visible) {
      drawing = false;
      continue;
    }
    if (drawing) context.lineTo(at.x, at.y);
    else context.moveTo(at.x, at.y);
    drawing = true;
  }
  context.stroke();
};

/**
 * The routes, each with a bright pulse travelling from its source; `routes`
 * are `{ points, phase, dim }`, `time` in seconds and `pace` in routes per second.
 */
export const drawRoutes = (context, view, routes, ink, time, pace) => {
  context.strokeStyle = ink;
  context.lineCap = 'round';
  for (const route of routes) {
    context.globalAlpha = route.dim ? 0.1 : 0.32;
    context.lineWidth = 1;
    strokeArc(context, view, route.points, 0, 1);
    if (pace <= 0 || route.dim) continue;
    const head = (time * pace + route.phase) % 1;
    context.globalAlpha = 0.95;
    context.lineWidth = 2;
    strokeArc(context, view, route.points, Math.max(0, head - TRAIL), head);
  }
  context.globalAlpha = 1;
};

/** Region markers: a dot in a ring, fading towards the limb. */
export const drawRegions = (context, view, regions, ink) => {
  context.strokeStyle = ink;
  context.fillStyle = ink;
  for (const region of regions) {
    project(view, region.lat, region.lon, 0, at);
    if (at.z <= 0.02) continue;
    const fade = Math.min(1, at.z * 5);
    context.globalAlpha = fade;
    context.beginPath();
    context.arc(at.x, at.y, 2.5, 0, Math.PI * 2);
    context.fill();
    context.lineWidth = region.selected ? 2 : 1.25;
    context.globalAlpha = fade * (region.selected ? 1 : 0.8);
    context.beginPath();
    context.arc(at.x, at.y, 7, 0, Math.PI * 2);
    context.stroke();
  }
  context.globalAlpha = 1;
};

/** The region drawn nearest a point, within `reach` px, or null. */
export const regionAt = (view, regions, x, y, reach) => {
  let best = null;
  let bestDistance = reach;
  for (const region of regions) {
    project(view, region.lat, region.lon, 0, at);
    const distance = Math.hypot(at.x - x, at.y - y);
    if (at.z > 0.02 && distance < bestDistance) {
      best = region;
      bestDistance = distance;
    }
  }
  return best;
};
