# GitHub Actions Workflows

This folder contains all the workflows used for automating CI/CD pipelines and managing the backend repository of the Cryptobay DApp. These workflows ensure reliable development processes, consistent code quality, and seamless deployment.

## Workflow Overview

### 1. **`ci.yml`**

#### Purpose

This workflow validates all code changes through testing, and building. It is a crucial step to ensure quality before merging changes into the main branch.

#### Key Features

- Runs unit and integration tests.
- Builds the backend application to validate code changes.

#### Triggered On

- Pull requests to `main` and `develop`.
- Pushes to `develop`.

---

### 2. **`build-and-deploy.yml`**

#### Purpose

This workflow manages the building and deployment of the backend application as a Docker container for different environments (`devnet` and `mainnet`).

#### Key Features

- Builds Docker images for the backend.
- Pushes images to the GitHub Container Registry (GHCR).
- Deploys to the `devnet` or `mainnet` environment based on the branch (`develop` or `main`).

#### Triggered On

- Pushes to `main` and `develop`.

---

### 3. **`cleanup.yml`**

#### Purpose

This workflow manages the GitHub Container Registry by cleaning up old and untagged Docker images.

#### Key Features

- Removes untagged Docker images weekly.
- Keeps the container registry clean and organized.

#### Triggered On

- A scheduled cron job (`every Sunday at midnight`).

---

### 4. **`release.yml`**

#### Purpose

This workflow facilitates production releases by creating a versioned release of the backend application.

#### Key Features

- Builds and tags a versioned Docker image.
- Pushes the versioned Docker image to GHCR.
- Supports manual triggers via GitHub's `workflow_dispatch`.

#### Triggered On

- Manual triggers.
- Pushes to tags matching the format `v*.*.*`.

---

## Folder Structure

.github/
└── workflows/
├── ci.yml # Continuous Integration workflow for testing, and building.
├── build-and-deploy.yml # Builds and deploys Docker images for devnet and mainnet.
├── cleanup.yml # Cleans up old and untagged Docker images.
├── release.yml # Manages versioned production releases.

---

## How to Use

1. **CI Workflow:**

   - Submit a pull request to `develop` or `main`. The CI workflow (`ci.yml`) will automatically validate the code.

2. **Build and Deploy Workflow:**

   - Push to `develop` to deploy to the `devnet` environment.
   - Push to `main` to deploy to the `mainnet` environment.

3. **Cleanup Workflow:**

   - This workflow runs automatically every Sunday and does not require manual interaction.

4. **Release Workflow:**
   - Tag a commit with the format `v*.*.*` (e.g., `v1.0.0`).
   - The release workflow will create a versioned Docker image for production.

---

## Key Concepts

- **Environment-Specific Deployments:** Workflows differentiate between `devnet` and `mainnet` based on branches.
- **Docker Integration:** Docker is used to containerize the backend application, enabling consistency across environments.
- **Automated Registry Management:** The `cleanup.yml` workflow ensures efficient use of the container registry by removing outdated images.
- **Versioned Releases:** The `release.yml` workflow creates production-ready releases that are easy to track and deploy.

---
