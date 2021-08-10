# to-do
a task manager backend app


#install:

create config folder at root level

create dev.env file in config folder

##contents of dev.env file

PORT=3000

DBURL=<your_local_mongodb:27017/users-tasks-api>

SECRET=<your_app_secret_used_by_jwt>


create test.env file in config folder

##contents of dev.env file

PORT=3000

DBURL=<your_local_mongodb:27017/users-tasks-api-test>

SECRET=<your_app_secret_used_by_jwt>


cd to-do

npm install

#run:

npm run dev // local env

npm run test // test env
