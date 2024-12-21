import { NextResponse } from "next/server";

export async function GET() {
    try{

        const response=NextResponse.json({
            message:"Logout successfull",
            success:true
        });

        // with NextResponse we can set/change cookies
        response.cookies.set("token","",{
            httpOnly:true,expires:new Date(0)
        });

        return response;
    }catch(error:any){
        return NextResponse.json(
            { error: "Internal server error",message:error },
            { status: 500 }
          );
    }
    
}