/* 사이트 전체 내비게이션. 이 파일 하나만 고치면 목차가 모든 페이지에 반영된다. */
(function(){
  "use strict";

  var TOC = [
    { id:"preface",    kind:"서문", name:"왜 순서가 먼저인가",          href:"./index.html#preface", page:"007" },
    { id:"why",        kind:"1장",  name:"왜 이 순서인가",              href:"./index.html#why",     page:"021" },
    { id:"roles",      kind:"2장",  name:"교재와 아이와 AI가 맡는 자리", href:"./index.html#roles",   page:"043" },
    { id:"appendix-a", kind:"부록", name:"답을 알려주지 않는 AI 지시문", href:"./tutor-prompt-v2.html", page:"A" },
    { id:"appendix-b", kind:"부록", name:"중1 부호 오류 여덟 문항",     href:"./sign-errors.html",     page:"B" },
    { id:"appendix-c", kind:"부록", name:"같은 20분, 두 갈래",         href:"./two-paths.html",       page:"C" },
    { id:"appendix-d", kind:"부록", name:"저녁 20분 진행 카드",        href:"./session-card.html",    page:"D" },
    { id:"records",    kind:"기록", name:"실패한 날들",                href:"./index.html#records",   page:"—" }
  ];

  /* 작업층 페이지는 목차에 없지만, 판면주에서 자기 이름을 표시하고 메인으로 가는 링크는 가진다. */
  var WORK_LABELS = {
    "study-log":         "기록 도구",
    "tools":              "공부방 입구",
    "four-parts":         "1장 초안",
    "unity-first-door":   "유니티 · 첫 세션"
  };

  var SIDEBAR_WIDTH = 240;
  var WIDE_MIN = 1080;

  var page = document.body.getAttribute("data-page") || "";
  var isHome = page === "home";
  var current = null;
  for (var i = 0; i < TOC.length; i++){
    if (TOC[i].id === page){ current = TOC[i]; break; }
  }
  var workLabel = WORK_LABELS[page] || null;
  var hasSidebar = isHome || !!current;

  injectStyles();
  var refs = buildTopBar();
  document.documentElement.style.setProperty("--dn-rh-h", refs.bar.offsetHeight + "px");
  if (hasSidebar){
    buildSidebar(refs.toggle);
  }
  if (isHome){
    setupScrollSpy();
  } else if (current){
    markCurrent(current.id);
  }

  /* ---------- 스타일 ---------- */

  function injectStyles(){
    var css =
      ":root{--dn-paper:#F3F1EA;--dn-paper-edge:#E7E3D8;--dn-ink:#15140F;--dn-ink-soft:#4A4740;--dn-gray:#8A8578;--dn-seal:#7A2B32;--dn-line:#15140F1F}"
      + ".dn-rh{position:sticky;top:0;z-index:50;background:var(--dn-paper);border-bottom:1px solid var(--dn-line);"
      + "display:flex;align-items:center;justify-content:space-between;gap:14px;padding:11px 18px;"
      + "font-family:\"Nanum Myeongjo\",\"Gowun Batang\",\"Apple SD Gothic Neo\",\"Malgun Gothic\",serif;font-size:13px}"
      + ".dn-rh-left{display:flex;align-items:center;gap:14px;min-width:0}"
      + ".dn-rh-brand{color:var(--dn-ink);text-decoration:none;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
      + ".dn-rh-brand:hover{color:var(--dn-seal)}"
      + ".dn-rh-loc{color:var(--dn-gray);letter-spacing:.06em;white-space:nowrap;flex:none}"
      + ".dn-toggle{font-family:inherit;font-size:13px;font-weight:700;color:var(--dn-ink);"
      + "background:none;border:1px solid var(--dn-line);cursor:pointer;padding:5px 12px;flex:none}"
      + ".dn-toggle:hover{border-color:var(--dn-seal);color:var(--dn-seal)}"
      + "html.dn-wide .dn-toggle{display:none}"
      + ".dn-rh a:focus-visible,.dn-toggle:focus-visible{outline:2px solid var(--dn-seal);outline-offset:2px}"
      + ".dn-scrim{position:fixed;inset:0;background:#15140F5C;z-index:65;opacity:0;pointer-events:none;transition:opacity .15s ease}"
      + ".dn-scrim.dn-open{opacity:1;pointer-events:auto}"
      + "html.dn-wide .dn-scrim{display:none}"
      + ".dn-side{position:fixed;top:0;left:0;bottom:0;width:" + SIDEBAR_WIDTH + "px;overflow-y:auto;box-sizing:border-box;"
      + "background:var(--dn-paper-edge);border-right:1px solid var(--dn-line);padding:26px 22px 40px;"
      + "font-family:\"Nanum Myeongjo\",\"Gowun Batang\",\"Apple SD Gothic Neo\",\"Malgun Gothic\",serif;"
      + "transform:translateX(-100%);transition:transform .2s ease;z-index:70}"
      + "html.dn-wide .dn-side{transform:translateX(0)}"
      + ".dn-side.dn-open{transform:translateX(0)}"
      + ".dn-side-title{display:block;font-weight:800;font-size:15px;color:var(--dn-ink);text-decoration:none;"
      + "margin:0 0 20px;padding-bottom:14px;border-bottom:1px solid var(--dn-line)}"
      + ".dn-side-title:hover{color:var(--dn-seal)}"
      + ".dn-side-list{list-style:none;margin:0;padding:0}"
      + ".dn-side-list a{display:block;text-decoration:none;color:var(--dn-ink-soft);"
      + "padding:9px 4px 9px 12px;border-left:2px solid transparent}"
      + ".dn-side-list a:hover{color:var(--dn-seal)}"
      + ".dn-side-list a[aria-current='page']{border-left-color:var(--dn-seal);color:var(--dn-ink);font-weight:700}"
      + ".dn-side-k{display:block;font-size:10px;letter-spacing:.18em;color:var(--dn-gray)}"
      + ".dn-side-n{display:block;font-size:14px;margin-top:2px;line-height:1.4}"
      + ".dn-side-p{display:block;font-size:11px;color:var(--dn-gray);margin-top:3px}"
      + ".dn-side a:focus-visible{outline:2px solid var(--dn-seal);outline-offset:-2px}"
      + "@media (prefers-reduced-motion:reduce){.dn-side{transition:none}.dn-scrim{transition:none}}"
      + "@media print{.dn-rh,.dn-side,.dn-scrim{display:none!important}}";
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ---------- 판면주 ---------- */

  function buildTopBar(){
    var bar = document.createElement("div");
    bar.className = "dn-rh";

    var left = document.createElement("div");
    left.className = "dn-rh-left";

    var toggle = null;
    if (hasSidebar){
      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "dn-toggle";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", "dn-panel");
      toggle.textContent = "차례";
      left.appendChild(toggle);
    }

    var brand = document.createElement("a");
    brand.className = "dn-rh-brand";
    brand.href = "./index.html";
    brand.textContent = "아빠표 AI 학습법";
    left.appendChild(brand);

    bar.appendChild(left);

    var locText = current ? (current.kind + " " + current.page) : workLabel;
    if (locText){
      var loc = document.createElement("span");
      loc.className = "dn-rh-loc";
      loc.textContent = locText;
      bar.appendChild(loc);
    }

    document.body.insertBefore(bar, document.body.firstChild);
    return { bar: bar, toggle: toggle };
  }

  /* ---------- 사이드바 / 모바일 패널 ---------- */

  function buildSidebar(toggle){
    var scrim = document.createElement("div");
    scrim.className = "dn-scrim";

    var side = document.createElement("nav");
    side.className = "dn-side";
    side.id = "dn-panel";
    side.setAttribute("aria-label", "차례");

    var title = document.createElement("a");
    title.className = "dn-side-title";
    title.href = "./index.html";
    title.textContent = "아빠표 AI 학습법";
    side.appendChild(title);

    var list = document.createElement("ol");
    list.className = "dn-side-list";
    list.style.listStyle = "none";
    list.style.margin = "0";
    list.style.padding = "0";

    TOC.forEach(function(item){
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = item.href;
      a.setAttribute("data-id", item.id);

      var k = document.createElement("span");
      k.className = "dn-side-k";
      k.textContent = item.kind;

      var n = document.createElement("span");
      n.className = "dn-side-n";
      n.textContent = item.name;

      var p = document.createElement("span");
      p.className = "dn-side-p";
      p.textContent = item.page;

      a.appendChild(k);
      a.appendChild(n);
      a.appendChild(p);
      a.addEventListener("click", closePanel);
      li.appendChild(a);
      list.appendChild(li);
    });

    side.appendChild(list);
    document.body.insertBefore(scrim, document.body.firstChild);
    document.body.insertBefore(side, document.body.firstChild);

    scrim.addEventListener("click", closePanel);
    if (toggle){
      toggle.addEventListener("click", function(){
        if (side.classList.contains("dn-open")) closePanel();
        else openPanel();
      });
    }

    document.addEventListener("keydown", function(e){
      if (!side.classList.contains("dn-open")) return;
      if (e.key === "Escape"){ closePanel(); return; }
      if (e.key === "Tab") trapFocus(e);
    });

    updateLayout();
    window.addEventListener("resize", debounce(updateLayout, 120));

    function openPanel(){
      side.classList.add("dn-open");
      scrim.classList.add("dn-open");
      if (toggle) toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      var first = side.querySelector("a");
      if (first) first.focus();
    }

    function closePanel(){
      if (document.documentElement.classList.contains("dn-wide")) return;
      side.classList.remove("dn-open");
      scrim.classList.remove("dn-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    function trapFocus(e){
      var links = side.querySelectorAll("a");
      if (!links.length) return;
      var first = links[0], last = links[links.length - 1];
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }

    function fitsSidebar(){
      var el = document.querySelector(".page, .wrap");
      if (!el) return true;
      var rect = el.getBoundingClientRect();
      return rect.left >= (SIDEBAR_WIDTH + 8);
    }

    function updateLayout(){
      var wide = window.innerWidth >= WIDE_MIN && fitsSidebar();
      document.documentElement.classList.toggle("dn-wide", wide);
      if (wide) closePanel();
    }

    if (current) markCurrent(current.id);
  }

  function markCurrent(id){
    var links = document.querySelectorAll(".dn-side-list a");
    for (var i = 0; i < links.length; i++){
      if (links[i].getAttribute("data-id") === id) links[i].setAttribute("aria-current", "page");
      else links[i].removeAttribute("aria-current");
    }
  }

  /* ---------- 홈페이지 스크롤 위치 감지 ---------- */

  function setupScrollSpy(){
    if (!("IntersectionObserver" in window)) return;
    var ids = ["preface", "why", "roles", "records"];
    var targets = [];
    ids.forEach(function(id){
      var el = document.getElementById(id);
      if (el) targets.push(el);
    });
    if (!targets.length) return;

    var observer = new IntersectionObserver(function(entries){
      var visible = entries.filter(function(e){ return e.isIntersecting; });
      if (!visible.length) return;
      visible.sort(function(a, b){ return b.intersectionRatio - a.intersectionRatio; });
      markCurrent(visible[0].target.id);
    }, { rootMargin: "-15% 0px -70% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] });

    targets.forEach(function(el){ observer.observe(el); });
  }

  /* ---------- 유틸 ---------- */

  function debounce(fn, wait){
    var t;
    return function(){
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }
})();
