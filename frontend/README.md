# Visa Dossier Assessment – Frontend (Remix) 
## 🚀 Features - Upload files (with validation and feedback) 
- List uploaded files, grouped by category (`passport`, `visa`, `photo`) 
- Delete uploaded files - Show file names/types for non-images 
- Responsive, accessible design using TailwindCSS 
- Error and success feedback for user actions 

## 📦 Tech Stack 
- [Remix](https://remix.run/) (React Router) 
- TypeScript 
- TailwindCSS 
- Vite 
- Consumes the [Laravel backend API](../backend) 
 
## 🛠️ Setup & Run 1. 
### 1. **Clone and install dependencies:** 
```sh
  cd frontend npm install 
```
### 2. **Configure API base URL:** 
   - Copy `.env.example` to `.env` and set the backend URL (default: `http://localhost:8000`): ``` VITE_API_BASE_URL=http://localhost:8000 ```

### 3. **Start the development server:**
```sh
  npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) (or as shown in your terminal). 

## 🧪 How to Use & Test 
### 1. **Upload a File** 
- Click "Upload" on any document card. 
- Choose a file (PNG, JPG, or PDF, max 4MB).
- Wait for upload feedback. 

### 2. **View Uploaded Files** 
- Files are grouped by category.
- Files should show a file icon and filename. 

### 3. **Delete a File** 
- Click the "trash" icon next to an uploaded file. 

### 4. **Error Handling** 
- Uploads with invalid types or sizes show errors. 
- Backend/network errors display an error toast. 
- Success and error messages are shown for user actions. 

## 📚 Code Structure 
- `/app/routes/_index.tsx` – Main UI, file listing, upload 
- `/app/components/DocumentUploadCard.tsx` – Per-category upload/view/delete card 
- `/app/components/FilePreview.tsx` – File preview
- `/app/lib/api.ts` – API client & type definitions 

## ⚡️ Tips 
- The backend must be running and accessible at the `VITE_API_BASE_URL`. 
- CORS must be enabled on the backend for local dev. 
- You can adjust categories and file requirements from the backend.