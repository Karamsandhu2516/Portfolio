---
title: 'GitHub Actions for DevOps: Modern CI/CD in the Cloud'
description: 'Master GitHub Actions for automated CI/CD pipelines. Learn workflows, secrets management, matrix builds, deployment strategies, and integration with Kubernetes and cloud providers.'
pubDate: '2025-12-04'
heroImage: '../../assets/images/github-actions-hero.png'
category: 'DevOps'
tags: ['github-actions', 'cicd', 'automation', 'devops', 'github']
---

GitHub Actions has become the go-to CI/CD solution for modern DevOps teams. With native GitHub integration, powerful workflow capabilities, and generous free tier, it's transforming how we automate software delivery.

## Why GitHub Actions?

**Key Advantages:**
- **Native Integration** - Built into GitHub, no separate CI server
- **Free Tier** - 2,000 minutes/month for private repos
- **Marketplace** - 10,000+ pre-built actions
- **Matrix Builds** - Test across multiple versions/platforms
- **Self-Hosted Runners** - Run on your own infrastructure
- **Workflow-as-Code** - YAML files in your repository

## Basic Workflow Structure

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
```

## Workflow Triggers

### Push and Pull Requests

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'package.json'
  pull_request:
    branches: [main, develop]
```

### Scheduled Workflows (Cron)

```yaml
on:
  schedule:
    - cron: '0 2 * * 1'  # Every Monday at 2 AM
  workflow_dispatch:  # Manual trigger
```

### Multiple Events

```yaml
on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]
  release:
    types: [published]
```

## Advanced Workflow Patterns

### Matrix Builds

Test across multiple versions:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
        os: [ubuntu-latest, windows-latest, macos-latest]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Install and test
        run: |
          npm ci
          npm test
```

### Job Dependencies

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
      
      - name: Run tests
        run: npm test

  deploy:
    needs: [build, test]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy
        run: ./deploy.sh
```

### Conditional Steps

```yaml
steps:
  - name: Build
    run: npm run build
  
  - name: Deploy to Staging
    if: github.ref == 'refs/heads/develop'
    run: ./deploy-staging.sh
  
  - name: Deploy to Production
    if: github.ref == 'refs/heads/main'
    run: ./deploy-production.sh
```

## Docker Workflows

### Build and Push Docker Image

```yaml
name: Docker Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            myregistry/myapp:latest
            myregistry/myapp:${{ github.sha }}
          cache-from: type=registry,ref=myregistry/myapp:buildcache
          cache-to: type=registry,ref=myregistry/myapp:buildcache,mode=max
```

### Multi-Stage Docker Build

```yaml
- name: Build multi-platform image
  uses: docker/build-push-action@v5
  with:
    context: .
    platforms: linux/amd64,linux/arm64
    push: true
    tags: myregistry/myapp:${{ github.sha }}
```

## Kubernetes Deployment

### Deploy to Kubernetes

```yaml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure kubectl
        uses: azure/setup-kubectl@v3
      
      - name: Set kubeconfig
        run: |
          echo "${{ secrets.KUBECONFIG }}" | base64 -d > kubeconfig
          export KUBECONFIG=kubeconfig
      
      - name: Deploy
        run: |
          kubectl set image deployment/myapp \
            app=myregistry/myapp:${{ github.sha }} \
            -n production
          kubectl rollout status deployment/myapp -n production
```

### Using Kubernetes Actions

```yaml
- name: Deploy to Kubernetes
  uses: azure/k8s-deploy@v4
  with:
    manifests: |
      k8s/deployment.yaml
      k8s/service.yaml
    images: |
      myregistry/myapp:${{ github.sha }}
    kubectl-version: 'latest'
```

## Cloud Provider Integration

### AWS Deployment

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster my-cluster \
            --service my-service \
            --force-new-deployment
```

### Azure Deployment

```yaml
- name: Azure Login
  uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}

- name: Deploy to Azure Web App
  uses: azure/webapps-deploy@v2
  with:
    app-name: 'myapp'
    package: './dist'
