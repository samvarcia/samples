import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  const method = req.method;
  const { name, description, type, link, thumbnail } = req.body;
  console.log(req.body);

  try {
    const samples =
      await sql`INSERT INTO mediaitems ( name, description, type, link, thumbnail) VALUES (${name}, ${description}, ${type}, ${link}, ${thumbnail});`;

    res.status(200).json(samples);
  } catch (error) {
    console.error(error);
  }
}
