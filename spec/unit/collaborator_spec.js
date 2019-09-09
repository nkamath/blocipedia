const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;
const Collaborator = require("../../src/db/models").Collaborator;

const sampleTestData = {
    title: "My thoughts on wikis",
    altTitle: "My musings on wikis",
    body: "A compilation of reports from my time thinking about wikis.",
    altBody: "A compilation of thoughts from discussions on wikis."
};

describe("Collaborator", () => {
    beforeEach((done) => {
        this.wiki;
        this.user;
        this.collabUser;

        sequelize.sync({
            force: true
        }).then((res) => {
            User.create({
                    email: "main@example.com",
                    password: "Trekkie4lyfe"
                })
                .then((user) => {
                    this.user = user; //store the user
                    User.create({
                        email: "collab@example.com",
                        password: "Trekkie4lyfe"
                    })
                    .then((user) => {
                        this.collabUser = user;
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
                })
        });
    });

    describe("#create()", () => {

        // #2
        it("should create a collaborator for a wiki on a user", (done) => {

            // #3
            Collaborator.create({
                    wikiId: this.wiki.id,
                    userId: this.user.id
                })
                .then((collaborator) => {

                    // #4
                    expect(collaborator.wikiId).toBe(this.wiki.id);
                    expect(collaborator.userId).toBe(this.user.id);
                    done();

                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });

        // #5
        it("should not create a collaborator without assigned wiki or user", (done) => {
            Collaborator.create({
                    userId: null
                })
                .then((collaborator) => {

                    // the code in this block will not be evaluated since the validation error
                    // will skip it. Instead, we'll catch the error in the catch block below
                    // and set the expectations there

                    done();

                })
                .catch((err) => {

                    expect(err.message).toContain("Collaborator.userId cannot be null");
                    expect(err.message).toContain("Collaborator.wikiId cannot be null");
                    done();

                })
        });

    });
});