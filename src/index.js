const express = require('express');
 const userRoute = require('./router/reporterRoutes')
 const newsRoute = require('./router/newsRoutes');


const app = express();
app.use(express.json());
const connection = require('./DB/connection');
connection();
app.use(userRoute)
app.use(newsRoute);


 
app.listen(process.env.hostPort || 3000);