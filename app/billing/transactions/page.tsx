import { PageLayout } from "@/components/page-layout"

export default function TransactionsPage() {
  return (
    <PageLayout title="Transactions" description="View your billing transactions">
      <div className="flex items-center justify-center h-[400px] border rounded-lg">
              <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Transactions</h3>
        <p className="text-muted-foreground">This is a placeholder for the Transactions content</p>
        </div>
      </div>
    </PageLayout>
  )
}
