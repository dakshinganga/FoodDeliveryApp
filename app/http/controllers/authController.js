const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Joi = require("joi");

function authController() {
  const _getRedirectUrl = (req) => {
    return req.user.role === "admin" ? "/admin/orders" : "/customer/orders";
  };

  return {
    login(req, res) {
      res.render("auth/login");
    },

    postLogin(req, res, next) {
      const { email, password } = req.body;

      //Validate request
      if (!email || !password) {
        req.flash("error", "All fields are  required");
        return res.redirect("/login");
      }

      passport.authenticate("local", (err, user, info) => {
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }
        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }

        req.logIn(user, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }

          return res.redirect(_getRedirectUrl(req));
        });
      })(req, res, next);
    },

    register(req, res) {
      res.render("auth/register");
    },

    async postRegister(req, res) {

      const { name, email, password } = req.body;
      console.log(req.body);
      // Validate request
      if (!name || !email || !password) {
        req.flash("error", "All fields are required");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      const registerSchema = Joi.object({
        name: Joi.string().min(3).max(30).required().error(new Error('Name Must be atleast 3 length !!!')),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}')).required().error(new Error('Minimum five characters, at least one uppercase letter or one lowercase letter, one number!!!')),
        confirmPassword: Joi.ref('password')
      });

      const { error } = registerSchema.validate(req.body)
      //console.log(error)
      if(error)
      {
        req.flash("error", error.message); 
        return res.redirect("/register");
      }


      // Check if email exists
      User.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash("error", "Email already taken");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }
      });

      const hashedPassword = await bcrypt.hash(password, 10);
            // Create a user
            const user = new User({
              name,
              email,
              password: hashedPassword,
            });
            user.save().then(user => {
                // Login
                return res.redirect('/login')

            }).catch(err => {
                //console.log(err)
                req.flash('error', 'Something went wrong')
                return res.redirect('/register')
            })
    },
    logout(req, res) {
      req.logout();
      return res.redirect("/login");
    },
  };
}

module.exports = authController;
