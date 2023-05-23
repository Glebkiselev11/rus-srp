# Start from a Rust base image
FROM rust:1.65 as builder

# Create a new empty shell project
RUN USER=root cargo new --bin server
WORKDIR /server

# Copy over your manifests
COPY ./Cargo.toml ./Cargo.toml
COPY ./Cargo.lock ./Cargo.lock
COPY ./diesel.toml ./diesel.toml

# Cache your dependencies
RUN cargo build --release
RUN rm src/*.rs

# Copy your source tree
COPY ./src ./src

# Build for release.
RUN rm ./target/release/deps/server*
RUN cargo build --release

# Start a new stage
FROM debian:buster-slim

# Install libpq for Diesel
RUN apt-get update && \
    apt-get install -y libsqlite3-0 && \
    apt-get clean

# Copy the binary from builder
COPY --from=builder /server/target/release/server .

# Our start-up command will be running the binary
CMD ["./server"]