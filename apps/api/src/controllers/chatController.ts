import { Request, Response } from "express";
import { ChatService } from "../services/chatService.js";

export async function handleChatMessage(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_MESSAGE",
          message: "A non-empty text message is required.",
        },
      });
      return;
    }

    const response = await ChatService.processMessage(
      message,
      Array.isArray(history) ? history : [],
    );

    res.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("[ChatController] Error processing chat query:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "CHAT_PROCESSING_ERROR",
        message:
          "An error occurred while processing your query against canonical MPLADS data.",
        details: error?.message,
      },
    });
  }
}
