const express = require("express");
const {
  client,
  createTables,
  seedTables,
  createCustomer,
  createRestaurant,
  createReservations,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  destroyReservation,
} = require("./db");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const init = async () => {
  try {
    console.log("Connecting to the database...");
    await client.connect();
    console.log("Successfully connected to the database.");

    console.log("Creating tables...");
    await createTables();
    console.log("Tables created.");

    console.log("Seeding tables...");
    await seedTables();
    console.log("Tables seeded.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize the application:", error);
    process.exit(1);
  }
};

init();
