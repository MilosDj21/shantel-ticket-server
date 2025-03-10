require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { socketHandler } = require("./socketHandler");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const roleRoutes = require("./routes/role");
const { adminTicketRouter: techTicketRoutes } = require("./routes/tech-ticket/techTicket");
const projectRoutes = require("./routes/project/project");
const postTaskRoutes = require("./routes/project/postTask");
const postTaskGroupRoutes = require("./routes/project/postTaskGroup");
const postTaskMessageRoutes = require("./routes/project/postTaskMessage");
const clientRoutes = require("./routes/project/client");
const clientWebsiteRoutes = require("./routes/project/clientWebsite");
const clientLinkRoutes = require("./routes/project/clientLink");
const postRequestRoutes = require("./routes/project/postRequest");
const websiteRoutes = require("./routes/project/website");

const clientAddress = process.env.ENVIRONMENT === "production" ? process.env.CLIENT_ADDRESS : "http://localhost:3000";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: clientAddress,
    credentials: true,
  },
});

//handle all socket events
socketHandler(io);

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: clientAddress,
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/images", express.static(path.join(__dirname, "images")));

//db connection and starting express server
mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://localhost:27017", { dbName: process.env.DB_NAME, useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("Connected to the database");
    server.listen(process.env.PORT, () => console.log(`Listening on port: ${process.env.PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });

//routes
// app.get("/", (req, res) => res.status(200).send("Home Page"));
app.use(authRoutes);
app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/techTickets", techTicketRoutes);

// Project routes
app.use("/projects", projectRoutes);
app.use("/postTasks", postTaskRoutes);
app.use("/postTaskGroups", postTaskGroupRoutes);
app.use("/postTaskMessages", postTaskMessageRoutes);
app.use("/clients", clientRoutes);
app.use("/clientWebsites", clientWebsiteRoutes);
app.use("/clientLinks", clientLinkRoutes);
app.use("/postRequests", postRequestRoutes);
app.use("/websites", websiteRoutes);
