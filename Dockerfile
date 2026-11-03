# Base Node.js image
FROM node:20-slim AS base

# Set the PNPM_HOME environment variable
ENV PNPM_HOME="/pnpm"

# Add PNPM_HOME to the PATH
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack - ensure package manager consistency
RUN corepack enable

WORKDIR /app

COPY packages ./packages
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY .npmrc ./

# Install dependencies using pnpm
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Runtime stage for adlab-ui
FROM base AS adlab-ui

EXPOSE 3000

WORKDIR /app/packages/adlab-ui

# Start the adlab-ui app
CMD [ "pnpm", "run", "dev:docker" ]

# Runtime stage for adlab-service
FROM base AS adlab-service

EXPOSE 8080
 # for debugging
EXPOSE 9229

WORKDIR /app/packages/adlab-service

# Start the adlab-service app
CMD [ "pnpm", "run", "start" ]
