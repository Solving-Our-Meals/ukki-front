# Build stage
FROM node:14 as build
WORKDIR /app

# 먼저 .env 파일 복사
COPY .env ./
COPY package*.json ./
RUN npm install
COPY . .

# 환경변수 확인 (쉘 스크립트로 변경)
RUN /bin/sh -c 'echo "Checking environment variables..." && \
    if [ -f .env ]; then \
        echo "Contents of .env file:" && \
        cat .env; \
    else \
        echo ".env file not found"; \
    fi'

RUN npm run build

# Production stage
FROM node:14
WORKDIR /app
COPY --from=build /app/build ./build
RUN npm install -g serve
EXPOSE 80
CMD ["serve", "-s", "build", "-l", "80"]