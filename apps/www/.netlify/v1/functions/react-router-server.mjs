
    export { default } from "../../../dist/server/server.js";

    export const config = {
      name: "React Router server handler",
      generator: "@netlify/vite-plugin-react-router@1.0.1",
      path: "/*",
      preferStatic: true,
    };
    