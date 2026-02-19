"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Globe, Moon, CreditCard, Laptop, Smartphone } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
    const { t } = useLanguage();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t("settings")}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-slate-100 dark:border-white/5 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
                            <Bell className="w-5 h-5 text-emerald-600" />
                            {t("notifications")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { label: t("transaction_alerts"), desc: t("transaction_alerts_desc"), active: true },
                            { label: t("news_tips"), desc: t("news_tips_desc"), active: false },
                            { label: t("monthly_report"), desc: t("monthly_report_desc"), active: true },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-white/5 last:border-0">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
                                </div>
                                <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${item.active ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${item.active ? "translate-x-4" : ""}`} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-slate-100 dark:border-white/5 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
                            <Globe className="w-5 h-5 text-sky-600" />
                            {t("lang_region")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("main_language")}</label>
                            <select className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white">
                                <option>Português (Brasil)</option>
                                <option>English (US)</option>
                                <option>Español</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("reference_currency")}</label>
                            <select className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white">
                                <option>BRL (R$)</option>
                                <option>USD ($)</option>
                                <option>Points (pts)</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 dark:border-white/5 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
                            <CreditCard className="w-5 h-5 text-orange-600" />
                            {t("connected_devices")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-2xl">
                            <Smartphone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">iPhone 15 Pro</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{t("online_now")} • São Paulo, BR</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 font-black uppercase text-[10px]">{t("revoke")}</Button>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-2xl">
                            <Laptop className="w-5 h-5 text-slate-400" />
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">MacBook Pro (Chrome)</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{t("seen_days_ago")} • Rio de Janeiro, BR</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 font-black uppercase text-[10px]">{t("revoke")}</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" className="rounded-xl font-bold border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400">{t("discard")}</Button>
                <Button className="rounded-xl font-bold px-8 shadow-lg shadow-emerald-500/20">{t("save_preferences")}</Button>
            </div>
        </div>
    );
}
