const produtosModel = require ('../models/produtos')

async function getProdutos (req,res) {
    try {
        const produtos = await produtosModel.getProdutos()

        return res.send(produtos)
    } catch (error) {
        console.error(error)
        return res.status(500).send('Erro ao Buscar produtos!')
    }

}

async function createProduto(req,res){
    try {
    
        const produto = await produtosModel.createProduto(req.body)

        return res.status(201).send(produto)
    } catch (error) {
        console.error(error)

        return res.status(500).send('Erro ao criar produto')
    }

}

async function deleteProduto (req,res) {
    const { id } = req.params;
    try {
        await produtosModel.deleteProduto(id)

        return res.status(202).send('Produto deletado com sucesso')
    } catch (error) {
        console.error(error)
        
        return res.status(500).send('Erro ao deletar produto')
    }
}

module.exports = {
    getProdutos,
    createProduto,
    deleteProduto

}