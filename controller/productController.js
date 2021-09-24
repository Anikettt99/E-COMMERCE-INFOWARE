const Product = require("../models/product");

exports.add_product = async (req, res) => {
  if (!req.isOwner) {
    return res
      .status(400)
      .send({ message: "You are not authnticated to add a product" });
  }

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
  });

  product = await product.save();

  if (!product) {
    return res.status(404).send({ message: "Product can't be added" });
  }

  res.send(product);
};

exports.update_product = async (req, res) => {
  if (!req.isOwner) {
    return res
      .status(400)
      .send({ message: "You are not authenticated to update a product" });
  }

  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(400).send({ message: "No product found" });
  }

  let image_url = product.image;

  const updated_product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name ? req.body.name : product.name,
      description: req.body.description
        ? req.body.description
        : product.description,
      price: req.body.price ? req.body.price : product.price,
      quantity: req.body.quantity ? req.body.quantity : product.quantity,
      image: image_url,
    },
    {
      new: true,
    }
  );

  res.send(updated_product);
};

exports.get_products = async (req, res) => {
  let products = await Product.find();

  if (!products) {
    return res.status(400).send({ message: "Can't find any product" });
  }

  res.send(products);
};

exports.get_product = async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(400).send({ message: "Can't find any product" });
  }

  res.send(product);
};
