# PALMSTRY GitFlow Strategy

## Branches

- `main`: Production-ready code only.
- `develop`: Integration branch for features.
- `feature/*`: New features (e.g., `feature/ai-analysis`).
- `hotfix/*`: Quick fixes for production.
- `release/*`: Preparation for a new production release.

## Workflow

1. Create a `feature/*` branch from `develop`.
2. Develop and test locally.
3. Open a PR to `develop`.
4. After review and merge, deletion of the feature branch.
5. When ready for release, create a `release/*` branch from `develop`.
6. Merge `release/*` into `main` and `develop`.
7. Tag the release on `main`.
