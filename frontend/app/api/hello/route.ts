import { getDbConnection } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const req = request;
    console.log(req);
    const conn = await getDbConnection();
    const value = 1;
    const result = await conn.query`SELECT * FROM mytable WHERE id = ${value}`;
    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}
