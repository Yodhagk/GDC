import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      customerId: string;
      role: 'client' | 'admin' | 'it_support';
    };
  }

  interface User {
    customerId: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    customerId: string;
    role: string;
  }
}
