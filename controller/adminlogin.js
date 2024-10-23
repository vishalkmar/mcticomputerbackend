
const dotenv = require("dotenv");
dotenv.config();


const adminLogin = async(req,res)=>{
    try{
        
    const {username, password} = req.body;

    if(username===process.env.OWNER_USERNAME && password===process.env.OWNER_PASSWORD){
        res.status(200).json({message:"Authonticate User",sucess:true})
    }
    else{
        res.status(401).json({message:"Invalid Credentials",sucess:false})
    }
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error",sucess:false})
    }
};

module.exports = adminLogin
