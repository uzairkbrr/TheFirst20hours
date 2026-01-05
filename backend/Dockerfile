# Build stage
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
# gcc and python3-dev might be needed for some python packages if they need compilation
# but for basic fastapi/sqlalchemy usually slim is fine unless specific drivers needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run commands
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
