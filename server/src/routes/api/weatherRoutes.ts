import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
import weatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('*', async (req: Request, res: Response) => {
const cityName = req.body.location;

if(!cityName) {
  return res.status(400).json({ error: 'Please add a city name'});
}

  // TODO: GET weather data from city name
  // TODO: save city to search history
 try {
const weatherData = await WeatherService.getWeatherByCity(cityName);

await HistoryService.saveSearch(cityName);

  res.json(weatherData);
 } catch(err) {
  console.log(err);
  res.status(500).json({error: 'Unable to get weather data'});
}
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const searchHistory = await HistoryService.getSearchHistory();
    res.json(searchHistory);
  } catch (err) {
    console.log(err);
    res.status(500).json({error: 'No search history.'});
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const cityId = req.params.id;

  try {
    await weatherService.removeCity(cityId);
    res.json({success: 'Successfully removed'});
  } catch (err) {
    console.log(err);
    res.status(500).json({error: 'Failed to delete from search history.'});
  }
});

export default router;
