import { injectable, inject } from "inversify";
import { Request, Response, Router } from "express";
import { CommonUtils } from '../util/commonUtils';
import Identifiers from "../config/identifiers";
import { ErrorResponse } from "../dto/errorResponse";
import { IParentService } from "src/service/iparentService";
import { EncryptionUtil } from "../util/encryptionUtil";


@injectable()
export class StudentController {
  public router: Router;

  @inject(Identifiers.IParentService)
  private ParentService: IParentService;

  constructor() 
  {
    this.router = Router();
    this.router.get("/view/student", this.view_user);
    this.router.get("/view/studentbyid/:id", this.view_user_byid);
    this.router.get("/search/student", this.search_student);
    this.router.post("/add/student", this.addstudent);
    this.router.post("/login/student", this.login_stud);
    this.router.get("/view/group/stud", this.view_grp);
    this.router.post("/update/password/student", this.update_password);
    this.router.post("/update/student", this.update_profile);
    this.router.post("/delete/student/:sid", this.delete_stud);
    this.router.post("/change/profile/student", this.change_profile);
  }

  //Api
  public delete_stud = async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );

    let sid = req.params.sid;

  


    let where = ` student_id= ${sid} `;

    try {
      let id = await this.ParentService.delete_data(
        " student",
         where
      );
      console.log(id);
      if (id && id.rowCount > 0) {
        res
          .status(200)
          .json({ status: "1", message: "Record Deleted Successfully" });
      } else {
        res.status(200).json({ status: "0", message: "Record Update Failed" });
      }
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };

  public change_profile= async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    var Profile
    var uploadPath
    Profile = req.files.Profile;
    let img=CommonUtils.generateUniqueID()+"-"+Profile.name;
   let path="C:/Final Group Project/Frontend (1)/public";
    uploadPath = path + '/uploads/' +img ;
    
    console.log(Profile.name)
        Profile.mv(uploadPath, function(err) {
            if (err){
            // return res.status(500).send(err);
            console.log("fail")
            }
            else{
            console.log('File uploaded!');
            }
        });

    let id = req.body.id;
    let set =`s_img='${img}'`;

    let where = ` student_id='${id}'`

    console.log("set: " + set);

    try {
      let id = await this.ParentService.Update_data(
        " student",
        set,
        where
      );
      console.log(id);
      if (id && id.rowCount > 0) {
        res
          .status(200)
          .json({ status: "1", message: "Record Updated Successfully" });
      } else {
        res.status(200).json({ status: "0", message: "Record Update Failed" });
      }
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };

  public update_profile= async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );

    let id = req.body.id;
    let set =`student_fname='${req.body.fname}', student_lname='${req.body.lname}',student_contact='${req.body.contact}'`;

    let where = ` student_id='${id}'`

    console.log("set: " + set);

    try {
      let id = await this.ParentService.Update_data(
        " student",
        set,
        where
      );
      console.log(id);
      if (id && id.rowCount > 0) {
        res
          .status(200)
          .json({ status: "1", message: "Record Updated Successfully" });
      } else {
        res.status(200).json({ status: "0", message: "Record Update Failed" });
      }
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };

  public view_grp = async (req: Request, res: Response) => {
     
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    //let id = req.params.id;
    let field 
    let where
    let id=req.query.sid;

    
    field = ' sg.*,s.*,g.*';
    where = ` Join studgrp sg on sg.studentid=s.student_id Join groups g on g.group_id=sg.groupid where s.student_id=${id} `;
 

    try {
      let result = await this.ParentService.findfield(field,"student s",where);
      
      if (result.rowCount > 0) {
        var top = result.rows;
        res.json({ status: "1", data: top,gcount:result.rowCount });
      } else {
        res.json({ status: "0", message: "No data found" });
      }
      
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };

  public login_stud = async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    let email = req.body.email;
    let password = req.body.password;

    let where1 = ` where student_email= '${email}' and is_verify='0'`
    let resfinal = await this.ParentService.findfield(' student_email'," student", where1);
    
      if (resfinal.rowCount > 0) {
        console.log(resfinal.rowCount)
        where1 = ` where student_email= '${email}' and is_verify='0' and student_password= '${password}'`
        resfinal = await this.ParentService.findfield(' student_email'," student", where1);
        if(resfinal.rowCount == 0){
            res.json({ status: "0", message: "Invalid Email and Password !! " });
          }
          else{
        res.json({ status: "3", message: "Please Verify your account!" });}
      } 
      else 
      {
      let field = ' *';
      let where = ` where is_deleted='0' and is_verify='1' and student_email='${email}' `;
        
      try {
        let result = await this.ParentService.findfield(field," student",where);
        console.log(result.rowCount)
        if (result.rowCount > 0) {
          var top = result.rows;
          const isPasswordMatch = EncryptionUtil.compare(password,result.rows[0].student_password);
          if(isPasswordMatch) 
          {      
            console.log("Successssssssssssssssss")
            res.status(200).json({ status: "1", message: "Success", data: top });
          } 
          else 
          {
            res.status(200).json({ status: "0", message: "Login Failed, Invalid username or password" });
          }
        } else {
          res.json({ status: "0", message: "No data found" });
        }
        
      } catch (error) {
        res.statusCode = 500;
        console.log(error);
        res.send(new ErrorResponse(error.name));
      }
    }
   
    
  };

  public update_password= async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    const salt = EncryptionUtil.generateSalt(10);
    let hashedPassword = EncryptionUtil.encrypt(req.body.password1, salt);
    let email = req.body.email;
    let set =`student_password='${hashedPassword}', is_verify='1'`;

    let where = ` student_email='${email}'`

    console.log("set: " + set);

    try {
      let id = await this.ParentService.Update_data(
        " student",
        set,
        where
      );
      console.log(id);
      if (id && id.rowCount > 0) {
        res
          .status(200)
          .json({ status: "1", message: "Record Updated Successfully" });
      } else {
        res.status(200).json({ status: "0", message: "Record Update Failed" });
      }
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };

  public addstudent = async (req: Request, res: Response) => {
     
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    
    const col="student_fname,student_lname,student_email,student_password,student_contact,is_deleted,is_verify,institute_id,s_img,course,cyear";
    const val= `'${req.body.student_fname}','${req.body.student_lname}','${req.body.student_email}','${req.body.student_contact}','${req.body.student_contact}','0','0','${req.body.institute_id}','null','${req.body.course}','${req.body.year}'`;
      
    try {
      let result = await this.ParentService.Insert_data(
        "student",
        col,
        val,
        'student_id'
        );
      // console.log("Row count "+result.rowCount)
      if(result==0){
        res.json({ status: "0",message: "Email Already exists!!" });
      }
      else{
      if (result.rowCount > 0) {
        var data = result.rows;
        res.json({ status: "1", data: data });
      } else {
        res.json({ status: "0", message: "No data found" });
      }
    }
      
    } catch (error) {
      res.statusCode = 500;
      res.send("Email Already Exists !!");
    }
  };





  public view_user_byid = async (req: Request, res: Response) => {
     
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    let id = req.params.id;
    let field = ' *';
    let where = `  where is_deleted=0 and student_id=${id}`;
      
    try {
      let result = await this.ParentService.findfield(field," student",where);
      
      if (result.rowCount > 0) {
        var top = result.rows;
        res.json({ status: "1", data: top ,scount:result.rowCount});
      } else {
        res.json({ status: "0", message: "No data found" });
      }
      
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };


  public view_user = async (req: Request, res: Response) => {
     
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    //let id = req.params.id;
    let field = ' *';
    let id=req.query.id
    let where = `  where is_deleted=0 and institute_id=${id}`;

    let result1 = await this.ParentService.findcount(
      " count(*) AS search_count ",
       " student ",
       where
     );
     if (result1.rowCount > 0) {
       var count =result1.rows[0].search_count;
       console.log("Count"+result1.rows[0].search_count)
     // res.json({ status: "1", data: count });
     }

   const page=req.query.page;
   const per_page=req.query.perpage;
   const total= count;
  
   const cal = total/per_page;
   const total_result=Math.ceil(cal);
   const startindex=(page-1)*per_page; 
   
   try{   
   let result = await this.ParentService.findfieldpagi(
    field,
    "student ",
    where,
    per_page,
    startindex
  );
 
  if (result.rowCount > 0) {
    var top = result.rows;
    var perpagecnt=result.rowCount;
    console.log("Data",result.rowCount)
   res.json({ status: "1",page:page,per_page:per_page,scount:count ,total:total,perpagecnt:perpagecnt,total_pages:total_result, data:top });
  } else {
    res.json({ status: "0", message: "No data found" });
  }
      
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };

  public search_student = async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
  
    let field = ' *';
    let id=req.query.id
    var q=req.query.find;
    let where = ` where is_deleted='0' and institute_id=${id} and student_fname LIKE'%${q}%' `;
    let result1 = await this.ParentService.findcount(
      " count(*) AS search_count ",
       " student ",
       where
     );
     if (result1.rowCount > 0) {
       var count =result1.rows[0].search_count;
       console.log("Count"+result1.rows[0].search_count)
     // res.json({ status: "1", data: count });
     }

   const page=req.query.page;
   const per_page=req.query.perpage;
   const total= count;
  
   const cal = total/per_page;
   const total_result=Math.ceil(cal);
   const startindex=(page-1)*per_page; 
   
   try{   
   let result = await this.ParentService.findfieldpagi(
    field,
    "student ",
    where,
    per_page,
    startindex
  );
 
  if (result.rowCount > 0) {
    var top = result.rows;
    var perpagecnt=result.rowCount;
    console.log("Data",result.rowCount)
   res.json({ status: "1",page:page,per_page:per_page ,total:total,perpagecnt:perpagecnt,total_pages:total_result, data:top });
  } else {
    res.json({ status: "0", message: "No data found" });
  }
      
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  }






}