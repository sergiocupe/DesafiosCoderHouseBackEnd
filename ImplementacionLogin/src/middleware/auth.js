export const checkAuth=(req,res,next) => {
  if (!req.session?.user)
    return res.redirect("/login")
  else
    next()
}


export const checkExistingUser=(req,res,next) => {
  if (req.session?.user)
    return res.redirect("/products")
  else
    next()
}