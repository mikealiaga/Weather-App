import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  try {
    const { city } = req.body;
    
    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // TODO: GET weather data from city name
    const data = await WeatherService.getWeatherForCity(city);

    if (!data) {
      return res.status(404).json({ error: 'Weather data not found' });
    }

    // TODO: Save city to search history
    await HistoryService.saveCity(city);

    return res.status(200).json({ message: 'Weather data retrieved successfully'});
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving weather data'});
  }
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const history = await HistoryService.getSearchHistory();
    
    if (!history.length) {
      return res.status(404).json({ message: 'No search history found'});
    }

    return res.status(200).json({ history });
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving search history'});
  }
});

// * BONUS TODO: DELETE city from search history

export default router;
