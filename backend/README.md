# Image Tools Backend

Stateless REST API for image tools (passport photo, compress, resize, image-to-pdf) with temporary local storage.

## Setup

```bash
cd backend
npm install
```

## Run (dev)

```bash
npm run dev
```

## Run (prod)

```bash
npm start
```

## Notes

- Max file size: 5MB
- Allowed types: JPG, PNG
- Download tokens expire in 2 minutes
- Temp files are stored in `backend/uploads` and deleted after download
