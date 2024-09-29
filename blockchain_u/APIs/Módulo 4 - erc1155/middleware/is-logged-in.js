// Middleware: used to protect some pages checking if the user is logged in. If not, redirects to login page.

module.exports = async (req, res, next) => {
  if (!req.session.username) {
    req.flash("error", "Necessário login");
    res.redirect("/register");
  } else next();
};
