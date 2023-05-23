# Start from a Rust base image
FROM rust:1.65 as builder

# Create a new empty shell project
RUN USER=root cargo new --bin rust_app
WORKDIR /rust_app

# Copy over your manifests
COPY ./Cargo.toml ./Cargo.toml
COPY ./Cargo.lock ./Cargo.lock

# Cache your dependencies
RUN cargo build --release
RUN rm src/*.rs

# Copy your source tree
COPY ./src ./src

# Build for release.
RUN rm ./target/release/deps/rust_app*
RUN cargo build --release

# Our start-up command will be running the binary from builder stage
CMD ["./target/release/rust_app"]