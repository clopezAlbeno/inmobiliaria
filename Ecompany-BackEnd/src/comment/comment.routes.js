'use strict'

const express = require('express')
const api = express.Router()
const commentController = require('./comment.controller')
const {ensureAuth, isAdmin, isUser} = require("../services/authenticated")

api.get('/test', commentController.test)

// Administrador
api.get('/getMoreRecentNoApprove', [ensureAuth, isAdmin], commentController.getMoreRecentNoApprove) // ya
api.get('/getOlderNoApprove',[ensureAuth, isAdmin], commentController.getOlderNoApprove) // ya
api.get('/getAllCommentsMoreRecent', [ensureAuth, isAdmin], commentController.getAllCommentsMoreRecent) // ya
api.get('/getAllCommentsOlder',[ensureAuth, isAdmin], commentController.getAllCommentsOlder) // ya
api.put('/acceptComment/:us/:com', [ensureAuth, isAdmin], commentController.acceptComment) // ya
api.delete('/deleteComment/:us/:com', [ensureAuth, isAdmin], commentController.deleteComment) // ya

// Usuarios
api.post('/addComment', [ensureAuth, isUser], commentController.addComment)
api.get('/getCommentsByUser/:id', ensureAuth, commentController.getCommentsByUser)

// Ambos
api.get('/getMoreRecentApprove', commentController.getMoreRecentApprove) // ya
api.get('/getOlderApprove', commentController.getOlderApprove) // ya
api.post('/searchComments', commentController.getByFilter) // ya

module.exports = api;