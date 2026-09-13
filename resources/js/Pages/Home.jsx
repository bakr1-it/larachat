
import ChatLayout from '@/Layouts/ChatLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

 function Home() {
    return (
<>
            <Head title="Dashboard" />
Message
</>

    );
}
Home.layout = (page) => (
  <AuthenticatedLayout>
    <ChatLayout>
      {page}
    </ChatLayout>
  </AuthenticatedLayout>
);
export default Home
