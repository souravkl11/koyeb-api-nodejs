
# Koyeb API Wrapper

An unofficial API wrapper for Koyeb Rest API (v1.0.0). This module allows you to interact with the Koyeb platform in a simple, programmatic way using asyncronous functions.

## Install

```
npm install koyeb-api
```
## Usage/Examples
### Import it to your code using
```javascript
const Client = require('koyeb-api');
const Koyeb = new Client("YOUR-API-TOKEN"); 
```
### Get app list 
```javascript
const result = await Koyeb.getApps()
console.log(result)
```
### Get services 
```javascript
const result = await Koyeb.getServices()
console.log(result)
```
### Get app details
```javascript
const appName = "my-app"
const result = await Koyeb.getAppInfo(appName)
console.log(result)
```
### Get service details
```javascript
const service_id = "your-service-id" // Get service id using Koyeb.getServices() method
const result = await Koyeb.getServiceInfo()
console.log(result)
```
### Creating/Updating service environment variables
```javascript
const options = {
    Var: "PORT"
    value: "3000"
    serviceName: "my-service"
}
await Koyeb.setEnv(options)
```
### Redeploy service
```javascript
const serviceName = "my-service"
await Koyeb.reDeploy(serviceName)
```
### Pause service
```javascript
const serviceName = "my-service"
await Koyeb.pauseService(serviceName)
```
### Get activity list
```javascript
const result = await Koyeb.listActivities()
console.log(result)
```

