import { injectable, inject } from "inversify";
import { Request, Response, Router } from "express";
import { CommonUtils } from '../util/commonUtils';
import Identifiers from "../config/identifiers";
import { ErrorResponse } from "../dto/errorResponse";
import { IParentService } from "src/service/iparentService";
import { EncryptionUtil } from "../util/encryptionUtil";


@injectable()
export class TeacherController {
  public router: Router;

  @inject(Identifiers.IParentService)
  private ParentService: IParentService;

  constructor() 
  {
    this.router = Router();
    this.router.get("/view/teacher", this.view_teacher);
    this.router.get("/view/teacherbyid/:id", this.view_teacherbyid);
    this.router.get("/search/teacher", this.search_teacher);
    this.router.post("/add/teacher", this.addteacher);
    this.router.post("/login/teacher", this.login_teacher);
    this.router.post("/update/password/teacher", this.update_password);
    this.router.post("/add/assignment", this.addassignment);
    this.router.get("/view/assignment1/:id", this.view_assignmentbyid);
    this.router.get("/view/assignment2", this.view_assignmentbystud);
//messages Api
    this.router.post("/send/message", this.sendmsg);
    this.router.get("/view/chat", this.view_chat);
    this.router.post("/update/teacher", this.update_profile);
    this.router.post("/change/profile/teacher", this.change_profile);
    this.router.post("/submit/assignment", this.submit_assignment);
    this.router.get("/view/submitted/assignment", this.submitted_assignment);
    this.router.post("/delete/teacher/:sid", this.delete_teacher);

    //

    this.router.post("/delete/message/:mid", this.delete_msg);
  }

  //Api

