import express from "express";
import {User} from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register=async(req,res)=>{
    const {name,email,password,avatar}=req.body;

    try{

        const existingUser=await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const user=new User({
            name,
            email,
            password:hashedPassword,
            avatar
        });

        await user.save();

        const token=jwt.sign(
            {
                id:user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );

        res.status(201).json({
            message:"User registered successfully",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        });

    }catch(error){

        console.log("Registration Error:",error);

        res.status(500).json({
            message:"Error registering user"
        });

    }
};

export const getUser = async (req,res)=>{
    const user = await User.findById(req.params.id).select("-password");
    if(!user){
        res.status(404).json({message:"User not found"});
    }else{
        res.status(200).json(user);
    }
}

export const login = async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );
        if(!isPasswordCorrect){
            return res.status(401).json({
                message:"Incorrect password"
            });
        }
        const token = jwt.sign(
            {
                id:user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );
        res.status(200).json({
            message:"Login successful",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        });
    }catch(error){
        res.status(500).json({
            message:"Login failed",
            error:error.message
        });
    }
}

export const getCurrentUser=async(req,res)=>{
    try{

        const user=await User.findById(req.user.id)
            .select("-password");

        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }

        res.status(200).json({
            user
        });

    }catch(error){

        res.status(500).json({
            message:"Server error",
            error:error.message
        });

    }
};