const chai = require("chai");
const { expect } = chai;
chai.use(require("chai-http"));

const App = require("../app.js");

describe("The App loads", function (done) {
  it("Index returns 200", function (done) {
    chai.request(App).get("/").end(function (_, res) {
      expect(res).to.have.status(200);
      done();
    });
  });
});
