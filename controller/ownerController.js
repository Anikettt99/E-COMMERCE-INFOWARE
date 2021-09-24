const Owner = require("../models/owner");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.add_account = async (req, res) => {
  const existing_owner = await Owner.findOne({ email: req.body.email });

  if (existing_owner) {
    return res.send({ message: "Owner with this email already exists" });
  }

  if (req.body.password != req.body.confirm_password) {
    return res.send({ message: "Password didnt matched" });
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 12);

  let owner = new Owner({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  owner = await owner.save();

  if (!owner) {
    return res.status(404).send("Owner cannot be created");
  }

  res.send(owner);
};

exports.login = async (req, res) => {
  const owner = await Owner.findOne({ email: req.body.email });

  if (!owner) {
    return res.status(400).send({ message: "No owner found" });
  }

  const secret = process.env.SECRET_JWT;

  if (owner && bcrypt.compareSync(req.body.password, owner.password)) {
    const token = jwt.sign(
      {
        userId: owner._id,
        isOwner: true,
      },
      secret,
      {
        expiresIn: "1w",
      }
    );

    res.status(200).send({ user: owner.email, token: token });
  } else {
    res.status(400).send({ message: "Wrong password" });
  }
};
