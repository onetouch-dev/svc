import Server from "./service";
import configuration from "./configuration";

const server = new Server(configuration);

server.bootstrap();
server.run();
