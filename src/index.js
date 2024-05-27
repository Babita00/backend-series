import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({
  path: './.env',
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB connection FAILED', err);
  });

/*import express from 'express'
const app = express()
    ; (async () => {
        try {
            console.log('MongoDB URL:', process.env.MONGODB_URL);
            console.log('DB Name:', DB_NAME);
            console.log('Port:', process.env.PORT);

            await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
            app.on("error", (error) => {
                console.log("ERROR:our system is not able to talk with databse", error);
                process.exit(1);
            })
            app.listen(process.env.PORT, () => {
                console.log(`App is listening on port${process.env.PORT}`)
            })
        }


        catch (error) {
            console.error('Error:', error);

            process.exit(1);
        }
    })()

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Express error handler:', err);
    res.status(500).send('Something went wrong!');
});
*/
