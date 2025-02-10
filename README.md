### 1. Clone Repo

```bash
git clone https://github.com/dbjowett/img-upload.git
```

### 2. Run Development

```bash
cd project

pnpm install

pnpm run dev
```

### 2. Run Production (Docker)

```bash
docker build -t upload-app .

docker run --name upload-app -p 3000:3000 upload-app

```

### 3. Open [http://localhost:3000](http://localhost:3000).

---

### To Upload Images

#### 1. Click `Select an image` button

#### 2. Navigate to `Images` tab

#### 3. Images tab contains `compressed` copy of original image (20%)

#### 3. Click image to view `original` image

#### 4. Click `3 dots` to see options (_Download image (compressed or original) or delete image_)

#### 5. Optional - Toggle Dark Mode 😎

## Application Overview

Key decisions:

Why this techstack?:

- Next.js as it a full stack application great for implementing quick projects.
- React Query (Tanstack Query) in order to invalidate stale queries when updating data on the server.
- sharp.js since I would need to compress images in a tight deadling
- ShadCn for quickly building out the FE to look 1/2 decent.

Image Storage:

- Images stored in /public/images directory
- Folder created for each file uploaded, starting at 1 and this number is used as the ID of the image as well
- Inside this folder, I create a metadata.json as well as store the compressed and original files.
- Images are passed to the backend using FormData which is very easy in Next.js

#### Possible improvements

- When attempting to upload an image, send the FE a presigned URL to store in an AWS bucket. This would take strain off of our server and allow the user to upload directly to its final destination.
- Ensure all possible errors are handled
- Move all queries into a query folder (or the query hooks)

### AI Usage

- I tried to challenge myself to not use AI in this project and only used it to debug

```dockerfile
# Namely here: >:(
# Next.js things
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
```

- Additionally I spent too long trying to debug line 22 inside the `getBase64Images` function, so I asked AI... I was not returning the Promise.all.... >:(
