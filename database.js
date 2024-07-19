import express from "express"
import bodyParser from "body-parser"
import pg from "pg"
import { database, password } from "pg/lib/defaults";

const app=express();
const port=4000;

const db=new pg.Client(
{
    host:"localhost",
    user:"postgres",
    database:"crypto",
    password:"KAVITA",
    port:5432

});
db.connect();

let quiz=[
   { name_crypto:bitcoin_name,
    last_price:last,
    buy_price:buy,
    sell_price: sell, 
    volume_price: vol, 
    base_unit:base_unit}
];
app.post("/",async(req,res) =>{
    try{
        console.log(req.body);
        const type=req.body.type;
         const Crypto=req.body.Crypto;
        const response = await axios.get(`https://api.wazirx.com/api/v2/tickers`);
        const result = response.data
        ;
        console.log(result);

        for(i=1;i<=result.length;i++){
        const bitcoin_name=Crypto;
        const buy=response.data.ticker.buy;
        const last=response.data.ticker.last;
        const base_unit=response.data.ticker.base_unit;
        const sell=response.data.ticker.sell;
        const low=response.data.ticker.low;
        const high=response.data.ticker.high;
        const vol=response.data.ticker.vol;
    
    const insertQuery=`INSERT INTO crypto( id, name_crypto, last_price, buy_price, sell_price, volume_price, base_unit) VALUES ( ${bitcoin_name},${last},${buy}, ${sell},  ${vol}, ${base_unit})`;
    db.query( insertQuery,(err,res)=>{
        if(err){
            console.log(err.stack);
        }else{
          quiz=res.rows;  
        }})
    }// console.log(`${bitcoin_name} ${sell} ${last} ${low} ${high} ${vol}`)

        // res.render("index.ejs",{ data:[Math.floor(Math.random() * result.length)] ,
        //  });
    }
    catch(error){
        console.error("failed to make request",error.message);
        res.render("index.ejs",{ 
            error:"No activites to match your criteria" ,
        });
    }
});
db.query('SELECT *FROM public.crypto',(err,res)=>{
    if(err){
        console.log(err.stack);
    }else{
      quiz=res.rows;  
    }
    
        });
//  INSERT INTO public.crypto(
//             id, name_crypto, last_price, buy_price, sell_price, volume_price, base_unit)
//             VALUES (`${bitcoin_name},${last},${buy}, ${sell},  ${vol}, ${base_unit}`);

app.listen(port,()=>{
    console.log(`server running on port ${port}`);
});