exports.getSignup = (req, res) => {
  res.status(200).render("pages/signup", {
    title: "Sign Up",
    bodyClass: "login-body",
  });
};

exports.getLogin = (req, res) => {
  res.status(200).render("pages/login", {
    title: "Log In",
    bodyClass: "login-body",
  });
};
