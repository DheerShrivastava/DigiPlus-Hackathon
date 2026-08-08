import React, { useState } from 'react';
import { PlusCircle, X, MapPin, Maximize2, IndianRupee, Calendar, ShieldCheck, Zap } from 'lucide-react';

export default function AddHoardingModal({ onAddHoarding, onClose }) {
  const [formData, setFormData] = useState({
    id: `H-${Math.floor(111 + Math.random() * 888)}`,
    location: '',
    city: 'Mumbai',
    lat: 19.0760,
    lng: 72.8777,
    size: '50ft x 25ft (Illuminated Frame)',
    trafficScore: 90,
    dailyImpressions: '350,000 daily commuters',
    monthlyRate: 650000,
    bookingEndDate: '2026-09-15',
    freeFromDate: '2026-09-16',
    revenueAtRisk: 1300000,
    urgency: 'high',
    demandLevel: 'High',
    occupancyRate: 88,
    bookingFrequency: '18 campaigns / yr',
    peakHours: '08:30 AM - 11:30 AM & 05:30 PM - 09:00 PM',
    permitStatus: 'Verified Municipal Media License',
    lighting: 'High-Power LED Floodlights',
    topInterestedCustomers: ['Zomato', 'Samsung', 'HDFC Bank']
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.location) return;

    onAddHoarding({
      ...formData,
      monthlyRate: Number(formData.monthlyRate),
      revenueAtRisk: Number(formData.revenueAtRisk) || Number(formData.monthlyRate) * 2,
      trafficScore: Number(formData.trafficScore),
      occupancyRate: Number(formData.occupancyRate),
      historicalOccupancy: [80, 82, 85, 88, 90, 88],
      revenuePerformance: [5.0, 5.5, 6.0, 6.2, 6.5, 6.2]
    });
    onClose();
  };

  return (
    <div className="email-modal-overlay">
      <div className="email-modal-container dashboard-card" style={{ maxWidth: '650px' }}>
        <div className="card-header">
          <div className="card-title">
            <PlusCircle size={20} className="text-brand" />
            <span>Add New Hoarding Site Inventory</span>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="card-body">
          <div className="grid-2 gap-2 mb-3">
            <div className="field-group">
              <label className="field-label">Hoarding ID:</label>
              <input type="text" className="input-field font-mono font-bold" value={formData.id} readOnly />
            </div>

            <div className="field-group">
              <label className="field-label">Select City:</label>
              <select 
                className="input-field"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              >
                <option value="Mumbai">Mumbai</option>
                <option value="NCR">Delhi NCR</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
              </select>
            </div>
          </div>

          <div className="field-group mb-3">
            <label className="field-label"><MapPin size={13} /> Full Location & Landmark:</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Western Express Highway Exit 4, Goregaon" 
              required
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="grid-2 gap-2 mb-3">
            <div className="field-group">
              <label className="field-label"><Maximize2 size={13} /> Billboard Dimensions & Type:</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Monthly Rental Rate (₹ INR):</label>
              <input 
                type="number" 
                className="input-field font-bold text-emerald" 
                value={formData.monthlyRate}
                onChange={(e) => setFormData({...formData, monthlyRate: e.target.value})}
              />
            </div>
          </div>

          <div className="grid-2 gap-2 mb-3">
            <div className="field-group">
              <label className="field-label"><Calendar size={13} /> Current Booking End Date:</label>
              <input 
                type="date" 
                className="input-field" 
                value={formData.bookingEndDate}
                onChange={(e) => setFormData({...formData, bookingEndDate: e.target.value})}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Free From Date:</label>
              <input 
                type="date" 
                className="input-field" 
                value={formData.freeFromDate}
                onChange={(e) => setFormData({...formData, freeFromDate: e.target.value})}
              />
            </div>
          </div>

          <div className="grid-2 gap-2 mb-4">
            <div className="field-group">
              <label className="field-label">Urgency Level:</label>
              <select 
                className="input-field"
                value={formData.urgency}
                onChange={(e) => setFormData({...formData, urgency: e.target.value})}
              >
                <option value="critical">Critical (&lt; 30 Days)</option>
                <option value="high">High (30 - 60 Days)</option>
                <option value="moderate">Moderate (60 - 90 Days)</option>
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">Demand Level:</label>
              <select 
                className="input-field"
                value={formData.demandLevel}
                onChange={(e) => setFormData({...formData, demandLevel: e.target.value})}
              >
                <option value="High">High Demand (Green Pin)</option>
                <option value="Medium">Medium Demand (Yellow Pin)</option>
                <option value="Low">Low Demand (Red Pin)</option>
              </select>
            </div>
          </div>

          <div className="composer-actions">
            <button type="submit" className="btn btn-primary flex-1">
              <PlusCircle size={15} /> Add Hoarding Site
            </button>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .mb-3 { margin-bottom: 0.85rem; }
        .mb-4 { margin-bottom: 1.25rem; }
        .text-brand { color: var(--brand-primary); }
      `}</style>
    </div>
  );
}
