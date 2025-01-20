#!/bin/bash

# AWS ECR 로그인
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin ${ECR_REGISTRY}

# 기존 컨테이너 중지 및 삭제
docker-compose down

# 최신 이미지 가져오기
docker-compose pull

# 컨테이너 시작
docker-compose up -d