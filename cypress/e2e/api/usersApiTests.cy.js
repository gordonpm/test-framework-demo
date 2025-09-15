describe("Users API Tests", () => {
    let accessToken = "";
    let users = [];
    let apiBaseUrl = Cypress.env('apiUrl');
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

    after("Delete user as part of cleanup", () => {
        users.forEach((user) => {
            cy.request({
            method: 'DELETE',
            url: apiBaseUrl + '/api/users/' + user,
            headers: { 'Authorization': 'Bearer ' + accessToken}
        })
        .then((response) => {
            expect(response.status).to.eq(204);
            cy.log("user deleted successfully")
        })
        })
    })
    
    it("Get valid user", () => {
        cy.request({
            method: 'GET', 
            url: apiBaseUrl + '/api/users/100',
            headers: { 'Authorization': 'Bearer ' + accessToken},
        })
        .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.userId).to.eq("100");
        })
    })

    it("Get invalid user", () => {
        cy.request({
            method: 'GET', 
            url: apiBaseUrl + '/api/users/abc',
            headers: { 'Authorization': 'Bearer ' + accessToken},
            failOnStatusCode: false
        })
        .then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.error).to.eq("Invalid user");
        })
    })

    it("Get user without using authorization", () => {
        cy.request({
            method: 'GET', 
            url: apiBaseUrl + '/api/users/100',
            failOnStatusCode: false
        })
        .then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.error).to.eq("Unauthorized");
        })
    })

    it("Create new user", () => {
        cy.fixture('user').then((data) => {
            data.forEach((userBody) => {
                const keyToRemove = 'isValid';
                const { [keyToRemove]: removedValue, ...userBodyToSend } = userBody;
                cy.request({
                    method: 'POST', 
                    url: apiBaseUrl + '/api/users',
                    body: userBodyToSend,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken},
                    failOnStatusCode: userBody.isValid
                    })
                    .then((response) => {
                        if (userBody.isValid === true) {
                            expect(response.status).to.eq(201);
                            expect(response.body.userId).to.exist;
                            users.push(response.body.userId)
                            expect(response.body.name).to.eq(userBody.name);
                            expect(response.body.email).to.eq(userBody.email);
                            expect(response.body.accountType).to.eq(userBody.accountType);
                        } else {
                            expect(response.status).to.eq(400);
                            expect(response.body.error).to.eq("User email is invalid. Please choose another email.");
                        }
                    })
                })
            })
    })
})

