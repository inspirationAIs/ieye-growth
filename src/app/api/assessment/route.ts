import { NextRequest, NextResponse } from 'next/server';
import { saveAssessment, getAssessmentHistory } from '@/lib/google-sheets';
import { scoreAssessment } from '@/lib/kdst-scoring';
import { getPeriodForAge } from '@/data/kdst';
import { calculateAgeMonths } from '@/lib/age-calculator';
import { calculateGrowthPercentiles } from '@/data/growth';
import type { QuestionResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');

    if (!childId) {
      return NextResponse.json({ error: 'Child ID required' }, { status: 400 });
    }

    const history = await getAssessmentHistory(childId);
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching assessment history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childId, birthdate, gender, height, weight, responses } = body as {
      childId: string;
      birthdate: string;
      gender?: 'male' | 'female';
      height?: number;
      weight?: number;
      responses: QuestionResponse[];
    };

    if (!childId || !birthdate || !responses) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ageMonths = calculateAgeMonths(birthdate);
    const period = getPeriodForAge(ageMonths);

    if (!period) {
      return NextResponse.json({ error: 'No KDST period found for age' }, { status: 400 });
    }

    const result = scoreAssessment(responses, period, childId, ageMonths);
    
    // Add physical growth percentiles if provided
    if (height && weight && gender) {
      const { heightPercentile, weightPercentile } = calculateGrowthPercentiles(ageMonths, gender, height, weight);
      result.height = height;
      result.weight = weight;
      result.heightPercentile = heightPercentile;
      result.weightPercentile = weightPercentile;
    }

    await saveAssessment(result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving assessment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
