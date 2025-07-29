import MainHeader from "../_components/MainHeader"
import FreeTokenButton from "./_components/FreeTokenButton"
import PurchaseCard from "./_components/PurchaseCard"
import PurchaseDisclaimer from "./_components/PurchaseDisclaimer"

const purchaseItems = [
  { tokens: 30, price: 3000 },
  { tokens: 50, price: 5000 },
  {
    originalTokens: 100,
    tokens: 105,
    price: 10000,
    bonus: 5,
  },
  {
    originalTokens: 300,
    tokens: 330,
    price: 30000,
    bonus: 10,
  },
  {
    originalTokens: 500,
    tokens: 575,
    price: 50000,
    bonus: 15,
  },
]

export default function StorePage() {
  return (
    <div className="flex w-full h-screen bg-background relative">
      <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hidden">
        <MainHeader />
        <main className="flex-1 w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-12">
              <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                  토큰 상점
                </h1>
                <p className="mt-4 text-lg text-amber-400 font-bold">
                  🎉 신규 서비스 런칭 기념 서비스! 🎉
                </p>
                <p className="mt-2 text-lg text-gray-400">
                  창작의 날개를 달아줄 토큰을 충전하세요!
                </p>
              </div>

              <section>
                <FreeTokenButton />
              </section>

              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {purchaseItems.map(item => (
                    <PurchaseCard key={item.price} {...item} />
                  ))}
                </div>
              </section>

              <section>
                <PurchaseDisclaimer />
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 