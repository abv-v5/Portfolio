import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { FiMail, FiPhone, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import { FaLinkedinIn, FaGithub, FaXTwitter } from 'react-icons/fa6';
import emailjs from '@emailjs/browser';

// ── Static data ───────────────────────────────────────────────────────────────

const CONTACT_INFO = [
  {
    id: 'email',
    Icon: FiMail,
    label: 'Email',
    value: 'abhay.devx5@gmail.com',
    href: 'mailto:abhay.devx5@gmail.com',
  },
  {
    id: 'phone',
    Icon: FiPhone,
    label: 'Phone',
    value: '+91 70880 16495',
    href: 'tel:+917088016495',
  },
];

const SOCIALS = [
  {
    id: 'linkedin',
    Icon: FaLinkedinIn,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/abhayverma5/',
    color: '#0ea5e9',
  },
  {
    id: 'github',
    Icon: FaGithub,
    label: 'GitHub',
    href: 'https://github.com/abv-v5',
    color: '#e2e8f0',
  },
  {
    id: 'twitter',
    Icon: FaXTwitter,
    label: 'X (Twitter)',
    href: 'https://x.com/AbhayVerma9798',
    color: '#94a3b8',
  },
];

// Country options with flag emoji (no external library needed)
const COUNTRY_OPTIONS = [
  { value: '+91',  label: '🇮🇳  India (+91)' },
  { value: '+1',   label: '🇺🇸  USA (+1)' },
  { value: '+44',  label: '🇬🇧  UK (+44)' },
  { value: '+61',  label: '🇦🇺  Australia (+61)' },
  { value: '+49',  label: '🇩🇪  Germany (+49)' },
  { value: '+33',  label: '🇫🇷  France (+33)' },
  { value: '+81',  label: '🇯🇵  Japan (+81)' },
  { value: '+86',  label: '🇨🇳  China (+86)' },
  { value: '+971', label: '🇦🇪  UAE (+971)' },
  { value: '+65',  label: '🇸🇬  Singapore (+65)' },
  { value: '+1',   label: '🇨🇦  Canada (+1)' },
  { value: '+7',   label: '🇷🇺  Russia (+7)' },
  { value: '+55',  label: '🇧🇷  Brazil (+55)' },
  { value: '+27',  label: '🇿🇦  South Africa (+27)' },
  { value: '+60',  label: '🇲🇾  Malaysia (+60)' },
];

// react-select custom styles — dark + cyan theme
const selectStyles = {
  control: (base, state) => ({
    ...base,
    background: 'rgba(0,0,0,0.35)',
    border: `1px solid ${state.isFocused ? 'rgba(0,255,255,0.55)' : 'rgba(0,255,255,0.18)'}`,
    borderRadius: '9px',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(0,255,255,0.1)' : 'none',
    minHeight: '42px',
    cursor: 'pointer',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
    '&:hover': {
      borderColor: 'rgba(0,255,255,0.4)',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '2px 10px',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'rgba(255,255,255,0.85)',
    fontSize: '14px',
  }),
  placeholder: (base) => ({
    ...base,
    color: 'rgba(255,255,255,0.22)',
    fontSize: '14px',
  }),
  input: (base) => ({
    ...base,
    color: '#fff',
    fontSize: '14px',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? '#0ff' : 'rgba(0,255,255,0.4)',
    transition: 'color 0.2s ease, transform 0.2s ease',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    padding: '0 10px 0 4px',
    '&:hover': { color: '#0ff' },
  }),
  menu: (base) => ({
    ...base,
    background: '#060d0d',
    border: '1px solid rgba(0,255,255,0.18)',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
    zIndex: 100,
  }),
  menuList: (base) => ({
    ...base,
    padding: '4px',
    maxHeight: '220px',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(0,255,255,0.2) transparent',
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected
      ? 'rgba(0,255,255,0.15)'
      : state.isFocused
      ? 'rgba(0,255,255,0.07)'
      : 'transparent',
    color: state.isSelected ? '#0ff' : 'rgba(255,255,255,0.8)',
    fontSize: '14px',
    borderRadius: '6px',
    padding: '9px 12px',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: 'rgba(255,255,255,0.4)',
    fontSize: '13px',
  }),
};

// ── Contact ───────────────────────────────────────────────────────────────────

function Contact() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [dialCode, setDialCode] = useState(COUNTRY_OPTIONS[0]);
  const [phoneNum, setPhoneNum] = useState('');
  const [status, setStatus] = useState('idle');   // idle | sending | sent
  const [errors, setErrors] = useState({});

  // ── Scroll reveal ─────────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const els = section.querySelectorAll('.scroll-reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Map EmailJS field names to state field names
    const fieldMap = {
      'user_name': 'name',
      'user_email': 'email',
      'subject': 'subject',
      'message': 'message'
    };
    const stateField = fieldMap[name] || name;
    setFormData((prev) => ({ ...prev, [stateField]: value }));
    if (errors[stateField]) setErrors((prev) => ({ ...prev, [stateField]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim())  next.name    = 'Name is required.';
    if (!formData.email.trim()) next.email   = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                            next.email   = 'Enter a valid email.';
    if (!formData.message.trim()) next.message = 'Message cannot be empty.';
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errs = validate();
    if (Object.keys(errs).length) { 
      setErrors(errs); 
      return; 
    }

    setStatus('sending');

    // Send main email using emailjs.sendForm
    emailjs.sendForm(
      'service_8n7u7w8',
      'template_4jnxxcs',
      formRef.current,
      'CvnAuj4V5E2kA2krR'
    )
    .then((result) => {
      console.log('✅ Main email sent:', result.text);
      
      // Send auto-reply email
      return emailjs.send(
        'service_8n7u7w8',
        'template_ue3ng1p',
        {
          user_name: formData.name,
          user_email: formData.email,
          subject: formData.subject || 'Thank you for reaching out',
        },
        'CvnAuj4V5E2kA2krR'
      );
    })
    .then((result) => {
      console.log('✅ Auto-reply sent:', result.text);
      setStatus('sent');
      alert('✅ Message sent successfully! Check your email for confirmation.');
      
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      setDialCode(COUNTRY_OPTIONS[0]);
      setPhoneNum('');
      setErrors({});
      
      // Reset status after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    })
    .catch((error) => {
      console.error('❌ EmailJS Error:', error);
      setStatus('idle');
      alert(`❌ Failed to send message: ${error.text || error.message || 'Unknown error'}. Please try again.`);
    });
  };

  return (
    <section id="contact" className="ctc-section" ref={sectionRef}>
      <div className="ctc-bg-glow" aria-hidden="true" />

      {/* ── Header ── */}
      <div className="ctc-header scroll-reveal reveal-up">
        <span className="ctc-eyebrow">Contact</span>
        <h1 className="ctc-heading">
          Let's <span className="highlight">Connect</span>
        </h1>
        <p className="ctc-subhead">
          Have a project in mind, a question, or just want to say hello?
          Feel free to reach out — I'll get back as soon as I can.
        </p>
      </div>

      {/* ── 2-column body ── */}
      <div className="ctc-body">

        {/* LEFT */}
        <div className="ctc-left scroll-reveal reveal-left">

          <div className="ctc-info-list">
            {CONTACT_INFO.map(({ id, Icon, label, value, href }) => (
              <a key={id} href={href} className="ctc-info-item">
                <span className="ctc-info-icon-wrap"><Icon /></span>
                <div className="ctc-info-text">
                  <span className="ctc-info-label">{label}</span>
                  <span className="ctc-info-value">{value}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="ctc-divider" aria-hidden="true" />

          <p className="ctc-social-label">Find me on</p>
          <div className="ctc-socials">
            {SOCIALS.map(({ id, Icon, label, href, color }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="ctc-social-btn"
                aria-label={label}
                title={label}
                style={{ '--social-color': color }}
              >
                <Icon />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="ctc-right scroll-reveal reveal-right">
          <form className="ctc-form" ref={formRef} onSubmit={handleSubmit} noValidate>

            {/* Row: Name + Email */}
            <div className="ctc-row">
              <div className="ctc-field">
                <label htmlFor="ctc-name" className="ctc-label">
                  Name <span className="ctc-required">*</span>
                </label>
                <div className="ctc-input-wrap">
                  <span className="ctc-input-icon"><FiUser /></span>
                  <input
                    id="ctc-name"
                    name="user_name"
                    type="text"
                    className="ctc-input ctc-input--iconed"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.name && <p className="ctc-error">{errors.name}</p>}
              </div>

              <div className="ctc-field">
                <label htmlFor="ctc-email" className="ctc-label">
                  Email <span className="ctc-required">*</span>
                </label>
                <div className="ctc-input-wrap">
                  <span className="ctc-input-icon"><FiMail /></span>
                  <input
                    id="ctc-email"
                    name="user_email"
                    type="email"
                    className="ctc-input ctc-input--iconed"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.email && <p className="ctc-error">{errors.email}</p>}
              </div>
            </div>

            {/* Phone field — flag dropdown + number input in one row */}
            <div className="ctc-field">
              <label className="ctc-label">Phone</label>
              <div className="ctc-phone-row">
                <div className="ctc-phone-select">
                  <Select
                    options={COUNTRY_OPTIONS}
                    value={dialCode}
                    onChange={setDialCode}
                    styles={selectStyles}
                    isSearchable={false}
                    placeholder="Country"
                    classNamePrefix="ctc-rs"
                    menuPlacement="auto"
                  />
                </div>
                <input
                  type="tel"
                  className="ctc-input ctc-phone-number"
                  placeholder="Phone number"
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value.replace(/[^0-9\s\-]/g, ''))}
                />
              </div>
              {/* Hidden input for EmailJS to capture combined phone number */}
              <input
                type="hidden"
                name="user_phone"
                value={phoneNum ? `${dialCode.value} ${phoneNum}`.trim() : ''}
              />
            </div>

            {/* Subject */}
            <div className="ctc-field">
              <label htmlFor="ctc-subject" className="ctc-label">Subject</label>
              <div className="ctc-input-wrap">
                <input
                  id="ctc-subject"
                  name="subject"
                  type="text"
                  className="ctc-input"
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Message */}
            <div className="ctc-field">
              <label htmlFor="ctc-message" className="ctc-label">
                Message <span className="ctc-required">*</span>
              </label>
              <div className="ctc-input-wrap">
                <span className="ctc-input-icon ctc-input-icon--top"><FiMessageSquare /></span>
                <textarea
                  id="ctc-message"
                  name="message"
                  className="ctc-input ctc-textarea ctc-input--iconed"
                  placeholder="Write your message here..."
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>
              {errors.message && <p className="ctc-error">{errors.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`ctc-submit${status === 'sending' ? ' ctc-submit--loading' : ''}${status === 'sent' ? ' ctc-submit--sent' : ''}`}
              disabled={status === 'sending'}
            >
              {status === 'sent'    ? 'Message Sent!' :
               status === 'sending' ? 'Sending...' : (
                <><FiSend /> Send Message</>
              )}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
