import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  date?: string | undefined;

  constructor(temperature: number, description: string, humidity: number, windSpeed: number, date?: string) {
    this.temperature = temperature;
    this.description = description;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.date = date;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private geocodeURL: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5/weather';
    this.geocodeURL = 'http://api.openweathermap.org/geo/1.0/direct';
    this.apiKey = process.env.WEATHER_API_KEY || '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(city: string): Promise<any> {
    try {
      const response = await axios.get(this.geocodeURL, {
        params: {
          q: city,
          limit: 1,
          appid: this.apiKey
        }
      });
  
      if (!response.data.length) {
        throw new Error('Location not found');
      }
  
      return response.data[0];
    } catch (error) {
      const errorMessage = (error as Error).message || 'Unknown error occurred';
      throw new Error(`Error fetching location data: ${errorMessage}`);
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon
    };
  }


  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method

  private async fetchForecastData(coordinates: Coordinates): Promise<any[]> {
    try {
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&cnt=5&units=metric&appid=${this.apiKey}`;

      const response = await axios.get(forecastUrl);

      return response.data.list || []; // Ensure it always returns an array
    } catch (error) {
      throw new Error(`Error fetching forecast data: ${(error as Error).message}`);
    }
  }


  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.main.temp,
      response.weather[0].description,
      response.main.humidity,
      response.wind.speed
    );
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    try {
      const response = await axios.get(this.buildWeatherQuery(coordinates));
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching weather data: ${(error as Error).message}`);
    }
  }

  // TODO: Complete buildForecastArray method (For future implementation)
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecast = weatherData.map((day: any) => {
      return new Weather(
        day.temp.day,
        day.weather[0].description,
        day.humidity,
        day.wind_speed,
        day.dt
      );
    });

    return [currentWeather, ...forecast];
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
  
      const currentWeatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(currentWeatherData);

      const forecastData = await this.fetchForecastData(coordinates);
  
      return this.buildForecastArray(currentWeather, forecastData);
    } catch (error) {
      const errorMessage = (error as Error).message || 'Unknown error occurred';
      throw new Error(`Error retrieving weather for city: ${errorMessage}`);
    }
  }
}

export default new WeatherService();
