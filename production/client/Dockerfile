FROM node:14-alpine AS builder
ENV NODE_ENV production
ENV REACT_APP_API_ENDPOINT /api
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY ./client/package.json .
COPY ./client/yarn.lock .
RUN yarn install --production
# Copy app files
COPY ./client .
# Build the app
RUN yarn build

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html
# Add your nginx.conf
COPY production/client/nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
