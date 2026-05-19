FROM node:20-alpine

WORKDIR /app

COPY server.js /app/server.js

RUN apk add --no-cache sqlite && mkdir -p /app/data

EXPOSE 3080 3443

CMD ["node", "/app/server.js"]
