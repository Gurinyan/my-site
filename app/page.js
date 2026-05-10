"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { BookOpen, ChevronDown, Menu, X, Feather, MapPin } from "lucide-react";

// ── Intersection Observer hook ──────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(e.target);
        }
      },
      { threshold }
    );
    const el = ref.current;
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Book cover ──────────────────────────────────────────────────────────
function BookCover({ src, title }) {
  const [err, setErr] = useState(false);
  return (
    <div className="mx-auto w-full max-w-[280px] sm:max-w-[340px]">
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "2/3",
          boxShadow: "0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(80,80,80,0.2)",
        }}
      >
        {!err ? (
          <Image
            src={src}
            alt={title}
            fill
            className="object-cover"
            onError={() => setErr(true)}
            sizes="(max-width: 640px) 80vw, 340px"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center"
            style={{ background: "linear-gradient(160deg, #1a0808 0%, #2a1010 55%, #1a0808 100%)" }}
          >
            <div className="absolute left-0 top-0 h-full w-1" style={{ background: "linear-gradient(to bottom, #8b0000, #4a0000)" }} />
            <div className="h-px w-10" style={{ background: "#8b0000" }} />
            <span className="text-[10px] tracking-[0.35em] uppercase" style={{ color: "rgba(255,220,185,0.35)" }}>Kodansha Bunko</span>
            <p className="text-lg font-bold leading-snug tracking-wider text-stone-300">{title}</p>
            <div className="h-px w-10" style={{ background: "#8b0000" }} />
            <span className="text-[10px] tracking-widest" style={{ color: "rgba(255,215,178,0.3)" }}>綾辻行人</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Right-side timeline sidebar ─────────────────────────────────────────
function TimelineSidebar({ books, activeIdx }) {
  const fillPct = activeIdx < 0 ? 0 : (activeIdx / (books.length - 1)) * 100;
  return (
    <div
      className="pointer-events-none fixed z-40 hidden xl:block"
      style={{ right: 20, top: "50%", transform: "translateY(-50%)" }}
    >
      <div className="relative" style={{ width: 88, height: "65vh" }}>
        <div className="absolute top-0" style={{ right: 0, width: 1, height: "100%", background: "rgba(255,255,255,0.08)" }} />
        <div
          className="absolute top-0"
          style={{
            right: 0, width: 1,
            height: `${fillPct}%`,
            background: "linear-gradient(to bottom, rgba(139,0,0,0.85), #c04828)",
            transition: "height 0.5s ease",
          }}
        />
        {books.map((book, i) => {
          const pct = (i / (books.length - 1)) * 100;
          const isActive = i <= activeIdx;
          return (
            <div key={book.id} className="absolute flex items-center" style={{ top: `${pct}%`, right: 0, transform: "translateY(-50%)" }}>
              <span
                className="tabular-nums text-[10px] tracking-widest transition-all duration-500"
                style={{ marginRight: 10, color: isActive ? "rgba(255,218,182,0.9)" : "rgba(255,218,182,0.2)", whiteSpace: "nowrap" }}
              >
                {book.year.replace("年", "")}
              </span>
              <div
                className="transition-all duration-500"
                style={{
                  width: isActive ? 7 : 5, height: isActive ? 7 : 5,
                  borderRadius: "50%",
                  background: isActive ? "#c84828" : "rgba(255,255,255,0.12)",
                  boxShadow: isActive ? "0 0 8px rgba(200,72,40,0.75)" : "none",
                  marginRight: -3, flexShrink: 0,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Single book section ────────────────────────────────────────────────
function BookSection({ book, reverse, onRef }) {
  const [contentRef, visible] = useInView(0.08);

  const imgAnim = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateX(0)" : `translateX(${reverse ? "36px" : "-36px"})`,
    transition: "opacity 1.4s ease 0.2s, transform 1.4s ease 0.2s",
  };
  const txtAnim = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateX(0)" : `translateX(${reverse ? "-36px" : "36px"})`,
    transition: "opacity 1.4s ease 0.5s, transform 1.4s ease 0.5s",
  };

  const coverEl = (
    <div className="w-full md:w-[38%]" style={imgAnim}>
      <BookCover src={book.image} title={book.title} />
    </div>
  );
  const textEl = (
    <div className="w-full md:w-[62%]" style={txtAnim}>
      <div className="mb-3 flex items-center gap-3">
        <span className="h-px w-6" style={{ background: "#8b0000" }} />
        <span className="text-[11px] tracking-[0.3em]" style={{ color: "rgba(219,79,46,0.9)" }}>
          {book.label} · {book.year}
        </span>
      </div>
      <h2 className="mb-3 text-3xl font-bold leading-snug tracking-wide text-stone-100 md:text-4xl">
        {book.title}
      </h2>
      <p className="mb-6 text-sm italic tracking-wider" style={{ color: "rgba(219,79,46,0.75)" }}>
        ──{book.tagline}
      </p>
      <div className="mb-6 h-px" style={{ background: "rgba(219,79,46,0.18)" }} />
      <p className="text-sm leading-[2] tracking-wide" style={{ color: "rgba(255,228,208,0.78)" }}>
        {book.synopsis}
      </p>
    </div>
  );

  return (
    <div ref={onRef} className="border-t py-20" style={{ borderColor: "rgba(38,38,38,0.6)" }}>
      <div className="mx-auto max-w-6xl px-6" ref={contentRef}>
        <div className="mb-10 flex items-end gap-4">
          <span className="select-none font-bold italic leading-none" style={{ fontSize: "5rem", color: "rgba(255,195,150,0.18)" }}>
            {book.roman}
          </span>
          <span className="mb-2 text-xs tracking-[0.3em]" style={{ color: "rgba(255,215,178,0.45)" }}>{book.label}</span>
        </div>
        <div className="flex flex-col items-start gap-10 md:flex-row lg:gap-16">
          {reverse ? <>{textEl}{coverEl}</> : <>{coverEl}{textEl}</>}
        </div>
      </div>
    </div>
  );
}

// ── Author section ─────────────────────────────────────────────────────
function AuthorSection() {
  const [ref, visible] = useInView(0.1);
  const [imgErr, setImgErr] = useState(false);
  return (
    <section id="著者紹介" className="border-t px-6 py-24" style={{ borderColor: "rgba(38,38,38,0.6)" }}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="h-px w-14" style={{ background: "#8b0000" }} />
            <Feather size={15} style={{ color: "#8b0000" }} />
            <span className="h-px w-14" style={{ background: "#8b0000" }} />
          </div>
          <h2 className="text-3xl font-bold tracking-widest text-stone-100 md:text-4xl">著者紹介</h2>
        </div>
        <div ref={ref} className="flex flex-col items-start gap-10 md:flex-row lg:gap-16">
          <div
            className="flex w-full justify-center md:w-[36%]"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-36px)", transition: "opacity 1.4s ease 0.2s, transform 1.4s ease 0.2s" }}
          >
            <div className="relative h-72 w-56 overflow-hidden rounded-2xl md:h-80 md:w-64" style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(80,80,80,0.2)" }}>
              {!imgErr ? (
                <Image src="/images/ayatsuji.jpg" alt="綾辻行人" fill className="object-cover object-top" onError={() => setImgErr(true)} sizes="256px" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3" style={{ background: "linear-gradient(160deg, #1a0808, #2d1212, #1a0808)" }}>
                  <div className="absolute left-0 top-0 h-full w-1" style={{ background: "linear-gradient(to bottom, #8b0000, #4a0000)" }} />
                  <span className="text-4xl font-bold tracking-widest text-stone-500">綾辻</span>
                  <span className="text-xs tracking-[0.4em]" style={{ color: "rgba(255,215,178,0.35)" }}>行人</span>
                </div>
              )}
            </div>
          </div>
          <div
            className="w-full md:w-[64%]"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(36px)", transition: "opacity 1.4s ease 0.5s, transform 1.4s ease 0.5s" }}
          >
            <h3 className="mb-1 text-2xl font-bold tracking-wider text-stone-100">綾辻 行人</h3>
            <p className="mb-6 text-[11px] tracking-[0.35em]" style={{ color: "#8b0000" }}>Yukito Ayatsuji</p>
            <div className="mb-6 h-px" style={{ background: "rgba(139,0,0,0.2)" }} />
            <p className="text-sm leading-[2.1] tracking-wide" style={{ color: "rgba(255,225,200,0.72)" }}>
              1960年、京都府生まれ。本名・中村剛士。京都大学工学部建築学科を経て、
              同大学院工学研究科建築学専攻修士課程を修了。
              1987年、「十角館の殺人」でデビューし、日本の推理小説界に「新本格」ムーブメントを巻き起こした。
            </p>
            <p className="mt-4 text-sm leading-[2.1] tracking-wide" style={{ color: "rgba(255,225,200,0.72)" }}>
              建築学の素養を活かした精緻な空間設計と、論理的に組み上げられたトリックを持ち味とし、
              館シリーズの累計発行部数は1000万部を超える。
              ホラー小説「Another」は映画・テレビドラマ・アニメにメディアミックスされ、広く知られる。
              奥様は同じく作家の小野不由美氏。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Japan map section ───────────────────────────────────────────────────
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const MANSION_COORDS = [
  { id: 1, title: "十角館",   coordinates: [131.5, 33.8], location: "瀬戸内海（架空の孤島）",  anchor: "end",   dy: -14 },
  { id: 2, title: "水車館",   coordinates: [133.9, 34.6], location: "岡山県付近（瀬戸内）",    anchor: "start", dy: -14 },
  { id: 3, title: "迷路館",   coordinates: [136.8, 37.1], location: "長野県山中",              anchor: "end",   dy: -14 },
  { id: 4, title: "人形館",   coordinates: [135.8, 35.1], location: "京都府北白川",            anchor: "start", dy:  18 },
  { id: 5, title: "時計館",   coordinates: [138.7, 36.5], location: "信州（長野県）",          anchor: "start", dy: -14 },
  { id: 6, title: "黒猫館",   coordinates: [140.8, 41.8], location: "北海道・函館付近",        anchor: "start", dy: -14 },
  { id: 7, title: "暗黒館",   coordinates: [130.6, 32.7], location: "九州山中（熊本県付近）",  anchor: "end",   dy:  18 },
  { id: 8, title: "びっくり館", coordinates: [142.8, 43.8], location: "北海道",              anchor: "start", dy: -14 },
  { id: 9, title: "奇面館",   coordinates: [138.1, 35.7], location: "信州（長野県）",          anchor: "end",   dy:  18 },
];

function JapanMapSection() {
  const [ref, visible] = useInView(0.05);
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => setMounted(true), []);

  return (
    <section id="館の場所" className="border-t px-6 py-24" style={{ borderColor: "rgba(38,38,38,0.6)" }}>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="h-px w-14" style={{ background: "#8b0000" }} />
            <MapPin size={15} style={{ color: "#8b0000" }} />
            <span className="h-px w-14" style={{ background: "#8b0000" }} />
          </div>
          <h2 className="mb-3 text-3xl font-bold tracking-widest text-stone-100 md:text-4xl">館の在処</h2>
          <p className="text-sm tracking-wider" style={{ color: "rgba(255,220,190,0.55)" }}>
            物語の舞台となった館の、推定される所在地
          </p>
        </div>

        {/* Map container */}
        <div
          ref={ref}
          className="relative mx-auto overflow-hidden"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1.2s ease 0.2s",
            borderRadius: 2,
            border: "1px solid rgba(139,0,0,0.2)",
            background: "rgba(14,8,4,0.85)",
            boxShadow: "0 0 60px rgba(0,0,0,0.6)",
          }}
        >
          {mounted ? (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 1700, center: [136.5, 36.5] }}
              width={800}
              height={580}
              style={{ width: "100%", height: "auto", display: "block" }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const isJapan = Number(geo.id) === 392;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isJapan ? "rgba(74,28,8,0.9)" : "rgba(30,15,5,0.4)"}
                        stroke={isJapan ? "rgba(139,0,0,0.45)" : "rgba(80,40,20,0.2)"}
                        strokeWidth={isJapan ? 0.6 : 0.3}
                        style={{ outline: "none" }}
                      />
                    );
                  })
                }
              </Geographies>

              {MANSION_COORDS.map((m) => (
                <Marker
                  key={m.id}
                  coordinates={m.coordinates}
                  onMouseEnter={() => setTooltip(m)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {/* Outer glow ring */}
                  <circle r={9} fill="rgba(200,72,40,0.12)" />
                  {/* Dot */}
                  <circle
                    r={4}
                    fill="#c84828"
                    stroke="rgba(255,200,160,0.5)"
                    strokeWidth={1}
                    style={{ cursor: "pointer" }}
                  />
                  {/* Label */}
                  <text
                    textAnchor={m.anchor}
                    x={m.anchor === "end" ? -8 : 8}
                    y={m.dy}
                    style={{
                      fontSize: 9,
                      fontFamily: "inherit",
                      fill: "rgba(255,220,185,0.85)",
                      pointerEvents: "none",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {m.title}
                  </text>
                </Marker>
              ))}
            </ComposableMap>
          ) : (
            <div className="flex h-72 items-center justify-center">
              <span className="text-sm tracking-widest" style={{ color: "rgba(255,215,178,0.3)" }}>地図を読み込み中…</span>
            </div>
          )}

          {/* Tooltip */}
          {tooltip && (
            <div
              className="pointer-events-none absolute bottom-4 left-4 rounded px-4 py-3"
              style={{
                background: "rgba(10,4,2,0.92)",
                border: "1px solid rgba(139,0,0,0.4)",
                backdropFilter: "blur(8px)",
              }}
            >
              <p className="mb-0.5 text-sm font-bold tracking-wider text-stone-100">{tooltip.title}</p>
              <p className="text-[11px] tracking-wider" style={{ color: "rgba(219,79,46,0.85)" }}>{tooltip.location}</p>
            </div>
          )}

          {/* Legend note */}
          <p
            className="absolute bottom-3 right-4 text-[10px] tracking-widest"
            style={{ color: "rgba(255,215,178,0.22)" }}
          >
            ※ 所在地は作品の描写に基づく推定です
          </p>
        </div>

        {/* Location list */}
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MANSION_COORDS.map((m) => (
            <div
              key={m.id}
              className="flex items-start gap-3 rounded px-4 py-3"
              style={{ background: "rgba(20,8,2,0.5)", border: "1px solid rgba(80,30,10,0.3)" }}
            >
              <MapPin size={13} style={{ color: "#c84828", marginTop: 2, flexShrink: 0 }} />
              <div>
                <p className="text-sm font-bold tracking-wide text-stone-200">{m.title}</p>
                <p className="text-[11px] tracking-wide" style={{ color: "rgba(255,215,178,0.5)" }}>{m.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Data ───────────────────────────────────────────────────────────────
const BOOKS = [
  { id: 1, roman: "I",    label: "第1作", year: "1987年", title: "十角館の殺人",   image: "/images/jukkakukan.jpg", tagline: "ただ一行が、全てを覆す。",           synopsis: "本格推理小説研究会の七人が招かれた、孤島に建つ十角形の奇妙な館。嵐によって外界との連絡を絶たれた状況で、一人また一人と不可解な死が続く。館での連続殺人と、本土で繰り広げられる別の調査。二つの事件が交差した瞬間、読者の前に突きつけられるたった一行の真実が、物語の全てをひっくり返す。1987年のデビュー以来、日本中の読者を震撼させ続ける「新本格」ミステリの原点。" },
  { id: 2, roman: "II",   label: "第2作", year: "1988年", title: "水車館の殺人",   image: "/images/suishakan.jpg",  tagline: "過去と現在が交差する、廻り続ける謎。",  synopsis: "瀬戸内の美しい景色の中に建つ、水車のある奇妙な洋館。盲目の主人・藤沼一成と、謎の仮面を被った青年・紀一。そして招かれた客たちの間に漂う不穏な空気。一年前の事件の記憶と現在の連続殺人が複雑に絡み合いながら、物語はある驚愕の真実へと向かう。時間軸を大胆に操るタイム・ラグ構造が冴え渡る、館シリーズ第二弾。" },
  { id: 3, roman: "III",  label: "第3作", year: "1988年", title: "迷路館の殺人",   image: "/images/meirokan.jpg",   tagline: "作中に潜む作中。謎の奥に謎がある。",    synopsis: "山中に佇む、地下に巨大な迷路を持つ奇妙な館。招かれた四人の作家候補生たちは、館の主人から奇妙な条件のもとでミステリ小説の執筆を命じられる。しかし現実の館でも、次々と人が死んでいく。「作中作」という大胆なメタ構造を採用し、本格ミステリの可能性を大きく広げた野心作。" },
  { id: 4, roman: "IV",   label: "第4作", year: "1989年", title: "人形館の殺人",   image: "/images/ningyokan.jpg",  tagline: "無数の瞳が、あなたを見ている。",       synopsis: "幼少期を過ごした屋敷を相続した主人公・飛龍想一。そこには無数の人形が飾られ、奇妙な脅迫状が届き始める。精神を蝕む恐怖と幻覚、館に充満する狂気。シリーズ唯一の一人称語りで描かれる心理サスペンスは、ホラーとミステリを融合させた異色作。" },
  { id: 5, roman: "V",    label: "第5作", year: "1991年", title: "時計館の殺人",   image: "/images/tokeikan.jpg",   tagline: "時計は止まらない。死も、また。",        synopsis: "廃屋同然の洋館に数百の時計が刻み続ける、奇妙な時の流れ。心霊現象の調査に訪れた研究者たちは、館の中で外界から完全に孤立してしまう。行方不明の少女の亡霊が目撃される中、現実の殺人が次々と起こる。シリーズ最長作にして、多くの読者がシリーズ最高傑作と称える一作。" },
  { id: 6, roman: "VI",   label: "第6作", year: "1992年", title: "黒猫館の殺人",   image: "/images/kuronekkan.jpg", tagline: "記憶のない男が目覚めた館の秘密。",      synopsis: "記憶を完全に失った男が目覚めると、そこは黒猫の絵が随所に飾られた奇妙な館だった。自分が誰なのかを探りながら館の謎に迫っていく主人公。北海道と京都、二つの場所で同時進行する物語はやがて一つの驚愕の真実へと収束する。南北を結ぶ大胆なトリックと、記憶と同一性というテーマが融合した第六弾。" },
  { id: 7, roman: "VII",  label: "第7作", year: "2004年", title: "暗黒館の殺人",   image: "/images/ankokukan.jpg",  tagline: "最も深く、最も暗い迷宮へ。",           synopsis: "湖上に建つ浦登家の巨大な館。代々伝わる禁忌と謎の風習、そして奇怪な料理「カリュカ」。シリーズ最長・最重量作にして、最もダークな物語。探偵・江南孝明が挑む浦登家の秘密は、人間の業と本質にまで迫る深遠なテーマを持つ。四分冊で刊行された大作。" },
  { id: 8, roman: "VIII", label: "第8作", year: "2006年", title: "びっくり館の殺人", image: "/images/bikkurikan.jpg", tagline: "少年の目が見た、クリスマスの悪夢。",    synopsis: "クリスマスの夜、少年・俊生が招かれた「びっくり館」と呼ばれる屋敷。腹話術師の老人とその人形「三楽」が支配するその館で、密室殺人事件が起きる。唯一の目撃者は人形だった。少年の視点から描かれるシリーズ唯一の作品は、童話的な恐怖と論理的なミステリを融合させた短編的秀作。" },
  { id: 9, roman: "IX",   label: "第9作", year: "2012年", title: "奇面館の殺人",   image: "/images/kimengakan.jpg", tagline: "仮面の下に、名前はない。",              synopsis: "猛吹雪によって孤立した、奇妙な仮面飾りに満ちた屋敷「奇面館」。館の主人・影山逸史は招待客全員に異様な仮面を被ることを強要し、館内では誰が誰か分からない状況が作り出される。その状況下で、首のない死体が発見される。全員が匿名という前代未聞の設定が生み出す密室劇。" },
];

const NAV_LINKS = ["著者紹介", "作品一覧", "館の場所", "館の系譜"];

// ── Main page ──────────────────────────────────────────────────────────
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeBookIdx, setActiveBookIdx] = useState(-1);
  const bookSectionRefs = useRef([]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const vh = window.innerHeight;
      let newActive = -1;
      bookSectionRefs.current.forEach((el, i) => {
        if (!el) return;
        if (el.getBoundingClientRect().top < vh * 0.55) newActive = i;
      });
      setActiveBookIdx(newActive);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <TimelineSidebar books={BOOKS} activeIdx={activeBookIdx} />

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
        style={{
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          background: scrolled ? "rgba(8,8,8,0.9)" : "rgba(8,8,8,0.55)",
          borderBottom: scrolled ? "1px solid rgba(139,0,0,0.2)" : "none",
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:py-5">
          <a href="#" className="text-lg font-bold tracking-[0.18em] text-stone-100 md:text-xl">
            <span style={{ color: "#8b0000" }}>館</span>シリーズ
          </a>
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((label) => (
              <a key={label} href={`#${label}`} className="group relative text-sm tracking-widest text-stone-300 transition-colors duration-200 hover:text-stone-100">
                {label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" style={{ background: "#8b0000" }} />
              </a>
            ))}
          </div>
          <button className="text-stone-300 transition-colors hover:text-stone-100 md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="メニュー">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
        {menuOpen && (
          <div className="border-t border-stone-800/60 md:hidden" style={{ background: "rgba(6,6,6,0.96)" }}>
            {NAV_LINKS.map((label) => (
              <a key={label} href={`#${label}`} className="block px-6 py-4 text-sm tracking-widest text-stone-300 transition-colors hover:bg-stone-900/40 hover:text-stone-100" onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(45deg, rgba(139,0,0,0.6) 0px, rgba(139,0,0,0.6) 1px, transparent 1px, transparent 48px)` }} />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(139,0,0,0.1) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-4xl">
          <div className="anim-0 mb-8 flex items-center justify-center gap-3">
            <span className="h-px w-10" style={{ background: "#8b0000" }} />
            <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "#8b0000" }}>Mystery · Detective Fiction</span>
            <span className="h-px w-10" style={{ background: "#8b0000" }} />
          </div>
          <h1 className="anim-1 mb-6 text-4xl font-bold leading-snug tracking-[0.06em] text-stone-100 sm:text-5xl md:text-6xl lg:text-7xl" style={{ textShadow: "0 0 60px rgba(139,0,0,0.15)" }}>
            十角館から始まる、<br />
            <span style={{ color: "#8b0000" }}>異形の迷宮</span>
          </h1>
          <p className="anim-2 mb-3 text-sm tracking-[0.25em]" style={{ color: "rgba(255,225,200,0.62)" }}>綾辻行人 / 館シリーズ 全9作品</p>
          <p className="anim-3 text-xs tracking-[0.2em]" style={{ color: "rgba(255,215,178,0.4)" }}>Rui Takano | Computer Science Student</p>
        </div>
        <div className="anim-bounce absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.3em]" style={{ color: "rgba(255,215,178,0.38)" }}>Scroll</span>
          <ChevronDown size={16} style={{ color: "#8b0000" }} />
        </div>
      </section>

      {/* ── 著者紹介（作品一覧の前）──────────────────────────── */}
      <AuthorSection />

      {/* ── 作品一覧 ─────────────────────────────────────────── */}
      <section id="作品一覧" className="border-t" style={{ borderColor: "rgba(38,38,38,0.6)" }}>
        <div className="px-6 py-20 text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="h-px w-14" style={{ background: "#8b0000" }} />
            <BookOpen size={15} style={{ color: "#8b0000" }} />
            <span className="h-px w-14" style={{ background: "#8b0000" }} />
          </div>
          <h2 className="mb-3 text-3xl font-bold tracking-widest text-stone-100 md:text-4xl">作品一覧</h2>
          <p className="text-sm tracking-wider" style={{ color: "rgba(255,220,190,0.55)" }}>館に宿る謎と狂気が、読者を異形の迷宮へと誘う</p>
        </div>
        {BOOKS.map((book, i) => (
          <BookSection key={book.id} book={book} reverse={book.id % 2 === 0} onRef={(el) => { bookSectionRefs.current[i] = el; }} />
        ))}
      </section>

      {/* ── 館の在処（地図）────────────────────────────────── */}
      <JapanMapSection />

      {/* ── 館の系譜 ─────────────────────────────────────────── */}
      <section id="館の系譜" className="border-t px-6 py-24" style={{ borderColor: "rgba(38,38,38,0.6)" }}>
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="h-px w-14" style={{ background: "#8b0000" }} />
            <BookOpen size={15} style={{ color: "#8b0000" }} />
            <span className="h-px w-14" style={{ background: "#8b0000" }} />
          </div>
          <h2 className="mb-3 text-3xl font-bold tracking-widest text-stone-100 md:text-4xl">館の系譜</h2>
          <p className="mb-14 text-sm tracking-wider" style={{ color: "rgba(255,220,190,0.55)" }}>1987年から続く、館と謎の年代記</p>
          <div className="flex flex-wrap items-start justify-center gap-6 md:gap-0">
            {BOOKS.map((book, i) => (
              <div key={book.id} className="flex items-start">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ background: "#8b0000" }} />
                  <div className="h-6 w-px" style={{ background: "rgba(139,0,0,0.3)" }} />
                  <p className="text-[10px] tracking-widest" style={{ color: "rgba(255,215,178,0.45)" }}>{book.year.replace("年", "")}</p>
                  <p className="mt-1 max-w-[64px] text-center text-[11px] leading-snug" style={{ color: "rgba(255,220,190,0.6)" }}>{book.title.replace("の殺人", "")}</p>
                </div>
                {i < BOOKS.length - 1 && <div className="mt-1.5 hidden h-px w-10 md:block lg:w-14" style={{ background: "rgba(139,0,0,0.2)" }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t px-6 py-10 text-center" style={{ borderColor: "rgba(28,28,28,0.8)" }}>
        <p className="mb-1 text-xs tracking-widest" style={{ color: "rgba(255,210,175,0.28)" }}>© 2024 館シリーズ ファンサイト — 非公式ファンページ</p>
        <p className="text-xs tracking-widest" style={{ color: "rgba(255,205,168,0.18)" }}>Rui Takano | Computer Science Student</p>
      </footer>
    </div>
  );
}
