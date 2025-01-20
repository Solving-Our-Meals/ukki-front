# 베이스 이미지로 Node.js를 사용합니다.
FROM node:14

# 앱 디렉토리를 생성합니다.
WORKDIR /app

# package.json과 package-lock.json 파일을 복사합니다.
COPY package*.json ./

# 의존성을 설치합니다.
RUN npm install

# 애플리케이션 코드를 복사합니다.
COPY . .

# 애플리케이션을 빌드합니다.
RUN npm run build

# 애플리케이션을 실행합니다.
CMD ["npm", "start"]
