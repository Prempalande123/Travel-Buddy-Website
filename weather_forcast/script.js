function handleEnter(event) {
    if (event.key === "Enter") {
        getWeather();
    }
}

function getWeather() {
    const city = document.getElementById('cityName').value.trim();
    const resultDiv = document.getElementById('result');
    const modal = document.getElementById('weatherModal');

    if (!city) {
        alert('⚠️ Please enter a city name!');
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            const response = JSON.parse(this.responseText);

            if (response.cod === 200) {
                // Convert temperature from Fahrenheit to Celsius
                const tempFahrenheit = response.main.temp;
                const tempCelsius = ((tempFahrenheit - 32) * 5) / 9;

                resultDiv.innerHTML = `
                    <p><strong>🌍 City:</strong> ${response.name}, ${response.sys.country}</p>
                    <p><strong>🌡 Temperature:</strong> ${tempCelsius.toFixed(2)}°C</p>
                    <p><strong>☁️ Weather:</strong> ${response.weather[0].description}</p>
                    <p><strong>💧 Humidity:</strong> ${response.main.humidity}%</p>
                    <p><strong>🌬 Wind Speed:</strong> ${response.wind.speed} m/s</p>
                `;
                modal.style.display = 'flex';
            } else {
                resultDiv.innerHTML = '<p>❌ City not found. Try again!</p>';
                modal.style.display = 'flex';
            }
        }
    });

    xhr.open('GET', `https://open-weather13.p.rapidapi.com/city/${city}/EN`);
    xhr.setRequestHeader('x-rapidapi-key', '365eaa4d46msh5dd5fa6a14c5730p15cb41jsnff505ae6a20e');
    xhr.setRequestHeader('x-rapidapi-host', 'open-weather13.p.rapidapi.com');

    xhr.send();
}
