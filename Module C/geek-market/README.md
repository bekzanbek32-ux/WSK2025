# Geek Marketplace — REST API

## 1. Project Overview

Geek Marketplace is a REST API for a classifieds platform where users can publish and browse advertisements for collectible items, LEGO sets, board games, books, electronics, vehicles, and other products.

The application is built with Laravel, PHP, and MySQL.

The API supports three types of access:
- Guest — can browse published advertisements and categories.
- User — can manage their own advertisements and activate paid services.
- Moderator — can moderate advertisements and manage their statuses.

## 2. Technologies

- PHP 8.2+
- Laravel
- MySQL
- Laravel Sanctum
- REST API
- JSON
- Postman
- OpenAPI 3.0.3

## 3. Installation and Setup

### Requirements

- PHP 8.2 or newer
- Composer
- MySQL
- XAMPP or another local development environment

### Installation

1. Clone or copy the project.
2. Open the project directory.
3. Install dependencies:

```bash
composer install
```

4. Configure the `.env` file with your database credentials.

Example:

```env
APP_NAME="Geek Marketplace"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=geek_market
DB_USERNAME=root
DB_PASSWORD=
```

5. Create the MySQL database named `geek_market`.

6. Import `database/DB_DUMP.sql` into the database using phpMyAdmin or MySQL.

7. Generate the application key if it has not already been configured:

```bash
php artisan key:generate
```

8. Start the Laravel development server:

```bash
php artisan serve
```

The API base URL is:

```text
http://127.0.0.1:8000/api
```

## 4. Authentication

The API uses Laravel Sanctum Bearer Token authentication.

Registration:

```http
POST /api/register
```

Login:

```http
POST /api/login
```

Example login request:

```json
{
    "login": "user@example.com",
    "password": "password"
}
```

The `login` field accepts an email address or phone number.

Logout:

```http
POST /api/logout
```

Protected endpoints require:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## 5. API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Authenticate a user |
| POST | `/api/logout` | Log out the current user |

### User

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user` | Get current user profile |
| PATCH | `/api/user` | Update current user profile |
| GET | `/api/user/adverts` | Get user's advertisements |

The user's advertisements can be filtered by status using the `status` query parameter.

Example:

```http
GET /api/user/adverts?status=draft
```

### Categories

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | Get all categories |

### Advertisements

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/adverts` | Get published advertisements |
| POST | `/api/adverts` | Create an advertisement |
| GET | `/api/adverts/{id}` | Get advertisement details |
| PATCH | `/api/adverts/{id}` | Update an advertisement |
| DELETE | `/api/adverts/{id}` | Delete an advertisement |
| POST | `/api/adverts/{id}/update-status` | Change advertisement status |

### Advertisement Filters and Sorting

The advertisement list supports:

| Parameter | Description |
|---|---|
| `category_id` | Filter by category |
| `price_from` | Minimum price |
| `price_to` | Maximum price |
| `query` | Search by title, text, category name, or author's name |
| `sort_by` | Sort by `date` or `price` |
| `sort` | Sort direction: `asc` or `desc` |
| `page` | Page number |
| `per_page` | Number of results: 10, 20, or 30 |

Example:

```http
GET /api/adverts?category_id=C1&sort_by=price&sort=asc
```

## 6. Advertisement Status Management

Advertisements support five statuses:

- `draft`
- `moderation`
- `declined`
- `published`
- `archived`

Users can:
- Submit drafts for moderation.
- Return published or declined advertisements to draft.
- Archive draft, published, or declined advertisements.

Moderators can:
- Publish advertisements submitted for moderation.
- Decline advertisements submitted for moderation.
- Decline published advertisements.

Only the advertisement owner or an authorized moderator can perform the corresponding operations.

## 7. Advantage Services — TOP and VIP

The project supports two paid promotion services.

### TOP

- Duration: 3 days.
- TOP advertisements appear before VIP advertisements.
- TOP advertisements must satisfy all search filters.
- Multiple TOP advertisements are ordered by activation time, newest first.
- TOP advertisements do not appear again in the regular results.

### VIP

- Duration: 7 days.
- The first three VIP positions are selected randomly.
- VIP advertisements are excluded from the regular results.
- VIP advertisements ignore the text search filter.
- Category filters still apply.
- Price filters allow a deviation of less than 100 from the selected price boundaries.

### Paid Services Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/adverts/{advertId}/services` | Activate TOP or VIP |
| GET | `/api/adverts/{advertId}/services` | Get advertisement services |
| POST | `/api/adverts/{advertId}/services/{serviceId}/extend` | Extend a paid service |

These endpoints require Bearer Token authentication and are restricted to the advertisement owner.

Example activation request:

```json
{
    "type": "VIP"
}
```

Available service types:

- `TOP`
- `VIP`

## 8. Advertisement Views

The project stores authenticated user views in the `views` table.

- The first view creates a record.
- Repeated views by the same user update the existing record's `updated_at`.
- A unique constraint prevents duplicate records for the same advertisement and user.
- The advertisement's `views_count` is incremented on the first recorded view.

## 9. Database Structure

The database contains the following main tables:

- `users` — user accounts and roles.
- `categories` — advertisement categories.
- `adverts` — advertisements and their information.
- `advert_images` — advertisement image records.
- `advert_paid_services` — TOP and VIP service records.
- `views` — advertisement view history.
- Laravel support tables, including Sanctum tokens and framework tables.

Advertisement photos are also stored as a JSON array in the `adverts.photos` field.

Database files:

```text
database/
├── DB_DUMP.sql
└── ERD.png
```

## 10. API Documentation

The OpenAPI specification is available at:

```text
swagger/openapi.yaml
```

It describes the API endpoints, request parameters, authentication requirements, and response schemas.

## 11. Testing

API endpoints can be tested using Postman.

Recommended test areas:

- Registration and authentication.
- User profile management.
- Advertisement creation and editing.
- Advertisement status transitions.
- Advertisement deletion permissions.
- Category and price filtering.
- Text search and sorting.
- Pagination.
- TOP and VIP activation, extension, and prioritization.
- Advertisement views.

## 12. Project Structure

```text
geek-market/
├── app/
│   ├── Http/Controllers/Api/
│   └── Models/
├── database/
│   ├── migrations/
│   ├── DB_DUMP.sql
│   └── ERD.png
├── routes/
│   └── api.php
├── swagger/
│   └── openapi.yaml
├── README.md
└── .env
```

## 13. License

This project was developed as part of a WorldSkills training assignment.