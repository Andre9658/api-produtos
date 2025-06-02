const express = require ('express')
const router = express.Router()
const produtosController = require('../controllers/produtos')

router.get('/produtos', produtosController.getProdutos)
router.post('/produtos', produtosController.createProduto)

module.exports = router;