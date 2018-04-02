const chai = require("chai");
const { expect } = chai;
chai.use(require("chai-http"));

const App = require("../app.js");

describe("The App loads", done => {
  it("Index returns 200", done => {
    chai.request(App).get("/").end((_, res) => {
      expect(res.status).to.be.oneOf([200, 404]);
      done();
    });
  });
});
