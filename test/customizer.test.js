const mysql = require("mysql");
const chai = require("chai");
const { expect } = chai;
chai.use(require("chai-http"));
const sinon = require("sinon");
const app = require("../app");

describe("Gets customizer variables", _ => {
  it("Can get variables", done => {
    chai.request(app).get("/api/customizer/variables").end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body[0]).to.have.all.keys(["id", "name", "min", "max", "step", "defaultVal", "suffix"]);
      done();
    });
  });
  it("Fails on db error", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.yields(new Error());
    chai.request(app).get("/api/customizer/variables").end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error retrieving customization options");
      done();
    });
  });
});

describe("Gets customizer data", _ => {
  it("Can get data", done => {
    chai.request(app).get("/api/customizer/all-data").end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys(["variables", "templates"]);
      expect(res.body.variables).to.be.an("array");
      expect(res.body.templates).to.be.an("array");
      done();
    });
  });
  it("Fails on db error", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.yields(new Error());
    chai.request(app).get("/api/customizer/all-data").end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error getting data");
      done();
    });
  });
});

describe("Updates a variable", _ => {
  const updatedVariable = {
    id: 1, name: "Volume", min: 0, max: 8, step: 0.1, defaultVal: 4, suffix: " ABV"
  };
  it("Can update a variable", done => {
    chai.request(app).put("/api/customizer/edit-variable").send(updatedVariable).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.equal("Success");
      done();
    });
  });
  it("Has updated successfully", done => {
    chai.request(app).get("/api/customizer/variables").end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body[0].max).to.equal(updatedVariable.max);
      done();
    });
  });
  it("Fails on db error", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.yields(new Error());
    chai.request(app).put("/api/customizer/edit-variable").send(updatedVariable).end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error updating variables");
      done();
    });
  });
  after(done => {
    const conn = app.get("conn");
    const statement = "UPDATE Variables SET max=? WHERE id=?;";
    const query = mysql.format(statement, [updatedVariable.max, updatedVariable.id]);
    conn.query(query, (err, results, fields) => {
      if (err) console.error(err);
      done();
    });
  });
});
