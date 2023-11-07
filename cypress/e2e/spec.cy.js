describe('Login Modal Test', () => {
  it('Opens the page and navigates to the Login Modal', () => {
    cy.visit('https://terratrove-df08dd7fc1f7.herokuapp.com/'); 
    cy.get('#login-button').click(); 
    cy.get('#login-modal').should('be.visible'); 
  });
});

describe('Create Account Modal Test', () => {
  it('Opens the page and navigates to the Create Account Modal', () => {
    cy.visit('https://terratrove-df08dd7fc1f7.herokuapp.com/');
    cy.get('#login-button').click();
    cy.get('#login-modal').should('be.visible');
    cy.get('#sign-up-button').click();
    cy.get('#create-account-modal').should('be.visible');
  });
});
