import requests

url = "http://127.0.0.1:8000/api/token/"
data = {
    "username": "tanvi",
    "password": "sara2312"
}

response = requests.post(url, json=data)
print(response.json())  # This will return the authentication token
