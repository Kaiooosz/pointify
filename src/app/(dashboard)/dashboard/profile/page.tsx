"use client";


import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button, cn } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Shield, CheckCircle2, AlertCircle, Loader2, Plus, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { getFullUserProfile, updateUserProfile } from "@/actions/user-actions";
import { useUser } from "@/components/providers/user-provider";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
    const contextUser = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [userData, setUserData] = useState<any>(contextUser || null);

    // Form states
    const [name, setName] = useState(contextUser?.name || "");
    const [email, setEmail] = useState(contextUser?.email || "");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState("");

    const fetchProfile = async () => {
        setIsLoading(true);
        const res = await getFullUserProfile();
        if (res.success && res.user) {
            setUserData(res.user);
            setName(res.user.name || "");
            setEmail(res.user.email || "");
            setBio(res.user.bio || "");
            setImage(res.user.image || "");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        const res = await updateUserProfile({ name, email, bio, image });
        if (res.success) {
            setUserData(res.user);
            setIsEditing(false);
        } else {
            alert(res.error || "Erro ao salvar");
        }
        setIsSaving(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (isLoading && !userData) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 pb-32 px-4 md:px-8">
            {/* Header Spotify Style - Dynamic Profile */}
            <div className="flex flex-col md:flex-row items-center gap-10 mt-10">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1DB954] to-transparent rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative w-40 h-40 rounded-full bg-[#0A0A0A] flex items-center justify-center text-white text-6xl font-black shadow-[0_0_50px_rgba(29,185,84,0.15)] border-2 border-[#1DB954]/30 uppercase select-none overflow-hidden">
                        {image ? (
                            <img src={image} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center">
                                <span className="leading-none">
                                    {userData?.name || name
                                        ? (userData?.name || name).split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
                                        : userData?.email?.substring(0, 2).toUpperCase() || email?.substring(0, 2).toUpperCase() || "?"}
                                </span>
                                <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-[#1DB954]/20 to-transparent" />
                            </div>
                        )}
                    </div>
                    {isEditing && (
                        <label
                            htmlFor="avatar-upload"
                            className="absolute inset-0 bg-black/70 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-2 border-dashed border-[#1DB954]/50 z-20"
                        >
                            <User className="w-10 h-10 text-[#1DB954] mb-2" />
                            <span className="text-[10px] font-black uppercase text-white tracking-[0.2em] text-center px-6">Alterar Mídia</span>
                        </label>
                    )}
                </div>

                <div className="text-center md:text-left space-y-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.4em] mb-1">Perfil de Membro</p>
                        <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-2xl">
                            {userData?.name || name || email?.split('@')[0] || "..."}
                        </h2>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                        <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] flex items-center gap-2">
                            Membro {userData?.status === 'ACTIVE' ? 'Verificado' : 'Em Análise'}
                            <span className="w-1.5 h-1.5 bg-[#1DB954] rounded-full shadow-[0_0_10px_#1DB954]" />
                            Desde {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : "2024"}
                        </p>

                        <div className={cn(
                            "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest py-2.5 px-6 rounded-full border transition-all shadow-lg",
                            userData?.kycStatus === 'VERIFIED'
                                ? "bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/20"
                                : "bg-white/5 text-[#A7A7A7] border-white/10"
                        )}>
                            {userData?.kycStatus === 'VERIFIED' ? <CheckCircle2 className="w-4 h-4" /> : <Shield className="w-4 h-4 opacity-50" />}
                            {userData?.kycStatus === 'VERIFIED' ? 'Identidade Verificada' : 'Aguardando Validação'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    <Card className="bg-[#0A0A0A] border-[#1DB954]/20 shadow-[0_0_60px_rgba(29,185,84,0.05)] rounded-[3rem] overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between p-10 pb-8 border-b border-white/5 bg-[#1DB954]/[0.01]">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[#1DB954]/10 rounded-xl border border-[#1DB954]/20">
                                    <User className="w-5 h-5 text-[#1DB954]" />
                                </div>
                                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#A7A7A7]">Informações da Conta</CardTitle>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (isEditing) {
                                        setName(userData?.name || "");
                                        setEmail(userData?.email || "");
                                        setBio(userData?.bio || "");
                                        setImage(userData?.image || "");
                                    }
                                    setIsEditing(!isEditing);
                                }}
                                className="rounded-full border-white/10 text-white hover:bg-white/10 font-black uppercase text-[10px] tracking-widest h-12 px-8 transition-all"
                            >
                                {isEditing ? "Descartar" : "Editar Dados"}
                            </Button>
                        </CardHeader>

                        <CardContent className="p-10 space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-4">Nome Completo</label>
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1DB954]/20 to-transparent rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            disabled={!isEditing}
                                            className="relative h-16 px-8 rounded-full bg-[#080808] border-[#1DB954]/10 font-black text-xs text-white disabled:opacity-50 tracking-widest focus-visible:ring-[#1DB954]/40 transition-all"
                                            placeholder="Seu nome completo"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-4">Endereço de Login</label>
                                    <Input
                                        value={email}
                                        readOnly
                                        className="h-16 px-8 rounded-full bg-[#080808] border-white/5 font-black text-xs text-[#555] cursor-not-allowed tracking-widest"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-4">Bio / Descrição</label>
                                    <Input
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        disabled={!isEditing}
                                        className="h-16 px-8 rounded-full bg-[#080808] border-[#1DB954]/10 font-black text-xs text-white disabled:opacity-50 tracking-widest focus-visible:ring-[#1DB954]/40 transition-all"
                                        placeholder="Uma breve descrição sobre você"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-4">Avatar da Rede</label>
                                    <div className="relative group/upload">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            disabled={!isEditing}
                                            className="hidden"
                                            id="avatar-upload"
                                            onChange={handleFileChange}
                                        />
                                        <label
                                            htmlFor="avatar-upload"
                                            className={cn(
                                                "h-16 px-8 rounded-full bg-[#080808] border border-white/5 font-black text-[10px] text-white flex items-center justify-between cursor-pointer transition-all",
                                                !isEditing && "opacity-50 cursor-not-allowed",
                                                isEditing && "hover:border-[#1DB954]/40 hover:bg-[#1DB954]/10"
                                            )}
                                        >
                                            <span className="uppercase tracking-widest">{image ? "Arquivo Carregado" : "Selecionar do Arquivo"}</span>
                                            <Plus className="w-5 h-5 text-[#1DB954]" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        {isEditing && (
                            <CardFooter className="p-10 pt-0">
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full h-16 rounded-full bg-[#1DB954] text-black hover:bg-[#1ED760] font-black uppercase text-[11px] tracking-[0.4em] shadow-[0_20px_40px_rgba(29,185,84,0.2)] transition-all border-none"
                                >
                                    {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : "SALVAR ALTERAÇÕES NO PERFIL"}
                                </Button>
                            </CardFooter>
                        )}
                    </Card>

                    <Card className="bg-[#0A0A0A] border-[#1DB954]/20 shadow-[0_0_60px_rgba(29,185,84,0.05)] rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-10 pb-6 border-b border-white/5">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#A7A7A7]">Camada de Proteção</CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-6">
                            {[
                                { title: "Autenticação 2FA", status: "Ativo via Google Auth", action: "Configurar" },
                                { title: "Chave Privada", status: "Chave Mestra Ativa", action: "Visualizar" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-6 bg-[#080808] rounded-[2.5rem] border border-white/5 hover:border-[#1DB954]/30 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-[#1DB954]/10 rounded-2xl flex items-center justify-center border border-[#1DB954]/20 group-hover:bg-[#1DB954] group-hover:text-black transition-all">
                                            <Shield className="w-6 h-6 text-[#1DB954] group-hover:text-black" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white uppercase tracking-widest">{item.title}</p>
                                            <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1 opacity-60">{item.status}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="rounded-full h-10 px-6 border-white/10 text-[#A7A7A7] hover:text-white font-black uppercase text-[9px] tracking-widest">
                                        {item.action}
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    <Card className="bg-[#0A0A0A] border-[#1DB954]/20 shadow-[0_0_80px_rgba(29,185,84,0.1)] rounded-[3rem] overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#1DB954]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px]" />
                        <CardHeader className="p-10">
                            <CardTitle className="text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                                <TrendingUp className="w-4 h-4 text-[#1DB954]" />
                                Nível de Acesso
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 space-y-8">
                            <div className="bg-[#1DB954]/5 p-8 rounded-[2.5rem] border border-[#1DB954]/20 shadow-inner">
                                <div className="flex items-center gap-3 text-[#1DB954] font-black text-2xl tracking-tighter uppercase mb-2">
                                    <CheckCircle2 className="w-6 h-6" />
                                    Elite Gold
                                </div>
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] leading-relaxed">
                                    Cota operacional de até <span className="text-white">100.000 PTS</span> por ciclo.
                                </p>
                            </div>
                            <Button className="w-full h-16 bg-[#1DB954] text-black hover:bg-[#1ED760] rounded-full font-black uppercase text-[10px] tracking-[0.3em] border-none shadow-[0_20px_40px_rgba(29,185,84,0.2)]">
                                Solicitar Upgrade
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0A0A0A] border border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
                        <CardContent className="p-10 flex gap-6 items-start">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                <AlertCircle className="w-6 h-6 text-[#A7A7A7]" />
                            </div>
                            <div className="space-y-3">
                                <p className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Auditoria do Sistema</p>
                                <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.2em] leading-loose">
                                    As informações fornecidas são processadas e validadas pela rede <span className="text-white">Pointify Nodes</span> para garantir a segurança da infraestrutura.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>


    );
}
