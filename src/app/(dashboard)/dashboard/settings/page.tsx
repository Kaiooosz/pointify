"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Globe, Moon, CreditCard, Laptop, Smartphone } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
    const { t } = useLanguage();

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-32">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase mt-6">{t("settings")}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-[#121212] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4 border-b border-white/5 bg-white/[0.01]">
                        <CardTitle className="text-[10px] font-black flex items-center gap-3 text-white uppercase tracking-[0.3em]">
                            <Bell className="w-4 h-4 text-[#1DB954]" />
                            {t("notifications")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        {[
                            { label: t("transaction_alerts"), desc: t("transaction_alerts_desc"), active: true },
                            { label: t("news_tips"), desc: t("news_tips_desc"), active: false },
                            { label: t("monthly_report"), desc: t("monthly_report_desc"), active: true },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                                <div>
                                    <p className="text-[11px] font-black text-white uppercase tracking-widest">{item.label}</p>
                                    <p className="text-[9px] text-[#A7A7A7] font-black uppercase tracking-widest opacity-60 mt-1">{item.desc}</p>
                                </div>
                                <div className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-all ${item.active ? "bg-[#1DB954]" : "bg-[#181818] border border-white/10"}`}>
                                    <div className={`w-5 h-5 rounded-full transition-transform ${item.active ? "translate-x-5 bg-black" : "bg-[#A7A7A7]"}`} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-[#121212] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4 border-b border-white/5 bg-white/[0.01]">
                        <CardTitle className="text-[10px] font-black flex items-center gap-3 text-white uppercase tracking-[0.3em]">
                            <Globe className="w-4 h-4 text-[#1DB954]" />
                            {t("lang_region")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-2">{t("main_language")}</label>
                            <select className="w-full h-14 bg-[#181818] border border-white/5 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest focus:ring-1 focus:ring-white/20 outline-none text-white appearance-none">
                                <option>Português (Brasil)</option>
                                <option>English (US)</option>
                                <option>Español</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-2">{t("reference_currency")}</label>
                            <select className="w-full h-14 bg-[#181818] border border-white/5 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest focus:ring-1 focus:ring-white/20 outline-none text-white appearance-none">
                                <option>BRL (R$)</option>
                                <option>USD ($)</option>
                                <option>Points (pts)</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#121212] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4 border-b border-white/5 bg-white/[0.01]">
                        <CardTitle className="text-[10px] font-black flex items-center gap-3 text-white uppercase tracking-[0.3em]">
                            <CreditCard className="w-4 h-4 text-[#1DB954]" />
                            {t("connected_devices")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-[#181818] border border-white/5 rounded-2xl">
                            <Smartphone className="w-5 h-5 text-[#1DB954]/40" />
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">iPhone 15 Pro</p>
                                <p className="text-[8px] text-[#A7A7A7] font-black uppercase tracking-widest opacity-60 mt-1">{t("online_now")} • São Paulo, BR</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-white hover:text-rose-500 hover:bg-rose-500/5 font-black uppercase text-[9px] tracking-widest">{t("revoke")}</Button>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-[#181818] border border-white/5 rounded-2xl">
                            <Laptop className="w-5 h-5 text-[#1DB954]/20" />
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">MacBook Pro (Chrome)</p>
                                <p className="text-[8px] text-[#A7A7A7] font-black uppercase tracking-widest opacity-60 mt-1">{t("seen_days_ago")} • Rio de Janeiro, BR</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-white hover:text-rose-500 hover:bg-rose-500/5 font-black uppercase text-[9px] tracking-widest">{t("revoke")}</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4 pt-10">
                <Button variant="outline" className="h-12 px-8 rounded-full font-black uppercase text-[10px] tracking-[0.2em] border-white/10 text-[#A7A7A7] hover:text-white hover:bg-white/5 transition-all">{t("discard")}</Button>
                <Button className="h-12 px-10 rounded-full font-black uppercase text-[10px] tracking-[0.2em] bg-[#1DB954] text-black hover:bg-[#1ED760] shadow-2xl border-none transition-all">{t("save_preferences")}</Button>
            </div>
        </div>
    );
}
