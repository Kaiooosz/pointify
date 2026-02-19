"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 pb-32 px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center gap-8 mt-6">
                <div className="w-32 h-32 rounded-full bg-[#181818] flex items-center justify-center text-[#1DB954] text-5xl font-black shadow-2xl border border-white/5 uppercase select-none">
                    K
                </div>
                <div className="text-center md:text-left space-y-3">
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Kai Otsunokawa</h2>
                    <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-3">
                        Membro Ativo <span className="w-1 h-1 bg-white/20 rounded-full" /> Janeiro 2026
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                        <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest py-2 px-4 bg-[#1DB954]/10 text-[#1DB954] rounded-full border border-[#1DB954]/20 shadow-[0_0_20px_rgba(29,185,84,0.1)]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Identidade Verificada
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    <Card className="bg-[#121212] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between p-10 pb-6 border-b border-white/5 bg-white/[0.02]">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#A7A7A7]">Informações Pessoais</CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(!isEditing)}
                                className="rounded-full border-[#1DB954]/20 text-[#1DB954] hover:bg-[#1DB954] hover:text-black font-black uppercase text-[10px] tracking-widest h-10 px-6 transition-all"
                            >
                                {isEditing ? "Cancelar Operação" : "Editar Dados"}
                            </Button>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.2em] px-2">
                                        Nome Completo
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7]" />
                                        <Input
                                            defaultValue="Kai Otsunokawa"
                                            disabled={!isEditing}
                                            className="h-14 pl-14 rounded-full bg-[#181818] border-white/5 font-black text-xs text-white disabled:opacity-50 tracking-widest"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.2em] px-2">
                                        Ponto de Contato (Email)
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7]" />
                                        <Input
                                            defaultValue="kai@pointify.com"
                                            disabled={!isEditing}
                                            className="h-14 pl-14 rounded-full bg-[#181818] border-white/5 font-black text-xs text-white disabled:opacity-50 tracking-widest"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.2em] px-2">Biografia Digital</label>
                                <Input
                                    defaultValue="Entusiasta de tecnologia e finanças descentralizadas."
                                    disabled={!isEditing}
                                    className="h-14 px-8 rounded-full bg-[#181818] border-white/5 font-black text-xs text-white disabled:opacity-50 tracking-widest"
                                />
                            </div>
                        </CardContent>
                        {isEditing && (
                            <CardFooter className="bg-white/[0.05] p-10 border-t border-white/5">
                                <Button className="w-full h-14 rounded-full bg-[#1DB954] text-black hover:bg-[#1ED760] font-black uppercase text-[10px] tracking-[0.3em] shadow-xl transition-all border-none">
                                    Confirmar Alterações
                                </Button>
                            </CardFooter>
                        )}
                    </Card>

                    <Card className="bg-[#121212] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-10 pb-6 border-b border-white/5 bg-white/[0.02]">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#A7A7A7]">Camada de Segurança</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center justify-between p-6 bg-[#181818] rounded-[2rem] border border-white/5 hover:border-[#1DB954]/20 transition-all group">
                                <div className="flex items-center gap-5">
                                    <div className="p-3 bg-[#1DB954]/10 rounded-xl group-hover:bg-[#1DB954] group-hover:text-black transition-all">
                                        <Shield className="w-5 h-5 text-[#1DB954] group-hover:text-black" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Autenticação 2FA</p>
                                        <p className="text-[8px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1">Nível Adicional Ativo</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="rounded-full h-10 px-6 border-white/10 text-[#1DB954] font-black uppercase text-[9px] tracking-widest bg-transparent hover:bg-white/5">Ativar</Button>
                            </div>
                            <div className="flex items-center justify-between p-6 bg-[#181818] rounded-[2rem] border border-white/5 hover:border-[#1DB954]/20 transition-all group">
                                <div className="flex items-center gap-5">
                                    <div className="p-3 bg-[#1DB954]/10 rounded-xl group-hover:bg-[#1DB954] group-hover:text-black transition-all">
                                        <Shield className="w-5 h-5 text-[#1DB954] group-hover:text-black" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Chave da Carteira</p>
                                        <p className="text-[8px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1">Última troca há 62 dias</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="rounded-full h-10 px-6 border-white/10 text-[#A7A7A7] font-black uppercase text-[9px] tracking-widest bg-transparent hover:bg-white/5">Alterar</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <Card className="bg-[#1DB954] border-none shadow-2xl rounded-[2.5rem] overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                        <CardHeader className="p-8">
                            <CardTitle className="text-[10px] font-black text-black uppercase tracking-[0.3em] flex items-center gap-3">
                                <Shield className="w-4 h-4" />
                                Status de Segurança
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="bg-black/10 p-6 rounded-[2rem] border border-black/5">
                                <div className="flex items-center gap-3 text-black font-black text-lg tracking-tighter uppercase mb-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Tier 2 Elite
                                </div>
                                <p className="text-[9px] font-black text-black/60 uppercase tracking-widest leading-relaxed">
                                    Operações autorizadas até <span className="text-black">50.000 PTS</span> por ciclo de 24h.
                                </p>
                            </div>
                            <Button className="w-full h-12 bg-black text-white hover:bg-black/90 rounded-full font-black uppercase text-[9px] tracking-[0.2em] border-none shadow-xl">
                                Elevar Nível de Acesso
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#181818] border border-amber-500/10 shadow-2xl rounded-[2.5rem] overflow-hidden">
                        <CardContent className="p-8 flex gap-5">
                            <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Aviso de Sistema</p>
                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest leading-loose opacity-60">
                                    Nova documentação enviada está em fase de <span className="text-white">Auditoria Digital</span>. Prazo estimado: 18h úteis.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

    );
}
