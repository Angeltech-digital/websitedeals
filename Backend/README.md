DealsDuka - Backend (Django)

This folder contains a minimal Django REST Framework backend for the DealsDuka MVP.

Quick start (Linux)

1. Create and activate a venv

    python3 -m venv env
    source env/bin/activate

2. Install dependencies

    pip install -r requirements.txt

3. Run migrations and create superuser

    python manage.py makemigrations
    python manage.py migrate
    python manage.py createsuperuser

4. Start the dev server

    python manage.py runserver

API endpoints

- /api/products/  - CRUD for products (list, create, retrieve, update, delete)
- /api/orders/    - Create and view orders
- /api/auth/token/ - Obtain JWT
- /api/auth/token/refresh/ - Refresh JWT

Notes

- Media uploaded images are served in development from /media/
- For production, configure ALLOWED_HOSTS and proper secret management.
