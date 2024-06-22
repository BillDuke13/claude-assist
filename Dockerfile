# Use the official Deno image from the Docker Hub
FROM denoland/deno:alpine-1.44.4

# Set the working directory
WORKDIR /app

# Copy the Deno configuration file
COPY deno.json .

# Copy all project files to the working directory
COPY . .

# Expose the port that the Deno app will run on
EXPOSE 8000

# The default command to run your app using the start script
CMD ["deno", "task", "start"]