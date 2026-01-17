import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../tradenotz-api/public/swagger.json", 
  output: "src/api",
  plugins: ["@tanstack/react-query", "@hey-api/client-fetch"],
});
