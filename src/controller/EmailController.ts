import { injectable, inject } from "inversify";
import { Request, Response, Router } from "express";
import { CommonUtils } from '../util/commonUtils';
import Identifiers from "../config/identifiers";
// import { IParentService } from "src/service/iparentService";
// import { EncryptionUtil } from "src/util/encryptionUtil";
// import { ErrorResponse } from "src/dto/errorResponse";
import { ErrorResponse } from "../dto/errorResponse";
import { IParentService } from "src/service/iparentService";
import { EncryptionUtil } from "../util/encryptionUtil";
// import { ErrorResponse } from "../dto/errorResponse";
// import { IParentService } from "src/service/iparentService";
// // import { CommonUtils } from "src/util/commonUtils";
// import { EncryptionUtil } from "src/util/encryptionUtil";
// import { ErrorResponse } from "src/dto/errorResponse";
//import { EncryptionUtil } from "../util/encryptionUtil";
var nodemailer = require('nodemailer');


@injectable()
export class EmailController {
  public router: Router;

  @inject(Identifiers.IParentService)
  private ParentService: IParentService;

  constructor() 
  {
    this.router = Router();
    this.router.post("/password/mail/stud", this.password_mail_s);
    this.router.post("/password/mail/teacher", this.password_mail_t);
    this.router.post("/password/send/teacher", this.send_password_teacher);
    this.router.post("/password/send/stud", this.send_password_stud);
 
  
  }
  public send_password_stud= async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    
    // CommonUtils.generateUniqueID()
// Update random password
var newPassword=CommonUtils.generateUniqueID();
const salt = EncryptionUtil.generateSalt(10);
let hashedPassword = EncryptionUtil.encrypt(newPassword, salt);
console.log(hashedPassword)
var email = req.body.email;
let set =`student_password='${newPassword}', is_verify='0'`;

var where = ` student_email='${email}'`

console.log("set: " + set);

try {
  let id = await this.ParentService.Update_data(
    " student",
    set,
    where
  );
  console.log(id);
  if (id && id.rowCount > 0) {
    let field = ' *';
     where = ` where student_email='${email}'`;
      
      let result = await this.ParentService.findfield(field,"student",where);
      // var password = result.rows[0].student_password;
      var name = result.rows[0].student_fname;
      console.log(newPassword)
    
    var subject="User Password";
    const textmail=`<html>
   <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
       <title>My site title</title>
       <style>
           here all common css
       </style>
   </head>
   <body style="margin:0px;padding:0px">
    <p>Hello ${email},</p><br/>
    <p>Welcome ${name},Please Find Your Login Credentials,</p>
    <p>USERNAME:${email}</p>
    <p>PASSWORD:${newPassword}</p><br/>
    
    <p>Thanks & Regards,</p>
    <p>Breeze Chat Team.</p>

   </body>
   </html>`;
    const email_res=this.sendmail(email,subject,textmail);
   
      if (email_res) {
        res.json({ status: "1", data: "email send sucess" });
      } else {
        res.json({ status: "0", message: "error" });
      }
  } else {
    res.status(200).json({ status: "0", message: "Password Reset Faild" });
  }
} catch (error) {
  res.statusCode = 500;
  res.send(new ErrorResponse(error.name));
}




    //  email=req.body.email;
    }


  public send_password_teacher= async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    


    var newPassword=CommonUtils.generateUniqueID();
    const salt = EncryptionUtil.generateSalt(10);
    let hashedPassword = EncryptionUtil.encrypt(newPassword, salt);
    console.log(hashedPassword)
    var email = req.body.email;
    let set =`teacher_password='${newPassword}', is_verify='0'`;
    
    var where = ` teacher_email='${email}'`
    
    console.log("set: " + set);
    // 


    try {
      let id = await this.ParentService.Update_data(
        " teacher",
        set,
        where
      );
      console.log(id);
      if (id && id.rowCount > 0) {
        var email=req.body.email;
    let field = ' *';
     where = ` where teacher_email='${email}'`;
      
      let result = await this.ParentService.findfield(field,"teacher",where);
      // var password = result.rows[0].teacher_password;
      var name = result.rows[0].teacher_fname;
      console.log(newPassword)
    
    var subject="User Password";
    const textmail=`<html>
   <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
       <title>My site title</title>
       <style>
           here all common css
       </style>
   </head>
   <body style="margin:0px;padding:0px">
    <p>Hello ${email},</p><br/>
    <p>Welcome ${name},Please Find Your Login Credentials,</p>
    <p>USERNAME:${email}</p>
    <p>PASSWORD:${newPassword}</p><br/>
    
    <p>Thanks & Regards,</p>
    <p>Breeze Chat Team.</p>

   </body>
   </html>`;
    const email_res=this.sendmail(email,subject,textmail);
   
      if (email_res) {
        res.json({ status: "1", data: "email send sucess" });
      } else {
        res.json({ status: "0", message: "error" });
      }
    } }catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }

// 
// 
// 
    

    }

  public password_mail_s= async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;
    var Iname=req.body.Iname;
    var subject="User Default Password";
    
   const textmail=`<html>
   <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
       <title>My site title</title>
       <style>
           here all common css
       </style>
   </head>
   <body style="margin:0px;padding:0px">
    <p>Hello ${name},</p><br/>
    <p>Welcome ${Iname},Please Find Your Login Credentials,</p>
    <p>USERNAME:${email}</p>
    <p>PASSWORD:${password}</p><br/>
    <a href="http://localhost:3000/student/login">
    <button>LOGIN</button></a>
    <p>Thanks & Regards,</p>
    <p>${Iname}.</p>

   </body>
   </html>`;
    const email_res=this.sendmail(email,subject,textmail);
   
      if (email_res) {
        res.json({ status: "1", data: "email send sucess" });
      } else {
        res.json({ status: "0", message: "error" });
      }
    }
    public password_mail_t= async (req: Request, res: Response) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "POST, GET, PUT, DELETE, OPTIONS"
      );
      var name=req.body.name;
      var email=req.body.email;
      var password=req.body.password;
      var Iname=req.body.Iname;
      var subject="User Default Password";
      
     const textmail=`<html>
     <head>
         <meta charset="utf-8">
         <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
         <title>My site title</title>
         <style>
             here all common css
         </style>
     </head>
     <body style="margin:0px;padding:0px">
      <p>Hello ${name},</p><br/>
      <p>Welcome To ${Iname},Please Find Your Login Credentials,</p>
      <p>USERNAME:${email}</p>
      <p>PASSWORD:${password}</p><br/>
      <a href="http://localhost:3000/teacher/login">
      <button>LOGIN</button></a>
      <p>Thanks & Regards,</p>
      <p>${Iname}.</p>
  
     </body>
     </html>`;
      const email_res=this.sendmail(email,subject,textmail);
     
        if (email_res) {
          res.json({ status: "1", data: "email send sucess" });
        } else {
          res.json({ status: "0", message: "error" });
        }
      }



  
  
  private sendmail = async (tomail:string,subject:string,textmail:string) => 
    {      
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'patil.a.harshada@gmail.com',
          pass: 'cjcgthvecywtwcvr'
        }
      });
      // cnqpwqhqocgqmoxx old key
      var mailOptions = {
        from: 'patil.a.harshada@gmail.com',
        to:tomail,
        subject:subject,
        html: textmail
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
       
  }

  
  
  
}