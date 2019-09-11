const Authorizer = require("../policies/application");
const markdown = require( "markdown" ).markdown;

const wikiQueries = require("../db/queries.wikis.js");
const userQueries = require("../db/queries.users.js");
const collaboratorQueries = require("../db/queries.collaborators.js");

module.exports = {
    index(req, res, next) {
        wikiQueries.getAllWikis((err, wikis) => {
            if (err) {
                res.redirect(500, "static/index");
            } else {
                collaboratorQueries.getCollaborationsForUser(req.user,(err, collaborations) => {
                    let wikiCollaborations = [];
                    collaborations.forEach(collaboration => {
                        wikiCollaborations.push(collaboration.wikiId);
                    });
                    if (err) {
                        res.redirect(500, "static/index");  
                    } else {
                        res.render("wikis/index", {
                            wikis, wikiCollaborations
                        });
                    }
                });          
            }
        })
    },

    new(req, res, next) {
        const authorized = new Authorizer(req.user).new();
        if (authorized) {
            res.render("wikis/new");
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }

    },

    create(req, res, next) {
        const authorized = new Authorizer(req.user).create();
        if (authorized) {

            let newWiki = {
                title: req.body.title,
                body: req.body.body,
                private: req.body.private,
                userId: req.user.id
            };
            wikiQueries.addWiki(newWiki, (err, wiki) => {
                if (err) {
                    res.redirect(500, "/wikis/new");
                } else {
                    res.redirect(303, `/wikis/${wiki.id}`);
                }
            });
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },

    show(req, res, next) {
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            wiki.body = markdown.toHTML(wiki.body);
            if (err || wiki == null) {
                res.redirect(404, "/");
            } else {
                res.render("wikis/show", {
                    wiki
                });
            }
        });
    },

    destroy(req, res, next) {
        wikiQueries.deleteWiki(req, (err, wiki) => {
            if (err) {
                res.redirect(500, `/wikis/${req.params.id}`)
            } else {
                res.redirect(303, "/wikis")
            }
        });
    },

    edit(req, res, next) {

        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if (err || wiki == null) {
                res.redirect(404, "/");
            } else {
                const authorized = new Authorizer(req.user).create();
                if (authorized) {
                    res.render("wikis/edit", {
                        wiki
                    });
                } else {
                    req.flash("notice", "You are not authorized to do that.");
                    res.redirect("/wikis");
                }
            }
        });
    },

    update(req, res, next) {
        wikiQueries.updateWiki(req, req.body, (err, wiki) => {
            if (err || wiki == null) {
                res.redirect(404, `/wikis/${req.params.id}/edit`);
            } else {
                res.redirect(`/wikis/${req.params.id}`);
            }
        });
    }, 

    share(req, res, next) {
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if (err || wiki == null) {  
                res.redirect(404, "/wikis");
            } else {
                userQueries.getAllUsers((err,users) => {
                    collaboratorQueries.getCollaboratorsForWiki(wiki.id,(err,collaborators) =>{
                        let wikiCollaborators = [];
                        collaborators.forEach(collaborator => {
                            wikiCollaborators.push(collaborator.userId);
                        });
                        res.render(`wikis/share`, {
                            wiki, users, wikiCollaborators
                        });
                    })  
                });  
            }
        });
    },
    updateShare(req, res, next) {
        collaboratorQueries.updateCollaborators(req, (err, wiki) => {
            if (err || wiki == null) {
                res.redirect(404, `/wikis/${req.params.id}/share`);
            } else {
                res.redirect(`/wikis/${req.params.id}`);
            }
        });
    }
}