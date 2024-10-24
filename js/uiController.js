export function updateUI(app, data, timeOfDay, exploreBtn) {
    if (timeOfDay === 'day') {
        setDayModeStyles(exploreBtn);
    } else {
        setNightModeStyles(exploreBtn);
    }

    updateBackgroundImage(
        app,
        data.current.condition.code,
        timeOfDay
    );
}

function setDayModeStyles(exploreBtn) {
    exploreBtn.style.backgroundColor = '#007bff';
    exploreBtn.style.color = 'white';
    exploreBtn.querySelector('svg').style.fill = 'white';

    exploreBtn.addEventListener('mouseover', () => {
        exploreBtn.style.backgroundColor = '#0056b3';
        exploreBtn.querySelector('svg').style.fill = '#e2e2e2';
    });
    exploreBtn.addEventListener('mouseout', () => {
        exploreBtn.style.backgroundColor = '#007bff';
        exploreBtn.querySelector('svg').style.fill = 'white';
    });
}

function setNightModeStyles(exploreBtn) {
    exploreBtn.style.backgroundColor = 'white';
    exploreBtn.style.color = 'black';
    exploreBtn.querySelector('svg').style.fill = 'black';

    exploreBtn.addEventListener('mouseover', () => {
        exploreBtn.style.backgroundColor = '#f0f0f0';
        exploreBtn.querySelector('svg').style.fill = '#7f7f7f';
    });
    exploreBtn.addEventListener('mouseout', () => {
        exploreBtn.style.backgroundColor = 'white';
        exploreBtn.querySelector('svg').style.fill = 'black';
    });
}

function updateBackgroundImage(app, code, timeOfDay) {
    if (code == 1000) {
        app.style.backgroundImage = `url(./img/background/${timeOfDay}/clear.jpg)`;
    } else if (
        code == 1003 ||
        code == 1006 ||
        code == 1009 ||
        code == 1030 ||
        code == 1069 ||
        code == 1087 ||
        code == 1135 ||
        code == 1273 ||
        code == 1276 ||
        code == 1279 ||
        code == 1282
    ) {
        app.style.backgroundImage = `url(./img/background/${timeOfDay}/cloudy.jpg)`;
    } else if (
        code == 1063 ||
        code == 1069 ||
        code == 1072 ||
        code == 1150 ||
        code == 1153 ||
        code == 1180 ||
        code == 1186 ||
        code == 1189 ||
        code == 1192 ||
        code == 1195 ||
        code == 1204 ||
        code == 1207 ||
        code == 1240 ||
        code == 1243 ||
        code == 1246 ||
        code == 1249 ||
        code == 1252
    ) {
        app.style.backgroundImage = `url(../img/background/${timeOfDay}/rainy.jpg)`;
    } else {
        app.style.backgroundImage = `url(../img/background/${timeOfDay}/snowy.jpg)`;
    }
}
