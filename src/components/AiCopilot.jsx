import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Copy, 
  RefreshCw, 
  Mail, 
  Check, 
  DollarSign, 
  Zap, 
  Send,
  FileText
} from 'lucide-react';
import { fetchCopilotPitch } from '../services/api';

export default function AiCopilot({ selectedHoarding, selectedLead, onOpenEmailPreview }) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copilotData, setCopilotData] = useState(null);

  useEffect(() => {
    async function loadPitch() {
      if (!selectedHoarding || !selectedLead) return;
      setIsGenerating(true);
      try {
        const res = await fetchCopilotPitch(selectedHoarding, selectedLead, selectedLead.leadScore || 95);
        if (res.success && res.data) {
          setCopilotData(res.data);
        }
      } catch (err) {
        console.warn("Using fallback local pitch:", err.message);
      } finally {
        setIsGenerating(false);
      }
    }

    loadPitch();
  }, [selectedHoarding?.id, selectedHoarding?.hoardingId, selectedLead?.id, selectedLead?.customerName]);

  const pitch = copilotData?.pitch || selectedLead?.pitchContent || "Select a hoarding and lead to generate pitch.";
  const headline = copilotData?.headline || selectedLead?.pitchHeadline || "Personalized Sales Pitch";
  const pricing = copilotData?.suggestedPricing || selectedLead?.suggestedPricing || `₹${(selectedHoarding?.monthlyRate / 100000).toFixed(2)}L / mo`;
  const whyMatch = copilotData?.whyMatch || `Location demographic captures ${selectedLead?.industry} audience with target budget alignment.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetchCopilotPitch(selectedHoarding, selectedLead, selectedLead?.leadScore || 95);
      if (res.success && res.data) {
        setCopilotData(res.data);
      }
    } catch (err) {
      console.warn("Regenerate failed:", err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="dashboard-card ai-copilot-panel">
      <div className="card-header">
        <div className="card-title">
          <div className="bot-avatar">
            <Bot size={18} className="bot-icon" />
          </div>
          <div>
            <span>AI Sales Copilot</span>
            <span className="copilot-sub font-mono">Gemini Hybrid Engine</span>
          </div>
        </div>

        <button 
          className="btn btn-outline btn-sm"
          onClick={handleRegenerate}
          disabled={isGenerating}
        >
          <RefreshCw size={13} className={isGenerating ? 'spin' : ''} />
          {isGenerating ? 'Generating...' : 'Regenerate'}
        </button>
      </div>

      <div className="card-body">
        {/* Why this customer is a strong match */}
        <div className="copilot-section match-reasons font-sans">
          <div className="section-label">
            <Zap size={14} className="text-amber" />
            <span>Why {selectedLead?.customerName} is a Strong Match:</span>
          </div>
          <ul className="reasons-list">
            <li>
              <Check size={13} className="check-bullet" />
              <span><strong>Demographic Fit:</strong> {selectedHoarding?.dailyImpressions || 'High traffic'} aligns with {selectedLead?.industry} audience.</span>
            </li>
            <li>
              <Check size={13} className="check-bullet" />
              <span><strong>Budget Band:</strong> {selectedLead?.budgetBand} covers monthly rate ({pricing}).</span>
            </li>
            <li>
              <Check size={13} className="check-bullet" />
              <span><strong>Strategic Rationale:</strong> {whyMatch}</span>
            </li>
          </ul>
        </div>

        {/* Suggested Pricing Card */}
        <div className="pricing-box">
          <div className="pricing-header">
            <DollarSign size={16} className="text-emerald" />
            <span>AI Recommended Dynamic Pricing</span>
          </div>
          <div className="pricing-value">{pricing}</div>
          <div className="pricing-tag">Optimized for 94% Conversion Probability</div>
        </div>

        {/* Personalized Pitch Box */}
        <div className="pitch-box">
          <div className="pitch-box-header">
            <div className="pitch-title">
              <FileText size={14} className="text-brand" />
              <span>{headline}</span>
            </div>

            <button 
              className="btn btn-outline btn-sm copy-btn"
              onClick={handleCopy}
            >
              {copied ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy Pitch'}
            </button>
          </div>

          <div className="pitch-content-area font-mono">
            {isGenerating ? "Generating personalized pitch via Gemini AI..." : pitch}
          </div>
        </div>

        {/* Email Preview & Send Action */}
        <div className="copilot-footer-actions">
          <button 
            className="btn btn-secondary flex-1"
            onClick={() => onOpenEmailPreview(selectedLead, pitch)}
          >
            <Mail size={15} />
            Email Preview
          </button>
          <button 
            className="btn btn-primary flex-1"
            onClick={() => onOpenEmailPreview(selectedLead, pitch)}
          >
            <Send size={15} />
            Quick Send
          </button>
        </div>
      </div>

      <style>{`
        .ai-copilot-panel {
          border-left: 3px solid var(--brand-primary);
        }

        .bot-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand-primary), var(--accent-purple));
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .copilot-sub {
          font-size: 0.68rem;
          color: var(--text-muted);
          display: block;
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .text-amber { color: var(--accent-amber); }
        .text-emerald { color: var(--accent-emerald); }
        .text-brand { color: var(--brand-primary); }

        .reasons-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }

        .reasons-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.3;
        }

        .check-bullet {
          color: var(--accent-emerald);
          margin-top: 0.15rem;
          flex-shrink: 0;
        }

        .pricing-box {
          background-color: var(--bg-tertiary);
          border: 1px dashed var(--accent-emerald);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          margin-bottom: 1rem;
        }

        .pricing-header {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .pricing-value {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--accent-emerald);
          margin: 0.2rem 0;
        }

        .pricing-tag {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .pitch-box {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.85rem;
          margin-bottom: 1.25rem;
        }

        .pitch-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.6rem;
        }

        .pitch-title {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .pitch-content-area {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.45;
          white-space: pre-wrap;
          background-color: var(--bg-card);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          max-height: 180px;
          overflow-y: auto;
        }

        .copilot-footer-actions {
          display: flex;
          gap: 0.75rem;
        }

        .flex-1 { flex: 1; }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
