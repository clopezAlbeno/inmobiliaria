"use strict";

const Comment = require("./comment.model");
const User = require("../user/user.model");
const mm = require("moment");

exports.test = async (req, res) => {
  return res.send({ message: "Test comment running" });
};

// Usuario
// Agregar comentario
exports.addComment = async (req, res) => {
  try {
    let data = req.body;
    data.approve = false;
    if (data.date != undefined || data.hour)
      return res.status(400).send({ message: "Date is not allowed" });
    data.hour = mm().format("HH:mm:ss");
    data.date = mm().locale("es").format("MMMM DD, YYYY");
    let limit = await Comment.findOne({
      user: req.user.sub,
      comments: { $elemMatch: { date: data.date } },
    });
    if (limit)
      return res.status(400).send({ message: "Limit full, try tomorrow" });
    let user = await Comment.findOne({ user: req.user.sub });
    if (user) {
      await user.updateOne({ comments: [...user.comments, data] });
    } else {
      let params = {
        user: req.user.sub,
        comments: data,
      };
      let newComment = new Comment(params);
      await newComment.save();
    }
    return res.send({ message: "Comment in verification progress" });
  } catch (err) {
    console.log(err);
    if (err.message.includes("required"))
      return res.status(500).send({ message: "Some params are required" });
    return res.status(500).send({ message: "Error adding comment" });
  }
};

// Ambos
// Ver todos los comentarios aprovados mas recientes
exports.getMoreRecentApprove = async (req, res) => {
  try {
    let comments = await Comment.find({}, { __v: 0 }).populate("user", {
      password: 0,
      phone: 0,
      rol: 0,
      __v: 0,
    });
    if (comments.length === 0)
      return res.status(404).send({ message: "There is not comments" });

    // Crear un array con todos los comentarios
    let allComments = [];
    comments.forEach((item) => {
      item.comments.forEach((comment) => {
        allComments.push({
          user: item.user,
          comment: comment,
        });
      });
    });

    // Ordenar los comentarios por fecha y hora de forma descendente
    allComments.sort((a, b) => {
      const dateA = new Date(a.comment.date + " " + a.comment.hour);
      const dateB = new Date(b.comment.date + " " + b.comment.hour);
      return dateB - dateA;
    });

    // colocar solo los verdaderos
    allComments = allComments.filter((item) => item.comment.approve == true);
    return res.send({ allComments });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting comments" });
  }
};

// Ver todos los comentarios aprovados mas antiguos
exports.getOlderApprove = async (req, res) => {
  try {
    let comments = await Comment.find({}, { __v: 0 }).populate("user", {
      password: 0,
      phone: 0,
      rol: 0,
      __v: 0,
    });
    if (comments.length === 0)
      return res.status(404).send({ message: "There is not comments" });
    // Crear un array con todos los comentarios
    let allComments = [];
    comments.forEach((item) => {
      item.comments.forEach((comment) => {
        allComments.push({
          user: item.user,
          comment: comment,
        });
      });
    });

    // Ordenar los comentarios por fecha y hora de forma ascendente
    allComments.sort((a, b) => {
      const dateA = new Date(a.comment.date + " " + a.comment.hour);
      const dateB = new Date(b.comment.date + " " + b.comment.hour);
      return dateA - dateB;
    });

    // colocar solo los verdaderos
    allComments = allComments.filter((item) => item.comment.approve == true);
    return res.send({ allComments });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting comments" });
  }
};

// Buscar por titulo y descripcion
exports.getByFilter = async (req, res) => {
  try {
    const data = req.body;
    const params = {};

    // Construir los filtros para la búsqueda
    if (data.title) params["comments.title"] = new RegExp(data.title, "i");
    if (data.description)
      params["comments.description"] = new RegExp(data.description, "i");

    // Buscar comentarios que coincidan con ambos filtros
    const comments = await Comment.find(params).populate("user", {
      password: 0,
      phone: 0,
      rol: 0,
      __v: 0,
    });

    if (comments.length === 0) {
      return res
        .status(404)
        .send({ message: "No comments match the search criteria" });
    }

    // Filtrar los comentarios que coinciden con ambos filtros
    const filteredComments = [];
    comments.forEach((item) => {
      item.comments.forEach((comment) => {
        if (
          (!data.title || comment.title.match(params["comments.title"])) &&
          (!data.description ||
            comment.description.match(params["comments.description"]))
        ) {
          filteredComments.push({
            user: item.user,
            comment: comment,
          });
        }
      });
    });
    // Ordenar los comentarios por fecha descendente
    filteredComments.sort((a, b) => {
      const dateA = new Date(`${a.comment.date} ${a.comment.hour}`);
      const dateB = new Date(`${b.comment.date} ${b.comment.hour}`);
      return dateB - dateA;
    });
    return res.send({filteredComments});
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error searching comments" });
  }
};
// Comentarios por usuario
exports.getCommentsByUser = async (req, res) => {
  try {
    let userId = req.params.id;
    let comments = await Comment.findOne({ user: userId }).populate("user", {
      password: 0,
      __v: 0,
      phone: 0,
      rol: 0,
    });
    if (!comments)
      return res.status(404).send({ message: "Comments not found" });
    comments.comments.sort(function (a) {
      if (a && a.approve == true) return 1;
      return -1;
    });
    return res.send({ comments });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting comments" });
  }
};

