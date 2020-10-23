class ApiServise {
  _apiKey = "331e5bdb0a5057d00f4ca0cbaee61f51";
  _apiBase = "https://api.openweathermap.org/data/2.5/";

  async getResourse(url) {
    const res = await fetch(`${this._apiBase}${url}&appid=${this._apiKey}`);
    if (!res.ok) {
      throw new Error("Error");
    }
    return await res.json();
  }

  getWeatherFromCity(city) {
    return this.getResourse(`weather?q=${city}&units=metric`);
  }

  getWeatherFromCoordinate(lat, lon) {
    return this.getResourse(`weather?lat=${lat}&lon=${lon}&units=metric`);
  }
}

export const Api = new ApiServise();
