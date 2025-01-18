import dotenv from 'dotenv';
dotenv.config();
import dayjs from 'dayjs';
// TODO: Define a class for the Weather object
class Weather {
    constructor(date, city, icon, description, temperature, humidity, windSpeed) {
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
    // TODO: Define the baseURL, API key, and city name properties
    constructor() {
        this.city = '';
        this.baseURL = process.env.API_BASE_URL || '';
        this.apiKey = process.env.API_KEY || '';
    }
    // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        try {
            const response = await fetch(`${this.baseURL}/geocode?city=${query}&appid=${this.apiKey}`);
            return await response.json();
        }
        catch (err) {
            console.log('Error:', err);
            return null;
        }
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        const { latitude, longitude } = locationData;
        return { latitude, longitude };
    }
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery(city) {
        return city;
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        const weatherQuery = `lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
        return weatherQuery;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData(city) {
        const query = this.buildGeocodeQuery(city);
        const locationData = await this.fetchLocationData(query);
        return this.destructureLocationData(locationData);
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const query = this.buildWeatherQuery(coordinates);
        try {
            const response = await fetch(`${this.baseURL}/weather?${query}&appid=${this.apiKey}`);
            const weatherData = await response.json();
            return weatherData;
        }
        catch (err) {
            console.log('Cannot fetch weather data', err);
            return err;
        }
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        const weatherData = response.current;
        return new Weather(dayjs.unix(weatherData.dt).format('M/D/YYYY'), response.city.name, weatherData.weather[0].icon, weatherData.weather[0].description, weatherData.main.temp, weatherData.humidity, weatherData.wind.speed);
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(currentWeather, weatherData) {
        const forecast = [currentWeather];
        const weatherDataFiltered = weatherData.filter((data) => {
            return data.dt_txt.includes('12:00:00');
        });
        for (let i = 0; i < weatherDataFiltered.length; i += 8) {
            let weatherItem = weatherDataFiltered[i];
            forecast.push(new Weather(dayjs.unix(weatherItem.dt).format('M/D/YYYY'), currentWeather.city, weatherItem.weather[0].icon, weatherItem.weather[0].description, weatherItem.main.temp, weatherItem.main.humidity, weatherItem.wind.speed));
        }
        return forecast;
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        const coordinates = await this.fetchAndDestructureLocationData(city);
        if (coordinates) {
            const weatherData = await this.fetchWeatherData(coordinates);
            const currentWeather = this.parseCurrentWeather(weatherData);
            const forecast = this.buildForecastArray(currentWeather, weatherData.list);
            return { currentWeather, forecast };
        }
        else {
            console.error('Cannot retrieve weather');
            return null;
        }
    }
}
export default new WeatherService();
