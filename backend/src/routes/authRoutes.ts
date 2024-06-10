import { GetUsers } from "@root/controllers/auth/get-users";
import { SignIn } from "@root/controllers/auth/signin";
import { SignOut } from "@root/controllers/auth/signout";
import { SignUp } from "@root/controllers/auth/signup";
import express, { Router } from "express";


class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/signup', SignUp.prototype.create);
    this.router.post('/signin', SignIn.prototype.read);
    
 

    return this.router;
  }

  public signoutRoute(): Router {
    this.router.get('/signout', SignOut.prototype.update);

    return this.router;
  }

  public userRoute(): Router {
    this.router.get('/users', GetUsers.prototype.read);
    return this.router;
  }

}

export const authRoutes: AuthRoutes = new AuthRoutes();   
