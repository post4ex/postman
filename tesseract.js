var Tesseract = (function (exports) {
  'async_script';
  var E = "5.0.5";
  async function P(t, e = 0, n) {
      const o = await T(t, e, n);
      return await o.initialize(t), o
  }
  const T = async (t, e = 0, n) => {
      const o = {
          ...J,
          ...typeof n == "object" ? n : {}
      };
      if (typeof n == "string") {
          const r = n.split("/");
          r.pop(), o.corePath = `${r.join("/")}/`
      }
      return await D(o.corePath, o.workerPath, o.workerBlobURL, e), k(o, t)
  };
  var a = "undefined",
      l = typeof window !== a ? window : typeof self !== a ? self : {},
      I = l.Tesseract,
      x = {
          default: "eng"
      },
      J = {
          corePath: typeof process !== a && "development" === "development" ? `https://unpkg.com/tesseract.js-core@v${I.coreVersion}/tesseract-core.wasm.js` : `https://cdn.jsdelivr.net/npm/tesseract.js-core@v${I.coreVersion}/tesseract-core.wasm.js`,
          workerPath: typeof process !== a && "development" === "development" ? "https://unpkg.com/tesseract.js@v5.0.5/dist/worker.min.js" : "https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.5/dist/worker.min.js",
          workerBlobURL: !0
      },
      M = {},
      O = {},
      $ = async (t, e) => {
          const n = `${t.replace(/\/$/, "")}/${e}.traineddata.gz`;
          if (M[n]) return M[n];
          const o = await fetch(n),
              r = await o.arrayBuffer();
          return M[n] = new Uint8Array(r), M[n]
      };

  function g(t) {
      if (t < 0) return !1;
      const e = performance.now() + t;
      for (; performance.now() < e;);
      return !0
  }
  const d = () => performance.now();
  async function L(t) {
      const e = d();
      if (t) {
          if (t.startsWith("http") || t.startsWith("https://")) {
              const o = await fetch(t);
              return await o.blob()
          } {
              const o = l.document.createElement("img");
              o.src = t;
              const r = await new Promise(i => {
                  o.onload = () => i(o)
              });
              return console.log(`image loading time: ${d() - e} ms`), r
          }
      }
      return null
  }
  const V = t => new Promise(e => {
      const n = new FileReader;
      n.onload = () => {
          e(n.result)
      }, n.readAsDataURL(t)
  });
  async function N(t) {
      const e = await L(t);
      if (e === null) return {
          width: 0,
          height: 0,
          data: new Uint8ClampedArray(0)
      };
      let n;
      if (l.createImageBitmap, n = l.document.createElement("canvas"), typeof OffscreenCanvas < "u" && e instanceof ImageBitmap) n.getContext("2d", {
          willReadFrequently: !0
      });
      else if (e instanceof HTMLImageElement) {
          n.width = e.naturalWidth, n.height = e.naturalHeight;
          const r = n.getContext("2d", {
              willReadFrequently: !0
          });
          r.drawImage(e, 0, 0, n.width, n.height), {
              width: n.width,
              height: n.height,
              data: r.getImageData(0, 0, n.width, n.height).data
          }
      }
      const o = n.getContext("2d", {
          willReadFrequently: !0
      });
      return o.drawImage(e, 0, 0, n.width, n.height), o.getImageData(0, 0, n.width, n.height)
  }
  var z = {},
      F = {},
      m = {},
      w = {},
      b = {},
      U = {
          "font-family": "serif",
          "font-size": "10px",
          color: "black",
          "background-color": "white",
          border: "1px solid black"
      };

  function S(t) {
      if (t.level === 0) return !0;
      const {
          width: e,
          height: n
      } = t.bbox, o = e * n, r = t.confidence, i = t.text.trim();
      return r > 70 && o > 100 && i.length > 3
  }
  const G = () => Object.keys(U).reduce((t, e) => `${t} ${e}: ${U[e]};`, ""),
      W = ({
          width: t,
          height: e
      }, n) => (n.style = `width: ${t}px; height: ${e}px; position: relative;`, n),
      Z = t => {
          const e = document.createElement("div");
          return e.className = "tesseract-overlay", e.setAttribute("style", G()), e.innerText = t.text, e.title = `confidence: ${t.confidence.toFixed(2)}%`, e
      },
      X = (t, e) => {
          const n = t.bbox;
          e.style.left = `${n.x0}px`, e.style.top = `${n.y0}px`, e.style.width = `${n.x1 - n.x0}px`, e.style.height = `${n.y1 - n.y0}px`, e.style.position = "absolute"
      },
      q = async (t, e) => {
          const n = await N(t);
          if (F[e]) {
              const o = document.getElementById(e);
              W(n, o)
          } else {
              const o = document.createElement("div");
              o.id = e, W(n, o), document.getElementsByTagName("body")[0].appendChild(o), F[e] = !0
          }
      },
      H = (t, e) => {
          if (m[e] || (m[e] = []), w[e] || (w[e] = []), !b[e] || (b[e] = []), t.hocr) {
              const n = document.createElement("div");
              n.innerHTML = t.hocr;
              const o = n.getElementsByClassName("ocr_word");
              for (const r of o) {
                  const i = document.createElement("div");
                  i.className = "ocr_word", i.style = r.style, i.title = r.title, i.innerText = r.innerText.trim(), m[e].push(i)
              }
          }
          if (t.tsv) {
              const n = t.tsv.split(`
`);
              let o = !0;
              for (const r of n) {
                  if (o) {
                      o = !1;
                      continue
                  }
                  const i = r.split("	");
                  if (i.length === 12) {
                      const [c, s, u, f, p, B, y, j, C, _, A, K] = i, R = parseInt(C, 10);
                      if (R > 70) {
                          const v = document.createElement("div");
                          v.className = "ocr_word", v.style = `position: absolute; left: ${f}px; top: ${p}px; width: ${B}px; height: ${y}px;`, v.title = `confidence: ${R}`, v.innerText = K, w[e].push(v)
                      }
                  }
              }
          }
          if (t.box)
              for (const n of t.box.split(`
`)) {
                  const o = n.split(" ");
                  if (o.length === 6) {
                      const [, r, i, c, s] = o, u = document.createElement("div");
                      u.className = "ocr_word", u.style = `position: absolute; left: ${r}px; top: ${i}px; width: ${c-r}px; height: ${s-i}px;`, b[e].push(u)
                  }
              }
          if (t.unlv) {
              const n = t.unlv.split(`
`);
              for (let o = 0; o < n.length; o += 4) {
                  const [r, i, c, s] = n[o].split(" ").map(f => parseInt(f, 10)), u = document.createElement("div");
                  u.className = "ocr_word", u.style = `position: absolute; left: ${r}px; top: ${i}px; width: ${c-r}px; height: ${s-i}px;`, z[e].push(u)
              }
          }
          if (t.words) {
              const n = [];
              for (const o of t.words) {
                  const r = Z(o);
                  X(o, r), n.push(r)
              }
              z[e] = n
          }
          if (t.lines) {
              const n = [];
              for (const o of t.lines) {
                  if (S(o)) {
                      const r = Z(o);
                      X(o, r), n.push(r)
                  }
                  for (const r of o.words) {
                      const i = Z(r);
                      X(r, i), n.push(i)
                  }
              }
              z[e] = n
          }
          if (t.paragraphs) {
              const n = [];
              for (const o of t.paragraphs)
                  if (S(o)) {
                      const r = Z(o);
                      X(o, r), n.push(r)
                  }
              z[e] = n
          }
          if (t.symbols) {
              const n = [];
              for (const o of t.symbols)
                  if (S(o)) {
                      const r = Z(o);
                      X(o, r), n.push(r)
                  }
              z[e] = n
          }
      },
      Q = (t, e) => {
          const n = document.getElementById(t);
          n.innerHTML = "", e.forEach(o => {
              n.appendChild(o)
          })
      },
      tt = (t, e = "default") => {
          z[e] ? Q(t, z[e]) : F[t] && (document.getElementById(t).innerHTML = "")
      },
      et = (t, e = "default") => {
          F[t] && (m[e] ? Q(t, m[e]) : document.getElementById(t).innerHTML = "")
      },
      nt = (t, e = "default") => {
          F[t] && (w[e] ? Q(t, w[e]) : document.getElementById(t).innerHTML = "")
      },
      ot = (t, e = "default") => {
          F[t] && (b[e] ? Q(t, b[e]) : document.getElementById(t).innerHTML = "")
      };
  var Y = "undefined";
  typeof window !== Y;
  var rt = typeof l !== Y ? l : typeof self !== Y ? self : {},
      it = () => {
          const {
              Tesseract: t
          } = rt;
          return "undefined" != typeof t && "undefined" != typeof t.isLoaded && t.isLoaded
      };
  let D = async (t, e, n, o) => {
          if (!it()) {
              const r = typeof e == "string" ? e : `https://cdn.jsdelivr.net/npm/tesseract.js@v${E}/dist/worker.min.js`,
                  i = ["", "tesseract.js"],
                  c = `
    importScripts("${r}");
    `;
              let s = r;
              n && (s = URL.createObjectURL(new Blob([c])));
              const u = rt.navigator.hardwareConcurrency || 4;
              O[o] = Array(o === 0 ? u : o).fill(0).map(() => new Worker(s));
              const f = {};
              await Promise.all(O[o].map(p => new Promise((B, y) => {
                  p.onmessage = ({
                      data: j
                  }) => {
                      j.status === "resolve" && j.action === "load" && (p.onmessage = ({
                          data: C
                      }) => {
                          f[C.jobId](C)
                      }, B())
                  }, p.postMessage({
                      workerId: Math.random().toString(36).substring(2, 12),
                      action: "load",
                      payload: {
                          options: {
                              corePath: t
                          }
                      }
                  })
              }))), l.addEventListener("beforeunload", () => {
                  st(o)
              }), rt.Tesseract = {
                  worker: O[o][0],
                  workers: O[o],
                  dispatch: (p, B, y) => new Promise(j => {
                      const C = Math.random().toString(36).substring(2, 12);
                      f[C] = _ => {
                          _.status === "resolve" ? j(_) : y && y(_)
                      }, p.postMessage({
                          workerId: O[o][0].workerId,
                          jobId: C,
                          action: B,
                          payload: y
                      })
                  }),
                  isLoaded: !0,
                  coreVersion: "5.0.0"
              }
          }
      },
      st = (t = "default") => {
          rt.Tesseract.workers.forEach(e => {
              e.terminate()
          }), rt.Tesseract.isLoaded = !1
      },
      k = (t, e) => {
          const n = {
              id: Math.random().toString(36).substring(2, 12),
              loaded: !1,
              options: t,
              get lang() {
                  return e
              },
              set lang(o) {
                  e = o
              },
              initialize: async (o, r) => {
                  n.loaded || (await Promise.all(rt.Tesseract.workers.map(i => rt.Tesseract.dispatch(i, "loadLanguage", {
                      language: o,
                      options: n.options,
                      langPath: r
                  }))), n.loaded = !0)
              },
              setParameters: async o => {
                  await Promise.all(rt.Tesseract.workers.map(r => rt.Tesseract.dispatch(r, "setParameters", {
                      params: o
                  })))
              },
              recognize: async (o, r, i) => {
                  const c = Array.isArray(o) ? o : [o];
                  let s = 0;
                  const u = async (f, p) => (await Promise.all(c.map(async B => {
                      const y = await rt.Tesseract.dispatch(p, f, {
                          image: B,
                          options: r,
                          workerOptions: {
                              ...i,
                              jobId: n.id
                          }
                      }, j => {
                          s < 1 && (s = j.progress, rt.Tesseract.worker.onmessage({
                              data: {
                                  ...j,
                                  jobId: n.id
                              }
                          }))
                      });
                      return y.data
                  }))).reduce((B, y) => ({
                      ...B,
                      data: {
                          ...B.data,
                          ...y
                      }
                  }), {
                      data: {}
                  })
              };
                  return await u("recognize", rt.Tesseract.worker)
              },
              detect: async (o, r = {}) => await rt.Tesseract.dispatch(rt.Tesseract.worker, "detect", {
                  image: o,
                  options: r
              })
          };
          return n
      };
  exports.createWorker = T, exports.version = E;
  Object.defineProperty(exports, "__esModule", {
      value: !0
  });
  return exports
})({});
//# sourceMappingURL=tesseract.min.js.map
