const mysql = require("mysql");
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-http"));
const sinon = require("sinon");
const app = require("../app");

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

describe("Register a new user", _ => {
  it("Can register a user", function(done) {
    this.timeout(4000);
    chai.request(app).post("/api/users/new").send(newUser).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.equal("Success");
      done();
    });
  });
  it("Rejects on duplicate email", done => {
    chai.request(app).post("/api/users/new").send(newUser).end((_, res) => {
      expect(res).to.have.status(401);
      expect(res.body).to.equal("Error creating user");
      done();
    });
  });
  it("Rejects on too young", done => {
    const badUser = Object.assign({}, newUser, { dob: "2002-05-01T12:34:29.503Z" });
    chai.request(app).post("/api/users/new").send(badUser).end((_, res) => {
      expect(res).to.have.status(401);
      expect(res.body).to.equal("You must be at least 18 to sign up");
      done();
    });
  });
  describe("Password check failures", _ => {
    const weakPassword = Object.assign({}, newUser, { password: "password" });
    const shortPassword = Object.assign({}, newUser, { password: "gien" });
    const error = "Insecure Password!";
    it("Rejects on weak password", done => {
      chai.request(app).post("/api/users/new").send(weakPassword).end((_, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.equal(error);
        done();
      });
    });
    it("Rejects on short password", done => {
      chai.request(app).post("/api/users/new").send(shortPassword).end((_, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.equal(error);
        done();
      });
    });
  });
  describe("Registering fails on db failure", _ => {
    let sqlStub = sinon.stub();
    let bcryptStub = sinon.stub();
    let error = "Error creating user";
    before(done => {
      sqlStub = sinon.stub(app.get("conn"), "query");
      done();
    });
    it("Fails on getting email", done => {
      sqlStub.reset();
      sqlStub.yields(new Error());
      chai.request(app).post("/api/users/new").send(newUser).end((_, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.equal(error);
        done();
      });
    });
    it("Fails on saving user", done => {
      sqlStub.reset();
      const user = Object.assign({}, newUser, { email: "abc@efg.com" });
      sqlStub.onFirstCall().callsArgWith(1, null, []);
      sqlStub.onSecondCall().callsArgWith(1, new Error());
      chai.request(app).post("/api/users/new").send(user).end((_, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.equal(error);
        done();
      });
    });
    it("Fails on bcrypt error", done => {
      sqlStub.reset();
      const user = Object.assign({}, newUser, { email: "abc@def.com" });
      sqlStub.callsArgWith(1, null, []);
      bcryptStub = sinon.stub(require("bcrypt"), "hash");
      bcryptStub.yields(new Error());
      chai.request(app).post("/api/users/new").send(user).end((_, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.equal(error);
        done();
      });
    });
    it("Fails on saving token", function(done) {
      bcryptStub.restore();
      sqlStub.reset();
      const user = Object.assign({}, newUser, { email: "abc@def.com" });
      error = "Error creating token";
      sqlStub.onFirstCall().callsArgWith(1, null, []);
      sqlStub.onSecondCall().callsArgWith(1, null, []);
      sqlStub.onThirdCall().callsArgWith(1, new Error());
      chai.request(app).post("/api/users/new").send(user).end((_, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.equal(error);
        done();
      });
    });
    after(done => {
      sqlStub.restore();
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

describe("Logs in", _ => {
  const error = "Invalid Email or Password";
  const agent = chai.request.agent(app);
  before(done => {
    chai.request(app).post("/api/users/new").send(newUser).end((_, res) => {
      done();
    });
  });
  it("Can log in with correct details", done => {
    agent.post("/api/users/login").send(login).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res).to.have.cookie("session");
      expect(res.body).to.equal("Success");
      done();
    });
  });
  it("Rejects unknown email", done => {
    const badUser = Object.assign({}, login, { email: "bad@test.com" });
    chai.request(app).post("/api/users/login").send(badUser).end((_, res) => {
      expect(res).to.have.status(401);
      expect(res.body).to.equal(error);
      done();
    });
  });
  it("Rejects on incorrect password", done => {
    const badUser = Object.assign({}, login, { password: "nopassword" });
    chai.request(app).post("/api/users/login").send(badUser).end((_, res) => {
      expect(res).to.have.status(401);
      expect(res.body).to.equal(error);
      done();
    });
  });
  it("Logs in with current session", done => {
    agent.get("/api/users/from-cookie").end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.equal("Success");
      agent.close();
      done();
    });
  });
  describe("Registers fails on db failure", done => {
    let sqlStub = sinon.stub();
    const error = "Could not log in (Server Error)";
    before(done => {
      sqlStub = sinon.stub(app.get("conn"), "query");
      done();
    });
    it("Fails on looking up Email & Password", done => {
      sqlStub.reset();
      sqlStub.yields(new Error());
      chai.request(app).post("/api/users/login").send(login).end((_, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.equal(error);
        done();
      });
    });
    it("Fails on saving token", done => {
      sqlStub.reset();
      sqlStub.onSecondCall().callsArgWith(1, new Error());
      sqlStub.callThrough();
      chai.request(app).post("/api/users/login").send(login).end((_, res) => {
        sqlStub.restore();
        expect(res).to.have.status(500);
        expect(res.body).to.equal(error);
        done();
      });
    });
    it("Fails on bcrypt error", done => {
      const bcryptStub = sinon.stub(require("bcrypt"), "compare");
      bcryptStub.yields(new Error());
      chai.request(app).post("/api/users/login").send(login).end((_, res) => {
        bcryptStub.restore();
        expect(res).to.have.status(500);
        expect(res.body).to.equal(error);
        done();
      });
    });
  });
  after(done => {
    const conn = app.get("conn");
    const statement = "DELETE FROM Users WHERE email=?;";
    const query = mysql.format(statement, [login.email]);
    conn.query(query, (err, results) => {
      if (err) console.error(err);
      done();
    });
  });
});

