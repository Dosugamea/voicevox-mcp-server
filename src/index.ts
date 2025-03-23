import { MCPServer } from "mcp-framework";

if (process.platform != "win32") {
  const server = new MCPServer();
  server.start();
} else {
  const server = new MCPServer({
    transport: {
      type: "sse",
      options: {
        port: 10100,
        endpoint: "/sse",
      },
    },
  });
  server.start();
}
