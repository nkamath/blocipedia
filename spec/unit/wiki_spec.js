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

describe("Wiki", () => {

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
                            this.wiki = wiki; //store the wiki
                            done();
                        })
                })
        });
    });

    describe("#create()", () => {
        it("should create a wiki object with a title, body and private boolean", (done) => {
            Wiki.create({
                    title: sampleTestData.altTitle,
                    body: sampleTestData.altBody
                })
                .then((wiki) => {
                    expect(wiki.title).toBe(sampleTestData.altTitle);
                    expect(wiki.body).toBe(sampleTestData.altBody);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });

        it("should not create a Wiki with missing body", (done) => {
            Wiki.create({
                    title: "random text",
                    private: false
                })
                .then((wiki) => {
                    // Checking nothing because this code path shouldn't get hit. 
                    done();
                })
                .catch((err) => {
                    expect(err.message).toContain("Topic.description cannot be null");
                    done();
                })
        });
    });

    describe("#read()", () => {
        beforeEach((done) => {
            Wiki.create({
                title: sampleTestData.altTitle,
                body: sampleTestData.altBody,
                private: sampleTestData.private,
                user: this.user.id
            }).then((wiki) => {
                done();
            })
        });
        it("should return all Wikis", (done) => {
            Wiki.findAll()
                .then((wikis) => {
                    expect(wikis.length).toBe(2);
                    expect(wikis[0].title).toBe(sampleTestData.title);
                    done();
                });
        });
        it("should return one Wiki given the ID", (done) => {
            Wiki.findByPk(this.wiki.id)
                .then((wiki) => {
                    expect(wiki.title).toBe(sampleTestData.title);
                    done();
                });
        });
    });
});