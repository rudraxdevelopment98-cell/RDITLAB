import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@rditlab.co.uk'
const ALERT_EMAIL = process.env.ALERT_EMAIL || process.env.ADMIN_EMAIL

const isEmailConfigured = Boolean(RESEND_API_KEY && EMAIL_FROM)

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export interface SendEmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail(options: SendEmailOptions) {
  if (!isEmailConfigured || !resend) {
    console.warn('Resend email configuration is incomplete. Skipping sendEmail call.')
    return
  }

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html || `<p>${options.text}</p>`,
    })

    if (result.error) {
      console.error('Resend email error:', result.error)
    }

    return result
  } catch (error) {
    console.error('Failed to send email via Resend:', error)
    throw error
  }
}

export async function sendAdminNotification(subject: string, text: string, html?: string) {
  if (!ALERT_EMAIL) {
    console.warn('Alert email address is not configured. Skipping admin notification.')
    return
  }

  await sendEmail({
    to: ALERT_EMAIL,
    subject,
    text,
    html,
  })
}
