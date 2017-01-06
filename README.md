# HYF-TODOS-ES6

### A reference application for the *Hack Your Future* refugee training programme

This application has been designed to touch upon all topics covered in the training modules of the Hack Your Future programme (henceforth referred to as 'the programme'), and models the home work assignments of the final, database training module.

It is a simple 'todo' application written in JavaScript ES5 using Angular JS 1.5 and Angular Material 1.x for the front-end and ES6 using Node.js 6.x for the back-end. For persistence, the application includes MongoDB and MySQL modules, activated by specifying the desired type of database on the startup command line.

To manage todos, this application is not particularly useful. However it may well serve as an example or perhaps even a reference model for what a typical programme graduate should be able to develop, or at least strive to develop through further training. If need be, the application itself could be modified or enhanced or trimmed down to better meet the programme's objective.

By ensuring, through ongoing peer review within the programme, that the presented code reflects agreed best practices for the programme to promote to its students, the application can hopefully help to fine-tune and streamline the respective training modules and lectures, and identify possible gaps.

### Installation

Clone the repository to your local hard drive and run `npm install` to install the required dependencies.

### Start server with Mongo

Before starting the program with Mongo, please ensure that the MongoDB is installed abd the `mongod` demon is running.

Type:
```
npm start
```

### Start server with MySQL

For MySQL, please create an empty database with the name `hyf-todos`. The assumed database user is `root`.

Type: 
```
node ./server.js mysql <password>
```

where `<password>` is the password that you assigned to the `hyf-todos` database.

### Using the application

Start **webpack** in watch mode:
```
npm run webpack
```

In the browser, go to:
```
http://localhost:8080
```

The application's main screen consist of two tabs, viz. TODOS and USERS. The plus button on the toolbar enables todos and users to be added, depending on the active tab.

Users and todos can be edited by means of the pencil button and deleted with the trashcan button. Todos can be assigned to users and unassigned. Todos can be marked completed.