  public delete_teacher = async (req: Request, res: Response) => {
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

  


    let where = ` teacher_id= ${sid} `;

    try {
      let id = await this.ParentService.delete_data(
        " teacher",
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


  public submitted_assignment = async (req: Request, res: Response) => {
     
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
    let where = "  where assign_id="+id;
      
    try {
      let result = await this.ParentService.findfield(field,"submit_assignment",where);
      
      if (result.rowCount > 0) {
        var top = result.rows;
        res.json({ status: "1", data: top });
      } else {
        res.json({ status: "0", message: "No data found" });
      }
      
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };
  public submit_assignment = async (req: Request, res: Response) => {
     
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    let fulldate = CommonUtils.postgressDateFormat();
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

    const col="stud_id,assign_id,created_at,afile";
    const val= `'${req.body.stud_id}','${req.body.assign_id}','${fulldate}','${img}'`;
      
    try {
      let result = await this.ParentService.Insert_data(
        "submit_assignment",
        col,
        val,
        'sa_id'
        );
      
      if (result.rowCount > 0) {
        var data = result.rows;
        res.json({ status: "1", data: data });
      } else {
        res.json({ status: "0", message: "No data found" });
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
    let set =`t_img='${img}'`;

    let where = ` teacher_id='${id}'`

    console.log("set: " + set);

    try {
      let id = await this.ParentService.Update_data(
        " teacher",
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
    let set =`teacher_fname='${req.body.fname}', teacher_lname='${req.body.lname}',teacher_contact='${req.body.contact}'`;

    let where = ` teacher_id='${id}'`

    console.log("set: " + set);

    try {
      let id = await this.ParentService.Update_data(
        " teacher",
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
    let set =`teacher_password='${hashedPassword}', is_verify='1'`;

    let where = ` teacher_email='${email}'`

    console.log("set: " + set);

    try {
      let id = await this.ParentService.Update_data(
        " teacher",
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

  

  public sendmsg = async (req: Request, res: Response) => {
     
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    let fulldate = CommonUtils.postgressDateFormat();
    const col="msg,i_id,g_id,s_id,t_id,msg_date,m_name,is_deleted";
    const val= `'${req.body.msg}','${req.body.i_id}','${req.body.g_id}','${req.body.s_id}','${req.body.t_id}','${fulldate}','${req.body.m_name}','0'`;
      
    try {
      let result = await this.ParentService.Insert_data(
        " messages",
        col,
        val,
        'm_id'
        );
      
      if (result.rowCount > 0) {
        var data = result.rows;
        res.json({ status: "1", data: data });
      } else {
        res.json({ status: "0", message: "No data found" });
      }
      
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };

  public view_chat = async (req: Request, res: Response) => {
     
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
    let iid=req.query.iid;
    let gid=req.query.gid;
    
    field = ' m.*';
    where = `  where m.i_id=${iid} AND m.g_id=${gid} ORDER BY m.m_id ASC`;
 

    try {
      let result = await this.ParentService.findfield(field,"messages m",where);
      
      if (result.rowCount > 0) {
        var top = result.rows;
        res.json({ status: "1", data: top });
      } else {
        res.json({ status: "0", message: "No data found" });
      }
      
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };
  // public view_chat_stud = async (req: Request, res: Response) => {
     
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
  //   );
  //   res.header(
  //     "Access-Control-Allow-Methods",
  //     "POST, GET, PUT, DELETE, OPTIONS"
  //   );
  //   //let id = req.params.id;
  //   let field 
  //   let where
  //   let iid=req.query.iid;
  //   let gid=req.query.gid;
    
  //   field = ' m.*';
  //   where = `  where m.i_id=${iid} AND m.g_id=${gid} ORDER BY m.m_id ASC`;
 

  //   try {
  //     let result = await this.ParentService.findfield(field,"messages m",where);
      
  //     if (result.rowCount > 0) {
  //       var top = result.rows;
  //       res.json({ status: "1", data: top });
  //     } else {
  //       res.json({ status: "0", message: "No data found" });
  //     }
      
  //   } catch (error) {
  //     res.statusCode = 500;
  //     res.send(new ErrorResponse(error.name));
  //   }
  // };

  //Api
  public view_teacherbyid = async (req: Request, res: Response) => {
     
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
    let id=req.params.id
    let where = "  where teacher_id="+id;
      
    try {
      let result = await this.ParentService.findfield(field,"teacher",where);
      
      if (result.rowCount > 0) {
        var top = result.rows;
        res.json({ status: "1", data: top });
      } else {
        res.json({ status: "0", message: "No data found" });
      }
      
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };
 public view_assignmentbyid = async (req: Request, res: Response) => {
     
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
    let id=req.params.id
    let where = "  where addedby="+id;
      
    try {
      let result = await this.ParentService.findfield(field,"assignment",where);
      
      if (result.rowCount > 0) {
        var top = result.rows;
        res.json({ status: "1", data: top });
      } else {
        res.json({ status: "0", message: "No data found" });
      }
      
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };

  public view_assignmentbystud = async (req: Request, res: Response) => {
     
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
    let course=req.query.course
     let cyear=req.query.cyear
    let where = ` where acourse='${course}' and ayear='${cyear}'`;
      
    try {
      let result = await this.ParentService.findfield(field,"assignment",where);
      
      if (result.rowCount > 0) {
        var top = result.rows;
        res.json({ status: "1", data: top });
      } else {
        res.json({ status: "0", message: "No data found" });
      }
      
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };


  public login_teacher = async (req: Request, res: Response) => {
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

    let where1 = ` where teacher_email= '${email}' and is_verify='0' `
    let resfinal = await this.ParentService.findfield(' teacher_email',"teacher", where1);

    if (resfinal.rowCount > 0) {
      console.log(resfinal.rowCount)
      where1 = ` where teacher_email= '${email}' and is_verify='0' and teacher_password= '${password}'`
      resfinal = await this.ParentService.findfield(' teacher_email'," teacher", where1);
      if(resfinal.rowCount == 0){
          res.json({ status: "0", message: "Invalid Email and Password !! " });
        }
        else{
      res.json({ status: "3", message: "Please Verify your account!" });}
    } 
    else 
    {
    let field = ' *';
    let where = ` where del_flag1='0' and is_verify='1' and teacher_email='${email}' `;
      
    try {
      let result = await this.ParentService.findfield(field," teacher",where);
      
      if (result.rowCount > 0) {
        var top = result.rows;
        const isPasswordMatch = EncryptionUtil.compare(password,result.rows[0].teacher_password);
        if(isPasswordMatch) 
        {      
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
      res.send(new ErrorResponse(error.name));
    }
  }
    
  //   if (resfinal.rowCount > 0) {
  //     console.log(resfinal.rowCount)
  //     res.json({ status: "3", message: "Please Verify your account!" });
  //   } 
  //   else 
  //   {

  //   let field = ' *';
  //   let where = ` where del_flag1='0' and is_verify='1' and teacher_email='${email}' `;
      
  //   try {
  //     let result = await this.ParentService.findfield(field," teacher",where);
      
  //     if (result.rowCount > 0) {
  //       var top = result.rows;
  //       const isPasswordMatch = EncryptionUtil.compare(password,result.rows[0].teacher_password);
  //       if(isPasswordMatch) 
  //       {      
  //         res.status(200).json({ status: "1", message: "Success", data: top });
  //       } 
  //       else 
  //       {
  //         res.status(200).json({ status: "0", message: "Login Failed, Invalid username or password" });
  //       }
  //     } else {
  //       res.json({ status: "0", message: "No data found" });
  //     }
      
  //   } catch (error) {
  //     res.statusCode = 500;
  //     res.send(new ErrorResponse(error.name));
  //   }
  // }
  };


  public addteacher = async (req: Request, res: Response) => {
     
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    const col="teacher_fname,teacher_lname,teacher_email,teacher_password,teacher_contact,del_flag1,institute_id,is_verify,t_img";
    const val= `'${req.body.teacher_fname}','${req.body.teacher_lname}','${req.body.teacher_email}','${req.body.teacher_password}','${req.body.teacher_contact}','0','${req.body.institute_id}','0','null'`;
      
    try {
      let result = await this.ParentService.Insert_data(
        "teacher",
        col,
        val,
        'teacher_id'
        );
      if(result==0){
        res.json({ status: "0", message: "Email Already Exists!!" });
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
      res.send(new ErrorResponse(error.name));
    }
  };

  public addassignment = async (req: Request, res: Response) => {
     
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
    // if(req.files.Profile==null){
    //   res.json({ status: "0", message: "Please attach file" });
    // }
    console.log(req.body);
    Profile = req.files.Profile;
    if(Profile===''){
      res.json({ status: "0", message: "Please attach file" });
    }
   else{
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
       


    const col="acourse,ayear,subject,date,addedby,attachment";
    const val= `'${req.body.acourse}','${req.body.ayear}','${req.body.subject}','${req.body.date}','${req.body.addedby}','${img}'`;
      
    try {
      let result = await this.ParentService.Insert_data(
        "assignment",
        col,
        val,
        'aid'
        );
      
      if (result.rowCount > 0) {
        var data = result.rows;
        res.json({ status: "1", data: data });
      } else {
        res.json({ status: "0", message: "No data found" });
      }
      
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  }
  };





  public view_teacher = async (req: Request, res: Response) => {
     
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
    let where = ` where del_flag1=0 and institute_id=${id}`;

    let result1 = await this.ParentService.findcount(
      " count(*) AS search_count ",
       " teacher ",
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
    "teacher ",
    where,
    per_page,
    startindex
  );
 
  if (result.rowCount > 0) {
    var top = result.rows;
    var perpagecnt=result.rowCount;
    console.log("Data",result.rowCount)
   res.json({ status: "1",page:page,per_page:per_page,tcount:count ,total:total,perpagecnt:perpagecnt,total_pages:total_result, data:top });
  } else {
    res.json({ status: "0", message: "No data found" });
  }
      
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };

  public search_teacher = async (req: Request, res: Response) => {
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
    var q=req.query.find;
    var id=req.query.id;
    let where = ` where del_flag1='0' and institute_id=${id} and teacher_fname LIKE'%${q}%' `;
  
    let result1 = await this.ParentService.findcount(
      " count(*) AS search_count ",
       " teacher ",
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
    "teacher ",
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


  public delete_msg= async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );

    let mid = req.params.mid;
    let set =` is_deleted='1'`;

    let where = ` m_id='${mid}'`

    console.log("set: " + set);

    try {
      let id = await this.ParentService.Update_data(
        " messages",
        set,
        where
      );
      console.log(id);
      if (id && id.rowCount > 0) {
        res
          .status(200)
          .json({ status: "1", message: "Message Deleted" });
      } else {
        res.status(200).json({ status: "0", message: "Record Update Failed" });
      }
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };


}