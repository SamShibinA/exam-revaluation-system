const { defineConfig } = require("vite");

module.exports = defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
  },
});
