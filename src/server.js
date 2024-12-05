import express from 'express'
import { create } from 'express-handlebars'
import { Server } from 'socket.io'
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import { __dirname } from './path.js'
import imagesRouter from './routes/images.routes.js'
import chatRouter from './routes/chat.routes.js'

const app = express()
const hbs = create()
const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Servidor arriba en el puerto ${PORT}`)
})

const io = new Server(server)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.set('views', __dirname + '/views')

//app.use('/public', express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public'))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/chat', chatRouter)
app.use('/upload', imagesRouter)

app.get('/', (req,res) => {
    res.status(200).send("Ok")
})

let messages = []

io.on('connection', (socket) => {
    console.log('Usuario conectado: ', socket.id);
    
    socket.on('mensaje', (data) => {
        console.log('Mensaje recibido: ', data)
        messages.push(data)
        socket.emit('respuesta', messages)
    })

    socket.on('disconnect', ()=> {
        console.log('Usuario desconectado: ', socket.id)
    })
})
