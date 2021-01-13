const express = require("express");
const cors = require("cors");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var authRouter = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', indexRouter);
//app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/admin", adminRouter);


const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`----> server started at port ${PORT}`)
);