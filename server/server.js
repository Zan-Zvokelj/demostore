const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.SECRET_KEY);

dotenv.config();

const app = express();

app.options("/checkout", cors(corsOptions)); // Handle preflight requests for checkout

// ✅ Allow specific origin (your frontend hosted on Heroku)
const corsOptions = {
  origin: "https://demostore-141c417796b3.herokuapp.com", // Update this with your frontend URL
  credentials: true, // Allow cookies if necessary
};

app.use(cors(corsOptions)); // Use CORS middleware with specific options
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ Serve Angular frontend
const frontendPath = path.join(process.cwd(), "dist/store/browser");

app.use(express.static(frontendPath));

// ✅ API Route for Stripe Checkout
app.post("/checkout", async (req, res, next) => {
  // Updated route from '/api/checkout' to '/checkout'
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 1500, currency: "usd" },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 1 },
            },
          },
        },
      ],
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name, images: [item.product] },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: "https://demostore-141c417796b3.herokuapp.com/success", // Replace with your actual success URL
      cancel_url: "https://demostore-141c417796b3.herokuapp.com/cancel", // Replace with your actual cancel URL
    });

    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
});

// ✅ Catch-all route to serve Angular index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Start the Server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
