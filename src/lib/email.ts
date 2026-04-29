import nodemailer from 'nodemailer'

const EMAIL_HOST = process.env.EMAIL_HOST
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587', 10)
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.ADMIN_EMAIL || 'no-reply@rditlab.co.uk'
const ALERT_EMAIL = process.env.ALERT_EMAIL || process.env.ADMIN_EMAIL
const EMAIL_SECURE = process.env.EMAIL_SECURE === 'true'

const isEmailConfigured = Boolean(
  EMAIL_HOST &&
    EMAIL_PORT &&
    EMAIL_USER &&
    EMAIL_PASS &&
    ALERT_EMAIL
)

function createTransporter() {
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  })
}

export interface SendEmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail(options: SendEmailOptions) {
  if (!isEmailConfigured) {
    console.warn('Email configuration is incomplete. Skipping sendEmail call.')
    return
  }

  const transporter = createTransporter()

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  })
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
