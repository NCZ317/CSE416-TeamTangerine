describe('Login Modal Test', () => {
  it('Opens the page and clicks on the Login button', () => {
    cy.visit('https://terratrove-df08dd7fc1f7.herokuapp.com/'); 
    cy.get('#login-button').click(); // Replace with the actual ID or selector of your Login button

    // Check that the Login Modal is visible
    cy.get('#login-modal').should('be.visible'); // Replace with the actual ID or selector of your Login Modal
  });
});

describe('Create Account Modal Test', () => {
  it('should open Create Account modal from Login modal', () => {
    cy.visit('https://terratrove-df08dd7fc1f7.herokuapp.com/');
    cy.get('#login-button').click();
    cy.get('#login-modal').should('be.visible');
    cy.get('#sign-up-button').click();
    cy.get('#create-account-modal').should('be.visible');
  });
});
