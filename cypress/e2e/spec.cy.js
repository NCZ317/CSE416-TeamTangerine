describe('Simple Test 1', () => {
  it('Site exists', () => {
    cy.visit('https://terratrove-df08dd7fc1f7.herokuapp.com/')
    cy.url().should('include', '/')
  })
})
describe('Simple Test 2', () => {
  it('Is TerraTrove', () => {
    cy.visit('https://terratrove-df08dd7fc1f7.herokuapp.com/')
    cy.contains('Map')
  })
})