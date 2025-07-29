module.exports = {
  apps: [
    {
      name: "service-notifications",
      script: "app.js",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      merge_logs: true,
      env: {
        NODE_ENV: "development",
        // Local development Kafka settings
        KAFKA_BROKERS: "localhost:9092",
      },
      env_production: {
        NODE_ENV: "production",
        // Kafka settings will be set by the startup script
        KAFKA_BROKERS: process.env.KAFKA_BROKERS || "localhost:9092",
      },
      // Ensure the logs directory exists
      setup: "mkdir -p ./logs",
      // Wait for Kafka to be ready
      wait_ready: true,
      listen_timeout: 50000,
    },
  ],
};