describe("Gets user details", _ => {
  const agent = chai.request.agent(app);
  before(function(done) {
    this.timeout(3000);
    agent.post("/api/users/new").send(newUser).end((_, res) => {
      agent.post("/api/users/login").send(login).end((_, res) => {
        done();
      });
    });
  });
  it("Gets details about a logged in user", done => {
    agent.get("/api/users/details").end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys(["name", "email", "companyName"]);
      expect(res.body.email).to.equal("test@test.com");
      expect(res.body.name).to.equal("Test User");
      expect(res.body.companyName).to.equal("");
      done();
    });
  });
  it("Rejects if not authorized", done => {
    chai.request(app).get("/api/users/details").end((_, res) => {
      expect(res).to.have.status(401);
      expect(res.body).to.equal("User not authorized");
      done();
    });
  });
  it("Fails on middleware db failure", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.yields(new Error());
    agent.get("/api/users/details").end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error checking token");
      done();
    });
  });
  it("Fails on db failure", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onSecondCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.get("/api/users/details").end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error retrieving user details");
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

describe("Edits user details", _ => {
  const agent = chai.request.agent(app);
  const changes = { companyName: "Test Company" };
  const user = Object.assign({}, login, changes);
  before(function(done) {
    this.timeout(3000);
    agent.post("/api/users/new").send(newUser).end((_, res) => {
      agent.post("/api/users/login").send(login).end((_, res) => {
        done();
      });
    });
  });
  it("Can edit user details", done => {
    agent.put("/api/users/edit").send(user).end((_, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });
  it("Has changed details successfully", done => {
    agent.get("/api/users/details").end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body.companyName).to.equal(changes.companyName);
      done();
    });
  });
  it("Fails on db failure", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onSecondCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.put("/api/users/edit").send(user).end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error editing user");
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

describe("Signs out", _ => {
  const agent = chai.request.agent(app);
  before(function(done) {
    this.timeout(3000);
    agent.post("/api/users/new").send(newUser).end((_, res) => {
      agent.post("/api/users/login").send(login).end((_, res) => {
        done();
      });
    });
  });
  it("Fails on db failure", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onSecondCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.get("/api/users/signout").end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error deleting token");
      done();
    });
  });
  it("Can sign out", done => {
    agent.get("/api/users/signout").end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.a("string").and.to.equal("Success");
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
