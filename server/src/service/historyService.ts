import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the search history file
const HISTORY_FILE_PATH = path.join(__dirname, '../data/searchHistory.json');

// TODO: Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string) {}
}

// Complete the HistoryService class
class HistoryService {
  async getSearchHistory(): Promise<string[]> {
    try {
      const cities = await this.getCities();
      return cities.map(city => city.name);
    } catch (error) {
      throw new Error(`Error retrieving search history: ${(error as Error).message}`);
    }
  }
  saveCity(_city: any) {
    throw new Error('Method not implemented.');
  }
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(HISTORY_FILE_PATH, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return []; // Return an empty array if the file doesn't exist
      }
      throw new Error(`Error reading search history: ${(error as Error).message}`);
    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(HISTORY_FILE_PATH, JSON.stringify(cities, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Error writing search history: ${(error as Error).message}`);
    }
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // TODO: Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const id = new Date().toISOString(); // Generate a unique ID using timestamp
    const newCity = new City(cityName, id);

    // Avoid duplicate city names
    if (!cities.some(city => city.name.toLowerCase() === cityName.toLowerCase())) {
      cities.push(newCity);
      await this.write(cities);
    }
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
}

export default new HistoryService();
