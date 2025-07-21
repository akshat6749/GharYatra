# GharYatra - Real Estate Application

GharYatra is a full-stack web application for Browse, listing, and purchasing real estate properties. It features a Django REST Framework backend and a React frontend with Google Maps integration.

## Project Overview

This application provides a platform for users to engage with real estate listings. Key functionalities include user authentication, property management, interactive maps, and a seamless purchasing process.

### Features

  * **User Authentication:** Secure user registration and login functionality.
  * **Property Listings:** Browse a comprehensive list of available properties with detailed information.
  * **Property Management:** Users can add, edit, and delete their own property listings.
  * **Interactive Maps:** Google Maps integration for visualizing property locations.
  * **Search and Filtering:** Advanced search and filtering options to find suitable properties.
  * **User Profiles:** Dedicated user profiles for managing listings and purchases.

## Tech Stack

### Backend

  * **Django & Django REST Framework:** For building the robust RESTful API.
  * **djangorestframework-simplejwt:** For JSON Web Token authentication.
  * **Pillow:** For image processing and handling property photos.
  * **django-cors-headers:** To handle Cross-Origin Resource Sharing (CORS).

### Frontend

  * **React:** For building the user interface.
  * **Vite:** As the build tool for the frontend.
  * **React Router:** For handling client-side routing.
  * **Tailwind CSS:** For styling the application.
  * **Axios:** For making API requests to the backend.
  * **Google Maps JS API Loader:** To integrate Google Maps functionality.

## Setup and Installation

### Backend

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/akshat6749/gharyatra.git
    cd gharyatra/backend
    ```
2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Run migrations:**
    ```bash
    python manage.py migrate
    ```
4.  **Start the development server:**
    ```bash
    python manage.py runserver
    ```

### Frontend

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```

## API Endpoints

The backend exposes several API endpoints for handling authentication and property data. The base URL for the API is `/api/`.

### Authentication

  * `auth/signup/`: User registration.
  * `auth/login/`: User login.
  * `auth/profile/`: User profile details.
  * `auth/token/refresh/`: Refresh JWT token.

### Properties

  * `properties/`: List and create properties.
  * `properties/<id>/`: Retrieve, update, and delete a specific property.
  * `properties/my-properties/`: View properties listed by the authenticated user.
  * `properties/<property_id>/purchase/`: Purchase a property.

## Project Structure

The project is organized into two main directories: `backend` and `frontend`.

### Backend

  * **`accounts`**: Manages user authentication and profiles.
  * **`properties`**: Handles property listings, purchases, and favorites.
  * **`backend`**: Contains the main Django project settings and configurations.

### Frontend

  * **`src/components`**: Reusable React components.
  * **`src/pages`**: Main pages of the application.
  * **`src/contexts`**: React context for state management.
  * **`src/services`**: API service for backend communication.

For a detailed breakdown of the project, please refer to the `documentation.html` file included in the repository.