```

### GCP Deployment

```yaml
- name: Authenticate to GCP
  uses: google-github-actions/auth@v1
  with:
    credentials_json: ${{ secrets.GCP_SA_KEY }}

- name: Deploy to Cloud Run
  run: |
    gcloud run deploy myapp \
      --image gcr.io/${{ secrets.GCP_PROJECT }}/myapp:${{ github.sha }} \
      --region us-central1
```

## Secrets Management

### Using Secrets

```yaml
steps:
  - name: Use secret
    env:
      API_KEY: ${{ secrets.API_KEY }}
      DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
    run: |
      echo "API Key is set"
      # Use secrets in your scripts
```

### Environment-Specific Secrets

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy
        env:
          API_URL: ${{ secrets.STAGING_API_URL }}
        run: ./deploy.sh

  deploy-production:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy
        env:
          API_URL: ${{ secrets.PRODUCTION_API_URL }}
        run: ./deploy.sh
```

## Reusable Workflows

### Callable Workflow

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      image_tag:
        required: true
        type: string

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to ${{ inputs.environment }}
        run: |
          echo "Deploying ${{ inputs.image_tag }} to ${{ inputs.environment }}"
          ./deploy.sh ${{ inputs.environment }} ${{ inputs.image_tag }}
```

### Using Reusable Workflow

```yaml
name: CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t myapp:${{ github.sha }} .
      - run: docker push myapp:${{ github.sha }}

  deploy:
    needs: build
    uses: ./.github/workflows/deploy.yml
    with:
      environment: production
      image_tag: ${{ github.sha }}
    secrets: inherit
```

## Self-Hosted Runners

### Setup Self-Hosted Runner

```yaml
jobs:
  build:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

**Benefits:**
- No minute limits
- Custom hardware
- Access to private networks
- Faster builds

**Security Considerations:**
- Use dedicated VMs
- Regular updates
- Network isolation
- Least privilege access

## Complete CI/CD Pipeline Example

```yaml
name: Full CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Test
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  security:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

  deploy-staging:
    needs: [build, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
      - name: Deploy to staging
        run: |
          kubectl set image deployment/myapp \
            app=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -n staging
          kubectl rollout status deployment/myapp -n staging

  deploy-production:
    needs: [build, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Deploy to production
        run: |
          kubectl set image deployment/myapp \
            app=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -n production
          kubectl rollout status deployment/myapp -n production
      
      - name: Run smoke tests
        run: ./scripts/smoke-tests.sh production
```

## Best Practices

1. **Use Actions Marketplace** - Leverage pre-built actions
2. **Cache Dependencies** - Speed up builds
3. **Matrix Testing** - Test across versions
4. **Environment Protection** - Use GitHub environments
5. **Secrets Management** - Never hardcode secrets
6. **Workflow Reusability** - Create reusable workflows
7. **Artifact Management** - Store build artifacts
8. **Notifications** - Keep teams informed
9. **Security Scanning** - Integrate security tools
10. **Cost Optimization** - Use caching and self-hosted runners

## Troubleshooting

### Debug Workflows

```yaml
- name: Debug
  run: |
    echo "::debug::This is a debug message"
    echo "::warning::This is a warning"
    echo "::error::This is an error"
```

### Enable Step Debugging

Set secret: `ACTIONS_STEP_DEBUG: true`

### View Logs

- Check Actions tab in GitHub
- Download logs for failed jobs
- Use `tmate` action for interactive debugging

## Conclusion

GitHub Actions provides a powerful, integrated CI/CD solution. By leveraging:
- Native GitHub integration
- Extensive marketplace
- Matrix builds
- Reusable workflows
- Cloud provider integrations

You can build sophisticated CI/CD pipelines that automate your entire software delivery process.

**Next Steps:**
- Explore GitHub Actions marketplace
- Set up self-hosted runners
- Create reusable workflows
- Integrate with your cloud provider
- Implement advanced deployment strategies

