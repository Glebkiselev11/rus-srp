# Start from the latest Ubuntu base image
FROM ubuntu:22.04

# Install curl and gnupg2, and build-essential for C compiler
RUN apt-get update -y \
    && apt-get install curl gnupg2 build-essential libwayland-dev sqlite3 libsqlite3-dev -y

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Create a new empty shell project
RUN USER=root cargo new --bin server
WORKDIR /server

# Copy over your manifests
COPY ./Cargo.toml ./Cargo.toml
COPY ./Cargo.lock ./Cargo.lock
COPY ./diesel.toml ./diesel.toml

# Install necessary dependencies for development
RUN cargo install cargo-watch
RUN cargo install diesel_cli --no-default-features --features sqlite

# Copy your source tree and migrations
COPY ./src ./src
COPY ./database.db ./database.db
COPY ./migrations ./migrations

# Use cargo watch to run the server, it will rebuild and rerun on source changes
CMD diesel migration run && cargo watch -x run
