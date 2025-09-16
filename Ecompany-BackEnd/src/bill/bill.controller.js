"use strict";

const Bill = require("./bill.model");
const Cart = require("../cart/cart.model");
const Product = require("../product/product.model");
const User = require("../user/user.model");
const Category = require("../category/category.model");
const { validateData } = require("../utils/validate");
const mm = require("moment");

exports.test = (req, res) => {
  return res.send({ message: "Test Bill Running" });
};

// Comprar
exports.createBill = async (req, res) => {
  try {
    let data = req.body;
    let userId = req.user.sub;
    let cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );
    let user = await User.findOne(
      { _id: userId },
      { password: 0, rol: 0, __v: 0, photo: 0 }
    );
    if (!cart || Object.entries(cart.products).length == 0)
      return res.status(404).send({ message: `You don't have a cart` });
    let products = await Product.find();
    // Validar el stock
    let invalidStock = {};
    cart.products.forEach((item) => {
      let pro = products.find((element) => element._id.equals(item.product._id));
      if(item.quantity >pro.stock) invalidStock = pro
    });
    if (Object.entries(invalidStock).length != 0)
      return res
        .status(400)
        .send({ message: `Invalid Stock in: ${invalidStock.name}` });
    // Validar datos
    let card = {
      numberCard: data.numberCard,
      keyCard: data.keyCard,
      dateCard: data.dateCard,
    };
    let dateNow = mm().locale("es").format("LL");
    let params = {
      card: card,
      address: data.address,
      state: "PENDIENTE",
      user: user,
      date: dateNow,
      total: cart.total,
    };
    let msg = validateData({ ...card, address: params.address });
    if (msg) return res.status(400).send({ msg });
    if (card.numberCard.length != 16)
      return res.status(400).send({ message: "Invalid NumberCard" });
    if (card.keyCard.length != 3)
      return res.status(400).send({ message: "Invalid KeyCard" });
    card.dateCard = mm(data.dateCard, "YYYY/MM/DD").locale("es").format("LL");
    if (
      mm(dateNow, "D [de] MMMM [de] YYYY", "es") >
      mm(card.dateCard, "D [de] MMMM [de] YYYY", "es")
    )
      return res.status(400).send({ message: "Invalid DateCard" });
    // Asignar datos a la factura
    params.products = await Promise.all(
      cart.products.map(async (item) => {
        let element = item.product;
        let cate = await Category.findOne({ _id: element.category });
        return {
          product: {
            _id: element._id,
            name: element.name,
            description: element.description,
            price: element.price,
            image: element.image,
            quantity: item.quantity,
            subTotal: item.subTotal,
            category: {
              name: cate.name,
              description: cate.description,
            },
          },
        };
      })
    );
    // Agregar a la base de datos
    let newBill = new Bill(params);
    await newBill.save();
    // Restar el stock y sumar ventas
    products.forEach(async (item, key) => {
      cart.products.forEach(async (element) => {
        if (!item._id.equals(element.product._id)) return;
        let newStock = products[key].stock - parseInt(element.quantity);
        let newSales = products[key].sales + parseInt(element.quantity);
        await products[key].updateOne({ stock: newStock, sales: newSales });
      });
    });
    // Vaciar el carrito
    await Cart.findOneAndDelete({ user: userId });
    return res.send({ message: "Successful purchase! Wait for your order" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error creating bill" });
  }
};

// Ver todas las facturas
exports.getBills = async (req, res) => {
  try {
    let user = req.user;
    let bills;
    if (user.rol == "USER") {
      bills = await Bill.find(
        { "user._id": user.sub },
        { card: 0, "products.product.price": 0, "products.product.category": 0 }
      );
    } else {
      console.log('no');
      bills = await Bill.find(
        {},
        { card: 0, "products.product.price": 0, "products.product.category": 0 }
      );
    }
    if (Object.entries(bills).length == 0)
      return res.status(404).send({ message: "There are not bills" });
    return res.send({ bills });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting bills" });
  }
};

// Ver las facturas por id de factura
exports.getBillById = async (req, res) => {
  try {
    let billId = req.params.id;
    let bill = await Bill.findOne({ _id: billId });
    if (!bill)
      return res.status(404).send({ message: "There is not bill" });
    return res.send({ bill });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting bill" });
  }
};

// Buscar factura por filtros
exports.searchBillByFilter = async (req, res) => {
  try {
    let data = req.body;
    let params = {};
    if (data.name) params["user.name"] = new RegExp(data.name, "i");
    if (data.surname) params["user.surname"] = new RegExp(data.surname, "i");
    if (data.email) params["user.email"] = new RegExp(data.email, "i");
    if (data.address) params.address = new RegExp(data.address, "i");
    if (data.date) params.date = new RegExp(data.date, "i");
    if (data.product && data.description) {
      params.products = {
        $elemMatch: {
          "product.name": {
            $regex: data.product,
            $options: "i",
          },

          "product.description": {
            $regex: data.description,
            $options: "i",
          },
        },
      };
    } else if (data.product) {
      params.products = {
        $elemMatch: { "product.name": { $regex: data.product, $options: "i" } },
      };
    } else if (data.description)
      params.products = {
        $elemMatch: {
          "product.description": { $regex: data.description, $options: "i" },
        },
      };
    let bills = await Bill.find(params, {
      card: 0,
      "products.product.price": 0,
      "products.product.category": 0,
    });

    if (Object.entries(bills).length == 0)
      return res.status(404).send({ message: "There is not bill" });
    return res.send({ bills });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting bills" });
  }
};

// Eliminar factura
exports.deleteBill = async (req, res) => {
  try {
    let billId = req.params.id;
    let bill = await Bill.findOne({_id: billId, state: 'PENDIENTE'});
    if(!bill) return res.status(404).send({message: 'Bill not found'});
    let products = await Product.find({});
    // validar la fecha
    let dateNow = mm().locale('es').format('LL');
    if(req.user.rol == 'USER'){
      if(mm(bill.date, 'D [de] MMMM [de] YYYY', 'es') < mm(dateNow, 'D [de] MMMM [de] YYYY', 'es'))
        return res.status(400).send({message: `I'm sorry. The product was shipped`});
    }
    // Sumar stocks a los productos y restarles ventas
    products.forEach(async (item, key) => {
        bill.products.forEach(async (element) => {
          if (!item._id.equals(element.product._id)) return;
          let newStock = products[key].stock + parseInt(element.product.quantity);
          let newSales = products[key].sales - parseInt(element.product.quantity);
          await products[key].updateOne({ stock: newStock, sales: newSales });
        });
      });
    
    // Eliminar factura
    await Bill.findOneAndDelete({_id: billId, state: 'PENDIENTE'});
    return res.send({message: 'Bill was deleted successfully'})
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error removing bill" });
  }
};

// Eliminar productos de la factura
exports.deleteProductsInBill = async (req, res) => {
  try {
    let billId = req.params.bill;
    let productId = req.params.product;
    let bill = await Bill.findOne({_id: billId, state: 'PENDIENTE', products: {$elemMatch: {_id: productId}}})
    if(!bill)return res.status(404).send({message: 'Bill not found'});
    // Sumar stock a ese producto y restarle ventas
    let product = bill.products.find(item => item._id == productId)
    let productUpdated = await Product.findOne({_id: product.product._id})
    let newStock = productUpdated.stock + parseInt(product.product.quantity);
    let newSales = productUpdated.sales - parseInt(product.product.quantity);
    await productUpdated.updateOne({stock: newStock, sales: newSales});
    // cambiar el total
    let total = bill.total - parseInt(product.product.subTotal)
    await bill.updateOne({total: total});
    // Eliminar el producto de la factura
    bill.products.pull(product);
    await bill.save();
    if(Object.entries(bill.products).length == 0) await Bill.findOneAndDelete({_id: billId});
    return res.send({message: 'Product was deleted successfully'})
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error removing product in bill" });
  }
};

// Editar factura
exports.updateBill = async (req, res) => {
  try {
    let billId = req.params.bill;
    let productId = req.params.product;
    let data = req.body;
    let bill = await Bill.findOne({_id: billId, state: 'PENDIENTE', products: {$elemMatch: {_id: productId}}})
    if(!bill)return res.status(404).send({message: 'Bill not found'});
    let msg = validateData({quantity: data.quantity});
    if(msg) return res.status(400).send({msg});
    if(data.quantity < 1) return res.status(400).send({message: 'Invalid Quantity'});
    // Traer el producto 
    let product = bill.products.find(item => item._id == productId)
    if(product.product.quantity == data.quantity) return res.send({message: 'The bill was not updated'});
    if(product.product.quantity < data.quantity) return res.send({message: `You can't add products`});
    let productUpdated = await Product.findOne({_id: product.product._id})
    // Cambiar el subtotal y total
    let newSubTotal = product.product.subTotal - parseInt(product.product.quantity - data.quantity) * productUpdated.price;
    let total = bill.total - parseInt(product.product.subTotal - newSubTotal)
    // Sumar stock a ese producto y restar ventas
    let newStock = productUpdated.stock + parseInt(product.product.quantity) - data.quantity;
    let newSales = productUpdated.sales - parseInt(product.product.quantity) + parseInt(data.quantity);
    await productUpdated.updateOne({stock: newStock, sales: newSales});
    // Actualizar
    await bill.updateOne({
      "products.$[index].product.quantity": data.quantity,
      "products.$[index].product.subTotal": newSubTotal,
      total: total
    }, 
    {
      multi: false, arrayFilters: [{'index._id': productId}]
    })
    return res.send({message: 'Bill was updates successfully'})
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error updating bill" });
  }
};

// Aceptar factura
exports.acceptedBill = async (req, res) => {
  try {
    let billId = req.params.id;
    let bill = await Bill.findOneAndUpdate(
      { _id: billId, state: "PENDIENTE" },
      { state: "ENTREGADO" },
      { new: true }
    );
    if (!bill) return res.status(404).send({ message: "Bill not found" });
    return res.send({ message: "Bill was delivered successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error accepting bill" });
  }
};

// Ver entregados
exports.getDelivered = async (req, res) => {
  try {
    let user = req.user;
    let bills;
    if (user.rol == "USER") {
      bills = await Bill.find(
        { "user._id": user.sub, state: "ENTREGADO" },
        { card: 0, "products.product.price": 0, "products.product.category": 0 }
      );
    } else {
      bills = await Bill.find(
        { state: "ENTREGADO" },
        { card: 0, "products.product.price": 0, "products.product.category": 0 }
      );
    }
    if (Object.entries(bills).length == 0)
      return res.status(404).send({ message: "There are not bills" });
    return res.send({ bills });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting delivered bill" });
  }
};

// Ver restantes
exports.getPending = async (req, res) => {
  try {
    let user = req.user;
    let bills;
    if (user.rol == "USER") {
      bills = await Bill.find(
        { "user._id": user.sub, state: "PENDIENTE" },
        { card: 0, "products.product.price": 0, "products.product.category": 0 }
      );
    } else {
      bills = await Bill.find(
        { state: "PENDIENTE" },
        { card: 0, "products.product.price": 0, "products.product.category": 0 }
      );
    }
    if (Object.entries(bills).length == 0)
      return res.status(404).send({ message: "There are not bills" });
    return res.send({ bills });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting delivered bill" });
  }
};
