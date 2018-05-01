const mysql = require("mysql");
const chai = require("chai");
const { expect } = chai;
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

describe("Gets product data about a category", _ => {
  it("Can get products", done => {
    chai.request(app).get("/api/shop/products/category/hardware").end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body[0]).to.have.all.keys(["id", "name", "description", "price", "category", "quantity"]);
      done();
    });
  });
  it("Rejects on invalid category", done => {
    chai.request(app).get("/api/shop/products/category/test").end((_, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.equal("Invalid category");
      done();
    });
  });
  it("Fails on db error", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.yields(new Error());
    chai.request(app).get("/api/shop/products/category/hardware").end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error retrieving products");
      done();
    });
  });
});

describe("Add a product to a user's basket", _ => {
  const product = {
    productId: 1,
    quantity: 2
  };
  const agent = chai.request.agent(app);
  before(function(done) {
    this.timeout(4000);
    agent.post("/api/users/new").send(newUser).end((_, res) => {
      agent.post("/api/users/login").send(login).end((_, res) => {
        done();
      });
    });
  });
  it("Adds a product to the basket", done => {
    agent.post("/api/shop/basket/add").send(product).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.a("number");
      expect(res.body).to.equal(1);
      done();
    });
  });
  it("Fails on db error adding to basket", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onSecondCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.post("/api/shop/basket/add").send(product).end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error adding item to basket");
      done();
    });
  });
  it("Fails on db error getting basket size", done => {
    const otherProduct = Object.assign({}, product, { productId:2 });
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onThirdCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.post("/api/shop/basket/add").send(otherProduct).end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error getting updated basket");
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

describe("Gets the size of a user's basket", _ => {
  const product = {
    productId: 1,
    quantity: 2
  };
  const agent = chai.request.agent(app);
  before(function(done) {
    this.timeout(4000);
    agent.post("/api/users/new").send(newUser).end((_, res) => {
      agent.post("/api/users/login").send(login).end((_, res) => {
        agent.post("/api/shop/basket/add").send(product).end((_, res) => {
          done();
        });
      });
    });
  });
  it("Gets a user's basket size", done => {
    agent.get("/api/shop/basket/size").end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.a("number");
      expect(res.body).to.equal(1);
      done();
    });
  });
  it("Fails on db error", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onSecondCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.get("/api/shop/basket/size").end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error getting basket size");
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

describe("Gets the contents of a user's basket", _ => {
  const product = {
    productId: 1,
    quantity: 2
  };
  const agent = chai.request.agent(app);
  before(function(done) {
    this.timeout(4000);
    agent.post("/api/users/new").send(newUser).end((_, res) => {
      agent.post("/api/users/login").send(login).end((_, res) => {
        agent.post("/api/shop/basket/add").send(product).end((_, res) => {
          done();
        });
      });
    });
  });
  it("Gets a user's basket", done => {
    agent.get("/api/shop/basket/get").end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.have.all.keys(["id", "quantity", "name", "description", "price", "category"]);
      done();
    });
  });
  it("Fails on db error", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onSecondCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.get("/api/shop/basket/get").end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error getting basket");
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

describe("Updates the quantity of an item in a user's basket", _ => {
  const product = {
    productId: 1,
    quantity: 2
  };
  const updated = {
    productId: 1,
    quantity: 4
  };
  const agent = chai.request.agent(app);
  before(function(done) {
    this.timeout(4000);
    agent.post("/api/users/new").send(newUser).end((_, res) => {
      agent.post("/api/users/login").send(login).end((_, res) => {
        agent.post("/api/shop/basket/add").send(product).end((_, res) => {
          done();
        });
      });
    });
  });
  it("Updates the quantity of an item and gets updated basket", function(done) {
    this.timeout(3000);
    agent.put("/api/shop/basket/update").send(updated).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.have.all.keys(["id", "quantity", "name", "description", "price", "category"]);
      expect(res.body[0].quantity).to.equal(updated.quantity);
      done();
    });
  });
  it("Fails on db error updating quantity", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onSecondCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.put("/api/shop/basket/update").send(updated).end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error updating basket");
      done();
    });
  });
  it("Fails on db error getting new basket", done => {
    const sqlStub = sinon.stub(app.get("conn"), "query");
    sqlStub.onThirdCall().callsArgWith(1, new Error());
    sqlStub.callThrough();
    agent.put("/api/shop/basket/update").send(updated).end((_, res) => {
      sqlStub.restore();
      expect(res).to.have.status(500);
      expect(res.body).to.equal("Error getting basket");
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
