// Geocode API - get city latitude and longitude
const result = document.querySelector('.result');

const getCity = (e) => {
  e.preventDefault();

  const city = document.querySelector("[name = 'city']").value;

  const urlLocation = `https://geocode.xyz/${city}?json=1`;
  fetch(urlLocation)
    .then(response => response.json())
    .then(data => getAirInfo(data))
    .catch(error => console.error(error))
}

const getAirInfo = (pos) => {
  const lat = pos.latt;
  const lng = pos.longt;

  // Airly API to get air quality informations

  const urlAirly = `https://airapi.airly.eu/v2/measurements/nearest?lat=${lat}&lng=${lng}&${appKey}`

  fetch(urlAirly)
    .then(response => response.json())
    // .then(data => console.log(data.current))
    .then(data => airData(data.current))
    .catch(error => console.error(error))

  const airData = (info) => {
    result.textContent = '';
    const noData = info;

    if (noData === undefined) {
      result.textContent = 'Przepraszamy, brak danych';
      result.setAttribute('style', 'background-color: #999999');
      return
    };

    const advice = document.createElement('div');
    advice.className = 'advice';
    advice.textContent = info.indexes[0].advice;

    const description = document.createElement('div');
    description.className = 'description';
    description.textContent = info.indexes[0].description;

    const bgColor = info.indexes[0].color;
    result.setAttribute('style', `background-color:${bgColor}`);

    // Get the PM10 value
    const valuesPM = info.values;
    if (valuesPM.length === 0) {
      result.textContent = 'Przepraszamy, brak danych';
      result.setAttribute('style', 'background-color: #999999');
      return
    };

    const valuePM10 = valuesPM.find(PM10 => PM10.name === "PM10");
    const standardPM10 = info.standards.find(standard => standard.pollutant === "PM10");

    if (standardPM10 === undefined) {
      result.textContent = 'Przepraszamy, brak danych';
      result.setAttribute('style', 'background-color: #999999');
      return
    };

    const percentOfPM10 = standardPM10.percent;
    const pm10 = document.createElement('div');
    pm10.className = 'pm10';
    pm10.textContent = `${valuePM10.name} ${valuePM10.value} ${percentOfPM10}%`;

    // Get the PM25 value
    const valuePM25 = valuesPM.find(PM25 => PM25.name === "PM25");
    const standardPM25 = info.standards.find(standard => standard.pollutant === "PM25");

    if (standardPM25 === undefined) {
      result.textContent = 'Przepraszamy, brak danych';
      result.setAttribute('style', 'background-color: #999999');
      return
    };

    const percentOfPM25 = standardPM25.percent;
    const pm25 = document.createElement('div');
    pm25.className = 'pm25';
    pm25.textContent = `${valuePM25.name} ${valuePM25.value} ${percentOfPM25}%`;

    if (valuesPM.length === 0 || valuePM10 === undefined || valuePM25 === undefined) {
      result.textContent = 'Przepraszamy, brak danych';
      return
    };

    result.appendChild(description);
    result.appendChild(advice);
    result.appendChild(pm10);
    result.appendChild(pm25);

    // Change Chameleon color depending on air quality

    const chamCol = result.style.backgroundColor
    const svgObject = document.getElementById('svg-object').contentDocument;
    const svg = svgObject.getElementById('airQualityBg');
    svg.setAttribute(`style`, `fill:${chamCol}`)
  }
}

document.querySelector('.form').addEventListener('submit', getCity);