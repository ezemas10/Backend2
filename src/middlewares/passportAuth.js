import passport from "passport";

export const passportCall = (strategy) => {
    return async(req, res, next) => {
        passport.authenticate(strategy, {session: false}, (error, user, info) => {
            if (error) {
                return res.redirect('/login?error=8')
            }
            if (!user) {
                return res.redirect(`/login?error=${info}`)
            }
            req.user = user
            next()
        })(req, res, next)
    }
}