import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPaymentConfirmationEmail(params: {
  to: string;
  name: string;
  plan: string;
  months: number;
  amount: number;
  expiresAt: Date;
}) {
  const { to, name, months, amount, expiresAt } = params;
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to,
    subject: "PharmaPrep Uganda – Premium Access Confirmed 🎉",
    html: `
      <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #F8FAFC; border-radius: 16px;">
        <h1 style="color: #1A56DB; font-size: 24px;">Welcome to PharmaPrep Premium, ${name}! 🎉</h1>
        <p style="color: #0F172A;">Your premium access has been activated successfully.</p>
        <div style="background: white; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #E2E8F0;">
          <p><strong>Plan:</strong> Premium (${months} Month${months > 1 ? "s" : ""})</p>
          <p><strong>Amount Paid:</strong> UGX ${amount.toLocaleString()}</p>
          <p><strong>Expires:</strong> ${expiresAt.toLocaleDateString("en-UG", { dateStyle: "long" })}</p>
        </div>
        <p style="color: #0F172A;">You now have access to all premium notes, questions, and features.</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background: #1A56DB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Start Studying →
        </a>
        <p style="color: #94A3B8; font-size: 12px; margin-top: 32px;">PharmaPrep Uganda – Empowering Pharmacy Excellence</p>
      </div>
    `,
  });
}
