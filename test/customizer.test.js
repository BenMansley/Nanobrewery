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
  it("Can get data", function(done) {
    this.timeout(2500);
    chai.request(app).get("/api/customizer/all-data").end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys(["variables", "templates", "presets"]);
      expect(res.body.variables).to.be.an("array");
      expect(res.body.templates).to.be.an("array");
      expect(res.body.presets).to.be.an("array");
      expect(res.body.presets).to.have.length(4);
      expect(res.body.presets[0]).to.have.all.keys(
        ["id", "name", "description", "volume", "colour", "hoppiness", "maltFlavour", "imageType", "customImage"]
      );
      done();
    });
  });
  it("Fails on db error getting variables ", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.yields(new Error());
    chai.request(app).get("/api/customizer/all-data").end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error getting data");
      done();
    });
  });
  it("Fails on db error getting presets", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onSecondCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
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
    conn.query(query, (err, results) => {
      if (err) console.error(err);
      done();
    });
  });
});

const newUser = {
  email: "test@test.com",
  password: "Password3114",
  name: "Test User",
  companyName: "",
  dob: "1992-05-01T12:34:29.503Z"
};

const login = {
  email: "test@test.com",
  password: "Password3114"
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
  const otherCustomization = Object.assign({}, customization, { name: "Test 2" });
  before(function(done) {
    this.timeout(4000);
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
      expect(res.body.customizations[0]).to.have.all.keys(
        ["id", "name", "description", "volume", "colour", "hoppiness", "maltFlavour", "imageType", "customImage"]
      );
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
  it("Rejects on repeat name", done => {
    agent.post("/api/customizer/new").send(customization).end((_, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.equal("You already have a beer with that name!");
      done();
    });
  });
  it("Rejects on db error getting user customizations", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onSecondCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.post("/api/customizer/new").send(otherCustomization).end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error retrieving customizations");
      done();
    });
  });
  it("Rejects on db error getting creating customization", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onThirdCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.post("/api/customizer/new").send(otherCustomization).end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error saving new customization");
      done();
    });
  });
  it("Rejects on db error getting customizations", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onCall(3).callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.post("/api/customizer/new").send(otherCustomization).end((_, res) => {
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
    conn.query(query, (err, results) => {
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
  let updated;
  before(function(done) {
    this.timeout(5000);
    agent.post("/api/users/new").send(newUser).end((_, res) => {
      agent.post("/api/users/login").send(login).end((_, res) => {
        agent.post("/api/customizer/new").send(customization).end((_, res) => {
          updated = Object.assign({}, customization, { volume: 5 });
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
      expect(res.body.customizations[0]).to.have.all.keys(
        ["id", "name", "description", "volume", "colour", "hoppiness", "maltFlavour", "imageType", "customImage"]
      );
      expect(res.body.id).to.be.a("number");
      done();
    });
  });
  it("Rejects on no name", done => {
    const badCustomization = Object.assign({}, customization, { name: "" });
    agent.put("/api/customizer/update").send(badCustomization).end((_, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.equal("Your beer needs a name!");
      done();
    });
  });
  it("Rejects on bad name", done => {
    const badCustomization = Object.assign({}, customization, { name: "Flerg" });
    agent.put("/api/customizer/update").send(badCustomization).end((_, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.equal("No beer found with that name!");
      done();
    });
  });
  it("Rejects on db error updating", done => {
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
  it("Rejects on db error getting customizations", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onThirdCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.put("/api/customizer/update").send(updated).end((_, res) => {
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
    conn.query(query, (err, results) => {
      if (err) console.error(err);
      done();
    });
  });
});

describe("Updates a customization's details", _ => {
  const agent = chai.request.agent(app);
  const customization = {
    name: "Test Customization",
    description: "Test Description",
    volume: 4,
    colour: 70,
    hoppiness: 80,
    maltFlavour: 20
  };
  let updated = {
    name: "New Name",
    description: "New description"
  };
  before(function(done) {
    this.timeout(5000);
    agent.post("/api/users/new").send(newUser).end((_, res) => {
      agent.post("/api/users/login").send(login).end((_, res) => {
        agent.post("/api/customizer/new").send(customization).end((_, res) => {
          updated = Object.assign({}, updated, { id: res.body.id });
          done();
        });
      });
    });
  });
  it("Can update a customization", done => {
    agent.put("/api/customizer/edit-details").send(updated).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body[0]).to.have.all.keys(
        ["id", "name", "description", "volume", "colour", "hoppiness", "maltFlavour", "imageType", "customImage"]
      );
      expect(res.body[0].name).to.equal(updated.name);
      expect(res.body[0].description).to.equal(updated.description);
      done();
    });
  });
  it("Rejects on no name", done => {
    const badUpdate = Object.assign({}, updated, { name: "" });
    agent.put("/api/customizer/edit-details").send(badUpdate).end((_, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.equal("Your beer needs a name!");
      done();
    });
  });
  it("Rejects on bad id", done => {
    const badUpdate = Object.assign({}, updated, { id: 31414 });
    agent.put("/api/customizer/edit-details").send(badUpdate).end((_, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.equal("No beer found with that id!");
      done();
    });
  });
  it("Rejects on db error updating", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onSecondCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.put("/api/customizer/edit-details").send(updated).end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error updating customization");
      done();
    });
  });
  it("Rejects on db error getting customizations", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onThirdCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.put("/api/customizer/edit-details").send(updated).end((_, res) => {
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
    conn.query(query, (err, results) => {
      if (err) console.error(err);
      done();
    });
  });
});

describe("Updates a customization's image", _ => {
  const agent = chai.request.agent(app);
  const customization = {
    name: "Test Customization",
    description: "Test Description",
    volume: 4,
    colour: 70,
    hoppiness: 80,
    maltFlavour: 20
  };
  let updated = {
    imageType: 2,
    customImage: "customimageURL"
  };
  before(function(done) {
    this.timeout(5000);
    agent.post("/api/users/new").send(newUser).end((_, res) => {
      agent.post("/api/users/login").send(login).end((_, res) => {
        agent.post("/api/customizer/new").send(customization).end((_, res) => {
          updated = Object.assign({}, updated, { id: res.body.id });
          done();
        });
      });
    });
  });
  it("Can update a customization", done => {
    agent.put("/api/customizer/edit-image").send(updated).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body[0]).to.have.all.keys(
        ["id", "name", "description", "volume", "colour", "hoppiness", "maltFlavour", "imageType", "customImage"]
      );
      expect(res.body[0].imageType).to.equal(updated.imageType);
      done();
    });
  });
  it("Rejects on bad id", done => {
    const badUpdate = Object.assign({}, updated, { id: 31414 });
    agent.put("/api/customizer/edit-image").send(badUpdate).end((_, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.equal("No beer found with that id!");
      done();
    });
  });
  it("Rejects on db error updating", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onSecondCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.put("/api/customizer/edit-image").send(updated).end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error updating customization");
      done();
    });
  });
  it("Rejects on db error getting customizations", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onThirdCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.put("/api/customizer/edit-image").send(updated).end((_, res) => {
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
    conn.query(query, (err, results) => {
      if (err) console.error(err);
      done();
    });
  });
});

