import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Domínio remetente — use o domínio verificado na Resend.
// Em sandbox (sem domínio verificado), use onboarding@resend.dev
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const APP_NAME = "Pointify";

export async function sendVerificationEmail(
  toEmail: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: toEmail,
      subject: `${code} é seu código de verificação — ${APP_NAME}`,
      html: buildVerificationEmailHtml(code, toEmail),
    });

    if (error) {
      console.error("[Resend] Erro ao enviar email:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("[Email] Falha geral:", err);
    return { success: false, error: err?.message || "Erro desconhecido" };
  }
}

export async function sendPasswordResetEmail(
  toEmail: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: toEmail,
      subject: `${code} é seu código de recuperação — ${APP_NAME}`,
      html: buildResetEmailHtml(code, toEmail),
    });

    if (error) {
      console.error("[Resend] Erro ao enviar email de reset:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("[Email] Falha geral no reset:", err);
    return { success: false, error: err?.message || "Erro desconhecido" };
  }
}

function buildResetEmailHtml(code: string, email: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Recupere sua conta — Pointify</title>
</head>
<body style="margin:0;padding:0;background-color:#0B0B0B;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0B0B;min-height:100vh;">
    <tr>
      <td align="center" style="padding:60px 20px;">
        <table width="100%" style="max-width:560px;background:#111;border-radius:32px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;">
          
          <!-- Header / Logo -->
          <tr>
            <td style="padding:48px 48px 32px;text-align:center;background:linear-gradient(135deg,rgba(255,200,0,0.08),transparent);">
              <div style="display:inline-block;background:#0f0f0f;border:1px solid rgba(255,200,0,0.3);border-radius:20px;padding:14px 28px;margin-bottom:32px;">
                <span style="font-size:22px;font-weight:900;color:#FFC107;letter-spacing:-0.5px;">⬡ POINTIFY</span>
              </div>
              <p style="margin:0;font-size:11px;font-weight:800;color:#FFC107;letter-spacing:4px;text-transform:uppercase;">Recuperação de Chave</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:8px 48px 48px;">
              <h1 style="margin:0 0 12px;font-size:28px;font-weight:900;color:#fff;letter-spacing:-1px;text-transform:uppercase;">Solicitação de Reset</h1>
              <p style="margin:0 0 36px;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6;">
                Você solicitou a redefinição de sua chave criptográfica para o identificador <strong style="color:rgba(255,255,255,0.7);">${email}</strong>. Use o código de segurança abaixo:
              </p>

              <!-- Code Block -->
              <div style="background:#0B0B0B;border:1px solid rgba(255,200,0,0.2);border-radius:24px;padding:32px 20px;text-align:center;margin-bottom:36px;">
                <p style="margin:0 0 12px;font-size:10px;font-weight:800;color:rgba(255,255,255,0.3);letter-spacing:4px;text-transform:uppercase;">Chave de Recuperação Temporária</p>
                <span style="font-size:52px;font-weight:900;color:#FFC107;letter-spacing:12px;font-family:'Courier New',monospace;">${code}</span>
              </div>

              <!-- Expiry Warning -->
              <div style="background:rgba(255,200,0,0.04);border:1px solid rgba(255,200,0,0.1);border-radius:16px;padding:16px 20px;margin-bottom:36px;display:flex;align-items:center;gap:12px;">
                <span style="font-size:16px;">⏱</span>
                <p style="margin:0;font-size:11px;font-weight:700;color:rgba(255,200,0,0.7);letter-spacing:1px;text-transform:uppercase;">Válido por apenas 15 minutos</p>
              </div>

              <p style="margin:0 0 8px;font-size:11px;color:rgba(255,255,255,0.25);line-height:1.7;">
                Se você não iniciou esta ação, recomendamos trocar suas senhas imediatamente ou entrar em contato com o suporte em compliance@pointify.com.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;border-top:1px solid rgba(255,255,255,0.04);">
              <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.2);text-align:center;letter-spacing:1px;text-transform:uppercase;">
                © ${new Date().getFullYear()} Pointify Global · Quantum Protected
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

function buildVerificationEmailHtml(code: string, email: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verifique seu e-mail — Pointify</title>
</head>
<body style="margin:0;padding:0;background-color:#0B0B0B;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0B0B;min-height:100vh;">
    <tr>
      <td align="center" style="padding:60px 20px;">
        <table width="100%" style="max-width:560px;background:#111;border-radius:32px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;">
          
          <!-- Header / Logo -->
          <tr>
            <td style="padding:48px 48px 32px;text-align:center;background:linear-gradient(135deg,rgba(29,185,84,0.08),transparent);">
              <div style="display:inline-block;background:#0f0f0f;border:1px solid rgba(29,185,84,0.3);border-radius:20px;padding:14px 28px;margin-bottom:32px;">
                <span style="font-size:22px;font-weight:900;color:#1DB954;letter-spacing:-0.5px;">⬡ POINTIFY</span>
              </div>
              <p style="margin:0;font-size:11px;font-weight:800;color:#1DB954;letter-spacing:4px;text-transform:uppercase;">Verificação de Identidade</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:8px 48px 48px;">
              <h1 style="margin:0 0 12px;font-size:28px;font-weight:900;color:#fff;letter-spacing:-1px;text-transform:uppercase;">Seu código chegou</h1>
              <p style="margin:0 0 36px;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6;">
                Use o código abaixo para verificar o endereço <strong style="color:rgba(255,255,255,0.7);">${email}</strong> e continuar seu cadastro na Pointify.
              </p>

              <!-- Code Block -->
              <div style="background:#0B0B0B;border:1px solid rgba(29,185,84,0.2);border-radius:24px;padding:32px 20px;text-align:center;margin-bottom:36px;">
                <p style="margin:0 0 12px;font-size:10px;font-weight:800;color:rgba(255,255,255,0.3);letter-spacing:4px;text-transform:uppercase;">Código de 6 dígitos</p>
                <span style="font-size:52px;font-weight:900;color:#1DB954;letter-spacing:12px;font-family:'Courier New',monospace;">${code}</span>
              </div>

              <!-- Expiry Warning -->
              <div style="background:rgba(255,200,0,0.04);border:1px solid rgba(255,200,0,0.1);border-radius:16px;padding:16px 20px;margin-bottom:36px;display:flex;align-items:center;gap:12px;">
                <span style="font-size:16px;">⏱</span>
                <p style="margin:0;font-size:11px;font-weight:700;color:rgba(255,200,0,0.7);letter-spacing:1px;text-transform:uppercase;">Este código expira em 15 minutos</p>
              </div>

              <p style="margin:0 0 8px;font-size:11px;color:rgba(255,255,255,0.25);line-height:1.7;">
                Se você não solicitou este código, ignore este e-mail com segurança — sua conta está protegida.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;border-top:1px solid rgba(255,255,255,0.04);">
              <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.2);text-align:center;letter-spacing:1px;text-transform:uppercase;">
                © ${new Date().getFullYear()} Pointify · Todos os direitos reservados
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
