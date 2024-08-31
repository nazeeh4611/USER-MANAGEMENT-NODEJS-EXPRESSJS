const User = require('../model/User')
const bcrypt = require('bcrypt')

const securePassword = async(password)=>{
    try{
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    }catch(error){
      console.log(error.message);
    }
};

const loadRegister = async(req,res)=>{
    try{
        res.render('register');
    }catch(error){
        console.log(error.message);
    }
};

const insertUser = async(req,res)=>{
    try {
        const spassword = await securePassword(req.body.password);
        const {name,email,phone,password } =req.body
        console.log(name,email,phone,password) 
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.phone,
            password:spassword,
            is_admin:0,
        });

        const userData = await user.save();

        if (userData) {
            res.render('register', {message: "Your registration has been successful. please verify your email"});
        }else{
            res.render('register',{message:"Your registration has failed"});
        }
    } catch (error) {
        console.log(error.message);
    }
};

// login user method started

const loginLoad = async(req,res)=>{
    try{
        res.render('login');
    }catch(error){
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log(email,password,"opopopopop")

        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (passwordMatch) {
                req.session.user_id = userData._id;
                console.log("hejheh")
                res.redirect('/home');
            } else {
                res.render('login', { message: "Email and password are incorrect" });
            }
        } else {
            res.render('login', { message: "Email and password are incorrect" });
        }
    } catch (error) {
        console.log(error.message);
        res.render('login', { message: "An unexpected error occurred, please try again." });
    }
}



const loadHome = async(req,res)=>{
    try{
        const userData = await User.findById({_id:req.session.user_id})
        console.log("userData",userData)
            res.render('home',{user:userData});
    }catch(error){
        console.log(error.message);
    }
}

const userLogout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/');
    }catch(error){
        console.log(error.message);
    }
}


//user profle edit 

const editLoad = async(req,res)=>{
    try{
        const id = req.query.id;
        const userData = await User.findById({ _id:id});
        if(userData){
            res.render('edit',{user:userData});
        }else{
            res.redirect('/home');
        }
    }catch(error){
        console.log(error.message);
    }
}
const updateprofile = async(req,res)=>{
    try{
        if(req.file){
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}})
        }else {
            const userData =  await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}})
        }
        res.redirect('/home');
    }catch (error){
        console.log(error.message);
    }
}

module.exports={
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editLoad,
    updateprofile
};