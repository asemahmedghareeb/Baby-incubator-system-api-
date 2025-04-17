import { fileURLToPath } from "url";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import userRoutes from "./controllers/user.controller.js";
import incubatorRoutes from "./controllers/incubator.controller.js";
import hospitalRoutes from "./controllers/hospital.controller.js";
import searchRoute from "./controllers/search.controller.js";
import reservationRoutes from "./controllers/reservation.controller.js";
import reservationsStaffRoutes from "./controllers/reservationsStaff.controller.js";
import staffRoutes from "./controllers/staff.controller.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const connectedStaff = new Map();
export const connectedParents = new Map();

wss.on("connection", (ws, req) => {
  ws.on("error", console.error);

  ws.on("close", () => {
    switch (ws.role) {
      case "staff":
        connectedStaff.delete(ws.id);
        console.log("Staff client has disconnected!");
        break;
      case "parent":
        connectedParents.delete(ws.id);
        console.log("Parent client has disconnected!");
        break;
      default:
        console.log("Anonymus client leaved");
        console.log("Connected Maps Does not mainatained properly");
        break;
    }
  });

  ws.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message);

      if (parsedMessage.type === "authorization") {
        const { token } = parsedMessage;
        if (!token && token === "") {
          ws.send(
            JSON.stringify({
              error: {
                message: "Unauthorized",
                code: 401,
              },
            })
          );
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role, hospitalId } = decodedToken;
        if (role === "staff") {
          ws.id = id;
          ws.role = role;
          ws.hospitalId = hospitalId;
          connectedStaff.set(id, ws);
          console.log("Staff connection established");
          ws.send(
            JSON.stringify({
              type: "authorization",
              status: "success",
              message: "Authorized as Staff",
            })
          );
          //console.log(connectedStaff);
        } else if (role === "parent") {
          ws.id = id;
          ws.role = role;
          connectedParents.set(id, ws);
          console.log("Parent connection established");
          ws.send(
            JSON.stringify({
              type: "authorization",
              status: "success",
              message: "Authorized as Parent",
            })
          );
          //console.log(connectedParents);
        } else {
          ws.send(
            JSON.stringify({
              error: {
                message: "Forbidden",
                code: 403,
              },
            })
          );
        }
      } else {
        ws.send(
          JSON.stringify({
            error: {
              message: "Communication type not supported",
            },
          })
        );
      }
    } catch (err) {
      if (err.name === "SyntaxError") {
        ws.send(
          JSON.stringify({
            error: {
              message: "Not valid JSON",
              code: 400,
            },
          })
        );
      } else if (err.name === "JsonWebTokenError") {
        ws.send(
          JSON.stringify({
            error: {
              message: "Not valid token",
              code: 401,
            },
          })
        );
      } else {
        console.error(err);
        ws.send(
          JSON.stringify({
            error: {
              message: "Internal Server Error",
              code: 500,
            },
          })
        );
      }
    }
  });
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/staff", staffRoutes);
app.use("/incubators", incubatorRoutes);
app.use("/reservations", reservationRoutes);
app.use("/hospital/reservations", reservationsStaffRoutes);
app.use("/hospitals", searchRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    name: "LifeNest API",
    version: "1.0.0",
    description:
      "This is a sample API that serves incubators organizing and reservation system.",
    endpoints: {
      "/user": "Retrieve information about users",
      "/reservations": "Manage reservations",
      "/hospital": "Retrieve information about hospitals",
      "/incubators": "Manage incubator resources",
      "/staff": "Retrieve information about staff",
    },
    documentation: "https://trello.com/b/1RDIsdvd/api-documentation",
    status: "API is up and running",
  });
});

app.all("*", (req, res) => {
  res.status(404).json({
    error: {
      message: "Not Found",
      code: 404,
    },
  });
});

server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
  console.log("Browse the client here:");
  console.log(`http://localhost:${PORT}/client`);
});
