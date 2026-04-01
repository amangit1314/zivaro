import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import cors, { runMiddleware } from '@/lib/cors';
import { generateUid } from "@/helpers/id_helper";

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
    await runMiddleware(req, NextResponse, cors);
    return new NextResponse('OK', { status: 200 });
}

export const dynamic = 'force-dynamic';

const isPasswordValid = (password: string) => {
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
};

export const POST = async (req: NextRequest) => {
    const reqBody = await req.json();
    const { email, password, name, role } = reqBody;

    try {
        if (!email || !password) {
            console.log('Email: ', email);
            console.log('Password: ', password);
            console.log("All fields are mandatory 👮‍♂️ ... ");

            return NextResponse.json({
                status: false,
                message: "All fields are mandatory 👮‍♂️ ... ",
            }, { status: 400 });
        }

        if (!isPasswordValid(password)) {
            return NextResponse.json({
                status: false,
                message: "Password must be at least 8 characters long with at least 1 number, 1 special character, 1 uppercase letter, and 1 lowercase letter.",
            }, { status: 400 });
        }

        const uuid4 = generateUid();
        console.log("Generated uid: ", uuid4);

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password: ", hashedPassword);

        const isUserAlreadyRegistered = await db.user.findFirst({
            where: { email: email as string },
        });

        if (isUserAlreadyRegistered) {
            return NextResponse.json({
                status: false,
                message: "An account with this email already exists",
            }, { status: 403 });
        }

        const referralCode = `ZIV${uuid4.slice(0, 8).toUpperCase()}`;

        const createdUser = await db.user.create({
            data: {
                id: uuid4,
                email,
                password: hashedPassword,
                name: name || null,
                role: role === "SELLER" ? "SELLER" : "BUYER",
                referralCode,
            },
        });

        return NextResponse.json({
            status: true,
            data: {
                id: createdUser.id,
            },
            message: "Registration Successful 🎉",
        }, { status: 200 });
    } catch (error) {
        console.log('Registeration ERROR: ', error);
        return NextResponse.json({
            status: false,
            error: error,
            message: "Internal server error occurred ⚠👮‍♂️..",
        }, { status: 500 });
    }
};