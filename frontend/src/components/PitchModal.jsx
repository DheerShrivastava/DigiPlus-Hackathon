import React, { useState, useEffect } from 'react';
import { Sparkles, Send, X, CheckCircle, Mail, DollarSign } from 'lucide-react';
import { pitchAPI } from '../api/apiClient';

export default function PitchModal({ siteId, customerId, monthlyRate, onClose }) {
  const [loading, setLoading] = useState(true);
  const [pitchData, setPitchData] = useState(null);
  const [rateInput, setRateInput] = useState(monthlyRate || '');
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchPitch();
  }, [siteId, customerId]);

  const fetchPitch = async (customRate = null) => {
    setLoading(true);
    try {
      const data = await pitchAPI.generate(siteId, customerId, customRate || rateInput);
      setPitchData(data);
      if (!customRate) setRateInput(data.suggested_rate);
    } catch (err) {
      console.error("Error generating pitch:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRateUpdate = () => {
    fetchPitch(rateInput);
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);
    try {
      await pitchAPI.sendEmail({
        to_email: 'client-contact@company.com',
        subject: `Exclusive Booking Opportunity: ${siteId} - ${pitchData?.customer_name}`,
        body: pitchData?.pitch_text || '',
        customer_name: pitchData?.customer_name || '',
        site_id: siteId
      });
      setEmailSuccess(true);
      setTimeout(() => setEmailSuccess(false), 4000);
    } catch (err) {
      alert("Failed to dispatch email");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                AI Personalized Pitch Generator
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Site {siteId} → {pitchData?.customer_name || customerId}
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#38bdf8' }}>
              <Sparkles className="spin" size={32} style={{ margin: '0 auto 12px auto' }} />
              <p style={{ fontWeight: 600 }}>Drafting pitch using Gemini AI & site telemetry...</p>
            </div>
          ) : (
            <>
              {/* Rate Customization Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.6)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Custom Offer Rate</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ color: '#10b981', fontWeight: 800 }}>₹</span>
                    <input
                      type="number"
                      value={rateInput}
                      onChange={(e) => setRateInput(e.target.value)}
                      style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#10b981', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', width: '130px', outline: 'none' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>/month</span>
                  </div>
                </div>

                <button onClick={handleRateUpdate} className="glass-button-secondary" style={{ fontSize: '0.78rem', padding: '8px 12px' }}>
                  Recalculate Pitch
                </button>
              </div>

              {/* Pitch Preview Box */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  AI Generated Pitch Content:
                </label>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.88rem',
                  color: '#e2e8f0',
                  lineHeight: '1.6',
                  fontFamily: 'sans-serif'
                }}>
                  {pitchData?.pitch_text}
                </div>
              </div>

              {emailSuccess && (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} />
                  <span>Personalized Pitch Email successfully dispatched to client!</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '16px 24px', background: 'rgba(15, 23, 42, 0.9)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onClose} className="glass-button-secondary">
            Close
          </button>

          <button
            onClick={handleSendEmail}
            disabled={loading || sendingEmail}
            className="glass-button"
            style={{ padding: '12px 24px' }}
          >
            <Send size={16} />
            {sendingEmail ? 'Dispatching Mail...' : 'Send Pitch Email to Client'}
          </button>
        </div>
      </div>
    </div>
  );
}
