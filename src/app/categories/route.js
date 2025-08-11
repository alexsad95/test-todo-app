import { NextResponse } from 'next/server';
import db from '@/lib/models';

export async function GET() {
  const categories = await db.Category.findAll({ order: [['name', 'ASC']] });
  return NextResponse.json(categories);
}


