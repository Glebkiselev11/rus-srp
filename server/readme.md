# Make sure you have docker installed

docker -v

# To build first time

docker build -t server .

# Start docker server

docker run -v $(pwd)/words.db:/words.db -v $(pwd)/migrations:/migrations server
