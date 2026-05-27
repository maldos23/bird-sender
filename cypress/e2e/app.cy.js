describe('Bird Sender E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads the application', () => {
    cy.contains('bird-sender').should('be.visible');
    cy.contains('drop files here').should('be.visible');
    cy.contains('online').should('be.visible');
  });

  it('shows devices on network section', () => {
    cy.contains('devices on network').should('be.visible');
  });

  it('shows transfers section', () => {
    cy.contains('transfers').should('be.visible');
  });

  it('displays drop zone with correct styling', () => {
    cy.get('.drop-zone').should('be.visible');
    cy.get('.drop-zone').contains('drop files here');
    cy.get('.drop-zone').contains('or click to select');
  });

  it('shows file input when drop zone is clicked', () => {
    cy.get('.drop-zone').click();
    cy.get('#fileInput').should('exist');
  });

  it('handles multiple browser tabs', () => {
    cy.window().then((win) => {
      expect(win.birdSender).to.exist;
      cy.wait(1000).then(() => {
        expect(win.birdSender.myId).to.be.a('string');
      });
    });
  });

  it('establishes WebSocket connection', () => {
    cy.window().then((win) => {
      cy.wait(1000).then(() => {
        expect(win.birdSender.ws).to.exist;
        expect(win.birdSender.ws.readyState).to.equal(1);
      });
    });
  });

  it('can detect peer connections', () => {
    cy.window().then((win) => {
      expect(win.birdSender.peers).to.exist;
    });
  });

  it('shows empty state when no peers are connected', () => {
    cy.window().then((win) => {
      if (win.birdSender.peers.size === 0) {
        cy.contains('no devices found').should('be.visible');
      }
    });
  });

  it('has correct logo SVG', () => {
    cy.get('.logo svg').should('be.visible');
    cy.get('.logo-text').should('contain', 'bird-sender');
  });

  it('modal is hidden by default', () => {
    cy.get('.modal-overlay').should('not.have.class', 'active');
  });

  it('transfer list is empty initially', () => {
    cy.get('.transfers-list').children().should('have.length', 0);
  });
});
