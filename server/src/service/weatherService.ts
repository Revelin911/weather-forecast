import dotenv from 'dotenv';
dotenv.config();
import dayjs from 'dayjs';

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  date: string;
  city: string;
  icon: string;
  description: string;
  tempF: number;
  humidity: number;
  windSpeed: number;

  constructor(date: string, city: string, icon: string, description: string, tempF: number, humidity: number, windSpeed: number) {
    this.date = date;
    this.city = city;
    this.icon = icon;
    this.description = description;
    this.tempF = tempF;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  private city: string;

  // TODO: Define the baseURL, API key, and city name properties
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.city = '';
  }
  // setCity(city: string) {
  //   this.city = city;
  // }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
  
    try {
      const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&appid=${this.apiKey}`);
const json = await response.json();
return json[0];

    } catch (err) {
      console.log('Error:', err);
      return null;
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    
    const { lat, lon } = locationData;
    return { lat, lon };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return city;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `lat=${coordinates.lat}&lon=${coordinates.lon}`;
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
      const response = await fetch(`${this.baseURL}/data/2.5/forecast?${query}&units=imperial&appid=${this.apiKey}`);
      const weatherData = await response.json();
      const currentWeather = this.parseCurrentWeather(weatherData?.list[0]);
      const forecast = this.buildForecastArray(currentWeather, weatherData.list);
      return forecast;

    } catch (err) {
      console.log('Cannot fetch weather data', err);
      return err;
    }
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    
    const weatherData = response;
   
    return new Weather(
      dayjs.unix(weatherData.dt).format('M/D/YYYY'),
      this.city,
      weatherData.weather[0].icon,
      weatherData.weather[0].description,
      weatherData.main.temp,
      weatherData.main.humidity,
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
    console.log(this.city)
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData(city);
    
    if (coordinates) {
      console.log('coordinates', coordinates);
      const weatherData = await this.fetchWeatherData(coordinates);
      
      return weatherData;
    } else {
      console.error('Cannot retrieve weather');
      return null;
    }
  }
}

export default new WeatherService();
