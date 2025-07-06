# Visa Dossier Assessment – Laravel API

A simple, production-grade REST API for file uploads, category grouping, and retrieval.  
Built with Laravel 12, includes test coverage, grouped response, and robust validation.

---

## 🚀 Features

- Upload files (with type/size validation)
- Group media by category (`passport`, `visa`, `photo`)
- Retrieve grouped media in a single endpoint
- Delete files
- Full-featured tests
- Laravel 12 modern structure (API versioning, service layer, enum categories)
- Ready for extension (frontend, auth, chunked upload)

---

## 📦 Tech Stack

- PHP 8.3+ / Laravel 12
- MySQL (works with SQLite for tests)
- Modern testing with PHPUnit & Laravel Testing tools
- Node + Remix for frontend (see `/frontend` folder)

---

## 🚀 Setup & Run

1. **Clone and install dependencies:**
    ```sh
        git clone <THE REPO>
        cd backend
        composer install
    ```
2. **Copy `.env` and generate key:**
    ```sh
      cp .env.example .env
      php artisan key:generate
    ```

3. **Configure your DB. !!!DO NOT USE SQLite because of lack of support of ENUMs!!!**
    ```dotenv
      # .env
      DB_CONNECTION=mysql
      DB_DATABASE=visa_dossier
      DB_USERNAME=root
      DB_PASSWORD=secret
        
      MEDIA_ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png
      MEDIA_MAX_FILE_SIZE_MB=4
    ```

4. **Run migrations:**
    ```sh
      php artisan migrate
    ```

5. **Run dev server:**
    ```sh
      php artisan serve
    ```

---

## 🧪 Running Tests

```sh
  php artisan test
```

## 📚 API Endpoints 

All endpoints are **versioned under `/api/v1`**. 

**1. Upload Media** **POST** `/api/v1/media` 
- **Description:** Upload a file to the server under a specific category.
- **Request:** `multipart/form-data` 
  - `file` (required): The file to upload (jpg, jpeg, png, pdf) 
  - `category` (required): One of `passport`, `visa`, `photo` 
- **Response:** `201 Created` 

**Example Request:**

```http 
POST /api/v1/media 
Content-Type: multipart/form-data 

file=@passport.jpg 
category=passport 
```
**Success Response:**

```json 
{ 
    "data": { 
        "id": 1, 
        "original_name": "passport.jpg", 
        "file_name": "uuid.jpg", 
        "url": "http://backend.test/storage/media/uuid.jpg", 
        "type": "image/jpeg", 
        "category": "passport", 
        "created_at": "...", 
        "updated_at": "..."
    }
} 
```
**Validation Error (422):**

```json 
{ 
    "message": "The file may not be greater than 4MB.", 
    "errors": { 
        "file": [ 
            "The file may not be greater than 4MB." 
        ]
    }
} 
``` 


**2. List Grouped Media** **GET** `/api/v1/media` 
- **Description:** Retrieve all uploaded files, grouped by category. 
- **Response:** `200 OK` 

- **Example Response:**
```json 
{ 
    "data": { 
        "passport": [{}], 
        "visa": [{}], 
        "photo": [{}]
    }
} 
``` 

**3. Delete Media** **DELETE** `/api/v1/media/{id}` 
- **Description:** Delete a media file by its ID.
- **Response:** `204 No Content` (success), `404 Not Found` (if not found) 

**Example Success:**
```http 
DELETE /api/v1/media/123 
HTTP/1.1 204 No Content 
``` 
**Example Not Found:**
```json 
{ 
    "message": "No query results for model [App\\Models\\Media] 123"
} 
``` 

**Note:** 
- All endpoints are unauthenticated (public) by assessment design. 
- Response objects follow Laravel Resource/Collection structure.
