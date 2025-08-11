import { NextResponse } from 'next/server';
import db from '@/lib/models';
import { TEXTS } from '@/lib/texts';

const HTTP_STATUS = {
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
};

export async function GET() {
  try {
    const categories = await db.Category.findAll({ 
      order: [['name', 'ASC']] 
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error(TEXTS.CONSOLE_ERRORS.ERROR_FETCHING_CATEGORIES, error);
    return NextResponse.json(
      { error: TEXTS.ERRORS.FAILED_TO_FETCH_CATEGORIES }, 
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}


