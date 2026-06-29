import axios from 'axios';

export class MapService {
  /**
   * Geocodes an address string to coordinates using OpenStreetMap Nominatim
   * Note: In production, use a paid service or respect OSM usage limits.
   */
  static async geocodeAddress(address: string): Promise<{ lat: number, lng: number } | null> {
    try {
      // Mocking for internship project, or use real OSM Nominatim API
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: address,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'EComDeliveryApp/1.0'
        }
      });
      
      if (response.data && response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lng: parseFloat(response.data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding failed:', error);
      return null;
    }
  }

  /**
   * Calculates route distance and time using OSRM
   * @param origin {lat, lng}
   * @param destination {lat, lng}
   */
  static async calculateRoute(origin: { lat: number, lng: number }, destination: { lat: number, lng: number }) {
    try {
      // OSRM expects coordinates in lon,lat order
      const url = `http://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false`;
      const response = await axios.get(url);
      
      if (response.data && response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        return {
          distanceKm: route.distance / 1000,
          durationMin: Math.round(route.duration / 60)
        };
      }
      return null;
    } catch (error) {
      console.error('Routing failed:', error);
      return null;
    }
  }
}
