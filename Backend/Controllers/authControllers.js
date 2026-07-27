import express from "express";
import {User} from "../Models/User.js";
import bcrypt from "bcrypt";

export const register = async (req,res)=>{
    const {name,email,password,avatar} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({email});
    if(existingUser){
        res.status(400).json({message:"User already exists"});
        return;
    }

    try{
        const user = new User({name,email,password:hashedPassword,avatar});
        await user.save();
        res.status(201).json({message:"User registered successfully"});
    } catch(error){
        res.status(500).json({message:"Error registering user"});
    }
}