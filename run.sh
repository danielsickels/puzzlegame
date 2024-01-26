#!/bin/bash

# Define a name for the Docker image
IMAGE_NAME="phaser-game"

# Define a name for the Docker container
CONTAINER_NAME="phaser-container"

# Define the path to your local game directory
LOCAL_GAME_DIR=("./")

# Build the Docker image
echo "Building Docker image..."
docker build -t $IMAGE_NAME .

# Check if a container with the same name already exists
if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
    # Stop and remove the existing container
    echo "Stopping and removing existing container..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Run the Docker container, exposing port 8080 on the host's port 8080
echo "Running Docker container..."
docker run -dp 8080:8080 -v $LOCAL_GAME_DIR:/app --name $CONTAINER_NAME $IMAGE_NAME

echo "Container is running. Access the game at http://localhost:8080"
