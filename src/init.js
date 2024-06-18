import "dotenv/config";
import "./db";
import "./models/Music";
import "./models/User";
import app from "./server";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 🚀`);
});
