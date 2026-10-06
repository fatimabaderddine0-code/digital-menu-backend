# Digital Menu Backend Documentation

## Backend Overview
The backend was built using Node.js and Express.js.
It connects to a MySQL database and provides API endpoints for the Digital Menu frontend.

## Database Structure
The database contains three main tables:

### categories
- id
- name

### menu_items
- id
- name
- description
- price
- image
- category_id

### admins
- id
- email
- password

## API Endpoints

### Categories
GET /api/categories
Returns all menu categories.

### Menu Items
GET /api/items
Returns all menu items.

GET /api/items?category=1
Filters items by category.

GET /api/items?search=pizza
Searches items by name.

POST /api/items
Creates a new menu item.

PUT /api/items/:id
Updates an existing menu item.

DELETE /api/items/:id
Deletes a menu item.

## Image Upload
Multer is used to upload item images.
Images are stored in the uploads folder and the filename is saved in the database.

## Input Validation
The backend checks required fields such as name, price, and category.
The price must be a positive number.

## Admin Authentication
Admins log in using:

POST /api/auth/login

Passwords are checked using bcrypt and a JWT token is returned.
The token is required for create, update, and delete requests.

## Frontend Connection
The React frontend uses fetch() to request data from the backend.

Example:

fetch("http://localhost:5000/api/items")

The frontend receives JSON data and displays the menu items.

Search and category filters also send requests to the backend.

## Testing
The APIs were tested using Postman and the browser.