from .geocode import geocode_address  # Import geocode_address from geocode.py

def get_lat_lng_from_address(address):
    try:
        lat, lon = geocode_address(address)
        return lat, lon
    except Exception as e:
        print("🛑 Geocoding error:", e)
        return None, None

def reverse_geocode(lat, lon):
    try:
        url = f"https://nominatim.openstreetmap.org/reverse"
        params = {
            'format': 'json',
            'lat': lat,
            'lon': lon,
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
