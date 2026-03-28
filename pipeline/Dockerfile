FROM python:3.12-slim

WORKDIR /app

# 시스템 의존성
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Claude CLI 설치
RUN npm install -g @anthropic-ai/claude-code

# Python 의존성
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드
COPY . .

# 데이터 디렉토리 (볼륨으로 마운트)
RUN mkdir -p data/pain_points data/hypotheses data/insights data/cycles data/metrics

ENV PYTHONUNBUFFERED=1

CMD ["python", "orchestrator.py"]
