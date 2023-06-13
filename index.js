import app from "./app.js";
import config from "./utils/config.js";

app.get("/", (_req, res) => {
  res.send("Hello Admin!");
});

app.listen(config.PORT, () => {
  console.log(`Server is running on port: ${config.PORT}`);
});
