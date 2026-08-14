import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, ExternalLink, FlaskConical, ArrowRight, Leaf, Droplets, Recycle, TrendingDown, ChevronDown } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    ScatterChart, Scatter, ZAxis,
} from "recharts";

type Page = "inicio" | "divulgacao" | "oficina" | "sobre";

const bioplasticoAssets = import.meta.glob(
    "./assets/img/bioplastico/**/*.{png,jpg,jpeg,svg}",
    { eager: true, as: "url" }
) as Record<string, string>;

const getBioplasticoImage = (relativePath: string) => {
    const key = `./assets/img/bioplastico/${relativePath}`;
    const url = bioplasticoAssets[key];
    if (!url) {
        throw new Error(`Imagem bioplástico não encontrada: ${relativePath}`);
    }
    return url;
};

const NAV_ITEMS: { id: Page; label: string }[] = [
    { id: "inicio", label: "Início" },
    { id: "divulgacao", label: "Divulgação" },
    { id: "oficina", label: "Oficina" },
    { id: "sobre", label: "Sobre" },
];

/* ──────────────────────────────────────────────
   NAVBAR
────────────────────────────────────────────── */
function Navbar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navigate = (p: Page) => {
        setPage(p);
        setOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Header transparente sobre o banner escuro da home: inverte o texto para branco.
    // Nas demais páginas o topo é claro (bg-background), então mantém o texto escuro.
    const sobreBanner = page === "inicio" && !scrolled;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"
                }`}
        >
            <nav className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
                <button onClick={() => navigate("inicio")} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Leaf className="w-4 h-4 text-white" />
                    </div>
                    <span
                        className={`font-bold text-lg tracking-tight transition-colors duration-300 ${sobreBanner ? "text-white" : "text-foreground"}`}
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        BioPlástico<span className={sobreBanner ? "text-green-300" : "text-primary"}>BR</span>
                    </span>
                </button>

                <ul className="hidden md:flex items-center gap-1">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => navigate(item.id)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${page === item.id
                                    ? sobreBanner
                                        ? "bg-primary text-white ring-1 ring-white/50"
                                        : "bg-primary text-white"
                                    : sobreBanner
                                        ? "text-white hover:bg-white/15"
                                        : "text-foreground hover:bg-secondary hover:text-primary"
                                    }`}
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>

                <button
                    className={`md:hidden p-2 rounded-md transition-colors ${sobreBanner ? "text-white hover:bg-white/15" : "text-foreground hover:bg-secondary"}`}
                    onClick={() => setOpen(!open)}
                    aria-label="Menu"
                >
                    {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </nav>

            {open && (
                <div className="md:hidden bg-white border-t border-border shadow-lg">
                    <ul className="py-2">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => navigate(item.id)}
                                    className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${page === item.id ? "text-primary bg-secondary" : "text-foreground hover:bg-secondary"
                                        }`}
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
}

/* ──────────────────────────────────────────────
   CHARTS — INÍCIO
────────────────────────────────────────────── */
const barData = [
    { material: "PET", anos: 450 },
    { material: "Nylon", anos: 400 },
    { material: "Sacolas PE", anos: 200 },
    { material: "PLA compost.", anos: 0.2 },
    { material: "PHA", anos: 0.3 },
    { material: "Amido", anos: 0.12 },
];

const pieData = [
    { name: "Reciclado (Global)", value: 19, color: "#1a6b45" },
    { name: "Aterros, Lixões e Descarte Inadequado (Global)", value: 81, color: "#1b5a7a" }
];

const pieDataBr = [
    { name: "Reciclado (Brasil)", value: 21, color: "#4a9b6f" },
    { name: "Aterros, Lixões e Descarte Inadequado (Brasil)", value: 79, color: "#2d8a8a" },
];
const scatterData = [
    { x: 2000, y: 213, label: "2000" },
    { x: 2005, y: 245, label: "2005" },
    { x: 2010, y: 270, label: "2010" },
    { x: 2015, y: 322, label: "2015" },
    { x: 2018, y: 359, label: "2018" },
    { x: 2020, y: 367, label: "2020" },
    { x: 2022, y: 380, label: "2022" },
    { x: 2024, y: 400, label: "2024*" },
];

const GREEN = "#1a6b45";
const BLUE = "#1b5a7a";

function CustomTooltipBar({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-border rounded-lg px-4 py-2 shadow-md text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <p className="font-medium text-foreground">{payload[0].payload.material}</p>
            <p className="text-primary">{payload[0].value < 1 ? `${(payload[0].value * 12).toFixed(0)} meses` : `${payload[0].value} anos`}</p>
        </div>
    );
}
function CustomTooltipScatter({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-border rounded-lg px-4 py-2 shadow-md text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <p className="font-medium text-foreground">{payload[0]?.payload?.label}</p>
            <p className="text-primary">{payload[0]?.payload?.y} Mt produzidos</p>
        </div>
    );
}

function Graficos() {
    return (
        <section className="py-24 bg-[#0d2018]">
            <div className="max-w-6xl mx-auto px-5">
                <div className="mb-14 text-center">
                    <span
                        className="text-xs tracking-widest uppercase text-green-400/70 font-medium"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                        Dados & Evidências
                    </span>
                    <h2
                        className="mt-3 text-4xl font-bold text-white"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        A crise plástica em números
                    </h2>
                    <p
                        className="mt-3 text-green-200/60 max-w-xl mx-auto"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                    >
                        Panoramas globais e nacionais sobre a geração de resíduos plásticos, taxas de reciclagem e o potencial de decomposição dos bioplásticos à base de amido
                    </p>
                </div>

                {/* Row 1: scatter + bar */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Scatter */}
                    <div className="bg-[#132a1f] rounded-2xl p-6 border border-green-900/40">
                        <p
                            className="text-xs tracking-widest uppercase text-green-400/70 mb-1"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                            Dispersão temporal
                        </p>
                        <h3
                            className="text-lg font-semibold text-white mb-6"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            Produção global de plástico (Mt/ano)
                        </h3>
                        <ResponsiveContainer width="100%" height={240}>
                            <ScatterChart margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1d3d2b" />
                                <XAxis
                                    dataKey="x"
                                    name="Ano"
                                    type="number"
                                    domain={[1998, 2026]}
                                    tickCount={5}
                                    tick={{ fill: "#6aaa84", fontSize: 11, fontFamily: "'DM Mono', monospace" }}
                                    axisLine={{ stroke: "#1d3d2b" }}
                                    tickLine={false}
                                />
                                <YAxis
                                    dataKey="y"
                                    name="Mt"
                                    tick={{ fill: "#6aaa84", fontSize: 11, fontFamily: "'DM Mono', monospace" }}
                                    axisLine={{ stroke: "#1d3d2b" }}
                                    tickLine={false}
                                />
                                <ZAxis range={[60, 60]} />
                                <Tooltip content={<CustomTooltipScatter />} cursor={{ stroke: "#1a6b45", strokeWidth: 1 }} />
                                <Scatter data={scatterData} fill={GREEN} opacity={0.85} />
                            </ScatterChart>
                        </ResponsiveContainer>
                        <p
                            className="text-xs text-green-500/50 mt-2"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                            * Projeção de triplicação até 2060 — Fonte: PNUMA (2023)
                        </p>
                    </div>

                    {/* Bar */}
                    <div className="bg-[#132a1f] rounded-2xl p-6 border border-green-900/40">
                        <p
                            className="text-xs tracking-widest uppercase text-green-400/70 mb-1"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                            Comparativo
                        </p>
                        <h3
                            className="text-lg font-semibold text-white mb-6"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            Tempo de degradação por material
                        </h3>
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1d3d2b" vertical={false} />
                                <XAxis
                                    dataKey="material"
                                    tick={{ fill: "#6aaa84", fontSize: 10, fontFamily: "'DM Mono', monospace" }}
                                    axisLine={{ stroke: "#1d3d2b" }}
                                    tickLine={false}
                                    angle={-25}
                                    textAnchor="end"
                                    interval={0}
                                />
                                <YAxis
                                    tick={{ fill: "#6aaa84", fontSize: 11, fontFamily: "'DM Mono', monospace" }}
                                    axisLine={{ stroke: "#1d3d2b" }}
                                    tickLine={false}
                                    label={{ value: "anos", angle: -90, position: "insideLeft", fill: "#6aaa84", fontSize: 10, fontFamily: "'DM Mono', monospace", dy: 20 }}
                                />
                                <Tooltip content={<CustomTooltipBar />} cursor={{ fill: "rgba(26,107,69,0.1)" }} />
                                <Bar dataKey="anos" radius={[4, 4, 0, 0]}>
                                    {barData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={index < 3 ? BLUE : GREEN}
                                            opacity={0.85}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="flex gap-4 mt-2">
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm" style={{ background: BLUE }} />
                                <span className="text-xs text-green-500/60" style={{ fontFamily: "'DM Mono', monospace" }}>Plásticos Convencionais (PET, Nylon, PE): Séculos / Anos no meio ambiente.</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm" style={{ background: GREEN }} />
                                <span className="text-xs text-green-500/60" style={{ fontFamily: "'DM Mono', monospace" }}>Plásticos de Amido (Foco do projeto): Degradação acelerada por ação demicrorganismos sob condições adequadas.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2: pie */}
                <div className="bg-[#132a1f] rounded-2xl p-6 border border-green-900/40 md:max-w-lg mx-auto">
                    <p
                        className="text-xs tracking-widest uppercase text-green-400/70 mb-1"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                        Distribuição
                    </p>
                    <h3
                        className="text-lg font-semibold text-white mb-6"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        Destinação dos Resíduos Plásticos (Brasil e Mundo)
                    </h3>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} opacity={0.9} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => [`${value}%`, ""]}
                                    contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}
                                />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value) => (
                                        <span style={{ color: "#6aaa84", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={pieDataBr}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} opacity={0.9} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => [`${value}%`, ""]}
                                    contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}
                                />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value) => (
                                        <span style={{ color: "#6aaa84", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer></div>
                    <p
                        className="text-xs text-green-500/50 mt-1 text-center"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                        Fonte: ABIPLAST (2025) e PNUMA (2023)
                    </p>
                </div>
            </div>
        </section>
    );
}

/* ──────────────────────────────────────────────
   INÍCIO
────────────────────────────────────────────── */
function PaginaInicio({ setPage }: { setPage: (p: Page) => void }) {
    const stats = [
        { value: "430M", label: "toneladas de plástico produzidas por ano no mundo (PNUMA).", icon: <TrendingDown className="w-6 h-6" /> },
        { value: " 4,82M", label: "toneladas de resíduos plásticos geradas por ano no Brasil (ABIPLAST)", icon: <Droplets className="w-6 h-6" /> },
        { value: "450+", label: "anos para degradação do plástico convencional", icon: <Recycle className="w-6 h-6" /> },
        { value: "9%", label: "do plástico global produzido é efetivamente reciclado (PNUMA)", icon: <Leaf className="w-6 h-6" /> },
    ];

    return (
        <main>
            {/* Banner de inicio */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&h=900&fit=crop&auto=format)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d2018]/85 via-[#1a6b45]/60 to-[#1b5a7a]/70" />

                <div className="relative z-10 max-w-6xl mx-auto px-5 pt-24 pb-20 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span
                            className="inline-block mb-4 px-3 py-1 text-xs font-medium tracking-widest uppercase bg-primary/30 text-green-200 rounded-full border border-green-400/30"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                            Ciência & Sustentabilidade
                        </span>
                        <h1
                            className="text-5xl md:text-6xl font-bold leading-tight text-white mb-6"
                            style={{ fontFamily: "'Fraunces', serif", fontWeight: 700 }}
                        >
                            O futuro dos{" "}
                            <em className="not-italic text-green-300">bioplásticos</em>{" "}
                            começa aqui
                        </h1>
                        <p
                            className="text-lg text-green-100/90 leading-relaxed mb-8 max-w-lg"
                            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                        >
                            Enquanto o mundo produz cerca de 430 milhões de toneladas de plástico por ano — com
                            apenas 9% sendo reciclado —, a ciência busca caminhos sustentáveis. Investigamos a
                            viabilidade dos bioplásticos à base de amido para substituir as embalagens de petróleo e
                            proteger o planeta.

                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => { setPage("oficina"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                                className="px-6 py-3 bg-primary text-white rounded-md font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                Conheça a Oficina <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => { setPage("divulgacao"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                                className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-md font-medium hover:bg-white/20 transition-colors"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                Acesse a Divulgação
                            </button>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <blockquote className="border-l-4 border-green-400 pl-6">
                            <p
                                className="text-2xl text-white/90 italic leading-relaxed"
                                style={{ fontFamily: "'Fraunces', serif", fontWeight: 300 }}
                            >
                                "A substituição de plásticos sintéticos por biopolímeros biodegradáveis à base de amido é
                                uma alternativa promissora para reduzir a dependência do petróleo e mitigar os resíduos no
                                meio ambiente."
                            </p>
                            <footer
                                className="mt-4 text-green-300/80 text-sm"
                                style={{ fontFamily: "'DM Mono', monospace" }}
                            >
                                —  Projeto Dirigido (UFABC), 2026
                            </footer>
                        </blockquote>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <ChevronDown className="w-6 h-6 text-white/50" />
                </div>
            </section>

            {/* Estatísticas */}
            <section className="bg-[#0d2018] py-16">
                <div className="max-w-6xl mx-auto px-5">
                    <p
                        className="text-center text-green-400/70 text-xs tracking-widest uppercase mb-10"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                        A dimensão do problema
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-green-900/30">
                        {stats.map((s, i) => (
                            <div key={i} className="bg-[#0d2018] p-8 text-center">
                                <div className="flex justify-center mb-3 text-green-400">{s.icon}</div>
                                <div
                                    className="text-4xl font-bold text-white mb-2"
                                    style={{ fontFamily: "'Fraunces', serif" }}
                                >
                                    {s.value}
                                </div>
                                <div
                                    className="text-sm text-green-300/70 leading-snug"
                                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                                >
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contextualização */}
            <section className="py-24 bg-background">
                <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-16 items-start">
                    <div>
                        <span
                            className="text-xs tracking-widest uppercase text-primary font-medium"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                            Contexto
                        </span>
                        <h2
                            className="mt-3 text-4xl font-bold text-foreground leading-tight"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            Por que os bioplásticos importam agora?
                        </h2>
                        <p
                            className="mt-5 text-muted-foreground leading-relaxed"
                            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                        >
                            O plástico convencional, derivado do petróleo, exige séculos para se decompor e
                            gera toneladas de resíduos descartados de forma inadequada. Com apenas 21% do
                            plástico reciclado no Brasil, a dependência desse material impacta severamente os
                            ecossistemas terrestres e aquáticos.

                        </p>
                        <p
                            className="mt-4 text-muted-foreground leading-relaxed"
                            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                        >
                            Como alternativa, os bioplásticos surgem como uma solução sustentável.
                            Produzidos a partir de fontes renováveis como a biomassa do amido, eles oferecem
                            biodegradabilidade e potencial para substituir embalagens de uso único, reduzindo a
                            pegada ambiental.

                        </p>

                        <button
                            onClick={() => { setPage("divulgacao"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            className="mt-8 inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all text-sm"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Explorar artigos científicos <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                title: "Bioplásticos de amido",
                                desc: "Produzidos a partir de fontes renováveis (como milho ou mandioca), apresentam boa capacidade de formação de filmes, biodegradabilidade e baixo custo, sendo ideais para embalagens sustentáveis.",
                                color: "border-l-primary",
                            },
                            {
                                title: "Fontes Alternativas (Algas e Leite) ",
                                desc: "Além do amido, materiais obtidos de algas ou proteínas do leite (caseína) vêm sendo pesquisados como soluções biodegradáveis compropriedades térmicas e mecânicas específicas.",
                                color: "border-l-accent",
                            },
                            {
                                title: "Bio Baseados vs. Biodegradáveis",
                                desc: "Materiais bio baseados vêm de fontes renováveis, enquanto os biodegradáveis são decompostos por microrganismos em água, CO2 e biomassa sob condições adequadas.",
                                color: "border-l-green-500",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className={`border-l-4 ${item.color} pl-5 py-3 bg-white rounded-r-md shadow-sm`}
                            >
                                <h3
                                    className="font-semibold text-foreground mb-1"
                                    style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                                >
                                    {item.title}
                                </h3>
                                <p
                                    className="text-sm text-muted-foreground"
                                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                                >
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gráficos */}
            <Graficos />

            {/* Tese */}
            <section className="py-24 bg-background">
                <div className="max-w-6xl mx-auto px-5">

                    {/* Título */}
                    <div className="mb-12">
                        <span
                            className="text-xs tracking-widest uppercase text-primary font-medium"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                            Pesquisa
                        </span>

                        <h2
                            className="mt-3 max-w-5xl text-4xl md:text-5xl font-bold text-foreground leading-tight"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            Viabilidade de plásticos biodegradáveis à base de amido como alternativa
                            às embalagens alimentícias de plástico derivado do petróleo.
                        </h2>
                    </div>

                    {/* Conteúdo */}
                    <div className="grid md:grid-cols-2 gap-16 items-start">

                        <div>

                            <h4
                                style={{ fontFamily: "'Fraunces', serif" }}>Fim dos Microplásticos</h4>

                            <br />
                            <p
                                className="text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                            >
                                Os compostos de maior destaque na manufatura de embalagens sustentáveis
                                incluem o Ácido Polilático (PLA) e os Polihidroxialcanoatos (PHAs).
                                Diferente de polímeros derivados de combustíveis fósseis, como o PET e o
                                Polietileno (PE), os quais levam cerca de 400 anos para se fragmentar e
                                resultam em acúmulo de microplásticos, os bioplásticos modernos oferecem
                                soluções de degradação otimizada.
                            </p>

                            <p
                                className="mt-4 text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                            >
                                Pesquisas recentes conduzidas pelo Instituto de Macromoléculas (IMA) da
                                UFRJ (Tavares et al., 2025) desenvolveram matrizes bioplásticas ativas a
                                partir de resíduos alimentares que se decompõem em apenas 180 dias. A
                                pesquisa evidenciou que esses materiais perdem até 90% de sua massa
                                dentro desse semestre. O diferencial químico reside no fato de que,
                                mesmo sob condições de descarte inadequadas no solo ou na água, essas
                                embalagens são consumidas rapidamente por microrganismos, zerando a
                                persistência de resíduos tóxicos no ambiente.
                            </p>
                            <br />
                            <h4
                                style={{ fontFamily: "'Fraunces', serif" }}>Avaliação do Ciclo de Vida (LCA)</h4>


                            <p
                                className="mt-4 text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                            >
                                Para garantir que a solução não apenas transfira o impacto ambiental
                                para outra etapa produtiva, a engenharia utiliza a Avaliação do Ciclo de
                                Vida (LCA - Life Cycle Assessment), métrica que contabiliza os impactos
                                da extração da matéria-prima até o fim da vida útil da embalagem.
                            </p>

                            <p
                                className="mt-4 text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                            >
                                O estudo recente publicado na revista científica Polymers (Senila et al.,
                                2024, "Life Cycle Assessment of Bioplastics Production from Lignocellulosic
                                Waste") consolida a superioridade dos bioplásticos PLA e PHB. A análise
                                revelou que a síntese industrial de bioplásticos demanda volumes muito
                                menores de energia de origem fóssil, com potencial de consumir até 65%
                                menos energia em comparação aos plásticos tradicionais.
                            </p>
                            <p
                                className="text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                            >
                                A emissão de Gases de Efeito Estufa (GEE) também é significativamente
                                reduzida em comparação aos plásticos convencionais. Dependendo do
                                polímero e da fonte renovável, como amido de milho, cana-de-açúcar ou
                                resíduos orgânicos, a transição para os bioplásticos pode baixar as
                                emissões de gases de efeito estufa entre 50% e 80%.
                            </p>

                            <p
                                className="mt-4 text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                            >
                                O PET, muito utilizado na produção de garrafas, emite cerca de 3 kg de
                                CO₂ por quilo fabricado. O Polietileno (PE), usado em embalagens, emite
                                de 2 a 2,5 kg de CO₂/kg, enquanto o PVC pode registrar até 3,5 kg de
                                CO₂/kg devido ao processo baseado em cloro, que demanda altíssima
                                quantidade de energia. Por outro lado, o PLA (derivado do milho)
                                apresenta emissões significativamente menores, entre 0,8 e 1,3 kg de
                                CO₂/kg. Polímeros como o PHA (de base microbiana) podem ir ainda mais
                                baixo, gerando em torno de 0,6 kg de CO₂/kg, e alternativas à base de
                                fibras de rápido crescimento, como o cânhamo, apontam emissões entre
                                0,4 e 0,7 kg de CO₂/kg.
                            </p>
                        </div>

                        <div>


                            <p
                                className="mt-4 text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                            >
                                A transição para filmes de embalagem de base biológica pode reduzir o
                                impacto negativo sobre a saúde dos ecossistemas em quase 70%, além de
                                mitigar o esgotamento de recursos naturais finitos em até 85%, segundo
                                o estudo.
                            </p>
                            <br />
                            <h4
                                style={{ fontFamily: "'Fraunces', serif" }}>Viabilidade Comercial e Escalabilidade</h4>
                            <p
                                className="mt-4 text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                            >
                                A barreira final para a substituição de uma tecnologia é sua adesão ao
                                mercado e escalabilidade de produção. A indústria de polímeros de fontes
                                renováveis já superou gargalos operacionais críticos e hoje atrai
                                aportes globais massivos. De acordo com o relatório da consultoria
                                Grand View Research (2024), apenas o mercado europeu de bioplásticos foi
                                avaliado em US$ 5,82 bilhões no ano de 2023, com uma projeção de
                                crescimento acelerado (CAGR) de 18,3% ao ano até 2030.
                            </p>

                            <p
                                className="mt-4 text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                            >
                                O nicho de embalagens alimentícias e farmacêuticas é o principal motor
                                desse avanço, respondendo por mais de 62% da receita de todo o setor.
                                Globalmente, a associação European Bioplastics (2024) estima que a
                                produção total atingiu 2,47 milhões de toneladas métricas em 2024.
                                Operando atualmente a 60% de sua capacidade máxima, a indústria projeta
                                um aumento substancial na infraestrutura para entregar mais de 6,3
                                milhões de toneladas até 2027.
                            </p>

                            <p
                                className="mt-4 text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                            >
                                Apesar dos expressivos avanços tecnológicos, é necessário reconhecer que
                                o maior impasse para a adoção em larga escala dos bioplásticos reside no
                                domínio estrutural da própria indústria petrolífera. Como os plásticos
                                convencionais são, em grande parte, subprodutos do refino de combustíveis
                                fósseis, obtidos a partir do petróleo e do gás natural, o setor
                                petroquímico mantém um monopólio histórico sobre as cadeias de
                                suprimentos e as infraestruturas fabris globais.
                            </p>

                            <p
                                className="mt-4 text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                            >
                                Pesquisadores como Fredric Bauer e Tobias Dan Nielsen, especialistas em
                                políticas ambientais e transição industrial da Universidade de Lund,
                                identificaram e comprovaram esse fenômeno, classificando-o como um severo
                                "carbon lock-in" (aprisionamento de carbono). Segundo os autores, as
                                indústrias fósseis utilizam seu domínio econômico e suas gigantescas
                                instalações já amortizadas para inundar o mercado com matéria-prima
                                extremamente barata. Consequentemente, essa dependência institucionalizada
                                cria barreiras comerciais colossais para os bioplásticos, provando que a
                                transição para embalagens verdadeiramente sustentáveis não é apenas um
                                desafio da ciência dos materiais, mas uma disputa mercadológica direta
                                contra um modelo de negócio fóssil que se recusa a ceder espaço.
                            </p>
                        </div>

                    </div>
                </div>
            </section>



            {/* CTA */}
            <section
                className="py-20 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1a6b45 0%, #1b5a7a 100%)" }}
            >
                <div className="max-w-3xl mx-auto px-5 text-center">
                    <h2
                        className="text-4xl font-bold text-white mb-4"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        Veja a ciência em ação
                    </h2>
                    <p
                        className="text-white/80 mb-8 leading-relaxed"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                    >
                        Acompanhe os experimentos realizados com bioplásticos à base de amido de milho,
                        da metodologia aos resultados obtidos.
                    </p>
                    <button
                        onClick={() => { setPage("oficina"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="px-8 py-4 bg-white text-primary font-semibold rounded-md hover:bg-green-50 transition-colors inline-flex items-center gap-2"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Acessar a oficina <FlaskConical className="w-4 h-4" />
                    </button>
                </div>
            </section>
        </main>
    );
}

/* ──────────────────────────────────────────────
   DIVULGAÇÃO
────────────────────────────────────────────── */
const artigos = [
    {
        categoria: "Pesquisa Aplicada",
        titulo: "Características físicas de filmes biodegradáveis de amido modificados de mandioca",
        resumo:
            "Avalia o potencial físico e mecânico de filmes de mandioca, comprovando sua viabilidade para embalagens biodegradáveis.",
        fonte: "Ciência e Tecnologia de Alimentos, 2008 (Henrique, Cereda & Sarmento)",
        link: "https://www.scielo.br/j/cta/a/RTrq7rtshCHT3hpH4hF83WF/abstract/?lang=pt",
        leitura: "8 min",
        tags: ["mandioca", "filmes biodegradáveis", "embalagens"],
    },
    {
        categoria: "Síntese Acessível",
        titulo: "Polímeros biodegradáveis: uma solução parcial para resíduos plásticos",
        resumo:
            "Explica a degradação de polímeros por microrganismos sob condições específicas de umidade e temperatura.",
        fonte: "Química Nova, 2006 (Franchetti & Marconato)",
        link: "https://repositorio.unesp.br/entities/publication/72c8bfca-d1ee-4078-a28a-f3d8f02257ec",
        leitura: "7 min",
        tags: ["polímeros", "biodegradáveis", "microrganismos"],
    },
    {
        categoria: "Pesquisa Aplicada",
        titulo: "Plástico biodegradável: formulação e caracterização caseira",
        resumo:
            "Experimentos com misturas de amido de milho, água, vinagre e glicerina para produção acessível de bioplásticos.",
        fonte: "Revista InterAgro, 2026 (Monteiro et al.)",
        link: "https://publicacoescgesg.cps.sp.gov.br/interagro/article/view/900",
        leitura: "6 min",
        tags: ["amido", "bioplástico", "glicerina"],
    },
    {
        categoria: "Opinião & Perspectiva",
        titulo: "Relatório PNUMA: Fechando a torneira da poluição plástica",
        resumo:
            "Dados globais apontando que o mundo produz 430M de toneladas de plástico por ano e apenas 9% é reciclado.",
        fonte: "Programa das Nações Unidas para o Meio Ambiente, 2023",
        link: "https://www.unep.org/pt-br/resources/turning-off-tap-end-plastic-pollution-create-circular-economy",
        leitura: "10 min",
        tags: ["plástico", "reciclagem", "poluição"],
    },
    {
        categoria: "Pesquisa Aplicada",
        titulo: "Panorama da reciclagem de plásticos no Brasil",
        resumo:
            "Mapeamento do setor de plásticos no Brasil: 4,82M de toneladas de resíduos e o índice de reciclagem de 21%.",
        fonte: "ABIPLAST, 2025",
        link: "https://www.abiplast.org.br/noticias/reciclagem-de-plasticos-no-brasil-recupera-se-em-2024-e-indice-para-embalagens-atinge-244/",
        leitura: "8 min",
        tags: ["reciclagem", "Brasil", "plásticos"],
    },
    {
        categoria: "Opinião & Perspectiva",
        titulo: "Poluição plástica nos oceanos e o cenário brasileiro",
        resumo:
            "Alerta sobre o descarte de 325 mil toneladas de plásticos por ano nos mares brasileiros e impactos marinhos.",
        fonte: "Oceana Brasil, 2020",
        link: "https://brasil.oceana.org/comunicados/oceana-apresenta-relatorio-sobre-polucao-por-plastico-marinha-do/",
        leitura: "7 min",
        tags: ["oceanos", "poluição", "Brasil"],
    },
    {
        categoria: "Revisão Científica",
        titulo: "Módulos elásticos: visão geral e métodos de caracterização",
        resumo:
            "Metodologias para ensaios mecânicos, cálculo do módulo de elasticidade e limite de deformação do material.",
        fonte: "Informativo Técnico ATCP, 2010 (Cossolino & Pereira)",
        link: "https://sonelastic.com/images/RT03-ATCP.pdf",
        leitura: "9 min",
        tags: ["módulo elástico", "ensaios mecânicos", "materiais"],
    },
    {
        categoria: "Revisão Científica",
        titulo: "Solos: tipos, funções e interação com degradação",
        resumo:
            "Estudo comparativo das características e atividade biológica de solos argilosos, comuns e arenosos.",
        fonte: "Embrapa / UFLA, 2013 (Coelho et al.)",
        link: "https://www.bdpa.cnptia.embrapa.br/consulta/busca?b=pc&id=974201&biblioteca=vazio&busca=974201&qFacets=974201&sort=&paginacao=t&paginaAtual=1",
        leitura: "10 min",
        tags: ["solos", "degradação", "atividade biológica"],
    },
    {
        categoria: "Síntese Acessível",
        titulo: "Divulgação científica em repositórios digitais brasileiros",
        resumo:
            "Análise sobre a falta de acesso do público geral a pesquisas acadêmicas e a importância de sites abertos.",
        fonte: "RDBCI, 2025 (Marzano & Paula)",
        link: "https://www.scielo.br/j/rdbci/a/zVXfZqC8CCr3GtD65HgZPDm/?format=html&lang=pt",
        leitura: "6 min",
        tags: ["divulgação científica", "acesso aberto", "pesquisa"],
    },
];


const CATEGORIAS = ["Todos", "Revisão Científica", "Pesquisa Aplicada", "Síntese Acessível", "Opinião & Perspectiva"];

function PaginaDivulgacao() {
    const [filtro, setFiltro] = useState("Todos");
    const filtrados = filtro === "Todos" ? artigos : artigos.filter((a) => a.categoria === filtro);

    return (
        <main className="pt-24 pb-20 min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-5">
                <div className="mb-12 max-w-2xl">
                    <span
                        className="text-xs tracking-widest uppercase text-primary font-medium"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                        Divulgação Científica
                    </span>
                    <h1
                        className="mt-3 text-5xl font-bold text-foreground leading-tight"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        Artigos & Sínteses
                    </h1>
                    <p
                        className="mt-4 text-muted-foreground leading-relaxed"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                    >
                        Artigos e relatórios técnicos com linguagem acessível que embasam o estudo daviabilidade de bioplásticos e a gestão de resíduos.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-10">
                    {CATEGORIAS.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFiltro(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filtro === cat
                                ? "bg-primary text-white"
                                : "bg-white text-muted-foreground border border-border hover:border-primary hover:text-primary"
                                }`}
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtrados.map((artigo, i) => (
                        <article
                            key={i}
                            className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                        >
                            <div className="px-6 pt-6 pb-5 flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <span
                                        className="text-xs font-medium text-accent"
                                        style={{ fontFamily: "'DM Mono', monospace" }}
                                    >
                                        {artigo.categoria}
                                    </span>
                                    <span
                                        className="text-xs text-muted-foreground"
                                        style={{ fontFamily: "'DM Mono', monospace" }}
                                    >
                                        {artigo.leitura}
                                    </span>
                                </div>
                                <h2
                                    className="text-lg font-semibold text-foreground leading-snug mb-3"
                                    style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                                >
                                    {artigo.titulo}
                                </h2>
                                <p
                                    className="text-sm text-muted-foreground leading-relaxed"
                                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                                >
                                    {artigo.resumo}
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-4">
                                    {artigo.tags.map((tag, j) => (
                                        <span
                                            key={j}
                                            className="px-2 py-0.5 bg-secondary text-primary text-xs rounded-full"
                                            style={{ fontFamily: "'DM Mono', monospace" }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                                <span
                                    className="text-xs text-muted-foreground"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                    {artigo.fonte}
                                </span>
                                <a
                                    href={artigo.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                    Acessar <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}

/* ──────────────────────────────────────────────
   BEFORE/AFTER SLIDER
────────────────────────────────────────────── */
function BeforeAfterSlider({ before, afterImg, beforeAlt, afterAlt }: {
    before: string; afterImg: string; beforeAlt: string; afterAlt: string;
}) {
    const [pos, setPos] = useState(50);
    const [dragging, setDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const updatePos = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const raw = ((clientX - rect.left) / rect.width) * 100;
        setPos(Math.min(98, Math.max(2, raw)));
    }, []);

    useEffect(() => {
        const onMove = (e: MouseEvent | TouchEvent) => {
            if (!dragging) return;
            const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
            updatePos(clientX);
        };
        const onUp = () => setDragging(false);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        window.addEventListener("touchmove", onMove);
        window.addEventListener("touchend", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("touchend", onUp);
        };
    }, [dragging, updatePos]);

    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden rounded-2xl select-none"
            style={{ aspectRatio: "16/9", cursor: dragging ? "ew-resize" : "col-resize" }}
        >
            {/* After (bottom layer, full width) */}
            <img
                src={afterImg}
                alt={afterAlt}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
            />
            {/* After label */}
            <div
                className="absolute bottom-3 right-3 px-2 py-1 rounded text-xs font-medium bg-accent/80 text-white backdrop-blur-sm"
                style={{ fontFamily: "'DM Mono', monospace" }}
            >
                Depois
            </div>

            {/* Before (top layer, clipped) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${pos}%` }}
            >
                <img
                    src={before}
                    alt={beforeAlt}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ width: `${100 / (pos / 100)}%`, maxWidth: "none" }}
                    draggable={false}
                />
                {/* Before label */}
                <div
                    className="absolute bottom-3 left-3 px-2 py-1 rounded text-xs font-medium bg-primary/80 text-white backdrop-blur-sm"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                >
                    Antes
                </div>
            </div>

            {/* Divider line */}
            <div
                className="absolute top-0 bottom-0 w-px bg-white/80"
                style={{ left: `${pos}%` }}
            />

            {/* Handle */}
            <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center cursor-ew-resize border-2 border-white/60"
                style={{ left: `${pos}%` }}
                onMouseDown={(e) => { e.preventDefault(); setDragging(true); }}
                onTouchStart={(e) => { e.preventDefault(); setDragging(true); }}
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7 10L4 7M7 10L4 13M7 10H13M13 10L16 7M13 10L16 13" stroke="#1a6b45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────
   OFICINA
────────────────────────────────────────────── */
const metodologiaImagens = [
    getBioplasticoImage("01.jpg"),
    getBioplasticoImage("02.jpg"),
    getBioplasticoImage("03.jpg"),
    getBioplasticoImage("1.jpg"),
    getBioplasticoImage("2.jpg"),
    getBioplasticoImage("3.jpg"),
    getBioplasticoImage("4.jpg"),
    getBioplasticoImage("5.jpg"),
    getBioplasticoImage("6.jpg"),
    getBioplasticoImage("7.jpg"),
];
const imgResultado = (nome: string) => getBioplasticoImage(`resultados/${nome}`);

const experimentos = [
    {
        id: "exp01",
        titulo: "Bioplástico de Amido de Milho com Glicerina",
        status: "Concluído",
        objetivo:
            "Produzir um filme biodegradável flexível a partir de amido de milho, água, vinagre e glicerina como plastificante natural.",
        materiais: [
            "10 g de amido de milho (fécula)",
            "5 mL de glicerina vegetal",
            "100 mL de água destilada",
            "5 mL de vinagre de álcool (ácido acético)",
            "Panela, fogão e forma de silicone",
        ],
        metodologia: [
            { texto: "Pesar 10g de amido de milho. (Lembrar de zerar a balança com o peso do recipiente)", img: metodologiaImagens[0] },
            { texto: "Adicionar 100ml de água.", img: metodologiaImagens[1] },
            { texto: "Colocar 5mL de glicerina no recipiente.", img: metodologiaImagens[2] },
            { texto: "Adicionar 5mL de vinagre branco.", img: metodologiaImagens[3] },
            { texto: "Por fim, junte o amido de milho pesado inicialmente na mistura.", img: metodologiaImagens[4] },
            { texto: "Misturar bem os ingredientes até obter uma massa homogênea.", img: metodologiaImagens[5] },
            { texto: "Levar a mistura ao fogo baixo e mexer continuamente até que ela se torne viscosa.", img: metodologiaImagens[6] },
            { texto: "Inicialmente a mistura terá um aspecto mais branco.", img: metodologiaImagens[7] },
            { texto: "Continue mexendo até ela se tornar levemente translúcida.", img: metodologiaImagens[8] },
            { texto: "Deixar secar em uma forma de teflon, silicone ou plático à temperatura ambiente por 3 a 4 dias.", img: metodologiaImagens[9] },
        ],
        resultados: [
            "Filme translúcido obtido após secagem.",
            "Resistência à tração moderada; material quebrável sob tensão sem plastificante adicional.",
            "O cenário com 10 mL de glicerina melhorou a flexibilidade do que os testes realizados com 5 mL.",
        ],
        comparacoes: [
            {
                titulo: "Grupo de controle × resultado final",
                antes: imgResultado("22.jpg"),
                depois: imgResultado("12.jpg"),
                antesThumb: imgResultado("21.jpg"),
                depoisThumb: imgResultado("11.jpg"),
            },
        ],
        imagem: getBioplasticoImage("milho1.png"),
    },
    {
        id: "exp02",
        titulo: "Teste de Força do Bioplástico de Amido",
        status: "Concluído",
        objetivo:
            "Avaliar a resistência mecânica do bioplástico e compará-la à de plásticos convencionais por meio de um ensaio de tração simplificado, adaptado do método quase-estático descrito por Cossolino e Pereira (2010).",
        materiais: [
            "Tira padronizada de bioplástico (2,8 cm × 1,2 cm × 0,1 cm)",
            "Barra horizontal para fixação da extremidade superior",
            "Fio de nylon",
            "Cesta pequena para aplicação de cargas",
            "Pesos conhecidos para incremento gradual da carga",
            "Régua e caneta para marcação do comprimento de referência",
        ],
        metodologia: [
            { texto: "Confeccionar uma tira padronizada a partir da amostra de bioplástico separada para o experimento.", img: "" },
            { texto: "Fixar a extremidade superior da tira a uma barra horizontal e conectar a extremidade inferior, por meio de um fio de nylon, a uma pequena cesta destinada à aplicação de cargas.", img: imgResultado("esquema-de-ensaio.jpg") },
            { texto: "Antes de iniciar o ensaio, fazer duas marcações sobre o corpo de prova, delimitando um comprimento inicial de referência.", img: "" },
            { texto: "Adicionar gradualmente pesos conhecidos à cesta e, a cada novo incremento de carga, medir novamente o comprimento entre as marcações para acompanhar a deformação.", img: "" },
            { texto: "Conduzir o procedimento até o material apresentar deformação permanente ou rompimento, observando o empescoçamento — redução localizada da largura que indica a proximidade da ruptura.", img: imgResultado("amostra-final-tracao.jpg") },
        ],
        resultados: [
            "A amostra de 2,8 cm × 1,2 cm × 0,1 cm suportou carga máxima de 350 g antes de romper — aproximadamente 3,43 N, o que equivale a uma pressão de cerca de 286 kPa sobre o material.",
            "Esse valor é comparável ao de um PVC flexível (plastificado), cuja carga máxima de suporte gira em torno de 0,1 MPa segundo a ADMET Testing Systems (2012): mesmo sendo biodegradável, o bioplástico tem resistência próxima à de plásticos convencionais mais maleáveis.",
            "O comprimento passou de 2,8 cm para 3,1 cm no momento da ruptura — deformação de aproximadamente 9,6%, indicando um material pouco elástico, que rompe relativamente cedo quando esticado.",
            "O baixo alongamento é coerente com a literatura: filmes à base de amido tendem a se alongar menos que filmes com plastificantes na composição (Mali, Grossmann e Yamashita, 2010).",
            "O bioplástico suporta cargas relevantes antes de romper, o que reforça seu potencial para aplicações que não exijam alta elasticidade, como embalagens rígidas ou de curta duração.",
        ],
        comparacoes: [
            {
                titulo: "Montagem do ensaio × amostra rompida",
                antes: imgResultado("amostra-inicial-tracao.jpg"),
                depois: imgResultado("amostra-final-tracao.jpg"),
                antesThumb: imgResultado("amostra-inicial-tracao.jpg"),
                depoisThumb: imgResultado("amostra-final-tracao.jpg"),
            },
        ],
        observacoes:
            "Referências para valores nominais de resistência do plástico PVC: ADMET Testing Systems. (2012). Micro Tensile Strength Test of Plastic per ASTM D638. YouTube. https://www.youtube.com/watch?v=58hw2QxxDro.",
        imagem: imgResultado("experimento-02.jpg"),
    },
    {
        id: "exp03",
        titulo: "Teste de Degradação do Bioplástico de Amido Soterrado",
        status: "Concluído",
        objetivo:
            "Avaliar a velocidade de biodegradação do bioplástico em diferentes tipos de solo, simulando condições ambientais representativas de locais onde ocorre o descarte inadequado de resíduos plásticos.",
        materiais: [
            "3 amostras idênticas de bioplástico de amido",
            "1 amostra de plástico convencional, para comparação",
            "Solo argiloso, rico em argila e com elevada retenção de água (simula margens de rios e lagos)",
            "Solo comum de jardim, quintal ou terreno urbano (simula descarte irregular em áreas residenciais)",
            "Solo arenoso levemente umedecido com água salgada (simula praias e regiões costeiras)",
            "Balança para registro da massa das amostras",
            "Câmera para registro fotográfico padronizado",
        ],
        metodologia: [
            { texto: "Antes da inserção no solo, registrar a massa inicial de todas as amostras e fotografá-las para documentar o estado original.", img: imgResultado("amostras-iniciais-terra.jpg") },
            { texto: "Ambiente 1 — enterrar uma amostra em solo argiloso, com elevada retenção de água, simulando margens de rios e lagos, locais frequentemente afetados por resíduos transportados pelas correntezas.", img: imgResultado("amostra-barroso.jpg") },
            { texto: "Ambiente 2 — enterrar uma amostra em solo comum, constituído por terra de jardins, quintais ou terrenos urbanos, o ambiente terrestre mais comum para o descarte irregular de plásticos.", img: imgResultado("amostra-quintal.jpg") },
            { texto: "Ambiente 3 — enterrar uma amostra em solo arenoso levemente umedecido com água salgada, simulando praias e regiões costeiras.", img: imgResultado("amostra-arenoso.jpg") },
            { texto: "Enterrar também uma amostra de plástico convencional em solo comum, como referência comparativa.", img: imgResultado("amostra-inicial-normal-terra.jpg") },
            { texto: "Retirar as amostras em intervalos regulares e registrar massa, aspecto visual, alteração de coloração, rachaduras ou fragmentação e o surgimento de fungos ou outros organismos visíveis. Após cada análise, devolver a amostra ao respectivo ambiente.", img: "" },
            { texto: "Ao término do experimento, calcular a perda percentual de massa de cada amostra para comparar quantitativamente a velocidade de biodegradação em cada ambiente.", img: "" },
        ],
        resultados: [
            "As amostras enterradas em solo argiloso e em solo comum apresentaram maior potencial biodegradativo, evidenciado pela redução de volume e pela presença de agentes decompositores como fungos e bactérias.",
            "A amostra em solo argiloso apresentou o maior grau de degradação entre as três, com estrutura fragilizada e aspecto gelatinoso.",
            "A amostra em solo comum demonstrou sinais de decomposição biológica, mas manteve-se seca e rígida, com aspecto próximo ao do estado inicial.",
            "A amostra em ambiente arenoso ficou gelatinosa e completamente fragmentada em pedaços menores, sem agentes decompositores visíveis — o que sugere degradação predominantemente físico-química (umidade e salinidade), e não biológica.",
            "A amostra de plástico convencional manteve-se intacta em todos os ambientes, sem alterações significativas de massa, cor ou estrutura, confirmando sua baixa degradabilidade no solo.",
        ],
        comparacoes: [
            {
                titulo: "Bioplástico em solo argiloso",
                antes: imgResultado("amostra-barroso.jpg"),
                depois: imgResultado("amostra-final-barroso.jpg"),
                antesThumb: imgResultado("amostra-barroso.jpg"),
                depoisThumb: imgResultado("amostra-final-barroso.jpg"),
            },
            {
                titulo: "Bioplástico em solo comum",
                antes: imgResultado("amostra-quintal.jpg"),
                depois: imgResultado("amostra-final-quintal.jpg"),
                antesThumb: imgResultado("amostra-quintal.jpg"),
                depoisThumb: imgResultado("amostra-final-quintal.jpg"),
            },
            {
                titulo: "Bioplástico em solo arenoso",
                antes: imgResultado("amostra-arenoso.jpg"),
                depois: imgResultado("amostra-final-arenoso.jpg"),
                antesThumb: imgResultado("amostra-arenoso.jpg"),
                depoisThumb: imgResultado("amostra-final-arenoso.jpg"),
            },
            {
                titulo: "Plástico convencional em solo comum",
                antes: imgResultado("amostra-inicial-normal-terra.jpg"),
                depois: imgResultado("amostra-final-normal-terra.jpg"),
                antesThumb: imgResultado("amostra-inicial-normal-terra.jpg"),
                depoisThumb: imgResultado("amostra-final-normal-terra.jpg"),
            },
        ],
        imagem: imgResultado("amostras-iniciais-terra.jpg"),
    },
    {
        id: "exp04",
        titulo: "Teste de Degradação do Bioplástico de Amido Imerso em Água",
        status: "Concluído",
        objetivo:
            "Avaliar qualitativamente a biodegradação do bioplástico em contato com a água, ambiente diretamente afetado pelo descarte de plásticos, comparando-o a um plástico convencional.",
        materiais: [
            "2 amostras de bioplástico de amido (uma imersa e uma de controle)",
            "2 amostras de plástico convencional de embalagens (uma imersa e uma de controle)",
            "Recipientes com água",
            "Câmera para registro fotográfico das avaliações",
        ],
        metodologia: [
            { texto: "Separar quatro amostras — duas de bioplástico de amido e duas de plástico convencional de embalagens — e registrar o estado inicial de cada uma.", img: imgResultado("amostra-inicial-agua-amido.jpg") },
            { texto: "Reservar uma amostra de cada tipo como grupo de controle, mantida em local protegido da água, da umidade, da luz solar e de demais fatores que possam comprometer sua integridade.", img: imgResultado("amostra-inicial-agua-normal.jpg") },
            { texto: "Submergir as demais amostras em recipientes com água.", img: imgResultado("amostra-amido--agua.jpg") },
            { texto: "Avaliar as amostras em intervalos de uma hora, um dia, uma semana e duas semanas, registrando fotos e descrições do aspecto e observando sinais de degradação, como fragmentação.", img: imgResultado("amostra-normal-agua.jpg") },
            { texto: "Ao final do período, comparar o estado de cada amostra imersa com o do respectivo grupo de controle.", img: "" },
        ],
        resultados: [
            "Observou-se degradação visível do bioplástico: ao final do período experimental, o material apresentava aspecto frágil e gelatinoso, com perda perceptível de volume e consistência.",
            "Ao se aplicar um ponto de pressão localizado, a amostra se desfez facilmente em fragmentos, confirmando a fragilidade estrutural resultante do processo de degradação.",
            "O plástico convencional (à base de petróleo) manteve sua consistência original durante todo o período analisado, sem sinais visíveis de alteração estrutural, o que confirma sua baixa degradabilidade em meio aquoso.",
        ],
        comparacoes: [
            {
                titulo: "Bioplástico de amido imerso em água",
                antes: imgResultado("amostra-inicial-agua-amido.jpg"),
                depois: imgResultado("amostra-final-agua-amido.jpg"),
                antesThumb: imgResultado("amostra-inicial-agua-amido.jpg"),
                depoisThumb: imgResultado("amostra-final-agua-amido.jpg"),
            },
            {
                titulo: "Plástico convencional imerso em água",
                antes: imgResultado("amostra-inicial-agua-normal.jpg"),
                depois: imgResultado("amostra-final-agua-normal.jpg"),
                antesThumb: imgResultado("amostra-inicial-agua-normal.jpg"),
                depoisThumb: imgResultado("amostra-final-agua-normal.jpg"),
            },
        ],
        imagem: imgResultado("amostra-final-agua-amido.jpg"),
    },
];

function PaginaOficina() {
    const [expAberto, setExpAberto] = useState<string | null>("exp01");
    const [aba, setAba] = useState<"materiais" | "metodologia" | "resultados">("materiais");

    const exp = experimentos.find((e) => e.id === expAberto);

    return (
        <main className="pt-24 pb-20 min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-5">
                <div className="mb-12 max-w-2xl">
                    <span
                        className="text-xs tracking-widest uppercase text-primary font-medium"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                        Laboratório Aberto
                    </span>
                    <h1
                        className="mt-3 text-5xl font-bold text-foreground leading-tight"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        Oficina de Bioplásticos
                    </h1>
                    <p
                        className="mt-4 text-muted-foreground leading-relaxed"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                    >
                        Experimentos realizados para produção e caracterização de bioplásticos.
                        Metodologia detalhada e resultados documentados abaixo.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-3">
                        {experimentos.map((e) => (
                            <button
                                key={e.id}
                                onClick={() => { setExpAberto(e.id); setAba("materiais"); }}
                                className={`w-full text-left p-5 rounded-xl border transition-all duration-200 ${expAberto === e.id
                                    ? "bg-primary text-white border-primary shadow-md"
                                    : "bg-white border-border hover:border-primary/40"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span
                                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${expAberto === e.id
                                            ? e.status === "Concluído" ? "bg-green-300/30 text-green-100" : "bg-yellow-300/30 text-yellow-100"
                                            : e.status === "Concluído" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                            }`}
                                        style={{ fontFamily: "'DM Mono', monospace" }}
                                    >
                                        {e.status}
                                    </span>
                                    <span
                                        className={`text-xs ${expAberto === e.id ? "text-green-200" : "text-muted-foreground"}`}
                                        style={{ fontFamily: "'DM Mono', monospace" }}
                                    >
                                        {e.id.toUpperCase()}
                                    </span>
                                </div>
                                <h3
                                    className="text-sm font-semibold leading-snug"
                                    style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                                >
                                    {e.titulo}
                                </h3>
                            </button>
                        ))}
                    </aside>

                    {/* Detalhe */}
                    {exp && (
                        <div className="lg:col-span-2 bg-white rounded-xl border border-border overflow-hidden">
                            <div className="relative h-52 bg-muted">
                                <img src={exp.imagem} alt={exp.titulo} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-4 left-6 right-6">
                                    <h2
                                        className="text-xl font-bold text-white"
                                        style={{ fontFamily: "'Fraunces', serif" }}
                                    >
                                        {exp.titulo}
                                    </h2>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-5 p-4 bg-secondary rounded-lg border border-border">
                                    <p
                                        className="text-sm text-foreground/80 leading-relaxed"
                                        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                                    >
                                        <strong className="text-foreground font-medium">Objetivo:</strong> {exp.objetivo}
                                    </p>
                                </div>

                                {/* Abas */}
                                <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1">
                                    {(["materiais", "metodologia", "resultados"] as const).map((a) => (
                                        <button
                                            key={a}
                                            onClick={() => setAba(a)}
                                            className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${aba === a ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                                }`}
                                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                                        >
                                            {a.charAt(0).toUpperCase() + a.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                {/* Materiais */}
                                {aba === "materiais" && (
                                    <ul className="space-y-2">
                                        {exp.materiais.map((m, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="mt-0.5 w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs text-primary font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>{i + 1}</span>
                                                </span>
                                                <span className="text-sm text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{m}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Metodologia com imagens orgânicas */}
                                {aba === "metodologia" && (
                                    <ol className="space-y-6">
                                        {exp.metodologia.map((passo, i) => (
                                            <li key={i} className="flex items-center gap-5">
                                                {/* Imagem orgânica */}
                                                {passo.img ? (
                                                    <div className="flex-shrink-0 relative">
                                                        <div
                                                            className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80 overflow-hidden" style={{
                                                                borderRadius: "62% 38% 46% 54% / 60% 44% 56% 40%",
                                                                boxShadow: "0 0 0 4px rgba(74,155,111,0.18), 0 0 16px 6px rgba(26,107,69,0.15)",
                                                            }}
                                                        >
                                                            <img
                                                                src={passo.img}
                                                                alt={`Passo ${i + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        {/* Número sobreposto */}
                                                        <div
                                                            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow"
                                                            style={{ fontFamily: "'DM Mono', monospace" }}
                                                        >
                                                            {i + 1}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center text-xs font-bold"
                                                        style={{ fontFamily: "'DM Mono', monospace" }}
                                                    >
                                                        {i + 1}
                                                    </div>
                                                )}
                                                {/* Texto */}
                                                <p
                                                    className="text-sm text-muted-foreground leading-relaxed flex-1"
                                                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                                                >
                                                    {passo.texto}
                                                </p>
                                            </li>
                                        ))}
                                    </ol>
                                )}

                                {/* Resultados com imagens e slider */}
                                {aba === "resultados" && (
                                    <div>
                                        {/* Tópicos */}
                                        <ul className="space-y-3 mb-8">
                                            {exp.resultados.map((r, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <span className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                                    <span
                                                        className="text-sm text-muted-foreground leading-relaxed"
                                                        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                                                    >
                                                        {r}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Imagens lado a lado */}
                                        <div className="mb-4">
                                            <p
                                                className="text-xs uppercase tracking-widest text-muted-foreground mb-3"
                                                style={{ fontFamily: "'DM Mono', monospace" }}
                                            >
                                                Comparação visual
                                            </p>
                                            {exp.comparacoes.map((c) => (
                                                <div key={c.titulo} className="mb-10 last:mb-0">
                                                    <p
                                                        className="text-sm font-medium text-foreground mb-3"
                                                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                                                    >
                                                        {c.titulo}
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                                        <div className="rounded-xl overflow-hidden border border-border">
                                                            <img src={c.antesThumb} alt={`${c.titulo} — antes`} className="w-full object-cover" style={{ height: 140 }} />
                                                        </div>
                                                        <div className="rounded-xl overflow-hidden border border-border">
                                                            <img src={c.depoisThumb} alt={`${c.titulo} — depois`} className="w-full object-cover" style={{ height: 140 }} />
                                                        </div>
                                                    </div>

                                                    {/* Slider sobreposição */}
                                                    <p
                                                        className="text-xs uppercase tracking-widest text-muted-foreground mb-3"
                                                        style={{ fontFamily: "'DM Mono', monospace" }}
                                                    >
                                                        Deslize para comparar
                                                    </p>
                                                    <BeforeAfterSlider
                                                        before={c.antes}
                                                        afterImg={c.depois}
                                                        beforeAlt={`${c.titulo} — antes`}
                                                        afterAlt={`${c.titulo} — depois`}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Observações */}
                                        {exp.observacoes && exp.observacoes.trim() && (
                                            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                                <p
                                                    className="text-xs font-medium text-amber-800 mb-1"
                                                    style={{ fontFamily: "'DM Mono', monospace" }}
                                                >
                                                    OBSERVAÇÕES
                                                </p>
                                                <p
                                                    className="text-sm text-amber-700 leading-relaxed"
                                                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                                                >
                                                    {exp.observacoes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

/* ──────────────────────────────────────────────
   SOBRE
────────────────────────────────────────────── */
function PaginaSobre() {
    const [formData, setFormData] = useState({ nome: "", email: "", mensagem: "", website: "" });
    const [enviado, setEnviado] = useState(false);
    const GOOGLE_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbzisMsruvyxCRmW_vY9v9g-wjSQoZdrQG9wxwaLMlp7Ioh74-iFjgqa1kIYzI48VTti/exec";
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setEnviando(true);

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Erro ao enviar mensagem.");
            }

            setEnviado(true);

            setFormData({
                nome: "",
                email: "",
                mensagem: "", website: "",
            });

            setTimeout(() => {
                setEnviado(false);
            }, 4000);

        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
            alert("Não foi possível enviar sua mensagem. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    };


    return (
        <main className="pt-24 pb-20 min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-5">
                <div className="mb-16 max-w-2xl">
                    <span
                        className="text-xs tracking-widest uppercase text-primary font-medium"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                        Sobre o Projeto
                    </span>
                    <h1
                        className="mt-3 text-5xl font-bold text-foreground leading-tight"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        Quem somos & Contato
                    </h1>
                </div>

                <div className="grid md:grid-cols-2 gap-16 mb-20">
                    <div>
                        <div className="flex justify-center align-center overflow-hidden my-8  h-60 ">
                            <img
                                src={getBioplasticoImage("ufabc.png")}
                                alt="Equipe de pesquisa"
                                className="w-60 h-60 "
                            />
                        </div>
                        <h2
                            className="text-2xl font-bold text-foreground mb-4"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            Sobre o BioPlásticoBR
                        </h2>
                        <div
                            className="space-y-4 text-muted-foreground leading-relaxed"
                            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                        >
                            <p> Este site é o resultado do projeto de divulgação científica desenvolvido por discentes do Bacharelado em Ciência e Tecnologia da Universidade Federal do ABC (UFABC), sob orientação da Profª. Dra. Mariselma Ferreira. </p>
                            <p> Nosso foco é investigar a viabilidade técnica, econômica e ambiental da substituição de embalagens plásticas derivadas do petróleo por bioplásticos biodegradáveis à base de amido. </p>
                            <p> Acreditamos que a produção acadêmica não deve se restringir aos repositórios universitários. Por isso, unimos rigor acadêmico e linguagem didática para disponibilizar ensaios de degradação, testes mecânicos e guias práticos em domínio público, incentivando o consumo consciente e a educação ambiental na comunidade. </p>
                            <p> O BioPlásticoBR é, portanto, um projeto de divulgação científica e pesquisa aplicada dedicado ao estudo e à popularização dos bioplásticos no Brasil. Nasceu da convicção de que a ciência deve ser acessível a todos. </p> <p> Nosso objetivo é documentar experimentos reais, reunir a literatura científica mais relevante e criar pontes entre o laboratório e a sociedade. </p>
                            <p> <span className="font-bold">Equipe de Pesquisa:</span> Beatriz Zaratine Pereira, Douglas Willian Massari da Silva, Ian Ferrete Azevedo, Joel Carlos Bahia Junior e Murilo Souza Almeida.</p>
                        </div>
                        <div className="mt-8 grid grid-cols-3 gap-4">
                            {[
                                { label: "Experimentos", valor: "3+" },
                                { label: "Artigos revisados", valor: "6" },
                                { label: "Meses de pesquisa", valor: "2" },
                            ].map((item, i) => (
                                <div key={i} className="text-center p-4 bg-white rounded-xl border border-border">
                                    <div className="text-2xl font-bold text-primary" style={{ fontFamily: "'Fraunces', serif" }}>{item.valor}</div>
                                    <div className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2
                            className="text-2xl font-bold text-foreground mb-6"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            Entre em contato
                        </h2>
                        {enviado ? (
                            <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                                <div className="text-4xl mb-3">🌱</div>
                                <p className="text-green-800 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Mensagem enviada! Retornaremos em breve.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {[
                                    { label: "Nome", key: "nome", type: "text", placeholder: "Seu nome completo" },
                                    { label: "E-mail", key: "email", type: "email", placeholder: "seu@email.com" },
                                ].map(({ label, key, type, placeholder }) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-foreground mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</label>
                                        <input
                                            type={type}
                                            required
                                            value={formData[key as keyof typeof formData]}
                                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                                            placeholder={placeholder}
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Mensagem</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.mensagem}
                                        onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                                        placeholder="Sua dúvida, sugestão ou colaboração..."
                                    />
                                    <input
                                        type="text"
                                        name="website"
                                        value={formData.website}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                website: e.target.value,
                                            })
                                        }
                                        tabIndex={-1}
                                        autoComplete="off"
                                        className="absolute left-[-9999px]"
                                        aria-hidden="true"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={enviando}
                                    className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                    {enviando ? (
                                        "Enviando..."
                                    ) : (
                                        <>
                                            Enviar mensagem <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                            </form>
                        )}
                    </div>
                </div>
            </div>

            <footer className="border-t border-border">
                <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Leaf className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-bold text-foreground" style={{ fontFamily: "'Fraunces', serif" }}>BioPlásticoBR</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Projeto de divulgação científica sobre bioplásticos
                    </p>
                    <span className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>2026</span>
                </div>
            </footer>
        </main>
    );
}

/* ──────────────────────────────────────────────
   ROOT
────────────────────────────────────────────── */
export default function App() {
    const [page, setPage] = useState<Page>("inicio");

    return (
        <div className="min-h-screen bg-background" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <Navbar page={page} setPage={setPage} />
            {page === "inicio" && <PaginaInicio setPage={setPage} />}
            {page === "divulgacao" && <PaginaDivulgacao />}
            {page === "oficina" && <PaginaOficina />}
            {page === "sobre" && <PaginaSobre />}
        </div>
    );
}
