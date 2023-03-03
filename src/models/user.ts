import mongoose, { Document, Model, Schema } from 'mongoose';
import { User, UserDocument } from '../types/modelData'


// Mongoose schema for user documents
const userSchema = new Schema<UserDocument>({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    verify: {type:Boolean, required:true}
});

export class UserModel {
    private model: Model<UserDocument>;

    constructor() {
        // Create a new Mongoose model for user documents
        this.model = mongoose.model<UserDocument>('User', userSchema);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        // Find a user document by email using the Mongoose model
        const user = await this.model.findOne({ email }).lean<UserDocument>().exec();
        return user ? { ...user } : null;
    }
    
    
    async getUserByPhone(phone: string): Promise<User | null> {
        // Find a user document by email using the Mongoose model
        const user = await this.model.findOne({ phone }).lean<UserDocument>().exec();
        return user ? { ...user } : null;
    }

    async createUser(user: User) {
        // Create a new user document using the Mongoose model
        const newUser = new this.model(user);
        return await newUser.save();
    }
}

// Example usage:
// async function main() {
//     // Connect to a MongoDB database using Mongoose
//     await mongoose.connect('mongodb://localhost/test');

//     const userModel = new UserModel();

//     // Create a new user
//     const newUser: User = {
//         name: 'John Doe',
//         email: 'john.doe@example.com',
//         password: 'password123',
//     };
//     await userModel.createUser(newUser);

//     // Get an existing user by email
//     const user = await userModel.getUserByEmail('john.doe@example.com');
//     console.log(user);

//     // Disconnect from the database
//     await mongoose.disconnect();
// }

// main();
