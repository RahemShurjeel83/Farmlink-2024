const AsyncHandler = require("express-async-handler");
const OrderModel = require("../../Models/AdminModel/OrderModel");
const UserModel = require("../../Models/userModel");
const ProductModel = require("../../Models/AdminModel/ProductModel");
const mongoose = require("mongoose");
const { ROLES } = require("../../utils/roles");

const postorder = AsyncHandler(async (req, res) => {
  const { firstname, lastname, email, number, city, country, address, productId, description, quantity } = req.body;

  if (!firstname || !lastname || !email || !number || !city || !address || !productId) {
    return res.status(400).json({ success: false, message: "All required fields must be provided." });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID." });
  }

  const qty = parseInt(quantity, 10);
  if (!qty || qty < 1) {
    return res.status(400).json({ success: false, message: "Quantity must be at least 1." });
  }

  // Look up the exact vendor listing the buyer chose so the order is routed to the
  // correct seller and priced from trusted server-side data, not client input —
  // product names are not unique across vendors in this marketplace.
  const product = await ProductModel.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product no longer exists." });
  }

  if (qty > product.quantity) {
    return res.status(400).json({ success: false, message: `Only ${product.quantity} unit(s) of this listing are available.` });
  }

  const order = await OrderModel.create({
    firstname, lastname, email, number, city, country, address,
    product: product._id,
    productname: product.productName,
    description,
    quantity: qty,
    price: product.newPrice * qty,
    vendor: product.vendor,
  });

  res.status(201).json({ success: true, message: "Order placed successfully.", data: order });
});

const getorder = AsyncHandler(async (req, res) => {
  const { userId, role } = req;

  // Admins oversee the whole marketplace; vendors only see orders for their own products.
  const filter = role === ROLES.admin ? {} : { vendor: new mongoose.Types.ObjectId(userId) };
  const orders = await OrderModel.find(filter).sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: orders });
});

const deleteorder = AsyncHandler(async (req, res) => {
  const orderId = req.params.orderId;
  const { userId, role } = req;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid order ID." });
  }

  const order = await OrderModel.findById(orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found." });
  }

  // Only the vendor who owns the order (or an admin) may remove it — otherwise any
  // logged-in buyer could wipe out other vendors' order history.
  if (role !== ROLES.admin && order.vendor.toString() !== userId) {
    return res.status(403).json({ success: false, message: "Access denied. You do not own this order." });
  }

  await order.deleteOne();

  res.status(200).json({ success: true, message: "Order deleted successfully." });
});

const addtocartByUser = AsyncHandler(async (req, res) => {
  const productid = req.params.productid;
  const { userId } = req;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productid)) {
    return res.status(400).json({ success: false, message: "Invalid product ID." });
  }

  const qty = parseInt(quantity, 10);
  if (!qty || qty < 1) {
    return res.status(400).json({ success: false, message: "Quantity must be at least 1." });
  }

  const product = await ProductModel.findById(productid).lean();
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found." });
  }

  const cartItem = {
    _id: product._id,
    productName: product.productName,
    newPrice: product.newPrice,
    oldPrice: product.oldPrice,
    description: product.description,
    productImage: product.productImage,
    categoryName: product.categoryName,
    quantity: qty,
  };

  await UserModel.findByIdAndUpdate(
    userId,
    { $addToSet: { cart: product._id, cartItems: cartItem } }
  );

  res.json({ success: true, message: "Added to cart." });
});

const getCartItems = AsyncHandler(async (req, res) => {
  const userid = req.params.userid || req.userId;

  const user = await UserModel.findById(userid).select("cartItems");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  res.json({ success: true, data: user });
});

const removeFromCart = AsyncHandler(async (req, res) => {
  const userid = req.params.userid || req.userId;
  const productId = req.params.productid;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID." });
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userid,
    {
      $pull: {
        cart: new mongoose.Types.ObjectId(productId),
        cartItems: { _id: new mongoose.Types.ObjectId(productId) },
      },
    },
    { new: true }
  ).select("cartItems");

  res.json({ success: true, data: updatedUser });
});

const filterbycategory = AsyncHandler(async (req, res) => {
  const filter = req.params.filter;

  const data = await ProductModel.find({ categoryName: filter });
  res.json({ success: true, data });
});

module.exports = {
  postorder,
  getorder,
  deleteorder,
  getCartItems,
  removeFromCart,
  filterbycategory,
  addtocartByUser,
};
