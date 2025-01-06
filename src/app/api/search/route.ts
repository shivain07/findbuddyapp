import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {

    const reqBody = await request.json();
    const { coordinates, rangeInKm} = reqBody;
    
    const posts = await Post.find({
      geoLocation: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: coordinates, // [longitude, latitude]
          },
          $maxDistance: rangeInKm*1000, // Maximum distance in meters
        },
      },
    }).populate("postedBy",'-password').sort({ createdAt: -1 });

    return NextResponse.json({
        posts:posts
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error",message:error },
      { status: 500 }
    );
  }
}
