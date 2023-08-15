function isAuthenticatedSpecial(req, res, next) {
    if (req.session.authenticated) {
        res.redirect("/");
    } else {
        next();
    }
}

function isAuthenticatedSettings(req, res, next) {
    if (!req.session.authenticated) {
        res.redirect("/login");
    } else {
        next()
    }
}

function isAuthenticatedInList(req, res, next) {
    if (!req.session.authenticated)  {
        res.send(false);
    } else {
        next();
    }
}

function isAuthenticated(req, res, next) {
    if (!req.session.authenticated) {
        res.redirect("/");
    } else {
        next();
    }
}

module.exports = {
    isAuthenticated,
    isAuthenticatedInList,
    isAuthenticatedSettings,
    isAuthenticatedSpecial
};