describe('Login Tests', () => {
    it("Verify title of page", () => {
        cy.visit(Cypress.env('portalUrl'));
        cy.title().should('eq','Login');
    })
    it("Verify email, password and submit button on the login form", () => {
        cy.visit(Cypress.env('portalUrl'));
        cy.get('#loginEmail').should('be.visible').should('be.enabled');
        cy.get('#loginPassword').should('be.visible').should('be.enabled');
        cy.get('#loginBtn').should('be.visible').should('be.enabled');
    })

    it("Verify email and password fields cannot be empty upon form submission", () => {
        cy.visit(Cypress.env('portalUrl'));
        cy.get('#loginBtn').click();
        cy.get('#loginError').should('have.text','Email and password cannot be empty');
    })
     

    it("Verify email field cannot be empty upon form submission", () => {
        cy.visit(Cypress.env('portalUrl'));
        cy.get('#loginPassword').type(Cypress.env('password'));
        cy.get('#loginBtn').click();
        cy.get('#loginError').should('have.text','Email cannot be empty');

     
    })
    it("Verify password field cannot be empty upon form submission", () => {
        cy.visit(Cypress.env('portalUrl'));
        cy.get('#loginEmail').type(Cypress.env('email'));
        cy.get('#loginBtn').click();
        cy.get('#loginError').should('have.text','Password cannot be empty');
    })

    it("Verify home page is displayed after valid email and password has been entered", () => {
        cy.visit(Cypress.env('portalUrl'));
        cy.get('#loginEmail').type(Cypress.env('email'));
        cy.get('#loginPassword').type(Cypress.env('password'));
        cy.get('#loginBtn').click();
        cy.title().should('eq','Home');
        cy.get('#homeHeading').should('have.text', 'Welcome to Your Dashboard');
    })

})