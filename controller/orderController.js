const Order = require("../models/order");

const OrderItem = require("../models/orderItem");

const User = require("../models/user");

exports.order_item = async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();
      return newOrderItem.id;
    })
  );

  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );

      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    user: req.userId,
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    totalPrice: totalPrice,
    dateOrdered: Date.now(),
  });

  order = await order.save();

  if (!order) {
    return res.status(404).send({ message: "Can't place a Order" });
  }

  let user = await User.findByIdAndUpdate(req.userId, {
    $push: {
      orders: order._id,
    },
  });

  res.send(order);
};

exports.get_all_orders = async (req, res) => {
  if (!req.isOwner) {
    return res
      .status(404)
      .send({ message: "You are not authenticated to see this" });
  }

  let orders = await Order.find().sort({ dateOrdered: -1 }).populate("user");

  let all_order_placed = await Promise.all(
    orders.map((order) => {
      let order_placed = {
        Name: order.user.name,
        Email: order.user.email,
        "Total Price": order.totalPrice,
        Date: new Date(order.dateOrdered).toGMTString(),
      };
      return order_placed;
    })
  );

  if (!orders) {
    return res.status(400).send({ message: "No orders found" });
  }
  res.send(all_order_placed);
};

exports.get_orders = async (req, res) => {
  let user = await User.findById(req.userId);

  let orders = await Promise.all(
    user.orders.map(async (order) => {
      let order_placed = await Order.findById(order).populate({
        path: "orderItems",
        populate: {
          path: "product",
        },
      });

      let product_details_array = order_placed.orderItems.map((Oitem) => {
        let product_detail = {
          "Product Name": Oitem.product.name,
          Price: Oitem.product.price,
          Quantity: Oitem.quantity,
        };
        return product_detail;
      });

      let all_order_placed = {
        Products: product_details_array,
        Date: new Date(order_placed.dateOrdered).toGMTString(),
      };

      return all_order_placed;
    })
  );

  if (!orders) {
    return res.status(400).send({ message: "No order is placed" });
  }

  res.send(orders);
};
