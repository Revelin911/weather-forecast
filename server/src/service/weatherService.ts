import dotenv from 'dotenv';
dotenv.config();
import dayjs, {type Dayjs} from 'dayjs';

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

constructor(date: number, city: string, icon: string, description: string, temperature: number, humidity: number, windSpeed: number ) {
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
 private  baseURL?: string;
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
const response = await fetch( `${this.baseURL}/forecast?lat={lat}&lon={lon}&appid=${this.apiKey}`);

const location = await response.json();

const coordinates = await this.destructureLocationData(location.data);
return coordinates;
} catch(err) {
  console.log('Error:', err);
  return err;
}
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const {latitude, longitude} = locationData;
return {latitude, longitude};
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city:string): string {
    const geoQuery = 
return `${this.baseURL}/geocode?city=${this.city}&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = 
    return `${this.baseURL}/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
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

  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {}

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecast: weather[] = [currentWeather];
    const weatherDataFiltered = weatherData.filter((data:any) => {
      return data.dt_txt.includes('12:00:00')
    });

    for (let i=7; 1<weatherData.length; 1+=8) {
      let weatherItem = weatherData[1];

      forecast.push(
        new Weather(
          this.cityName,
          dayjs.unix(weatherItem.dt).format('M/D/YYYY'),
          weatherItem.weather.icon,
          weatherItem.weather.description,

        )
      )
    }
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {}
}

export default new WeatherService();
