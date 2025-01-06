import { NextResponse } from "next/server";
import { verifyAccessToken } from "./jwtToken";
import { AUTH } from "@/constants/apiConstant";
import { Middleware } from "@/app/middleware/handler";

export const authChecker: Middleware = async (_req, next) => {
    const authorizationHeader = _req.headers.get('Authorization');
    const accessToken = authorizationHeader?.startsWith('Bearer ') ? authorizationHeader.split(' ')[1]
        : null;
    if (accessToken) {
        try {
            const isValid = verifyAccessToken(accessToken);
            if (isValid) {
                next();
            }else{
                throw Error("Invalid token");
            }
        } catch (error) {
            return NextResponse.json(
                { error: "Invalid token received. ", message: error },
                { status: 401 }
            );
        }
    }
    else {
        return NextResponse.json(
            { error: "No token found.", message: "Please provide a valid token",errerrorType: AUTH.accessTokenNA },
            { status: 400 }
        );
    }
}
