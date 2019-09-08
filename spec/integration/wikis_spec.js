const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

const testRoles = {
  standard: 0,
  admin: 1,
  premium: 2
};

function authorizeUser(role, done) { // helper function to create and authorize new user
  User.create({
      email: "#{role}@example.com",
      password: "123456",
      role: role
    })
    .then((user) => {
      request.get({ // mock authentication
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role, // mock authenticate as `role` user
            userId: user.id,
            email: user.email
          }
        },
        (err, res, body) => {
          Wiki.create({
              title: sampleTestData.altTitle,
              body: sampleTestData.altBody,
              private: false,
              userId: user.id
            })
            .then((wiki) => {
              done();
            })
        })
    });
}

const sampleTestData = {
  title: "My thoughts on wikis",
  altTitle: "My musings on wikis",
  body: "A compilation of reports from my time thinking about wikis.",
  altBody: "A compilation of thoughts from discussions on wikis."
};

describe("routes : wikis", () => {
  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({
      force: true
    }).then((res) => {
      Wiki.create({
          title: sampleTestData.title,
          body: sampleTestData.body,
          private: false
        })
        .then((wiki) => {
          this.wiki = wiki; //store the wiki id
          done();
        })
    })
  });

  describe("admin user performing CRUD actions for Wiki", () => {
    beforeEach((done) => {
      authorizeUser(testRoles.admin, done);
    });
    describe("GET /wikis", () => {

      it("should return a status code 200 and return all wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain(sampleTestData.title);
          done();
        });
      });
    });

    describe("GET /wikis/new", () => {

      it("should render a new wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });

    });

    describe("POST /wikis/new", () => {
      const options = {
        url: `${base}new`,
        form: {
          title: sampleTestData.title,
          body: sampleTestData.body
        }
      };

      it("should create a new wiki and redirect", (done) => {

        request.post(options,
          (err, res, body) => {
            Wiki.findOne({
                where: {
                  title: sampleTestData.title
                }
              })
              .then((wiki) => {
                expect(res.statusCode).toBe(303);
                expect(wiki.title).toBe(sampleTestData.title);
                expect(wiki.body).toBe(sampleTestData.body);
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
          }
        );
      });
    });

    describe("GET /wikis/:id", () => {

      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain(sampleTestData.title);
          done();
        });
      });

    });

    describe("POST /wikis/:id/destroy", () => {

      it("should delete the wiki with the associated ID", (done) => {
        Wiki.findAll()
          .then((wikis) => {
            const wikiCountBeforeDelete = wikis.length;

            expect(wikiCountBeforeDelete).toBe(2);
            request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
              Wiki.findAll()
                .then((wikis) => {
                  expect(err).toBeNull();
                  expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
                  done();
                })

            });
          });

      });

    });

    describe("GET /wikis/:id/edit", () => {

      it("should render a view with an edit wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain(sampleTestData.title);
          done();
        });
      });
    });

    describe("POST /wikis/:id/update", () => {

      it("should update wiki with the given values", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: sampleTestData.altTitle
          }
        };
        request.post(options,
          (err, res, body) => {

            expect(err).toBeNull();
            Wiki.findOne({
                where: {
                  id: this.wiki.id
                }
              })
              .then((wiki) => {
                expect(wiki.title).toBe(sampleTestData.altTitle);
                done();
              });
          });
      });
    });
  });

  describe("standard user performing CRUD actions for Wiki", () => {
    beforeEach((done) => {
      authorizeUser(testRoles.standard, done);
    });
    describe("GET /wikis", () => {

      it("should return a status code 200 and return all wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain(sampleTestData.title);
          done();
        });
      });
    });

    describe("GET /wikis/new", () => {

      it("should render a new wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });

    });

    describe("POST /wikis/new", () => {
      const options = {
        url: `${base}new`,
        form: {
          title: sampleTestData.title,
          body: sampleTestData.body
        }
      };

      it("should create a new wiki and redirect", (done) => {

        request.post(options,
          (err, res, body) => {
            Wiki.findOne({
                where: {
                  title: sampleTestData.title
                }
              })
              .then((wiki) => {
                expect(res.statusCode).toBe(303);
                expect(wiki.title).toBe(sampleTestData.title);
                expect(wiki.body).toBe(sampleTestData.body);
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
          }
        );
      });
    });

    describe("GET /wikis/:id", () => {

      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain(sampleTestData.title);
          done();
        });
      });

    });

    describe("POST /wikis/:id/destroy", () => {
      it("should be able to delete a wiki created by themselves", (done) => {

        Wiki.findAll()
          .then((wikis) => {
            const wikiCountBeforeDelete = wikis.length;

            expect(wikiCountBeforeDelete).toBe(2);
            request.post(`${base}${this.wiki.id+1}/destroy`, (err, res, body) => {
              Wiki.findAll()
                .then((wikis) => {
                  expect(err).toBeNull();
                  expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
                  done();
                })
            });
          });
      });

      it("should not be able to delete a wiki created by someone else", (done) => {
        Wiki.findAll()
          .then((wikis) => {
            const wikiCountBeforeDelete = wikis.length;

            expect(wikiCountBeforeDelete).toBe(2);
            request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
              Wiki.findAll()
                .then((wikis) => {
                  expect(err).toBeNull();
                  expect(wikis.length).toBe(wikiCountBeforeDelete);
                  done();
                })
            });
          });
      });

    });

    describe("GET /wikis/:id/edit", () => {

      it("should render a view with an edit wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain(sampleTestData.title);
          done();
        });
      });
    });

    describe("POST /wikis/:id/update", () => {
      it("should update a wiki with the given values", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: sampleTestData.altTitle
          }
        };
        request.post(options,
          (err, res, body) => {

            expect(err).toBeNull();
            Wiki.findOne({
                where: {
                  id: this.wiki.id
                }
              })
              .then((wiki) => {
                expect(wiki.title).toBe(sampleTestData.altTitle);
                done();
              });
          });
      });
    });
  });

  describe("premium user performing CRUD actions for Wiki", () => {
    beforeEach((done) => {
      authorizeUser(testRoles.premium, done);
    });
    describe("GET /wikis", () => {

      it("should return a status code 200 and return all wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain(sampleTestData.title);
          done();
        });
      });
    });

    describe("GET /wikis/new", () => {

      it("should render a new wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });

    });

    describe("POST /wikis/new", () => {
      const options = {
        url: `${base}new`,
        form: {
          title: sampleTestData.title,
          body: sampleTestData.body
        }
      };

      it("should create a new wiki and redirect", (done) => {

        request.post(options,
          (err, res, body) => {
            Wiki.findOne({
                where: {
                  title: sampleTestData.title
                }
              })
              .then((wiki) => {
                expect(res.statusCode).toBe(303);
                expect(wiki.title).toBe(sampleTestData.title);
                expect(wiki.body).toBe(sampleTestData.body);
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
          }
        );
      });
    });

    describe("GET /wikis/:id", () => {

      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain(sampleTestData.title);
          done();
        });
      });

    });

    describe("POST /wikis/:id/destroy", () => {
      it("should not be able to delete a wiki created by someone else", (done) => {

        Wiki.findAll()
          .then((wikis) => {
            const wikiCountBeforeDelete = wikis.length;

            expect(wikiCountBeforeDelete).toBe(2);
            request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
              Wiki.findAll()
                .then((wikis) => {
                  expect(err).toBeNull();
                  expect(wikis.length).toBe(wikiCountBeforeDelete);
                  done();
                })
            });
          });

      });

      it("should be able to delete a wiki created by themselves", (done) => {

        Wiki.findAll()
          .then((wikis) => {
            const wikiCountBeforeDelete = wikis.length;

            expect(wikiCountBeforeDelete).toBe(2);
            request.post(`${base}${this.wiki.id+1}/destroy`, (err, res, body) => {
              Wiki.findAll()
                .then((wikis) => {
                  expect(err).toBeNull();
                  expect(wikis.length).toBe(wikiCountBeforeDelete-1);
                  done();
                })
            });
          });

      });

    });

    describe("GET /wikis/:id/edit", () => {

      it("should render a view with an edit wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain(sampleTestData.title);
          done();
        });
      });
    });

    describe("POST /wikis/:id/update", () => {
      it("should update a wiki with the given values", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: sampleTestData.altTitle
          }
        };
        request.post(options,
          (err, res, body) => {

            expect(err).toBeNull();
            Wiki.findOne({
                where: {
                  id: this.wiki.id
                }
              })
              .then((wiki) => {
                expect(wiki.title).toBe(sampleTestData.altTitle);
                done();
              });
          });
      });
    });

    describe("POST /wikis/:id/private", () => {
      it("should make an owned public wiki private", (done) => {
        const options = {
          url: `${base}${this.wiki.id +1 }/update`,
          form: {
            private: true
          }
        };
        request.post(options,
          (err, res, body) => {

            expect(err).toBeNull();
            Wiki.findOne({
                where: {
                  title: sampleTestData.altTitle
                }
              })
              .then((wiki) => {
                expect(wiki.private).toBe(true);
                done();
              });
          });
      });

      it("should not make someone else's public wiki private", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            private: false
          }
        };
        request.post(options,
          (err, res, body) => {

            expect(err).toBeNull();
            Wiki.findOne({
                where: {
                  title: sampleTestData.title
                }
              })
              .then((wiki) => {
                expect(wiki.private).toBe(false);
                done();
              });
          });
      });
    });
  });

  describe("guest user performing CRUD actions for Wiki", () => {
    beforeEach((done) => {
      request.get({           // mock authentication
        url: "http://localhost:3000/auth/fake",
        form: {
          userId: 0 // flag to indicate mock auth to destroy any session
        }
      },
        (err, res, body) => {
          done();
        }
      );
      
    });
    describe("GET /wikis", () => {

      it("should return a status code 200 and return all wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain(sampleTestData.title);
          done();
        });
      });
    });

    describe("GET /wikis/new", () => {

      it("should not render a new wiki form but instead redirect to wikis view", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain(sampleTestData.title);
          done();
        });
      });

    });

    describe("POST /wikis/new", () => {
      const options = {
        url: `${base}new`,
        form: {
          title: sampleTestData.altTitle,
          body: sampleTestData.altBody
        }
      };

      it("should not create a new wiki", (done) => {

        request.post(options,
          (err, res, body) => {
            Wiki.findOne({
                where: {
                  title: sampleTestData.altTitle
                }
              })
              .then((wiki) => {
                expect(wiki).toBeNull();
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
          }
        );
      });
    });

    describe("GET /wikis/:id", () => {

      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain(sampleTestData.title);
          done();
        });
      });

    });

    describe("POST /wikis/:id/destroy", () => {
      it("should not be able to delete a wiki", (done) => {

        Wiki.findAll()
          .then((wikis) => {
            const wikiCountBeforeDelete = wikis.length;

            expect(wikiCountBeforeDelete).toBe(1);
            request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
              Wiki.findAll()
                .then((wikis) => {
                  expect(err).toBeNull();
                  expect(wikis.length).toBe(wikiCountBeforeDelete);
                  done();
                })
            });
          });

      });

    });

    describe("GET /wikis/:id/edit", () => {

      it("should not render a view with an edit wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("Edit Wiki");
          done();
        });
      });
    });

    describe("POST /wikis/:id/update", () => {
      it("should not update a wiki with the given values", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: sampleTestData.altTitle
          }
        };
        request.post(options,
          (err, res, body) => {

            expect(err).toBeNull();
            Wiki.findOne({
                where: {
                  id: this.wiki.id
                }
              })
              .then((wiki) => {
                expect(wiki.title).toBe(sampleTestData.title);
                done();
              });
          });
      });
    });
  });
});