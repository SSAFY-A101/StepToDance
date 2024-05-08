FROM python:3.11

# Install necessary system packages
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libgl1-mesa-glx \
        mesa-utils \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY ./requirements.txt /fastApiProject/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /fastApiProject/requirements.txt

# Copy the source code
COPY ./src /fastApiProject/src
COPY ./resources /fastApiProject/resources

# Set working directory
WORKDIR /fastApiProject/src

# Command to run the FastAPI application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
