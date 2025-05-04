HopePlates - Surplus Food Sharing Platform
HopePlates is a community-driven platform that helps reduce food waste by connecting people who have surplus food with those in need. Whether you're donating food or looking for some, HopePlates makes it easy to share and receive food locally. Built with Django Rest Framework on the backend and ReactJS with Vite on the frontend, it’s designed to be both efficient and user-friendly.

Features
Easy Food Donation: Donors can quickly register and share surplus food.

Food Requests: Anyone in need can request food from local donors.

Map Integration: Donors and recipients can locate each other using an interactive map.

Secure Authentication: Sign up and log in using secure JWT authentication.

Tech Stack
Backend: Django Rest Framework, SQLite (for database)

Frontend: ReactJS, Vite

Authentication: JSON Web Tokens (JWT)

Map Services: Integrated map API to locate food donors and recipients.

Getting Started
1. Set up the Backend (Django)
Clone the repo to your local machine:


git clone https://github.com/Tanvi120904/Surplus_Food_sharing_platform.git
cd Surplus_Food_sharing_platform/backend
Create a virtual environment (this is optional but recommended):


python -m venv venv
Activate the virtual environment:

On Windows:


venv\Scripts\activate
On Mac/Linux:


source venv/bin/activate
Install the backend dependencies:


pip install -r requirements.txt
Run the migrations to set up the database:

python manage.py migrate
If you want to access the admin panel, create a superuser:

python manage.py createsuperuser
Start the Django server:

python manage.py runserver
You can now access the backend at http://127.0.0.1:8000/.

2. Set up the Frontend (React + Vite)
Go to the frontend directory:


cd ../frontend
Install the frontend dependencies:

npm install
Start the frontend server:

npm run dev
The frontend will be live at http://localhost:3000/.

Environment Variables
For the Backend:
You’ll need to set up a few environment variables for the backend. You can create a .env file in the backend directory with the following:

SECRET_KEY: A secret key for Django.

DEBUG: Set this to True for development and False for production.

DATABASE_URL: If you’re using a different database like PostgreSQL, you’ll need this.

MAP_API_KEY: Get your map API key (for example, from Google Maps) and add it here.

For the Frontend:
In the frontend, create a .env file to define the following:

REACT_APP_API_URL: Set this to the URL of your backend, like http://127.0.0.1:8000/.

How to Use
Once you’ve got the backend and frontend running, you can:

Open the frontend at http://localhost:3000/.

Create an account and start donating or requesting food!

The platform uses a map to help donors and recipients find each other quickly.

License
This project is licensed under the MIT License – see the LICENSE file for details.

How You Can Contribute
We welcome contributions! If you want to help out, follow these steps:

Fork the repository.

Clone your fork:


git clone https://github.com/yourusername/Surplus_Food_sharing_platform.git
Create a new branch:

git checkout -b feature-name
Make your changes and commit them:

git add .
git commit -m "Add a cool new feature"
Push your branch to your fork:

git push origin feature-name
Open a pull request and describe your changes.

Special Thanks
Django Rest Framework: For powering the backend with its amazing API tools.

ReactJS and Vite: For making frontend development so fast and fun!

Map API: For providing the map service that connects donors with recipients.
