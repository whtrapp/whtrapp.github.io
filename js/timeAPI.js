export async function fetchTime(timeZone) {
    try {
        const response = await fetch(
            `https://timeapi.io/api/time/current/zone?timeZone=${timeZone}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching time data:', error);
        throw error;
    }
}