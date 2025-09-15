describe("Transactions API Tests", () => {
    let accessToken = "";
    let users = [];
    let apiBaseUrl = Cypress.env('apiUrl');

    // get bearer token for authorization purpose to be used by each test
    before("Get access token", () => {
        cy.request({
            method: 'POST',
            url: apiBaseUrl + '/api/token',
            headers: { 'username': Cypress.env('username') , 'password': Cypress.env('password')}
        })
        .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.accesstoken).to.exist;
            accessToken = response.accessToken;
        })
    })
    // delete all transactions after all tests are run
    after("Delete all transactions for user as part of cleanup", () => {
        users.forEach((user) => {
            cy.request({
            method: 'DELETE',
            url: apiBaseUrl + '/api/transactions/' + user,
            headers: { 'Authorization': 'Bearer ' + accessToken}
        })
        .then((response) => {
            expect(response.status).to.eq(204);
            cy.log("transactions deleted successfully");
        })
        })
    })

    it("Get transactions for valid user", () => {
        cy.log("username is: " + Cypress.env('username'));
        cy.request({
            method: 'GET', 
            url: apiBaseUrl + '/api/transactions/100',
            headers: { 'Authorization': 'Bearer ' + accessToken}
        })
        .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.userId).to.eq("100");
        })
    })

    it("Get transactions for valid user without authorization", () => {
        cy.log("username is: " + Cypress.env('username'));
        cy.request({
            method: 'GET', 
            url: apiBaseUrl + '/api/transactions/100',
        })
        .then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.error).to.eq("Unauthorized user");

        })
    })

    it("Get transactions for invalid user", () => {
        cy.request({
            method: 'GET', 
            url: apiBaseUrl + '/api/transactions/abc',
            headers: { 'Authorization': 'Bearer ' + accessToken},
            failOnStatusCode: false
        })
        .then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.error).to.eq("Invalid user");
        })
    })

    it("Create new transaction for given user", () => {
        cy.fixture('transaction').then((data) => {
            data.forEach((transactionBody) => {
                const keyToRemove = 'isValid';
                const { [keyToRemove]: removedValue, ...transactionBodyToSend } = transactionBody;
                cy.request({
                    method: 'POST', 
                    url: apiBaseUrl + '/api/transactions',
                    body: transactionBodyToSend,
                    headers: { 'Content-Type': 'application/json' , 'Authorization': 'Bearer ' + accessToken},
                    failOnStatusCode: transactionBody.isValid
                    })
                    .then((response) => {
                        if (transactionBody.isValid === true) {
                            expect(response.status).to.eq(201);
                            users.push(response.body.userId)
                            expect(response.body.userId).to.eq(transactionBody.userId);
                            expect(response.body.transactions[0].amount).to.eq(transactionBody.amount);
                            expect(response.body.transactions[0].type).to.eq(transactionBody.type);
                            expect(response.body.transactions[0].recipientId).to.eq(transactionBody.recipientId);
                        } else {
                            expect(response.status).to.eq(400);
                            expect(response.body.error).to.eq("Invalid user");
                        }
                    })
                })
            })
        })
    })
