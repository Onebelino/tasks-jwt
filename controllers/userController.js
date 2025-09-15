const User = require("../models/User");
const bcrypt = require("bcrypt");
const {generateToken} = require('../middlewares/authMiddleware')

const renderRegisterPage = (req, res) => {
  res.render('register');
};

const renderLoginPage = (req, res) => {
  res.render('login');
};  

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } })
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
      const passwordIsValid = bcrypt.compareSync(
        password, user.password
      );
      if (!passwordIsValid) {
        return res.status(401)
        .send({ error: 'Invalid password' });
      }
      const token = generateToken(user);

      // NOVA LÓGICA
          res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        path: '/', // <-- ESSA LINHA É A SOLUÇÃO. VERIFIQUE SE ELA ESTÁ AÍ.
      });
            res.redirect('/tasks'); 
    
  } catch (error) {
    res.status(500).send({
      error: 'Error logging in',
      details: error,
    });
  }
};

const register = async(req, res) => {
  try {
    const { name, username, password } = req.body;
    const newPassword = bcrypt.hashSync(password, 10);

    const user = await User.create(
      {
        name,
        username,
        password: newPassword
      }
    );

    res.redirect('/api/user/login'); 


    } catch (error) {
  console.log("ERRO AO REGISTRAR:", error); 
  res.status(500).send({
    error: 'Error registering user',
    details: error,
  });
    }
  };

module.exports = {
  renderRegisterPage,
  renderLoginPage,
  login,
  register,
};