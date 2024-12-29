"use server";

import { assertQueueAndBindToExchange } from "../api/rabbitmq";

export async function setupUserQueue(username: string) {
  try {
    const result = await assertQueueAndBindToExchange(username);
    return result;
  } catch (error) {
    console.error("Error in setupUserQueue:", error);
    return { success: false, message: "Failed to set up user queue" };
  }
}
