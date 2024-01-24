require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const roleRoutes = require("./routes/role");
const { adminTicketRouter: techTicketRoutes } = require("./routes/tech-ticket/techTicket");
const projectRoutes = require("./routes/project/project");
const projectTaskRoutes = require("./routes/project/projectTask");
const projectTaskGroupRoutes = require("./routes/project/projectTaskGroup");
const projectTaskMessageRoutes = require("./routes/project/projectTaskMessage");
const clientRoutes = require("./routes/project/client");

const app = express();

const clientAddress = process.env.ENVIRONMENT === "production" ? process.env.CLIENT_ADDRESS : "http://localhost:3000";
const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: clientAddress,
    credentials: true,
  })
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
    app.listen(process.env.PORT, () => console.log(`Listening on port: ${process.env.PORT}`));
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
app.use("/projectTasks", projectTaskRoutes);
app.use("/projectTaskGroups", projectTaskGroupRoutes);
app.use("/projectTaskMessages", projectTaskMessageRoutes);
app.use("/client", clientRoutes);
