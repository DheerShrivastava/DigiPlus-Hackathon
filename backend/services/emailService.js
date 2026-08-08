import nodemailer from 'nodemailer';
import { config } from '../config.js';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!config.smtp.user || !config.smtp.pass) return null;

  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
  });
  return transporter;
}

export async function sendPitchEmail({ to_email, subject, body, customer_name, site_id }) {
  const transport = getTransporter();

  if (!transport) {
    console.log('================ EMAIL DISPATCHED (Mock – no SMTP configured) ================');
    console.log(`TO: ${to_email}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`BODY:\n${body}`);
    console.log('================================================================================');
    return { status: 'mock', message: `Email logged to console (configure SMTP in .env to send real mail)` };
  }

  const htmlBody = body.replace(/\n/g, '<br>');
  await transport.sendMail({
    from: config.smtp.from,
    to: to_email,
    subject,
    text: body,
    html: `<div style="font-family:sans-serif;line-height:1.6;color:#333">${htmlBody}</div>`,
  });

  return { status: 'sent', message: `Email successfully dispatched to ${to_email}` };
}

export function isSmtpConfigured() {
  return !!(config.smtp.user && config.smtp.pass);
}
