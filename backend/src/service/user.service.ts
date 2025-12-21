import UserModel, { IUser } from '../models/user.model';

const createUser =(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<IUser> => {
    return UserModel.create(userData);
  }

const getUserByEmail = (email: string): Promise<IUser | null> => {
    return  UserModel.findOne({ email }).select('+password');
  }

const UserService =   { 
    getUserByEmail,
    createUser
}

export default UserService;