// Administrador
//Ver todos los comentarios mas recientes
exports.getAllCommentsMoreRecent = async (req, res) => {
  try {
    let comments = await Comment.find({}, { __v: 0 }).populate("user", {
      password: 0,
      phone: 0,
      rol: 0,
      __v: 0,
    });
    if (comments.length === 0)
      return res.status(404).send({ message: "There is not comments" });

    // Crear un array con todos los comentarios
    let allComments = [];
    comments.forEach((item) => {
      item.comments.forEach((comment) => {
        allComments.push({
          user: item.user,
          comment: comment,
        });
      });
    });

    // Ordenar los comentarios por fecha y hora de forma descendente
    allComments.sort((a, b) => {
      const dateA = new Date(a.comment.date + " " + a.comment.hour);
      const dateB = new Date(b.comment.date + " " + b.comment.hour);
      return dateB - dateA;
    });
    return res.send({ allComments });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting comments" });
  }
};
//Ver todos los comentarios mas antiguos
exports.getAllCommentsOlder = async (req, res) => {
  try {
    let comments = await Comment.find({}, { __v: 0 }).populate("user", {
      password: 0,
      phone: 0,
      rol: 0,
      __v: 0,
    });
    if (comments.length === 0)
      return res.status(404).send({ message: "There is not comments" });

    // Crear un array con todos los comentarios
    let allComments = [];
    comments.forEach((item) => {
      item.comments.forEach((comment) => {
        allComments.push({
          user: item.user,
          comment: comment,
        });
      });
    });

    // Ordenar los comentarios por fecha y hora de forma ascendente (más antiguo al más reciente)
    allComments.sort((a, b) => {
      const dateA = new Date(a.comment.date + " " + a.comment.hour);
      const dateB = new Date(b.comment.date + " " + b.comment.hour);
      return dateA - dateB; // Restar las fechas para ordenar de forma ascendente (más antiguo al más reciente)
    });

    return res.send({ allComments });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting comments" });
  }
};

// Ver todos los comentarios no aprovados mas recientes
exports.getMoreRecentNoApprove = async (req, res) => {
  try {
    let comments = await Comment.find({}, { __v: 0 }).populate("user", {
      password: 0,
      phone: 0,
      rol: 0,
      __v: 0,
    });
    if (comments.length === 0)
      return res.status(404).send({ message: "There is not comments" });

    // Crear un array con todos los comentarios
    let allComments = [];
    comments.forEach((item) => {
      item.comments.forEach((comment) => {
        allComments.push({
          user: item.user,
          comment: comment,
        });
      });
    });

    // Ordenar los comentarios por fecha y hora de forma descendente
    allComments.sort((a, b) => {
      const dateA = new Date(a.comment.date + " " + a.comment.hour);
      const dateB = new Date(b.comment.date + " " + b.comment.hour);
      return dateB - dateA;
    });

    // colocar solo los falsos
    allComments = allComments.filter((item) => item.comment.approve == false);
    return res.send({ allComments });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting comments" });
  }
};

// Ver todos los comentarios no aprovados mas antiguos
exports.getOlderNoApprove = async (req, res) => {
  try {
    let comments = await Comment.find({}, { __v: 0 }).populate("user", {
      password: 0,
      phone: 0,
      rol: 0,
      __v: 0,
    });
    if (comments.length === 0)
      return res.status(404).send({ message: "There is not comments" });
    // Crear un array con todos los comentarios
    let allComments = [];
    comments.forEach((item) => {
      item.comments.forEach((comment) => {
        allComments.push({
          user: item.user,
          comment: comment,
        });
      });
    });

    // Ordenar los comentarios por fecha y hora de forma ascendente
    allComments.sort((a, b) => {
      const dateA = new Date(a.comment.date + " " + a.comment.hour);
      const dateB = new Date(b.comment.date + " " + b.comment.hour);
      return dateA - dateB;
    });

    // colocar solo los falsos
    allComments = allComments.filter((item) => item.comment.approve == false);
    return res.send({ allComments });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting comments" });
  }
};

// Aprovar comentarios
exports.acceptComment = async (req, res) => {
  try {
    let commentId = req.params.com;
    let userId = req.params.us;
    let user = await Comment.findOne({
      user: userId,
      comments: { $elemMatch: { _id: commentId } },
    });
    if (!user) return res.status(404).send({ message: "Comment not found" });
    user.comments.forEach(async (item, key) => {
      if (item._id != commentId) return;
      await user.updateOne(
        { "comments.$[index].approve": "true" },
        {
          multi: false,
          arrayFilters: [{ "index._id": commentId }],
        }
      );
    });
    return res.send({ message: "Comment was accepted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error accepting comment" });
  }
};
// Rechazar comentarios
exports.deleteComment = async (req, res) => {
  try {
    let commentId = req.params.com;
    let userId = req.params.us;
    let user = await Comment.findOne({
      user: userId,
      comments: { $elemMatch: { _id: commentId } },
    });
    if (!user) return res.status(404).send({ message: "Comment not found" });
    let isFalse = user.comments.find((item) => item._id == commentId);
    if (isFalse.approve == true)
      return res
        .status(400)
        .send({ message: "This comment is already accepted" });
    user.comments.pull(isFalse);
    await user.save();
    return res.send({ message: "Comment was deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error removing comment" });
  }
};
