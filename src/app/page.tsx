"use client";

import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Zap, ShieldCheck, ArrowRight, Wallet, RefreshCw, Smartphone, Bitcoin, ArrowUpDown, Landmark } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0B] dark:bg-[#0B0B0B] transition-colors duration-500 selection:bg-[#1DB954]/30 selection:text-[#1DB954]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-56 md:pb-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] md:h-[800px] bg-[#1DB954]/5 blur-[120px] md:blur-[150px] rounded-full -z-10" />

        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="flex flex-col items-center text-center max-w-[1100px] mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1DB954]/10 text-[#1DB954] text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-10 md:mb-12 animate-fade-in border border-[#1DB954]/20 shadow-[0_0_20px_rgba(29,185,84,0.1)]">
              <Zap className="w-3.5 h-3.5 md:w-4 h-4 fill-[#1DB954]" />
              <span>{t("platform_points")} INFRASTRUCTURE</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter mb-10 md:mb-12 leading-[0.85] text-white uppercase break-words">
              {t("future_is_points")}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-[#A7A7A7] mb-12 md:mb-16 max-w-3xl leading-relaxed font-black tracking-tight uppercase px-4">
              {t("hero_desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 md:gap-8 mt-4 w-full sm:w-auto px-6">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:px-16 h-20 md:h-24 text-sm uppercase tracking-widest font-black rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black shadow-[0_20px_40px_rgba(29,185,84,0.2)] transition-all hover:scale-105 active:scale-95 border-none">
                  {t("start_now")}
                  <ArrowRight className="ml-4 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:px-16 h-20 md:h-24 text-sm uppercase tracking-widest font-black rounded-full border-2 border-white/10 text-white hover:bg-white/5 transition-all hover:scale-105 active:scale-95">
                  {t("how_it_works")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 md:py-40 bg-[#121212]">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="text-center max-w-4xl mx-auto mb-20 md:mb-32">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 md:mb-8 tracking-tighter uppercase leading-none">{t("simple_experience")}</h2>
            <p className="text-[10px] md:text-xl text-[#1DB954] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">{t("real_time_transactions")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { step: "01", title: t("step1_title"), description: t("step1_desc"), icon: Wallet },
              { step: "02", title: t("step2_title"), description: t("step2_desc"), icon: RefreshCw },
              { step: "03", title: t("step3_title"), description: t("step3_desc"), icon: Smartphone }
            ].map((step, i) => (
              <div key={i} className="group relative p-10 md:p-16 rounded-[2.5rem] md:rounded-[3rem] bg-[#181818] border border-white/5 transition-all duration-700 hover:bg-[#222222] hover:-translate-y-4">
                <div className="relative z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#1DB954]/10 flex items-center justify-center mb-10 md:mb-12 transition-all group-hover:bg-[#1DB954] group-hover:text-black duration-500 border border-[#1DB954]/20">
                    <step.icon className="w-8 h-8 md:w-10 md:h-10 text-[#1DB954] group-hover:text-black transition-colors" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-4 md:mb-6 tracking-tighter uppercase leading-none">{step.title}</h3>
                  <p className="text-sm md:text-lg text-[#A7A7A7] leading-relaxed font-black tracking-tight uppercase opacity-50">{step.description}</p>
                </div>
                <div className="absolute top-10 right-10 md:top-16 md:right-16 text-6xl md:text-8xl font-black text-white/[0.02] -z-0 select-none group-hover:text-[#1DB954]/5 transition-colors duration-700">
                  {step.step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-24 md:py-40 bg-[#0B0B0B]">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center">
            <div className="space-y-12 md:space-y-16">
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">{t("why_pointify")}</h2>
              <div className="space-y-10 md:space-y-12">
                {[
                  { title: t("extreme_speed"), description: t("speed_desc"), icon: Zap },
                  { title: t("total_transparency"), description: t("transparency_desc"), icon: CheckCircle2 },
                  { title: t("elite_security"), description: t("security_desc"), icon: ShieldCheck }
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-6 md:gap-10 group">
                    <div className="mt-1 flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#1DB954]/10 flex items-center justify-center text-[#1DB954] transition-all group-hover:bg-[#1DB954] group-hover:text-black duration-500 border border-[#1DB954]/20">
                      <benefit.icon className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-2xl md:text-3xl mb-3 md:mb-4 tracking-tighter uppercase">{benefit.title}</h4>
                      <p className="text-sm md:text-lg text-[#A7A7A7] font-black leading-relaxed tracking-tight uppercase opacity-50">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group px-4 md:px-0">
              <div className="absolute -inset-8 bg-[#1DB954]/20 rounded-[5rem] blur-[120px] opacity-0 group-hover:opacity-100 transition-duration-700" />
              <div className="relative aspect-square rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-white/10 bg-[#121212] flex flex-col justify-center items-center p-10 md:p-16 text-center group-hover:border-[#1DB954]/40 transition-all duration-700">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,185,84,0.1),transparent_50%)]" />

                <div className="relative mb-10 md:mb-16">
                  <div className="absolute inset-0 bg-[#1DB954] blur-[80px] opacity-20 scale-150" />
                  <Logo withText={false} width={120} height={120} className="md:w-40 md:h-40 relative z-10 brightness-110 drop-shadow-[0_0_50px_rgba(29,185,84,0.4)]" />
                </div>

                <div className="relative z-10 space-y-4 md:space-y-6">
                  <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none uppercase">
                    {t("premium_experience")}
                  </h3>
                  <div className="w-20 md:w-24 h-1.5 bg-[#1DB954] mx-auto rounded-full shadow-[0_0_15px_#1DB954]" />
                  <p className="text-sm md:text-xl text-[#A7A7A7] font-black max-w-sm mx-auto leading-relaxed uppercase opacity-50">
                    {t("minimalism_success")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-24 md:py-40 bg-[#121212]">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="text-center max-w-4xl mx-auto mb-20 md:mb-32">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 md:mb-8 tracking-tighter uppercase leading-none">{t("security_title")}</h2>
            <div className="flex flex-col items-center">
              <p className="text-[10px] md:text-xl text-[#1DB954] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">{t("custody_subtitle")}</p>
              <p className="mt-8 text-sm md:text-lg text-[#A7A7A7] max-w-2xl text-center leading-relaxed font-black tracking-tight uppercase opacity-50">{t("custody_desc")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {[
              { title: t("no_central_custody_title"), description: t("no_central_custody_desc"), icon: Wallet },
              { title: t("on_chain_transparency_title"), description: t("on_chain_transparency_desc"), icon: CheckCircle2 },
              { title: t("no_counterparty_risk_title"), description: t("no_counterparty_risk_desc"), icon: ShieldCheck },
              { title: t("elite_security"), description: t("security_desc"), icon: Zap }
            ].map((item, i) => (
              <div key={i} className="group p-10 md:p-16 rounded-[2.5rem] bg-[#181818] border border-white/5 hover:bg-[#222222] transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#1DB954]/10 flex items-center justify-center mb-8 md:mb-10 transition-all group-hover:bg-[#1DB954] group-hover:text-black duration-500 border border-[#1DB954]/20">
                  <item.icon className="w-8 h-8 md:w-10 md:h-10 text-[#1DB954] group-hover:text-black transition-colors" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tighter uppercase leading-none">{item.title}</h3>
                  <p className="text-sm md:text-lg text-[#A7A7A7] leading-relaxed font-black tracking-tight uppercase opacity-50">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Para Quem ═══════════════════════════════════════════════════ */}
      <section id="for-whom" className="py-24 md:py-40 bg-[#0B0B0B]">
        <div className="container mx-auto px-6 max-w-[1400px]">

          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
            <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.5em] mb-4">Público-Alvo</p>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              Para quem é o Pointify?
            </h2>
            <p className="mt-6 text-sm md:text-lg text-[#A7A7A7] font-black uppercase tracking-tight opacity-50 leading-relaxed">
              Liberdade total para gerir seus fundos — sem precisar converter tudo de volta para fiat.
            </p>
          </div>

          {/* Perfis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
            {[
              {
                icon: Landmark, color: "#1DB954",
                tag: "Recebimento",
                title: "Quem recebe em Fiat e quer cripto",
                desc: "Receba em BRL, converta para USDT ou BTC com rapidez e proteja seu valor contra flutuações da moeda tradicional.",
                checks: ["Pagamentos em BRL", "Conversão para USDT ou BTC", "Proteção cambial instantânea"]
              },
              {
                icon: ArrowUpDown, color: "#26A17B",
                tag: "Swap",
                title: "Quem quer comprar USDT com facilidade",
                desc: "Use sua conta Pointify para comprar USDT diretamente. Um token estável ligado ao dólar — ideal para reservas ou transações rápidas.",
                checks: ["USDT indexado ao dólar", "Ideal para reservas de valor", "Transações rápidas e baratas"]
              },
              {
                icon: Wallet, color: "#60A5FA",
                tag: "Custódia",
                title: "Hot Wallet ou Cold Wallet",
                desc: "Você escolhe onde guardar seus ativos. Hot wallet para acesso rápido no dia a dia. Cold wallet para armazenamento seguro a longo prazo.",
                checks: ["Hot Wallet — acesso rápido", "Cold Wallet — máxima segurança", "Você é o único dono"]
              },
              {
                icon: Bitcoin, color: "#F7931A",
                tag: "Múltiplas Redes",
                title: "Receba USDT e BTC em qualquer rede",
                desc: "Escolha a rede que preferir: TRC20, ERC20, BEP20, Polygon, Solana e Bitcoin. Total flexibilidade para enviar e receber.",
                checks: ["USDT: TRC20, ERC20, BEP20, Polygon", "BTC: Bitcoin, Solana (wBTC), ERC20", "Sem rede obrigatória"]
              },
            ].map((card, i) => (
              <div key={i} className="group p-10 md:p-12 rounded-[2.5rem] bg-[#121212] border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-2 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110"
                    style={{ backgroundColor: `${card.color}15`, border: `1px solid ${card.color}30` }}>
                    <card.icon className="w-6 h-6" style={{ color: card.color }} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] px-4 py-2 rounded-full border" style={{ color: card.color, borderColor: `${card.color}30`, backgroundColor: `${card.color}10` }}>
                    {card.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase leading-tight mb-3">{card.title}</h3>
                  <p className="text-sm text-[#A7A7A7] font-black uppercase tracking-tight opacity-50 leading-relaxed">{card.desc}</p>
                </div>
                <ul className="space-y-3 mt-auto">
                  {card.checks.map((c, j) => (
                    <li key={j} className="flex items-center gap-3 text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: card.color }} />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Resumo CTA */}
          <div className="relative rounded-[3rem] bg-[#121212] border border-[#1DB954]/10 p-12 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#1DB954]/5 blur-[100px] rounded-full" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-2xl">
                <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.5em] mb-4">Resumo do Valor</p>
                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-tight">Pointify é para quem busca liberdade financeira digital</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {[
                    "Recebe pagamento em fiat e quer converter em cripto",
                    "Quer pagar ou receber em stablecoins (USDT)",
                    "Deseja controlar ativos em carteiras próprias",
                    "Busca transações seguras, rápidas e rastreáveis",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#1DB954] flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-wider opacity-70 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <a href="/register" className="flex-shrink-0">
                <button className="h-16 px-12 rounded-full font-black text-[11px] uppercase tracking-[0.3em] bg-[#1DB954] text-black hover:bg-[#1ED760] hover:scale-105 transition-all shadow-[0_20px_40px_rgba(29,185,84,0.25)] whitespace-nowrap">
                  Criar Conta Grátis <ArrowRight className="inline ml-3 w-4 h-4" />
                </button>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 md:py-32 border-t border-white/5 mt-auto bg-[#0B0B0B]">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-16 md:gap-24 text-center md:text-left">
            <Logo />
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#A7A7A7]/40">
              <Link href="#" className="hover:text-[#1DB954] transition-colors">{t("terms")}</Link>
              <Link href="#" className="hover:text-[#1DB954] transition-colors">{t("privacy")}</Link>
              <Link href="#" className="hover:text-[#1DB954] transition-colors">{t("support")}</Link>
            </div>
            <p className="text-[9px] md:text-xs font-black text-[#A7A7A7]/40 tracking-widest uppercase md:max-w-xs">© 2026 Pointify Global Infrastructure. {t("all_rights_reserved")}</p>
          </div>
        </div>
      </footer>
    </div>


  );
}
