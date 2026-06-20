# Deployment Guide

## Production Checklist

- [ ] Set secure `SECRET_KEY` (generate with: `openssl rand -hex 32`)
- [ ] Add Gemini API key
- [ ] Configure PostgreSQL database
- [ ] Setup Redis cache
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Setup monitoring and logging
- [ ] Configure backups
- [ ] Setup CI/CD pipeline

## AWS Deployment

### 1. RDS PostgreSQL Setup
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier legal-assistant-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password SECURE_PASSWORD
```

### 2. ElastiCache Redis
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id legal-assistant-cache \
  --cache-node-type cache.t3.micro \
  --engine redis
```

### 3. ECS Deployment
```bash
# Build and push Docker image
aws ecr create-repository --repository-name legal-assistant-api
docker build -f Dockerfile.backend -t legal-assistant-api:latest .
aws ecr get-login-password | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com
docker tag legal-assistant-api:latest YOUR_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/legal-assistant-api:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/legal-assistant-api:latest

# Create ECS cluster and task
aws ecs create-cluster --cluster-name legal-assistant
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### 4. CloudFront Distribution
```bash
# Create CloudFront distribution for frontend
aws cloudfront create-distribution --distribution-config file://cf-config.json
```

## Vercel Deployment (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL https://api.yourdomain.com
```

## GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push Docker image
        run: |
          docker build -f Dockerfile.backend -t legal-assistant-api:${{ github.sha }} .
          # Push to ECR
          
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster legal-assistant --service api --force-new-deployment
```

## Monitoring & Logging

### CloudWatch Logs
```bash
aws logs create-log-group --log-group-name /ecs/legal-assistant
```

### Performance Monitoring
- Setup CloudWatch alarms for:
  - API response time
  - Database connections
  - Cache hit rate
  - Error rates

### Application Insights
- Integrate with Datadog or New Relic
- Setup APM for performance tracking
- Configure alerts for critical issues

## Scaling Strategies

### Horizontal Scaling
- Use AWS Auto Scaling for ECS
- Load balance with Application Load Balancer
- Scale database with read replicas

### Vertical Scaling
- Increase RDS instance size
- Upgrade cache instance
- Increase ECS task CPU/Memory

## Backup & Recovery

```bash
# PostgreSQL backup
pg_dump -h your-db.amazonaws.com -U admin legal_assistant > backup.sql

# Restore
psql -h your-db.amazonaws.com -U admin legal_assistant < backup.sql

# S3 backup setup
aws s3 sync ./chroma_db s3://your-bucket/chroma_db --delete
```

## Security Hardening

### Network
- Use VPC and security groups
- Enable WAF for ALB
- Use VPN for administrative access

### Database
- Enable encryption at rest
- Use SSL/TLS for connections
- Enable backup encryption
- Regular patching

### Application
- Regular dependency updates
- Security scanning with Snyk
- OWASP compliance checks
- Code reviews before deployment

## Disaster Recovery

### RTO/RPO Targets
- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 15 minutes

### Strategy
1. Daily automated backups
2. Cross-region replication
3. Documented runbooks
4. Regular DR testing

---

For production-grade deployment, consult DevOps team and security experts.
