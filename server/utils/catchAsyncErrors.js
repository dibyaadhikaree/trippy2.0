module.exports = (fn) => {
  //recieves controller function :
  // fn(req , res , next) => {....}

  // controller fucntion needs (req ,res , next) => code
  // so code will be

  return (req, res, next) => fn(req, res, next).catch(next);
};
