const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

const sampleTestData = {
    title: "My thoughts on wikis",
    altTitle: "My musings on wikis",
    body: "A compilation of reports from my time thinking about wikis.",
    altBody: "A compilation of thoughts from discussions on wikis.",
    private: false
};

describe("routes : wikis", () => {
    beforeEach((done) => {
        this.wiki;
        this.user;

        sequelize.sync({
            force: true
        }).then((res) => {
            User.create({
                    email: "starman@tesla.com",
                    password: "Trekkie4lyfe"
                })
                .then((user) => {
                    this.user = user; //store the user
                    Wiki.create({
                            title: sampleTestData.title,
                            body: sampleTestData.body,
                            private: sampleTestData.private, 
                            userId: this.user.id
                        })
                        .then((wiki) => {
                            this.wiki = wiki; //store the topic
                            done();
                        })
                })
        });
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
          Wiki.findOne({where: {title: sampleTestData.title}})
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

        expect(wikiCountBeforeDelete).toBe(1);
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

    it("should update the wiki with the given values", (done) => {
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
            where: { id: this.wiki.id }
          })
          .then((wiki) => {
            expect(wiki.title).toBe(sampleTestData.altTitle);
            done();
          });
        });
    });

  });

});

