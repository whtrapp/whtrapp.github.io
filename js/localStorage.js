export function saveToLocalStorage(city) {
    const storedData = localStorage.getItem('lastVisited');
    if (storedData) {
        let data = JSON.parse(storedData);
        const existingCityIndex = data.findIndex(
            (item) => item.city == city
        );
        if (existingCityIndex !== -1) {
            data[existingCityIndex].city = city;
            data.unshift(data.splice(existingCityIndex, 1)[0]);
        } else {
            data.unshift({ city });
        }
        data = data.slice(0, 3);
        localStorage.setItem('lastVisited', JSON.stringify(data));
    } else {
        localStorage.setItem(
            'lastVisited',
            JSON.stringify([{ city }])
        );
    }
}

export function clearLastVisited() {
    const storedData = localStorage.getItem('lastVisited');
    if (storedData) {
        localStorage.removeItem('lastVisited');
    }
}

export function getLastVisitedCity() {
    const stored = localStorage.getItem('lastVisited');
    if (stored) {
        return JSON.parse(stored)[0].city;
    }
    return null;
}
