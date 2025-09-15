Cypress.Commands.add('login', (email, password) => {
    cy.visit(Cypress.env('portalUrl'));
    cy.get('#loginEmail').type(email);
    cy.get('#loginPassword').type(password);
    cy.get('#loginBtn').click();
})