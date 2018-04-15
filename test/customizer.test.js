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

const newUser = {
  email: "test@test.com",
  password: "password",
  name: "Test User",
  companyName: ""
};

const login = {
  email: "test@test.com",
  password: "password"
};

describe("Creates a new customization", _ => {
  const agent = chai.request.agent(app);
  const customization = {
    name: "Test Customization",
    description: "Test Description",
    volume: 4,
    colour: 70,
    hoppiness: 80,
    maltFlavour: 20
  };
  before(function(done) {
    this.timeout(3000);
    agent.post("/api/users/new").send(newUser).end((_, res) => {
      agent.post("/api/users/login").send(login).end((_, res) => {
        done();
      });
    });
  });
  it("Can create a new customization", done => {
    agent.post("/api/customizer/new").send(customization).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.have.all.keys(["customizations", "id"]);
      expect(res.body.customizations).to.be.an("array");
      expect(res.body.id).to.be.a("number");
      done();
    });
  });
  it("Rejects on no name", done => {
    const badCustomization = Object.assign({}, customization, { name: "" });
    agent.post("/api/customizer/new").send(badCustomization).end((_, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.equal("Your beer needs a name!");
      done();
    });
  });
  it("Rejects on db error", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onSecondCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.post("/api/customizer/new").send(customization).end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error retrieving customizations");
      done();
    });
  });
  after(done => {
    const conn = app.get("conn");
    const statement = "DELETE FROM Users WHERE email=?;";
    const query = mysql.format(statement, [newUser.email]);
    conn.query(query, (err, results, fields) => {
      if (err) console.error(err);
      done();
    });
  });
});

describe("Updates a customization", _ => {
  const agent = chai.request.agent(app);
  const customization = {
    name: "Test Customization",
    description: "Test Description",
    volume: 4,
    colour: 70,
    hoppiness: 80,
    maltFlavour: 20
  };
  let id;
  let updated;
  before(function(done) {
    this.timeout(3500);
    agent.post("/api/users/new").send(newUser).end((_, res) => {
      agent.post("/api/users/login").send(login).end((_, res) => {
        agent.post("/api/customizer/new").send(customization).end((_, res) => {
          id = res.body.id;
          updated = Object.assign({}, customization, { id, volume: 5 });
          done();
        });
      });
    });
  });
  it("Can update a customization", done => {
    agent.put("/api/customizer/update").send(updated).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.have.all.keys(["customizations", "id"]);
      expect(res.body.customizations).to.be.an("array");
      expect(res.body.id).to.be.a("number").and.to.equal(id);
      done();
    });
  });
  it("Rejects on no name", done => {
    const badCustomization = Object.assign({}, customization, { id, name: "" });
    agent.put("/api/customizer/update").send(badCustomization).end((_, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.equal("Your beer needs a name!");
      done();
    });
  });
  it("Rejects on db error", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onSecondCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.put("/api/customizer/update").send(updated).end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error updating customization");
      done();
    });
  });
  after(done => {
    const conn = app.get("conn");
    const statement = "DELETE FROM Users WHERE email=?;";
    const query = mysql.format(statement, [newUser.email]);
    conn.query(query, (err, results, fields) => {
      if (err) console.error(err);
      done();
    });
  });
});

describe("Can get customizations", _ => {
  const agent = chai.request.agent(app);
  const customization = {
    name: "Test Customization",
    description: "Test Description",
    volume: 4,
    colour: 70,
    hoppiness: 80,
    maltFlavour: 20
  };
  let id;
  before(function(done) {
    this.timeout(3500);
    agent.post("/api/users/new").send(newUser).end((_, res) => {
      agent.post("/api/users/login").send(login).end((_, res) => {
        agent.post("/api/customizer/new").send(customization).end((_, res) => {
          done();
        });
      });
    });
  });
  it("Can get all customizations", function(done) {
    this.timeout(3000);
    agent.get("/api/customizer/customizations").end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body[0]).to.have.all.keys(
        ["id", "name", "description", "volume", "colour", "hoppiness", "maltFlavour"]
      );
      id = res.body[0].id;
      done();
    });
  });
  it("Can get a customization by id", done => {
    agent.get("/api/customizer/from-id/" + id).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys(
        ["id", "name", "description", "volume", "colour", "hoppiness", "maltFlavour"]
      );
      done();
    });
  });
  it("Rejects on db error getting all customizations", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onSecondCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.get("/api/customizer/customizations").end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error getting customizations");
      done();
    });
  });
  it("Rejects on db error getting a customization", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onSecondCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.get("/api/customizer/from-id/" + id).end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error getting customization");
      done();
    });
  });
  after(done => {
    const conn = app.get("conn");
    const statement = "DELETE FROM Users WHERE email=?;";
    const query = mysql.format(statement, [newUser.email]);
    conn.query(query, (err, results, fields) => {
      if (err) console.error(err);
      done();
    });
  });
});
