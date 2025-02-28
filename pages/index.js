import Calculator from "@/components/Calculator";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br to-black text-black p-6">
      <div className="flex flex-col items-center justify-center">
        <Calculator />
      </div>
    </div>
  );
}
