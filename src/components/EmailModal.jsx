import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Clock, 
  Save, 
  CheckCircle2, 
  X, 
  User, 
  Building2, 
  Sparkles, 
  Tag, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EmailModal({ 
  selectedLead, 
  selectedHoarding, 
  outreachList, 
  setOutreachList, 
  onClose 
}) {
  const [subject, setSubject] = useState(
    selectedLead?.pitchHeadline || `Exclusive OOH Availability: ${selectedHoarding?.location}`
  );
  const [body, setBody] = useState(
    selectedLead?.pitchContent || `Hi ${selectedLead?.customerName} Team,\n\nWe have reserved a prime billboard site for your upcoming campaigns.`
  );
  const [offer, setOffer] = useState(selectedLead?.suggestedPricing || `₹${(selectedHoarding?.monthlyRate / 100000).toFixed(2)}L / mo`);
  const [cta, setCta] = useState("Lock 3-Month Exclusive Booking");
  const [toastMessage, setToastMessage] = useState(null);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleAction = (statusType) => {
    const newEntry = {
      id: `OUT-${Math.floor(100 + Math.random() * 900)}`,
      clientName: selectedLead?.customerName || "Enterprise Lead",
      hoardingId: selectedHoarding?.id || "H-101",
      location: selectedHoarding?.location ? selectedHoarding.location.split(',')[0] : "Worli Sea Link",
      subject: subject,
      status: statusType, // Sent, Scheduled, Pending
      dateSent: statusType === 'Sent' 
        ? new Date().toISOString().replace('T', ' ').substring(0, 16)
        : statusType === 'Scheduled' 
          ? 'Scheduled for Tomorrow 09:00' 
          : 'Draft Saved',
      offer: offer,
      cta: cta
    };

    setOutreachList([newEntry, ...outreachList]);

    if (statusType === 'Sent' || statusType === 'Scheduled') {
      triggerConfetti();
    }

    setToastMessage(`Outreach ${statusType} Successfully!`);
    setTimeout(() => {
      setToastMessage(null);
      if (onClose) onClose();
    }, 1500);
  };

  return (
    <div className="email-modal-overlay">
      <div className="email-modal-container dashboard-card">
        <div className="card-header modal-header">
          <div className="card-title">
            <Mail size={20} className="text-brand-icon" />
            <span>AI Email Outreach Agent</span>
          </div>

          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {toastMessage && (
          <div className="toast-banner">
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="card-body modal-body-grid">
          {/* Left Column: Email Composer */}
          <div className="composer-column">
            <div className="field-group">
              <label className="field-label"><User size={13} /> Recipient Corporate Client:</label>
              <input 
                type="text" 
                className="input-field font-bold" 
                value={`${selectedLead?.customerName || 'Swiggy Instamart'} (${selectedLead?.industry || 'Quick Commerce'})`} 
                readOnly 
              />
            </div>

            <div className="field-group">
              <label className="field-label"><Building2 size={13} /> Hoarding Site & City:</label>
              <input 
                type="text" 
                className="input-field" 
                value={`${selectedHoarding?.id}: ${selectedHoarding?.location}`} 
                readOnly 
              />
            </div>

            <div className="field-group">
              <label className="field-label"><Sparkles size={13} /> AI Generated Subject Line:</label>
              <input 
                type="text" 
                className="input-field" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
              />
            </div>

            <div className="field-group">
              <label className="field-label">Email Body Content:</label>
              <textarea 
                className="textarea-field font-mono" 
                rows="7"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              ></textarea>
            </div>

            <div className="grid-2 gap-2">
              <div className="field-group">
                <label className="field-label"><Tag size={13} /> Suggested Offer Rate:</label>
                <input 
                  type="text" 
                  className="input-field text-emerald font-bold" 
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label className="field-label">Call To Action (CTA):</label>
                <input 
                  type="text" 
                  className="input-field font-bold" 
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                />
              </div>
            </div>

            {/* Email Actions */}
            <div className="composer-actions">
              <button 
                className="btn btn-primary flex-1"
                onClick={() => handleAction('Sent')}
              >
                <Send size={15} />
                Send Email Now
              </button>

              <button 
                className="btn btn-secondary flex-1"
                onClick={() => handleAction('Scheduled')}
              >
                <Clock size={15} />
                Schedule Outreach
              </button>

              <button 
                className="btn btn-outline"
                onClick={() => handleAction('Pending')}
              >
                <Save size={15} />
                Save Draft
              </button>
            </div>
          </div>

          {/* Right Column: Outreach Status Queue */}
          <div className="status-queue-column">
            <h4 className="queue-title">
              <Clock size={15} />
              Recent AI Outreach Status
            </h4>

            <div className="status-list">
              {outreachList.map((item) => (
                <div key={item.id} className="status-card">
                  <div className="status-card-header">
                    <span className="status-client-name">{item.clientName}</span>
                    <span className={`badge badge-${item.status.toLowerCase() === 'sent' ? 'success' : item.status.toLowerCase() === 'scheduled' ? 'high' : 'moderate'}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="status-subject">{item.subject}</div>
                  
                  <div className="status-footer">
                    <span className="status-date">{item.dateSent}</span>
                    <span className="status-location">{item.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .email-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1.5rem;
        }

        .email-modal-container {
          width: 100%;
          max-width: 1100px;
          max-height: 90vh;
          overflow-y: auto;
          background-color: var(--bg-card);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
        }

        .modal-header {
          position: sticky;
          top: 0;
          background-color: var(--bg-card);
          z-index: 10;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.35rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          color: var(--text-primary);
          background-color: var(--bg-hover);
        }

        .toast-banner {
          background-color: var(--badge-success-bg);
          color: var(--badge-success-text);
          padding: 0.65rem 1.5rem;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }

        .modal-body-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 1.5rem;
        }

        .field-group {
          margin-bottom: 0.85rem;
        }

        .field-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 0.3rem;
        }

        .input-field, .textarea-field {
          width: 100%;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.55rem 0.75rem;
          font-size: 0.85rem;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s ease;
        }

        .input-field:focus, .textarea-field:focus {
          border-color: var(--brand-primary);
        }

        .composer-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.25rem;
        }

        .status-queue-column {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex;
          flex-direction: column;
        }

        .queue-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.85rem;
        }

        .status-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          overflow-y: auto;
          max-height: 480px;
        }

        .status-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.75rem;
        }

        .status-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.35rem;
        }

        .status-client-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .status-subject {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .status-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .gap-2 { gap: 0.5rem; }

        @media (max-width: 900px) {
          .modal-body-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
