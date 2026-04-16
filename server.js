import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path, {dirname} from 'path';


const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));


const MONGODB_URL = // INSERT MONGO DB URL HERE
mongoose.connect(MONGODB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));


const frontend_dir = path.join(path.resolve(), 'dist')

app.use(express.static(frontend_dir));
app.get('*', function (req, res) {
    res.sendFile(path.join(frontend_dir, "index.html"));
});


app.listen(8000, function() {
    console.log("Starting server now...")
})
