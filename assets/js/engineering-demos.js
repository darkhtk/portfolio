// === Engineering 페이지 — 라이브 알고리즘 데모 ===
// 페이지에 적힌 수식을 브라우저에서 실제로 구동한다. 데모가 없으면 조용히 종료.
// 1) IK : 평면 3링크 팔 + 감쇠 최소자승(Damped Least Squares) 역기구학
// 2) BIM: 임의 직선(2D 평면)으로 폴리곤 단면 = 부호 기반 평면-메시 교차
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // canvas 를 컨테이너 크기 + DPR 에 맞춰 세팅. (display:none → 폭 0 이면 false 반환)
  function fit(canvas, ctx) {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.round(rect.width), h = Math.round(rect.height);
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr; canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvas._w = w; canvas._h = h;
    return true;
  }

  // 포인터(마우스/터치) 좌표 → 캔버스 로컬 좌표
  function pointer(canvas, ev) {
    var r = canvas.getBoundingClientRect();
    var p = ev.touches ? ev.touches[0] : ev;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  }

  var COL = { bg: "#0B0F14", line: "rgba(230,237,243,0.08)", cyan: "#6FE3FF",
              amber: "#F5C26B", dim: "#5B6573", text: "#8A94A6" };

  // ----------------------------------------------------------------
  // 1) 자코비안 DLS IK 데모
  // ----------------------------------------------------------------
  function initIK(root) {
    var canvas = root.querySelector("[data-ik-canvas]");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var readout = root.querySelector("[data-ik-readout]");
    var dampBtn = root.querySelector("[data-ik-damping]");

    var N = 3;
    var theta = [-0.5, 0.7, 0.6];
    var base = { x: 0, y: 0 }, L = 60, R = 180;
    var target = { x: 0, y: 0 };
    var dragging = false, hovered = false, damping = true, t = 0;

    function layout() {
      var w = canvas._w, h = canvas._h;
      R = Math.min(w * 0.6, h * 0.8);
      L = R / N;
      base.x = w * 0.17; base.y = h * 0.55;
      if (!target._init) { target.x = base.x + R * 0.6; target.y = base.y - R * 0.3; target._init = true; }
    }

    // 순기구학: 각 관절 위치 + 엔드이펙터
    function fk() {
      var pts = [{ x: base.x, y: base.y }], a = 0;
      for (var i = 0; i < N; i++) {
        a += theta[i];
        pts.push({ x: pts[i].x + L * Math.cos(a), y: pts[i].y + L * Math.sin(a) });
      }
      return pts;
    }

    // 한 스텝의 damped least squares 업데이트
    function solveStep() {
      var pts = fk(), end = pts[N];
      var ex = target.x - end.x, ey = target.y - end.y;
      // 자코비안 J (2 x N): 열 i = (end - joint_i) 를 +90° 회전
      var j0 = [], j1 = [];
      for (var i = 0; i < N; i++) {
        j0[i] = -(end.y - pts[i].y);
        j1[i] = (end.x - pts[i].x);
      }
      // JJᵀ (2x2, 대칭)
      var a00 = 0, a01 = 0, a11 = 0;
      for (i = 0; i < N; i++) { a00 += j0[i] * j0[i]; a01 += j0[i] * j1[i]; a11 += j1[i] * j1[i]; }
      var lam2 = damping ? Math.pow(0.16 * R, 2) : 0; // 감쇠항 λ²
      var A00 = a00 + lam2, A11 = a11 + lam2, A01 = a01;
      var det = A00 * A11 - A01 * A01;
      if (Math.abs(det) < 1e-6) det = det < 0 ? -1e-6 : 1e-6; // NaN 방지 (off+특이점 시 거대값 유지)
      // y = (JJᵀ+λ²I)⁻¹ e
      var y0 = (A11 * ex - A01 * ey) / det;
      var y1 = (-A01 * ex + A00 * ey) / det;
      // Δθ = Jᵀ y, 관절별 클램프
      var clamp = damping ? 0.25 : 0.55;
      for (i = 0; i < N; i++) {
        var d = j0[i] * y0 + j1[i] * y1;
        if (d > clamp) d = clamp; else if (d < -clamp) d = -clamp;
        theta[i] += d;
      }
      return Math.hypot(ex, ey);
    }

    function draw() {
      ctx.clearRect(0, 0, canvas._w, canvas._h);
      // 도달 반경
      ctx.strokeStyle = COL.line; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(base.x, base.y, R, 0, Math.PI * 2); ctx.stroke();

      var err = 0;
      for (var s = 0; s < 12; s++) err = solveStep();
      var pts = fk();

      // 링크
      ctx.strokeStyle = COL.cyan; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (var i = 1; i <= N; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
      // 관절
      for (i = 1; i < N; i++) {
        ctx.fillStyle = COL.bg; ctx.strokeStyle = COL.cyan; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      // 베이스
      ctx.fillStyle = COL.amber;
      ctx.fillRect(base.x - 6, base.y - 6, 12, 12);
      // 엔드이펙터
      ctx.strokeStyle = COL.amber; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(pts[N].x, pts[N].y, 6, 0, Math.PI * 2); ctx.stroke();
      // 타깃 크로스헤어
      var tc = (dragging || hovered) ? COL.amber : COL.cyan;
      ctx.strokeStyle = tc; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(target.x - 9, target.y); ctx.lineTo(target.x + 9, target.y);
      ctx.moveTo(target.x, target.y - 9); ctx.lineTo(target.x, target.y + 9);
      ctx.stroke();
      ctx.globalAlpha = 0.35;
      ctx.beginPath(); ctx.arc(target.x, target.y, 12, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;

      if (readout) readout.textContent =
        "damping " + (damping ? "on" : "off") + "   err " + err.toFixed(0) + "px";
    }

    function frame() {
      if (fit(canvas, ctx)) {
        layout();
        if (!dragging && !reduceMotion) {
          t += 0.012;
          target.x = base.x + Math.cos(t * 1.3) * R * 0.78;
          target.y = base.y + Math.sin(t * 2.1) * R * 0.6 - R * 0.1;
        }
        draw();
      }
      requestAnimationFrame(frame);
    }

    function setTarget(ev) { var p = pointer(canvas, ev); target.x = p.x; target.y = p.y; }
    canvas.addEventListener("pointerdown", function (e) { dragging = true; setTarget(e); canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); e.preventDefault(); });
    canvas.addEventListener("pointermove", function (e) { hovered = true; if (dragging) setTarget(e); });
    canvas.addEventListener("pointerup", function () { dragging = false; });
    canvas.addEventListener("pointerleave", function () { hovered = false; dragging = false; });
    if (dampBtn) dampBtn.addEventListener("click", function () {
      damping = !damping;
      dampBtn.setAttribute("aria-pressed", String(damping));
      dampBtn.textContent = "damping: " + (damping ? "on" : "off");
    });

    requestAnimationFrame(frame);
  }

  // ----------------------------------------------------------------
  // 2) BIM 단면 = 평면-메시 교차 데모
  // ----------------------------------------------------------------
  function initSection(root) {
    var canvas = root.querySelector("[data-sec-canvas]");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var readout = root.querySelector("[data-sec-readout]");

    // 정규화 좌표(0..1)의 건물 단면 폴리곤 (비볼록 → 교점 2~4개)
    var NORM = [
      [0.14, 0.86], [0.14, 0.46], [0.30, 0.46], [0.30, 0.22],
      [0.50, 0.10], [0.70, 0.22], [0.70, 0.46], [0.86, 0.46], [0.86, 0.86]
    ];
    var poly = [], through = { x: 0, y: 0 }, phi = 0;
    var dragging = false, t = 0;

    function layout() {
      var w = canvas._w, h = canvas._h, pad = 0.14;
      var sx = w * (1 - pad * 2), sy = h * (1 - pad * 2);
      var sc = Math.min(sx, sy), ox = (w - sc) / 2, oy = (h - sc) / 2;
      poly = NORM.map(function (p) { return { x: ox + p[0] * sc, y: oy + p[1] * sc }; });
      if (!through._init) { through.x = w / 2; through.y = h * 0.52; through._init = true; }
    }

    function intersections() {
      var dir = { x: Math.cos(phi), y: Math.sin(phi) };
      var nn = { x: -dir.y, y: dir.x };           // 평면 법선
      var d = nn.x * through.x + nn.y * through.y; // 평면: nn·p = d
      var hits = [];
      for (var i = 0; i < poly.length; i++) {
        var a = poly[i], b = poly[(i + 1) % poly.length];
        var sa = nn.x * a.x + nn.y * a.y - d;       // 부호화 거리
        var sb = nn.x * b.x + nn.y * b.y - d;
        if (sa === 0) sa = 1e-9;
        if (sa * sb < 0) {                          // 부호가 갈리는 엣지
          var tt = sa / (sa - sb);
          hits.push({ x: a.x + (b.x - a.x) * tt, y: a.y + (b.y - a.y) * tt });
        }
      }
      hits.forEach(function (p) { p.proj = dir.x * p.x + dir.y * p.y; }); // 직선 따라 정렬
      hits.sort(function (m, n) { return m.proj - n.proj; });
      return { hits: hits, dir: dir };
    }

    function draw() {
      var w = canvas._w, h = canvas._h;
      ctx.clearRect(0, 0, w, h);

      // 폴리곤 (메시)
      ctx.strokeStyle = "rgba(111,227,255,0.35)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(poly[0].x, poly[0].y);
      for (var i = 1; i < poly.length; i++) ctx.lineTo(poly[i].x, poly[i].y);
      ctx.closePath(); ctx.stroke();
      ctx.fillStyle = "rgba(111,227,255,0.05)"; ctx.fill();

      var r = intersections(), hits = r.hits, dir = r.dir;
      // 절단 직선
      ctx.strokeStyle = COL.line; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(through.x - dir.x * 2000, through.y - dir.y * 2000);
      ctx.lineTo(through.x + dir.x * 2000, through.y + dir.y * 2000);
      ctx.stroke(); ctx.setLineDash([]);
      // 단면 현(chord) = 교점 쌍 잇기
      ctx.strokeStyle = COL.amber; ctx.lineWidth = 3; ctx.lineCap = "round";
      for (i = 0; i + 1 < hits.length; i += 2) {
        ctx.beginPath(); ctx.moveTo(hits[i].x, hits[i].y); ctx.lineTo(hits[i + 1].x, hits[i + 1].y); ctx.stroke();
      }
      // 교점
      for (i = 0; i < hits.length; i++) {
        ctx.fillStyle = COL.bg; ctx.strokeStyle = COL.cyan; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(hits[i].x, hits[i].y, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      if (readout) readout.textContent = "교점 " + hits.length + "개 · 단면 " + Math.floor(hits.length / 2) + "선";
    }

    function frame() {
      if (fit(canvas, ctx)) {
        layout();
        if (!reduceMotion) phi += 0.006;            // 천천히 회전하며 모든 각도 단면을 보여줌
        if (!dragging && !reduceMotion) {
          t += 0.01;
          through.y = canvas._h * (0.5 + Math.sin(t) * 0.18);
          through.x = canvas._w / 2;
        }
        draw();
      }
      requestAnimationFrame(frame);
    }

    function setThrough(ev) { var p = pointer(canvas, ev); through.x = p.x; through.y = p.y; }
    canvas.addEventListener("pointerdown", function (e) { dragging = true; setThrough(e); canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); e.preventDefault(); });
    canvas.addEventListener("pointermove", function (e) { if (dragging) setThrough(e); });
    canvas.addEventListener("pointerup", function () { dragging = false; });
    canvas.addEventListener("pointerleave", function () { dragging = false; });

    requestAnimationFrame(frame);
  }

  // ----------------------------------------------------------------
  // 3) DXCenter — 데이터 → 씬 오브젝트 매핑 애니메이션 (스키매틱)
  // ----------------------------------------------------------------
  function initEditor(root) {
    var canvas = root.querySelector("[data-editor-canvas]");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var rows = ["unit.A12", "sensor.03", "zone.2F", "valve.07", "alarm.E1"];
    var active = 0, prog = 0;

    function draw() {
      var w = canvas._w, h = canvas._h; ctx.clearRect(0, 0, w, h);
      var n = rows.length, padY = h * 0.13, gap = (h - padY * 2) / (n - 1);
      var lx = w * 0.08, boxW = Math.min(w * 0.30, 168), rh = Math.min(gap * 0.62, 26);
      var rx = w - lx - boxW;
      ctx.font = '12px "JetBrains Mono", monospace'; ctx.textBaseline = "middle";
      for (var i = 0; i < n; i++) {
        var y = padY + gap * i;
        var done = i < active, live = i === active;
        ctx.strokeStyle = live ? COL.amber : (done ? COL.cyan : COL.line); ctx.lineWidth = 1.5;
        ctx.strokeRect(lx, y - rh / 2, boxW, rh);
        ctx.fillStyle = (done || live) ? COL.text : COL.dim; ctx.textAlign = "left";
        ctx.fillText(rows[i], lx + 9, y);
        ctx.strokeStyle = done ? COL.cyan : COL.line; ctx.strokeRect(rx, y - rh / 2, boxW, rh);
        ctx.fillStyle = done ? COL.cyan : COL.dim;
        ctx.fillText(done ? "● mapped" : "○ empty", rx + 9, y);
        if (done || live) {
          var p = live ? Math.min(prog, 1) : 1;
          ctx.strokeStyle = live ? COL.amber : "rgba(111,227,255,0.5)"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(lx + boxW, y); ctx.lineTo(lx + boxW + (rx - lx - boxW) * p, y); ctx.stroke();
        }
      }
      ctx.textAlign = "center"; ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = COL.dim; ctx.fillText("external data", lx + boxW / 2, padY * 0.5);
      ctx.fillText("scene objects", rx + boxW / 2, padY * 0.5);
      ctx.fillStyle = (active >= n) ? COL.cyan : COL.dim;
      ctx.fillText(active >= n ? "✓ 검증 후 적용" : "validating…", w / 2, h - padY * 0.45);
      ctx.textAlign = "left";
    }
    function frame() {
      if (fit(canvas, ctx)) {
        if (!reduceMotion) { prog += 0.04; if (prog >= 1.5) { prog = 0; active = (active + 1) % (rows.length + 1); } }
        else { active = rows.length; }
        draw();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ----------------------------------------------------------------
  // 4) 하드웨어 ↔ Unity 동기 + 안전 인터록 애니메이션
  // ----------------------------------------------------------------
  function initHW(root) {
    var canvas = root.querySelector("[data-hw-canvas]");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var t = 0, LIMIT = 0.40;

    function draw() {
      var w = canvas._w, h = canvas._h; ctx.clearRect(0, 0, w, h);
      var ang = Math.sin(t * 1.05) * 0.52;
      var tripped = Math.abs(ang) > LIMIT;
      var shown = tripped ? (ang > 0 ? LIMIT : -LIMIT) : ang;
      var col = tripped ? COL.amber : COL.cyan;
      var cy = h * 0.52;
      ctx.font = '10px "JetBrains Mono", monospace'; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      // 좌: 모션 발판
      var cxL = w * 0.27, plat = Math.min(w * 0.17, 110);
      ctx.save(); ctx.translate(cxL, cy); ctx.rotate(shown);
      ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(-plat, 0); ctx.lineTo(plat, 0); ctx.stroke(); ctx.restore();
      ctx.fillStyle = COL.amber; ctx.beginPath();
      ctx.moveTo(cxL, cy); ctx.lineTo(cxL - 9, cy + 16); ctx.lineTo(cxL + 9, cy + 16); ctx.closePath(); ctx.fill();
      ctx.fillStyle = COL.dim; ctx.fillText("PLATFORM", cxL, cy + 36);
      // 우: VR 수평선
      var cxR = w * 0.73, hw = Math.min(w * 0.17, 110);
      ctx.strokeStyle = COL.line; ctx.lineWidth = 1; ctx.strokeRect(cxR - hw, cy - hw * 0.62, hw * 2, hw * 1.24);
      ctx.save(); ctx.translate(cxR, cy); ctx.rotate(shown);
      ctx.strokeStyle = col; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-hw * 0.82, 0); ctx.lineTo(hw * 0.82, 0); ctx.stroke(); ctx.restore();
      ctx.fillStyle = COL.dim; ctx.fillText("VR HORIZON", cxR, cy + 36);
      // 동기 표시
      ctx.fillStyle = col; ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText("⇄", w * 0.5, cy);
      ctx.fillStyle = COL.dim; ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText("sync", w * 0.5, cy + 14);
      if (tripped) {
        ctx.fillStyle = COL.amber; ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.fillText("⚠ INTERLOCK · STOP", w * 0.5, h * 0.15);
      }
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    }
    function frame() { if (fit(canvas, ctx)) { if (!reduceMotion) t += 0.018; draw(); } requestAnimationFrame(frame); }
    requestAnimationFrame(frame);
  }

  // ----------------------------------------------------------------
  // 5) Neostalgia — 생성 파이프라인 + time-budget fallback 애니메이션
  // ----------------------------------------------------------------
  function initPipe(root) {
    var canvas = root.querySelector("[data-pipe-canvas]");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var stages = ["interview", "whisper", "gpt", "skybox/meshy", "xr"];
    var t = 0, cycle = 0;

    function draw() {
      var w = canvas._w, h = canvas._h; ctx.clearRect(0, 0, w, h);
      var n = stages.length, m = w * 0.10, y = h * 0.40, gap = (w - m * 2) / (n - 1);
      var fb = (cycle % 3 === 2) ? 2 : -1; // 3주기마다 gpt 단계 타임아웃 → fallback
      var pos = t * (n - 1), idx = Math.floor(pos), frac = pos - idx;
      ctx.lineWidth = 1.5;
      for (var i = 0; i < n - 1; i++) {
        ctx.strokeStyle = (i < idx) ? "rgba(111,227,255,0.5)" : COL.line;
        ctx.beginPath(); ctx.moveTo(m + gap * i, y); ctx.lineTo(m + gap * (i + 1), y); ctx.stroke();
      }
      if (fb >= 0) {
        var fx = m + gap * fb, gx = m + gap * (fb + 1), fy = h * 0.74;
        ctx.strokeStyle = (idx >= fb) ? COL.amber : COL.line; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(fx, y); ctx.lineTo(fx, fy); ctx.lineTo(gx, fy); ctx.lineTo(gx, y); ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = '9px "JetBrains Mono", monospace'; ctx.fillStyle = COL.amber; ctx.textAlign = "center";
        ctx.fillText("fallback · pre-gen", (fx + gx) / 2, fy + 13);
      }
      ctx.font = '10px "JetBrains Mono", monospace'; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (i = 0; i < n; i++) {
        var x = m + gap * i, passed = i <= idx, to = (i === fb && i === idx);
        var c = to ? COL.amber : (passed ? COL.cyan : COL.dim);
        ctx.fillStyle = COL.bg; ctx.strokeStyle = c; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = c; ctx.fillText(stages[i], x, y - 23);
      }
      var tx = m + gap * idx + gap * frac;
      ctx.fillStyle = COL.amber; ctx.beginPath(); ctx.arc(tx, y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    }
    function frame() {
      if (fit(canvas, ctx)) {
        if (!reduceMotion) { t += 0.006; if (t >= 1) { t = 0; cycle++; } } else { t = 0.999; }
        draw();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function boot() {
    document.querySelectorAll("[data-ik-demo]").forEach(initIK);
    document.querySelectorAll("[data-sec-demo]").forEach(initSection);
    document.querySelectorAll("[data-editor-demo]").forEach(initEditor);
    document.querySelectorAll("[data-hw-demo]").forEach(initHW);
    document.querySelectorAll("[data-pipe-demo]").forEach(initPipe);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else { boot(); }
})();
