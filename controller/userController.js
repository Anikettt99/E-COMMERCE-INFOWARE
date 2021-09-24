const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.add_account = async (req, res) => {
  const existing_user = await User.findOne({ email: req.body.email });

  if (existing_user) {
    return res.send({ message: "User with this email already exists" });
  }

  if (req.body.password != req.body.confirm_password) {
    return res.send({ message: "Password didnt matched" });
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 12);

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  user = await user.save();

  if (!user) {
    return res.status(404).send("user cannot be created");
  }

  res.send(user);
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send({ message: "No user found" });
  }

  const secret = process.env.SECRET_JWT;

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      {
        userId: user._id,
        isOwner: false,
      },
      secret,
      {
        expiresIn: "1w",
      }
    );

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send({ message: "Wrong password" });
  }
};

exports.get_user = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(400).send({ message: "No User found" });
  }
  if (user._id != req.userId) {
    return res.send({ message: "You are not authenticated to see this user" });
  }

  res.send(user);
};
