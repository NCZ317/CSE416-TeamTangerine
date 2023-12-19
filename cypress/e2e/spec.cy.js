describe('Login & Create Account Modal Test', () => {
  it('Opens the page and navigates to the Create Account Modal', () => {
    cy.visit('https://terratrove-df08dd7fc1f7.herokuapp.com/');
    cy.get('.login-button').click();
    cy.get('#login-modal').should('be.visible');
    cy.get('#sign-up-button').click();
    cy.get('.create-account-modal').should('be.visible');
  });
});

describe('Sort Button Test', () => {
  it('Opens the page and opens the Sort & Filter Dropdown menu', () => {
    cy.visit('https://terratrove-df08dd7fc1f7.herokuapp.com/');
    cy.get('#sort-filter-button').click();
    cy.get('#sort-filter-menu').should('be.visible');
  });
});

describe("Login Fail", () => {
  it("Should not log in", () => {
    cy.visit('https://terratrove-df08dd7fc1f7.herokuapp.com/')
    cy.get('.login-button').click();
    cy.get('#email').should('be.visible');
    cy.get("#email").type("standard_user")
    cy.get("#password").type("secret_sauce", {log:false})
    cy.get("#login").click()
    cy.get('#error-modal').should('be.visible');
  })
})

describe("Login Success", () => {
  it("Should log in without issues", () => {
    cy.visit('https://terratrove-df08dd7fc1f7.herokuapp.com/')
    cy.get('.login-button').click();
    cy.get('#email').should('be.visible');
    cy.get("#email").type("test@email.com")
    cy.get("#password").type("password", {log:false})
    cy.get("#login").click()
  })
})

Cypress.Commands.add("login", (username, password) => {
  cy.get('.login-button').click();
  cy.get("#email").type(username)
  cy.get("#password").type(password, { log: false })
  cy.get("#login").click()
})

describe("Check Post", () => {
  it("Should look at a post", () => {
    cy.visit('https://terratrove-df08dd7fc1f7.herokuapp.com/')
    cy.contains('By:').click()
    cy.get('.post-comment-section').should('be.visible');
  })
})

describe("Check User Options", () => {
  it("Should be able to see logout option", () => {
    cy.visit('https://terratrove-df08dd7fc1f7.herokuapp.com/')
    cy.login('test@email.com', 'password');
    cy.get('#account-button').click();
    cy.get('#account-menu').should('be.visible');
  })
})

describe("Create Map", () => {
  it("Should be brought to the edit map graphics screen", () => {
    cy.visit('https://terratrove-df08dd7fc1f7.herokuapp.com/')
    cy.login('test@email.com', 'password');
    cy.get('.create-map-button').click();
    cy.get('#create-map-modal').should('be.visible');
  })
})
