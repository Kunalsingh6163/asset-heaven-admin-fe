import { NextResponse } from 'next/server';

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    role: 'investor',
    status: 'active',
    phoneNumber: '+91 98765 43210',
    dateJoined: '2024-01-15T10:30:00Z',
    investmentCount: 5,
    totalInvestment: 250000,
    verified: true,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    role: 'investor',
    status: 'active',
    phoneNumber: '+91 98765 43211',
    dateJoined: '2024-02-20T14:15:00Z',
    investmentCount: 3,
    totalInvestment: 150000,
    verified: true,
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    role: 'investor',
    status: 'inactive',
    phoneNumber: '+91 98765 43212',
    dateJoined: '2024-03-10T09:00:00Z',
    investmentCount: 1,
    totalInvestment: 50000,
    verified: false,
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    email: 'sneha.gupta@example.com',
    role: 'investor',
    status: 'active',
    phoneNumber: '+91 98765 43213',
    dateJoined: '2024-01-25T11:45:00Z',
    investmentCount: 8,
    totalInvestment: 500000,
    verified: true,
  },
  {
    id: '5',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    role: 'investor',
    status: 'active',
    phoneNumber: '+91 98765 43214',
    dateJoined: '2024-02-05T16:20:00Z',
    investmentCount: 4,
    totalInvestment: 300000,
    verified: true,
  },
  {
    id: '6',
    name: 'Anita Reddy',
    email: 'anita.reddy@example.com',
    role: 'investor',
    status: 'pending',
    phoneNumber: '+91 98765 43215',
    dateJoined: '2024-03-15T08:30:00Z',
    investmentCount: 0,
    totalInvestment: 0,
    verified: false,
  },
  {
    id: '7',
    name: 'Karthik Menon',
    email: 'karthik.menon@example.com',
    role: 'investor',
    status: 'active',
    phoneNumber: '+91 98765 43216',
    dateJoined: '2024-01-08T12:00:00Z',
    investmentCount: 6,
    totalInvestment: 400000,
    verified: true,
  },
  {
    id: '8',
    name: 'Deepika Rao',
    email: 'deepika.rao@example.com',
    role: 'investor',
    status: 'active',
    phoneNumber: '+91 98765 43217',
    dateJoined: '2024-02-18T15:30:00Z',
    investmentCount: 2,
    totalInvestment: 100000,
    verified: true,
  },
];

export async function GET() {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json(mockUsers, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create new user with mock ID
    const newUser = {
      id: String(mockUsers.length + 1),
      ...body,
      dateJoined: new Date().toISOString(),
      investmentCount: 0,
      totalInvestment: 0,
    };

    mockUsers.push(newUser);

    return NextResponse.json(newUser, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
