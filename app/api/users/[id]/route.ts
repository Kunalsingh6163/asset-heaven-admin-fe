import { NextResponse } from 'next/server';

// Mock user data (should match the data in ../route.ts)
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
    address: '123 MG Road, Bangalore, Karnataka',
    panNumber: 'ABCDE1234F',
    kycStatus: 'completed',
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
    address: '456 Park Street, Mumbai, Maharashtra',
    panNumber: 'FGHIJ5678K',
    kycStatus: 'completed',
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
    address: '789 Ring Road, Ahmedabad, Gujarat',
    panNumber: 'LMNOP9012Q',
    kycStatus: 'pending',
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
    address: '321 Nehru Place, New Delhi, Delhi',
    panNumber: 'RSTUV3456W',
    kycStatus: 'completed',
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
    address: '654 Mall Road, Chandigarh, Punjab',
    panNumber: 'XYZAB7890C',
    kycStatus: 'completed',
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
    address: '987 Jubilee Hills, Hyderabad, Telangana',
    panNumber: 'DEFGH1234I',
    kycStatus: 'pending',
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
    address: '147 Marine Drive, Kochi, Kerala',
    panNumber: 'JKLMN5678O',
    kycStatus: 'completed',
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
    address: '258 Brigade Road, Bangalore, Karnataka',
    panNumber: 'PQRST9012U',
    kycStatus: 'completed',
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const user = mockUsers.find(u => u.id === id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/users/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const userIndex = mockUsers.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...body,
    };

    return NextResponse.json(mockUsers[userIndex], {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in PUT /api/users/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const userIndex = mockUsers.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove user
    mockUsers.splice(userIndex, 1);

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/users/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
