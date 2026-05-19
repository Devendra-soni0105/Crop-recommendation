import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    // Get the last message from the user
    const lastMessage = messages[messages.length - 1];
    
    if (!lastMessage || lastMessage.role !== "user") {
      return Response.json({ error: "No user message found" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ 
        error: "Configuration Error", 
        details: "GEMINI_API_KEY is not defined in environment variables." 
      }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    let systemInstruction = "You are KrishiSmart AI, a personal agricultural assistant. You help farmers with crop diseases, soil health, best farming practices, and general agricultural advice. Keep your answers concise, practical, and helpful. Use a friendly and supportive tone. Format your answers using Markdown (bold, lists, etc.) for better readability.";

    try {
      const session = await getServerSession(authOptions);
      if (session && session.user) {
        await connectToDatabase();
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          let profileInfo = "\n\nUser Profile Context:\n";
          if (user.location) profileInfo += `- Location: ${user.location}\n`;
          if (user.farmSize) profileInfo += `- Farm Size: ${user.farmSize} acres\n`;
          if (user.soilDetails) {
            profileInfo += `- Soil Details: Nitrogen(N): ${user.soilDetails.nitrogen || 'Unknown'}, Phosphorous(P): ${user.soilDetails.phosphorous || 'Unknown'}, Potassium(K): ${user.soilDetails.potassium || 'Unknown'}, pH: ${user.soilDetails.ph || 'Unknown'}\n`;
          }
          profileInfo += "Use this information to provide highly accurate, personalized, and context-aware advice to the user.";
          systemInstruction += profileInfo;
        }
      }
    } catch (err) {
      console.error("Error fetching user profile for chat context:", err);
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: systemInstruction,
    });

    // Prepare history
    // Gemini history must start with a 'user' role. 
    // We skip the initial assistant greeting and any other messages until we find the first user message.
    const history = [];
    let foundFirstUser = false;

    for (const msg of messages.slice(0, -1)) {
      if (msg.role === "user") foundFirstUser = true;
      if (foundFirstUser) {
        history.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }
    }

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(
      lastMessage.image 
        ? [
            { text: lastMessage.content },
            {
              inlineData: {
                data: lastMessage.image.split(",")[1],
                mimeType: lastMessage.image.split(";")[0].split(":")[1],
              },
            },
          ]
        : lastMessage.content
    );
    
    const response = await result.response;
    const text = response.text();

    return Response.json({ 
      role: "assistant", 
      content: text,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Chat API Error:", error.message);
    return Response.json({ 
      error: "Failed to fetch response from AI", 
      details: error.message 
    }, { status: 500 });
  }
}
