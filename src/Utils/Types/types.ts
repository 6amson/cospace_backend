import { Request } from 'express';
import mongoose from 'mongoose';

export interface RequestWithUser extends Request {
  user: {
    email: string;
    password: string;
    id: mongoose.Types.ObjectId;
  };
}
