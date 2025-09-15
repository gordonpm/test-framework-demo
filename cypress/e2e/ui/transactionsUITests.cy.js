describe('Transaction and Fund Transfer Tests', () => {
    it("Verify url and title of page", () => {
        // cy.visit(Cypress.env('portalUrl'));
        // cy.get('#loginEmail').type(Cypress.env('email'));
        // cy.get('#loginPassword').type(Cypress.env('password'));
        cy.login(Cypress.env('email'), Cypress.env('password'));
        cy.contains("a.nav-link", "Transactions").click();
        cy.title().should('eq','Transactions');
    })
    it("Verify transaction table and fund transfer button is displayed", () => {
        cy.login(Cypress.env('email'), Cypress.env('password'));
        
        cy.contains("a.nav-link", "Transactions").click();
        cy.get('#transactionTable').should('be.visible');
        cy.get("thead th").eq(0).should("contain", "Amount");
        cy.get("thead th").eq(1).should("contain", "Type");
        cy.get("thead th").eq(2).should("contain", "Sender ID");
        cy.get("thead th").eq(3).should("contain", "Recipient ID");
        cy.get('#newTransferBtn').should('be.visible').should('be.enabled');
    })

    it("Verify fields on fund transfer page", () => {
        cy.login(Cypress.env('email'), Cypress.env('password'));

        cy.contains("a.nav-link", "Transactions").click();
        cy.get('#newTransferBtn').click();
        cy.get('#amount').should('be.visible').should('be.enabled');
        cy.get('#recipientId').should('be.visible').should('be.enabled');
        cy.get('#transferType').should('be.visible').should('be.enabled');
        
        const expectedOptions = ["Immediate", "Scheduled", "Recurring"];
        cy.get("#transferType")           // select the dropdown
            .find("option")                 // get all options
            .should("have.length", 3)       // ensure there are 3 options
            .then(options => {
                // Map over the options to get their text
                const actualOptions = [...options].map(o => o.text);
                expect(actualOptions).to.deep.equal(expectedOptions);
            });
    })
     

    it("Verify amount field cannot be empty upon transaction submission", () => {
        cy.login(Cypress.env('email'), Cypress.env('password'));
        
        cy.contains("a.nav-link", "Transactions").click();
        cy.get('#newTransferBtn').click();
        cy.get('#transferBtn').click();
        cy.get('#transactionError').should('have.text','Amount cannot be empty');

     
    })
    it("Verify sender user id field cannot be empty upon form submission", () => {
        cy.login(Cypress.env('email'), Cypress.env('password'));
        
        cy.contains("a.nav-link", "Transactions").click();
        cy.get('#newTransferBtn').click();
        cy.get('#transferBtn').click();
        
        cy.get('#amount').type('100');
        cy.get('#transferBtn').click();
        cy.get('#transactionError').should('have.text','Sender User Id cannot be empty');
    })

    it("Verify sender user id field cannot be empty upon form submission", () => {
        cy.login(Cypress.env('email'), Cypress.env('password'));
        cy.contains("a.nav-link", "Transactions").click();
        cy.get('#newTransferBtn').click();
        cy.get('#transferBtn').click();
        
        cy.get('#amount').type('100');
        cy.get('#transferBtn').click();
        cy.get('#transactionError').should('have.text','Sender User Id cannot be empty');
    })

    it("Enter amount, sender Id, type and verify new transaction is created", () => {
        cy.login(Cypress.env('email'), Cypress.env('password'));

        cy.contains("a.nav-link", "Transactions").click();
        cy.get('#newTransferBtn').click();
        cy.title().should('eq','Fund Transfer');

        cy.get('#amount').type('100');
        cy.get("#recipientId").type("324");
        cy.get("#transferType").select("Immediate");               
        cy.get('#transferBtn').click();
        
        cy.get("#transferSuccess").should("be.visible").and("contain", "Transfer completed successfully!");
        cy.title().should('eq','Transactions');
    })


})