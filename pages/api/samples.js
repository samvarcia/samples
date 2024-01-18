import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
  try {
    const samples = await sql`SELECT * FROM mediaitems;`;
    res.status(200).json({ samples });
  } catch (err) {
    res.status(500).json({ error: "failed to load data" });
  }
}
