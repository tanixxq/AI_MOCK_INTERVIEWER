import express from "express";
import {User} from "../Models/User.js";
import bcrypt from "bcrypt";

export const register = async (req,res)=>{
    const {name,email,password,avatar}=req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({
            name,
            email,
            password:hashedPassword,
            avatar
        });
        await user.save();

        res.status(201).json({
            message:"User registered successfully"
        });
    }catch(error){
        res.status(500).json({
            message:"Error registering user"
        });
    }
}

export const getUser = async (req,res)=>{
    const user = await User.findById(req.params.id).select("-password");
    if(!user){
        res.status(404).json({message:"User not found"});
    }else{
        res.status(200).json(user);
    }
}