import UserModel, { IUser } from '../models/user.model';

const createUser = (userData: {
  name: string;
  email: string;
  password: string;
}): Promise<IUser> => {
  return UserModel.create(userData);
}

const getUserByEmail = (email: string): Promise<IUser | null> => {
  return UserModel.findOne({ email }).select('+password');
}

const getUserById = (id: string): Promise<IUser | null> => {
  return UserModel.findById(id);
}

const getUsersByEmails = (emails: string[]): Promise<IUser[]> => {
  return UserModel.find({ email: { $in: emails } });
}

const UserService = {
  getUserByEmail,
  createUser,
  getUserById,
  getUsersByEmails
}

export default UserService;
