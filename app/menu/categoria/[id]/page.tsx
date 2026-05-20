import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import CategoryDashboard from '@/components/menu/CategoryDashboard';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) notFound();

  // Load session to get user role
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  const [drinks, categories] = await Promise.all([
    db.getDrinks(categoryId),
    db.getCategories(),
  ]);

  const currentCategory = categories.find((c) => c.id === categoryId);

  if (!currentCategory) notFound();

  return (
    <CategoryDashboard 
      categories={categories}
      currentCategory={currentCategory}
      drinks={drinks}
      userRole={userRole}
    />
  );
}
