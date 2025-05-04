import requests
import math

def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance (in kilometers) between two points on the earth.
    """
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1 
    dlon = lon2 - lon1 
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a)) 
    r = 6371  # Radius of Earth in kilometers
    return c * r


def get_lat_lng_from_address(address):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        'q': address,
        'format': 'json',
        'limit': 1,
    }

    headers = {
        'User-Agent': 'food-redistribution-app'
    }

    try:
        response = requests.get(url, params=params, headers=headers)
        data = response.json()

        if data:
            return float(data[0]['lat']), float(data[0]['lon'])
        else:
            return None, None
    except Exception as e:
        print("Geocoding error:", e)
        return None, None


def reverse_geocode(lat, lng):
    try:
        url = f"https://nominatim.openstreetmap.org/reverse"
        params = {
            'format': 'json',
            'lat': lat,
            'lon': lng,
            'zoom': 16,
            'addressdetails': 1
        }
        headers = {'User-Agent': 'food-redistribution-app'}
        response = requests.get(url, params=params, headers=headers)
        data = response.json()
        return data.get('display_name', 'Unknown location')
    except Exception as e:
        print("🛑 Reverse geocode error:", e)
        return "Unknown location"