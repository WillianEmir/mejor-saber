import { Button } from "@/src/components/ui/Button"
import { MoveLeft } from "lucide-react"
import Link from "next/link"

interface EjeTematicoHeaderProps {
  url: string;
  texto: string;
  title: string;
}

export default function EjeTematicoHeader({url, texto, title}: EjeTematicoHeaderProps) {
  return (
    <>
      <div>
        <Link href={url}>
          <Button variant="outline">
            <MoveLeft className="mr-2 h-4 w-4" />
            {texto}
          </Button>
        </Link>
      </div>

      <h1 className="my-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
        {title}
      </h1>
    </>
  )
}
