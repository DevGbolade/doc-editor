import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { sign } from 'jsonwebtoken';
import { config } from '@root/config';
import { IAuthDocument } from '@root/interfaces/auth.interface';
import { authService } from '@root/shared/services/db/auth.service';
import { BadRequestError } from '@root/shared/globals/helpers/error-handler';
import { joiValidation } from '@root/shared/globals/decorators/joi-validation.decorators'
import { signupSchema } from '@root/schemes/signup';
import { ObjectId } from 'mongodb';


export class SignUp {
  @joiValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;
    const checkIfUserExist: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);
    if (checkIfUserExist) {
      throw new BadRequestError('Invalid credentials');
    }
    const authObjectId: ObjectId = new ObjectId();
    const body = {
      _id: authObjectId,
      username, 
      email,
      password,
    }
    const authData: IAuthDocument = await authService.createAuthUser(body as IAuthDocument) as unknown as IAuthDocument;   
    const userJwt: string = SignUp.prototype.signToken(authData, authObjectId);
    req.session = { jwt: userJwt };
    res.status(HTTP_STATUS.CREATED).json({ message: 'User created successfully', user: authData, token: userJwt });
  }

  private signToken(data: IAuthDocument, objectId: ObjectId): string {
    return sign(
      {
        userId:objectId,
        email: data.email,
        username: data.username,
      },
      config.JWT_TOKEN!
    );
  }
}
