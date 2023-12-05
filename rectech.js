const mongoose = require ("mongoose")
const express = require ("express")
const bodyParser = require("body-parser")

const app = express ()
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
const port = 3000

mongoose.connect('mongodb://127.0.0.1:27017/rectech',
{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    serverSelectionTimeoutMS : 20000
})


const UsuarioSchema =  new mongoose.Schema({
    nome : { type :String},
    email : {type : String, required : true},
    senha : {type : String,  required : true}
})


const Usuario = mongoose.model("Usuario", UsuarioSchema)



app.post("/cadastrousuario", async(req,res)=>{
    const nome = req.body.nome
    const email = req.body.email
    const senha = req.body.senha

    if ( nome == "" || email == "" || senha == "" ){
        return res.status(400).json({error: "preencha todos os campos"})
    }

    const emailexiste = await Usuario.findOne({email:email})
    if(emailexiste){
        return res.status(400).json({error:"o email cadastrado já existe"})
    }

    const usuario = new Usuario({
        nome : nome,
        email: email,
        senha:senha,
    })

    try{
        const newUsuario = await usuario.save()
        res.json({error: null,msg: "Cadastro ok", UsuarioId : newUsuario._id})
    }

    catch(error){
        res.status(400).json((error))
    }
    
})






const NotaSchema =  new mongoose.Schema({
    
    numero : {type : String, required : true},
    dataemissao : {type : Date},
    item : { type :String},
    valorunitario : { type :String},
    quantidade : { type :Number}
})


const Nota = mongoose.model("Nota", NotaSchema)



app.post("/cadastroNota", async(req,res)=>{
    const numero = req.body.numero
    const dataemissao = req.body.dataemissao
    const item = req.body.item
    const valorunitario = req.body.valorunitario
    const quantidade = req.body.quantidade

    if ( numero == "" || dataemissao == "" || item == "" || valorunitario == "" || quantidade == "" ){
        return res.status(400).json({error: "preencha todos os campos"})
    }

    const numeroexiste = await Nota.findOne({numero:numero})
    if(numeroexiste){
        return res.status(400).json({error:"Este número já foi cadastrado em outra nota fiscal."})
    }


    const notafisc = new Nota({
        numero: numero,
        dataemissao: dataemissao,
        item: item,
        valorunitario: valorunitario,
        quantidade: quantidade,
    })

    try{
        const newNota = await notafisc.save()
        res.json({error: null,msg: "Cadastro ok", UsuarioId : newNota._id})
    }

    catch(error){
        res.status(400).json((error))
    }
    
})


app.get("/cadastrousuario", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrousuario.html");
})

app.get("/cadastroNota", async(req, res)=>{
    res.sendFile(__dirname +"/cadastroNota.html");
})


app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
})

//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})
