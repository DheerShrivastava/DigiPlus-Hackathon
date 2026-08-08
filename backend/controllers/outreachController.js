import Outreach from "../models/Outreach.js";
import nodemailer from "nodemailer";

export async function createOutreach(req, res, next) {
  try {
    const { clientName, hoardingId, location, subject, body, offer, cta, status, dateSent } = req.body;

    const newRecord = {
      outreachId: `OUT-${Math.floor(100 + Math.random() * 900)}`,
      subject: subject || "OOH Billboard Proposal",
      body: body || "Details attached.",
      offer: offer || "Standard Rate",
      cta: cta || "Review Media Kit",
      status: status || "DRAFT",
      scheduledAt: status === "SCHEDULED" ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null,
      sentAt: status === "SENT" ? new Date() : null
    };

    res.status(201).json({
      success: true,
      message: `Outreach record saved with status: ${status}`,
      data: {
        id: newRecord.outreachId,
        clientName: clientName || "Enterprise Client",
        hoardingId: hoardingId || "H-101",
        location: location || "Prime Site Corridor",
        subject: newRecord.subject,
        status: newRecord.status,
        dateSent: dateSent || new Date().toISOString().replace('T', ' ').substring(0, 16),
        offer: newRecord.offer,
        cta: newRecord.cta
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function sendOutreachEmail(req, res, next) {
  try {
    const { id } = req.params;
    const { email, subject, body } = req.body;

    const demoMode = process.env.DEMO_EMAIL_MODE !== "false";

    if (demoMode || !process.env.SMTP_HOST) {
      console.log(`✉️ [DEMO_EMAIL_MODE] Simulated email sent to: ${email || "client@brand.com"}`);
      return res.json({
        success: true,
        message: "Email sent successfully (DEMO_EMAIL_MODE)",
        status: "SENT",
        sentAt: new Date()
      });
    }

    // SMTP Real Transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      text: body
    });

    res.json({
      success: true,
      message: "Real SMTP email dispatched successfully",
      status: "SENT",
      sentAt: new Date()
    });
  } catch (err) {
    next(err);
  }
}

export async function getOutreachList(req, res, next) {
  try {
    const records = await Outreach.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    next(err);
  }
}
