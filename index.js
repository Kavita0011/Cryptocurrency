import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app=express();
const port=4000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",async (req,res)=>{
    try{
const response= await axios.get("https://api.wazirx.com/api/v2/tickers");
const result=response.data;

res.render("index.ejs",{ data : response.data });
}catch(error){
console.error("failed to make request",error.message);
res.render("index.ejs",
    {
         error:error.message 
    });
}});

app.post("/",async(req,res) =>{
    try{
        console.log(req.body);
        const type=req.body.type;
         const Crypto=req.body.Crypto;
        const response = await axios.get(`https://api.wazirx.com/api/v2/tickers/${Crypto}`);
        const result = response.data;
        console.log(result);
        res.render("index.ejs",{ data:[Math.floor(Math.random() * result.length)] ,
         });
    }
    catch(error){
        console.error("failed to make request",error.message);
        res.render("index.ejs",{ 
            error:"No activites to match your criteria" ,
        });
    }
});

app.listen(port,()=>{
    console.log(`server running on port ${port}`);
});