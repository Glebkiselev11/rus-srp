# Tells docker to use the latest Rust official image
FROM rust:1.60
# Copy the project files from your machine to the container
COPY ./ ./
# Build your application for release, inside the container
RUN cargo build --release
# Expose the port for accessing the HTTP server within the container
EXPOSE 8080/tcp
# Run the binary built inside the container
CMD ["./target/release/server"]