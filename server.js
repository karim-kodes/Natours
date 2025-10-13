const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

// DB connection
mongoose.connect(process.env.DATABASE).then(() => {
  console.log("DB connection successful");
});

const PORT = process.env.PORT || 300;
app.listen(PORT, () => {
  console.log(`App is running on port http://localhost:${PORT}`);
});
