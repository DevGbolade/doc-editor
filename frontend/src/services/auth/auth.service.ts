/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "../axios";

class AuthService {
  async signUp(body: any) {
    const response = await axios.post("/signup", body);
    return response;
  }

  async signIn(body: any) {
    const response = await axios.post("/signin", body);
    return response;
  }

  async getAllUsers() {
    const response = await axios.get('/users');
    return response;
  }

  async logout() {
    const response = await axios.get('/signout');
    return response;
  }
}

export const authService = new AuthService();
