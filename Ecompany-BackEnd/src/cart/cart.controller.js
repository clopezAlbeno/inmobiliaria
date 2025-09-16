"use strict";

const Cart = require("./cart.model");
const Product = require("../product/product.model");
const User = require("../user/user.model");
const { validateData } = require("../utils/validate");

exports.test = (req, res) => {
  return res.send({ message: "Test cart running" });
};

exports.addProductCart = async (req, res) => {
  try {
    let data = req.body;
    data.user = req.user.sub;
    let params = {
      product: data.product,
      quantity: data.quantity,
    };
    // Validar que vengan datos
    let msg = validateData(params);
    if (msg) return res.status(400).send({ msg });
    // validar si el producto exists
    let product = await Product.findOne({ _id: params.product });
    if (!product) return res.status(404).send({ message: "Product not found" });
    if(product.name == 'Deleted' && product.description == 'Product')
      return res.status(400).send({ message: "Deleted product is not allowed" });
    // Validar que venga cantidad adecuada
    if (params.quantity < 1)
      return res.status(400).send({ message: "Invalid Quantity" });
    // Validar si ya tiene productos
    let cart = await Cart.findOne({ user: data.user });
    // Si no tiene productos
    if (!cart) {
      // Validar stocks
      if (params.quantity > product.stock)
        return res.status(400).send({ message: "Unavailable Stocks" });
      // Setear el subtotal y total
      params.subTotal = product.price * params.quantity;
      // Guardar
      let newCart = new Cart({
        user: data.user,
        products: params,
        total: params.subTotal,
      });
      await newCart.save();
    } else {
      let productExists = cart.products.find(
        (item) => item.product == params.product
      );
      if (!productExists) {
        // Validar stocks
        if (params.quantity > product.stock)
          return res.status(400).send({ message: "Unavailable Stocks" });
        // Setear el subtotal y total
        params.subTotal = product.price * params.quantity;
        let total = params.subTotal + cart.total;
        await cart.updateOne({
          products: [...cart.products, params],
          total: total,
        });
      } else {
        // Si ya tiene ese producto
        // Setear subtotal
        let newSubTotal = product.price * params.quantity;
        params.subTotal = newSubTotal + productExists.subTotal;
        // validar stocks
        params.quantity = productExists.quantity + parseInt(params.quantity);
        if (params.quantity > product.stock)
          return res.status(400).send({ message: "Unavailable Stocks" });
        // Setear total
        let total = cart.total + newSubTotal;
        // Setear los productos
        await cart.updateOne(
          { total: total, "products.$[index]": params },
          { multi: false, arrayFilters: [{ "index._id": productExists._id }] }
        );
      }
    }
    return res.send({ message: "Product add to cart successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Error adding product in the cart",
      error: err.message,
    });
  }
};

exports.getCarts = async (req, res) => {
  try {
    let carts = await Cart.find({})
      .populate("user", { password: 0, __v: 0 })
      .populate("products.product");
    if (Object.entries(carts).length == 0)
      return res.status(404).send({ message: "There are not carts" });
    return res.send({ carts });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting carts" });
  }
};

exports.getCartByUser = async (req, res) => {
  try {
    let userId = req.params.id;
    let cart = await Cart.find({ user: userId })
      .populate("user", { password: 0, __v: 0 })
      .populate("products.product");
    if (Object.entries(cart).length == 0)
      return res.status(404).send({ message: "There is not cart" });
    return res.send({ cart });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting cart" });
  }
};

// Eliminar todo el carrito
exports.deleteCart = async (req, res) => {
  try {
    let userId = req.params.id;
    if (userId != req.user.sub)
      return res.status(400).send({ message: "This is not your cart" });
    let cartDeleted = await Cart.findOneAndDelete({ user: userId });
    if (!cartDeleted)
      return res
        .status(404)
        .send({ message: `You don't have products in the cart` });
    return res.send({ message: "Cart was deleted successfully", cartDeleted });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error removing cart" });
  }
};

// Eliminar productos
exports.deleteProductInCart = async (req, res) => {
  try {
    let cartId = req.params.id;
    let userId = req.user.sub;
    let cart = await Cart.findOne({
      user: userId,
      products: { $elemMatch: { _id: cartId } },
    });
    if (!cart) return res.status(404).send({ message: `Product not found` });
    let product = cart.products.find((item) => item._id == cartId);
    // setear el total
    let total = cart.total - parseInt(product.subTotal);
    await cart.updateOne({ total: total });
    // Eliminar el producto
    cart.products.pull(product);
    await cart.save();
    if (Object.entries(cart.products).length == 0)
      await Cart.findOneAndDelete({ user: userId });
    return res.send({ message: "Cart was deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error removing cart" });
  }
};

// Editar el carrito
exports.updateCart = async (req, res) => {
  try {
    let cartId = req.params.id;
    let userId = req.user.sub;
    let data = req.body;
    let msg = validateData({ quantity: data.quantity });
    if (msg) return res.status(400).send({ msg });
    let cart = await Cart.findOne({
      user: userId,
      products: { $elemMatch: { _id: cartId } },
    });
    if (!cart) return res.status(404).send({ message: "Product not found" });
    if (data.quantity < 1)
      return res.status(400).send({ message: "Invalid Quantity" });
    let productCart = cart.products.find((item) => item._id == cartId);
    let product = await Product.findOne({ _id: productCart.product });
    // validar el stock
    if (product.stock < data.quantity)
      return res.status(400).send({ message: "Unavailable stocks" });
    // setear el subtotal
    let newSubTotal = parseInt(data.quantity) * product.price;
    // setear el total
    let total = cart.total - parseInt(productCart.subTotal);
    total = total + parseInt(newSubTotal);
    // Actualizar
    await cart.updateOne(
      {
        total: total,
        "products.$[index].quantity": data.quantity,
        "products.$[index].subTotal": newSubTotal,
      },
      {
        multi: false,
        arrayFilters: [{ "index._id": cartId }],
      }
    );
    return res.send({message: 'Cart was updated successfully'});
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error udpating cart" });
  }
};
