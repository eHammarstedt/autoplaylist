#!/usr/bin/env sh
(cd autoplaylist-backend && docker build -t richodemus/autoplaylists-backend:latest .)
(cd autoplaylist-frontend && docker build -t richodemus/autoplaylists-frontend:latest .)
