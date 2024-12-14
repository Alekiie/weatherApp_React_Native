class AccountService {
  constructor() {
    // OpenWeatherMap API details
    this.baseUrl = process.env.API_URL; // Base URL for weather data
    this.baseToken = process.env.API_TOKEN; // API key for OpenWeatherMap

    // OpenCage API details
    this.geocodingBaseUrl = process.env.GEOCODING_API_URL; // Base URL for geocoding
    this.geocodingApiToken = process.env.GEOCODING_API_TOKEN; // API key for OpenCage
  }

  // Fetch coordinates for a given location (city or zip code)
  async getCoordinates(location) {
    const url = `${this.geocodingBaseUrl}?q=${encodeURIComponent(
      location
    )}&key=${this.geocodingApiToken}`;
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Error fetching coordinates: ${response.statusText}`);
    const data = await response.json();
    if (data.results.length === 0) throw new Error("Location not found");
    const { lat, lng } = data.results[0].geometry;
    return { lat, lon: lng };
  }

  // Get city suggestions based on user input
  async getCitySuggestions(query) {
    const url = `${this.geocodingBaseUrl}?q=${encodeURIComponent(query)}&key=${
      this.geocodingApiToken
    }`;
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(
        `Error fetching city suggestions: ${response.statusText}`
      );
    const data = await response.json();
    return Array.isArray(data.results)
      ? data.results.map((result) => ({
          name: result.formatted,
          lat: result.geometry.lat,
          lon: result.geometry.lng,
        }))
      : [];
  }

  // Fetch weather data using latitude and longitude
  async getWeather(lat, lon) {
    const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.baseToken}&units=metric`;
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Error fetching weather data: ${response.statusText}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  }
}

export default new AccountService();
