"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-emerald-500 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-emerald-500/20">
                    K
                </div>
                <div>
                    <h2 className="text-3xl font-bold">Kai Otsunokawa</h2>
                    <p className="text-muted-foreground">Membro desde Janeiro 2026</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="flex items-center gap-1 text-xs font-bold uppercase py-1 px-2 bg-emerald-500/10 text-emerald-600 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Conta Verificada
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Informações Pessoais</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? "Cancelar" : "Editar"}
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <User className="w-4 h-4" /> Nome Completo
                                    </label>
                                    <Input defaultValue="Kai Otsunokawa" disabled={!isEditing} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> Email
                                    </label>
                                    <Input defaultValue="kai@pointify.com" disabled={!isEditing} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Bio</label>
                                <Input defaultValue="Entusiasta de tecnologia e finanças descentralizadas." disabled={!isEditing} />
                            </div>
                        </CardContent>
                        {isEditing && (
                            <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t border-border rounded-b-2xl">
                                <Button className="ml-auto">Salvar Alterações</Button>
                            </CardFooter>
                        )}
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Segurança</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-emerald-600" />
                                    <div>
                                        <p className="text-sm font-bold">Autenticação de Dois Fatores</p>
                                        <p className="text-xs text-muted-foreground">Adicione uma camada extra de segurança</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Ativar</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-emerald-600" />
                                    <div>
                                        <p className="text-sm font-bold">Senha da Carteira</p>
                                        <p className="text-xs text-muted-foreground">Alterada há 2 meses</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Alterar</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-500" />
                                Status KYC
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm mb-1">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Nível 2 Aprovado
                                </div>
                                <p className="text-xs text-slate-300">Você pode transacionar até 50.000 pts p/ dia.</p>
                            </div>
                            <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 italic" variant="secondary" size="sm">
                                Aumentar Limites
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-200 bg-amber-50/10">
                        <CardContent className="p-4 flex gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-amber-900 dark:text-amber-400">Verificação de Documentos</p>
                                <p className="text-xs text-amber-800/70 dark:text-amber-400/70 mt-1">
                                    Estamos revisando seu novo comprovante de residência. Prazo: 24h.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
