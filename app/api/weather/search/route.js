import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey || !query) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(`http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([]);
  }
}
