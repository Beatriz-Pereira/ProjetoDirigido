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
                    <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                        BioPlástico<span className="text-primary">BR</span>
                    </span>
                </button>

                <ul className="hidden md:flex items-center gap-1">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => navigate(item.id)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${page === item.id
                                        ? "bg-primary text-white"
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
                    className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
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
                            Nossa Pesquisa
                        </span>

                        <h3
                            className="mt-3 max-w-5xl text-4xl md:text-5xl font-bold text-foreground leading-tight"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            Viabilidade de plásticos biodegradáveis à base de amido como alternativa
                            às embalagens alimentícias de plástico derivado do petróleo.
                        </h3>
                    </div>

                    {/* Conteúdo */}
                    <div className="grid md:grid-cols-2 gap-16 items-start">

                        <div>
                            <p
                                className="text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                            >
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tincidunt,
                                sapien vitae facilisis consequat, nunc justo malesuada lectus, vitae
                                sollicitudin erat neque non libero. Praesent commodo, nisl vel tincidunt
                                suscipit, augue sapien faucibus erat, eget tincidunt massa lorem vitae nibh.
                            </p>

                            <p
                                className="mt-4 text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                            >
                                Curabitur ullamcorper lacus nec magna consequat, at posuere erat aliquet.
                                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
                                cubilia curae; Donec interdum, magna quis feugiat volutpat, mauris arcu
                                malesuada justo, vel consequat neque felis vitae libero.
                            </p>
                        </div>

                        <div>
                            <p
                                className="text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                            >
                                Suspendisse potenti. Maecenas interdum turpis sed libero consectetur, eget
                                vulputate justo elementum. Aenean tristique, purus sed malesuada consequat,
                                velit augue commodo massa, nec posuere enim ipsum vel nisl. Nam vitae
                                consequat lectus, at tempor sapien.
                            </p>

                            <p
                                className="mt-4 text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                            >
                                Vivamus euismod, neque id aliquam consectetur, augue lectus tincidunt
                                mauris, vitae tincidunt libero sapien at justo. Phasellus egestas lacus
                                quis magna interdum, nec faucibus arcu vestibulum. Morbi volutpat velit
                                vitae sem efficitur, sed tincidunt neque tincidunt.
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
const metodologiaImagens2 = [
    "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=400&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1581093196867-ca9c4e3e3593?w=400&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=400&h=400&fit=crop&auto=format",
];

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
        beforeImg: getBioplasticoImage("resultados/22.jpg"),
        afterImg: getBioplasticoImage("resultados/12.jpg"),
        beforeThumb: getBioplasticoImage("resultados/21.jpg"),
        afterThumb: getBioplasticoImage("resultados/11.jpg"),
        imagem: getBioplasticoImage("milho1.png"),

    },
    {
        id: "exp02",
        titulo: "Teste de Força do Bioplástico de Amido",
        status: "Em andamento",
        objetivo:
            "Investigar o reforço mecânico de filmes de bioplástico de amido com adição de fibras curtas de bambu processadas.",
        materiais: [
            "30 g de amido de mandioca",
            "5 g de fibra de bambu (moída e peneirada, 0,5 mm)",
            "250 mL de água destilada",
            "20 mL de glicerina vegetal",
            "5 mL de vinagre branco",
        ],
        metodologia: [
            { texto: "Processar fibra de bambu seca em liquidificador por 3 minutos; peneirar a 0,5 mm.", img: metodologiaImagens2[0] },
            { texto: "Preparar solução de amido conforme Experimento 01 até gelificação inicial.", img: metodologiaImagens2[1] },
            { texto: "Incorporar fibra à mistura aquecida antes da gelificação completa, mexendo vigorosamente.", img: metodologiaImagens2[2] },
            { texto: "Vazar em molde e secar em estufa a 40°C por 12 horas até peso constante.", img: metodologiaImagens2[3] },
        ],
        resultados: [
            "Aumento estimado de 25–35% na resistência à tração (resultados preliminares).",
            "Distribuição heterogênea de fibras observada em amostras iniciais.",
            "Opacidade do filme aumentou com adição de fibra.",
        ],
        beforeImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=500&fit=crop&auto=format",
        afterImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=500&fit=crop&auto=format",
        beforeThumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=260&fit=crop&auto=format",
        afterThumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=260&fit=crop&auto=format",
        observacoes:
            "Experimento em fase de repetição para validação estatística. Homogeneização mecânica da fibra está sendo ajustada.",
        imagem: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop&auto=format",
    },
    {
        id: "exp03",
        titulo: "Teste de Degradação do Bioplástico de Amido Soterrado",
        status: "Em andamento",
        objetivo:
            "Investigar o reforço mecânico de filmes de bioplástico de amido com adição de fibras curtas de bambu processadas.",
        materiais: [
            "30 g de amido de mandioca",
            "5 g de fibra de bambu (moída e peneirada, 0,5 mm)",
            "250 mL de água destilada",
            "20 mL de glicerina vegetal",
            "5 mL de vinagre branco",
        ],
        metodologia: [
            { texto: "Processar fibra de bambu seca em liquidificador por 3 minutos; peneirar a 0,5 mm.", img: metodologiaImagens2[0] },
            { texto: "Preparar solução de amido conforme Experimento 01 até gelificação inicial.", img: metodologiaImagens2[1] },
            { texto: "Incorporar fibra à mistura aquecida antes da gelificação completa, mexendo vigorosamente.", img: metodologiaImagens2[2] },
            { texto: "Vazar em molde e secar em estufa a 40°C por 12 horas até peso constante.", img: metodologiaImagens2[3] },
        ],
        resultados: [
            "Aumento estimado de 25–35% na resistência à tração (resultados preliminares).",
            "Distribuição heterogênea de fibras observada em amostras iniciais.",
            "Opacidade do filme aumentou com adição de fibra.",
        ],
        beforeImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=500&fit=crop&auto=format",
        afterImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=500&fit=crop&auto=format",
        beforeThumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=260&fit=crop&auto=format",
        afterThumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=260&fit=crop&auto=format",
        observacoes:
            "Experimento em fase de repetição para validação estatística. Homogeneização mecânica da fibra está sendo ajustada.",
        imagem: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop&auto=format",
    },
    {
        id: "exp04",
        titulo: "Teste de Degradação do Bioplástico de Amido Imerso em Água",
        status: "Em andamento",
        objetivo:
            "Investigar o reforço mecânico de filmes de bioplástico de amido com adição de fibras curtas de bambu processadas.",
        materiais: [
            "30 g de amido de mandioca",
            "5 g de fibra de bambu (moída e peneirada, 0,5 mm)",
            "250 mL de água destilada",
            "20 mL de glicerina vegetal",
            "5 mL de vinagre branco",
        ],
        metodologia: [
            { texto: "Processar fibra de bambu seca em liquidificador por 3 minutos; peneirar a 0,5 mm.", img: metodologiaImagens2[0] },
            { texto: "Preparar solução de amido conforme Experimento 01 até gelificação inicial.", img: metodologiaImagens2[1] },
            { texto: "Incorporar fibra à mistura aquecida antes da gelificação completa, mexendo vigorosamente.", img: metodologiaImagens2[2] },
            { texto: "Vazar em molde e secar em estufa a 40°C por 12 horas até peso constante.", img: metodologiaImagens2[3] },
        ],
        resultados: [
            "Aumento estimado de 25–35% na resistência à tração (resultados preliminares).",
            "Distribuição heterogênea de fibras observada em amostras iniciais.",
            "Opacidade do filme aumentou com adição de fibra.",
        ],
        beforeImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=500&fit=crop&auto=format",
        afterImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=500&fit=crop&auto=format",
        beforeThumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=260&fit=crop&auto=format",
        afterThumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=260&fit=crop&auto=format",
        observacoes:
            "Experimento em fase de repetição para validação estatística. Homogeneização mecânica da fibra está sendo ajustada.",
        imagem: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop&auto=format",
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
                                            <div className="grid grid-cols-2 gap-3 mb-5">
                                                <div className="rounded-xl overflow-hidden border border-border">
                                                    <div className="relative">
                                                        <img src={exp.beforeThumb} alt="Antes" className="w-full object-cover" style={{ height: 140 }} />

                                                    </div>
                                                </div>
                                                <div className="rounded-xl overflow-hidden border border-border">
                                                    <div className="relative">
                                                        <img src={exp.afterThumb} alt="Depois" className="w-full object-cover" style={{ height: 140 }} />

                                                    </div>
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
                                                before={exp.beforeImg}
                                                afterImg={exp.afterImg}
                                                beforeAlt="Grupo de controle"
                                                afterAlt="Resultado final"
                                            />
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
    const [formData, setFormData] = useState({ nome: "", email: "", mensagem: "" });
    const [enviado, setEnviado] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setEnviado(true);
        setTimeout(() => setEnviado(false), 4000);
        setFormData({ nome: "", email: "", mensagem: "" });
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
                                src="src/app/assets/img/ufabc.png"
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
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                    Enviar mensagem <ArrowRight className="w-4 h-4" />
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
