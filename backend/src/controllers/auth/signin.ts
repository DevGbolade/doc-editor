import { Request, Response } from 'express';
import { config } from '@root/config';
import JWT from 'jsonwebtoken';
import { loginSchema } from '@root/schemes/signin';
import { joiValidation } from '@root/shared/globals/decorators/joi-validation.decorators'
import { IAuthDocument } from '@root/interfaces/auth.interface';
import { BadRequestError } from '@root/shared/globals/helpers/error-handler';
import { authService } from '@root/shared/services/db/auth.service';
import HTTP_STATUS from 'http-status-codes';

export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch: boolean = await existingUser.comparePassword(password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }
  
    const body = {
      userId: existingUser._id,
      email: existingUser.email,
      username: existingUser.username,
    }
    const token: string = JWT.sign(
      body,
      config.JWT_TOKEN!
    );
    req.session = { jwt: token };
    // console.log('COOKIES',req.session)
    res.status(HTTP_STATUS.OK).json({ message: 'User login successfully', user: body, token });
  }
}
