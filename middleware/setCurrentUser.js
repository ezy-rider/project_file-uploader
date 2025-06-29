export function setCurrentUser(req, res, next) {
  res.locals.currentUser = req.user;
  next();
}
