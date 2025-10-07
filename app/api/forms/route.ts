import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Form from '@/models/Form';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, template, fields } = await req.json();

    if (!title || !fields || fields.length === 0) {
      return NextResponse.json(
        { error: 'Title and fields are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const form = await Form.create({
      userId: session.user.id,
      title,
      template: template || 'minimal',
      fields,
    });

    return NextResponse.json(
      { form: { id: form._id, title: form.title } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
      .sort({ createdAt: -1 });

    return NextResponse.json({ forms });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

