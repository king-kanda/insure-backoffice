FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
# BACKEND_URL is injected at runtime via docker-compose environment
RUN npm run build
CMD ["npm", "start"]
