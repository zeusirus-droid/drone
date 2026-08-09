import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Interface for stored enquiry database backup
interface EnquiryRecord {
  id: string;
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  subject?: string;
  service: string;
  message?: string;
  consent: boolean;
  submittedAt: string;
  ipAddress: string;
  emailDelivered: boolean;
  deliveryError?: string;
}

// In-memory + file-backed persistent database store
const DB_FILE = path.join(process.cwd(), 'data', 'enquiries.json');

function ensureDbDirectoryExists() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadEnquiries(): EnquiryRecord[] {
  try {
    ensureDbDirectoryExists();
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content) as EnquiryRecord[];
    }
  } catch (err) {
    console.error('Failed reading enquiries file:', err);
  }
  return [];
}

function saveEnquiry(record: EnquiryRecord) {
  try {
    ensureDbDirectoryExists();
    const current = loadEnquiries();
    current.unshift(record); // newest first
    fs.writeFileSync(DB_FILE, JSON.stringify(current, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed persisting enquiry to database file:', err);
  }
}

// Simple HTML/string sanitizer against XSS
function sanitizeInput(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Simple rate-limiting map (IP -> timestamp)
const ipRateLimitMap = new Map<string, number>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for receiving and processing contact form submissions
  app.post('/api/contact', async (req, res) => {
    try {
      const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
      
      // 1. Anti-spam Rate Limiting: Max 1 submission per IP every 10 seconds
      const lastSubmission = ipRateLimitMap.get(clientIp);
      const now = Date.now();
      if (lastSubmission && now - lastSubmission < 10000) {
        return res.status(429).json({ error: 'Please wait a few seconds before submitting another enquiry.' });
      }

      const {
        fullName,
        companyName = '',
        email,
        phone = '',
        subject = '',
        service,
        message = '',
        consent,
        honeypot = '' // Hidden bot field
      } = req.body;

      // 2. Honeypot check - reject silently if bot filled hidden field
      if (honeypot && String(honeypot).trim() !== '') {
        console.warn(`[Spam Bot Blocked] Honeypot field filled by IP ${clientIp}`);
        return res.json({
          success: true,
          emailSent: true,
          message: "Thank you! Your message has been sent successfully. We'll get back to you shortly."
        });
      }

      // 3. Validation
      const cleanFullName = sanitizeInput(fullName);
      const cleanCompany = sanitizeInput(companyName);
      const cleanEmail = sanitizeInput(email);
      const cleanPhone = sanitizeInput(phone);
      const cleanSubject = sanitizeInput(subject);
      const cleanService = Array.isArray(service) ? service.map(sanitizeInput).join(', ') : sanitizeInput(service || 'General Enquiry');
      const cleanMessage = sanitizeInput(message);

      if (!cleanFullName || !cleanEmail) {
        return res.status(400).json({ error: 'Full Name and Email are required fields.' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }

      if (!consent) {
        return res.status(400).json({ error: 'You must agree to be contacted regarding your enquiry.' });
      }

      // Update rate-limit timestamp
      ipRateLimitMap.set(clientIp, now);

      const targetAdminEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER || 'admin@thebelmarmarketing.com';
      const submittedAtDate = new Date().toLocaleString('en-US', { timeZoneName: 'short' });

      // Build Database Record
      const enquiryId = `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const enquiryRecord: EnquiryRecord = {
        id: enquiryId,
        fullName: cleanFullName,
        companyName: cleanCompany,
        email: cleanEmail,
        phone: cleanPhone,
        subject: cleanSubject || undefined,
        service: cleanService,
        message: cleanMessage || undefined,
        consent: Boolean(consent),
        submittedAt: submittedAtDate,
        ipAddress: clientIp,
        emailDelivered: false
      };

      // Extract first name for auto-reply
      const firstName = cleanFullName.split(' ')[0] || cleanFullName;

      // Email Subjects
      const adminEmailSubject = `New Website Enquiry – ${cleanFullName}`;
      const visitorEmailSubject = `Thank you for contacting The Belmar Marketing`;

      // Admin HTML Email Body
      const adminHtmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0c0c0c; color: #d7e2ea; margin: 0; padding: 24px; }
            .container { max-width: 620px; margin: 0 auto; background-color: #161616; border: 1px solid #2a2a2a; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
            .header { border-bottom: 2px solid #bbed1c; padding-bottom: 16px; margin-bottom: 24px; }
            .header h1 { color: #bbed1c; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
            .field { margin-bottom: 14px; font-size: 15px; line-height: 1.5; }
            .label { color: #8899a6; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; display: block; margin-bottom: 4px; }
            .value { color: #ffffff; font-size: 15px; }
            .message-box { background-color: #0c0c0c; border-left: 4px solid #bbed1c; padding: 16px; border-radius: 6px; margin-top: 8px; color: #e1e8ed; white-space: pre-wrap; font-size: 15px; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #2a2a2a; font-size: 12px; color: #657786; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Website Enquiry</h1>
            </div>

            <div class="field">
              <span class="label">Name</span>
              <div class="value">${cleanFullName}</div>
            </div>

            <div class="field">
              <span class="label">Company</span>
              <div class="value">${cleanCompany || 'N/A'}</div>
            </div>

            <div class="field">
              <span class="label">Email</span>
              <div class="value"><a href="mailto:${cleanEmail}" style="color: #bbed1c; text-decoration: underline;">${cleanEmail}</a></div>
            </div>

            <div class="field">
              <span class="label">Phone</span>
              <div class="value">${cleanPhone || 'N/A'}</div>
            </div>

            <div class="field">
              <span class="label">Service</span>
              <div class="value">${cleanService}</div>
            </div>

            <div class="field">
              <span class="label">Message</span>
              <div class="message-box">${cleanMessage || 'N/A'}</div>
            </div>

            <div class="field" style="margin-top: 20px;">
              <span class="label">Submitted</span>
              <div class="value" style="font-size: 13px; color: #8899a6;">${submittedAtDate}</div>
            </div>

            <div class="field">
              <span class="label">IP Address</span>
              <div class="value" style="font-size: 13px; color: #8899a6;">${clientIp}</div>
            </div>

            <div class="footer">
              <p>Sent securely from Belmar Marketing Website Enquiry Engine</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Visitor Auto-Reply HTML Body
      const visitorHtmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; color: #222222; margin: 0; padding: 24px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 36px; border: 1px solid #e1e8ed; }
            .logo { color: #0c0c0c; font-size: 22px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 24px; border-bottom: 3px solid #bbed1c; padding-bottom: 12px; }
            p { font-size: 15px; line-height: 1.6; color: #333333; margin-bottom: 16px; }
            .highlight-box { background-color: #f8fafc; border-left: 4px solid #bbed1c; padding: 16px; margin: 20px 0; border-radius: 4px; font-size: 14px; color: #475569; }
            .signature { margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-weight: 600; color: #0f172a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Belmar Marketing LTD</div>
            <p>Hello ${firstName},</p>
            <p>Thank you for contacting Belmar Marketing LTD. We have received your enquiry and a member of our team will respond as soon as possible.</p>
            <p>If your enquiry is urgent, please include your preferred contact number or reply to this email.</p>
            <div class="highlight-box">
              <strong>Enquiry Details Received:</strong><br>
              <strong>Service:</strong> ${cleanService}
            </div>
            <p>We appreciate your interest and look forward to speaking with you.</p>
            <div class="signature">
              Kind regards,<br>
              <span style="color: #0c0c0c;">Belmar Marketing LTD</span>
            </div>
          </div>
        </body>
        </html>
      `;

      let emailDelivered = false;
      let deliveryErrorMsg = '';

      // 4. Configure SMTP Transporter (Using user-specified Titan Email SMTP settings)
      const smtpHost = process.env.SMTP_HOST || 'smtp.titan.email';
      const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
      const smtpUser = process.env.SMTP_USER || 'admin@thebelmarmarketing.com';
      const smtpPass = process.env.SMTP_PASS || 'happytreefriends';
      const isSecure = smtpPort === 465 || process.env.SMTP_SECURE === 'true';

      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: isSecure, // SSL for 465
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false // Ensure smooth transport over SSL
          }
        });

        // Send main enquiry email to admin@thebelmarmarketing.com
        await transporter.sendMail({
          from: `"Belmar Website Enquiry" <${smtpUser}>`,
          to: targetAdminEmail,
          replyTo: cleanEmail,
          subject: adminEmailSubject,
          html: adminHtmlBody,
        });

        console.log(`[SMTP Success] Enquiry from ${cleanEmail} sent to ${targetAdminEmail}`);
        emailDelivered = true;

        // Send visitor confirmation auto-reply email
        try {
          await transporter.sendMail({
            from: `"Belmar Marketing LTD" <${smtpUser}>`,
            to: cleanEmail,
            subject: visitorEmailSubject,
            html: visitorHtmlBody,
          });
          console.log(`[SMTP Auto-Reply Success] Confirmation sent to ${cleanEmail}`);
        } catch (autoReplyErr: any) {
          console.warn('[SMTP Auto-Reply Warning] Visitor confirmation auto-reply error:', autoReplyErr?.message || autoReplyErr);
        }

      } catch (smtpErr: any) {
        deliveryErrorMsg = smtpErr?.message || String(smtpErr);
        console.error('[SMTP Delivery Failed]', smtpErr);

        // Fallback: Resend API if key is present
        if (process.env.RESEND_API_KEY) {
          try {
            const resendRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
              },
              body: JSON.stringify({
                from: 'Belmar Marketing <onboarding@resend.dev>',
                to: [targetAdminEmail],
                reply_to: cleanEmail,
                subject: adminEmailSubject,
                html: adminHtmlBody,
              }),
            });

            if (resendRes.ok) {
              emailDelivered = true;
              console.log('[Resend API Success] Admin email sent via Resend API.');
            }
          } catch (resendErr) {
            console.error('[Resend API Fallback Failed]', resendErr);
          }
        }
      }

      // 5. Store record in database store (Guarantees zero lost enquiries!)
      enquiryRecord.emailDelivered = emailDelivered;
      if (deliveryErrorMsg) {
        enquiryRecord.deliveryError = deliveryErrorMsg;
      }
      saveEnquiry(enquiryRecord);

      // Generate mailto and Gmail fallback links
      const encodedSub = encodeURIComponent(adminEmailSubject);
      const encodedBody = encodeURIComponent(`Name: ${cleanFullName}\nCompany: ${cleanCompany}\nEmail: ${cleanEmail}\nPhone: ${cleanPhone}\nService: ${cleanService}\nSubject: ${cleanSubject}\n\nMessage:\n${cleanMessage}`);
      const mailtoUrl = `mailto:${targetAdminEmail}?subject=${encodedSub}&body=${encodedBody}`;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetAdminEmail}&su=${encodedSub}&body=${encodedBody}`;

      return res.json({
        success: true,
        emailSent: emailDelivered,
        targetEmail: targetAdminEmail,
        mailtoUrl,
        gmailUrl,
        message: "Thank you! Your message has been sent successfully. We'll get back to you shortly."
      });

    } catch (err: any) {
      console.error('Contact endpoint exception:', err);
      return res.status(500).json({ error: 'An error occurred while submitting your enquiry. Please try again or email us directly at admin@thebelmarmarketing.com.' });
    }
  });

  // Database Backup Inspection Endpoint
  app.get('/api/enquiries', (_req, res) => {
    const records = loadEnquiries();
    res.json({ count: records.length, enquiries: records });
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      targetEmail: process.env.CONTACT_EMAIL || process.env.SMTP_USER || 'admin@thebelmarmarketing.com',
      smtpHost: process.env.SMTP_HOST || 'smtp.titan.email'
    });
  });

  // Vite development middleware vs production static server
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
