---
title: 'Docker'
description: 'Understand what Docker is, core concepts like images, containers, networking, volumes, and Docker Compose.'
pubDate: 'Aug 14 2025'
heroImage: '../../assets/images/example-blog-hero2.jpg'
category: 'Showcase'
tags: ['astro', 'ui']
---

Docker is a **containerization platform**.

Think of Docker like a lightweight virtual machine, but much faster and more efficient.

- A virtual machine needs an entire OS for each app.
- A Docker container shares the host OS and runs only the app + its dependencies.

✔ **In simple words:** Docker packages your application and everything it needs (libraries, dependencies, configs) into a container so it runs the same everywhere — on any machine, cloud, or server.

## Key Docker Concepts

### 1️⃣ Docker Engine

This is the core of Docker. It runs on your machine and manages everything.

It has 3 parts:

1. **Docker Daemon (`dockerd`)**
   - The brain of Docker.
   - Runs in the background.
   - Creates images, containers, networks, volumes.

2. **Docker CLI (`docker` command)**
   - The command-line tool you use.
   - Examples:

     ```bash
     docker ps
     docker run nginx
     ```

3. **REST API**
   - Lets other tools communicate with Docker programmatically.

### 2️⃣ Docker Images

An image is like a template or blueprint of your app.

Examples:

- `ubuntu` image
- `python:3.10` image
- `nginx` image

Images are:

- Read-only
- Created step-by-step using a `Dockerfile`

Example Dockerfile:

```dockerfile
FROM python:3.10
COPY app.py .
CMD ["python", "app.py"]
```

Build image:

```bash
docker build -t myapp .
```

### 3️⃣ Docker Containers

A container is a running instance of an image.

Example:

```bash
docker run nginx
```

This creates a running container using the `nginx` image.

Container characteristics:

- Isolated environment (filesystem, network, processes)
- Lightweight (no full OS inside)
- Fast start/stop
- Disposable (you can delete & recreate easily)

### 4️⃣ Docker Registry (Docker Hub)

This is where Docker images are stored.

Common registries:

- Docker Hub (public)
- GitHub Container Registry
- Google Container Registry
- AWS ECR

Examples:

```bash
docker pull python:3.10
docker push myapp:latest
```

## Docker Networking

Docker containers are isolated, but often they must talk to each other.

Docker provides 3 main network types:

### 1️⃣ Bridge Network (default)

Best for containers on the same host.

When you run:

```bash
docker run -d nginx
```

Docker connects it to the `bridge` network automatically.

You can create your own network:

```bash
docker network create mynet
docker run -d --network=mynet nginx
```

Now containers can communicate by container name.

### 2️⃣ Host Network

The container shares the host machine’s network.

Example:

```bash
docker run --network host nginx
```

Best for:

- High performance servers
- Removing network overhead

### 3️⃣ None Network

The container has no network.

```bash
docker run --network none ubuntu
```

Used for:

- Security
- Isolated workloads

### How Docker networking works internally

- Docker creates a virtual Ethernet bridge (`docker0`).
- Every container gets a virtual network interface (`veth`).
- Packets are routed using Linux networking.

## Docker Volumes

Containers are temporary. When destroyed, data inside is lost.

Volumes provide **permanent storage**.

Example:

```bash
docker volume create data
docker run -v data:/var/lib/mysql mysql
```

Used for:

- Databases
- Logs
- File storage

## Docker Compose (Very Important)

When you need multiple containers for a complete app, for example:

- Backend container
- Frontend container
- Database container

Managing them manually is messy. Docker Compose solves this.

You describe everything in `docker-compose.yml`:

```yaml
version: "3"

services:
  web:
    image: nginx
    ports:
      - "8080:80"
    depends_on:
      - app

  app:
    build: .
    container_name: myapp
    ports:
      - "5000:5000"

  db:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
```

Run whole stack:

```bash
docker compose up
```

Stop:

```bash
docker compose down
```

What Docker Compose actually does:

- Creates a network for your services
- Starts containers in the correct order
- Manages logs, restarts, scaling
- Connects containers using names (`db`, `app`, `web`)

## How Docker Works Internally

1. You write a `Dockerfile` → build an image.
2. You run the image → creates a container.
3. Docker Engine manages:
   - filesystem (UnionFS)
   - networking
   - CPU/memory limits
   - isolation using:
     - namespaces
     - cgroups
     - chroot filesystem
4. Containers share the host kernel → that’s why they’re fast and lightweight.

## Summary Table

| Component | What it does                 | Example                |
|----------|------------------------------|------------------------|
| Image    | Blueprint                    | `python:3.10`         |
| Container| Running instance of image    | `docker run python`   |
| Volume   | Persistent storage           | DB data                |
| Network  | Communication                | `docker network create`|
| Compose  | Manages multi-container setup| `docker compose up`   |
| Registry | Stores images                | Docker Hub             |

