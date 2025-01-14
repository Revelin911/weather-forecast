import dotenv from 'dotenv';
dotenv.config();
import dayjs., {type Dayjs} from

// TODO: Define an interface for the Coordinates object
interface Coordinates {
latitude: number;
longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
 date: number;
icon: boolean;
description: string;
temperature: number;
humidity: number;
windSpeed: number;

constructor(date: number, icon: boolean, temperature: number, humidity: number, windSpeed: number ) {
  this.date = date;
 this.icon = icon;
 this.temperature = temperature;
 this.humidity = humidity;
 this.windSpeed = windSpeed;
}
}

// TODO: Complete the WeatherService class
class WeatherService {
 private  baseURL?: string;
  private apiKey?: string;
  cityName: string;

  // TODO: Define the baseURL, API key, and city name properties
constructor(apiKey: string, cityName:string) {
this.baseURL = process.env.API_BASE_URL;
this.apiKey = process.env.API_KEY;
this.cityName = cityName;
}

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {

  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const {lat, lon} = locationData;

  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {}

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {}

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {}

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
