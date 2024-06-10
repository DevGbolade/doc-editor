import { IAuthDocument } from "@root/interfaces/auth.interface";
import { AuthModel } from "@root/models/auth.schema";
import { Helpers } from "@root/shared/globals/helpers/helpers";


class AuthService {
  public async createAuthUser(data: IAuthDocument): Promise<IAuthDocument> {
   return await AuthModel.create(data);
  }
  public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument> {
    const query = {
      $or: [{ username: Helpers.firstLetterUppercase(username) }, { email: Helpers.lowerCase(email) }]
    };
    const user: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument;
    return user;
  }
  public async getAuthUserByUsername(username: string): Promise<IAuthDocument> {
    const user: IAuthDocument = (await AuthModel.findOne({ username }).exec()) as IAuthDocument;
    return user;
  }

  public async getAuthUserByEmail(email: string): Promise<IAuthDocument> {
    const user: IAuthDocument = (await AuthModel.findOne({ email: Helpers.lowerCase(email) }).exec()) as IAuthDocument;
    return user;
  }

  public async getAllUsers(): Promise<IAuthDocument[]> {
    const users: IAuthDocument[]= await AuthModel.find() as IAuthDocument[];
    return users;
  }


 
}
export const authService: AuthService = new AuthService();
