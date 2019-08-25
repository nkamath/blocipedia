const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {

  beforeEach((done) => {

    sequelize.sync({
        force: true
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        done();
      });

  });

  describe("GET /users/signup", () => {

    it("should render a view with a sign up form", (done) => {
      request.get(`${base}signup`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Welcome to Blocipedia");
        done();
      });
    });
  });

  describe("POST /users/signup", () => {

    it("should create a new user with valid values and redirect", (done) => {

      const options = {
        url: `${base}signup`,
        form: {
          email: "user@example.com",
          password: "123456789"
        }
      }

      request.post(options,
        (err, res, body) => {
          User.findOne({
              where: {
                email: "user@example.com"
              }
            })
            .then((user) => {
              expect(user).not.toBeNull();
              expect(user.email).toBe("user@example.com");
              expect(user.id).toBe(1);
              done();
            })
            .catch((err) => {
              done();
            });
        }
      );
    });

    it("should not create a new user with invalid attributes and redirect", (done) => {
      request.post({
          url: base,
          form: {
            email: "no",
            password: "123456789"
          }
        },
        (err, res, body) => {
          User.findOne({
              where: {
                email: "no"
              }
            })
            .then((user) => {
              expect(user).toBeNull();
              done();
            })
            .catch((err) => {
              done();
            });
        }
      );
    });

  });

  describe("GET /users/sign-in", () => {

    it("should render a view with a sign in form", (done) => {
      request.get(`${base}sign-in`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign in");
        done();
      });
    });

  });
});