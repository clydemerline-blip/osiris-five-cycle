class WeatherDashboard {
    constructor() {
        this.apiKey = 'a6d4b2b9bde6f3e1c5d7f9g2h4j6k8m0';
        this.apiUrl = 'https://api.openweathermap.org/data/2.5';
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.weatherContent = document.getElementById('weatherContent');
        this.emptyState = document.getElementById('emptyState');
        this.currentWeatherCard = document.getElementById('currentWeatherCard');
        this.forecastContainer = document.getElementById('forecastContainer');
        this.cityButtons = document.querySelectorAll('.city-btn');
    }

    attachEventListeners() {
        this.searchBtn.addEventListener('click', () => this.searchCity());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchCity();
        });
        this.locationBtn.addEventListener('click', () => this.getUserLocation());
        this.cityButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.getWeatherByCity(e.target.dataset.city);
            });
        });
    }

    searchCity() {
        const city = this.cityInput.value.trim();
        if (city === '') {
            this.showError('Please enter a city name');
            return;
        }
        this.getWeatherByCity(city);
    }

    getUserLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation not supported');
            return;
        }
        this.showLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                this.getWeatherByCoordinates(lat, lon);
            },
            (error) => {
                this.showLoading(false);
                this.showError('Unable to get location: ' + error.message);
            }
        );
    }

    async getWeatherByCity(city) {
        this.showLoading(true);
        this.clearError();
        try {
            const response = await fetch(
                this.apiUrl + '/weather?q=' + encodeURIComponent(city) + '&units=metric&appid=' + this.apiKey
            );
            if (!response.ok) {
                if (response.status === 404) {
                    this.showError('City not found');
                } else {
                    this.showError('Error fetching weather data');
                }
                this.showLoading(false);
                return;
            }
            const weatherData = await response.json();
            await this.getForecast(weatherData.coord.lat, weatherData.coord.lon);
            this.displayCurrentWeather(weatherData);
            this.showLoading(false);
        } catch (error) {
            this.showError('Error: ' + error.message);
            this.showLoading(false);
        }
    }

    async getWeatherByCoordinates(lat, lon) {
        this.showLoading(true);
        this.clearError();
        try {
            const response = await fetch(
                this.apiUrl + '/weather?lat=' + lat + '&lon=' + lon + '&units=metric&appid=' + this.apiKey
            );
            if (!response.ok) {
                this.showError('Error fetching weather data');
                this.showLoading(false);
                return;
            }
            const weatherData = await response.json();
            this.cityInput.value = weatherData.name;
            await this.getForecast(lat, lon);
            this.displayCurrentWeather(weatherData);
            this.showLoading(false);
        } catch (error) {
            this.showError('Error: ' + error.message);
            this.showLoading(false);
        }
    }

    async getForecast(lat, lon) {
        try {
            const response = await fetch(
                this.apiUrl + '/forecast?lat=' + lat + '&lon=' + lon + '&units=metric&appid=' + this.apiKey
            );
            if (!response.ok) throw new Error('Forecast error');
            const forecastData = await response.json();
            this.displayForecast(forecastData.list);
        } catch (error) {
            console.error('Forecast error:', error);
        }
    }

    displayCurrentWeather(data) {
        const temp = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const humidity = data.main.humidity;
        const windSpeed = Math.round(data.wind.speed * 3.6);
        const cloudiness = data.clouds.all;
        const visibility = (data.visibility / 1000).toFixed(1);
        const pressure = data.main.pressure;
        const description = data.weather[0].main;
        const icon = this.getWeatherIcon(data.weather[0].main);

        this.currentWeatherCard.innerHTML = 
            '<h2>' + data.name + ', ' + data.sys.country + '</h2>' +
            '<div class="weather-icon">' + icon + '</div>' +
            '<div class="current-temp">' + temp + '°C</div>' +
            '<div class="weather-description">' + description + '</div>' +
            '<div class="weather-details">' +
                '<div class="detail-item"><div class="detail-label">Feels Like</div><div class="detail-value">' + feelsLike + '°C</div></div>' +
                '<div class="detail-item"><div class="detail-label">Humidity</div><div class="detail-value">' + humidity + '%</div></div>' +
                '<div class="detail-item"><div class="detail-label">Wind Speed</div><div class="detail-value">' + windSpeed + ' km/h</div></div>' +
                '<div class="detail-item"><div class="detail-label">Cloudiness</div><div class="detail-value">' + cloudiness + '%</div></div>' +
                '<div class="detail-item"><div class="detail-label">Visibility</div><div class="detail-value">' + visibility + ' km</div></div>' +
                '<div class="detail-item"><div class="detail-label">Pressure</div><div class="detail-value">' + pressure + ' hPa</div></div>' +
            '</div>';

        this.emptyState.style.display = 'none';
        this.weatherContent.classList.remove('hidden');
    }

    displayForecast(forecastList) {
        this.forecastContainer.innerHTML = '';
        const dailyForecasts = {};
        forecastList.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            if (!dailyForecasts[day]) {
                dailyForecasts[day] = forecast;
            }
        });

        const keys = Object.keys(dailyForecasts).slice(0, 5);
        keys.forEach(day => {
            const forecast = dailyForecasts[day];
            const high = Math.round(forecast.main.temp_max);
            const low = Math.round(forecast.main.temp_min);
            const description = forecast.weather[0].main;
            const icon = this.getWeatherIcon(forecast.weather[0].main);

            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML =
                '<div class="forecast-date">' + day + '</div>' +
                '<div class="forecast-icon">' + icon + '</div>' +
                '<div class="forecast-temp"><span class="temp-high">' + high + '°</span><span class="temp-low">' + low + '°</span></div>' +
                '<div class="forecast-desc">' + description + '</div>';
            this.forecastContainer.appendChild(card);
        });
    }

    getWeatherIcon(description) {
        const desc = description.toLowerCase();
        if (desc.includes('cloud')) return '☁️';
        if (desc.includes('rain')) return '🌧️';
        if (desc.includes('snow')) return '❄️';
        if (desc.includes('clear') || desc.includes('sunny')) return '☀️';
        if (desc.includes('thunder')) return '⛈️';
        if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
        return '🌤️';
    }

    showLoading(show) {
        if (show) {
            this.loadingSpinner.classList.remove('hidden');
            this.loadingSpinner.innerHTML = '<div class="spinner"></div>';
        } else {
            this.loadingSpinner.classList.add('hidden');
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
        this.weatherContent.classList.add('hidden');
        this.emptyState.style.display = 'block';
    }

    clearError() {
        this.errorMessage.classList.remove('show');
        this.errorMessage.textContent = '';
    }
}

let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new WeatherDashboard();
});