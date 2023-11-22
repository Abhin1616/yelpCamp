const User = require("../models/user")

module.exports.registerShowPage = (req, res) => {
    res.render("users/register.ejs")
}
module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const regUser = await User.register(user, password);

        req.login(regUser, (err) => {

            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to YelpCamp")
            res.redirect("/campgrounds")
        })

    } catch (e) {
        if (e.message.includes('duplicate') && e.message.includes('index: email_1 dup key')) {
            req.flash("error", "A user with the given email is already registered")
        } else {
            req.flash("error", e.message)
        }

        res.redirect("/register")
    }


}
module.exports.loginShowPage = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.loginUser = (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(`${redirectUrl}`)
}
module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out Successfully!');
        res.redirect('/campgrounds');
    });
}