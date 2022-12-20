# Subscription API DEMO

A full application that provides integration with Subscription API

# Requirements

In order to build and run above services, you will need to have the following tools installed:

- node v16.10.0
- yarn

# Installation

## Fontend

```
cd frontend
yarn start
```

## Backend

```
cd backend
node src/index.js
```

# Configuration

- Change organizationId and appId inside backend/billing.js and backend/token.js with your keys
- Change private-key.pem to your private key
- Change or remove deviceId/storeId (if applicable)
- Change OAuth URL callback to your URL inside frontend/App.js

# About

For more information about the integration, go to

- https://docs.poynt.com/app-integration/cloudApps/cloud-app.html
- https://docs.poynt.com/app-integration/cloudApps/access-token.html
- https://docs.poynt.com/app-integration/cloudApps/first-api-call.html
- https://docs.poynt.com/app-integration/cloudApps/merchant-authorization.html
