import express, { Express, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import socket from "./socket";

const app: Express = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (_, res: Response) => {
  return res.status(200).json({
    status: "alive",
    message: "Server is running",
  });
});

httpServer.listen(3006, () => {
  console.log("server is running");

  socket({ io });
});
