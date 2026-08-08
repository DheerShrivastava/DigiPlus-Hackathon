import { Router } from 'express';
import { dataStore } from '../models/dataStore.js';
import { runVacancyPipeline } from '../services/vacancyPipeline.js';
import { config } from '../config.js';

const router = Router();

function executePipeline(source = 'manual') {
  const { vacancies, hoardingStatuses } = runVacancyPipeline(
    dataStore.hoardings,
    dataStore.bookings,
    dataStore.customers
  );
  dataStore.setPipelineCache(vacancies, hoardingStatuses, {
    lastSource: source,
    referenceDate: config.referenceDate,
  });
  return { vacancies, hoardingStatuses };
}

router.get('/status', (req, res) => {
  const meta = dataStore.getPipelineMeta();
  const counts = dataStore.getCounts();
  res.json({
    ...meta,
    ...counts,
    reference_date: config.referenceDate,
    vacancy_window_days: config.vacancyWindowDays,
    rate_markup_factor: config.rateMarkupFactor,
  });
});

router.post('/run', (req, res) => {
  const result = executePipeline('manual');
  res.json({
    message: 'Pipeline executed successfully',
    vacancies_found: result.vacancies.length,
    hoardings_processed: result.hoardingStatuses.length,
    last_run_at: dataStore.getPipelineMeta().lastRunAt,
  });
});

router.post('/refresh', (req, res) => {
  const { reload_csv } = req.body || {};
  if (reload_csv) {
    dataStore.loadFromCSV();
  }
  const result = executePipeline(reload_csv ? 'csv_refresh' : 'refresh');
  res.json({
    message: reload_csv ? 'CSV reloaded and pipeline executed' : 'Pipeline refreshed from store',
    vacancies_found: result.vacancies.length,
    hoardings_processed: result.hoardingStatuses.length,
    counts: dataStore.getCounts(),
    last_run_at: dataStore.getPipelineMeta().lastRunAt,
  });
});

export default router;
