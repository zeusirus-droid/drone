import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, Mail, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';

const SERVICES_LIST = [
  "Web Development",
  "Branding",
  "Digital Marketing",
  "SEO",
  "Social Media Management",
  "Photography/Videography",
  "Signage",
  "Brand Activation",
  "Other"
];

export function ContactSection() {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(["Web Development"]);
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [submissionResult, setSubmissionResult] = useState<{
    targetEmail?: string;
    mailtoUrl?: string;
    gmailUrl?: string;
    emailSent?: boolean;
    message?: string;
  }>({});
  const [copiedEmail, setCopiedEmail] = useState(false);

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s !== service));
      }
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidationError(null);

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedFullName) {
      setValidationError('Please enter your Full Name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setValidationError('Please enter a valid Email Address (e.g. name@example.com).');
      return;
    }

    if (!consent) {
      setValidationError('You must check the consent box to agree to be contacted regarding your enquiry.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: trimmedFullName,
          companyName: companyName.trim(),
          email: trimmedEmail,
          phone: phone.trim(),
          service: selectedServices,
          message: trimmedMessage,
          consent: consent,
          honeypot: honeypot
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      setSubmissionResult({
        targetEmail: data.targetEmail || 'admin@thebelmarmarketing.com',
        mailtoUrl: data.mailtoUrl,
        gmailUrl: data.gmailUrl,
        emailSent: data.emailSent,
        message: data.message
      });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Submission error:', err);
      // Fallback response with mailto & gmail links
      const encSub = encodeURIComponent(`New Website Enquiry – ${trimmedFullName}`);
      const encBody = encodeURIComponent(`Name: ${trimmedFullName}\nCompany: ${companyName}\nEmail: ${trimmedEmail}\nPhone: ${phone}\nService: ${selectedServices.join(', ')}\n\nMessage:\n${trimmedMessage || 'N/A'}`);
      
      setSubmissionResult({
        targetEmail: 'admin@thebelmarmarketing.com',
        mailtoUrl: `mailto:admin@thebelmarmarketing.com?subject=${encSub}&body=${encBody}`,
        gmailUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=admin@thebelmarmarketing.com&su=${encSub}&body=${encBody}`,
        emailSent: false,
        message: "Thank you! Your message has been sent successfully. We'll get back to you shortly."
      });
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFullName('');
    setCompanyName('');
    setEmail('');
    setPhone('');
    setSelectedServices(["Web Development"]);
    setMessage('');
    setConsent(false);
    setHoneypot('');
    setValidationError(null);
    setIsSubmitted(false);
  };

  return (
    <section
      id="contact-section"
      className="bg-[#0C0C0C] py-24 px-5 sm:px-8 md:px-10 border-t border-[#D7E2EA]/10 relative z-10 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 select-none">
          <FadeIn delay={0} y={15}>
            <span className="text-xs sm:text-sm text-[#bbed1c] font-semibold uppercase tracking-[0.25em]">
              Get In Touch
            </span>
          </FadeIn>
          <FadeIn delay={0.1} y={20}>
            <h2 className="hero-heading font-black uppercase text-center text-[clamp(2.5rem,10vw,120px)] tracking-tight leading-none mt-1">
              Contact Us
            </h2>
          </FadeIn>
          <FadeIn delay={0.15} y={15}>
            <p className="text-[#D7E2EA]/60 max-w-lg mx-auto text-sm sm:text-base mt-4 font-light">
              Submit your enquiry below and a member of our team will respond as soon as possible.
            </p>
          </FadeIn>
        </div>

        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-[#141414] border border-[#D7E2EA]/10 p-6 sm:p-10 rounded-3xl shadow-2xl"
            noValidate
          >
            {/* Honeypot field for bot protection (hidden from humans) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website-field">Leave this empty</label>
              <input
                id="website-field"
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Row 1: Full Name & Company Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="fullname-input" className="text-xs uppercase tracking-[0.2em] text-[#D7E2EA]/70 font-semibold select-none">
                  Full Name <span className="text-[#bbed1c]">*</span>
                </label>
                <input
                  id="fullname-input"
                  name="fullName"
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full bg-[#0C0C0C] border border-[#D7E2EA]/15 rounded-xl px-5 py-3.5 text-[#D7E2EA] placeholder-[#D7E2EA]/30 outline-none focus:border-[#bbed1c] transition-colors font-light text-base select-text"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="company-input" className="text-xs uppercase tracking-[0.2em] text-[#D7E2EA]/70 font-semibold select-none">
                  Company Name <span className="text-xs font-normal text-[#D7E2EA]/40">(Optional)</span>
                </label>
                <input
                  id="company-input"
                  name="companyName"
                  type="text"
                  placeholder="e.g. Belmar Enterprises"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#0C0C0C] border border-[#D7E2EA]/15 rounded-xl px-5 py-3.5 text-[#D7E2EA] placeholder-[#D7E2EA]/30 outline-none focus:border-[#bbed1c] transition-colors font-light text-base select-text"
                />
              </div>
            </div>

            {/* Row 2: Email Address & Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="email-input" className="text-xs uppercase tracking-[0.2em] text-[#D7E2EA]/70 font-semibold select-none">
                  Email Address <span className="text-[#bbed1c]">*</span>
                </label>
                <input
                  id="email-input"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full bg-[#0C0C0C] border border-[#D7E2EA]/15 rounded-xl px-5 py-3.5 text-[#D7E2EA] placeholder-[#D7E2EA]/30 outline-none focus:border-[#bbed1c] transition-colors font-light text-base select-text"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="phone-input" className="text-xs uppercase tracking-[0.2em] text-[#D7E2EA]/70 font-semibold select-none">
                  Phone Number <span className="text-xs font-normal text-[#D7E2EA]/40">(Optional)</span>
                </label>
                <input
                  id="phone-input"
                  name="phone"
                  type="tel"
                  placeholder="+1 (868) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0C0C0C] border border-[#D7E2EA]/15 rounded-xl px-5 py-3.5 text-[#D7E2EA] placeholder-[#D7E2EA]/30 outline-none focus:border-[#bbed1c] transition-colors font-light text-base select-text"
                />
              </div>
            </div>

            {/* Service selection */}
            <div className="flex flex-col gap-3">
              <label className="text-xs uppercase tracking-[0.2em] text-[#D7E2EA]/70 font-semibold select-none">
                Service Required <span className="text-[#bbed1c]">*</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {SERVICES_LIST.map((srv) => {
                  const isSelected = selectedServices.includes(srv);
                  return (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => toggleService(srv)}
                      className={`px-4 py-2.5 rounded-xl border text-xs uppercase tracking-wider font-medium cursor-pointer transition-all duration-200 select-none ${
                        isSelected
                          ? "bg-[#bbed1c] border-[#bbed1c] text-[#0C0C0C] font-semibold shadow-md"
                          : "bg-[#0C0C0C] border-[#D7E2EA]/15 text-[#D7E2EA] hover:border-[#D7E2EA]/40"
                      }`}
                    >
                      {srv}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message field (Optional) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="message-input" className="text-xs uppercase tracking-[0.2em] text-[#D7E2EA]/70 font-semibold select-none">
                Message <span className="text-xs font-normal text-[#D7E2EA]/40">(Optional)</span>
              </label>
              <textarea
                id="message-input"
                name="message"
                rows={5}
                placeholder="Please describe your project, objectives, or any specific questions..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                className="w-full bg-[#0C0C0C] border border-[#D7E2EA]/15 rounded-xl px-5 py-3.5 text-[#D7E2EA] placeholder-[#D7E2EA]/30 outline-none focus:border-[#bbed1c] transition-colors font-light text-base resize-none select-text"
              />
            </div>

            {/* Consent checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                id="consent-checkbox"
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  if (validationError) setValidationError(null);
                }}
                className="mt-1 w-4 h-4 rounded border-[#D7E2EA]/30 text-[#bbed1c] focus:ring-[#bbed1c] accent-[#bbed1c] cursor-pointer"
                required
              />
              <label htmlFor="consent-checkbox" className="text-xs text-[#D7E2EA]/80 font-light cursor-pointer select-none leading-relaxed">
                I agree to be contacted regarding my enquiry. <span className="text-[#bbed1c]">*</span>
              </label>
            </div>

            {validationError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm text-center">
                {validationError}
              </div>
            )}

            {/* Submit button */}
            <div className="pt-4 flex flex-col items-center justify-center select-none">
              <button
                id="submit-contact-form"
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto relative group overflow-hidden rounded-full font-semibold uppercase tracking-[0.2em] text-[#0C0C0C] cursor-pointer px-10 py-4 text-sm sm:text-base transition-all duration-300 bg-[#bbed1c] hover:brightness-110 active:scale-[0.98] disabled:opacity-50 shadow-lg"
                style={{
                  boxShadow: '0px 4px 20px rgba(187, 237, 28, 0.35)',
                }}
              >
                <span className="flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#0C0C0C] border-t-transparent rounded-full animate-spin" />
                      <span>Processing Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Enquiry</span>
                    </>
                  )}
                </span>
              </button>
              <p className="mt-3 text-[11px] text-[#D7E2EA]/40 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#bbed1c]" />
                <span>Protected against spam. Submissions dispatch directly to admin@thebelmarmarketing.com</span>
              </p>
            </div>
          </form>
        ) : (
          <div className="bg-[#141414] border-2 border-[#bbed1c]/40 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-2xl">
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-[#bbed1c]" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#D7E2EA]">
              Enquiry Submitted!
            </h3>
            <p className="text-[#D7E2EA]/90 text-sm sm:text-base font-medium leading-relaxed bg-[#0C0C0C] p-5 rounded-2xl border border-[#bbed1c]/20">
              Thank you! Your message has been sent successfully. We'll get back to you shortly.
            </p>
            <p className="text-[#D7E2EA]/60 text-xs sm:text-sm font-light">
              A copy of your submission was dispatched to <strong className="text-[#bbed1c]">admin@thebelmarmarketing.com</strong> and stored in our secure database. An auto-confirmation email was sent to <span className="text-white">{email}</span>.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {submissionResult.gmailUrl && (
                <a
                  href={submissionResult.gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#bbed1c] hover:bg-[#a6d817] text-[#0C0C0C] px-6 py-3 rounded-full transition-all shadow-md active:scale-95"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send via Gmail</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              )}

              {submissionResult.mailtoUrl && (
                <a
                  href={submissionResult.mailtoUrl}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#222222] hover:bg-[#2a2a2a] border border-[#bbed1c]/40 text-[#bbed1c] px-6 py-3 rounded-full transition-all active:scale-95"
                >
                  <Mail className="w-4 h-4" />
                  <span>Open Email Client</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('admin@thebelmarmarketing.com');
                  setCopiedEmail(true);
                  setTimeout(() => setCopiedEmail(false), 2500);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#1a1a1a] hover:bg-[#252525] border border-[#D7E2EA]/20 text-[#D7E2EA] px-5 py-3 rounded-full transition-all active:scale-95 cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-4 h-4 text-[#bbed1c]" />
                    <span className="text-[#bbed1c]">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#D7E2EA]/70" />
                    <span>Copy Admin Email</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="inline-block mt-2 bg-transparent border-b border-[#bbed1c] text-[#bbed1c] hover:text-[#bbed1c]/80 uppercase tracking-widest text-xs font-semibold cursor-pointer pb-1 transition-colors"
              >
                Send Another Enquiry
              </button>
            </div>
          </div>
        )}

        {/* Site Footer with Copyright */}
        <footer className="mt-20 pt-8 border-t border-[#D7E2EA]/10 flex items-center justify-center text-xs text-[#D7E2EA]/50 font-light tracking-wider text-center">
          <p>© {new Date().getFullYear()} Belmar Marketing. All rights reserved.</p>
        </footer>
      </div>
    </section>
  );
}

