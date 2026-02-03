"use client";

import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Zap, ShieldCheck, ArrowRight, Wallet, RefreshCw, Smartphone } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 md:pt-56 md:pb-48 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/5 dark:bg-sky-500/10 blur-[100px] rounded-full -z-10" />

        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] mb-12 animate-fade-in shadow-2xl shadow-slate-900/20">
              <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" />
              <span>{t("platform_points")}</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.9] text-slate-900 dark:text-white">
              {t("future_is_points")}
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 mb-14 max-w-3xl leading-relaxed font-bold tracking-tight">
              {t("hero_desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 mt-4">
              <Link href="/register">
                <Button size="lg" className="px-14 h-20 text-lg font-black rounded-[2rem] shadow-[0_20px_50px_rgba(16,185,129,0.3)] bg-emerald-500 hover:bg-emerald-600 border-none transition-all hover:scale-105 active:scale-95">
                  {t("start_now")}
                  <ArrowRight className="ml-3 w-6 h-6 border-none" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="px-14 h-20 text-lg font-black rounded-[2rem] border-2 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white transition-all hover:scale-105 active:scale-95">
                  {t("how_it_works")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 bg-[#F8F9FB] dark:bg-slate-950/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight text-center">{t("simple_experience")}</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-bold italic text-center max-w-xl mx-auto">{t("real_time_transactions")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: "01", title: t("step1_title"), description: t("step1_desc"), icon: Wallet, bg: "bg-emerald-500/10", color: "text-emerald-500", shadow: "shadow-emerald-500/10" },
              { step: "02", title: t("step2_title"), description: t("step2_desc"), icon: RefreshCw, bg: "bg-sky-500/10", color: "text-sky-500", shadow: "shadow-sky-500/10" },
              { step: "03", title: t("step3_title"), description: t("step3_desc"), icon: Smartphone, bg: "bg-slate-900 dark:bg-emerald-500", color: "text-emerald-400 dark:text-white", shadow: "shadow-slate-900/10 dark:shadow-emerald-500/20" }
            ].map((step, i) => (
              <div key={i} className={`group relative p-12 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-none hover:-translate-y-3`}>
                <div className="relative z-10">
                  <div className={`w-20 h-20 rounded-[1.5rem] ${step.bg} flex items-center justify-center mb-10 transition-all group-hover:scale-110 duration-500 shadow-xl ${step.shadow}`}>
                    <step.icon className={`w-10 h-10 ${step.color}`} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">{step.title}</h3>
                  <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-bold tracking-tight">{step.description}</p>
                </div>
                <div className="absolute top-12 right-12 text-7xl font-black text-slate-50 dark:text-white/5 -z-0 select-none transition-colors group-hover:text-emerald-500/5 duration-700">
                  {step.step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-32 bg-white dark:bg-slate-950 transition-colors duration-500">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">{t("why_pointify")}</h2>
              <div className="space-y-10">
                {[
                  { title: t("extreme_speed"), description: t("speed_desc"), icon: Zap },
                  { title: t("total_transparency"), description: t("transparency_desc"), icon: CheckCircle2 },
                  { title: t("elite_security"), description: t("security_desc"), icon: ShieldCheck }
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="mt-1 flex-shrink-0 w-16 h-16 rounded-[1.25rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 transition-all group-hover:bg-emerald-500 group-hover:text-white duration-300 shadow-lg shadow-emerald-500/5">
                      <benefit.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white text-2xl mb-2 tracking-tight">{benefit.title}</h4>
                      <p className="text-lg text-slate-500 dark:text-slate-400 font-bold leading-relaxed tracking-tight">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-sky-500/20 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-duration-700" />
              <div className="relative aspect-[4/3] rounded-[3.5rem] overflow-hidden border border-slate-100 dark:border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] bg-white dark:bg-slate-900 flex flex-col justify-center items-center p-12 text-center group-hover:scale-[1.02] transition-transform duration-500">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.05),transparent_50%)]" />

                <div className="relative mb-12">
                  <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 scale-150 animate-pulse" />
                  <Logo withText={false} width={100} height={100} className="relative z-10 scale-150 brightness-110 drop-shadow-[0_0_30px_rgba(16,185,129,0.4)]" />
                </div>

                <div className="relative z-10 space-y-4">
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    {t("premium_experience")}
                  </h3>
                  <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />
                  <p className="text-xl text-slate-500 dark:text-slate-400 font-bold max-w-xs mx-auto leading-relaxed">
                    {t("minimalism_success")}
                  </p>
                </div>

                <div className="absolute top-8 right-8 w-24 h-24 border border-slate-100 dark:border-white/5 rounded-full flex items-center justify-center opacity-50">
                  <div className="w-16 h-16 border border-slate-100 dark:border-white/5 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-slate-100 dark:border-white/5 mt-auto bg-white dark:bg-slate-950 transition-colors duration-500">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-16">
            <Logo />
            <div className="flex flex-wrap justify-center gap-12 text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              <Link href="#" className="hover:text-emerald-500 dark:hover:text-white transition-colors">{t("terms")}</Link>
              <Link href="#" className="hover:text-emerald-600 dark:hover:text-white transition-colors">{t("privacy")}</Link>
              <Link href="#" className="hover:text-emerald-600 dark:hover:text-white transition-colors">{t("support")}</Link>
            </div>
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 tracking-tight">© 2026 Pointify. {t("all_rights_reserved")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
