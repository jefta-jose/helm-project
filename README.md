# Helm Microservices Project

A Kubernetes-based microservices application managed with Helm, featuring customer registration and PostgreSQL database services.

## Project Structure

```
helm-project/
├── helm/
│   ├── customer-register/    # Customer registration service Helm chart
│   └── postgress-db/         # PostgreSQL database Helm chart
├── services/
│   ├── customer-register/    # Customer registration Node.js service
│   └── customer-purchase/    # Customer purchase Node.js service
└── db/
    └── seed.sql             # Database initialization script
```

## Architecture Overview

This project demonstrates a microservices architecture with the following components:

- **PostgreSQL Database**: Deployed in the `postgres-database` namespace
- **Customer Register Service**: Deployed in the `customer-services` namespace
- **Customer Purchase Service**: Deployed in the `customer-services` namespace

## Cross-Namespace Communication

### Service Discovery

When services are deployed in different namespaces, you must use the fully qualified domain name (FQDN) for communication:

```
<service-name>.<namespace>.svc.cluster.local
```

**Example**: The customer-register service connects to the PostgreSQL database using:
```
db-postgres-db.postgres-database.svc.cluster.local
```

**Why?** Kubernetes DNS resolution **defaults to the current namespace**. If you reference only `db-postgres-db` from the `customer-services` namespace, Kubernetes won't find the service in the `postgres-database` namespace.

## Helm Management

### Common Commands

```bash
# List all Helm releases
helm list

# Install a chart
helm install <release-name> <chart-path> --namespace <namespace> --create-namespace

# Upgrade a release
helm upgrade <release-name> <chart-path>

# Uninstall a release
helm uninstall <release-name> --namespace <namespace>
```

**Note**: Helm tracks releases in the namespace specified with the `--namespace` flag during installation or upgrade.

## Configuration Management

### Viewing ConfigMaps

```bash
kubectl get configmap -n customer-services -o yaml
```

### Updating Configurations

Kubernetes does not automatically restart pods when ConfigMaps change. After updating a ConfigMap, manually restart the pods:

```bash
kubectl rollout restart deployment/<deployment-name> -n <namespace>
```

## Database Initialization

### Seeding Data with Helm

The PostgreSQL chart includes automatic database seeding on first initialization:

1. **ConfigMap Setup**: A dedicated ConfigMap contains the SQL initialization script
2. **Volume Mount**: The init script is mounted to `/docker-entrypoint-initdb.d/` in the deployment
3. **Automatic Execution**: PostgreSQL automatically executes all `.sql` files in this directory on first startup

**Implementation Details**:
- The `configmap.yaml` includes a second ConfigMap for the init script
- The `deployment.yaml` mounts this ConfigMap as a volume
- SQL scripts use `ON CONFLICT DO NOTHING` clauses to prevent errors on re-runs

### How It Works

```yaml
# ConfigMap with init script
apiVersion: v1
kind: ConfigMap
metadata:
  name: db-init-script
data:
  init.sql: |
    CREATE TABLE IF NOT EXISTS customers (...);
    INSERT INTO customers (...) ON CONFLICT DO NOTHING;
```

The PostgreSQL container automatically processes these scripts during initialization, creating tables and inserting seed data.

## Troubleshooting

### Service Connection Issues

**Problem**: Service A cannot connect to Service B in a different namespace.

**Solution**: Use the FQDN format `<service-name>.<namespace>.svc.cluster.local`

### Configuration Not Updating

**Problem**: ConfigMap changes don't reflect in running pods.

**Solution**: Restart the deployment to pick up new configurations:
```bash
kubectl rollout restart deployment/<deployment-name> -n <namespace>
```

## Development

Each service includes:
- `Dockerfile` for containerization
- `app.http` for API testing
- Node.js application with controllers and services
- Database configuration

## Prerequisites

- Kubernetes cluster (local or cloud)
- Helm 3.x
- kubectl configured for your cluster
- Docker (for building images)

## Getting Started

1. Deploy the PostgreSQL database:
   ```bash
   helm install postgres-db ./helm/postgress-db --namespace postgres-database --create-namespace
   ```

2. Deploy the customer register service:
   ```bash
   helm install customer-register ./helm/customer-register --namespace customer-services --create-namespace
   ```

3. Verify deployments:
   ```bash
   kubectl get pods -n postgres-database
   kubectl get pods -n customer-services
   ```