"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = dbConnect;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const connection = {};
async function dbConnect() {
    const connectionString = process.env.MONGOURL;
    try {
        const db = await mongoose_1.default.connect(connectionString || "");
        connection.isConnected = db.connections[0].readyState;
        console.log("Db connected");
    }
    catch (error) {
        console.log("Error occured while connecting db ", error.message);
        process.exit(1);
    }
}
