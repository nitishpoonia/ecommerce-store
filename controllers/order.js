const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No order found in DB",
        });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save your Order in DB",
      });
    }
    res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No orders found in DB",
        });
      }
      res.json(order);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  const orderId = req.body.orderId;
  const newStatus = req.body.newStatus;

  Order.updateOne({ _id: ObjectId(orderId) }, { $set: { status: newStatus } })
    .then((result) => {
      // Update successful
      res.status(200).json({ message: "Order status updated" });
    })
    .catch((error) => {
      // Handle error
      res
        .status(500)
        .json({ error: "An error occurred while updating order status" });
    });
};

// exports.updateStatus = (req, res) => {
//   Order.update(
//     { _id: req.body.orderId },
//     { $set: { status: req.body.status } },
//     (err, order) => {
//       if (err) {
//         return res.status(400).json({
//           error: "Cannot update order status",
//         });
//       }
//       res.json(order);
//     }
//   );
// };
