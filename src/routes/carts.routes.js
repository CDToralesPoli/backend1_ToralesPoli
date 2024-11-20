import { Router } from "express"
import crypto from "crypto"
import { readFile, writeFile } from 'fs/promises'

const cartsRouter = Router()

const cartsData = await readFile('src/db/carts.json', 'utf-8')
const carts = JSON.parse(cartsData)

// Obtener todos los carritos
cartsRouter.get('/', (req, res) => {
    const { limit } = req.query
    const limitedCarts = carts.slice(0, limit)
    res.status(200).send(limitedCarts)
})

// Obtener un carrito especifico
cartsRouter.get('/:cid', (req, res) => {
    const idCart = (req.params.cid)
    const cart = carts.find(c => c.id == idCart)
    if (cart) { 
        res.status(200).send(cart.products)
    } else {
        res.status(404).send({ error: 'Carrito no encontrado' })
    }
})

// Agregar un nuevo carrito
cartsRouter.post('/', async (req, res) => {
    const newCart = {
        id: crypto.randomBytes(5).toString('hex'), //Genera id unico mediante crypto
        products: []   
    }

    carts.push(newCart)
    await writeFile('src/db/carts.json', JSON.stringify(carts))
    res.status(200).send(`Carrito creado con el id ${newCart.id}`)
})

// Actualizar carrito
cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    const idCart = (req.params.cid)
    const idProduct = (req.params.pid)
    const {quantity} = req.body
    const cart = carts.find(c => c.id == idCart)
    if (cart) { 
        const index = cart.products.findIndex(p => p.id == req.params.pid)
        if (index != -1) {
            cart.products[index].quantity = quantity
        } else {
            cart.products.push({id: idProduct, quantity: quantity})
        }
        await writeFile('src/db/carts.json', JSON.stringify(carts))
        res.status(200).send({ message: 'El carrito ha sido actualizado' })
    } else {
        res.status(404).send({ error: 'Carrito no encontrado' })
    }
})

export default cartsRouter