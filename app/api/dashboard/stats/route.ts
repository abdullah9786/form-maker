import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Form from '@/models/Form';
import Response from '@/models/Response';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const forms = await Form.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    const formIds = forms.map(form => form._id);

    const responses = await Response.find({ formId: { $in: formIds } });

    const responseCounts = responses.reduce((acc: any, response: any) => {
      const formId = response.formId.toString();
      acc[formId] = (acc[formId] || 0) + 1;
      return acc;
    }, {});

    const recentForms = forms.map(form => ({
      _id: form._id.toString(),
      title: form.title,
      createdAt: form.createdAt,
      responseCount: responseCounts[form._id.toString()] || 0,
    }));

    return NextResponse.json({
      totalForms: forms.length,
      totalResponses: responses.length,
      recentForms,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

