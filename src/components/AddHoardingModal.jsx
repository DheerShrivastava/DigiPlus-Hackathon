import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  PlusCircle, 
  X, 
  MapPin, 
  Maximize2, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Sparkles,
  Sliders
} from 'lucide-react';
import { createHoarding } from '../services/api';

// Custom Leaflet marker for modal picker
const pickerIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `<div class="marker-pin marker-green"></div>`,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
});

// Map click event listener component
function LocationPickerEvents({ onSelectCoords }) {
  useMapEvents({
    click(e) {
      onSelectCoords(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function AddHoardingModal({ onAddHoarding, onClose }) {
  const [formData, setFormData] = useState({
    hoardingId: `MH-MUM-${Math.floor(100 + Math.random() * 900)}`,
    location: '',
    city: 'Mumbai',
    area: 'Andheri West',
    latitude: 19.1197,
    longitude: 72.8468,
    size: '40ft x 20ft',
    format: 'Billboard',
    trafficScore: 90,
    visibilityScore: 88,
    monthlyRate: 450000,
    bookingEndDate: '2026-09-15',
    freeFromDate: '2026-09-16',
    occupancyRate: 85,
    bookingFrequency: 18,
    revenueGenerated: 4500000,
    status: 'available'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleMapClick = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6))
    }));
  };

  const validateForm = () => {
    if (!formData.hoardingId.trim()) return "Hoarding ID is required.";
    if (!formData.location.trim()) return "Location is required.";
    if (!formData.city.trim()) return "City is required.";
    if (!formData.size.trim()) return "Size dimensions are required.";

    const lat = Number(formData.latitude);
    const lng = Number(formData.longitude);
    if (isNaN(lat) || lat < -90 || lat > 90 || isNaN(lng) || lng < -180 || lng > 180) {
      return "Valid latitude (-90 to 90) and longitude (-180 to 180) are required for map placement.";
    }

    const rate = Number(formData.monthlyRate);
    if (isNaN(rate) || rate < 0) return "Monthly rate must be >= 0.";

    const traf = Number(formData.trafficScore);
    if (isNaN(traf) || traf < 0 || traf > 100) return "Traffic score must be between 0 and 100.";

    const vis = Number(formData.visibilityScore);
    if (isNaN(vis) || vis < 0 || vis > 100) return "Visibility score must be between 0 and 100.";

    const occ = Number(formData.occupancyRate);
    if (isNaN(occ) || occ < 0 || occ > 100) return "Occupancy rate must be between 0 and 100.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const validationErr = validateForm();
    if (validationErr) {
      setErrorMessage(validationErr);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        hoardingId: formData.hoardingId.trim(),
        location: formData.location.trim(),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        monthlyRate: Number(formData.monthlyRate),
        trafficScore: Number(formData.trafficScore),
        visibilityScore: Number(formData.visibilityScore),
        occupancyRate: Number(formData.occupancyRate),
        bookingFrequency: Number(formData.bookingFrequency),
        revenueGenerated: Number(formData.revenueGenerated)
      };

      const res = await createHoarding(payload);
      const createdData = res.data || res;

      setSuccessMessage("Hoarding added successfully to MongoDB Atlas!");
      
      if (onAddHoarding) {
        onAddHoarding(createdData);
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Failed to add hoarding:", err);
      setErrorMessage(err.message || "Failed to add hoarding to MongoDB. Please check inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="email-modal-overlay">
      <div className="email-modal-container dashboard-card modal-large-scroll">
        <div className="card-header">
          <div className="card-title">
            <PlusCircle size={20} className="text-brand" />
            <span>Add New Hoarding Site Inventory</span>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {errorMessage && (
          <div className="alert-banner error font-sans">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert-banner success font-sans">
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card-body">
          <div className="grid-2 gap-3 mb-3">
            <div className="field-group">
              <label className="field-label">Hoarding ID (Unique):</label>
              <input 
                type="text" 
                className="input-field font-mono font-bold" 
                value={formData.hoardingId} 
                onChange={(e) => setFormData({...formData, hoardingId: e.target.value})}
                required 
              />
            </div>

            <div className="field-group">
              <label className="field-label">City:</label>
              <select 
                className="select-field font-bold"
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

          <div className="grid-2 gap-3 mb-3">
            <div className="field-group">
              <label className="field-label"><MapPin size={13} /> Location & Landmark:</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Western Express Highway Exit 4, Goregaon" 
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Area / Locality:</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Andheri West" 
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: e.target.value})}
              />
            </div>
          </div>

          {/* Interactive Map Picker (Section 14) */}
          <div className="field-group mb-3">
            <label className="field-label flex items-center justify-between">
              <span><MapPin size={13} /> Map Location Picker (Click to Set Coordinates):</span>
              <span className="text-xs text-brand font-mono">Lat: {formData.latitude}, Lng: {formData.longitude}</span>
            </label>
            <div className="modal-map-picker">
              <MapContainer 
                center={[formData.latitude || 19.0760, formData.longitude || 72.8777]} 
                zoom={10} 
                className="mini-picker-map"
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                <LocationPickerEvents onSelectCoords={handleMapClick} />
                <Marker position={[formData.latitude, formData.longitude]} icon={pickerIcon} />
              </MapContainer>
            </div>
          </div>

          <div className="grid-2 gap-3 mb-3">
            <div className="field-group">
              <label className="field-label">Latitude (-90 to 90):</label>
              <input 
                type="number" 
                step="any"
                className="input-field font-mono" 
                value={formData.latitude}
                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">Longitude (-180 to 180):</label>
              <input 
                type="number" 
                step="any"
                className="input-field font-mono" 
                value={formData.longitude}
                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid-3 gap-3 mb-3">
            <div className="field-group">
              <label className="field-label"><Maximize2 size={13} /> Size Dimensions:</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">Media Format:</label>
              <select 
                className="select-field"
                value={formData.format}
                onChange={(e) => setFormData({...formData, format: e.target.value})}
              >
                <option value="Billboard">Billboard</option>
                <option value="Digital 4K Screen">Digital 4K Screen</option>
                <option value="Static Gantry">Static Gantry</option>
                <option value="Illuminated Unipole">Illuminated Unipole</option>
                <option value="Frontlit Board">Frontlit Board</option>
              </select>
            </div>

            <div className="field-group">
              <label className="field-label"><DollarSign size={13} /> Monthly Rate (₹ INR):</label>
              <input 
                type="number" 
                className="input-field font-bold text-emerald" 
                value={formData.monthlyRate}
                onChange={(e) => setFormData({...formData, monthlyRate: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid-3 gap-3 mb-3">
            <div className="field-group">
              <label className="field-label">Traffic Score (0-100):</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="input-field" 
                value={formData.trafficScore}
                onChange={(e) => setFormData({...formData, trafficScore: e.target.value})}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Visibility Score (0-100):</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="input-field" 
                value={formData.visibilityScore}
                onChange={(e) => setFormData({...formData, visibilityScore: e.target.value})}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Occupancy Rate (%):</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="input-field" 
                value={formData.occupancyRate}
                onChange={(e) => setFormData({...formData, occupancyRate: e.target.value})}
              />
            </div>
          </div>

          <div className="grid-2 gap-3 mb-3">
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

          <div className="grid-2 gap-3 mb-4">
            <div className="field-group">
              <label className="field-label">Booking Frequency (Campaigns/Yr):</label>
              <input 
                type="number" 
                className="input-field" 
                value={formData.bookingFrequency}
                onChange={(e) => setFormData({...formData, bookingFrequency: e.target.value})}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Inventory Status:</label>
              <select 
                className="select-field"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="available">Available</option>
                <option value="expiring">Expiring Soon</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="composer-actions">
            <button 
              type="submit" 
              className="btn btn-primary flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 size={16} className="spin" /> : <PlusCircle size={15} />}
              {isSubmitting ? "Saving to MongoDB Atlas..." : "Add Hoarding Site"}
            </button>
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-large-scroll {
          max-width: 750px;
          max-height: 85vh;
          overflow-y: auto;
        }

        .mb-3 { margin-bottom: 0.85rem; }
        .mb-4 { margin-bottom: 1.25rem; }
        .gap-3 { gap: 0.85rem; }

        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); }

        .field-group { display: flex; flex-direction: column; gap: 0.25rem; }
        .field-label { font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); }

        .input-field, .select-field {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.75rem;
          font-size: 0.85rem;
          color: var(--text-primary);
          outline: none;
        }

        .alert-banner {
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          font-weight: 600;
          margin: 0.75rem 1rem 0 1rem;
        }

        .alert-banner.error {
          background-color: var(--badge-critical-bg);
          color: var(--badge-critical-text);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .alert-banner.success {
          background-color: var(--badge-success-bg);
          color: var(--badge-success-text);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .modal-map-picker {
          height: 160px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .mini-picker-map {
          width: 100%;
          height: 100%;
        }

        .flex-1 { flex: 1; }
        .text-brand { color: var(--brand-primary); }
        .text-emerald { color: var(--accent-emerald); }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
