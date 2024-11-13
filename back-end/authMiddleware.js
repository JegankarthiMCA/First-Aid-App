
import jwt from 'jsonwebtoken'
export default function (req, res, next) {
  const token = req.header('Authorization');
  
  if (!token) return res.status(401).send('Access Denied');

  try {
    const jwtToken = token.substring(
      7,
      token.length
  );
  console.log(jwtToken)
  const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = payload;
    console.log(req.user)
    next();
  } catch (error) {
    console.log(error)
    res.status(400).send('Invalid Token');
  }
};
