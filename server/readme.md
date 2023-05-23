# Make sure you have docker installed

docker -v

# To build first time

docker build -t server .

# Start docker server

docker run -p 8080:8080 -v $(pwd)/words.db:/words.db -v $(pwd)/migrations:/migrations -e DATABASE_URL=words.db server
