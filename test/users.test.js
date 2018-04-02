const mysql = require("mysql");
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-http"));
const sinon = require("sinon");
const app = require("../app");

const newUser = {
  email: "test@test.com",
  password: "password",
  name: "Test User",
  companyName: ""
};

describe("Register a new user", _ => {
  it("Can register a user", function(done) {
    this.timeout(3500);
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
    conn.query(query, (err, results, fields) => {
      if (err) console.error(err);
      done();
    });
  });
});
describe("Can log in", _ => {
  const user = { email: "test@test.com", password: "password" };
  const error = "Invalid Email or Password";
  // let session;
  before(done => {
    chai.request(app).post("/api/users/new").send(newUser).end((_, res) => {
      done();
    });
  });
  it("Can log in with correct details", done => {
    chai.request(app).post("/api/users/login").send(user).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res).to.have.cookie("session");
      console.log(res);
      expect(res.body).to.equal("Success");
      done();
    });
  });
  it("Rejects unknown email", done => {
    const badUser = Object.assign({}, user, { email: "bad@test.com" });
    chai.request(app).post("/api/users/login").send(badUser).end((_, res) => {
      expect(res).to.have.status(401);
      expect(res.body).to.equal(error);
      done();
    });
  });
  it("Rejects on incorrect password", done => {
    const badUser = Object.assign({}, user, { password: "nopassword" });
    chai.request(app).post("/api/users/login").send(badUser).end((_, res) => {
      expect(res).to.have.status(401);
      expect(res.body).to.equal(error);
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
      chai.request(app).post("/api/users/login").send(user).end((_, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.equal(error);
        done();
      });
    });
    it("Fails on saving token", done => {
      sqlStub.reset();
      sqlStub.onSecondCall().callsArgWith(1, new Error());
      sqlStub.callThrough();
      chai.request(app).post("/api/users/login").send(user).end((_, res) => {
        sqlStub.restore();
        expect(res).to.have.status(500);
        expect(res.body).to.equal(error);
        done();
      });
    });
    it("Fails on bcrypt error", done => {
      const bcryptStub = sinon.stub(require("bcrypt"), "compare");
      bcryptStub.yields(new Error());
      chai.request(app).post("/api/users/login").send(user).end((_, res) => {
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
    const query = mysql.format(statement, [user.email]);
    conn.query(query, (err, results, fields) => {
      if (err) console.error(err);
      done();
    });
  });
});