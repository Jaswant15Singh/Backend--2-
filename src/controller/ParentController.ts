import { injectable, inject } from "inversify";
import { Request, Response, Router } from "express";
//import { CommonUtils } from '../util/commonUtils';
import Identifiers from "../config/identifiers";
import { ErrorResponse } from "../dto/errorResponse";
import { IParentService } from "src/service/iparentService";
//import { EncryptionUtil } from "../util/encryptionUtil";


@injectable()
export class ParentController {
  public router: Router;

  @inject(Identifiers.IParentService)
  private ParentService: IParentService;

  constructor() 
  {
    this.router = Router();
    this.router.get("/view", this.view_user);
    this.router.post("/insert", this.addmember);

  }

  //Api

  public addmember = async (req: Request, res: Response) => {
     
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    const col="fname,lname";
    const val= "'" +req.body.fname +"','" +req.body.lname +"'";
      
    try {
      let result = await this.ParentService.Insert_data(
        "users",
        col,
        val,
        'did'
        );
      
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
    let where = "  ";
      
    try {
      let result = await this.ParentService.findfield(field,"member",where);
      
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







}