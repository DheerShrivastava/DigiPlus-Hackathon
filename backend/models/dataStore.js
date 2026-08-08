import fs from 'fs';
import path from 'path';
import { config } from '../config.js';
import { loadFromCSV } from '../services/csvLoader.js';

class DataStore {
  constructor() {
    this.hoardings = [];
    this.customers = [];
    this.bookings = [];
    this.pipelineMeta = {
      lastRunAt: null,
      lastSource: 'csv',
      vacancyCount: 0,
      hoardingCount: 0,
    };
    this._vacancyCache = [];
    this._hoardingStatusCache = [];
  }

  _ensureStoreDir() {
    const dir = path.dirname(config.storePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  _saveToDisk() {
    this._ensureStoreDir();
    fs.writeFileSync(
      config.storePath,
      JSON.stringify(
        {
          hoardings: this.hoardings,
          customers: this.customers,
          bookings: this.bookings,
          pipelineMeta: this.pipelineMeta,
        },
        null,
        2
      )
    );
  }

  loadFromCSV() {
    const data = loadFromCSV(config.dataDir);
    this.hoardings = data.hoardings;
    this.customers = data.customers;
    this.bookings = data.bookings;
    this.pipelineMeta.lastSource = 'csv';
    this._saveToDisk();
    return this.getCounts();
  }

  loadFromDisk() {
    if (fs.existsSync(config.storePath)) {
      const raw = JSON.parse(fs.readFileSync(config.storePath, 'utf-8'));
      this.hoardings = raw.hoardings || [];
      this.customers = raw.customers || [];
      this.bookings = raw.bookings || [];
      this.pipelineMeta = raw.pipelineMeta || this.pipelineMeta;
      return true;
    }
    return false;
  }

  init() {
    if (!this.loadFromDisk()) {
      this.loadFromCSV();
    }
    return this.getCounts();
  }

  getCounts() {
    return {
      hoardings: this.hoardings.length,
      customers: this.customers.length,
      bookings: this.bookings.length,
    };
  }

  getHoarding(site_id) {
    return this.hoardings.find((h) => h.site_id === site_id);
  }

  getCustomer(customer_id) {
    return this.customers.find((c) => c.customer_id === customer_id);
  }

  getSiteBookings(site_id) {
    return this.bookings
      .filter((b) => b.site_id === site_id)
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  }

  addHoarding(data) {
    if (this.hoardings.some((h) => h.site_id === data.site_id)) {
      throw new Error(`Hoarding ${data.site_id} already exists`);
    }
    const newH = {
      id: this.hoardings.length + 1,
      ...data,
    };
    this.hoardings.push(newH);
    this._saveToDisk();
    return newH;
  }

  updateHoarding(site_id, updates) {
    const idx = this.hoardings.findIndex((h) => h.site_id === site_id);
    if (idx === -1) throw new Error('Hoarding not found');
    this.hoardings[idx] = { ...this.hoardings[idx], ...updates };
    this._saveToDisk();
    return this.hoardings[idx];
  }

  deleteHoarding(site_id) {
    const initial = this.hoardings.length;
    this.hoardings = this.hoardings.filter((h) => h.site_id !== site_id);
    if (this.hoardings.length === initial) throw new Error('Hoarding not found');
    this._saveToDisk();
  }

  setPipelineCache(vacancies, hoardingStatuses, meta = {}) {
    this._vacancyCache = vacancies;
    this._hoardingStatusCache = hoardingStatuses;
    this.pipelineMeta = {
      ...this.pipelineMeta,
      ...meta,
      lastRunAt: new Date().toISOString(),
      vacancyCount: vacancies.length,
      hoardingCount: this.hoardings.length,
    };
    this._saveToDisk();
  }

  getVacancies() {
    return this._vacancyCache;
  }

  getHoardingStatuses() {
    return this._hoardingStatusCache;
  }

  getPipelineMeta() {
    return this.pipelineMeta;
  }
}

export const dataStore = new DataStore();
