import { Router } from "express"

const chatRouter = Router()

chatRouter.get('/', (req, res) => {
    res.render('templates/chat', {js:'chat.js', css:'style.css'})
})

export default chatRouter