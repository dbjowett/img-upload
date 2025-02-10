### Clone Repo

```bash
git clone https://github.com/dbjowett/img-upload.git
```

### Run Development

```bash
pnpm dev
```

### Run Production (Docker)

```bash
docker build -t upload-app .

docker run --name upload-app -p 3000:3000 upload-app

```

Open [http://localhost:3000](http://localhost:3000).
