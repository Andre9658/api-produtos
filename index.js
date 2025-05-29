const express = require('express')
const app = express ()
const port = 6579 //porta do meu computador
const { Pool } = require('pg')

const pool = new Pool ({
    user:'postgres.fkqepqkuaiipkjzvfppe',
    host:'aws-0-us-east-2.pooler.supabase.com',
    database:'postgres',
    password:'@Ndre9658',
    port:5432   // porta do banco de dados
})

app.use(express.json()) // configuração inicial

app.post('/produtos', async (req,res) => {
    const { nome, preco, categoria, image_url } = req.body

    if(!nome || !preco || !categoria || !image_url) {
        return res.status(400).send('Todos os campos são obrigatórios')
    }


    if(nome.lenght > 100) {
        return res.status(400).send('Nome pode ter no máximo 100 caracteres')
    }

    if(categoria.lenght > 50) {
        return res.status(400).send('Categoria pode ter no máximo caracteres')
    }

    try {
        const produto = await pool.query(`
    INSERT INTO produtos (nome, preco, categoria, image_url)
    VALUES (
        '${nome}',
        ${preco},
        '${categoria}',
        '${image_url}'

    )
    RETURNING *
    `)

    res.status(201).send(produto.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).send('Erro ao cadastrar produto')
    }
})

app.get('/produtos', async (req,res) => {
    try {
        const produtos = await pool.query('SELECT * FROM produtos')

        return res.status(200).send(produtos.rows)
    } catch (error) {
        console.error(error)

        return res.status(500).send('Erro ao buscar produtos')
    }
})

app.listen (port, () => {
    console.log(`O servidor está rodando na porta ${port}`)
})