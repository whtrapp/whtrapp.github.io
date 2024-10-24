const API_KEY = '7c742b695b3243f3864123423232302';

export async function fetchWeatherData(city) {
    try {
        const response = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

export async function fetchAstronomyData(city, date) {
    try {
        const response = await fetch(
            `http://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&q=${city}&dt=${date}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching astronomy data:', error);
        throw error;
    }
}

export async function fetchForecastData(city) {
    try {
        const response = await fetch(
            `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=1&aqi=yes&alerts=no`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        throw error;
    }
}
