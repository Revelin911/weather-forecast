import dotenv from 'dotenv';
dotenv.config();
import dayjs from 'dayjs';

//Defines interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

//Class for the Weather object
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

//Class for WeatherService object
class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  private city: string;

  //Defining the baseURL, API key, and city name properties
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.city = '';
  }
  
  //Method to fetch data and error if not available
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

  //Method to collect coordinates
  private destructureLocationData(locationData: Coordinates): Coordinates {
    
    const { lat, lon } = locationData;
    return { lat, lon };
  }

  //Method to collect city data
  private buildGeocodeQuery(city: string): string {
    return city;
  }

  //Creating query to add coordinates to url
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `lat=${coordinates.lat}&lon=${coordinates.lon}`;
    return weatherQuery;
  }

  //Async method to collect city and coordinates info to get back data
  private async fetchAndDestructureLocationData(city: string) {
    const query = this.buildGeocodeQuery(city);
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
    
  }

  //Async method to get back data for current weather based on user input
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

  //Method to get back to data readable to user
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

  //Method to get back 5 day forecast
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecast: Weather[] = [currentWeather];
    const weatherDataFiltered = weatherData.filter((data: any) => {
      return data.dt_txt.includes('12:00:00');
    });

    weatherDataFiltered.forEach((weatherItem) => {
      

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
    });
    return forecast;
  }

  //Receives data based on user input for each city
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
