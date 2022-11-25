const mongoose = require("mongoose");
const app = require("./app");

const start = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB connected ${connect.connection.host}`);
  } catch (error) {
    console.error(error);
  }
};

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
start();
