# Electron Device Mimic

This project is build off json-server and electron. The idea is to allow for local development while simulating devices sending requests with APIs.

The goal is to serve a UI which gives you the option to select which device event to simulate, and will serve over the port you configured.

Below is all TODOS:
* choose which device
* choose which ports
* set which data on the fly
* set which METHODS to use
* Fire off shell commands


You will want to check json-server for all documentation.
[json-server is awesome](https://github.com/typicode/json-server)

```bash
npm i json-server -g
```

```bash
npm i
```

## Running the App
In the command line run the following command.

This will serve the `db.json` file over `localhost:7001`.
```bash
node json-server
```

This starts the electron app
```bash
npm start
```
