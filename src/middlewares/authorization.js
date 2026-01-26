export const authorization = (roles) => {
    
  const allowed = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ status: "error", message: "Unauthorized" });
    }

    const role = req.user.role;

    if (!allowed.includes(role)) {
      return res.status(403).send({ status: "error", message: "Forbidden" });
    }

    return next();
  };
};


