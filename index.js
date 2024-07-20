import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 4000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
    const result = response.data;
    console.log(result)
    
    res.render("index.ejs", { data: Object.values(result) });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", { error: error.message });
  }
});

app.post("/", async (req, res) => {
  try {
    const { type, Crypto } = req.body;
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
    const result = response.data;
    // console.log(response)

    const selectedCrypto = result[Crypto];

    if (selectedCrypto) {
      const { base_unit, buy, last, sell, low, high, volume } = selectedCrypto;
      console.log(`${Crypto} ${sell} ${last} ${low} ${high} ${volume}`);

      res.render("index.ejs", {
        data: Object.values(result),
        selectedCrypto: {
          name: Crypto,
          base_unit,
          buy,
          last,
          sell,
          low,
          high,
          volume,
        },
      });
    } else {
      res.render("index.ejs", {
        data: Object.values(result),
        error: "Selected cryptocurrency not found",
      });
    }
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: "No activities match your criteria",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});