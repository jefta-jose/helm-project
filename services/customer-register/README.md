### this service is responsible for adding a user in the postgres db
it has the following componenets

root index.js wraps and starts the application
.env will later work with helm values but contains the host, port, db name, db user and db password

config/index.js creates a connection to the containerized db
controller/index.js handles http requests and sends traffic to the service
service/index.js handles running queries agains the db

node dependencies used express pg dotenv

use nodemon for better productivity
npm install --save-dev nodemon

some thing you need to understand with ports 

when setting up the postgres port we set -p 5432:5432 this means inside the container
its listening on port 5432
but we have allowed external access from the host's port 5432 which means if we hit 
port 5432 on our host we are going to end up in the container
then we have our node application port . our node application is also listening for requests so that it can route them to the db .
the flow is node port -> host port -> container port