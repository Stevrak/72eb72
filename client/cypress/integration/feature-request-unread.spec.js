/// <reference types="cypress" />

const billy = {
  username: "Billy",
  email: "billy@example.com",
  password: "Z6#6%xfLTarZ9U",
};
const jake = {
  username: "Jake",
  email: "jake@example.com",
  password: "L%e$xZHC4QKP@F",
};

describe("Bug Fix: Sending Messages", () => {
  it("setup", () => {
    cy.signup(billy.username, billy.email, billy.password);
    cy.logout();
    cy.signup(jake.username, jake.email, jake.password);
    cy.logout();
  });

  it("doesn't show unread on own comments", () => {
    cy.login(billy.username, billy.password);

    cy.get("input[name=search]").type("Jake");
    const $jakebox = cy.contains("Jake").parent().parent().parent();
    cy.contains("Jake").click();

    cy.get("input[name=text]").type("First message{enter}");
    cy.get("input[name=text]").type("Second message{enter}");
    cy.get("input[name=text]").type("Third message{enter}");
    $jakebox.contains("3").should('not.exist');
    cy.logout();
  });
  it("show unread", () => {
    cy.reload();
    cy.login(jake.username, jake.password);
    cy.get("input[name=search]").type("Billy");
    cy.contains("Billy").parent().parent().parent().contains("3");//.should('not.exist');
    cy.logout();
  });

  it("removes unread", () => {
    cy.login(jake.username, jake.password);
    cy.get("input[name=search]").type("Billy");
    const $billybox = cy.contains("Billy").parent().parent().parent();
    cy.contains("Billy").click();
    $billybox.contains("3").should('not.exist');
  });
});
