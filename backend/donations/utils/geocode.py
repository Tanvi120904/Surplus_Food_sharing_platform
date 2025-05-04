import requests

def geocode_address(address):
    try:
        print(f"Geocoding address: {address}")  # Add this line
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            'q': address,
            'format': 'json',
            'limit': 1,
        }

        headers = {
            'User-Agent': 'food-redistribution-app/1.0 (tanvip2905@gmail.com)'
        }

        response = requests.get(url, params=params, headers=headers)

        print("Geocoding response status:", response.status_code)
        print("Geocoding response content:", response.text)

        data = response.json()

        if data:
            return float(data[0]['lat']), float(data[0]['lon'])
        else:
            print("Geocoding returned empty list")
            return None, None
    except Exception as e:
        print("Error in geocoding:", e)
        return None, None
