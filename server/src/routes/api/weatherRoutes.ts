import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
const requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={ZBkuFjDXeApTmDU2Gw4JfmuGxQQdcu3R7dsXv6K3}';

  // TODO: GET weather data from city name
  // TODO: save city to search history
  fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  })

});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {});

export default router;
