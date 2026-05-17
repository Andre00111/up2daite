#!/bin/bash
docker compose -f docker-compose.dev.yml stop frontend
docker compose -f docker-compose.dev.yml build --no-cache frontend
docker compose -f docker-compose.dev.yml up -d frontend