describe("Deletes a customization", _ => {
  const agent = chai.request.agent(app);
  const customization = {
    name: "Test Customization",
    description: "Test Description",
    volume: 4,
    colour: 70,
    hoppiness: 80,
    maltFlavour: 20
  };
  let firstId;
  let secondId;
  before(function(done) {
    this.timeout(6000);
    agent.post("/api/users/new").send(newUser).end((_, res) => {
      agent.post("/api/users/login").send(login).end((_, res) => {
        agent.post("/api/customizer/new").send(customization).end((_, res) => {
          firstId = res.body.id;
          const newCustomization = Object.assign({}, customization, { name: "Test 2" });
          agent.post("/api/customizer/new").send(newCustomization).end((_, res) => {
            secondId = res.body.id;
            done();
          });
        });
      });
    });
  });
  it("Can delete a customization", done => {
    agent.delete("/api/customizer/delete").send({ id: firstId }).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body).to.have.length(1);
      done();
    });
  });
  it("Rejects on bad id", done => {
    agent.delete("/api/customizer/delete").send({ id: firstId }).end((_, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.equal("No beer found with that id!");
      done();
    });
  });
  it("Rejects on db error deleting", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onSecondCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.delete("/api/customizer/delete").send({ id: firstId }).end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error deleting customization");
      done();
    });
  });
  it("Rejects on db error getting customizations", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onThirdCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.delete("/api/customizer/delete").send({ id: secondId }).end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error getting customizations");
      done();
    });
  });
  after(done => {
    const conn = app.get("conn");
    const statement = "DELETE FROM Users WHERE email=?;";
    const query = mysql.format(statement, [newUser.email]);
    conn.query(query, (err, results) => {
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
    this.timeout(4000);
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
        ["id", "name", "description", "volume", "colour", "hoppiness", "maltFlavour", "imageType", "customImage"]
      );
      id = res.body[0].id;
      done();
    });
  });
  it("Can get a customization by id", done => {
    agent.get("/api/customizer/from-id/" + id).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys(
        ["id", "name", "description", "volume", "colour", "hoppiness", "maltFlavour", "imageType", "customImage"]
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
    conn.query(query, (err, results) => {
      if (err) console.error(err);
      done();
    });
  });
});
