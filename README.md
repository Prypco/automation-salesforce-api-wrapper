# Salesforce API Wrapper

![📦 Publish](https://github.com/kalpeshchilka/salesforce-api-wrapper/actions/workflows/publish.yml/badge.svg)

Reusable Node.js module for interacting with Salesforce API.  
Intended for use in E2E test automation (e.g. Cypress).

## ✅ Features
- Get OAuth token
- Create / update / delete / get records (any Salesforce object)
- Run SOQL queries
- Built-in error logging
- Configurable retries
- Centralized request logic
- Cypress task integration

## 📁 Folder Structure

```
src/
├── auth/               // Auth (access token)
│   └── getAccessToken.js
├── helpers/            // Salesforce helper functions
│   └── salesforceHelper.js
├── query/              // SOQL queries
│   └── runQuery.js
├── records/            // CRUD functions
│   ├── createRecord.js
│   ├── deleteRecord.js
│   ├── getRecord.js
│   └── updateRecord.js
├── tasks/              // Cypress tasks
│   └── cypressTasks.js
├── utils/              // Shared utilities
│   ├── logger.js       // Logging utility
│   ├── request.js      // Axios wrapper
│   ├── retry.js        // Retry mechanism
│   ├── config.js       // Env variable handler
│   └── index.js        // Utility exports

.env.example             // Sample env config
.gitignore               // Git ignore rules
```

## 🚀 Usage

### Installing dependency

```js
//package.json
  "dependencies": {
    "@kalpeshchilka/salesforce-api-wrapper": "1.1.7"
  }
```

### In Your Cypress Test Repo (using Cypress tasks)

```js
//cypress.config.js - add as cypress task
  e2e: {
    async setupNodeEvents(on, config) {
      // Copy Cypress env vars into process.env
      Object.assign(process.env, config.env);

      const { default: salesforceTasks } = await import('@kalpeshchilka/salesforce-api-wrapper/src/tasks/cypressTasks.js');
      on("task", salesforceTasks); // register wrapper functions as Cypress tasks
    }
  }

//e2e.js - fetch salesforce token
  before(() => {
    cy.sf('getAccessToken').then((token) => {
      // Store the salesforce token globally
      Cypress.env('SALESFORCE_TOKEN', token);
      cy.log('Salesforce access token fetched and saved!');
    });
  });

//commands.js - add salesforce custom command
  Cypress.Commands.add("sf", (taskName, params = {}) => {
    const allowedTasks = [
      "getAccessToken",
      "getRecord",
      "createRecord",
      "updateRecord",
      "runQuery",
      "deleteRecord",
      "getRecordTypeId",
      "waitForRecordField",
      "waitForRecordFieldByQuery",
      "verifyLeadCountByMobile",
      "getRecord",
      "processLeadOpportunity",
    ];

    if (!allowedTasks.includes(taskName)) {
      throw new Error(`❌ Unsupported Salesforce task: ${taskName}`);
    }

    return cy.task(taskName, params);
  });
```

### Example usage in E2E Cypress Tests repo

```js
//Creating an account
  cy.sf('createRecord', {
    token: Cypress.env('SALESFORCE_TOKEN'),
    objectType: "Account",
    body: { Name: "Test Account", ... }
  }).then((res) => {
    expect(res.status).to.eq(201);
  });
```

### Direct API Use Example(e.g using Playwright)

```js
import * as sf from "@kalpeshchilka/salesforce-api-wrapper/src";

const sfToken = await sf.getAccessToken();
const leadRes = await sf.getRecord({
  token: sfToken,
  objectType: "Lead",
  recordId: "leadId",
});
console.log("Lead response- " + JSON.stringify(leadRes, null, 2));
```

## 🛠️ Environment Variables

Make sure to have valid Salesforce env variables in your test repo:

```bash
.env.example
```

---
