import dotenv from 'dotenv';
dotenv.config();
import dayjs, { type Dayjs } from 'dayjs';

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
  date: number;
  city: string;
  icon: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;

  constructor(date: number, city: string, icon: string, description: string, temperature: number, humidity: number, windSpeed: number) {
    this.date = date;
    this.city = city;
    this.icon = icon;
    this.description = description;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  private city = '';

  // TODO: Define the baseURL, API key, and city name properties
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(`${this.baseURL}/geocode?city=${query}&appid=${this.apiKey}`);

      return await response.json();

    } catch (err) {
      console.log('Error:', err);
      return null;
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const {latitude, longitude } = locationData;
    return { latitude, longitude };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return city;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
    return weatherQuery;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string) {
    const query = this.buildGeocodeQuery(city);
    const locationData = await this.fetchLocationData(query);

    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    try {
      const response = await fetch(`${this.baseURL}/weather?${query}&appid=${this.apiKey}`);
const weatherData = await response.json();
return weatherData;

    } catch (err) {
      console.log('Cannot fetch weather data', err);
      return err;
    }
    }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) { 
    const weatherData = response.current;
    return new Weather(
      dayjs.unix(weatherData.dt).format('M/D/YYYY'),
      response.city.name,
      weatherData.weather[0].icon,
      weatherData.weather[0].description,
      weatherData.main.temp,
      weatherData.humidity,
      weatherData.wind.speed
    );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecast: Weather[] = [currentWeather];
    const weatherDataFiltered = weatherData.filter((data: any) => {
      return data.dt_txt.includes('12:00:00');
    });

    for (let i = 0; i < weatherDataFiltered.length; i += 8) {
      let weatherItem = weatherDataFiltered[i];

      forecast.push(
        new Weather(
          dayjs.unix(weatherItem.dt).format('M/D/YYYY'),
  currentWeather.city,
          weatherItem.weather[0].icon,
          weatherItem.weather[0].description,
weatherItem.main.temp,
  weatherItem.main.humidity,
  weatherItem.wind.speed,
        )
      );
    }
    return forecast;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
const coordinates = await this.fetchAndDestructureLocationData(city);
if (coordinates) {
  const weatherData = await this.fetchWeatherData(coordinates);
  const currentWeather = this.parseCurrentWeather(weatherData);
  const forecast = this.buildForecastArray(currentWeather, weatherData.list);
  return {currentWeather, forecast};
} else {
    console.error('Cannot retrieve weather');
    return null;
}
  }
}

export default new WeatherService();
